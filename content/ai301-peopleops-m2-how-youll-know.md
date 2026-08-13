# AI 301 · People Ops & HR Technology · Module 2 — How you'll know

**Course:** AI 301 · The Specialist — People Ops & HR Technology track · Module 2 of 8
**Estimated time:** 30 min content · 10 min exercise · 25 min applied activity
**Prerequisite:** Module 1 (you measure a decision from your register) · extends 201 M7 (measurement
without theatre)
**Position in the track:** the module that has to come before the enablement review, because you
can't design a pilot until you know what you would measure

> `Concepts reviewed: [DATE] · Examples current as of: [DATE]`
> Lessons 2, 3 and 4 are **volatile layer** — a named implementation case, a survey figure, and two
> research trials. The four baseline numbers, the rework-detector argument and the kill condition
> are stable.

---

## Calibration prompt — the claim to contest

*Commit before you read anything. Thirty seconds.*

**The claim:** *"You have never measured whether any AI deployment in your function actually
worked."*

Not whether it launched. Not whether people use it. Whether it made anything better, against a
number you wrote down beforehand.

**Is that true of your organization?** *True of us* or *not true of us*, and the one sentence you
would defend it with.

**And a number you'll check:** of the AI capabilities you inventoried in Module 1, **how many had
a baseline recorded before they were switched on?**

If the answer is zero, this module is the most useful thirty minutes in the track. If it isn't
zero, you're in a small minority and the module will tell you what to do next.

---

## Module brief

There is a reason this module sits at two rather than at seven.

Measurement is normally taught as a retrospective. You built the thing, now prove it worked. That
ordering is why almost nobody manages it, because **the most important measurement in any deployment
is taken before the deployment exists**, and by the time you're asked to prove value, the
opportunity has passed permanently. You can't go back and observe the before.

This module is also the one where your function has an advantage nobody else in People has, and it
is worth being blunt about it. When the talent team says they can't measure whether their AI
sourcing tool helped, that is often genuinely true — the outcome is a hire quality signal that
arrives in eighteen months, confounded by six other things. **When you say it, it means you did not.**
You own the ticket system, the system logs, the transaction volumes, the cycle times, the case
categories. The instruments are already installed and pointed at the right things.

So the module does four things. It tells you which four numbers to save before you touch anything.
It shows you, using the most-cited HR AI implementation in the world, what happens when you measure
adoption instead of experience. It gives you a rework detector nobody else in the function has. And
it ends on the artifact that separates a pilot from an installation: **a written condition under
which you would turn the thing off.**

## Learning objectives

By the end of this module you should be able to:

1. Record a baseline that is usable later (a named query, a stated population, a date) and explain
   why one taken after enablement isn't a baseline.
2. Distinguish activity metrics from change metrics, and name the leading indicator that survives
   mandatory adoption.
3. Explain where a deployment's rework actually lands `[V]` and why your queue detects it first.
4. Argue why **task scope rather than technology** determines whether a deployment works `[V]`.
5. Write a kill condition with all four parts, and test whether it could fire while a sponsor still
   wants the project.

## Lesson 1 · You already own the instruments

Start with what a baseline actually is, because the word is used loosely enough to be useless.

A baseline is **a named query or report, run against a stated population, on a stated date, and
saved somewhere you'll find it in six months.** "We know roughly what our ticket volume runs at"
isn't a baseline. It is a memory, and memories reshape themselves around outcomes, after a
deployment everyone remembers the before as worse than it was, uniformly and sincerely.

The timing rule is absolute and it is where most attempts fail:

> **A baseline taken after you switch something on is not a baseline. It is a measurement of the new
> state.**

There is no recovery from missing it. Every other mistake in this track can be fixed later; this one
can't, which is why it is the first lesson of the second module rather than a footnote in the
eighth.

**The four numbers.** If you do nothing else, save these before any enablement. They take under an
hour and they are the four you'll wish you had:

1. **Volume.** Cases, tickets, transactions, or requests per week for the affected process.
2. **Cycle time.** Time from arrival to resolution, and separately, **time to first response**,
   because those two move independently and conflating them hides the interesting result.
