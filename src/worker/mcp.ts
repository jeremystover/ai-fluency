// The course as an MCP server. Mounted at /api/mcp, spoken over stateless
// streamable HTTP (JSON-RPC in a POST body, JSON back) so Claude, ChatGPT,
// and Claude Code can connect with nothing but a URL. Auth is a personal
// signed key in the URL path (minted per session at /api/mcp/connection),
// so progress made inside an assistant and progress made in the app are the
// same record: both write the same funnel events, the same knowledge-check
// scores, the same completion audit.
//
// Design rules, inherited from the app:
// - Content is data: tools read fd_content_block / fd_exercise, so a newly
//   seeded module is fully teachable over MCP with zero code changes.
// - Keys stay server-side: the knowledge check ships questions only; grading
//   and answer keys come back only after a committed submission.
// - Completion is earned: complete_module verifies the pass server-side and
//   writes the same append-only events + content-snapshot audit as the app.
import { Hono, type Context } from 'hono';
import type { DrizzleD1Database } from 'drizzle-orm/d1';
import { and, asc, desc, eq, sql } from 'drizzle-orm';
import * as t from '../db/schema';
import { verifyMcpKey } from './crypto';
import { CORS_HEADERS, verifyAccessToken, wwwAuthenticate } from './oauth';
import { moduleSnapshot, witnessContent } from './audit';
import { getExercise, scoreSortingSubmission, selectVariants, toBlock, toolingOf, type KnowledgeCheckPayload, type SortingPayload } from './content';
import { gradeSubmission, type RubricPayload } from './grading';
import { GOAL_CHOICES } from '../shared/goals';
import diagnosticData from '../../content/diagnostic.json';
import contentCatalog from '../../content/modules.json';
import { PODCAST_HOSTS, type CalibrationTrail, type ContentBlock, type CourseCard, type DiagnosticResult, type GradeResult, type IntakePrefs, type PodcastLine, type PodcastVisual, type PriorStage } from '../shared/types';
import type { Env } from './index';

type SessionRow = typeof t.fdSession.$inferSelect;
type ModuleRow = typeof t.fdModule.$inferSelect;
type PodcastRow = typeof t.fdPodcast.$inferSelect;
type McpCtx = { Bindings: Env; Variables: { session: SessionRow | null; db: DrizzleD1Database } };

// Functions that live in index.ts (and are entangled with the rest of the API)
// are injected at mount time rather than re-implemented here. submitActivity
// and askTheHosts are the extracted cores of the app's own endpoints, so both
// surfaces share one set of gates, limits, and audit writes.
export type McpDeps = {
  loadPrefs: (db: DrizzleD1Database, sessionId: string) => Promise<IntakePrefs>;
  computeDiagnosticResult: (db: DrizzleD1Database, sessionId: string) => Promise<DiagnosticResult>;
  pregenerateNextPodcast: (env: Env, sessionId: string) => Promise<void>;
  trailFor: (db: DrizzleD1Database, sessionId: string) => Promise<CalibrationTrail>;
  priorStagesFor: (db: DrizzleD1Database, sessionId: string, moduleId: string) => Promise<PriorStage[]>;
  openingPredictionFor: (db: DrizzleD1Database, sessionId: string, moduleId: string) => Promise<string | null>;
  submitActivity: (
    env: Env,
    db: DrizzleD1Database,
    sessionId: string,
    moduleId: string,
    rawText: string | undefined,
    calibrationValues: Record<string, number> | undefined,
  ) => Promise<{ ok: false; status: number; error: string } | { ok: true; result: GradeResult }>;
  askTheHosts: (
    env: Env,
    db: DrizzleD1Database,
    sessionId: string,
    moduleId: string,
    rawQuestion: string | undefined,
    trigger: 'manual' | 'mcp',
    waitUntil: (p: Promise<unknown>) => void,
  ) => Promise<{ ok: false; status: number; error: string } | { ok: true; row: PodcastRow }>;
  // Company-admin steering from the Brand tab — rides into every teaching
  // surface, this one included.
  guidanceFor: (db: DrizzleD1Database, env: Env, moduleId: string, courseId: string | null) => Promise<{ text: string; updatedAt: string } | null>;
};

const TEACH_BACK_LIMIT_PER_HOUR = 5; // grading calls, mirroring the activity grader's budget

const now = () => new Date().toISOString();
const uuid = () => crypto.randomUUID();

const PROTOCOL_VERSIONS = ['2025-06-18', '2025-03-26', '2024-11-05'];
const SERVER_INFO = { name: 'ai-fluency-course', title: 'AI Fluency Course', version: '1.0.0' };

// The persona that makes a connected assistant feel like the course's tutor
// instead of a chat with a filing cabinet. Same voice contract as the in-app
// tutor (chat.ts), adapted to tool-use.
const INSTRUCTIONS = `You are connected to an AI-fluency course. When the learner engages with it, you are not a search box over course files — you are their tutor for this material: direct, warm, concrete. Plain verbs, no praise inflation, never "Great question!". When the learner is wrong, say so plainly and explain why — being corrected clearly is a kindness.

How to run a session:
- Ground everything in real course content: call get_module before teaching a module, get_course_overview before summarizing where the learner stands. Never teach this course from memory.
- Personalize: tools return the learner's name, role, goals, and progress. Use their name, fit examples to their role, and connect ideas to their stated objective.
- Teach in lecturettes of 100–200 words, one idea at a time — never dump a module in one message. After teaching an idea, usually ask ONE question that requires applying it, not reciting it. React to what the learner actually writes.
- If the learner brings a real task from their own work, use it as the teaching example — that is the best possible material.
- Quizzing: get_knowledge_check gives you questions WITHOUT answers (keys stay server-side). Run it one question at a time; the learner commits a choice before any discussion of correctness; you learn the key only from submit_knowledge_check. Never present your own guess as the official answer.
- Completion is earned, not claimed: only a successful complete_module call records a module as done, and it verifies the knowledge-check pass server-side. Never tell a learner a module is complete unless that call succeeded.
- Your unfair advantage over the course app: the learner's real work is in this conversation. When they mention an actual task, document, or decision, offer apply_to_my_work — working the module's frameworks on their live material beats any canned example.
- Predictions before lessons: when a module has opening prediction fields (get_module says so), ask for the learner's honest numbers BEFORE teaching and save them with record_prediction. The course closes these loops later — a recorded prediction is a gift to their future self; never skip it to save time, and never suggest a "safe" number.
- Retention: after teaching, offer a teach-back — the learner explains the ideas in their own words, submit_teach_back grades it honestly. Frame it as the fastest way to find gaps, not a test.
- The scenario challenge (get_scenario_challenge / submit_scenario) is a game: stage each situation as a live workplace moment and play it straight — the learner commits every call before the reveal, and some placements are deliberately arguable, so treat the reveal's reasoning as the point, not the score.
- Applied activities (get_activity / submit_activity) are the real graded work: coach drafting, but the submission must be the learner's own thinking — you may sharpen structure and ask hard questions, never write their answer. Submissions land on the same record the human review desk reads.
- ask_the_hosts sends a question to Maya and Leo, the course's podcast hosts — offer it when a learner wants a different voice on something, and hand over the transcript plus the listen link it returns.
- End tutoring replies by offering two or three labeled next moves (e.g. "keep going · quiz me · try it on something from my week"). Let the learner steer.
- Celebrate real milestones in one warm, specific sentence — then point at what's next.
- Off-course requests: help briefly if quick, then steer back to the session.`;

// ---------- shared lookups ----------

type Progress = {
  completed: Set<string>; // module_completed recorded (app or MCP — same event)
  checkScores: Map<string, { correct: number; total: number }>; // best score per module
  testedOutM1: boolean;
};

const checkPassed = (p: Progress, moduleId: string): boolean => {
  const s = p.checkScores.get(moduleId);
  return !!s && s.total > 0 && s.correct / s.total >= 0.6;
};

const prereqSatisfied = (p: Progress, id: string): boolean =>
  p.completed.has(id) || checkPassed(p, id) || (id === 'ai101-m1' && p.testedOutM1);

// Mirrors /api/path's completion semantics: module_completed events count,
// knowledge checks clear prerequisites at 60%+, and acing the diagnostic
// (at most one knowledge miss) tests out of 101-M1.
async function progressFor(db: DrizzleD1Database, sessionId: string): Promise<Progress> {
  const rows = await db
    .select()
    .from(t.fdEvent)
    .where(and(eq(t.fdEvent.sessionId, sessionId), sql`${t.fdEvent.type} IN ('module_completed', 'knowledge_check_submitted')`));
  const completed = new Set<string>();
  const checkScores = new Map<string, { correct: number; total: number }>();
  for (const e of rows) {
    if (!e.payloadJson) continue;
    const p = JSON.parse(e.payloadJson) as { moduleId?: string; correct?: number; total?: number };
    if (typeof p.moduleId !== 'string') continue;
    if (e.type === 'module_completed') completed.add(p.moduleId);
    else if (p.total) {
      const best = checkScores.get(p.moduleId);
      if (!best || (p.correct ?? 0) / p.total > best.correct / best.total) {
        checkScores.set(p.moduleId, { correct: p.correct ?? 0, total: p.total });
      }
    }
  }
  const kResponses = await db
    .select()
    .from(t.fdDiagnosticResponse)
    .where(and(eq(t.fdDiagnosticResponse.sessionId, sessionId), sql`${t.fdDiagnosticResponse.correct} IS NOT NULL`));
  const kTotal = (diagnosticData.items as { kind: string }[]).filter((i) => i.kind === 'knowledge').length;
  const kCorrect = kResponses.filter((r) => r.correct === 1).length;
  return { completed, checkScores, testedOutM1: kResponses.length >= kTotal && kCorrect >= kTotal - 1 };
}

