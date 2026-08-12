# AI 301 · The Specialist — People Analytics track · "The Warrant" (draft v1)

**Audience:** People Analytics analysts, managers and directors; workforce analytics and workforce
planning; HR data scientists; employee listening and engagement survey owners; DEI measurement leads
where that work sits with analytics.
**Level transition:** L3 The Specialist → L4 The Translator.
**Course id:** `ai301-analytics` · role id `peopleanalytics`, label "People Analytics".
**Shape:** 7 modules · 30–50 min each · ~4h · same package as the rest of the ladder — read, micro
dose, tutor, podcast, one interactive, one AI-graded activity, one knowledge check. Async and
self-serve.
**Prerequisite:** AI 101 (or the diagnostic test-out) and AI 201.
**Tooling stance:** Tool-agnostic. Statutes, adoption figures, and any published research are
volatile-layer `[V]`.
**Boundary, inherited not invented:** the People Ops & HR Technology track scoped itself to
*retrieval and reporting, not inference*, and left inference here. That line is honored exactly and
stated in the content — **People Ops owns getting the right rows to the right person; this track owns
what you are entitled to conclude from them.**

Exploration and full verification log: `content/course-301-people-analytics-exploration.md`.

---

## The through-line

> **You are the function's evidence standard, and the fluency of a claim stopped being evidence of
> anything. Your training protects the table. It says nothing about the leap.**

This is the **inverse** of every other 301 track's through-line, and the inversion is deliberate.
The comp track tells a numerate audience that fluent output is dangerous because they will
over-trust it. This audience's exposure runs the other way: they are the best-equipped people in the
function to catch a bad number — and **the claim is not the number.** A wrong table gets caught in
review. A wrong *inference* from a right table gets believed, funded, and repeated for three years.

## Where the learner stands (design premise)

They are the most methodologically trained people in People, and the thing that changed is not their
capability — it is everyone else's. An HRBP with a CSV can now produce a cut, a chart, a regression
and a confident paragraph in an afternoon. The analyst's scarcity has moved, quietly and without
anyone announcing it, **from producing analysis to adjudicating it**, and nothing in the market is
teaching that transition.

> "Everyone can make a chart now, and most of them are wrong in ways only I can see. Tell me what my
> job is when production stops being the scarce thing — and give me something better than 'be more
> rigorous.'"

**What this course refuses to be, stated in its first paragraph:** a course about producing analysis
faster. That capability just stopped being scarce, and selling it would be selling the thing that
lost its value.

## The spine: one question you owe someone

Every module advances **one live analytical question the learner actually owes a named requester** —
the kind that arrives with a deadline and an implied answer. *Why is attrition up in engineering. Is
onboarding working. Are we losing women at level 5. Did the program work.*

| Module | What it does to the question |
|---|---|
| M1 | Place it on the verb ladder and say what warrant that verb requires |
| M2 | Enumerate every alternative explanation and rule out or admit each |
| M3 | Decide whether it wants a prediction, and whether it should have one |
| M4 | Examine the instrument that produced its data |
| M5 | Check the floor — provider, purpose, and the right to a human |
| M6 | Ask whether it could have been a test instead |
| M7 | Decide what to say, how confidently, and whether to decline |

**Every module opens with a claim the learner must contest** — adopted from the People Ops track,
which retired the numeric calibration prompt course-wide in favor of it. The claims are accusations
about the learner's *own organization*, so contesting one is already the prediction: commit to "true
of us / not true of us" before any content, then verify against evidence from your own systems
during the module. M7 reads the pattern, and the rubric grades **evidence of updating**, never who
guessed right.

**One addition this track needs and the convention doesn't yet have.** For this audience, "go and
check" will sometimes return *the evidence in our systems cannot settle this* — and that is a
finding, not a failed activity. **Every rubric must reward reaching it with an account of why**, at
the same level as a resolved claim. This is the outcome the whole track is trying to make sayable.

---

## M1 · What you're for now

