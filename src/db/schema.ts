import { sqliteTable, text, integer, real, index } from 'drizzle-orm/sqlite-core';

export const fdBrand = sqliteTable('fd_brand', {
  slug: text('slug').primaryKey(),
  name: text('name').notNull(),
  tokensJson: text('tokens_json').notNull(),
  voiceJson: text('voice_json').notNull(),
  createdAt: text('created_at').notNull(),
});

export const fdAccessCode = sqliteTable('fd_access_code', {
  id: text('id').primaryKey(),
  brandSlug: text('brand_slug').notNull(),
  // Format: pbkdf2$<iterations>$<salt_b64>$<hash_b64> — per-code salt, never plaintext.
  codeHash: text('code_hash').notNull(),
  label: text('label').notNull(),
  maxUses: integer('max_uses'),
  uses: integer('uses').notNull().default(0),
  expiresAt: text('expires_at'),
  active: integer('active').notNull().default(1),
});

export const fdSession = sqliteTable(
  'fd_session',
  {
    id: text('id').primaryKey(),
    codeId: text('code_id').notNull(),
    brandSlug: text('brand_slug').notNull(),
    createdAt: text('created_at').notNull(),
    lastSeenAt: text('last_seen_at').notNull(),
    userAgent: text('user_agent'),
    ipHash: text('ip_hash'),
  },
);

export const fdParticipant = sqliteTable('fd_participant', {
  id: text('id').primaryKey(),
  sessionId: text('session_id').notNull(),
  displayName: text('display_name'),
  roleLabel: text('role_label'),
  orgLabel: text('org_label'),
  createdAt: text('created_at').notNull(),
});

// Append-only funnel: landed → code_entered → diagnostic_started → … → module_completed
export const fdEvent = sqliteTable(
  'fd_event',
  {
    id: text('id').primaryKey(),
    sessionId: text('session_id'),
    type: text('type').notNull(),
    payloadJson: text('payload_json'),
    createdAt: text('created_at').notNull(),
  },
  (t) => [index('idx_event_session').on(t.sessionId), index('idx_event_type_time').on(t.type, t.createdAt)],
);

export const fdDiagnosticResponse = sqliteTable(
  'fd_diagnostic_response',
  {
    id: text('id').primaryKey(),
    sessionId: text('session_id').notNull(),
    itemId: text('item_id').notNull(),
    answerJson: text('answer_json').notNull(),
    correct: integer('correct'),
    msElapsed: integer('ms_elapsed'),
  },
  (t) => [index('idx_diag_session').on(t.sessionId)],
);

export const fdCalibration = sqliteTable(
  'fd_calibration',
  {
    id: text('id').primaryKey(),
    sessionId: text('session_id').notNull(),
    context: text('context').notNull(),
    predictedPct: real('predicted_pct').notNull(),
    actualOutcome: real('actual_outcome'),
    delta: real('delta'),
    createdAt: text('created_at').notNull(),
  },
  (t) => [index('idx_cal_session').on(t.sessionId)],
);

export const fdSubmission = sqliteTable(
  'fd_submission',
  {
    id: text('id').primaryKey(),
    sessionId: text('session_id').notNull(),
    moduleId: text('module_id').notNull(),
    body: text('body').notNull(),
    rubricJson: text('rubric_json'),
    totalScore: integer('total_score'),
    modelUsed: text('model_used'),
    promptVersion: text('prompt_version'),
    gradedAt: text('graded_at'),
    createdAt: text('created_at').notNull(),
  },
  (t) => [index('idx_sub_session').on(t.sessionId)],
);

export const fdContentBlock = sqliteTable(
  'fd_content_block',
  {
    id: text('id').primaryKey(),
    moduleId: text('module_id').notNull(),
    ordinal: integer('ordinal').notNull(),
    kind: text('kind').notNull(), // prose | callout | try_this | exercise | takeaways | table
    layer: text('layer').notNull(), // stable | volatile
    body: text('body').notNull(), // markdown (exercise blocks carry a JSON payload)
    dependsOn: text('depends_on'), // JSON array — future agent watch topics
    reviewedAt: text('reviewed_at').notNull(),
  },
  (t) => [index('idx_block_module').on(t.moduleId, t.ordinal)],
);

// Intake answers: how the learner wants this to go. Latest row per key wins.
export const fdPreference = sqliteTable(
  'fd_preference',
  {
    id: text('id').primaryKey(),
    sessionId: text('session_id').notNull(),
    key: text('key').notNull(), // start | time | styles | objective
    valueJson: text('value_json').notNull(),
    createdAt: text('created_at').notNull(),
  },
  (t) => [index('idx_pref_session').on(t.sessionId, t.key)],
);

export const fdModule = sqliteTable('fd_module', {
  id: text('id').primaryKey(),
  courseId: text('course_id').notNull(),
  ordinal: integer('ordinal').notNull(),
  title: text('title').notNull(),
  blurb: text('blurb').notNull(),
  status: text('status').notNull(), // open | locked
  estMinutes: integer('est_minutes').notNull(),
  // JSON array of module ids that are STRONG prerequisites. Empty/null = take
  // it whenever you want. Locked cards must always say how to unlock.
  prereqJson: text('prereq_json'),
});
