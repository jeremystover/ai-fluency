// Operator console: review queue (the M8 async backup path), reporting, and
// access-code management. Gated by ADMIN_PASSCODE (wrangler secret) and a
// separate HMAC-signed cookie — admin state never mixes with learner sessions.
import { Hono } from 'hono';
import { getCookie, setCookie } from 'hono/cookie';
import { drizzle, type DrizzleD1Database } from 'drizzle-orm/d1';
import { and, desc, eq, gt, sql } from 'drizzle-orm';
import * as t from '../db/schema';
import { constantTimeEqual, hashCode, signSessionId, verifySessionCookie, hashIp } from './crypto';

export interface AdminEnv {
  DB: D1Database;
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