*~40 min · the diagnosis and the decomposition, merged · first because everything else indexes the
verb ladder*

**Claim to contest:** *"Most of what your function publishes is description wearing explanation's
clothes — and the people who used to need you for it don't anymore."*

- **Lesson 1:** The collapse, and who it happened to. The cost of producing a plausible analysis
  fell for you, and it fell **further for everyone else**, because they were starting from zero. The
  consequence is not that your work got faster. It is that **the scarce thing moved from producing
  analysis to adjudicating it** — and nobody sent a memo, so most analytics functions are competing
  on the capability that stopped being rare. *(Structurally this is the recruiter track's signal
  collapse one function over, and the module says so and points at R1 rather than re-deriving it.
  The mechanism differs: there, the signal was a candidate's effort; here, it is analytic
  competence, and the person producing the weak analysis is a colleague you have to keep working
  with.)*
- **Lesson 2:** The four verbs, which are also a risk gradient. **Describe** — what happened, and
  the only verb whose warrant is a correct table. **Explain** — why it happened, which requires
  ruling out the other reasons it could have happened. **Predict** — what will happen, which
  requires that the future resemble the data. **Prescribe** — what to do, which requires a causal
  claim strong enough to act on. Each verb requires everything the one before it does, plus one new
  thing. **AI made the fluency of all four identical and changed the warrant for none of them** —
  which is the entire problem, because fluency is what your audience reads warrant from.
- **Lesson 3:** Where your hours are versus where your value is. Most analytics functions spend the
  majority of their time in *describe* — recurring reporting, the scorecard, the board slide — and
  most of their reputation on *explain* and *prescribe*, where the warrant is hardest and the review
  is thinnest. Name the asymmetry rather than resolving it: the recurring reporting is a real
  obligation, and the point is that it is the part most safely delegated and the part most often
  defended.
- **Lesson 4:** The teardown, turned around `[V]`. Comp M2 taught the three questions — what's the
  evidence, what's the sample, what would falsify it — for evidence arriving from outside. **You are
  now the one being asked.** Run them on your own last published finding. Then the honest opening
  this track is built on: **the evidence base about people analytics is worse than the evidence base
  people analytics demands of everyone else.** Search for a credible primary source on whether
  analytics functions improve decisions, or whether deployed attrition models reduce attrition, and
  what returns is vendor maturity models and self-reported case studies. That is checkable by any
  learner in ten minutes, and it is why this course starts here rather than with a capability tour.
- **Interactive:** sorting — twelve real analytics deliverables into describe / explain / predict /
  prescribe. Designed so several "explanation" deliverables are description with a causal verb
  attached, which is the mis-sort the module exists to produce.
- **Activity:** *"The question, placed"* — the live question you owe someone, written as the
  requester actually asked it, then rewritten as the question it would have to be to be answerable.
  Which verb it needs, what warrant that verb requires, and what you currently have. Plus your last
  published finding run through the three questions. **Blanks are the finding.**

## M2 · From table to claim

*~50 min · the signature module · the one nothing else in this market teaches*

**Claim to contest:** *"Your last causal finding has at least one alternative explanation you never
wrote down."*

- **Lesson 1:** Two rules, two layers. Comp M3's rule — *never present a number you couldn't rebuild
  from its inputs, in front of the person asking* — is assumed here and **cited, not repeated**; it
  governs construction. This module's rule is its sibling and governs the leap: **never present a
  finding whose alternative explanations you haven't stated.** A perfectly constructed table
  licenses nothing on its own. The most dangerous artifact in this function is a correct number
  under a causal sentence.
- **Lesson 2:** The alternative-explanations artifact, which is the module's method. For any finding:
  list every other reason the pattern could look like this, then mark each **ruled out** (with what
  ruled it out), **partially addressed**, or **admitted**. Admitted is a legitimate and common
  outcome. The discipline is that the list is written **before** the finding is presented, for the
  same reason comp M3 specifies reconciliation in advance — **an alternative you think of afterwards
  is one you will dismiss**, because you now have a conclusion to protect.
