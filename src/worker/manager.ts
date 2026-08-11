// The manager view. There is no separate manager credential and no invite
// flow: the census already declares who reports to whom, so a signed-in account
// whose email appears in any fd_employee.manager_email row *is* a manager, and
// their team is exactly those rows. One roster, one source of truth.
//
// Two rules hold this together.
//
// 1. Authorization is exact-email only. The census tab tolerates matching a
//    learner by self-reported display name, because there a bad match is a
//    wrong number on a report. Here a bad match is one person reading another
//    person's work, so the name path is never used — a signed-in account, an
//    exact address, or no team. A demo passcode session is anonymous and so
//    resolves to no team, which is the correct answer rather than a blocked one.
//
// 2. The manager sees progress and finished work, never process. No diagnostic
//    self-rating, no calibration, no tutor transcript, no per-question misses.
//    This course asks people to say out loud what they don't understand; that
//    bargain does not survive their manager reading the answer.

import { Hono } from 'hono';
import { and, asc, desc, eq, inArray, sql } from 'drizzle-orm';
import type { DrizzleD1Database } from 'drizzle-orm/d1';
import * as t from '../db/schema';
import { deliverableAddress, emailEnabled, sendEmail, signature, type EmailEnv } from './email';
import type { CommitmentResponse, ManagerResponse, ManagerSignal, TeamAggregate, TeamMember } from '../shared/types';

// Below this many reports, aggregates are suppressed: with two people on a
// team, "1 of 2 missed this" names someone.
const AGGREGATE_FLOOR = 3;

const now = () => new Date().toISOString();
const uuid = () => crypto.randomUUID();

export type ManagerEnv = EmailEnv & { DB: D1Database; BRAND_SLUG: string };

type SessionRow = typeof t.fdSession.$inferSelect;

// The signed-in account's email, lowercased — the only identity this module
// will authorize against. A demo passcode session has no account and therefore
// no team, which is correct: anonymous sessions cannot be managers.
export async function accountEmailFor(db: DrizzleD1Database, session: SessionRow | null): Promise<string | null> {
  if (!session?.accountId) return null;
  const rows = await db.select().from(t.fdAccount).where(eq(t.fdAccount.id, session.accountId)).limit(1);
  return rows[0]?.email.toLowerCase() ?? null;
}

// Latest session per account email — the same "strongest identity first" idea
// as the admin census, minus the display-name fallback.
async function sessionsByEmail(db: DrizzleD1Database) {
  const rows = await db.all<{ email: string; session_id: string; last_seen_at: string }>(sql`
    WITH latest AS (
      SELECT LOWER(a.email) AS email, s.id AS session_id, s.last_seen_at,
             ROW_NUMBER() OVER (PARTITION BY a.id ORDER BY s.last_seen_at DESC) AS rn
      FROM fd_account a JOIN fd_session s ON s.account_id = a.id
    )
    SELECT email, session_id, last_seen_at FROM latest WHERE rn = 1`);
  const list = Array.isArray(rows) ? rows : ((rows as { results?: typeof rows }).results ?? []);
  return new Map(list.map((r) => [r.email, { sessionId: r.session_id, lastSeenAt: r.last_seen_at }]));
}

async function clearedBySession(db: DrizzleD1Database, sessionIds: string[]) {
  const cleared = new Map<string, Set<string>>();
  if (!sessionIds.length) return cleared;
  const rows = await db
    .select({ sessionId: t.fdEvent.sessionId, payloadJson: t.fdEvent.payloadJson })
    .from(t.fdEvent)
    .where(and(inArray(t.fdEvent.sessionId, sessionIds), eq(t.fdEvent.type, 'module_completed')));
  for (const r of rows) {
    const moduleId = (JSON.parse(r.payloadJson ?? '{}') as { moduleId?: string }).moduleId;
    if (!r.sessionId || !moduleId) continue;
    if (!cleared.has(r.sessionId)) cleared.set(r.sessionId, new Set());
    cleared.get(r.sessionId)!.add(moduleId);
  }
  return cleared;
}

