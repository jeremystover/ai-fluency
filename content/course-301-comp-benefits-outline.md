# AI 301 · The Specialist — Comp & Benefits track · "Numbers That Hold" (draft v1)

**Audience:** Comp analysts and partners, benefits managers, total rewards leads — anyone who owns
the merit cycle, the benchmarking, the plan design, the equity analysis, or the renewal.
**Level transition:** L3 The Specialist → L4 The Translator.
**Shape:** 6 modules · 45–60 min of content each · ~5h of course, plus artifact work that scales
with how seriously the learner takes it. Async and self-serve.
**Prerequisite:** AI 101 (or test-out) and AI 201.
**Tooling stance:** Tool-agnostic. Statutes, adoption statistics, survey-provider specifics, and
platform features are volatile-layer `[V]` — this track's legal surface moves faster than either
other track's.

---

## Design premises

**This is a 300-level course, which means it refuses to do the 100-level job.** No explanation of
what an LLM is, no prompting primer, no tool tour — 101 and 201 covered that, and this track
says so out loud. Most competing material spends half its runtime on remedial content because
it's selling to novices. **The refusal is the product.**

**The job is not to transfer knowledge — it's to manufacture positions.** Every module ends in
something the learner *made* and a claim they have to take a side on, in writing, before they see
how anyone else answered.

**Score the delta, not the score.** The assessment that matters is whether the learner's Module 6
position differs from their Module 1 prediction — and whether they can say why. **Evidence of
updating is the signal worth measuring.** This is the strongest idea in this track and it belongs
across all three (see the spine test).

## The through-line

> **You are the most numerate function in HR, and that is exactly what makes fluent output
> dangerous here. A wrong sentence gets caught. A wrong model gets presented.**

## Where the learner stands

They are the most analytically capable people in the function, and their instinct — *I'd spot a
bad number* — is right about arithmetic and wrong about models. They also hold the most
restricted data in HR: individual pay is Tier 4 under 101 M4, so the core of their work is the
material they can least freely put in a tool.

> "My data is the most sensitive in the building and my output goes to the board. Tell me what I
> can actually use this for, and how to keep a confident wrong number out of a deck with my name
> on it."

## The spine: one live cycle, and the delta

Every module advances **one real thing the learner owns** — a merit cycle, an open enrollment, a
benchmarking round, an equity review. And every module opens with a prediction, so that M6 can
measure how far the learner moved and whether they can account for it.

---

## M1 · What this job actually is

*~45 min · opens with the prediction gate, before any content*

- **Lesson 1:** The function, reconstructed honestly. Comp side: architecture, market
  intelligence, structure, cycle execution, variable pay, equity, executive comp, pay equity.
  Benefits side: plan design and funding, renewals and vendor leverage, retirement fiduciary work,
  leave, enrollment.
- **Lesson 2:** The five work types — **data assembly, analysis, judgment, explanation,
  governance.** Every task in the function is one of these, and they have completely different
  relationships with AI.
- **Lesson 3:** Where AI actually lands per type — and the finding most people guess wrong:
  **explanation is the largest and most transformed.** Explaining a band to a manager, a merit
  outcome to an employee, an equity grant to a candidate, a renewal to a CFO. Most comp leaders
  predict analysis dominates their week; it doesn't.
- **Lesson 4:** Why this makes your AI strategy a *work-type* strategy rather than a tool
  strategy — and why buying by tool category is how functions end up with three products serving
  the work type that needed the least help.
- **Interactive:** sorting — twelve real C&B tasks into the five work types.
- **Activity:** *"Work-type map"* — your own week, predicted split versus actual.
  **Calibration (the gate):** commit your five percentages before Lesson 1.
- **Claim:** *"You think this job is analysis. It's explanation with analysis attached."*

## M2 · Reading the evidence

*~45 min*

- **Lesson 1:** The adoption picture without the marketing `[V]`. 20% currently operationalizing
  AI in benefits against 72% planning to within two years; 39% of HR functions having adopted
  anything at all while 54% have no plans this year; 88% of HR leaders reporting no significant
  business value yet.
