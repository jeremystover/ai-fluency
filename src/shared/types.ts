// Types shared between the Worker API and the SPA.

export type BrandTokens = {
  color: Record<string, string>;
  fontDisplay: string;
  fontBody: string;
  fontUtility?: string;
  radius: string;
  logoUrl: string;
};

export type Brand = {
  slug: string;
  name: string;
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
  displayName?: string | null;
  roleLabel?: string | null;
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
export const PODCAST_HOSTS = {
  a: { name: 'Maya', tagline: 'asks what you would ask' },
  b: { name: 'Leo', tagline: 'knows the material cold' },
} as const;

export type PodcastEpisode = {
  id: string;
  moduleId: string;
  kind: 'default' | 'qa';
  title: string;
  description: string;
  lengthPref: PodcastLength;
  promptText: string | null;
  lines: PodcastLine[];
  estMinutes: number;
  audioCached: boolean;
  createdAt: string;
};

export type PodcastSummary = Omit<PodcastEpisode, 'lines'>;

export type PodcastListResponse = {
  episodes: PodcastSummary[];
  // Episode ids this session has pressed play on — the Q&A gate.
  playedEpisodeIds: string[];
  // False when this deployment lacks the binding/key — the UI degrades honestly.
  scriptEnabled: boolean;
  audioEnabled: boolean;
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
