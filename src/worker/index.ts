import { Hono } from 'hono';
import { getCookie, setCookie } from 'hono/cookie';
import { drizzle, type DrizzleD1Database } from 'drizzle-orm/d1';
import { and, asc, desc, eq, gt, lt, sql } from 'drizzle-orm';
import * as t from '../db/schema';
import { verifyCode, signSessionId, verifySessionCookie, hashIp } from './crypto';
import { gradeSubmission, type RubricPayload } from './grading';
import { adminApp } from './admin';
import { buildTutorSystem, streamTutorReply, KICKOFF_TURN, type LearnerContext as TutorLearnerContext, type TutorMessage } from './chat';
import { transcribe, speakable, renderSpeech, TUTOR_VOICE } from './voice';
import { extractPaths } from '../shared/chat';
import { GOAL_CHOICES, goalLabel } from '../shared/goals';
import { DEPTH_IDS, depthOf } from '../shared/depth';
import { SELF_LEVEL_IDS } from '../shared/levels';
import { chunkPlan } from '../shared/audioChunks';
import {
  writeScript,
  writeStudy,
  writeStock,
  writeStockIntro,
  writePersonalIntro,
  writeCustomBody,
  renderAudio,
  renderChunkAudio,
  estMinutes,
  PODCAST_PROMPT_VERSION,
  VOICE_A,
  VOICE_B,
  type AiBinding,
  type HeardEpisode,
  type LearnerContext,
  type TtsEngine,
} from './podcast';
import diagnosticData from '../../content/diagnostic.json';
import type {
  CourseCard,
  Brand,
  ContentBlock,
  IntakePrefs,
  PlanResponse,
  PlanStep,
  DiagnosticFeedback,
  DiagnosticItemPublic,
  DiagnosticResult,
  PodcastEpisode,
  PodcastLength,
  PodcastLine,
  PodcastListResponse,
  PodcastOutlinePoint,
  PodcastSummary,
  PodcastVisual,
  GradeResult,
  MeResponse,
  ModuleCard,
  ModuleContentResponse,
  PriorStage,
  TrailPoint,
  CalibrationTrail,
  PathModule,
  SortingReveal,
} from '../shared/types';

export interface Env {
  DB: D1Database;
  ASSETS: Fetcher;
  BRAND_SLUG: string;
  // Which AI tool stack this org provisions ('claude' | 'chatgpt'). Drives
  // which variant of the [V] lab lessons is served — one tooling per deploy,
  // same pattern as BRAND_SLUG. Unset = 'claude'.
  ORG_TOOLING?: string;
  GRADING_MODEL: string;
  CHAT_MODEL: string;
  PODCAST_MODEL?: string;
  // Optional override for the study-companion call (takeaways + visual) —
  // set a stronger model here to experiment without touching script quality.
  STUDY_MODEL?: string;
  // Optional Gemini TTS engine: set the secret to voice episodes with Gemini's
  // native multi-speaker model instead of Aura (which remains the fallback).
  GEMINI_API_KEY?: string;
  GEMINI_TTS_MODEL?: string;
  // Episode scripts per session per hour; default 4. Raise for demo/testing.
  PODCAST_LIMIT_PER_HOUR?: string;
  SESSION_SECRET?: string;
  ANTHROPIC_API_KEY?: string;
  ADMIN_PASSCODE?: string;
  // Optional bindings — a deployment without them loses podcast audio, not the app.
  AI?: AiBinding;
  PODCAST_AUDIO?: R2Bucket;
}

type SessionRow = typeof t.fdSession.$inferSelect;
type Ctx = { Bindings: Env; Variables: { session: SessionRow | null; db: DrizzleD1Database } };

const COOKIE_NAME = 'fd_session';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days
const CODE_ATTEMPT_LIMIT = 10;
const CODE_ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
const GRADE_LIMIT_PER_HOUR = 5;
const MIN_SUBMISSION_CHARS = 700;
const CHAT_LIMIT_PER_HOUR = 30; // assistant replies per session per hour
const MAX_CHAT_CHARS = 2000;
const CHAT_HISTORY_TURNS = 40; // most recent turns sent to the model
const TRANSCRIBE_LIMIT_PER_HOUR = 60;
const MAX_AUDIO_BYTES = 8 * 1024 * 1024; // ~2 min hard cap client-side; belt here

// Only these may be posted from the client; everything else is written server-side.
const CLIENT_EVENT_TYPES = new Set([
  'landed',
  'intake_started',
  'difference_opened',
  'diagnostic_started',
  'module_opened',
  'block_read',
  'try_this_opened',
  'module_completed',
  'podcast_played',
  'podcast_first_audio',
]);

const now = () => new Date().toISOString();
const uuid = () => crypto.randomUUID();
const secret = (env: Env) => env.SESSION_SECRET ?? 'dev-only-secret-set-SESSION_SECRET-in-production';

const app = new Hono<Ctx>();

async function logEvent(db: DrizzleD1Database, sessionId: string | null, type: string, payload?: unknown) {
  await db.insert(t.fdEvent).values({
    id: uuid(),
    sessionId,
    type,
    payloadJson: payload === undefined ? null : JSON.stringify(payload),
    createdAt: now(),
  });
}

app.use('/api/*', async (c, next) => {
  const db = drizzle(c.env.DB);
  c.set('db', db);
  const sessionId = await verifySessionCookie(getCookie(c, COOKIE_NAME), secret(c.env));
  let session: SessionRow | null = null;
  if (sessionId) {
    const rows = await db.select().from(t.fdSession).where(eq(t.fdSession.id, sessionId)).limit(1);
    session = rows[0] ?? null;
    if (session) await db.update(t.fdSession).set({ lastSeenAt: now() }).where(eq(t.fdSession.id, session.id));
  }
  c.set('session', session);
  await next();
});

const requireSession = (c: { get: (k: 'session') => SessionRow | null }): SessionRow | null => c.get('session');

// ---------- brand ----------

app.get('/api/brand', async (c) => {
  const db = c.get('db');
  const rows = await db.select().from(t.fdBrand).where(eq(t.fdBrand.slug, c.env.BRAND_SLUG)).limit(1);
  const row = rows[0];
  if (!row) return c.json({ error: 'No brand seeded for this deployment. Run the seed migration.' }, 500);
  const profile = row.profileJson ? JSON.parse(row.profileJson) : null;
  const brand: Brand = {
    slug: row.slug,
    name: row.name,
    tokens: JSON.parse(row.tokensJson),
    voice: JSON.parse(row.voiceJson),
    ...(Array.isArray(profile?.aiTools) && profile.aiTools.length ? { aiTools: profile.aiTools } : {}),
  };
  return c.json(brand);
});

// ---------- events ----------

app.post('/api/event', async (c) => {
  const db = c.get('db');
  const session = c.get('session');
  const body = await c.req.json<{ type?: string; payload?: unknown }>().catch(() => null);
  if (!body?.type || !CLIENT_EVENT_TYPES.has(body.type)) return c.json({ error: 'Unknown event type.' }, 400);
  const payload = body.payload === undefined ? undefined : body.payload;
  if (payload !== undefined && JSON.stringify(payload).length > 4096) return c.json({ error: 'Payload too large.' }, 400);
  await logEvent(db, session?.id ?? null, body.type, payload);
  // Completing a module is the moment to get the next one's episode waiting
  // for podcast-first learners; runs after the response, never blocks it.
  if (body.type === 'module_completed' && session) {
    c.executionCtx.waitUntil(pregenerateNextPodcast(c.env, session.id));
  }
  return c.json({ ok: true });
});

// ---------- access ----------

