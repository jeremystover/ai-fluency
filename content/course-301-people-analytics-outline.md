# AI 301 · The Specialist — People Analytics track · "What's Left When Analysis Is Free" (draft v2, integrated)

**Audience:** People Analytics analysts, managers and directors; workforce analytics and workforce
planning; HR data scientists; employee listening and engagement survey owners; DEI measurement leads
where that work sits with analytics.
**Level transition:** L3 The Specialist → L4 The Translator.
**Course id:** `ai301-analytics` · role id `peopleanalytics`, label "People Analytics".
**Shape:** 6 modules · 35–45 min each · ~3h30 plus a 15-minute pre-work audit — same package as the
rest of the ladder: read, micro dose, tutor, podcast, one interactive, one AI-graded activity, one
knowledge check. Async and self-serve.
**Prerequisite:** AI 101 (or the diagnostic test-out) and AI 201. **This track additionally assumes
the job:** SQL, statistics, an HRIS, and stakeholder scar tissue. Nothing here is a tutorial, and it
assumes the learner has used a frontier model and was unimpressed.
**Tooling stance:** Tool-agnostic. Statutes, adoption figures, and published research are
volatile-layer `[V]`.
**Boundary, inherited not invented:** the People Ops & HR Technology track scoped itself to
*retrieval and reporting, not inference*, and left inference here. Honored exactly — **People Ops
owns getting the right rows to the right person; this track owns what you are entitled to conclude
from them.**

Exploration and first verification log: `content/course-301-people-analytics-exploration.md`.
**v2 integrates a human-written brief (PA 301–306). The verdict and what changed: Decisions 1–5.**

---

## The through-line

> **Everyone can produce the analysis now. What's left is knowing when to stop — and being the
> person whose stopping the organization believes.**

The brief's title is the premise and it is better than the one it replaced: *what's left when analysis
is free.* The through-line above is the answer, and it reframes the whole track from a defensive
posture (*here is why your inference is shakier than you think*) to an operational one (*here is the
expert move, and it is subtractive*).

One idea from v1 survives inside it, because it explains **why** the audience will resist the
premise: this is the most methodologically trained group in People, and their training protects the
table and says nothing about the leap. They will catch a bad number faster than anyone in the
function. **The claim is not the number**, and a wrong inference from a right table gets believed,
funded, and repeated for three years.

## Where the learner stands

Their capability did not change. Everyone else's did. An HRBP with a CSV now produces a cut, a
chart, a regression and a confident paragraph in an afternoon, and the analyst's scarcity moved —
quietly, with no announcement — **from producing analysis to adjudicating it.**

> "Everyone can make a chart now, and most of them are wrong in ways only I can see. Tell me what my
> job is when production stops being scarce — and give me something better than 'be more rigorous.'"

**What this course refuses to be, stated in its first paragraph:** a course about producing analysis
faster. That capability just stopped being scarce.

## The spine: one question you owe someone, and one deployment already underway

The brief's artifact discipline is adopted whole — **every module ends in something the learner
brings to a room**, not a reflection. Two threads carry it:

1. **A live analytical question the learner actually owes a named requester** — the kind that arrives
   with a deadline and an implied answer.
2. **An AI deployment already underway in their company** — introduced in M4, because the brief is
   right that this is the thread that gets them into rooms they are not currently in.

| Module | Artifact |
|---|---|
| Pre-work | Last quarter's output classified against the stack, before any teaching |
| M1 | The function scored against the stack, plus the capability they'd lose least by giving up |
| M2 | An **invariants file** for one recurring analysis — the conditions under which work must halt |
| M3 | Their three most-contested metrics, defined precisely enough to be machine-executable |
| M4 | A one-page measurement design for an AI deployment already running in their company |
| M5 | An inventory of AI systems touching people decisions, with first-pass risk classification |
| M6 | A 90-day plan for one undeniable win that establishes the claim |

**Every module opens with a claim the learner must contest**, per the convention the People Ops
outline established course-wide in place of the numeric calibration prompt. Contesting is the
prediction — commit to "true of us / not true of us," then verify against evidence from your own
systems. M6 reads the pattern; the rubric grades **evidence of updating**, never who guessed right.

**One addition this track contributes back to that convention.** For this audience, "go and check"
will sometimes return *our evidence cannot settle this* — and that is a finding, not a failed
activity. **Every rubric must score it at full credit with an account of why.** Without that, the
convention punishes the honest answer in the one track built to teach it.

---

## Pre-work · The Portfolio Audit

*15 min, before any content · no teaching — the honest answer is wanted before the framework biases
it*

