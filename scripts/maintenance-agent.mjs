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
// Ahead of the per-block pass, the agent runs the shared evidence library
// (`content/evidence/*.json`): each entry is web-checked ONCE, then every module
// listed in its `citedBy` is compared against the entry with no search at all.
// That is the whole cost argument for the library — a fact cited by ten tracks
// used to cost ten searches and now costs one, and the nine comparisons are
// cheap. It is also the only check that can see divergence, since a single block
// reviewed alone is perfectly self-consistent while contradicting four others.
//
// Usage:
//   node scripts/maintenance-agent.mjs                  # check: report only
//   node scripts/maintenance-agent.mjs --write          # apply patches + bump reviewedAt
//   node scripts/maintenance-agent.mjs --module ai201-m2  # limit to one module
//   node scripts/maintenance-agent.mjs --library-only   # evidence library pass only
//   node scripts/maintenance-agent.mjs --skip-library   # per-block pass only (old behaviour)
//   node scripts/maintenance-agent.mjs --dry            # no API calls: citedBy bookkeeping only
//
// Requires ANTHROPIC_API_KEY (or an `ant auth login` profile). After a --write
// run: review `git diff content/`, then `npm run seed:generate` and deploy.
//
// --write applies block patches and bumps `reviewedAt` / `lastVerified` stamps.
// It never rewrites module prose from a library entry: divergence is reported
// for a human to resolve, because which copy is right is a judgment about what
// the module teaches, not a lookup.
import Anthropic from '@anthropic-ai/sdk';
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const WRITE = args.includes('--write');
const ONLY_MODULE = args.includes('--module') ? args[args.indexOf('--module') + 1] : null;
const LIBRARY_ONLY = args.includes('--library-only');
const SKIP_LIBRARY = args.includes('--skip-library');
// --dry makes no API calls at all. The `citedBy` bookkeeping is a string scan, so
// it costs nothing and is worth running on every content change.
const DRY = args.includes('--dry');
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
  // Anything the library pass already verified this run is stated as settled, so
  // the block review spends its searches on the facts nothing else covers.
  const known = verifiedFor.get(moduleId) ?? [];
  const user = [
    `Module: ${moduleId} · Block: ${block.id} · Last reviewed: ${block.reviewedAt}`,
    block.variant ? `Tooling variant: ${block.variant} (this block is served to orgs on that tool stack)` : null,
    known.length
      ? [
          '',
          'Already verified against the web earlier in this run — treat as current and do NOT search for them again:',
          JSON.stringify(known, null, 2),
        ].join('\n')
      : null,
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

// ---------- the shared evidence library ----------

const evidenceDir = join(root, 'content', 'evidence');
const library = !existsSync(evidenceDir)
  ? []
  : readdirSync(evidenceDir)
      .filter((f) => f.endsWith('.json'))
      .sort()
      .map((f) => ({ file: f, path: join(evidenceDir, f), entry: JSON.parse(readFileSync(join(evidenceDir, f), 'utf8')) }));

// Every module's prose, flattened once, so the bookkeeping check below is a
// string scan rather than another model call.
function moduleText(moduleId) {
  let text = '';
  for (const file of ['blocks.json', 'micro.json']) {
    const path = join(packagesDir, moduleId, file);
    if (!existsSync(path)) continue;
    for (const block of JSON.parse(readFileSync(path, 'utf8'))) text += (block.body ?? '') + '\n';
  }
  return text;
}
const allModuleIds = existsSync(packagesDir) ? readdirSync(packagesDir).sort() : [];
const moduleTextCache = new Map();
const textOf = (id) => {
  if (!moduleTextCache.has(id)) moduleTextCache.set(id, moduleText(id));
  return moduleTextCache.get(id);
};

// Detection tokens: the smallest strings whose presence in a module is real
// evidence it cites this fact.
//
// Two mistakes to avoid, both found by running this against the corpus. Whole
// figure strings are too coarse — "2 December 2027" never matches a module that
// wrote "December 2027", which is exactly the imprecision worth catching. And
// substring matching is too loose — "2%" matches inside "42%" and "2.8%". So
// figures are broken into atoms, and every atom is matched on a boundary.
const MONTH = 'January|February|March|April|May|June|July|August|September|October|November|December';
const ATOM_PATTERNS = [
  new RegExp(`\\b\\d{1,2} (?:${MONTH}) \\d{4}\\b`, 'gi'), // 2 December 2027
  new RegExp(`\\b(?:${MONTH}) \\d{4}\\b`, 'gi'), // December 2027
  /\d+(?:\.\d+)?%/g, // 19%, 2.8%
  /\b\d{1,3}(?:,\d{3})+\b/g, // 1,722
  /\b(?:19|20)\d{2}\b/g, // 2027
];
function figureAtoms(entry) {
  const atoms = new Set();
  for (const claim of entry.claims ?? []) {
    const text = [claim.figure, claim.canonicalWording].filter(Boolean).join(' ');
    for (const pattern of ATOM_PATTERNS) for (const m of text.match(pattern) ?? []) atoms.add(m);
  }
  return atoms;
}

// A match must sit on a boundary: "2%" inside "42%" is not a citation of 2%, and
// "2027" inside "12027" is not a year.
function occursIn(text, token) {
  let from = 0;
  for (;;) {
    const at = text.indexOf(token, from);
    if (at === -1) return false;
    const before = text[at - 1] ?? ' ';
    const after = text[at + token.length] ?? ' ';
    if (!/[\w.,]/.test(before) && !/[\w]/.test(after)) return true;
    from = at + 1;
  }
}

// Corpus document frequency, computed once. A token appearing across a large
// share of modules carries no signal about this particular fact — "Counsel" and
// "General" fall out of an NLRB source line and then appear in ordinary prose
// everywhere. Filtering by frequency is self-tuning, so nobody has to maintain a
// stopword list as the curriculum grows.
const DF_CEILING = 0.2;
const dfCache = new Map();
function distinctive(candidates) {
  return candidates.filter((token) => {
    if (!dfCache.has(token)) dfCache.set(token, allModuleIds.filter((id) => occursIn(textOf(id), token)).length);
    const hits = dfCache.get(token);
    return hits > 0 && hits / Math.max(1, allModuleIds.length) <= DF_CEILING;
  });
}

// Not every token is worth the same. "0.29%" or "31 October 2022" appearing in a
// module is near-proof it cites this fact; a bare "2022", the word "General", or
// a round "20%" is a coincidence waiting to happen. Weighting the evidence is
// what separates a useful flag from noise — counting tokens flagged a recruiting
// module as citing an NLRB memorandum because it contained "2022" and "General".
function tokenScore(token, df) {
  if (/^\d{1,2} [A-Z][a-z]+ \d{4}$/.test(token)) return 3; // 31 October 2022
  if (/^\d{1,3}(,\d{3})+$/.test(token)) return 3; // 1,722
  if (/^\d+\.\d+%$/.test(token)) return 3; // 0.29%
  if (/^[A-Z][a-z]+ \d{4}$/.test(token)) return 2; // October 2022
  if (/^\d+%$/.test(token)) return Number(token.slice(0, -1)) % 5 === 0 ? 1 : 2; // 20% vs 68%
  if (/^(19|20)\d{2}$/.test(token)) return 1; // a bare year
  return df <= 3 ? 3 : 1; // a proper noun, scored by how rare it is
}

// A module not listed in citedBy is only flagged when the evidence is strong
// enough to be worth a human's attention: enough total weight, and at least one
// token that is not itself a coincidence.
const UNLISTED_MIN_SCORE = 4;
function unlistedEvidence(entry, moduleId) {
  const text = textOf(moduleId);
  const hits = detectionTokens(entry)
    .filter((t) => occursIn(text, t))
    .map((t) => ({ token: t, score: tokenScore(t, dfCache.get(t) ?? 99) }));
  const total = hits.reduce((sum, h) => sum + h.score, 0);
  const strong = hits.some((h) => h.score >= 2);
  return total >= UNLISTED_MIN_SCORE && strong ? hits : null;
}

const tokenCache = new Map();
function detectionTokens(entry) {
  if (tokenCache.has(entry.id)) return tokenCache.get(entry.id);
  const candidates = new Set(figureAtoms(entry));
  // Proper nouns from the source line — "SHRM", "Mobley", "Workday". The
  // frequency filter removes the generic ones.
  for (const word of String(entry.source ?? '').match(/\b[A-Z][A-Za-z]{3,}\b/g) ?? []) candidates.add(word);
  const tokens = distinctive([...candidates]);
  tokenCache.set(entry.id, tokens);
  return tokens;
}

// Bookkeeping, checked deterministically: does citedBy still describe reality?
// An entry whose citedBy has gone stale silently stops protecting the modules it
// no longer names, which is the failure mode that would make the library look
// like it was working while it wasn't.
const bookkeeping = [];
for (const { entry } of library) {
  const tokens = detectionTokens(entry);
  const cited = new Set(entry.citedBy ?? []);
  const missingText = [];
  for (const moduleId of cited) {
    if (!allModuleIds.includes(moduleId)) missingText.push(`${moduleId} (no package on disk)`);
    else if (tokens.length && !tokens.some((t) => occursIn(textOf(moduleId), t))) missingText.push(`${moduleId} (no figure or source token found)`);
  }
  const unlisted = [];
  for (const id of allModuleIds) {
    if (cited.has(id)) continue;
    const evidence = unlistedEvidence(entry, id);
    if (evidence) unlisted.push(`${id} (${evidence.map((h) => h.token).join(', ')})`);
  }
  if (missingText.length || unlisted.length) {
    bookkeeping.push({ id: entry.id, missingText, unlisted });
  }
}

const LIBRARY_SYSTEM = [
  'You are the maintenance agent for an AI-fluency course aimed at People leaders.',
  'You are checking ONE entry in the course\'s shared evidence library — a fact cited by two or more tracks, recorded once so the copies can be compared against it.',
  `Today's date is ${TODAY}. The entry carries the date it was last verified.`,
  '',
  'Use web search to establish whether the entry is still accurate: the source, the sample, the figures, and any legal date or instrument named.',
  '',
  'Rules:',
  '- Judge the ENTRY, not the modules. You are establishing ground truth.',
  '- A figure that is still correct is "current" even if newer data also exists — note the newer data in findings rather than patching, unless the entry is now wrong.',
  '- If a legal instrument has been amended, superseded or renumbered, that is stale.',
  '- Be precise about samples. A completed-response count and a started-response count are different numbers and confusing them is the exact error this library was built to catch.',
  '- If you cannot verify something either way, leave it and say so in findings.',
  '',
  'Respond with strict JSON only — no markdown fences, no text outside the JSON:',
  '{"status": "current" | "stale", "findings": ["<one line per claim checked>"], "patchedEntry": <full replacement entry object, ONLY when status is stale>}',
].join('\n');

async function reviewEntry({ entry }) {
  const response = await client.beta.messages.create({
    model: MODEL,
    max_tokens: 8000,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    tools: [{ type: 'web_search_20260209', name: 'web_search', max_uses: 6 }],
    system: LIBRARY_SYSTEM,
    messages: [{ role: 'user', content: `<entry>\n${JSON.stringify(entry, null, 2)}\n</entry>` }],
  });
  if (response.stop_reason === 'refusal') return { status: 'error', findings: ['review declined by safety classifiers — inspect manually'] };
  const verdict = parseVerdict(response.content.filter((c) => c.type === 'text').map((c) => c.text).join(''));
  return verdict ?? { status: 'error', findings: ['model returned unparseable output — re-run this entry'] };
}

// Conformance: does this module still say what the entry says? No web search —
// the entry was just verified, so this is a comparison, and comparison is the
// cheap half.
const CONFORM_SYSTEM = [
  'You are the maintenance agent for an AI-fluency course aimed at People leaders.',
  'You are given one verified entry from the course\'s shared evidence library, and the passages from ONE module that cite it.',
  '',
  'Decide whether the module\'s wording is consistent with the entry. Do NOT search the web — the entry is the ground truth for this check.',
  '',
  'Report as divergence:',
  '- a figure, sample, date or instrument that contradicts the entry',
  '- a claim attributed to the entry\'s source that the entry does not support',
  '- a materially less precise rendering where the entry specifies canonicalWording (e.g. naming a regulation vs. a bare month)',
  '',
  'Do NOT report: different phrasing that means the same thing, a deliberate subset of the entry\'s claims, or the module framing the fact for its own audience. Tracks are supposed to write their own prose.',
  '',
  'Respond with strict JSON only:',
  '{"status": "current" | "stale", "findings": ["<one line per divergence, quoting the module wording and the entry wording>"]}',
].join('\n');

// Only the passages that actually mention the fact, so the comparison stays small.
function citingPassages(moduleId, entry) {
  const tokens = detectionTokens(entry);
  const out = [];
  for (const file of ['blocks.json', 'micro.json']) {
    const path = join(packagesDir, moduleId, file);
    if (!existsSync(path)) continue;
    for (const block of JSON.parse(readFileSync(path, 'utf8'))) {
      const body = block.body ?? '';
      if (tokens.some((t) => occursIn(body, t))) out.push(`<block id="${block.id}">\n${body}\n</block>`);
    }
  }
  return out;
}

async function reviewConformance(entry, moduleId, passages) {
  const response = await client.beta.messages.create({
    model: MODEL,
    max_tokens: 4000,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    system: CONFORM_SYSTEM,
    messages: [
      {
        role: 'user',
        content: `<entry>\n${JSON.stringify(entry, null, 2)}\n</entry>\n\nModule: ${moduleId}\n\n${passages.join('\n\n')}`,
      },
    ],
  });
  if (response.stop_reason === 'refusal') return { status: 'error', findings: ['review declined by safety classifiers — inspect manually'] };
  const verdict = parseVerdict(response.content.filter((c) => c.type === 'text').map((c) => c.text).join(''));
  return verdict ?? { status: 'error', findings: ['model returned unparseable output — re-run this pair'] };
}

const libraryResults = [];
const conformanceResults = [];
if (!SKIP_LIBRARY && library.length && !DRY) {
  console.log(`\nevidence library: ${library.length} entries · ${new Set(library.flatMap((l) => l.entry.citedBy ?? [])).size} citing modules`);
  for (const item of library) {
    process.stdout.write(`verifying ${item.entry.id} … `);
    let verdict;
    try {
      verdict = await reviewEntry(item);
    } catch (err) {
      verdict = { status: 'error', findings: [`API error: ${err?.message ?? err}`] };
    }
    console.log(verdict.status);
    libraryResults.push({ item, verdict });

    // Compare against the verified entry — the patched one, if it was stale.
    const truth = verdict.status === 'stale' && verdict.patchedEntry ? verdict.patchedEntry : item.entry;
    for (const moduleId of item.entry.citedBy ?? []) {
      if (ONLY_MODULE && moduleId !== ONLY_MODULE) continue;
      const passages = citingPassages(moduleId, truth);
      if (!passages.length) continue; // already reported by the bookkeeping check
      process.stdout.write(`  ${item.entry.id} → ${moduleId} … `);
      let c;
      try {
        c = await reviewConformance(truth, moduleId, passages);
      } catch (err) {
        c = { status: 'error', findings: [`API error: ${err?.message ?? err}`] };
      }
      console.log(c.status === 'stale' ? 'DIVERGES' : c.status);
      conformanceResults.push({ entryId: item.entry.id, moduleId, verdict: c });
    }
  }

  if (WRITE) {
    for (const { item, verdict } of libraryResults) {
      if (verdict.status === 'error') continue;
      const next = verdict.status === 'stale' && verdict.patchedEntry ? verdict.patchedEntry : item.entry;
      next.lastVerified = TODAY;
      writeFileSync(item.path, JSON.stringify(next, null, 2) + '\n');
    }
    console.log(`\napplied to ${libraryResults.filter((r) => r.verdict.status !== 'error').length} evidence entries`);
  }
}

// Facts the library just verified, handed to the per-block pass so it does not
// pay for the same search again. This is where the cost saving actually lands.
const verifiedFor = new Map();
for (const { item, verdict } of libraryResults) {
  if (verdict.status === 'error') continue;
  const truth = verdict.status === 'stale' && verdict.patchedEntry ? verdict.patchedEntry : item.entry;
  for (const moduleId of truth.citedBy ?? []) {
    if (!verifiedFor.has(moduleId)) verifiedFor.set(moduleId, []);
    verifiedFor.get(moduleId).push(truth);
  }
}

// ---------- run ----------

const results = [];
for (const target of LIBRARY_ONLY || DRY ? [] : targets) {
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
const reportPath = join(root, 'maintenance', `report-${TODAY}${DRY ? '-dry' : ''}.md`);
const lines = [
  `# Volatile-layer maintenance report · ${TODAY}`,
  '',
  `Model: ${MODEL} · Mode: ${WRITE ? 'write (patches applied, stamps bumped)' : 'check (report only)'}`,
  DRY
    ? 'Dry run — no API calls. `citedBy` bookkeeping only.'
    : `Reviewed ${results.length} volatile blocks. Stable layer untouched by construction.`,
  '',
];

// The library sections go first: they are the cross-track view, and a divergence
// here explains block-level findings that would otherwise look unrelated.
if (libraryResults.length || bookkeeping.length || (DRY && library.length)) {
  const searchesSaved = conformanceResults.length;
  lines.push(
    '## Shared evidence library',
    '',
    DRY
      ? `${library.length} entries on disk · not web-checked in a dry run.`
      : `${libraryResults.length} entries web-checked · ${conformanceResults.length} citing modules compared against them with no search.`,
    DRY
      ? ''
      : `Cost shape: ${libraryResults.length} searched calls where independent re-checking would have needed ${libraryResults.length + searchesSaved}.`,
    '',
  );

  const staleEntries = libraryResults.filter((r) => r.verdict.status === 'stale');
  const errorEntries = libraryResults.filter((r) => r.verdict.status === 'error');
  const diverged = conformanceResults.filter((r) => r.verdict.status === 'stale');

  if (staleEntries.length) {
    lines.push(`### Entries that drifted (${staleEntries.length})`, '');
    for (const { item, verdict } of staleEntries) {
      lines.push(`#### \`${item.entry.id}\``);
      for (const f of verdict.findings ?? []) lines.push(`- ${f}`);
      lines.push('', `Cited by: ${(item.entry.citedBy ?? []).join(', ') || '—'}`, '');
      if (!WRITE && verdict.patchedEntry) {
        lines.push('<details><summary>Proposed entry</summary>', '', '```json', JSON.stringify(verdict.patchedEntry, null, 2), '```', '', '</details>', '');
      }
    }
  }

  if (diverged.length) {
    lines.push(
      `### Modules that diverge from the library (${diverged.length})`,
      '',
      '**These are the findings no per-block review can produce** — a block reviewed alone is self-consistent while contradicting four other tracks. Resolve by hand: which copy is right is a judgment about what the module teaches.',
      '',
    );
    for (const { entryId, moduleId, verdict } of diverged) {
      lines.push(`#### ${moduleId} vs \`${entryId}\``);
      for (const f of verdict.findings ?? []) lines.push(`- ${f}`);
      lines.push('');
    }
  }

  if (bookkeeping.length) {
    lines.push(`### \`citedBy\` no longer matches the content (${bookkeeping.length})`, '');
    for (const b of bookkeeping) {
      lines.push(`#### \`${b.id}\``);
      for (const m of b.missingText) lines.push(`- listed as citing, but the fact was not found there: ${m}`);
      for (const m of b.unlisted) lines.push(`- cites this fact but is not listed in \`citedBy\`: ${m}`);
      lines.push('');
    }
  }

  if (errorEntries.length) {
    lines.push(`### Entries needing a human (${errorEntries.length})`, '');
    for (const { item, verdict } of errorEntries) {
      lines.push(`- \`${item.entry.id}\` — ${(verdict.findings ?? []).join('; ')}`);
    }
    lines.push('');
  }

  if (!staleEntries.length && !diverged.length && !bookkeeping.length && !errorEntries.length) {
    lines.push(DRY ? 'Every `citedBy` list matches the content.' : 'All entries current, and every citing module agrees with its entry.', '');
  }
  lines.push('---', '');
}
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
console.log(`\nblocks: ${results.length - stale - errors} current · ${stale} drifted · ${errors} need a human`);
if (libraryResults.length || bookkeeping.length || (DRY && library.length)) {
  const entriesStale = libraryResults.filter((r) => r.verdict.status === 'stale').length;
  const diverged = conformanceResults.filter((r) => r.verdict.status === 'stale').length;
  console.log(
    `library: ${libraryResults.length - entriesStale} entries current · ${entriesStale} drifted · ` +
      `${diverged}/${conformanceResults.length} citing modules diverge · ${bookkeeping.length} citedBy mismatches`,
  );
}
