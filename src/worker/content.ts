// Shared content plumbing: variant selection, block projection, freshness
// stamps, and the fd_exercise accessor. Used by the HTTP API (index.ts) and
// the MCP server (mcp.ts) so both surfaces serve identical content.
import { and, eq } from 'drizzle-orm';
import type { DrizzleD1Database } from 'drizzle-orm/d1';
import * as t from '../db/schema';
import type { ContentBlock } from '../shared/types';
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