Classify last quarter's **actual** output against the five scarcities. Then two questions:

- **What percentage of your team's hours went to things a competent generalist with a good model
  could now produce?**
- **Make the strongest case your organization would notice if your team vanished on Monday. Then
  make the case against.**

Both are the brief's and both are kept verbatim, because the second one is the best single question
in either document — it is a prediction, a diagnosis and a threat assessment in one, and it cannot
be answered defensively without the learner noticing they are being defensive.

**One adaptation, and it is the only place the brief and the product genuinely diverge.** The brief
pays this off with a **cross-cohort dataset** — *"your opening slide, and it will be the
most-photographed thing in the deck."* That is a real product insight and it is right, and the
product has no cohort aggregation, so the async course cannot deliver it today. Logged as a product
opportunity rather than quietly dropped (see Decision 5). What ships now: the learner's own numbers,
held and returned to them in M6's reckoning. **The comparison to peers is the thing to build; the
comparison to your own earlier answer is the thing we have.**

## M1 · The Scarcity Stack

*~35 min · the diagnosis and the decomposition in one*

**Claim to contest:** *"Most of what your function publishes is description wearing explanation's
clothes — and the people who used to need you for it don't need you anymore."*

- **Lesson 1:** The five-layer stack. `[AUTHOR'S INPUT NEEDED — see Open Questions.]` The brief names
  the frame and the modules imply its shape; the layers themselves are not enumerated in the brief
  and this outline will not invent the load-bearing structure of someone else's model. My
  reconstruction, offered to be corrected rather than adopted: **definitional authority** (what the
  metric means), **methodological judgment** (when to stop), **causal and evaluative design** (what
  would actually settle this), **governance standing** (who is accountable for a model about people),
  and **trust** (whose number the room believes). Each maps to a module, which is why I think the
  reconstruction is close; the naming and ordering are the author's.
- **Lesson 2:** The evidence that it is already happening `[V]`. Three items, and the module must be
  precise about what kind of evidence each one is, because this track's credibility depends on
  getting that right in its first ten minutes:
  - The **collapse-of-analysis argument** (Napper, and Napper & Stehlík on causal inference in people
    analytics) — an *argument* from practitioners inside the field, cited as an argument.
  - **Stehlík commoditizing an ONA product in two or three hours** — an *existence proof*, which is
    the strongest thing a demonstration can be and does not need a sample. **Framed as an existence
    proof, not as evidence of a trend**, and the difference is the lesson.
  - **Insight222's finding that technology investment is migrating away from dashboards and
    specialist platforms toward AI** — subscription research; cite with its access status stated.
- **Lesson 3:** Where your hours are versus where your value is. Most analytics functions spend the
  majority of their time in the layer that just got cheapest and most of their reputation in the
  layers where the warrant is hardest and the review is thinnest. Name the asymmetry rather than
  resolving it — the recurring reporting is a real obligation, and the point is that it is the part
  most safely delegated and the part most often defended.
- **Lesson 4:** The teardown, turned around `[V]`. Comp M2 taught the three questions — evidence,
  sample, falsifier — for claims arriving from outside. **You are now the one being asked.** Run
  them on your own last published finding. And the honest opening this track earns the right to
  make: **the evidence base about people analytics is worse than the evidence base people analytics
  demands of everyone else.** Go looking for a primary source on whether analytics functions improve
  decisions, or whether deployed attrition models reduce attrition; what comes back is vendor
  maturity models and self-reported case studies. Ten minutes, checkable by any learner, and it is
  why this course starts here rather than with a capability tour.
- **Interactive:** sorting — twelve real analytics deliverables against the stack. Built so that
  several "explanation" deliverables are description with a causal verb attached, which is the
  mis-sort the module exists to produce.
- **Activity:** *"The function, scored"* — the stack scored for their team, plus **the single
  capability they'd lose least by giving up**, and the pre-work percentage revisited now that the
  framework exists. The brief's artifact, kept.

## M2 · Designing constraints — the guardrail discipline

*~45 min · the centerpiece, and the module nothing on the market comes close to*

**Claim to contest:** *"Your team has never written down a condition under which an analysis should
stop rather than produce a number."*

- **Lesson 1:** The thesis, stated flatly. **The expert move is stopping the model, not accelerating
  it.** Everything else in this module is machinery for making that affordable. This is the brief's
  sentence and it is the best idea in either document — it converts *rigor*, which is a virtue nobody
  can act on, into *halt conditions*, which are a thing you can write down on a Tuesday.
