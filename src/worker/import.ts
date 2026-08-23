// Course import: the delivery-side half of the Chief Learning Officer's
// publish step.
//
// CLO owns authoring — intake, outline, the standards audit, content
// packages, evidence. It does not own delivery. The only thing that crosses
// between the two is a Course Package (CPF): a versioned JSON bundle whose
// shape is deliberately close to what content/modules/<id>/*.json already
// holds, so this file is a mapping rather than a second content model.
//
// CPF                          →  here
//   module                     →  fd_module
//   module.blocks              →  fd_content_block (module_id = <id>)
//   module.micro               →  fd_content_block (module_id = <id>-micro)
//   module.activity            →  fd_content_block (module_id = <id>-activity)
//   module.knowledgeCheck      →  fd_exercise kind=knowledge_check
//   module.rubric              →  fd_exercise kind=rubric
//   module.exercise            →  fd_exercise kind=sorting | choice
//
// Everything written here carries source='import'. The seed carries
// source='seed'. Neither may delete the other's rows — see
// drizzle/0020_content_source.sql for why that matters.

import { and, eq, inArray } from 'drizzle-orm';
import { type DrizzleD1Database, drizzle } from 'drizzle-orm/d1';
import { Hono } from 'hono';
import * as t from '../db/schema';
import { constantTimeEqual } from './crypto';

const enc = new TextEncoder();

/** Bearer check. constantTimeEqual compares bytes, so encode first. */
function bearerOk(header: string | undefined, expected: string): boolean {
  const token = (header ?? '').match(/^Bearer\s+(.+)$/i)?.[1]?.trim() ?? '';
  if (!token) return false;
  const a = enc.encode(token);
  const b = enc.encode(expected);
  // Length inequality is not secret — the comparison below requires equal
  // lengths, and a length oracle on a 256-bit random token is not a weakness.
  if (a.length !== b.length) return false;
  return constantTimeEqual(a, b);
}

export interface ImportEnv {
  DB: D1Database;
  // Bearer token the authoring agent presents. Unset = the import surface is
  // closed, which is the correct default: an unauthenticated route that
  // rewrites course content is worse than no route.
  IMPORT_API_KEY?: string;
}

type Ctx = { Bindings: ImportEnv; Variables: { db: DrizzleD1Database } };

// ── CPF shapes. Only the fields delivery actually renders. ─────────────────

interface CpfBlock {
  id: string;
  ordinal: number;
  kind: string;
  layer: string;
  reviewedAt: string;
  body: string;
  dependsOn?: string[];
}

interface CpfModule {
  id: string;
  ordinal: number;
  title: string;
  blurb?: string | null;
  estMinutes?: number | null;
  prereqs?: string[];
  blocks?: CpfBlock[];
  micro?: CpfBlock[];
  activity?: CpfBlock[];
  knowledgeCheck?: unknown;
  rubric?: unknown;
  exercise?: { kind: string; payload: unknown } | null;
  conceptMap?: { flow: string; whatToSee: string } | null;
  tutorNotes?: string | null;
}

interface CpfBundle {
  cpf?: string;
  course?: { id?: string; slug?: string; title?: string; format?: string };
  modules?: CpfModule[];
  meta?: { bundleHash?: string };
}

const today = () => new Date().toISOString().slice(0, 10);
const nowIso = () => new Date().toISOString();

/**
 * Structural validation. Deliberately strict about the two things that
 * produce a silent dead end for a learner rather than a visible error: a
 * module with no body, and a knowledge-check key pointing outside its own
 * options (which would mark every learner wrong, forever, with no symptom
 * except a pass rate of zero).
 */
