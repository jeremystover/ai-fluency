# AI 301 · People Analytics · Module 2 — Designing constraints

**Course:** AI 301 · The Specialist — People Analytics track · Module 2 of 6
**Estimated time:** 45 min content · 10 min exercise · 35 min applied activity
**Prerequisite:** Module 1 · assumes comp M3's construction rule and 101 M6
**Position in the track:** the centerpiece, and the longest module in the course

> `Concepts reviewed: [DATE] · Examples current as of: [DATE]`
> Lesson 2 and Lesson 5's anchor are **[V]** volatile — a deployed system and a live literature.

---

## Claim to contest — before you start

*Commit before you read anything.*

> **"Your team has never written down a condition under which an analysis should stop rather than
> produce a number."**

**True of us, or not true of us?** If you think it is not true, name where the condition is written
down and who would find it.

You will check during the activity. **If you cannot find it in writing, "we all know it" is the
finding**, not a defence — and it scores in full when you say so.

---

## Module brief

Module 1 crossed out production and named four layers above it. This module is about the third one —
**methodological judgment, which is knowing when to stop** — and it is the module that turns that
from a virtue into a thing you can write down on a Tuesday.

Here is the thesis, and it is the whole course in one line:

> **The expert move is stopping the model, not accelerating it.**

Everything else here is machinery for making that affordable. Because "be more rigorous" is advice
nobody can act on, and "below this cell size the analysis halts and reports that it halted" is a
condition a junior analyst can apply at 4pm on a Thursday without your being in the room.

There is a second reason this module matters more than it looks. **You are about to be the bottleneck
for other people's analysis, not just your own.** When an HRBP produces a regression, you are the one
who has to say whether it holds. Doing that case by case does not scale, and doing it by reputation
makes you an obstacle. **Encoding it is the only version that works** — and it is the version that
turns your judgment into something the organization owns rather than something it queues for.

## Learning objectives

By the end of this module you should be able to:

1. State the difference between comp M3's construction rule and this module's inference rule.
2. Write a halt condition with a threshold, a trigger and a consequence.
3. Name the five general failure modes worth encoding for people data.
4. Identify the confounders endemic to HR data that no general model will flag.
5. Do the base-rate arithmetic on a predictive score about individuals, and state the intervention
   paradox as a written invariant.
6. Use a model to enumerate alternatives rather than to produce conclusions.

## Lesson 1 · Two rules, two layers

You already have one of these and it is not this one.

The comp track's craft module gives the construction rule: **never present a number you couldn't
rebuild from its inputs, in front of the person asking.** That governs whether the table is right —
whether the join dropped 340 rows, whether a filter persisted, whether the reconciliation ties. It is
necessary here and it is **assumed, not repeated.** If you have not got that discipline, this module
is premature.

This module's rule is its sibling and governs the layer above:

> **Never present a finding whose alternative explanations you haven't stated.**

**A perfectly constructed table licenses nothing on its own.** The most dangerous artifact in this
function is a correct number under a causal sentence — because the number survives every check
anyone will run, and the sentence is the part that gets believed, funded and repeated for three
years.

The two rules fail differently, which is why both exist. A construction failure produces a wrong
number, and wrong numbers get caught — eventually, by someone rebuilding them. **An inference failure
produces a right number under a wrong claim, and there is no procedure that catches it**, because
there is nothing to rebuild. The check has to happen before the claim is made, and it has to be
designed in.

## Lesson 2 · The design that works, and it is real **[V]**

The pattern this module teaches is not aspirational. It is published, deployed, and open-sourced, and
the team that built it arrived at this module's thesis independently — which is a better argument for
it than anything this course could assert.

**Netflix's `oci-agent`** (*A Human-Augmenting Agentic Workflow for Observational Causal Inference*,
arXiv 2607.22443, June 2026) has orchestrated **more than 100 causal analyses per month** since
release. Its architecture is an actor–critic loop with three roles:

- **A principal** supplies the analysis plan — the question, the assumptions, the estimand.
- **An actor** produces a spec and executes a templated notebook with diagnostics.
- **A critic** synthesises the results and reports a **credibility level** back to the principal.

Now look at what it automates versus what it refuses to.

**Automated:** covariate balance checking, propensity score trimming, sensitivity analysis. The
laborious, mechanical, error-prone middle of applied causal inference — the part that takes a day and
that a tired analyst skips.

**Reserved for humans:** framing the question, scrutinising assumptions, evaluating diagnostics.