app.post('/api/enter', async (c) => {
  const db = c.get('db');
  const body = await c.req.json<{ code?: string }>().catch(() => null);
  const code = body?.code?.trim();
  if (!code) return c.json({ error: 'Enter the passcode you were given.' }, 400);

  const ip = c.req.header('cf-connecting-ip') ?? c.req.header('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local';
  const ipHashed = await hashIp(ip, secret(c.env));

  const windowStart = new Date(Date.now() - CODE_ATTEMPT_WINDOW_MS).toISOString();
  const attempts = await db
    .select({ n: sql<number>`count(*)` })
    .from(t.fdEvent)
    .where(
      and(
        eq(t.fdEvent.type, 'code_attempt_failed'),
        gt(t.fdEvent.createdAt, windowStart),
        sql`json_extract(${t.fdEvent.payloadJson}, '$.ipHash') = ${ipHashed}`,
      ),
    );
  if ((attempts[0]?.n ?? 0) >= CODE_ATTEMPT_LIMIT) {
    return c.json({ error: 'Too many attempts from this connection. Wait 15 minutes, then try again — or check the code with whoever sent it.' }, 429);
  }

  const codes = await db
    .select()
    .from(t.fdAccessCode)
    .where(and(eq(t.fdAccessCode.brandSlug, c.env.BRAND_SLUG), eq(t.fdAccessCode.active, 1)));

  let matched: typeof codes[number] | null = null;
  for (const candidate of codes) {
    if (await verifyCode(code, candidate.codeHash)) {
      matched = candidate;
      break;
    }
  }

  const usable =
    matched !== null &&
    (matched.expiresAt === null || matched.expiresAt > now()) &&
    (matched.maxUses === null || matched.uses < matched.maxUses);

  if (!matched || !usable) {
    await logEvent(db, null, 'code_attempt_failed', { ipHash: ipHashed });
    return c.json({ error: "That code didn't match. Check for typos — codes aren't case sensitive about your feelings, just the characters." }, 401);
  }

  await db.update(t.fdAccessCode).set({ uses: matched.uses + 1 }).where(eq(t.fdAccessCode.id, matched.id));

  const sessionId = uuid();
  await db.insert(t.fdSession).values({
    id: sessionId,
    codeId: matched.id,
    brandSlug: matched.brandSlug,
    createdAt: now(),
    lastSeenAt: now(),
    userAgent: c.req.header('user-agent') ?? null,
    ipHash: ipHashed,
  });
  await logEvent(db, sessionId, 'code_entered', { codeLabel: matched.label });

  setCookie(c, COOKIE_NAME, await signSessionId(sessionId, secret(c.env)), {
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
    path: '/',
    maxAge: COOKIE_MAX_AGE,
  });
  return c.json({ ok: true });
});

app.post('/api/hello', async (c) => {
  const db = c.get('db');
  const session = requireSession(c);
  if (!session) return c.json({ error: 'No session. Enter your passcode first.' }, 401);
  const body = await c.req.json<{ displayName?: string; roleLabel?: string }>().catch(() => ({}) as { displayName?: string; roleLabel?: string });
  await db.insert(t.fdParticipant).values({
    id: uuid(),
    sessionId: session.id,
    displayName: body.displayName?.trim().slice(0, 80) || null,
    roleLabel: body.roleLabel?.trim().slice(0, 120) || null,
    orgLabel: null,
    createdAt: now(),
  });
  return c.json({ ok: true });
});

// 'voice' is no longer offered at intake but stays valid for stored prefs.
const VALID_STYLES = new Set(['reading', 'interactive', 'podcast', 'assistant_mcp', 'voice', 'quiz_first']);
const VALID_GOALS = new Set(GOAL_CHOICES.map((g) => g.id));
const VALID_AI_TOOLS = new Set(['claude', 'chatgpt', 'gemini', 'other']);


async function loadPrefs(db: DrizzleD1Database, sessionId: string): Promise<IntakePrefs> {
  const rows = await db
    .select()
    .from(t.fdPreference)
    .where(eq(t.fdPreference.sessionId, sessionId))
    .orderBy(asc(t.fdPreference.createdAt));
  const prefs: IntakePrefs = {};
  for (const row of rows) {
    const value = JSON.parse(row.valueJson);
    if (row.key === 'start') prefs.start = value;
    else if (row.key === 'depth') prefs.depth = value;
    else if (row.key === 'styles') prefs.styles = value;
    else if (row.key === 'goals') prefs.goals = value;
    else if (row.key === 'objective') prefs.objective = value;
    else if (row.key === 'aiUsage') prefs.aiUsage = value;
    else if (row.key === 'aiTools') prefs.aiTools = value;
    else if (row.key === 'aiToolOther') prefs.aiToolOther = value;
    else if (row.key === 'selfLevel') prefs.selfLevel = value;
  }
  return prefs;
}

app.post('/api/intake', async (c) => {
  const db = c.get('db');
  const session = requireSession(c);
  if (!session) return c.json({ error: 'No session. Enter your passcode first.' }, 401);
  const body = await c.req
    .json<{ displayName?: string; roleLabel?: string; prefs?: IntakePrefs }>()
    .catch(() => null);
  if (!body) return c.json({ error: 'Malformed request.' }, 400);

  if (body.displayName?.trim() || body.roleLabel?.trim()) {
    await db.insert(t.fdParticipant).values({
      id: uuid(),
      sessionId: session.id,
      displayName: body.displayName?.trim().slice(0, 80) || null,
      roleLabel: body.roleLabel?.trim().slice(0, 120) || null,
      orgLabel: null,
      createdAt: now(),
    });
  }

  const raw = body.prefs ?? {};
  const clean: [string, unknown][] = [];
  if (raw.start === 'diagnostic' || raw.start === 'module' || raw.start === 'chat') clean.push(['start', raw.start]);
  if (typeof raw.depth === 'string' && (DEPTH_IDS as string[]).includes(raw.depth)) clean.push(['depth', raw.depth]);
  if (Array.isArray(raw.styles)) clean.push(['styles', raw.styles.filter((s) => VALID_STYLES.has(s)).slice(0, 5)]);
  if (Array.isArray(raw.goals)) clean.push(['goals', raw.goals.filter((g) => VALID_GOALS.has(g)).slice(0, 8)]);
  if (typeof raw.objective === 'string') clean.push(['objective', raw.objective.trim().slice(0, 280)]);
  if (typeof raw.aiUsage === 'string') clean.push(['aiUsage', raw.aiUsage.trim().slice(0, 280)]);
  if (Array.isArray(raw.aiTools)) clean.push(['aiTools', raw.aiTools.filter((t) => VALID_AI_TOOLS.has(t)).slice(0, 4)]);
  if (typeof raw.aiToolOther === 'string') clean.push(['aiToolOther', raw.aiToolOther.trim().slice(0, 120)]);
  if (typeof raw.selfLevel === 'string' && SELF_LEVEL_IDS.includes(raw.selfLevel)) clean.push(['selfLevel', raw.selfLevel]);

  for (const [key, value] of clean) {
    await db.delete(t.fdPreference).where(and(eq(t.fdPreference.sessionId, session.id), eq(t.fdPreference.key, key)));
    await db.insert(t.fdPreference).values({ id: uuid(), sessionId: session.id, key, valueJson: JSON.stringify(value), createdAt: now() });
  }
  await logEvent(db, session.id, 'intake_completed', Object.fromEntries(clean));
  // A podcast-first learner should find their first episode already waiting.
  c.executionCtx.waitUntil(pregenerateNextPodcast(c.env, session.id));
  return c.json({ ok: true });
});

type Progress = { diagnosticDone: boolean; sortDone: boolean; activityGraded: boolean; moduleCompleted: boolean; chatStarted: boolean };

function composePlan(name: string | null, prefs: IntakePrefs, progress: Progress): PlanResponse {
  const depth = depthOf(prefs.depth);
  const start = prefs.start ?? 'diagnostic';

  const diagnostic: PlanStep = {
    id: 'diagnostic',
    title: start === 'diagnostic' ? 'The diagnostic — find your direction of error' : 'The diagnostic — when you want your read tested',
    detail:
      start === 'diagnostic'
        ? 'Nine questions. Not a score — a direction: whether you expect too much or too little from these tools.'
        : "You chose a different first step. The full diagnostic will be here — nine questions, scored against field data.",
    minutes: 8,
    route: '/diagnostic',
    state: progress.diagnosticDone ? 'done' : 'later',
  };
  const core: PlanStep = {
    id: 'm1-core',
    title: 'Module 1 · Lesson 1 and the sorting exercise',
    detail: 'The best fifteen minutes in the module: what "AI" means in your stack, then fifteen real tasks sorted into hand-over / verify / don\'t.',
    minutes: 12,
    route: '/module/ai101-m1',
    state: progress.sortDone ? 'done' : 'later',
  };
  const read: PlanStep = {
    id: 'm1-read',
    title: 'Module 1 · the rest of the read',
    detail: 'What an LLM actually does, the vocabulary, and why data decides everything.',
    minutes: 10,
    route: '/module/ai101-m1',
    state: progress.moduleCompleted ? 'done' : 'later',
  };
  const activity: PlanStep = {
    id: 'activity',
    title: 'Applied activity — "Testing the Edges", AI-graded',
    detail: 'Three short conversations with your own AI tool, a reflection, and rubric feedback in seconds. Unlimited resubmission.',
    minutes: 25,
    route: '/module/ai101-m1/activity',
    state: progress.activityGraded ? 'done' : 'later',
  };

  const micro: PlanStep = {
    id: 'm1-micro',
    title: 'Module 1 · the two-minute version',
    detail: 'The key concepts and the delegation heuristic, cut for a short sitting. The full module keeps.',
    minutes: 2,
    route: '/module/ai101-m1/micro',
    state: progress.moduleCompleted || progress.sortDone ? 'done' : 'later',
  };

  // The conversational alternative to the diagnostic: the tutor probes their
  // level in chat, then teaches from wherever that lands.
  const sizeUp: PlanStep = {
    id: 'size-up',
    title: 'Size-up conversation — the tutor works out your level',
    detail: 'A few applied questions in chat, one at a time, then an honest read on where you stand and where to go first. Speak or type.',
    minutes: 8,
    route: '/module/ai101-m1/chat',
    state: progress.chatStarted ? 'done' : 'later',
  };

  // Deep-divers get a standing quiz session with the tutor on top of the
  // full loop; it never reads as "done" — mastery is a practice, not a box.
  const quiz: PlanStep = {
    id: 'tutor-quiz',
    title: 'Quiz sessions with the tutor — make it stick',
    detail: 'Scenario questions in chat (or out loud), drawn from the module, until your calibration holds under pressure.',
    minutes: 10,
    route: '/module/ai101-m1/chat',
    state: 'later',
  };

  // Depth decides the shape: essentials leads with the micro dose and keeps
  // the full read + graded activity as optional extras; balanced runs the
  // whole loop; deep runs the whole loop plus tutor quizzing.
  const body =
    depth === 'essentials' ? [micro, core, read, activity] : depth === 'deep' ? [core, read, activity, quiz] : [core, read, activity];
  const steps =
    start === 'chat' ? [sizeUp, ...body, diagnostic] : start === 'module' ? [...body, diagnostic] : [diagnostic, ...body];

  // Once the 101 capstone is graded, the ladder continues into AI 201.
  if (progress.activityGraded) {
    steps.push({
      id: 'ai201-m1',
      title: 'AI 201 · From one-offs to workflows',
      detail: 'The Practitioner course opens: the workflow lens, the audit, the selection rules — and the capstone build that runs through all eight modules.',
      minutes: 30,
      route: '/module/ai201-m1',
      state: 'later',
    });
  }

  for (const step of steps) {
    if (step.state === 'done') continue;
    const optionalExtra = depth === 'essentials' && (step.id === 'm1-read' || step.id === 'activity');
    step.state = optionalExtra ? 'later' : 'now';
  }
  if (!steps.some((s) => s.state === 'now')) {
    const first = steps.find((s) => s.state !== 'done');
    if (first) first.state = 'now';
  }

  const notes: string[] = [];
  const goals = prefs.goals ?? [];
  const GOAL_NOTES: Record<string, string> = {
    workflows: 'Workflow and automation building is the heart of AI 201 — this course builds the judgment underneath it.',
    strategy: 'Setting direction is Modules 7–8 territory here, and all of AI 401 — the path marks both for you.',
    tools: 'Module 2 is built around telling tools apart; Lesson 1 of Module 1 starts that cut today.',
    safety: 'What\'s safe to paste — and under what agreement — is Lesson 4 today and all of Module 8.',
    coach: 'Helping others adopt AI gets its own course (AI 301). This one makes you credible first.',
  };
  for (const goal of goals) {
    if (GOAL_NOTES[goal] && notes.length < 2) notes.push(GOAL_NOTES[goal]);
  }
  const styles = prefs.styles ?? [];
  if (styles.includes('interactive')) notes.push('You chose interactive — Module 1 has a live tutor chat that teaches the same material in conversation. Open it from inside the module.');
  if (styles.includes('podcast')) notes.push('Learning by listening is live — open Module 1 and make a custom two-host podcast episode from any angle you like.');
  if (styles.includes('assistant_mcp')) notes.push('Taking this course embedded right in your AI tools is on the roadmap — your interest is logged.');
  if (styles.includes('voice')) notes.push('Talking instead of typing is live — every text box has a mic, and the tutor chat has a voice mode that reads replies aloud.');
  if (styles.includes('quiz_first')) notes.push('Test-first, as requested: every module leads with its knowledge check — 60%+ finishes it, and misses point you at exactly what to study.');
  if (depth === 'essentials') notes.push('Short and sweet, as requested: micro doses and the sorting exercise lead. The full read and graded activity keep for whenever you want more.');
  else if (depth === 'deep') notes.push('Deep dive: the full loop is on your path, and the tutor is primed to quiz you until it sticks.');

  const done = steps.filter((s) => s.state === 'done').length;
  const greeting =
    done > 0
      ? name
        ? `${name}, picking back up where you left off.`
        : 'Picking back up where you left off.'
      : name
        ? `${name}, here's your path.`
        : "Here's your path.";

  const next = steps.find((s) => s.state === 'now') ?? steps.find((s) => s.state === 'later');
  return { greeting, steps, notes, goals, objective: prefs.objective || null, nextRoute: next?.route ?? '/path' };
}

app.get('/api/plan', async (c) => {
  const db = c.get('db');
  const session = requireSession(c);
  if (!session) return c.json({ error: 'No session.' }, 401);
  const participants = await db
    .select()
    .from(t.fdParticipant)
    .where(eq(t.fdParticipant.sessionId, session.id))
    .orderBy(desc(t.fdParticipant.createdAt))
    .limit(1);
  const prefs = await loadPrefs(db, session.id);
  const has = async (type: string) => {
    const rows = await db
      .select({ n: sql<number>`count(*)` })
      .from(t.fdEvent)
      .where(and(eq(t.fdEvent.sessionId, session.id), eq(t.fdEvent.type, type)));
    return (rows[0]?.n ?? 0) > 0;
  };
  const gradedRows = await db
    .select({ n: sql<number>`count(*)` })
    .from(t.fdSubmission)
    .where(and(eq(t.fdSubmission.sessionId, session.id), sql`${t.fdSubmission.gradedAt} IS NOT NULL`));
  const progress: Progress = {
    diagnosticDone: await has('diagnostic_completed'),
    sortDone: await has('sort_submitted'),
    activityGraded: (gradedRows[0]?.n ?? 0) > 0,
    moduleCompleted: await has('module_completed'),
    chatStarted: await has('chat_started'),
  };
  const plan = composePlan(participants[0]?.displayName ?? null, prefs, progress);
  await logEvent(db, session.id, 'plan_generated', { nextRoute: plan.nextRoute });
  return c.json(plan);
});

app.get('/api/me', async (c) => {
  const db = c.get('db');
  const session = c.get('session');
  if (!session)
    return c.json({
      authenticated: false,
      progress: { intakeDone: false, diagnosticDone: false, sortDone: false, activityGraded: false, moduleCompleted: false, chatStarted: false, podcastTried: false },
    } satisfies MeResponse);

  const participants = await db
    .select()
    .from(t.fdParticipant)
    .where(eq(t.fdParticipant.sessionId, session.id))
    .orderBy(desc(t.fdParticipant.createdAt))
    .limit(1);

  const has = async (type: string) => {
    const rows = await db
      .select({ n: sql<number>`count(*)` })
      .from(t.fdEvent)
      .where(and(eq(t.fdEvent.sessionId, session.id), eq(t.fdEvent.type, type)));
    return (rows[0]?.n ?? 0) > 0;
  };
  const gradedRows = await db
    .select({ n: sql<number>`count(*)` })
    .from(t.fdSubmission)
    .where(and(eq(t.fdSubmission.sessionId, session.id), sql`${t.fdSubmission.gradedAt} IS NOT NULL`));

  const res: MeResponse = {
    authenticated: true,
    displayName: participants[0]?.displayName ?? null,
    roleLabel: participants[0]?.roleLabel ?? null,
    brandSlug: session.brandSlug,
    prefs: await loadPrefs(db, session.id),
    progress: {
      intakeDone: await has('intake_completed'),
      diagnosticDone: await has('diagnostic_completed'),
      sortDone: await has('sort_submitted'),
      activityGraded: (gradedRows[0]?.n ?? 0) > 0,
      moduleCompleted: await has('module_completed'),
      chatStarted: await has('chat_started'),
      podcastTried: await has('podcast_requested'),
    },
  };
  return c.json(res);
});

// ---------- diagnostic ----------

type DiagItem = (typeof diagnosticData.items)[number];
const diagItems = diagnosticData.items as DiagItem[];
const diagById = new Map(diagItems.map((i) => [i.id, i]));

app.get('/api/diagnostic', async (c) => {
  const session = requireSession(c);
  if (!session) return c.json({ error: 'No session.' }, 401);
  const items: DiagnosticItemPublic[] = diagItems.map((i) =>
    i.kind === 'knowledge'
      ? { id: i.id, kind: 'knowledge', prompt: i.prompt, options: i.options! }
      : { id: i.id, kind: 'calibration', prompt: i.prompt, scale: diagnosticData.calibrationScale },
  );
  return c.json({ items });
});

app.post('/api/diagnostic/answer', async (c) => {
  const db = c.get('db');
  const session = requireSession(c);
  if (!session) return c.json({ error: 'No session.' }, 401);
  const body = await c.req.json<{ itemId?: string; answerIndex?: number; predictedPct?: number; msElapsed?: number }>().catch(() => null);
  const item = body?.itemId ? diagById.get(body.itemId) : undefined;
  if (!body || !item) return c.json({ error: 'Unknown item.' }, 400);

  // Latest answer wins — clear any earlier response for this item.
  await db.delete(t.fdDiagnosticResponse).where(and(eq(t.fdDiagnosticResponse.sessionId, session.id), eq(t.fdDiagnosticResponse.itemId, item.id)));

  let feedback: DiagnosticFeedback;
  if (item.kind === 'knowledge') {
    const idx = Number(body.answerIndex);
    if (!Number.isInteger(idx) || idx < 0 || idx >= item.options!.length) return c.json({ error: 'Pick one of the options.' }, 400);
    const correct = idx === item.correctIndex;
    await db.insert(t.fdDiagnosticResponse).values({
      id: uuid(),
      sessionId: session.id,
      itemId: item.id,
      answerJson: JSON.stringify({ answerIndex: idx }),
      correct: correct ? 1 : 0,
      msElapsed: Number.isFinite(body.msElapsed) ? Math.round(body.msElapsed!) : null,
    });
    feedback = { kind: 'knowledge', correct, correctIndex: item.correctIndex!, explanation: item.explanation! };
  } else {
    const pct = Number(body.predictedPct);
    if (!diagnosticData.calibrationScale.some((s) => s.pct === pct)) return c.json({ error: 'Pick one of the options.' }, 400);
    const delta = pct - item.keyPct!;
    await db.insert(t.fdDiagnosticResponse).values({
      id: uuid(),
      sessionId: session.id,
      itemId: item.id,
      answerJson: JSON.stringify({ predictedPct: pct }),
      correct: null,
      msElapsed: Number.isFinite(body.msElapsed) ? Math.round(body.msElapsed!) : null,
    });
    await db.delete(t.fdCalibration).where(and(eq(t.fdCalibration.sessionId, session.id), eq(t.fdCalibration.context, `diagnostic:${item.taskId}`)));
    await db.insert(t.fdCalibration).values({
      id: uuid(),
      sessionId: session.id,
      context: `diagnostic:${item.taskId}`,
      predictedPct: pct,
      actualOutcome: item.keyPct!,
      delta,
      createdAt: now(),
    });
    feedback = {
      kind: 'calibration',
      keyPct: item.keyPct!,
      keyBucket: item.keyBucket as 'well' | 'partly' | 'badly',
      predictedPct: pct,
      delta,
      reasoning: item.reasoning!,
    };
  }
  await logEvent(db, session.id, 'diagnostic_item', { itemId: item.id });
  return c.json({ feedback });
});

async function computeDiagnosticResult(db: DrizzleD1Database, sessionId: string): Promise<DiagnosticResult> {
  const responses = await db.select().from(t.fdDiagnosticResponse).where(eq(t.fdDiagnosticResponse.sessionId, sessionId));
  const byItem = new Map(responses.map((r) => [r.itemId, r]));

  let kCorrect = 0;
  let kTotal = 0;
  const points: DiagnosticResult['calibration']['points'] = [];
  for (const item of diagItems) {
    const r = byItem.get(item.id);
    if (item.kind === 'knowledge') {
      kTotal++;
      if (r?.correct === 1) kCorrect++;
    } else if (r) {
      const predicted = (JSON.parse(r.answerJson) as { predictedPct: number }).predictedPct;
      points.push({
        itemId: item.id,
        task: item.prompt,
        predictedPct: predicted,
        keyPct: item.keyPct!,
        delta: predicted - item.keyPct!,
        keyBucket: item.keyBucket!,
      });
    }
  }

  const deltas = points.map((p) => p.delta);
  const mean = deltas.length ? deltas.reduce((a, b) => a + b, 0) / deltas.length : 0;
  const meanAbs = deltas.length ? deltas.reduce((a, b) => a + Math.abs(b), 0) / deltas.length : 0;
  const overshoots = points.filter((p) => p.delta >= 20);
  const undershoots = points.filter((p) => p.delta <= -20);

  let direction: DiagnosticResult['calibration']['direction'];
  let headline: string;
  let detail: string;
  const biggest = [...points].sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))[0];

  if (mean >= 12) {
    direction = 'over';
    headline = 'You consistently expect more from these tools than they deliver.';
    detail = biggest
      ? `Your biggest miss: "${biggest.task}" — you put it at ${biggest.predictedPct}%, the field data puts it near ${biggest.keyPct}%. The risk that follows this pattern is shipping something fluent and fabricated. Module 1 is built to close exactly this gap.`
      : 'The risk that follows this pattern is shipping something fluent and fabricated.';
  } else if (mean <= -12) {
    direction = 'under';
    headline = 'You consistently expect less from these tools than they deliver.';
    detail = biggest
      ? `Your biggest miss: "${biggest.task}" — you put it at ${biggest.predictedPct}%, the field data puts it near ${biggest.keyPct}%. The cost is quieter than fabrication: hours of work done by hand that a model would have done in seconds. Module 1 shows you where that leverage is.`
      : 'The cost is quieter than fabrication: work done by hand that a model would have done in seconds.';
  } else if (overshoots.length >= 1 && undershoots.length >= 1) {
    direction = 'mixed';
    headline = "You overestimate these tools where they're blind, and underestimate them where they're strong.";
    const over = overshoots[0];
    const under = undershoots[0];
    detail = `You put "${over.task}" at ${over.predictedPct}% (field data: ~${over.keyPct}%) but "${under.task}" at ${under.predictedPct}% (field data: ~${under.keyPct}%). That double miss is the most common pattern we see — and the most fixable, because it's one mental model away from resolving.`;
  } else {
    direction = 'calibrated';
    headline = 'Your read on these tools is unusually accurate.';
    detail = biggest
      ? `Most people miss by 30 points or more on at least one task. Your largest miss was ${Math.abs(Math.round(biggest.delta))} points, on "${biggest.task}". Module 1 will sharpen the edges — and the sorting exercise inside it is where your calibration gets a real test: fifteen tasks instead of five.`
      : 'Module 1 will sharpen the edges.';
  }

  return {
    answered: responses.length,
    total: diagItems.length,
    knowledge: { correct: kCorrect, total: kTotal },
    calibration: { points, meanDelta: Math.round(mean * 10) / 10, meanAbsDelta: Math.round(meanAbs * 10) / 10, direction, headline, detail },
  };
}