function validate(bundle: CpfBundle): string[] {
  const errors: string[] = [];
  const courseId = bundle.course?.id ?? bundle.course?.slug;

  if (!bundle.cpf) errors.push('missing cpf version');
  if (!courseId) errors.push('missing course.id');
  if (!bundle.meta?.bundleHash) errors.push('missing meta.bundleHash');

  const modules = bundle.modules ?? [];
  if (modules.length === 0) errors.push('bundle contains no modules');

  const seen = new Set<string>();
  for (const m of modules) {
    if (!m.id) {
      errors.push('a module has no id');
      continue;
    }
    if (seen.has(m.id)) errors.push(`duplicate module id: ${m.id}`);
    seen.add(m.id);

    if (!m.title) errors.push(`${m.id}: no title`);
    if (!m.blocks || m.blocks.length === 0) errors.push(`${m.id}: no body content`);

    const check = m.knowledgeCheck as { questions?: Array<{ id?: string; options?: unknown[]; correctIndex?: number }> } | undefined;
    for (const q of check?.questions ?? []) {
      const optionCount = Array.isArray(q.options) ? q.options.length : 0;
      const idx = q.correctIndex ?? -1;
      if (idx < 0 || idx >= optionCount) {
        errors.push(`${m.id}/${q.id ?? '?'}: correctIndex ${idx} is outside its ${optionCount} options`);
      }
    }
  }

  // A prereq naming a module outside this bundle renders as a permanently
  // locked card with no way to unlock it.
  for (const m of modules) {
    for (const p of m.prereqs ?? []) {
      if (!seen.has(p)) errors.push(`${m.id}: prereq "${p}" is not in this bundle`);
    }
  }

  return errors;
}

