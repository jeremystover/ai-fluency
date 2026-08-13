# AI 301 · Defensible by Design — Module 5 · The selection pool

**Estimated time:** 25 min content · 10 min exercise · 25 min applied activity
**Prerequisite:** Modules 2 and 3 — this module applies their inventory and their methods
**Position in the track:** the highest-stakes application of everything before it
**Module id:** `ai301-defensible-m6` · **course ordinal 5** — the id and the ordinal deliberately
disagree, because this module was added after `ai301-defensible-m5` shipped and renaming a shipped
module id would orphan learner submissions.

## ⚖️ Counsel review required

**This module is about how people are selected for termination**, which is the highest-consequence
decision in this curriculum and the one where being wrong is measured in litigation rather than
credibility.

**Counsel review is required before this module ships in any deployment, and before you apply any of
it to a live process.** Selection criteria, waiver requirements and disclosure obligations are
jurisdiction-specific and interact with statutes this module does not name.

**One thing in Lesson 2 needs a sharper warning than usual.** It describes a complaint filed six
weeks before this was written. **These are allegations. Nothing has been decided, and the defendant
has not answered them.** The module uses them because the *mechanism* alleged is one you can check
in your own organisation today — not because a court has found anything.

Nothing here is legal advice. It exists so you can bring counsel a specific question before a
selection list exists, rather than a general worry after one does.

## Calibration prompt — before you start

*One claim. Commit before you read.*

> **"If my organisation ran a reduction in force next quarter, I could name who would decide which
> employees were even eligible to be considered — and I could find the written reason for that
> boundary."**

**True of us, or not true of us?** One sentence.

Most people can name who decides *who goes*. Far fewer can name who decides *who is in the room to
be considered*, and fewer still can find that decision written down anywhere. **If you cannot, that
is this module's subject rather than a gap in your knowledge.**

## Module brief

Module 2 found the machines. Module 3 taught you to measure them and to sequence the measurement so
it survives discovery. This module applies both to the decision where the stakes are highest and the
curriculum has, until now, been silent.

Everything you have learned about adverse impact was framed around **hiring** — an applicant pool, a
selection rate, a screening tool. That framing is where the law developed and where the vendors sell.
It is not where the pressure is.

> **Organisations are now using AI-derived measures to decide who is selected for termination, and
> that decision has almost none of hiring's protective scaffolding around it.**

There is no candidate who can decline to proceed. There is no applicant tracking system designed to
retain the audit trail. There is frequently no vendor at all — the inputs come from tools you already
own, measuring people who never knew the measurement would be used this way. And there is a statutory
disclosure regime that, in a group termination, **hands the affected employees the analysis you
should have run yourself.**

Two things get taught. **Where the discretion actually sits** — which is earlier than people think,
in the definition of who is even considered. And **what to measure, in what order**, so that the
answer exists before the list does.

## Learning objectives

By the end of this module you should be able to:

1. Explain why the definition of the selection pool is the most consequential and least examined
   decision in a reduction in force.
2. Recognise an activity or output metric that a protected employee structurally cannot earn, and
   say why "we used no protected data" does not answer it.
3. Run Module 3's methods on a selection pool rather than an applicant pool, and say what changes.
4. State what a group termination discloses by statute, and why that makes the analysis unavoidable
   rather than optional.
5. Put the privilege decision and the pool decision in the right order — both before scoring.

## Lesson 1 · The pool is a decision, not a dataset

Ask where the discretion is in a reduction in force and most people point at the scoring: the
ratings, the rankings, the criteria. That is where the argument happens, so it feels like where the
decisions are.

**It is not. The pool is.**

Before anyone is scored, somebody decides *which population is being considered at all* — this
function, or this function plus the two adjacent ones; this site, or the region; this level and
below, or everyone. That boundary is drawn by a human, usually verbally, usually early, and it
determines the denominator of every statistic anyone will ever compute about the outcome.