3. **The repeat rate.** How often the same person comes back about the same thing. Reopens,
   duplicates, follow-ups. This is the number that detects a wrong answer, and almost nobody
   captures it.
4. **The top five categories by count.** What people actually contact you about. If a deployment
   changes the *mix* rather than the volume, that is the most important thing that happened and it is
   invisible without this.

Two notes on doing it honestly. **Save the query, not the answer** — a number without the query that
produced it can't be re-run, and a baseline you can't re-run identically is a number you'll
argue about rather than compare against. And **write down the population**, because the temptation
six months later is to compare against a slightly different denominator that happens to flatter the
result. That isn't fraud. It is what happens to everybody who didn't write it down.

> ### Try this — 3 minutes
> Pick the decision you chose in Module 1. Can you produce, right now, the current weekly volume and
> the repeat rate for the process it sits in: from a query, not from memory? If yes, you have a
> baseline and most people do not. If no, you have found this module's homework, and it is an hour of
> work rather than a project.

## Lesson 2 · Engagement is not change **[V]**

Now the failure mode, and the best-documented case in the field happens to be the industry's
favourite success story.

Logins, sessions, queries served, "adoption rate". These are **activity metrics**. They move when
people use a thing. They don't move when a thing helps, and critically **they also move when a
thing is compulsory**, which is why they are the metrics that survive a bad deployment.

IBM's AskHR is the most cited HR AI implementation there is, and its early history is the reason
this lesson exists. The assistant launched in 2017 as a technical change, and **almost nobody used
it** — the capability was there and the behaviour wasn't. So in 2018 the company required it: more
than 20,000 employees were told to use the assistant rather than contacting HR directly.

Adoption, measured as usage, went to essentially everyone. On an adoption dashboard, that year is a
triumph.

**HR's customer satisfaction score went from +19 before the mandate to −35 within the first year.**

A fifty-four point collapse, and here's the part that matters for you: **the only reason anyone
knows it happened is that IBM was already measuring satisfaction before the mandate.** With
adoption metrics alone (and adoption metrics are what almost every deployment reports) that year
is indistinguishable from success. Usage up, tickets to HR down, cost per interaction down. The
experience of four hundred thousand interactions got materially worse and every number on the
project's dashboard improved.

The rest of the story is why the case is worth teaching rather than just citing. IBM didn't
abandon it. They went back to what employees actually wanted, rebuilt around the end user rather
than around the HR team's desire to eliminate busywork, and satisfaction recovered into the +80s.
Today the company reports AskHR settling roughly **94% of routine requests**, a **75% reduction in
tickets since 2016**, and about **40% lower HR operating cost over four years**, with the residual
— the complex and ethical calls, still landing with people.

Two things follow, and the second one is about our own honesty.

**The most-cited HR AI success in the world is also a documented fifty-four-point satisfaction
failure, and both facts come from the same company.** The failure was recoverable because it was
detected. It was detected because somebody had a baseline on a metric that measured experience
rather than usage.

And **the labelling, applied to a number that flatters our argument.** The 94%, the 75%, the 40% are
IBM's own figures and haven't been independently audited, the same standard this curriculum
applies to IBM's widely-repeated attrition-savings claim, which it treats as unverifiable rather
than false. The satisfaction collapse is *also* self-reported, and self-reporting a failure is the
more credible direction to self-report in, which is why the −35 is the number this module leans on.

**Which produces the leading indicator.** If usage is mandatory, usage tells you nothing. The
question that survives is:

> **Do people come back when they have a choice?**

**Self-initiated repeat use** is the cheapest available proxy for "this actually helped," because it
is a revealed preference rather than a reported one. Voluntary return, measured on a population that
could have gone elsewhere, is worth more than any satisfaction survey you would run — and it is
precisely the signal a mandate destroys your ability to read.

## Lesson 3 · The rework tax, and where it lands **[V]**

The second thing your dashboard won't show you is the work your deployment created somewhere else.