- **Lesson 2:** The anchor, and there is a better primary citation than the brief has `[V]`. The
  design pattern is real, deployed, published and open-sourced: **a human-in-the-loop agentic
  workflow for observational causal inference, developed at Netflix (`oci-agent`, arXiv 2607.22443,
  June 2026), orchestrating 100+ analyses per month.** Its architecture is an actor–critic loop —
  a **principal** supplies the analysis plan, an **actor** produces a spec and executes a templated
  notebook with diagnostics, a **critic** synthesises results and reports a **credibility level**
  back to the principal. What it automates is deliberately the laborious part: covariate balance
  checking, propensity score trimming, sensitivity analysis. **What it reserves for humans is
  framing the question, scrutinising assumptions, and evaluating diagnostics.** That division *is*
  the module's thesis, arrived at independently by a team shipping it at scale — which is a much
  stronger anchor than a practitioner demonstration, and it belongs in the lesson alongside
  Stehlík's people-analytics application of the idea.
- **Lesson 3:** The failure modes worth encoding for people data. The brief's list, kept and
  ordered: **small-n**, **post-treatment covariates**, **positivity violations**, **staggered
  adoption**, **contested estimands.** Each stated as a halt condition rather than a caution —
  *below this cell size, the analysis stops and reports that it stopped.*
- **Lesson 4:** The HR-specific instances, which is v1's contribution folded in underneath the
  brief's frame. Generic failure modes are learnable anywhere; **these are the ones that recur in
  this function and that no general model will flag.** *Exit reasons are what people were willing to
  say on the way out, to someone who might be a reference.* *Performance data is a rating produced by
  the system you are evaluating*, so using it as the outcome in a study of that system is circular in
  exactly the way comp M4's pay model is. *Promotion data is censored by everyone who left first.*
  *Survivorship runs through nearly every tenure analysis* — **"our long-tenured employees are more
  engaged" is a sentence about who stayed.** And **regression to the mean**, which explains most
  "our intervention worked" findings in People: you targeted the lowest-engagement teams, the
  worst-attrition function, the poorest-scoring managers, and **selection on an extreme guarantees
  movement toward the middle with no intervention at all.**
- **Lesson 5:** Prediction about individuals as a constraint problem — v1's standalone module,
  relocated here because the brief's frame makes it *better*, not merely smaller. A flight-risk model
  at 78% accuracy against a 12% base rate is wrong about a lot of named people, and the intervention
  lands on named people. Do the arithmetic in the lesson. Then the two halt conditions: **if the base
  rate makes individual-level use indefensible, stop** — and **the intervention paradox**, which is
  this role's structural trap. Act on the prediction and you destroy the ability to evaluate it;
  preserve the evaluation and you withheld something from a named person. **You cannot do both**, and
  every honest design here is a compromise. *Naming the compromise you chose is the professional
  act*, and it is an invariant worth writing down.
- **Lesson 6:** What AI is genuinely excellent at here, so the module is not only cautionary. Ask a
  model why attrition rose and it produces a coherent causal story and **will not volunteer the
  confound**, because nothing in what it is doing corresponds to looking for one — its silence
  carries no information (101 M6, comp M3). But asked *what else could explain this, argue against my
  conclusion, what would have to be true for this to be wrong*, it enumerates better than most
  analysts working alone. **The failure is in what you ask for, not in what it can do.** Highest-value
  move available to the role, and the direct complement to the halt conditions.
- **Interactive:** choice — four analysis workflows; find the one whose guardrails would actually
  fire. Distractors include a technically flawless pipeline with no halt condition, and a workflow
  whose "review step" cannot fail.
- **Activity:** *"The invariants file"* — a written invariants file for one recurring analysis in
  their shop: the conditions under which the work must **halt rather than produce a number**, each
  with a threshold and what happens when it trips. The brief's artifact, and the best one in either
  document, because it is reusable, operational, and survives the person who wrote it.

## M3 · The semantic layer

*~35 min · a genuine gap in v1, adopted whole*

**Claim to contest:** *"Two people in your company can ask the same attrition question today and get
different numbers, and neither of them will know."*

- **Lesson 1:** Definitions become executable. What actually happens when a CFO asks a natural-language
  question about attrition and **the model resolves the ambiguity itself** — silently picking a
  denominator, a population, a date basis, a treatment of internal transfers and fixed-term ends.
  Every one of those was a contested decision your function made once and never wrote down anywhere
  a machine could read. **The ambiguity did not appear; it became executable.**
- **Lesson 2:** The verification problem — the sharpest observation in the brief. **Knowing enough to
  check is a different skill from knowing the method**, and the second used to imply the first. A
  senior analyst who has never built a cohort curve by hand can evaluate a generated one only against
  plausibility, which Lesson 4 of M2 just spent a page explaining is not a check.
