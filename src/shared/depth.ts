// How much the learner wants to invest in this — not how many minutes they
// have today. One preference, read everywhere: plan composition, read length
// (micro vs full), tutor depth, default podcast length.
export type Depth = 'essentials' | 'balanced' | 'deep';

export type DepthChoice = { id: Depth; label: string; detail: string; tag?: string };

export const DEPTH_CHOICES: DepthChoice[] = [
  {
    id: 'essentials',
    label: 'Short and sweet',
    detail: 'Just the essentials: micro doses, quick takes, the judgment calls without the footnotes.',
  },
  {
    id: 'balanced',
    label: 'The full course, tightly run',
    detail: 'Complete modules and the graded activity — nothing padded, nothing skipped.',
    tag: 'Recommended',
  },
  {
    id: 'deep',
    label: 'Deep dive',
    detail: "Mastery mode: full reads, applied practice, the tutor's quiz mode, deep-dive podcasts. You're building expertise.",
  },
];

export const DEPTH_IDS = DEPTH_CHOICES.map((d) => d.id);

export const depthOf = (depth: string | undefined | null): Depth =>
  depth === 'essentials' || depth === 'deep' ? depth : 'balanced';
