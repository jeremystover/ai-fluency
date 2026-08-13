# AI 401 · The Translator · Module 6 — Integration capacity

**Course:** AI 401 · The Translator · Module 6 of 10
**Estimated time:** 35 min content · 10 min exercise · 30 min applied activity
**Prerequisite:** Modules 2, 3 and 5 — the framework, the partner, and what the absorbers were holding
**Position in the course:** the counterintuitive core, and the whole of procurement

> `Concepts reviewed: [DATE] · Examples current as of: [DATE]`
> Lesson 4 is **[V]** volatile layer — vendor practice and the HR compliance surface move fast, and
> its legal edges carry a pointer to Module 9's counsel gate. Lessons 1–3 are stable and are the
> argument.

---

## Calibration prompt — before you start

*One claim. Commit before you read.*

> **"My organization could name the rate at which it can absorb change."**

**True of us, or not true of us?** One sentence. "We go as fast as we can" is a *no*, written
politely.

Then: **how many distinct process, tool, or workflow changes has your unit absorbed in the last
quarter?** A count. Include the small ones: a new template, a new approval step, a new tool
someone started using. People routinely undercount this by half, and the undercount is the module.

---

## Module brief

This is the module with the finding that makes people argue, so here it's in the first paragraph
where you can start disagreeing early:

> **Individual AI adoption can increase total coordination cost while decreasing production cost.**

Which means the enthusiastic early adopter, charging ahead independently and genuinely producing
more than everyone else, can be making the organization slower. Not because they are doing anything
wrong — because they are generating integration debt faster than the organization retires it.

That is uncomfortable in a specific way. Everything about our instincts says the person producing
more is helping, and everything about a People function's usual posture says you support the
enthusiast and worry about the laggards. **This module says the enthusiast is a governance question
and the laggards mostly are not.**

It also carries procurement, and the reason it lives here rather than in a module of its own is the
argument itself: **lock-in is integration debt with a contract attached.** Buying is a pace
decision. Once you see it that way, the vendor conversation changes shape.

**One thing this module is not.** 101 M3 taught you to read a vendor quote: per-seat versus
per-use, what "unlimited" means, the questions that expose a thin wrapper. That was the right
lesson and it isn't repeated here. **This is the layer above it:** not what the thing costs, but
what it does to your ability to change your mind.

## Learning objectives

By the end of this module you should be able to:

1. Explain why work speeds up at the edges and slows down where it comes together.
2. State the coordination-cost finding and defend it against the obvious objection.
3. Define your unit's integration capacity and name one thing currently exceeding it.
4. Treat switchability as an architectural property rather than a procurement footnote.
5. Slow down a high performer without punishing excellence.

## Lesson 1 · Faster at the edges, slower at the join

Watch what actually happens when a team adopts AI well.

**Outputs arrive in greater volume and take more effort to reconcile.** Four people produce four
analyses in the time one used to take. Someone still has to determine whether they agree, and that
someone is now doing four times the reconciliation with the same day.

**Decisions get made faster in isolation and take longer to stabilize when they collide.** Two
teams each reach a defensible conclusion quickly and independently. The conclusions are
incompatible. The time saved on both is spent, with interest, discovering that.

**And local optimization increases variation.** Each person, using their own tools in their own way
against their own understanding of the goal, produces something slightly differently shaped. There
was always variation; there's more of it now, because the constraint that used to suppress it (
the cost of producing anything at all) is gone.

**Variation is paid for in coordination.** That is the mechanism. Every increment of
difference between two people's outputs is an increment of work for whoever has to make them fit,
and that work is nobody's job, appears on no dashboard, and lands (as Module 5 established) on
the people with the least slack.

None of this is an argument against speed. It is an argument that **speed at the edges and speed
overall are different quantities**, and that most organizations are measuring the first and
assuming the second.

> ### Try this — 3 minutes
> Think about a piece of work in your unit that involved three or more people's outputs coming
> together in the last month. Estimate how long the *producing* took, and how long the
> *reconciling* took. Then ask which of those two numbers has changed in the last year, and in
> which direction. Most people find production halved and reconciliation grew, and that nobody
> has ever measured the second one.

## Lesson 2 · The finding, and the objection

Put the pieces together and you get the claim:

> **An organization has a maximum rate at which it can absorb individually-generated change, and
> almost nobody measures it.**

That rate is real, it's finite, and it's set by things you can actually name: how much
reconciliation capacity exists, how much slack the absorbers have, how many decisions can be
stabilized per cycle, how much variation the downstream can tolerate. Exceed it and the symptoms
are recognizable — rework, contradictory versions circulating, decisions that get made twice, a
growing queue of things that are *nearly* done, and people who are individually productive and
collectively frustrated.