- **Lesson 3:** The apprenticeship problem, and the second-brain pattern as a *partial* answer. If
  juniors no longer do the grunt work, the path by which they learned to check disappears — and this
  is the one place where the function's capability degrades on a delay long enough that nobody
  attributes it correctly. The brief's honesty is kept: **partial answer, not a solution.** Capturing
  reasoning, decisions and dead ends in a durable, queryable form preserves some of what the grunt
  work used to teach, and it does not reproduce the part that came from being wrong in front of
  someone.
- **Lesson 4:** Executable is not valid — v1's instrument material, folded in where it belongs. A
  definition precise enough for a machine to execute is not thereby a definition of the thing you
  meant. **Engagement, inclusion, manager effectiveness, productivity** are latent constructs
  measured by proxy, and the proxy is a design choice that travels invisibly into every downstream
  finding. Two consequences for a listening program: **AI-written survey items are psychometrics
  wearing a drafting task's clothes**, and a reworded item breaks comparability with every prior
  wave, which is usually the entire value of the instrument. And **employees answer open-text
  questions with AI now** — what that does to your signal has not been measured by anyone, and the
  lesson says so rather than inventing a number; what it means practically is that verbatim volume
  and polish stopped being evidence of engagement with the survey.
- **Interactive:** choice — four natural-language questions with the answers a model returned; find
  the one where the resolution of the ambiguity changed the conclusion.
- **Activity:** *"The three contested metrics"* — their three most-contested metrics, defined
  precisely enough to be machine-executable, **edge cases included.** The brief's artifact. Graded on
  the edge cases, because that is where the contest actually lives.

## M4 · Measuring the AI transformation

*~45 min · the module that gets them into rooms · v1 badly under-weighted this and the brief is right*

**Claim to contest:** *"Your company has an AI deployment running right now with no baseline, and
nobody has asked you about it."*

- **Lesson 1:** The evidence gap, laid out cold `[V]`. All three of the brief's anchors verified, and
  two came back stronger than stated:
  - **METR (July 2025):** 16 experienced open-source developers, 246 real tasks in repositories they
    knew deeply, randomized to AI-allowed or AI-disallowed. **They were 19% slower with AI and
    believed they had been 20% faster** — having forecast 24% beforehand. *(Note for maintenance: METR
    published a February 2026 update changing their experiment design; the module should state the
    study's scope honestly — experienced developers in familiar repos is close to a worst case for
    these tools, which the authors say themselves.)*
  - **The firm-level picture** (Yotzov, Barrero, Bloom, Bunn, Davis, Foster *et al.* — a stratified
    survey of **5,000+ CFOs, CEOs and executives across the US, UK, Germany and Australia**): AI
    boosted productivity by about **0.29% over three years** on average — and the companion figure
    the brief did not have, which is the better one: **89% of firms report no productivity impact at
    all.** The mean is not a small uniform gain; it is a near-zero mass with a concentrated tail.
    Firms *forecast* 1.4% over the next three years. **The gap between the realized number and the
    forecast number is this module's subject.**
  - **Humlum & Vestergaard** (Denmark, worker- and workplace-level, NBER w33777): **precise null
    effects on earnings and hours, ruling out effects larger than 2%**, with users self-reporting
    average time savings of **2.8% of work hours** against RCT-documented gains **exceeding 15%** in
    the same occupations. *(The paper has been revised and retitled — cite the current version.)*
- **Lesson 2:** Why self-report is worse than nothing here. METR is the cleanest demonstration in the
  literature that **practitioners cannot feel the direction of their own productivity change**, and
  the 2.8%-versus-15% gap says the same thing from the other end. A survey asking employees whether
  AI made them faster does not measure productivity; it measures how AI *feels*, which moves for
  reasons unrelated to output. **Your function will be asked to run exactly that survey.**
- **Lesson 3:** Designs that work with the units you actually have. **Staggered rollout as a natural
  experiment** — the comparison is usually already available and nobody preserved it, which is a
  process failure rather than a methodological one and is fixed by asking *what would we compare this
  to* before any rollout. **Encouragement designs** where you cannot withhold access. **DiD**, with
  M2's staggered-adoption halt condition attached to it. And the ethics of the holdout, stated
  plainly.
- **Lesson 4:** The distinction most people collapse: **adoption, impact and displacement are three
  separate measurements** with different units, different timescales and different stakeholders — and
  a dashboard reporting licence activations has measured none of them. This is the sentence that
  earns the function its seat in the AI conversation.
