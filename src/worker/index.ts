import { Hono } from 'hono';
import { getCookie, setCookie } from 'hono/cookie';
import { drizzle, type DrizzleD1Database } from 'drizzle-orm/d1';
import { and, asc, desc, eq, gt, sql } from 'drizzle-orm';
import * as t from '../db/schema';
import { verifyCode, signSessionId, verifySessionCookie, hashIp } from './crypto';
import { gradeSubmission, PROMPT_VERSION } from './grading';
import {
  writeScript,
  renderAudio,
  estMinutes,
  PODCAST_PROMPT_VERSION,
  VOICE_A,
  VOICE_B,
  type AiBinding,
  type LearnerContext,
} from './podcast';
import diagnosticData from '../../content/diagnostic.json';
import sortingData from '../../content/sorting.json';
import type {
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
  PodcastSummary,
  GradeResult,
  MeResponse,
  ModuleCard,
  ModuleContentResponse,
  PathModule,
  SortingReveal,
} from '../shared/types';

export interface Env {
  DB: D1Database;
  ASSETS: Fetcher;
  BRAND_SLUG: string;
  GRADING_MODEL: string;
  PODCAST_MODEL?: string;
  SESSION_SECRET?: string;
  ANTHROPIC_API_KEY?: string;
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
const PODCAST_LIMIT_PER_HOUR = 4;
const MIN_SUBMISSION_CHARS = 700;

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
  const brand: Brand = { slug: row.slug, name: row.name, tokens: JSON.parse(row.tokensJson), voice: JSON.parse(row.voiceJson) };
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

const VALID_STYLES = new Set(['reading', 'interactive', 'podcast', 'assistant_mcp', 'voice']);
const VALID_GOALS = new Set(['fluency', 'workflows', 'apply', 'news', 'tools', 'safety', 'coach', 'confidence']);
const VALID_TIMES = new Set([0, 10, 30, 60]);

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
    else if (row.key === 'time') prefs.time = value;
    else if (row.key === 'styles') prefs.styles = value;
    else if (row.key === 'goals') prefs.goals = value;
    else if (row.key === 'objective') prefs.objective = value;
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
  if (raw.start === 'diagnostic' || raw.start === 'module') clean.push(['start', raw.start]);
  if (typeof raw.time === 'number' && VALID_TIMES.has(raw.time)) clean.push(['time', raw.time]);
  if (Array.isArray(raw.styles)) clean.push(['styles', raw.styles.filter((s) => VALID_STYLES.has(s)).slice(0, 5)]);
  if (Array.isArray(raw.goals)) clean.push(['goals', raw.goals.filter((g) => VALID_GOALS.has(g)).slice(0, 8)]);
  if (typeof raw.objective === 'string') clean.push(['objective', raw.objective.trim().slice(0, 280)]);

  for (const [key, value] of clean) {
    await db.delete(t.fdPreference).where(and(eq(t.fdPreference.sessionId, session.id), eq(t.fdPreference.key, key)));
    await db.insert(t.fdPreference).values({ id: uuid(), sessionId: session.id, key, valueJson: JSON.stringify(value), createdAt: now() });
  }
  await logEvent(db, session.id, 'intake_completed', Object.fromEntries(clean));
  return c.json({ ok: true });
});

type Progress = { diagnosticDone: boolean; sortDone: boolean; activityGraded: boolean; moduleCompleted: boolean };