- **Lesson 3:** The confounders endemic to HR data. Not a statistics refresher — the specific ones
  that recur in this function and that a general model will not flag. **Exit reasons are what people
  were willing to say on the way out**, to someone who might be a reference. **Performance data is a
  rating produced by the system you are evaluating**, so using it as an outcome variable in a study
  of that system is circular in the same way comp M4's pay model is. **Promotion data is censored by
  everyone who left first**, so a promotion-rate analysis silently conditions on survival. And
  survivorship runs through nearly every tenure analysis ever presented in this function: *our
  long-tenured employees are more engaged* is a sentence about who stayed.
- **Lesson 4:** Regression to the mean, which deserves its own lesson because it explains most
  "our intervention worked" findings in People. You target the lowest-engagement teams, the
  worst-attrition function, the managers with the poorest scores — and then measure improvement.
  **Selection on an extreme guarantees movement toward the middle with no intervention at all.**
  Every program evaluation this function runs is exposed to it, and almost none of them mention it.
- **Lesson 5:** What AI actually does here, stated precisely. Ask a model why attrition rose and it
  will produce a coherent, well-organized, plausible causal account — **and it will not volunteer the
  confound, because nothing in what it is doing corresponds to looking for one.** Its silence carries
  no information (101 M6, comp M3). Then the inversion that makes this module practical rather than
  only cautionary: **a model is genuinely excellent at generating the alternatives list when you ask
  it to.** Asked *what else could explain this pattern, argue against my conclusion*, it will produce
  a better enumeration than most analysts working alone. **The failure is in what you ask for, not in
  what it can do** — and this is the highest-value AI move available to the role.
- **Interactive:** choice — four findings with their supporting analysis; find the one whose warrant
  actually supports its verb. Distractors include a technically flawless table under an unlicensed
  causal claim, and a hedged finding whose hedge is decorative.
- **Activity:** *"The alternatives"* — your live question's finding with a complete alternatives
  list, each marked ruled out / partial / admitted with what did the ruling out. Then run the same
  finding past a model asked explicitly to refute it, and record **what it found that you missed**.
  Graded on the honesty of the admissions, never on how few there are.

## M3 · Prediction about people

*~40 min · the module that changes what people build*

**Claim to contest:** *"Nobody in your organization has evaluated a deployed predictive model about
employees after it went live — and the reason is that it's genuinely hard, not that anyone was
lazy."*

- **Lesson 1:** The base-rate arithmetic, done out loud once. A flight-risk model reported at 78%
  accuracy against a 12% annual attrition rate sounds strong and often performs worse than useful at
  the individual level. Do the arithmetic in the module rather than asserting the conclusion: how
  many flagged people actually leave, how many leavers were never flagged, and what a manager
  experiences after three false positives in a row. **Aggregate accuracy is not the property the
  intervention runs on.**
- **Lesson 2:** The intervention paradox, which is this role's structural problem and is unaddressed
  in the field. If the model flags someone and you retain them, the model reads as wrong and you did
  the right thing. If you preserve the evaluation, you withheld an intervention from a named person.
  **You cannot both act on the prediction and cleanly evaluate it**, and every honest evaluation
  design here is a compromise: holdouts, staggered rollout, or accepting that you are flying on a
  validation set that predates deployment. Naming the compromise you chose is the professional act.
  *(Which is why M6 exists.)*
- **Lesson 3:** Buying versus building, and why the questions don't change. A large share of these
  scores are bought rather than fitted. The questions are identical either way — what is the base
  rate in *our* population, what was it trained on, what would falsify it, who sees the score — and a
  vendor who cannot answer them has answered them. *(Comp M2's teardown, applied to the one purchase
  this function makes that produces claims about named individuals. Cited, not re-taught.)*
