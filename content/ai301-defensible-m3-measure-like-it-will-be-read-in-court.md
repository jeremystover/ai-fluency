# AI 301 · Defensible by Design · Module 3 — Measure like it will be read in court

**Course:** AI 301 · The Specialist — Defensible by Design · Module 3 of 5
**Estimated time:** 40 min content · 10 min exercise · 25 min applied activity
**Prerequisite:** Module 2 — you cannot test a system you have not found
**Position in the track:** the methodological core, and the module nothing else on the market has

> `Concepts reviewed: [DATE] · Examples current as of: [DATE]`
> Lessons 1 and 4 are **[V]** volatile layer, statutes and an active litigation. The methods in
> Lessons 2 and 3 are stable and predate all of it.

---

## ⚖️ Counsel review required

**This module describes two statutory regimes, an active federal case, and a privilege doctrine.**
The privilege material in Lesson 4 is the most consequential and the most fact-specific: whether any
particular analysis is protected depends on how it was commissioned, by whom, for what purpose, and
what was done with the result.

**Before this module ships**, Lessons 1 and 4 need a read by counsel qualified in the deployment's
jurisdictions. **Before you design a testing programme on this basis, involve your own counsel from
the beginning**, which isn't a disclaimer here but the actual method the module teaches. Nothing
in this module is legal advice.

## Calibration prompt — before you start

*One claim. Commit before you read anything.*

Here's a factual assertion about your own organization:

> **"If we were asked tomorrow to show our adverse impact testing for the systems that screen
> candidates, we could produce something, and it would be recent enough to describe the systems we
> are actually running."**

**True of us, or not true of us?** Commit to one, in a sentence.

Then predict one number: **of the six criteria Connecticut identifies for weighing anti-bias testing
— quality, efficacy, recency, scope, results obtained, and response to results, how many would your
current testing satisfy?** A number from 0 to 6. You'll assess it in the activity.

---

## Module brief

Module 1 said your exposure relocated to discovery. Module 2 ended on the counter-argument that
follows: if your analyses are evidence, the safest thing to do isn't produce any.

**This module is the answer, and the answer is not "be brave."** It is that testing conducted the
right way is both more protected and more useful than testing conducted casually — and that the
casual version, which is what most organizations do, produces the worst of every outcome: knowledge
without protection, findings without action, and a document trail assembled by people who never
asked a lawyer.

There are three parts. What the law now says your testing is worth, which is more specific than most
practitioners realize. How to do it, the methods, which are old, unglamorous, and largely absent
from the AI governance conversation because they aren't new. And how to sequence it so that the
knowledge you generate is protected, which is where a federal court has now given a usable answer.

This is the module nothing else on the market teaches, because most material aimed at this audience
is written by people selling a tool that produces the number rather than people who have had to
defend one.

## Learning objectives

By the end of this module you should be able to:

1. State what California and Connecticut have made your testing programme legally worth.
2. Compute and interpret both the four-fifths rule and a standard deviation test, and say when each
   misleads.
3. Detect proxies, and explain why proxy discrimination is the mechanism the system is converging on.
4. Explain why external benchmarking conceals the problem it appears to measure.
5. Sequence privilege before evidence, and say what a court has actually held on this.

## Lesson 1 · Your testing is evidence, and the rubric is published **[V]**

Two states have done something unusual: they have made the *existence and quality* of your testing
programme legally consequential.

**California**, since **1 October 2025**: the Civil Rights Council's automated-decision regulations
make anti-bias testing (**or its absence**) explicitly relevant to a discrimination claim, and
impose extended recordkeeping on automated-decision data. Read the "or its absence" clause carefully.
It means the organization that never tested hasn't avoided the question. It has answered it.

**Connecticut**, from **1 October 2026**: using an automated employment-related decision technology
isn't a defence to a discrimination complaint — **and** evidence of anti-bias testing may be
considered in your defence, weighed on six identified factors:

**Quality.** Was the method sound?
**Efficacy.** Did it actually detect what it was capable of detecting?
**Recency.** When did you last run it, against the system you're running now?
**Scope.** Which systems, which populations, which decision points?
**The results obtained.** You have to have looked.
**And your response to those results.** The one most easily failed.

Together those two regimes produce the sentence this track is named for:

> **Your testing programme is evidence, in both directions — and one legislature has now published
> the rubric it will be graded against.**

