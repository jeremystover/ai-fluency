import { sqliteTable, text, integer, real, index, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const fdBrand = sqliteTable('fd_brand', {
  slug: text('slug').primaryKey(),
  name: text('name').notNull(),
  tokensJson: text('tokens_json').notNull(),
  voiceJson: text('voice_json').notNull(),
  // Optional company profile: { aiTools?: string[] } — what the org provisions.
  profileJson: text('profile_json'),
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
  // Which course this code opens. NULL = the full course (the original
  // behaviour); set = the short course of that id, and the code is the whole
  // definition of what that learner sees.
  shortCourseId: text('short_course_id'),
});

// A named subset of the catalog, sold as its own thing. The passcode carries
// the mapping (fd_access_code.short_course_id), so entering the code decides
// the role, the modules, their order, and whether a diagnostic runs first —
// all the things the full course's intake has to ask about. Module ids are an
// ordered JSON array and that order IS the course: the 101/201/301 tiers the
// modules came from are not shown to a short-course learner. diagnostic_json
// is NULL when the short course skips the diagnostic, otherwise
// { "items": ["k1", "c1", …] } naming which diagnostic items to ask.
export const fdShortCourse = sqliteTable(
  'fd_short_course',
  {
    id: text('id').primaryKey(),
    brandSlug: text('brand_slug').notNull(),
    label: text('label').notNull(),
    blurb: text('blurb'),
    roleId: text('role_id'), // a ROLE_CHOICES id — replaces the intake's role question
    moduleIdsJson: text('module_ids_json').notNull(), // ordered JSON array of module ids
    diagnosticJson: text('diagnostic_json'), // { items: string[] } | null
    createdAt: text('created_at').notNull(),
  },
  (t) => [index('idx_short_course_brand').on(t.brandSlug)],
);

// A real login identity. Accounts and shared passcodes are two doors into the
// same deployment, open at the same time: a session with an account_id is a
// product learner, one without is a demo learner. Sign-up is census-gated —
// the email must be on the imported fd_employee roster, so the census is the
// allowlist. Passwords use the same PBKDF2 format as access codes.
export const fdAccount = sqliteTable(
  'fd_account',
  {
    id: text('id').primaryKey(),
    brandSlug: text('brand_slug').notNull(),
    email: text('email').notNull(), // stored lowercase
    passwordHash: text('password_hash').notNull(), // pbkdf2$<iter>$<salt>$<hash>
    name: text('name').notNull(),
    createdAt: text('created_at').notNull(),
    lastLoginAt: text('last_login_at'),
  },
  (t) => [uniqueIndex('idx_account_email').on(t.brandSlug, t.email)],
);

// A password reset in flight. The token itself is never stored — only an
// unsalted SHA-256 of it, same reasoning as the OAuth tables: the input is
// already 256 bits of randomness, and lookup has to be by exact hash. One
// live token per account (a new request invalidates the outstanding ones),
// single-use, and short-lived, so a mail forwarded to the wrong inbox is a
// dead link rather than a standing key.
export const fdPasswordReset = sqliteTable(
  'fd_password_reset',
  {
    id: text('id').primaryKey(),
    brandSlug: text('brand_slug').notNull(),
    accountId: text('account_id').notNull(),
    tokenHash: text('token_hash').notNull(),
    createdAt: text('created_at').notNull(),
    expiresAt: text('expires_at').notNull(),
    usedAt: text('used_at'),
    ipHash: text('ip_hash'),
  },
  (t) => [
    uniqueIndex('idx_password_reset_token').on(t.tokenHash),
    index('idx_password_reset_account').on(t.accountId, t.usedAt),
  ],
);

export const fdSession = sqliteTable(
  'fd_session',
  {
    id: text('id').primaryKey(),
    // Demo sessions come from a shared passcode (code_id); account sessions
    // carry account_id and are reused across sign-ins, so progress follows
    // the account rather than the browser.
    codeId: text('code_id').notNull(),
    accountId: text('account_id'),
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
    // Org-tooling variant ('claude' | 'chatgpt' | ...). NULL = applies to every
    // deployment. Blocks sharing an ordinal form a variant group; the worker
    // serves the one matching ORG_TOOLING, falling back to 'claude'.
    variant: text('variant'),
  },
  (t) => [index('idx_block_module').on(t.moduleId, t.ordinal)],
);

// Tutor chat transcript, one row per turn. Ordinal orders turns within a
// (session, module) thread; content stores the raw model output including the
// <paths> navigation trailer, which the client strips for display.
export const fdChatMessage = sqliteTable(
  'fd_chat_message',
  {
    id: text('id').primaryKey(),
    sessionId: text('session_id').notNull(),
    moduleId: text('module_id').notNull(),
    ordinal: integer('ordinal').notNull(),
    role: text('role').notNull(), // user | assistant
    content: text('content').notNull(),
    modelUsed: text('model_used'),
    createdAt: text('created_at').notNull(),
  },
  (t) => [index('idx_chat_session_module').on(t.sessionId, t.moduleId, t.ordinal)],
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

// A generated episode: the script is written once (Anthropic), audio is rendered
// lazily on first listen (Workers AI TTS) and cached in R2 under audio_key.
export const fdPodcast = sqliteTable(
  'fd_podcast',
  {
    id: text('id').primaryKey(),
    sessionId: text('session_id').notNull(),
    moduleId: text('module_id').notNull(),
    // 'default' — the one pre-made (or one-click) episode per module;
    // 'qa' — a follow-up answering the learner's questions after listening.
    kind: text('kind').notNull().default('default'),
    promptText: text('prompt_text'), // the learner's focus or questions, verbatim
    lengthPref: text('length_pref').notNull(), // quick | standard | deep
    title: text('title').notNull(),
    description: text('description').notNull(),
    scriptJson: text('script_json').notNull(), // [{speaker:'a'|'b', text}]
    outlineJson: text('outline_json'), // [{point, startLine}] — null before podcast-v4
    takeawaysJson: text('takeaways_json'), // ["…"] — null before podcast-v5
    visualJson: text('visual_json'), // concept map — null before podcast-v5
    totalChars: integer('total_chars').notNull(),
    modelUsed: text('model_used'),
    promptVersion: text('prompt_version'),
    voiceA: text('voice_a').notNull(),
    voiceB: text('voice_b').notNull(),
    audioKey: text('audio_key'),
    audioBytes: integer('audio_bytes'),
    audioAt: text('audio_at'),
    // Assembled episodes: a pre-voiced intro (personal, goal-flavored stock, or
    // generic stock) plays instantly while the custom body generates. Legacy
    // and Q&A episodes leave these null.
    introJson: text('intro_json'), // the intro lines actually used
    introAudioKey: text('intro_audio_key'), // R2 key of the pre-voiced intro
    introSource: text('intro_source'), // personal | goal:<id> | generic
    createdAt: text('created_at').notNull(),
  },
  (t) => [index('idx_podcast_session').on(t.sessionId)],
);

// Baked stock assets per module: the instant layer. 'generic' variant carries
// the full fallback body plus the study assets; goal variants carry an intro
// flavored for that goal. Baked lazily (arrival/intake) and self-healing —
// content_reviewed_at vs the module's blocks detects staleness.
export const fdPodcastStock = sqliteTable(
  'fd_podcast_stock',
  {
    id: text('id').primaryKey(),
    moduleId: text('module_id').notNull(),
    variant: text('variant').notNull(), // 'generic' | goal id
    beatsJson: text('beats_json').notNull(), // the fixed beats every intro previews
    introJson: text('intro_json').notNull(),
    bodyJson: text('body_json'), // generic variant only
    outlineJson: text('outline_json'),
    takeawaysJson: text('takeaways_json'),
    visualJson: text('visual_json'),
    introAudioKey: text('intro_audio_key'),
    title: text('title'),
    description: text('description'),
    modelUsed: text('model_used'),
    promptVersion: text('prompt_version'),
    contentReviewedAt: text('content_reviewed_at'),
    bakedAt: text('baked_at').notNull(),
  },
  (t) => [index('idx_podcast_stock_module').on(t.moduleId, t.variant)],
);

// A personal intro (name, role, goals woven into natural speech), generated in
// the background at intake / module completion so it's waiting before the
// learner reaches the podcast page.
export const fdPodcastIntro = sqliteTable(
  'fd_podcast_intro',
  {
    id: text('id').primaryKey(),
    sessionId: text('session_id').notNull(),
    moduleId: text('module_id').notNull(),
    introJson: text('intro_json').notNull(),
    audioKey: text('audio_key'),
    promptVersion: text('prompt_version'),
    createdAt: text('created_at').notNull(),
  },
  (t) => [index('idx_podcast_intro_session').on(t.sessionId, t.moduleId)],
);

// Per-module exercise data whose answer keys must never reach the client
// bundle: sorting exercises, activity rubrics, knowledge checks. One row per
// (module, kind); payload_json holds the full definition including keys, and
// the worker serves only the public projection.
export const fdExercise = sqliteTable(
  'fd_exercise',
  {
    id: text('id').primaryKey(),
    moduleId: text('module_id').notNull(),
    kind: text('kind').notNull(), // sorting | rubric | knowledge_check
    payloadJson: text('payload_json').notNull(),
    reviewedAt: text('reviewed_at').notNull(),
  },
  (t) => [index('idx_exercise_module').on(t.moduleId, t.kind)],
);

// Operator reviews from the admin console — the async backup path for the
// M8 peer exchange, and a general second-opinion layer on any submission.
export const fdReview = sqliteTable(
  'fd_review',
  {
    id: text('id').primaryKey(),
    submissionId: text('submission_id').notNull(),
    reviewer: text('reviewer').notNull(), // 'operator' for admin-console reviews
    body: text('body').notNull(),
    score: integer('score'),
    createdAt: text('created_at').notNull(),
  },
  (t) => [index('idx_review_submission').on(t.submissionId)],
);

// Admin-authored steering text: what the company wants emphasized, overall
// ('global'), per course ('course:<id>'), or per module ('module:<id>').
// One row per (brand, scope); the text rides into every LLM personalization
// prompt (tutor chat, podcast) alongside the module content.
export const fdBrandGuidance = sqliteTable(
  'fd_brand_guidance',
  {
    id: text('id').primaryKey(),
    brandSlug: text('brand_slug').notNull(),
    scope: text('scope').notNull(), // global | course:<id> | module:<id>
    body: text('body').notNull(),
    updatedAt: text('updated_at').notNull(),
  },
  (t) => [index('idx_guidance_brand').on(t.brandSlug, t.scope)],
);

// What a learner actually saw, content-addressed: one row per distinct
// version (hash of the serialized content), shared by every completion that
// witnessed that version. Unchanged content costs one row no matter how many
// learners see it; a patched block or regenerated exercise mints a new hash.
export const fdContentSnapshot = sqliteTable(
  'fd_content_snapshot',
  {
    hash: text('hash').primaryKey(), // sha256 hex of content_json
    kind: text('kind').notNull(), // module_blocks | exercise | activity_pack | podcast_episode
    moduleId: text('module_id').notNull(),
    contentJson: text('content_json').notNull(), // exactly the bytes that were hashed
    createdAt: text('created_at').notNull(), // first time this version was witnessed
  },
  (t) => [index('idx_snapshot_module').on(t.moduleId)],
);

// Append-only: one row per completion moment, pointing at the exact content
// version. fd_event says it happened; this says what it was — so "what did
// this learner see when they completed it?" stays answerable after the
// maintenance agent (or anyone) changes the content.
export const fdCompletionAudit = sqliteTable(
  'fd_completion_audit',
  {
    id: text('id').primaryKey(),
    sessionId: text('session_id').notNull(),
    moduleId: text('module_id').notNull(),
    // module_viewed | micro_viewed | module_completed | knowledge_check_submitted
    // | sort_submitted | choice_submitted | activity_submitted | podcast_listened
    activity: text('activity').notNull(),
    refId: text('ref_id'), // submission / podcast id when one exists
    contentHash: text('content_hash').notNull(),
    createdAt: text('created_at').notNull(),
  },
  (t) => [
    index('idx_audit_session').on(t.sessionId),
    index('idx_audit_module').on(t.moduleId, t.activity),
    index('idx_audit_hash').on(t.contentHash),
  ],
);

// The employee census: who should be taking the course. Imported via CSV in
// the admin (Workday/Okta sync will land on the same rows — the source column
// says where each row came from). Learner sessions are anonymous passcode
// entries, so matching to sessions is by self-reported name until SSO exists.
export const fdEmployee = sqliteTable(
  'fd_employee',
  {
    id: text('id').primaryKey(),
    brandSlug: text('brand_slug').notNull(),
    name: text('name').notNull(),
    email: text('email'),
    roleTitle: text('role_title'),
    managerName: text('manager_name'),
    managerEmail: text('manager_email'),
    level: text('level'),
    location: text('location'),
    startDate: text('start_date'),
    source: text('source').notNull().default('csv'), // csv | workday | okta
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
  },
  (t) => [index('idx_employee_brand').on(t.brandSlug)],
);

// Configurable nudges. Rules are evaluated against the census + funnel; the
// preview endpoint shows exactly who each rule would notify today. Delivery
// requires an email provider — rules and previews work without one.
export const fdReminderRule = sqliteTable(
  'fd_reminder_rule',
  {
    id: text('id').primaryKey(),
    brandSlug: text('brand_slug').notNull(),
    audience: text('audience').notNull(), // employee | manager
    trigger: text('trigger').notNull(), // not_started | inactive | incomplete
    days: integer('days').notNull(), // trigger-specific threshold in days
    template: text('template').notNull(), // {name} {first_name} {manager_name} {days} placeholders
    active: integer('active').notNull().default(1),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
  },
  (t) => [index('idx_reminder_brand').on(t.brandSlug)],
);

// Every message this deployment actually tried to send, and what came of it.
// Doubles as the dedupe key: a rule fires for one recipient at most once per
// its own day window. A deployment with no provider configured still writes
// rows here with status 'skipped' — the evaluation is real and recorded even
// when delivery isn't wired, so "who would we have emailed" stays answerable.
export const fdEmailSend = sqliteTable(
  'fd_email_send',
  {
    id: text('id').primaryKey(),
    brandSlug: text('brand_slug').notNull(),
    kind: text('kind').notNull(), // reminder:<ruleId> | kudos | endorse | deadline | commitment | commitment_ack
    toEmail: text('to_email').notNull(),
    subject: text('subject').notNull(),
    body: text('body').notNull(),
    status: text('status').notNull(), // sent | skipped | failed
    provider: text('provider'),
    error: text('error'),
    createdAt: text('created_at').notNull(),
  },
  (t) => [index('idx_email_send_dedupe').on(t.brandSlug, t.kind, t.toEmail, t.createdAt)],
);

// A manager acting on one of their reports: recognition, a module they want
// prioritized, or a date with a reason attached. Scoped by manager_email —
// the census column the manager view authorizes against — so a row can only
// exist for a pairing the roster actually declares.
export const fdManagerAction = sqliteTable(
  'fd_manager_action',
  {
    id: text('id').primaryKey(),
    brandSlug: text('brand_slug').notNull(),
    managerEmail: text('manager_email').notNull(), // stored lowercase
    employeeId: text('employee_id').notNull(),
    kind: text('kind').notNull(), // kudos | endorse | deadline
    moduleId: text('module_id'), // endorse
    dueDate: text('due_date'), // deadline
    body: text('body').notNull(),
    createdAt: text('created_at').notNull(),
    seenAt: text('seen_at'),
  },
  (t) => [index('idx_manager_action_emp').on(t.employeeId, t.createdAt), index('idx_manager_action_mgr').on(t.managerEmail)],
);

// The learner's stated finish-by date and, when they choose to share it, their
// manager's acknowledgment. Two-sided on purpose: a declaration into the void
// is a far weaker commitment than one somebody answered, and the acknowledgment
// is the manager's half of the bargain — protect the time.
export const fdCommitment = sqliteTable(
  'fd_commitment',
  {
    id: text('id').primaryKey(),
    brandSlug: text('brand_slug').notNull(),
    sessionId: text('session_id').notNull(),
    courseId: text('course_id').notNull(),
    targetDate: text('target_date').notNull(),
    note: text('note'),
    sharedWithManager: integer('shared_with_manager').notNull().default(0),
    managerAckAt: text('manager_ack_at'),
    managerNote: text('manager_note'),
    createdAt: text('created_at').notNull(),
  },
  (t) => [index('idx_commitment_session').on(t.sessionId, t.createdAt)],
);

// ---------- OAuth for the MCP connector ----------
// Claude's "add a connector" flow speaks OAuth 2.1: it registers itself, sends
// the learner through an approval screen, and trades a code for a token. These
// three tables are that handshake's whole state. The token maps to an
// fd_session row, so an assistant connected this way shares one progress
// record with the app — same as the URL-key path.

// Dynamically registered clients (RFC 7591). MCP clients register themselves
// at connect time; we keep what they declared plus the id we minted.
export const fdOauthClient = sqliteTable('fd_oauth_client', {
  id: text('id').primaryKey(), // the issued client_id
  name: text('name'),
  redirectUris: text('redirect_uris').notNull(), // JSON array, matched exactly at /authorize
  // MCP clients are public clients using PKCE; a secret is stored (hashed,
  // same PBKDF2 format as passcodes) only when one asked to be confidential.
  secretHash: text('secret_hash'),
  tokenEndpointAuthMethod: text('token_endpoint_auth_method').notNull(), // none | client_secret_post|basic
  metadataJson: text('metadata_json'), // the registration request, verbatim
  createdAt: text('created_at').notNull(),
});

// One-time authorization codes: short-lived, PKCE-bound, single-use. Stored as
// hashes — a database read never yields a usable code.
export const fdOauthCode = sqliteTable(
  'fd_oauth_code',
  {
    codeHash: text('code_hash').primaryKey(),
    clientId: text('client_id').notNull(),
    sessionId: text('session_id').notNull(),
    redirectUri: text('redirect_uri').notNull(),
    codeChallenge: text('code_challenge').notNull(),
    codeChallengeMethod: text('code_challenge_method').notNull(), // S256 only
    scope: text('scope'),
    resource: text('resource'), // RFC 8707 audience the token is bound to
    expiresAt: text('expires_at').notNull(),
    usedAt: text('used_at'), // set on first exchange; a second attempt is an attack signal
    createdAt: text('created_at').notNull(),
  },
  (t) => [index('idx_oauth_code_session').on(t.sessionId)],
);

// Access and refresh tokens, stored as hashes with an explicit expiry.
export const fdOauthToken = sqliteTable(
  'fd_oauth_token',
  {
    tokenHash: text('token_hash').primaryKey(),
    kind: text('kind').notNull(), // access | refresh
    clientId: text('client_id').notNull(),
    sessionId: text('session_id').notNull(),
    scope: text('scope'),
    resource: text('resource'),
    expiresAt: text('expires_at').notNull(),
    revokedAt: text('revoked_at'),
    createdAt: text('created_at').notNull(),
  },
  (t) => [index('idx_oauth_token_session').on(t.sessionId, t.kind)],
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