The general finding is well evidenced. In a large multi-country study of digital workers, the
substantial majority reported AI saving them on the order of **eleven hours a week**, while only
about **13%** said their organization was performing significantly better as a result, and the same
research measured an average **6.4 hours a week of "botsitting"**: feeding context, supervising
output, debugging what went wrong, and cleaning up downstream.

The HRBP track measures that on your own desk, and that is the right frame for someone auditing
their own workflow. **Your version is different and worse, because a deployment you run relocates
rework onto people who are not you.** The employee who has to ask twice. The manager who rewrites
the AI-drafted letter. The coordinator who corrects the record afterwards. None of that appears in
your project's numbers. All of it appears in **your queue.**

Which is the advantage hiding in the problem:

> **Your ticket queue is the rework detector for the entire function's AI, and you're the only
> person who can read it.**

Repeat contacts on the same issue, reopened cases, and tickets that begin "the system told me…" are
the leading edge of somebody's deployment failing, often a deployment in another team that reports
its own metrics as healthy. You see it first, and typically nobody has asked you.

Making that readable costs almost nothing and has to be done in advance:

- **One tag for AI-involved contacts.** Applied from the day before enablement, not retrofitted.
- **One tag for repeat contact on the same issue.** Your existing reopen flag may not catch a person
  who opens a fresh ticket rather than reopening the old one, and that is the common case.
- **A weekly count of both, next to the baseline volume** from Lesson 1.

Two honest caveats. This measures *contacts*, not experience — someone who got a wrong answer and
gave up never appears, which is the same structural blindness Module 4 is about. And being the
person who can demonstrate that another team's AI is generating rework is a **political** problem
rather than a measurement one. It is real, it isn't solved by better data, and Module 8 is where it
gets addressed.

## Lesson 4 · Scope is the variable, not technology **[V]**

The last reason deployments fail their evaluation is that the evaluation could never have succeeded,
because the thing was scoped too broadly to be measurable.

The clearest evidence available comes from two randomized trials of AI coaching that reached
opposite conclusions.

The **2022 trial** gave an AI chatbot a narrow, structured job: move a person through a defined
goal-attainment protocol. On that outcome the AI coach performed comparably to human coaches.

The **2026 trial** removed the guardrails and put an AI coach in the seat a human coach normally
occupies: open-ended development work with predominantly middle and senior managers in a global
corporation, N=114. It found no significant improvement over control on its primary outcomes.

Same class of technology, four years apart, opposite results. **The variable that changed was task
scope.** And the detail that makes it trustworthy: one of the researchers on the 2022 positive study
co-authored the 2026 null result. That is self-correction, and it is the standard this course is
asking you to hold your own deployments to.

For a configurer, the operational reading is a rule about how to design the thing in the first
place:

> **Narrow the scope until it works, rather than widening it until it fails.**

This is the opposite of how vendor pilots are usually shaped, and the reason isn't cynicism. A
narrow pilot is unimpressive to demonstrate (*it answers one category of question about carryover
balances*) while a broad one is exciting and, not coincidentally, unfalsifiable. **A scope wide
enough to be impressive is usually wide enough that no result can disconfirm it.**

The test to apply before you enable anything, and it is two questions:

1. **What is the single task?** Stated narrowly enough that a person could say whether it was done.
2. **What would failure look like on it?** If you can't describe a specific observable outcome that
   would mean this didn't work, the scope is too wide and no amount of measurement discipline will
   rescue it.

## Lesson 5 · The kill condition

Which brings us to the artifact, and to the sentence that distinguishes the two things this module
is about.

> **A deployment without a written condition under which you would turn it off is not a pilot. It is
> an installation.**

"Pilot" is the most over-claimed word in enterprise technology. It implies a decision point, and
most pilots don't contain one. They contain a launch, a period of enthusiasm, and an absorption
into normal operations that nobody ever formally approved.

A real kill condition has four parts, and the fourth is the one people skip:

**A threshold.** A number, not a feeling. *If the repeat rate on tagged contacts exceeds 15% in any
two consecutive weeks.* Thresholds you can't compute from Lesson 1's four numbers aren't
thresholds, they are sentiments — which is why the baseline comes first.