export async function teamStatusFor(
  db: DrizzleD1Database,
  brandSlug: string,
  session: SessionRow | null,
): Promise<ManagerResponse | null> {
  const email = await accountEmailFor(db, session);
  if (!email) return null;
  const reports = await db
    .select()
    .from(t.fdEmployee)
    .where(and(eq(t.fdEmployee.brandSlug, brandSlug), sql`LOWER(${t.fdEmployee.managerEmail}) = ${email}`))
    .orderBy(asc(t.fdEmployee.name));
  if (!reports.length) return null;
  {
    const c = { env: { BRAND_SLUG: brandSlug } };

    const modules = await db.select().from(t.fdModule).where(eq(t.fdModule.status, 'open'));
    const modulesTotal = modules.length;
    const titleOf = (id: string) => modules.find((m) => m.id === id)?.title ?? id;

    const byEmail = await sessionsByEmail(db);
    const linked = reports
      .map((e) => ({ e, s: e.email ? byEmail.get(e.email.toLowerCase()) : undefined }))
      .filter((r) => r.s);
    const sessionIds = linked.map((r) => r.s!.sessionId);
    const cleared = await clearedBySession(db, sessionIds);

    // Graded work, fetched only for the reports who opted in.
    const consenting = new Set<string>();
    if (sessionIds.length) {
      const prefRows = await db
        .select()
        .from(t.fdPreference)
        .where(and(inArray(t.fdPreference.sessionId, sessionIds), eq(t.fdPreference.key, 'shareWork')))
        .orderBy(asc(t.fdPreference.createdAt));
      const latest = new Map<string, boolean>();
      for (const p of prefRows) latest.set(p.sessionId, JSON.parse(p.valueJson) === true);
      for (const [sid, on] of latest) if (on) consenting.add(sid);
    }
    const submissions = consenting.size
      ? await db
          .select()
          .from(t.fdSubmission)
          .where(and(inArray(t.fdSubmission.sessionId, [...consenting]), sql`${t.fdSubmission.gradedAt} IS NOT NULL`))
          .orderBy(desc(t.fdSubmission.createdAt))
      : [];

    const commitments = sessionIds.length
      ? await db
          .select()
          .from(t.fdCommitment)
          .where(inArray(t.fdCommitment.sessionId, sessionIds))
          .orderBy(desc(t.fdCommitment.createdAt))
      : [];

    const actions = await db
      .select()
      .from(t.fdManagerAction)
      .where(and(eq(t.fdManagerAction.brandSlug, c.env.BRAND_SLUG), eq(t.fdManagerAction.managerEmail, email)))
      .orderBy(desc(t.fdManagerAction.createdAt));

    // "One thing to ask" comes from the module they most recently cleared,
    // using that module's own baked takeaways. Derived from real content — the
    // manager is handed the course's words, not an invented prompt.
    const stock = await db.select().from(t.fdPodcastStock).where(eq(t.fdPodcastStock.variant, 'generic'));
    const takeawayFor = (moduleId: string): string | null => {
      const row = stock.find((s) => s.moduleId === moduleId);
      const list: string[] = row?.takeawaysJson ? JSON.parse(row.takeawaysJson) : [];
      return list[0] ?? null;
    };

    const team: TeamMember[] = reports.map((e) => {
      const s = e.email ? byEmail.get(e.email.toLowerCase()) : undefined;
      const done = s ? (cleared.get(s.sessionId)?.size ?? 0) : 0;
      const status: TeamMember['status'] = !s
        ? 'not_started'
        : done === 0
          ? 'started'
          : done >= modulesTotal
            ? 'complete'
            : 'in_progress';
      const sharesWork = !!s && consenting.has(s.sessionId);
      const work = sharesWork
        ? submissions
            .filter((sub) => sub.sessionId === s!.sessionId)
            .map((sub) => ({
              moduleTitle: titleOf(sub.moduleId),
              score: sub.totalScore,
              summary: sub.rubricJson ? ((JSON.parse(sub.rubricJson) as { summary?: string }).summary ?? null) : null,
              submissionId: sub.id,
            }))
        : null;
      const c0 = s ? commitments.find((x) => x.sessionId === s.sessionId && x.sharedWithManager === 1) : undefined;
      const lastCleared = s ? [...(cleared.get(s.sessionId) ?? [])].pop() : undefined;
      const takeaway = lastCleared ? takeawayFor(lastCleared) : null;
      return {
        employeeId: e.id,
        name: e.name,
        roleTitle: e.roleTitle,
        status,
        modulesCleared: done,
        modulesTotal,
        lastSeenAt: s?.lastSeenAt ?? null,
        work,
        sharesWork,
        commitment: c0
          ? { id: c0.id, targetDate: c0.targetDate, note: c0.note, acknowledgedAt: c0.managerAckAt }
          : null,
        askAbout:
          lastCleared && takeaway
            ? { moduleTitle: titleOf(lastCleared), question: `How would this land on something on your plate right now — "${takeaway}"?` }
            : null,
        recentActions: actions
          .filter((a) => a.employeeId === e.id)
          .slice(0, 3)
          .map((a) => ({ kind: a.kind, body: a.body, createdAt: a.createdAt })),
      };
    });

    // Aggregates, suppressed on small teams. Weak spots come from the misses
    // recorded on knowledge checks and are reported per question with a count —
    // never with a name attached.
    let aggregate: TeamAggregate | null = null;
    const orgEmployees = await db.select({ id: t.fdEmployee.id, email: t.fdEmployee.email }).from(t.fdEmployee).where(eq(t.fdEmployee.brandSlug, c.env.BRAND_SLUG));
    const orgStarted = orgEmployees.filter((e) => e.email && byEmail.has(e.email.toLowerCase())).length;
    if (reports.length >= AGGREGATE_FLOOR) {
      let weakSpots: TeamAggregate['weakSpots'] = null;
      if (sessionIds.length) {
        const checkRows = await db
          .select({ sessionId: t.fdEvent.sessionId, payloadJson: t.fdEvent.payloadJson, createdAt: t.fdEvent.createdAt })
          .from(t.fdEvent)
          .where(and(inArray(t.fdEvent.sessionId, sessionIds), eq(t.fdEvent.type, 'knowledge_check_submitted')))
          .orderBy(asc(t.fdEvent.createdAt));
        // Latest attempt per (session, module) only — an early failure someone
        // has since fixed is not a standing team weakness.
        const latestAttempt = new Map<string, { moduleId: string; missed: string[] }>();
        for (const r of checkRows) {
          const p = JSON.parse(r.payloadJson ?? '{}') as { moduleId?: string; missed?: string[] };
          if (!p.moduleId || !r.sessionId) continue;
          latestAttempt.set(`${r.sessionId}:${p.moduleId}`, { moduleId: p.moduleId, missed: p.missed ?? [] });
        }
        const tally = new Map<string, { moduleId: string; questionId: string; n: number }>();
        for (const a of latestAttempt.values()) {
          for (const qid of a.missed) {
            const key = `${a.moduleId}:${qid}`;
            tally.set(key, { moduleId: a.moduleId, questionId: qid, n: (tally.get(key)?.n ?? 0) + 1 });
          }
        }
        const top = [...tally.values()].filter((x) => x.n >= 2).sort((a, b) => b.n - a.n).slice(0, 5);
        if (top.length) {
          const exercises = await db.select().from(t.fdExercise).where(eq(t.fdExercise.kind, 'knowledge_check'));
          weakSpots = top
            .map((x) => {
              const payload = exercises.find((ex) => ex.moduleId === x.moduleId);
              const q = payload
                ? (JSON.parse(payload.payloadJson) as { questions: { id: string; prompt: string }[] }).questions.find((qq) => qq.id === x.questionId)
                : undefined;
              return q ? { moduleTitle: titleOf(x.moduleId), prompt: q.prompt, missedBy: x.n } : null;
            })
            .filter((x): x is NonNullable<typeof x> => !!x);
        }
      }
      aggregate = {
        size: reports.length,
        started: linked.length,
        completedAny: team.filter((m) => m.modulesCleared > 0).length,
        weakSpots,
        orgStarted,
        orgSize: orgEmployees.length,
      };
    }

    const guidanceRows = await db
      .select()
      .from(t.fdBrandGuidance)
      .where(and(eq(t.fdBrandGuidance.brandSlug, c.env.BRAND_SLUG), eq(t.fdBrandGuidance.scope, `team:${email}`)))
      .limit(1);

    // The manager's own progress — leaders going first is the strongest
    // predictor of a team following, so it is stated rather than implied.
    const selfSession = byEmail.get(email);
    const selfCleared = selfSession ? (await clearedBySession(db, [selfSession.sessionId])).get(selfSession.sessionId)?.size ?? 0 : 0;

    return {
      isManager: true,
      managerEmail: email,
      team,
      aggregate,
      teamGuidance: guidanceRows[0]?.body ?? null,
      selfCleared,
      selfTotal: modulesTotal,
    };
  }
}