- **Lesson 5:** The question you will be asked most and can least answer `[V]`. *What will AI do to
  our headcount and our skills?* It looks like a forecasting question and mostly is not — no base
  period, an undefined intervention, and an outcome that depends on decisions leadership has not made
  yet. **Declining it honestly and substituting what you can support** — exposure analysis, scenario
  ranges with assumptions exposed, a monitoring plan — is the highest-stakes application of this
  track's whole discipline, and *"I can't answer that with what we have, and here is what I can
  support"* is the most professionally valuable sentence in the role.
- **Interactive:** choice — four evaluation plans for the same AI deployment; find the one measuring
  activity and calling it change.
- **Activity:** *"The measurement design"* — one page for **an AI deployment already underway in
  their company**: the baseline and where it comes from, the design, the three separate measurements,
  the review date, and what result would count as failure. The brief's artifact, kept intact.

## M5 · Governing AI used on people

*~40 min · counsel review required before ship · heavily volatile*

**Claim to contest:** *"Nobody in your organization can produce a list of the AI systems currently
touching a decision about a person."*

**Subtraction note, and it disciplines the whole module.** Three shipped tracks already carry a
regulatory map: HRBP M6 (state AI employment law, the agent doctrine), recruiter R6 (adverse impact,
the four-fifths rule, bias audits **in a selection context**), and People Ops M7 (Article 26 deployer
duties, the Omnibus deferral, works councils, retention). **This module cross-references all three and
must not re-teach any of them.** What is genuinely new here is the argument for the claim and the
three surfaces that only analytics can work.

- **Lesson 1:** The argument for why this is yours, which is the brief's and is the best framing
  available `[V]`. **Legal cannot do this alone.** They can read the statute; they cannot run an
  adverse impact analysis, validate an instrument against the Uniform Guidelines, or tell you whether
  a model's disparity is an artifact of the control set. The obligations are legal and **the
  evidence that discharges them is statistical**, which puts the work in exactly one function. This
  is a stronger claim to the territory than v1's provider-versus-deployer framing, and it survives as
  the module's opening.
- **Lesson 2:** The map as of this week `[V]`, deliberately compressed because three tracks carry the
  detail. **The Omnibus deferral to December 2027 is not a repeal** — and the thing the deferral did
  *not* move is the transparency duty already in force. **Article 26(7) works council obligations
  bind now.** **California's FEHA automated-decision-system rules with four-year retention.**
  **Illinois. Colorado's January 2027 date.** All of it `[V]`, all of it verified before drafting,
  and the module's job is the *analytics consequence* of each — what has to be retained, what has to
  be testable, what has to be documented by someone who can read a regression.
- **Lesson 3:** You may be the **provider**, not only the deployer `[V]`. Every other floor module in
  this curriculum assumes the model arrived from a vendor and teaches the learner to find out who the
  deployer is. An organization that builds its own model for employment-related decisions occupies
  both positions, and the obligations that attach to *building* are not the ones that attach to
  *buying*. v1's contribution, kept because it is the one legal framing no other track can carry.
- **Lesson 4:** Purpose limitation, this function's most common quiet violation `[V]`. Data collected
  to run payroll, administer benefits, or field an engagement survey, then used to train a model
  predicting who will quit. Each collection had a stated purpose; the secondary use often has neither
  basis nor notice. **The engagement survey case is the sharpest** — data given under a
  confidentiality promise, repurposed as a model feature, breaks the promise even where it clears the
  legal bar.
- **Lesson 5:** Disclosure control, and the boundary with People Ops stated out loud so neither track
  drifts `[V]`. **People Ops M6 owns access control** — who can *retrieve* what; the assistant
  inherits its user's rights; the fix is permissions, indexing scope and least-privileged testing;
  the failure is *someone reached a document they shouldn't have.* **This track owns disclosure
  control** — what a legitimately-permissioned aggregate *reveals*; the fix is thresholds and
  suppression; the failure is *nobody's permissions were violated and the individual was identified
  anyway.* Minimum cell sizes, and the one everybody misses: **the differencing attack**, where two
  separately-compliant published cuts subtract to a group of one. Plus the new failure in open text —
  **a model asked for themes with supporting quotes returns the quotes intact**, and a verbatim
  naming a team, a manager or an incident identifies its author, where a human summariser smoothed
  that away as a side effect of being human.
