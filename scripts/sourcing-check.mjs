// S-8 · point-of-claim sourcing checker.
//
// The authoring rule (brief §4): a `[V]` figure carries its sample and date AT
// THE POINT OF CLAIM, not only in the sources block. A learner reading a lesson
// should not have to scroll to know who counted, how many, and when.
//
// The first evidence-library pass measured the gap by hand — 92 of 189 claims in
// one group carried no named source at the point of claim. Doing that by hand
// again for every future change is not sustainable, so this does it mechanically.
//
// Method, and its deliberate limits:
//
//   A "claim" is a figure in a volatile block — a percentage, a comma-grouped
//   number, an "N in ten", or a multiplier. For each one, the paragraph it sits
//   in is searched for an attribution signal: a proper-noun source drawn from
//   THAT MODULE'S OWN sources block, or a sample/date marker (n=, "survey of",
//   "fielded", a month-year). Self-tuning per module, so no source list needs
//   maintaining as the curriculum grows.
//
//   It reports paragraphs, not sentences, because a figure attributed in the
//   sentence before is correctly attributed and flagging it would train authors
//   to ignore the tool.
//
//   It cannot judge whether an attribution is CORRECT. It only sees whether one
//   is present. A wrong sample stated confidently passes — that is the evidence
//   library's job, not this one's.
//
// Usage:
//   node scripts/sourcing-check.mjs                 # whole curriculum
//   node scripts/sourcing-check.mjs --course ai301-hrbp
//   node scripts/sourcing-check.mjs --module ai301-hrbp-m1 --verbose
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const arg = (n) => (args.includes(n) ? args[args.indexOf(n) + 1] : null);
const ONLY_COURSE = arg('--course');
const ONLY_MODULE = arg('--module');
const VERBOSE = args.includes('--verbose');

const MONTH = 'January|February|March|April|May|June|July|August|September|October|November|December';

// A figure worth attributing. Deliberately excludes bare years and small counts
// like "three implications", which are structural rather than evidential.
const FIGURE = new RegExp(
  [
    String.raw`\d+(?:\.\d+)?%`, // 68%, 2.8%
    String.raw`\b\d{1,3}(?:,\d{3})+\b`, // 1,722
    String.raw`\b(?:one|two|three|four|five|six|seven|eight|nine)\s+in\s+(?:five|ten|four|three)\b`, // three in ten
    String.raw`\b\d+(?:\.\d+)?x\b`, // 7x
    String.raw`\bn\s*=\s*[\d,]+`, // n=1,722
  ].join('|'),
  'gi',
);

// Signals that an attribution is present in the same paragraph.
const SAMPLE = new RegExp(
  [
    String.raw`\bn\s*=`,
    String.raw`\bsample\b`,
    String.raw`\bsurvey(?:ed|s)?\s+of\b`,
    String.raw`\bfielded\b`,
    String.raw`\brespondents?\b`,
    String.raw`\bparticipants?\b`,
    String.raw`\b(?:${MONTH})\s+\d{4}\b`,
    String.raw`\b\d{1,2}\s+(?:${MONTH})\s+\d{4}\b`,
  ].join('|'),
  'i',
);

// Proper nouns from this module's own sources block — the per-module source list.
function sourceNames(blocks) {
  const src = blocks.find((b) => (b.body ?? '').startsWith('## Sources'));
  if (!src) return [];
  const names = new Set();
  for (const w of src.body.match(/\b[A-Z][A-Za-z&.’']{2,}\b/g) ?? []) {
    if (new RegExp(`^(?:${MONTH})$`).test(w)) continue;
    // Ordinary words that open sentences or headings carry no attribution signal.
    if (/^(The|This|That|And|But|Builds|Original|Same|Note|Every|Where|What|Which|Module|Lesson|Sources|Survey|Report|Figures|Annual|Adoption|Both|All|Its|His|Her|Their|One|Two|Three|Four|Five)$/.test(w)) continue;
    names.add(w);
  }
  return [...names];
}

const packagesDir = join(root, 'content', 'modules');
const rows = [];
for (const moduleId of readdirSync(packagesDir).sort()) {
  if (ONLY_MODULE && moduleId !== ONLY_MODULE) continue;
  if (ONLY_COURSE && !moduleId.startsWith(ONLY_COURSE)) continue;
  const path = join(packagesDir, moduleId, 'blocks.json');
  if (!existsSync(path)) continue;
  const blocks = JSON.parse(readFileSync(path, 'utf8'));
  const names = sourceNames(blocks);
  const nameRe = names.length ? new RegExp(`\\b(?:${names.map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`) : null;

  for (const block of blocks) {
    if (block.layer !== 'volatile') continue;
    const body = block.body ?? '';
    if (body.startsWith('## Sources')) continue;
    // The window a reader actually has: this paragraph, plus everything back to
    // the nearest sub-heading (capped). A figure in a bullet list under "The METR
    // trial `[V]`" is attributed — flagging each bullet separately would train
    // authors to ignore the tool, which is worse than not having it.
    const LOOKBACK = 900;
    const LOOKAHEAD = 600;
    let cursor = 0;
    for (const para of body.split(/\n\s*\n/)) {
      const start = body.indexOf(para, cursor);
      cursor = start + para.length;
      const figures = para.match(FIGURE);
      if (!figures) continue;
      const before = body.slice(Math.max(0, start - LOOKBACK), start);
      const sinceHeading = before.slice(before.lastIndexOf('\n#') + 1);
      // Forward too: the best-handled claim in the curriculum states its figures
      // and then spends the next paragraph on who funded them. A reader reads on,
      // so the checker must.
      const after = body.slice(cursor, cursor + LOOKAHEAD);
      const window = sinceHeading + '\n' + para + '\n' + after;
      const attributed = SAMPLE.test(window) || (nameRe && nameRe.test(window));
      if (!attributed) {
        rows.push({ moduleId, blockId: block.id, figures: [...new Set(figures)], para: para.replace(/\s+/g, ' ').trim() });
      }
    }
  }
}

const byModule = new Map();
for (const r of rows) byModule.set(r.moduleId, (byModule.get(r.moduleId) ?? 0) + 1);

console.log(`unattributed figure paragraphs: ${rows.length} across ${byModule.size} modules\n`);
for (const [m, n] of [...byModule.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(n).padStart(3)}  ${m}`);
}
if (VERBOSE) {
  console.log('');
  for (const r of rows) {
    console.log(`--- ${r.moduleId} · ${r.blockId} · [${r.figures.join(', ')}]`);
    console.log(`    ${r.para.slice(0, 260)}${r.para.length > 260 ? '…' : ''}\n`);
  }
}
process.exitCode = 0;