function composePlan(name: string | null, prefs: IntakePrefs, progress: Progress): PlanResponse {
  const time = prefs.time ?? 30;
  const start = prefs.start ?? 'diagnostic';

  const diagnostic: PlanStep = {
    id: 'diagnostic',
    title: start === 'module' ? 'The diagnostic — when you want your read tested' : 'The diagnostic — find your direction of error',
    detail:
      start === 'module'
        ? "You chose to skip diagnosis for now. It'll be here — nine questions, scored against field data."
        : 'Nine questions. Not a score — a direction: whether you expect too much or too little from these tools.',
    minutes: 8,
    route: '/diagnostic',
    state: progress.diagnosticDone ? 'done' : 'later',
  };
  const core: PlanStep = {
    id: 'm1-core',
    title: 'Module 1 · Lesson 1 and the sorting exercise',
    detail: 'The best fifteen minutes in the module: what "AI" means in your stack, then fifteen real tasks sorted into hand-over / verify / don\'t.',
    minutes: 12,
    route: '/module/1',
    state: progress.sortDone ? 'done' : 'later',
  };
  const read: PlanStep = {
    id: 'm1-read',
    title: 'Module 1 · the rest of the read',
    detail: 'What an LLM actually does, the vocabulary, and why data decides everything.',
    minutes: 10,
    route: '/module/1',
    state: progress.moduleCompleted ? 'done' : 'later',
  };
  const activity: PlanStep = {
    id: 'activity',
    title: 'Applied activity — "Testing the Edges", AI-graded',
    detail: 'Three short conversations with your own AI tool, a reflection, and rubric feedback in seconds. Unlimited resubmission.',
    minutes: 25,
    route: '/module/1/activity',
    state: progress.activityGraded ? 'done' : 'later',
  };

  const micro: PlanStep = {
    id: 'm1-micro',
    title: 'Module 1 · the two-minute version',
    detail: 'The key concepts and the delegation heuristic, cut for a short sitting. The full module keeps.',
    minutes: 2,
    route: '/module/1/micro',
    state: progress.moduleCompleted || progress.sortDone ? 'done' : 'later',
  };

  const shortSitting = time > 0 && time <= 10;
  const steps = start === 'module'
    ? shortSitting
      ? [micro, core, read, activity, diagnostic]
      : [core, read, activity, diagnostic]
    : shortSitting
      ? [diagnostic, micro, core, read, activity]
      : [diagnostic, core, read, activity];

  // Fit "now" steps to the time they said they had; 0 = exploring, one step at a time.
  let budget = time === 0 ? Infinity : time + 5;
  let marked = 0;
  for (const step of steps) {
    if (step.state === 'done') continue;
    if (time === 0) {
      if (marked === 0) {
        step.state = 'now';
        marked++;
      }
      continue;
    }
    if (step.minutes <= budget) {
      step.state = 'now';
      budget -= step.minutes;
      marked++;
    }
  }
  if (marked === 0) {
    const first = steps.find((s) => s.state !== 'done');
    if (first) first.state = 'now';
  }

  const notes: string[] = [];
  const goals = prefs.goals ?? [];
  const GOAL_NOTES: Record<string, string> = {
    workflows: 'Workflow and automation building is the heart of AI 201 — this course builds the judgment underneath it.',
    news: 'Staying current is what the volatile content layer is for — examples refresh monthly without touching the concepts.',
    tools: 'Module 2 is built around telling tools apart; Lesson 1 of Module 1 starts that cut today.',
    safety: 'What\'s safe to paste — and under what agreement — is Lesson 4 today and all of Module 8.',
    coach: 'Helping others adopt AI gets its own course (AI 301). This one makes you credible first.',
  };
  for (const goal of goals) {
    if (GOAL_NOTES[goal] && notes.length < 2) notes.push(GOAL_NOTES[goal]);
  }
  const styles = prefs.styles ?? [];
  if (styles.includes('podcast')) notes.push('Podcast-style audio is live — open Module 1 and make a custom two-host episode from any angle you like.');
  if (styles.includes('assistant_mcp')) notes.push('Taking this course inside Claude or ChatGPT, as an MCP server, is on the roadmap — your interest is logged.');
  if (styles.includes('voice')) notes.push('Talking instead of typing is on the roadmap — your interest is logged.');
  if (time > 0) notes.push(`Sized for the ~${time} minutes you said you have. Anything marked "another sitting" keeps.`);
  else if (prefs.time === 0) notes.push("No clock on this — it's laid out one step at a time.");

  const done = steps.filter((s) => s.state === 'done').length;
  const greeting =
    done > 0
      ? name
        ? `${name}, picking back up where you left off.`
        : 'Picking back up where you left off.'
      : name
        ? `${name}, here's the shape of it.`
        : "Here's the shape of it.";

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
      progress: { intakeDone: false, diagnosticDone: false, sortDone: false, activityGraded: false, moduleCompleted: false },
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
  const rows = await db.select().from(t.fdModule).where(eq(t.fdModule.courseId, 'ai101')).orderBy(asc(t.fdModule.ordinal));

  // A prerequisite is satisfied by completing the module — or by testing out.
  // Testing out of M1 = a perfect knowledge score on the diagnostic.
  const completedRows = await db
    .select()
    .from(t.fdEvent)
    .where(and(eq(t.fdEvent.sessionId, session.id), eq(t.fdEvent.type, 'module_completed')));
  const completed = new Set(
    completedRows.map((e) => (e.payloadJson ? (JSON.parse(e.payloadJson) as { moduleId?: string }).moduleId : null)).filter(Boolean),
  );
  const kResponses = await db
    .select()
    .from(t.fdDiagnosticResponse)
    .where(and(eq(t.fdDiagnosticResponse.sessionId, session.id), sql`${t.fdDiagnosticResponse.correct} IS NOT NULL`));
  const kTotal = diagItems.filter((i) => i.kind === 'knowledge').length;
  const testedOutM1 = kResponses.length >= kTotal && kResponses.every((r) => r.correct === 1);

  const titleOf = (id: string) => rows.find((m) => m.id === id)?.title ?? id;
  const satisfied = (id: string) => completed.has(id) || (id === 'ai101-m1' && testedOutM1);

  const modules: PathModule[] = rows.map((m) => {
    const prereqs: string[] = m.prereqJson ? JSON.parse(m.prereqJson) : [];
    const unmet = prereqs.filter((p) => !satisfied(p));
    let access: PathModule['access'];
    let unlockHint: string | undefined;
    if (m.status === 'open') {
      access = 'open';
    } else if (unmet.length === 0) {
      access = 'full_course';
      if (prereqs.length > 0) unlockHint = 'Prerequisite cleared.';
    } else {
      access = 'locked';
      const names = unmet.map(titleOf).join(' and ');
      unlockHint =
        unmet.includes('ai101-m1')
          ? `Needs ${names} first — finish it, or test out with a perfect knowledge score on the diagnostic.`
          : `Needs ${names} first.`;
    }
    return { ...(m as ModuleCard), access, prereqs, unlockHint, microMinutes: 2 };
  });

  // Courses beyond 101 are locked cards; they live in content, not the DB, until they exist.
  const { courses } = (await import('../../content/modules.json')) as unknown as { courses: unknown };
  return c.json({ modules, courses });
});

