// Operator console: review queue (the M8 async backup path), reporting, and
// access-code management. Gated by ADMIN_PASSCODE (wrangler secret) and a
// separate HMAC-signed cookie — admin state never mixes with learner sessions.
import { Hono } from 'hono';
import { getCookie, setCookie } from 'hono/cookie';
import { drizzle, type DrizzleD1Database } from 'drizzle-orm/d1';
import { and, asc, desc, eq, gt, sql } from 'drizzle-orm';
import * as t from '../db/schema';
import { constantTimeEqual, hashCode, signSessionId, verifySessionCookie, hashIp } from './crypto';
import { deliverableAddress, emailEnabled, sendEmail, signature, type EmailEnv } from './email';

export interface AdminEnv extends EmailEnv {
  DB: D1Database;
  BRAND_SLUG: string;
  SESSION_SECRET?: string;
  ADMIN_PASSCODE?: string;
}

type Ctx = { Bindings: AdminEnv; Variables: { db: DrizzleD1Database } };

const ADMIN_COOKIE = 'fd_admin';
const ADMIN_MAX_AGE = 60 * 60 * 24 * 7; // 7 days
const ATTEMPT_LIMIT = 10;
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;

const now = () => new Date().toISOString();
const uuid = () => crypto.randomUUID();
const secret = (env: AdminEnv) => env.SESSION_SECRET ?? 'dev-only-secret-set-SESSION_SECRET-in-production';
const enc = new TextEncoder();

async function isAdminToken(cookieValue: string | undefined, env: AdminEnv): Promise<boolean> {
  const token = await verifySessionCookie(cookieValue, secret(env));
  return token !== null && token.startsWith('admin-');
}

export const adminApp = new Hono<Ctx>();

adminApp.use('*', async (c, next) => {
  c.set('db', drizzle(c.env.DB));
  await next();
});

adminApp.get('/me', async (c) => {
  return c.json({ authenticated: await isAdminToken(getCookie(c, ADMIN_COOKIE), c.env), configured: !!c.env.ADMIN_PASSCODE });
});

adminApp.post('/login', async (c) => {
  const db = c.get('db');
  if (!c.env.ADMIN_PASSCODE) {
    return c.json({ error: 'Admin is not configured for this deployment. Set the ADMIN_PASSCODE secret.' }, 503);
  }
  const body = await c.req.json<{ code?: string }>().catch(() => null);
  const code = body?.code ?? '';
  const ip = c.req.header('cf-connecting-ip') ?? c.req.header('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local';
  const ipHashed = await hashIp(ip, secret(c.env));

  const windowStart = new Date(Date.now() - ATTEMPT_WINDOW_MS).toISOString();
  const attempts = await db
    .select({ n: sql<number>`count(*)` })
    .from(t.fdEvent)
    .where(
      and(
        eq(t.fdEvent.type, 'admin_attempt_failed'),
        gt(t.fdEvent.createdAt, windowStart),
        sql`json_extract(${t.fdEvent.payloadJson}, '$.ipHash') = ${ipHashed}`,
      ),
    );
  if ((attempts[0]?.n ?? 0) >= ATTEMPT_LIMIT) {
    return c.json({ error: 'Too many attempts. Wait 15 minutes.' }, 429);
  }

  if (!constantTimeEqual(enc.encode(code), enc.encode(c.env.ADMIN_PASSCODE))) {
    await db.insert(t.fdEvent).values({
      id: uuid(),
      sessionId: null,
      type: 'admin_attempt_failed',
      payloadJson: JSON.stringify({ ipHash: ipHashed }),
      createdAt: now(),
    });
    return c.json({ error: "That's not the admin passcode." }, 401);
  }

  setCookie(c, ADMIN_COOKIE, await signSessionId(`admin-${uuid()}`, secret(c.env)), {
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
    path: '/',
    maxAge: ADMIN_MAX_AGE,
  });
  return c.json({ ok: true });
});

adminApp.post('/logout', async (c) => {
  setCookie(c, ADMIN_COOKIE, '', { httpOnly: true, secure: true, sameSite: 'Lax', path: '/', maxAge: 0 });
  return c.json({ ok: true });
});

// Everything below requires the admin cookie.
adminApp.use('*', async (c, next) => {
  if (!(await isAdminToken(getCookie(c, ADMIN_COOKIE), c.env))) return c.json({ error: 'Admin login required.' }, 401);
  await next();
});

// ---------- reporting ----------

adminApp.get('/report', async (c) => {
  const db = c.get('db');
  const one = async (q: ReturnType<typeof sql>) => (await db.all<Record<string, unknown>>(q))[0] ?? {};
  const totals = {
    sessions: (await one(sql`SELECT COUNT(*) AS n FROM fd_session`)).n ?? 0,
    participants: (await one(sql`SELECT COUNT(*) AS n FROM fd_participant`)).n ?? 0,
    submissions: (await one(sql`SELECT COUNT(*) AS n FROM fd_submission`)).n ?? 0,
    graded: (await one(sql`SELECT COUNT(*) AS n FROM fd_submission WHERE graded_at IS NOT NULL`)).n ?? 0,
    reviewed: (await one(sql`SELECT COUNT(DISTINCT submission_id) AS n FROM fd_review`)).n ?? 0,
    podcasts: (await one(sql`SELECT COUNT(*) AS n FROM fd_podcast`)).n ?? 0,
  };
  const funnel = await db.all<{ type: string; events: number; sessions: number }>(
    sql`SELECT type, COUNT(*) AS events, COUNT(DISTINCT session_id) AS sessions FROM fd_event GROUP BY type ORDER BY MIN(created_at)`,
  );
  const demand = {
    goals: await db.all<{ v: string; n: number }>(
      sql`SELECT je.value AS v, COUNT(*) AS n FROM fd_preference p, json_each(p.value_json) je WHERE p.key = 'goals' GROUP BY je.value ORDER BY n DESC`,
    ),
    styles: await db.all<{ v: string; n: number }>(
      sql`SELECT je.value AS v, COUNT(*) AS n FROM fd_preference p, json_each(p.value_json) je WHERE p.key = 'styles' GROUP BY je.value ORDER BY n DESC`,
    ),
  };
  const calibration = await one(
    sql`SELECT ROUND(AVG(delta), 1) AS mean_delta, ROUND(AVG(ABS(delta)), 1) AS mean_abs_delta, COUNT(*) AS n
        FROM fd_calibration WHERE context LIKE 'diagnostic:%' AND delta IS NOT NULL`,
  );
  // What reviewers actually open this on — from client_context events, one
  // per session (latest wins) so a reviewer reloading doesn't skew the mix.
  const devices = await db.all<{ platform: string; browser: string; pointer: string; sessions: number }>(
    sql`WITH latest AS (
          SELECT session_id, payload_json, ROW_NUMBER() OVER (PARTITION BY session_id ORDER BY created_at DESC) AS rn
          FROM fd_event WHERE type = 'client_context'
        )
        SELECT json_extract(payload_json, '$.platform') AS platform,
               json_extract(payload_json, '$.browser') AS browser,
               json_extract(payload_json, '$.pointer') AS pointer,
               COUNT(*) AS sessions
        FROM latest WHERE rn = 1
        GROUP BY platform, browser, pointer ORDER BY sessions DESC`,
  );
  return c.json({ totals, funnel, demand, calibration, devices });
});

// ---------- brand (identity + steering guidance) ----------

// The admin is brand-scoped by construction: one brand active per deployment
// (BRAND_SLUG), and this console configures that brand.

adminApp.get('/brand', async (c) => {
  const db = c.get('db');
  const rows = await db.select().from(t.fdBrand).where(eq(t.fdBrand.slug, c.env.BRAND_SLUG)).limit(1);
  const row = rows[0];
  if (!row) return c.json({ error: 'No brand seeded for this deployment.' }, 500);
  return c.json({
    slug: row.slug,
    name: row.name,
    tokens: JSON.parse(row.tokensJson),
    voice: JSON.parse(row.voiceJson),
    profile: row.profileJson ? JSON.parse(row.profileJson) : {},
  });
});

adminApp.put('/brand', async (c) => {
  const db = c.get('db');
  const body = await c.req.json<{ name?: unknown; tokens?: unknown; voice?: unknown; profile?: unknown }>().catch(() => null);
  if (!body) return c.json({ error: 'Send the fields to update.' }, 400);
  const rows = await db.select().from(t.fdBrand).where(eq(t.fdBrand.slug, c.env.BRAND_SLUG)).limit(1);
  if (!rows[0]) return c.json({ error: 'No brand seeded for this deployment.' }, 500);
  const patch: Partial<typeof t.fdBrand.$inferInsert> = {};
  if (body.name !== undefined) {
    if (typeof body.name !== 'string' || !body.name.trim()) return c.json({ error: 'The brand name cannot be empty.' }, 400);
    patch.name = body.name.trim().slice(0, 120);
  }
  for (const [key, col] of [['tokens', 'tokensJson'], ['voice', 'voiceJson'], ['profile', 'profileJson']] as const) {
    const value = body[key];
    if (value === undefined) continue;
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      return c.json({ error: `"${key}" must be a JSON object.` }, 400);
    }
    patch[col] = JSON.stringify(value);
  }
  if (Object.keys(patch).length === 0) return c.json({ error: 'Nothing to update.' }, 400);
  await db.update(t.fdBrand).set(patch).where(eq(t.fdBrand.slug, c.env.BRAND_SLUG));
  await db.insert(t.fdEvent).values({
    id: uuid(),
    sessionId: null,
    type: 'brand_updated',
    payloadJson: JSON.stringify({ fields: Object.keys(patch) }),
    createdAt: now(),
  });
  return c.json({ ok: true });
});

