# AI 301 · People Ops & HR Technology · Module 5 — The foundation

**Course:** AI 301 · The Specialist — People Ops & HR Technology track · Module 5 of 8
**Estimated time:** 25 min content · 10 min exercise · 30 min applied activity
**Prerequisite:** Modules 1–2 · builds on 101 M7 (the assist/decide line) and `ai301-hrbp-m5`
(arriving with a model rather than a story)
**Position in the track:** the only unambiguously good news in the course — and the module with no
anchor statistic, for a reason that turns out to be the argument

> `Concepts reviewed: [DATE] · Examples current as of: [DATE]`
> Lesson 2 is **volatile layer** and is mostly about evidence that does not exist. The definition of
> clean, the detection/correction line, and the business-case form are stable.

---

## Calibration prompt — the claim to contest

*Commit before you read anything. Thirty seconds.*

**The claim:** *"Every AI outcome your function has promised is waiting on work only you can do, and
it has never been funded as an AI project."*

**Is that true of your organization?** *True of us* or *not true of us*, and the one sentence you
would defend it with.

**And the number you'll check, by actually running it:** the activity asks you to run one
reconciliation — a count in one system against the same count in another, or one integrity check
inside a single system. **What percentage of records do you expect to fail it?**

Give a whole percent. Then go and find out.

---

## Module brief

Seven of the eight modules in this track are about restraining something. This one is the opposite,
and it is worth saying plainly at the top: **this is the highest-value, lowest-risk AI work available
to anybody in the People function, and almost nobody is doing it.**

The reason isn't that it is hard. It is that it is invisible. Nobody demos a data dictionary. No
vendor sells a keynote about reconciling headcount across three systems. There is no dashboard tile
for "the record now agrees with itself," and so the work that every other AI ambition in your
function depends on has never once been funded as an AI project.

The module has an unusual shape as a result. It starts with what *clean* actually means, in your
systems, concretely, because the phrase is used so loosely that it has stopped meaning anything.
Then it does something no other module in this curriculum does: **it tells you that its anchor
statistic does not exist**, and shows you why that absence is the strongest available evidence for
the module's own argument. Then the good news, and finally the business case, because the content
that actually gets this work funded isn't a description of the problem. It is a dependency argument
attached to something your leadership has already promised in public.

## Learning objectives

By the end of this module you should be able to:

1. Define what "clean" means in an HCM in checkable terms, and distinguish a field being **populated**
   from a field being **true**.
2. Explain why no credible measurement of HR data quality exists `[V]`, and why the absence supports
   rather than weakens the case for the work.
3. Argue why data-quality work is the one substantial body of AI work in this role that sits
   unambiguously on the safe side of 101 M7's line.
4. Build the four-line business case: promised outcome → blocking condition → measured symptom →
   scoped remediation.
5. Hold the line that **AI proposes candidate errors and a human confirms before any record changes**,
   and explain why a bulk correction is itself a wide-reach, long-latency change.

## Lesson 1 · What "clean" actually means

Six specific properties. Every one is checkable, and every one fails quietly.

**Effective dating that reconstructs history, not just describes today.** The test is a single
question: *who was this person's manager on 3 March last year?* Most HR systems answer *who is their
manager* instantly and can't answer the historical version at all, or answer it wrongly because a
correction was applied without a date. Every trend, every cohort analysis, and every "what changed
after the reorg" question depends on the second answer.

**One identity per human, across systems.** The same person carries an HCM ID, a payroll number, and
an identity-provider account, joined in practice by email address — which changes on marriage, on a
name correction, and on a rebrand of your domain. Every duplicate you have was created by a join
that used the wrong key at the wrong moment.

**Referential integrity when the org moves.** Positions pointing at cost centres that were closed in
a restructure. Approval chains whose second step is a terminated employee. Neither of these throws an
error; they simply route to nowhere, and the request sits.

**Picklist values that are dead and still selectable.** Forty-seven job families, eleven of them
deprecated, and all forty-seven still in the dropdown, so coordinators keep selecting the
deprecated ones, because the list is the only guidance they have.