**That division is the module's thesis, built by people shipping it at scale.** They did not automate
the hard part and leave humans the typing. They automated the typing and left humans the part where
being wrong is expensive — and then made the machine **report a credibility level** rather than an
answer, which is a halt condition wearing a number.

Two things to take from it.

**The templated notebook is the invariants file in code.** Agents adhere to comprehensive analysis
templates and check design diagnostics because the template makes them, not because they were asked
nicely. **Encoded constraints beat instructed ones**, every time, and this is the practical form of
that.

**"Credibility level" is the output shape to copy.** Not *here is your effect estimate* but *here is
your effect estimate and how much weight it will bear.* An analysis pipeline that can only return
answers will always return an answer.

Ludek Stehlík has applied the same pattern in a people analytics context, which is the closest thing
to a domain-specific precedent available. Treat that as an existence proof, per Module 1's discipline.

## Lesson 3 · The five failure modes worth encoding

Not a statistics refresher — you have that. These are the five that recur in people data and that
belong in a file rather than in your head. Each is stated as a **halt condition**, because a caution
is something you override under deadline and a threshold is something you have to argue with.

**Small n.** Below some cell size the estimate is noise with a decimal point. *Halt:* below the
threshold, the analysis stops and reports that it stopped — it does not report a number with a wider
interval, because nobody reads the interval. This is also a disclosure obligation, which Module 5
picks up.

**Post-treatment covariates.** Controlling for something that happened *after* the thing you're
studying, and is affected by it. Adjust for post-promotion engagement when studying promotion and you
have controlled away the effect. *Halt:* every covariate gets a date relative to treatment, and
anything after it stops the analysis pending a human ruling.

**Positivity violations.** Some combinations of covariates have no variation in treatment — nobody in
that stratum ever got the programme, so there is no counterfactual and the model is extrapolating.
*Halt:* check the overlap; where a stratum has no support, it is excluded and the exclusion is
reported, which changes the population the finding is about.

**Staggered adoption.** The intervention arrived at different times for different groups, which is
the normal case in HR and which breaks naive difference-in-differences in ways that were not widely
understood until recently. *Halt:* if rollout timing varies and the design does not account for it,
stop.

**Contested estimands.** The question does not have one answer because it does not have one meaning.
*What is the effect of the manager programme* — on whom, compared to what, over what horizon, for
those who took it or those offered it? *Halt:* if the estimand is not written down and agreed before
the analysis runs, the analysis does not run. **This is the most common failure on the list and the
least technical.**

## Lesson 4 · The confounders endemic to HR data

The five above are general. These are yours, they recur constantly, and **no general model will flag
any of them**, because flagging them requires knowing how the data was made.

**Exit reasons are what people were willing to say on the way out, to someone who might be a
reference.** Any analysis whose outcome variable is a coded exit reason is measuring disclosure
behaviour at least as much as it is measuring cause.

**Performance data is a rating produced by the system you are evaluating.** Use it as the outcome in
a study of that system and you have built the circularity the comp track's exclusion zone warns
about, one function over. If ratings carry the disparity you are looking for, controlling for them
removes the finding.

**Promotion data is censored by everyone who left first.** A promotion-rate analysis silently
conditions on survival, and the people whose absence would have changed the answer are the ones who
are not in the file.

**Survivorship runs through nearly every tenure analysis ever presented in this function.** *Our
long-tenured employees are more engaged* is a sentence about who stayed. So is most of what gets said
about culture fit, about the value of internal mobility, and about the characteristics of "top
performers."

**And regression to the mean, which deserves its own paragraph because it explains more "our
intervention worked" findings in People than any other single mechanism.** You target the
lowest-engagement teams. The worst-attrition function. The managers with the poorest scores. Then you
measure improvement. **Selection on an extreme guarantees movement toward the middle with no
intervention at all** — and the more extreme your selection criterion, the larger the improvement you
will observe from nothing. Almost every targeted programme evaluation in this function is exposed to
it, and almost none of them mention it.

> ### Try this — 4 minutes
> Take the last programme evaluation your function published. Was the population selected because it
> scored badly on the outcome you then measured? If yes, you have not yet established that anything
> happened.

## Lesson 5 · Prediction about individuals, as a constraint problem **[V]**

Flight risk. Performance forecasting. Promotion readiness. "High potential" scoring. This is where
the halt conditions earn their keep, because the failure is not statistical — it lands on a named
person.

**Start with the arithmetic, done out loud.** A flight-risk model reported at 78% accuracy, in a
population with 12% annual attrition. Accuracy against a 12% base rate is a low bar: a model that
predicts "nobody leaves" scores 88%. So 78% accuracy is not evidence of anything, and the questions
that matter are how many of the flagged actually leave, how many leavers were never flagged, and what
a manager does after three false positives in a row. **Aggregate accuracy is not the property the
intervention runs on.**