- **Lesson 4:** Who sees it, and what it does to them. A score is not an input to a decision; it is
  **an input to a relationship.** A manager told their report is 78% likely to leave behaves
  differently toward that person, and some of those behaviors — a withheld stretch assignment, a
  quiet succession conversation — make the prediction more likely to come true. The score is not a
  passive observation of a system it is inside. Then the design questions: does the individual know
  the score exists, is there a route to contest it, and **would you be comfortable telling them?**
  *(101 M8's reader's-stake disclosure test, at its sharpest.)*
- **Lesson 5:** The two questions before building anything. **What decision changes** — recruiter R5's
  test, and the one that kills most flight-risk projects, because the honest answer is often *we
  would have a conversation we could have had anyway.* And **what would we do differently if the
  score were wrong about this person** — which is the fairness question in a form an analyst can act
  on. Neither requires a legal opinion, and both belong before a line of code.
- **Interactive:** sorting — ten proposed predictive use cases: build it / buy it with these
  conditions / don't build this at all.
- **Activity:** *"The score, examined"* — one predictive model your organization uses, is building,
  or is being sold. The base rate in your population, the individual-level arithmetic worked, who
  sees the output, whether the subject knows, what decision it changes, and the evaluation design
  with its compromise named. **If your organization has none, run it on the one you have been
  pitched** — the analysis is identical and the vendor's answers are the finding.

## M4 · The instrument

*~40 min · the module only this role would raise*

**Claim to contest:** *"You have published a survey result that could be traced to an individual —
and the promise you made when you fielded it did not survive the analysis."*

- **Lesson 1:** Construct validity — whether the thing you measured is the thing you meant. Recruiter
  R5's closed loop teaches you to capture data against a decision; it does not ask whether the
  captured thing is the construct. *Engagement*, *inclusion*, *manager effectiveness*, *productivity*
  — each is a latent thing measured by proxy, and the proxy is a design choice that travels invisibly
  into every downstream finding. Cited and extended, not re-derived.
- **Lesson 2:** Confidentiality is a promise with a number under it. This is the only place in People
  where the function's credibility rests on a statistical property rather than a behavior. Minimum
  cell sizes, what gets suppressed, and the failure everyone misses: **the differencing attack** —
  two separately-compliant published cuts that, subtracted, identify a group of one. Nobody's
  permissions were violated. The individual was identified anyway.
- **Lesson 3:** Disclosure control versus access control — and the boundary with People Ops, stated
  out loud so neither track drifts `[V]`. **People Ops M6 owns access control**: who can *retrieve*
  what, where the assistant inherits its user's rights and the fix is permissions, indexing scope and
  least-privileged testing. **This track owns disclosure control**: what a legitimately-permissioned
  aggregate *reveals*, where the fix is thresholds, suppression, and what you agree to publish. Two
  different failures, two different remedies, and the professional obligation for the second one is
  yours.
- **Lesson 4:** Open text, where the new failure lives. Thematic analysis of thousands of verbatims
  is a genuine and large AI win — this is the module's good news and it should be said plainly. The
  new failure is specific: **a model asked for themes with supporting quotes returns the quotes
  intact**, and a verbatim naming a team, a manager, an incident, or a disability identifies its
  author. A human summarizer smoothed that away as a side effect of being human. So: paraphrase
  rather than quote by default, apply the same threshold to a quote you apply to a cell, and
  understand that **an employee who reads their own words in a results deck learns something about
  the confidentiality promise that no policy statement will unteach.**
- **Lesson 5:** Two things that cut the other way. **AI-written survey items** — item wording is
  psychometrics wearing a drafting task's clothes, and a reworded item breaks comparability with
  every prior wave, which is usually the whole value of the instrument. And the counterparty turn:
  **employees answer open-text questions with AI too.** What that does to your signal has not been
  measured by anyone, and the module says so rather than inventing a number; what it does mean
  practically is that verbatim volume and polish have stopped being evidence of engagement with the
  survey.
- **Interactive:** choice — four sets of survey results cleared for publication; find the one that
  breaks the confidentiality promise. The winner should require noticing a differencing attack rather
  than a small cell.