**A date.** When it gets checked, on a calendar, before anyone is invested. "We'll keep an eye on
it" isn't a date and won't survive a busy month.

**A named person who checks it.** Module 1 established why this is a person rather than a team. The
same reasoning applies harder here, because the check is a small unpleasant task and unpleasant
tasks assigned to teams don't happen.

**A rollback somebody has already performed.** Not a documented rollback: a performed one. In a
sandbox if that is all you have, but performed, by a named person, with the time it took written
down. **An untested rollback is a hope**, and Module 1 already told you why: reversibility is a
property you design beforehand, not one you discover under pressure.

Then the test for whether yours is real, and it is uncomfortable by design:

> **Could this condition fire while the project's sponsor still wants the project?**

If the honest answer is no (if the threshold is set where it would only trip in a scenario so bad
that everyone would already agree) then you haven't written a kill condition. You have written a
review date with a number attached to it.

And the timing, which is the reason this is Module 2 and not Module 8: **kill conditions are almost
free to write before anyone is invested and nearly impossible to write afterwards.** Every week
between the decision and the launch makes the sentence harder to get agreed. Write it into the
enablement decision, which is where Module 3 is going.

## Key takeaways

- **A baseline is a named query, a stated population, and a date, saved.** Not a memory; memories
  reshape around outcomes. And **a baseline taken after enablement is not a baseline** — it is the
  only mistake in this track with no recovery.
- **Four numbers, under an hour, before anything is switched on:** volume, cycle time (with time to
  first response separated out), the repeat rate, and the top five categories by count. Save the
  query, not just the answer.
- **You have no excuse and other functions often do.** You own the ticket system, the logs, the
  transaction volumes and the cycle times. When you say a deployment can't be measured, it means it
  wasn't.
- **Activity metrics survive bad deployments, and they also survive mandates** `[V]`. IBM's AskHR
  went to near-universal usage by requirement in 2018 and HR's satisfaction fell from **+19 to −35
  within the first year**, visible only because a pre-mandate baseline existed on a metric that
  measured experience rather than usage. It recovered to the +80s after a rebuild centred on
  employees, and now reportedly settles ~94% of routine requests. Both facts are the same company's,
  and the success figures are unaudited self-report.
- **Self-initiated repeat use is the leading indicator.** If usage is mandatory, usage tells you
  nothing; voluntary return is a revealed preference and the cheapest honest proxy for "it helped."
- **A deployment relocates rework onto people who are not you** `[V]`, and your queue is the
  function's rework detector. Tag AI-involved contacts and repeat contacts *before* enablement.
- **Scope, not technology, decides whether it works** `[V]`. Narrow the scope until it works rather
  than widening it until it fails: a scope wide enough to impress is usually wide enough that no
  result can disconfirm it.
- **A kill condition has four parts** — a computable threshold, a date, a named checker, and a
  rollback somebody has actually performed. **An untested rollback is a hope.** The test: could it
  fire while the sponsor still wants the project?

## Take a position

**The claim:** *"A deployment without a written kill condition isn't a pilot. It is an installation
with optimistic paperwork."*

The strongest counter-argument is that **kill conditions are theatre in most organizations, and
writing one you know will not be honoured is worse than writing none.** By the time a threshold
trips, the vendor has been paid, the announcement has gone out, employees have been trained, the
sponsor's credibility is attached to the thing, and the person who would have to invoke the
condition reports to somebody who doesn't want it invoked. The organizational cost of reversing a
visible deployment exceeds almost any threshold you would realistically write, so what the document
actually produces is a false sense of control plus a governance artifact the project can point at
when challenged.

On that view the honest alternative isn't a better kill condition but **reversibility by design**,
scope so small, on a population so contained, for a window so short, that stopping is a non-event
rather than a reversal requiring courage. Make it cheap to stop and you won't need permission to
stop.

Your position has to say whether the kill condition survives that critique or whether
reversibility-by-design simply replaces it, and notice that the counter-argument is built out of
Module 1's own rule that reversibility is the gate. If you want to keep both, you have to explain
what the written condition adds once the deployment is already cheap to reverse.

