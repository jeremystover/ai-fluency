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
import { moduleSnapshot, witnessContent } from './audit';
import { getExercise, selectVariants, toBlock, toolingOf, type KnowledgeCheckPayload } from './content';
import { GOAL_CHOICES } from '../shared/goals';
import diagnosticData from '../../content/diagnostic.json';
import contentCatalog from '../../content/modules.json';
import type { ContentBlock, CourseCard, DiagnosticResult, IntakePrefs, PodcastVisual } from '../shared/types';
import type { Env } from './index';

type SessionRow = typeof t.fdSession.$inferSelect;
type ModuleRow = typeof t.fdModule.$inferSelect;
type McpCtx = { Bindings: Env; Variables: { session: SessionRow | null; db: DrizzleD1Database } };

// Functions that live in index.ts (and are entangled with the rest of the API)
// are injected at mount time rather than re-implemented here.
export type McpDeps = {
  loadPrefs: (db: DrizzleD1Database, sessionId: string) => Promise<IntakePrefs>;
  computeDiagnosticResult: (db: DrizzleD1Database, sessionId: string) => Promise<DiagnosticResult>;
  pregenerateNextPodcast: (env: Env, sessionId: string) => Promise<void>;
};

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
// but never hide it (nothing locks).
async function recommendationsFor(db: DrizzleD1Database, deps: McpDeps, sessionId: string): Promise<Recommendation[]> {
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

  const serve = async (c: Context<McpCtx>, key: string | undefined) => {
    const sessionId = await verifyMcpKey(key, c.env.SESSION_SECRET ?? 'dev-only-secret-set-SESSION_SECRET-in-production');
    const db = c.get('db');
    let session: SessionRow | null = null;
    if (sessionId) {
      const rows = await db.select().from(t.fdSession).where(eq(t.fdSession.id, sessionId)).limit(1);
      session = rows[0] ?? null;
    }
    if (!session) {
      return c.json({ error: 'Invalid or missing course key. Get your personal connector URL from the course app under "Learn inside your AI tools".' }, 401);
    }
    await db.update(t.fdSession).set({ lastSeenAt: now() }).where(eq(t.fdSession.id, session.id));

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

  mcp.post('/:key', (c) => serve(c, c.req.param('key')));
  mcp.post('/', (c) => serve(c, c.req.header('authorization')?.replace(/^Bearer\s+/i, '')));
  // No server-initiated stream: this server is stateless by design.
  mcp.get('/:key', (c) => c.json({ error: 'This is an MCP endpoint — connect with an MCP client (POST JSON-RPC). Setup lives in the course app under "Learn inside your AI tools".' }, 405));
  mcp.get('/', (c) => c.json({ error: 'This is an MCP endpoint — connect with an MCP client (POST JSON-RPC). Setup lives in the course app under "Learn inside your AI tools".' }, 405));

  return mcp;
}
