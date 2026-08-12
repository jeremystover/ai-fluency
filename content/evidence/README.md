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

| File | Fact | Tracks |
|---|---|---|
| `shrm-ai-in-hr-2026.json` | Adoption concentration and policy findings | 7 |
| `eu-ai-act-timeline.json` | Annex III deferral, Article 50, Article 25/26 | 8 |
| `mobley-v-workday.json` | Agent theory and the 2026 posture | 5 |
| `nlrb-gc-memoranda.json` | GC 23-02 and its rescission | 2 |
| `ai-policy-prevalence.json` | Two instruments that look contradictory and aren't | 3 |
| `productivity-evidence.json` | METR, the firm-level survey, the Danish nulls | 3 |

See `DIVERGENCE.md` for what the first extraction pass found.