// Steering guidance: text the LLM receives alongside the module content when
// personalizing (tutor chat, podcast). One row per scope; empty body deletes.
adminApp.get('/guidance', async (c) => {
  const db = c.get('db');
  const rows = await db
    .select()
    .from(t.fdBrandGuidance)
    .where(eq(t.fdBrandGuidance.brandSlug, c.env.BRAND_SLUG));
  const modules = await db.select({ id: t.fdModule.id, courseId: t.fdModule.courseId, title: t.fdModule.title, status: t.fdModule.status }).from(t.fdModule).orderBy(asc(t.fdModule.courseId), asc(t.fdModule.ordinal));
  const courses = [...new Set(modules.map((m) => m.courseId))];
  return c.json({
    guidance: rows.map((r) => ({ scope: r.scope, body: r.body, updatedAt: r.updatedAt })),
    scopes: {
      courses,
      modules: modules.map((m) => ({ id: m.id, title: m.title, status: m.status })),
    },
  });
});

adminApp.put('/guidance', async (c) => {
  const db = c.get('db');
  const body = await c.req.json<{ scope?: string; body?: string }>().catch(() => null);
  const scope = body?.scope?.trim();
  const text = typeof body?.body === 'string' ? body.body.trim() : null;
  if (!scope || text === null) return c.json({ error: 'Send { scope, body }.' }, 400);
  if (scope !== 'global') {
    const [kind, id] = scope.split(':');
    if (kind === 'course') {
      const hit = await db.select({ id: t.fdModule.id }).from(t.fdModule).where(eq(t.fdModule.courseId, id ?? '')).limit(1);
      if (!hit[0]) return c.json({ error: `No course "${id}".` }, 400);
    } else if (kind === 'module') {
      const hit = await db.select({ id: t.fdModule.id }).from(t.fdModule).where(eq(t.fdModule.id, id ?? '')).limit(1);
      if (!hit[0]) return c.json({ error: `No module "${id}".` }, 400);
    } else {
      return c.json({ error: 'Scope must be "global", "course:<id>", or "module:<id>".' }, 400);
    }
  }
  await db
    .delete(t.fdBrandGuidance)
    .where(and(eq(t.fdBrandGuidance.brandSlug, c.env.BRAND_SLUG), eq(t.fdBrandGuidance.scope, scope)));
  if (text) {
    await db.insert(t.fdBrandGuidance).values({
      id: uuid(),
      brandSlug: c.env.BRAND_SLUG,
      scope,
      body: text.slice(0, 8000),
      updatedAt: now(),
    });
  }
  await db.insert(t.fdEvent).values({
    id: uuid(),
    sessionId: null,
    type: 'guidance_updated',
    payloadJson: JSON.stringify({ scope, chars: text.length }),
    createdAt: now(),
  });
  return c.json({ ok: true, cleared: !text });
});