app.post('/api/diagnostic/complete', async (c) => {
  const db = c.get('db');
  const session = requireSession(c);
  if (!session) return c.json({ error: 'No session.' }, 401);
  const result = await computeDiagnosticResult(db, session.id);
  await logEvent(db, session.id, 'diagnostic_completed', {
    knowledge: result.knowledge,
    meanDelta: result.calibration.meanDelta,
    direction: result.calibration.direction,
  });
  return c.json(result);
});

app.get('/api/diagnostic/result', async (c) => {
  const db = c.get('db');
  const session = requireSession(c);
  if (!session) return c.json({ error: 'No session.' }, 401);
  return c.json(await computeDiagnosticResult(db, session.id));
});

// ---------- path & content ----------

app.get('/api/path', async (c) => {
  const db = c.get('db');
  const session = requireSession(c);
  if (!session) return c.json({ error: 'No session.' }, 401);
  const rows = await db.select().from(t.fdModule).orderBy(asc(t.fdModule.courseId), asc(t.fdModule.ordinal));

  // Prerequisites are advisory — they shape the recommendation line, never a
  // hard lock. One is satisfied by completing the module, passing its
  // knowledge check at 60%+, or — for 101-M1 — testing out on the diagnostic
  // (at most one knowledge miss, all questions answered).
  const doneRows = await db
    .select()
    .from(t.fdEvent)
    .where(
      and(
        eq(t.fdEvent.sessionId, session.id),
        sql`${t.fdEvent.type} IN ('module_completed', 'knowledge_check_submitted')`,
      ),
    );
  const completed = new Set(
    doneRows
      .map((e) => {
        if (!e.payloadJson) return null;
        const p = JSON.parse(e.payloadJson) as { moduleId?: string; correct?: number; total?: number };
        // A knowledge check clears a prerequisite at 60%+ — retakes are free,
        // so the gate asks for understanding, not mere submission.
        if (e.type === 'knowledge_check_submitted' && p.total && (p.correct ?? 0) / p.total < 0.6) return null;
        return p.moduleId;
      })
      .filter(Boolean),
  );
  const kResponses = await db
    .select()
    .from(t.fdDiagnosticResponse)
    .where(and(eq(t.fdDiagnosticResponse.sessionId, session.id), sql`${t.fdDiagnosticResponse.correct} IS NOT NULL`));
  const kTotal = diagItems.filter((i) => i.kind === 'knowledge').length;
  const kCorrect = kResponses.filter((r) => r.correct === 1).length;
  const testedOutM1 = kResponses.length >= kTotal && kCorrect >= kTotal - 1;

  const titleOf = (id: string) => rows.find((m) => m.id === id)?.title ?? id;
  const satisfied = (id: string) => completed.has(id) || (id === 'ai101-m1' && testedOutM1);

  // "Recommended for you" reasons, stated in terms of the learner's own
  // inputs — their goals and their diagnostic — so the personalization is
  // legible, not a black box.
  const prefs = await loadPrefs(db, session.id);
  const selectedGoals = GOAL_CHOICES.filter((g) => (prefs.goals ?? []).includes(g.id));
  const diagReasons = new Map<string, string>();
  const diagDoneRows = await db
    .select({ n: sql<number>`count(*)` })
    .from(t.fdEvent)
    .where(and(eq(t.fdEvent.sessionId, session.id), eq(t.fdEvent.type, 'diagnostic_completed')));
  if ((diagDoneRows[0]?.n ?? 0) > 0) {
    const diag = await computeDiagnosticResult(db, session.id);
    const dir = diag.calibration.direction;
    if (dir === 'over' || dir === 'mixed') diagReasons.set('ai101-m6', 'your diagnostic: you expect too much from these tools');
    if (dir === 'under' || dir === 'mixed') diagReasons.set('ai101-m5', 'your diagnostic: you expect too little from these tools');
  }
  const reasonsFor = (moduleId: string): string[] => {
    const reasons: string[] = [];
    if (moduleId === 'ai101-m1') reasons.push('where every path starts');
    for (const g of selectedGoals) if (g.modules.includes(moduleId)) reasons.push(`your goal: ${g.label}`);
    const d = diagReasons.get(moduleId);
    if (d) reasons.push(d);
    return reasons;
  };

  const modules: PathModule[] = rows.map((m) => {
    const prereqs: string[] = m.prereqJson ? JSON.parse(m.prereqJson) : [];
    const unmet = prereqs.filter((p) => !satisfied(p));
    const access: PathModule['access'] = m.status === 'open' ? 'open' : 'full_course';
    let unlockHint: string | undefined;
    if (unmet.length > 0) {
      const names = unmet.map(titleOf).join(' and ');
      unlockHint = unmet.includes('ai101-m1')
        ? `Best after ${names} — or test out via the diagnostic (at most one knowledge miss). Go in any order; nothing locks.`
        : `Best after ${names} — 60%+ on its knowledge check clears the recommendation, retakes free. Go in any order; nothing locks.`;
    } else if (prereqs.length > 0) {
      unlockHint = 'Prerequisite cleared.';
    }
    return {
      ...(m as ModuleCard),
      access,
      prereqs,
      unlockHint,
      microMinutes: 2,
      completed: completed.has(m.id),
      testedOut: !completed.has(m.id) && m.id === 'ai101-m1' && testedOutM1,
      recommendedFor: reasonsFor(m.id),
    };
  });

  // Courses beyond 101 are locked cards; they live in content, not the DB, until they exist.
  const { courses } = (await import('../../content/modules.json')) as unknown as { courses: CourseCard[] };
  const coursesOut: CourseCard[] = courses.map((course) => ({
    ...course,
    recommendedFor: selectedGoals.filter((g) => g.courses.includes(course.id)).map((g) => `your goal: ${g.label}`),
  }));
  return c.json({ modules, courses: coursesOut });
});

// The two-minute cut of any module — same content system, tighter blocks.
app.get('/api/module/:id/micro', async (c) => {
  const db = c.get('db');
  const session = requireSession(c);
  if (!session) return c.json({ error: 'No session.' }, 401);
  const id = c.req.param('id');
  const blockRows = await db
    .select()
    .from(t.fdContentBlock)
    .where(eq(t.fdContentBlock.moduleId, `${id}-micro`))
    .orderBy(asc(t.fdContentBlock.ordinal));
  if (blockRows.length === 0) return c.json({ error: 'This module has no micro dose yet.' }, 404);
  const blocks = selectVariants(blockRows, toolingOf(c.env)).map(toBlock);
  return c.json({ blocks, stamps: stampsFor(blocks) });
});

// One deployment teaches one tool stack. Blocks tagged with a variant form a
// group per ordinal; serve the one matching ORG_TOOLING, falling back to the
// 'claude' default so an unknown tooling never loses a lesson. Untagged
// blocks apply to every org.
const toolingOf = (env: Env) => env.ORG_TOOLING?.trim().toLowerCase() || 'claude';

function selectVariants<T extends { ordinal: number; variant: string | null }>(rows: T[], tooling: string): T[] {
  return rows.filter((row) => {
    if (!row.variant) return true;
    const groupHasMatch = rows.some((r) => r.ordinal === row.ordinal && r.variant === tooling);
    return groupHasMatch ? row.variant === tooling : row.variant === 'claude';
  });
}

function toBlock(row: typeof t.fdContentBlock.$inferSelect): ContentBlock {
  return {
    id: row.id,
    moduleId: row.moduleId,
    ordinal: row.ordinal,
    kind: row.kind as ContentBlock['kind'],
    layer: row.layer as ContentBlock['layer'],
    body: row.body,
    dependsOn: row.dependsOn ? JSON.parse(row.dependsOn) : undefined,
    reviewedAt: row.reviewedAt,
  };
}

function stampsFor(blocks: ContentBlock[]) {
  const min = (layer: string) => {
    const dates = blocks.filter((b) => b.layer === layer).map((b) => b.reviewedAt);
    return dates.length ? dates.sort()[0] : null;
  };
  return { conceptsReviewedAt: min('stable'), examplesCurrentAsOf: min('volatile') };
}

// Exercise payloads (sorting keys, rubrics, knowledge checks) live in
// fd_exercise; the client only ever sees a public projection.
async function getExercise<T>(db: DrizzleD1Database, moduleId: string, kind: string): Promise<T | null> {
  const rows = await db
    .select()
    .from(t.fdExercise)
    .where(and(eq(t.fdExercise.moduleId, moduleId), eq(t.fdExercise.kind, kind)))
    .limit(1);
  return rows[0] ? (JSON.parse(rows[0].payloadJson) as T) : null;
}

type SortingPayload = {
  buckets: { id: string; label: string; hint: string; rank: number; pct: number }[];
  // `also` marks deliberately-arguable placements that score as correct — the
  // reasoning text carries the argument either way.
  tasks: { id: string; text: string; key: string; also?: string[]; reasoning: string }[];
  pattern: string;
  postscript: string;
};

// A single-answer exercise over a set of stimulus artifacts (M3's
// find-the-lossy-step). Key stays server-side like every other exercise.
type ChoicePayload = {
  title: string;
  intro: string;
  artifacts: { label: string; body: string }[];
  options: { id: string; label: string }[];
  key: string;
  reasoning: string;
  closing: string;
};

type KnowledgeCheckPayload = {
  title: string;
  note: string | null;
  questions: {
    id: string;
    prompt: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    study?: { blockId: string; label: string };
  }[];
};


app.get('/api/module/:id', async (c) => {
  const db = c.get('db');
  const session = requireSession(c);
  if (!session) return c.json({ error: 'No session.' }, 401);
  const id = c.req.param('id');
  const modRows = await db.select().from(t.fdModule).where(eq(t.fdModule.id, id)).limit(1);
  const mod = modRows[0];
  if (!mod) return c.json({ error: 'No such module.' }, 404);
  if (mod.status !== 'open') {
    return c.json({ error: "This module's content ships in the full course — the demo carries Module 1 end to end." }, 403);
  }
  // Seeing the module page warms its stock episode — by the time the learner
  // clicks Listen, the instant path is usually ready. Skips in one query when fresh.
  c.executionCtx.waitUntil(bakeStock(c.env, id));
  const blockRows = await db.select().from(t.fdContentBlock).where(eq(t.fdContentBlock.moduleId, id)).orderBy(asc(t.fdContentBlock.ordinal));
  const blocks = selectVariants(blockRows, toolingOf(c.env)).map(toBlock);
  const words = blocks.reduce((sum, b) => sum + b.body.split(/\s+/).length, 0);

  // Capabilities are discovered from what the package seeded — the modality
  // hub and every feature route render from this, not from hardcoded module ids.
  const microCount = await db
    .select({ n: sql<number>`count(*)` })
    .from(t.fdContentBlock)
    .where(eq(t.fdContentBlock.moduleId, `${id}-micro`));
  const exerciseRows = await db
    .select({ kind: t.fdExercise.kind })
    .from(t.fdExercise)
    .where(eq(t.fdExercise.moduleId, id));
  const kinds = new Set(exerciseRows.map((r) => r.kind));

  // Numeric prediction fields the opening calibration prompt captures, with
  // whatever this session already recorded — so the prompt renders as saved.
  const rubric = kinds.has('rubric') ? await getExercise<RubricPayload>(db, id, 'rubric') : null;
  const openingFields = rubric?.opening ?? [];
  const openingValues: Record<string, number> = {};
  if (openingFields.length) {
    const rows = await db
      .select({ context: t.fdCalibration.context, predictedPct: t.fdCalibration.predictedPct })
      .from(t.fdCalibration)
      .where(eq(t.fdCalibration.sessionId, session.id));
    for (const field of openingFields) {
      const row = rows.find((r) => r.context === `${id}:cal:${field.key}`);
      if (row) openingValues[field.key] = row.predictedPct;
    }
  }

  const res: ModuleContentResponse = {
    module: mod as ModuleCard,
    blocks,
    stamps: stampsFor(blocks),
    estReadMinutes: Math.max(1, Math.round(words / 200)),
    capabilities: {
      read: blocks.length > 0,
      micro: (microCount[0]?.n ?? 0) > 0,
      chat: blocks.length > 0,
      podcast: blocks.length > 0,
      sorting: kinds.has('sorting'),
      activity: kinds.has('rubric'),
      knowledgeCheck: kinds.has('knowledge_check'),
    },
    openingFields,
    openingValues,
  };
  return c.json(res);
});

// A module's opening calibration prompt: free text always; numeric fields when
// the rubric declares them. Numbers land in fd_calibration as open predictions
// — the matching activity field (actualFor) closes the loop at submission time.
app.post('/api/module/:id/calibration', async (c) => {
  const db = c.get('db');
  const session = requireSession(c);
  if (!session) return c.json({ error: 'No session.' }, 401);
  const moduleId = c.req.param('id');
  const body = await c.req.json<{ text?: string; values?: Record<string, number> }>().catch(() => null);
  const text = body?.text?.trim();
  const rubric = await getExercise<RubricPayload>(db, moduleId, 'rubric');
  const fields = rubric?.opening ?? [];
  const saved: string[] = [];
  for (const field of fields) {
    const value = Number(body?.values?.[field.key]);
    if (!Number.isFinite(value)) continue;
    const clamped = Math.max(field.min ?? 0, Math.min(field.max ?? 1_000_000, Math.round(value)));
    const context = `${moduleId}:cal:${field.key}`;
    await db.delete(t.fdCalibration).where(and(eq(t.fdCalibration.sessionId, session.id), eq(t.fdCalibration.context, context)));
    await db.insert(t.fdCalibration).values({
      id: uuid(),
      sessionId: session.id,
      context,
      predictedPct: clamped,
      actualOutcome: null,
      delta: null,
      createdAt: now(),
    });
    saved.push(field.key);
  }
  if (!text && !saved.length) return c.json({ error: 'Write the prediction before saving it.' }, 400);
  if (text) await logEvent(db, session.id, 'module_calibration_recorded', { moduleId, text: text.slice(0, 1000) });
  return c.json({ ok: true, saved });
});

// ---------- voice ----------

const voiceStatus = (env: Env) => ({
  transcribe: !!env.AI,
  speech: !!env.AI && !!env.PODCAST_AUDIO,
});

// Mic availability for any screen with a text input; no session needed since
// it reveals only deployment configuration.
app.get('/api/voice/status', async (c) => c.json(voiceStatus(c.env)));

// Raw audio body in (webm/mp4/ogg from MediaRecorder), transcript out.
// Serves every open text input in the app, not just the tutor chat.
app.post('/api/voice/transcribe', async (c) => {
  const db = c.get('db');
  const session = requireSession(c);
  if (!session) return c.json({ error: 'No session.' }, 401);
  if (!c.env.AI) return c.json({ error: 'Transcription is not configured in this deployment — typing still works.' }, 503);

  const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const recent = await db
    .select({ n: sql<number>`count(*)` })
    .from(t.fdEvent)
    .where(and(eq(t.fdEvent.sessionId, session.id), eq(t.fdEvent.type, 'voice_transcribed'), gt(t.fdEvent.createdAt, hourAgo)));
  if ((recent[0]?.n ?? 0) >= TRANSCRIBE_LIMIT_PER_HOUR) {
    return c.json({ error: 'Transcription is limited to 60 clips an hour — the keyboard never rate-limits.' }, 429);
  }

  const buf = await c.req.arrayBuffer();
  if (buf.byteLength < 1000) return c.json({ error: "That clip was too short to contain speech. Hold the mic a beat longer." }, 400);
  if (buf.byteLength > MAX_AUDIO_BYTES) return c.json({ error: 'That recording is too long — keep clips under about two minutes.' }, 400);

  const text = await transcribe(c.env.AI, new Uint8Array(buf));
  if (!text) return c.json({ error: "Couldn't make out any words in that clip. Try again a little closer to the mic." }, 502);

  await logEvent(db, session.id, 'voice_transcribed', { bytes: buf.byteLength, chars: text.length });
  return c.json({ text: text.slice(0, MAX_CHAT_CHARS * 2) });
});

