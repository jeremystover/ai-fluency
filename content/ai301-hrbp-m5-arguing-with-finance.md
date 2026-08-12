# AI 301 · HRBP · Module 5 — Arguing with finance

**Course:** AI 301 · The Specialist — HRBP track · Module 5 of 7
**Estimated time:** 40 min content · 10 min exercise · 25–30 min applied activity
**Prerequisite:** Module 2 (the quadrants tell you which case is worth building) · Module 3 (the audit is the baseline)
**Position in the track:** the module that converts your judgment into something a CFO can act on

> `Concepts reviewed: [DATE] · Examples current as of: [DATE]`
> Lesson 3's data-foundation material is **[V]**. The modelling discipline is stable.

---

## Calibration prompt — before you start

*One prediction, thirty seconds.*

In the applied activity you'll build a real cost model. Before you do:

**What does one regretted departure cost your organization, for a mid-level role in your unit?**
One number, in whole currency units. Gut estimate, no arithmetic.

Then you'll build it properly and find out how far off you were — in whichever direction, which
is itself informative.

---

## Module brief

Here is a scene every HRBP recognizes. You have watched a team for eighteen months. You know
which manager is quietly driving people out, you know the reorg created a layer that does
nothing, and you know the open req has been unfilled so long the team has stopped asking. You
say so in a planning meeting, carefully, with the nuance the situation deserves.

Finance says: *"What would that cost us?"*

And you don't have a number. So the conversation moves on to something that does have one.

**HRBPs lose these arguments because they arrive with a story and Finance arrives with a model.**
Not because the story is wrong — it's usually more accurate than the model — but because a story
and a model are not the same kind of object, and only one of them can be argued with in the
language the room is speaking. A model can be challenged, adjusted, and agreed. A story can only
be believed or not, and belief is a weak instrument against a spreadsheet.

This module is about arriving with a model. Three you should be able to build, roughly, on
demand. Then the two things that make most first attempts worse than useless: the data
foundation problem, and small numbers.

That last part matters more than the modelling. **AI has made it trivially easy to produce a
confident model from bad inputs**, and a confident wrong number in front of a CFO does more
damage to your credibility than having no number at all. You get one of those.

## Learning objectives

By the end of this module you should be able to:

1. Explain why a story loses to a model in a budget conversation, independent of which is more
   accurate.
2. Build rough, defensible versions of three models: regretted attrition cost, the cost of an
   unnecessary layer, and time-to-fill against plan.
3. Identify the specific ways your own organization's HR data lies, and account for them out
   loud.
4. Recognize when your population is too small to support the claim you're making, and say so
   before someone else does.
5. Name your own weakest assumption first — and explain why that is a strength move rather than
   a concession.

## Lesson 1 · Story versus model

A story says: *"That team is struggling and we're going to lose people."*

A model says: *"That team has lost four of eleven people in fourteen months. At a fully loaded
replacement cost of roughly 40% of salary for these roles, that's about £180k already spent. Two
more are at elevated risk on the indicators we track. The intervention costs £15k and eight weeks
of my time."*

Both may be true. Only the second one can be argued with — and being arguable is the property
that gets a thing taken seriously in a budget conversation. Finance is not being obtuse when they
ask for a number; they are asking you to convert a claim into a form where it can be compared to
the eleven other claims on the same money.

Three things follow.

**Rough beats absent, by a wide margin.** An estimate with stated assumptions is a contribution.
"I don't have that" is a withdrawal from the conversation. Finance works with estimates
constantly and is entirely comfortable with them — what they are not comfortable with is a number
whose provenance is invisible.

**The assumptions are the argument, not the answer.** When your model gets challenged, it will be
challenged on inputs — the replacement cost multiplier, the risk indicator, the productivity
ramp. That is the conversation you want, because it means the shape of your reasoning has been
accepted and only the parameters are in dispute. A story never reaches that stage.

**Precision is not credibility.** £183,472 is less believable than "roughly £180k, and here's the
multiplier I used." False precision reads as either naivety or concealment, and both cost you.

## Lesson 2 · Three models to carry

Rough, defensible, buildable in an hour. You are not producing an actuarial estimate; you are
producing something with a visible skeleton.

