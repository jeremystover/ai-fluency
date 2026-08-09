// How an episode's audio is split for progressive playback. Deterministic and
// shared: the worker renders/caches by these boundaries, the player maps
// chunks back to transcript lines for highlighting and seeking.
import type { PodcastLine } from './types';

export type AudioChunk = { start: number; end: number }; // line indexes, end exclusive

// The first cut lands early (~10% of the speech) so playback starts in seconds;
// the rest split the remainder evenly. Cuts happen at speaker-turn boundaries,
// so the hand-off between chunks sounds like a natural beat, not a splice.
const CUTS = [0.1, 0.325, 0.55, 0.775];
const MIN_LINES_PER_CHUNK = 2;

export function chunkPlan(lines: PodcastLine[]): AudioChunk[] {
  const total = lines.reduce((sum, l) => sum + l.text.length, 0);
  if (total === 0 || lines.length === 0) return [{ start: 0, end: lines.length }];
  const chunks: AudioChunk[] = [];
  let start = 0;
  let acc = 0;
  let cut = 0;
  for (let i = 0; i < lines.length; i++) {
    acc += lines[i].text.length;
    while (cut < CUTS.length && acc >= CUTS[cut] * total) {
      if (i + 1 - start >= MIN_LINES_PER_CHUNK && lines.length - (i + 1) >= MIN_LINES_PER_CHUNK) {
        chunks.push({ start, end: i + 1 });
        start = i + 1;
      }
      cut++;
    }
  }
  if (start < lines.length) chunks.push({ start, end: lines.length });
  return chunks.length ? chunks : [{ start: 0, end: lines.length }];
}