**Move the boundary and a disparity appears or disappears without a single person's score
changing.** Narrow the pool to a team that happens to be young and an age disparity vanishes into a
population that has no older workers in it. Widen it to a division and the same selections look
different again. Nobody has manipulated anything; the boundary was drawn before the question was
asked.

### The law already has a word for this

In a group termination where employees over 40 are asked to sign an ADEA waiver, the statute calls
that boundary the **decisional unit** — *the portion of the employer's organisational structure from
which the employer chose the persons* who would be offered the waiver. **The concept is not a
consultant's framework. It is a statutory term with case law attached**, and courts have invalidated
waivers where the unit was described incorrectly.

Which tells you something useful: **the pool boundary is going to be written down and disclosed
whether or not you were deliberate about it.** The only question is whether the written version
records a reason you chose in advance, or a reason reconstructed afterwards by someone explaining a
line that was drawn in a meeting nobody minuted.

### What AI changes here — and it is not what you would guess

A model ranking employees ranks them **within a pool somebody drew.** It cannot tell you the pool was
wrong, because the pool is its universe. Every output will be internally consistent, defensible on
its own terms, and silent about the decision that determined the answer.

**That is the failure mode to carry out of this lesson.** The scoring will be the thing you can
inspect, document and defend. The boundary will be the thing that decided the outcome, and it will
have no artifact at all unless you make one.

**So make one.** Before anything is scored: write the pool definition, the alternatives considered,
and why this one. Two paragraphs. It is the single cheapest defensible artifact in this entire track,
and it is the first thing that will be asked for.

## Lesson 2 · The metric that cannot be earned **[V]**

Now the scoring — and a live example, offered with the warning at the top of this module attached to
it.

**On 13 July 2026, twenty-six current and former Meta employees filed suit in federal court in
Oakland**, alleging that AI systems selected them for layoff in a way that discriminated against
workers with disabilities, workers on protected medical or family leave, and pregnant employees.
Claims are brought under the FMLA, the ADA, the Pregnancy Discrimination Act and the PWFA, alongside
California's FEHA — including its automated-decision-system regulations — and laws in New York, New
York City, the District of Columbia, Washington State, Florida and Illinois. Twenty-six plaintiffs,
six states and DC. **These are allegations; nothing has been decided.**

The mechanism alleged is what makes it worth your time. According to the complaint, the inputs
included keystroke and activity monitoring, **AI token-usage dashboards**, and algorithmically
assisted performance rankings — and the resulting scores, in the plaintiffs' words, **"by design,
cannot be accumulated by an employee who is on protected medical or family leave, or whose output is
reduced by a disability."**

Read that clause twice, because it generalises far past this defendant.

### The general form

> **An activity metric is a proxy for time present. Anyone whose time present is legally protected
> scores low, and no protected characteristic ever enters the data.**

Protected leave. A reduced schedule as a reasonable accommodation. Intermittent FMLA. Military
service. Religious observance. A phased return. In every case the person is *lawfully* producing
less activity, and every activity-derived measure records that as underperformance — accurately, in
its own terms, and unusably.

Module 2 taught you that *"we never gave it protected data"* is not a defence. **This is the sharpest
instance of that principle in the curriculum**, and it is sharper than the hiring examples because
the protected status is often *already documented in your own systems.* The organisation knew who was
on leave. It simply did not connect that fact to the measure.

### The AI-specific version, which is new

Organisations have begun measuring **AI tool adoption** — prompts issued, tokens consumed, seats
active — first as a rollout metric, then as a proxy for engagement or capability, and then, at some
point nobody minutes, as an input to a performance judgement.

**Every objection above applies, plus one more:** adoption is voluntary and unevenly supported, so
the measure partly records who received training, who had a use case, and who was given permission.
A person on leave during the rollout has a permanent gap in a metric that is now describing them.

If your organisation measures AI usage and also runs performance calibration, **the question of
whether the first has leaked into the second is worth asking this week**, and it is answerable.

## Lesson 3 · Four-fifths on a pool you defined

Module 3 gave you the methods. Almost all of it transfers. Four things change.

