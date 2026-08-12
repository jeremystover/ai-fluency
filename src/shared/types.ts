// Types shared between the Worker API and the SPA.

export type BrandTokens = {
  color: Record<string, string>;
  fontDisplay: string;
  fontBody: string;
  fontUtility?: string;
  radius: string;
  logoUrl: string;
};

// How someone got in, and therefore what the product owes them. This is a
// property of the session, not the deployment: both doors are always open and
// the two kinds of learner coexist.
//   demo    — entered with a shared passcode or promo code. Anonymous: no
//             census identity, so no manager, no cross-device progress.
//   account — signed in with email + password (SSO lands here too). Progress
//             follows the account, and the census can match them exactly.
export type SessionKind = 'demo' | 'account';

export type Brand = {
  slug: string;
  name: string;
  // Which doors this deployment can actually open right now — derived from
  // data, not configuration. A deployment with codes but no census roster
  // shows only the demo door; one with both shows both.
  doors: { passcode: boolean; accounts: boolean };
  // Whether "forgot your password" can actually deliver. Self-serve reset
  // needs a mail provider; without one the sign-in screen points at the
  // admin's temp-password path instead of offering a link that goes nowhere.
  canResetPassword: boolean;
  tokens: BrandTokens;
  voice: { greeting: string; signoff: string };
  // Assistants the company provisions (e.g. ["Claude"]). When the profile
  // declares this, the intake skips its "which AI tools?" question.
  aiTools?: string[];
};

export type ContentBlock = {
  id: string;
  moduleId: string;
  ordinal: number;
  kind: 'prose' | 'callout' | 'try_this' | 'exercise' | 'takeaways' | 'table' | 'calibration_prompt' | 'reveal';
  layer: 'stable' | 'volatile';
  body: string;
  dependsOn?: string[];
  reviewedAt: string;
};

// What a module's seeded package supports — the modality hub renders from this.
export type ModuleCapabilities = {
  read: boolean;
  micro: boolean;
  chat: boolean;
  podcast: boolean;
  sorting: boolean;
  activity: boolean;
  knowledgeCheck: boolean;
};

export type ModuleCard = {
  id: string;
  courseId: string;
  ordinal: number;
  title: string;
  blurb: string;
  status: 'open' | 'locked';
  estMinutes: number;
};

// Computed per session on /api/path. Nothing hard-locks: prerequisites are
// advisory (unlockHint carries the recommendation), and learners go in any
// order.
//   open        — content available in this demo, go
//   full_course — yours whenever; content ships in the full course
export type PathModule = ModuleCard & {
  access: 'open' | 'full_course';
  prereqs: string[];
  unlockHint?: string;
  microMinutes: number;
  completed: boolean; // module_completed logged for this module
  testedOut: boolean; // cleared by assessment instead of completion (M1: diagnostic)
  // Why this module is on THEIR path — goal labels and diagnostic reads, shown
  // verbatim so the learner can see the machine using their answers.
  recommendedFor: string[];
  completedAt: string | null; // first module_completed event
  bestCheck: { correct: number; total: number } | null; // best knowledge-check attempt
};

// The path page's progress instrument — every number derived from the
// append-only funnel, never invented.
export type PathSummary = {
  openTotal: number; // open modules across courses
  doneCount: number; // completed or tested-out among them
  testedOutCount: number; // the head start the diagnostic earned, counted separately
  minutesRemaining: number; // est minutes across open modules still uncleared
  minutesInvested: number; // gap-sum estimate, same math as the admin's
  activeDays7: number; // distinct active days in the last 7
  activeDays: string[]; // those days as YYYY-MM-DD — the week strip renders from them
  lastActiveAt: string | null; // most recent event, so a return after a gap can be greeted as one
  reviewDue: number; // missed questions due back now — the full queue lives on the record
  checks: { passed: number; correct: number; total: number } | null; // best attempts; null = none yet
};

export type PathRecommendation = { moduleId: string; reasons: string[] };

// ---------- the library ----------