export function createImportApp() {
  const app = new Hono<Ctx>();

  app.use('*', async (c, next) => {
    c.set('db', drizzle(c.env.DB));
    await next();
  });

  // Bearer gate. Separate from the admin passcode cookie on purpose: this is
  // a machine caller, and it should not be able to reach anything else the
  // operator console can.
  app.use('*', async (c, next) => {
    const expected = c.env.IMPORT_API_KEY ?? '';
    if (!expected) {
      return c.json({ error: 'Import is not configured on this deployment (IMPORT_API_KEY unset).' }, 503);
    }
    if (!bearerOk(c.req.header('authorization'), expected)) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    await next();
  });

  /**
   * What is installed. The authoring side diffs against this before sending
   * a bundle, so a re-publish of unchanged content costs one GET instead of
   * a full round trip.
   */
  app.get('/manifest', async (c) => {
    const rows = await c.get('db').select().from(t.fdImportedCourse).all();
    return c.json({
      courses: rows.map((r) => ({
        id: r.courseId,
        bundleHash: r.bundleHash,
        title: r.title,
        format: r.format,
        moduleCount: r.moduleCount,
        importedAt: r.importedAt,
      })),
    });
  });

  /**
   * Accept a Course Package.
   *
   * Idempotent on (courseId, bundleHash): re-sending what is already
   * installed is a no-op that reports itself as one, so a publish loop that
   * retries cannot churn content.
   */
  app.post('/course', async (c) => {
    const db = c.get('db');

    let bundle: CpfBundle;
    try {
      bundle = (await c.req.json()) as CpfBundle;
    } catch {
      return c.json({ error: 'Body is not valid JSON.' }, 400);
    }

    const errors = validate(bundle);
    if (errors.length) return c.json({ error: 'Bundle failed validation.', errors }, 422);

    const courseId = (bundle.course?.id ?? bundle.course?.slug) as string;
    const bundleHash = bundle.meta?.bundleHash as string;
    const modules = bundle.modules ?? [];
    const moduleIds = modules.map((m) => m.id);

    // Refuse to write into a course the seed owns. Without this a course
    // published under the id "ai101" would overwrite the real AI 101, and
    // the only symptom would be learners finding different content than
    // yesterday.
    const collisions = await db
      .select({ id: t.fdModule.id })
      .from(t.fdModule)
      .where(and(eq(t.fdModule.courseId, courseId), eq(t.fdModule.source, 'seed')))
      .all();
    if (collisions.length) {
      return c.json(
        {
          error: `Course "${courseId}" already exists as hand-authored content and will not be overwritten by an import.`,
          seededModules: collisions.map((r) => r.id),
        },
        409,
      );
    }

    // Same check one level down: a module id can collide even when the
    // course id does not.
    if (moduleIds.length) {
      const takenModules = await db
        .select({ id: t.fdModule.id, courseId: t.fdModule.courseId })
        .from(t.fdModule)
        .where(and(inArray(t.fdModule.id, moduleIds), eq(t.fdModule.source, 'seed')))
        .all();
      if (takenModules.length) {
        return c.json(
          {
            error: 'One or more module ids are already used by hand-authored content.',
            conflicts: takenModules,
          },
          409,
        );
      }
    }

    const existing = await db
      .select()
      .from(t.fdImportedCourse)
      .where(eq(t.fdImportedCourse.courseId, courseId))
      .get();

    if (existing?.bundleHash === bundleHash) {
      return c.json({
        status: 'unchanged',
        courseId,
        bundleHash,
        moduleCount: existing.moduleCount,
      });
    }

    // Every module id this course owns, including the ones being retired by
    // this publish — the previous import's rows are removed wholesale rather
    // than merged, so a module deleted upstream disappears here too.
    const previous = await db
      .select({ id: t.fdModule.id })
      .from(t.fdModule)
      .where(and(eq(t.fdModule.courseId, courseId), eq(t.fdModule.source, 'import')))
      .all();

    const ownedModuleIds = [...new Set([...previous.map((r) => r.id), ...moduleIds])];
    // Every module_id this course's blocks can live under. Missing one here
    // leaks a row on every re-publish: the tutor-notes slot was absent from
    // this list at first, and each publish left the previous module's notes
    // behind with nothing pointing at them.
    const BLOCK_SLOTS = ['', '-micro', '-activity', '-tutor'];
    const ownedBlockOwners = ownedModuleIds.flatMap((id) => BLOCK_SLOTS.map((s) => `${id}${s}`));

    const statements: D1PreparedStatement[] = [];
    const raw = c.env.DB;

    if (ownedBlockOwners.length) {
      const marks = ownedBlockOwners.map(() => '?').join(',');
      statements.push(
        raw
          .prepare(`DELETE FROM fd_content_block WHERE source = 'import' AND module_id IN (${marks})`)
          .bind(...ownedBlockOwners),
      );
    }
    if (ownedModuleIds.length) {
      const marks = ownedModuleIds.map(() => '?').join(',');
      statements.push(
        raw.prepare(`DELETE FROM fd_exercise WHERE source = 'import' AND module_id IN (${marks})`).bind(...ownedModuleIds),
      );
      statements.push(
        raw.prepare(`DELETE FROM fd_module WHERE source = 'import' AND id IN (${marks})`).bind(...ownedModuleIds),
      );
    }

    const blockStmt = raw.prepare(
      `INSERT INTO fd_content_block (id, module_id, ordinal, kind, layer, body, depends_on, reviewed_at, variant, source)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NULL, 'import')`,
    );
    const exerciseStmt = raw.prepare(
      `INSERT INTO fd_exercise (id, module_id, kind, payload_json, reviewed_at, source)
       VALUES (?, ?, ?, ?, ?, 'import')`,
    );

    let blockCount = 0;
    let exerciseCount = 0;

    for (const m of modules) {
      statements.push(
        raw
          .prepare(
            `INSERT INTO fd_module (id, course_id, ordinal, title, blurb, status, est_minutes, prereq_json, source)
             VALUES (?, ?, ?, ?, ?, 'open', ?, ?, 'import')`,
          )
          .bind(
            m.id,
            courseId,
            m.ordinal,
            m.title,
            m.blurb ?? '',
            m.estMinutes ?? 20,
            m.prereqs?.length ? JSON.stringify(m.prereqs) : null,
          ),
      );

      for (const [slot, blocks] of [
        [m.id, m.blocks ?? []],
        [`${m.id}-micro`, m.micro ?? []],
        [`${m.id}-activity`, m.activity ?? []],
      ] as Array<[string, CpfBlock[]]>) {
        for (const b of blocks) {
          statements.push(
            blockStmt.bind(
              b.id,
              slot,
              b.ordinal,
              b.kind,
              b.layer,
              b.body,
              b.dependsOn?.length ? JSON.stringify(b.dependsOn) : null,
              b.reviewedAt || today(),
            ),
          );
          blockCount++;
        }
      }

      // The tutor reads these from the module's own content, so they ride in
      // as a block the learner UI does not render.
      if (m.tutorNotes) {
        statements.push(
          blockStmt.bind(
            `${m.id}-tutor-notes`,
            `${m.id}-tutor`,
            10,
            'prose',
            'stable',
            m.tutorNotes,
            null,
            today(),
          ),
        );
        blockCount++;
      }

      for (const [kind, payload] of [
        ['knowledge_check', m.knowledgeCheck],
        ['rubric', m.rubric],
        [m.exercise?.kind ?? '', m.exercise?.payload],
      ] as Array<[string, unknown]>) {
        if (!kind || payload == null) continue;
        statements.push(
          exerciseStmt.bind(`${m.id}-${kind}`, m.id, kind, JSON.stringify(payload), today()),
        );
        exerciseCount++;
      }
    }

    statements.push(
      raw
        .prepare(
          `INSERT INTO fd_imported_course (course_id, bundle_hash, cpf_version, title, format, module_count, imported_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT (course_id) DO UPDATE SET
             bundle_hash = excluded.bundle_hash, cpf_version = excluded.cpf_version,
             title = excluded.title, format = excluded.format,
             module_count = excluded.module_count, imported_at = excluded.imported_at`,
        )
        .bind(
          courseId,
          bundleHash,
          bundle.cpf ?? '1.0',
          bundle.course?.title ?? courseId,
          bundle.course?.format ?? 'course',
          modules.length,
          nowIso(),
        ),
    );

    // One batch: D1 runs it as a transaction, so a course is never half
    // written. A partial course is exactly the dead end the delete-then-
    // insert shape would otherwise risk.
    await raw.batch(statements);

    const retired = previous.map((r) => r.id).filter((id) => !moduleIds.includes(id));

    return c.json({
      status: existing ? 'updated' : 'created',
      courseId,
      bundleHash,
      applied: {
        modules: modules.length,
        blocks: blockCount,
        exercises: exerciseCount,
        retiredModules: retired,
      },
    });
  });

  return app;
}