- **Activity:** *"The promise, tested"* — the exact confidentiality language your organization uses,
  your actual suppression threshold, and an attempt to **break your own most recent published result**
  by differencing two cuts or by tracing a published verbatim. Then the change you would make. A
  finding of *I could not break it* is a strong result **if the attempt is documented**.

## M5 · The floor

*~40 min · counsel review required before ship · heavily volatile*

**Claim to contest:** *"Your organization treats the model it built in-house as safer than the one it
would have bought — and has it exactly backwards."*

**Verification status:** this module is the least settled in the outline and is **blocking before
drafting** in full. The design below is the shape; the citations are not yet earned. Every other
track's floor module changed materially after verification, and this one should be expected to.

- **Lesson 1:** You may be the *provider*, not only the deployer `[V]`. Every other floor module in
  this curriculum assumes the model came from a vendor and teaches the learner to find out who the
  deployer is. **An organization that builds its own model for employment-related decisions occupies
  both positions**, and the obligations that attach to building are not the ones that attach to
  buying. This is the framing that is new to the curriculum and the reason this module is not a
  cross-reference to HRBP M6.
- **Lesson 2:** Automated decision-making and the right to a human `[V]`. Where a prediction about a
  person feeds a decision about that person, the question of whether a human is meaningfully in the
  loop is a legal question and not only an ethical one — and *a human who rubber-stamps a score* is a
  recognized failure mode rather than a compliance answer. Connects directly to M3's Lesson 4.
- **Lesson 3:** Purpose limitation, which is this function's most common quiet violation `[V]`. Data
  collected to run payroll, administer benefits, or field an engagement survey, then used to train a
  model predicting who will quit. Each collection had a stated purpose; the secondary use often has
  no basis and no notice. **The engagement survey case is the sharpest**: data given under a
  confidentiality promise, repurposed as a model feature, is a breach of the promise in M4 even where
  it clears the legal bar.
- **Lesson 4:** Monitoring, consultation, and where analytics trips a wire that systems doesn't `[V]`.
  People Ops M7 covers co-determination for systems deployments. The delta to establish in
  verification: whether *analysis* of existing data engages the same duties as *deployment* of a
  monitoring-capable system, since the analytics function frequently believes it is doing something
  purely observational. Flagged as the specific thing to verify rather than asserted.
- **Lesson 5:** What you can do this quarter without counsel, and the list to bring them. Following
  the convention in every other floor module — the module ends in an action, not an anxiety.
- **Interactive:** sorting — ten analytics activities: proceed / proceed with the record / stop and
  ask. Designed so at least two "purely observational" analyses land in the wrong bucket for most
  learners.
- **Activity:** *"The provenance check"* — for your live question: every data source, the purpose it
  was collected under, whether your use matches it, and what notice the subjects received. **Blanks
  assigned an owner and a date**, following the People Ops M3 convention.

## M6 · The test you could have run

*~35 min · the affirmative module, and the answer to M2 and M3*

**Claim to contest:** *"Your organization has run a test without knowing it — a staggered rollout, a
policy that hit one region first — and threw the comparison away."*

- **Lesson 1:** Why this module exists here. Modules 2 through 5 are a sustained argument that
  observational inference in HR is weaker than the function admits. **A test is the move that
  actually resolves it**, and this role is the only one in People positioned to run one.
- **Lesson 2:** The natural experiments already in your data. A phased rollout. A policy that
  applied to one region first. A manager population that got the training because of scheduling
  rather than selection. **The comparison was available and nobody preserved it** — which is a
  process failure, not a methodological one, and is fixable by asking one question before any
  rollout: *what would we compare this to?*
- **Lesson 3:** What AI changed, honestly scoped. Not the ability to run a study — the **cost** of
  designing one, reasoning about power, writing the analysis plan in advance, and producing the
  pre-registration document. Those were the friction that made *"we can't test that"* true, and they
  are substantially cheaper now. The claim is about friction, not capability, and the module should
  resist inflating it.
