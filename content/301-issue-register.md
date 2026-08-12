# AI 301 · Issue register

One place for everything the curriculum owes itself. Consolidated from eleven outline, exploration
and brief documents where these items were scattered — several were raised independently by three to
five documents, which is recorded because it is a signal about priority.

**How to use this.** Cite the ID in commits and threads. When you close one, edit the row rather than
appending below it — the comp track learned that the hard way (see C-06 below). New items get the
next number in their bucket.

**Status key:** `open` · `in progress` · `closed` (with the commit that closed it)

**Current state:** 13 courses, 85 module rows, 10 role tracks live behind `roles.ts` choices.

---

## S · Corrections to shipped, learner-visible content

These are wrong or stale in content a learner can open today. Highest priority in the register.

| ID | Item | Where | Status |
|---|---|---|---|
| **S-1** | **`ai101-m7` Lesson 3's federal-enforcement claim is stale.** Flagged in `course-301-dei-assessment.md` as surviving independently of that file's superseded track recommendation. **101 is open to every learner on the platform** — this is the widest-blast-radius item in the register. | `content/ai101-m7-*.md`, `content/modules/ai101-m7/` | **closed** — guidance withdrawn ≠ law changed; corrected + sourced |
| **S-2** | **Article 50 appears nowhere in the curriculum.** The EU transparency duties — including disclosing at first contact that a person is interacting with an AI — became enforceable **2 August 2026** and were *not* deferred by the Omnibus. It is the obligation most likely to catch an HR chatbot, and it catches an organisation with no high-risk AI at all. HRBP M6 and recruiter R6 both carry the Annex III deferral without it. | `ai301-recruiter-r6` | **closed** — HRBP M6 already carried it; R6 now does, with the €15M/3% ceiling and the point that it catches an org with no high-risk AI at all |
| **S-3** | **HRBP M6 calls the Digital Omnibus an "agreement."** It is Regulation (EU) 2026/1744, published 24 July 2026, in force 27 July 2026. Accurate when drafted, stale now. | `ai301-hrbp-m6`, `ai301-recruiter-r6` | **closed** — HRBP was already fixed; R6 carried a bare "December 2027" and now names the Regulation. Canonical wording in `evidence/eu-ai-act-timeline.json` |
| **S-4** | **Colorado is wrong wherever it appears.** SB 24-205 → postponed to 30 June 2026 → **enforcement enjoined 27 April 2026** → **repealed and replaced by SB 26-189** (signed 14 May 2026), a scaled-back disclosure-and-rights framework effective 1 January 2027. The date survived; the statute behind it did not. | `ai301-defensible-m1` | **closed** — neither floor module cites Colorado; `defensible-m1` did, and said "enforcement paused" without the repeal. Now carries postponed → enjoined → repealed and replaced by SB 26-189 |
| **S-5** | **`Mobley v. Workday`'s 2026 developments are missing.** | `ai301-hrbp-m6`, `ai301-recruiter-r6` | **closed** — both now carry the ADEA collective at ~14,000 opt-ins, the 6 March and 22 June 2026 rulings, and the 28 May 2026 privilege holding, with the "involve counsel before you test" consequence. Flagged in both as the most staleness-prone citation in the module |
| **S-6** | **Conflicting AI-policy statistics across tracks.** Comp M4: *68% of employers have a formal AI policy* (Littler). People Ops M3: *51% have no formal AI use policy* (SHRM). | `ai301-comp-m4`, `ai301-peopleops-m3` | **closed** — not a conflict. Littler surveys *employers* on any AI policy; SHRM surveys *HR professionals* on workforce-use policy. Reconciliation in `content/evidence/ai-policy-prevalence.json`; neither may be paraphrased as "the share of organizations with an AI policy" without naming the instrument |
| **S-7** | **`ai201-m8` has no interactive exercise.** The only module in the curriculum with neither `sorting.json` nor `choice.json`. Every other module across 13 courses has one. | `content/modules/ai201-m8/` | **closed** — four-binder cold-reader exercise |
| **S-8** | **Point-of-claim sourcing is thinner than the curriculum's own standard — and it is curriculum-wide, not a comp-track problem.** The library pass measured it: **92 of 189 claims (~49%)** in the 101/201/HRBP/recruiter/comp group carry no named source at the point of claim, including whole clusters of hard percentages in `ai301-hrbp-m1` and `ai301-recruiter-r1`, and most of the legal blocks in the other groups. The authoring rule is now in brief §4 for new content; this is the shipped backlog. | curriculum-wide; see `content/evidence/DIVERGENCE.md` | open, **scope raised** |
| **S-9** | **SHRM's "138 use cases across 16 practice areas" could not be confirmed** against the published report, which describes a smaller set. The practice-area percentages verify; the 138/16 framing does not. Re-check before any customer deployment. | `ai301-peopleops-m1`, `ai301-ler-l1`, `ai301-talent-dev-m1` | open |
| **S-10** | **SHRM sample was wrong in five modules across three tracks** — 1,908 (started) used where 1,722 (completed, the analytic sample) belongs. Found by the first library pass. | 9 files | **closed** — corrected everywhere; canonical in `content/evidence/shrm-ai-in-hr-2026.json` |
| **S-11** | **NLRB rescinded-memoranda count contradicted itself** — `excomms-m7` said 31, `ler-l7` said 29. | `ai301-excomms-m7` | **closed** — 29 is correct; excomms now names GC 25-05 too |
| **S-12** | **`ai301-defensible-m1` Lesson 3 is stale on the EEO-1 rescission.** It has the rule submitted to OIRA on 14 May 2026 with review expected inside 90 days; the NPRM was published in the Federal Register on **23 July 2026** with comments closing **24 August 2026**. The lesson's teaching point — a baseline is disappearing and baselines cannot be reconstructed backwards — is unaffected; only the procedural stage is wrong. Canonical wording now in `content/evidence/eeo1-rescission.json`, which flags the item as high-volatility. Found while building the CPO US floor lesson, not by a maintenance run. | `ai301-defensible-m1` | **open** |