// The two-minute cut of Module 1 — same content system, tighter blocks.
app.get('/api/module/ai101-m1/micro', async (c) => {
  const db = c.get('db');
  const session = requireSession(c);
  if (!session) return c.json({ error: 'No session.' }, 401);
  const blockRows = await db
    .select()
    .from(t.fdContentBlock)
    .where(eq(t.fdContentBlock.moduleId, 'ai101-m1-micro'))
    .orderBy(asc(t.fdContentBlock.ordinal));
  const blocks = blockRows.map(toBlock);
  return c.json({ blocks, stamps: stampsFor(blocks) });
});

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

app.get('/api/module/:id', async (c) => {
  const db = c.get('db');
  const session = requireSession(c);
  if (!session) return c.json({ error: 'No session.' }, 401);
  const id = c.req.param('id');
  const modRows = await db.select().from(t.fdModule).where(eq(t.fdModule.id, id)).limit(1);
  const mod = modRows[0];
  if (!mod) return c.json({ error: 'No such module.' }, 404);
  if (mod.status !== 'open') return c.json({ error: 'This module is not open yet.' }, 403);
  const blockRows = await db.select().from(t.fdContentBlock).where(eq(t.fdContentBlock.moduleId, id)).orderBy(asc(t.fdContentBlock.ordinal));
  const blocks = blockRows.map(toBlock);
  const words = blocks.reduce((sum, b) => sum + b.body.split(/\s+/).length, 0);
  const res: ModuleContentResponse = {
    module: mod as ModuleCard,
    blocks,
    stamps: stampsFor(blocks),
    estReadMinutes: Math.max(1, Math.round(words / 200)),
  };
  return c.json(res);
});