- **Lesson 6:** Draw the surveillance line deliberately, **before it gets drawn by default.** The
  brief's, and it is the right closing move. Includes the questions M2's Lesson 5 raised and did not
  answer: does the individual know the score exists, is there a route to contest it, and **would you
  be comfortable telling them?** (101 M8's reader's-stake test, at its sharpest.) One usable
  data point `[V]`, citable **only with its interest stated in-lesson**: the strongest employee-side
  monitoring figures available — 56% reporting surveillance-related stress, 22% aware they are
  monitored against 74% of employers using tracking tools, 77% saying advance notice would reduce
  their concern — come from a 2025 ExpressVPN survey of 1,500 US workers. Sample disclosed, which
  beats most of this field, and **it is a VPN vendor publishing research on the harms of
  surveillance.** Naming that is the lesson. Note separately that these are *monitoring* figures, not
  *analytics* figures.
- **Interactive:** sorting — ten analytics activities: proceed / proceed with the record / stop and
  ask. Built so at least two "purely observational" analyses land in the wrong bucket for most
  learners.
- **Activity:** *"The inventory"* — every AI system touching a people decision in their organization,
  with a first-pass risk classification, who owns each, and what evidence would discharge the
  obligation. **Blanks assigned an owner and a date**, per the People Ops M3 convention. The brief's
  artifact.

## M6 · Claiming it

*~35 min · the course lands*

**Claim to contest:** *"Your team has been waiting to be given a mandate that nobody is going to
give you."*

- **Lesson 1:** Adoption is where AI investments in HR die — not technology. The brief's, and it
  reframes the closing module from *make your case* to *make it land*, which is the harder and more
  honest problem.
- **Lesson 2:** Product orientation as the competency nobody in people analytics was hired for.
  Shipping something people use is a different discipline from producing something that is correct,
  and this function selected for the second one at the hiring stage. Includes the version of the
  problem specific to the role: **a finding is not a product, and a dashboard nobody opens is a
  correct artifact that failed.**