---

## X · Cross-track consistency

Under brief §3a, horizontal duplication between sibling tracks is **sanctioned** — no learner sees
two role tracks. So none of these is about withholding content. They are about **drift and
contradiction**, which is the only real cost duplication carries.

| ID | Item | Status |
|---|---|---|
| **X-1** | **Access control vs. disclosure control** — the split is agreed from both sides but written in only one. People Ops M6 owns *who can retrieve what* (failure: someone reached a document they shouldn't have; fix: permissions, indexing scope, least-privileged testing). Analytics M5 L5 owns *what a legitimately-permissioned aggregate reveals* (failure: nobody's permissions were violated and the individual was identified anyway; fix: thresholds and suppression). **Both tracks should carry the sentence.** | open |
| **X-2** | **Comparator vs. control group.** LER draws it — one legal comparator can be dispositive where one data point is nothing. Analytics does not yet carry the reciprocal note, and a learner taking both would import statistical intuitions into a legal analysis. Cited in brief §3a as *the* example worth copying. | open |
| **X-3** | **Analytics co-determination delta.** BetrVG §87(1) no. 6 turns on whether a system is *objectively suitable* for monitoring — **intent is irrelevant** — so "we're only analysing data we already have" is not a defence. People Ops M7 covers co-determination for *deployment*; it does not carry the analytics version where the analysis output is itself the monitoring device. | open |
| **X-4** | **Case-history index.** LER wants the investigation corpus searchable for comparator analysis; People Ops M6 names exactly that corpus as one a general assistant must never index. Both are right. The reconciliation — scoped to ER team access, never joined to the enterprise assistant, existence itself a discovery consideration — belongs in the content of both. | open |
| **X-5** | **Craft-layer chain.** Comp M3 (verify one analysis on an extract) → People Ops M5 (the source system) → Analytics M2 (the leap from a correct table to a claim). Tripwire already recorded: *if Analytics M2 starts explaining row counts, it has drifted into comp M3 and must be cut back.* | monitoring |
| **X-6** | **Works-council consultation.** People Ops M7 owns it as a deployment dependency, which is right for a systems owner. In Europe it is core labor-relations work. Under §3a the answer is probably **both, specialised differently** — deployment consultation there, bargaining obligation in LER. | open |
| **X-7** | **HRBP M6 L3 vs. LER L4.** Both teach investigation documentation at different depths for non-overlapping audiences. Duplication is sanctioned; **the risk is contradiction, not repetition**, and only a periodic read of both catches it. | recurring |
| **X-8** | **§3a re-review pass over calls made before it existed.** LER v1 is the clearest case of a decision reversed by §3a. People Ops cut two things partly on horizontal grounds. Both survive on merit — but one pass is owed to check nothing else was withheld from a learner who will never see the alternative. | open |