**1. Cost of regretted attrition.** Fully loaded replacement cost per departure — recruitment
spend, hiring manager and interviewer time, onboarding, and the productivity ramp until the
replacement reaches full contribution — multiplied by regretted departures over a period. The
input that carries most of the weight and gets the least scrutiny is the ramp: the months a
replacement takes to reach the output of the person who left. For a complex role that number is
often two to three times larger than everything else in the model combined, and most published
per-hire figures quietly omit it.

**2. The cost of the extra layer.** Fully loaded cost of the layer's people, plus the tax it
imposes: additional approval steps, decision latency, and the meeting load it generates across
everyone beneath it. The second half is where the real number lives and where you'll be
challenged hardest, so keep it conservative — a defensible small number survives, an aggressive
large one gets discarded along with the rest of your case.

**3. Time-to-fill against plan.** Revenue or output attributable to the role, divided across the
period, multiplied by the vacancy duration beyond plan. This is the most persuasive of the three
in commercial functions and the most dangerous, because attributing revenue to a single role
invites exactly the challenge you'd expect. Use a share, state it, and let it be argued with.

For all three: **AI is genuinely good at building the skeleton and genuinely bad at supplying the
inputs.** Ask it to structure the model, name the variables you've forgotten, and produce the
sensitivity table. Supply the numbers yourself, from your systems, with their provenance
recorded — which is exactly what Lesson 3 is about.

## Lesson 3 · The foundation problem **[V]**

The reason most HR business cases collapse is not modelling. It is that the underlying data
doesn't mean what the model assumes it means.

The general version, from practitioners who have watched it repeatedly: **this is a data problem,
not a technology problem** — most HR teams cannot train or ground AI on the information it would
need, and you cannot put AI on top of a shaky foundation and get a sound answer out.

The HRBP-specific version is sharper, and it is the reason *you* have to be in this loop:

**"Regretted" is flagged by whoever closed the requisition.** Sometimes the manager who caused
the departure. That field is a judgment recorded under pressure by an interested party, and every
attrition model in your organization rests on it.

**Ratings drift by function.** A 3 in engineering and a 3 in sales frequently do not describe the
same performance, because calibration norms diverged years ago and nobody re-baselined. Any model
comparing across functions inherits the drift silently.

**Tenure and start dates lie after acquisitions and system migrations.** Bulk-loaded populations
carry the migration date, not the real one.

**Exit-interview data is systematically polite.** People leaving preserve their references. The
stated reason is a lower bound on the real one.

You are frequently the only person who knows all of this. A People Analytics team knows the
schema; Finance knows the ledger; **you know that the field means something different than it
says**, and that knowledge is the actual value you bring to a modelling conversation.

Which produces the rule this module is built around: **AI on bad HR data produces confident
garbage at speed — and confident garbage in front of a CFO is worse than no model at all.** A
missing number costs you one conversation. A wrong number that gets repeated, and then corrected
by someone else three weeks later, costs you the next five.

> ### Try this — 3 minutes
> Pick one HR field you'd use in a model — regretted flag, performance rating, tenure, exit
> reason. Write one sentence on how it's actually populated in your organization, and one on how
> that differs from what its name implies. If you can't answer the first, you've found this
> week's most useful question for your HRIS or analytics partner.

## Lesson 4 · Small numbers

Your unit is ninety people. The team you're worried about is six.

Nearly every population you reason about is small enough that ordinary variation looks like
signal, and this is the single most common way an HRBP produces confident garbage. Three
departures from a six-person team is either a crisis or a coincidence, and the data cannot tell
you which — but a model built on it will produce a number to three decimal places regardless, and
AI will help you produce it faster.

Three defences, none of which require statistics you don't have.

**State the n, always, in the sentence with the finding.** "Three of six" is honest; "50%
attrition" is technically identical and rhetorically dishonest, because percentages imply a
population that supports them. If the denominator would embarrass you, that is information.

**Ask what a coincidence would look like.** If the same number could plausibly arise from ordinary
variation, say so before you're asked. Volunteering the limitation is the single strongest
credibility move available in a room like this, and it costs you almost nothing — because
everyone competent already knows.