// ---------- learners (the LMS completion log) ----------

// Who did what, when, and how it went — one row per session, aggregated from
// the append-only funnel. "Active minutes" is an estimate: the sum of gaps
// between consecutive events, counting only gaps under 10 minutes, so idle
// tabs don't inflate it.
adminApp.get('/learners', async (c) => {
  const db = c.get('db');
  const sessions = await db.all<Record<string, unknown>>(sql`
    SELECT s.id AS session_id, s.created_at, s.last_seen_at,
           (SELECT display_name FROM fd_participant p WHERE p.session_id = s.id ORDER BY p.created_at DESC LIMIT 1) AS display_name,
           (SELECT role_label FROM fd_participant p WHERE p.session_id = s.id ORDER BY p.created_at DESC LIMIT 1) AS role_label,
           (SELECT label FROM fd_access_code a WHERE a.id = s.code_id) AS code_label
    FROM fd_session s ORDER BY s.created_at DESC LIMIT 500`);
  const active = await db.all<{ session_id: string; active_min: number }>(sql`
    WITH gaps AS (
      SELECT session_id,
             (julianday(created_at) - julianday(LAG(created_at) OVER (PARTITION BY session_id ORDER BY created_at))) * 1440.0 AS gap_min
      FROM fd_event WHERE session_id IS NOT NULL
    )
    SELECT session_id, ROUND(SUM(CASE WHEN gap_min <= 10 THEN gap_min ELSE 0 END)) AS active_min
    FROM gaps GROUP BY session_id`);
  const completions = await db.all<{ session_id: string; modules: number; last_at: string }>(sql`
    SELECT session_id, COUNT(DISTINCT json_extract(payload_json, '$.moduleId')) AS modules, MAX(created_at) AS last_at
    FROM fd_event WHERE type = 'module_completed' AND session_id IS NOT NULL GROUP BY session_id`);
  // Latest knowledge-check attempt per (session, module), averaged per session.
  const quizzes = await db.all<{ session_id: string; avg_pct: number; attempts: number }>(sql`
    WITH latest AS (
      SELECT session_id,
             CAST(json_extract(payload_json, '$.correct') AS REAL) / NULLIF(CAST(json_extract(payload_json, '$.total') AS REAL), 0) AS pct,
             ROW_NUMBER() OVER (PARTITION BY session_id, json_extract(payload_json, '$.moduleId') ORDER BY created_at DESC) AS rn,
             COUNT(*) OVER (PARTITION BY session_id) AS attempts
      FROM fd_event WHERE type = 'knowledge_check_submitted' AND session_id IS NOT NULL
    )
    SELECT session_id, ROUND(AVG(pct) * 100) AS avg_pct, MAX(attempts) AS attempts
    FROM latest WHERE rn = 1 GROUP BY session_id`);
  const activities = await db.all<{ session_id: string; best_score: number | null; submissions: number }>(sql`
    SELECT session_id, MAX(total_score) AS best_score, COUNT(*) AS submissions
    FROM fd_submission GROUP BY session_id`);
  const podcasts = await db.all<{ session_id: string; listens: number }>(sql`
    SELECT session_id, COUNT(DISTINCT json_extract(payload_json, '$.podcastId')) AS listens
    FROM fd_event WHERE type = 'podcast_played' AND session_id IS NOT NULL GROUP BY session_id`);

  const by = <T extends { session_id: string }>(rows: { results?: T[] } | T[]) => {
    const list = Array.isArray(rows) ? rows : (rows.results ?? []);
    return new Map(list.map((r) => [r.session_id, r]));
  };
  const activeBy = by(active);
  const complBy = by(completions);
  const quizBy = by(quizzes);
  const actBy = by(activities);
  const podBy = by(podcasts);
  const list = (Array.isArray(sessions) ? sessions : ((sessions as { results?: Record<string, unknown>[] }).results ?? [])).map((s) => {
    const id = s.session_id as string;
    return {
      ...s,
      active_min: activeBy.get(id)?.active_min ?? 0,
      modules_completed: complBy.get(id)?.modules ?? 0,
      last_completed_at: complBy.get(id)?.last_at ?? null,
      quiz_avg_pct: quizBy.get(id)?.avg_pct ?? null,
      quiz_attempts: quizBy.get(id)?.attempts ?? 0,
      best_activity_score: actBy.get(id)?.best_score ?? null,
      submissions: actBy.get(id)?.submissions ?? 0,
      podcast_listens: podBy.get(id)?.listens ?? 0,
    };
  });
  return c.json({ learners: list });
});