// A lesson line in the catalog — the real ## heading, anchored to its block
// so the syllabus deep-links into the read.
export type LibraryLesson = { title: string; blockId: string; lab: boolean };

export type LibraryModule = ModuleCard & {
  microMinutes: number;
  lessons: LibraryLesson[]; // empty for full-course modules (nothing seeded)
  ways: { read: boolean; listen: boolean; tutor: boolean; exercise: boolean; lab: boolean; graded: boolean; check: boolean };
  completed: boolean;
  testedOut: boolean;
  completedAt: string | null;
  bestCheck: { correct: number; total: number } | null;
  reviewDue: number; // this module's misses due back now — same spacing as the record's queue
};

export type LibraryCourse = CourseCard & { modules: LibraryModule[] };

export type LibraryResponse = {
  courses: LibraryCourse[]; // every course, module-less tiers included
  totals: { courses: number; modules: number; lessons: number; minutes: number };
  clearedCount: number;
  nextModuleId: string | null; // same ranking brain as the path's queue
  resume: PathResume | null; // the open loop, same computation as the path's hero
  reviewDue: number; // misses due back now, across the program
};

// The module this session last touched without clearing it — an open loop the
// path can offer to close. `via` is the surface the last touch came from, so
// "pick up where you left off" returns them to that surface, not a generic page.
export type PathResume = {
  moduleId: string;
  at: string;
  via: 'read' | 'chat' | 'podcast' | 'check' | 'exercise' | 'activity';
};

export type PathResponse = {
  modules: PathModule[];
  courses: CourseCard[];
  summary: PathSummary;
  // e.g. "your diagnostic says you expect too little from these tools"
  diagnosticNote: string | null;
  upNext: PathRecommendation[]; // ranked, top first
  resume: PathResume | null;
  // Accounts mode only — both are empty for anonymous passcode sessions, which
  // have no census identity and therefore no manager.
  managerSignals: ManagerSignal[];
  commitment: CommitmentResponse | null;
  // True when this account has reports on the census — the manager view's door.
  isManager: boolean;
  // Whether this session has ever reached the course through an assistant. The
  // connector is a pull surface, not a push one: it can't notify anyone. What it
  // does is make resuming free for someone already in Claude for work reasons,
  // which is why adoption is worth nudging at all.
  mcpConnected: boolean;
};

export type CourseCard = {
  id: string;
  title: string;
  level: string;
  blurb: string;
  status: 'open' | 'locked';
  recommendedFor?: string[]; // same shape as PathModule.recommendedFor
};

export type CalibrationOption = { label: string; pct: number };

// What the client sees — no answer keys.
export type DiagnosticItemPublic =
  | { id: string; kind: 'knowledge'; prompt: string; options: string[] }
  | { id: string; kind: 'calibration'; prompt: string; scale: CalibrationOption[] };

export type DiagnosticFeedback =
  | { kind: 'knowledge'; correct: boolean; correctIndex: number; explanation: string }
  | { kind: 'calibration'; keyPct: number; keyBucket: 'well' | 'partly' | 'badly'; predictedPct: number; delta: number; reasoning: string };

export type DiagnosticResult = {
  answered: number;
  total: number;
  knowledge: { correct: number; total: number };
  calibration: {
    points: { itemId: string; task: string; predictedPct: number; keyPct: number; delta: number; keyBucket: string }[];
    meanDelta: number;
    meanAbsDelta: number;
    direction: 'over' | 'under' | 'mixed' | 'calibrated';
    headline: string;
    detail: string;
  };
};

export type SortingBucket = { id: string; label: string; hint: string; rank?: number; pct?: number };
export type SortingTaskPublic = { id: string; text: string };
export type SortingReveal = {
  results: { taskId: string; text: string; chosen: string; key: string; correct: boolean; reasoning: string }[];
  score: { correct: number; total: number };
  overAssigned: number; // tasks placed in a more capable bucket than the key
  underAssigned: number;
  pattern: string;
  postscript: string;
};

export type RubricDimension = { name: string; score: number; comment: string };
export type GradeResult = {
  status: 'graded' | 'saved_ungraded' | 'rate_limited';
  submissionId: string;
  dimensions?: RubricDimension[];
  total?: number;
  summary?: string;
  message?: string;
};