Which reframes the exercise. You aren't testing to find out whether the system is fair, in the
abstract, for its own sake. **You're building a record that will be read by someone hostile, years
later, and graded against six named criteria.** Design it accordingly, and note that four of the
six are about process rather than findings, which means a programme can score well on them before it
has found anything at all.

## Lesson 2 · The methods

Two tests, and you need both. Neither is new (this is decades-old selection-procedure practice)
and their absence from the AI governance conversation is a gap, not a sign that they have been
superseded.

### The four-fifths rule

Compute the selection rate for each group (selected divided by applicants) take the group with the
highest rate as the reference, and express every other group's rate as a proportion of it. A ratio
below 0.8 is the conventional flag.

Worked: 200 men apply, 60 pass (30%). 100 women apply, 21 pass (21%). Ratio = 21/30 = **0.70**.
Below four-fifths, flagged.

**Where it misleads: small numbers.** At 20 applicants and 5 applicants, a single person moving
across the line swings the ratio wildly. The four-fifths rule reports a dramatic disparity from a
sample that supports no conclusion at all, and it will do so with total confidence, because it is
arithmetic and arithmetic doesn't hedge.

### The standard deviation test

The complement, and the one usually missing from vendor outputs. It asks a different question: **if
selection were independent of group membership, how surprising is this result?** Expected selections
for the group, minus observed, divided by the standard deviation of the expected distribution. Two
standard deviations is the conventional threshold: roughly, a result that would occur by chance
less than about one time in twenty.

Run it on the worked example and you get a statistically meaningful result, because 300 applicants
is enough. Run it on 25 applicants and you typically don't, **even where the four-fifths ratio looks
alarming.**

**Why you need both, stated as the rule:**

> **Four-fifths tells you whether a gap is large. Standard deviation tells you whether it is real.
> A programme reporting only the first will chase noise and miss patterns; a programme reporting
> only the second will dismiss real harm in small populations as statistically unremarkable.**

Both failure modes are common and they point in opposite directions, which is why a vendor report
containing only one of them is incomplete regardless of which one it contains.

### Proxies

A proxy is a facially neutral variable that carries protected-class information. Zip code carries
race in most American metropolitan areas — which is why Illinois's HB 3773 prohibits its use as a
proxy outright, the first US statute to name the mechanism rather than the outcome. Others recur:
graduation year and continuous employment history carry age; commute distance carries both race and
caregiving status; certain schools and extracurriculars carry class and race; typing cadence and
interaction-speed features carry disability.

Detection is a specific procedure, and you can run it:

1. **Take the model's inputs**, including derived features and anything the vendor calls a signal.
2. **For each, test its association with protected characteristics in your own population**, not in
   general. Zip code's relationship to race is local.
3. **Where association is strong, ask whether the variable is job-related** and whether a
   less-discriminatory alternative would serve the same purpose.
4. **Then test the model with the variable removed** and see what happens to both accuracy and the
   disparity. That comparison is the single most useful artifact this method produces.

Note what step 4 gives you that nothing else does: **evidence about a less-discriminatory
alternative**, which is exactly the ground on which disparate impact cases are contested.

And note where this is heading. Illinois legislated against proxies; a federal court has allowed a
proxy-discrimination claim to proceed in *Mobley*. Two independent systems converging on the same
mechanism.

### Intersections

Run cuts on single characteristics and you'll miss the case where a model passes for women, passes
for Black applicants, and fails badly for Black women. This isn't an edge case. It is the
predictable result of a model learning from a population where the intersection was historically
underrepresented, and single-axis analysis is structurally incapable of seeing it.

The constraint is honest: intersectional cells are smaller, which returns you to the standard
deviation test. Often the correct finding is *this cell is too small to test, and here's how many
cycles of data we would need*. **Recording that is a legitimate output** and materially better than
either ignoring the intersection or reporting a ratio the sample can't support.

## Lesson 3 · Why benchmarking hides the problem

A short lesson about the most common way a testing programme reassures itself into uselessness.

Vendors and consultancies offer benchmarking: your selection rates against industry comparators,
your disparity ratios against the market. It feels rigorous, it produces a defensible-looking chart,
and it answers the wrong question.

**When a substantial share of a problem is concentrated in a minority of firms, the average conceals
it by construction.** A firm sitting inside the bad tail benchmarks as normal, because the tail is
included in the average it is being compared against. Your report says "in line with industry," and
in line with industry is exactly where the problem lives.

Three further reasons the comparison misleads even when the distribution is well-behaved:

**Comparators are self-selected.** Firms that participate in benchmarking studies are firms
confident enough to participate.

