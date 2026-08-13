// P-5 · opening-convention checker.
//
// Every module opens on a contestable claim about the learner's own organisation
// — answered "true of us / not true of us" — because a confidence rating is
// self-report and self-report is not evidence. A numeric prediction may sit
// alongside it wherever a real measurable exists; those feed cohort aggregation.
//
// This reports which modules still open on a number alone. It deliberately does
// NOT flag modules that carry both, which is the target state rather than a
// transitional one.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const CLAIM = /One claim\. Commit before you read|True of us, or not true of us|True of me, or not true of me|claim to contest|commit a position/i;

const dir = join(root, 'content', 'modules');
const missing = [];
let withClaim = 0;
let noBlock = [];
for (const moduleId of readdirSync(dir).sort()) {
  const path = join(dir, moduleId, 'blocks.json');
  if (!existsSync(path)) continue;
  const prompt = JSON.parse(readFileSync(path, 'utf8')).find((b) => b.kind === 'calibration_prompt');
  if (!prompt) { noBlock.push(moduleId); continue; }
  if (CLAIM.test(prompt.body ?? '')) withClaim += 1;
  else missing.push(moduleId);
}

const byCourse = new Map();
for (const m of missing) {
  const course = m.replace(/-(m|r|l)\d+$/, '');
  byCourse.set(course, (byCourse.get(course) ?? 0) + 1);
}
console.log(`opens on a contestable claim: ${withClaim}`);
console.log(`opens on a number alone:      ${missing.length}\n`);
for (const [c, n] of [...byCourse.entries()].sort((a, b) => b[1] - a[1])) console.log(`  ${String(n).padStart(3)}  ${c}`);
if (noBlock.length) console.log(`\nno calibration block at all: ${noBlock.join(', ')}`);
