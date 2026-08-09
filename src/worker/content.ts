// Shared content plumbing: variant selection, block projection, freshness
// stamps, and the fd_exercise accessor. Used by the HTTP API (index.ts) and
// the MCP server (mcp.ts) so both surfaces serve identical content.
import { and, eq } from 'drizzle-orm';
import type { DrizzleD1Database } from 'drizzle-orm/d1';
import * as t from '../db/schema';
import type { ContentBlock, SortingReveal } from '../shared/types';
import type { Env } from './index';

// One deployment teaches one tool stack. Blocks tagged with a variant form a
// group per ordinal; serve the one matching ORG_TOOLING, falling back to the
// 'claude' default so an unknown tooling never loses a lesson. Untagged
// blocks apply to every org.
export const toolingOf = (env: Env) => env.ORG_TOOLING?.trim().toLowerCase() || 'claude';

export function selectVariants<T extends { ordinal: number; variant: string | null }>(rows: T[], tooling: string): T[] {
  return rows.filter((row) => {
    if (!row.variant) return true;
    const groupHasMatch = rows.some((r) => r.ordinal === row.ordinal && r.variant === tooling);
    return groupHasMatch ? row.variant === tooling : row.variant === 'claude';
  });
}

export function toBlock(row: typeof t.fdContentBlock.$inferSelect): ContentBlock {
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

export function stampsFor(blocks: ContentBlock[]) {
  const min = (layer: string) => {
    const dates = blocks.filter((b) => b.layer === layer).map((b) => b.reviewedAt);
    return dates.length ? dates.sort()[0] : null;
  };
  return { conceptsReviewedAt: min('stable'), examplesCurrentAsOf: min('volatile') };
}

// Exercise payloads (sorting keys, rubrics, knowledge checks) live in
// fd_exercise; clients only ever see a public projection.
export async function getExercise<T>(db: DrizzleD1Database, moduleId: string, kind: string): Promise<T | null> {
  const rows = await db
    .select()
    .from(t.fdExercise)
    .where(and(eq(t.fdExercise.moduleId, moduleId), eq(t.fdExercise.kind, kind)))
    .limit(1);
  return rows[0] ? (JSON.parse(rows[0].payloadJson) as T) : null;
}

export type SortingPayload = {
  buckets: { id: string; label: string; hint: string; rank: number; pct: number }[];
  // `also` marks deliberately-arguable placements that score as correct — the
  // reasoning text carries the argument either way.
  tasks: { id: string; text: string; key: string; also?: string[]; reasoning: string }[];
  pattern: string;
  postscript: string;
};

// Score a committed sorting submission and write its calibration rows — the
// shared core of the app's /sort endpoint and the MCP scenario challenge.
// Returns null when any task lacks a valid assignment (commit-first rule);
// callers log their own funnel event and witness the exercise version.
export async function scoreSortingSubmission(
  db: DrizzleD1Database,
  sessionId: string,
  moduleId: string,
  sorting: SortingPayload,
  assignments: Record<string, string>,
): Promise<SortingReveal | null> {
  const valid = new Set(sorting.buckets.map((b) => b.id));
  for (const task of sorting.tasks) {
    if (!valid.has(assignments[task.id])) return null;
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
    await db.delete(t.fdCalibration).where(and(eq(t.fdCalibration.sessionId, sessionId), eq(t.fdCalibration.context, context)));
    await db.insert(t.fdCalibration).values({
      id: crypto.randomUUID(),
      sessionId,
      context,
      predictedPct: pct[assignments[task.id]],
      actualOutcome: pct[task.key],
      delta: pct[assignments[task.id]] - pct[task.key],
      createdAt: new Date().toISOString(),
    });
  }

  return {
    results,
    score: { correct, total: sorting.tasks.length },
    overAssigned,
    underAssigned,
    pattern: sorting.pattern,
    postscript: sorting.postscript,
  };
}

export type KnowledgeCheckPayload = {
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
