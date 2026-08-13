# AI 301 · People Analytics · Module 4 — Measuring the AI transformation

**Course:** AI 301 · The Specialist — People Analytics track · Module 4 of 6
**Estimated time:** 45 min content · 10 min exercise · 35 min applied activity
**Prerequisite:** Modules 1–2 · the halt conditions get reused in the design
**Position in the track:** Layer 4 — evaluative design, and the unclaimed territory

> `Concepts reviewed: [DATE] · Examples current as of: [DATE]`
> Lessons 1 and 2 are **[V]** volatile: a live and fast-moving evidence base.

---

## Claim to contest — before you start

*Commit before you read anything.*

> **"Your company has an AI deployment running right now with no baseline, and nobody has asked you
> about it."**

**True of us, or not true of us?** Then name the deployment you're thinking of — and if you can't
name one, that is your first finding, because it means you don't know what is running.

You'll go and check during the activity. **This is the module where "go and check" most often turns
into a conversation you weren't previously in**, which is the point of it.

---

## Module brief

Your organization is spending money on AI. Somebody has promised a return. And **nobody has been
asked to measure whether it is happening**, not because the question is unimportant, but because
measuring the effect of an intervention on a workforce is a hard empirical problem and there is
exactly one function that does hard empirical problems about the workforce.

That is you, and this is the largest piece of unclaimed territory available to this role right now.

It is also the module where this track stops being defensive. Modules 2 and 3 are about what your
analysis isn't entitled to say. **This one is about a question your organization urgently needs
answered, that you can answer better than anyone else in the building, and that nobody has asked you
for.**

One warning up front, because it determines whether you get invited back. **The honest answer to
"has AI helped us?" is usually going to be "less than the deck said, and here's how we would know."**
If you aren't prepared to report that, don't claim the territory, a function that only reports
what the sponsor wanted has spent its Layer 5 standing to buy nothing.

## Learning objectives

By the end of this module you should be able to:

1. State what the current evidence says about AI's measured productivity effect, with samples `[V]`.
2. Explain why self-report isn't just weak evidence here but actively misleading `[V]`.
3. Design an evaluation using the units an HR function actually has — staggered rollout,
   encouragement, difference-in-differences.
4. Separate adoption, impact and displacement as three distinct measurements.
5. Decline a forecast honestly and substitute something you can support.

## Lesson 1 · The evidence gap, laid out cold **[V]**

Three findings. Read them together, because separately each one is arguable and together they are a
pattern.

**The developer trial.** METR, July 2025. Sixteen experienced open-source developers, 246 real tasks
in repositories they knew deeply, each task randomly assigned to AI-allowed or AI-disallowed.

- Beforehand, they forecast AI would make them **24% faster**.
- Afterward, they estimated it had made them **20% faster**.
- Measured, they were **19% slower**.

State the scope honestly, as the authors do: deeply-understood repositories are close to a worst case
for these tools, because the work requires bespoke output and the developer holds local knowledge the
model lacks. *(METR published an update in February 2026 changing their experiment design; treat the
specific figure as of its date.)* **The finding that transfers is not the 19%. It is the sign error**:
the gap between perceived and measured direction, in expert practitioners, on their own work.

**The firm-level picture.** A stratified survey of **more than 5,000 CFOs, CEOs and executives across
the US, UK, Germany and Australia** (Yotzov, Barrero, Bloom, Bunn, Davis, Foster and colleagues):

- Average productivity gain attributed to AI over the past three years: **0.29%**.
- **89% of firms report no productivity impact at all.**
- Firms forecast **1.4%** over the next three years.

The second number is the one to carry. **A 0.29% mean is not a small uniform gain. It is a near-zero
mass with a concentrated tail.** Most firms got nothing; a few got something real. Which is a
completely different management problem from "AI produces modest gains," and it is the problem your
organization actually has: *are we in the 11%, and how would we know?*

**The economy-level picture.** Humlum and Vestergaard, on Danish worker- and workplace-level data
(NBER w33777; revised and retitled — cite the current version). Denmark is a good test case: adoption
comparable to the US, a flexible labour market with low hiring and firing costs and decentralised
bargaining, so firms *could* adjust if there were something to adjust to.

- **Precise null effects on earnings and hours**, ruling out effects larger than **2%**.
- Users self-report average time savings of **2.8% of work hours**.
- RCTs in the same occupations document gains **exceeding 15%**.