// Everything one learner did: profile + preferences, the event timeline,
// quiz attempts, submissions, and the content versions they witnessed
// (each hash opens in the Content audit tab's snapshot view).
adminApp.get('/learners/:sessionId', async (c) => {
  const db = c.get('db');
  const sessionId = c.req.param('sessionId');
  const sessions = await db.select().from(t.fdSession).where(eq(t.fdSession.id, sessionId)).limit(1);
  if (!sessions[0]) return c.json({ error: 'No such session.' }, 404);
  const participants = await db
    .select()
    .from(t.fdParticipant)
    .where(eq(t.fdParticipant.sessionId, sessionId))
    .orderBy(desc(t.fdParticipant.createdAt))
    .limit(1);
  const prefs = await db.all<{ key: string; value_json: string }>(sql`
    SELECT key, value_json FROM (
      SELECT key, value_json, ROW_NUMBER() OVER (PARTITION BY key ORDER BY created_at DESC) AS rn
      FROM fd_preference WHERE session_id = ${sessionId}
    ) WHERE rn = 1`);
  const timeline = await db.all<Record<string, unknown>>(sql`
    SELECT type, payload_json, created_at FROM fd_event
    WHERE session_id = ${sessionId} AND type IN (
      'code_entered', 'intake_completed', 'diagnostic_completed', 'module_opened', 'module_completed',
      'knowledge_check_submitted', 'sort_submitted', 'choice_submitted', 'activity_submitted',
      'activity_graded', 'chat_started', 'podcast_played'
    ) ORDER BY created_at ASC LIMIT 500`);
  const submissions = await db.all<Record<string, unknown>>(sql`
    SELECT id, module_id, created_at, graded_at, total_score, LENGTH(body) AS chars
    FROM fd_submission WHERE session_id = ${sessionId} ORDER BY created_at DESC`);
  const audits = await db.all<Record<string, unknown>>(sql`
    SELECT a.id, a.module_id, a.activity, a.ref_id, a.content_hash, a.created_at, s.kind AS snapshot_kind
    FROM fd_completion_audit a LEFT JOIN fd_content_snapshot s ON s.hash = a.content_hash
    WHERE a.session_id = ${sessionId} ORDER BY a.created_at DESC LIMIT 200`);
  const active = await db.all<{ active_min: number }>(sql`
    WITH gaps AS (
      SELECT (julianday(created_at) - julianday(LAG(created_at) OVER (ORDER BY created_at))) * 1440.0 AS gap_min
      FROM fd_event WHERE session_id = ${sessionId}
    )
    SELECT ROUND(SUM(CASE WHEN gap_min <= 10 THEN gap_min ELSE 0 END)) AS active_min FROM gaps`);
  const unwrap = <T,>(rows: { results?: T[] } | T[]): T[] => (Array.isArray(rows) ? rows : (rows.results ?? []));
  return c.json({
    session: { id: sessions[0].id, createdAt: sessions[0].createdAt, lastSeenAt: sessions[0].lastSeenAt },
    participant: participants[0]
      ? { displayName: participants[0].displayName, roleLabel: participants[0].roleLabel, orgLabel: participants[0].orgLabel }
      : null,
    preferences: Object.fromEntries(unwrap(prefs).map((p) => [p.key, JSON.parse(p.value_json)])),
    activeMinutes: unwrap(active)[0]?.active_min ?? 0,
    timeline: unwrap(timeline),
    submissions: unwrap(submissions),
    audits: unwrap(audits),
  });
});

// ---------- content management ----------

adminApp.get('/content/modules', async (c) => {
  const db = c.get('db');
  const rows = await db.all<Record<string, unknown>>(sql`
    SELECT m.id, m.course_id, m.ordinal, m.title, m.status, m.est_minutes,
           (SELECT COUNT(*) FROM fd_content_block b WHERE b.module_id = m.id) AS blocks,
           (SELECT COUNT(*) FROM fd_content_block b WHERE b.module_id = m.id || '-micro') AS micro_blocks,
           (SELECT COUNT(*) FROM fd_content_block b WHERE b.module_id = m.id || '-activity') AS activity_blocks,
           (SELECT GROUP_CONCAT(kind) FROM fd_exercise e WHERE e.module_id = m.id) AS exercise_kinds,
           (SELECT MIN(reviewed_at) FROM fd_content_block b WHERE b.module_id = m.id) AS oldest_reviewed_at,
           (SELECT COUNT(*) FROM fd_content_snapshot s WHERE s.module_id = m.id OR s.module_id LIKE m.id || '-%') AS versions_witnessed
    FROM fd_module m ORDER BY m.course_id, m.ordinal`);
  return c.json({ modules: rows });
});

// All blocks for an exact content module id (base, -micro, or -activity),
// every variant included — this is the editor's view, not the learner's.
adminApp.get('/content/blocks', async (c) => {
  const db = c.get('db');
  const moduleId = c.req.query('module')?.trim();
  if (!moduleId) return c.json({ error: 'Pass ?module=<content module id>.' }, 400);
  const rows = await db
    .select()
    .from(t.fdContentBlock)
    .where(eq(t.fdContentBlock.moduleId, moduleId))
    .orderBy(asc(t.fdContentBlock.ordinal));
  return c.json({ blocks: rows });
});

// Operator content edit. Goes live immediately for new views; learners who
// saw the old version keep their audited snapshot (the next witness mints a
// new content hash automatically).
adminApp.put('/content/blocks/:id', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  const body = await c.req.json<{ body?: string }>().catch(() => null);
  const text = body?.body;
  if (typeof text !== 'string' || !text.trim()) return c.json({ error: 'The block body cannot be empty.' }, 400);
  const rows = await db.select().from(t.fdContentBlock).where(eq(t.fdContentBlock.id, id)).limit(1);
  const block = rows[0];
  if (!block) return c.json({ error: 'No such block.' }, 404);
  const today = now().slice(0, 10);
  await db.update(t.fdContentBlock).set({ body: text, reviewedAt: today }).where(eq(t.fdContentBlock.id, id));
  await db.insert(t.fdEvent).values({
    id: uuid(),
    sessionId: null,
    type: 'content_block_edited',
    payloadJson: JSON.stringify({ blockId: id, moduleId: block.moduleId, chars: text.length }),
    createdAt: now(),
  });
  return c.json({ ok: true, reviewedAt: today });
});

// ---------- employee census ----------

// Minimal CSV parser: quoted fields, commas, CRLF. Returns rows of cells.
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (ch === '"') inQuotes = false;
      else cell += ch;
    } else if (ch === '"') inQuotes = true;
    else if (ch === ',') { row.push(cell); cell = ''; }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(cell); cell = '';
      if (row.some((c) => c.trim())) rows.push(row);
      row = [];
    } else cell += ch;
  }
  row.push(cell);
  if (row.some((c) => c.trim())) rows.push(row);
  return rows;
}