type Learner = { name: string | null; role: string | null; goals: string[]; objective: string | null; prefs: IntakePrefs };

async function learnerFor(db: DrizzleD1Database, deps: McpDeps, sessionId: string): Promise<Learner> {
  const participants = await db
    .select()
    .from(t.fdParticipant)
    .where(eq(t.fdParticipant.sessionId, sessionId))
    .orderBy(desc(t.fdParticipant.createdAt))
    .limit(1);
  const prefs = await deps.loadPrefs(db, sessionId);
  const goals = GOAL_CHOICES.filter((g) => (prefs.goals ?? []).includes(g.id)).map((g) => g.label);
  return {
    name: participants[0]?.displayName ?? null,
    role: participants[0]?.roleLabel ?? null,
    goals,
    objective: prefs.objective ?? null,
    prefs,
  };
}

async function logEvent(db: DrizzleD1Database, sessionId: string, type: string, payload?: unknown) {
  await db.insert(t.fdEvent).values({
    id: uuid(),
    sessionId,
    type,
    payloadJson: payload === undefined ? null : JSON.stringify(payload),
    createdAt: now(),
  });
}

// A user-facing tool failure: message becomes isError content, so the
// assistant can explain and route around it instead of stalling.
class ToolError extends Error {}

async function requireOpenModule(db: DrizzleD1Database, moduleId: string): Promise<ModuleRow> {
  const rows = await db.select().from(t.fdModule).where(eq(t.fdModule.id, moduleId)).limit(1);
  const mod = rows[0];
  if (!mod) throw new ToolError(`No module "${moduleId}". Call get_course_overview for valid module ids (like ai101-m1 or ai201-m3).`);
  if (mod.status !== 'open') throw new ToolError(`"${mod.title}" ships in the full course — this deployment carries it as a locked preview. Call get_course_overview for what's open.`);
  return mod;
}

// Same exercise-block projection the tutor chat uses: JSON payloads become a
// one-line description the assistant can reference, not re-run.
function blockToText(block: ContentBlock): string {
  if (block.kind === 'exercise') {
    try {
      const p = JSON.parse(block.body) as { title?: string; intro?: string; blurb?: string };
      return `[Interactive exercise in the app: "${p.title ?? 'Exercise'}" — ${p.intro ?? p.blurb ?? ''}]`;
    } catch {
      return '[Interactive exercise in the app]';
    }
  }
  const volatile = block.layer === 'volatile' ? `\n\n*[Example layer — current as of ${block.reviewedAt}.]*` : '';
  return block.body + volatile;
}

// The podcast study sketch, rendered as text an assistant can redraw or
// narrate. Shapes and fields mirror shared/types.ts PodcastVisual.
function visualToText(v: PodcastVisual): string {
  const lines: string[] = [`**${v.title}**`];
  const shape = v.shape ?? 'hub';
  if (shape === 'flow' && v.steps?.length) {
    const steps = v.steps;
    lines.push('Flow: ' + steps.map((s, i) => (i === steps.length - 1 ? s.label : `${s.label} ${s.arrow ? `—(${s.arrow})→` : '→'}`)).join(' '));
  } else if (shape === 'ladder' && v.rungs?.length) {
    lines.push('Ladder (bottom → top):');
    v.rungs.forEach((r, i) => lines.push(`${i + 1}. ${r.label}${r.note ? ` — ${r.note}` : ''}`));
  } else if (shape === 'quad' && v.axes) {
    lines.push(`2×2 — x: ${v.axes.xLow} → ${v.axes.xHigh}; y: ${v.axes.yLow} → ${v.axes.yHigh}`);
    (v.quadrants ?? []).forEach((q, i) => lines.push(`- ${['top-left', 'top-right', 'bottom-left', 'bottom-right'][i]}: ${q}${v.star === i ? ' ★ (aim here)' : ''}`));
  } else if (shape === 'venn' && v.circles?.length === 2) {
    lines.push(`Venn: "${v.circles[0].label}" ∩ "${v.circles[1].label}" = ${v.overlap ?? 'the point'}`);
  } else if (v.hub) {
    lines.push(`Hub: ${v.hub}`);
    (v.spokes ?? []).forEach((s) => lines.push(`- ${s.relation} → ${s.label}`));
    (v.links ?? []).forEach((l) => {
      const from = v.spokes?.[l.from]?.label;
      const to = v.spokes?.[l.to]?.label;
      if (from && to) lines.push(`- (${from} —${l.label}→ ${to})`);
    });
  }
  if (v.insight) lines.push(`*What to see: ${v.insight}*`);
  return lines.join('\n');
}

function moduleLinks(origin: string, moduleId: string): string {
  return [
    `- Read it in the course app: ${origin}/module/${moduleId}`,
    `- **Fluent**, the two-host podcast episode of this module, personalized to the learner: ${origin}/module/${moduleId}/podcast`,
    `- Interactive knowledge check: ${origin}/module/${moduleId}/check`,
    `- Applied activity with AI grading: ${origin}/module/${moduleId}/activity`,
  ].join('\n');
}

const statusIcon = (p: Progress, m: ModuleRow): string =>
  p.completed.has(m.id) ? '✅ completed'
  : checkPassed(p, m.id) ? '🟡 check passed (not yet completed)'
  : m.id === 'ai101-m1' && p.testedOutM1 ? '🟡 tested out via diagnostic'
  : m.status === 'open' ? '⬜ open'
  : '🔒 full course';

// ---------- recommendations ----------

type Recommendation = { moduleId: string; title: string; estMinutes: number; reasons: string[] };

// Rank open, uncompleted modules by how many legible reasons point at them —
// stated in terms of the learner's own inputs (goals, diagnostic), same as
// the path screen. Course order breaks ties; unmet prereqs push a module down
// but never hide it (nothing locks). Exported: /api/path's "up next" queue is
// this exact ranking — one brain, two surfaces.
export type RecommendDeps = Pick<McpDeps, 'loadPrefs' | 'computeDiagnosticResult'>;
export async function recommendationsFor(db: DrizzleD1Database, deps: RecommendDeps, sessionId: string): Promise<Recommendation[]> {
  const rows = await db.select().from(t.fdModule).orderBy(asc(t.fdModule.courseId), asc(t.fdModule.ordinal));
  const progress = await progressFor(db, sessionId);
  const prefs = await deps.loadPrefs(db, sessionId);
  const selectedGoals = GOAL_CHOICES.filter((g) => (prefs.goals ?? []).includes(g.id));

  const diagReasons = new Map<string, string>();
  const diagDone = await db
    .select({ n: sql<number>`count(*)` })
    .from(t.fdEvent)
    .where(and(eq(t.fdEvent.sessionId, sessionId), eq(t.fdEvent.type, 'diagnostic_completed')));
  if ((diagDone[0]?.n ?? 0) > 0) {
    const diag = await deps.computeDiagnosticResult(db, sessionId);
    const dir = diag.calibration.direction;
    if (dir === 'over' || dir === 'mixed') diagReasons.set('ai101-m6', 'your diagnostic: you expect too much from these tools');
    if (dir === 'under' || dir === 'mixed') diagReasons.set('ai101-m5', 'your diagnostic: you expect too little from these tools');
  }

  const titleOf = (id: string) => rows.find((m) => m.id === id)?.title ?? id;
  const candidates = rows.filter((m) => m.status === 'open' && !progress.completed.has(m.id));
  const firstInOrder = candidates.find((m) => {
    const prereqs: string[] = m.prereqJson ? JSON.parse(m.prereqJson) : [];
    return prereqs.every((p) => prereqSatisfied(progress, p));
  });

  const scored = candidates.map((m, order) => {
    const prereqs: string[] = m.prereqJson ? JSON.parse(m.prereqJson) : [];
    const unmet = prereqs.filter((p) => !prereqSatisfied(progress, p));
    const reasons: string[] = [];
    if (m.id === firstInOrder?.id) reasons.push('next in course order');
    for (const g of selectedGoals) if (g.modules.includes(m.id)) reasons.push(`your goal: ${g.label}`);
    const d = diagReasons.get(m.id);
    if (d) reasons.push(d);
    if (checkPassed(progress, m.id)) reasons.push('check already passed — a session away from completion');
    if (unmet.length) reasons.push(`best after ${unmet.map(titleOf).join(' and ')} (advisory — nothing locks)`);
    const score = reasons.length * 2 - unmet.length * 3 - order * 0.01;
    return { moduleId: m.id, title: m.title, estMinutes: m.estMinutes, reasons, score };
  });
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ score: _score, ...r }) => r);
}

// ---------- tools ----------

type ToolCtx = {
  db: DrizzleD1Database;
  env: Env;
  session: SessionRow;
  origin: string;
  waitUntil: (p: Promise<unknown>) => void;
  deps: McpDeps;
};

type ToolDef = {
  name: string;
  title: string;
  description: string;
  inputSchema: Record<string, unknown>;
  readOnly: boolean;
  handler: (args: Record<string, unknown>, ctx: ToolCtx) => Promise<string>;
};

const moduleIdProp = {
  type: 'string',
  description: 'Module id from the course overview, e.g. "ai101-m1" or "ai201-m3".',
};