**Now the literature, and this is the worked example the module is built on** `[V]`. Go and look for
evidence that attrition models work. What you find is an active research literature reporting
excellent numbers — **98.8% for XGBoost, 98.7% for Random Forest**, a run of near-perfect scores from
boosting variants.

Run Module 1's three questions on that.

*What's the sample?* Overwhelmingly the **IBM HR Analytics Employee Attrition & Performance dataset**
— which is **explicitly fictional. 1,470 fabricated employee records created by IBM data scientists**,
35 features, redistributed endlessly on Kaggle.

**A 98.8%-accurate model, on invented people, cited as evidence that flight-risk scoring works.** The
evidence question fails at the first step. Nobody is being dishonest — the papers say what their data
is — but the number travels into vendor decks and business cases without it.

*And what would falsify it?* Here is the honest answer, and the module states it rather than papering
over it: **there is essentially no published evaluation of whether deploying these models reduces
attrition.** The literature is about algorithmic performance, not about deployment effect.

**That absence is not laziness. It is the intervention paradox**, and it is this role's structural
trap:

> Act on the prediction and you destroy the ability to evaluate it. Preserve the evaluation and you
> withheld something from a named person.

If the model flags someone, you intervene, and they stay — the model reads as *wrong*, and you did
the right thing. The only clean evaluation requires not acting on some flags. **You cannot both act
on the prediction and cleanly evaluate it**, and every honest design here is a compromise: a holdout,
a staggered rollout, or flying on a validation set that predates deployment and decays.

**Naming which compromise you chose is the professional act**, and it belongs in the invariants file,
not in a footnote.

**Then the two questions before anything gets built.** Neither requires a legal opinion and both
belong before a line of code.

- **What decision changes?** Recruiter R5's test, and the one that kills most flight-risk projects,
  because the honest answer is usually *we would have a conversation we could have had anyway.*
- **What would we do differently if the score were wrong about this person?** The fairness question in
  a form an analyst can act on — and if the answer is "nothing, because they'd never know," that is
  Module 5's territory and it is arriving early for a reason.

**And a design fact people miss: the score is not a passive observation of a system it sits inside.**
A manager told their report is 78% likely to leave behaves differently toward that person. Some of
those behaviours — a withheld stretch assignment, a quiet succession conversation — make the
prediction more likely to come true.

## Lesson 6 · What the model is genuinely excellent at

This module has spent five lessons on stopping. Here is the affirmative half, and it is the
highest-value AI move available to this role.

