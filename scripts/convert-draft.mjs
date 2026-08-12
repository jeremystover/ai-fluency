// Converts a course-module source draft (the ai201-*.md format) into a module
// package: blocks.json, activity.json, knowledge-check.json. Deterministic and
// re-runnable — hand-tuning happens in the draft or in post-edit scripts, not
// in the generated files.
//
//   node scripts/convert-draft.mjs content/ai201-m1-from-one-offs-to-workflows.md ai201-m1 [reviewedAt]
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const [, , draftPath, moduleId, reviewedAtArg] = process.argv;
if (!draftPath || !moduleId) {
  console.error('usage: node scripts/convert-draft.mjs <draft.md> <moduleId> [reviewedAt]');
  process.exit(1);
}
const reviewedAt = reviewedAtArg ?? new Date().toISOString().slice(0, 10);

const raw = readFileSync(draftPath, 'utf8');

// Split into top-level sections on `## ` headings; drop the metadata header
// (everything before the first `## `).
const sections = [];
let current = null;
for (const line of raw.split('\n')) {
  if (line.startsWith('## ')) {
    if (current) sections.push(current);
    current = { heading: line.slice(3).trim(), lines: [] };
  } else if (current) {
    current.lines.push(line);
  }
}
if (current) sections.push(current);

const slug = (s) =>
  s
    .toLowerCase()
    .replace(/\*\*\[v\]\*\*/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);

const classify = (heading) => {
  const h = heading.toLowerCase();
  if (h.startsWith('calibration prompt')) return 'calibration_prompt';
  if (h.startsWith('learning objectives')) return 'callout';
  if (h.startsWith('take a position')) return 'callout'; // 301 tracks close each module on a contestable claim
  if (h.startsWith('key takeaways')) return 'takeaways';
  if (h.includes('answer key') || h.startsWith('exercise key')) return 'reveal';
  if (h.startsWith('knowledge check')) return 'knowledge_check';
  if (h.startsWith('capstone')) return 'activity';
  if (h.startsWith('applied activity')) return 'activity'; // 101 modules — no capstone thread
  if (h.startsWith('manager one-pager')) return 'skip';
  return 'prose';
};

// Pull `> ### Try this` blockquotes out of a section body into their own blocks.
function extractTryThis(lines) {
  const body = [];
  const tryBlocks = [];
  let i = 0;
  while (i < lines.length) {
    if (/^>\s*### Try this/.test(lines[i])) {
      const quote = [];
      while (i < lines.length && (lines[i].startsWith('>') || lines[i].trim() === '')) {
        if (lines[i].startsWith('>')) quote.push(lines[i].replace(/^>\s?/, ''));
        else if (quote.length && lines[i].trim() === '' && lines[i + 1]?.startsWith('>')) quote.push('');
        else break;
        i++;
      }
      tryBlocks.push(quote.join('\n').trim());
    } else {
      body.push(lines[i]);
      i++;
    }
  }
  return { body: body.join('\n'), tryBlocks };
}

// Knowledge-check parser for the drafts' uniform Q/option/✓/blockquote format.
function parseKnowledgeCheck(headingText, lines) {
  const text = lines.join('\n');
  const note = (text.match(/^\*(.+?)\*$/m) ?? [])[1] ?? null;
  const questions = [];
  const qParts = text.split(/\*\*Q(\d+)\.\*\*\s*/).slice(1);
  for (let i = 0; i < qParts.length; i += 2) {
    const body = qParts[i + 1];
    const lines2 = body.split('\n');
    const prompt = lines2[0].trim();
    const options = [];
    let correctIndex = -1;
    const explanation = [];
    let inExplanation = false;
    for (const l of lines2.slice(1)) {
      const opt = l.match(/^- ([A-D])\.\s*(.+?)(\s*✓)?\s*$/);
      if (opt) {
        if (opt[3]) correctIndex = options.length;
        options.push(opt[2]);
      } else if (l.startsWith('>')) {
        inExplanation = true;
        explanation.push(l.replace(/^>\s?/, '').replace(/^\*\*[A-D]\.\*\*\s*/, ''));
      } else if (inExplanation && l.trim() === '') {
        break;
      }
    }
    if (options.length >= 2 && correctIndex >= 0) {
      questions.push({
        id: `q${questions.length + 1}`,
        prompt,
        options,
        correctIndex,
        explanation: explanation.join(' ').trim(),
      });
    }
  }
  return { title: headingText, note, reviewedAt, questions };
}

const blocks = [];
const activityBlocks = [];
let knowledgeCheck = null;
let ordinal = 0;
let activityOrdinal = 0;

const push = (list, mid, kind, heading, body, opts = {}) => {
  const ord = list === activityBlocks ? (activityOrdinal += 10) : (ordinal += 10);
  const headingLevel = list === activityBlocks ? '##' : '##';
  const cleanHeading = heading.replace(/\s*\*\*\[V\]\*\*\s*/g, ' [V]').trim();
  list.push({
    id: `${mid}-${slug(heading) || kind}-${ord}`,
    moduleId: mid,
    ordinal: ord,
    kind,
    layer: opts.volatile ? 'volatile' : 'stable',
    reviewedAt,
    body: `${headingLevel} ${cleanHeading}\n\n${body.trim()}`.trim(),
  });
};

for (const section of sections) {
  const kind = classify(section.heading);
  if (kind === 'skip') continue;
  const volatile = section.heading.includes('**[V]**');
  const { body, tryBlocks } = extractTryThis(section.lines);
  const cleanBody = body.replace(/\n---\s*$/g, '').trim();

  if (kind === 'knowledge_check') {
    knowledgeCheck = parseKnowledgeCheck(section.heading, section.lines);
    continue;
  }
  if (kind === 'activity') {
    push(activityBlocks, `${moduleId}-activity`, 'prose', section.heading, cleanBody, { volatile });
    continue;
  }
  if (kind === 'reveal') {
    push(blocks, moduleId, 'reveal', section.heading, cleanBody, { volatile });
    continue;
  }
  push(blocks, moduleId, kind === 'calibration_prompt' ? 'calibration_prompt' : kind, section.heading, cleanBody, { volatile });
  for (const tb of tryBlocks) {
    ordinal += 10;
    blocks.push({
      id: `${moduleId}-try-${ordinal}`,
      moduleId,
      ordinal,
      kind: 'try_this',
      layer: 'stable',
      reviewedAt,
      body: tb,
    });
  }
}

const outDir = join('content', 'modules', moduleId);
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'blocks.json'), JSON.stringify(blocks, null, 2));
if (activityBlocks.length) writeFileSync(join(outDir, 'activity.json'), JSON.stringify(activityBlocks, null, 2));
if (knowledgeCheck?.questions.length) writeFileSync(join(outDir, 'knowledge-check.json'), JSON.stringify(knowledgeCheck, null, 2));
console.log(
  `${moduleId}: ${blocks.length} blocks (${blocks.filter((b) => b.layer === 'volatile').length} volatile), ` +
    `${activityBlocks.length} activity blocks, ${knowledgeCheck?.questions.length ?? 0} knowledge-check questions`,
);