**Now the objection, because it's a good one.** Isn't this just an argument for slowing down that
any incumbent could make about any improvement? Every organization that resisted anything has said
"we can't absorb that much change." The claim is unfalsifiable if you let it be, and it hands a
veto to whoever is least comfortable.

Three things separate this from that argument, and you should hold yourself to all three.

**It is a rate, not a limit.** Nobody is saying don't change. The claim is that change has a
throughput, and throughput can be measured, raised, and planned against. An organization that
invests in reconciliation capacity (shared definitions, better interfaces, actual integration
work) raises its own ceiling. That is a growth strategy, not a brake.

**It has to be stated as a number, in advance.** "We can't absorb that" said in the meeting where
someone proposes something is a veto. "Two process changes per quarter, agreed in January" is a
constraint that binds you as well as them, and it's the only version this course accepts. Module
2's tolerance step exists for this.

**And it has to be falsifiable.** If you exceed the rate and nothing bad happens, you were wrong
about the rate and you raise it. Name in advance what exceeding it would look like.

Which produces the honest answer to the speed-versus-risk question everyone asks at this altitude:

> **You do not trade speed against risk. You govern speed against absorption.**

Risk is what a compliance conversation is about, and Module 9 handles it. This is a different
question with a different unit, and conflating them is how a pace argument turns into a safety
argument that nobody believes.

## Lesson 3 · The early adopter problem

The specific case, because it's where this becomes a person rather than a principle.

Somebody in your organization is genuinely excellent at this. They have built tooling, they produce
more than their peers, they are visible and enthusiastic, and other people have started copying
them badly. Two things are true, and both matter:

**They are creating real value.** Not theoretically. Their output is better and there's more of it.

**And they are creating integration debt faster than the organization retires it.** Their outputs
arrive in a shape only they use. Their decisions get made ahead of the people who have to live with
them. The variation they introduce is absorbed downstream by people who have no idea why the shape
changed.

**The failure mode is treating this as a performance conversation.** It isn't one. Their
performance is excellent. Framing it as anything else is both wrong and (practically) the fastest
way to lose them, and losing them is worse than the debt.

What actually works is making the debt visible and shared. Three moves, in order:

**Name the two truths out loud, in that order.** The value first, specifically. Then the debt,
specifically: who is absorbing it, and what it's costing them. Not "you're moving too fast." *"You
produced eleven of these last quarter and the three people who consume them are each reformatting
by hand, which is about a day a week between them."*

**Make it their problem to solve, not yours.** The person who built the thing is the best-placed
person in the organization to make it consumable, and asking them to is a promotion in disguise
rather than a restraint. **The instruction "make this reusable by the three people downstream" is
the highest-leverage sentence available to you here**, and it converts an integration liability into
Module 7's codification asset.

**And be honest that the constraint might be wrong.** If the reconciliation capacity is the
bottleneck, the answer may be to raise it rather than slow them. Slowing the best performer to
protect a bad interface is how organizations preserve exactly the dysfunction Module 4 described.

## Lesson 4 · Procurement as architecture **[V]**

Now the buying decision, which is a pace decision.

> **Lock-in is integration debt with a contract attached.**

Once prompts, connectors, evaluation suites, and workflow logic live inside one platform, "we'll
move later" stops being a decision and becomes a quarter-long project. Nothing about that shows up
in the pricing conversation, and it's the single largest cost in most of these deals.

**So switchability is an architectural property, not a procurement footnote.** The question isn't
whether you could theoretically leave. It is what leaving would cost, expressed in the same units
as the purchase: how much of what you build inside this thing comes out, in what form, and who
would do the work.

**Four questions that slow a deal down, and should.** Each one is a signal rather than a
disqualification, but a vendor with no answer to any of them is telling you something.

**"What is the safe mode?"** Autonomy claims without guardrails are the current market's favorite
shape. Ask what the system does when it's unsure, what it does when a dependency fails, and what a
human sees at that moment. A vendor selling autonomy who can't describe the failure state is
selling the demo.

**"What is the accuracy and hallucination rate for our use cases?"** Not benchmark numbers. Yours,
on your data, measured how. The correct answer may honestly be *"we don't know, and here's how
we'd find out with you"* — that's a good answer. **"It is highly accurate" is not an answer**, and
101 M6 taught you why fluent output carries no signal about correctness.

**"Who owns this in year two?"** After the launch team moves on and the tickets keep arriving. This
is the question IT asks and People functions routinely can't answer about their own purchases, and
it's a fair question to be unable to answer only once.

**"What comes out, and in what form?"** The exit question, asked at the start, when you've
leverage. Prompts, configurations, evaluation data, logs, the model of your process that you
encoded. Ask for the export format in writing before you sign.

