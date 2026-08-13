# AI 301 · People Analytics · Module 1 — The Scarcity Stack

**Course:** AI 301 · The Specialist — People Analytics track · Module 1 of 6
**Estimated time:** 35 min content · 10 min exercise · 30 min applied activity
**Prerequisite:** AI 101 and AI 201 — plus the job. This assumes SQL, statistics, an HRIS, and
stakeholder scar tissue.
**Position in the track:** first, because the stack indexes every later module

> `Concepts reviewed: [DATE] · Examples current as of: [DATE]`
> Lesson 2 is **[V]** volatile: adoption figures, benchmark scores and published research move.

---

## Claim to contest — before you start

*Commit before you read anything. One line, thirty seconds.*

> **"Most of what your function publishes is description wearing explanation's clothes — and the
> people who used to need you for it do not need you anymore."**

**True of us, or not true of us?** Write the answer down, then write the one piece of evidence from
your own systems that would settle it.

You'll go and check during the activity. **If the evidence you have cannot settle it, that is a
finding**: say so and say why, and it scores the same as a resolved answer. It will happen more
than once in this track.

---

## Module brief

This is a 300-level course, which means it refuses to do the 100-level job. No explanation of what a
language model is, no prompting primer, no tour of a tool you would have opened yourself. It also
assumes something the other tracks don't: **that you already have the craft.** You can write the
query. You know what a confidence interval is. You have been burned by a stakeholder before.

So here's what this course refuses to be, said in its first paragraph: **it is not a course about
producing analysis faster.** That capability just stopped being scarce, and selling it to you would
be selling the thing that lost its value.

Your capability didn't change this year. **Everyone else's did.** An HRBP with a CSV now produces a
cut, a chart, a regression and a confident paragraph in an afternoon, and most of those paragraphs
are wrong in ways only you can see. Which is the problem, because being the only person who can see
it isn't the same as being the person anyone asks.

The scarce thing moved. It moved quietly, nobody sent a memo, and most analytics functions are still
competing on the layer that just went to zero.

## Learning objectives

By the end of this module you should be able to:

1. Name the five layers of the scarcity stack and say what each one is that production isn't.
2. Apply the test — *if analysis were free, would this still be scarce?* — to any deliverable.
3. State what the available evidence about the collapse does and doesn't establish `[V]`.
4. Reconcile the claim that analysis got cheap with the finding that measured productivity barely
   moved.
5. Run the three evidence questions on your own published work rather than on someone else's.

## Lesson 1 · The five layers

Every layer here's something a competent generalist with a good model **cannot** do. They are
ordered by how fast the layer below them is disappearing, and the test for each one is the same:

> **If analysis were free, would this still be scarce?**

**Layer 1. Production.** Running the query. Building the cut. Making the chart. Writing the
paragraph under it.

This is the layer that just went to zero, and it is where most of your function's hours and nearly
all of its job descriptions live. **It is in the stack so that it can be crossed out**, and crossing
it out is the only thing this module needs you to accept.

You'll want to argue. The argument will be that *your* production isn't generic. That it
requires knowing the HRIS, the quirks, the effective dating, which field lies. That is true and it is
a smaller moat than it feels like, because most of it is knowledge that can be written down once and
handed to a model, and the rest of it belongs to Layer 2 rather than to production. **The activity
will settle this better than an argument can:** you're going to take a real deliverable from last
quarter and try to reproduce it in thirty minutes.

Four layers survive. Each is a module.

**Layer 2 — Definitional authority.** What the metric *means*. Which denominator. Which population.
Which date basis. Whether an internal transfer is attrition. Whether a fixed-term end is a leaver.
Whether contractors count.

A model asked an attrition question resolves every one of those — **silently, plausibly, and
differently on Tuesday than it did on Monday.** Somebody has to have decided, and to be able to say
why, and to defend it when Finance uses a different number. That is a person with standing, not a
function call. *(Module 3.)*