// Tolerant header mapping: "Manager Name", "manager_name", "manager" all land.
const CENSUS_FIELDS: Record<string, string[]> = {
  name: ['name', 'employee', 'employee_name', 'full_name'],
  email: ['email', 'employee_email', 'work_email'],
  roleTitle: ['role', 'title', 'role_title', 'job_title'],
  managerName: ['manager', 'manager_name'],
  managerEmail: ['manager_email'],
  level: ['level', 'grade', 'band'],
  location: ['location', 'office', 'site'],
  startDate: ['start_date', 'start', 'hire_date', 'startdate'],
};

// Matching census rows to learner sessions, strongest identity first:
// account email (exact — accounts mode) then self-reported intake name
// (case-insensitive — passcode/demo sessions). Latest session wins.
type CensusMatch = { session_id: string; last_seen_at: string; modules: number };

function unwrapAll<T>(rows: { results?: T[] } | T[]): T[] {
  return Array.isArray(rows) ? rows : (rows.results ?? []);
}

async function censusMatches(db: DrizzleD1Database) {
  const named = unwrapAll(
    await db.all<CensusMatch & { name: string }>(sql`
    WITH named AS (
      SELECT LOWER(TRIM(p.display_name)) AS name, p.session_id, s.last_seen_at,
             ROW_NUMBER() OVER (PARTITION BY LOWER(TRIM(p.display_name)) ORDER BY p.created_at DESC) AS rn
      FROM fd_participant p JOIN fd_session s ON s.id = p.session_id
      WHERE p.display_name IS NOT NULL AND TRIM(p.display_name) != ''
    )
    SELECT name, session_id, last_seen_at,
           (SELECT COUNT(DISTINCT json_extract(e.payload_json, '$.moduleId')) FROM fd_event e
             WHERE e.session_id = named.session_id AND e.type = 'module_completed') AS modules
    FROM named WHERE rn = 1`),
  );
  const byAccount = unwrapAll(
    await db.all<CensusMatch & { email: string }>(sql`
    WITH latest AS (
      SELECT LOWER(a.email) AS email, s.id AS session_id, s.last_seen_at,
             ROW_NUMBER() OVER (PARTITION BY a.id ORDER BY s.last_seen_at DESC) AS rn
      FROM fd_account a JOIN fd_session s ON s.account_id = a.id
    )
    SELECT email, session_id, last_seen_at,
           (SELECT COUNT(DISTINCT json_extract(e.payload_json, '$.moduleId')) FROM fd_event e
             WHERE e.session_id = latest.session_id AND e.type = 'module_completed') AS modules
    FROM latest WHERE rn = 1`),
  );
  const byName = new Map(named.map((r) => [r.name, r as CensusMatch]));
  const byEmail = new Map(byAccount.map((r) => [r.email, r as CensusMatch]));
  return {
    forEmployee(e: { name: string; email: string | null }): CensusMatch | undefined {
      return (e.email ? byEmail.get(e.email.toLowerCase()) : undefined) ?? byName.get(e.name.trim().toLowerCase());
    },
  };
}

adminApp.get('/census', async (c) => {
  const db = c.get('db');
  const employees = await db
    .select()
    .from(t.fdEmployee)
    .where(eq(t.fdEmployee.brandSlug, c.env.BRAND_SLUG))
    .orderBy(asc(t.fdEmployee.name));
  const matches = await censusMatches(db);
  const accounts = await db.select().from(t.fdAccount).where(eq(t.fdAccount.brandSlug, c.env.BRAND_SLUG));
  const accountByEmail = new Map(accounts.map((a) => [a.email, a]));
  return c.json({
    employees: employees.map((e) => {
      const m = matches.forEmployee(e);
      const account = e.email ? accountByEmail.get(e.email.toLowerCase()) : undefined;
      return {
        id: e.id,
        name: e.name,
        email: e.email,
        roleTitle: e.roleTitle,
        managerName: e.managerName,
        managerEmail: e.managerEmail,
        level: e.level,
        location: e.location,
        startDate: e.startDate,
        source: e.source,
        matchedSessionId: m?.session_id ?? null,
        lastSeenAt: m?.last_seen_at ?? null,
        modulesCompleted: m?.modules ?? 0,
        hasAccount: !!account,
        accountLastLoginAt: account?.lastLoginAt ?? null,
      };
    }),
  });
});

// Password reset for an employee's account. There is no email provider yet,
// so the reset is admin-mediated: a one-time temp password is generated,
// shown to the admin exactly once, and never stored in plaintext. The
// employee should change it after signing in.
adminApp.post('/census/:id/reset-password', async (c) => {
  const db = c.get('db');
  const rows = await db
    .select()
    .from(t.fdEmployee)
    .where(and(eq(t.fdEmployee.id, c.req.param('id')), eq(t.fdEmployee.brandSlug, c.env.BRAND_SLUG)))
    .limit(1);
  const employee = rows[0];
  if (!employee) return c.json({ error: 'No such employee.' }, 404);
  if (!employee.email) return c.json({ error: 'This employee has no email on file.' }, 400);
  const accounts = await db
    .select()
    .from(t.fdAccount)
    .where(and(eq(t.fdAccount.brandSlug, c.env.BRAND_SLUG), eq(t.fdAccount.email, employee.email.toLowerCase())))
    .limit(1);
  if (!accounts[0]) return c.json({ error: 'They haven’t created an account yet — nothing to reset.' }, 404);

  const alphabet = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789';
  const bytes = crypto.getRandomValues(new Uint8Array(14));
  const tempPassword = [...bytes].map((b) => alphabet[b % alphabet.length]).join('');
  await db.update(t.fdAccount).set({ passwordHash: await hashCode(tempPassword) }).where(eq(t.fdAccount.id, accounts[0].id));
  await db.insert(t.fdEvent).values({
    id: uuid(),
    sessionId: null,
    type: 'password_reset_by_admin',
    payloadJson: JSON.stringify({ employeeId: employee.id }),
    createdAt: now(),
  });
  return c.json({ tempPassword });
});