- **Lesson 2:** The meta-lesson, which is the transferable one: **most published "AI in comp"
  thought leadership is vendor content describing a product roadmap as an industry trend.** How
  to tell — who funded it, what's being sold, whether the "trend" has any subject other than the
  vendor's roadmap.
- **Lesson 3:** The teardown method. What's the evidence, what's the sample, and what would
  falsify it. (101 M2's vendor teardown, aimed at a literature rather than a product.)
- **Lesson 4:** Data that was soft before AI touched it `[V]`. Six-incumbent matches, thin cuts,
  aging, matching quality. Market data was always an estimate — AI didn't make it worse, it made
  it faster to present, which is worse.
- **Interactive:** choice — four claims from comp-tech marketing; find the one with evidence
  behind it.
- **Activity:** *"Teardown"* — one specific AI claim made by a vendor **you currently pay**.
  Evidence, sample, falsifier. **Calibration:** predict the share of HR functions with no AI plans
  this year.
- **Claim:** *"Most of what you've read about AI in comp is a product roadmap wearing an industry
  trend's clothes."*

## M3 · The craft layer

*~60 min · the longest module, and the one nothing else on the market has*

- **Lesson 1:** Why numerate people are *more* exposed. You read a formatted model the way you
  read a formatted sentence — quickly, and for shape — and shape is the one thing the model
  always gets right. **The rule this module builds toward: never present a number you couldn't
  rebuild from its inputs in front of the person asking.**
- **Lesson 2:** The perimeter and the data. Staying inside the security perimeter. **Dropping
  unneeded columns rather than anonymizing them** — the cheapest control in the discipline.
  Pseudonymizing before upload, with the mapping held outside the session.
- **Lesson 3:** Verification as craft. Demanding **audit files with row counts and documented
  joins.** The **Python-then-Excel double-pass**, so a finance partner can still review formulas
  the way they always have rather than being asked to trust a black box. And **specifying
  reconciliation explicitly** — the model will not propose those checks itself, and its silence
  is not reassurance.
- **Lesson 4:** Durability. Insights files, data-mapping files, and **terminology files for the
  terms models reliably fumble** — target vs. actual, grant date vs. vest date, FMV vs. strike.
  Bundled into a reusable starter kit. (This is 201 M2's context pack, specialized to a domain
  where the vocabulary is a minefield.)
- **Interactive:** choice — four analysis workflows; find the one whose reconciliation is theater.
- **Activity:** *"The starter kit"* — a complete, working kit for one recurring analysis you
  actually run: insights file, data map, terminology file, and the reconciliation spec.
  **Calibration:** predict whether your current workflow would survive an audit of its joins.
- **Claim:** *"Your analytical training is why you'll miss it. You read models for shape, and
  shape is the one thing the model always gets right."*

## M4 · The exclusion zone

*~50 min · counsel review required before ship*

- **Lesson 1:** The governing principle: **AI for speed, human-built tooling for accountability.**
  Everything in this module follows from deciding which side of that line a task sits on.
- **Lesson 2:** The zones. Pay equity regression conducted under privilege. Fiduciary duty on
  retirement plans. Comp committee and proxy inputs. And the sharp one: **disparate impact
  exposure when a model trained on historical pay recommends adjustments** — the model learns what
  you paid, which is the thing you're trying to audit.
- **Lesson 3:** Method literacy `[V]`. What a regression controls for, and what that choice
  smuggles in; why "explained" variance is a modeling decision with fairness consequences, not a
  statistical fact; and what a vendor's equity product is actually computing. You will be asked
  to interpret one of these — reading it critically is the job.
- **Lesson 4:** The statutory floor `[V]`. Pay transparency regimes across US states and the EU
  Pay Transparency Directive's reporting and joint-assessment duties — and where AI touches them:
  generating ranges for postings, drafting disclosures, and running the joint assessments the
  directive requires.
- **Interactive:** sorting — ten uses across comp and benefits: run it / run it with the record /
  never.
- **Activity:** *"The operating policy"* — not a whole-organization AI policy but the comp and
  benefits **appendix** to one: red lines, approved uses, review checkpoints, escalation path.
  ~~Roughly 1% of organizations have one~~ — **corrected in verification: 68% of employers have a
  formal AI policy** `[V]`, so existence is not the differentiator. The gap is **clarity and
  function-specificity** — about a quarter of policy-holders believe theirs is clear, and 44% of US
  workers report none or don't know. **Calibration:** predict the share of employers with a written
  policy, and the share who think theirs is clear.
- **Claim:** *"'The tool recommended it' is not a defense anywhere in HR. Where you hold a
  fiduciary duty, it's an admission."*

## M5 · The counterparty

*~45 min · the module that makes people uncomfortable, which is why it sits at five*

- **Lesson 1:** The employee side `[V]`. In one survey, 85% reported using ChatGPT for salary
  negotiation and 63% believed it produced a stronger offer. Your candidates arrive briefed.
- **Lesson 2:** And the briefing is unreliable in exactly the way that matters `[V]`. A controlled
  audit of 98,800 prompts per model version found the models weren't consistent enough to be
  trusted for the task — with the largest gaps between model versions, and **between prompts
  voiced as employee versus employer.** You are negotiating against confident, inconsistent
  advice, which is harder than negotiating against good advice.
- **Lesson 3:** The third counterparty `[V]`. Investors applying AI to ingest proxy statements,
  pay tables, and peer data to flag outliers across whole portfolios, with institutions moving
  toward customized voting policies applied by models. Your executive comp disclosure is now read
  by machines, at scale, against every peer at once.
- **Lesson 4:** What survives contact. A pay story that holds when the other side has the same
  tools: range logic that's defensible, a rationale that doesn't depend on the listener not
  checking, and the discipline of knowing what you can say out loud.
- **Interactive:** choice — four negotiation rationales; find the one that survives the adversary.
- **Activity:** *"First contact"* — run your own range and rationale through the adversary's
  prompt, **as the employee**. Bring back what it said, and what you'd change.
  **Calibration:** predict whether your rationale survives.
- **Claim:** *"Your pay story is already being audited by a model. You just haven't read the
  report."*

## M6 · The bet

*~45 min · the course lands*

- **Lesson 1:** The leverage ladder — **compress, continuous, explain, design.** What each rung
  actually requires, and which ones a comp function can reach this year.
- **Lesson 2:** The role decomposition. Analysts gain productivity; partners gain coverage;
  operations gain efficiency — **and efficiency matters least, because comp teams aren't big
  enough for headcount savings to matter.** The honest version of the value case for a small
  function.
- **Lesson 3:** Why *explain* is the rung this function systematically undervalues — the callback
  to M1's finding, now with the ladder to place it on.
- **Lesson 4:** Betting honestly. What you'd measure at 90 days, and **what you'd stop doing to
  fund it.** That line is what separates a bet from a wish.
- **Interactive:** choice — four proposed bets; find the wish.
- **Activity (course close):** *"The bet"* — one page: which rung, which specific use case, what
  you'd measure at 90 days, what you'd stop doing to fund it. Then **the delta**: how your M6
  position differs from your M1 prediction, and why. The rubric grades the account of the change,
  not the accuracy of either end.
- **Claim:** *"A bet without a funding line is a wish."*

---

## Decisions (v1)

1. **Async and self-serve.** The source was pre-work for a live discussion. Positions still get
   manufactured and committed in writing — into the activity submission, where a rubric dimension
   grades whether the learner engaged the strongest case against their own view, and where the
   tutor can argue it live because it reads every block.
2. **"Artifacts other people can attack" — what actually exists.** There is no learner-to-learner
   peer exchange in the product. There is an operator review queue (`fd_review`, the async
   backstop the 201 outline specifies) and the tutor. So M3's kit-swapping and M4's red-line
   defence run against the tutor as adversary and, where an operator is in the loop, the review
   queue. Building peer-to-peer exchange is a product decision, not a content one.
3. **Score the delta, not the score — adopted course-wide.** M1's prediction gate and M6's
   reckoning are the same instrument, and this principle should be retrofitted into the HRBP
   track's calibration reckoning, which currently measures accuracy of prediction rather than
   evidence of updating. That is a real improvement to a track already outlined.
4. **Six modules.** The benchmarking module from the earlier draft dissolves: survey-provider
   claims are M2's teardown target, and market-pricing analysis is a use case for M3's craft. One
   less module, nothing lost.
5. **The confidence trap opens M3 rather than standing alone.** It is the *reason* the craft layer
   exists — reconciliation specs and audit files are the answer to it — so it motivates the module
   instead of occupying its own.
6. **The refusal is stated in the content, not just the outline.** The course opens by saying what
   it will not teach. That's a credibility move for this audience and it's true.
7. **Verification: done, and it changed two modules.** See the verification record below.
   **All items subsequently resolved — nothing shipped unverified.** ERISA fiduciary specifics and
   US state pay-transparency regimes were closed in the second pass (see *Verified before drafting
   M4*). Pay-equity-product claims were **avoided rather than resolved**: M4's method lesson cites
   no vendor product statistics, so the blocking item never became structural.

## Open question: the time budget

The source sets 8–10 hours. That is a considered number — thin courses don't change behaviour,
and thirty-hour courses don't get finished — but it was set for a cohort with a live session as
the forcing function. **Async, with no deadline, 8–10 hours is a completion risk.** The outline
above splits the difference: ~5 hours of module content, with artifact work scaling to the
learner's seriousness. The artifacts here are unusually valuable standalone — a working starter
kit and a drafted AI operating policy are things people would pay for on their own — so the depth
is available to whoever wants it without gating completion behind it. Worth confirming.

---

# The spine test, revised — three designs

The third design changes the answer in two directions.

## What recurs

| Slot | HRBP | Recruiter | C&B | Verdict |
|---|---|---|---|---|
| **Opening prediction** | calibration prompt | calibration prompt | the prediction gate | **3/3 — genuinely shared**, and all three use it the same way |
| **Decompose your own job** | M2 Sort your own job | R2 Sort your own job | M1 five work types | **3/3 — shared frame**, though C&B decomposes by *work type* rather than leverage tier, which is better for that role |
| **The counterparty has AI too** | *(latent — AI-written complaints, AI-assisted self-reviews)* | R1/R4 both sides of the table | M5 The counterparty | **2/3 explicit, 1 latent — stronger than I credited.** Likely a real shared slot |
| **The floor / exclusion zone** | M6 | R6 | M4 | **3/3 as position**, near-zero shared content — employment vs. hiring vs. ERISA-and-transparency |
| **The closing bet with a baseline** | M7 | R7 | M6 | **3/3 in position and shape** |
| **The diagnosis** | M1 | R1 | *(absent — M1 is decomposition)* | **2/3 — weaker than I claimed** |

## What doesn't recur

Honest arithmetic (HRBP only). Adversarial rehearsal (HRBP module, recruiter technique, absent
for C&B). Intake, the closed loop, pay equity, the craft layer, the un-pasteable data — all
role-unique. And *arguing with Finance* is present for HRBP, **inverted** for C&B, absent for
recruiters.

## The corrected conclusion

My "seven of eight map cleanly" was wrong, and my follow-up — "only one frame recurs" — was too
pessimistic. Three designs in, the real answer:

**Four things recur, and only one of them is content.** The opening prediction, the job
decomposition, the floor-as-position, and the closing bet. Of those, only the decomposition
carries teachable method across roles.

**The strongest shared thing isn't structure at all — it's an assessment philosophy.** Score the
delta, not the score. Open with a committed prediction, close by measuring whether the learner
moved and whether they can account for it. That works in every track, it's already half-built in
the product, and it's the thing worth writing into the convention.

**And every track's best material remains role-unique** — the craft layer, intake, the closed
loop, pay equity, ER documentation, the allocation argument. Three for three. Whatever convention
we write down must protect the middle of each course from it.

## What to build

- **A shared evidence library.** The HR-wide statistics — botsitting, 87/75/50, the adoption map,
  the coaching RCT, workslop — are the volatile mass, they're identical across tracks, and six
  roles means six drifting copies. Author once, reference from any track.
- **Separate courses per track.** `ai301-hrbp`, `ai301-recruiter`, `ai301-comp`.
- **A written convention, not a template:** open with a prediction; decompose the job; two to four
  role-discovered depth modules; the floor; close on a bet with a baseline and the delta. With the
  standing rule that **depth modules are discovered from the role and never derived from the
  convention** — that rule is what produced the craft layer, intake, and the closed loop, and a
  template would have prevented all three.

---

# Verification record

Run before drafting, per the track's own standard. Four claims verified as stated, one failed
outright, and two came back richer than the outline had them.

## Verified as stated

| Claim | Source | Notes for drafting |
|---|---|---|
| **20% of employers currently operationalizing AI in benefits; 72% plan to within two years** | WTW, *2026 AI Use in Health and Benefits Survey* — 312 employers, 4.6M US employees, fielded Jan–Feb 2026 | Also usable: planned investment concentrates in communication (68%), data analytics (59%), personalized support (57%). Note the scope is **health and benefits**, not total rewards — do not widen it. |
| **85% used ChatGPT for salary negotiation; 63% said it produced a stronger offer** | Survey of 899 professionals for Eastern Washington University — 488 hiring managers, 411 workers | **Critical qualifier:** the 411 workers had *already used AI* for negotiation prep. So it's 85% *of AI-using candidates*, not of all candidates. State this in-lesson — a module teaching sample-reading must read its own. Also available: 78% feel more confident negotiating with AI prep; 55% secured higher base pay. |
| **88% of HR leaders report no significant business value from AI tools** | Gartner | Already used in the HRBP track. |
| **Mobley agent theory, EU Annex III deferral, emotion-recognition prohibition** | Verified for HRBP M6 and recruiter R6 | Reusable verbatim. |

## Failed — do not use

**"Roughly 1% of organizations have a written AI operating policy."** This does not hold, and the
real data contradicts it: **68% of employers now have a formal AI policy** (Littler, May 2026
Annual Employer Survey), roughly double the 38% a year earlier; among AI-adopting organizations,
47% have policies regulating workforce use, ranging from 56% at large organizations to 36% at
small ones.

**The better finding underneath it, which reframes M4's activity:** of organizations that *have*
a policy, only about a quarter believe it is clear and future-proof, and 44% of US workers say
their employer has no clear AI policy or they don't know whether one exists. So the gap is not
existence — it is **clarity and function-specificity**. M4's activity should not promise the
learner they'll be among the 1% with a policy. It should promise something truer and more useful:
most organizations have a policy, most of them are neither clear nor written for comp work, and
theirs will name actual red lines for pay equity, fiduciary decisions, and proxy inputs.

## Came back richer than the outline

**The negotiation-advice audit (M5).** Geiger et al., *PLOS ONE*, February 2025 — 98,800 prompts
submitted to **each of four ChatGPT versions**, systematically varying gender, university, and
major, and testing prompts voiced as **the employee versus the employer**. Findings: statistically
significant salary differences by gender in all four models (smaller than other attributes); the
**largest gaps were between model versions and between employee- and employer-voiced prompts**;
substantial gaps by university and major, inconsistent across versions; and **wildly inconsistent
results for fictional and fraudulent universities** — the model confidently prices institutions
that do not exist.

Two consequences the outline missed. The employee/employer voicing gap means **the same model
gives the two sides of your negotiation different numbers**, which is a sharper framing than
"candidates arrive briefed." And the gender and university effects mean this is not only a story
about your counterparty — **a comp team using the same tool for pay decisions would be
introducing exactly the disparate impact M4 is about.** That second angle belongs in the module.

**The EU Pay Transparency Directive (M4).** The 7 June 2026 transposition deadline **has passed**,
and only 4 of 27 member states met it (Slovakia, Italy, Lithuania, Malta); Germany, France, the
Netherlands and Spain openly missed it. Employers with 100+ workers must publish median gender pay
gap, the gap in variable components, and the proportion of each gender per quartile pay band
(smaller employers report every three years). Where a mean gap **exceeds 5%** in any category of
workers and cannot be justified on objective, gender-neutral criteria, **Article 10 requires a
joint pay assessment** — seven criteria, conducted *in cooperation with worker representatives*,
published to workers and available to equality bodies and labour inspectorates.

**The finding worth building a lesson around:** the joint pay assessment **cannot be conducted
confidentially**. That collides directly with the US privilege strategy in M4 Lesson 4 — where the
sophisticated posture is to run pay equity analysis under counsel to protect it from discovery. A
comp leader with operations on both sides has to hold two opposite postures at once: privileged
and protected in the US, mandatory and published in the EU. Neither outline had this, and it is
the most role-specific legal content available to this track.

## Verified before drafting M4 (second pass)

**US state pay transparency `[V]`.** 18 states plus Washington DC have pay transparency laws as of
2026, with penalties running from $100 to $250,000 per violation depending on jurisdiction. The
regimes are not uniform: some require a range in every posting (California, Colorado, New York),
others only on request or after an interview. Most require a **good-faith estimate** of what the
employer actually expects to pay. Remote postings are generally subject to the law of any state
where the work could be performed, so multi-state employers effectively comply with the strictest
applicable rule.

**ERISA and AI `[V]`.** No AI-specific ERISA rule exists; the ordinary duties do the work —
prudence, loyalty, monitoring, documentation, and the exclusive benefit rule. The practitioner
consensus is that AI must sit in a **decision-support role with final authority in human hands**,
and that adverse benefit determinations require human involvement. Courts examine *how*
fiduciaries reached a decision, not only what they decided, which makes the process record the
asset. Note for accuracy: **DOL EBSA Technical Release 2026-01 (April 1, 2026) is about proxy
advisory services, not AI** — do not cite it as AI guidance. It is relevant to M5's institutional
investor lesson instead.

**Privilege and AI — two decisions, one week, opposite results `[V]`.** This is the strongest new
material for M4 and neither outline had it.

- ***United States v. Heppner*** (S.D.N.Y., Judge Rakoff; ordered orally Feb 10, 2026, written
  opinion Feb 17, 2026). A criminal defendant, who had retained counsel but acted **independently
  and not at counsel's direction**, put information learned from his lawyers into a public
  conversational AI platform. Held: neither attorney-client privilege nor work product protection
  applied. Three independent grounds — the platform is not a lawyer, so there was no
  attorney-client communication; the platform's terms defeated any reasonable expectation of
  confidentiality; and the purpose was not to obtain legal advice from an entity that disclaims
  giving it. Question of first impression nationwide.
- ***Warner v. Gilbarco, Inc.*** (Judge Patti, Feb 10, 2026). A pro se plaintiff's use of
  generative AI in litigation **did not** waive work product protection. AI programs are "tools,
  not persons," disclosure to a tool is not disclosure to an adversary, and holding otherwise
  "would nullify work-product protection in nearly every modern drafting environment."

The synthesis for the module: the two cases are reconcilable — Heppner turns on *consumer terms
plus absence of counsel's direction*, Gilbarco on *a tool used as a drafting instrument*. The
practical rule that follows is **enterprise deployment plus documented direction of counsel**, and
the honest statement is that this floor is unsettled and moving. Courts have **not** yet ruled on
the case where counsel expressly directs a client to use an AI tool, which is precisely the pay
equity posture this track teaches.
