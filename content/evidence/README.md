# Shared evidence library

Facts cited by **two or more tracks**. Author once here; reuse the canonical wording in modules and
say in your sources block that you did.

**Why this exists.** Brief §3a sanctions horizontal duplication between sibling tracks — no learner
sees two role tracks, so a well-aimed duplicate is better for them than a cross-track prerequisite.
That removes the pedagogical objection to overlap and leaves exactly one real cost: **drift.** These
tracks run ~80% volatile, and `scripts/maintenance-agent.mjs` re-checks each copy independently, so
ten tracks citing the EU AI Act timeline is ten copies diverging on their own schedule.

**What this is not.** Module content is prose inside `blocks.json`; this is deliberately *not* a
templating system. The library is a **reference and audit** artifact — divergence is detected, not
prevented. Preventing it would mean generating prose from data, which costs more than it returns for
content written this deliberately.

## The rule

> A fact cited by 2+ tracks belongs here. A fact cited once belongs in its module.

## Using it

- **Authoring:** take the canonical `claim`, `sample` and `asOf` from the entry. State the sample and
  date **at the point of claim**, not only in the sources block (brief §4).
- **Adding a citing module:** append to `citedBy`. If you are the second track to cite a fact, create
  the entry.
- **Correcting:** fix the entry, then fix every module in `citedBy`. The entry is not the truth until
  the modules agree with it.

## Files

| File | Fact | Citing modules |
|---|---|---|
| `shrm-ai-in-hr-2026.json` | Adoption concentration and policy findings | 10 |
| `eu-ai-act-timeline.json` | Annex III deferral, Article 50, Article 25/26 | 10 |
| `mobley-v-workday.json` | Agent theory and the 2026 posture | 7 |
| `nlrb-gc-memoranda.json` | GC 23-02 and its rescission | 2 |
| `ai-policy-prevalence.json` | Two instruments that look contradictory and aren't | 2 |
| `productivity-evidence.json` | METR, the firm-level survey, the Danish nulls | 4 |

See `DIVERGENCE.md` for what each pass has found.

## How the agent uses this

`scripts/maintenance-agent.mjs` runs the library **before** the per-block pass, in three stages:

1. **`citedBy` bookkeeping** — a string scan, no API calls. Every entry's figures are broken into
   atoms (`2 December 2027` → `December 2027`, `2027`) and matched on word boundaries, then weighted:
   a full date or a decimal percentage is strong evidence, a bare year or a round `20%` is not. It
   reports modules listed in `citedBy` that no longer carry the fact, and modules that carry it
   without being listed. Run it on any content change — `npm run evidence:check`.
2. **Entry verification** — one web-searched call per entry, establishing ground truth.
3. **Conformance** — each citing module compared against the verified entry, **with no search at
   all**, because the entry was just verified.

**That is the cost argument, made concrete.** A fact cited by ten tracks used to cost ten searches;
it now costs one, plus nine cheap comparisons. And stage 3 is the only check that can see divergence
at all: a block reviewed on its own is perfectly self-consistent while contradicting four other
tracks — which is exactly how `1,908` survived review in five modules.

The agent **never rewrites module prose from an entry.** Divergence is reported for a human, because
which copy is right is a judgment about what the module teaches, not a lookup.

| Command | Does |
|---|---|
| `npm run evidence:check` | bookkeeping only — free, fast, no API key |
| `npm run evidence:verify` | library pass only: verify entries, compare citing modules |
| `npm run maintain` | full run — library, then every volatile block |
| `npm run maintain:write` | same, applying patches and bumping stamps |