**Prefer direction and mechanism to magnitude.** With small numbers you can often defend "this is
happening and here's the mechanism" when you cannot defend "it is happening at rate X." Argue the
part you can hold.

And the honest limit, worth saying plainly: **sometimes the right answer is that your population
cannot support a quantified claim at all.** Then your contribution is the qualitative case, made
explicitly as such — which is a different and more defensible thing than a quantitative case built
on six people.

## Key takeaways

- **A story and a model are different objects.** Only a model can be argued with, and being
  arguable is what gets a claim taken seriously against eleven competing claims on the same money.
- **Rough beats absent; the assumptions are the argument; precision is not credibility.** Getting
  challenged on your multiplier means your reasoning was accepted and only the parameters are in
  dispute — that's the conversation you wanted.
- **Three models to carry:** regretted attrition (the productivity ramp is the hidden bulk), the
  extra layer (the decision tax is where the real number lives — keep it conservative), and
  time-to-fill against plan (most persuasive, most attackable).
- **AI builds skeletons well and supplies inputs badly.** Use it for structure, variables you
  forgot, and sensitivity tables. Supply the numbers yourself.
- **Your HR data lies in specific, knowable ways** `[V]` — regretted flags set by interested
  parties, ratings drift across functions, migration-corrupted tenure, polite exit data. You are
  usually the only person who knows all of it, and that is your actual contribution.
- **Small numbers demand the n in the sentence, a stated coincidence test, and direction over
  magnitude.** Sometimes the honest answer is that the population can't support a quantified
  claim, and saying so is stronger than manufacturing one.

## Take a position

**The claim:** *"An HRBP who can't build a defensible cost model is an advisor to the business in
title only — the judgment doesn't count if it can't enter the conversation where resources are
decided."*

The strongest counter-argument is not that models are hard. It is that **influence in most
organizations runs through relationships, timing, and trust rather than through analysis** — many
of the most effective HRBPs have never built a model, and win their arguments by being the person
whose read on a situation has been right before. On that view, modelling is one instrument among
several and this module overstates its centrality.

## Applied activity — "One case, stress-tested"

**Time:** 25–30 minutes · **Submit:** the model plus a 250–350 word write-up · **Graded against
the rubric below.** Score doesn't matter. Doing the work is where the learning lands.

**Step 1 — Pick a real argument (3 min).** Something you actually want and haven't got: a
retention intervention, a role, a structural change, a program. It must be real and currently
unresolved.

**Step 2 — Build the model (12 min).** One of the three, adapted. Show every input, its source,
and its provenance. Use AI for the skeleton, the variables you'd have missed, and the sensitivity
table — and say in your submission where you used it and where you didn't.

**Step 3 — Interrogate your data (5 min).** For each input drawn from an HR system: how is that
field actually populated, and how does that differ from what its name implies? Name at least one
input you don't fully trust, and what you did about it.

**Step 4 — Name your weakest assumption, first (5 min).** The one a hostile reader would attack.
State it, state the range it could plausibly take, and show what happens to your conclusion at
the unfavourable end. **If the conclusion doesn't survive, say so** — a case that fails its own
sensitivity test and is reported honestly scores higher here than one that passes because it was
never tested.

**Step 5 — Score the prediction (2 min).** Your gut cost-per-regretted-departure against your
built figure. Direction and size of the miss.

Then the write-up: the case in three sentences as you'd say it out loud, your position on the
claim above with its counter-argument addressed, and the one input you'd most want to improve
before taking this into a real room.

## Knowledge check — 8 questions

*Unlocks after the applied activity is submitted. Retakes are free and unlimited.*

**Q1.** Why does a story lose to a model in a budget conversation, even when the story is more accurate?

- A. Finance leaders are trained to distrust qualitative input
- B. A model can be challenged, adjusted, and agreed — it converts a claim into a form comparable against competing claims on the same money ✓
- C. Stories take longer to present than models
- D. Models are more likely to be correct than practitioner judgment

> **B.** Being arguable is the property that matters. A story can only be believed or not, and
> belief is a weak instrument against a spreadsheet. D is explicitly not the claim — the story is
> often more accurate.

**Q2.** Your attrition model gets challenged on the replacement-cost multiplier you used. What has actually happened?