export function createManagerApp(deps: { requireSession: (c: never) => SessionRow | null }) {
  type Ctx = { Bindings: ManagerEnv; Variables: { db: DrizzleD1Database; session: SessionRow | null } };
  const app = new Hono<Ctx>();
  void deps;

  // Resolves the caller to a manager and their roster rows, or null. Every
  // mutating route below goes through this — there is no other way in.
  async function requireManager(c: { get: (k: 'db' | 'session') => never; env: ManagerEnv }) {
    const db = c.get('db') as unknown as DrizzleD1Database;
    const session = c.get('session') as unknown as SessionRow | null;
    const email = await accountEmailFor(db, session);
    if (!email) return null;
    const reports = await db
      .select()
      .from(t.fdEmployee)
      .where(and(eq(t.fdEmployee.brandSlug, c.env.BRAND_SLUG), sql`LOWER(${t.fdEmployee.managerEmail}) = ${email}`))
      .orderBy(asc(t.fdEmployee.name));
    return reports.length ? { db, session: session!, email, reports } : null;
  }

  app.get('/', async (c) => {
    const db = c.get('db') as unknown as DrizzleD1Database;
    const view = await teamStatusFor(db, c.env.BRAND_SLUG, c.get('session') as unknown as SessionRow | null);
    if (view) return c.json(view);
    const empty: ManagerResponse = {
      isManager: false,
      managerEmail: await accountEmailFor(db, c.get('session') as unknown as SessionRow | null),
      team: [],
      aggregate: null,
      teamGuidance: null,
      selfCleared: 0,
      selfTotal: 0,
    };
    return c.json(empty);
  });


  // Recognition, endorsement, and a dated push — one shape, three kinds. Each
  // writes a row the learner's own path screen reads, and emails the report
  // when a provider is configured (recorded as 'skipped' when not).
  app.post('/action', async (c) => {
    const ctx = await requireManager(c as never);
    if (!ctx) return c.json({ error: 'No team on the roster for this account.' }, 403);
    const { db, email, reports } = ctx;
    const body = await c.req.json<{ employeeId?: string; kind?: string; moduleId?: string; dueDate?: string; body?: string }>().catch(() => null);
    const kind = body?.kind ?? '';
    if (!['kudos', 'endorse', 'deadline'].includes(kind)) return c.json({ error: 'Unknown action.' }, 400);
    const employee = reports.find((e) => e.id === body?.employeeId);
    if (!employee) return c.json({ error: 'Not one of your reports.' }, 403);
    const text = body?.body?.trim();
    if (!text) return c.json({ error: 'Write the note.' }, 400);
    if (kind === 'deadline' && !body?.dueDate) return c.json({ error: 'A date is required.' }, 400);
    if (kind === 'endorse' && !body?.moduleId) return c.json({ error: 'Pick a module.' }, 400);

    await db.insert(t.fdManagerAction).values({
      id: uuid(),
      brandSlug: c.env.BRAND_SLUG,
      managerEmail: email,
      employeeId: employee.id,
      kind,
      moduleId: kind === 'endorse' ? (body?.moduleId ?? null) : null,
      dueDate: kind === 'deadline' ? (body?.dueDate ?? null) : null,
      body: text.slice(0, 2000),
      createdAt: now(),
    });

    const to = deliverableAddress(employee.email);
    if (to) {
      const brandRows = await db.select().from(t.fdBrand).where(eq(t.fdBrand.slug, c.env.BRAND_SLUG)).limit(1);
      const subject =
        kind === 'kudos' ? 'A note from your manager' : kind === 'endorse' ? 'Your manager flagged a module' : 'A date for your AI fluency course';
      const origin = new URL(c.req.url).origin;
      const result = await sendEmail(c.env, { to, subject, text: `${text}\n\n${origin}/path${signature(brandRows[0]?.name ?? 'Your company', origin)}` });
      await db.insert(t.fdEmailSend).values({
        id: uuid(),
        brandSlug: c.env.BRAND_SLUG,
        kind,
        toEmail: to,
        subject,
        body: text,
        status: result.status,
        provider: result.provider,
        error: result.error,
        createdAt: now(),
      });
    }
    return c.json({ ok: true, delivered: !!to && emailEnabled(c.env) });
  });

  // Team context that steers the AI. Rides into the tutor and podcast prompts
  // exactly like the company-wide guidance already does — same table, a
  // team-scoped row — so a learner's tutor knows what their team is up to.
  app.post('/guidance', async (c) => {
    const ctx = await requireManager(c as never);
    if (!ctx) return c.json({ error: 'No team on the roster for this account.' }, 403);
    const { db, email } = ctx;
    const body = await c.req.json<{ body?: string }>().catch(() => null);
    const text = (body?.body ?? '').trim().slice(0, 4000);
    const scope = `team:${email}`;
    const existing = await db
      .select()
      .from(t.fdBrandGuidance)
      .where(and(eq(t.fdBrandGuidance.brandSlug, c.env.BRAND_SLUG), eq(t.fdBrandGuidance.scope, scope)))
      .limit(1);
    if (existing[0]) {
      await db.update(t.fdBrandGuidance).set({ body: text, updatedAt: now() }).where(eq(t.fdBrandGuidance.id, existing[0].id));
    } else if (text) {
      await db.insert(t.fdBrandGuidance).values({ id: uuid(), brandSlug: c.env.BRAND_SLUG, scope, body: text, updatedAt: now() });
    }
    return c.json({ ok: true });
  });

  // The manager's half of the commitment: acknowledging a report's stated
  // finish-by, and saying what they'll do to protect the time.
  app.post('/commitment/:id/ack', async (c) => {
    const ctx = await requireManager(c as never);
    if (!ctx) return c.json({ error: 'No team on the roster for this account.' }, 403);
    const { db, reports } = ctx;
    const rows = await db.select().from(t.fdCommitment).where(eq(t.fdCommitment.id, c.req.param('id'))).limit(1);
    const commitment = rows[0];
    if (!commitment || commitment.sharedWithManager !== 1) return c.json({ error: 'No such commitment.' }, 404);
    // The commitment must belong to a session owned by one of this manager's reports.
    const byEmail = await sessionsByEmail(db);
    const ownerEmail = [...byEmail.entries()].find(([, s]) => s.sessionId === commitment.sessionId)?.[0];
    const isMine = reports.some((e) => e.email && e.email.toLowerCase() === ownerEmail);
    if (!isMine) return c.json({ error: 'Not one of your reports.' }, 403);
    const body = await c.req.json<{ note?: string }>().catch(() => null);
    await db
      .update(t.fdCommitment)
      .set({ managerAckAt: now(), managerNote: (body?.note ?? '').trim().slice(0, 1000) || null })
      .where(eq(t.fdCommitment.id, commitment.id));
    return c.json({ ok: true });
  });

  // A written review on a report's submission. Lands on the same fd_review
  // rows the operator desk writes, distinguished by reviewer — so the learner
  // sees one feedback stream, not two systems.
  app.post('/review', async (c) => {
    const ctx = await requireManager(c as never);
    if (!ctx) return c.json({ error: 'No team on the roster for this account.' }, 403);
    const { db, email, reports } = ctx;
    const body = await c.req.json<{ submissionId?: string; body?: string; score?: number }>().catch(() => null);
    const text = body?.body?.trim();
    if (!text) return c.json({ error: 'Write the review.' }, 400);
    const subRows = await db.select().from(t.fdSubmission).where(eq(t.fdSubmission.id, body?.submissionId ?? '')).limit(1);
    const submission = subRows[0];
    if (!submission) return c.json({ error: 'No such submission.' }, 404);
    // Same consent gate as reading: a manager may only review work whose owner
    // is one of their reports and who opted into sharing it.
    const byEmail = await sessionsByEmail(db);
    const ownerEmail = [...byEmail.entries()].find(([, s]) => s.sessionId === submission.sessionId)?.[0];
    if (!reports.some((e) => e.email && e.email.toLowerCase() === ownerEmail)) return c.json({ error: 'Not one of your reports.' }, 403);
    const prefRows = await db
      .select()
      .from(t.fdPreference)
      .where(and(eq(t.fdPreference.sessionId, submission.sessionId), eq(t.fdPreference.key, 'shareWork')))
      .orderBy(desc(t.fdPreference.createdAt))
      .limit(1);
    if (!prefRows[0] || JSON.parse(prefRows[0].valueJson) !== true) return c.json({ error: 'This learner has not shared their work.' }, 403);
    await db.insert(t.fdReview).values({
      id: uuid(),
      submissionId: submission.id,
      reviewer: `manager:${email}`,
      body: text.slice(0, 4000),
      score: Number.isInteger(body?.score) ? (body?.score ?? null) : null,
      createdAt: now(),
    });
    return c.json({ ok: true });
  });

  return app;
}

