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
import { constantTimeEqual, hashCode } from './crypto';
import { ROLE_IDS } from '../shared/roles';
import contentCatalog from '../../content/modules.json';
import diagnosticData from '../../content/diagnostic.json';

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
  // The deployment's default brand — what a provisioned client's brand clones
  // its look from when the caller sends no tokens of its own.
  BRAND_SLUG: string;
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
  // 'soon' is a module the course promises but has not built yet: it renders
  // as "Coming soon" in a learner's plan and carries no content. Omitted or
  // 'open' means the real thing.
  status?: 'open' | 'soon';
}

interface CpfBundle {
  cpf?: string;
  course?: { id?: string; slug?: string; title?: string; format?: string };
  modules?: CpfModule[];
  meta?: { bundleHash?: string };
}

const today = () => new Date().toISOString().slice(0, 10);
const nowIso = () => new Date().toISOString();
const uuid = () => crypto.randomUUID();

// ── Org provisioning shapes ────────────────────────────────────────────────

interface OrgRequest {
  brand?: {
    slug?: string;
    name?: string;
    tokens?: unknown;
    voice?: unknown;
    profile?: unknown;
    // Brand to copy tokens/voice from when none are sent. Defaults to the
    // deployment's brand, so a client starts in the house look and the
    // operator console restyles it later.
    cloneFrom?: string;
  };
  shortCourse?: {
    id?: string;
    label?: string;
    blurb?: string | null;
    roleId?: string | null;
    moduleIds?: unknown;
    diagnosticItems?: unknown;
  };
  accessCode?: { code?: string; label?: string };
  guidance?: { global?: string };
}