const TOOLS: ToolDef[] = [
  {
    name: 'get_course_overview',
    title: 'Course overview & progress',
    description:
      "The full table of contents — every course and module with status, time estimates, and this learner's live progress (completions, knowledge-check passes) — plus who the learner is (name, role, goals, objective). Start here in any new conversation.",
    inputSchema: { type: 'object', properties: {} },
    readOnly: true,
    handler: async (_args, ctx) => {
      const { db, deps, session } = ctx;
      const rows = await db.select().from(t.fdModule).orderBy(asc(t.fdModule.courseId), asc(t.fdModule.ordinal));
      const progress = await progressFor(db, session.id);
      const learner = await learnerFor(db, deps, session.id);
      const courses = (contentCatalog as { courses: CourseCard[] }).courses;

      const open = rows.filter((m) => m.status === 'open');
      const doneCount = open.filter((m) => progress.completed.has(m.id)).length;

      const out: string[] = ['# AI Fluency — course overview', ''];
      const who: string[] = [];
      if (learner.name) who.push(`**Learner:** ${learner.name}${learner.role ? ` (${learner.role})` : ''}`);
      if (learner.goals.length) who.push(`**Goals:** ${learner.goals.join(' · ')}`);
      if (learner.objective) who.push(`**In their own words:** "${learner.objective}"`);
      if (who.length) out.push(who.join('  \n'), '');
      out.push(`**Progress:** ${doneCount} of ${open.length} open modules completed.`, '');

      // Honest momentum: real activity from the funnel, never invented streaks.
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const dayRows = await db
        .select({ day: sql<string>`DISTINCT substr(${t.fdEvent.createdAt}, 1, 10)` })
        .from(t.fdEvent)
        .where(and(eq(t.fdEvent.sessionId, session.id), sql`${t.fdEvent.createdAt} > ${weekAgo}`));
      const lastOpened = await db
        .select({ payloadJson: t.fdEvent.payloadJson })
        .from(t.fdEvent)
        .where(and(eq(t.fdEvent.sessionId, session.id), eq(t.fdEvent.type, 'module_opened')))
        .orderBy(desc(t.fdEvent.createdAt))
        .limit(1);
      const lastId = lastOpened[0]?.payloadJson ? (JSON.parse(lastOpened[0].payloadJson) as { moduleId?: string }).moduleId : undefined;
      const lastTitle = lastId ? rows.find((m) => m.id === lastId)?.title : undefined;
      const trail = await deps.trailFor(db, session.id);
      const closed = trail.points.filter((p) => p.actual !== null).length;
      const momentum: string[] = [`active ${dayRows.length} of the last 7 days`];
      if (lastTitle) momentum.push(`last worked on: ${lastTitle}`);
      if (progress.checkScores.size) momentum.push(`knowledge checks attempted: ${progress.checkScores.size}`);
      if (trail.points.length) momentum.push(`predictions on record: ${trail.points.length}${closed ? ` (${closed} closed — the reckoning is real)` : ''}`);
      if (trail.sorts.length) momentum.push(`scenario/sorting rounds: ${trail.sorts.length}`);
      out.push(`**Momentum:** ${momentum.join(' · ')}.`, '');

      for (const course of courses) {
        const mods = rows.filter((m) => m.courseId === course.id);
        out.push(`## ${course.title} (${course.level})`);
        out.push(`*${course.blurb}*`, '');
        if (!mods.length) {
          out.push('_Locked — ships later. The blurb above is the honest preview._', '');
          continue;
        }
        for (const m of mods) {
          const prereqs: string[] = m.prereqJson ? JSON.parse(m.prereqJson) : [];
          const unmet = prereqs.filter((p) => !prereqSatisfied(progress, p));
          const score = progress.checkScores.get(m.id);
          const bits = [`~${m.estMinutes} min`, statusIcon(progress, m)];
          if (score) bits.push(`best check: ${score.correct}/${score.total}`);
          if (unmet.length) bits.push(`best after ${unmet.join(', ')}`);
          out.push(`${m.ordinal}. **${m.title}** \`${m.id}\` — ${bits.join(' · ')}`);
          out.push(`   ${m.blurb}`);
        }
        out.push('');
      }
      out.push('---');
      out.push(
        'Next moves: `recommend_next` for ranked suggestions with reasons · `get_module` to start teaching one · `get_knowledge_check` to quiz. Completion bar per module: 60%+ on its knowledge check, then `complete_module`.',
      );
      return out.join('\n');
    },
  },
  {
    name: 'get_module',
    title: 'Get module content for teaching',
    description:
      "A module's full teaching package: learning objectives, the complete reading content, key takeaways, a concept map, links to the in-app podcast episode and interactive materials, and guidance on how to tutor it for this learner. Call this before teaching a module.",
    inputSchema: {
      type: 'object',
      properties: {
        moduleId: moduleIdProp,
        view: {
          type: 'string',
          enum: ['full', 'summary'],
          description: '"full" (default) is the whole module; "summary" is the two-minute cut plus takeaways — right for a recap or a time-boxed session.',
        },
      },
      required: ['moduleId'],
    },
    readOnly: false, // records the view in the funnel + completion audit
    handler: async (args, ctx) => {
      const { db, env, deps, session, origin } = ctx;
      const moduleId = String(args.moduleId ?? '');
      const view = args.view === 'summary' ? 'summary' : 'full';
      const mod = await requireOpenModule(db, moduleId);
      const tooling = toolingOf(env);

      const sourceId = view === 'summary' ? `${moduleId}-micro` : moduleId;
      let blockRows = await db.select().from(t.fdContentBlock).where(eq(t.fdContentBlock.moduleId, sourceId)).orderBy(asc(t.fdContentBlock.ordinal));
      let served = sourceId;
      if (!blockRows.length && view === 'summary') {
        blockRows = await db.select().from(t.fdContentBlock).where(eq(t.fdContentBlock.moduleId, moduleId)).orderBy(asc(t.fdContentBlock.ordinal));
        served = moduleId;
      }
      if (!blockRows.length) throw new ToolError(`"${mod.title}" has no content seeded yet.`);
      const blocks = selectVariants(blockRows, tooling).map(toBlock);

      // Same witness the app writes on a module read — completing over MCP
      // later points at exactly this version.
      await witnessContent(db, {
        sessionId: session.id,
        moduleId: served,
        activity: served.endsWith('-micro') ? 'micro_viewed' : 'module_viewed',
        kind: 'module_blocks',
        content: moduleSnapshot(tooling, blocks),
        dedupe: true,
      });
      await logEvent(db, session.id, 'module_opened', { moduleId, modality: 'mcp', view });

      const stock = await db
        .select()
        .from(t.fdPodcastStock)
        .where(and(eq(t.fdPodcastStock.moduleId, moduleId), eq(t.fdPodcastStock.variant, 'generic')))
        .orderBy(desc(t.fdPodcastStock.bakedAt))
        .limit(1);
      const takeaways: string[] | null = stock[0]?.takeawaysJson ? JSON.parse(stock[0].takeawaysJson) : null;
      const visual: PodcastVisual | null = stock[0]?.visualJson ? JSON.parse(stock[0].visualJson) : null;

      const kc = await getExercise<KnowledgeCheckPayload>(db, moduleId, 'knowledge_check');
      const rubric = await getExercise<RubricPayload>(db, moduleId, 'rubric');
      const sorting = await getExercise<SortingPayload>(db, moduleId, 'sorting');
      const learner = await learnerFor(db, deps, session.id);
      const progress = await progressFor(db, session.id);

      const out: string[] = [
        `# ${mod.title} \`${mod.id}\``,
        `Module ${mod.ordinal} · ~${mod.estMinutes} min · ${statusIcon(progress, mod)}`,
        `> ${mod.blurb}`,
        '',
        view === 'summary' ? '## The two-minute cut' : '## Module content',
        '',
        blocks.map(blockToText).join('\n\n---\n\n'),
        '',
      ];
      if (takeaways?.length) {
        out.push('## Key takeaways', '', ...takeaways.map((k) => `- ${k}`), '');
      }
      if (visual) {
        out.push('## Concept map', '', visualToText(visual), '', '(Feel free to redraw this for the learner — as a list, a diagram, or in their own examples.)', '');
      }
      const guidance = await deps.guidanceFor(db, env, moduleId, mod.courseId);
      if (guidance) {
        out.push('## Company guidance', '', "The sponsoring company's admin asked that the following be emphasized and reinforced when teaching this material. Weave it in where it fits naturally; it complements the module content, never replaces it.", '', guidance.text, '');
      }
      out.push('## Beyond this chat', '', moduleLinks(origin, moduleId), '');
      out.push('## How to tutor this (for the assistant — not for pasting to the learner)');
      const coach: string[] = [];
      coach.push(`- Learner: ${learner.name ?? 'name unknown'}${learner.role ? `, ${learner.role}` : ''}${learner.goals.length ? ` — goals: ${learner.goals.join(', ')}` : ''}.${learner.objective ? ` Their stated objective: "${learner.objective}".` : ''}`);
      coach.push('- Teach one idea at a time in 100–200 word lecturettes; after each, ask one applied question. Offer ways in: guided walkthrough, quiz-first, or applying it to their own work.');
      if (kc) {
        const score = progress.checkScores.get(moduleId);
        coach.push(
          `- Completion bar: pass the ${kc.questions.length}-question knowledge check at 60%+ (get_knowledge_check → submit_knowledge_check), then call complete_module.${score ? ` Best so far: ${score.correct}/${score.total}.` : ''} Retakes are free.`,
        );
      } else {
        coach.push('- This module has no knowledge check; when the learner has worked the material with you, call complete_module to record it.');
      }
      if (rubric?.opening?.length) {
        const calRows = await db
          .select({ context: t.fdCalibration.context })
          .from(t.fdCalibration)
          .where(and(eq(t.fdCalibration.sessionId, session.id), sql`${t.fdCalibration.context} LIKE ${`${moduleId}:cal:%`}`));
        const recorded = new Set(calRows.map((r) => r.context.split(':cal:')[1]));
        const missing = rubric.opening.filter((f) => !recorded.has(f.key));
        if (missing.length) {
          coach.push(
            `- BEFORE teaching: ask for the learner's honest predictions and save them with record_prediction — ${missing.map((f) => `"${f.label}" (key: ${f.key})`).join('; ')}. The module closes these loops later; a skipped prediction is a lost reckoning.`,
          );
        } else {
          coach.push('- Opening predictions are already on record for this module — the activity will close the loop.');
        }
      }
      if (sorting) coach.push(`- This module has a ${sorting.tasks.length}-scenario challenge (get_scenario_challenge) — a strong mid-session change of pace, staged as live workplace moments.`);
      if (rubric) coach.push('- The graded applied activity (get_activity → submit_activity) is where this module becomes real work product; a human review desk reads submissions too.');
      coach.push('- If the learner mentions a real task from their week, offer apply_to_my_work on it — live material beats every canned example.');
      if (view === 'summary') coach.push('- This was the summary view — call get_module with view "full" before teaching in depth.');
      out.push(...coach);
      return out.join('\n');
    },
  },
  {
    name: 'get_knowledge_check',
    title: 'Fetch a knowledge check (questions only)',
    description:
      "A module's knowledge check for you to administer conversationally: questions and options WITHOUT answer keys (those stay server-side). Present one question at a time; the learner commits a choice before any discussion of correctness; submit all answers at the end with submit_knowledge_check.",
    inputSchema: { type: 'object', properties: { moduleId: moduleIdProp }, required: ['moduleId'] },
    readOnly: true,
    handler: async (args, ctx) => {
      const { db, session } = ctx;
      const moduleId = String(args.moduleId ?? '');
      const mod = await requireOpenModule(db, moduleId);
      const kc = await getExercise<KnowledgeCheckPayload>(db, moduleId, 'knowledge_check');
      if (!kc) throw new ToolError(`"${mod.title}" has no knowledge check — completion there is by working the material, then complete_module.`);
      await logEvent(db, session.id, 'knowledge_check_started', { moduleId, via: 'mcp' });

      const out: string[] = [
        `# ${kc.title} — ${mod.title}`,
        kc.note ? `*${kc.note}*` : '',
        '',
        '## How to run this (for the assistant)',
        '- One question at a time, in order. Label options A–D for the learner.',
        '- The learner commits an answer before you discuss it. No hints unless asked; if they ask, guide their reasoning, never reveal what you think the answer is — you do not have the key.',
        '- Collect every answer, then call submit_knowledge_check once with all of them as 0-based option indexes (A=0, B=1, …). The key and explanations come back with the grade.',
        `- Pass bar: 60%. Retakes are free and unlimited.`,
        '',
        '## Questions',
      ];
      kc.questions.forEach((q, i) => {
        out.push('', `### ${i + 1}. (\`${q.id}\`) ${q.prompt}`);
        q.options.forEach((opt, j) => out.push(`- ${'ABCDEFGH'[j]}. ${opt}`));
      });
      return out.join('\n');
    },
  },
  {
    name: 'submit_knowledge_check',
    title: 'Submit knowledge-check answers for grading',
    description:
      "Grade the learner's committed answers server-side against the module's answer key. Returns the score, per-question verdicts with explanations, and whether the pass bar (60%) was met. Records the attempt to the learner's shared course progress — the same record the app shows.",
    inputSchema: {
      type: 'object',
      properties: {
        moduleId: moduleIdProp,
        answers: {
          type: 'object',
          description: 'Question id → chosen option index (0-based: A=0, B=1, …), e.g. {"q1": 0, "q2": 2}.',
          additionalProperties: { type: 'integer' },
        },
      },
      required: ['moduleId', 'answers'],
    },
    readOnly: false,
    handler: async (args, ctx) => {
      const { db, session } = ctx;
      const moduleId = String(args.moduleId ?? '');
      const mod = await requireOpenModule(db, moduleId);
      const kc = await getExercise<KnowledgeCheckPayload>(db, moduleId, 'knowledge_check');
      if (!kc) throw new ToolError(`"${mod.title}" has no knowledge check.`);
      const answers = (args.answers ?? {}) as Record<string, unknown>;

      let correct = 0;
      const lines: string[] = [];
      const missedStudy: string[] = [];
      kc.questions.forEach((q, i) => {
        const chosen = Number(answers[q.id]);
        const ok = Number.isInteger(chosen) && chosen === q.correctIndex;
        if (ok) correct++;
        const chosenLabel = Number.isInteger(chosen) && q.options[chosen] ? `${'ABCDEFGH'[chosen]}. ${q.options[chosen]}` : '(no answer)';
        lines.push(
          `${i + 1}. ${ok ? '✓' : '✗'} \`${q.id}\` — answered ${chosenLabel}${ok ? '' : `; correct: ${'ABCDEFGH'[q.correctIndex]}. ${q.options[q.correctIndex]}`}`,
        );
        lines.push(`   ${q.explanation}`);
        if (!ok && q.study) missedStudy.push(q.study.label);
      });
      const total = kc.questions.length;
      const passed = total > 0 && correct / total >= 0.6;

      // Same event + audit the in-app check writes — this attempt counts
      // everywhere, including prerequisite gates on the path screen.
      await logEvent(db, session.id, 'knowledge_check_submitted', { moduleId, correct, total, via: 'mcp' });
      await witnessContent(db, {
        sessionId: session.id,
        moduleId,
        activity: 'knowledge_check_submitted',
        kind: 'exercise',
        content: { kind: 'knowledge_check', payload: kc },
      });

      const out: string[] = [
        `# Graded: ${correct}/${total} — ${passed ? 'passed (60% bar met)' : 'not yet (60% to pass; retakes free)'}`,
        '',
        ...lines,
        '',
      ];
      if (passed) {
        out.push(
          `**Next:** walk the learner through anything missed, celebrate in one specific sentence, then call \`complete_module\` for \`${moduleId}\` to record it.`,
        );
      } else {
        out.push(
          `**Next:** review the missed ideas${missedStudy.length ? ` (module sections worth revisiting: ${[...new Set(missedStudy)].join(' · ')})` : ''}, reteach briefly, and offer a free retake.`,
        );
      }
      return out.join('\n');
    },
  },
  {
    name: 'complete_module',
    title: 'Record a module completion',
    description:
      'Record that the learner completed a module. Server-verified: the learner must have engaged with the module content, and for modules with a knowledge check, passed it at 60%+. Writes the same completion record and content-version audit as the app. Call it only after a real session — completion is earned, not claimed.',
    inputSchema: { type: 'object', properties: { moduleId: moduleIdProp }, required: ['moduleId'] },
    readOnly: false,
    handler: async (args, ctx) => {
      const { db, env, deps, session, origin, waitUntil } = ctx;
      const moduleId = String(args.moduleId ?? '');
      const mod = await requireOpenModule(db, moduleId);
      const progress = await progressFor(db, session.id);

      if (progress.completed.has(moduleId)) {
        const recs = await recommendationsFor(db, deps, session.id);
        return `"${mod.title}" is already recorded as completed — nothing to redo. ${recs.length ? `Worth pointing at next: ${recs.map((r) => `${r.title} (\`${r.moduleId}\`)`).join(' · ')}.` : ''}`;
      }

      // Engagement gate: some witnessed exposure to the content — a read here
      // or in the app, the micro, or a podcast listen. Keeps "completed"
      // meaning something without dictating the modality.
      const seen = await db
        .select({ id: t.fdCompletionAudit.id })
        .from(t.fdCompletionAudit)
        .where(
          and(
            eq(t.fdCompletionAudit.sessionId, session.id),
            sql`${t.fdCompletionAudit.moduleId} IN (${moduleId}, ${`${moduleId}-micro`})`,
            sql`${t.fdCompletionAudit.activity} IN ('module_viewed', 'micro_viewed', 'podcast_listened')`,
          ),
        )
        .limit(1);
      if (!seen[0]) {
        throw new ToolError(`No record of this learner engaging with "${mod.title}" yet. Call get_module and actually teach it first — completion is earned.`);
      }

      const kc = await getExercise<KnowledgeCheckPayload>(db, moduleId, 'knowledge_check');
      if (kc && !checkPassed(progress, moduleId)) {
        const score = progress.checkScores.get(moduleId);
        throw new ToolError(
          `"${mod.title}" completes by passing its knowledge check at 60%+${score ? ` (best so far: ${score.correct}/${score.total})` : ' (no attempt yet)'}. Run get_knowledge_check → submit_knowledge_check, then try again. Retakes are free.`,
        );
      }

      await logEvent(db, session.id, 'module_completed', { moduleId, via: 'mcp' });
      const blockRows = await db.select().from(t.fdContentBlock).where(eq(t.fdContentBlock.moduleId, moduleId)).orderBy(asc(t.fdContentBlock.ordinal));
      const blocks = selectVariants(blockRows, toolingOf(env)).map(toBlock);
      if (blocks.length) {
        await witnessContent(db, {
          sessionId: session.id,
          moduleId,
          activity: 'module_completed',
          kind: 'module_blocks',
          content: moduleSnapshot(toolingOf(env), blocks),
          dedupe: true,
        });
      }
      // Completing a module is the moment to get the next episode waiting —
      // same hook the app fires, so podcast-first learners stay ahead.
      waitUntil(deps.pregenerateNextPodcast(env, session.id));

      const rows = await db.select().from(t.fdModule).orderBy(asc(t.fdModule.courseId), asc(t.fdModule.ordinal));
      const open = rows.filter((m) => m.status === 'open');
      const doneCount = open.filter((m) => progress.completed.has(m.id)).length + 1;
      const recs = await recommendationsFor(db, deps, session.id);

      const out: string[] = [
        `# 🎉 Recorded: "${mod.title}" is complete`,
        '',
        `That's **${doneCount} of ${open.length}** open modules. This completion is on the learner's shared course record — the app's path screen shows it too.`,
        '',
      ];
      if (recs.length) {
        out.push('**Where to next:**');
        recs.forEach((r) => out.push(`- **${r.title}** \`${r.moduleId}\` (~${r.estMinutes} min) — ${r.reasons.join('; ') || 'broadens the base'}`));
        out.push('');
      }
      out.push(`A personalized podcast episode for the next module is being prepared in the background — it'll be waiting at ${origin}/path when the learner wants a change of modality. Celebrate specifically, then offer the next move.`);
      return out.join('\n');
    },
  },
  {
    name: 'recommend_next',
    title: 'Recommend what to learn next',
    description:
      "Ranked next-module suggestions with legible reasons drawn from the learner's own inputs: their stated goals, their diagnostic calibration, course order, and what they've already completed or part-finished. Use it at the start of a session or after a completion.",
    inputSchema: { type: 'object', properties: {} },
    readOnly: true,
    handler: async (_args, ctx) => {
      const { db, deps, session } = ctx;
      const recs = await recommendationsFor(db, deps, session.id);
      if (!recs.length) return 'Every open module is completed — the honest recommendation is the locked courses when they ship. Worth revisiting: any module whose ideas the learner wants to retake into their real work.';
      const out: string[] = ['# What to learn next', ''];
      recs.forEach((r, i) => {
        out.push(`${i + 1}. **${r.title}** \`${r.moduleId}\` (~${r.estMinutes} min)`);
        out.push(`   ${r.reasons.length ? r.reasons.map((x) => `— ${x}`).join('  \n   ') : '— broadens the base'}`);
      });
      out.push('', 'Present at most two or three options with their reasons, recommend one honestly, and let the learner choose. Then get_module to begin.');
      return out.join('\n');
    },
  },
  {
    name: 'apply_to_my_work',
    title: "Apply a module to the learner's real task",
    description:
      "The module's working frameworks (takeaways, try-this exercises, the two-minute cut) packaged for applying to a real task the learner brought — a document, a decision, a workflow from their actual week. This is the connected assistant's superpower over any course portal: use it whenever real material shows up in the conversation.",
    inputSchema: {
      type: 'object',
      properties: {
        moduleId: moduleIdProp,
        task: { type: 'string', description: "The learner's real task in a sentence or two, e.g. 'drafting an ER investigation summary from six interview notes'." },
      },
      required: ['moduleId', 'task'],
    },
    readOnly: false,
    handler: async (args, ctx) => {
      const { db, env, deps, session } = ctx;
      const moduleId = String(args.moduleId ?? '');
      const task = String(args.task ?? '').trim();
      if (!task) throw new ToolError('Describe the task first — a sentence or two of what the learner is actually doing.');
      const mod = await requireOpenModule(db, moduleId);
      const tooling = toolingOf(env);

      const blockRows = await db.select().from(t.fdContentBlock).where(eq(t.fdContentBlock.moduleId, moduleId)).orderBy(asc(t.fdContentBlock.ordinal));
      const blocks = selectVariants(blockRows, tooling).map(toBlock);
      if (!blocks.length) throw new ToolError(`"${mod.title}" has no content seeded yet.`);
      const microRows = await db.select().from(t.fdContentBlock).where(eq(t.fdContentBlock.moduleId, `${moduleId}-micro`)).orderBy(asc(t.fdContentBlock.ordinal));
      const micro = selectVariants(microRows, tooling).map(toBlock);
      const stock = await db
        .select()
        .from(t.fdPodcastStock)
        .where(and(eq(t.fdPodcastStock.moduleId, moduleId), eq(t.fdPodcastStock.variant, 'generic')))
        .orderBy(desc(t.fdPodcastStock.bakedAt))
        .limit(1);
      const takeaways: string[] = stock[0]?.takeawaysJson ? JSON.parse(stock[0].takeawaysJson) : [];

      await logEvent(db, session.id, 'mcp_apply_to_work', { moduleId, task: task.slice(0, 500) });
      const guidance = await deps.guidanceFor(db, env, moduleId, mod.courseId);

      const tools = [
        ...blocks.filter((b) => b.kind === 'takeaways' || b.kind === 'try_this'),
        ...micro.filter((b) => b.kind === 'prose'),
      ];
      const out: string[] = [
        `# Applying "${mod.title}" to: ${task.slice(0, 300)}`,
        '',
        '## The module\'s working frameworks',
        '',
        takeaways.length ? ['**Key takeaways:**', ...takeaways.map((k) => `- ${k}`), ''].join('\n') : '',
        tools.length ? tools.map(blockToText).join('\n\n---\n\n') : blocks.slice(0, 4).map(blockToText).join('\n\n---\n\n'),
        '',
        guidance ? `## Company guidance\n\nThe sponsoring company's admin asked that the following be emphasized when teaching this material — weave it in where it fits naturally:\n\n${guidance.text}\n` : '',
        '## How to run the application session (for the assistant)',
        '- Restate the task in one sentence and pick the one or two frameworks above that actually bite on it — say why.',
        '- Work it step by step WITH the learner: they make every call, you ask the framework\'s questions. Do not just do the task for them — the point is that they leave able to do it alone next time.',
        '- Keep the module\'s boundaries: where it says verify, verify; where it flags regulatory or people-data lines, repeat them.',
        '- End with: what they produced, which module idea did the work, and one thing to watch for when they do this without you.',
        '- If this went well, it counts as real engagement — worth suggesting the knowledge check afterwards while the material is warm.',
      ];
      return out.filter(Boolean).join('\n');
    },
  },
  {
    name: 'record_prediction',
    title: "Record the learner's opening prediction",
    description:
      "Save the learner's honest prediction before a module teaches them better — free text always, numeric values where the module declares opening fields (get_module lists them). The course closes these loops later: the applied activity records actuals against them, and the Module 7 reckoning renders the whole trail. Ask for the number BEFORE teaching; never suggest a safe answer.",
    inputSchema: {
      type: 'object',
      properties: {
        moduleId: moduleIdProp,
        prediction: { type: 'string', description: "The learner's free-text prediction, in their words." },
        values: {
          type: 'object',
          description: 'Numeric predictions keyed by the module\'s declared opening-field keys, e.g. {"packItems": 7}.',
          additionalProperties: { type: 'number' },
        },
      },
      required: ['moduleId'],
    },
    readOnly: false,
    handler: async (args, ctx) => {
      const { db, session } = ctx;
      const moduleId = String(args.moduleId ?? '');
      const mod = await requireOpenModule(db, moduleId);
      const text = typeof args.prediction === 'string' ? args.prediction.trim() : '';
      const values = (args.values ?? {}) as Record<string, unknown>;
      const rubric = await getExercise<RubricPayload>(db, moduleId, 'rubric');
      const fields = rubric?.opening ?? [];

      const saved: string[] = [];
      for (const field of fields) {
        const value = Number(values[field.key]);
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
        saved.push(`${field.label}: ${clamped}`);
      }
      if (!text && !saved.length) {
        throw new ToolError(
          fields.length
            ? `Nothing to record. This module's numeric fields: ${fields.map((f) => `"${f.label}" (key: ${f.key}${f.min !== undefined || f.max !== undefined ? `, ${f.min ?? 0}–${f.max ?? '∞'}` : ''})`).join('; ')} — or pass free text as "prediction".`
            : 'Nothing to record — pass the learner\'s prediction as free text in "prediction".',
        );
      }
      if (text) await logEvent(db, session.id, 'module_calibration_recorded', { moduleId, text: text.slice(0, 1000), via: 'mcp' });

      const out: string[] = [`Recorded for "${mod.title}":`];
      if (saved.length) out.push(...saved.map((s) => `- ${s}`));
      if (text) out.push(`- In their words: "${text.slice(0, 300)}"`);
      out.push('', "On the record — no takebacks, that's the game. The module's applied activity records the actual and computes the miss; being wrong in a known direction is the product. Now teach.");
      return out.join('\n');
    },
  },
  {
    name: 'submit_teach_back',
    title: "Grade the learner's teach-back",
    description:
      "The Feynman move: the learner explains the module in their own words (150+ characters, ideally with an example from their work) and the course grades it server-side against the module's actual key points — accuracy, coverage, own-words application. Honest scores, specific comments. Frame it as the fastest way to find gaps, not a test.",
    inputSchema: {
      type: 'object',
      properties: {
        moduleId: moduleIdProp,
        explanation: { type: 'string', description: "The learner's explanation, verbatim — their words, not yours." },
      },
      required: ['moduleId', 'explanation'],
    },
    readOnly: false,
    handler: async (args, ctx) => {
      const { db, env, session } = ctx;
      const moduleId = String(args.moduleId ?? '');
      const explanation = String(args.explanation ?? '').trim();
      const mod = await requireOpenModule(db, moduleId);
      if (explanation.length < 150) {
        throw new ToolError('Too short to grade fairly — ask the learner to explain it as if to a colleague who missed the module: a paragraph or two, with one example from their own work.');
      }
      if (!env.ANTHROPIC_API_KEY) {
        throw new ToolError('The grader is not configured in this deployment — discuss the explanation yourself against the module content instead.');
      }
      const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      const recent = await db
        .select({ n: sql<number>`count(*)` })
        .from(t.fdEvent)
        .where(and(eq(t.fdEvent.sessionId, session.id), eq(t.fdEvent.type, 'mcp_teach_back'), sql`${t.fdEvent.createdAt} > ${hourAgo}`));
      if ((recent[0]?.n ?? 0) >= TEACH_BACK_LIMIT_PER_HOUR) {
        throw new ToolError('Teach-back grading is limited to five an hour. Discuss the explanation together meanwhile — the grader will be back shortly.');
      }

      // The module's real key points ground the grader, same content the
      // learner was taught from.
      const tooling = toolingOf(env);
      const stock = await db
        .select()
        .from(t.fdPodcastStock)
        .where(and(eq(t.fdPodcastStock.moduleId, moduleId), eq(t.fdPodcastStock.variant, 'generic')))
        .orderBy(desc(t.fdPodcastStock.bakedAt))
        .limit(1);
      const takeaways: string[] = stock[0]?.takeawaysJson ? JSON.parse(stock[0].takeawaysJson) : [];
      let keyPoints = takeaways.map((k) => `- ${k}`).join('\n');
      if (!keyPoints) {
        const microRows = await db.select().from(t.fdContentBlock).where(eq(t.fdContentBlock.moduleId, `${moduleId}-micro`)).orderBy(asc(t.fdContentBlock.ordinal));
        keyPoints = selectVariants(microRows, tooling).map(toBlock).map((b) => b.body).join('\n\n').slice(0, 3000);
      }
      if (!keyPoints) {
        const blockRows = await db.select().from(t.fdContentBlock).where(eq(t.fdContentBlock.moduleId, moduleId)).orderBy(asc(t.fdContentBlock.ordinal));
        keyPoints = selectVariants(blockRows, tooling).map(toBlock).filter((b) => b.kind !== 'exercise').map((b) => b.body).join('\n\n').slice(0, 3000);
      }

      const rubric: RubricPayload = {
        promptVersion: 'mcp-teachback-v1',
        moduleId,
        activityContext: `You are grading a teach-back in an AI fluency course: the learner explains the module "${mod.title}" in their own words, as if to a colleague who missed it. The module's actual key points:\n${keyPoints}`,
        dimensions: [
          { name: 'Accuracy', criteria: 'What they say matches what the module actually teaches. Invented claims, reversed logic, or confident errors score low; honest "I\'m not sure about X" does not.' },
          { name: 'Coverage', criteria: 'They touch the module\'s central ideas (the key points above), not just one corner of it. Missing the module\'s main move caps this at 2.' },
          { name: 'Own words & application', criteria: 'Explained in their own words with at least one concrete example from their own work or context. Paraphrased course prose without application scores low.' },
        ],
      };
      const grade = await gradeSubmission(env.ANTHROPIC_API_KEY, env.GRADING_MODEL, rubric, explanation, null, null);
      if (!grade) throw new ToolError('The grader hiccuped — nothing was lost; try once more, or discuss the explanation yourselves.');
      await logEvent(db, session.id, 'mcp_teach_back', { moduleId, total: grade.total });

      const max = rubric.dimensions.length * 5;
      const out: string[] = [`# Teach-back graded: ${grade.total}/${max} — "${mod.title}"`, ''];
      for (const d of grade.dimensions) out.push(`- **${d.name}: ${d.score}/5** — ${d.comment}`);
      out.push('', grade.summary, '');
      out.push(
        grade.total >= max * 0.75
          ? '**Next:** that explanation would survive a colleague\'s questions. Strike now — run the knowledge check while it\'s warm.'
          : '**Next:** reteach the weakest dimension above in one lecturette, then invite a second pass at just that part — not the whole thing again.',
      );
      return out.join('\n');
    },
  },
  {
    name: 'get_scenario_challenge',
    title: 'Start a scenario challenge (sorting game)',
    description:
      "The module's sorting exercise staged as a conversational game: real workplace scenarios the learner must call, one at a time, committing every answer before any reveal. Buckets and scenarios come without keys — some placements are deliberately arguable, and the graded reveal (submit_scenario) carries the reasoning. A strong change of pace mid-session.",
    inputSchema: { type: 'object', properties: { moduleId: moduleIdProp }, required: ['moduleId'] },
    readOnly: true,
    handler: async (args, ctx) => {
      const { db, session } = ctx;
      const moduleId = String(args.moduleId ?? '');
      const mod = await requireOpenModule(db, moduleId);
      const sorting = await getExercise<SortingPayload>(db, moduleId, 'sorting');
      if (!sorting) {
        const withSorting = await db.select({ moduleId: t.fdExercise.moduleId }).from(t.fdExercise).where(eq(t.fdExercise.kind, 'sorting'));
        throw new ToolError(`"${mod.title}" has no scenario challenge. Modules that do: ${withSorting.map((r) => r.moduleId).join(', ') || 'none seeded yet'}.`);
      }
      await logEvent(db, session.id, 'mcp_scenario_started', { moduleId });

      const out: string[] = [
        `# Scenario challenge — ${mod.title}`,
        '',
        '## The calls the learner can make (present these up front)',
        ...sorting.buckets.map((b) => `- **${b.label}** (\`${b.id}\`) — ${b.hint}`),
        '',
        '## How to run it (for the assistant)',
        '- One scenario at a time. Stage each as a live moment in the learner\'s actual role — someone walks over, an email lands — but keep the scenario\'s substance intact; do not change what the task IS.',
        '- The learner commits a bucket for every scenario before ANY reveal. No confirmations, no hints, no "are you sure". Track their assignments by scenario id.',
        '- Play it as a game: keep a light running count of commitments (never of correctness — you don\'t have the key), and keep the pace brisk.',
        '- Some placements are deliberately arguable — if the learner argues a genuinely defensible case, note their reasoning; the reveal scores arguable calls fairly.',
        `- After all ${sorting.tasks.length} are committed, call submit_scenario with {"assignments": {"<scenarioId>": "<bucketId>", …}} — the graded reveal comes back with per-scenario reasoning, the overall pattern, and whether the learner over- or under-trusts the tools.`,
        '',
        '## Scenarios',
        ...sorting.tasks.map((task, i) => `${i + 1}. (\`${task.id}\`) ${task.text}`),
      ];
      return out.join('\n');
    },
  },
  {
    name: 'submit_scenario',
    title: 'Reveal the scenario challenge (graded server-side)',
    description:
      "Score the learner's committed scenario calls against the key (server-side, with deliberately-arguable placements honored), write the same calibration and funnel records the in-app exercise writes, and return the full reveal: per-scenario verdicts with reasoning, the overall pattern, and the over-/under-trust read.",
    inputSchema: {
      type: 'object',
      properties: {
        moduleId: moduleIdProp,
        assignments: {
          type: 'object',
          description: 'Scenario id → committed bucket id, all scenarios present.',
          additionalProperties: { type: 'string' },
        },
      },
      required: ['moduleId', 'assignments'],
    },
    readOnly: false,
    handler: async (args, ctx) => {
      const { db, session } = ctx;
      const moduleId = String(args.moduleId ?? '');
      const mod = await requireOpenModule(db, moduleId);
      const sorting = await getExercise<SortingPayload>(db, moduleId, 'sorting');
      if (!sorting) throw new ToolError(`"${mod.title}" has no scenario challenge.`);
      const assignments = (args.assignments ?? {}) as Record<string, string>;
      const reveal = await scoreSortingSubmission(db, session.id, moduleId, sorting, assignments);
      if (!reveal) {
        throw new ToolError(`Commit all ${sorting.tasks.length} before the reveal — an unscored guess teaches nothing. Valid bucket ids: ${sorting.buckets.map((b) => b.id).join(', ')}.`);
      }
      await logEvent(db, session.id, 'sort_submitted', { moduleId, correct: reveal.score.correct, total: reveal.score.total, overAssigned: reveal.overAssigned, underAssigned: reveal.underAssigned, via: 'mcp' });
      await witnessContent(db, { sessionId: session.id, moduleId, activity: 'sort_submitted', kind: 'exercise', content: { kind: 'sorting', payload: sorting } });

      const bucketLabel = (id: string) => sorting.buckets.find((b) => b.id === id)?.label ?? id;
      const out: string[] = [
        `# Reveal: ${reveal.score.correct}/${reveal.score.total} — ${mod.title}`,
        reveal.overAssigned || reveal.underAssigned
          ? `Trust read: ${reveal.overAssigned} call${reveal.overAssigned === 1 ? '' : 's'} gave the tools too much, ${reveal.underAssigned} too little.`
          : 'Trust read: every miss was sideways, not a trust error.',
        '',
        ...reveal.results.map(
          (r, i) =>
            `${i + 1}. ${r.correct ? '✓' : '✗'} ${r.text.slice(0, 120)}${r.text.length > 120 ? '…' : ''}\n   Their call: ${bucketLabel(r.chosen)}${r.correct ? '' : ` · key: ${bucketLabel(r.key)}`}\n   ${r.reasoning}`,
        ),
        '',
        `**The pattern:** ${reveal.pattern}`,
        '',
        reveal.postscript,
        '',
        '(For the assistant: walk the misses in order of how much they matter for this learner\'s actual role, connect each to the module idea it tests, and where they argued an arguable call well, say so — the reasoning was the point.)',
      ];
      return out.join('\n');
    },
  },
  {
    name: 'get_activity',
    title: "Get a module's graded applied activity",
    description:
      "The module's real graded work: the activity brief, submission requirements, any calibration fields to collect at submission, the learner's capstone build so far (AI 201), their opening prediction, past submissions, and any notes from the human review desk. Coach the draft — but the submission must be the learner's own thinking.",
    inputSchema: { type: 'object', properties: { moduleId: moduleIdProp }, required: ['moduleId'] },
    readOnly: true,
    handler: async (args, ctx) => {
      const { db, env, deps, session } = ctx;
      const moduleId = String(args.moduleId ?? '');
      const mod = await requireOpenModule(db, moduleId);
      const rubric = await getExercise<RubricPayload>(db, moduleId, 'rubric');
      if (!rubric) throw new ToolError(`"${mod.title}" has no graded activity.`);

      const blockRows = await db.select().from(t.fdContentBlock).where(eq(t.fdContentBlock.moduleId, `${moduleId}-activity`)).orderBy(asc(t.fdContentBlock.ordinal));
      const brief = selectVariants(blockRows, toolingOf(env)).map(toBlock);
      const stages = await deps.priorStagesFor(db, session.id, moduleId);
      const opening = await deps.openingPredictionFor(db, session.id, moduleId);
      const latest = await db
        .select()
        .from(t.fdSubmission)
        .where(and(eq(t.fdSubmission.sessionId, session.id), eq(t.fdSubmission.moduleId, moduleId)))
        .orderBy(desc(t.fdSubmission.createdAt))
        .limit(1);
      const last = latest[0];
      const reviews = await db
        .select({ body: t.fdReview.body, score: t.fdReview.score, createdAt: t.fdReview.createdAt, submissionId: t.fdReview.submissionId })
        .from(t.fdReview)
        .innerJoin(t.fdSubmission, eq(t.fdReview.submissionId, t.fdSubmission.id))
        .where(and(eq(t.fdSubmission.sessionId, session.id), eq(t.fdSubmission.moduleId, moduleId)))
        .orderBy(desc(t.fdReview.createdAt));

      const out: string[] = [`# Applied activity — ${mod.title}`, ''];
      if (rubric.intro) out.push(`*${rubric.intro}*`, '');
      if (brief.length) out.push('## The brief', '', brief.map(blockToText).join('\n\n---\n\n'), '');
      out.push('## Requirements');
      out.push(`- At least ${rubric.minChars ?? 700} characters of the learner's own thinking; graded on ${rubric.dimensions.length} dimensions (${rubric.dimensions.map((d) => d.name).join(', ')}).`);
      if (rubric.calibration?.length) {
        out.push(`- Collect these numbers at submission time and pass them as "calibration": ${rubric.calibration.map((f) => `"${f.label}" (key: ${f.key})`).join('; ')}. Fields that measure an earlier prediction close that loop — honesty scores, accuracy doesn't.`);
      }
      if (opening) out.push('', `**Their opening prediction, echoed back:** "${opening.slice(0, 500)}"`);
      if (stages.length) {
        out.push('', '## The build so far (AI 201 capstone thread)');
        for (const s of stages) out.push(`- Stage ${s.ordinal} — ${s.title}${s.total !== null ? ` (graded ${s.total})` : ' (ungraded)'}`);
        out.push('The grader sees this trail too — the new stage must genuinely advance the same build.');
      }
      if (last) {
        out.push('', `**Previous submission:** ${last.gradedAt ? `graded ${last.totalScore} on ${last.gradedAt.slice(0, 10)}` : 'saved, not yet graded'} — resubmitting replaces nothing; every draft is kept.`);
      }
      if (reviews.length) {
        out.push('', '## From the review desk (a human read this)');
        for (const r of reviews) out.push(`- ${r.createdAt.slice(0, 10)}${r.score !== null ? ` · ${r.score}/20` : ''}${r.submissionId === last?.id ? '' : ' · on an earlier draft'}: ${r.body}`);
      }
      out.push(
        '',
        '## Coaching rules (for the assistant)',
        '- Coach structure, ask hard questions, point at module ideas — never write the submission. The grader reads for the learner\'s own mental model; ghost-written work defeats the entire course.',
        '- When the draft is ready, call submit_activity with the learner\'s text verbatim. Grading takes a few seconds and lands on their permanent course record, where the human review desk also reads.',
      );
      return out.join('\n');
    },
  },
  {
    name: 'submit_activity',
    title: "Submit the learner's activity for real grading",
    description:
      "Submit the learner's applied-activity text — their words, verbatim — to the course's AI grader. Saved before grading (nothing is ever lost), graded against the module's rubric with the capstone build-so-far in context, written to the same record the app and the human review desk read. Include any calibration numbers the activity asked for.",
    inputSchema: {
      type: 'object',
      properties: {
        moduleId: moduleIdProp,
        body: { type: 'string', description: "The learner's submission, verbatim. Their thinking, not yours." },
        calibration: {
          type: 'object',
          description: 'Numeric calibration fields the activity declares (get_activity lists them), keyed by field key.',
          additionalProperties: { type: 'number' },
        },
      },
      required: ['moduleId', 'body'],
    },
    readOnly: false,
    handler: async (args, ctx) => {
      const { db, env, deps, session } = ctx;
      const moduleId = String(args.moduleId ?? '');
      await requireOpenModule(db, moduleId);
      const outcome = await deps.submitActivity(env, db, session.id, moduleId, typeof args.body === 'string' ? args.body : undefined, (args.calibration ?? undefined) as Record<string, number> | undefined);
      if (!outcome.ok) throw new ToolError(outcome.error);
      const r = outcome.result;
      if (r.status === 'graded') {
        const out: string[] = [`# Graded: ${r.total} — on the record`, ''];
        for (const d of r.dimensions ?? []) out.push(`- **${d.name}: ${d.score}/5** — ${d.comment}`);
        out.push('', r.summary ?? '', '');
        out.push('Walk the learner through the two comments that matter most for their next move — not all of them at once. A human from the review desk may add notes later; get_activity surfaces those. Resubmissions are welcome; every draft is kept.');
        return out.join('\n');
      }
      return `${r.message ?? 'Your submission is saved.'}\n\n(For the assistant: the submission is safely on the learner's record — nothing was lost. Continue the session and suggest resubmitting later to get the rubric feedback.)`;
    },
  },
  {
    name: 'ask_the_hosts',
    title: 'Ask Maya and Leo (the podcast hosts)',
    description:
      "Send the learner's question to Fluent, the course's two-host podcast: Maya knows the material cold, Leo asks what you would ask. Returns the new follow-up segment's transcript immediately while the audio renders for the app. Gated the honest way: the learner must have actually listened to their module episode first. Offer it when they want a different voice on something.",
    inputSchema: {
      type: 'object',
      properties: {
        moduleId: moduleIdProp,
        question: { type: 'string', description: "The learner's question, in their words — a sentence or two." },
      },
      required: ['moduleId', 'question'],
    },
    readOnly: false,
    handler: async (args, ctx) => {
      const { db, env, deps, session, origin, waitUntil } = ctx;
      const moduleId = String(args.moduleId ?? '');
      await requireOpenModule(db, moduleId);
      const outcome = await deps.askTheHosts(env, db, session.id, moduleId, typeof args.question === 'string' ? args.question : undefined, 'mcp', waitUntil);
      if (!outcome.ok) {
        // The listen-first gate deserves a helpful hand-off, not a dead end.
        throw new ToolError(`${outcome.error}${outcome.status === 400 ? ` The episode lives at ${origin}/module/${moduleId}/podcast.` : ''}`);
      }
      const row = outcome.row;
      const lines = JSON.parse(row.scriptJson) as PodcastLine[];
      const out: string[] = [
        `# ${row.title}`,
        `*${row.description}*`,
        '',
        ...lines.map((l) => `**${PODCAST_HOSTS[l.speaker].name}:** ${l.text}`),
        '',
        `🎧 The voiced version is rendering now — it'll be in the learner's feed at ${origin}/module/${moduleId}/podcast. Hand over the transcript highlights, not a summary of a summary: quote the hosts where they said it well.`,
      ];
      return out.join('\n');
    },
  },
];