// ---------- the learner's side ----------

// Their stated finish-by date, and who it would go to. The manager is read from
// the census, so the learner is never asked to type their boss's address.
export async function commitmentFor(
  db: DrizzleD1Database,
  brandSlug: string,
  session: SessionRow,
): Promise<CommitmentResponse> {
  const rows = await db
    .select()
    .from(t.fdCommitment)
    .where(eq(t.fdCommitment.sessionId, session.id))
    .orderBy(desc(t.fdCommitment.createdAt))
    .limit(1);
  const email = await accountEmailFor(db, session);
  let managerName: string | null = null;
  let canShare = false;
  if (email) {
    const emp = await db
      .select()
      .from(t.fdEmployee)
      .where(and(eq(t.fdEmployee.brandSlug, brandSlug), sql`LOWER(${t.fdEmployee.email}) = ${email}`))
      .limit(1);
    managerName = emp[0]?.managerName ?? null;
    canShare = !!deliverableAddress(emp[0]?.managerEmail);
  }
  const c0 = rows[0];
  return {
    commitment: c0
      ? {
          id: c0.id,
          courseId: c0.courseId,
          targetDate: c0.targetDate,
          note: c0.note,
          sharedWithManager: c0.sharedWithManager === 1,
          managerAckAt: c0.managerAckAt,
          managerNote: c0.managerNote,
        }
      : null,
    managerName,
    canShare,
  };
}