const SLUG_RE = /^[a-z0-9][a-z0-9-]{1,31}$/;
const DIAG_IDS = new Set((diagnosticData as { items: Array<{ id: string }> }).items.map((i) => i.id));

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
    if (m.status !== 'soon' && (!m.blocks || m.blocks.length === 0)) errors.push(`${m.id}: no body content`);

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
   * The whole library, whoever wrote it: every module the seed or an import
   * put here, with what each actually has (a body, which exercises), plus
   * the course shells and short courses. The authoring side reads this to
   * propose a client course out of existing material — a module with no body
   * is not something to promise a learner, so hasBlocks is reported rather
   * than assumed.
   */
  app.get('/library', async (c) => {
    const db = c.get('db');
    const [moduleRows, blockRows, exRows, imported, shortCourses] = await Promise.all([
      db.select().from(t.fdModule).all(),
      db.selectDistinct({ moduleId: t.fdContentBlock.moduleId }).from(t.fdContentBlock).all(),
      db.select({ moduleId: t.fdExercise.moduleId, kind: t.fdExercise.kind }).from(t.fdExercise).all(),
      db.select().from(t.fdImportedCourse).all(),
      db.select().from(t.fdShortCourse).all(),
    ]);
    const hasBlocks = new Set(blockRows.map((b) => b.moduleId));
    const exKinds = new Map<string, string[]>();
    for (const e of exRows) exKinds.set(e.moduleId, [...(exKinds.get(e.moduleId) ?? []), e.kind]);

    const catalogCourses = (contentCatalog as { courses: Array<{ id: string; title: string; level: string; blurb: string; status: string }> }).courses;
    return c.json({
      modules: moduleRows
        .sort((a, b) => a.courseId.localeCompare(b.courseId) || a.ordinal - b.ordinal)
        .map((m) => ({
          id: m.id,
          courseId: m.courseId,
          ordinal: m.ordinal,
          title: m.title,
          blurb: m.blurb,
          status: m.status,
          estMinutes: m.estMinutes,
          prereqs: m.prereqJson ? (JSON.parse(m.prereqJson) as string[]) : [],
          source: m.source,
          hasBlocks: hasBlocks.has(m.id),
          exercises: exKinds.get(m.id) ?? [],
        })),
      courses: [
        ...catalogCourses.map((course) => ({ id: course.id, title: course.title, level: course.level, blurb: course.blurb, status: course.status, source: 'seed' })),
        ...imported.map((r) => ({ id: r.courseId, title: r.title, level: r.format, blurb: '', status: 'open', source: 'import' })),
      ],
      shortCourses: shortCourses.map((sc) => ({
        id: sc.id,
        brandSlug: sc.brandSlug,
        label: sc.label,
        blurb: sc.blurb,
        roleId: sc.roleId,
        moduleIds: JSON.parse(sc.moduleIdsJson) as string[],
        source: sc.source,
      })),
    });
  });

  /**
   * Provision — or re-provision — one client on this deployment: their brand,
   * the short course that IS their course (an ordered list of module ids, any
   * tier, seeded or imported, built or still promised), the passcode that
   * opens it, and optional global guidance for the tutor and podcast.
   *
   * Everything written carries source='import', so the seed never touches it
   * and a seeded brand or short course can never be overwritten from here.
   * Module ids need not exist yet — the course is usually provisioned before
   * its new modules are published — so unknown ids are reported, not refused.
   *
   * The passcode is optional on purpose: the first call sets it, and a later
   * call that only reorders the course sends none and leaves it alone.
   */
  app.put('/org', async (c) => {
    const db = c.get('db');
    let body: OrgRequest;
    try {
      body = (await c.req.json()) as OrgRequest;
    } catch {
      return c.json({ error: 'Body is not valid JSON.' }, 400);
    }

    const slug = body.brand?.slug?.trim() ?? '';
    const name = body.brand?.name?.trim() ?? '';
    const sc = body.shortCourse ?? {};
    const scId = sc.id?.trim() ?? '';
    const label = sc.label?.trim() ?? '';
    const moduleIds = Array.isArray(sc.moduleIds) ? sc.moduleIds.filter((x): x is string => typeof x === 'string' && x.trim() !== '') : null;
    const roleId = sc.roleId?.trim() || null;
    const code = body.accessCode?.code?.trim() ?? '';
    const codeLabel = body.accessCode?.label?.trim() ?? '';

    const errors: string[] = [];
    if (!SLUG_RE.test(slug)) errors.push('brand.slug must be 2–32 chars of a-z, 0-9 and hyphens');
    if (!name) errors.push('brand.name is required');
    if (!scId) errors.push('shortCourse.id is required');
    if (!label) errors.push('shortCourse.label is required');
    if (!moduleIds || moduleIds.length === 0) errors.push('shortCourse.moduleIds must be a non-empty array');
    if (roleId && !ROLE_IDS.includes(roleId)) errors.push(`shortCourse.roleId "${roleId}" is not a known role (${ROLE_IDS.join(', ')})`);
    if (body.accessCode && (code.length < 12 || !codeLabel)) {
      errors.push('accessCode needs a code of at least 12 characters and a label');
    }
    if (errors.length) return c.json({ error: 'Invalid org request.', errors }, 422);

    // The seed owns its rows. A client slug colliding with a seeded brand, or
    // a short-course id colliding with a seeded one, is refused outright — the
    // alternative is a client quietly hijacking the house demo.
    const [brandRow, scRow] = await Promise.all([
      db.select().from(t.fdBrand).where(eq(t.fdBrand.slug, slug)).get(),
      db.select().from(t.fdShortCourse).where(eq(t.fdShortCourse.id, scId)).get(),
    ]);
    if (brandRow && brandRow.source !== 'import') {
      return c.json({ error: `Brand "${slug}" is hand-authored seed content and will not be overwritten.` }, 409);
    }
    if (scRow && scRow.source !== 'import') {
      return c.json({ error: `Short course "${scId}" is hand-authored seed content and will not be overwritten.` }, 409);
    }
    if (scRow && scRow.brandSlug !== slug) {
      return c.json({ error: `Short course "${scId}" belongs to brand "${scRow.brandSlug}".` }, 409);
    }

    // Tokens and voice: what was sent, else what the brand already has, else
    // a clone of the deployment's brand. The columns are NOT NULL — a brand
    // with no look would blank every page.
    let tokensJson = body.brand?.tokens ? JSON.stringify(body.brand.tokens) : (brandRow?.tokensJson ?? null);
    let voiceJson = body.brand?.voice ? JSON.stringify(body.brand.voice) : (brandRow?.voiceJson ?? null);
    if (!tokensJson || !voiceJson) {
      const cloneFrom = body.brand?.cloneFrom?.trim() || c.env.BRAND_SLUG;
      const source = await db.select().from(t.fdBrand).where(eq(t.fdBrand.slug, cloneFrom)).get();
      if (!source) return c.json({ error: `No brand "${cloneFrom}" to clone the look from.` }, 422);
      tokensJson ??= source.tokensJson;
      voiceJson ??= source.voiceJson;
    }
    const profileJson = body.brand?.profile ? JSON.stringify(body.brand.profile) : (brandRow?.profileJson ?? null);

    const knownIds = (moduleIds ?? []).length
      ? new Set((await db.select({ id: t.fdModule.id }).from(t.fdModule).where(inArray(t.fdModule.id, moduleIds ?? [])).all()).map((r) => r.id))
      : new Set<string>();
    const unknownModuleIds = (moduleIds ?? []).filter((id) => !knownIds.has(id));

    const diagnosticItems = Array.isArray(sc.diagnosticItems)
      ? sc.diagnosticItems.filter((x): x is string => typeof x === 'string' && DIAG_IDS.has(x))
      : [];

    const raw = c.env.DB;
    const ts = nowIso();
    const statements: D1PreparedStatement[] = [
      raw
        .prepare(
          `INSERT INTO fd_brand (slug, name, tokens_json, voice_json, profile_json, created_at, source)
           VALUES (?, ?, ?, ?, ?, ?, 'import')
           ON CONFLICT (slug) DO UPDATE SET
             name = excluded.name, tokens_json = excluded.tokens_json,
             voice_json = excluded.voice_json, profile_json = excluded.profile_json`,
        )
        .bind(slug, name, tokensJson, voiceJson, profileJson, ts),
      raw
        .prepare(
          `INSERT INTO fd_short_course (id, brand_slug, label, blurb, role_id, module_ids_json, diagnostic_json, created_at, source)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'import')
           ON CONFLICT (id) DO UPDATE SET
             label = excluded.label, blurb = excluded.blurb, role_id = excluded.role_id,
             module_ids_json = excluded.module_ids_json, diagnostic_json = excluded.diagnostic_json`,
        )
        .bind(
          scId,
          slug,
          label,
          sc.blurb?.trim() || null,
          roleId,
          JSON.stringify(moduleIds),
          diagnosticItems.length ? JSON.stringify({ items: diagnosticItems }) : null,
          today(),
        ),
    ];

    if (body.accessCode) {
      // One code per (brand, label): re-sending replaces it, so a leaked code
      // can be rotated by provisioning again with a new one.
      statements.push(
        raw.prepare(`DELETE FROM fd_access_code WHERE source = 'import' AND brand_slug = ? AND label = ?`).bind(slug, codeLabel),
        raw
          .prepare(
            `INSERT INTO fd_access_code (id, brand_slug, code_hash, label, max_uses, uses, expires_at, active, short_course_id, source)
             VALUES (?, ?, ?, ?, NULL, 0, NULL, 1, ?, 'import')`,
          )
          .bind(uuid(), slug, await hashCode(code), codeLabel.slice(0, 120), scId),
      );
    }

    if (typeof body.guidance?.global === 'string') {
      statements.push(raw.prepare(`DELETE FROM fd_brand_guidance WHERE brand_slug = ? AND scope = 'global'`).bind(slug));
      const text = body.guidance.global.trim().slice(0, 8000);
      if (text) {
        statements.push(
          raw
            .prepare(`INSERT INTO fd_brand_guidance (id, brand_slug, scope, body, updated_at) VALUES (?, ?, 'global', ?, ?)`)
            .bind(uuid(), slug, text, ts),
        );
      }
    }

    await raw.batch(statements);

    const origin = new URL(c.req.url).origin;
    return c.json({
      status: brandRow ? 'updated' : 'created',
      brandSlug: slug,
      shortCourseId: scId,
      enterUrl: `${origin}/enter`,
      adminUrl: `${origin}/admin`,
      unknownModuleIds,
    });
  });

  /**
   * What a client has, read back without secrets: the brand, the course with
   * each module's live status (built, promised, missing), the codes by label
   * with their use counts, and how many learners have come through.
   */
  app.get('/org/:slug', async (c) => {
    const db = c.get('db');
    const slug = c.req.param('slug');
    const brand = await db.select().from(t.fdBrand).where(eq(t.fdBrand.slug, slug)).get();
    if (!brand) return c.json({ error: `No brand "${slug}".` }, 404);

    const [shortCourses, codes] = await Promise.all([
      db.select().from(t.fdShortCourse).where(eq(t.fdShortCourse.brandSlug, slug)).all(),
      db.select().from(t.fdAccessCode).where(eq(t.fdAccessCode.brandSlug, slug)).all(),
    ]);
    const ids = [...new Set(shortCourses.flatMap((sc) => JSON.parse(sc.moduleIdsJson) as string[]))];
    const [moduleRows, blockRows] = ids.length
      ? await Promise.all([
          db.select().from(t.fdModule).where(inArray(t.fdModule.id, ids)).all(),
          db.selectDistinct({ moduleId: t.fdContentBlock.moduleId }).from(t.fdContentBlock).where(inArray(t.fdContentBlock.moduleId, ids)).all(),
        ])
      : [[], []];
    const byId = new Map(moduleRows.map((m) => [m.id, m]));
    const hasBlocks = new Set(blockRows.map((b) => b.moduleId));

    const raw = c.env.DB;
    const learners = await raw
      .prepare(`SELECT COUNT(*) AS n FROM fd_session WHERE brand_slug = ?`)
      .bind(slug)
      .first<{ n: number }>();
    const completions = await raw
      .prepare(
        `SELECT COUNT(DISTINCT a.session_id || ':' || a.module_id) AS n
           FROM fd_completion_audit a JOIN fd_session s ON s.id = a.session_id
          WHERE s.brand_slug = ? AND a.activity = 'module_completed'`,
      )
      .bind(slug)
      .first<{ n: number }>();

    return c.json({
      brand: { slug: brand.slug, name: brand.name, source: brand.source, createdAt: brand.createdAt },
      shortCourses: shortCourses.map((sc) => ({
        id: sc.id,
        label: sc.label,
        blurb: sc.blurb,
        roleId: sc.roleId,
        source: sc.source,
        modules: (JSON.parse(sc.moduleIdsJson) as string[]).map((id) => {
          const m = byId.get(id);
          return m
            ? { id, title: m.title, status: m.status, source: m.source, hasBlocks: hasBlocks.has(id), estMinutes: m.estMinutes }
            : { id, title: null, status: 'missing', source: null, hasBlocks: false, estMinutes: null };
        }),
      })),
      codes: codes.map((k) => ({ id: k.id, label: k.label, uses: k.uses, active: k.active === 1, shortCourseId: k.shortCourseId, source: k.source })),
      learners: learners?.n ?? 0,
      completions: completions?.n ?? 0,
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
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'import')`,
          )
          .bind(
            m.id,
            courseId,
            m.ordinal,
            m.title,
            m.blurb ?? '',
            m.status === 'soon' ? 'soon' : 'open',
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