// Spoken version of an assistant chat message: rendered with the tutor's voice
// on first request, cached in R2 keyed by message id, then served from cache.
app.get('/api/module/:id/chat/audio/:messageId', async (c) => {
  const db = c.get('db');
  const session = requireSession(c);
  if (!session) return c.json({ error: 'No session.' }, 401);
  if (!c.env.AI || !c.env.PODCAST_AUDIO) {
    return c.json({ error: 'Spoken replies are not configured in this deployment.' }, 503);
  }
  const moduleId = c.req.param('id');
  const messageId = c.req.param('messageId');
  const rows = await db
    .select()
    .from(t.fdChatMessage)
    .where(and(eq(t.fdChatMessage.id, messageId), eq(t.fdChatMessage.sessionId, session.id), eq(t.fdChatMessage.moduleId, moduleId)))
    .limit(1);
  const row = rows[0];
  if (!row || row.role !== 'assistant') return c.json({ error: 'No such message.' }, 404);

  const audioHeaders = { 'content-type': 'audio/mpeg', 'cache-control': 'private, max-age=86400' };
  const key = `chat-tts/${messageId}.mp3`;
  const cached = await c.env.PODCAST_AUDIO.get(key);
  if (cached) return new Response(cached.body, { headers: audioHeaders });

  const text = speakable(extractPaths(row.content).body);
  if (!text) return c.json({ error: 'Nothing speakable in that message.' }, 400);
  const audio = await renderSpeech(c.env.AI, text);
  if (!audio) return c.json({ error: 'Voice rendering hiccuped — the text is right there meanwhile.' }, 503);

  await c.env.PODCAST_AUDIO.put(key, audio, { httpMetadata: { contentType: 'audio/mpeg' } });
  await logEvent(db, session.id, 'chat_audio_rendered', { messageId, bytes: audio.length, voice: TUTOR_VOICE });
  return new Response(audio, { headers: audioHeaders });
});

// ---------- tutor chat ----------

// Everything the tutor should know about this learner, phrased for the prompt.
async function buildLearnerContext(db: DrizzleD1Database, sessionId: string): Promise<TutorLearnerContext> {
  const participants = await db
    .select()
    .from(t.fdParticipant)
    .where(eq(t.fdParticipant.sessionId, sessionId))
    .orderBy(desc(t.fdParticipant.createdAt))
    .limit(1);
  const prefs = await loadPrefs(db, sessionId);

  const has = async (type: string) => {
    const rows = await db
      .select({ n: sql<number>`count(*)` })
      .from(t.fdEvent)
      .where(and(eq(t.fdEvent.sessionId, sessionId), eq(t.fdEvent.type, type)));
    return (rows[0]?.n ?? 0) > 0;
  };

  let calibration: string | null = null;
  if (await has('diagnostic_completed')) {
    const result = await computeDiagnosticResult(db, sessionId);
    calibration = `${result.calibration.headline} (knowledge ${result.knowledge.correct}/${result.knowledge.total}, mean calibration delta ${result.calibration.meanDelta > 0 ? '+' : ''}${result.calibration.meanDelta} points).`;
  }

  let sortSummary: string | null = null;
  const sortEvents = await db
    .select()
    .from(t.fdEvent)
    .where(and(eq(t.fdEvent.sessionId, sessionId), eq(t.fdEvent.type, 'sort_submitted')))
    .orderBy(desc(t.fdEvent.createdAt))
    .limit(1);
  if (sortEvents[0]?.payloadJson) {
    const p = JSON.parse(sortEvents[0].payloadJson) as { correct?: number; total?: number; overAssigned?: number; underAssigned?: number };
    if (typeof p.correct === 'number' && typeof p.total === 'number') {
      sortSummary = `${p.correct}/${p.total} correct — ${p.overAssigned ?? 0} tasks placed too optimistically, ${p.underAssigned ?? 0} too pessimistically.`;
    }
  }

  const progress: string[] = [];
  if (calibration) progress.push('the diagnostic');
  if (sortSummary) progress.push('the sorting exercise');
  if (await has('module_completed')) progress.push('the module read');
  if (await has('activity_graded')) progress.push('the applied activity');

  return {
    name: participants[0]?.displayName ?? null,
    roleLabel: participants[0]?.roleLabel ?? null,
    objective: prefs.objective ?? null,
    depth: depthOf(prefs.depth),
    calibration,
    sortSummary,
    progress,
    sizeUp: prefs.start === 'chat' && !calibration,
  };
}

async function loadChatModule(db: DrizzleD1Database, moduleId: string, tooling: string) {
  const modRows = await db.select().from(t.fdModule).where(eq(t.fdModule.id, moduleId)).limit(1);
  const mod = modRows[0];
  if (!mod || mod.status !== 'open') return null;
  const blockRows = await db
    .select()
    .from(t.fdContentBlock)
    .where(eq(t.fdContentBlock.moduleId, moduleId))
    .orderBy(asc(t.fdContentBlock.ordinal));
  if (blockRows.length === 0) return null;
  return { mod, blocks: selectVariants(blockRows, tooling).map(toBlock) };
}

app.get('/api/module/:id/chat', async (c) => {
  const db = c.get('db');
  const session = requireSession(c);
  if (!session) return c.json({ error: 'No session.' }, 401);
  const moduleId = c.req.param('id');
  const loaded = await loadChatModule(db, moduleId, toolingOf(c.env));
  if (!loaded) return c.json({ error: 'No tutor for this module yet.' }, 404);
  const rows = await db
    .select()
    .from(t.fdChatMessage)
    .where(and(eq(t.fdChatMessage.sessionId, session.id), eq(t.fdChatMessage.moduleId, moduleId)))
    .orderBy(asc(t.fdChatMessage.ordinal));
  return c.json({
    moduleId,
    moduleTitle: loaded.mod.title,
    messages: rows.map((r) => ({ id: r.id, role: r.role as 'user' | 'assistant', content: r.content, createdAt: r.createdAt })),
    limits: { maxMessageChars: MAX_CHAT_CHARS },
    voice: voiceStatus(c.env),
  });
});

app.post('/api/module/:id/chat/reset', async (c) => {
  const db = c.get('db');
  const session = requireSession(c);
  if (!session) return c.json({ error: 'No session.' }, 401);
  const moduleId = c.req.param('id');
  await db
    .delete(t.fdChatMessage)
    .where(and(eq(t.fdChatMessage.sessionId, session.id), eq(t.fdChatMessage.moduleId, moduleId)));
  await logEvent(db, session.id, 'chat_reset', { moduleId });
  return c.json({ ok: true });
});

// Streams the tutor's reply as NDJSON lines ({type:'delta'|'done'|'error'}).
// The user turn is persisted before the model is called; the assistant turn is
// persisted when the stream ends (including partial text if it errors midway),
// so a dropped connection never loses the conversation.
app.post('/api/module/:id/chat', async (c) => {
  const db = c.get('db');
  const session = requireSession(c);
  if (!session) return c.json({ error: 'No session.' }, 401);
  if (!c.env.ANTHROPIC_API_KEY) {
    return c.json({ error: 'The tutor is offline in this deployment — the reading path has everything it covers.' }, 503);
  }
  const moduleId = c.req.param('id');
  const loaded = await loadChatModule(db, moduleId, toolingOf(c.env));
  if (!loaded) return c.json({ error: 'No tutor for this module yet.' }, 404);

  const body = await c.req.json<{ message?: string; via?: string }>().catch(() => null);
  const message = body?.message?.trim() || null;
  const via = body?.via === 'voice' ? 'voice' : 'text';
  if (message && message.length > MAX_CHAT_CHARS) {
    return c.json({ error: `Keep messages under ${MAX_CHAT_CHARS} characters — break a long question into pieces.` }, 400);
  }

  const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const recent = await db
    .select({ n: sql<number>`count(*)` })
    .from(t.fdChatMessage)
    .where(
      and(
        eq(t.fdChatMessage.sessionId, session.id),
        eq(t.fdChatMessage.role, 'assistant'),
        gt(t.fdChatMessage.createdAt, hourAgo),
      ),
    );
  if ((recent[0]?.n ?? 0) >= CHAT_LIMIT_PER_HOUR) {
    return c.json({ error: 'The tutor needs a breather — chat is limited to 30 replies an hour. The module read is always open.' }, 429);
  }

  const history = await db
    .select()
    .from(t.fdChatMessage)
    .where(and(eq(t.fdChatMessage.sessionId, session.id), eq(t.fdChatMessage.moduleId, moduleId)))
    .orderBy(asc(t.fdChatMessage.ordinal));

  if (!message && history.length > 0) return c.json({ error: 'Say something first.' }, 400);

  let nextOrdinal = (history[history.length - 1]?.ordinal ?? -1) + 1;
  if (message) {
    await db.insert(t.fdChatMessage).values({
      id: uuid(),
      sessionId: session.id,
      moduleId,
      ordinal: nextOrdinal++,
      role: 'user',
      content: message,
      createdAt: now(),
    });
  }

  const courseModules = await db
    .select()
    .from(t.fdModule)
    .where(eq(t.fdModule.courseId, loaded.mod.courseId))
    .orderBy(asc(t.fdModule.ordinal));
  const learner = await buildLearnerContext(db, session.id);
  const system = buildTutorSystem(loaded.mod as ModuleCard, loaded.blocks, courseModules as ModuleCard[], learner);

  // The stored opener starts with an assistant turn; the API requires user-first,
  // so the deterministic kickoff turn stands in (byte-stable for prompt caching).
  const turns: TutorMessage[] = history.slice(-CHAT_HISTORY_TURNS).map((r) => ({ role: r.role as 'user' | 'assistant', content: r.content }));
  if (message) turns.push({ role: 'user', content: message });
  else turns.push({ role: 'user', content: KICKOFF_TURN });
  if (turns[0].role !== 'user') turns.unshift({ role: 'user', content: KICKOFF_TURN });
  // Cache breakpoint on the last turn: next request re-reads the whole
  // conversation prefix instead of re-processing it.
  const last = turns[turns.length - 1];
  last.content = [{ type: 'text', text: last.content as string, cache_control: { type: 'ephemeral' } }];

  await logEvent(db, session.id, history.length === 0 ? 'chat_started' : 'chat_message', { moduleId, chars: message?.length ?? 0, via });

  const env = c.env;
  const sessionId = session.id;
  const assistantOrdinal = nextOrdinal;
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (line: unknown) => controller.enqueue(encoder.encode(JSON.stringify(line) + '\n'));
      let full = '';
      let sent = 0;
      const HOLD = 12; // never forward a partially-streamed "<paths" tag
      try {
        for await (const delta of streamTutorReply(env.ANTHROPIC_API_KEY!, env.CHAT_MODEL, system, turns)) {
          full += delta;
          const tagAt = full.indexOf('<paths');
          const limit = tagAt >= 0 ? tagAt : Math.max(sent, full.length - HOLD);
          if (limit > sent) {
            send({ type: 'delta', text: full.slice(sent, limit) });
            sent = limit;
          }
        }
        const tagAt = full.indexOf('<paths');
        const visibleEnd = tagAt >= 0 ? tagAt : full.length;
        if (visibleEnd > sent) send({ type: 'delta', text: full.slice(sent, visibleEnd) });
        if (!full.trim()) {
          send({ type: 'error', message: 'The tutor came back empty-handed. Try rephrasing.' });
        } else {
          const messageId = uuid();
          await db.insert(t.fdChatMessage).values({
            id: messageId,
            sessionId,
            moduleId,
            ordinal: assistantOrdinal,
            role: 'assistant',
            content: full,
            modelUsed: env.CHAT_MODEL,
            createdAt: now(),
          });
          send({ type: 'done', messageId });
        }
      } catch {
        // Keep whatever streamed before the failure so the transcript stays honest.
        if (full.trim()) {
          await db
            .insert(t.fdChatMessage)
            .values({
              id: uuid(),
              sessionId,
              moduleId,
              ordinal: assistantOrdinal,
              role: 'assistant',
              content: full,
              modelUsed: env.CHAT_MODEL,
              createdAt: now(),
            })
            .catch(() => {});
        }
        send({ type: 'error', message: 'The tutor lost the thread mid-reply. Nothing was lost on your side — send that again.' });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { 'content-type': 'application/x-ndjson; charset=utf-8', 'cache-control': 'no-store' },
  });
});

// ---------- sorting exercise ----------

app.get('/api/module/:id/sorting', async (c) => {
  const db = c.get('db');
  const session = requireSession(c);
  if (!session) return c.json({ error: 'No session.' }, 401);
  const sorting = await getExercise<SortingPayload>(db, c.req.param('id'), 'sorting');
  if (!sorting) return c.json({ error: 'This module has no sorting exercise.' }, 404);
  return c.json({
    buckets: sorting.buckets.map(({ id, label, hint }) => ({ id, label, hint })),
    tasks: sorting.tasks.map((task) => ({ id: task.id, text: task.text })),
  });
});

app.post('/api/module/:id/sort', async (c) => {
  const db = c.get('db');
  const session = requireSession(c);
  if (!session) return c.json({ error: 'No session.' }, 401);
  const moduleId = c.req.param('id');
  const sorting = await getExercise<SortingPayload>(db, moduleId, 'sorting');
  if (!sorting) return c.json({ error: 'This module has no sorting exercise.' }, 404);

  const body = await c.req.json<{ assignments?: Record<string, string> }>().catch(() => null);
  const assignments = body?.assignments ?? {};
  const valid = new Set(sorting.buckets.map((b) => b.id));
  for (const task of sorting.tasks) {
    if (!valid.has(assignments[task.id])) {
      return c.json({ error: `Commit all ${sorting.tasks.length} before the reveal — an unscored guess teaches nothing.` }, 400);
    }
  }

  const rank = Object.fromEntries(sorting.buckets.map((b) => [b.id, b.rank]));
  const pct = Object.fromEntries(sorting.buckets.map((b) => [b.id, b.pct]));
  let correct = 0;
  let overAssigned = 0;
  let underAssigned = 0;
  const results: SortingReveal['results'] = sorting.tasks.map((task) => {
    const chosen = assignments[task.id];
    const isCorrect = chosen === task.key || (task.also ?? []).includes(chosen);
    if (isCorrect) correct++;
    else if (rank[chosen] > rank[task.key]) overAssigned++;
    else if (rank[chosen] < rank[task.key]) underAssigned++;
    return { taskId: task.id, text: task.text, chosen, key: task.key, correct: isCorrect, reasoning: task.reasoning };
  });

  for (const task of sorting.tasks) {
    const context = `sort:${moduleId}:${task.id}`;
    await db.delete(t.fdCalibration).where(and(eq(t.fdCalibration.sessionId, session.id), eq(t.fdCalibration.context, context)));
    await db.insert(t.fdCalibration).values({
      id: uuid(),
      sessionId: session.id,
      context,
      predictedPct: pct[assignments[task.id]],
      actualOutcome: pct[task.key],
      delta: pct[assignments[task.id]] - pct[task.key],
      createdAt: now(),
    });
  }
  await logEvent(db, session.id, 'sort_submitted', { moduleId, correct, total: sorting.tasks.length, overAssigned, underAssigned });

  const reveal: SortingReveal = {
    results,
    score: { correct, total: sorting.tasks.length },
    overAssigned,
    underAssigned,
    pattern: sorting.pattern,
    postscript: sorting.postscript,
  };
  return c.json(reveal);
});

// ---------- choice exercise (single answer over stimulus artifacts) ----------

app.get('/api/module/:id/choice', async (c) => {
  const db = c.get('db');
  const session = requireSession(c);
  if (!session) return c.json({ error: 'No session.' }, 401);
  const choice = await getExercise<ChoicePayload>(db, c.req.param('id'), 'choice');
  if (!choice) return c.json({ error: 'This module has no choice exercise.' }, 404);
  return c.json({
    title: choice.title,
    intro: choice.intro,
    artifacts: choice.artifacts,
    options: choice.options,
  });
});

app.post('/api/module/:id/choice', async (c) => {
  const db = c.get('db');
  const session = requireSession(c);
  if (!session) return c.json({ error: 'No session.' }, 401);
  const moduleId = c.req.param('id');
  const choice = await getExercise<ChoicePayload>(db, moduleId, 'choice');
  if (!choice) return c.json({ error: 'This module has no choice exercise.' }, 404);
  const body = await c.req.json<{ chosen?: string }>().catch(() => null);
  const chosen = body?.chosen;
  if (!chosen || !choice.options.some((o) => o.id === chosen)) return c.json({ error: 'Commit to an answer before the reveal.' }, 400);
  const correct = chosen === choice.key;
  await logEvent(db, session.id, 'choice_submitted', { moduleId, correct });
  return c.json({ correct, key: choice.key, reasoning: choice.reasoning, closing: choice.closing });
});