// This learner's own manager, lowercased — the key team-scoped guidance is
// stored under. Null for anonymous sessions and anyone the roster doesn't know.
export async function managerEmailOf(db: DrizzleD1Database, brandSlug: string, session: SessionRow): Promise<string | null> {
  const email = await accountEmailFor(db, session);
  if (!email) return null;
  const rows = await db
    .select({ managerEmail: t.fdEmployee.managerEmail })
    .from(t.fdEmployee)
    .where(and(eq(t.fdEmployee.brandSlug, brandSlug), sql`LOWER(${t.fdEmployee.email}) = ${email}`))
    .limit(1);
  return rows[0]?.managerEmail?.toLowerCase() ?? null;
}

// managerEmailOf for callers holding only a session id. The podcast pipeline
// works from stored rows and background jobs rather than the request's session,
// so it has an id and no row.
export async function managerEmailForSessionId(
  db: DrizzleD1Database,
  brandSlug: string,
  sessionId: string,
): Promise<string | null> {
  const rows = await db.select().from(t.fdSession).where(eq(t.fdSession.id, sessionId)).limit(1);
  return rows[0] ? managerEmailOf(db, brandSlug, rows[0]) : null;
}

// Whether this account has anyone reporting to it. Cheap enough to answer on
// every path load, and it decides whether the manager door is shown at all.
export async function hasReports(db: DrizzleD1Database, brandSlug: string, session: SessionRow): Promise<boolean> {
  const email = await accountEmailFor(db, session);
  if (!email) return false;
  const rows = await db
    .select({ id: t.fdEmployee.id })
    .from(t.fdEmployee)
    .where(and(eq(t.fdEmployee.brandSlug, brandSlug), sql`LOWER(${t.fdEmployee.managerEmail}) = ${email}`))
    .limit(1);
  return rows.length > 0;
}

// What a manager has aimed at this learner — endorsements, kudos, and dates —
// for their own path screen. Read by employee id resolved from their account.
export async function managerSignalsFor(
  db: DrizzleD1Database,
  brandSlug: string,
  session: SessionRow,
): Promise<ManagerSignal[]> {
  const email = await accountEmailFor(db, session);
  if (!email) return [];
  const emp = await db
    .select()
    .from(t.fdEmployee)
    .where(and(eq(t.fdEmployee.brandSlug, brandSlug), sql`LOWER(${t.fdEmployee.email}) = ${email}`))
    .limit(1);
  if (!emp[0]) return [];
  const rows = await db
    .select()
    .from(t.fdManagerAction)
    .where(eq(t.fdManagerAction.employeeId, emp[0].id))
    .orderBy(desc(t.fdManagerAction.createdAt))
    .limit(10);
  return rows.map((a) => ({
    id: a.id,
    kind: a.kind as ManagerSignal['kind'],
    moduleId: a.moduleId,
    dueDate: a.dueDate,
    body: a.body,
    managerName: emp[0].managerName,
    createdAt: a.createdAt,
  }));
}