adminApp.post('/census/import', async (c) => {
  const db = c.get('db');
  const body = await c.req.json<{ csv?: string }>().catch(() => null);
  const csv = body?.csv?.trim();
  if (!csv) return c.json({ error: 'Paste the CSV to import.' }, 400);
  if (csv.length > 2_000_000) return c.json({ error: 'That CSV is too large — import in batches under 2 MB.' }, 400);
  const rows = parseCsv(csv);
  if (rows.length < 2) return c.json({ error: 'Need a header row and at least one employee row.' }, 400);

  const header = rows[0].map((h) => h.trim().toLowerCase().replace(/[\s-]+/g, '_'));
  const columnOf: Record<string, number> = {};
  for (const [field, aliases] of Object.entries(CENSUS_FIELDS)) {
    const idx = header.findIndex((h) => aliases.includes(h));
    if (idx >= 0) columnOf[field] = idx;
  }
  if (columnOf.name === undefined) return c.json({ error: 'The CSV needs a "name" column (or employee/full_name).' }, 400);

  const existing = await db.select().from(t.fdEmployee).where(eq(t.fdEmployee.brandSlug, c.env.BRAND_SLUG));
  const byEmail = new Map(existing.filter((e) => e.email).map((e) => [e.email!.toLowerCase(), e]));
  const byName = new Map(existing.map((e) => [e.name.trim().toLowerCase(), e]));

  let imported = 0;
  let updated = 0;
  let skipped = 0;
  for (const cells of rows.slice(1)) {
    const get = (field: string) => {
      const idx = columnOf[field];
      const v = idx === undefined ? '' : (cells[idx] ?? '').trim();
      return v || null;
    };
    const name = get('name');
    if (!name) { skipped++; continue; }
    const email = get('email');
    const values = {
      name,
      email,
      roleTitle: get('roleTitle'),
      managerName: get('managerName'),
      managerEmail: get('managerEmail'),
      level: get('level'),
      location: get('location'),
      startDate: get('startDate'),
      source: 'csv',
      updatedAt: now(),
    };
    const prior = (email && byEmail.get(email.toLowerCase())) || byName.get(name.trim().toLowerCase());
    if (prior) {
      await db.update(t.fdEmployee).set(values).where(eq(t.fdEmployee.id, prior.id));
      updated++;
    } else {
      await db.insert(t.fdEmployee).values({ id: uuid(), brandSlug: c.env.BRAND_SLUG, createdAt: now(), ...values });
      imported++;
    }
  }
  await db.insert(t.fdEvent).values({
    id: uuid(),
    sessionId: null,
    type: 'census_imported',
    payloadJson: JSON.stringify({ imported, updated, skipped }),
    createdAt: now(),
  });
  return c.json({ imported, updated, skipped });
});

adminApp.delete('/census/:id', async (c) => {
  const db = c.get('db');
  await db
    .delete(t.fdEmployee)
    .where(and(eq(t.fdEmployee.id, c.req.param('id')), eq(t.fdEmployee.brandSlug, c.env.BRAND_SLUG)));
  return c.json({ ok: true });
});

// ---------- reminders ----------

const REMINDER_AUDIENCES = new Set(['employee', 'manager']);
const REMINDER_TRIGGERS = new Set(['not_started', 'inactive', 'incomplete']);

adminApp.get('/reminders', async (c) => {
  const db = c.get('db');
  const rules = await db
    .select()
    .from(t.fdReminderRule)
    .where(eq(t.fdReminderRule.brandSlug, c.env.BRAND_SLUG))
    .orderBy(asc(t.fdReminderRule.createdAt));
  return c.json({ rules: rules.map((r) => ({ ...r, active: r.active === 1 })) });
});

adminApp.post('/reminders', async (c) => {
  const db = c.get('db');
  const body = await c.req.json<{ audience?: string; trigger?: string; days?: number; template?: string }>().catch(() => null);
  const audience = body?.audience ?? '';
  const trigger = body?.trigger ?? '';
  const days = Number(body?.days);
  const template = body?.template?.trim();
  if (!REMINDER_AUDIENCES.has(audience)) return c.json({ error: 'Audience must be employee or manager.' }, 400);
  if (!REMINDER_TRIGGERS.has(trigger)) return c.json({ error: 'Trigger must be not_started, inactive, or incomplete.' }, 400);
  if (!Number.isInteger(days) || days < 1 || days > 365) return c.json({ error: 'Days must be between 1 and 365.' }, 400);
  if (!template) return c.json({ error: 'Write the reminder template.' }, 400);
  await db.insert(t.fdReminderRule).values({
    id: uuid(),
    brandSlug: c.env.BRAND_SLUG,
    audience,
    trigger,
    days,
    template: template.slice(0, 4000),
    active: 1,
    createdAt: now(),
    updatedAt: now(),
  });
  return c.json({ ok: true });
});

adminApp.post('/reminders/:id/toggle', async (c) => {
  const db = c.get('db');
  const rows = await db
    .select()
    .from(t.fdReminderRule)
    .where(and(eq(t.fdReminderRule.id, c.req.param('id')), eq(t.fdReminderRule.brandSlug, c.env.BRAND_SLUG)))
    .limit(1);
  if (!rows[0]) return c.json({ error: 'No such rule.' }, 404);
  await db
    .update(t.fdReminderRule)
    .set({ active: rows[0].active === 1 ? 0 : 1, updatedAt: now() })
    .where(eq(t.fdReminderRule.id, rows[0].id));
  return c.json({ ok: true, active: rows[0].active !== 1 });
});

adminApp.delete('/reminders/:id', async (c) => {
  const db = c.get('db');
  await db
    .delete(t.fdReminderRule)
    .where(and(eq(t.fdReminderRule.id, c.req.param('id')), eq(t.fdReminderRule.brandSlug, c.env.BRAND_SLUG)));
  return c.json({ ok: true });
});

const fillTemplate = (template: string, vars: Record<string, string>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => vars[key] ?? `{${key}}`);