**And the HR-specific layer, which nobody else in the buying group will raise.**

Ask for **bias audit results**: the actual document, not the assurance. Ask about **adverse impact
testing by region**, because obligations differ by jurisdiction and a US-tested tool says nothing
about your European operations. And ask the question vendors reliably deflect:

> **Who holds liability when the system produces a discriminatory outcome?**

Listen carefully to the deflection, because the deflection is the information. The honest answer,
in most jurisdictions and under most contracts, is that **substantial exposure sits with you as the
deployer regardless of what the contract says**, which is Module 9's subject, carries a
counsel-review gate, and is the reason that module exists rather than being folded in here.

## Key takeaways

- **Work moves faster at the edges and slower where it comes together.** Outputs arrive in greater
  volume and take more effort to reconcile; decisions made faster in isolation take longer to
  stabilize when they collide.
- **Local optimization increases variation, and variation is paid for in coordination** — by
  whoever has the least slack.
- **Individual AI adoption can increase total coordination cost while decreasing production cost.**
- **An organization has a maximum rate at which it can absorb individually-generated change, and
  almost nobody measures it.** To be a discipline rather than a veto it must be a rate, stated in
  advance as a number, and falsifiable.
- **You do not trade speed against risk. You govern speed against absorption.** Risk is a different
  question with a different unit.
- **The early adopter is a governance question, not a performance conversation.** Name the value
  first and specifically, then the debt and who is absorbing it, then hand them the problem, because
  "make this reusable by the three people downstream" converts a liability into an asset.
- **Slowing the best performer to protect a bad interface preserves the dysfunction.** Sometimes the
  answer is to raise reconciliation capacity instead.
- **Lock-in is integration debt with a contract attached**, and switchability is an architectural
  property: what comes out, in what form, and who does the work.
- **Ask who holds liability for a discriminatory outcome, and listen to the deflection.** Substantial
  exposure sits with the deployer.

## Take a position

**The claim:** *"The person creating the most value in your organization this quarter may also be
creating the most debt, and both are true at once."*

The strongest counter-argument is that **absorption capacity is an excuse dressed as a discipline.**
Every organization that has ever failed to adopt something has explained that it couldn't absorb
the change, and this module hands that instinct a vocabulary, a metric, and a governance process.
The people who will use it most enthusiastically aren't the thoughtful integrators. They are the
ones who didn't want to move anyway, and who now have a defensible-sounding reason. **A rate stated
in advance is only a constraint on you if someone is willing to enforce it against you**, and in
most organizations nobody is.

Sharper still: the organizations that will win this decade may be exactly the ones that let
the early adopters run, ate the integration debt, and repaid it later out of a much larger base —
because integration debt, unlike technical debt, is often retired by the tools themselves within
two years. **On that reading, governing pace is optimizing for a coherence that will be free
shortly, at the cost of a lead that will not be.**

Your position has to say what would make you *raise* your unit's absorption rate rather than
enforce it, and what evidence would tell you your rate was set too low.

## Applied activity — "The absorption limit"

**Time:** 30 minutes · **Submit:** the limit, the exceedance, and the covering note · **Graded
against the rubric below.** Score doesn't matter. Doing the work is where the learning lands.

**Step 1. Count what you actually absorbed (8 min).** Your calibration answer was how many
distinct process, tool, or workflow changes your unit took on last quarter. **Go and count.** Look
at what actually changed: new templates, new approval steps, new tools people started using, new
reports, a changed definition. Include the ones nobody announced.

Then, for each one, mark whether it **landed** (is it in steady use) or whether it's still being
half-used, worked around, or quietly abandoned. **The ratio of landed to attempted is your real
absorption evidence**, and it's more informative than either number alone.

**Step 2 — State the limit (7 min).** Your unit's integration capacity, as a rate with a unit of
time. *N process changes per quarter. One tool change per half. One definition change per cycle.*
Whatever fits your unit's actual work.

Then the part that makes it a discipline rather than a veto: **what would tell you this rate is
wrong, in either direction?** Name one observation that would make you raise it and one that would
make you lower it.

**Step 3. Name one thing currently exceeding it (7 min).** Something live. What it is, who is
absorbing the reconciliation, and what it's costing them: in hours, rework, or delay, as
specifically as you can get.

**If the honest answer is that nothing is currently exceeding your limit**, say so and say what
that implies: you may have room to go faster, which is a finding this module is equally happy to
produce.

**Step 4 — Address it (5 min).** To whoever controls the pace for your unit, which may be you, a
peer, or someone two levels up. Predict their response in a sentence: **do they think the constraint
is real, and if not, what do they think you're actually asking for?**