**A manager hierarchy that is actually current.** The forty-three employees whose manager left the
company. Approvals go nowhere, review cycles never launch for them, and every span-of-control number
you report is wrong by an amount nobody has measured.

**Job architecture that has not fractured.** Two different "Senior Analyst" levels inherited from an
acquisition and never reconciled, so any analysis by level silently mixes two scales.

And then the distinction that does most of the work in this lesson:

> **A field being populated is not a field being true.**

Every data-quality metric you have ever been shown measures the first. *98% of employee records have
a job family populated* is a completeness statistic, and completeness is easy to measure and easy to
improve. You can populate a field with a default in an afternoon. Truth is neither. **Nobody
measures truth**, which is why the number in Lesson 2 doesn't exist.

## Lesson 2 · The number that doesn't exist **[V]**

This lesson is a short account of a failed search, and it is here because the failure is more useful
than a number would have been.

We went looking for a credible measurement of HR data quality to anchor this module. **There is not
one.** Here's what a serious search returns:

- Vendor blogs citing other vendor blogs, with no primary source at the end of the chain.
- A widely circulated figure about the share of HR leaders naming data readiness as a barrier to
  scaling AI — which traces to a **vendor survey whose sample size is not disclosed** anywhere we
  could find it.
- Consultancy claims about the proportion of companies that can't use their own people data, with
  numbers ranging from 8% to 25% depending on which secondary source repeats them, and no
  methodology attached to any version.
- An arresting anecdote about duplicate records causing $2.3 million in benefit overpayments, with no
  attribution to a named organization, audit, or study.
- **No peer-reviewed measurement of error rates in employee master data** that we could locate.

So this module states plainly what the rest of the curriculum would state about anybody else's
evidence: **it has no anchor statistic, because no credible one exists.** A course that teaches you to
ask *what's the sample?* has to answer that question about its own evidence, and here the honest
answer is that the evidence isn't there. Building a lesson on the undisclosed-sample figure would
have been the exact failure this curriculum spends eight modules warning you about.

**And now the useful part, because the absence is not a gap in the argument. It is the argument.**

Work that nobody measures is work that nobody funds. HR data quality has no owner, no metric, no
dashboard tile, and no line in a budget, and *therefore* no research literature, because nobody
commissions studies of things that are nobody's job. **The missing number is a symptom of the exact
condition this module is about.** If data quality were funded, measured, and owned, there would be
benchmarks, and there are none.

**What *is* measured is the downstream symptom.** Payroll error has a literature, because payroll
error is visible, embarrassing, and lands on a named person's payslip. An Ernst & Young survey (
**508 respondents who work with payroll at US-headquartered companies of 250 to 10,000 employees**,
published in 2022) found roughly **one in five US payrolls contains errors**, at an estimated
average cost of **$291 per error**. Note the caveats honestly: it is a consultancy survey, it is now
four years old, and the per-error cost is a modelled estimate rather than a measured outlay. But
**the sample is disclosed**, which is more than any HR data-quality figure we could find, and that
comparison is the whole point.

> **The cause is unmeasured. The symptom has a number. Which is exactly why the remediation never
> gets funded, and exactly how you should build the case for it.**

You can't construct a business case on an unmeasured cause. So you construct it on the measured
symptom, and Lesson 4 shows you the form.

## Lesson 3 · The inversion

Now the good news, and it is genuinely good.

101 M7 drew the line this curriculum is organized around: **AI must not make decisions about people.**
Every other module in this track is an exercise in respecting that line under pressure — routing
around it, gating it, documenting it.

Data-quality work is the one substantial body of work in this role that **does not approach the line
at all.** It makes no decisions about anybody. It finds where the record disagrees with itself.

What it is genuinely excellent at, concretely:

- **Reconciling headcount across three systems** and returning the non-matches *with the reason for
  each*, not a count, a list.
