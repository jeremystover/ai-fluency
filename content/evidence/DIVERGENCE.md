# Divergence report — first pass, 12 August 2026

The first run of the evidence library, over 144 volatile blocks across 12 courses. **525 factual
claims extracted, clustered by source, figure and topic.**

The point of this report is not the library. It is the answer to a question nobody could previously
answer: **how much has already drifted?** The honest answer is *less than feared and in worse ways
than expected* — two outright contradictions, one of which had propagated through five modules
precisely *because* the authors were trying to prevent drift.

---

## Two contradictions — same fact, different numbers. Both resolved.

### 1. SHRM sample size — `1,722` vs `1,908`

`ai301-peopleops-m1`, `ai301-peopleops-m3`, `ai301-peopleops-m8` and `ai301-ler-l1` cited **1,722 HR
professionals**. `ai301-talent-dev-m1`, `ai301-cpo-m2`, `ai301-cpo-m3` and `ai301-cpo-m5` cited
**1,908** — all describing the same instrument.

**Resolved: 1,722 is correct.** The survey was fielded 5–23 December 2025 via SHRM's Voice of Work
Research Panel; **1,908 started it and 1,722 completed.** Both numbers are real, which is why this
survived review — it is not a typo, it is two figures from one instrument used interchangeably, and
only the completed count is the analytic sample.

**The instructive part.** Every module carrying the wrong number said some version of *"the same
survey is cited in the HRBP track; the phrasing here is deliberately consistent with it so the two do
not drift."* The consistency discipline was working exactly as designed — **and it propagated the
error faster than inconsistency would have.** Nine files carried it before the fix. A shared library
is what that discipline needed to point at.

### 2. NLRB rescinded memoranda — `29` vs `31`

`ai301-ler-l7` said GC 23-02 was rescinded on 14 February 2025 in GC 25-05, **among 29 memoranda**.
`ai301-excomms-m7` said **among 31**.

**Resolved: 29.** Acting General Counsel Cowen rescinded twenty-nine prior General Counsel memoranda
in GC 25-05. `ai301-excomms-m7` corrected, and now names GC 25-05 as LER already did.

---

## Precision drift — same fact, different resolution

**The EU Annex III deferral appears in 8 tracks** and the precision varies materially:

| Precision | Modules |
|---|---|
| "2 December 2027, Regulation (EU) 2026/1744" | `hrbp-m6`, `cpo-m5`, `talent-dev-m5`, `peopleops-m7` |
| bare "December 2027", no instrument named | `recruiter-r6`, `analytics-m5` |

Not wrong, but a learner in the recruiter track cannot look the instrument up and a maintenance run
cannot match the two copies. **Canonical wording is now in `eu-ai-act-timeline.json`: always name the
instrument.** Folded into the S-3 fix rather than tracked separately.

Same shape, smaller: **Gartner's 88%** appears in `ai301-comp-m2` and `ai301-hrbp-m3`; the **workslop
2-hours/42% pair** appears in `ai301-recruiter-r1` and `r7`, but only `r7` attributes it to BetterUp
Labs and Stanford.

---

## The systemic finding — attribution is thinner than the curriculum's standard

**92 of 189 claims in the 101/201/HRBP/recruiter/comp group (~49%) have no named source at the point
of claim.** Whole clusters of hard percentages are unattributed: `ai301-hrbp-m1`'s adoption block
(three in ten, nine in ten CHROs, over half), `ai301-recruiter-r1`'s 254 applicants / 412% / 38.5% /
88% splits, and the multi-country study behind the 11-hour and 6.4-hour botsitting figures.

The other two groups show the same pattern in the legal blocks — California FEHA, the Illinois Human
Rights Act, EU Articles 25/26/50 and the COBRA/I-9/ACA deadlines are largely stated bare.

**This reframes S-8**, which was scoped as a comp-track problem. It is curriculum-wide. The rule is
now in the authoring brief for new content; the shipped backlog is tracked as S-8.

Sources that *do* carry a sample at the point of claim, and are the model to copy: WTW (312 employers
/ 4.6M employees / Jan–Feb 2026), the EWU negotiation survey (899 = 488 + 411), the PLOS ONE audit
(98,800 prompts × 4 versions), METR, HR Acuity (274 US orgs, ±5.9 pts) and Simpplr (448 NA IC
professionals, fielded Dec 2025).

---

## Unresolved, carried forward

- **"138 use cases across 16 practice areas"** (SHRM) could not be confirmed against the published
  report, which describes a smaller set. Cited in `peopleops-m1`, `ler-l1` and `talent-dev-m1`. The
  practice-area *percentages* verify; the 138/16 framing does not. **Re-check before the next
  customer deployment** — filed as S-9.
- **Gartner** figures are cited in four modules with no sample or date at the point of claim, and
  Gartner's methodology is not public. The ~114-leader sample appears once, in `comp-m2`, as a
  teaching example rather than an attribution.

---

## Method, for the next run

1. Enumerate blocks with `layer: "volatile"` from `content/modules/**/blocks.json` — the marker
   already exists, so this is mechanical.
2. Extract factual claims per block (a model task, not a regex task; run it as parallel subagent
   passes — 144 blocks is ~341k characters and does not fit one context).
3. Cluster by normalized source, by figure, and by topic regex. **All three are needed** — the
   AI-policy conflict clusters only by topic, since the figures differ; the SHRM conflict clusters
   only by source, since the figures differ; precision drift clusters only by figure.
4. Diff against the previous `DIVERGENCE.md` and report what is new.

**Validation criterion for any future run:** the clustering must rediscover a known divergence
without being told to look for it. This pass rediscovered the AI-policy conflict (S-6) from scratch,
which is why its other findings are trustworthy.
