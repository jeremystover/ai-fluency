// Completion audit: when a learner sees or completes content, capture what
// the content actually was — so "what did they see?" stays answerable after
// the content itself changes. Snapshots are content-addressed (one row per
// distinct version, shared across everyone who witnessed it); audit rows are
// append-only pointers from a completion moment to its exact version.
import { and, eq } from 'drizzle-orm';
import type { DrizzleD1Database } from 'drizzle-orm/d1';
import * as t from '../db/schema';
import type { ContentBlock } from '../shared/types';

const enc = new TextEncoder();

async function sha256Hex(text: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', enc.encode(text));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Deterministic serialization of a module's served blocks — the exact set the
// learner's deployment shows (variants already resolved for its tooling).
export function moduleSnapshot(tooling: string, blocks: ContentBlock[]) {
  return {
    tooling,
    blocks: blocks.map((b) => ({ id: b.id, ordinal: b.ordinal, kind: b.kind, layer: b.layer, body: b.body, reviewedAt: b.reviewedAt })),
  };
}

export type WitnessArgs = {
  sessionId: string;
  moduleId: string;
  // Names mirror the funnel events they accompany: module_viewed |
  // micro_viewed | module_completed | knowledge_check_submitted |
  // sort_submitted | choice_submitted | activity_submitted | podcast_listened
  activity: string;
  kind: string; // module_blocks | exercise | activity_pack | podcast_episode
  content: unknown; // serialized verbatim — exactly what the learner saw
  refId?: string | null; // submission / podcast id when one exists
  // View-time witnesses fire on every page load; dedupe keeps one row per
  // (session, activity, version) so revisiting unchanged content doesn't stack.
  dedupe?: boolean;
};

export async function witnessContent(db: DrizzleD1Database, args: WitnessArgs): Promise<void> {
  const contentJson = JSON.stringify(args.content);
  const hash = await sha256Hex(contentJson);
  const at = new Date().toISOString();
  await db
    .insert(t.fdContentSnapshot)
    .values({ hash, kind: args.kind, moduleId: args.moduleId, contentJson, createdAt: at })
    .onConflictDoNothing();
  if (args.dedupe) {
    const seen = await db
      .select({ id: t.fdCompletionAudit.id })
      .from(t.fdCompletionAudit)
      .where(
        and(
          eq(t.fdCompletionAudit.sessionId, args.sessionId),
          eq(t.fdCompletionAudit.activity, args.activity),
          eq(t.fdCompletionAudit.contentHash, hash),
        ),
      )
      .limit(1);
    if (seen[0]) return;
  }
  await db.insert(t.fdCompletionAudit).values({
    id: crypto.randomUUID(),
    sessionId: args.sessionId,
    moduleId: args.moduleId,
    activity: args.activity,
    refId: args.refId ?? null,
    contentHash: hash,
    createdAt: at,
  });
}