// Tutor chat. Assistant content is raw model output — it may end with a
// `<paths>a|b|c</paths>` trailer the client parses into next-move chips.
export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
};

export type ChatHistoryResponse = {
  moduleId: string;
  moduleTitle: string;
  messages: ChatMessage[];
  limits: { maxMessageChars: number };
  // What this deployment's bindings support: mic transcription and spoken replies.
  voice: VoiceStatus;
};

export type VoiceStatus = { transcribe: boolean; speech: boolean };
export type TranscribeResponse = { text: string };

// NDJSON lines streamed from POST /api/module/:id/chat.
export type ChatStreamLine =
  | { type: 'delta'; text: string }
  | { type: 'done'; messageId: string }
  | { type: 'error'; message: string };

export type IntakePrefs = {
  start?: 'diagnostic' | 'module' | 'chat';
  depth?: 'essentials' | 'balanced' | 'deep'; // how much they want to invest — see shared/depth.ts
  styles?: string[]; // single pick at intake: reading | interactive | quiz_first | podcast | assistant_mcp ('voice' survives from older sessions)
  goals?: string[]; // fluency | workflows | apply | news | tools | safety | coach | confidence
  objective?: string; // free-text refinement of the goals
  aiUsage?: string; // free-text: how they use AI in their job today
  aiTools?: string[]; // claude | chatgpt | gemini | other — asked unless the company profile already says
  aiToolOther?: string; // free-text fill-in when 'other' is picked
  selfLevel?: string; // self-assessed fluency level — see shared/levels.ts
  roleId?: string; // People role — see shared/roles.ts; resolves to the 301 specialist track
  roleOther?: string; // free-text fill-in when 'other' is picked
  // Opt-in: lets a manager read this learner's graded activity submissions in
  // their team view. Off by default, and it never covers the tutor transcript,
  // the diagnostic self-assessment, or which questions were missed.
  shareWork?: boolean;
};

export type PlanStep = {
  id: string;
  title: string;
  detail: string;
  minutes: number;
  route: string;
  state: 'done' | 'now' | 'later';
};

export type PlanResponse = {
  greeting: string;
  steps: PlanStep[];
  notes: string[];
  goals: string[];
  objective: string | null;
  nextRoute: string;
};

export type MeResponse = {
  authenticated: boolean;
  // How this particular learner got in. Demo and account learners use the same
  // deployment at the same time; features needing a census identity (the
  // manager view, sharing a finish date, team-scoped tutor guidance) resolve
  // to their empty state for a demo session rather than being switched off
  // deployment-wide.
  kind?: SessionKind;
  displayName?: string | null;
  roleLabel?: string | null;
  // Present when this session belongs to a real account.
  account?: { email: string; name: string } | null;
  brandSlug?: string;
  prefs?: IntakePrefs;
  progress: {
    intakeDone: boolean;
    diagnosticDone: boolean;
    sortDone: boolean;
    activityGraded: boolean;
    moduleCompleted: boolean;
    chatStarted: boolean;
    podcastTried: boolean;
  };
};

// ---------- podcast creator ----------

export type PodcastLength = 'quick' | 'standard' | 'deep';

export type PodcastLine = { speaker: 'a' | 'b'; text: string };

// The two hosts are fixed personas; their voices map to Workers AI Aura speakers.
// Maya is the expert, Leo asks the questions — deliberately against the
// familiar-trope grain of curious-woman/expert-man.
export const PODCAST_HOSTS = {
  a: { name: 'Maya', tagline: 'knows the material cold' },
  b: { name: 'Leo', tagline: 'asks what you would ask' },
} as const;

// The show's identity: every episode opens on the call sign and ends with
// Maya delivering the sign-off line verbatim — the ritual is what makes
// episodes feel like episodes instead of conversations that stop.
export const PODCAST_SHOW = {
  name: 'Fluent',
  signoff: 'Stay curious — and check the work.',
} as const;