- A. The model failed and should be rebuilt with defensible inputs
- B. Finance is signalling they won't fund the request
- C. The shape of your reasoning was accepted and only the parameters are in dispute — which is the conversation you wanted ✓
- D. You presented with too much precision and invited scrutiny

> **C.** Getting to a parameter argument means the model was taken seriously. That stage doesn't
> exist for a story, which is the entire point of bringing one.

**Q3.** In a regretted-attrition model, which input typically carries the most weight and receives the least scrutiny?

- A. Recruitment agency fees
- B. Interviewer and hiring manager time
- C. Onboarding and training cost
- D. The productivity ramp — months until a replacement reaches the departed person's output ✓

> **D.** For complex roles it often exceeds everything else combined, and most published
> per-hire figures omit it entirely. Which means a model that includes it explicitly is more
> defensible than one citing a headline industry number.

**Q4.** Why is the "regretted" flag in your HRIS specifically unreliable? `[V]`

- A. It's usually left blank by default
- B. It's set by whoever closed the requisition — sometimes the manager who caused the departure, recording a judgment under pressure as an interested party ✓
- C. Different HRIS vendors define it differently
- D. It's a lagging indicator that only updates quarterly

> **B.** A judgment field populated by a party with an interest in the answer — and every
> attrition model in the organization rests on it. Knowing this about your own systems is the
> contribution an HRBP makes that neither analytics nor Finance can.

**Q5.** Three of six people have left a team in a year. What does the module recommend?

- A. Report it as 50% attrition, which is the accurate rate
- B. Exclude the team from analysis, since the population is too small
- C. State "three of six," volunteer the coincidence test before being asked, and argue direction and mechanism rather than magnitude ✓
- D. Combine it with similar teams to reach a defensible sample

> **C.** "50% attrition" is arithmetically identical and rhetorically dishonest, because
> percentages imply a supporting population. Volunteering the limitation is the strongest
> credibility move available and costs nothing — everyone competent already knows.

**Q6.** What does the module mean by "confident garbage in front of a CFO is worse than no model at all"?

- A. CFOs prefer qualitative arguments from HR partners
- B. A missing number costs one conversation; a wrong number that gets repeated and then corrected by someone else costs the next five ✓
- C. Financial models require certification that HR business partners don't hold
- D. AI-assisted models are inherently less reliable than manual ones

> **B.** The asymmetry is about credibility over time, not about any single meeting. D misstates
> it — the danger isn't AI assistance, it's AI assistance on inputs that don't mean what the
> model assumes.

**Q7.** Where should AI be used in building these models, and where not?

- A. For the inputs, since it can access market benchmark data
- B. Nowhere — financial modelling requires human construction throughout
- C. For structure, forgotten variables, and sensitivity tables; not for supplying the numbers, which come from your systems with recorded provenance ✓
- D. For the final narrative only, after the model is complete

> **C.** Skeleton-building is genuinely what it's good at; input-supply is where the foundation
> problem bites. A is the specific trap — invented benchmarks are confident, plausible, and
> exactly what Module 3's teardown exists to catch.

**Q8.** Why does the activity ask you to name your weakest assumption first?

- A. To demonstrate humility to the reader
- B. Because a hostile reader will find it anyway, and naming it first converts an attack into a stated limitation — and a case that fails its own sensitivity test, reported honestly, is worth more than one that passes untested ✓
- C. Because sensitivity analysis is required in financial submissions
- D. To reduce the number of questions asked in the meeting

> **B.** It's a strength move, not a concession: you keep control of the framing and you learn
> whether your conclusion is robust. A submission that discovers its case doesn't survive is a
> success for this module.

## Sources and attribution

- The data-foundation argument — that this is a data problem rather than a technology problem,
  and that AI cannot be laid over a shaky foundation — follows Jason Averbook's published
  analysis of HR AI readiness. **[V]**
- The three models, the HR-data-lies inventory (regretted flags, rating drift, migration-corrupted
  tenure, polite exit data), the small-numbers defences, and the name-your-weakest-assumption-first
  discipline are original to this course.
- Builds on 101 M6 (confident wrongness), 101 M3 (sizing), and 201 M7 (measurement without
  theater).