**That last pair is the whole module in two numbers.** The controlled trials aren't wrong. The
15% is real *for the task studied, under trial conditions*. It arrives at the level of the worker as
2.8%, and at the level of the firm as approximately nothing, and every step of that attenuation is
a place your organization is currently not looking.

**What none of this establishes:** that AI doesn't work. **What it does establish:** that the effect
doesn't survive the trip from task to firm on its own, that the people experiencing it can't feel
its direction, and that anyone claiming a firm-level return without a design is claiming something
the best available evidence says is uncommon.

## Lesson 2 · Why self-report is worse than nothing **[V]**

Your organization is going to run a survey asking employees whether AI has made them more
productive. It may already have. You'll be asked to help.

**That survey does not measure productivity. It measures how AI feels**, and those move independently
— which isn't a hypothesis, it is METR's result. Sixteen expert practitioners, working on their own
code, couldn't detect a 19% slowdown; they reported the opposite sign. The 2.8%-versus-15% gap says
the same thing from the other end.

Why the perception runs high is worth understanding, because it tells you what your survey will
actually pick up. Using these tools **reduces the felt effort of starting**, removes the blank page,
and produces visible output quickly. All three are real experiences and none is throughput. Meanwhile
the costs are diffuse and unattributed: the review that took longer than writing it would have, the
subtly wrong thing that cost an hour on Thursday, the meeting spent reconciling two AI-drafted
documents that disagreed.

**So "worse than nothing" is precise, not rhetorical.** Nothing leaves you uncertain. A 71%-say-it-
helps result leaves you confident and wrong, it is quotable, it will appear in a board deck, and
**you'll be the function that produced it.** Module 1's warning about the durable wrong belief
applies with full force, and this is the most likely one your organization will acquire this year.

**What to do when you're asked for it**, because "don't run the survey" isn't available to you.
Run it, and **change what it claims to measure.** Ask about specific tasks and specific frequencies
rather than about productivity. Ask what people stopped doing. Ask where output goes next and who
reviews it. **Report it as adoption and experience data, labelled as such**, and never let the words
"productivity" or "ROI" attach to it. That is a defensible artifact, and it is the honest half of
Lesson 4's three measurements.

> ### Try this (4 minutes
> Find the most recent internal claim about AI's benefit at your company) a slide, a wiki page, an
> all-hands line. What is the evidence class: measured outcome, self-report, vendor projection, or
> anecdote? Most of them are the middle two.

## Lesson 3 · Designs that work with the units you have

You won't get a randomized controlled trial. You don't need one. **You need a comparison, and
your organization keeps producing them and throwing them away.**

**Staggered rollout — the one you almost certainly already have.** Licences went to one function
first. A region got early access. Pilot teams were chosen in March and everyone else got it in
September. **That is a natural experiment**, and the comparison was available for six months while
nobody preserved it.

The requirement is small and it is entirely about timing: **before the next wave, write down what you
will compare and take the baseline.** Not a study design: a measurement taken before a thing
happens. Module 2's staggered-adoption halt condition applies to the analysis afterward; this is the
one action that makes the analysis possible at all.

Say the uncomfortable part: **the reason pilots are not evaluated is rarely methodological.** It is
that the pilot group was selected (volunteers, enthusiasts, the team whose director asked) and
selected groups are where AI looks best. Which is the finding, not an obstacle to it.

**Encouragement designs, when you cannot withhold access.** You often can't; licences are
enterprise-wide and withholding a tool from a control group is a real ethical and practical problem.
So randomise **the encouragement** rather than the access: training invitations, onboarding sessions,
prompts to try a workflow. Everyone can use it; some are actively nudged. Take-up differs, and the
difference in outcomes across the randomised encouragement is an honest estimate. **This is the single
most underused design in HR** and it fits how AI rollouts actually happen.

**Difference-in-differences, with its assumption stated.** Where a group got something and another
didn't, and you have data before and after, compare the *changes* rather than the levels. The
assumption is parallel trends (that both groups would have moved together absent the intervention)
and it is an assumption, not a property. **Check the pre-period.** If the trends were already
diverging, DiD will hand you a confident number that is an artifact.

**And the ethics of the holdout**, plainly. Withholding something valuable is a real cost. Two things
make it defensible: you don't yet know it is valuable, which is the entire reason for the study; and
the holdout is usually a **delay** rather than a denial, since the second wave was coming anyway. What
isn't defensible is a permanent holdout for a tool you have already concluded works.

