// The fluency ladder the courses climb — L1 → L4, one level per course, and
// the course names match their audience: the Novice takes AI 101, the
// Practitioner takes AI 201, the Specialist takes AI 301, the Translator
// takes AI 401. Completing a course moves you up one rung. Offered at intake
// as a self-assessment; ids are the stable keys stored in fd_preference.

export type SelfLevelChoice = { id: string; label: string; detail: string };

export const SELF_LEVEL_CHOICES: SelfLevelChoice[] = [
  {
    // One rung for everyone at the start — the averse and the merely-new need
    // the same foundations with different bedside manner, and disposition is
    // captured by the intake's aiUsage answer and the diagnostic, not a label
    // nobody self-selects honestly.
    id: 'l1',
    label: 'L1 · The Novice',
    detail: "Whether I've stayed away or just haven't started, AI mostly happens around me — I don't yet have a working model of what it is or when to trust it.",
  },
  {
    id: 'l2',
    label: 'L2 · The Practitioner',
    detail: "I have the working mental model — I can brief AI properly and catch it when it's wrong — but every use starts from scratch. I'm ready to make it repeatable.",
  },
  {
    id: 'l3',
    label: 'L3 · The Specialist',
    detail: 'My workflows stick: set up once, they keep working, with verification I trust. Now I want AI deep in the specifics of my actual role.',
  },
  {
    id: 'l4',
    label: 'L4 · The Translator',
    detail: 'I lead adoption beyond my own desk — coaching other functions, evaluating vendors, running pilots that produce evidence, and owning the policy for what AI may touch.',
  },
];

export const SELF_LEVEL_IDS = SELF_LEVEL_CHOICES.map((l) => l.id);

// Sessions from before the ladder collapsed five rungs to four may have
// stored 'l5' (the old Steward); it reads as the Translator now.
export const normalizeSelfLevel = (id: string | undefined) => (id === 'l5' ? 'l4' : id);

export const selfLevelLabel = (id: string) => SELF_LEVEL_CHOICES.find((l) => l.id === normalizeSelfLevel(id))?.label ?? id;