// ---------- prompts ----------

const PROMPTS = [
  {
    name: 'learn',
    title: 'Start a tutoring session',
    description: 'Teach a course module interactively — lecturettes, applied questions, learner in the driver’s seat.',
    arguments: [{ name: 'module', description: 'Module id like ai101-m1 — leave blank to pick up where the learner left off', required: false }],
    text: (args: Record<string, string>) =>
      `${args.module ? `Fetch module "${args.module}" from the AI Fluency course with get_module` : 'Call get_course_overview and recommend_next on the AI Fluency course, recommend where I should pick up, and once I choose, fetch that module with get_module'} and run a tutoring session. Orient me in two or three sentences, then offer ways in: a guided walkthrough, quiz-first, or applying the ideas to something from my own week. Teach one idea at a time and make me apply each one. When I've got it, run the knowledge check and record my completion.`,
  },
  {
    name: 'quiz',
    title: 'Quiz me on a module',
    description: 'Run a module’s knowledge check conversationally, grade it for real, and record a pass.',
    arguments: [{ name: 'module', description: 'Module id like ai101-m1 — leave blank to quiz the module I most recently worked on', required: false }],
    text: (args: Record<string, string>) =>
      `Run the AI Fluency knowledge check for ${args.module ? `module "${args.module}"` : 'the module I most recently worked on (check get_course_overview)'} — get_knowledge_check, then one question at a time. I commit an answer before we discuss anything. No hints unless I ask. Submit my answers at the end with submit_knowledge_check, walk me through what I missed, and if I passed, record the module complete.`,
  },
  {
    name: 'challenge',
    title: 'Scenario challenge',
    description: 'Play a module’s sorting exercise as a rapid-fire workplace scenario game with a graded reveal.',
    arguments: [{ name: 'module', description: 'Module id like ai101-m1 — leave blank to pick one with a challenge', required: false }],
    text: (args: Record<string, string>) =>
      `Run the AI Fluency scenario challenge ${args.module ? `for module "${args.module}"` : 'for a module I\'ve been working on that has one (get_scenario_challenge will tell you which do)'}: stage each scenario as a live moment in my actual workday, make me commit a call on every one before any reveal, keep the pace brisk, then submit my calls with submit_scenario and walk me through the reveal — worst miss first.`,
  },
  {
    name: 'apply',
    title: 'Apply the course to my real work',
    description: 'Work a module’s frameworks on a real task from the learner’s week.',
    arguments: [{ name: 'task', description: 'The real task, in a sentence — e.g. "summarizing exit-interview notes for the exec team"', required: false }],
    text: (args: Record<string, string>) =>
      `I want to use the AI Fluency course on real work${args.task ? `: ${args.task}` : ''}. ${args.task ? '' : 'First ask me what I\'m actually working on this week. '}Then check get_course_overview for which module speaks to it, call apply_to_my_work, and coach me through applying the module's frameworks to my task — I make the calls, you ask the questions. End with what I produced and the one thing to watch next time.`,
  },
  {
    name: 'whats-next',
    title: 'Progress check-in',
    description: 'Where the learner stands and 2–3 honest options for the next session.',
    arguments: [],
    text: () =>
      'Call get_course_overview and recommend_next on the AI Fluency course and give me a quick check-in: what I have finished, what that says about where I am, and two or three options for my next session with an honest recommendation. Under 200 words.',
  },
];