**Layer 3. Methodological judgment.** Knowing when to stop. Which analysis shouldn't be run. Which
finding this data can't support. Which model shouldn't be built at all.

Purely subtractive, invisible when done well, and **the layer this whole track argues is now the core
of the job.** It is also the hardest to get credit for, because the deliverable is a number that
didn't get produced. *(Module 2.)*

**Layer 4. Evaluative design.** Knowing what would actually settle a question. What to compare
against. Whether a holdout is available. Whether the natural experiment already happened and nobody
kept the comparison. And the distinction almost everyone collapses: adoption, impact and displacement
are three separate measurements.

This is the layer with the most unclaimed territory attached to it right now, and Module 4 is about
going and taking it.

**Layer 5 — Accountable standing.** Being the person answerable for a claim about people: to a
regulator, a works council, or the individual the claim was about.

A model can't hold this. It isn't a capability question; it is a question about who can be asked
*why* and made to answer. This is the layer that converts methodological judgment into
organizational authority, and it is the reason the governance work in Module 5 belongs to you rather
than to Legal. *(Module 5.)*

**And above all five: trust.** Not a sixth layer — **the residual.** What accrues to a function that
holds the other four, and the last thing in this job to commoditize. You can't build it directly,
which is why Module 6 is about *claiming* it rather than constructing it.

**Read the stack and the module list side by side.** Layer 2 is Module 3, Layer 3 is Module 2, Layer
4 is Module 4, Layer 5 is Module 5. The stack and the course are the same object read twice, which
is either a good sign about the frame or a sign we arranged it that way, and you should decide which
by the end.

## Lesson 2 · What the evidence actually establishes **[V]**

This module is about to ask you to accept that a layer of your work has collapsed in value. So the
evidence for that has to be handled the way you would want your own evidence handled — which means
being explicit about what each piece establishes and what it doesn't.

**It does not establish a trend.** Nobody has measured the rate at which analytical production is
being displaced in this function, and the sources available can't carry that claim. **What they
establish is that it is possible**, and possible is enough, because you can test the rest yourself
in half an hour.

**Tier one, an existence proof.** Ludek Stehlík commoditizing an organizational network analysis
product in two or three hours. An existence proof needs no sample. It establishes that the thing can
be done, full stop, and that is the strongest form this particular evidence can take. **Read it as
an existence proof, never as a rate.**

**Tier two — an argument, labeled as one.** Cole Napper's case that analysis is collapsing as a
distinct capability. Engage with it as an argument, not as data.

And say the awkward part out loud, because this course is going to ask you to check whether your
sources are independent: **Napper and Stehlík co-author on causal inference in people analytics.**
Two names, one intellectual circle. That is closer to one source than to two, and a module that
didn't tell you would be failing its own test in its own opening.

**Tier three, the counterweight, which narrows the claim and makes it survivable.** On **DABstep**,
a benchmark of 450+ real multi-step data analysis tasks requiring reasoning across heterogeneous
documentation, **the best agents reach roughly 14.55% on the hardest tier.**

So the honest claim isn't *analysis is free.* It is:

> **Routine analysis is free. The hard tier is not, and the hard tier is not where your hours are.**

That is narrower, more defensible, and it argues *for* the stack rather than around it. The layers
above production are exactly the ones that make an analysis hard in the DABstep sense: knowing what
the question means, knowing what would settle it, knowing when to stop.

**Tier four — an indirect signal.** Insight222's finding that HR technology investment is migrating
away from dashboards and specialist analytics platforms toward AI. Subscription research; treat it
as directional and check the date on the version you can reach.

## Lesson 3 · The tension you will hit in Module 4, resolved now

There is a contradiction sitting in this course and it is better to walk into it deliberately.

This module says the cost of producing analysis collapsed. **Module 4 will show you that the measured
productivity effect of AI is close to nothing** `[V]`: about **0.29%** average firm-level gain over
three years across a survey of more than 5,000 executives in four countries, with **89% of firms
reporting no impact at all**, and a controlled trial in which experienced developers were **19%
slower** with AI while believing they were 20% faster.