// A waypoint the listener can follow while the episode plays: a short label
// anchored to the line where that beat of the conversation starts.
export type PodcastOutlinePoint = { point: string; startLine: number };

// A small concept map of the episode's core idea: one hub, labeled spokes,
// and optional cross-links between spokes. Laid out deterministically
// client-side (hub center, spokes on an ellipse) — no graph library.
export type PodcastVisual = {
  shape?: 'hub' | 'flow' | 'ladder' | 'quad' | 'venn'; // absent on pre-v9 rows = hub
  title: string;
  insight?: string; // the one sentence that tells the learner what to see
  hub?: string;
  spokes?: { label: string; relation: string }[];
  links?: { from: number; to: number; label: string }[]; // spoke indexes
  steps?: { label: string; arrow?: string }[]; // flow
  rungs?: { label: string; note?: string }[]; // ladder, bottom to top
  axes?: { xLow: string; xHigh: string; yLow: string; yHigh: string }; // quad
  quadrants?: string[]; // quad: TL, TR, BL, BR
  star?: number; // quad: the quadrant to aim for
  circles?: { label: string }[]; // venn, exactly two
  overlap?: string; // venn
};

export type PodcastEpisode = {
  id: string;
  moduleId: string;
  kind: 'default' | 'qa';
  title: string;
  description: string;
  lengthPref: PodcastLength;
  promptText: string | null;
  lines: PodcastLine[];
  outline: PodcastOutlinePoint[] | null; // null on episodes written before podcast-v4
  takeaways: string[] | null; // null before podcast-v5
  visual: PodcastVisual | null; // null before podcast-v5, and on Q&A segments where a map adds nothing
  estMinutes: number;
  audioCached: boolean;
  // 'assembled' — a pre-voiced intro plays instantly while the custom body
  //   generates (chunk 0 = intro, later chunks = body);
  // 'chunked' — audio streams in parts, all custom (Q&A and legacy default);
  // 'single' — one legacy pre-chunking MP3 already sits in the cache.
  audioMode: 'single' | 'chunked' | 'assembled';
  chunkCount: number;
  // Assembled episodes: how many of `lines` belong to the intro (0 otherwise),
  // and whether the custom body is still being written (lines end at the intro
  // until it lands — the player keeps rolling and the transcript grows).
  introLineCount: number;
  bodyPending: boolean;
  createdAt: string;
};

export type PodcastSummary = Omit<PodcastEpisode, 'lines' | 'outline' | 'takeaways' | 'visual'>;

export type PodcastListResponse = {
  episodes: PodcastSummary[];
  // Episode ids this session has pressed play on — the Q&A gate.
  playedEpisodeIds: string[];
  // False when this deployment lacks the binding/key — the UI degrades honestly.
  scriptEnabled: boolean;
  audioEnabled: boolean;
  // True when voices render in the background after each script (needs AI + R2);
  // false means the client should fetch audio directly and wait on a live render.
  audioPrerenders: boolean;
};

// This session's history with the module over the MCP connection — the same
// events the MCP tools write (via/modality markers), summarized so the module
// page can show "your assistant has been here" instead of generic setup copy.
export type McpTouch = {
  kind: 'taught' | 'quizzed' | 'applied' | 'teach_back' | 'predicted' | 'completed';
  detail: string | null; // score, task snippet — whatever makes the row legible
  at: string;
};

export type ModuleMcpActivity = {
  everUsed: boolean; // any MCP activity on this session, any module
  touches: McpTouch[]; // this module only, newest first, one per kind
};

export type ModuleContentResponse = {
  module: ModuleCard;
  blocks: ContentBlock[];
  stamps: { conceptsReviewedAt: string | null; examplesCurrentAsOf: string | null };
  estReadMinutes: number;
  capabilities: ModuleCapabilities;
  // Numeric prediction fields the module's opening calibration prompt captures
  // (rubric-declared), with any values this session already recorded.
  openingFields: CalibrationField[];
  openingValues: Record<string, number>;
  mcp: ModuleMcpActivity;
};

// ---------- generic activity & knowledge check ----------