## Applied activity — "The evaluation plan"

**Time:** 25 minutes · **Submit:** the plan, the baseline data, and a 300–400 word write-up ·
**Graded against the rubric below.** Score doesn't matter. Doing the work is where the learning
lands.

For the decision you chose in Module 1 — and if an AI capability is already live on it, all the
better, because a retrospective baseline is the honest hard case.

**Step 1. The four numbers (10 min).** Volume, cycle time and time to first response, the repeat
rate, and the top five categories by count. **Submit the actual numbers and the query or report that
produced each one**, not a description of where they could be found. If a number is genuinely
unavailable, say which one, why, and what would have to change. That is a finding, not a gap.

**Step 2 — The change metric (5 min).** One metric that would move if this got better and wouldn't
move merely because people used it. State how you would compute it, from which system, and what
counts as a meaningful move. Then name the activity metric you're *not* going to report, and why,
naming the one you're declining is the graded part.

**Step 3. The rework check (3 min).** How you'll detect rework landing on somebody else: the tag,
the field, or the query. And who reads it weekly.

**Step 4 — The kill condition (5 min).** All four parts: threshold computable from Step 1, date,
named person, and the rollback, including whether anyone has performed it and how long it took. If
nobody has, say so and name when they will.

**Step 5. Score the prediction.** Your predicted count of capabilities with a pre-enablement
baseline against what you found. Direction and size of the miss, and one sentence on what it says.

Then the write-up: your position on the claim above with its counter-argument addressed
specifically; whether the opening claim turned out to be true of your organization and what settled
it; and the honest question — **would your kill condition fire while your sponsor still wanted the
project?** If not, rewrite it once and say what you changed.

## Knowledge check — 8 questions

*Unlocks after the applied activity is submitted. Retakes are free and unlimited.*

**Q1.** Why does the module place measurement at position two rather than at the end of the track?

- A. Because measurement is the easiest topic and belongs early
- B. Because the most important measurement is taken before the deployment exists, and once it is live the opportunity to observe the before has passed permanently ✓
- C. Because the enablement review in Module 3 is optional
- D. Because baselines take longer to collect than other module activities

> **B.** Every other mistake in the track is fixable later. A missing baseline is not, which is why
> it is the second module's first lesson rather than the eighth module's footnote.

**Q2.** What distinguishes a baseline from a remembered number?

- A. A baseline is expressed as a percentage rather than a count
- B. A baseline is approved by a manager before use
- C. A baseline is a named query against a stated population on a stated date, saved so it can be re-run identically ✓
- D. A baseline covers at least twelve months of history

> **C.** Save the query, not just the answer, and write down the population — otherwise the
> comparison six months later uses a slightly different denominator that happens to flatter the
> result. That is what happens to everyone who did not write it down.

**Q3.** What did IBM's 2018 AskHR mandate demonstrate about activity metrics? `[V]`

- A. That mandating adoption is an effective way to drive behaviour change
- B. That usage went to near-universal while HR satisfaction fell from +19 to −35, so every project-dashboard number improved while the experience got materially worse ✓
- C. That chatbots are unsuitable for HR service delivery
- D. That satisfaction scores are unreliable in HR contexts

> **B.** And the collapse was only visible because a pre-mandate baseline existed on a metric
> measuring experience rather than usage. IBM rebuilt around employees and satisfaction recovered
> into the +80s, which is why the case is worth teaching rather than just citing.

**Q4.** Why is self-initiated repeat use the leading indicator this module recommends?

- A. Because it is easier to measure than satisfaction
- B. Because it is a revealed preference on a population that could have gone elsewhere, and it is exactly the signal a mandate destroys your ability to read ✓
- C. Because vendors report it as standard
- D. Because it correlates with cost per interaction

> **B.** If usage is compulsory, usage tells you nothing. Voluntary return is worth more than any
> satisfaction survey because nobody is reporting an attitude; they are choosing to come back.

**Q5.** Where does the rework created by a deployment you run actually land? `[V]`