Both are true. Hold them together and you get the most useful sentence in this course:

> **Production was never the bottleneck.**

If producing analysis had been the constraint on organizational performance, making it nearly free
would show up in output. It doesn't. Which is **evidence for the stack, not against it**: the value
was always in the layers above production, and nobody itemized them because nobody had to.

That yields a premise sharper and more uncomfortable than *you're about to be replaced*:

> **Your function is funded for the thing that just became free, and valued for things that were
> never written down.**

Nobody is coming to replace you. The risk is subtler: a budget conversation in which the visible
output looks reproducible and the invisible output has no name. **This course is substantially about
giving those four layers names, so that they can be argued for.**

> ### Try this — 3 minutes
> Take the last thing your team published. Ask: which layer was it *sold* on, and which layer did the
> work actually live in? If the answer is Layer 1 both times, that is today's finding.

## Lesson 4 · The three questions, pointed at you

You already know the teardown from AI 101 and from your own training: **what's the evidence, what's
the sample, what would falsify it.** You run it on vendors. You run it on the article somebody
forwarded. You have probably run it on a consultant.

**Turn it around.** Take the last finding your function published (the attrition insight, the
engagement driver, the manager-quality conclusion) and run all three on it.

- *What's the evidence?* Not the chart. The observation that supports the claim the chart was used
  to make.
- *What's the sample?* Who is in it, who is out, and who selected themselves out by leaving before
  you measured.
- *What would falsify it?* If you can't answer this one, the finding wasn't a finding. It was a
  description with a causal verb in it.

Most practitioners find this uncomfortable in a specific way: **the standard they apply to incoming
evidence is higher than the standard their own output would survive.** That isn't hypocrisy, it is
structural — nobody audits you, so the audit never happened.

**And now the same move on the field itself.** Go looking for a primary source on whether people
analytics functions improve organizational decisions, or whether deploying an attrition model reduces
attrition. Ten minutes is enough.

What comes back is vendor maturity models, practitioner posts, and self-reported case studies.
**The evidence base about people analytics is worse than the evidence base people analytics demands
of everyone else.**

That isn't a cheap shot and it isn't an argument that the work doesn't matter. It is the reason
this course starts here rather than with a capability tour, because a function whose standing rests
on methodological rigor has an unexamined exception, and the exception is itself.

## Key takeaways

- **Five layers, and the test is one sentence:** if analysis were free, would this still be scarce?
- **Layer 1, production, is in the stack so it can be crossed out.** It is where the hours and the
  job descriptions are, and it is the layer that went to zero.
- **The four that survive:** definitional authority (what the metric means), methodological judgment
  (when to stop), evaluative design (what would settle it), accountable standing (who answers for a
  claim about people). **Trust is the residual, not a sixth layer.**
- **The evidence establishes possible, not a rate** `[V]`: an existence proof, an argument from
  authors who co-author with each other, and a benchmark counterweight. **DABstep's ~14.55% on the
  hardest tier** narrows the claim to the one worth defending: **routine analysis is free, the hard
  tier is not, and the hard tier is not where your hours are.**
- **Production was never the bottleneck** `[V]`. That is why making it free produced ~0.29% average
  firm-level gain with 89% of firms reporting nothing — and it is evidence *for* the stack.
- **The real risk is not replacement.** It is being funded for the thing that just became free and
  valued for things nobody wrote down.
- **The three questions cut hardest when pointed inward**, and the field's evidence about itself
  wouldn't survive them.

## Take a position

**The claim:** *"Production was never the bottleneck, so making it free changes your job description
without changing your output."*