// ---------- knowledge check ----------

app.get('/api/module/:id/knowledge-check', async (c) => {
  const db = c.get('db');
  const session = requireSession(c);
  if (!session) return c.json({ error: 'No session.' }, 401);
  const kc = await getExercise<KnowledgeCheckPayload>(db, c.req.param('id'), 'knowledge_check');
  if (!kc) return c.json({ error: 'This module has no knowledge check.' }, 404);
  return c.json({
    title: kc.title,
    note: kc.note,
    questions: kc.questions.map((q) => ({ id: q.id, prompt: q.prompt, options: q.options })),
  });
});

app.post('/api/module/:id/knowledge-check', async (c) => {
  const db = c.get('db');
  const session = requireSession(c);
  if (!session) return c.json({ error: 'No session.' }, 401);
  const moduleId = c.req.param('id');
  const kc = await getExercise<KnowledgeCheckPayload>(db, moduleId, 'knowledge_check');
  if (!kc) return c.json({ error: 'This module has no knowledge check.' }, 404);
  const body = await c.req.json<{ answers?: Record<string, number> }>().catch(() => null);
  const answers = body?.answers ?? {};

  let correct = 0;
  const results = kc.questions.map((q) => {
    const chosen = Number(answers[q.id]);
    const ok = Number.isInteger(chosen) && chosen === q.correctIndex;
    if (ok) correct++;
    return {
      id: q.id,
      chosenIndex: Number.isInteger(chosen) ? chosen : -1,
      correct: ok,
      correctIndex: q.correctIndex,
      explanation: q.explanation,
      study: q.study,
    };
  });
  await logEvent(db, session.id, 'knowledge_check_submitted', { moduleId, correct, total: kc.questions.length });
  return c.json({ score: { correct, total: kc.questions.length }, results });
});

// ---------- capstone threading & the calibration trail ----------

// 201's premise is one build advanced across eight modules — so later stages
// see the earlier ones: the learner above the editor, the grader in its prompt.
async function priorStagesFor(db: DrizzleD1Database, sessionId: string, moduleId: string): Promise<PriorStage[]> {
  const modRows = await db.select().from(t.fdModule).where(eq(t.fdModule.id, moduleId)).limit(1);
  const mod = modRows[0];
  if (!mod || mod.courseId !== 'ai201' || mod.ordinal <= 1) return [];
  const priors = await db
    .select()
    .from(t.fdModule)
    .where(and(eq(t.fdModule.courseId, mod.courseId), lt(t.fdModule.ordinal, mod.ordinal)))
    .orderBy(asc(t.fdModule.ordinal));
  const stages: PriorStage[] = [];
  for (const p of priors) {
    const latest = await db
      .select()
      .from(t.fdSubmission)
      .where(and(eq(t.fdSubmission.sessionId, sessionId), eq(t.fdSubmission.moduleId, p.id)))
      .orderBy(desc(t.fdSubmission.createdAt))
      .limit(1);
    const s = latest[0];
    if (!s) continue;
    stages.push({ moduleId: p.id, ordinal: p.ordinal, title: p.title, body: s.body.slice(0, 6000), gradedAt: s.gradedAt, total: s.totalScore });
  }
  return stages;
}

// The learner's free-text prediction from a module's opening prompt, latest wins.
async function openingPredictionFor(db: DrizzleD1Database, sessionId: string, moduleId: string): Promise<string | null> {
  const events = await db
    .select({ payloadJson: t.fdEvent.payloadJson })
    .from(t.fdEvent)
    .where(and(eq(t.fdEvent.sessionId, sessionId), eq(t.fdEvent.type, 'module_calibration_recorded')))
    .orderBy(desc(t.fdEvent.createdAt));
  for (const e of events) {
    const p = JSON.parse(e.payloadJson ?? '{}') as { moduleId?: string; text?: string };
    if (p.moduleId === moduleId && p.text) return p.text;
  }
  return null;
}

// Everything the learner has predicted and what came of it — M7's reckoning
// and M8's portfolio render from this. Labels come from the seeded rubrics, so
// the trail needs no per-module code.
async function trailFor(db: DrizzleD1Database, sessionId: string): Promise<CalibrationTrail> {
  const rubricRows = await db.select().from(t.fdExercise).where(eq(t.fdExercise.kind, 'rubric'));
  const labels = new Map<string, string>();
  for (const row of rubricRows) {
    const r = JSON.parse(row.payloadJson) as RubricPayload;
    for (const f of [...(r.opening ?? []), ...(r.calibration ?? [])]) {
      // Fields with actualFor close another field's loop; they aren't loops themselves.
      if (!f.actualFor) labels.set(`${row.moduleId}:cal:${f.key}`, f.label);
    }
  }
  const calRows = await db.select().from(t.fdCalibration).where(eq(t.fdCalibration.sessionId, sessionId));
  const points: TrailPoint[] = [];
  for (const row of calRows) {
    const label = labels.get(row.context);
    if (!label) continue; // sorting and diagnostic calibration are summarized separately
    points.push({ moduleId: row.context.split(':')[0], label, predicted: row.predictedPct, actual: row.actualOutcome, delta: row.delta });
  }
  points.sort((a, b) => a.moduleId.localeCompare(b.moduleId));

  const events = await db
    .select({ type: t.fdEvent.type, payloadJson: t.fdEvent.payloadJson })
    .from(t.fdEvent)
    .where(and(eq(t.fdEvent.sessionId, sessionId), sql`${t.fdEvent.type} IN ('sort_submitted', 'module_calibration_recorded')`))
    .orderBy(asc(t.fdEvent.createdAt));
  const sorts = new Map<string, CalibrationTrail['sorts'][number]>();
  const predictions = new Map<string, string>();
  for (const e of events) {
    const p = JSON.parse(e.payloadJson ?? '{}') as { moduleId?: string; text?: string; correct?: number; total?: number; overAssigned?: number; underAssigned?: number };
    if (!p.moduleId) continue;
    if (e.type === 'sort_submitted' && typeof p.total === 'number') {
      sorts.set(p.moduleId, { moduleId: p.moduleId, correct: p.correct ?? 0, total: p.total, overAssigned: p.overAssigned ?? 0, underAssigned: p.underAssigned ?? 0 });
    } else if (e.type === 'module_calibration_recorded' && p.text) {
      predictions.set(p.moduleId, p.text);
    }
  }
  return {
    points,
    sorts: [...sorts.values()].sort((a, b) => a.moduleId.localeCompare(b.moduleId)),
    predictions: [...predictions.entries()].map(([moduleId, text]) => ({ moduleId, text })).sort((a, b) => a.moduleId.localeCompare(b.moduleId)),
  };
}

// ---------- applied activity & grading ----------

app.get('/api/module/:id/activity', async (c) => {
  const db = c.get('db');
  const session = requireSession(c);
  if (!session) return c.json({ error: 'No session.' }, 401);
  const moduleId = c.req.param('id');
  const rubric = await getExercise<RubricPayload>(db, moduleId, 'rubric');
  if (!rubric) return c.json({ error: 'This module has no graded activity.' }, 404);
  const blockRows = await db
    .select()
    .from(t.fdContentBlock)
    .where(eq(t.fdContentBlock.moduleId, `${moduleId}-activity`))
    .orderBy(asc(t.fdContentBlock.ordinal));
  const latest = await db
    .select()
    .from(t.fdSubmission)
    .where(and(eq(t.fdSubmission.sessionId, session.id), eq(t.fdSubmission.moduleId, moduleId)))
    .orderBy(desc(t.fdSubmission.createdAt))
    .limit(1);
  const last = latest[0];

  // Human reviews from the operator queue, across all of this session's
  // submissions to the module — a review of an earlier draft still counts.
  const reviewRows = await db
    .select({
      id: t.fdReview.id,
      reviewer: t.fdReview.reviewer,
      body: t.fdReview.body,
      score: t.fdReview.score,
      createdAt: t.fdReview.createdAt,
      submissionId: t.fdReview.submissionId,
    })
    .from(t.fdReview)
    .innerJoin(t.fdSubmission, eq(t.fdReview.submissionId, t.fdSubmission.id))
    .where(and(eq(t.fdSubmission.sessionId, session.id), eq(t.fdSubmission.moduleId, moduleId)))
    .orderBy(desc(t.fdReview.createdAt));

  const priorStages = await priorStagesFor(db, session.id, moduleId);
  const openingPrediction = await openingPredictionFor(db, session.id, moduleId);
  const trail = rubric.includeTrail ? await trailFor(db, session.id) : null;

  return c.json({
    blocks: selectVariants(blockRows, toolingOf(c.env)).map(toBlock),
    minChars: rubric.minChars ?? MIN_SUBMISSION_CHARS,
    intro: rubric.intro,
    submitLabel: rubric.submitLabel,
    calibration: rubric.calibration ?? [],
    priorStages,
    openingPrediction,
    trail,
    reviews: reviewRows.map((r) => ({
      id: r.id,
      reviewer: r.reviewer,
      body: r.body,
      score: r.score,
      createdAt: r.createdAt,
      onLatest: r.submissionId === last?.id,
    })),
    lastSubmission: last
      ? {
          id: last.id,
          body: last.body,
          gradedAt: last.gradedAt,
          total: last.totalScore,
          dimensions: last.rubricJson ? JSON.parse(last.rubricJson).dimensions : null,
          summary: last.rubricJson ? JSON.parse(last.rubricJson).summary : null,
        }
      : null,
  });
});

app.post('/api/module/:id/activity', async (c) => {
  const db = c.get('db');
  const session = requireSession(c);
  if (!session) return c.json({ error: 'No session.' }, 401);
  const moduleId = c.req.param('id');
  const rubric = await getExercise<RubricPayload>(db, moduleId, 'rubric');
  if (!rubric) return c.json({ error: 'This module has no graded activity.' }, 404);
  const minChars = rubric.minChars ?? MIN_SUBMISSION_CHARS;

  const body = await c.req.json<{ body?: string; calibration?: Record<string, number> }>().catch(() => null);
  const text = body?.body?.trim();
  if (!text || text.length < minChars) {
    return c.json({ error: `Keep going — the activity needs at least ${minChars} characters to be gradeable.` }, 400);
  }
  if (text.length > 40_000) return c.json({ error: 'That’s beyond what the grader will read. Trim to what the activity asks for.' }, 400);

  // Save first — grading can fail or be limited, the submission never gets lost.
  const submissionId = uuid();
  await db.insert(t.fdSubmission).values({
    id: submissionId,
    sessionId: session.id,
    moduleId,
    body: text,
    createdAt: now(),
  });
  await logEvent(db, session.id, 'activity_submitted', { moduleId, submissionId, chars: text.length });

  // Rubric-declared calibration fields → fd_calibration, before grading.
  // A plain field opens a prediction; an actualFor field closes one — the
  // measured value lands on the earlier prediction's row with its delta.
  const calibrationNotes: string[] = [];
  for (const field of rubric.calibration ?? []) {
    const value = Number(body?.calibration?.[field.key]);
    if (!Number.isFinite(value)) continue;
    const clamped = Math.max(field.min ?? 0, Math.min(field.max ?? 1_000_000, Math.round(value)));
    if (field.actualFor) {
      const [mod, key] = field.actualFor.includes(':') ? field.actualFor.split(':') : [moduleId, field.actualFor];
      const context = `${mod}:cal:${key}`;
      const rows = await db
        .select()
        .from(t.fdCalibration)
        .where(and(eq(t.fdCalibration.sessionId, session.id), eq(t.fdCalibration.context, context)))
        .limit(1);
      const prior = rows[0];
      if (prior) {
        await db.update(t.fdCalibration).set({ actualOutcome: clamped, delta: clamped - prior.predictedPct }).where(eq(t.fdCalibration.id, prior.id));
        calibrationNotes.push(`${field.label}: ${clamped} (they predicted ${prior.predictedPct}; miss of ${clamped - prior.predictedPct})`);
      } else {
        calibrationNotes.push(`${field.label}: ${clamped} (no earlier prediction on record to score against)`);
      }
      continue;
    }
    const context = `${moduleId}:cal:${field.key}`;
    await db.delete(t.fdCalibration).where(and(eq(t.fdCalibration.sessionId, session.id), eq(t.fdCalibration.context, context)));
    await db.insert(t.fdCalibration).values({
      id: uuid(),
      sessionId: session.id,
      context,
      predictedPct: clamped,
      actualOutcome: null,
      delta: null,
      createdAt: now(),
    });
    calibrationNotes.push(`${field.label}: ${clamped}`);
  }

  const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const recent = await db
    .select({ n: sql<number>`count(*)` })
    .from(t.fdSubmission)
    .where(and(eq(t.fdSubmission.sessionId, session.id), gt(t.fdSubmission.createdAt, hourAgo)));
  if ((recent[0]?.n ?? 0) > GRADE_LIMIT_PER_HOUR) {
    const res: GradeResult = {
      status: 'rate_limited',
      submissionId,
      message: 'Your submission is saved. Grading is limited to five passes an hour — come back shortly and resubmit to grade this version.',
    };
    return c.json(res);
  }

  if (!c.env.ANTHROPIC_API_KEY) {
    const res: GradeResult = {
      status: 'saved_ungraded',
      submissionId,
      message: 'Your submission is saved. Grading is unavailable right now — resubmit later to get rubric feedback.',
    };
    return c.json(res);
  }

  // The grader sees the build so far and the module-opening prediction, so
  // stage feedback can reference the actual spec and score honesty on record.
  const stages = await priorStagesFor(db, session.id, moduleId);
  const priorContext = stages.length
    ? stages
        .map((s) => {
          const graded = s.total !== null ? ` (graded ${s.total})` : ' (ungraded)';
          const bodyText = s.body.length > 2500 ? `${s.body.slice(0, 2500)}\n[truncated]` : s.body;
          return `Stage ${s.ordinal} — ${s.title}${graded}:\n${bodyText}`;
        })
        .join('\n\n')
    : null;
  const opening = await openingPredictionFor(db, session.id, moduleId);
  if (opening) calibrationNotes.unshift(`Opening prediction, recorded at the top of the module: "${opening.slice(0, 500)}"`);

  const grade = await gradeSubmission(
    c.env.ANTHROPIC_API_KEY,
    c.env.GRADING_MODEL,
    rubric,
    text,
    calibrationNotes.length ? calibrationNotes.join(' · ') : null,
    priorContext,
  );
  if (!grade) {
    const res: GradeResult = {
      status: 'saved_ungraded',
      submissionId,
      message: 'Your submission is saved. Grading is unavailable right now — nothing was lost, and you can resubmit to grade this version.',
    };
    return c.json(res);
  }

  await db
    .update(t.fdSubmission)
    .set({
      rubricJson: JSON.stringify({ dimensions: grade.dimensions, summary: grade.summary }),
      totalScore: grade.total,
      modelUsed: c.env.GRADING_MODEL,
      promptVersion: rubric.promptVersion,
      gradedAt: now(),
    })
    .where(eq(t.fdSubmission.id, submissionId));
  await logEvent(db, session.id, 'activity_graded', { moduleId, submissionId, total: grade.total });

  const res: GradeResult = { status: 'graded', submissionId, dimensions: grade.dimensions, total: grade.total, summary: grade.summary };
  return c.json(res);
});

// ---------- podcast creator ----------

type PodcastRow = typeof t.fdPodcast.$inferSelect;

function toEpisode(row: PodcastRow): PodcastEpisode {
  const body = JSON.parse(row.scriptJson) as PodcastLine[];
  const intro = row.introJson ? (JSON.parse(row.introJson) as PodcastLine[]) : [];
  const assembled = intro.length > 0;
  const lines = assembled ? [...intro, ...body] : body;
  // Episodes voiced before chunked playback have one whole-episode MP3 in the
  // cache; assembled episodes play a pre-voiced intro chunk then body chunks;
  // everything else streams custom chunks.
  const legacySingle = !assembled && row.audioKey !== null && row.audioKey.endsWith('.mp3');
  const totalChars = lines.reduce((sum, l) => sum + l.text.length, 0) || row.totalChars;
  return {
    id: row.id,
    moduleId: row.moduleId,
    kind: row.kind === 'qa' ? 'qa' : 'default',
    audioMode: assembled ? 'assembled' : legacySingle ? 'single' : 'chunked',
    chunkCount: assembled ? 1 + (body.length ? chunkPlan(body).length : 0) : legacySingle ? 1 : chunkPlan(lines).length,
    introLineCount: intro.length,
    bodyPending: assembled && body.length === 0,
    title: row.title,
    description: row.description,
    lengthPref: row.lengthPref as PodcastLength,
    promptText: row.promptText,
    lines,
    outline: row.outlineJson ? (JSON.parse(row.outlineJson) as PodcastOutlinePoint[]) : null,
    takeaways: row.takeawaysJson ? (JSON.parse(row.takeawaysJson) as string[]) : null,
    visual: row.visualJson ? (JSON.parse(row.visualJson) as PodcastVisual) : null,
    estMinutes: estMinutes(totalChars),
    audioCached: row.audioKey !== null,
    createdAt: row.createdAt,
  };
}