- **Lesson 3:** Trust as the residual asset — the top of the stack and the last thing to commoditize.
  Also the module where the exec who ran their own numbers arrives, having asked a model the same
  question and gotten a more confident answer, because their analysis had no alternatives list.
  **What survives contact is not a better chart** — it is being able to say where your number comes
  from and what would change it, and being right that their analysis has a confound you can name.
  *(Comp M5's counterparty logic, one function over; cited, not re-derived.)*
- **Lesson 4:** The honest part, kept in the brief's own register. **Nobody hands you AI measurement
  or AI governance.** A three-person team reporting into HR Ops does not win a mandate by asking for
  one. It wins it by producing one artifact somebody needed and could not get anywhere else — which
  is what M4 and M5 just produced.
- **Lesson 5:** The bet, with a baseline, and this role's fourth term. Which layer of the stack to
  get better at, one specific change, what you'd measure at 90 days, what you'd stop doing to fund
  it — **plus which recurring report you would stop publishing.** Description is where the hours are
  and the least defended thing in the portfolio, and M1's *capability you'd lose least by giving up*
  has been waiting five modules for this sentence.
- **Interactive:** choice — four 90-day plans; find the one that is a request for permission wearing
  a plan's clothes.
- **Activity (course close):** *"The 90-day plan"* — one undeniable win that establishes the claim:
  the artifact, who receives it, what makes it undeniable, the baseline, and what you stop. Then
  **the delta**: the pre-work percentages and both vanish-on-Monday cases revisited, every claim
  contested in M1–M5, which turned out true of their organization, and what changed. The rubric
  grades the account of the change and the evidence behind it, never who guessed right — **and a
  documented "our evidence cannot settle this" scores at full credit.**

---

## Prerequisite map

- 101 and 201 assumed, plus the job. Modules point at prior material rather than re-teaching it —
  comp M2 (the teardown), comp M3 (construction), comp M4 L3 (control sets), recruiter R5 (the closed
  loop), recruiter R6 (adverse impact in selection), People Ops M5 (the source system), M6 (access
  control) and M7 (deployer duties).
- Pre-work before M1, always — the honest answer is wanted before the framework.
- M1 first; the stack indexes every later module.
- M2 before M4 (the halt conditions are reused in the measurement design) and before M5.
- M3 independent; can move earlier for a listening- or reporting-heavy learner.
- M5 after M2 (the surveillance line needs the prediction material in front of it).
- M6 last; it carries the delta reckoning.

## Per-module deliverables

Same package and pipeline as the rest of the ladder: draft at
`content/ai301-analytics-mN-<slug>.md` → `scripts/convert-draft.mjs` → hand-tuned `blocks.json`,
`micro.json`, `knowledge-check.json`, `rubric.json`, `sorting.json` or `choice.json`, `activity.json`
→ add rows to `content/modules.json` **only when the track is complete** → register in
`src/shared/roles.ts` → `generate-seed.mjs`.

Registration note: `roles.ts` folds analytics into `other`, which falls back to `ai301-hrbp`.
Shipping this and People Ops means adding `peopleanalytics` and `peopleops` choices, after which
`other` covers talent development, employee experience and function leadership only.

## Decisions (v2)

**1. The brief's spine wins, more decisively than in any previous track — five of six modules survive
essentially intact, and the title is the premise.** *What's left when analysis is free* states the
question the course exists to answer; v1's *The Warrant* named a property. Adopted whole: the
Scarcity Stack as the organizing frame, the guardrail discipline as the centerpiece, the semantic
layer, the measurement module, the governance claim, and the mandate close. **Two of these were
outright misses in v1**, and both are named in Decision 3.

**The brief's strongest single contribution is the guardrail thesis: the expert move is stopping the
model, not accelerating it.** v1's equivalent — *never present a finding whose alternative
explanations you haven't stated* — is a rule about what to write down after the fact. The brief's is
a rule about what to encode before, and **an invariants file is a better artifact than an
alternatives list** because it is reusable, operational, and survives the analyst who wrote it. v1's
material becomes the HR-specific instances underneath the brief's frame (M2 L4), which is the right
relationship between the two: the frame is general and the instances are what makes it teachable to
this audience.

**2. The pre-work is adopted whole, including both questions verbatim.** *Make the strongest case
your organization would notice if your team vanished on Monday. Then make the case against.* That is
the best single question in either document — prediction, diagnosis and threat assessment at once,
and it cannot be answered defensively without the learner noticing they are being defensive. It also
resolves something v1 got wrong: v1 opened on a claim-to-contest about the function's output, which
is the same move one level less honest.

**3. Two outright misses in v1, both adopted, and worth naming plainly.**
- **The semantic layer.** v1 had nothing on it. *Definitions become executable* is a current,
  role-specific, entirely under-served problem, and *knowing enough to check is a different skill
  from knowing the method* is the sharpest observation in the brief. The apprenticeship problem — if
  juniors stop doing the grunt work, the path by which they learned to check disappears — is a real
  degradation on a delay long enough that nobody attributes it correctly.
- **Measuring the AI transformation.** v1 treated *what will AI do to our workforce* as a question to
  **decline**, and put it in a lesson about declining. That was a failure of ambition. The brief
  correctly sees that **measuring an AI deployment already underway is the highest-value new mandate
  available to this function**, and the one place it has a claim nobody else does. v1's declining
  material survives as M4 L5, where it belongs — as the boundary of the mandate rather than instead
  of it.

**4. Two things fought for from v1, and neither becomes a module.**
- **Prediction about individuals** was a standalone module in v1 and the brief has none. It moves
  into M2 L5 — and it is *better* there, because the brief's frame turns it from a topic into a
  constraint problem: base rate too low for individual use is **a halt condition**, and the
  intervention paradox is **an invariant you write down.** Six modules is a better shape than seven,
  and this is a case where the merge improved the content rather than compressing it.
- **The instrument** — construct validity, survey confidentiality, disclosure control — splits.
  Validity goes to M3 L4, extending *definitions become executable* into *executable is not valid*,
  which is a real deepening of the brief's module. Disclosure control goes to M5 L5, because it is a
  professional obligation with a legal edge, and because it carries the People Ops boundary. Nothing
  is lost and the module count holds.

**5. Format: the brief is a blended program and the product is async-only. One adaptation, stated
precisely rather than as a general worry.** The brief's async spine — six modules, ~3.5 hours,
artifact-per-module — is fully compatible and is adopted as written; the artifact discipline is
strictly better than v1's activity design because *bring it to the room* is a harder test than
*submit it.* What does not survive today is the **live-session payoff**: the cross-cohort dataset,
the opening slide, "the most-photographed thing in the deck." The product has no cohort aggregation.
**This is a product opportunity, not a content compromise**, and it is worth filing on its own: a
pre-work question whose answers aggregate across learners would be valuable in every track, and this
track is where it would land hardest. What ships now is the learner's own numbers, returned to them
in M6's reckoning.

**6. Sourcing — the brief's citations verified, and two came back stronger than stated.** Given this
track's thesis, anchoring it on unverified sources would have been fatal, so this was done first.
- **METR: confirmed and precise.** 16 developers, 246 tasks, own repos; 19% slower, believed 20%
  faster, forecast 24% beforehand. Add the authors' own scope caveat and a maintenance note on their
  February 2026 design update.
- **The 0.29%: confirmed, and the better figure is its companion.** Yotzov, Barrero, Bloom, Bunn,
  Davis, Foster *et al.*, 5,000+ executives across four countries — 0.29% realized over three years,
  **89% of firms reporting no impact at all**, and a 1.4% forecast for the next three. The mean is a
  near-zero mass with a concentrated tail, which is a far better teaching point than a small average.
- **Humlum & Vestergaard: available and stronger than the brief implies.** Precise null effects on
  earnings and hours ruling out anything above 2%; **2.8% self-reported time savings against 15%+ in
  RCTs.** Retitled and revised — cite the current version.
- **The agentic causal inference workflow: there is a better primary citation than the brief has.**
  The pattern is published, deployed and open-sourced — Netflix's `oci-agent` (arXiv 2607.22443, June
  2026), 100+ analyses per month, **principal / actor / critic** rather than the brief's
  Planner/Implementer/Reviewer, with a **credibility level** reported back. It automates covariate
  balance, propensity trimming and sensitivity analysis; it reserves framing, assumptions and
  diagnostics for humans. **A team shipping this at scale arrived independently at the module's
  thesis**, which is a stronger anchor than a demonstration. Stehlík's people-analytics application
  stays alongside it.