The strongest counter-argument is that **this underrates production as the path to everything
above it.** The four surviving layers aren't learned in a seminar; they are learned by building
things and being wrong in front of people. Definitional authority comes from having discovered the
hard way that the transfer rule breaks the denominator. Methodological judgment comes from having
run the analysis that fell apart. **If production is where the judgment was manufactured, then
automating it does not free the higher layers. It starves them**, on a delay long enough that nobody
attributes the damage correctly. On that view the stack describes a static snapshot of value and
misses the pipeline that produces it, and the right response is to protect some production work
deliberately rather than to celebrate its disappearance. Your position has to say whether the stack
survives that, and if it does, what replaces the apprenticeship. *(Module 3 comes back to this and
doesn't fully solve it.)*

## Applied activity — "The function, scored"

**Time:** 30 minutes · **Submit:** the reproduction result, the scored stack, and a 300–400 word
write-up · **Graded against the rubric below.** Score doesn't matter. Doing the work is where the
learning lands.

**Step 1 — The reproduction, and do this first (12 min, timed).** Take **one real deliverable your
team produced last quarter**: a recurring report, a cut, an analysis with a conclusion. Give a model
whatever context it needs about your data structure, **without moving restricted data**; a schema, a
column dictionary and synthetic or aggregate rows are enough, and 101 M4's tiers still apply.

**Set a timer for thirty minutes and try to reproduce it.** Then record three things: how far it got,
**where exactly it broke**, and which layer that break belongs to.

This is the whole activity. Everything else is bookkeeping. You're generating an existence proof on
your own data, which is worth more than any citation in Lesson 2, and **where it broke is the single
most informative sentence you'll write in this module.** If it broke on a definitional question,
that is Layer 2 and it is your moat. If it broke because the model didn't know which field lies,
write down whether that is genuinely unwriteable or merely unwritten.

**Step 2 — Score the function (8 min).** Across last quarter's output, estimate the share of your
team's hours that sat in each of the five layers. Rough is fine; honest is required. Then name
**the single capability you would lose least by giving up**, and if that is hard, notice that the
difficulty is itself the finding.

**Step 3. Check the claim (5 min).** Go back to the claim you contested before Lesson 1. What
evidence from your own systems settles it? Publication counts by layer, requester lists, the ratio of
recurring to bespoke work. **If your evidence cannot settle it, say so and say what you would need
to.** That scores in full.

**Step 4 — The two questions (5 min).** Answered honestly, because they set up Module 6:

- What percentage of your team's hours went to things a competent generalist with a good model could
  now produce?
- **Make the strongest case your organization would notice if your team vanished on Monday. Then make
  the case against.**

Then the write-up: where the reproduction broke and which layer that is, your scored stack, the
capability you would give up, your answer on the claim, your position on the module's claim with its
counter-argument addressed, and (the honest one) **whether the case against your team is stronger
than you expected it to be.**

## Knowledge check — 8 questions

*Unlocks after the applied activity is submitted. Retakes are free and unlimited.*

**Q1.** What is the test that sorts a capability into the scarcity stack?

- A. Whether it requires domain knowledge of the HRIS
- B. If analysis were free, would this still be scarce? ✓
- C. Whether a model can perform it today at acceptable accuracy
- D. Whether it appears in the function's job descriptions

> **B.** C is the tempting one and it is a moving target that dates instantly; the stack is built on
> what remains scarce under an assumption, not on a current capability snapshot.

**Q2.** Why is production included in the stack at all, if it has collapsed in value?

- A. Because some production work remains too specialized to automate
- B. So that it can be crossed out. It is where the hours and the job descriptions sit, and naming it is what makes the other four layers visible ✓
- C. Because it is the foundation the other layers are built on
- D. Because production quality still differentiates strong analytics functions

> **B.** C is the module's own counter-argument and it is a serious one, see the position you took.
> But its role *in the stack* is to be the layer that goes.

**Q3.** Which layer is trust?

- A. The fifth layer, above accountable standing
- B. The first layer, since nothing else works without it
- C. Not a layer — the residual that accrues to a function holding the other four ✓
- D. A precondition that has to be established before the stack applies

> **C.** Which is why Module 6 is about claiming it rather than building it. You cannot work on
> trust directly; you can only work on the things that produce it.

**Q4.** What does the available evidence for the collapse actually establish? `[V]`

- A. The rate at which analytical production is being displaced in HR
- B. That it is possible: an existence proof plus an argument, and neither supports a claim about rate or breadth ✓
- C. That most analytics functions have already lost the production layer
- D. That AI outperforms human analysts on people data

> **B.** And the module says out loud that its two practitioner sources co-author with each other,
> which makes them closer to one source than two.

**Q5.** How does DABstep's ~14.55% on the hardest tier change the module's claim? `[V]`

- A. It contradicts the claim, since agents perform poorly on real analysis
- B. It narrows it usefully: routine analysis is free, the hard tier isn't, and the hard tier isn't where your hours are ✓
- C. It shows the benchmark is poorly designed for business analysis
- D. It suggests the collapse is two or three years away rather than current

> **B.** The counterweight makes the claim survivable instead of weakening it, and the tasks agents
> fail on are precisely the ones requiring the upper layers.

**Q6.** How do you reconcile "analysis got cheap" with a ~0.29% average firm-level productivity gain? `[V]`

- A. The productivity gains are real but take longer than three years to appear
- B. Production was never the bottleneck — so making it free changes the job description without changing firm output, which is evidence for the stack ✓
- C. The survey measured the wrong firms
- D. Analysis didn't actually get cheap; the existence proofs are unrepresentative

> **B.** With **89% of firms reporting no impact at all**, the average is a near-zero mass with a
> concentrated tail, not a small uniform gain.

**Q7.** What is the risk the module says you actually face?

- A. Being replaced by a model that produces analysis
- B. Being funded for the thing that just became free and valued for things nobody wrote down ✓
- C. Producing analysis faster than the organization can absorb it
- D. Losing methodological rigor as tooling improves

> **B.** Subtler and more likely than replacement, a budget conversation in which the visible output
> looks reproducible and the invisible output has no name.

**Q8.** What happens when the three evidence questions are pointed at the people analytics field itself?

- A. The field's evidence base is comparable to adjacent management disciplines
- B. It holds up on efficacy but not on ethics
- C. The evidence base about people analytics is worse than the one people analytics demands of everyone else, mostly vendor maturity models and self-reported case studies ✓
- D. There is strong evidence for analytics maturity models and weak evidence for predictive models

> **C.** Checkable in ten minutes, which is why the module asks you to check rather than asserting
> it. A function whose standing rests on rigor has an unexamined exception, and it is itself.

## Sources and attribution

- **The scarcity stack, the "if analysis were free" test, and the production-was-never-the-bottleneck
  resolution** are original to this course, built on a human-authored brief whose framing they follow.
- **The collapse-of-analysis argument `[V]`:** Cole Napper; and Napper & Stehlík on causal inference
  in people analytics. Cited as argument. **The two authors co-author, and the lesson says so.**
- **The ONA existence proof `[V]`:** Ludek Stehlík. Cited as an existence proof only.
- **DABstep `[V]`:** a benchmark of 450+ real multi-step data analysis tasks over heterogeneous
  documentation; best agents ~14.55% on the hardest tier.
- **Firm-level productivity `[V]`:** Yotzov, Barrero, Bloom, Bunn, Davis, Foster *et al.* — stratified
  survey of 5,000+ CFOs, CEOs and executives across the US, UK, Germany and Australia. ~0.29%
  realized gain over three years; 89% of firms reporting no impact; 1.4% forecast for the next three.
  Detail in Module 4.
- **The developer RCT `[V]`:** METR, July 2025 — 16 experienced open-source developers, 246 tasks in
  repositories they knew well; 19% slower with AI, believing they were 20% faster. Scope caveat and
  the authors' own reading in Module 4.
- **Technology investment migration `[V]`:** Insight222. Subscription research; directional.
- Builds on 101 M4 (data tiers, which govern Step 1), 101 M6 (confident wrongness) and comp M2's
  teardown, which this module inverts rather than repeats.