**The rate you compute is the selection-for-termination rate**, group by group, within the decisional
unit — or equivalently the retention rate. Same arithmetic as hiring, opposite sign, and it is
alarmingly easy to compute the ratio the wrong way round and reassure yourself.

**The standard deviation test matters more here, not less.** Reductions run on smaller populations
than hiring does. Module 3's warning applies with force: four-fifths on a pool of thirty will flag
noise constantly, and dismissing a real disparity because the pool was small is the specific error
that produces a defensible-looking analysis and an indefensible outcome.

**Age is the exposure that hiring analysis under-weights.** In hiring, race and sex dominate the
literature. In a reduction, **age is the claim that gets brought**, it has its own statute, and — as
Lesson 4 covers — it comes with a disclosure regime that puts the numbers in the plaintiff's hands
by operation of law.

**And you must test more than one boundary.** Run the analysis on the decisional unit as defined —
then run it again one level up. If the disparity appears only at the wider boundary, that is not
noise to be discarded. **It is the most important thing you will learn all quarter**, because it
means the pool definition is doing work that the scoring is getting credit for.

## Lesson 4 · The order of operations **[V]**

Three decisions, and their sequence decides whether the rest is worth anything.

**First, the privilege question — before the pool is drawn.** Module 3 taught that bias testing
conducted under counsel, where the lawyer directs the analysis and uses the results in giving legal
advice, may sit differently from the same testing run as an operational exercise. In a reduction that
consideration is at its peak, and **the window for it closes early.** Once a draft list exists, any
analysis you commission is analysis of a list — the timeline is discoverable, and the sequence tells
a story you did not choose. Ask the question the week the reduction is contemplated: *"Before anyone
is scored, should this be run for you?"*

**Second, the pool — written, with alternatives.** Lesson 1's two paragraphs.

**Third, the scoring — and only then.** With a rule agreed in advance for what happens if the
analysis finds something, because Module 3's whole argument is that a testing programme structurally
unable to act on its findings is worse than none.

### The human in the loop is not a formality here

Current enforcement guidance is consistent on one point: **no AI tool should produce a termination,
discipline or layoff recommendation that becomes final without a trained human reviewing the output
for legal compliance first.** Not a manager confirming a ranking — a review that could, in principle,
reject it, by someone who would know what a problem looked like.

Ask the falsifiable version: **has a human ever changed one of these recommendations?** If the answer
across a whole cycle is no, you do not have review. You have a signature.

### What the record should contain

- The pool definition, its alternatives, and the date — written **before** scoring.
- The criteria, and for each one, a sentence on why it measures contribution rather than presence.
- Who commissioned the analysis, and under what instruction.
- The analysis, at the defined boundary and one level wider.
- What the review changed, or an honest note that it changed nothing.

**Five artifacts. None takes more than an hour, and all five have to exist before the list does** —
which is the only genuinely hard part, because the pressure in a reduction always runs the other way.

## Key takeaways

- **The pool is the decision.** Scoring is where the argument happens; the boundary of who is
  considered determines the denominator of every statistic anyone will ever compute, and it is
  usually drawn verbally and never written down.
- **The law already names it.** In a group termination involving ADEA waivers, that boundary is the
  statutory **decisional unit** — it will be written down and disclosed regardless, so the only
  question is whether the written reason was chosen in advance or reconstructed afterwards.
- **A model ranks within a pool somebody drew, and cannot tell you the pool was wrong.** Its output
  will be internally consistent and silent about the decision that determined the outcome.
- **An activity metric is a proxy for time present** `[V]`, so anyone whose time present is legally
  protected scores low with no protected characteristic in the data — leave, accommodation, reduced
  schedule, military service. The *Meta* complaint (filed 13 July 2026, 26 plaintiffs; **allegations,
  not findings**) alleges exactly this, including AI token-usage dashboards as an input.
- **AI adoption metrics are the newest version of the same error**, and they additionally record who
  got training, who had a use case, and who was present during rollout.
- **Test at the boundary and one level wider.** A disparity that appears only at the wider boundary
  means the pool definition is doing work the scoring is getting credit for.