---

## P · Policy questions asked identically by many tracks — settle once

| ID | Item | Raised by | Status |
|---|---|---|---|
| **P-1** | **Does the floor module split?** Same provisional answer every time: *ship merged, watch completion.* Analytics names the natural seam for its M2; People Ops argues M7 must stay merged because *the artifact is one artifact*. Make it a written policy rather than five independent judgements. | 5 tracks | open |
| **P-2** | **Track length: convention or drift?** Spread is ~2h55 to ~5h. **EX/Comms at 10 modules is now the outlier, not comp.** Either name a band (3h30–4h30 was the proposal) and trim toward it, or record the spread as a deliberate per-role call. | 3 documents | open |
| **P-3** | **"Our evidence cannot settle this" must score at full credit** in every rubric's `activityContext`, not only the tracks written after the convention changed. Without it the claim-to-contest convention punishes the honest answer. | analytics + handoff | open |
| **P-4** | **Activities that depend on a second human.** HRBP M7 needs a real manager; recruiter R3 needs a hiring manager. Both are described as the best activity in their course. **One policy, not two** — alternate path, or accept the assumption. | 2 tracks | open |
| **P-5** | **Calibration → claim-to-contest retrofit.** ~20 shipped modules across HRBP, recruiter and comp, plus the 101/201 thread. Bounded and not growing, since everything new is built to the new convention. Brief §5's convention text must be rewritten in the same pass. **Keep numeric `opening`/`calibration` fields wherever a real measurable exists** — they now feed cohort aggregation. | 3 documents | open |

---

## R · Product and infrastructure

| ID | Item | Status |
|---|---|---|
| **R-1** | **Rubric schema needs a rejection condition**, not a caution, for identifiable case content. LER activities must be able to *refuse* a submission containing case facts, across the graded submission, the `fd_review` operator queue and the tutor. **The only item in the register explicitly flagged as undeliverable by content alone.** | open |
| **R-2** | **Decision register and signed decision-rights map as reusable templates** rather than only activity submissions. The most reusable artifacts any track produces; templates that outlive the course would be independently valuable. | open |
| **R-3** | **Cohort aggregation follow-ons.** Built and shipped: `GET /api/module/:id/cohort`, gated on the learner committing their own number, suppressed below five other respondents. Open: (a) brand/cohort segmentation once n clears the threshold — will rarely clear in early deployments; (b) whether free-text pre-work answers are ever aggregated — **current lean: no**, they are where learners are least performative. | open |
| **R-4** | **Does 301 need its own diagnostic**, or does the calibration/claim record place a returning learner better than a quiz? The data already exists. Note P-5 changes what that record contains. | open |
| **R-5** | **Shared evidence library — both stages done.** Stage 1: `content/evidence/` with 6 entries, plus `DIVERGENCE.md`; found two contradictions and one systemic gap, and rediscovered S-6 unprompted. Stage 2: `scripts/maintenance-agent.mjs` now runs the library before the per-block pass — free `citedBy` bookkeeping (`npm run evidence:check`), then one web-checked call per entry, then a search-free comparison of every citing module against it. **A fact cited by ten tracks costs one search instead of ten**, and the comparison stage is the only check that can see divergence at all, since a block reviewed alone is self-consistent while contradicting four others. First run found 7 `citedBy` mismatches, all real, all fixed. The detector needed two corrections first (boundary matching, and weighting tokens by information rather than counting them) — recorded in `DIVERGENCE.md`. The agent never rewrites module prose from an entry: divergence is reported for a human, because which copy is right is a judgment about what the module teaches. | **closed** |
| **R-6** | **Counsel-review tracking.** See the register below — nothing currently records which gates have actually been cleared. | open |

---

## Counsel-review gates

Modules that carry an explicit counsel-review requirement in their own content. **Nothing currently
tracks whether the review happened.** This is an operational blocker for customer deployment, not a
content task.