// ---------- sorting exercise ----------

app.get('/api/module/ai101-m1/sorting', async (c) => {
  const session = requireSession(c);
  if (!session) return c.json({ error: 'No session.' }, 401);
  return c.json({
    buckets: sortingData.buckets,
    tasks: sortingData.tasks.map((task) => ({ id: task.id, text: task.text })),
  });
});

const BUCKET_PCT: Record<string, number> = { well: 85, partly: 50, badly: 15 };

app.post('/api/module/ai101-m1/sort', async (c) => {
  const db = c.get('db');
  const session = requireSession(c);
  if (!session) return c.json({ error: 'No session.' }, 401);
  const body = await c.req.json<{ assignments?: Record<string, string> }>().catch(() => null);
  const assignments = body?.assignments ?? {};
  const valid = new Set(['well', 'partly', 'badly']);
  for (const task of sortingData.tasks) {
    if (!valid.has(assignments[task.id])) return c.json({ error: 'Commit all fifteen before the reveal — an unscored guess teaches nothing.' }, 400);
  }

  const rank: Record<string, number> = { badly: 0, partly: 1, well: 2 };
  let correct = 0;
  let overAssigned = 0;
  let underAssigned = 0;
  const results: SortingReveal['results'] = sortingData.tasks.map((task) => {
    const chosen = assignments[task.id];
    const isCorrect = chosen === task.key;
    if (isCorrect) correct++;
    else if (rank[chosen] > rank[task.key]) overAssigned++;
    else underAssigned++;
    return { taskId: task.id, text: task.text, chosen, key: task.key, correct: isCorrect, reasoning: task.reasoning };
  });

  for (const task of sortingData.tasks) {
    await db.delete(t.fdCalibration).where(and(eq(t.fdCalibration.sessionId, session.id), eq(t.fdCalibration.context, `sort:${task.id}`)));
    const predicted = BUCKET_PCT[assignments[task.id]];
    const actual = BUCKET_PCT[task.key];
    await db.insert(t.fdCalibration).values({
      id: uuid(),
      sessionId: session.id,
      context: `sort:${task.id}`,
      predictedPct: predicted,
      actualOutcome: actual,
      delta: predicted - actual,
      createdAt: now(),
    });
  }
  await logEvent(db, session.id, 'sort_submitted', { correct, total: sortingData.tasks.length, overAssigned, underAssigned });

  const reveal: SortingReveal = {
    results,
    score: { correct, total: sortingData.tasks.length },
    overAssigned,
    underAssigned,
    pattern: sortingData.pattern,
    postscript: sortingData.postscript,
  };
  return c.json(reveal);
});

// ---------- applied activity & grading ----------