// `actualFor` marks an activity-time field as the measured outcome for an
// earlier numeric prediction: same-module key ("items") or cross-module
// ("ai201-m1:savings"). Submitting it closes that prediction's loop —
// actual recorded, delta computed — instead of opening a new one.
export type CalibrationField = { key: string; label: string; hint?: string; placeholder?: string; min?: number; max?: number; actualFor?: string };

// A human review from the operator's queue, surfaced back to the learner.
// onLatest is false when the learner resubmitted after the review was written.
export type OperatorReview = {
  id: string;
  reviewer: string;
  body: string;
  score: number | null;
  createdAt: string;
  onLatest: boolean;
};

// A prior capstone stage's submission, threaded into later stages: shown to
// the learner above the editor and to the grader in its prompt.
export type PriorStage = {
  moduleId: string;
  ordinal: number;
  title: string;
  body: string;
  gradedAt: string | null;
  total: number | null;
};

// One closed (or still-open) prediction loop on the calibration trail.
export type TrailPoint = {
  moduleId: string;
  label: string;
  predicted: number;
  actual: number | null;
  delta: number | null;
};

// The reckoning data for modules whose rubric sets includeTrail (M7, M8):
// numeric loops, per-module sorting scores, and the free-text predictions.
export type CalibrationTrail = {
  points: TrailPoint[];
  sorts: { moduleId: string; correct: number; total: number; overAssigned: number; underAssigned: number }[];
  predictions: { moduleId: string; text: string }[];
};

export type ActivityConfig = {
  blocks: ContentBlock[];
  minChars: number;
  intro?: string;
  submitLabel?: string;
  calibration: CalibrationField[];
  reviews: OperatorReview[];
  priorStages: PriorStage[];
  // The learner's free-text prediction from this module's opening calibration prompt.
  openingPrediction: string | null;
  trail: CalibrationTrail | null;
  lastSubmission: {
    id: string;
    body: string;
    gradedAt: string | null;
    total: number | null;
    dimensions: RubricDimension[] | null;
    summary: string | null;
  } | null;
};

export type KnowledgeCheckPublic = {
  title: string;
  note: string | null;
  questions: { id: string; prompt: string; options: string[] }[];
};

export type KnowledgeCheckResult = {
  score: { correct: number; total: number };
  // `study` points a missed question back at the lesson block that teaches
  // it — the results screen turns misses into a study list.
  results: {
    id: string;
    chosenIndex: number;
    correct: boolean;
    correctIndex: number;
    explanation: string;
    study?: { blockId: string; label: string };
  }[];
};

// ---------- the learner's record ----------

// What a learner has demonstrated on a module, in rising order of evidence.
// Every stage is earned by a specific recorded act — none is self-declared,
// and none can be reached by clicking through.
export type MasteryStage = 'untouched' | 'read' | 'checked' | 'applied' | 'taught';

export type ModuleMastery = {
  moduleId: string;
  title: string;
  courseId: string;
  ordinal: number;
  stage: MasteryStage;
  bestCheck: { correct: number; total: number } | null;
  activityScore: number | null; // out of 20, latest graded submission
  teachBackScore: number | null; // out of 15, best teach-back over MCP
  completedAt: string | null;
};

// A question this session got wrong and hasn't since got right. Spacing is
// deliberately legible rather than clever: a first miss comes back in three
// days, a repeat miss the next day.
export type ReviewItem = {
  moduleId: string;
  moduleTitle: string;
  questionId: string;
  prompt: string;
  missedAt: string;
  dueAt: string;
  due: boolean;
  misses: number;
};

export type CalibrationRecord = {
  diagnostic: { meanAbsDelta: number; direction: 'over' | 'under' | 'mixed' | 'calibrated' } | null;
  points: TrailPoint[]; // closed prediction loops, oldest first
  sorts: { moduleId: string; correct: number; total: number; overAssigned: number; underAssigned: number }[];
  // How the gap between prediction and outcome has moved across closed loops.
  // Null until there are enough closed loops to say anything honest.
  trend: 'sharpening' | 'steady' | 'drifting' | null;
};