**Ask a model why attrition rose and it produces a coherent, well-organised, plausible causal
account.** It will not volunteer the confound — not because it is hiding one, but because nothing in
what it is doing corresponds to looking for one. **Its silence carries no information** (101 M6, and
comp M3's version of the same point).

**Now ask it the opposite question.** *What else could explain this pattern? Argue against my
conclusion. What would have to be true for this to be wrong? Which of my controls is
post-treatment?*

Asked that way, it enumerates better than most analysts working alone — faster, more exhaustively,
and without the motivated reasoning of someone who has already told a stakeholder what they found.
**The failure is in what you ask for, not in what it can do.**

That is why the alternatives list belongs in the workflow rather than in your character. It is also
why the discipline is stateable as a single instruction: **the model may generate the alternatives;
only you may dismiss them** — and each dismissal needs a reason written next to it.

## Key takeaways

- **The expert move is stopping the model, not accelerating it.** "Be more rigorous" is advice nobody
  can act on; a threshold with a consequence is a thing a junior can apply without you in the room.
- **Two rules, two layers.** Comp M3 governs construction — *never present a number you couldn't
  rebuild.* This module governs the leap — **never present a finding whose alternative explanations
  you haven't stated.** A construction failure gets caught eventually. **An inference failure has no
  procedure that catches it.**
- **The pattern is deployed, not aspirational** `[V]`. Netflix's `oci-agent` automates covariate
  balance, propensity trimming and sensitivity analysis; it reserves framing, assumptions and
  diagnostics for humans, and returns a **credibility level** rather than an answer.
- **Encoded constraints beat instructed ones.** The templated notebook is the invariants file in code.
- **Five general halt conditions:** small n, post-treatment covariates, positivity violations,
  staggered adoption, contested estimands. **The last is the most common and the least technical.**
- **Five HR-endemic confounders no general model will flag:** exit reasons are disclosure behaviour;
  performance ratings are produced by the system under study; promotion data is censored by leavers;
  survivorship runs through every tenure analysis; and **regression to the mean explains most
  "our intervention worked" findings**, because selecting on an extreme guarantees movement toward
  the middle with no intervention at all.
- **78% accuracy against a 12% base rate is not evidence** — predicting "nobody leaves" scores 88%.
- **The headline attrition-model accuracies are measured on fabricated people** `[V]`, and there is
  essentially **no published evaluation of whether deployment reduces attrition** — because of the
  intervention paradox, not laziness. **Naming the compromise you chose is the professional act.**
- **The model may generate the alternatives; only you may dismiss them**, with a reason written next
  to each.

## Take a position

**The claim:** *"An analysis pipeline that can only return answers will always return an answer."*

The strongest counter-argument is that **encoded halt conditions relocate judgment rather than
preserving it, and relocate it downward.** A threshold is a judgment made once, in the abstract,
before the case existed — and cases are exactly where the exceptions live. The n of 30 that halts a
genuinely informative analysis of a small critical population; the post-treatment covariate that is
the only available proxy for something real; the estimand that cannot be agreed in advance because the
stakeholder does not yet know what they are asking. **A file of thresholds gives a junior analyst
permission to stop thinking at the boundary**, which is the opposite of methodological judgment even
though it produces more halts. On that view the invariants file is a competence *substitute* wearing
competence's clothes, and what actually transfers is apprenticeship — which Module 1's counter-argument
already warned is the thing being starved. Your position has to say how a halt condition avoids
becoming a rule that thinks for people, and what the override procedure looks like.

## Applied activity — "The invariants file"

**Time:** 35 minutes · **Submit:** the file plus a 300–400 word write-up · **Graded against the rubric
below.** Score doesn't matter. Doing the work is where the learning lands.

Pick **one recurring analysis you actually run** — the attrition report, the engagement driver
analysis, a programme evaluation, a predictive score. Recurring matters: the file's entire value is
that it is there next time, under deadline, when you are not the one running it.

**Step 1 — The estimand (5 min).** Write the question the analysis answers, precisely enough that two
people could not disagree about what would count as an answer. On whom, compared to what, over what
horizon. **If you cannot write it, you have found your first halt condition** and that is a legitimate
result for this step.

**Step 2 — The halt conditions (12 min).** At least five, each with three parts: **a threshold**
(the specific value or state), **a trigger** (what checks it, and when), and **a consequence** (what
happens — stops entirely, proceeds with a stated caveat, escalates to a named person). Cover the five
general modes where they apply, and at least two of the HR-endemic confounders.

The test to apply to each one: **is there a real, plausible run of this analysis that would trip it?**
A condition that can never fire is decoration.

**Step 3 — The alternatives protocol (6 min).** How your team will use a model to enumerate
alternatives rather than to produce conclusions. The actual prompt or standing instruction, and the
rule about who may dismiss an alternative and what they must write when they do.

**Step 4 — If your analysis involves a predictive score (7 min).** The base-rate arithmetic worked in
full for your population. Who sees the output. Whether the subject knows it exists. What decision
changes. And **the evaluation compromise you have chosen, named** — holdout, staggered, or
pre-deployment validation with its decay acknowledged. If your analysis has no predictive component,
run this step against a score your organization has been pitched.

**Step 5 — Check the claim (5 min).** Go back to the claim you contested. Did a written halt condition
exist anywhere before today? **"We all know it" is a finding, not a defence.**

Then the write-up: the halt condition you expect to be least popular and why, the confounder from
Lesson 4 that is live in your analysis right now, whether a real past run would have tripped any of
your conditions, your position on the module's claim with its counter-argument addressed, and — the
honest one — **the analysis you have published that would not survive this file.**

## Knowledge check — 8 questions

*Unlocks after the applied activity is submitted. Retakes are free and unlimited.*

**Q1.** How does this module's rule differ from the construction rule it assumes?

- A. It applies to causal analysis rather than to descriptive analysis
- B. Construction governs whether the table is right; this governs the leap from a right table to a claim — and a perfectly built table licenses nothing on its own ✓
- C. It requires documentation rather than verification
- D. It applies to models rather than to queries

> **B.** They also fail differently, which is why both exist: a construction failure produces a wrong
> number and gets caught eventually. **An inference failure produces a right number under a wrong
> claim, and there is no procedure that catches it.**

**Q2.** In the deployed causal-inference workflow, what is reserved for humans? `[V]`

- A. Final approval of the effect estimate before publication
- B. Covariate balance checking and sensitivity analysis, since these require judgment
- C. Framing the question, scrutinising assumptions, and evaluating diagnostics — while the laborious mechanical middle is automated ✓
- D. Selecting which statistical method to apply

> **C.** They automated the typing and left humans the part where being wrong is expensive. Note the
> output shape too: it returns a **credibility level**, not just an answer.

**Q3.** Why does the module insist halt conditions carry a threshold rather than a caution?

- A. Because thresholds are easier to audit
- B. Because a caution is something you override under deadline, and a threshold is something you have to argue with ✓
- C. Because cautions cannot be encoded in code
- D. Because regulators require documented thresholds

> **B.** Which is also why encoded constraints beat instructed ones — the templated notebook makes
> the check happen rather than asking for it.

**Q4.** Which failure mode does the module call the most common and the least technical?

- A. Small n
- B. Positivity violations
- C. Contested estimands — the question has no single answer because it has no single meaning, and nobody wrote down what would count as one ✓
- D. Post-treatment covariates

> **C.** On whom, compared to what, over what horizon, for those who took it or those offered it. If
> the estimand is not agreed before the analysis runs, the analysis does not run.

**Q5.** Why is regression to the mean singled out among the HR confounders?

- A. Because it is the hardest to detect statistically
- B. Because it explains more "our intervention worked" findings in People than any other mechanism — you select the worst-scoring teams and then measure improvement, and selection on an extreme guarantees movement toward the middle with no intervention ✓
- C. Because it only affects longitudinal analyses
- D. Because it invalidates difference-in-differences designs

> **B.** And the more extreme your targeting criterion, the larger the improvement you observe from
> nothing. Almost every targeted programme evaluation is exposed; almost none mention it.

**Q6.** A flight-risk model reports 78% accuracy in a population with 12% annual attrition. What does that establish? `[V]`

- A. That the model correctly identifies roughly four out of five leavers
- B. Very little — predicting "nobody leaves" would score 88%, so accuracy against a low base rate is not evidence, and the questions that matter are the flag rates and what a manager does after three false positives ✓
- C. That the model is well calibrated but poorly discriminating
- D. That the model would perform better with more features

> **B.** Aggregate accuracy is not the property the intervention runs on, because the intervention
> lands on named people.

**Q7.** What do the headline accuracies in the attrition-prediction literature actually measure? `[V]`

- A. Deployed model performance across multiple client organizations
- B. Cross-validated performance on anonymized real employee records
- C. Performance largely on the IBM HR Analytics dataset — 1,470 explicitly fictional employee records created by IBM data scientists ✓
- D. Performance on simulated data calibrated to industry attrition rates

> **C.** A 98.8%-accurate model, on invented people, cited as evidence that flight-risk scoring
> works. Nobody is being dishonest — the papers state their data — but the number travels without it.

**Q8.** What is the intervention paradox?

- A. That interventions to retain flagged employees usually fail
- B. That acting on a prediction destroys the ability to evaluate it, while preserving the evaluation means withholding something from a named person — so every honest design is a compromise ✓
- C. That models become less accurate as more managers see their outputs
- D. That retention interventions are more expensive than the attrition they prevent

> **B.** It is why the deployment literature is thin — that is structural, not laziness. **Naming
> which compromise you chose is the professional act.** C is real (Lesson 5's last point) and is a
> different problem.

## Sources and attribution

- **The guardrail thesis, the invariants file, and the two-rules-two-layers framing** come from a
  human-authored brief for this track and are original to this course.
- **The agentic causal inference workflow `[V]`:** *A Human-Augmenting Agentic Workflow for
  Observational Causal Inference* (Netflix, arXiv 2607.22443, June 2026) — `oci-agent`, open-sourced,
  100+ analyses per month; principal / actor / critic; automates covariate balance, propensity
  trimming and sensitivity analysis; reports a credibility level. Ludek Stehlík's people-analytics
  application is cited as an existence proof.
- **Attrition-model accuracies `[V]`:** reported figures of ~98.8% (XGBoost) and ~98.7% (Random
  Forest) in the published literature, measured substantially on the **IBM HR Analytics Employee
  Attrition & Performance** dataset — **1,470 fictional records created by IBM data scientists**,
  35 features. **Verification found no published evaluation of whether deploying such a model
  reduces attrition**; the module states that absence and explains it.
- The HR-endemic confounder list and the halt-condition format are original to this course.
- Builds on comp M3 (construction, cited not repeated), comp M4 (the circular zone, whose logic the
  performance-rating confounder mirrors), 101 M6 (silence carries no information), and recruiter R5
  (*what decision changes*).