app.get('/api/module/ai101-m1/activity', async (c) => {
  const db = c.get('db');
  const session = requireSession(c);
  if (!session) return c.json({ error: 'No session.' }, 401);
  const blockRows = await db
    .select()
    .from(t.fdContentBlock)
    .where(eq(t.fdContentBlock.moduleId, 'ai101-m1-activity'))
    .orderBy(asc(t.fdContentBlock.ordinal));
  const latest = await db
    .select()
    .from(t.fdSubmission)
    .where(eq(t.fdSubmission.sessionId, session.id))
    .orderBy(desc(t.fdSubmission.createdAt))
    .limit(1);
  const last = latest[0];
  return c.json({
    blocks: blockRows.map(toBlock),
    minChars: MIN_SUBMISSION_CHARS,
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

app.post('/api/module/ai101-m1/activity', async (c) => {
  const db = c.get('db');
  const session = requireSession(c);
  if (!session) return c.json({ error: 'No session.' }, 401);
  const body = await c.req.json<{ body?: string; predictedPct?: number }>().catch(() => null);
  const text = body?.body?.trim();
  if (!text || text.length < MIN_SUBMISSION_CHARS) {
    return c.json({ error: `Keep going — the activity needs at least ${MIN_SUBMISSION_CHARS} characters to be gradeable.` }, 400);
  }
  if (text.length > 40_000) return c.json({ error: 'That’s beyond what the grader will read. Trim to the three conversations and the reflection.' }, 400);

  const predictedPct = Number.isFinite(body?.predictedPct) ? Math.max(0, Math.min(100, Math.round(body!.predictedPct!))) : null;

  // Save first — grading can fail or be limited, the submission never gets lost.
  const submissionId = uuid();
  await db.insert(t.fdSubmission).values({
    id: submissionId,
    sessionId: session.id,
    moduleId: 'ai101-m1',
    body: text,
    createdAt: now(),
  });
  await logEvent(db, session.id, 'activity_submitted', { submissionId, chars: text.length });

  if (predictedPct !== null) {
    await db.delete(t.fdCalibration).where(and(eq(t.fdCalibration.sessionId, session.id), eq(t.fdCalibration.context, 'm1:conversation2')));
    await db.insert(t.fdCalibration).values({
      id: uuid(),
      sessionId: session.id,
      context: 'm1:conversation2',
      predictedPct,
      actualOutcome: null,
      delta: null,
      createdAt: now(),
    });
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

  const grade = await gradeSubmission(c.env.ANTHROPIC_API_KEY, c.env.GRADING_MODEL, text, predictedPct);
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
      promptVersion: PROMPT_VERSION,
      gradedAt: now(),
    })
    .where(eq(t.fdSubmission.id, submissionId));
  await logEvent(db, session.id, 'activity_graded', { submissionId, total: grade.total });

  const res: GradeResult = { status: 'graded', submissionId, dimensions: grade.dimensions, total: grade.total, summary: grade.summary };
  return c.json(res);
});

// ---------- podcast creator ----------

type PodcastRow = typeof t.fdPodcast.$inferSelect;

function toEpisode(row: PodcastRow): PodcastEpisode {
  return {
    id: row.id,
    moduleId: row.moduleId,
    title: row.title,
    description: row.description,
    lengthPref: row.lengthPref as PodcastLength,
    promptText: row.promptText,
    lines: JSON.parse(row.scriptJson) as PodcastLine[],
    estMinutes: estMinutes(row.totalChars),
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
    const { lines: _lines, ...summary } = toEpisode(row);
    return summary;
  });
  const res: PodcastListResponse = {
    episodes,
    scriptEnabled: Boolean(c.env.ANTHROPIC_API_KEY),
    audioEnabled: Boolean(c.env.AI),
  };
  return c.json(res);
});

app.post('/api/podcast', async (c) => {
  const db = c.get('db');
  const session = requireSession(c);
  if (!session) return c.json({ error: 'No session.' }, 401);
  const body = await c.req.json<{ moduleId?: string; prompt?: string; length?: string }>().catch(() => null);
  if (!body) return c.json({ error: 'Malformed request.' }, 400);

  const moduleId = body.moduleId ?? 'ai101-m1';
  const length: PodcastLength = body.length === 'quick' || body.length === 'deep' ? body.length : 'standard';
  const focus = typeof body.prompt === 'string' && body.prompt.trim() ? body.prompt.trim().slice(0, 400) : null;

  const modRows = await db.select().from(t.fdModule).where(eq(t.fdModule.id, moduleId)).limit(1);
  const mod = modRows[0];
  if (!mod || mod.status !== 'open') return c.json({ error: 'Episodes can only be made from open modules.' }, 400);

  const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const recent = await db
    .select({ n: sql<number>`count(*)` })
    .from(t.fdPodcast)
    .where(and(eq(t.fdPodcast.sessionId, session.id), gt(t.fdPodcast.createdAt, hourAgo)));
  if ((recent[0]?.n ?? 0) >= PODCAST_LIMIT_PER_HOUR) {
    return c.json({ error: `Episode writing is limited to ${PODCAST_LIMIT_PER_HOUR} an hour. Your earlier episodes are below — or come back shortly.` }, 429);
  }

  if (!c.env.ANTHROPIC_API_KEY) {
    return c.json({ error: 'The scriptwriter is not configured in this deployment, so episodes cannot be generated yet.' }, 503);
  }

  await logEvent(db, session.id, 'podcast_requested', { moduleId, length, hasFocus: focus !== null });

  // Source: the module's readable blocks, in order. Exercise blocks carry JSON
  // payloads, not prose — the hosts can't read those aloud.
  const blockRows = await db
    .select()
    .from(t.fdContentBlock)
    .where(eq(t.fdContentBlock.moduleId, moduleId))
    .orderBy(asc(t.fdContentBlock.ordinal));
  const contentMd = blockRows
    .filter((b) => b.kind !== 'exercise')
    .map((b) => b.body)
    .join('\n\n');

  const participants = await db
    .select()
    .from(t.fdParticipant)
    .where(eq(t.fdParticipant.sessionId, session.id))
    .orderBy(desc(t.fdParticipant.createdAt))
    .limit(1);
  const prefs = await loadPrefs(db, session.id);
  const diag = await computeDiagnosticResult(db, session.id);
  const learner: LearnerContext = {
    name: participants[0]?.displayName ?? null,
    role: participants[0]?.roleLabel ?? null,
    objective: prefs.objective ?? null,
    calibrationHeadline: diag.calibration.points.length > 0 ? diag.calibration.headline : null,
  };

  const model = c.env.PODCAST_MODEL ?? c.env.GRADING_MODEL;
  const script = await writeScript(c.env.ANTHROPIC_API_KEY, model, mod.title, contentMd, learner, focus, length);
  if (!script) {
    return c.json({ error: 'The scriptwriter is unavailable right now. Nothing was saved — try again in a minute.' }, 503);
  }

  const row: PodcastRow = {
    id: uuid(),
    sessionId: session.id,
    moduleId,
    promptText: focus,
    lengthPref: length,
    title: script.title,
    description: script.description,
    scriptJson: JSON.stringify(script.lines),
    totalChars: script.lines.reduce((sum, l) => sum + l.text.length, 0),
    modelUsed: model,
    promptVersion: PODCAST_PROMPT_VERSION,
    voiceA: VOICE_A,
    voiceB: VOICE_B,
    audioKey: null,
    audioBytes: null,
    audioAt: null,
    createdAt: now(),
  };
  await db.insert(t.fdPodcast).values(row);
  await logEvent(db, session.id, 'podcast_script_ready', { podcastId: row.id, turns: script.lines.length, chars: row.totalChars });

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

// Audio renders lazily on first listen, then serves from the R2 cache. The first
// request voices every turn (~30–60s) — the client fetches to a blob and shows a
// rendering state rather than pointing an <audio> tag here cold.
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

app.notFound(async (c) => {
  if (new URL(c.req.url).pathname.startsWith('/api/')) return c.json({ error: 'Not found.' }, 404);
  return c.env.ASSETS.fetch(c.req.raw);
});

export default app;