// ── Reporting ──────────────────────────────────────────────────────────────

/**
 * What the authoring side needs to turn delivery signals into content
 * findings: a question everyone fails is a defect in the question, not in
 * the learners.
 *
 * Read-only and computed on demand. The numbers live here because the events
 * live here — copying them upstream would give two systems different answers
 * about who finished what.
 *
 * Sources, all real columns rather than derived guesses:
 *   starts / completions  fd_completion_audit.activity
 *   check attempts        fd_event type='knowledge_check_submitted'
 *   per-item correctness  that event's payload `missed` array of question ids
 *   rubric dimensions     fd_submission.rubric_json dimensions[].score
 */
export function createReportApp() {
  const app = new Hono<Ctx>();

  app.use('*', async (c, next) => {
    c.set('db', drizzle(c.env.DB));
    await next();
  });

  app.use('*', async (c, next) => {
    const expected = c.env.IMPORT_API_KEY ?? '';
    if (!expected) return c.json({ error: 'Reporting is not configured (IMPORT_API_KEY unset).' }, 503);
    if (!bearerOk(c.req.header('authorization'), expected)) return c.json({ error: 'Unauthorized' }, 401);
    await next();
  });

  app.get('/course/:courseId', async (c) => {
    const db = c.get('db');
    const courseId = c.req.param('courseId');
    const raw = c.env.DB;

    const modules = await db
      .select({ id: t.fdModule.id, title: t.fdModule.title })
      .from(t.fdModule)
      .where(eq(t.fdModule.courseId, courseId))
      .all();

    if (modules.length === 0) return c.json({ error: `No such course: ${courseId}` }, 404);

    const ids = modules.map((m) => m.id);
    const marks = ids.map(() => '?').join(',');

    // Distinct sessions, not raw rows: a learner who reopens a module five
    // times is one start, and counting rows would make every completion rate
    // look like a cliff.
    const audit = await raw
      .prepare(
        `SELECT module_id AS moduleId, activity, COUNT(DISTINCT session_id) AS n
           FROM fd_completion_audit WHERE module_id IN (${marks})
          GROUP BY module_id, activity`,
      )
      .bind(...ids)
      .all<{ moduleId: string; activity: string; n: number }>();

    const stats = new Map(
      ids.map((id) => [id, { starts: 0, completions: 0, checkAttempts: 0 }]),
    );
    for (const row of audit.results ?? []) {
      const e = stats.get(row.moduleId);
      if (!e) continue;
      if (row.activity === 'module_viewed') e.starts = row.n;
      if (row.activity === 'module_completed') e.completions = row.n;
    }

    // Knowledge-check attempts carry moduleId, correct, total and the ids the
    // learner missed, inside the event payload.
    const checks = await raw
      .prepare(
        `SELECT json_extract(payload_json, '$.moduleId') AS moduleId,
                json_extract(payload_json, '$.correct')  AS correct,
                json_extract(payload_json, '$.total')    AS total,
                json_extract(payload_json, '$.missed')   AS missed
           FROM fd_event
          WHERE type = 'knowledge_check_submitted'
            AND json_extract(payload_json, '$.moduleId') IN (${marks})`,
      )
      .bind(...ids)
      .all<{ moduleId: string; correct: number | null; total: number | null; missed: string | null }>();

    // attempts = how many times each module's check was taken.
    // missCount[q] = how many of those attempts got question q wrong.
    const attemptsBy = new Map<string, number>();
    const passesBy = new Map<string, number>();
    const missBy = new Map<string, Map<string, number>>();

    for (const row of checks.results ?? []) {
      if (!row.moduleId || !row.total) continue;
      attemptsBy.set(row.moduleId, (attemptsBy.get(row.moduleId) ?? 0) + 1);
      if ((row.correct ?? 0) / row.total >= 0.6) {
        passesBy.set(row.moduleId, (passesBy.get(row.moduleId) ?? 0) + 1);
      }
      let missed: string[] = [];
      try {
        const parsed = row.missed ? JSON.parse(row.missed) : [];
        if (Array.isArray(parsed)) missed = parsed.filter((x): x is string => typeof x === 'string');
      } catch {
        // A malformed payload drops that attempt's item detail, not the run.
      }
      const perQuestion = missBy.get(row.moduleId) ?? new Map<string, number>();
      for (const q of missed) perQuestion.set(q, (perQuestion.get(q) ?? 0) + 1);
      missBy.set(row.moduleId, perQuestion);
    }

    // Rubric dimension means, per module, from graded submissions.
    const submissions = await raw
      .prepare(
        `SELECT module_id AS moduleId, rubric_json AS rubricJson
           FROM fd_submission
          WHERE module_id IN (${marks}) AND rubric_json IS NOT NULL`,
      )
      .bind(...ids)
      .all<{ moduleId: string; rubricJson: string }>();

    const dimTotals = new Map<string, Map<string, { sum: number; n: number }>>();
    for (const row of submissions.results ?? []) {
      let dims: Array<{ name?: string; score?: number }> = [];
      try {
        dims = (JSON.parse(row.rubricJson).dimensions ?? []) as typeof dims;
      } catch {
        continue;
      }
      const perDim = dimTotals.get(row.moduleId) ?? new Map<string, { sum: number; n: number }>();
      for (const d of dims) {
        if (!d.name || typeof d.score !== 'number') continue;
        const acc = perDim.get(d.name) ?? { sum: 0, n: 0 };
        acc.sum += d.score;
        acc.n += 1;
        perDim.set(d.name, acc);
      }
      dimTotals.set(row.moduleId, perDim);
    }

    return c.json({
      courseId,
      enrolled: 0,
      modules: modules.map((m) => {
        const s = stats.get(m.id) ?? { starts: 0, completions: 0, checkAttempts: 0 };
        const attempts = attemptsBy.get(m.id) ?? 0;
        const passes = passesBy.get(m.id) ?? 0;
        const misses = missBy.get(m.id) ?? new Map<string, number>();

        const dimensionMeans: Record<string, number> = {};
        for (const [name, acc] of dimTotals.get(m.id) ?? []) {
          dimensionMeans[name] = acc.n ? acc.sum / acc.n : 0;
        }

        return {
          moduleId: m.id,
          title: m.title,
          starts: s.starts,
          completions: s.completions,
          checkAttempts: attempts,
          checkPassPct: attempts ? (passes / attempts) * 100 : null,
          // Time on module needs per-event timestamps paired into sessions,
          // which this endpoint does not do yet. Null rather than a guess:
          // an authoring finding built on a fabricated number is worse than
          // no finding.
          medianMinutes: null,
          items: [...misses.entries()].map(([questionId, missCount]) => ({
            questionId,
            attempts,
            correctPct: attempts ? ((attempts - missCount) / attempts) * 100 : 0,
          })),
          dimensionMeans,
        };
      }),
    });
  });

  return app;
}

export const __testables = { validate };