app.get('/api/podcast', async (c) => {
  const db = c.get('db');
  const session = requireSession(c);
  if (!session) return c.json({ error: 'No session.' }, 401);
  const rows = await db
    .select()
    .from(t.fdPodcast)
    .where(eq(t.fdPodcast.sessionId, session.id))
    .orderBy(desc(t.fdPodcast.createdAt));
  const episodes: PodcastSummary[] = rows.map((row) => {
    const { lines: _lines, outline: _outline, takeaways: _takeaways, visual: _visual, ...summary } = toEpisode(row);
    return summary;
  });
  const playedRows = await db
    .select()
    .from(t.fdEvent)
    .where(and(eq(t.fdEvent.sessionId, session.id), eq(t.fdEvent.type, 'podcast_played')));
  const playedEpisodeIds = [
    ...new Set(
      playedRows
        .map((e) => (e.payloadJson ? (JSON.parse(e.payloadJson) as { podcastId?: string }).podcastId : null))
        .filter((id): id is string => Boolean(id)),
    ),
  ];
  const res: PodcastListResponse = {
    episodes,
    playedEpisodeIds,
    scriptEnabled: Boolean(c.env.ANTHROPIC_API_KEY),
    audioEnabled: Boolean(c.env.AI || c.env.GEMINI_API_KEY),
    audioPrerenders: Boolean((c.env.AI || c.env.GEMINI_API_KEY) && c.env.PODCAST_AUDIO),
  };
  return c.json(res);
});

// Everything writeScript needs to know about this learner — name, role,
// goals, depth, diagnostic — so every episode is unmistakably theirs.
async function podcastLearner(db: DrizzleD1Database, sessionId: string): Promise<LearnerContext> {
  const participants = await db
    .select()
    .from(t.fdParticipant)
    .where(eq(t.fdParticipant.sessionId, sessionId))
    .orderBy(desc(t.fdParticipant.createdAt))
    .limit(1);
  const prefs = await loadPrefs(db, sessionId);
  const diag = await computeDiagnosticResult(db, sessionId);
  return {
    name: participants[0]?.displayName ?? null,
    role: participants[0]?.roleLabel ?? null,
    objective: prefs.objective ?? null,
    calibrationHeadline: diag.calibration.points.length > 0 ? diag.calibration.headline : null,
    goals: GOAL_CHOICES.filter((g) => (prefs.goals ?? []).includes(g.id)).map((g) => g.label),
    depth: depthOf(prefs.depth),
  };
}

// ---------- the instant layer ----------
//
// Personalization moved earlier in time. Baked per module: a stock episode
// (intro previewing fixed beats + full fallback body) and study assets. Baked
// per goal: a flavored intro. Generated per learner at intake: a personal
// intro. At request time only the custom body generates — while a pre-voiced
// intro is already playing.

type StockRow = typeof t.fdPodcastStock.$inferSelect;

const stockIntroKey = (moduleId: string, variant: string) => `podcast-stock/${moduleId}/${variant}/intro.mp3`;
const stockBodyChunkKey = (moduleId: string, i: number) => `podcast-stock/${moduleId}/generic/body-c${i}.mp3`;
const personalIntroKey = (sessionId: string, moduleId: string) => `podcast-intro/${sessionId}/${moduleId}.mp3`;

async function moduleContent(db: DrizzleD1Database, env: Env, moduleId: string) {
  const modRows = await db.select().from(t.fdModule).where(eq(t.fdModule.id, moduleId)).limit(1);
  const mod = modRows[0];
  if (!mod || mod.status !== 'open') return null;
  const blockRows = await db
    .select()
    .from(t.fdContentBlock)
    .where(eq(t.fdContentBlock.moduleId, moduleId))
    .orderBy(asc(t.fdContentBlock.ordinal));
  if (blockRows.length === 0) return null;
  const blocks = selectVariants(blockRows, toolingOf(env)).filter((b) => b.kind !== 'exercise');
  const contentMd = blocks.map((b) => b.body).join('\n\n');
  const reviewedAt = blocks.reduce((max, b) => (b.reviewedAt > max ? b.reviewedAt : max), '');
  return { mod, contentMd, reviewedAt };
}

const loadStock = async (db: DrizzleD1Database, moduleId: string, variant: string): Promise<StockRow | null> => {
  const rows = await db
    .select()
    .from(t.fdPodcastStock)
    .where(and(eq(t.fdPodcastStock.moduleId, moduleId), eq(t.fdPodcastStock.variant, variant)))
    .orderBy(desc(t.fdPodcastStock.bakedAt))
    .limit(1);
  return rows[0] ?? null;
};

async function voiceIntroToR2(env: Env, lines: PodcastLine[], key: string): Promise<{ key: string; engine: TtsEngine } | null> {
  if ((!env.AI && !env.GEMINI_API_KEY) || !env.PODCAST_AUDIO) return null;
  const rendered = await renderChunkAudio(env, lines);
  if (!rendered) return null;
  await env.PODCAST_AUDIO.put(key, rendered.bytes, { httpMetadata: { contentType: rendered.contentType } });
  return { key, engine: rendered.contentType === 'audio/wav' ? 'gemini' : 'aura' };
}

// Which engine voiced an already-stored intro, read off the R2 object's content
// type (Gemini renders WAV, Aura MP3) — the pin for every later render in that
// episode, so the hosts keep the same voices across the intro/body seam.
async function introEngine(env: Env, introAudioKey: string | null): Promise<TtsEngine | undefined> {
  if (!introAudioKey || !env.PODCAST_AUDIO) return undefined;
  const head = await env.PODCAST_AUDIO.head(introAudioKey).catch(() => null);
  const ct = head?.httpMetadata?.contentType;
  return ct === 'audio/wav' ? 'gemini' : ct === 'audio/mpeg' ? 'aura' : undefined;
}

// Bake the generic stock episode for a module: one stock-script call, one study
// call, intro + body voiced into R2. Self-healing — re-bakes when module
// content's reviewedAt moves. Silent on failure; the legacy path still works.
async function bakeStock(env: Env, moduleId: string): Promise<void> {
  if (!env.ANTHROPIC_API_KEY) return;
  try {
    const db = drizzle(env.DB);
    const content = await moduleContent(db, env, moduleId);
    if (!content) return;
    const existing = await loadStock(db, moduleId, 'generic');
    if (existing && existing.contentReviewedAt === content.reviewedAt && existing.promptVersion === PODCAST_PROMPT_VERSION) return;
    const model = env.PODCAST_MODEL ?? env.GRADING_MODEL;
    const draft = await writeStock(env.ANTHROPIC_API_KEY, model, content.mod.title, content.contentMd);
    if (!draft) return;
    const study = await writeStudy(
      env.ANTHROPIC_API_KEY,
      env.STUDY_MODEL ?? model,
      content.mod.title,
      content.contentMd,
      [...draft.intro, ...draft.body],
      'default',
    ).catch(() => null);
    const introVoiced = await voiceIntroToR2(env, draft.intro, stockIntroKey(moduleId, 'generic'));
    const introAudioKey = introVoiced?.key ?? null;
    if ((env.AI || env.GEMINI_API_KEY) && env.PODCAST_AUDIO) {
      const bodyChunks = chunkPlan(draft.body);
      await Promise.all(
        bodyChunks.map(async (ch, i) => {
          const rendered = await renderChunkAudio(env, draft.body.slice(ch.start, ch.end), introVoiced?.engine);
          if (rendered) {
            await env.PODCAST_AUDIO!.put(stockBodyChunkKey(moduleId, i), rendered.bytes, { httpMetadata: { contentType: rendered.contentType } });
          }
        }),
      );
    }
    await db.delete(t.fdPodcastStock).where(and(eq(t.fdPodcastStock.moduleId, moduleId), eq(t.fdPodcastStock.variant, 'generic')));
    await db.insert(t.fdPodcastStock).values({
      id: uuid(),
      moduleId,
      variant: 'generic',
      beatsJson: JSON.stringify(draft.beats),
      introJson: JSON.stringify(draft.intro),
      bodyJson: JSON.stringify(draft.body),
      outlineJson: draft.outline ? JSON.stringify(draft.outline) : null,
      takeawaysJson: study?.takeaways ? JSON.stringify(study.takeaways) : null,
      visualJson: study?.visual ? JSON.stringify(study.visual) : null,
      introAudioKey,
      title: draft.title,
      description: draft.description,
      modelUsed: model,
      promptVersion: PODCAST_PROMPT_VERSION,
      contentReviewedAt: content.reviewedAt,
      bakedAt: now(),
    });
    await logEvent(db, null, 'podcast_stock_baked', { moduleId, variant: 'generic' });
  } catch {
    // Background work — cold arrivals fall back to the legacy path.
  }
}

// Bake a goal-flavored intro over the generic beats. Lazy: only for goals a
// real learner actually holds.
async function bakeGoalIntro(env: Env, moduleId: string, goalId: string): Promise<void> {
  if (!env.ANTHROPIC_API_KEY) return;
  try {
    const db = drizzle(env.DB);
    const generic = await loadStock(db, moduleId, 'generic');
    if (!generic) return;
    const existing = await loadStock(db, moduleId, goalId);
    if (existing && existing.contentReviewedAt === generic.contentReviewedAt && existing.promptVersion === PODCAST_PROMPT_VERSION) return;
    const content = await moduleContent(db, env, moduleId);
    if (!content) return;
    const model = env.PODCAST_MODEL ?? env.GRADING_MODEL;
    const lines = await writeStockIntro(
      env.ANTHROPIC_API_KEY,
      model,
      content.mod.title,
      content.contentMd,
      JSON.parse(generic.beatsJson) as string[],
      goalLabel(goalId),
    );
    if (!lines) return;
    const introAudioKey = (await voiceIntroToR2(env, lines, stockIntroKey(moduleId, goalId)))?.key ?? null;
    await db.delete(t.fdPodcastStock).where(and(eq(t.fdPodcastStock.moduleId, moduleId), eq(t.fdPodcastStock.variant, goalId)));
    await db.insert(t.fdPodcastStock).values({
      id: uuid(),
      moduleId,
      variant: goalId,
      beatsJson: generic.beatsJson,
      introJson: JSON.stringify(lines),
      bodyJson: null,
      outlineJson: null,
      takeawaysJson: null,
      visualJson: null,
      introAudioKey,
      title: generic.title,
      description: generic.description,
      modelUsed: model,
      promptVersion: PODCAST_PROMPT_VERSION,
      contentReviewedAt: generic.contentReviewedAt,
      bakedAt: now(),
    });
    await logEvent(db, null, 'podcast_stock_baked', { moduleId, variant: goalId });
  } catch {
    // Background work.
  }
}

// The learner's next podcast-less open module — where pre-warming aims.
// Keep every open module's stock episode fresh — runs on the cron trigger, so
// no learner ever pays the cold-bake toll. Steady-state runs find everything
// fresh and bake nothing; after a content edit or prompt-version bump, each
// run bakes up to a few modules until the catalog is warm again.
async function warmAllStock(env: Env): Promise<void> {
  if (!env.ANTHROPIC_API_KEY) return;
  try {
    const db = drizzle(env.DB);
    const mods = await db
      .select()
      .from(t.fdModule)
      .where(eq(t.fdModule.status, 'open'))
      .orderBy(asc(t.fdModule.courseId), asc(t.fdModule.ordinal));
    let budget = 3; // stale bakes per run — keeps a single run's work bounded
    for (const mod of mods) {
      if (budget <= 0) break;
      const existing = await loadStock(db, mod.id, 'generic');
      if (existing && existing.promptVersion === PODCAST_PROMPT_VERSION) {
        const content = await moduleContent(db, env, mod.id);
        if (!content || existing.contentReviewedAt === content.reviewedAt) continue;
      }
      await bakeStock(env, mod.id);
      budget -= 1;
    }
  } catch {
    // Cron work — the next tick tries again.
  }
}

async function nextPodcastModule(db: DrizzleD1Database, sessionId: string) {
  const mods = await db
    .select()
    .from(t.fdModule)
    .where(eq(t.fdModule.status, 'open'))
    .orderBy(asc(t.fdModule.courseId), asc(t.fdModule.ordinal));
  for (const mod of mods) {
    const existing = await db
      .select({ n: sql<number>`count(*)` })
      .from(t.fdPodcast)
      .where(and(eq(t.fdPodcast.sessionId, sessionId), eq(t.fdPodcast.moduleId, mod.id), eq(t.fdPodcast.kind, 'default')));
    if ((existing[0]?.n ?? 0) === 0) return mod;
  }
  return null;
}

// The personal intro: generated in the background at intake / module
// completion, so the hook — their name, in natural speech — is waiting before
// they reach the podcast page.
async function preparePersonalIntro(env: Env, sessionId: string, moduleId: string): Promise<void> {
  if (!env.ANTHROPIC_API_KEY) return;
  try {
    const db = drizzle(env.DB);
    const existing = await db
      .select()
      .from(t.fdPodcastIntro)
      .where(and(eq(t.fdPodcastIntro.sessionId, sessionId), eq(t.fdPodcastIntro.moduleId, moduleId)))
      .limit(1);
    if (existing[0]?.promptVersion === PODCAST_PROMPT_VERSION) return;
    let generic = await loadStock(db, moduleId, 'generic');
    if (!generic) {
      await bakeStock(env, moduleId);
      generic = await loadStock(db, moduleId, 'generic');
      if (!generic) return;
    }
    const content = await moduleContent(db, env, moduleId);
    if (!content) return;
    const learner = await podcastLearner(db, sessionId);
    const model = env.PODCAST_MODEL ?? env.GRADING_MODEL;
    const lines = await writePersonalIntro(
      env.ANTHROPIC_API_KEY,
      model,
      content.mod.title,
      content.contentMd,
      JSON.parse(generic.beatsJson) as string[],
      learner,
    );
    if (!lines) return;
    const audioKey = (await voiceIntroToR2(env, lines, personalIntroKey(sessionId, moduleId)))?.key ?? null;
    if (existing[0]) await db.delete(t.fdPodcastIntro).where(eq(t.fdPodcastIntro.id, existing[0].id));
    await db.insert(t.fdPodcastIntro).values({
      id: uuid(),
      sessionId,
      moduleId,
      introJson: JSON.stringify(lines),
      audioKey,
      promptVersion: PODCAST_PROMPT_VERSION,
      createdAt: now(),
    });
    await logEvent(db, sessionId, 'podcast_intro_ready', { moduleId });
  } catch {
    // Background work.
  }
}