- **Finding the forty-three employees whose manager is terminated**, and the approval chains that
  therefore dead-end.
- **Finding the eleven picklist values that are deprecated and still being selected**, with how often
  and by whom.
- **Spotting impossible effective-date sequences**: a promotion dated before a hire, a termination
  before a transfer, two overlapping primary assignments.
- **Drafting the data dictionary nobody ever wrote**, from the schema plus the actual value
  distributions, which is more honest than the documentation would have been.
- **Reading two systems' field definitions and telling you where they disagree** — the work that
  precedes every integration and that nobody has time for.

Why this is a better fit than it first appears. These are **needle-finding tasks over large, boring,
structured data**, where a human reviewer is slow and (more importantly) inattentive, because the
ten-thousandth row gets less care than the first. A model's attention doesn't degrade across rows.

And the property that makes it *safe*, which matters more than the property that makes it useful:

> **Every candidate finding is independently checkable in seconds.**

You don't have to trust the model. You open the row. That is a completely different risk posture
from anything else in this track, where the whole difficulty is that you can't verify the output
without redoing the work.

**One boundary worth naming, because a sibling track covers adjacent ground.** The Comp & Benefits
track's craft layer teaches verification of *one analysis on an extract you pulled*: audit files,
row counts, documented joins, reconciliation specs. Reconciliation as a concept belongs to both
modules and neither owns it. The difference in subject is total: that module is about the analysis,
**this one is about the source system and the pipelines between systems.** If you have taken it, the
habits transfer directly. If you haven't, you have lost nothing.

> ### Try this (3 minutes
> Pick two systems that should agree about headcount) your HCM and your payroll system, or your HCM
> and your identity provider. Get the current count from each. If they differ, you have this module's
> activity already started, and the difference is the most concrete thing you'll say to your
> leadership this quarter.

## Lesson 4 · The business case, and the discipline that protects it

### The case

Don't argue for data quality. It has never worked, and Lesson 2 explains why: you would be arguing
for an unmeasured cause against funded alternatives.

**Argue instead for the specific outcome your leadership has already promised in public, and show
what is blocking it.** Four lines:

1. **The promised outcome, in their words.** Ideally quoted from a deck, a town hall, or a board
   update. *"Manager self-service for all people decisions by Q3."* *"AI-assisted internal mobility."*
   *"Skills-based workforce planning."*
2. **The specific data condition that blocks it.** Not "our data is messy." *Internal mobility
   matching requires a current skills profile; 61% of employee records have no skills data entered
   since 2023.*
3. **The measured symptom it is already costing you.** From Lesson 2's approach: the visible,
   countable downstream consequence. Payroll corrections per cycle. Tickets caused by wrong records.
   Approval cycle time inflated by dead-end routing.
4. **The remediation, scoped**, with detection assigned to AI and correction assigned to a named
   human, and a first slice small enough to finish this quarter.

Why this form works when the general plea doesn't: **you are not asking for a new project. You're
telling them the project they already announced has a prerequisite.** That is a different
conversation with a different default — the first is a request to be weighed against other requests,
the second is a risk to something already committed. And you're the only person in the building who
can see it, which is the whole of your standing here.

The HRBP track teaches arriving with a model rather than a story. **This is the one model this role
always has standing to build**, because the blocker is in a system you administer and nobody else has
looked.

### The discipline

Everything above is why the work is safe. This is what keeps it that way, and it is the module's hard
line:

> **AI proposes candidate errors. A human confirms before a single record changes.**

Detection is assist. **Correction at scale is a decision with a blast radius**, and Module 1 already
told you what kind. A bulk data correction is, by construction, a **wide-reach, long-latency change**:
it touches many people at once, it propagates to payroll and the carriers and the identity provider,
and nothing announces it if the logic was wrong.

Which produces the trap worth naming out loud: **a remediation run badly is indistinguishable from
the problem it was fixing.** Worse, the correction is made under time pressure, by somebody who is
embarrassed about the original state, on a schedule set by the announcement in the business case.
That is the exact set of conditions under which people skip a sample.