## Lesson 4 · Three measurements, not one

The distinction almost everyone collapses, and the sentence that earns your function its seat.

**Adoption.** Who is using it, how often, for what. Licence activations, weekly actives, task
coverage. Easy to measure, immediately available, and it is what every dashboard reports. **Adoption
is not impact and does not imply it.** A tool can be used daily and change nothing.

**Impact.** Did output, quality, speed or cost change. Hard, requires a comparison, and it is the
only one of the three that answers the question leadership thinks it is asking.

**Displacement.** What work went away, what work appeared, and who is doing it now. Almost nobody
measures this and it is where the organizational consequences live. Humlum and Vestergaard found
firms absorbing AI through **task reorganisation** (new work in content generation, AI oversight and
integration) rather than through hours or earnings. **The work moved. It did not vanish.** If you
only measure adoption and impact, you'll miss the fact that your review burden has quietly shifted
onto senior people, or that a junior task disappeared and took its training value with it. *(Which is
Module 3's apprenticeship problem, arriving with a measurement attached.)*

Three units, three timescales, three audiences. **A dashboard reporting licence activations has
measured none of them**, and saying so (with the alternative attached) is how this conversation
starts.

## Lesson 5 · Declining the forecast honestly

The question you'll be asked most in the next two years, and can least answer:

> *What will AI do to our headcount and our skills?*

It arrives looking like a forecasting question. It is mostly not one. There is **no base period** —
the technology, its capability and its cost have all moved inside any window you would fit on. The
**intervention is undefined** — "AI" isn't a treatment, and what you adopt next year is a choice
nobody has made. And **the outcome depends on decisions your leadership has not taken**, which makes
your forecast a prediction about their behaviour dressed as a prediction about technology.

Produce a number anyway and one of two things happens. It is wrong and your credibility pays. Or it
is right by luck and becomes the anchor for a headcount decision you didn't intend to make. **The
second is worse.**

**So decline, and the decline is only professional if something arrives with it.** Three things you
can support:

- **Exposure analysis.** Which roles contain tasks the technology can plausibly do, sized by hours
  rather than headcount. A statement about *tasks*, not about jobs, and the distinction is the whole
  honesty of it.
- **Scenario ranges with assumptions exposed.** Not a forecast, two or three futures with the
  decisions that produce each one written on the front, so leadership can see they are choosing
  rather than receiving.
- **A monitoring plan.** The leading indicators you'll actually watch, the cadence, and the
  threshold at which you would come back and say something changed. This is the one that converts a
  refusal into an ongoing engagement.

**The sentence, and it is the most professionally valuable one in this role:**

> *"I cannot answer that with what we have. Here's what I can support, and here's what would let me
> answer it properly."*

A function that never declines has told its organization that its findings mean nothing in
particular. **The decline is what gives the other findings their force.**

## Key takeaways

- **The largest unclaimed territory available to this role** is measuring the AI transformation your
  company is already paying for — and the honest answer is usually "less than the deck said."
- **The evidence, together** `[V]`: experts were **19% slower** while believing they were **20%
  faster**; **0.29%** average firm-level gain with **89% of firms reporting nothing**; and **precise
  nulls on earnings and hours** in Denmark, with **2.8% self-reported savings against 15%+ in RCTs.**
- **A 0.29% mean is a near-zero mass with a concentrated tail**, not a modest uniform gain. The
  question is *are we in the 11%, and how would we know.*
- **Self-report is worse than nothing.** It measures how AI feels, which moves independently of
  throughput, nothing leaves you uncertain; a confident wrong number gets into a board deck with your
  name on it. **If you must run it, change what it claims to measure** and label it adoption.
- **Your organization keeps producing natural experiments and throwing them away.** Staggered
  rollouts, regional sequencing, pilot cohorts. **Before the next wave, write down what you'll compare
  and take the baseline.**
- **Randomise the encouragement when you cannot withhold the access**: the most underused design in
  HR, and it fits how rollouts actually happen.
- **Adoption, impact and displacement are three measurements**, and displacement is where the
  organizational consequences live. **The work moved; it did not vanish.**
- **Decline the headcount forecast, and bring three things with you:** exposure analysis by task,
  scenario ranges with assumptions exposed, and a monitoring plan with a threshold.

## Take a position

**The claim:** *"A survey asking employees whether AI made them more productive is worse than not
measuring at all."*

The strongest counter-argument is that **this holds self-report to a standard nothing in this function
would survive.** Engagement, inclusion, manager effectiveness, psychological safety, intent to stay —
the entire listening programme is self-report, and this course's own track on it treats those as
legitimate measures with known limitations rather than as anti-evidence. Perceived productivity is a
real construct: it predicts adoption, retention of the tool, and willingness to invest effort in
learning it, all of which are things you need to know. **Refusing to collect it does not produce a
better number. It produces a decision made on vendor claims instead**, which is the only other
evidence in the room. On that view the module has confused *a bad proxy for productivity* with *a bad
measure of something else*, and the fix is labelling rather than abstention. Your position has to say
whether labelling is sufficient in an organization where the label will be dropped by the second
slide.

## Applied activity — "The measurement design"

**Time:** 35 minutes · **Submit:** the one-page design plus a 300–400 word write-up · **Graded against
the rubric below.** Score doesn't matter. Doing the work is where the learning lands.

**This is the artifact that gets you into a room you are not currently in.** Write it so it can be
sent, not so it can be graded.

**Step 1. Find the deployment (5 min).** An AI deployment **already underway** in your company —
running or committed, not hypothetical. A copilot licence rollout, a service-desk assistant, an
AI feature switched on inside a system you already own, a recruiting tool. Name the sponsor and what
they have promised, in their words if you can find them.

If you genuinely can't find one, **find out why you cannot**. That is a finding about your position
in the organization, and it is the most useful thing this activity could tell you.

**Step 2. The baseline (8 min).** What you would measure before, where the data lives, and **whether
you can still get it.** Be specific: the query, the report, the system. Then the honest part — **if
the baseline window has already passed, say so.** That is the single most common finding in this
activity and it is more valuable than a design built on a baseline you can't obtain.

**Step 3 — The design (10 min).** Which of Lesson 3's designs fits what actually happened (staggered
rollout, encouragement, difference-in-differences) and why. Name the comparison group and how it came
to exist. **If it was self-selected, say so and say what that does to the estimate.** Attach the halt
conditions from Module 2 that apply: staggered adoption, positivity, the estimand.

