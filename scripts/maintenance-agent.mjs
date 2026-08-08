// The maintenance agent — the "self-freshening content" promise, operational.
//
// The content model splits every module into a stable layer (concepts, reviewed
// deliberately) and a volatile layer (tool mechanics, model facts, vendor
// specifics — the things that drift while nobody is looking). This agent walks
// ONLY the volatile blocks, checks each against the current state of the world
// (web search when available), and either confirms it or proposes a patch that
// preserves the block's voice, length, structure, and pedagogy.
//
// The stable layer is untouched by construction: blocks with layer !== 'volatile'
// are never even collected. The human stays in the loop by design — the agent
// writes files, git shows the diff, the operator reviews before seeding.
//
// Usage:
//   node scripts/maintenance-agent.mjs                  # check: report only
//   node scripts/maintenance-agent.mjs --write          # apply patches + bump reviewedAt
//   node scripts/maintenance-agent.mjs --module ai201-m2  # limit to one module
//
// Requires ANTHROPIC_API_KEY (or an `ant auth login` profile). After a --write
// run: review `git diff content/`, then `npm run seed:generate` and deploy.
import Anthropic from '@anthropic-ai/sdk';
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const WRITE = args.includes('--write');
const ONLY_MODULE = args.includes('--module') ? args[args.indexOf('--module') + 1] : null;
const MODEL = process.env.MAINTENANCE_MODEL ?? 'claude-opus-5';
const TODAY = new Date().toISOString().slice(0, 10);

const client = new Anthropic();

// ---------- collect the volatile layer ----------

const packagesDir = join(root, 'content', 'modules');
const targets = [];
for (const moduleId of readdirSync(packagesDir).sort()) {
  if (ONLY_MODULE && moduleId !== ONLY_MODULE) continue;
  for (const file of ['blocks.json', 'micro.json']) {
    const path = join(packagesDir, moduleId, file);
    if (!existsSync(path)) continue;
    const blocks = JSON.parse(readFileSync(path, 'utf8'));
    blocks.forEach((block, index) => {
      if (block.layer === 'volatile' && block.kind !== 'exercise') {
        targets.push({ moduleId, file, path, index, block });
      }
    });
  }
}
console.log(`volatile layer: ${targets.length} blocks across ${new Set(targets.map((t) => t.moduleId)).size} modules`);
if (!targets.length) process.exit(0);

// ---------- review one block ----------

const SYSTEM = [
  'You are the maintenance agent for an AI-fluency course aimed at People leaders.',
  'The course separates stable concepts from a volatile example layer; you review ONE volatile block at a time for factual drift.',
  `Today's date is ${TODAY}. Each block carries the date it was last reviewed.`,
  '',
  'Volatile blocks describe things that change: which AI models and tools exist, product mechanics (Claude Projects, ChatGPT Projects, connectors, MCP), vendor data-handling terms, regulatory posture. Use web search to verify claims you are not certain still hold.',
  '',
  'Rules:',
  '- Judge ONLY factual currency. The pedagogy, voice, structure, length, markdown shape, and [V] markers are fixed — a patch changes the fewest words that make the block true again.',
  '- Never add new sections, change headings, or alter what the block teaches.',
  '- A block that is still accurate is "current" even if you would phrase it differently.',
  '- If a claim is broadly right but a named detail drifted (a product renamed, a mechanic moved, a model superseded), patch just that detail.',
  '- If you cannot verify a claim either way, leave it and note it in findings rather than guessing.',
  '',
  'Respond with strict JSON only — no markdown fences, no text outside the JSON:',
  '{"status": "current" | "stale", "findings": ["<one line per claim checked or concern>"], "patchedBody": "<full replacement body, ONLY when status is stale>"}',
].join('\n');

function parseVerdict(text) {
  const raw = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start === -1 || end <= start) return null;
  try {
    const parsed = JSON.parse(raw.slice(start, end + 1));
    if (parsed.status !== 'current' && parsed.status !== 'stale') return null;
    return parsed;
  } catch {
    return null;
  }
}