export type Badge = { id: string; label: string; detail: string; earnedAt: string | null };

// The completion credential. It names the exact content versions the learner
// witnessed (fd_content_snapshot hashes) — which is what makes it a verifiable
// record of what was learned rather than a decoration.
export type Credential = {
  courseId: string;
  courseTitle: string;
  earned: boolean;
  cleared: number;
  total: number;
  issuedAt: string | null;
  contentHashes: string[];
};

// A capability claim backed by a specific graded artifact. Derived, never
// generated — the evidence line is the real score and the grader's own words.
export type SkillStatement = { claim: string; evidence: string };

export type RecordResponse = {
  name: string | null;
  roleLabel: string | null;
  mastery: ModuleMastery[];
  review: ReviewItem[];
  calibration: CalibrationRecord;
  badges: Badge[];
  credentials: Credential[];
  skills: SkillStatement[];
};

// ---------- the manager view ----------

// What a manager may see about one of their reports. Deliberately short: course
// progress, and graded work only when that learner opted in. It carries no
// diagnostic self-rating, no calibration, no tutor transcript, and no record of
// which questions were missed — this course asks people to admit what they
// don't know, and that bargain breaks the moment their manager is reading.
export type TeamMember = {
  employeeId: string;
  name: string;
  roleTitle: string | null;
  status: 'not_started' | 'started' | 'in_progress' | 'complete';
  modulesCleared: number;
  modulesTotal: number;
  lastSeenAt: string | null;
  // Present only with the learner's explicit consent (prefs.shareWork).
  work: { moduleTitle: string; score: number | null; summary: string | null; submissionId: string }[] | null;
  sharesWork: boolean;
  // Their stated finish-by, when they chose to share it.
  commitment: { id: string; targetDate: string; note: string | null; acknowledgedAt: string | null } | null;
  // One thing to ask in the next 1:1, drawn from the module they most recently
  // cleared — the course's own takeaways, not a generated prompt.
  askAbout: { moduleTitle: string; question: string } | null;
  recentActions: { kind: string; body: string; createdAt: string }[];
};

// Aggregate only, and suppressed below a floor — a "team" of two is two named
// people wearing a trench coat, and this view is not a way to identify them.
export type TeamAggregate = {
  size: number;
  started: number;
  completedAny: number;
  // Topics the team as a whole is weakest on, from missed knowledge-check
  // questions across the team. Never attributed to anyone.
  weakSpots: { moduleTitle: string; prompt: string; missedBy: number }[] | null;
  // Org-wide comparison, so a manager can tell "my team" from "everyone".
  orgStarted: number;
  orgSize: number;
};

export type ManagerResponse = {
  isManager: boolean;
  managerEmail: string | null;
  team: TeamMember[];
  aggregate: TeamAggregate | null;
  teamGuidance: string | null;
  // The manager's own learner progress — "leader goes first" is stated, not implied.
  selfCleared: number;
  selfTotal: number;
};

// The learner's half of the two-sided commitment.
export type CommitmentResponse = {
  commitment: {
    id: string;
    courseId: string;
    targetDate: string;
    note: string | null;
    sharedWithManager: boolean;
    managerAckAt: string | null;
    managerNote: string | null;
  } | null;
  managerName: string | null; // who it would be shared with, from the census
  canShare: boolean; // false when the roster has no manager email for them
};

// What a manager has aimed at this learner, surfaced on their path.
export type ManagerSignal = {
  id: string;
  kind: 'kudos' | 'endorse' | 'deadline';
  moduleId: string | null;
  dueDate: string | null;
  body: string;
  managerName: string | null;
  createdAt: string;
};

// ---------- choice exercise ----------

// Single-answer exercise over a set of stimulus artifacts (M3's find-the-lossy-step).
// The key never ships until the learner commits.
export type ChoicePublic = {
  title: string;
  intro: string;
  artifacts: { label: string; body: string }[];
  options: { id: string; label: string }[];
};

export type ChoiceResult = {
  correct: boolean;
  key: string;
  reasoning: string;
  closing: string;
};