**Step 4. The three measurements (7 min).** One line each for **adoption**, **impact** and
**displacement**, with the metric and the source. Displacement is the one to spend the time on,
because it is the one nobody else will have thought about: what work went away, what appeared, and
who is doing it now.

**Step 5 — What would count as failure (5 min).** The result that would make you report that this
deployment isn't working. **If no result would produce that report, you have written a
justification, not an evaluation**, and Module 2's test applies here exactly as it did there.

Then the write-up: the sponsor's promise in their words and what would actually test it, whether the
baseline is still obtainable, the design and its weakest assumption, your answer on the opening claim,
your position on the module's claim with its counter-argument addressed, and (the honest one)
**whether you're willing to report the failure result if you get it, and what it would cost you.**

## Knowledge check — 8 questions

*Unlocks after the applied activity is submitted. Retakes are free and unlimited.*

**Q1.** What is the finding from the developer trial that transfers beyond software? `[V]`

- A. That AI tools slow experienced practitioners by roughly 19%
- B. The sign error, the gap between perceived and measured *direction*, in expert practitioners working on their own familiar work ✓
- C. That AI tools are least useful in codebases the developer knows well
- D. That practitioners overestimate AI benefits by about 4 percentage points

> **B.** A and C are true of that study and are scope-limited; the authors say so themselves. What
> generalises is that experts could not feel the direction of their own productivity change.

**Q2.** What does a 0.29% average firm-level productivity gain actually describe? `[V]`

- A. A small but broadly distributed improvement across most firms
- B. A near-zero mass with a concentrated tail — 89% of firms report no impact at all, and a few got something real ✓
- C. A measurement too noisy to interpret
- D. Gains offset by implementation costs in the same period

> **B.** Which is a different management problem from "modest gains," and it is the one your
> organization has: *are we in the 11%, and how would we know?*

**Q3.** How do you reconcile 15%+ gains in RCTs with precise nulls on earnings and hours? `[V]`