// ---------- JSON-RPC over stateless streamable HTTP ----------

type RpcMessage = { jsonrpc?: string; id?: number | string | null; method?: string; params?: Record<string, unknown> };

const rpcResult = (id: number | string | null, result: unknown) => ({ jsonrpc: '2.0' as const, id, result });
const rpcError = (id: number | string | null, code: number, message: string) => ({ jsonrpc: '2.0' as const, id, error: { code, message } });

async function dispatch(msg: RpcMessage, ctx: ToolCtx): Promise<object | null> {
  const id = msg.id ?? null;
  const isNotification = msg.id === undefined;
  if (msg.jsonrpc !== '2.0' || typeof msg.method !== 'string') {
    return isNotification ? null : rpcError(id, -32600, 'Invalid request.');
  }
  if (msg.method.startsWith('notifications/')) return null;

  switch (msg.method) {
    case 'initialize': {
      const requested = String(msg.params?.protocolVersion ?? '');
      await logEvent(ctx.db, ctx.session.id, 'mcp_connected', {
        client: (msg.params?.clientInfo as { name?: string } | undefined)?.name ?? null,
        protocolVersion: requested || null,
      });
      return rpcResult(id, {
        protocolVersion: PROTOCOL_VERSIONS.includes(requested) ? requested : PROTOCOL_VERSIONS[0],
        capabilities: { tools: { listChanged: false }, prompts: { listChanged: false } },
        serverInfo: SERVER_INFO,
        instructions: INSTRUCTIONS,
      });
    }
    case 'ping':
      return rpcResult(id, {});
    case 'tools/list':
      return rpcResult(id, {
        tools: TOOLS.map((tool) => ({
          name: tool.name,
          title: tool.title,
          description: tool.description,
          inputSchema: tool.inputSchema,
          annotations: { readOnlyHint: tool.readOnly },
        })),
      });
    case 'tools/call': {
      const name = String(msg.params?.name ?? '');
      const tool = TOOLS.find((x) => x.name === name);
      if (!tool) return rpcError(id, -32602, `Unknown tool "${name}".`);
      const args = (msg.params?.arguments ?? {}) as Record<string, unknown>;
      await logEvent(ctx.db, ctx.session.id, 'mcp_tool_called', { tool: name });
      try {
        const text = await tool.handler(args, ctx);
        return rpcResult(id, { content: [{ type: 'text', text }], isError: false });
      } catch (err) {
        if (err instanceof ToolError) {
          return rpcResult(id, { content: [{ type: 'text', text: err.message }], isError: true });
        }
        console.error(`mcp tool ${name} failed`, err);
        return rpcResult(id, { content: [{ type: 'text', text: 'The course server hit an unexpected error on that call. Try once more; if it repeats, continue the session from what you already have.' }], isError: true });
      }
    }
    case 'prompts/list':
      return rpcResult(id, {
        prompts: PROMPTS.map((p) => ({ name: p.name, title: p.title, description: p.description, arguments: p.arguments })),
      });
    case 'prompts/get': {
      const name = String(msg.params?.name ?? '');
      const prompt = PROMPTS.find((p) => p.name === name);
      if (!prompt) return rpcError(id, -32602, `Unknown prompt "${name}".`);
      const args = (msg.params?.arguments ?? {}) as Record<string, string>;
      return rpcResult(id, {
        description: prompt.description,
        messages: [{ role: 'user', content: { type: 'text', text: prompt.text(args) } }],
      });
    }
    // Not advertised, but answered gracefully for clients that probe anyway.
    case 'resources/list':
      return rpcResult(id, { resources: [] });
    case 'resources/templates/list':
      return rpcResult(id, { resourceTemplates: [] });
    default:
      return isNotification ? null : rpcError(id, -32601, `Method "${msg.method}" not supported.`);
  }
}