- **Sequence: privilege, then pool, then scoring.** The privilege window closes the moment a draft
  list exists, because after that every analysis is analysis of a list.
- **Human review means someone who could reject it.** If nothing was ever changed across a full
  cycle, you have a signature rather than a review.

## Take a position

**The claim:** *"An organisation that cannot produce a written pool definition dated before its
selection scoring has no defensible reduction in force, whatever its analysis shows."*

**Argue it or contest it.** The strongest counter is practical rather than legal: reductions are
decided under confidentiality pressure and compressed timelines by people who cannot circulate a
memo about who might be considered, and a rule that requires a written artifact before scoring may
simply produce a backdated one. If you take that view, say what you would require instead that
survives the same pressure — and note that the disclosure obligation in Lesson 4 does not care how
rushed the process was.

## Applied activity — "Before the list exists"

**Time:** 25 minutes · **Submit:** the memo plus a 250–350 word write-up · **Graded against the
rubric below.** Score doesn't matter. Doing the work is where the learning lands.

Write a **one-page protocol addressed to your general counsel**, for a reduction that has not been
announced and may never happen. Writing it now is the entire point — the artifact is worthless
written later.

**Step 1 — The pool (6 min).** For a plausible reduction in your organisation, define the decisional
unit you would propose. Name **two alternative boundaries** you considered and why you rejected them.
If you genuinely cannot say who would draw this boundary today, write that instead — **it is a
finding, and a more useful submission than a guess.**

**Step 2 — The criteria (7 min).** List the measures your organisation would reach for. For each,
one sentence on whether it measures contribution or presence. **Flag every one that an employee on
protected leave could not accumulate.** Include any AI-usage measure you have, if you have one.

**Step 3 — The sequence (6 min).** Who commissions the analysis, when, and under what instruction —
and the specific date relative to scoring. State the decision rule agreed in advance for what happens
if the analysis flags a disparity.

**Step 4 — The write-up (6 min).** 250–350 words: what you found doing this, which step you could not
complete and why, and your position on the claim above.

**What scores well:** naming the person who would draw the pool boundary, or admitting nobody knows.
Flagging a metric your own organisation uses that an employee on leave cannot accumulate. A decision
rule with a threshold in it. **"Our evidence cannot settle this" scores full credit where it is the
honest answer.**

## Knowledge check — 8 questions

*Unlocks after the applied activity is submitted. Retakes are free and unlimited.*

**Q1.** Why is the selection pool described as more consequential than the scoring?

- A. Because scoring methods are standardised and pools are not
- B. Because the boundary determines the denominator of every subsequent statistic, and is usually drawn verbally before any analysis is requested ✓
- C. Because pools are regulated and scoring is not
- D. Because AI systems cannot score reliably at small scale

> **B.** Move the boundary and a disparity appears or disappears without a single score changing. It is the earliest decision, the least documented, and the one no model can evaluate.

**Q2.** What is a "decisional unit" `[V]`?

- A. A consulting framework for grouping employees during restructuring
- B. The statutory term for the portion of the employer's organisational structure from which those offered an ADEA waiver were chosen ✓
- C. The team responsible for making termination decisions
- D. A required committee under state AI legislation

> **B.** It is a statutory concept with case law attached, not a framework — and courts have invalidated waivers where the unit was described incorrectly.

**Q3.** An employer used no protected-characteristic data in its selection scoring. What does that establish?

- A. That the process cannot produce disparate impact
- B. That the ADEA does not apply
- C. Very little — a metric can track a protected status without naming it, and activity measures track time present ✓
- D. That an affirmative defence is available

> **C.** This is Module 2's principle at its sharpest. The organisation frequently already knows who was on leave; it just never connected that fact to the measure.

**Q4.** Why does an activity or output metric disadvantage an employee on protected leave `[V]`?

- A. Because managers rate them lower
- B. Because the metric is a proxy for time present, which the employee is lawfully not accumulating ✓
- C. Because leave is recorded in the performance system
- D. Because such employees are excluded from the pool