The operational form, then:

- AI produces a **candidate list with a reason per row.** Not a corrected file: a list of proposed
  changes and why each one is proposed.
- A human **samples it** (properly, not the first ten) and looks specifically for a category of
  false positive rather than for individual mistakes. False positives cluster; if you find one, look
  for its family.
- Approve **in batches small enough to reverse**, and reverse one deliberately as a rehearsal, which
  is Module 2's rollback discipline applied to data.
- **Reconcile after.** The number of records changed must equal the number approved. If it doesn't,
  stop — you have just learned something important about the script.

## Key takeaways

- **Six checkable properties of clean:** effective dating that reconstructs history, one identity per
  human across systems, referential integrity when the org moves, no dead-but-selectable picklist
  values, a current manager hierarchy, and an unfractured job architecture.
- **A field being populated is not a field being true.** Every metric you have been shown measures
  completeness, which is easy to fake with a default value. Nobody measures truth.
- **This module has no anchor statistic because no credible one exists** `[V]`. What is out there:
  vendor blogs citing each other, a widely-quoted figure from an undisclosed-sample vendor survey,
  consultancy claims with no methodology, an unattributed anecdote, and no peer-reviewed measurement
  of employee master-data error rates.
- **The absence is the argument.** Work nobody measures is work nobody funds; unfunded, unowned work
  generates no research. **The missing number is a symptom of the condition.**
- **The symptom does have a number** `[V]`: an EY survey of 508 payroll practitioners at
  US-headquartered companies of 250–10,000 employees (2022) found roughly one in five US payrolls
  contains errors, at an estimated $291 each. Consultancy survey, four years old, modelled cost, and
  **its sample is disclosed**, which is the comparison that matters.
- **Data-quality work is the one substantial AI use in this role that never approaches 101 M7's
  line** — it makes no decisions about people, it finds where the record disagrees with itself. And
  it is *safe* because **every candidate finding is independently checkable in seconds.**
- **Four-line business case:** the promised outcome in leadership's words, the specific blocking
  condition, the measured symptom it already costs, and a scoped remediation. **You are not asking for
  a project; you're telling them the announced one has a prerequisite.**
- **AI proposes; a human confirms before any record changes.** A bulk correction is itself a
  wide-reach long-latency change, so **a remediation run badly is indistinguishable from the problem
  it fixed.** Candidate list with reasons, sample for *families* of false positive, batches small
  enough to reverse, and reconcile the changed count against the approved count.

## Take a position

**The claim:** *"Every AI outcome your function has promised is waiting on work only you can do, and
it has never been funded as an AI project."*

The strongest counter-argument is that **this is the oldest complaint in the systems trade, and it
has been wrong every time it has been made.** *We must clean the data before we can do X* preceded
every ERP implementation, every data-warehouse programme, and every analytics initiative of the last
thirty years. In practice, the organizations that waited for clean data shipped nothing, while the
ones that shipped something imperfect discovered **which fields were actually structural**, which
is a vastly cheaper way to find out than auditing everything, because most of your dirty data is in
fields nobody's use case touches.

There is a second, sharper version aimed at the AI premise specifically. **Models degrade more
gracefully than joins do.** A retrieval system given a slightly stale document returns a slightly
stale answer; a SQL join given a mismatched key silently drops 340 rows. So the assumption that AI
requires *cleaner* data than a report did may simply be backwards, and if it is, the precondition
argument loses its foundation.

On that view, data remediation-as-prerequisite is how a systems function justifies indefinite
unglamorous work, and the better move is Module 2's: **narrow the scope until it works.** Ship the
thing for the one population whose records are fine, and let the failures tell you which fields
matter.

Your position has to take that seriously, and the honest test is specific rather than general:
**name the one field where your blocked outcome genuinely cannot proceed, and say how you know.** If
you can, the claim holds for that field and you have a much better business case than a general one.
If you can't, the counter-argument is probably right about your situation, and the narrow-scope move
is what you should be doing instead.