- **Lesson 4:** Where a test is genuinely not available, and the ethics of the holdout. Some
  interventions cannot be withheld, some populations are too small, and some questions are about a
  one-time event. **The honest response is a weaker claim, not a stronger method** — and a lesson
  that pretended otherwise would undercut the whole track.
- **Interactive:** choice — four proposed evaluations of the same program; find the one whose design
  could actually come back negative.
- **Activity:** *"The comparison"* — either a real test design for your live question with its
  analysis plan written in advance, or the natural experiment you already have and did not use, with
  what it would take to reconstruct the comparison. If neither exists, **the deliverable is the
  weaker claim you are entitled to instead** — and that is a full-credit outcome.

## M7 · What you'll say

*~35 min · the course lands*

**Claim to contest:** *"You have never declined to answer a question you were asked, and you have
answered at least one you shouldn't have."*

- **Lesson 1:** The finding, with its warrant attached. The artifact this whole track produces: the
  claim, the verb it uses, the alternatives it survived and the ones it didn't, a confidence
  statement a reader can act on, and **a named condition under which it should be revisited.** No
  other track produces this and the function does not currently produce it — which is why the durable
  wrong belief has nothing standing in its way.
- **Lesson 2:** Declining, and the sentence that makes it possible. *"I can't answer that with what
  we have, and here is what I can support"* is the most professionally valuable sentence in this
  role and the least practiced. **This is the only track whose capstone can legitimately end in "no
  finding"** — the People Ops track's is *turn it off*, and this is its sibling. Declining is not a
  failure to deliver; it is the delivery, and a function that never declines has told its
  organization that its findings mean nothing in particular.
