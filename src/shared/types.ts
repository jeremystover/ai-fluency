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
};

export type ContentBlock = {
  id: string;
  moduleId: string;
  ordinal: number;
  kind: 'prose' | 'callout' | 'try_this' | 'exercise' | 'takeaways' | 'table';
  layer: 'stable' | 'volatile';
  body: string;
  dependsOn?: string[];
  reviewedAt: string;
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
};

export type CourseCard = {
  id: string;
  title: string;
  level: string;
  blurb: string;
  status: 'open' | 'locked';
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

export type SortingBucket = { id: 'well' | 'partly' | 'badly'; label: string; hint: string };
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
  time?: number; // minutes available this sitting; 0 = just exploring
  styles?: string[]; // reading | interactive | podcast | assistant_mcp | voice
  goals?: string[]; // fluency | workflows | apply | news | tools | safety | coach | confidence
  objective?: string; // free-text refinement of the goals
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
  // False when this deployment lacks the binding/key — the UI degrades honestly.
  scriptEnabled: boolean;
  audioEnabled: boolean;
};

export type ModuleContentResponse = {
  module: ModuleCard;
  blocks: ContentBlock[];
  stamps: { conceptsReviewedAt: string | null; examplesCurrentAsOf: string | null };
  estReadMinutes: number;
};