// Create an assembled episode instantly: pick the best pre-voiced intro
// (personal > goal-flavored > generic), copy the stock study assets in, and
// return with the body still to come. Null when no voiced intro exists yet —
// the caller falls back to the legacy full-script path.
async function createAssembledEpisode(
  env: Env,
  db: DrizzleD1Database,
  sessionId: string,
  moduleId: string,
  length: PodcastLength,
): Promise<PodcastRow | null> {
  const generic = await loadStock(db, moduleId, 'generic');
  if (!generic) return null;
  const prefs = await loadPrefs(db, sessionId);
  const goalId = (prefs.goals ?? [])[0] ?? null;

  const personal = await db
    .select()
    .from(t.fdPodcastIntro)
    .where(and(eq(t.fdPodcastIntro.sessionId, sessionId), eq(t.fdPodcastIntro.moduleId, moduleId)))
    .limit(1);
  const goalStock = goalId ? await loadStock(db, moduleId, goalId) : null;

  let introJson: string;
  let introAudioKey: string;
  let introSource: string;
  if (personal[0]?.audioKey) {
    introJson = personal[0].introJson;
    introAudioKey = personal[0].audioKey;
    introSource = 'personal';
  } else if (goalStock?.introAudioKey) {
    introJson = goalStock.introJson;
    introAudioKey = goalStock.introAudioKey;
    introSource = `goal:${goalId}`;
  } else if (generic.introAudioKey) {
    introJson = generic.introJson;
    introAudioKey = generic.introAudioKey;
    introSource = 'generic';
  } else {
    return null;
  }

  const introLines = JSON.parse(introJson) as PodcastLine[];
  const row: PodcastRow = {
    id: uuid(),
    sessionId,
    moduleId,
    kind: 'default',
    promptText: null,
    lengthPref: length,
    title: generic.title ?? 'Your episode',
    description: generic.description ?? '',
    scriptJson: '[]',
    outlineJson: null,
    takeawaysJson: generic.takeawaysJson,
    visualJson: generic.visualJson,
    totalChars: introLines.reduce((sum, l) => sum + l.text.length, 0),
    modelUsed: env.PODCAST_MODEL ?? env.GRADING_MODEL,
    promptVersion: PODCAST_PROMPT_VERSION,
    voiceA: VOICE_A,
    voiceB: VOICE_B,
    audioKey: null,
    audioBytes: null,
    audioAt: null,
    introJson,
    introAudioKey,
    introSource,
    createdAt: now(),
  };
  await db.insert(t.fdPodcast).values(row);
  await logEvent(db, sessionId, 'podcast_started', { podcastId: row.id, moduleId, introSource });
  return row;
}

// Write and voice the custom body while the intro plays. On failure, adopt the
// stock body (lines + copied audio) so the episode always completes.
async function completeAssembledBody(env: Env, row: PodcastRow): Promise<void> {
  try {
    const db = drizzle(env.DB);
    const generic = await loadStock(db, row.moduleId, 'generic');
    const content = await moduleContent(db, env, row.moduleId);
    const introLines = JSON.parse(row.introJson ?? '[]') as PodcastLine[];
    const beats = generic ? (JSON.parse(generic.beatsJson) as string[]) : [];

    let bodyLines: PodcastLine[] | null = null;
    let outline: PodcastOutlinePoint[] | null = null;
    let title = row.title;
    let description = row.description;
    let fallback = false;

    if (env.ANTHROPIC_API_KEY && content && beats.length > 0) {
      const learner = await podcastLearner(db, row.sessionId);
      const model = env.PODCAST_MODEL ?? env.GRADING_MODEL;
      const draft = await writeCustomBody(
        env.ANTHROPIC_API_KEY,
        model,
        content.mod.title,
        content.contentMd,
        learner,
        row.promptText,
        introLines,
        beats,
        row.lengthPref as PodcastLength,
      );
      if (draft) {
        bodyLines = draft.lines;
        if (draft.title) title = draft.title;
        if (draft.description) description = draft.description;
        outline = [
          { point: 'The welcome', startLine: 0 },
          ...(draft.outline ?? []).map((o) => ({ ...o, startLine: o.startLine + introLines.length })),
        ];
      }
    }

    if (!bodyLines && generic?.bodyJson) {
      // Stock body fallback: adopt the lines and copy the baked audio chunks
      // into this episode's key space so the ordinary chunk route serves them.
      fallback = true;
      bodyLines = JSON.parse(generic.bodyJson) as PodcastLine[];
      outline = generic.outlineJson ? (JSON.parse(generic.outlineJson) as PodcastOutlinePoint[]) : null;
      if (env.PODCAST_AUDIO) {
        const bodyChunks = chunkPlan(bodyLines);
        await Promise.all(
          bodyChunks.map(async (_ch, i) => {
            const src = await env.PODCAST_AUDIO!.get(stockBodyChunkKey(row.moduleId, i));
            if (src) {
              const bytes = new Uint8Array(await src.arrayBuffer());
              await env.PODCAST_AUDIO!.put(chunkKey(row.id, i), bytes, {
                httpMetadata: { contentType: src.httpMetadata?.contentType ?? 'audio/mpeg' },
              });
            }
          }),
        );
      }
    }
    if (!bodyLines) return;

    const totalChars = [...introLines, ...bodyLines].reduce((sum, l) => sum + l.text.length, 0);
    await db
      .update(t.fdPodcast)
      .set({
        scriptJson: JSON.stringify(bodyLines),
        outlineJson: outline ? JSON.stringify(outline) : null,
        title,
        description,
        totalChars,
      })
      .where(eq(t.fdPodcast.id, row.id));
    const elapsed = Date.now() - new Date(row.createdAt).getTime();
    await logEvent(db, row.sessionId, 'podcast_body_ready', { podcastId: row.id, ms: elapsed, fallback });

    if (!fallback) {
      // Pin the body to whichever engine voiced this episode's intro — the
      // hosts must not change voices at the seam.
      const pin = await introEngine(env, row.introAudioKey);
      await renderVoicesToCache(env, { ...row, scriptJson: JSON.stringify(bodyLines) }, 'create', pin);
    } else {
      await db
        .update(t.fdPodcast)
        .set({ audioKey: `podcast/${row.id}/`, audioAt: now() })
        .where(and(eq(t.fdPodcast.id, row.id), sql`${t.fdPodcast.audioKey} IS NULL`));
    }
  } catch {
    // The chunk route's wait-and-render path remains the safety net.
  }
}

// One episode, generated and stored. Shared by the manual button, the Q&A
// follow-up, and background pregeneration. Null on any failure — callers
// answer gracefully (or, for pregen, silently).
async function generateEpisode(
  env: Env,
  db: DrizzleD1Database,
  sessionId: string,
  moduleId: string,
  kind: 'default' | 'qa',
  focus: string | null,
  length: PodcastLength,
): Promise<PodcastRow | null> {
  if (!env.ANTHROPIC_API_KEY) return null;
  const modRows = await db.select().from(t.fdModule).where(eq(t.fdModule.id, moduleId)).limit(1);
  const mod = modRows[0];
  if (!mod || mod.status !== 'open') return null;

  // Source: the module's readable blocks, in order. Exercise blocks carry JSON
  // payloads, not prose — the hosts can't read those aloud.
  const blockRows = await db
    .select()
    .from(t.fdContentBlock)
    .where(eq(t.fdContentBlock.moduleId, moduleId))
    .orderBy(asc(t.fdContentBlock.ordinal));
  if (blockRows.length === 0) return null;
  const contentMd = selectVariants(blockRows, toolingOf(env))
    .filter((b) => b.kind !== 'exercise')
    .map((b) => b.body)
    .join('\n\n');

  // Q&A hosts remember what this listener actually heard: their module episode
  // and earlier follow-ups ride along so "like we said…" references land true
  // and answered questions get built on, not repeated. Capped at the module
  // episode + the last three follow-ups to keep the prompt bounded.
  let heard: HeardEpisode[] = [];
  if (kind === 'qa') {
    const prior = await db
      .select()
      .from(t.fdPodcast)
      .where(and(eq(t.fdPodcast.sessionId, sessionId), eq(t.fdPodcast.moduleId, moduleId)))
      .orderBy(asc(t.fdPodcast.createdAt));
    heard = [...prior.filter((p) => p.kind === 'default'), ...prior.filter((p) => p.kind === 'qa').slice(-3)].map((p) => ({
      title: p.title,
      lines: [
        ...(p.introJson ? (JSON.parse(p.introJson) as PodcastLine[]) : []),
        ...(JSON.parse(p.scriptJson) as PodcastLine[]),
      ],
    }));
  }

  const learner = await podcastLearner(db, sessionId);
  const model = env.PODCAST_MODEL ?? env.GRADING_MODEL;
  const script = await writeScript(env.ANTHROPIC_API_KEY, model, mod.title, contentMd, learner, focus, length, kind, heard);
  if (!script) return null;

  // The default episode is one-per-module — re-check just before insert so a
  // pregen racing a button click doesn't double up.
  if (kind === 'default') {
    const existing = await db
      .select({ n: sql<number>`count(*)` })
      .from(t.fdPodcast)
      .where(and(eq(t.fdPodcast.sessionId, sessionId), eq(t.fdPodcast.moduleId, moduleId), eq(t.fdPodcast.kind, 'default')));
    if ((existing[0]?.n ?? 0) > 0) return null;
  }

  const row: PodcastRow = {
    id: uuid(),
    sessionId,
    moduleId,
    kind,
    promptText: focus,
    lengthPref: length,
    title: script.title,
    description: script.description,
    scriptJson: JSON.stringify(script.lines),
    outlineJson: script.outline ? JSON.stringify(script.outline) : null,
    takeawaysJson: null, // filled by the background study call
    visualJson: null,
    totalChars: script.lines.reduce((sum, l) => sum + l.text.length, 0),
    modelUsed: model,
    promptVersion: PODCAST_PROMPT_VERSION,
    voiceA: VOICE_A,
    voiceB: VOICE_B,
    audioKey: null,
    audioBytes: null,
    audioAt: null,
    introJson: null,
    introAudioKey: null,
    introSource: null,
    createdAt: now(),
  };
  await db.insert(t.fdPodcast).values(row);
  await logEvent(db, sessionId, 'podcast_script_ready', { podcastId: row.id, kind, turns: script.lines.length, chars: row.totalChars });
  return row;
}

const chunkKey = (podcastId: string, i: number) => `podcast/${podcastId}/c${i}.mp3`;

// Voice an episode into the R2 cache, chunk by chunk in playback order, so the
// player can start on the first chunk while later ones are still recording.
// Runs in the background (waitUntil) after every script — manual or
// pregenerated. Needs both bindings: without R2 there is nowhere to put the
// result, and the chunk route's live render still covers first listen.
// Failures are silent for the same reason. Skips chunks another path (a live
// listen racing ahead of this task) already rendered.
async function renderVoicesToCache(env: Env, row: PodcastRow, trigger: 'create' | 'pregen', pin?: TtsEngine): Promise<void> {
  if ((!env.AI && !env.GEMINI_API_KEY) || !env.PODCAST_AUDIO) return;
  try {
    const db = drizzle(env.DB);
    const lines = JSON.parse(row.scriptJson) as PodcastLine[];
    const plan = chunkPlan(lines);
    // All chunks render concurrently — wall time collapses to the slowest
    // single chunk instead of the sum, which is what keeps playback (already
    // running on chunk 0) from ever catching up to the render.
    const sizes = await Promise.all(
      plan.map(async (ch, i) => {
        const key = chunkKey(row.id, i);
        const existing = await env.PODCAST_AUDIO!.head(key);
        if (existing) return existing.size;
        const audio = await renderChunkAudio(env, lines.slice(ch.start, ch.end), pin);
        if (!audio) return null;
        await env.PODCAST_AUDIO!.put(key, audio.bytes, { httpMetadata: { contentType: audio.contentType } });
        return audio.bytes.length;
      }),
    );
    if (sizes.some((size) => size === null)) return; // a failed chunk → lazy render covers it
    const bytesTotal = sizes.reduce((sum: number, size) => sum + (size ?? 0), 0);
    await db
      .update(t.fdPodcast)
      .set({ audioKey: `podcast/${row.id}/`, audioBytes: bytesTotal, audioAt: now() })
      .where(and(eq(t.fdPodcast.id, row.id), sql`${t.fdPodcast.audioKey} IS NULL`));
    await logEvent(db, row.sessionId, 'podcast_audio_rendered', {
      podcastId: row.id,
      bytes: bytesTotal,
      chunks: plan.length,
      cached: true,
      trigger,
      engine: env.GEMINI_API_KEY ? 'gemini' : 'aura',
    });
  } catch {
    // Background work — the chunk route's live render remains the safety net.
  }
}

const podcastHourlyLimit = (env: Env) => Math.max(1, Number(env.PODCAST_LIMIT_PER_HOUR) || 4);

async function underPodcastLimit(db: DrizzleD1Database, sessionId: string, env: Env): Promise<boolean> {
  const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const recent = await db
    .select({ n: sql<number>`count(*)` })
    .from(t.fdPodcast)
    .where(and(eq(t.fdPodcast.sessionId, sessionId), gt(t.fdPodcast.createdAt, hourAgo)));
  return (recent[0]?.n ?? 0) < podcastHourlyLimit(env);
}

const defaultLengthFor = (depth: ReturnType<typeof depthOf>): PodcastLength =>
  depth === 'essentials' ? 'quick' : depth === 'deep' ? 'deep' : 'standard';

// Generate the study companion (takeaways + one focused concept model) in the
// background and attach it to the row. Playback never waits on this; the page
// shows the cards when they land. Silent failure = no study card, not an error.
async function attachStudy(env: Env, row: PodcastRow): Promise<void> {
  if (!env.ANTHROPIC_API_KEY) return;
  try {
    const db = drizzle(env.DB);
    const modRows = await db.select().from(t.fdModule).where(eq(t.fdModule.id, row.moduleId)).limit(1);
    const blockRows = await db
      .select()
      .from(t.fdContentBlock)
      .where(eq(t.fdContentBlock.moduleId, row.moduleId))
      .orderBy(asc(t.fdContentBlock.ordinal));
    const contentMd = blockRows
      .filter((b) => b.kind !== 'exercise')
      .map((b) => b.body)
      .join('\n\n');
    const model = env.STUDY_MODEL ?? env.PODCAST_MODEL ?? env.GRADING_MODEL;
    const study = await writeStudy(
      env.ANTHROPIC_API_KEY,
      model,
      modRows[0]?.title ?? row.moduleId,
      contentMd,
      JSON.parse(row.scriptJson) as PodcastLine[],
      row.kind === 'qa' ? 'qa' : 'default',
    );
    if (!study) return;
    await db
      .update(t.fdPodcast)
      .set({
        takeawaysJson: study.takeaways ? JSON.stringify(study.takeaways) : null,
        visualJson: study.visual ? JSON.stringify(study.visual) : null,
      })
      .where(eq(t.fdPodcast.id, row.id));
    await logEvent(db, row.sessionId, 'podcast_study_ready', {
      podcastId: row.id,
      takeaways: study.takeaways?.length ?? 0,
      hasVisual: Boolean(study.visual),
    });
  } catch {
    // Background work — the episode simply has no study card.
  }
}

// Background pregeneration for learners who said podcasts are how they learn:
// the next module they can enter gets its episode written before they arrive.
// Costs one script call, so it only fires for podcast-first learners, one
// module at a time, inside the same hourly cap as manual generation.
async function pregenerateNextPodcast(env: Env, sessionId: string): Promise<void> {
  try {
    const db = drizzle(env.DB);
    const mod = await nextPodcastModule(db, sessionId);
    if (!mod) return;

    // Everyone gets the pre-warm: stock baked, goal intro flavored, personal
    // intro voiced — so arrival is instant whatever their learning style.
    await bakeStock(env, mod.id);
    const prefs = await loadPrefs(db, sessionId);
    const goalId = (prefs.goals ?? [])[0];
    if (goalId) await bakeGoalIntro(env, mod.id, goalId);
    await preparePersonalIntro(env, sessionId, mod.id);

    // Podcast-pickers additionally get the whole episode — body written and
    // voiced — waiting before they arrive.
    if (!(prefs.styles ?? []).includes('podcast')) return;
    if (!env.ANTHROPIC_API_KEY) return;
    if (!(await underPodcastLimit(db, sessionId, env))) return;
    await logEvent(db, sessionId, 'podcast_requested', { moduleId: mod.id, kind: 'default', trigger: 'pregen' });
    const length = defaultLengthFor(depthOf(prefs.depth));
    const row = await createAssembledEpisode(env, db, sessionId, mod.id, length);
    if (row) {
      await completeAssembledBody(env, row);
    } else {
      const legacy = await generateEpisode(env, db, sessionId, mod.id, 'default', null, length);
      if (legacy) await Promise.all([renderVoicesToCache(env, legacy, 'pregen'), attachStudy(env, legacy)]);
    }
  } catch {
    // Background work: a failure here costs nothing the learner can see —
    // the podcast page falls back to on-demand generation.
  }
}