- **Lesson 3:** The exec who ran their own numbers. Leadership arrives having asked a model the same
  question and gotten a different answer — often a more confident one, because it had no alternatives
  list. What survives contact is not a better chart: it is being able to say **where your number
  comes from and what would change it**, and being right that their analysis has a confound you can
  name. *(Comp M5's counterparty logic, one function over; cited rather than re-derived.)*
- **Lesson 4:** The question you will be asked most and can least answer `[V]`. *What will AI do to
  our headcount and our skills?* It looks like a forecasting question and mostly isn't — there is no
  base period, the intervention is undefined, and the outcome depends on decisions your leadership
  hasn't made yet. **Declining this one honestly, and substituting what you can support** — exposure
  analysis, scenario ranges with their assumptions exposed, a monitoring plan — is the highest-stakes
  application of Lesson 2 the role will face this year.
- **Lesson 5:** The bet, with a baseline. Which verb your function should get better at, one specific
  change, what you'd measure at 90 days, and what you'd stop doing to fund it. **Plus this role's
  fourth term: which recurring report you would stop publishing.** Description is where the hours are
  and the least defended thing in the portfolio.
- **Interactive:** choice — four responses to the same leadership question; find the one that is
  confident without warrant. The honest decline should be among the options and should be the
  strongest answer on the page.
- **Activity (course close):** *"The finding, or the decline"* — your live question answered in one
  page with warrant, alternatives, confidence and revisit condition; **or a documented decline** with
  what you'd need to answer it and what you can support instead. Then **the delta**: every claim you
  contested in M1–M6, which turned out to be true of your organization, and what changed. The rubric
  grades the account of the change and the evidence behind it, never who guessed right — **and a
  decline is scored at full credit.**

---

## Prerequisite map

- 101 and 201 assumed. Modules point at prior material rather than re-teaching it — comp M2 (the
  teardown), comp M3 (construction), comp M4 L3 (control sets), recruiter R5 (the closed loop),
  recruiter R6 (adverse impact in selection), People Ops M5 (the source system) and M6 (access
  control).
- M1 first, always — the verb ladder indexes every later module.
- M2 before M3, M6 and M7 (the alternatives list is reused each time).
- M4 independent of M2/M3 and can move earlier for a listening-heavy learner.
- M5 after M3 (the provider framing needs a model in front of it).
- M6 after M2 and M3 — it is the resolution of both.
- M7 last; it carries the delta reckoning.

## Per-module deliverables

Same package and pipeline as the rest of the ladder: draft at
`content/ai301-analytics-mN-<slug>.md` → `scripts/convert-draft.mjs` → hand-tuned `blocks.json`,
`micro.json`, `knowledge-check.json`, `rubric.json`, `sorting.json` or `choice.json`, `activity.json`
→ add rows to `content/modules.json` **only when the track is complete** → register in
`src/shared/roles.ts` → `generate-seed.mjs`.

Registration note: `roles.ts` currently folds analytics into `other`, which falls back to
`ai301-hrbp`. Shipping this and People Ops means adding `peopleanalytics` and `peopleops` choices, at
which point `other` covers talent development, employee experience and function leadership only.

## Decisions (v1)

**1. The People Ops boundary is adopted exactly as they drew it, and extended in one place.**
*Retrieval versus inference* is a good line because it is mechanical rather than topical, and it
survives contact with the hardest case. That case is re-identification, which People Ops explicitly
left open. **The answer is that it splits cleanly and both tracks should carry the sentence:** People
Ops owns **access control** — who can retrieve what, fixed with permissions and least-privileged
testing, where the failure is *someone reached a document they shouldn't have*. This track owns
**disclosure control** — what a legitimately-permissioned aggregate reveals, fixed with thresholds
and suppression, where the failure is *nobody's permissions were violated and the individual was
identified anyway.* Different mechanism, different remedy, no overlap. It lands in M4 L3 here and
should be added to People Ops M6 as a one-line pointer.

**2. The through-line is deliberately the inverse of the comp track's, and this is the strongest
design decision in the outline.** Comp tells a numerate audience that fluent output is dangerous
because they will over-trust it. This audience is *better* at catching a bad number than anyone in
the function — and the claim is not the number. **Their training protects the table and says nothing
about the leap.** Everything in the track follows from that sentence, and it is what keeps M2 from
collapsing into comp M3.

**3. Two rules, two layers — the subtraction that makes this track possible.** Comp M3: *never
present a number you couldn't rebuild from its inputs.* This track: *never present a finding whose
alternative explanations you haven't stated.* Sibling rules, adjacent layers, one cross-reference.
**Drafting rule: if M2 ever starts explaining row counts or joins, it has drifted into comp M3 and
must be cut back.** This is the single most likely failure in drafting the track.

**4. Diagnosis and decomposition merge into M1**, following the People Ops precedent. The verb ladder
*is* the diagnosis vehicle here — you cannot say what changed without saying what the work is — so
splitting them would produce two thin modules. Net: 7 modules rather than 8.

**5. The convention change lands here first and fully.** The People Ops outline retires the numeric
calibration prompt course-wide in favor of a claim about the learner's own organization, contested
before content and verified against evidence from their systems. This track is built that way from
the start, and it suits this audience better than any other — *contest this, then go and check* is
the job. **One addition this track contributes back to the convention:** the check will sometimes
return *our evidence cannot settle this*, and every rubric must reward reaching that with an account
of why. Without it, the convention quietly punishes the honest answer in the one track built to
teach it. The retrofit of the three shipped tracks remains out of scope here, as the People Ops
outline recorded.

**6. Six candidate modules were cut or folded, and two are worth naming.** *Arguing the finding to an
executive* is structurally comp M5 and became M7 L3. *Forecasting AI's workforce impact* is the
question this function will be asked most in the next two years and can least defend — it became M7
L4 rather than a module, because the teachable content is **how to decline honestly**, which is
already M7's subject. Also cut: a statistics refresher, dashboard craft, a data-quality module
(People Ops M5), a tooling module, and analytics adoption across the function (401).

**7. The DEI measurement surface is a worked example, not a module.** It is where disclosure control
bites hardest and where the legal exposure concentrates, which argues for a module — but separating
it invites the organization to treat suppression thresholds as a DEI topic rather than a professional
obligation that applies to every cut. It runs through M4 and M5 as the sharpest case.

**8. Verification mostly failed, and the failure became the anchor.** I could not establish a credible
primary figure for how often analytics functions influence decisions, how many run predictive models,
or whether deployed attrition models reduce attrition. The literature is vendor maturity models,
practitioner posts, and a thin academic layer that does not answer the deployment question. The
most-quoted number in the space — *"81% of people analytics projects are jeopardized by ethics and
privacy concerns"* — has no reachable instrument and is **not usable**; it is exactly the shape of
claim comp M2 teaches learners to reject. **So M1's anchor is not a statistic. It is the observation
that the evidence base about people analytics is worse than the evidence base people analytics
demands of everyone else** — verifiable by any learner in ten minutes, and it makes the track's
central demand credible by applying it first to the track's own subject.

**9. One usable source, usable only with its interest stated.** The strongest employee-side monitoring
figures available — 56% reporting surveillance-related stress, 22% aware they are monitored against
74% of employers using tracking tools, 77% saying advance notice would reduce their concern — come
from a 2025 ExpressVPN survey of 1,500 US workers. Sample disclosed, which beats most of this field,
and it is **a VPN vendor publishing research on the harms of surveillance.** Cite only with the
commercial interest named in-lesson — and note separately that these are *monitoring* figures, not
*analytics* figures, so using them to describe reactions to analytics would be the conflation this
track teaches against.

**10. Blocking before drafting, by module.** M3: a primary source on flight-risk performance in
deployment, and whether any published evaluation survives the intervention paradox — **if none
exists, the module says so, which is the stronger lesson.** M4: suppression-threshold conventions
actually in use, and any published work on re-identification from verbatims. **M5 in its entirety:**
the provider/deployer classification for an in-house employment model, automated-decision-making and
the right to human review, purpose limitation for secondary use of HR data, and whether analytics
trips co-determination on a different footing than People Ops M7's examples. M6: at least one
documented HR field experiment worth teaching from. M1 L4 and M7 L4 need nothing further — both are
arguments rather than citations.

**11. One counsel-review gate, M5.** Fewer than People Ops, which needs two. M3 does not get one:
it is an ethics and design module, and routing it to counsel would let an organization treat the
individual-consequence question as a compliance matter, which is the failure the module is about.

**12. Seven modules at 30–50 minutes, ~4h.** Track lengths now sit at ~2h55 (HRBP, 7), ~4h15
(recruiter, 7), ~5h (comp, 6), ~4h15 (People Ops, 8) and ~4h here (7). **The People Ops outline is
right that this spread is either a deliberate per-role call or drift, and it is now wide enough to
settle rather than inherit.** My position: it is drift, the target should be 3h30–4h30, and the comp
track is the outlier to look at first.

## Open questions for review

- **Is M6 a module or two lessons?** The experiment is the track's only affirmative content, which
  argues for keeping it whole. But M2 and M3 both end at *this would have been answerable with a
  test*, which argues it is their natural conclusion rather than a separate destination. Kept as a
  module; flagged as the likeliest cut in the set.
- **Does M3 assume the learner builds models?** Many analytics functions buy a score rather than fit
  one. Written so the questions are identical either way — base rate, what decision changes, who
  sees it — since none of those depend on who fit the model. Worth a check with a real practitioner
  before drafting.
- **What happens when "go and check" cannot settle the claim?** Real more often here than in any
  other track, and handled in Decision 5 by scoring it at full credit. The open part is whether that
  needs a product affordance — a way for the tutor to recognize an unresolvable check — rather than
  only rubric language.
- **Should the alternatives list be a product artifact?** Like People Ops' decision register and
  signed map, it is reusable, outlives the course, and is independently valuable. Three tracks now
  produce a template worth keeping. That is a product decision and probably one conversation rather
  than three.
- **A maintenance ticket, filed separately not fixed here.** Comp M4 L3 teaches control-set critique
  for pay equity regressions and is correct within its scope. Once this track ships, the two should
  cross-reference each other explicitly, or a learner who takes both will read the same idea twice
  without being told they are the same idea at different scopes.