| Module | Surface | Reviewed |
|---|---|---|
| `ai301-comp-m4` | ERISA fiduciary duty, pay transparency, privilege and AI | ☐ |
| `ai301-peopleops-m4` | FMLA/ADA notice through a chatbot | ☐ |
| `ai301-peopleops-m7` | Deployer obligations, co-determination, records and hold | ☐ |
| `ai301-analytics-m5` | Provider vs. deployer, purpose limitation, disclosure control | ☐ |
| `ai301-defensible-m1` | The shift toward discovery exposure | ☐ |
| `ai301-defensible-m2` | AEDT inventory and the shadow vendor stack | ☐ |
| `ai301-defensible-m3` | Adverse impact testing under privilege | ☐ |
| `ai301-ler-l7` | Statute, Board doctrine and General Counsel priorities | ☐ |
| `ai101-m7` L3 | Regulatory claims — see S-1 | ☐ |

---

## Role architecture — settled and open

**Settled.**
- **People Analytics standalone.** The retrieval/inference boundary with People Ops is mechanical
  rather than topical, which is why it held under drafting.
- **People Ops + HR Technology combined.** Right for the 1,000–10,000-person company this curriculum
  targets. They split in 50,000-person organisations — a future variant, not a defect.
- **DEI → `ai301-defensible`.** Reframed from programme ownership to the technical compliance function
  for algorithmic people decisions. Named for the capability because "DEI" in a course title is a
  deployment blocker for some federal contractors under EO 14173, and "Culture and Belonging" would
  mis-route ERG and engagement people into a statistics course.
- **CPO at 301 rather than 401.** *401 is a rung, not an audience* — it is for everyone at L4.

**Open.**

| ID | Item | Status |
|---|---|---|
| **A-1** | **Talent Management — explored; the answer is no track.** See `content/course-301-talent-management-exploration.md`. The Talent Development thread's ruling stands, though for a reason it did not state: **the AI questions in this role are about inference on people and the validity of instruments, and this curriculum already teaches both.** After subtraction, three things survive rather than seven — and two are the same idea twice. **A correction to this register's own earlier entry:** the claim that skills inference was covered nowhere was wrong. `ai301-talent-dev-m5` L4 covers it, and at the sharpest angle (the moment a description becomes a decision). Three placements filed as CP-6, CP-7, CP-8. Revisit only if the product serves organisations large enough that TM is reliably its own function — a market question, not a content one. | **closed — no track** |
| **A-2** | **Organisational Development / org design.** Operating model, org design, change management, culture. Probably 401 rather than 301 — cross-team leadership and change is how 401 is defined — but worth asking explicitly rather than leaving unasked. | open |
| **A-3** | **Does labor relations eventually want its own track**, split from employee relations? Resolved for now by making Section 7 the non-conditional spine so the floor works for everyone. Revisit if the audience skews unionised. | deferred |
| **A-4** | **Does high-volume hourly recruiting want its own track?** R2 says high-volume hourly and professional/senior are different games. Is naming it enough? | deferred |
| **A-5** | **AI 401.** Registered as a locked course with zero module rows, which renders as a roadmap card with no rows beneath it (verified). Now that ten COE tracks exist, 401 can be assembled substantially from their synthesis: the aggregated floor, each function's honest value case, and the cross-team leadership content every track deliberately pushed upward. | open |

---

## Cross-pollination owed to HRBP

HRBP was built first, before any COE content existed. It is the track most owed a backfill. Beyond
S-2, S-3, S-4 and S-5:

| ID | Item | From | Status |
|---|---|---|---|
| **CP-1** | **Small-N and disclosure control.** An HRBP asking for engagement results for a team of six is exactly the request Analytics has to refuse. HRBPs should know *why*, or they read the refusal as obstruction. | Analytics M5 L5 | **shipped** — HRBP M5 L4 |
| **CP-2** | **"Involve counsel before you test, not after."** HRBPs commission investigations and analyses; privilege is a fact about how work was commissioned, not about its content. | Comp M4, Analytics M5 | **shipped** — HRBP M6 L4 |
| **CP-3** | **A model may locate conflicts; only a human may resolve them.** HRBP M6's knowledge check flags "comparing witness accounts" as *approaching* credibility and stops. LER draws the line that hedge declines to draw — correct for a generalist, but the reconciliation is owed in both directions. | LER L2 | **shipped** — HRBP M6 L3 |
| **CP-4** | **The stakeholder who ran their own numbers.** HRBPs face this from business leaders first and most often — locate the definitional difference, name one confound specifically, offer what would settle it. | Analytics M6 L3 | **shipped** — HRBP M5, new Lesson 3b |
| **CP-5** | **CPO audit — done. Two gaps, one of them real.** Read against the COE tracks rather than grepped, after this register's own A-1 over-claim. **(a) The aggregated floor is EU-only.** CPO M5 L2 is the floor lesson and it is a good one — Annex III deferral to 2 December 2027 under Regulation (EU) 2026/1744, the transparency duties live since 2 August 2026, the absolute emotion-recognition prohibition, and a durable principle underneath. But it carries **no US surface at all**: no *Mobley* (5 tracks have it), no state AI-statute patchwork (6 tracks), no AEDT bias-audit duty, no adverse-impact exposure in promotion or pay, no NLRB position (LER and EX/Comms both carry one). The person accountable for every function's exposure is the only one who never sees most of it. **This is worth building — one lesson, not a tour.** **(b) The three COE value cases are absent**, confirmed by reading M4 and M6 in full. M4 is the IBM AskHR service-delivery case — People Ops' economics, in real depth. Comp's *not cheaper, better*, analytics' *production was never the bottleneck*, and the recruiter signal collapse appear nowhere. **Weaker as a defect:** the CPO track is deliberately a set of leadership arguments, not a summary of the other nine, and M6 already teaches the skill (*was the thing studied the thing being claimed?*) that these would exercise. File it, build (a) first. | read of `ai301-cpo-m1..m6` | **(a) shipped** — `ai301-cpo-m5` Lesson 2 · (b) open — low |
| **CP-6** | **Construct validity for performance and potential instruments.** Analytics M3 L4 already teaches *executable is not valid* for engagement constructs. Performance ratings and potential definitions are the same problem with higher stakes and **no external referent** — a pay range can be benchmarked, a competency cannot. Analytics M2 already names performance data as "a rating produced by the system you are evaluating"; the curriculum currently treats a rating as a confounder without ever asking whether it measures anything. **The strongest of the three.** | Talent Management exploration → `ai301-analytics-m3` | **shipped** — Analytics M3 L4 |
| **CP-7** | **The agreement problem.** *A competency framework is now free to produce and no cheaper to justify — the framework was never scarce, the agreement was.* Structurally the analytics scarcity stack one function over. Needs a home, not a course; TD M4 (*where the machine stops*) is the closest fit. | Talent Management exploration → `ai301-talent-dev-m4` or CPO | **shipped** — TD M4, new Lesson 5 |
| **CP-8** | **Calibration as a designed process.** What evidence is admissible, and what a model may do with a rating distribution — surface outliers, yes; resolve a disagreement, no. **This is the LER line applied to ratings instead of witness accounts**, and it belongs with the function that runs calibration. | Talent Management exploration → `ai301-hrbp` | **shipped** — HRBP M4, new Lesson 5 |

---

## C-06 · Comp track citation audit — closed, with two findings

**The finding that prompted it: the "~1% of organizations have a written AI policy" figure never
shipped.** It appears exactly once in the repository — `content/course-301-comp-benefits-outline.md`,
an un-revised outline bullet — and **zero times** in any module draft or package. What shipped is the
corrected figure, and M4 explicitly repudiates the old one: *"You may have been told that written AI
policies are rare… That isn't true: roughly 68% of employers now have a formal AI policy."* The
activity was reframed around clarity and function-specificity exactly as the verification record
instructed. **No unverified claim shipped.**

Two real findings came out of the audit:

1. **The outline contradicts its own verification record.** The failed 1% figure is still stated with
   a `[V]` marker 160 lines above the section that refutes it, and the line reading *"Outstanding and
   still blocking: ERISA fiduciary specifics, US state pay-transparency regimes…"* was never edited
   even though the second-pass record below it resolves two of the three. (The third — pay-equity
   product claims — was *avoided* rather than resolved: M4 cites no vendor product statistics.) An
   outline that contradicts itself will mislead the next thread that reads it. → **fixed**
2. **Point-of-claim sourcing** is thinner than the track's own stated standard. → **S-8**

**The generalisable rules, now in the authoring brief:** a `[V]` figure carries its sample and date
**at the point of claim**, not only in the sources block; and when a track resolves a blocking item,
it **edits the blocking line** rather than appending a resolution below it.