**Definitions drift.** Your "applicant" and their "applicant" are different populations, and
selection rates are extremely sensitive to that denominator.

**And the legal standard is not comparative.** No statute asks whether your disparity is typical.
Being average isn't a defence, has never been a defence, and a report constructed around the
comparison is a report constructed around a question nobody will ask you.

What replaces it is unglamorous and better: **your own data, over time, against your own prior
results, on stable definitions.** Longitudinal internal comparison tells you whether a change made
things better or worse — which is the only question you can actually act on, and the only one that
speaks to Connecticut's *response to results* criterion.

> ### Try this — 3 minutes
> Find the last fairness or diversity benchmark report your organization received. Look for two
> things: does it state the denominator definition, and does it show the distribution or only the
> average? Most show neither, which means it cannot tell you where in the distribution you sit.

## Lesson 4 · Sequence privilege before you generate evidence **[V]**

The module's hardest idea, and the answer to Module 2's counter-argument.

**AI collapsed the cost of producing analysis that is adverse to your own employer.** The adverse
impact analysis that once required a statistician, a data pull, a budget approval and three weeks
now takes a competent analyst four minutes in a chat window. The friction is gone.

Friction was doing more work than anyone acknowledged. It wasn't a good control (it suppressed
useful analysis along with risky analysis) but it was *a* control, and its removal changes the
governing question. The question is no longer *should we run this*. It is:

> **Who can run it, under what protection, and what happens to the output?**

Because in an organization where forty people can produce a disparity analysis in an afternoon,
somebody will. The realistic choice isn't between generating evidence and not generating it. It is
between **generated deliberately, under protection, with a plan for the result** and **generated
casually, unprotected, by someone who never asked a lawyer, sitting in a shared drive.**

### What a court has actually held

This isn't theoretical any more. In ***Mobley v. Workday***, a magistrate judge in the Northern
District of California resolved a discovery dispute on 29 May 2026 by **denying the plaintiffs'
motion to compel production of Workday's bias-testing data, holding that attorney-client privilege
protected it, because Workday's attorneys had curated the data and used the results in providing
legal advice.**

Read the reasoning rather than the outcome, because the reasoning is the method:

**Counsel curated the data.** Not "counsel was copied." Not "counsel saw it afterwards." The lawyers
directed what was collected.

**And counsel used the results in providing legal advice.** The analysis existed to inform legal
advice, and did.

That is a structure, and it is one you can build deliberately in advance. It is also one you
categorically can't construct afterwards: an analysis run by an analyst on a Tuesday, forwarded to
legal on Friday, wasn't commissioned by counsel to inform advice, and calling it privileged later
doesn't make it so.

**Four practical consequences.**

**Decide who may run these analyses, and make it a small number of named people.** Not because
curiosity is dangerous but because unprotected knowledge is.

**Commission the real work through counsel, before the data is pulled.** The privilege attaches to
the structure, not to a label applied later.

**Decide what you'll do with a bad result before you have one.** Both because Connecticut weighs
your response to results, and because an organization deciding how to react to a disparity *while
looking at the disparity* will decide badly.

**And be honest about what privilege is not.** It doesn't make a problem go away, it doesn't
survive waiver, it doesn't cover the underlying facts, and it isn't a reason to avoid remediation.
Privilege protects the *analysis*. It doesn't immunize the *practice*. An organization using
privilege to keep knowing about a disparity while doing nothing about it has built the exact record
Connecticut's sixth criterion is designed to punish, with the additional feature that it did so on
legal advice.

## Key takeaways

- **Your testing is evidence in both directions** `[V]`. California (1 Oct 2025) makes testing *or
  its absence* relevant to a claim. Connecticut (1 Oct 2026) makes it a mitigating factor weighed on
  **quality, efficacy, recency, scope, results obtained, and your response to results** — four of
  which are about process, so a programme can score on them before it has found anything.
- **Run both tests. Four-fifths tells you whether a gap is large; standard deviation tells you
  whether it is real.** Only the first chases noise; only the second dismisses real harm in small
  populations.
- **Proxy detection is a four-step procedure**, and step four (testing with the variable removed)
  produces evidence about a less-discriminatory alternative, which is the ground disparate impact
  cases are actually contested on. Illinois legislated against proxies and a court has let a proxy
  claim proceed: two systems converging on the same mechanism.
- **Intersections need their own cuts**, and "this cell is too small to test, and here's what we'd
  need" is a legitimate finding rather than a failure.