## Applied activity — "The blocked outcome"

**Time:** 30 minutes · **Submit:** the reconciliation result, the four-line case, the remediation
design, and a 300–400 word write-up · **Graded against the rubric below.** Score doesn't matter.
Doing the work is where the learning lands.

**Step 1 — Run one reconciliation (10 min).** One count, two places (headcount in the HCM against
payroll, active users in the HCM against the identity provider) or one integrity check inside a
single system, such as employees whose manager is terminated, or records using a deprecated picklist
value. **Submit the actual counts and the failure rate**, plus the query. Aggregate numbers only:
**no employee names, IDs, or record-level data.** A reconciliation you ran badly and reported honestly
beats one you describe hypothetically.

**Step 2. The four-line case (10 min).** The promised outcome in leadership's own words, with where
you got it. The specific data condition blocking it: a named field, a measured share. The measured
symptom it is already costing, from your own systems. And the scoped remediation, first slice sized to
this quarter.

**Step 3 — The detection/correction split (5 min).** For that remediation: what AI detects, what the
candidate list contains including the reason per row, who samples it **by name**, the batch size and
why that size is reversible, and the reconciliation you'll run afterwards.

**Step 4. Score the prediction.** Your predicted failure percentage against the measured one.
Direction and size of the miss.

Then the write-up: your position on the claim above, and it must include the specific test, **the one
field where your blocked outcome genuinely cannot proceed, and how you know**, or an honest statement
that you couldn't name one and what that implies; whether the opening claim turned out to be true of
your organization; and the concrete commitment — **the first slice, its owner, and the date.**

## Knowledge check — 8 questions

*Unlocks after the applied activity is submitted. Retakes are free and unlimited.*

**Q1.** What is the test the module gives for whether your effective dating actually works?

- A. Whether every record has a start date populated
- B. Whether the system can answer who this person's manager was on a specific date last year — not just who it is now ✓
- C. Whether historical records are archived rather than deleted
- D. Whether date fields are validated on entry

> **B.** Most systems answer the present-tense question instantly and cannot answer the historical
> one, or answer it wrongly because a correction was applied without a date. Every trend and cohort
> analysis depends on the second answer.

**Q2.** What does "a field being populated isn't a field being true" mean for data-quality metrics?

- A. That completeness statistics should be weighted by field importance
- B. That every metric you have been shown measures completeness (which is easy to measure and easy to fake with a default value) while nobody measures truth ✓
- C. That populated fields should be audited annually
- D. That required fields produce better data than optional ones

> **B.** And it is the reason the number in Lesson 2 does not exist. You can populate a field in an
> afternoon; you cannot make it true in an afternoon.

**Q3.** Why does this module have no anchor statistic? `[V]`

- A. Because HR data quality varies too much between organizations to benchmark
- B. Because the relevant figures are held privately by HCM vendors
- C. Because no credible measurement exists, the available figures trace to vendor blogs citing each other, an undisclosed-sample vendor survey, consultancy claims with no methodology, and an unattributed anecdote ✓
- D. Because the module is argued from craft rather than evidence by design

> **C.** A course that teaches you to ask "what's the sample?" has to answer it about its own
> evidence. Building the lesson on the undisclosed-sample figure would have been the exact failure
> this curriculum spends eight modules warning about.

**Q4.** How does the module turn that absence into an argument?

- A. By arguing that unmeasurable problems are usually overstated
- B. Because work nobody measures is work nobody funds, and unfunded unowned work generates no research, so the missing number is a symptom of the condition the module is about ✓
- C. By substituting qualitative evidence for quantitative
- D. By deferring the question to the People Analytics track

> **B.** If data quality were funded, measured and owned, there would be benchmarks. There are none,
> and that is informative rather than merely inconvenient.

**Q5.** What is the significance of the payroll error survey in this lesson? `[V]`