// Who each active rule would notify right now, with the rendered message. One
// evaluation, two callers: the admin's dry-run preview and the delivery pass —
// so what an operator sees in the preview is exactly what gets sent, never a
// second implementation that drifts from it.
export async function evaluateReminders(db: DrizzleD1Database, brandSlug: string) {
  const rules = await db
    .select()
    .from(t.fdReminderRule)
    .where(and(eq(t.fdReminderRule.brandSlug, brandSlug), eq(t.fdReminderRule.active, 1)));
  const employees = await db.select().from(t.fdEmployee).where(eq(t.fdEmployee.brandSlug, brandSlug));
  const matches = await censusMatches(db);
  const nowMs = Date.now();
  const daysAgo = (iso: string | null) => (iso ? (nowMs - Date.parse(iso)) / 86_400_000 : null);

  return rules.map((rule) => {
    const due = employees.filter((e) => {
      const m = matches.forEmployee(e);
      if (rule.trigger === 'not_started') {
        if (m) return false;
        const sinceStart = daysAgo(e.startDate);
        return sinceStart === null || sinceStart >= rule.days;
      }
      if (rule.trigger === 'inactive') {
        const idle = m ? daysAgo(m.last_seen_at) : null;
        return idle !== null && idle >= rule.days;
      }
      // incomplete: started, no module completed, and idle long enough to nudge
      return m !== undefined && m.modules === 0 && (daysAgo(m.last_seen_at) ?? 0) >= rule.days;
    });
    return {
      ruleId: rule.id,
      audience: rule.audience,
      trigger: rule.trigger,
      days: rule.days,
      recipients: due.map((e) => {
        const vars = {
          name: e.name,
          first_name: e.name.split(/\s+/)[0],
          manager_name: e.managerName ?? 'their manager',
          days: String(rule.days),
        };
        const raw = rule.audience === 'manager' ? e.managerEmail : e.email;
        return {
          employee: e.name,
          to: raw ?? (rule.audience === 'manager' ? (e.managerName ?? '(no manager on file)') : '(no email on file)'),
          address: deliverableAddress(raw),
          message: fillTemplate(rule.template, vars),
          deliverable: !!deliverableAddress(raw),
        };
      }),
    };
  });
}

adminApp.get('/reminders/preview', async (c) => {
  const previews = await evaluateReminders(c.get('db'), c.env.BRAND_SLUG);
  return c.json({ previews, delivery: { configured: emailEnabled(c.env) } });
});

// The delivery pass. Dedupe is per (rule, recipient) inside the rule's own day
// window: a rule that fires on 7 days of silence should not nudge the same
// person twice in those 7 days. That single fact makes the pass idempotent, so
// the cron can run it as often as it likes without a separate run-lock.
export async function runReminderPass(
  db: DrizzleD1Database,
  env: AdminEnv,
  origin: string,
): Promise<{ sent: number; skipped: number; failed: number; suppressed: number }> {
  const previews = await evaluateReminders(db, env.BRAND_SLUG);
  const brandRows = await db.select().from(t.fdBrand).where(eq(t.fdBrand.slug, env.BRAND_SLUG)).limit(1);
  const brandName = brandRows[0]?.name ?? 'Your company';
  const tally = { sent: 0, skipped: 0, failed: 0, suppressed: 0 };

  for (const preview of previews) {
    const kind = `reminder:${preview.ruleId}`;
    const windowStart = new Date(Date.now() - preview.days * 86_400_000).toISOString();
    const recent = await db
      .select({ toEmail: t.fdEmailSend.toEmail })
      .from(t.fdEmailSend)
      .where(
        and(
          eq(t.fdEmailSend.brandSlug, env.BRAND_SLUG),
          eq(t.fdEmailSend.kind, kind),
          gt(t.fdEmailSend.createdAt, windowStart),
        ),
      );
    const alreadyNudged = new Set(recent.map((r) => r.toEmail));

    for (const r of preview.recipients) {
      if (!r.address) {
        tally.skipped++;
        continue;
      }
      if (alreadyNudged.has(r.address)) {
        tally.suppressed++;
        continue;
      }
      const subject =
        preview.audience === 'manager'
          ? `AI Fluency — ${r.employee.split(/\s+/)[0]} on your team`
          : 'AI Fluency — your course';
      const result = await sendEmail(env, { to: r.address, subject, text: r.message + signature(brandName, origin) });
      await db.insert(t.fdEmailSend).values({
        id: uuid(),
        brandSlug: env.BRAND_SLUG,
        kind,
        toEmail: r.address,
        subject,
        body: r.message,
        status: result.status,
        provider: result.provider,
        error: result.error,
        createdAt: now(),
      });
      alreadyNudged.add(r.address);
      tally[result.status === 'sent' ? 'sent' : result.status === 'failed' ? 'failed' : 'skipped']++;
    }
  }
  return tally;
}

adminApp.post('/reminders/send', async (c) => {
  const tally = await runReminderPass(c.get('db'), c.env, new URL(c.req.url).origin);
  return c.json({ ok: true, ...tally, delivery: { configured: emailEnabled(c.env) } });
});

// What actually went out, newest first — the operator's proof that the rules
// are doing something, and the place a failed provider call is visible.
adminApp.get('/reminders/log', async (c) => {
  const rows = await c
    .get('db')
    .select()
    .from(t.fdEmailSend)
    .where(eq(t.fdEmailSend.brandSlug, c.env.BRAND_SLUG))
    .orderBy(desc(t.fdEmailSend.createdAt))
    .limit(200);
  return c.json({ sends: rows });
});

// ---------- completion audit ----------

// Who completed what, against which content version. Each row points at a
// content-addressed snapshot; the snapshot endpoint below opens the exact
// content as the learner saw it, even after the live version has changed.
adminApp.get('/audit', async (c) => {
  const db = c.get('db');
  const session = c.req.query('session')?.trim();
  const where = session ? sql`WHERE a.session_id = ${session}` : sql``;
  const rows = await db.all<Record<string, unknown>>(sql`
    SELECT a.id, a.session_id, a.module_id, a.activity, a.ref_id, a.content_hash, a.created_at,
           s.kind AS snapshot_kind,
           (SELECT display_name FROM fd_participant p WHERE p.session_id = a.session_id ORDER BY p.created_at DESC LIMIT 1) AS display_name
    FROM fd_completion_audit a
    LEFT JOIN fd_content_snapshot s ON s.hash = a.content_hash
    ${where}
    ORDER BY a.created_at DESC LIMIT 200`);
  return c.json({ audits: rows });
});

