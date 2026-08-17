import { Hono, type Context } from 'hono';
import { getCookie, setCookie } from 'hono/cookie';
import { drizzle, type DrizzleD1Database } from 'drizzle-orm/d1';
import { and, asc, desc, eq, gt, inArray, lt, sql } from 'drizzle-orm';
import * as t from '../db/schema';
import { verifyCode, hashCode, signSessionId, verifySessionCookie, hashIp, signMcpKey, randomToken, tokenHash } from './crypto';
import { toolingOf, selectVariants, toBlock, stampsFor, getExercise, scoreSortingSubmission, type KnowledgeCheckPayload, type SortingPayload } from './content';
import { createMcpApp, recommendationsFor } from './mcp';
import { createOauthApp, MCP_PATH } from './oauth';
import { gradeSubmission, type RubricPayload } from './grading';
import { adminApp, runReminderPass } from './admin';
import { accountEmailFor, commitmentFor, createManagerApp, hasReports, managerEmailForSessionId, managerEmailOf, managerSignalsFor } from './manager';
import { deliverableAddress, emailEnabled, sendEmail, signature } from './email';
import { buildTutorSystem, streamTutorReply, KICKOFF_TURN, type LearnerContext as TutorLearnerContext, type TutorMessage } from './chat';
import { transcribe, speakable, renderSpeech, TUTOR_VOICE, type AiBinding } from './voice';
import { moduleSnapshot, witnessContent } from './audit';
import { extractPaths } from '../shared/chat';
import { GOAL_CHOICES, goalLabel } from '../shared/goals';
import { DEPTH_IDS, depthOf } from '../shared/depth';
import { SELF_LEVEL_IDS } from '../shared/levels';
import { ROLE_IDS, ALL_TRACK_IDS, roleChoice, trackForRole } from '../shared/roles';
import { chunkPlan } from '../shared/audioChunks';
import {
  writeScript,
  writeStudy,
  writeStock,
  writeStockIntro,
  writePersonalIntro,
  writeCustomBody,
  renderChunkAudio,
  estMinutes,
  PODCAST_PROMPT_VERSION,
  GEMINI_VOICE_A,
  GEMINI_VOICE_B,
  type HeardEpisode,
  type LearnerContext,
} from './podcast';
import diagnosticData from '../../content/diagnostic.json';
import type {
  CourseCard,
  Brand,
  IntakePrefs,
  PlanResponse,
  PlanActivity,
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
  LibraryCourse,
  LibraryLesson,
  LibraryModule,
  LibraryResponse,
  McpTouch,
  MeResponse,
  ModuleCard,
  ModuleContentResponse,
  ModuleMcpActivity,
  PathResponse,
  SessionKind,
  PathResume,
  PathSummary,
  PriorStage,
  TrailPoint,
  CalibrationTrail,
  PathModule,
  Badge,
  CalibrationRecord,
  Credential,
  CohortResponse,
  CohortStat,
  MasteryStage,
  ModuleMastery,
  RecordResponse,
  ReviewItem,
  SkillStatement,
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
  // Voices the podcast, via Gemini's native multi-speaker TTS. The show's only
  // voice engine — without this key episodes are transcript-only.
  GEMINI_API_KEY?: string;
  GEMINI_TTS_MODEL?: string;
  // Episode scripts per session per hour; default 4. Raise for demo/testing.
  PODCAST_LIMIT_PER_HOUR?: string;
  // Email delivery for reminders, kudos, and commitment acknowledgments. With
  // RESEND_API_KEY + EMAIL_FROM unset, rules still evaluate and every intended
  // send is recorded as 'skipped' — nothing is silently dropped or pretended.
  RESEND_API_KEY?: string;
  EMAIL_FROM?: string;
  // The origin cron-sent mail should link back to (requests know their own
  // origin; a scheduled run has no request to ask).
  PUBLIC_ORIGIN?: string;
  SESSION_SECRET?: string;
  ANTHROPIC_API_KEY?: string;
  ADMIN_PASSCODE?: string;
  // Optional bindings. AI powers mic transcription and the tutor's read-aloud
  // voice (not the podcast); R2 caches rendered episode audio.
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

// ---------- short courses ----------

// A short course is a named subset of the catalog that a passcode opens
// instead of the full one. The mapping lives on the code, so the door decides
// the course: which modules, in what order, for which role, and whether a
// diagnostic runs first. Account sessions never resolve to one (their code_id
// is `account:<id>`), so signing in always means the full course.
type ShortCourse = {
  id: string;
  label: string;
  blurb: string | null;
  roleId: string | null;
  moduleIds: string[];
  diagnosticItemIds: string[] | null; // null = this short course has no diagnostic
};

function toShortCourse(row: typeof t.fdShortCourse.$inferSelect): ShortCourse {
  const diagnostic = row.diagnosticJson ? (JSON.parse(row.diagnosticJson) as { items?: unknown }) : null;
  const items = Array.isArray(diagnostic?.items) ? (diagnostic.items as unknown[]).filter((i): i is string => typeof i === 'string') : [];
  return {
    id: row.id,
    label: row.label,
    blurb: row.blurb,
    roleId: row.roleId,
    moduleIds: JSON.parse(row.moduleIdsJson) as string[],
    // Items the content file no longer defines are dropped rather than asked
    // for and never answered — an empty set means no diagnostic.
    diagnosticItemIds: items.filter((id) => diagById.has(id)).length ? items.filter((id) => diagById.has(id)) : null,
  };
}

async function shortCourseForSession(db: DrizzleD1Database, session: SessionRow): Promise<ShortCourse | null> {
  if (session.accountId) return null;
  const rows = await db
    .select({ sc: t.fdShortCourse })
    .from(t.fdAccessCode)
    .innerJoin(t.fdShortCourse, eq(t.fdShortCourse.id, t.fdAccessCode.shortCourseId))
    .where(eq(t.fdAccessCode.id, session.codeId))
    .limit(1);
  return rows[0] ? toShortCourse(rows[0].sc) : null;
}

// ---------- brand ----------

app.get('/api/brand', async (c) => {
  const db = c.get('db');
  const rows = await db.select().from(t.fdBrand).where(eq(t.fdBrand.slug, c.env.BRAND_SLUG)).limit(1);
  const row = rows[0];
  if (!row) return c.json({ error: 'No brand seeded for this deployment. Run the seed migration.' }, 500);
  const profile = row.profileJson ? JSON.parse(row.profileJson) : null;
  // Which doors can actually open, asked of the data rather than a config var:
  // codes exist → the demo door works; a census roster exists → sign-up works
  // (it is roster-gated). Both can be true at once, and usually are.
  const [codeRows, rosterRows] = await Promise.all([
    db
      .select({ n: sql<number>`count(*)` })
      .from(t.fdAccessCode)
      .where(and(eq(t.fdAccessCode.brandSlug, row.slug), eq(t.fdAccessCode.active, 1))),
    db.select({ n: sql<number>`count(*)` }).from(t.fdEmployee).where(eq(t.fdEmployee.brandSlug, row.slug)),
  ]);
  const brand: Brand = {
    slug: row.slug,
    name: row.name,
    doors: { passcode: (codeRows[0]?.n ?? 0) > 0, accounts: (rosterRows[0]?.n ?? 0) > 0 },
    canResetPassword: emailEnabled(c.env),
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
  // Completion moments are client-reported, but what the content *was* is
  // captured server-side at that instant — see audit.ts.
  if (body.type === 'module_completed' && session) {
    const moduleId = (payload as { moduleId?: unknown } | undefined)?.moduleId;
    if (typeof moduleId === 'string') {
      const blockRows = await db.select().from(t.fdContentBlock).where(eq(t.fdContentBlock.moduleId, moduleId)).orderBy(asc(t.fdContentBlock.ordinal));
      const blocks = selectVariants(blockRows, toolingOf(c.env)).map(toBlock);
      if (blocks.length) {
        await witnessContent(db, {
          sessionId: session.id,
          moduleId,
          activity: 'module_completed',
          kind: 'module_blocks',
          content: moduleSnapshot(toolingOf(c.env), blocks),
          dedupe: true,
        });
      }
    }
    // Completing a module is the moment to get the next one's episode waiting
    // for podcast-first learners; runs after the response, never blocks it.
    c.executionCtx.waitUntil(pregenerateNextPodcast(c.env, session.id));
  }
  if (body.type === 'podcast_played' && session) {
    const podcastId = (payload as { podcastId?: unknown } | undefined)?.podcastId;
    if (typeof podcastId === 'string') {
      const rows = await db
        .select()
        .from(t.fdPodcast)
        .where(and(eq(t.fdPodcast.id, podcastId), eq(t.fdPodcast.sessionId, session.id)))
        .limit(1);
      const row = rows[0];
      if (row) {
        const ep = toEpisode(row);
        await witnessContent(db, {
          sessionId: session.id,
          moduleId: row.moduleId,
          activity: 'podcast_listened',
          kind: 'podcast_episode',
          refId: row.id,
          content: { kind: ep.kind, title: ep.title, description: ep.description, lines: ep.lines, outline: ep.outline, takeaways: ep.takeaways, visual: ep.visual },
          dedupe: true,
        });
      }
    }
  }
  return c.json({ ok: true });
});

// ---------- access ----------

// The demo door. Always open when active codes exist — a passcode holder is a
// demo learner whether or not this deployment also has accounts. The two kinds
// coexist; nothing here closes the other door.
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

// ---------- accounts (the product door; passcodes are the demo door) ----------

// Identity is a property of the session, not the deployment: a session with an
// account behind it is a product learner, one without is a demo learner. Every
// feature that needs a census identity (manager view, commitment sharing,
// team-scoped guidance) resolves through this rather than a config switch.
export const sessionKind = (session: SessionRow): SessionKind => (session.accountId ? 'account' : 'demo');
const normalizeEmail = (raw: unknown) => (typeof raw === 'string' ? raw.trim().toLowerCase() : '');
const MIN_PASSWORD_CHARS = 10;

async function setSessionCookie(c: Context<Ctx>, sessionId: string) {
  setCookie(c, COOKIE_NAME, await signSessionId(sessionId, secret(c.env)), {
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
    path: '/',
    maxAge: COOKIE_MAX_AGE,
  });
}

// Shared limiter for signup and sign-in, same shape as passcode attempts.
async function authAttemptsExceeded(db: DrizzleD1Database, ipHashed: string): Promise<boolean> {
  const windowStart = new Date(Date.now() - CODE_ATTEMPT_WINDOW_MS).toISOString();
  const attempts = await db
    .select({ n: sql<number>`count(*)` })
    .from(t.fdEvent)
    .where(
      and(
        eq(t.fdEvent.type, 'auth_attempt_failed'),
        gt(t.fdEvent.createdAt, windowStart),
        sql`json_extract(${t.fdEvent.payloadJson}, '$.ipHash') = ${ipHashed}`,
      ),
    );
  return (attempts[0]?.n ?? 0) >= CODE_ATTEMPT_LIMIT;
}

const clientIpHash = async (c: { req: { header: (n: string) => string | undefined } }, env: Env) => {
  const ip = c.req.header('cf-connecting-ip') ?? c.req.header('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local';
  return hashIp(ip, secret(env));
};

// Sign-up is census-gated: the email must be on the imported employee roster.
// The census is the allowlist — there is no open registration.
app.post('/api/auth/signup', async (c) => {
  const db = c.get('db');
  const body = await c.req.json<{ name?: string; email?: string; password?: string }>().catch(() => null);
  const name = body?.name?.trim();
  const email = normalizeEmail(body?.email);
  const password = body?.password ?? '';
  if (!name) return c.json({ error: 'Tell us your name — it goes on your work.' }, 400);
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return c.json({ error: 'That email doesn’t look right.' }, 400);
  if (password.length < MIN_PASSWORD_CHARS) return c.json({ error: `Passwords need at least ${MIN_PASSWORD_CHARS} characters.` }, 400);

  const ipHashed = await clientIpHash(c, c.env);
  if (await authAttemptsExceeded(db, ipHashed)) {
    return c.json({ error: 'Too many attempts from this connection. Wait 15 minutes.' }, 429);
  }

  const roster = await db
    .select({ n: sql<number>`count(*)` })
    .from(t.fdEmployee)
    .where(eq(t.fdEmployee.brandSlug, c.env.BRAND_SLUG));
  if ((roster[0]?.n ?? 0) === 0) {
    return c.json({ error: 'No employee roster has been imported yet — your admin needs to set up the census before accounts can be created.' }, 403);
  }
  const employees = await db
    .select()
    .from(t.fdEmployee)
    .where(and(eq(t.fdEmployee.brandSlug, c.env.BRAND_SLUG), sql`LOWER(${t.fdEmployee.email}) = ${email}`))
    .limit(1);
  const employee = employees[0];
  if (!employee) {
    await logEvent(db, null, 'auth_attempt_failed', { ipHash: ipHashed, reason: 'not_on_roster' });
    return c.json({ error: 'That email isn’t on the employee roster. Check for typos, or ask your admin to add you.' }, 403);
  }

  const existing = await db
    .select({ id: t.fdAccount.id })
    .from(t.fdAccount)
    .where(and(eq(t.fdAccount.brandSlug, c.env.BRAND_SLUG), eq(t.fdAccount.email, email)))
    .limit(1);
  if (existing[0]) return c.json({ error: 'An account with that email already exists — sign in instead.' }, 409);

  const accountId = uuid();
  await db.insert(t.fdAccount).values({
    id: accountId,
    brandSlug: c.env.BRAND_SLUG,
    email,
    passwordHash: await hashCode(password),
    name: name.slice(0, 80),
    createdAt: now(),
    lastLoginAt: now(),
  });

  const sessionId = uuid();
  await db.insert(t.fdSession).values({
    id: sessionId,
    codeId: `account:${accountId}`,
    accountId,
    brandSlug: c.env.BRAND_SLUG,
    createdAt: now(),
    lastSeenAt: now(),
    userAgent: c.req.header('user-agent') ?? null,
    ipHash: ipHashed,
  });
  // The account name doubles as the participant identity, so the Learners
  // roster and census matching see the real name without waiting on intake.
  await db.insert(t.fdParticipant).values({
    id: uuid(),
    sessionId,
    displayName: name.slice(0, 80),
    roleLabel: employee.roleTitle,
    orgLabel: null,
    createdAt: now(),
  });
  await logEvent(db, sessionId, 'account_created', { emailDomain: email.split('@')[1] });
  await logEvent(db, sessionId, 'signed_in', {});
  await setSessionCookie(c, sessionId);
  return c.json({ ok: true });
});

// Progress follows the account, not the browser: every sign-in reuses the
// account's canonical session, so a new device picks up exactly where the
// last one left off. Shared by password sign-in and by finishing a reset —
// proving control of the mailbox lands you in the same place proving the
// password does, on the same session.
async function openAccountSession(
  db: DrizzleD1Database,
  c: Context<Ctx>,
  account: typeof t.fdAccount.$inferSelect,
  ipHashed: string,
): Promise<string> {
  const sessions = await db
    .select()
    .from(t.fdSession)
    .where(eq(t.fdSession.accountId, account.id))
    .orderBy(desc(t.fdSession.lastSeenAt))
    .limit(1);
  let sessionId = sessions[0]?.id;
  if (!sessionId) {
    sessionId = uuid();
    await db.insert(t.fdSession).values({
      id: sessionId,
      codeId: `account:${account.id}`,
      accountId: account.id,
      brandSlug: c.env.BRAND_SLUG,
      createdAt: now(),
      lastSeenAt: now(),
      userAgent: c.req.header('user-agent') ?? null,
      ipHash: ipHashed,
    });
    await db.insert(t.fdParticipant).values({
      id: uuid(),
      sessionId,
      displayName: account.name,
      roleLabel: null,
      orgLabel: null,
      createdAt: now(),
    });
  } else {
    await db.update(t.fdSession).set({ lastSeenAt: now(), userAgent: c.req.header('user-agent') ?? null }).where(eq(t.fdSession.id, sessionId));
  }
  await db.update(t.fdAccount).set({ lastLoginAt: now() }).where(eq(t.fdAccount.id, account.id));
  await logEvent(db, sessionId, 'signed_in', {});
  return sessionId;
}

app.post('/api/auth/signin', async (c) => {
  const db = c.get('db');
  const body = await c.req.json<{ email?: string; password?: string }>().catch(() => null);
  const email = normalizeEmail(body?.email);
  const password = body?.password ?? '';
  if (!email || !password) return c.json({ error: 'Email and password, both.' }, 400);

  const ipHashed = await clientIpHash(c, c.env);
  if (await authAttemptsExceeded(db, ipHashed)) {
    return c.json({ error: 'Too many attempts from this connection. Wait 15 minutes.' }, 429);
  }

  const accounts = await db
    .select()
    .from(t.fdAccount)
    .where(and(eq(t.fdAccount.brandSlug, c.env.BRAND_SLUG), eq(t.fdAccount.email, email)))
    .limit(1);
  const account = accounts[0];
  const valid = account ? await verifyCode(password, account.passwordHash) : false;
  if (!account || !valid) {
    await logEvent(db, null, 'auth_attempt_failed', { ipHash: ipHashed, reason: 'bad_credentials' });
    return c.json({ error: 'Email or password didn’t match.' }, 401);
  }

  const sessionId = await openAccountSession(db, c, account, ipHashed);
  await setSessionCookie(c, sessionId);
  return c.json({ ok: true });
});

app.post('/api/auth/signout', async (c) => {
  setCookie(c, COOKIE_NAME, '', { httpOnly: true, secure: true, sameSite: 'Lax', path: '/', maxAge: 0 });
  return c.json({ ok: true });
});

app.post('/api/auth/password', async (c) => {
  const db = c.get('db');
  const session = requireSession(c);
  if (!session?.accountId) return c.json({ error: 'Sign in with an account first.' }, 401);
  const body = await c.req.json<{ current?: string; next?: string }>().catch(() => null);
  const current = body?.current ?? '';
  const next = body?.next ?? '';
  if (next.length < MIN_PASSWORD_CHARS) return c.json({ error: `Passwords need at least ${MIN_PASSWORD_CHARS} characters.` }, 400);
  const accounts = await db.select().from(t.fdAccount).where(eq(t.fdAccount.id, session.accountId)).limit(1);
  const account = accounts[0];
  if (!account || !(await verifyCode(current, account.passwordHash))) {
    return c.json({ error: 'Your current password didn’t match.' }, 401);
  }
  await db.update(t.fdAccount).set({ passwordHash: await hashCode(next) }).where(eq(t.fdAccount.id, account.id));
  await logEvent(db, session.id, 'password_changed', {});
  return c.json({ ok: true });
});

// ---------- password reset ----------
//
// The rules this flow is built on, in order of how much they'd cost to get
// wrong:
//
//  1. **The response never depends on whether the account exists.** Same 200,
//     same wording, whether the address is an account, a roster email with no
//     account yet, or a stranger's. A reset form that answers "no such user"
//     is a membership oracle for the company's employee list.
//  2. **The token is the credential, so it is stored the way credentials are
//     stored** — 256 bits of randomness, only its SHA-256 in the database.
//  3. **One live token per account.** A new request invalidates the
//     outstanding ones, so a stale link in a forwarded mail is already dead.
//  4. **Single-use and short-lived.** Consumed on success; expired after
//     RESET_TTL_MS regardless.
//  5. **The link never reaches the delivery log.** Admins can read
//     fd_email_send, and an admin can already reset anyone's password, so
//     this isn't an escalation — but a reset link sitting in a log is a
//     standing key, and it costs nothing to keep it out.
const RESET_TTL_MS = 45 * 60 * 1000;

const accountByEmail = async (db: DrizzleD1Database, brandSlug: string, email: string) => {
  const rows = await db
    .select()
    .from(t.fdAccount)
    .where(and(eq(t.fdAccount.brandSlug, brandSlug), eq(t.fdAccount.email, email)))
    .limit(1);
  return rows[0] ?? null;
};

app.post('/api/auth/reset/request', async (c) => {
  const db = c.get('db');
  const body = await c.req.json<{ email?: string }>().catch(() => null);
  const email = normalizeEmail(body?.email);
  const ipHashed = await clientIpHash(c, c.env);
  // Deliberately not an error: an unparseable address gets the same answer as
  // a real one. The only thing that returns non-200 here is rate limiting.
  const accepted = { ok: true } as const;
  if (await authAttemptsExceeded(db, ipHashed)) {
    return c.json({ error: 'Too many attempts from this connection. Wait 15 minutes.' }, 429);
  }
  if (!email || !deliverableAddress(email)) {
    await logEvent(db, null, 'auth_attempt_failed', { ipHash: ipHashed, reason: 'reset_bad_address' });
    return c.json(accepted);
  }

  const account = await accountByEmail(db, c.env.BRAND_SLUG, email);
  if (!account) {
    // Counted against the IP budget exactly like a wrong password, so probing
    // for which addresses have accounts is as expensive as guessing them.
    await logEvent(db, null, 'auth_attempt_failed', { ipHash: ipHashed, reason: 'reset_no_account' });
    return c.json(accepted);
  }

  await db
    .update(t.fdPasswordReset)
    .set({ usedAt: now() })
    .where(and(eq(t.fdPasswordReset.accountId, account.id), sql`${t.fdPasswordReset.usedAt} IS NULL`));

  const token = randomToken();
  await db.insert(t.fdPasswordReset).values({
    id: uuid(),
    brandSlug: c.env.BRAND_SLUG,
    accountId: account.id,
    tokenHash: await tokenHash(token),
    createdAt: now(),
    expiresAt: new Date(Date.now() + RESET_TTL_MS).toISOString(),
    usedAt: null,
    ipHash: ipHashed,
  });

  const origin = new URL(c.req.url).origin;
  const brandRows = await db.select().from(t.fdBrand).where(eq(t.fdBrand.slug, c.env.BRAND_SLUG)).limit(1);
  const brandName = brandRows[0]?.name ?? 'Your company';
  const link = `${origin}/reset?token=${token}`;
  const logged = `Someone asked to reset the password for this account. The link is good for 45 minutes and can be used once. If this wasn't you, nothing has changed — ignore this and the link expires on its own.`;
  const result = await sendEmail(c.env, {
    to: email,
    subject: 'AI Fluency — reset your password',
    text: `${logged}\n\n${link}${signature(brandName, origin)}`,
  });
  await db.insert(t.fdEmailSend).values({
    id: uuid(),
    brandSlug: c.env.BRAND_SLUG,
    kind: 'password_reset',
    toEmail: email,
    subject: 'AI Fluency — reset your password',
    // The link is omitted on purpose — see rule 5 above.
    body: logged,
    status: result.status,
    provider: result.provider,
    error: result.error,
    createdAt: now(),
  });
  await logEvent(db, null, 'password_reset_requested', { delivery: result.status });
  return c.json(accepted);
});

// Resolves a token to its account, or null. Expiry and single-use are checked
// here rather than at each call site, so the confirm route and the page's
// pre-flight check can never disagree about what "valid" means.
async function liveReset(db: DrizzleD1Database, brandSlug: string, token: string | undefined) {
  if (!token) return null;
  const rows = await db
    .select()
    .from(t.fdPasswordReset)
    .where(and(eq(t.fdPasswordReset.brandSlug, brandSlug), eq(t.fdPasswordReset.tokenHash, await tokenHash(token))))
    .limit(1);
  const row = rows[0];
  if (!row || row.usedAt || Date.parse(row.expiresAt) < Date.now()) return null;
  const accounts = await db.select().from(t.fdAccount).where(eq(t.fdAccount.id, row.accountId)).limit(1);
  return accounts[0] ? { row, account: accounts[0] } : null;
}

// Lets the reset page say "this link has expired, ask for a new one" before
// the learner types a password they're about to lose.
app.get('/api/auth/reset/check', async (c) => {
  const found = await liveReset(c.get('db'), c.env.BRAND_SLUG, c.req.query('token'));
  return c.json({ valid: !!found, ...(found ? { email: found.account.email } : {}) });
});

app.post('/api/auth/reset/confirm', async (c) => {
  const db = c.get('db');
  const body = await c.req.json<{ token?: string; password?: string }>().catch(() => null);
  const password = body?.password ?? '';
  const ipHashed = await clientIpHash(c, c.env);
  if (await authAttemptsExceeded(db, ipHashed)) {
    return c.json({ error: 'Too many attempts from this connection. Wait 15 minutes.' }, 429);
  }
  if (password.length < MIN_PASSWORD_CHARS) {
    return c.json({ error: `Passwords need at least ${MIN_PASSWORD_CHARS} characters.` }, 400);
  }
  const found = await liveReset(db, c.env.BRAND_SLUG, body?.token);
  if (!found) {
    await logEvent(db, null, 'auth_attempt_failed', { ipHash: ipHashed, reason: 'reset_token_invalid' });
    return c.json({ error: 'That reset link has expired or was already used. Ask for a new one.' }, 400);
  }

  await db
    .update(t.fdAccount)
    .set({ passwordHash: await hashCode(password) })
    .where(eq(t.fdAccount.id, found.account.id));
  // Burn every outstanding token for this account, not just the one used: if
  // two requests were in flight, finishing one should close the other.
  await db
    .update(t.fdPasswordReset)
    .set({ usedAt: now() })
    .where(and(eq(t.fdPasswordReset.accountId, found.account.id), sql`${t.fdPasswordReset.usedAt} IS NULL`));

  const sessionId = await openAccountSession(db, c, found.account, ipHashed);
  await logEvent(db, sessionId, 'password_changed', { via: 'reset' });
  await setSessionCookie(c, sessionId);
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


// A learner sees exactly one 301 specialist track — theirs. The others exist
// as courses but are somebody else's curriculum, so they're filtered out of
// both the path and the library rather than shown locked. Falls back to the
// HRBP track for roles whose track isn't authored yet.
function trackFilter(prefs: IntakePrefs, courseIds: Iterable<string>) {
  const mine = trackForRole(prefs.roleId, courseIds);
  const hidden = new Set(ALL_TRACK_IDS.filter((id) => id !== mine));
  return {
    mine,
    keepCourse: (id: string) => !hidden.has(id),
    keepModule: (courseId: string) => !hidden.has(courseId),
  };
}

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
    else if (row.key === 'roleId') prefs.roleId = value;
    else if (row.key === 'roleOther') prefs.roleOther = value;
    else if (row.key === 'shareWork') prefs.shareWork = value === true;
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

  // A short course already knows the answers to two of the intake's questions,
  // so it answers them here rather than asking: the passcode carries the role,
  // and whether the diagnostic runs first is the short course's decision.
  const shortCourse = await shortCourseForSession(db, session);
  const shortCourseRole = shortCourse?.roleId ? roleChoice(shortCourse.roleId) : undefined;
  const roleLabel = shortCourseRole?.label ?? body.roleLabel?.trim().slice(0, 120) ?? null;

  if (body.displayName?.trim() || roleLabel) {
    await db.insert(t.fdParticipant).values({
      id: uuid(),
      sessionId: session.id,
      displayName: body.displayName?.trim().slice(0, 80) || null,
      roleLabel: roleLabel || null,
      orgLabel: null,
      createdAt: now(),
    });
  }

  const raw = shortCourse
    ? {
        ...(body.prefs ?? {}),
        roleId: shortCourseRole?.id,
        roleOther: '',
        start: shortCourse.diagnosticItemIds ? ('diagnostic' as const) : ('module' as const),
      }
    : (body.prefs ?? {});
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
  if (typeof raw.roleId === 'string' && ROLE_IDS.includes(raw.roleId)) clean.push(['roleId', raw.roleId]);
  if (typeof raw.roleOther === 'string') clean.push(['roleOther', raw.roleOther.trim().slice(0, 120)]);

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

// A short course's plan is the whole course, in the order the short course
// declares. There is no path screen and no library behind it, so this is the
// only place the learner sees everything they were given — hence the per-step
// activities, which the plan screen expands in place rather than linking off
// to a catalog. The 101/201/301 tier each module came from is deliberately not
// carried through: inside a short course the order is the short course's, and
// the level names are somebody else's shelving.
async function composeShortCoursePlan(
  db: DrizzleD1Database,
  sessionId: string,
  shortCourse: ShortCourse,
  name: string | null,
  prefs: IntakePrefs,
  diagnosticDone: boolean,
): Promise<PlanResponse> {
  const ids = shortCourse.moduleIds;
  const moduleRows = ids.length ? await db.select().from(t.fdModule).where(inArray(t.fdModule.id, ids)) : [];
  const byId = new Map(moduleRows.map((m) => [m.id, m]));
  const receipts = await receiptsFor(db, sessionId);

  // What each module actually has seeded — the same facts /api/module/:id
  // reports as capabilities, read once for the whole course. An activity is
  // listed only when it exists; the plan never offers a door that opens onto
  // a 404.
  const blockIds = [...ids, ...ids.map((id) => `${id}-micro`)];
  const blockRows = ids.length
    ? await db.selectDistinct({ moduleId: t.fdContentBlock.moduleId }).from(t.fdContentBlock).where(inArray(t.fdContentBlock.moduleId, blockIds))
    : [];
  const hasBlocks = new Set(blockRows.map((b) => b.moduleId));
  const exRows = ids.length
    ? await db.select({ moduleId: t.fdExercise.moduleId, kind: t.fdExercise.kind }).from(t.fdExercise).where(inArray(t.fdExercise.moduleId, ids))
    : [];
  const exKinds = new Map<string, Set<string>>();
  for (const e of exRows) {
    const set = exKinds.get(e.moduleId) ?? new Set<string>();
    set.add(e.kind);
    exKinds.set(e.moduleId, set);
  }

  const activitiesFor = (moduleId: string, estMinutes: number): PlanActivity[] => {
    const out: PlanActivity[] = [];
    const kinds = exKinds.get(moduleId) ?? new Set<string>();
    if (hasBlocks.has(moduleId)) {
      out.push({ id: 'read', label: 'Read it', detail: 'The full module, at your own pace.', minutes: estMinutes, route: `/module/${moduleId}` });
    }
    if (hasBlocks.has(`${moduleId}-micro`)) {
      out.push({ id: 'micro', label: 'The two-minute version', detail: 'The key ideas, cut for a short sitting.', minutes: 2, route: `/module/${moduleId}/micro` });
    }
    if (hasBlocks.has(moduleId)) {
      out.push({ id: 'chat', label: 'Talk it through', detail: 'The tutor teaches the same material in conversation — type or speak.', minutes: null, route: `/module/${moduleId}/chat` });
      out.push({ id: 'podcast', label: 'Listen', detail: 'A two-host episode made for you, from this module.', minutes: null, route: `/module/${moduleId}/podcast` });
    }
    if (kinds.has('knowledge_check')) {
      out.push({ id: 'check', label: 'Knowledge check', detail: 'Pass at 60% and the module is cleared. Retakes are free.', minutes: 5, route: `/module/${moduleId}/check` });
    }
    if (kinds.has('rubric')) {
      out.push({ id: 'activity', label: 'Applied activity', detail: 'Real work from your own week, graded against the rubric in seconds.', minutes: 25, route: `/module/${moduleId}/activity` });
    }
    return out;
  };

  const steps: PlanStep[] = [];
  if (shortCourse.diagnosticItemIds) {
    const count = shortCourse.diagnosticItemIds.length;
    steps.push({
      id: 'diagnostic',
      title: `The diagnostic — ${count} question${count === 1 ? '' : 's'}`,
      detail: 'Not a score — a direction: whether you expect too much or too little from these tools.',
      minutes: Math.max(2, Math.round(count * 0.9)),
      route: '/diagnostic',
      state: diagnosticDone ? 'done' : 'now',
    });
  }

  // One step per module, in the short course's order. Exactly one uncleared
  // module is "this sitting" — the rest wait, because calling four modules a
  // sitting is a claim about someone's afternoon we can't make.
  let markedNow = steps.every((s) => s.state === 'done');
  for (const id of ids) {
    const m = byId.get(id);
    if (!m) continue; // a short course naming a module this deployment hasn't seeded
    const done = receipts.completed.has(id);
    const state: PlanStep['state'] = done ? 'done' : markedNow ? 'now' : 'later';
    if (!done && markedNow) markedNow = false;
    steps.push({
      id,
      moduleId: id,
      title: m.title,
      detail: m.blurb,
      minutes: m.estMinutes,
      route: `/module/${id}`,
      state,
      activities: activitiesFor(id, m.estMinutes),
    });
  }

  const notes: string[] = [];
  const styles = prefs.styles ?? [];
  if (styles.includes('interactive')) notes.push('You chose interactive — every module here has a live tutor chat that teaches the same material in conversation.');
  if (styles.includes('podcast')) notes.push('Learning by listening, as requested — every module is also an episode, made for you.');
  if (styles.includes('assistant_mcp')) notes.push('Taking this course embedded right in your AI tools is on the roadmap — your interest is logged.');
  if (styles.includes('voice')) notes.push('Talking instead of typing is live — every text box has a mic, and the tutor chat reads its replies aloud.');
  if (styles.includes('quiz_first')) notes.push('Test-first, as requested: take each module\'s knowledge check up front — 60%+ clears it, and misses point you at exactly what to study.');
  const depth = depthOf(prefs.depth);
  if (depth === 'essentials') notes.push('Short and sweet, as requested: every module has a two-minute version, and the full read keeps for whenever you want more.');
  else if (depth === 'deep') notes.push('Deep dive: the graded activity and the tutor\'s quiz mode are both open on every module here.');

  const done = steps.filter((s) => s.state === 'done').length;
  const greeting =
    done > 0
      ? name
        ? `${name}, picking back up where you left off.`
        : 'Picking back up where you left off.'
      : name
        ? `${name}, here's your course.`
        : "Here's your course.";

  const next = steps.find((s) => s.state === 'now') ?? steps.find((s) => s.state === 'later');
  return {
    greeting,
    steps,
    notes,
    goals: prefs.goals ?? [],
    objective: prefs.objective || null,
    nextRoute: next?.route ?? steps[0]?.route ?? '/plan',
    shortCourse: { id: shortCourse.id, label: shortCourse.label, blurb: shortCourse.blurb },
  };
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
  const shortCourse = await shortCourseForSession(db, session);
  const plan = shortCourse
    ? await composeShortCoursePlan(db, session.id, shortCourse, participants[0]?.displayName ?? null, prefs, progress.diagnosticDone)
    : composePlan(participants[0]?.displayName ?? null, prefs, progress);
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

  let account: MeResponse['account'] = null;
  if (session.accountId) {
    const accounts = await db.select().from(t.fdAccount).where(eq(t.fdAccount.id, session.accountId)).limit(1);
    if (accounts[0]) account = { email: accounts[0].email, name: accounts[0].name };
  }

  const shortCourse = await shortCourseForSession(db, session);

  const res: MeResponse = {
    authenticated: true,
    kind: session.accountId ? 'account' : 'demo',
    displayName: participants[0]?.displayName ?? null,
    roleLabel: participants[0]?.roleLabel ?? null,
    account,
    brandSlug: session.brandSlug,
    shortCourse: shortCourse
      ? {
          id: shortCourse.id,
          label: shortCourse.label,
          blurb: shortCourse.blurb,
          roleId: shortCourse.roleId,
          moduleIds: shortCourse.moduleIds,
          hasDiagnostic: shortCourse.diagnosticItemIds !== null,
        }
      : null,
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

// A short course names the diagnostic items it wants; everyone else gets the
// full nine. The order is the content file's either way, so the two kinds of
// learner see the same questions asked the same way.
async function diagItemsFor(db: DrizzleD1Database, session: SessionRow) {
  const shortCourse = await shortCourseForSession(db, session);
  if (!shortCourse?.diagnosticItemIds) return diagItems;
  const wanted = new Set(shortCourse.diagnosticItemIds);
  return diagItems.filter((i) => wanted.has(i.id));
}

app.get('/api/diagnostic', async (c) => {
  const session = requireSession(c);
  if (!session) return c.json({ error: 'No session.' }, 401);
  const items: DiagnosticItemPublic[] = (await diagItemsFor(c.get('db'), session)).map((i) =>
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
  const asked = await diagItemsFor(db, session);
  if (!asked.some((i) => i.id === item.id)) return c.json({ error: 'That item is not part of your diagnostic.' }, 400);

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

// `items` scopes the report to what this learner was actually asked — the
// full nine, or the subset a short course named. Scoring a short course
// against nine items would report misses on questions nobody put to them.
async function computeDiagnosticResult(
  db: DrizzleD1Database,
  sessionId: string,
  items: typeof diagItems = diagItems,
): Promise<DiagnosticResult> {
  const responses = await db.select().from(t.fdDiagnosticResponse).where(eq(t.fdDiagnosticResponse.sessionId, sessionId));
  const byItem = new Map(responses.map((r) => [r.itemId, r]));

  let kCorrect = 0;
  let kTotal = 0;
  const points: DiagnosticResult['calibration']['points'] = [];
  for (const item of items) {
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
    answered: items.filter((i) => byItem.has(i.id)).length,
    total: items.length,
    knowledge: { correct: kCorrect, total: kTotal },
    calibration: { points, meanDelta: Math.round(mean * 10) / 10, meanAbsDelta: Math.round(meanAbs * 10) / 10, direction, headline, detail },
  };
}

app.post('/api/diagnostic/complete', async (c) => {
  const db = c.get('db');
  const session = requireSession(c);
  if (!session) return c.json({ error: 'No session.' }, 401);
  const result = await computeDiagnosticResult(db, session.id, await diagItemsFor(db, session));
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
  return c.json(await computeDiagnosticResult(db, session.id, await diagItemsFor(db, session)));
});

// ---------- path & content ----------

// The learner's earned record, shared by the path and the library: which
// modules are cleared (completed, or knowledge check at 60%+ — retakes are
// free, so the gate asks for understanding, not mere submission), the
// completion dates and best check scores that stamp the rows, and whether
// the diagnostic tested them out of 101-M1.
async function receiptsFor(db: DrizzleD1Database, sessionId: string) {
  const doneRows = await db
    .select()
    .from(t.fdEvent)
    .where(
      and(
        eq(t.fdEvent.sessionId, sessionId),
        sql`${t.fdEvent.type} IN ('module_completed', 'knowledge_check_submitted')`,
      ),
    );
  const completed = new Set<string>();
  const completedAtById = new Map<string, string>();
  const bestCheckById = new Map<string, { correct: number; total: number }>();
  const attempts: CheckAttempt[] = [];
  for (const e of doneRows) {
    if (!e.payloadJson) continue;
    const p = JSON.parse(e.payloadJson) as { moduleId?: string; correct?: number; total?: number; missed?: string[] };
    if (typeof p.moduleId !== 'string') continue;
    if (e.type === 'module_completed') {
      completed.add(p.moduleId);
      const prev = completedAtById.get(p.moduleId);
      if (!prev || e.createdAt < prev) completedAtById.set(p.moduleId, e.createdAt);
    } else if (p.total) {
      if ((p.correct ?? 0) / p.total >= 0.6) completed.add(p.moduleId);
      attempts.push({ moduleId: p.moduleId, correct: p.correct ?? 0, total: p.total, missed: p.missed ?? null, at: e.createdAt });
      const best = bestCheckById.get(p.moduleId);
      if (!best || (p.correct ?? 0) / p.total > best.correct / best.total) {
        bestCheckById.set(p.moduleId, { correct: p.correct ?? 0, total: p.total });
      }
    }
  }
  attempts.sort((a, b) => a.at.localeCompare(b.at));
  const kResponses = await db
    .select()
    .from(t.fdDiagnosticResponse)
    .where(and(eq(t.fdDiagnosticResponse.sessionId, sessionId), sql`${t.fdDiagnosticResponse.correct} IS NOT NULL`));
  const kTotal = diagItems.filter((i) => i.kind === 'knowledge').length;
  const kCorrect = kResponses.filter((r) => r.correct === 1).length;
  const testedOutM1 = kResponses.length >= kTotal && kCorrect >= kTotal - 1;
  return { completed, completedAtById, bestCheckById, testedOutM1, attempts };
}

// Spacing is deliberately legible rather than clever: a first miss comes back
// in three days, a repeat miss the next day. The point is that misses come
// back at all — the exact curve matters far less than the return.
const REVIEW_DELAY_DAYS = (misses: number) => (misses >= 2 ? 1 : 3);

type CheckAttempt = { moduleId: string; correct: number; total: number; missed: string[] | null; at: string };

// Questions still owed a second look: the misses on each module's most recent
// attempt, with the date each is due back. A question the learner has since got
// right simply isn't in that attempt's `missed` list, so it leaves the queue on
// its own — there is no separate "cleared" bookkeeping to fall out of sync.
// Attempts recorded before misses were tracked carry no `missed` array; they
// contribute a score and nothing to review.
function outstandingMisses(attempts: CheckAttempt[]) {
  const byModule = new Map<string, CheckAttempt[]>();
  for (const a of attempts) byModule.set(a.moduleId, [...(byModule.get(a.moduleId) ?? []), a]);
  const out: { moduleId: string; questionId: string; missedAt: string; dueAt: string; misses: number }[] = [];
  for (const [moduleId, list] of byModule) {
    const latest = list[list.length - 1];
    if (!latest.missed?.length) continue;
    for (const questionId of latest.missed) {
      const misses = list.filter((a) => a.missed?.includes(questionId)).length;
      out.push({
        moduleId,
        questionId,
        missedAt: latest.at,
        dueAt: new Date(new Date(latest.at).getTime() + REVIEW_DELAY_DAYS(misses) * 86_400_000).toISOString(),
        misses,
      });
    }
  }
  return out;
}

// The open loop: the module the session last touched and never cleared. Read
// from the funnel like everything else — the newest touch on an uncleared
// module wins, and the event type says which surface to send them back to.
// Shared by the path (its hero) and the library (the in-progress stamp), so
// the two screens never disagree about where the learner left off.
const RESUME_VIA: Record<string, PathResume['via']> = {
  module_opened: 'read',
  chat_started: 'chat',
  chat_message: 'chat',
  podcast_started: 'podcast',
  podcast_played: 'podcast',
  knowledge_check_started: 'check',
  knowledge_check_submitted: 'check',
  sort_submitted: 'exercise',
  choice_submitted: 'exercise',
  activity_submitted: 'activity',
};

async function resumeFor(db: DrizzleD1Database, sessionId: string, unclearedIds: Set<string>): Promise<PathResume | null> {
  const touchRows = await db
    .select({ type: t.fdEvent.type, at: t.fdEvent.createdAt, moduleId: sql<string | null>`json_extract(${t.fdEvent.payloadJson}, '$.moduleId')` })
    .from(t.fdEvent)
    .where(and(eq(t.fdEvent.sessionId, sessionId), inArray(t.fdEvent.type, Object.keys(RESUME_VIA))))
    .orderBy(desc(t.fdEvent.createdAt))
    .limit(60);
  const touch = touchRows.find((r) => r.moduleId && unclearedIds.has(r.moduleId));
  return touch?.moduleId ? { moduleId: touch.moduleId, at: touch.at, via: RESUME_VIA[touch.type] } : null;
}

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
  // Per-module receipts for the ledger rows: when it was completed, and the
  // best knowledge-check attempt — both straight from the rows above.
  const completedAtById = new Map<string, string>();
  const bestCheckById = new Map<string, { correct: number; total: number }>();
  for (const e of doneRows) {
    if (!e.payloadJson) continue;
    const p = JSON.parse(e.payloadJson) as { moduleId?: string; correct?: number; total?: number };
    if (typeof p.moduleId !== 'string') continue;
    if (e.type === 'module_completed') {
      const prev = completedAtById.get(p.moduleId);
      if (!prev || e.createdAt < prev) completedAtById.set(p.moduleId, e.createdAt);
    } else if (p.total) {
      const best = bestCheckById.get(p.moduleId);
      if (!best || (p.correct ?? 0) / p.total > best.correct / best.total) {
        bestCheckById.set(p.moduleId, { correct: p.correct ?? 0, total: p.total });
      }
    }
  }

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
  // A learner sees one 301 track — theirs. Availability comes from what's
  // actually seeded, so a declared-but-unauthored track falls back to the
  // default rather than serving an empty course.
  const track = trackFilter(prefs, rows.map((m) => m.courseId));
  const trackRows = rows.filter((m) => track.keepModule(m.courseId));
  const selectedGoals = GOAL_CHOICES.filter((g) => (prefs.goals ?? []).includes(g.id));
  const diagReasons = new Map<string, string>();
  let diagnosticNote: string | null = null;
  const diagDoneRows = await db
    .select({ n: sql<number>`count(*)` })
    .from(t.fdEvent)
    .where(and(eq(t.fdEvent.sessionId, session.id), eq(t.fdEvent.type, 'diagnostic_completed')));
  if ((diagDoneRows[0]?.n ?? 0) > 0) {
    const diag = await computeDiagnosticResult(db, session.id);
    const dir = diag.calibration.direction;
    if (dir === 'over' || dir === 'mixed') diagReasons.set('ai101-m6', 'your diagnostic: you expect too much from these tools');
    if (dir === 'under' || dir === 'mixed') diagReasons.set('ai101-m5', 'your diagnostic: you expect too little from these tools');
    diagnosticNote =
      dir === 'over' ? 'your diagnostic says you expect too much from these tools'
      : dir === 'under' ? 'your diagnostic says you expect too little from these tools'
      : dir === 'mixed' ? 'your diagnostic says your expectations swing both ways'
      : 'your diagnostic says your instincts are well calibrated';
  }
  const reasonsFor = (moduleId: string): string[] => {
    const reasons: string[] = [];
    if (moduleId === 'ai101-m1') reasons.push('where every path starts');
    for (const g of selectedGoals) if (g.modules.includes(moduleId)) reasons.push(`your goal: ${g.label}`);
    const d = diagReasons.get(moduleId);
    if (d) reasons.push(d);
    return reasons;
  };

  const modules: PathModule[] = trackRows.map((m) => {
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
      completedAt: completedAtById.get(m.id) ?? null,
      bestCheck: bestCheckById.get(m.id) ?? null,
    };
  });

  // The progress instrument: every number an honest read of the funnel.
  // Minutes use the admin's math — gaps between consecutive events, counting
  // only gaps under 10 minutes, so idle tabs don't inflate the estimate.
  const openModules = modules.filter((m) => m.access === 'open');
  const activeRaw = await db.all<{ active_min: number | null }>(sql`
    WITH gaps AS (
      SELECT (julianday(created_at) - julianday(LAG(created_at) OVER (ORDER BY created_at))) * 1440.0 AS gap_min
      FROM fd_event WHERE session_id = ${session.id}
    )
    SELECT ROUND(SUM(CASE WHEN gap_min <= 10 THEN gap_min ELSE 0 END)) AS active_min FROM gaps`);
  const activeRows = Array.isArray(activeRaw) ? activeRaw : ((activeRaw as { results?: { active_min: number | null }[] }).results ?? []);
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const dayRows = await db
    .select({ day: sql<string>`DISTINCT substr(${t.fdEvent.createdAt}, 1, 10)` })
    .from(t.fdEvent)
    .where(and(eq(t.fdEvent.sessionId, session.id), sql`${t.fdEvent.createdAt} > ${weekAgo}`));
  const openIds = new Set(openModules.map((m) => m.id));
  const bestOnOpen = [...bestCheckById.entries()].filter(([id]) => openIds.has(id)).map(([, s]) => s);
  const lastEventRows = await db
    .select({ at: t.fdEvent.createdAt })
    .from(t.fdEvent)
    .where(eq(t.fdEvent.sessionId, session.id))
    .orderBy(desc(t.fdEvent.createdAt))
    .limit(1);
  const summary: PathSummary = {
    openTotal: openModules.length,
    doneCount: openModules.filter((m) => m.completed || m.testedOut).length,
    testedOutCount: openModules.filter((m) => m.testedOut).length,
    // What's actually left, not a percentage — "~34 min to finish" is a
    // decision the learner can make; "62% complete" isn't.
    minutesRemaining: openModules.filter((m) => !m.completed && !m.testedOut).reduce((sum, m) => sum + m.estMinutes, 0),
    minutesInvested: activeRows[0]?.active_min ?? 0,
    activeDays7: dayRows.length,
    activeDays: dayRows.map((r) => r.day),
    lastActiveAt: lastEventRows[0]?.at ?? null,
    // Misses owed a second look right now. The full queue lives on the record;
    // the path only needs to know whether to raise a hand.
    reviewDue: outstandingMisses(
      doneRows
        .filter((e) => e.type === 'knowledge_check_submitted')
        .map((e) => {
          const p = JSON.parse(e.payloadJson ?? '{}') as { moduleId?: string; correct?: number; total?: number; missed?: string[] };
          return { moduleId: p.moduleId ?? '', correct: p.correct ?? 0, total: p.total ?? 0, missed: p.missed ?? null, at: e.createdAt };
        })
        .filter((a) => a.moduleId)
        .sort((a, b) => a.at.localeCompare(b.at)),
    ).filter((m) => Date.parse(m.dueAt) <= Date.now()).length,
    checks: bestOnOpen.length
      ? {
          passed: bestOnOpen.filter((s) => s.total > 0 && s.correct / s.total >= 0.6).length,
          correct: bestOnOpen.reduce((sum, s) => sum + s.correct, 0),
          total: bestOnOpen.reduce((sum, s) => sum + s.total, 0),
        }
      : null,
  };

  const uncleared = new Set(openModules.filter((m) => !m.completed && !m.testedOut).map((m) => m.id));
  const resume = await resumeFor(db, session.id, uncleared);

  // "Up next" is the same ranking the MCP tutor recommends from — one brain,
  // two surfaces.
  const recs = await recommendationsFor(db, { loadPrefs, computeDiagnosticResult }, session.id);
  const upNext = recs.map(({ moduleId, reasons }) => ({ moduleId, reasons }));

  // Courses beyond 101 are locked cards; they live in content, not the DB, until they exist.
  const { courses } = (await import('../../content/modules.json')) as unknown as { courses: CourseCard[] };
  const coursesOut: CourseCard[] = courses
    .filter((course) => track.keepCourse(course.id))
    .map((course) => ({
      ...course,
      recommendedFor: selectedGoals.filter((g) => g.courses.includes(course.id)).map((g) => `your goal: ${g.label}`),
    }));
  // The manager layer, present only when this session belongs to an account the
  // census knows. Passcode sessions are anonymous, so all three come back empty.
  const [managerSignals, commitment, isManager, mcpRows] = await Promise.all([
    managerSignalsFor(db, c.env.BRAND_SLUG, session),
    commitmentFor(db, c.env.BRAND_SLUG, session),
    hasReports(db, c.env.BRAND_SLUG, session),
    db
      .select({ id: t.fdEvent.id })
      .from(t.fdEvent)
      .where(and(eq(t.fdEvent.sessionId, session.id), inArray(t.fdEvent.type, ['mcp_connected', 'mcp_tool_called'])))
      .limit(1),
  ]);

  const res: PathResponse = {
    modules,
    courses: coursesOut,
    summary,
    diagnosticNote,
    upNext,
    resume,
    managerSignals,
    commitment: commitment.commitment || commitment.canShare ? commitment : null,
    isManager,
    mcpConnected: mcpRows.length > 0,
  };
  return c.json(res);
});

// The library: the whole program at full richness — every module with its
// blurb, its real lesson headings (anchored for deep links), its ways in,
// and the learner's receipts stamped on. Locked tiers included; seeing
// what's in the full course is the point.
const LIBRARY_NON_LESSONS = new Set(['Module brief', 'Why this module exists', 'Key takeaways', 'Sources and attribution']);

app.get('/api/library', async (c) => {
  const db = c.get('db');
  const session = requireSession(c);
  if (!session) return c.json({ error: 'No session.' }, 401);
  const rows = await db.select().from(t.fdModule).orderBy(asc(t.fdModule.courseId), asc(t.fdModule.ordinal));
  const receipts = await receiptsFor(db, session.id);
  const tooling = toolingOf(c.env);

  // Misses due back now, per module — the same spacing the record's review
  // queue uses, so a card's "due for review" never disagrees with /record.
  const dueByModule = new Map<string, number>();
  const nowMs = Date.now();
  for (const miss of outstandingMisses(receipts.attempts)) {
    if (Date.parse(miss.dueAt) <= nowMs) dueByModule.set(miss.moduleId, (dueByModule.get(miss.moduleId) ?? 0) + 1);
  }

  // All seeded blocks for open modules in one read; lesson headings come from
  // the same variant selection every other surface uses.
  const openIds = rows.filter((m) => m.status === 'open').map((m) => m.id);
  const blockRows = openIds.length
    ? await db
        .select()
        .from(t.fdContentBlock)
        .where(inArray(t.fdContentBlock.moduleId, openIds))
        .orderBy(asc(t.fdContentBlock.ordinal))
    : [];
  const blocksByModule = new Map<string, typeof blockRows>();
  for (const b of blockRows) {
    const list = blocksByModule.get(b.moduleId);
    if (list) list.push(b);
    else blocksByModule.set(b.moduleId, [b]);
  }
  const lessonsOf = (moduleId: string): LibraryLesson[] => {
    const blocks = selectVariants(blocksByModule.get(moduleId) ?? [], tooling);
    const out: LibraryLesson[] = [];
    for (const b of blocks) {
      if ((b.kind !== 'prose' && b.kind !== 'reveal') || !b.body.startsWith('## ')) continue;
      let title = b.body.split('\n')[0].replace(/^##\s*/, '').trim();
      if (LIBRARY_NON_LESSONS.has(title)) continue;
      // "The lab" in the title is the signal; a bare [V] marks volatility
      // (tool names, prices), which many non-lab lessons carry.
      const lab = /\bthe lab\b/i.test(title);
      title = title.replace(/\s*\[V\]\s*$/, '').replace(/^Lesson \d+\s*·\s*/, '');
      out.push({ title, blockId: b.id, lab });
    }
    return out;
  };

  const exRows = await db.select({ moduleId: t.fdExercise.moduleId, kind: t.fdExercise.kind }).from(t.fdExercise);
  const kindsByModule = new Map<string, Set<string>>();
  for (const e of exRows) {
    const set = kindsByModule.get(e.moduleId) ?? new Set<string>();
    set.add(e.kind);
    kindsByModule.set(e.moduleId, set);
  }

  const toLibraryModule = (m: (typeof rows)[number]): LibraryModule => {
    const open = m.status === 'open';
    const lessons = open ? lessonsOf(m.id) : [];
    const kinds = kindsByModule.get(m.id) ?? new Set<string>();
    return {
      ...(m as ModuleCard),
      microMinutes: 2,
      lessons,
      // Locked modules ship with the course promise — read, listen, tutor,
      // graded work, and a check — but never fake seeded exercises or labs.
      ways: open
        ? {
            read: lessons.length > 0,
            listen: (blocksByModule.get(m.id)?.length ?? 0) > 0,
            tutor: (blocksByModule.get(m.id)?.length ?? 0) > 0,
            exercise: kinds.has('sorting') || kinds.has('choice'),
            lab: lessons.some((l) => l.lab),
            graded: kinds.has('rubric'),
            check: kinds.has('knowledge_check'),
          }
        : { read: true, listen: true, tutor: true, exercise: false, lab: false, graded: true, check: true },
      completed: receipts.completed.has(m.id),
      testedOut: !receipts.completed.has(m.id) && m.id === 'ai101-m1' && receipts.testedOutM1,
      completedAt: receipts.completedAtById.get(m.id) ?? null,
      bestCheck: receipts.bestCheckById.get(m.id) ?? null,
      reviewDue: dueByModule.get(m.id) ?? 0,
    };
  };

  const prefs = await loadPrefs(db, session.id);
  const goalsPicked = GOAL_CHOICES.filter((g) => (prefs.goals ?? []).includes(g.id));
  const { courses } = (await import('../../content/modules.json')) as unknown as { courses: CourseCard[] };
  // Same availability rule as the path: seeded module rows, not declared courses.
  const track = trackFilter(prefs, rows.map((m) => m.courseId));
  const coursesOut: LibraryCourse[] = courses
    .filter((course) => track.keepCourse(course.id))
    .map((course) => ({
      ...course,
      recommendedFor: goalsPicked.filter((g) => g.courses.includes(course.id)).map((g) => `your goal: ${g.label}`),
      modules: rows.filter((m) => m.courseId === course.id).map(toLibraryModule),
    }));

  const allModules = coursesOut.flatMap((course) => course.modules);
  const recs = await recommendationsFor(db, { loadPrefs, computeDiagnosticResult }, session.id);
  const unclearedIds = new Set(allModules.filter((m) => m.status === 'open' && !m.completed && !m.testedOut).map((m) => m.id));
  const res: LibraryResponse = {
    courses: coursesOut,
    totals: {
      courses: coursesOut.length,
      modules: allModules.length,
      lessons: allModules.reduce((sum, m) => sum + m.lessons.length, 0),
      minutes: allModules.reduce((sum, m) => sum + m.estMinutes, 0),
    },
    clearedCount: allModules.filter((m) => m.status === 'open' && (m.completed || m.testedOut)).length,
    nextModuleId: recs[0]?.moduleId ?? null,
    resume: await resumeFor(db, session.id, unclearedIds),
    reviewDue: [...dueByModule.values()].reduce((sum, n) => sum + n, 0),
  };
  return c.json(res);
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
  await witnessContent(db, {
    sessionId: session.id,
    moduleId: `${id}-micro`,
    activity: 'micro_viewed',
    kind: 'module_blocks',
    content: moduleSnapshot(toolingOf(c.env), blocks),
    dedupe: true,
  });
  return c.json({ blocks, stamps: stampsFor(blocks) });
});

// Content plumbing (variant selection, block projection, stamps, fd_exercise
// access, sorting scoring) lives in content.ts, shared with the MCP server.

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
  // clicks Listen, the instant path is usually ready. Skips in one query when
  // fresh. Body audio is left to the cron: the open is what they're waiting on.
  c.executionCtx.waitUntil(bakeStock(c.env, id, { deferBody: true }));
  const blockRows = await db.select().from(t.fdContentBlock).where(eq(t.fdContentBlock.moduleId, id)).orderBy(asc(t.fdContentBlock.ordinal));
  const blocks = selectVariants(blockRows, toolingOf(c.env)).map(toBlock);
  const words = blocks.reduce((sum, b) => sum + b.body.split(/\s+/).length, 0);

  // Witness what this session was shown: one audit row per content version
  // per session, so later completions can be checked against what was seen.
  if (blocks.length) {
    await witnessContent(db, {
      sessionId: session.id,
      moduleId: id,
      activity: 'module_viewed',
      kind: 'module_blocks',
      content: moduleSnapshot(toolingOf(c.env), blocks),
      dedupe: true,
    });
  }

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

  // This session's MCP trail: the assistant-side tools write the same funnel
  // (with via/modality markers), so the module page can show "your assistant
  // has been here" — one row per kind of touch, newest first.
  const mcp = await mcpActivityFor(db, session.id, id);

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
    mcp,
  };
  return c.json(res);
});

// Summarize this session's MCP-side activity: everUsed says whether the
// connection has ever been exercised (any module), touches are this module's
// assistant-side moments — deduped to the newest per kind so the card reads
// as a record, not a log.
async function mcpActivityFor(db: DrizzleD1Database, sessionId: string, moduleId: string): Promise<ModuleMcpActivity> {
  const rows = await db
    .select({ type: t.fdEvent.type, payloadJson: t.fdEvent.payloadJson, createdAt: t.fdEvent.createdAt })
    .from(t.fdEvent)
    .where(
      and(
        eq(t.fdEvent.sessionId, sessionId),
        sql`${t.fdEvent.type} IN ('module_opened', 'knowledge_check_submitted', 'module_completed', 'module_calibration_recorded', 'mcp_apply_to_work', 'mcp_teach_back')`,
      ),
    )
    .orderBy(desc(t.fdEvent.createdAt))
    .limit(400);

  let everUsed = false;
  const byKind = new Map<McpTouch['kind'], McpTouch>();
  for (const row of rows) {
    if (!row.payloadJson) continue;
    let p: { moduleId?: string; via?: string; modality?: string; view?: string; correct?: number; total?: number; task?: string; text?: string };
    try {
      p = JSON.parse(row.payloadJson);
    } catch {
      continue;
    }
    const overMcp = p.via === 'mcp' || p.modality === 'mcp' || row.type.startsWith('mcp_');
    if (!overMcp) continue;
    everUsed = true;
    if (p.moduleId !== moduleId) continue;

    let touch: McpTouch | null = null;
    if (row.type === 'module_opened') {
      touch = { kind: 'taught', detail: p.view === 'summary' ? 'the two-minute cut' : null, at: row.createdAt };
    } else if (row.type === 'knowledge_check_submitted' && p.total) {
      touch = { kind: 'quizzed', detail: `${p.correct ?? 0}/${p.total}`, at: row.createdAt };
    } else if (row.type === 'module_completed') {
      touch = { kind: 'completed', detail: null, at: row.createdAt };
    } else if (row.type === 'mcp_apply_to_work') {
      touch = { kind: 'applied', detail: p.task ? p.task.slice(0, 120) : null, at: row.createdAt };
    } else if (row.type === 'mcp_teach_back') {
      touch = { kind: 'teach_back', detail: p.total !== undefined ? `${p.total}/15` : null, at: row.createdAt };
    } else if (row.type === 'module_calibration_recorded') {
      touch = { kind: 'predicted', detail: null, at: row.createdAt };
    }
    // Rows arrive newest-first — the first of each kind is the one to keep.
    if (touch && !byKind.has(touch.kind)) byKind.set(touch.kind, touch);
  }
  return { everUsed, touches: [...byKind.values()] };
}

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

// A module's cohort comparison: how everyone else answered the same opening
// prediction. Two rules are enforced here rather than in the UI, because both
// are about the integrity of the measurement rather than the look of it.
//
// 1. A field is returned only once THIS session has committed its own number.
//    Showing the crowd first would anchor the learner and destroy the very
//    prediction the comparison exists to measure.
// 2. Nothing is returned below COHORT_MIN_N other respondents. That is the
//    minimum-cell-size rule this curriculum teaches, applied to itself — with
//    an n of one or two, "the cohort median" is one person's answer.
const COHORT_MIN_N = 5;

const quantile = (sorted: number[], q: number) => {
  if (!sorted.length) return 0;
  const pos = (sorted.length - 1) * q;
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  return lo === hi ? sorted[lo] : sorted[lo] + (sorted[hi] - sorted[lo]) * (pos - lo);
};

app.get('/api/module/:id/cohort', async (c) => {
  const db = c.get('db');
  const session = requireSession(c);
  if (!session) return c.json({ error: 'No session.' }, 401);
  const moduleId = c.req.param('id');
  const rubric = await getExercise<RubricPayload>(db, moduleId, 'rubric');
  const fields = rubric?.opening ?? [];
  const empty: CohortResponse = { minN: COHORT_MIN_N, stats: [] };
  if (!fields.length) return c.json(empty);

  const contexts = fields.map((f) => `${moduleId}:cal:${f.key}`);
  const rows = await db
    .select({
      sessionId: t.fdCalibration.sessionId,
      context: t.fdCalibration.context,
      predictedPct: t.fdCalibration.predictedPct,
      delta: t.fdCalibration.delta,
    })
    .from(t.fdCalibration)
    .where(inArray(t.fdCalibration.context, contexts));

  const stats: CohortStat[] = [];
  for (const field of fields) {
    const context = `${moduleId}:cal:${field.key}`;
    const forField = rows.filter((r) => r.context === context);
    // Rule 1: no own answer, no comparison.
    if (!forField.some((r) => r.sessionId === session.id)) continue;
    const others = forField.filter((r) => r.sessionId !== session.id);
    // Rule 2: minimum cell size.
    if (others.length < COHORT_MIN_N) continue;

    const predicted = others.map((r) => r.predictedPct).sort((a, b) => a - b);
    const closedRows = others.filter((r) => r.delta !== null && r.delta !== undefined);
    const stat: CohortStat = {
      key: field.key,
      n: others.length,
      median: Math.round(quantile(predicted, 0.5)),
      p25: Math.round(quantile(predicted, 0.25)),
      p75: Math.round(quantile(predicted, 0.75)),
    };
    if (closedRows.length >= COHORT_MIN_N) {
      const absDeltas = closedRows.map((r) => Math.abs(r.delta as number)).sort((a, b) => a - b);
      // delta = actual - predicted, so a negative delta means they predicted high.
      const over = closedRows.filter((r) => (r.delta as number) < 0).length;
      stat.closed = {
        n: closedRows.length,
        medianAbsDelta: Math.round(quantile(absDeltas, 0.5)),
        overPct: Math.round((over / closedRows.length) * 100),
      };
    }
    stats.push(stat);
  }
  return c.json({ minN: COHORT_MIN_N, stats } satisfies CohortResponse);
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

// The learner's provisioned AI tools, as display names for a prompt. The brand
// profile (company-declared) wins; intake prefs fill in when the brand doesn't
// say; [] when neither knows — callers phrase generically in that case.
const AI_TOOL_LABELS: Record<string, string> = { claude: 'Claude', chatgpt: 'ChatGPT', gemini: 'Gemini' };
async function resolveAiTools(db: DrizzleD1Database, brandSlug: string, prefs: IntakePrefs): Promise<string[]> {
  const brandRows = await db.select().from(t.fdBrand).where(eq(t.fdBrand.slug, brandSlug)).limit(1);
  const profile = brandRows[0]?.profileJson ? (JSON.parse(brandRows[0].profileJson) as { aiTools?: unknown }) : null;
  if (Array.isArray(profile?.aiTools) && profile.aiTools.length) {
    return profile.aiTools.filter((x): x is string => typeof x === 'string').slice(0, 6);
  }
  const names = (prefs.aiTools ?? []).filter((id) => id !== 'other').map((id) => AI_TOOL_LABELS[id] ?? id);
  if ((prefs.aiTools ?? []).includes('other') && prefs.aiToolOther?.trim()) names.push(prefs.aiToolOther.trim().slice(0, 40));
  return names;
}

// Everything the tutor should know about this learner, phrased for the prompt.
async function buildLearnerContext(db: DrizzleD1Database, brandSlug: string, sessionId: string): Promise<TutorLearnerContext> {
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
    aiTools: await resolveAiTools(db, brandSlug, prefs),
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
  const learner = await buildLearnerContext(db, c.env.BRAND_SLUG, session.id);
  const guidance = await guidanceFor(db, c.env, moduleId, loaded.mod.courseId, await managerEmailOf(db, c.env.BRAND_SLUG, session));
  const system = buildTutorSystem(loaded.mod as ModuleCard, loaded.blocks, courseModules as ModuleCard[], learner, guidance?.text ?? null);

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
  const reveal = await scoreSortingSubmission(db, session.id, moduleId, sorting, assignments);
  if (!reveal) {
    return c.json({ error: `Commit all ${sorting.tasks.length} before the reveal — an unscored guess teaches nothing.` }, 400);
  }
  await logEvent(db, session.id, 'sort_submitted', { moduleId, correct: reveal.score.correct, total: reveal.score.total, overAssigned: reveal.overAssigned, underAssigned: reveal.underAssigned });
  await witnessContent(db, { sessionId: session.id, moduleId, activity: 'sort_submitted', kind: 'exercise', content: { kind: 'sorting', payload: sorting } });
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
  await witnessContent(db, { sessionId: session.id, moduleId, activity: 'choice_submitted', kind: 'exercise', content: { kind: 'choice', payload: choice } });
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
  // Which questions were missed, not just how many: the review queue is built
  // from these ids, and a score alone can't say what to bring back.
  const missed = results.filter((r) => !r.correct).map((r) => r.id);
  await logEvent(db, session.id, 'knowledge_check_submitted', { moduleId, correct, total: kc.questions.length, missed });
  await witnessContent(db, { sessionId: session.id, moduleId, activity: 'knowledge_check_submitted', kind: 'exercise', content: { kind: 'knowledge_check', payload: kc } });
  return c.json({ score: { correct, total: kc.questions.length }, results });
});

// ---------- commitment ----------

// A date the learner picks, and — if they choose — their manager is told. The
// reciprocal half (an acknowledgment, and what the manager will do to protect
// the time) lives in manager.ts. A declaration nobody answered is a much weaker
// commitment than a handshake, which is the whole reason for the second half.
app.get('/api/commitment', async (c) => {
  const session = requireSession(c);
  if (!session) return c.json({ error: 'No session.' }, 401);
  return c.json(await commitmentFor(c.get('db'), c.env.BRAND_SLUG, session));
});

app.post('/api/commitment', async (c) => {
  const db = c.get('db');
  const session = requireSession(c);
  if (!session) return c.json({ error: 'No session.' }, 401);
  const body = await c.req.json<{ courseId?: string; targetDate?: string; note?: string; share?: boolean }>().catch(() => null);
  const targetDate = (body?.targetDate ?? '').trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(targetDate)) return c.json({ error: 'Pick a date.' }, 400);
  if (Date.parse(`${targetDate}T23:59:59Z`) < Date.now()) return c.json({ error: 'Pick a date in the future.' }, 400);

  const existing = await commitmentFor(db, c.env.BRAND_SLUG, session);
  const share = !!body?.share && existing.canShare;
  await db.insert(t.fdCommitment).values({
    id: uuid(),
    brandSlug: c.env.BRAND_SLUG,
    sessionId: session.id,
    courseId: (body?.courseId ?? 'ai101').slice(0, 40),
    targetDate,
    note: (body?.note ?? '').trim().slice(0, 1000) || null,
    sharedWithManager: share ? 1 : 0,
    createdAt: now(),
  });
  await logEvent(db, session.id, 'commitment_set', { targetDate, shared: share });

  if (share) {
    const email = await accountEmailFor(db, session);
    const emp = email
      ? (await db.select().from(t.fdEmployee).where(and(eq(t.fdEmployee.brandSlug, c.env.BRAND_SLUG), sql`LOWER(${t.fdEmployee.email}) = ${email}`)).limit(1))[0]
      : undefined;
    const to = deliverableAddress(emp?.managerEmail);
    if (to) {
      const brandRows = await db.select().from(t.fdBrand).where(eq(t.fdBrand.slug, c.env.BRAND_SLUG)).limit(1);
      const origin = new URL(c.req.url).origin;
      const subject = `${emp!.name.split(/\s+/)[0]} set a finish date for AI Fluency`;
      const text = `${emp!.name} is aiming to finish the AI Fluency course by ${targetDate}.${body?.note ? `\n\nTheir note: ${body.note}` : ''}\n\nYou can acknowledge it — and say what you'll do to protect the time — in your team view:\n${origin}/team${signature(brandRows[0]?.name ?? 'Your company', origin)}`;
      const result = await sendEmail(c.env, { to, subject, text });
      await db.insert(t.fdEmailSend).values({
        id: uuid(),
        brandSlug: c.env.BRAND_SLUG,
        kind: 'commitment',
        toEmail: to,
        subject,
        body: text,
        status: result.status,
        provider: result.provider,
        error: result.error,
        createdAt: now(),
      });
    }
  }
  return c.json(await commitmentFor(db, c.env.BRAND_SLUG, session));
});

// Consent to let a manager read graded submissions. Off unless set, and it
// never covers the tutor transcript, the diagnostic, or which questions missed.
app.post('/api/share-work', async (c) => {
  const db = c.get('db');
  const session = requireSession(c);
  if (!session) return c.json({ error: 'No session.' }, 401);
  const body = await c.req.json<{ share?: boolean }>().catch(() => null);
  const share = body?.share === true;
  await db.insert(t.fdPreference).values({
    id: uuid(),
    sessionId: session.id,
    key: 'shareWork',
    valueJson: JSON.stringify(share),
    createdAt: now(),
  });
  await logEvent(db, session.id, 'share_work_set', { share });
  return c.json({ ok: true, share });
});

// ---------- the record ----------

// One read of everything this session has actually demonstrated: mastery per
// module, the questions still owed a second look, the calibration thread, and
// the credential. Every field is derived from the append-only funnel, graded
// submissions, or the content-addressed audit trail — nothing here is a stored
// score that could drift from what happened.
app.get('/api/record', async (c) => {
  const db = c.get('db');
  const session = requireSession(c);
  if (!session) return c.json({ error: 'No session.' }, 401);

  const moduleRows = await db.select().from(t.fdModule).orderBy(asc(t.fdModule.courseId), asc(t.fdModule.ordinal));
  const openModules = moduleRows.filter((m) => m.status === 'open');
  const titleOf = (id: string) => moduleRows.find((m) => m.id === id)?.title ?? id;

  const events = await db
    .select({ type: t.fdEvent.type, payloadJson: t.fdEvent.payloadJson, createdAt: t.fdEvent.createdAt })
    .from(t.fdEvent)
    .where(
      and(
        eq(t.fdEvent.sessionId, session.id),
        inArray(t.fdEvent.type, ['module_completed', 'knowledge_check_submitted', 'mcp_teach_back', 'mcp_connected', 'diagnostic_completed']),
      ),
    )
    .orderBy(asc(t.fdEvent.createdAt));

  const attempts: CheckAttempt[] = [];
  const completedAt = new Map<string, string>();
  const bestCheck = new Map<string, { correct: number; total: number }>();
  const teachBack = new Map<string, number>();
  let connectedAt: string | null = null;
  for (const e of events) {
    const p = JSON.parse(e.payloadJson ?? '{}') as { moduleId?: string; correct?: number; total?: number; missed?: string[] };
    if (e.type === 'mcp_connected') { connectedAt ??= e.createdAt; continue; }
    if (typeof p.moduleId !== 'string') continue;
    if (e.type === 'module_completed') {
      if (!completedAt.has(p.moduleId)) completedAt.set(p.moduleId, e.createdAt);
    } else if (e.type === 'mcp_teach_back') {
      const prev = teachBack.get(p.moduleId);
      if (typeof p.total === 'number' && (prev === undefined || p.total > prev)) teachBack.set(p.moduleId, p.total);
    } else if (e.type === 'knowledge_check_submitted' && p.total) {
      attempts.push({ moduleId: p.moduleId, correct: p.correct ?? 0, total: p.total, missed: p.missed ?? null, at: e.createdAt });
      const best = bestCheck.get(p.moduleId);
      if (!best || (p.correct ?? 0) / p.total > best.correct / best.total) bestCheck.set(p.moduleId, { correct: p.correct ?? 0, total: p.total });
    }
  }

  // 101-M1 can be cleared by the diagnostic instead of its check — same rule
  // the path screen uses, so the two screens never disagree.
  const kResponses = await db
    .select()
    .from(t.fdDiagnosticResponse)
    .where(and(eq(t.fdDiagnosticResponse.sessionId, session.id), sql`${t.fdDiagnosticResponse.correct} IS NOT NULL`));
  const kTotal = diagItems.filter((i) => i.kind === 'knowledge').length;
  const testedOutM1 = kResponses.length >= kTotal && kResponses.filter((r) => r.correct === 1).length >= kTotal - 1;

  const submissions = await db
    .select()
    .from(t.fdSubmission)
    .where(and(eq(t.fdSubmission.sessionId, session.id), sql`${t.fdSubmission.gradedAt} IS NOT NULL`))
    .orderBy(desc(t.fdSubmission.createdAt));
  const gradedByModule = new Map<string, (typeof submissions)[number]>();
  for (const s of submissions) if (!gradedByModule.has(s.moduleId)) gradedByModule.set(s.moduleId, s);

  const audits = await db
    .select({ moduleId: t.fdCompletionAudit.moduleId, activity: t.fdCompletionAudit.activity, contentHash: t.fdCompletionAudit.contentHash })
    .from(t.fdCompletionAudit)
    .where(eq(t.fdCompletionAudit.sessionId, session.id));
  // Engagement short of understanding: a read, or a check attempted and not
  // passed. Both are real contact with the module — "not started" alongside a
  // recorded score would be a contradiction.
  const seen = new Set([
    ...audits.filter((a) => a.activity === 'module_viewed' || a.activity === 'micro_viewed').map((a) => a.moduleId.replace(/-micro$/, '')),
    ...attempts.map((a) => a.moduleId),
  ]);

  const checkPassed = (id: string) => {
    const b = bestCheck.get(id);
    return (!!b && b.total > 0 && b.correct / b.total >= 0.6) || (id === 'ai101-m1' && testedOutM1);
  };

  const mastery: ModuleMastery[] = openModules.map((m) => {
    const graded = gradedByModule.get(m.id);
    const stage: MasteryStage = teachBack.has(m.id)
      ? 'taught'
      : graded
        ? 'applied'
        : checkPassed(m.id) || completedAt.has(m.id)
          ? 'checked'
          : seen.has(m.id)
            ? 'read'
            : 'untouched';
    return {
      moduleId: m.id,
      title: m.title,
      courseId: m.courseId,
      ordinal: m.ordinal,
      stage,
      bestCheck: bestCheck.get(m.id) ?? null,
      activityScore: graded?.totalScore ?? null,
      teachBackScore: teachBack.get(m.id) ?? null,
      completedAt: completedAt.get(m.id) ?? null,
    };
  });

  // The review queue: the outstanding misses, resolved back to their prompts.
  const review: ReviewItem[] = [];
  const nowMs = Date.now();
  const checksByModule = new Map<string, KnowledgeCheckPayload | null>();
  for (const miss of outstandingMisses(attempts)) {
    if (!checksByModule.has(miss.moduleId)) {
      checksByModule.set(miss.moduleId, await getExercise<KnowledgeCheckPayload>(db, miss.moduleId, 'knowledge_check'));
    }
    const q = checksByModule.get(miss.moduleId)?.questions.find((x) => x.id === miss.questionId);
    if (!q) continue;
    review.push({
      moduleId: miss.moduleId,
      moduleTitle: titleOf(miss.moduleId),
      questionId: miss.questionId,
      prompt: q.prompt,
      missedAt: miss.missedAt,
      dueAt: miss.dueAt,
      due: Date.parse(miss.dueAt) <= nowMs,
      misses: miss.misses,
    });
  }
  review.sort((a, b) => Date.parse(a.dueAt) - Date.parse(b.dueAt));

  const trail = await trailFor(db, session.id);
  const closed = trail.points.filter((p) => p.delta !== null);
  // Only claim a direction once there are enough closed loops for halves to
  // mean something; two points is a line, not a trend.
  let trend: CalibrationRecord['trend'] = null;
  if (closed.length >= 4) {
    const mid = Math.floor(closed.length / 2);
    const avg = (xs: TrailPoint[]) => xs.reduce((s, p) => s + Math.abs(p.delta ?? 0), 0) / (xs.length || 1);
    const before = avg(closed.slice(0, mid));
    const after = avg(closed.slice(mid));
    trend = after < before - 3 ? 'sharpening' : after > before + 3 ? 'drifting' : 'steady';
  }
  const diagDone = events.some((e) => e.type === 'diagnostic_completed');
  const diag = diagDone ? await computeDiagnosticResult(db, session.id) : null;
  const calibration: CalibrationRecord = {
    diagnostic: diag ? { meanAbsDelta: diag.calibration.meanAbsDelta, direction: diag.calibration.direction } : null,
    points: trail.points,
    sorts: trail.sorts,
    trend,
  };

  // Badges name a specific act that happened, with the timestamp it happened
  // at. An unearned badge carries null rather than a locked silhouette — this
  // is a record, not a collection to complete.
  const firstCompletion = [...completedAt.values()].sort()[0] ?? null;
  const firstApplied = [...gradedByModule.values()].map((s) => s.gradedAt).filter(Boolean).sort()[0] ?? null;
  const firstTaught = teachBack.size > 0 ? (events.find((e) => e.type === 'mcp_teach_back')?.createdAt ?? null) : null;
  const calibratedPoint = closed.find((p) => Math.abs(p.delta ?? 99) <= 10);
  const badges: Badge[] = [
    { id: 'first_module', label: 'First module cleared', detail: 'Finished a module end to end.', earnedAt: firstCompletion },
    { id: 'applied', label: 'Applied it', detail: 'Submitted real work to the graded activity.', earnedAt: firstApplied },
    { id: 'taught', label: 'Taught it back', detail: 'Explained a module in your own words and had it graded.', earnedAt: firstTaught },
    { id: 'calibrated', label: 'Called it', detail: 'Made a prediction that landed within 10 points of the outcome.', earnedAt: calibratedPoint ? (completedAt.get(calibratedPoint.moduleId) ?? null) : null },
    { id: 'connected', label: 'Connected', detail: 'Brought the course into your assistant over MCP.', earnedAt: connectedAt },
  ];

  // The credential: what was cleared, and the exact content versions witnessed
  // while clearing it. The hashes are the point — they make the claim checkable
  // against fd_content_snapshot after the live content has moved on.
  const { courses } = (await import('../../content/modules.json')) as unknown as { courses: CourseCard[] };
  const completionHashes = new Map<string, string>();
  for (const a of audits) if (a.activity === 'module_completed') completionHashes.set(a.moduleId, a.contentHash);
  const credentials: Credential[] = courses
    .filter((course) => openModules.some((m) => m.courseId === course.id))
    .map((course) => {
      const mods = openModules.filter((m) => m.courseId === course.id);
      // "Cleared" here means exactly what the path screen's counter means —
      // completed, or tested out on the diagnostic. A passed knowledge check
      // clears a *prerequisite*; it does not finish a module, and a credential
      // that disagreed with the progress instrument would be worth nothing.
      const clearedMods = mods.filter((m) => completedAt.has(m.id) || (m.id === 'ai101-m1' && testedOutM1));
      const issued = clearedMods.map((m) => completedAt.get(m.id)).filter((x): x is string => !!x).sort();
      return {
        courseId: course.id,
        courseTitle: course.title,
        earned: clearedMods.length === mods.length && mods.length > 0,
        cleared: clearedMods.length,
        total: mods.length,
        issuedAt: clearedMods.length === mods.length && issued.length ? issued[issued.length - 1] : null,
        contentHashes: clearedMods.map((m) => completionHashes.get(m.id)).filter((x): x is string => !!x),
      };
    });

  // Capability claims, each backed by one graded artifact. The claim is the
  // module's own title and the evidence is the grader's own words — nothing
  // here is written for the learner's benefit.
  const rubricRows = await db.select().from(t.fdExercise).where(eq(t.fdExercise.kind, 'rubric'));
  const maxByModule = new Map(
    rubricRows.map((r) => [r.moduleId, (JSON.parse(r.payloadJson) as RubricPayload).dimensions.length * 5]),
  );
  const skills: SkillStatement[] = [...gradedByModule.entries()]
    .filter(([, s]) => s.totalScore !== null)
    .map(([moduleId, s]) => {
      const max = maxByModule.get(moduleId) ?? 20;
      const summary = s.rubricJson ? ((JSON.parse(s.rubricJson) as { summary?: string }).summary ?? '') : '';
      return {
        claim: titleOf(moduleId),
        evidence: `Applied activity scored ${s.totalScore}/${max}${summary ? ` — ${summary}` : ''}`,
      };
    });

  const participant = await db.select().from(t.fdParticipant).where(eq(t.fdParticipant.sessionId, session.id)).limit(1);
  const res: RecordResponse = {
    name: participant[0]?.displayName ?? null,
    roleLabel: participant[0]?.roleLabel ?? null,
    mastery,
    review,
    calibration,
    badges,
    credentials,
    skills,
  };
  return c.json(res);
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

// The whole submission path — save-first, audit pack, calibration fields,
// rate limit, grading — shared verbatim by the app endpoint and the MCP
// submit_activity tool, so a submission from inside Claude is graded, audited,
// and review-desk-visible exactly like one from the activity screen.
export type ActivityOutcome = { ok: false; status: 400 | 404; error: string } | { ok: true; result: GradeResult };

async function submitActivityCore(
  env: Env,
  db: DrizzleD1Database,
  sessionId: string,
  moduleId: string,
  rawText: string | undefined,
  calibrationValues: Record<string, number> | undefined,
): Promise<ActivityOutcome> {
  const rubric = await getExercise<RubricPayload>(db, moduleId, 'rubric');
  if (!rubric) return { ok: false, status: 404, error: 'This module has no graded activity.' };
  const minChars = rubric.minChars ?? MIN_SUBMISSION_CHARS;

  const text = rawText?.trim();
  if (!text || text.length < minChars) {
    return { ok: false, status: 400, error: `Keep going — the activity needs at least ${minChars} characters to be gradeable.` };
  }
  if (text.length > 40_000) return { ok: false, status: 400, error: 'That’s beyond what the grader will read. Trim to what the activity asks for.' };

  // Save first — grading can fail or be limited, the submission never gets lost.
  const submissionId = uuid();
  await db.insert(t.fdSubmission).values({
    id: submissionId,
    sessionId: sessionId,
    moduleId,
    body: text,
    createdAt: now(),
  });
  await logEvent(db, sessionId, 'activity_submitted', { moduleId, submissionId, chars: text.length });

  // The audit pack: the activity brief the learner wrote against plus the
  // rubric that grades it, exactly as both stood at submission time.
  const activityBlockRows = await db
    .select()
    .from(t.fdContentBlock)
    .where(eq(t.fdContentBlock.moduleId, `${moduleId}-activity`))
    .orderBy(asc(t.fdContentBlock.ordinal));
  await witnessContent(db, {
    sessionId: sessionId,
    moduleId,
    activity: 'activity_submitted',
    kind: 'activity_pack',
    refId: submissionId,
    content: { ...moduleSnapshot(toolingOf(env), selectVariants(activityBlockRows, toolingOf(env)).map(toBlock)), rubric },
  });

  // Rubric-declared calibration fields → fd_calibration, before grading.
  // A plain field opens a prediction; an actualFor field closes one — the
  // measured value lands on the earlier prediction's row with its delta.
  const calibrationNotes: string[] = [];
  for (const field of rubric.calibration ?? []) {
    const value = Number(calibrationValues?.[field.key]);
    if (!Number.isFinite(value)) continue;
    const clamped = Math.max(field.min ?? 0, Math.min(field.max ?? 1_000_000, Math.round(value)));
    if (field.actualFor) {
      const [mod, key] = field.actualFor.includes(':') ? field.actualFor.split(':') : [moduleId, field.actualFor];
      const context = `${mod}:cal:${key}`;
      const rows = await db
        .select()
        .from(t.fdCalibration)
        .where(and(eq(t.fdCalibration.sessionId, sessionId), eq(t.fdCalibration.context, context)))
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
    await db.delete(t.fdCalibration).where(and(eq(t.fdCalibration.sessionId, sessionId), eq(t.fdCalibration.context, context)));
    await db.insert(t.fdCalibration).values({
      id: uuid(),
      sessionId: sessionId,
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
    .where(and(eq(t.fdSubmission.sessionId, sessionId), gt(t.fdSubmission.createdAt, hourAgo)));
  if ((recent[0]?.n ?? 0) > GRADE_LIMIT_PER_HOUR) {
    const res: GradeResult = {
      status: 'rate_limited',
      submissionId,
      message: 'Your submission is saved. Grading is limited to five passes an hour — come back shortly and resubmit to grade this version.',
    };
    return { ok: true, result: res };
  }

  if (!env.ANTHROPIC_API_KEY) {
    const res: GradeResult = {
      status: 'saved_ungraded',
      submissionId,
      message: 'Your submission is saved. Grading is unavailable right now — resubmit later to get rubric feedback.',
    };
    return { ok: true, result: res };
  }

  // The grader sees the build so far and the module-opening prediction, so
  // stage feedback can reference the actual spec and score honesty on record.
  const stages = await priorStagesFor(db, sessionId, moduleId);
  const priorContext = stages.length
    ? stages
        .map((s) => {
          const graded = s.total !== null ? ` (graded ${s.total})` : ' (ungraded)';
          const bodyText = s.body.length > 2500 ? `${s.body.slice(0, 2500)}\n[truncated]` : s.body;
          return `Stage ${s.ordinal} — ${s.title}${graded}:\n${bodyText}`;
        })
        .join('\n\n')
    : null;
  const opening = await openingPredictionFor(db, sessionId, moduleId);
  if (opening) calibrationNotes.unshift(`Opening prediction, recorded at the top of the module: "${opening.slice(0, 500)}"`);

  const grade = await gradeSubmission(
    env.ANTHROPIC_API_KEY,
    env.GRADING_MODEL,
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
    return { ok: true, result: res };
  }

  await db
    .update(t.fdSubmission)
    .set({
      rubricJson: JSON.stringify({ dimensions: grade.dimensions, summary: grade.summary }),
      totalScore: grade.total,
      modelUsed: env.GRADING_MODEL,
      promptVersion: rubric.promptVersion,
      gradedAt: now(),
    })
    .where(eq(t.fdSubmission.id, submissionId));
  await logEvent(db, sessionId, 'activity_graded', { moduleId, submissionId, total: grade.total });

  const res: GradeResult = { status: 'graded', submissionId, dimensions: grade.dimensions, total: grade.total, summary: grade.summary };
  return { ok: true, result: res };
}

app.post('/api/module/:id/activity', async (c) => {
  const db = c.get('db');
  const session = requireSession(c);
  if (!session) return c.json({ error: 'No session.' }, 401);
  const body = await c.req.json<{ body?: string; calibration?: Record<string, number> }>().catch(() => null);
  const out = await submitActivityCore(c.env, db, session.id, c.req.param('id'), body?.body, body?.calibration);
  if (!out.ok) return c.json({ error: out.error }, out.status);
  return c.json(out.result);
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
    audioEnabled: Boolean(c.env.GEMINI_API_KEY),
    audioPrerenders: Boolean(c.env.GEMINI_API_KEY && c.env.PODCAST_AUDIO),
  };
  return c.json(res);
});

// Everything writeScript needs to know about this learner — name, role,
// goals, depth, diagnostic — so every episode is unmistakably theirs.
async function podcastLearner(db: DrizzleD1Database, brandSlug: string, sessionId: string): Promise<LearnerContext> {
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
    aiTools: await resolveAiTools(db, brandSlug, prefs),
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

// Admin-authored steering from the Brand tab: what the company wants
// emphasized, overall and for this course/module. It varies only by
// deployment (one brand) and module — the same axes as the content itself —
// so it is safe to ride inside the prompt-cached module block.
// Scopes stack widest-first: the company's global steer, then the course, then
// the module, then — when the learner's manager has written one — their team's.
// The team scope is the only one that varies per learner rather than per
// deployment, so it does fragment the shared prompt cache; it is opt-in per
// manager and absent on most deployments, which keeps that cost where the value
// is. Team text goes last so the most specific voice lands closest to the task.
async function guidanceFor(
  db: DrizzleD1Database,
  env: Env,
  moduleId: string,
  courseId: string | null,
  teamEmail?: string | null,
): Promise<{ text: string; updatedAt: string } | null> {
  const scopes = [
    'global',
    ...(courseId ? [`course:${courseId}`] : []),
    `module:${moduleId}`,
    ...(teamEmail ? [`team:${teamEmail}`] : []),
  ];
  const rows = await db
    .select()
    .from(t.fdBrandGuidance)
    .where(and(eq(t.fdBrandGuidance.brandSlug, env.BRAND_SLUG), inArray(t.fdBrandGuidance.scope, scopes)));
  const order = new Map(scopes.map((s, i) => [s, i]));
  const parts = rows
    .filter((r) => r.body.trim())
    .sort((a, b) => (order.get(a.scope) ?? 9) - (order.get(b.scope) ?? 9));
  if (!parts.length) return null;
  return {
    text: parts.map((r) => r.body.trim()).join('\n\n'),
    updatedAt: parts.reduce((max, r) => (r.updatedAt > max ? r.updatedAt : max), ''),
  };
}

const GUIDANCE_PREFACE =
  "Company guidance — the sponsoring company's admin asked that the following be emphasized and reinforced when teaching this material. Weave it in where it fits naturally; it complements the module content, never replaces it.";

const withGuidance = (contentMd: string, guidance: { text: string } | null) =>
  guidance ? `${contentMd}\n\n<company_guidance>\n${GUIDANCE_PREFACE}\n\n${guidance.text}\n</company_guidance>` : contentMd;

// `teamEmail` is the caller's assertion that this content is being assembled
// for ONE listener. Pass it on the per-learner paths — the custom body, the
// personal intro, a Q&A follow-up — and omit it on anything baked once and
// shared (stock episodes, goal intros), where folding one team's guidance into
// a shared asset would serve it to other teams.
async function moduleContent(db: DrizzleD1Database, env: Env, moduleId: string, teamEmail?: string | null) {
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
  const guidance = await guidanceFor(db, env, moduleId, mod.courseId, teamEmail);
  const contentMd = withGuidance(blocks.map((b) => b.body).join('\n\n'), guidance);
  // Guidance edits count as content changes, so stale stock episodes rebake.
  const reviewedAt = [...blocks.map((b) => b.reviewedAt), guidance?.updatedAt ?? ''].reduce((max, d) => (d > max ? d : max), '');
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

async function voiceIntroToR2(env: Env, lines: PodcastLine[], key: string): Promise<string | null> {
  if (!env.GEMINI_API_KEY || !env.PODCAST_AUDIO) return null;
  const rendered = await renderChunkAudio(env, lines);
  if (!rendered) return null;
  await env.PODCAST_AUDIO.put(key, rendered.bytes, { httpMetadata: { contentType: rendered.contentType } });
  return key;
}

// Bake the generic stock episode for a module: one stock-script call, one study
// call, intro voiced into R2, and — unless the caller defers it — the stock
// body voiced too. Self-healing: re-bakes when module content's reviewedAt
// moves. Silent on failure; the legacy path still works.
//
// Deferring the body matters at catalog scale. The intro is what makes arrival
// instant; the stock body is only the fallback for when a learner's custom body
// fails to write. Voicing the intro is one TTS call, the body is five, so a
// warm-up pass gets every module to instant sooner by taking the opens first
// and backfilling bodies after (see warmAllStock).
async function bakeStock(env: Env, moduleId: string, opts: { deferBody?: boolean } = {}): Promise<void> {
  if (!env.ANTHROPIC_API_KEY) return;
  try {
    const db = drizzle(env.DB);
    // Shared asset: baked once per module and served to every listener, so no
    // team scope — one team's guidance must never ride in a shared episode.
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
    const introAudioKey = await voiceIntroToR2(env, draft.intro, stockIntroKey(moduleId, 'generic'));
    if (!opts.deferBody) await voiceStockBody(env, moduleId, draft.body);
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
    await logEvent(db, null, 'podcast_stock_baked', { moduleId, variant: 'generic', body: opts.deferBody ? 'deferred' : 'voiced' });
  } catch {
    // Background work — cold arrivals fall back to the legacy path.
  }
}

// Voice the stock body into R2, chunk by chunk, all concurrently. Idempotent:
// chunks already present are left alone, so a deferred body can be filled in
// later without re-spending on what landed the first time.
async function voiceStockBody(env: Env, moduleId: string, body: PodcastLine[]): Promise<boolean> {
  if (!env.GEMINI_API_KEY || !env.PODCAST_AUDIO) return false;
  const bucket = env.PODCAST_AUDIO;
  const results = await Promise.all(
    chunkPlan(body).map(async (ch, i) => {
      const key = stockBodyChunkKey(moduleId, i);
      if (await bucket.head(key)) return true;
      const rendered = await renderChunkAudio(env, body.slice(ch.start, ch.end));
      if (!rendered) return false;
      await bucket.put(key, rendered.bytes, { httpMetadata: { contentType: rendered.contentType } });
      return true;
    }),
  );
  return results.every(Boolean);
}

// Does this module's stock body have its audio yet? Chunk 0 is written last of
// the set only by luck, so check the whole plan — a half-voiced body would
// strand the fallback mid-episode.
async function stockBodyVoiced(env: Env, row: typeof t.fdPodcastStock.$inferSelect): Promise<boolean> {
  if (!env.PODCAST_AUDIO || !row.bodyJson) return true; // nothing to store, or nothing to store it for
  const body = JSON.parse(row.bodyJson) as PodcastLine[];
  for (let i = 0; i < chunkPlan(body).length; i++) {
    if (!(await env.PODCAST_AUDIO.head(stockBodyChunkKey(row.moduleId, i)))) return false;
  }
  return true;
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
    // Shared per (module, goal) across every learner holding that goal — same
    // reason as the stock bake: no team scope.
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
    const introAudioKey = await voiceIntroToR2(env, lines, stockIntroKey(moduleId, goalId));
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

// Keep every open module's stock episode fresh — runs on the cron trigger, so
// no learner ever pays the cold-bake toll. Steady-state runs find everything
// fresh and do nothing.
//
// Two phases, opens first. Phase one bakes the script, study assets, and intro
// audio for every module missing them — that alone makes arrival instant, and
// costs one TTS call per module. Only once the whole catalog has its open does
// phase two backfill stock body audio (five TTS calls each), which is just the
// fallback for a failed custom body. Across a large catalog that ordering is
// the difference between every module being instant in an hour and a handful
// being fully baked while the rest still wait.
const WARM_OPENS_PER_RUN = 9;
const WARM_BODIES_PER_RUN = 3;
// Opens are one TTS call each, so three at a time is three in flight. A body is
// five chunks rendered concurrently, so it takes its turn alone — otherwise a
// run fires fifteen simultaneous TTS calls and spends its retries on rate limits.
const WARM_OPEN_CONCURRENCY = 3;
const WARM_BODY_CONCURRENCY = 1;

// Run tasks a few at a time: a cron tick has minutes of wall clock, and one
// bake is mostly waiting on model calls, but firing all of them at once would
// stack subrequests and rate limits.
async function inBatches<T>(items: T[], size: number, run: (item: T) => Promise<void>): Promise<void> {
  for (let i = 0; i < items.length; i += size) {
    await Promise.all(items.slice(i, i + size).map((item) => run(item).catch(() => {})));
  }
}

async function warmAllStock(env: Env): Promise<void> {
  if (!env.ANTHROPIC_API_KEY) return;
  try {
    const db = drizzle(env.DB);
    const mods = await db
      .select()
      .from(t.fdModule)
      .where(eq(t.fdModule.status, 'open'))
      .orderBy(asc(t.fdModule.courseId), asc(t.fdModule.ordinal));

    // Phase one: modules with no fresh stock at all.
    const needOpen: string[] = [];
    const haveStock: (typeof t.fdPodcastStock.$inferSelect)[] = [];
    for (const mod of mods) {
      const existing = await loadStock(db, mod.id, 'generic');
      if (!existing || existing.promptVersion !== PODCAST_PROMPT_VERSION) {
        needOpen.push(mod.id);
        continue;
      }
      const content = await moduleContent(db, env, mod.id);
      if (content && existing.contentReviewedAt !== content.reviewedAt) needOpen.push(mod.id);
      else haveStock.push(existing);
    }

    if (needOpen.length > 0) {
      const batch = needOpen.slice(0, WARM_OPENS_PER_RUN);
      await logEvent(db, null, 'podcast_warm_pass', { phase: 'opens', baking: batch.length, remaining: needOpen.length - batch.length });
      await inBatches(batch, WARM_OPEN_CONCURRENCY, (moduleId) => bakeStock(env, moduleId, { deferBody: true }));
      return; // opens for the whole catalog before any body audio
    }

    // Phase two: every module has its open — backfill the stock bodies.
    const needBody: (typeof t.fdPodcastStock.$inferSelect)[] = [];
    for (const row of haveStock) {
      if (needBody.length >= WARM_BODIES_PER_RUN) break;
      if (!(await stockBodyVoiced(env, row))) needBody.push(row);
    }
    if (needBody.length === 0) return;
    await logEvent(db, null, 'podcast_warm_pass', { phase: 'bodies', baking: needBody.length });
    await inBatches(needBody, WARM_BODY_CONCURRENCY, async (row) => {
      if (row.bodyJson) await voiceStockBody(env, row.moduleId, JSON.parse(row.bodyJson) as PodcastLine[]);
    });
  } catch {
    // Cron work — the next tick tries again.
  }
}

// The learner's next podcast-less open module — where pre-warming aims.

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
      // Only the beats and intro are needed here; the cron voices the body.
      await bakeStock(env, moduleId, { deferBody: true });
      generic = await loadStock(db, moduleId, 'generic');
      if (!generic) return;
    }
    const content = await moduleContent(db, env, moduleId, await managerEmailForSessionId(db, env.BRAND_SLUG, sessionId));
    if (!content) return;
    const learner = await podcastLearner(db, env.BRAND_SLUG, sessionId);
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
    const audioKey = await voiceIntroToR2(env, lines, personalIntroKey(sessionId, moduleId));
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
    voiceA: GEMINI_VOICE_A,
    voiceB: GEMINI_VOICE_B,
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
    const content = await moduleContent(db, env, row.moduleId, await managerEmailForSessionId(db, env.BRAND_SLUG, row.sessionId));
    const introLines = JSON.parse(row.introJson ?? '[]') as PodcastLine[];
    const beats = generic ? (JSON.parse(generic.beatsJson) as string[]) : [];

    let bodyLines: PodcastLine[] | null = null;
    let outline: PodcastOutlinePoint[] | null = null;
    let title = row.title;
    let description = row.description;
    let fallback = false;

    if (env.ANTHROPIC_API_KEY && content && beats.length > 0) {
      const learner = await podcastLearner(db, env.BRAND_SLUG, row.sessionId);
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
      await renderVoicesToCache(env, { ...row, scriptJson: JSON.stringify(bodyLines) }, 'create');
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
  // A Q&A segment is written for the one listener who asked, so it carries
  // their team's guidance like the custom body does.
  const contentMd = withGuidance(
    selectVariants(blockRows, toolingOf(env))
      .filter((b) => b.kind !== 'exercise')
      .map((b) => b.body)
      .join('\n\n'),
    await guidanceFor(db, env, moduleId, mod.courseId, await managerEmailForSessionId(db, env.BRAND_SLUG, sessionId)),
  );

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

  const learner = await podcastLearner(db, env.BRAND_SLUG, sessionId);
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
    voiceA: GEMINI_VOICE_A,
    voiceB: GEMINI_VOICE_B,
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
async function renderVoicesToCache(env: Env, row: PodcastRow, trigger: 'create' | 'pregen'): Promise<void> {
  if (!env.GEMINI_API_KEY || !env.PODCAST_AUDIO) return;
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
        const audio = await renderChunkAudio(env, lines.slice(ch.start, ch.end));
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
      engine: 'gemini',
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
    await bakeStock(env, mod.id, { deferBody: true });
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

// The Q&A path — gates (episode exists, actually listened, real question,
// hourly limit), script generation, and background voicing — shared by the
// app's podcast page and the MCP ask_the_hosts tool. The `trigger` marker
// keeps the funnel honest about where the request came from.
export type QaEpisodeOutcome = { ok: false; status: 400 | 429 | 503; error: string } | { ok: true; row: PodcastRow };

async function createQaEpisodeCore(
  env: Env,
  db: DrizzleD1Database,
  sessionId: string,
  moduleId: string,
  rawQuestion: string | undefined,
  trigger: 'manual' | 'mcp',
  waitUntil: (p: Promise<unknown>) => void,
): Promise<QaEpisodeOutcome> {
  const modRows = await db.select().from(t.fdModule).where(eq(t.fdModule.id, moduleId)).limit(1);
  const mod = modRows[0];
  if (!mod || mod.status !== 'open') return { ok: false, status: 400, error: 'Episodes can only be made from open modules.' };
  if (!env.ANTHROPIC_API_KEY) {
    return { ok: false, status: 503, error: 'The scriptwriter is not configured in this deployment, so episodes cannot be generated yet.' };
  }

  const defaultRows = await db
    .select()
    .from(t.fdPodcast)
    .where(and(eq(t.fdPodcast.sessionId, sessionId), eq(t.fdPodcast.moduleId, moduleId), eq(t.fdPodcast.kind, 'default')))
    .limit(1);
  const existingDefault = defaultRows[0] ?? null;
  if (!existingDefault) {
    return { ok: false, status: 400, error: "Your module episode comes first — the hosts answer questions about something you've heard." };
  }
  const played = await db
    .select({ n: sql<number>`count(*)` })
    .from(t.fdEvent)
    .where(
      and(
        eq(t.fdEvent.sessionId, sessionId),
        eq(t.fdEvent.type, 'podcast_played'),
        sql`json_extract(${t.fdEvent.payloadJson}, '$.podcastId') = ${existingDefault.id}`,
      ),
    );
  if ((played[0]?.n ?? 0) === 0) {
    return { ok: false, status: 400, error: 'Listen to your episode first — then ask the hosts anything it left you wondering.' };
  }
  const question = rawQuestion?.trim();
  if (!question || question.length < 5) {
    return { ok: false, status: 400, error: 'Ask the hosts a real question — a sentence or two about what you want unpacked.' };
  }
  if (!(await underPodcastLimit(db, sessionId, env))) {
    return { ok: false, status: 429, error: `Episode writing is limited to ${podcastHourlyLimit(env)} an hour. Your earlier episodes are below — or come back shortly.` };
  }

  await logEvent(db, sessionId, 'podcast_requested', { moduleId, kind: 'qa', trigger });
  const row = await generateEpisode(env, db, sessionId, moduleId, 'qa', question.slice(0, 500), 'quick');
  if (!row) {
    return { ok: false, status: 503, error: 'The scriptwriter is unavailable right now. Nothing was saved — try again in a minute.' };
  }
  waitUntil(renderVoicesToCache(env, row, 'create'));
  return { ok: true, row };
}

app.post('/api/podcast', async (c) => {
  const db = c.get('db');
  const session = requireSession(c);
  if (!session) return c.json({ error: 'No session.' }, 401);
  const body = await c.req.json<{ moduleId?: string; kind?: string; question?: string }>().catch(() => null);
  if (!body) return c.json({ error: 'Malformed request.' }, 400);

  const moduleId = body.moduleId ?? 'ai101-m1';

  if (body.kind === 'qa') {
    const out = await createQaEpisodeCore(c.env, db, session.id, moduleId, body.question, 'manual', (p) => c.executionCtx.waitUntil(p as Promise<void>));
    if (!out.ok) return c.json({ error: out.error }, out.status);
    return c.json(toEpisode(out.row));
  }

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
  // One default episode per module — asking again just returns it.
  if (existingDefault) return c.json(toEpisode(existingDefault));

  const prefs = await loadPrefs(db, session.id);

  if (!(await underPodcastLimit(db, session.id, c.env))) {
    return c.json({ error: `Episode writing is limited to ${podcastHourlyLimit(c.env)} an hour. Your earlier episodes are below — or come back shortly.` }, 429);
  }

  await logEvent(db, session.id, 'podcast_requested', { moduleId, kind: 'default', trigger: 'manual' });

  const length = defaultLengthFor(depthOf(prefs.depth));

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
  c.executionCtx.waitUntil(bakeStock(c.env, moduleId, { deferBody: true }));

  const row = await generateEpisode(c.env, db, session.id, moduleId, 'default', null, length);
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
    // duplicate render (slower AND double-spend). Only worth waiting when the
    // engine exists to be doing the rendering.
    const ageMs = Date.now() - new Date(row.createdAt).getTime();
    if (c.env.GEMINI_API_KEY && row.audioAt === null && ageMs < 10 * 60 * 1000) {
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

  if (!c.env.GEMINI_API_KEY) {
    return c.json({ error: 'Audio rendering is not configured in this deployment — the full transcript is the episode for now.' }, 503);
  }

  const rendered = await renderChunkAudio(c.env, lines.slice(plan[idx].start, plan[idx].end));
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
    engine: 'gemini',
  });

  return new Response(audio, { headers: { ...headersFor(rendered.contentType), 'content-length': String(audio.length) } });
});

// Legacy whole-episode audio: episodes voiced before chunked playback keep
// their single cached file, and this route serves it (or live-renders the whole
// thing as a last resort). Old objects are Aura MP3s and still play fine —
// they're served with whatever type they were stored under; anything rendered
// now comes back as Gemini WAV.
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

  const headers = (contentType: string) => ({ 'content-type': contentType, 'cache-control': 'private, max-age=86400' });

  if (row.audioKey && c.env.PODCAST_AUDIO) {
    const cached = await c.env.PODCAST_AUDIO.get(row.audioKey);
    if (cached) return new Response(cached.body, { headers: headers(cached.httpMetadata?.contentType ?? 'audio/mpeg') });
    // Bucket lost the object (recreated, expired) — fall through and re-render.
  }

  if (!c.env.GEMINI_API_KEY) {
    return c.json({ error: 'Audio rendering is not configured in this deployment — the full transcript is the episode for now.' }, 503);
  }

  const lines = JSON.parse(row.scriptJson) as PodcastLine[];
  const rendered = await renderChunkAudio(c.env, lines);
  if (!rendered) {
    return c.json({ error: 'The voices are unavailable right now. The script is safe — try the audio again in a minute.' }, 503);
  }
  const audio = rendered.bytes;

  if (c.env.PODCAST_AUDIO) {
    const key = `podcast/${row.id}.${rendered.contentType === 'audio/wav' ? 'wav' : 'mp3'}`;
    await c.env.PODCAST_AUDIO.put(key, audio, { httpMetadata: { contentType: rendered.contentType } });
    await db.update(t.fdPodcast).set({ audioKey: key, audioBytes: audio.length, audioAt: now() }).where(eq(t.fdPodcast.id, row.id));
  }
  await logEvent(db, session.id, 'podcast_audio_rendered', { podcastId: row.id, bytes: audio.length, cached: Boolean(c.env.PODCAST_AUDIO), engine: 'gemini' });

  return new Response(audio, { headers: { ...headers(rendered.contentType), 'content-length': String(audio.length) } });
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

// ---------- the course as an MCP server ----------

// Mint this learner's personal connector URL. The key is their session id
// signed under a distinct HMAC domain (crypto.ts), so MCP progress and app
// progress are one record — and a leaked key can't be replayed as a cookie.
// Registered before the /api/mcp mount so it wins over the sub-app's routes.
app.get('/api/mcp/connection', async (c) => {
  const session = requireSession(c);
  if (!session) return c.json({ error: 'No session.' }, 401);
  const key = await signMcpKey(session.id, secret(c.env));
  const origin = new URL(c.req.url).origin;
  // Two ways in. `url` is what most people paste: a plain, non-secret endpoint
  // that runs the OAuth handshake (approval screen included). `keyUrl` is the
  // pre-authenticated fallback for clients that don't speak OAuth — it carries
  // this learner's signed key, so it IS a secret.
  return c.json({ url: `${origin}${MCP_PATH}`, keyUrl: `${origin}/api/mcp/${key}` });
});

// The MCP endpoint itself: tools, prompts, and the tutor persona. Functions
// entangled with the rest of this file are injected rather than re-exported;
// submitActivity and askTheHosts are the same cores the app endpoints run.
app.route(
  '/api/mcp',
  createMcpApp({
    loadPrefs,
    computeDiagnosticResult,
    pregenerateNextPodcast,
    trailFor,
    priorStagesFor,
    openingPredictionFor,
    submitActivity: submitActivityCore,
    askTheHosts: createQaEpisodeCore,
    guidanceFor,
  }),
);

// OAuth 2.1 for connector clients that expect a real sign-in service (the
// claude.ai "Connect" button): discovery metadata at /.well-known/*, dynamic
// registration, and the approval screen at /oauth/*. These paths sit outside
// /api, so wrangler.jsonc lists them in run_worker_first — otherwise the SPA
// asset handler would answer them with index.html.
app.route('/', createOauthApp());

// ---------- fallthrough ----------

// The manager view. No separate credential: the census declares who reports to
// whom, so an account whose email appears in manager_email rows is a manager
// and their team is exactly those rows. Authorization is exact-email only —
// see the note at the top of manager.ts for why the display-name fallback the
// admin census uses is deliberately not reused here.
app.route('/api/manager', createManagerApp({ requireSession }));

app.route('/api/admin', adminApp);

app.notFound(async (c) => {
  if (new URL(c.req.url).pathname.startsWith('/api/')) return c.json({ error: 'Not found.' }, 404);
  return c.env.ASSETS.fetch(c.req.raw);
});

export default {
  fetch: app.fetch,
  // Cron trigger (see wrangler.jsonc): keeps stock episodes baked for every
  // open module, so podcast arrival is instant even on a never-visited module,
  // and runs the reminder pass. The pass dedupes per (rule, recipient) inside
  // the rule's own day window, so running it on every tick is safe — no
  // separate run-lock, and no double nudge.
  scheduled(_controller: ScheduledController, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(warmAllStock(env));
    ctx.waitUntil(
      (async () => {
        const db = drizzle(env.DB);
        await runReminderPass(db, env, env.PUBLIC_ORIGIN ?? 'https://fluency-demo.workers.dev');
      })().catch(() => {}),
    );
  },
};