- A. On the deployment team, as botsitting
- B. Nowhere measurable, which is why it can be discounted
- C. On employees, managers and coordinators — none of which appears in the project's numbers, and all of which appears in your queue ✓
- D. On the vendor, under the support agreement

> **C.** A is the HRBP track's version, correctly aimed at someone auditing their own workflow.
> Yours relocates onto people who are not you, which makes your ticket queue the function's rework
> detector, and you're the only person who can read it.

**Q6.** What did the two AI coaching trials establish? `[V]`

- A. That AI coaching doesn't work
- B. That newer models perform worse than earlier ones on coaching tasks
- C. That the same class of technology produced opposite results four years apart, and the variable that changed was task scope rather than the technology ✓
- D. That human coaches outperform AI on every measured outcome

> **C.** The 2022 trial gave the AI a narrow structured goal-attainment protocol and it performed
> comparably to human coaches; the 2026 trial removed the guardrails for open-ended development work
> and found no significant benefit. One researcher co-authored both, which is what makes the pair
> trustworthy.

**Q7.** Why does a broadly scoped pilot tend to be unfalsifiable?

- A. Because broad pilots involve more stakeholders who disagree about success
- B. Because a scope wide enough to be impressive is usually wide enough that no specific observable outcome could disconfirm it ✓
- C. Because broad pilots take longer than the evaluation window allows
- D. Because vendors refuse to define success criteria for large deployments

> **B.** Which is why the design rule runs the other way: narrow the scope until it works, rather
> than widening it until it fails. The two questions are what is the single task, and what would
> failure look like on it.

**Q8.** Which part of a kill condition does the module say people most often skip?

- A. The threshold, because it requires a baseline
- B. The date, because calendars slip
- C. The named person, because teams are easier to assign
- D. A rollback somebody has actually performed, not a documented one, a performed one, with the time it took written down ✓

> **D.** An untested rollback is a hope. And the test for whether the whole condition is real is
> whether it could fire while the sponsor still wants the project; if not, it is a review date with
> a number attached.

## Sources and attribution

- **IBM AskHR** — the 2017 launch with near-zero voluntary use, the 2018 mandate covering more than
  20,000 employees, HR's customer satisfaction moving from +19 to −35 within the first year, the
  recovery into the +80s after rebuilding around employee needs, and the current reported figures of
  ~94% of routine requests settled, ~75% fewer tickets since 2016, and ~40% lower HR operating cost
  over four years. Reported via IBM's CHRO in trade and business press. **All of these are the
  company's own figures and none has been independently audited**, the same standard this
  curriculum applies to IBM's widely-repeated attrition-savings claim in `ai301-hrbp-m3`, which it
  treats as unverifiable rather than false. The satisfaction collapse is the figure this module leans
  on, because self-reporting a failure is the more credible direction. **[V]**
- **Glean, *The Work AI Index 2026***, the ~11 hours perceived weekly saving, the ~13%
  organizational performance figure, and the 6.4-hours-per-week botsitting measurement (n≈6,000
  digital workers across the US, UK and Australia, fielded December 2025 – January 2026). Phrasing
  aligned with `ai301-hrbp-m3`, which uses the same source, so the two don't drift. **[V]**
- **de Haan, Terblanche & Nowack**, *Human Resource Development International* (2026) — the
  randomized controlled comparison of human and AI chatbot coaching, N=114, predominantly middle and
  senior managers in one global corporation; and **Terblanche et al. (2022)** on
  goal-attainment-specific chatbot coaching, co-authored by one of the same researchers. Phrasing
  aligned with `ai301-hrbp-m7`, which reads the same pair as an allocation question; this module
  reads it as a scoping question. **[V]**
- The four baseline numbers, the queue-as-rework-detector argument, the narrow-until-it-works design
  rule, and the four-part kill condition with the sponsor test are original to this course.
- Builds on 201 M7 (measurement without theatre, extended from a personal workflow to a population
  deployment) and Module 1 of this track (reversibility as the gate, which the counter-argument in
  *Take a position* turns against this module's own artifact).