- **The M1 evidence, and the one place to be careful.** Napper's collapse-of-analysis argument is an
  *argument*; the ONA commoditization is an **existence proof**; Insight222 is subscription research.
  A track whose first module teaches evidence-versus-sample-versus-falsifier has to label all three
  correctly in its own opening, and an existence proof presented as a trend would be exactly the
  error the course is about. **Framing them correctly is a lesson, not a caveat.**

**7. Six modules at 35–45 minutes plus 15 minutes of pre-work, ~3h30.** The brief's shape, and it
settles a question the People Ops outline raised. Track lengths now sit at ~2h55 (HRBP, 7), ~4h15
(recruiter, 7), ~5h (comp, 6), ~4h15 (People Ops, 8) and ~3h30 here (6). **My position, unchanged
from v1 and now with a fifth data point: the spread is drift rather than a deliberate per-role call,
3h30–4h30 is the right band, and the comp track at ~5h is the outlier to look at first.**

**8. One counsel-review gate, M5.** Fewer than People Ops, which needs two. M2 does not get one even
though it now carries the prediction material: it is a design and ethics module, and routing it to
counsel would let an organization treat the individual-consequence question as a compliance matter,
which is the failure the module exists to prevent.

**9. Still blocking before drafting.** The five scarcity layers (Open Questions, and it blocks M1).
M5 in its entirety — the California FEHA retention specifics, Illinois, Colorado's January 2027
scope, Article 26(7) as it applies to analytics rather than systems, the provider/deployer
classification for an in-house employment model, and whether *analysis* of existing data engages
co-determination on a different footing than *deployment* does. Insight222's finding needs its access
status and date confirmed. And for M2 L5: a primary source on flight-risk performance in deployment
— **if none exists, the module says so, which is the stronger lesson.**

## Open questions for review

- **The five scarcity layers, and this is the one genuine blocker.** The brief names the stack as the
  organizing frame and the modules imply its shape, but the layers are not enumerated, and this
  outline will not invent the load-bearing structure of someone else's model. My reconstruction, for
  correction rather than adoption: **definitional authority** (M3), **methodological judgment /
  knowing when to stop** (M2), **causal and evaluative design** (M4), **governance standing** (M5),
  and **trust** (M6). If that is close, the stack and the module sequence are the same object read
  twice, which is a strong sign; if it is wrong, M1 and the pre-work both change.
- **Does the cross-cohort dataset get built?** It is the single best product idea in the brief, it
  would improve every track, and it is a real piece of work — pre-work answers, aggregated,
  anonymized, returned as a comparison. Worth its own conversation rather than a line in a content
  outline.
- **Does M2 hold at 45 minutes?** It now carries the thesis, the anchor, the general failure modes,
  the HR-specific instances, prediction-about-individuals, and the ask-it-to-refute move. That is the
  most content in any module in the curriculum and it is the likeliest split in the set. Shipping
  merged, because the invariants file is one artifact — but watch completion, and the natural seam if
  it breaks is between the general failure modes and the HR instances.
- **Three shipped tracks now need a cross-reference pass, filed separately not fixed here.** Comp M4
  L3 teaches control-set critique for pay equity regressions and this track's M2 teaches the general
  version; a learner taking both reads the same idea twice without being told they are the same idea
  at different scopes. Same for recruiter R6's adverse impact against M5, and People Ops M6's access
  control against M5 L5 — the last of which should get the one-line pointer in **both** directions.