- A. The RCTs are methodologically flawed
- B. The effect is real for the task under trial conditions, arrives at the worker as ~2.8% of hours, and reaches the firm as approximately nothing — and each step of that attenuation is somewhere nobody is looking ✓
- C. Firms are capturing the gains as profit rather than passing them through
- D. The Danish labour market is too rigid to show the effect

> **B.** D is specifically wrong. Denmark was chosen because it is flexible, with low hiring and
> firing costs, so firms could adjust if there were something to adjust to.

**Q4.** Why is a "did AI make you more productive?" survey called worse than nothing? `[V]`

- A. Because response rates on AI surveys are typically too low to interpret
- B. Because nothing leaves you uncertain, while a confident wrong number is quotable, reaches a board deck, and carries your function's name ✓
- C. Because employees have incentives to overstate their AI usage
- D. Because perceived productivity can't be measured reliably

> **B.** It measures how AI feels (reduced felt effort of starting, no blank page, visible output
> quickly) all real experiences, none of them throughput.

**Q5.** What should you do when asked to run that survey anyway?

- A. Decline and explain the evidence
- B. Run it and report the results with a caveat about self-report
- C. Run it and change what it claims to measure (specific tasks and frequencies, what people stopped doing, where output goes next) reported as adoption and experience data, never as productivity or ROI ✓
- D. Run it alongside a productivity metric so the two can be compared

> **C.** "Do not run it" is not available to you. A is unavailable in practice and B leaves the label
> attached, which is what travels.

**Q6.** What is the requirement for using a staggered rollout as a natural experiment?

- A. Random assignment of which group goes first
- B. Writing down what you'll compare and taking the baseline *before* the next wave: a measurement taken before a thing happens, not a study design ✓
- C. A minimum of three rollout waves for statistical power
- D. Equivalent group sizes across waves

> **B.** And the reason pilots go unevaluated is rarely methodological: the pilot group was selected,
> selected groups are where AI looks best, and that is the finding rather than an obstacle to it.

**Q7.** Which of the three measurements is the module most concerned that nobody runs?

- A. Adoption, because licence data is often incomplete
- B. Impact, because it requires a comparison group
- C. Displacement — what work went away, what appeared, and who is doing it now, which is where the organizational consequences live ✓
- D. All three are equally neglected

> **C.** Firms absorb AI through task reorganisation rather than through hours or earnings. **The work
> moved; it did not vanish**, including onto senior reviewers, and out of the junior tasks that used
> to carry training value.

**Q8.** Why is the headcount-impact question not really a forecasting question?

- A. Because headcount decisions are made by leadership rather than by analytics
- B. Because there is no base period, the intervention is undefined, and the outcome depends on decisions leadership hasn't made, so a forecast is a prediction about their behaviour dressed as one about technology ✓
- C. Because the time horizon is too long for workforce planning models
- D. Because AI capability is improving faster than any model can incorporate

> **B.** And producing a number anyway risks the worse outcome: being right by luck and becoming the
> anchor for a headcount decision you did not intend to make.

## Sources and attribution

- **The measurement mandate, the three-measurement distinction, and the artifact-that-gets-you-in-a-room
  framing** come from a human-authored brief for this track.
- **The developer trial `[V]`:** METR, *Measuring the Impact of Early-2025 AI on Experienced
  Open-Source Developer Productivity*, July 2025 — 16 developers, 246 tasks, own repositories;
  forecast 24% faster, felt 20% faster, measured 19% slower. Authors' own scope caveat included.
  METR published a design update in February 2026; treat the figure as of its date.
- **The firm-level survey `[V]`:** Yotzov, Barrero, Bloom, Bunn, Davis, Foster *et al.* — stratified
  samples of 5,000+ CFOs, CEOs and executives across the US, UK, Germany and Australia. 0.29%
  realized gain over three years; 89% reporting no impact; 1.4% forecast.
- **The economy-level study `[V]`:** Humlum & Vestergaard, Danish worker- and workplace-level data,
  NBER w33777, precise null effects on earnings and hours ruling out effects above 2%; 2.8%
  self-reported time savings against RCT gains exceeding 15%; absorption via task reorganisation.
  Revised and retitled, cite the current version.
- The encouragement-design recommendation, the displacement measurement, and the
  decline-with-three-things pattern are original to this course.
- Builds on Module 1 (the durable wrong belief), Module 2 (halt conditions, and the test that an
  evaluation must be able to fail) and Module 3 (the apprenticeship problem, which displacement
  measurement makes visible).