export function createMcpApp(deps: McpDeps) {
  const mcp = new Hono<McpCtx>();

  // Two credentials open this endpoint, and they are checked in that order:
  // an OAuth bearer token (the connector handshake — see oauth.ts), or the
  // personal signed key from the URL path (clients that don't do OAuth).
  // Either way it resolves to one fd_session, so progress is one record.
  const serve = async (c: Context<McpCtx>, key: string | undefined) => {
    const db = c.get('db');
    const origin = new URL(c.req.url).origin;
    const bearer = c.req.header('authorization')?.match(/^Bearer\s+(.+)$/i)?.[1]?.trim();

    // An unauthenticated request must be answered with a challenge that names
    // where the metadata lives — that pointer is how a connector discovers it
    // needs to run OAuth at all.
    const challenge = (error: string, description: string) => {
      for (const [k, v] of Object.entries(CORS_HEADERS)) c.header(k, v);
      c.header('WWW-Authenticate', wwwAuthenticate(origin, error, description));
      return c.json({ error: description }, 401);
    };

    let sessionId: string | null = null;
    if (bearer) {
      const check = await verifyAccessToken(db, bearer);
      if (check.ok) sessionId = check.sessionId;
      else {
        // A bearer token that fails is not a reason to fall through to the
        // URL key: say so precisely so the client refreshes or reconnects.
        const asKey = await verifyMcpKey(bearer, c.env.SESSION_SECRET ?? 'dev-only-secret-set-SESSION_SECRET-in-production');
        if (!asKey) return challenge(check.error, check.description);
        sessionId = asKey;
      }
    }
    if (!sessionId && key) {
      sessionId = await verifyMcpKey(key, c.env.SESSION_SECRET ?? 'dev-only-secret-set-SESSION_SECRET-in-production');
    }

    let session: SessionRow | null = null;
    if (sessionId) {
      const rows = await db.select().from(t.fdSession).where(eq(t.fdSession.id, sessionId)).limit(1);
      session = rows[0] ?? null;
    }
    if (!session) {
      return challenge(
        bearer || key ? 'invalid_token' : 'invalid_request',
        bearer || key
          ? 'That credential no longer maps to a course session. Reconnect the course.'
          : 'Authorization required. Connect this course as a connector, or use your personal URL from the course app.',
      );
    }
    await db.update(t.fdSession).set({ lastSeenAt: now() }).where(eq(t.fdSession.id, session.id));
    for (const [k, v] of Object.entries(CORS_HEADERS)) c.header(k, v);

    const body = (await c.req.json().catch(() => null)) as RpcMessage | RpcMessage[] | null;
    if (!body) return c.json(rpcError(null, -32700, 'Body must be JSON-RPC.'), 400);
    const ctx: ToolCtx = {
      db,
      env: c.env,
      session,
      origin: new URL(c.req.url).origin,
      waitUntil: (p) => c.executionCtx.waitUntil(p as Promise<void>),
      deps,
    };
    if (Array.isArray(body)) {
      const responses: object[] = [];
      for (const msg of body) {
        const res = await dispatch(msg, ctx);
        if (res) responses.push(res);
      }
      return responses.length ? c.json(responses) : c.body(null, 202);
    }
    const res = await dispatch(body, ctx);
    return res ? c.json(res) : c.body(null, 202);
  };

  // Browser-based connectors preflight before they ever POST.
  const preflight = (c: Context<McpCtx>) => {
    for (const [k, v] of Object.entries(CORS_HEADERS)) c.header(k, v);
    return c.body(null, 204);
  };
  mcp.options('/', preflight);
  mcp.options('/:key', preflight);

  mcp.post('/', (c) => serve(c, undefined));
  mcp.post('/:key', (c) => serve(c, c.req.param('key')));

  // No server-initiated stream: this server is stateless by design. The GET
  // still answers with the challenge when unauthenticated, because some
  // clients probe with GET before deciding whether they need to authorize.
  const explain = (c: Context<McpCtx>) => {
    for (const [k, v] of Object.entries(CORS_HEADERS)) c.header(k, v);
    if (!c.req.header('authorization')) {
      c.header('WWW-Authenticate', wwwAuthenticate(new URL(c.req.url).origin));
      return c.json({ error: 'Authorization required.' }, 401);
    }
    return c.json({ error: 'This MCP server does not open a server-initiated stream — POST JSON-RPC instead.' }, 405);
  };
  mcp.get('/', explain);
  mcp.get('/:key', explain);
  // Streamable HTTP lets a client end a session; there is none to end here.
  mcp.delete('/', preflight);
  mcp.delete('/:key', preflight);

  return mcp;
}