- **Benchmarking conceals by construction.** When a problem concentrates in a minority of firms, a
  firm in the bad tail benchmarks as normal, and the legal standard was never comparative. Being
  average isn't a defence. Use your own data over time on stable definitions.
- **AI removed friction, and friction was the old control.** The question is no longer whether to
  run it but **who may, under what protection, and what happens to the output**, because in an
  organization where forty people can run it, somebody will.
- **A court has held bias-testing data privileged where counsel curated it and used the results in
  providing legal advice** `[V]`. That is a structure you build in advance and can't construct
  afterwards. **Privilege protects the analysis, not the practice.**

## Take a position

**The claim:** *"The analysis you're afraid to run is the one a plaintiff will run for you, without
privilege and without your context."*

The strongest counter-argument is that **privilege-first testing is a governance theatre that
protects the organization while changing nothing for the people affected.** A programme designed
primarily around evidentiary protection optimizes for what is discoverable rather than for what is
fixed. Analyses stay inside a small legal circle, findings are described obliquely, remediation is
slowed by review, and the people best placed to act (recruiters, hiring managers, the people
analytics team) are deliberately kept outside the loop that knows. **On that reading, this module
teaches an organization to know about a disparity more safely, which is not the same as teaching it
to have fewer.**

There is a sharper version aimed at the practitioner personally. If your testing is commissioned by
counsel to inform legal advice, **counsel decides what happens next, and counsel's client is the
organization.** You may find yourself holding knowledge you can't act on, can't share, and can't
raise — a professionally and ethically uncomfortable position that this module has arranged for you.

Take a position on that, in writing, in the activity. The strongest submissions say what they would
do if a privileged analysis found something serious and the organization chose not to act,
because that is the situation this method makes more likely, not less.

## Applied activity — "The testing protocol memo"

**Time:** 25 minutes · **Submit:** the memo plus a 250–350 word write-up · **Graded against the
rubric below.** Score doesn't matter. Doing the work is where the learning lands.

Write a memo **addressed to your general counsel**, which is itself part of the method.

**Step 1 — Scope (4 min).** Which systems, from your Module 2 inventory, and which decision points.
Say explicitly what is *out* of scope and why.

**Step 2. Method (7 min).** What you would compute: four-fifths and standard deviation, on which
groups, at which decision points. Your proxy candidate list for your own context. Which intersections
you would cut, and which you expect to be too small, with what you'd need to test them.

**Step 3 — Protection (5 min).** How the work would be commissioned so that counsel curates it and
uses the results in advice. Who may run it. Where output lives. What is written down and what isn't.

**Step 4. Cadence and the pre-commitment (6 min).** How often, tied to system changes rather than
the calendar. Then the hard part: **what you'll do if it finds something.** Thresholds for
escalation, who decides, and what remediation looks like. Decide it now, before you have a result.

**Step 5. Score the prediction (3 min).** Assess your *current* testing against Connecticut's six
criteria and count how many it satisfies, against your prediction. Direction and size of the miss,
and one sentence on what it reveals.

Then the write-up: your position on the claim above with the counter-argument addressed (
**including what you would do if a privileged analysis found something serious and the organization
chose not to act**) and **the one thing in this protocol you do not expect to get approved**, with
why.

## Knowledge check — 8 questions

*Unlocks after the applied activity is submitted. Retakes are free and unlimited.*

**Q1.** What does California's "or its absence" clause mean for an organization that has never tested `[V]`?

- A. It is protected, since there are no findings to disclose
- B. It hasn't avoided the question — the absence of testing is itself relevant to a discrimination claim ✓
- C. It must begin testing within a defined period
- D. It is presumed compliant until a complaint is filed

> **B.** Not testing is an answer rather than an avoidance. Set alongside Connecticut's mitigation framework, the direction is unmistakable: the existence and quality of your programme is legally consequential.

**Q2.** Why must you run both the four-fifths rule and a standard deviation test?

- A. Because different jurisdictions require different tests
- B. Because four-fifths applies to hiring and standard deviation to promotion
- C. Because four-fifths tells you whether a gap is large and standard deviation tells you whether it is real: only the first chases noise, only the second dismisses real harm in small populations ✓
- D. Because vendors compute one and regulators the other

> **C.** The two failure modes point in opposite directions, which is why a vendor report containing only one is incomplete regardless of which one it contains.

**Q3.** 200 men apply and 60 are selected; 100 women apply and 21 are selected. What is the four-fifths ratio, and what should you do next?

