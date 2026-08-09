// The fluency ladder the courses climb — L1 → L5, one level per course
// (AI 101 takes The Risk to The Novice, AI 201 makes The Practitioner, and
// so on). Offered at intake as a self-assessment; ids are the stable keys
// stored in fd_preference.

export type SelfLevelChoice = { id: string; label: string; detail: string };

export const SELF_LEVEL_CHOICES: SelfLevelChoice[] = [
  {
    // The course material calls L1 "The Risk"; at intake we use a gentler
    // name — plenty of avoiders stay away deliberately, not from ignorance.
    id: 'l1',
    label: 'L1 · The Avoider',
    detail: "I've stayed away so far — out of caution, principle, or just no time to start — and AI mostly happens around me.",
  },
  {
    id: 'l2',
    label: 'L2 · The Novice',
    detail: "I have a working mental model — I can brief AI properly and catch it when it's wrong — but every use starts from scratch.",
  },
  {
    id: 'l3',
    label: 'L3 · The Practitioner',
    detail: "I've built workflows that stick: set up once, they keep working, with verification I trust.",
  },
  {
    id: 'l4',
    label: 'L4 · The Translator',
    detail: 'I lead adoption beyond my own desk — coaching other functions, evaluating vendors, running pilots that produce evidence.',
  },
  {
    id: 'l5',
    label: 'L5 · The Steward',
    detail: 'I own the organizational answer: policy, risk, and governance for what AI may touch and who verifies it.',
  },
];

export const SELF_LEVEL_IDS = SELF_LEVEL_CHOICES.map((l) => l.id);

export const selfLevelLabel = (id: string) => SELF_LEVEL_CHOICES.find((l) => l.id === id)?.label ?? id;