**Step 5. The covering note (3 min).** 200–300 words. Predicted count against actual, with the
landed ratio. And your position on the module's claim, engaging the counter-argument that absorption
capacity is an excuse with a vocabulary.

## Knowledge check — 8 questions

*Unlocks after the applied activity is submitted. Retakes are free and unlimited.*

**Q1.** What is the module's counterintuitive core finding?

- A. AI adoption is slower in large organizations than small ones
- B. Individual AI adoption can increase total coordination cost while decreasing production cost ✓
- C. Coordination costs rise faster than production costs fall in most AI deployments
- D. Teams that adopt AI unevenly perform worse than teams that don't adopt it at all

> **B.** Which means the enthusiastic early adopter, genuinely producing more, can be making the
> organization slower — not by doing anything wrong, but by generating integration debt faster than
> it's retired.

**Q2.** Why does local optimization increase coordination cost?

- A. Because individuals choose tools their colleagues can't access
- B. Because it increases variation, and variation is paid for in coordination by whoever has the least slack ✓
- C. Because optimized processes are harder to document
- D. Because individual improvements are rarely shared across teams

> **B.** There was always variation; the constraint that suppressed it (the cost of producing
> anything at all) is gone.

**Q3.** What three conditions make an absorption rate a discipline rather than a veto?

- A. Executive approval, documentation, and quarterly review
- B. It is a rate rather than a limit; it's stated as a number in advance; and it's falsifiable ✓
- C. It is benchmarked externally, measured continuously, and owned by a named person
- D. It is agreed with affected teams, published, and revisited annually

> **B.** "We cannot absorb that," said in the meeting where something is proposed, is a veto. "Two
> process changes per quarter, agreed in January" binds you as well as them.

**Q4.** How does the module reframe the speed-versus-risk question?

- A. Speed and risk are both subordinate to quality
- B. You don't trade speed against risk. You govern speed against absorption ✓
- C. Risk should be assessed per use case rather than per pace decision
- D. Speed is a leadership choice; risk is a compliance one

> **B.** Risk is a different question with a different unit and belongs in Module 9. Conflating the
> two turns a pace argument into a safety argument nobody believes.

**Q5.** Why is the early adopter conversation not a performance conversation?

- A. Because performance conversations require a formal process
- B. Because their performance is genuinely excellent, framing it otherwise is both wrong and the fastest way to lose them ✓
- C. Because integration debt is an organizational failure rather than an individual one
- D. Because performance management is the manager's job rather than the translator's

> **B.** And losing them is worse than the debt. Name the value first and specifically, then the
> debt and who is absorbing it.

**Q6.** What does the module recommend doing with the early adopter's integration debt?

- A. Pausing their work until the organization catches up
- B. Assigning a coordinator to reconcile their outputs
- C. Handing them the problem — "make this reusable by the three people downstream" ✓
- D. Standardizing their tooling across the team

> **C.** They are the best-placed person to make it consumable, it reads as a promotion rather than
> a restraint, and it converts an integration liability into Module 7's codification asset.

**Q7.** What does "lock-in is integration debt with a contract attached" mean for procurement?

- A. That contract length should be minimized wherever possible
- B. That switchability is an architectural property (what comes out, in what form, and who does the work) rather than a procurement footnote ✓
- C. That multi-vendor strategies are safer than single-platform ones
- D. That pricing should be negotiated on a per-use basis

> **B.** Once prompts, connectors, evaluation suites, and workflow logic live inside one platform,
> "we'll move later" becomes a quarter-long project — and none of that appears in the pricing
> conversation.

**Q8.** What is the correct reading of a vendor deflecting the discriminatory-outcome liability question?

- A. That the vendor's legal team hasn't been consulted on the deal
- B. That liability is genuinely unsettled and will be determined case by case
- C. That the deflection is the information, substantial exposure sits with you as the deployer regardless of the contract ✓
- D. That the question should be raised with procurement rather than the vendor

> **C.** Which is Module 9's subject and why it carries a counsel-review gate rather than being
> folded in here.

## Sources and attribution

- The coordination-cost argument, the integration-capacity discipline and its three conditions, the
  speed-against-absorption reframe, the early-adopter sequence, and the switchability framing are
  original to this course.
- **Deliberately not repeated from 101 M3 Lesson 4:** reading a vendor quote, per-seat versus
  per-use pricing, and the questions that expose a thin wrapper. This module is the layer above,
  what a purchase does to your ability to change your mind. `[V]`
- The liability question and the deployer position are stated here as a procurement signal only.
  **The legal treatment, its jurisdictional differences, and the counsel-review gate are Module 9**,
  and no purchasing decision should rest on this lesson alone.
- Continues Module 5 (the absorbers are the reconciliation capacity this module says is finite)
  and supplies the pace constraint Module 10's thresholds are measured inside.