- A. 0.35, investigate immediately
- B. 0.70 — flagged, and the next step is a standard deviation test to establish whether the result is statistically meaningful ✓
- C. 0.21: the disparity is severe
- D. 1.43: men are disadvantaged

> **B.** 21/100 = 21%, 60/200 = 30%, ratio 0.70, below the 0.8 threshold. With 300 applicants the standard deviation test is likely to be meaningful; at 25 applicants it typically would not be, even with an alarming ratio.

**Q4.** Which step of proxy detection produces evidence about a less-discriminatory alternative?

- A. Listing the model's inputs including derived features
- B. Testing each input's association with protected characteristics in your own population
- C. Testing the model with the variable removed, and comparing what happens to accuracy and to the disparity ✓
- D. Asking whether the variable is job-related

> **C.** That comparison is the most useful artifact the method produces, because less-discriminatory alternatives are precisely the ground on which disparate impact cases are contested.

**Q5.** Why does external benchmarking conceal the problem it appears to measure?

- A. Because benchmark data is usually out of date
- B. Because when a problem concentrates in a minority of firms, a firm in the bad tail benchmarks as normal — the tail is inside the average it's compared against ✓
- C. Because industries define protected groups inconsistently
- D. Because benchmarks exclude small employers

> **B.** Plus three compounding issues: comparators self-select, denominator definitions drift, and (decisively) the legal standard was never comparative. Being average is not a defence and never has been.

**Q6.** What changed when AI removed the friction from adverse impact analysis?

- A. The analysis became more accurate
- B. The question moved from whether to run it to who may run it, under what protection, and what happens to the output, because in an organization where forty people can, somebody will ✓
- C. Testing became legally required in more jurisdictions
- D. The results became admissible in a way they previously weren't

> **B.** Friction was never a good control (it suppressed useful analysis alongside risky analysis) but it was a control, and its removal means the realistic choice is between deliberate protected generation and casual unprotected generation.

**Q7.** On what reasoning did a court hold bias-testing data privileged `[V]`?

- A. Because it was marked confidential and stored with legal records
- B. Because trade secret protection covered the underlying methodology
- C. Because counsel curated the data and used the results in providing legal advice ✓
- D. Because the data was produced after litigation commenced

> **C.** That is a structure you build deliberately in advance. An analysis run on a Tuesday and forwarded to legal on Friday was not commissioned by counsel to inform advice, and labelling it later does not make it privileged.

**Q8.** What does privilege *not* do?

- A. It doesn't apply to data held by third-party vendors
- B. It doesn't survive more than one litigation
- C. It doesn't make the problem go away, doesn't survive waiver, doesn't cover underlying facts, and doesn't immunize the practice, only the analysis ✓
- D. It doesn't apply where a regulator rather than a plaintiff requests the material

> **C.** An organization using privilege to keep knowing about a disparity while doing nothing has built exactly the record Connecticut's sixth criterion punishes — with the additional feature that it did so on legal advice.

## Sources and attribution

- **California Civil Rights Council** automated-decision regulations, effective 1 October 2025:
  anti-bias testing or its absence relevant to a discrimination claim, plus extended recordkeeping.
  **[V]**
- **Connecticut's AEDT framework**, effective 1 October 2026, the non-defence provision and the
  six enumerated factors for weighing anti-bias testing. **[V]**
- ***Mobley v. Workday, Inc.***, No. 23-cv-00770 (N.D. Cal.) — discovery order of **29 May 2026**
  denying the plaintiffs' motion to compel production of bias-testing data on attorney-client
  privilege grounds, on the basis that counsel curated the data and used the results in providing
  legal advice; and separately denying production of customers' applicant data for want of "control"
  under Rule 34. The 22 June 2026 order allowing core discrimination claims (including a
  proxy-discrimination claim) to proceed is described in Module 1. **[V]**
- **Illinois HB 3773**, effective 1 January 2026, prohibiting zip codes as proxies for protected
  classes. **[V]**
- The four-fifths rule and standard deviation testing are long-standing selection-procedure
  practice, not innovations of this course. The four-step proxy detection procedure, the
  benchmarking-conceals-by-construction argument, and the friction-was-the-old-control framing are
  original to this course.
- **Counsel review required, see the gate at the top of this module.**
- Structure and topic coverage follow the AI Fluency Framework (Dakan & Feller, in collaboration
  with Anthropic, CC BY-NC-SA 4.0); prose is original.