async function review(target) {
  const { moduleId, block } = target;
  const user = [
    `Module: ${moduleId} · Block: ${block.id} · Last reviewed: ${block.reviewedAt}`,
    block.variant ? `Tooling variant: ${block.variant} (this block is served to orgs on that tool stack)` : null,
    '',
    '<block>',
    block.body,
    '</block>',
  ]
    .filter((line) => line !== null)
    .join('\n');

  // Server-side fallback: if the safety classifiers decline (unlikely for course
  // content, but Opus 5 can refuse), the request re-runs on the recommended
  // fallback model instead of failing the review pass.
  const response = await client.beta.messages.create({
    model: MODEL,
    max_tokens: 8000,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    tools: [{ type: 'web_search_20260209', name: 'web_search', max_uses: 3 }],
    system: SYSTEM,
    messages: [{ role: 'user', content: user }],
  });

  if (response.stop_reason === 'refusal') {
    return { status: 'error', findings: ['review declined by safety classifiers — inspect manually'] };
  }
  const text = response.content
    .filter((c) => c.type === 'text')
    .map((c) => c.text)
    .join('');
  const verdict = parseVerdict(text);
  if (!verdict) return { status: 'error', findings: ['model returned unparseable output — re-run this block'] };
  return verdict;
}

// ---------- run ----------

const results = [];
for (const target of targets) {
  const label = `${target.moduleId}/${target.block.id}`;
  process.stdout.write(`reviewing ${label} … `);
  let verdict;
  try {
    verdict = await review(target);
  } catch (err) {
    verdict = { status: 'error', findings: [`API error: ${err?.message ?? err}`] };
  }
  console.log(verdict.status);
  results.push({ target, verdict });
}

// ---------- apply (write mode) ----------

if (WRITE) {
  const byPath = new Map();
  for (const { target, verdict } of results) {
    if (verdict.status === 'error') continue;
    if (!byPath.has(target.path)) byPath.set(target.path, JSON.parse(readFileSync(target.path, 'utf8')));
    const blocks = byPath.get(target.path);
    if (verdict.status === 'stale' && verdict.patchedBody) {
      blocks[target.index].body = verdict.patchedBody;
    }
    // A confirmed-current block earns a fresh stamp too — that is what the
    // review is for. Errors keep their old stamp so they stand out.
    blocks[target.index].reviewedAt = TODAY;
  }
  for (const [path, blocks] of byPath) {
    writeFileSync(path, JSON.stringify(blocks, null, 2) + '\n');
  }
  console.log(`\napplied to ${byPath.size} files — review with: git diff content/`);
}

// ---------- report ----------

mkdirSync(join(root, 'maintenance'), { recursive: true });
const reportPath = join(root, 'maintenance', `report-${TODAY}.md`);
const lines = [
  `# Volatile-layer maintenance report · ${TODAY}`,
  '',
  `Model: ${MODEL} · Mode: ${WRITE ? 'write (patches applied, stamps bumped)' : 'check (report only)'}`,
  `Reviewed ${results.length} volatile blocks. Stable layer untouched by construction.`,
  '',
];
for (const status of ['stale', 'error', 'current']) {
  const group = results.filter((r) => r.verdict.status === status);
  if (!group.length) continue;
  lines.push(`## ${status === 'stale' ? 'Drifted — patch proposed' : status === 'error' ? 'Needs a human' : 'Confirmed current'} (${group.length})`, '');
  for (const { target, verdict } of group) {
    lines.push(`### ${target.moduleId} · \`${target.block.id}\``);
    for (const finding of verdict.findings ?? []) lines.push(`- ${finding}`);
    if (status === 'stale' && !WRITE && verdict.patchedBody) {
      lines.push('', '<details><summary>Proposed body</summary>', '', '```markdown', verdict.patchedBody, '```', '', '</details>');
    }
    lines.push('');
  }
}
if (!WRITE) {
  lines.push('---', '', 'To apply: re-run with `--write`, review `git diff content/`, then `npm run seed:generate` and deploy.');
}
writeFileSync(reportPath, lines.join('\n') + '\n');
console.log(`report: ${reportPath}`);

const stale = results.filter((r) => r.verdict.status === 'stale').length;
const errors = results.filter((r) => r.verdict.status === 'error').length;
console.log(`\n${results.length - stale - errors} current · ${stale} drifted · ${errors} need a human`);