app.post('/api/podcast', async (c) => {
  const db = c.get('db');
  const session = requireSession(c);
  if (!session) return c.json({ error: 'No session.' }, 401);
  const body = await c.req.json<{ moduleId?: string; kind?: string; question?: string }>().catch(() => null);
  if (!body) return c.json({ error: 'Malformed request.' }, 400);

  const moduleId = body.moduleId ?? 'ai101-m1';
  const kind: 'default' | 'qa' = body.kind === 'qa' ? 'qa' : 'default';

  const modRows = await db.select().from(t.fdModule).where(eq(t.fdModule.id, moduleId)).limit(1);
  const mod = modRows[0];
  if (!mod || mod.status !== 'open') return c.json({ error: 'Episodes can only be made from open modules.' }, 400);

  if (!c.env.ANTHROPIC_API_KEY) {
    return c.json({ error: 'The scriptwriter is not configured in this deployment, so episodes cannot be generated yet.' }, 503);
  }

  const defaultRows = await db
    .select()
    .from(t.fdPodcast)
    .where(and(eq(t.fdPodcast.sessionId, session.id), eq(t.fdPodcast.moduleId, moduleId), eq(t.fdPodcast.kind, 'default')))
    .limit(1);
  const existingDefault = defaultRows[0] ?? null;

  const prefs = await loadPrefs(db, session.id);

  if (kind === 'default') {
    // One default episode per module — asking again just returns it.
    if (existingDefault) return c.json(toEpisode(existingDefault));
  } else {
    if (!existingDefault) return c.json({ error: 'Your module episode comes first — the hosts answer questions about something you\'ve heard.' }, 400);
    const played = await db
      .select({ n: sql<number>`count(*)` })
      .from(t.fdEvent)
      .where(
        and(
          eq(t.fdEvent.sessionId, session.id),
          eq(t.fdEvent.type, 'podcast_played'),
          sql`json_extract(${t.fdEvent.payloadJson}, '$.podcastId') = ${existingDefault.id}`,
        ),
      );
    if ((played[0]?.n ?? 0) === 0) {
      return c.json({ error: 'Listen to your episode first — then ask the hosts anything it left you wondering.' }, 400);
    }
    if (!body.question?.trim() || body.question.trim().length < 5) {
      return c.json({ error: 'Ask the hosts a real question — a sentence or two about what you want unpacked.' }, 400);
    }
  }

  if (!(await underPodcastLimit(db, session.id, c.env))) {
    return c.json({ error: `Episode writing is limited to ${podcastHourlyLimit(c.env)} an hour. Your earlier episodes are below — or come back shortly.` }, 429);
  }

  const question = kind === 'qa' ? body.question!.trim().slice(0, 500) : null;
  await logEvent(db, session.id, 'podcast_requested', { moduleId, kind, trigger: 'manual' });

  const length = kind === 'qa' ? 'quick' : defaultLengthFor(depthOf(prefs.depth));

  if (kind === 'default') {
    // Assembled path: a pre-voiced intro (personal > goal > generic stock)
    // returns instantly and plays while the custom body writes in the
    // background. Stock study assets ride along, so the cards are instant too.
    const assembled = await createAssembledEpisode(c.env, db, session.id, moduleId, length);
    if (assembled) {
      c.executionCtx.waitUntil(completeAssembledBody(c.env, assembled));
      return c.json(toEpisode(assembled));
    }
    // No stock baked yet (first visitor to this module): legacy full-script
    // path today, and bake the stock in the background for everyone after.
    c.executionCtx.waitUntil(bakeStock(c.env, moduleId));
  }

  const row = await generateEpisode(c.env, db, session.id, moduleId, kind, question, length);
  if (!row) {
    return c.json({ error: 'The scriptwriter is unavailable right now. Nothing was saved — try again in a minute.' }, 503);
  }
  // Voices start rendering before the learner has finished reading the title.
  // The study companion is client-driven (POST /api/podcast/:id/study) so it
  // runs in parallel from the browser and lands deterministically.
  c.executionCtx.waitUntil(renderVoicesToCache(c.env, row, 'create'));
  return c.json(toEpisode(row));
});

app.get('/api/podcast/:id', async (c) => {
  const db = c.get('db');
  const session = requireSession(c);
  if (!session) return c.json({ error: 'No session.' }, 401);
  const rows = await db
    .select()
    .from(t.fdPodcast)
    .where(and(eq(t.fdPodcast.id, c.req.param('id')), eq(t.fdPodcast.sessionId, session.id)))
    .limit(1);
  if (!rows[0]) return c.json({ error: 'No such episode.' }, 404);
  return c.json(toEpisode(rows[0]));
});

// The study companion, client-driven: the page calls this right after the
// episode arrives, in parallel with the audio — one deterministic request
// instead of a background task plus polling. Returns the stored companion
// when it already exists (pregen fills it server-side).
app.post('/api/podcast/:id/study', async (c) => {
  const db = c.get('db');
  const session = requireSession(c);
  if (!session) return c.json({ error: 'No session.' }, 401);
  const rows = await db
    .select()
    .from(t.fdPodcast)
    .where(and(eq(t.fdPodcast.id, c.req.param('id')), eq(t.fdPodcast.sessionId, session.id)))
    .limit(1);
  const row = rows[0];
  if (!row) return c.json({ error: 'No such episode.' }, 404);

  if (row.takeawaysJson || row.visualJson) {
    return c.json({
      takeaways: row.takeawaysJson ? (JSON.parse(row.takeawaysJson) as string[]) : null,
      visual: row.visualJson ? (JSON.parse(row.visualJson) as PodcastVisual) : null,
    });
  }
  if (!c.env.ANTHROPIC_API_KEY) return c.json({ error: 'The scriptwriter is not configured in this deployment.' }, 503);

  await attachStudy(c.env, row);
  const fresh = await db.select().from(t.fdPodcast).where(eq(t.fdPodcast.id, row.id)).limit(1);
  return c.json({
    takeaways: fresh[0]?.takeawaysJson ? (JSON.parse(fresh[0].takeawaysJson) as string[]) : null,
    visual: fresh[0]?.visualJson ? (JSON.parse(fresh[0].visualJson) as PodcastVisual) : null,
  });
});

// The pre-voiced intro of an assembled episode — always a straight R2 read,
// which is what makes arrival instant.
app.get('/api/podcast/:id/audio/intro', async (c) => {
  const db = c.get('db');
  const session = requireSession(c);
  if (!session) return c.json({ error: 'No session.' }, 401);
  const rows = await db
    .select()
    .from(t.fdPodcast)
    .where(and(eq(t.fdPodcast.id, c.req.param('id')), eq(t.fdPodcast.sessionId, session.id)))
    .limit(1);
  const row = rows[0];
  if (!row || !row.introAudioKey || !c.env.PODCAST_AUDIO) return c.json({ error: 'No intro audio for this episode.' }, 404);
  const cached = await c.env.PODCAST_AUDIO.get(row.introAudioKey);
  if (!cached) return c.json({ error: 'No intro audio for this episode.' }, 404);
  const bytes = new Uint8Array(await cached.arrayBuffer());
  const sniffed = bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 ? 'audio/wav' : 'audio/mpeg';
  return new Response(bytes, {
    headers: { 'content-type': cached.httpMetadata?.contentType ?? sniffed, 'cache-control': 'private, max-age=86400' },
  });
});

// One chunk of an episode's audio. Serves the R2 cache when the background
// render has gotten there; otherwise voices just this chunk live (~10–20s) —
// so the first chunk is always seconds away, whatever the background is doing.
app.get('/api/podcast/:id/audio/:chunk', async (c) => {
  const db = c.get('db');
  const session = requireSession(c);
  if (!session) return c.json({ error: 'No session.' }, 401);
  const rows = await db
    .select()
    .from(t.fdPodcast)
    .where(and(eq(t.fdPodcast.id, c.req.param('id')), eq(t.fdPodcast.sessionId, session.id)))
    .limit(1);
  let row = rows[0];
  if (!row) return c.json({ error: 'No such episode.' }, 404);

  // Assembled episode whose custom body is still being written: give the
  // background writer a moment before falling back — the intro buys ~a minute
  // of runway, so a short wait here is invisible to the listener.
  if (row.introJson && row.scriptJson === '[]') {
    const ageMs = Date.now() - new Date(row.createdAt).getTime();
    if (ageMs < 10 * 60 * 1000) {
      for (let i = 0; i < 16 && row.scriptJson === '[]'; i++) {
        await new Promise((resolve) => setTimeout(resolve, 2500));
        const fresh = await db.select().from(t.fdPodcast).where(eq(t.fdPodcast.id, row.id)).limit(1);
        if (fresh[0]) row = fresh[0];
      }
    }
    if (row.scriptJson === '[]') return c.json({ error: 'The rest of the episode is still being written — try again in a moment.' }, 503);
  }

  const lines = JSON.parse(row.scriptJson) as PodcastLine[];
  const plan = chunkPlan(lines);
  const idx = Number(c.req.param('chunk'));
  if (!Number.isInteger(idx) || idx < 0 || idx >= plan.length) return c.json({ error: 'No such chunk.' }, 404);

  const key = chunkKey(row.id, idx);
  const headersFor = (contentType: string) => ({ 'content-type': contentType, 'cache-control': 'private, max-age=86400' });
  // Chunks may be MP3 (Aura) or WAV (Gemini) — trust stored metadata, sniff RIFF as backup.
  const sniff = (bytes: Uint8Array | null) =>
    bytes && bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 ? 'audio/wav' : 'audio/mpeg';

  if (c.env.PODCAST_AUDIO) {
    const cached = await c.env.PODCAST_AUDIO.get(key);
    if (cached) {
      const bytes = new Uint8Array(await cached.arrayBuffer());
      return new Response(bytes, { headers: headersFor(cached.httpMetadata?.contentType ?? sniff(bytes)) });
    }
    // On a young episode the background render is almost certainly working on
    // this chunk right now — wait briefly for it to land instead of kicking a
    // duplicate render (slower AND double-spend). Only worth waiting when an
    // engine exists to be doing the rendering.
    const ageMs = Date.now() - new Date(row.createdAt).getTime();
    if ((c.env.AI || c.env.GEMINI_API_KEY) && row.audioAt === null && ageMs < 10 * 60 * 1000) {
      for (let i = 0; i < 8; i++) {
        await new Promise((resolve) => setTimeout(resolve, 2500));
        const landed = await c.env.PODCAST_AUDIO.get(key);
        if (landed) {
          const bytes = new Uint8Array(await landed.arrayBuffer());
          return new Response(bytes, { headers: headersFor(landed.httpMetadata?.contentType ?? sniff(bytes)) });
        }
      }
    }
  }

  if (!c.env.AI && !c.env.GEMINI_API_KEY) {
    return c.json({ error: 'Audio rendering is not configured in this deployment — the full transcript is the episode for now.' }, 503);
  }

  const rendered = await renderChunkAudio(c.env, lines.slice(plan[idx].start, plan[idx].end), await introEngine(c.env, row.introAudioKey));
  if (!rendered) {
    return c.json({ error: 'The voices are unavailable right now. The script is safe — try the audio again in a minute.' }, 503);
  }
  const audio = rendered.bytes;

  if (c.env.PODCAST_AUDIO) {
    await c.env.PODCAST_AUDIO.put(key, audio, { httpMetadata: { contentType: rendered.contentType } });
    // If this listen just completed the set, mark the episode fully voiced.
    if (row.audioKey === null) {
      let all = true;
      for (let i = 0; i < plan.length; i++) {
        if (i !== idx && !(await c.env.PODCAST_AUDIO.head(chunkKey(row.id, i)))) {
          all = false;
          break;
        }
      }
      if (all) {
        await db
          .update(t.fdPodcast)
          .set({ audioKey: `podcast/${row.id}/`, audioAt: now() })
          .where(and(eq(t.fdPodcast.id, row.id), sql`${t.fdPodcast.audioKey} IS NULL`));
      }
    }
  }
  await logEvent(db, session.id, 'podcast_audio_rendered', {
    podcastId: row.id,
    chunk: idx,
    bytes: audio.length,
    trigger: 'listen',
    engine: rendered.contentType === 'audio/wav' ? 'gemini' : 'aura',
  });

  return new Response(audio, { headers: { ...headersFor(rendered.contentType), 'content-length': String(audio.length) } });
});

// Legacy whole-episode audio: episodes voiced before chunked playback keep
// their single cached MP3, and this route serves it (or live-renders the whole
// thing as a last resort).
app.get('/api/podcast/:id/audio', async (c) => {
  const db = c.get('db');
  const session = requireSession(c);
  if (!session) return c.json({ error: 'No session.' }, 401);
  const rows = await db
    .select()
    .from(t.fdPodcast)
    .where(and(eq(t.fdPodcast.id, c.req.param('id')), eq(t.fdPodcast.sessionId, session.id)))
    .limit(1);
  const row = rows[0];
  if (!row) return c.json({ error: 'No such episode.' }, 404);

  const audioHeaders = { 'content-type': 'audio/mpeg', 'cache-control': 'private, max-age=86400' };

  if (row.audioKey && c.env.PODCAST_AUDIO) {
    const cached = await c.env.PODCAST_AUDIO.get(row.audioKey);
    if (cached) return new Response(cached.body, { headers: audioHeaders });
    // Bucket lost the object (recreated, expired) — fall through and re-render.
  }

  if (!c.env.AI) {
    return c.json({ error: 'Audio rendering is not configured in this deployment — the full transcript is the episode for now.' }, 503);
  }

  const lines = JSON.parse(row.scriptJson) as PodcastLine[];
  const audio = await renderAudio(c.env.AI, lines);
  if (!audio) {
    return c.json({ error: 'The voices are unavailable right now. The script is safe — try the audio again in a minute.' }, 503);
  }

  if (c.env.PODCAST_AUDIO) {
    const key = `podcast/${row.id}.mp3`;
    await c.env.PODCAST_AUDIO.put(key, audio);
    await db.update(t.fdPodcast).set({ audioKey: key, audioBytes: audio.length, audioAt: now() }).where(eq(t.fdPodcast.id, row.id));
  }
  await logEvent(db, session.id, 'podcast_audio_rendered', { podcastId: row.id, bytes: audio.length, cached: Boolean(c.env.PODCAST_AUDIO) });

  return new Response(audio, { headers: { ...audioHeaders, 'content-length': String(audio.length) } });
});

// ---------- completion ----------

app.get('/api/module/ai101-m1/complete', async (c) => {
  const db = c.get('db');
  const session = requireSession(c);
  if (!session) return c.json({ error: 'No session.' }, 401);
  const graded = await db
    .select()
    .from(t.fdSubmission)
    .where(and(eq(t.fdSubmission.sessionId, session.id), sql`${t.fdSubmission.gradedAt} IS NOT NULL`))
    .orderBy(desc(t.fdSubmission.gradedAt))
    .limit(1);
  const participants = await db
    .select()
    .from(t.fdParticipant)
    .where(eq(t.fdParticipant.sessionId, session.id))
    .orderBy(desc(t.fdParticipant.createdAt))
    .limit(1);
  const sub = graded[0] ?? null;
  const name = participants[0]?.displayName ?? null;
  const rubric = sub?.rubricJson ? JSON.parse(sub.rubricJson) : null;
  const cal = await db
    .select()
    .from(t.fdCalibration)
    .where(and(eq(t.fdCalibration.sessionId, session.id), sql`${t.fdCalibration.context} LIKE 'diagnostic:%'`));
  const meanDelta = cal.length ? cal.reduce((a, r) => a + (r.delta ?? 0), 0) / cal.length : null;

  return c.json({
    name,
    graded: sub
      ? { total: sub.totalScore, dimensions: rubric?.dimensions ?? [], summary: rubric?.summary ?? '', gradedAt: sub.gradedAt, model: sub.modelUsed }
      : null,
    diagnosticMeanDelta: meanDelta === null ? null : Math.round(meanDelta),
  });
});

// ---------- fallthrough ----------

app.route('/api/admin', adminApp);

app.notFound(async (c) => {
  if (new URL(c.req.url).pathname.startsWith('/api/')) return c.json({ error: 'Not found.' }, 404);
  return c.env.ASSETS.fetch(c.req.raw);
});

export default {
  fetch: app.fetch,
  // Cron trigger (see wrangler.jsonc): keeps stock episodes baked for every
  // open module, so podcast arrival is instant even on a never-visited module.
  scheduled(_controller: ScheduledController, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(warmAllStock(env));
  },
};