- A. It measures HR data quality directly
- B. It shows the cause is unmeasured while the downstream symptom has a disclosed-sample number — which is why you build the business case on the symptom ✓
- C. It proves that payroll systems are less reliable than HR systems
- D. It provides the cost figure to use in any remediation business case

> **B.** Roughly one in five US payrolls containing errors, from 508 practitioners at companies of
> 250–10,000 employees, 2022. Consultancy survey, four years old, modelled per-error cost, and its
> sample is disclosed, which is the comparison that matters. D over-claims: use your own measured
> symptom, not this figure.

**Q6.** Why is data-quality work described as unambiguously safe AI work?

- A. Because it involves no employee-identifying data
- B. Because it makes no decisions about people (it finds where the record disagrees with itself) and every candidate finding is independently checkable in seconds ✓
- C. Because errors in it are self-correcting over time
- D. Because it operates on aggregate rather than individual records

> **B.** The checkability is what makes it safe rather than merely useful: you do not have to trust
> the model, you open the row. That is a different risk posture from everything else in the track. A
> is false. It works on exactly that data.

**Q7.** Why does the four-line business case work when "we need better data" doesn't?

- A. Because it quantifies the total cost of poor data quality
- B. Because it is shorter and executives prefer brevity
- C. Because it reframes the ask from a new project competing for funding into a prerequisite for something leadership has already promised in public ✓
- D. Because it assigns the work to another function's budget

> **C.** A request gets weighed against other requests. A risk to something already committed is a
> different conversation with a different default — and you're the only person who can see it.

**Q8.** Why is a bulk correction itself a dangerous change?

- A. Because bulk updates bypass field-level validation
- B. Because it is a wide-reach long-latency change by construction, so a remediation run badly is indistinguishable from the problem it fixed, and it is made under time pressure by someone embarrassed about the original ✓
- C. Because correction scripts can't be version-controlled
- D. Because vendors don't support bulk operations on all fields

> **B.** Which is why the form is a candidate list with a reason per row, a real sample looking for
> *families* of false positive, batches small enough to reverse, and a reconciliation of the changed
> count against the approved count.

## Sources and attribution

- **On the absence of evidence.** This module deliberately carries **no anchor statistic.** A search
  for a credible measurement of HR data quality returned: vendor content citing other vendor content;
  a widely circulated data-readiness barrier figure traceable to the **Fuel50 Q1 2026 State of AI
  Readiness in Talent Decisions survey, whose sample size we could not establish**; consultancy
  claims about organizations' ability to use their own people data, varying between roughly 8% and 25%
  across secondary repetitions with no methodology attached to any; an unattributed anecdote regarding
  $2.3 million in duplicate-record benefit overpayments; and **no peer-reviewed measurement of
  employee master-data error rates.** None of it is used. **[V]**
- **Ernst & Young payroll survey (2022)**, approximately one in five US payrolls containing errors at
  an estimated average cost of $291 per error, from 508 respondents who work with payroll at
  US-headquartered companies of 250 to 10,000 employees. Used as a **downstream symptom with a
  disclosed sample**, explicitly not as a measure of data quality. Consultancy survey, four years old
  at time of writing, and the per-error cost is modelled rather than measured. **[V]**
- The six properties of clean, the populated-versus-true distinction, the
  absence-as-argument reading, the four-line business case, and the
  detection-proposes/human-confirms discipline with its batch and reconciliation rules are original
  to this course.
- Builds on 101 M7 (the assist/decide line, which this module is the one substantial exception to),
  `ai301-hrbp-m5` (arriving with a model rather than a story), and Modules 1 and 2 of this track —
  reach, latency and reversibility from M1, and the narrow-scope rule that the counter-argument in
  *Take a position* turns against this module.
- **Horizontal note.** `ai301-comp-m3` (the craft layer) teaches reconciliation, audit files and
  documented joins for **one analysis on an extract**. This module's subject is the **source system
  and the pipelines between systems.** Neither owns reconciliation as a concept; the subjects don't
  overlap. Recorded so the two don't drift.