adminApp.get('/audit/snapshot/:hash', async (c) => {
  const db = c.get('db');
  const hash = c.req.param('hash');
  const rows = await db.select().from(t.fdContentSnapshot).where(eq(t.fdContentSnapshot.hash, hash)).limit(1);
  const snapshot = rows[0];
  if (!snapshot) return c.json({ error: 'No such snapshot.' }, 404);
  const witnesses = await db
    .select({ n: sql<number>`count(*)` })
    .from(t.fdCompletionAudit)
    .where(eq(t.fdCompletionAudit.contentHash, hash));
  return c.json({
    hash: snapshot.hash,
    kind: snapshot.kind,
    moduleId: snapshot.moduleId,
    firstWitnessedAt: snapshot.createdAt,
    witnesses: witnesses[0]?.n ?? 0,
    content: JSON.parse(snapshot.contentJson),
  });
});

// ---------- review queue ----------

adminApp.get('/submissions', async (c) => {
  const db = c.get('db');
  const rows = await db.all<Record<string, unknown>>(sql`
    SELECT s.id, s.module_id, s.created_at, s.graded_at, s.total_score, LENGTH(s.body) AS chars,
           (SELECT display_name FROM fd_participant p WHERE p.session_id = s.session_id ORDER BY p.created_at DESC LIMIT 1) AS display_name,
           (SELECT COUNT(*) FROM fd_review r WHERE r.submission_id = s.id) AS reviews
    FROM fd_submission s ORDER BY s.created_at DESC LIMIT 200`);
  return c.json({ submissions: rows });
});

adminApp.get('/submissions/:id', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  const rows = await db.select().from(t.fdSubmission).where(eq(t.fdSubmission.id, id)).limit(1);
  const submission = rows[0];
  if (!submission) return c.json({ error: 'No such submission.' }, 404);
  const reviews = await db.select().from(t.fdReview).where(eq(t.fdReview.submissionId, id)).orderBy(desc(t.fdReview.createdAt));
  const participants = await db
    .select()
    .from(t.fdParticipant)
    .where(eq(t.fdParticipant.sessionId, submission.sessionId))
    .orderBy(desc(t.fdParticipant.createdAt))
    .limit(1);
  return c.json({
    submission: {
      id: submission.id,
      moduleId: submission.moduleId,
      body: submission.body,
      createdAt: submission.createdAt,
      gradedAt: submission.gradedAt,
      totalScore: submission.totalScore,
      rubric: submission.rubricJson ? JSON.parse(submission.rubricJson) : null,
      displayName: participants[0]?.displayName ?? null,
      roleLabel: participants[0]?.roleLabel ?? null,
    },
    reviews,
  });
});

adminApp.post('/submissions/:id/review', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  const body = await c.req.json<{ body?: string; score?: number }>().catch(() => null);
  const text = body?.body?.trim();
  if (!text) return c.json({ error: 'Write the review before sending it.' }, 400);
  const exists = await db.select({ id: t.fdSubmission.id }).from(t.fdSubmission).where(eq(t.fdSubmission.id, id)).limit(1);
  if (!exists[0]) return c.json({ error: 'No such submission.' }, 404);
  const score = Number.isFinite(body?.score) ? Math.max(0, Math.min(20, Math.round(body!.score!))) : null;
  await db.insert(t.fdReview).values({
    id: uuid(),
    submissionId: id,
    reviewer: 'operator',
    body: text.slice(0, 10_000),
    score,
    createdAt: now(),
  });
  await db.insert(t.fdEvent).values({
    id: uuid(),
    sessionId: null,
    type: 'operator_review_added',
    payloadJson: JSON.stringify({ submissionId: id }),
    createdAt: now(),
  });
  return c.json({ ok: true });
});

// ---------- access codes ----------

adminApp.get('/codes', async (c) => {
  const db = c.get('db');
  const rows = await db.select().from(t.fdAccessCode);
  return c.json({
    codes: rows.map((r) => ({
      id: r.id,
      brandSlug: r.brandSlug,
      label: r.label,
      uses: r.uses,
      maxUses: r.maxUses,
      expiresAt: r.expiresAt,
      active: r.active === 1,
    })),
  });
});

adminApp.post('/codes', async (c) => {
  const db = c.get('db');
  const body = await c.req.json<{ brandSlug?: string; label?: string; code?: string }>().catch(() => null);
  const brandSlug = body?.brandSlug?.trim();
  const label = body?.label?.trim();
  const code = body?.code?.trim();
  if (!brandSlug || !label || !code) return c.json({ error: 'Brand, label, and code are all required.' }, 400);
  if (code.length < 8) return c.json({ error: 'Codes need at least 8 characters.' }, 400);
  const brand = await db.select({ slug: t.fdBrand.slug }).from(t.fdBrand).where(eq(t.fdBrand.slug, brandSlug)).limit(1);
  if (!brand[0]) return c.json({ error: `No brand "${brandSlug}" is seeded.` }, 400);
  await db.insert(t.fdAccessCode).values({
    id: uuid(),
    brandSlug,
    codeHash: await hashCode(code),
    label: label.slice(0, 120),
    maxUses: null,
    uses: 0,
    expiresAt: null,
    active: 1,
  });
  return c.json({ ok: true });
});

adminApp.post('/codes/:id/toggle', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  const rows = await db.select().from(t.fdAccessCode).where(eq(t.fdAccessCode.id, id)).limit(1);
  if (!rows[0]) return c.json({ error: 'No such code.' }, 404);
  await db.update(t.fdAccessCode).set({ active: rows[0].active === 1 ? 0 : 1 }).where(eq(t.fdAccessCode.id, id));
  return c.json({ ok: true, active: rows[0].active !== 1 });
});