> **B.** No animus and no protected field are required. The measure records reduced activity accurately and unusably, and the same logic reaches accommodations, reduced schedules and military service.

**Q5.** What changes when you run four-fifths on a reduction rather than a hiring process?

- A. Nothing — the arithmetic is identical
- B. The rate is the selection-for-termination rate, populations are smaller so the standard deviation test matters more, and age becomes the dominant exposure ✓
- C. The threshold moves from 0.8 to 0.5
- D. Four-fifths does not apply to terminations

> **B.** And it is easy to compute the ratio the wrong way round and reassure yourself, which is worth checking twice.

**Q6.** Your analysis shows no disparity within the decisional unit, but a clear one when run a level wider. What does that mean?

- A. The wider result is noise and should be discarded
- B. The pool definition is doing work that the scoring is getting credit for ✓
- C. The two analyses used different methods
- D. The disparity is explained by the larger sample

> **B.** It is the most informative result this analysis can produce, and it points at the decision made before anyone was scored.

**Q7.** When should the privilege question be settled in a reduction `[V]`?

- A. After the analysis is complete, so counsel can see the results
- B. Before the pool is drawn and before any scoring, because once a draft list exists every analysis is analysis of a list ✓
- C. Only if a claim is filed
- D. At the same time the waivers are prepared

> **B.** The window closes early and cannot be reopened. The timeline itself is discoverable, and it tells a story you did not choose.

**Q8.** What is the falsifiable test of whether human review of an AI-assisted selection is real?

- A. Whether a policy requiring review exists
- B. Whether reviewers are trained
- C. Whether a human has ever actually changed one of the recommendations ✓
- D. Whether review happens before the list is final

> **C.** A policy, training and timing are all necessary and none is evidence. If nothing changed across a full cycle, the review is a signature.

## Sources and attribution

- ***Doe et al. v. Meta Platforms***, complaint filed **13 July 2026**, N.D. Cal. (Oakland) — 26 named
  plaintiffs across six states and DC, alleging AI-assisted selection for layoff discriminated
  against workers with disabilities, on protected medical or family leave, and pregnant employees;
  claims under FMLA, ADA, the Pregnancy Discrimination Act, the PWFA, California FEHA including its
  automated-decision-system regulations, and New York, NYC, DC, Washington State, Florida and
  Illinois law. Alleged inputs include keystroke and activity monitoring, AI token-usage dashboards
  and algorithmically assisted performance rankings. Reported independently by CNBC, ABC News, CBS
  News and Fortune. **These are allegations in a filed complaint. Nothing has been decided and the
  defendant has not answered them** — stated that way at every point of use, because a curriculum
  that teaches evidence-reading cannot narrate a complaint as a finding. **[V]**
- **The decisional unit** — 29 U.S.C. § 626(f)(1)(H) and 29 C.F.R. § 1625.22: where two or more
  employees aged 40 or over are asked to waive ADEA claims in a group termination programme, the
  employer must disclose the job titles and ages of those selected and those not selected within the
  decisional unit. Requirements are strict; a defective disclosure invalidates the waiver. **[V]**
- **Distinguished from *Mobley v. Workday***, which this track covers in Modules 1 and 3: *Mobley*
  concerns a **vendor's** screening tool in **hiring**; this module concerns an **employer's own**
  internal measures in **selection for termination**. The shared principle is that a system
  performing a selection function carries selection obligations. Canonical wording for both is in
  `content/evidence/`. **[V]**
- **Four-fifths and standard deviation methods** are Module 3's and are not re-derived here; this
  module changes only what they are applied to.
- **The privilege sequencing argument** is Module 3 Lesson 4's, applied to a reduction, where the
  window closes earlier than in any other context this track covers.
- **Human-review guidance** reflects the consistent direction of current enforcement commentary
  rather than a single instrument, and is stated as direction of travel. **[V]**
- Builds on 101 M7 (assist vs. decide) and Module 2's four-question test.
  *Counsel review required before this module ships and before any of it is applied to a live
  process.* **[V]**
