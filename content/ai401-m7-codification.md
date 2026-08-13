# AI 401 · The Translator · Module 7 — Codification

**Course:** AI 401 · The Translator · Module 7 of 10
**Estimated time:** 25 min content · 10 min exercise · 30 min applied activity
**Prerequisite:** Module 6 — the early adopter's debt is this module's raw material
**Position in the course:** the last module before the one it sets up

> `Concepts reviewed: [DATE] · Examples current as of: [DATE]`
> Lesson 3 is **[V]** volatile layer and its evidence is weak on purpose — the lesson says so
> rather than dressing vendor material as research. Everything else is stable.

---

## Calibration prompt — before you start

*One claim. Commit before you read.*

> **"There is a place where what my team has learned about using AI is written down, and someone
> maintains it."**

**True of us, or not true of us?** Both halves have to be true. A shared folder nobody has touched
in four months is a *no*.

Then: **what proportion of your team could find it in under two minutes if you asked them right
now?** A percentage. You're going to check this by asking, and the gap between "it exists" and
"people can find it" is most of this module.

---

## Module brief

**First, what this module is not, because you've met its neighbours.**

AI 201 M2 taught you the context pack, reusable material that gives a model the standing
information it needs so you stop re-explaining your world every session. AI 201 M7 taught library
hygiene: a personal review cadence so your own packs and prompts don't rot. Both were correct and
neither is repeated here.

**This module is about the collective version, and it's a genuinely different problem.** Your
personal library serves one person with consistent taste, a shared memory of why each item exists,
and an obvious owner. A team's shared practice has none of those. It serves people with different
work and different standards, it contains items whose rationale nobody remembers, and its owner is
usually "whoever set it up," which isn't an owner.

The gap the module exists to close:

> **Individual learning velocity rose sharply. Collective learning velocity did not move.**

Everyone in your organization is getting better at this, fast, in parallel, in private. Almost none
of what they learn reaches anyone else. And the thing most organizations reach for (training)
can't fix it, for a structural reason worth saying plainly.

## Learning objectives

By the end of this module you should be able to:

1. Explain why individual and collective learning velocity came apart.
2. Say why one-time training can't build habits for a technology that changes every few weeks.
3. Distinguish codification from documentation, and name the test that separates them.
4. Design the codification of one trapped practice, including who maintains it.
5. State what codification restores and what it doesn't.

## Lesson 1 · Two velocities

**Individual learning velocity is up, dramatically.** A person who wants to get better at using
these tools has an unusually good environment for it: immediate feedback, zero cost to experiment,
a tutor available at any hour, and a peer group posting techniques constantly. People are learning
in weeks what would have taken a year to learn about a previous technology.

**Collective learning velocity has not moved at all.** The organization knows almost nothing more
than it did, because the mechanisms by which an organization learns (documentation, training,
process, the transmission of practice between people) run at the speed they always ran at.

**And the standard mechanism has a structural problem, not an execution problem.** One-time
training builds a habit against a fixed target. It works for a system that will behave the same way
next year. It can't build durable habits for a technology whose capabilities change every few
weeks — because the specific technique you taught in March is partly obsolete by July, and the
learner has no way to know which part.

This is worth being precise about, because it's often heard as "training doesn't work," which is
both wrong and unhelpful. Training works. **The half-life of what it transmits got much shorter,
and the delivery cadence did not change to match.** A curriculum designed for annual delivery
against a quarterly-changing subject will be wrong more often than it's right, and (this is the
damaging part) **it will be confidently wrong, in a room, to people who then repeat it.**

> ### Try this — 3 minutes
> Think of the single most useful thing you personally learned about working with these tools in
> the last three months. Now ask: **how many people in your organization know it?** If the answer
> is "the two people I mentioned it to," you've just measured the gap between the two velocities
> in your own behavior, and you're the person in your organization most likely to be trying to
> close it.

## Lesson 2 · Codification isn't documentation

Prompt fluency is necessary and insufficient. The value shows up when individual practice becomes
**collective capability**, and that transition has three parts:

**Codified into shared artifacts.** The practice exists outside the person who developed it, in a
form someone else can use without a conversation.

**Measured through workflow telemetry.** You can tell whether it's being used, and whether the
work it touches is better. Not a satisfaction score, usage and outcome on the actual workflow.

**Circulated through tracked cycles.** There is a rhythm by which new practice enters and stale
practice leaves, and somebody is accountable for it running.

Miss any of the three and discoveries stay trapped with individuals, which means **collective
learning depends on individual memory and goodwill — neither of which scales, and neither of which
survives a resignation.**

**Now the distinction that does the most work here.**

> **Codification is not documentation. Documentation nobody maintains is a fossil of a practice —
> and it's worse than nothing, because it looks like coverage.**

A fossil actively costs you. Someone finds it, uses it, gets a worse result than the current
practice would have given, and concludes the shared library isn't worth checking. You've spent
your one chance at that person's attention. **A stale shared prompt is more expensive than an empty
folder**, because an empty folder tells the truth.

So the test that separates the two isn't about quality or completeness. It is:

> **Who removes things, and when did they last do it?**

Ask that about any shared library in your organization. The answer is almost always nobody and
never, and it tells you what you're looking at.

**Three properties of a codified artifact that survives.** It has a **named maintainer**, not a
team. It has a **decay condition**: a statement of what would make it wrong, which is Module 2's
trigger applied to knowledge. And it records **why**, not just what: a prompt without its rationale
can't be updated by anyone except its author, which means it's person-dependent wearing a shared
folder's clothes.

## Lesson 3 · Embed rather than teach **[V]**

If the classroom can't keep up, what does?

The pattern that keeps being reported is **embedding rather than convening**: putting capability
inside the team's existing rhythm rather than pulling people out of it. Someone who sits in the
team's actual ceremonies (the planning session, the review, the retrospective) and works on the
real thing in front of them, rather than a course delivered to a room of people from six functions.

The mechanism is plausible and worth saying: it teaches against **this** work rather than a
generic example, it updates continuously because the person embedded is learning too, and it
produces artifacts as a by-product rather than as homework.

**And now the honest part, because this course asks you to interrogate vendors' evidence and owes
you the same standard.**

The applied evidence for embedded AI coaching is **largely vendor-supplied.** The figures in
circulation (that embedded approaches drive multiples of the adoption of standalone portals, that
retention of practice is far higher) come predominantly from organizations selling embedded
coaching. They may well be right. They aren't independent, and a course that repeated them as
findings would be doing exactly what Module 6 tells you not to accept from a vendor.

There is also a widely-repeated story about a large technology company placing AI coaches inside
engineering teams at roughly one per five to ten people. **It could not be traced to a primary
source and is not used here.** The pattern is worth teaching; the anecdote isn't worth repeating.

**So take this lesson at its actual strength.** Embedding is a well-motivated pattern with a
plausible mechanism and weak independent evidence. That is enough to try it in one team with a
measure attached (which is exactly what Module 10's pilot design is for) and not enough to fund
a programme on.

## Lesson 4 · What codification doesn't fix

One more thing, and it's the handoff to the next module.

Go back to the junior analyst asking the senior analyst three questions a day. Module 1 put it on
the sorting exercise; here's what it was actually doing.

**Asking a colleague a question was performing two jobs at once.** It moved information: the
answer. And it built the relationship — the small, repeated, low-stakes contact through which trust
forms, norms transmit, newcomers find mentors, and people learn what opportunities exist and who to
ask about them.

**One transaction was carrying both loads. AI replaced the first and deleted the second.**

That is why collective learning and human connection in organizations decayed at the same time.
Not two separate trends with a coincidental date — **one mechanism, doing two jobs, removed once.**

Codification is the right response to the first job. Done well, it restores the information
transmission and makes it better than it was, because it scales and it survives a resignation.

**It does nothing at all about the second one.** A well-maintained shared library, with a named
owner and a decay condition and genuine telemetry, transmits knowledge beautifully and builds no
relationships whatsoever. Nobody is thanked, nobody is known, nobody discovers who to ask about the
thing that isn't in the library.

Module 8 is about the load nobody has been assigned.

## Key takeaways

- **Individual learning velocity rose sharply; collective learning velocity did not move.** Everyone
  is getting better in parallel and in private.
- **One-time training has a structural problem, not an execution one.** It builds habits against a
  fixed target; the half-life of what it transmits got much shorter and the delivery cadence did
  not change to match, so it's confidently wrong, in a room, to people who repeat it.
- **Individual practice becomes collective capability through three things:** codified into shared
  artifacts, measured through workflow telemetry, circulated through tracked cycles. Miss one and
  it stays trapped.
- **Collective learning that depends on individual memory and goodwill does not survive a
  resignation.**
- **Codification is not documentation. A fossil is worse than nothing because it looks like
  coverage**, and a stale shared prompt costs more than an empty folder, which at least tells the
  truth.
- **The test is: who removes things, and when did they last do it?**
- **A surviving artifact has a named maintainer, a decay condition, and its rationale** — because a
  prompt without its reasoning can only be updated by its author.
- **Embedding beats convening, on a plausible mechanism and weak independent evidence.** Enough to
  pilot with a measure; not enough to fund a programme.
- **Asking a colleague did two jobs. AI replaced one and deleted the other.** Codification restores
  the information. It restores nothing else.

## Take a position

**The claim:** *"Documentation nobody maintains is a fossil of a practice, and it's worse than
nothing because it looks like coverage."*

The strongest counter-argument is that **stale artifacts are how institutional memory actually
works, and always have been.** Every functioning organization is full of documents nobody
maintains, and people use them the way people have always used old maps: as a starting point,
adjusted by judgment, better than the blank page. On this view the module has set an unattainable
standard (a named maintainer and a decay condition for every artifact) that will produce, in
practice, **far less written down**, because the cost of writing anything now includes committing
someone to maintain it forever.

Sharper still, and it turns the module's own tool on it: **the decay condition is itself an artifact
that will decay.** Nobody will maintain the maintenance metadata, and in eighteen months you'll
have a library of stale prompts each confidently labelled with a stale decay condition, which is
worse than what you started with because now the fossils carry credentials.

Your position has to say what you would actually require before something enters your shared
library, and whether you would rather have twenty maintained items or two hundred unmaintained
ones.

## Applied activity — "The trapped practice"

**Time:** 30 minutes · **Submit:** the practice, the codification design, and the covering note ·
**Graded against the rubric below.** Score doesn't matter. Doing the work is where the learning
lands.

**Step 1. Ask (5 min).** Your calibration answer was what proportion of your team could find your
shared AI practice in under two minutes. **Ask four or five of them to find it while you wait.**
Not "does it exist" — *find it.* Record how many could, and how long it took.

If nothing exists to find, that's the finding, and the rest of the activity is about building the
first item rather than fixing the library.

**Step 2 — Find one trapped practice (8 min).** One thing that works, that lives in one person's
head or one person's files, that other people would benefit from. Module 6's early adopter is the
obvious hunting ground; so is anyone whose output people quietly ask for copies of.

Name it specifically: what the practice is, who has it, and **what it's worth**: how much better
the outcome is, or how much faster, as concretely as you can say honestly.

**Step 3. Design the codification (12 min).** Four things, and the last two are the graded ones:

1. **Where it lives** — a real location, one people already open.
2. **What form it takes**, and include the *why*, not just the *what*, because a prompt without
   its rationale can only be updated by its author.
3. **Who maintains it**: a name. Not a team, not a role, not "the COE." If you can't get a name,
   say so and say what that means for the artifact's life expectancy.
4. **Its decay condition** — what would make this wrong, stated observably. Module 2's trigger,
   applied to knowledge. And who is watching for it.

**Step 4. The covering note (5 min).** 200–300 words. Your calibration percentage against what
happened when you asked people to find it. Whether anything in your current shared library is a
fossil — **name one specifically if so.** And your position on the module's claim, engaging the
counter-argument that the standard is unattainable and will produce less written down rather than
more.

## Knowledge check — 8 questions

*Unlocks after the applied activity is submitted. Retakes are free and unlimited.*

**Q1.** What is the gap this module addresses?

- A. That AI training budgets haven't kept pace with adoption
- B. That individual learning velocity rose sharply while collective learning velocity didn't move ✓
- C. That organizations lack the tooling to share prompts effectively
- D. That senior staff learn AI more slowly than junior staff

> **B.** Everyone is getting better in parallel and in private, and almost none of it reaches
> anyone else.

**Q2.** Why does the module say one-time training has a structural rather than an execution problem?

- A. Because most training is delivered by people who aren't practitioners
- B. Because the half-life of what it transmits got much shorter and the delivery cadence didn't change to match ✓
- C. Because adults retain little from classroom instruction
- D. Because AI capabilities vary too much between vendors to teach generically

> **B.** Training works. A curriculum designed for annual delivery against a quarterly-changing
> subject will be confidently wrong, in a room, to people who then repeat it.

**Q3.** What are the three parts of turning individual practice into collective capability?

- A. Documented, approved, and distributed
- B. Codified into shared artifacts, measured through workflow telemetry, circulated through tracked cycles ✓
- C. Piloted, standardized, and mandated
- D. Written down, trained out, and audited

> **B.** Miss any one and discoveries stay trapped, which means collective learning depends on
> individual memory and goodwill, and neither survives a resignation.

**Q4.** Why is an unmaintained shared artifact worse than nothing?

- A. Because it consumes storage and search results
- B. Because it looks like coverage — someone uses it, gets a worse result than current practice, and concludes the library isn't worth checking ✓
- C. Because it creates a false record for audit purposes
- D. Because maintaining it later costs more than starting fresh

> **B.** You've spent your one chance at that person's attention. An empty folder at least tells
> the truth.

**Q5.** What is the module's test for whether a library is codification or documentation?

- A. Whether its contents are version-controlled
- B. Whether usage is measured
- C. Who removes things, and when they last did it ✓
- D. Whether it has an approval process for new entries

> **C.** The answer is almost always nobody and never, and that tells you what you're looking at.

**Q6.** Why must a codified artifact record its rationale rather than just its content?

- A. Because rationale is required for compliance documentation
- B. Because a prompt without its reasoning can only be updated by its author, which makes it person-dependent wearing a shared folder's clothes ✓
- C. Because rationale helps new users decide whether it applies to them
- D. Because it demonstrates the artifact was reviewed before publication

> **B.** C is true and secondary. The failure the property prevents is an artifact that looks
> shared and is not.

**Q7.** How does the module characterize the evidence for embedded AI coaching?

- A. Strong and independently replicated
- B. A plausible mechanism with largely vendor-supplied applied evidence: enough to pilot with a measure, not enough to fund a programme ✓
- C. Contested, with equally strong evidence on both sides
- D. Too recent to assess

> **B.** And a widely-repeated story about a technology company's coach-to-engineer ratio could not
> be traced to a primary source, so the module teaches the pattern without the anecdote.

**Q8.** What does codification restore, and what does it not?

- A. It restores speed but not quality
- B. It restores consistency but not innovation
- C. It restores the information half of what asking a colleague used to do, and does nothing about the relationship half ✓
- D. It restores individual capability but not team performance

> **C.** One transaction was carrying both loads. AI replaced the first and deleted the second,
> which is why collective learning and connection decayed together — and why Module 8 exists.

## Sources and attribution

- **Deliberately not repeated from AI 201:** M2's context pack and M7 Lesson 3's personal library
  hygiene. This module is the collective version, which is a different problem with different
  failure modes, and the brief says so before teaching anything.
- **Evidence stated at its real strength.** `[V]` The applied evidence for embedded coaching is
  largely vendor-supplied and the lesson says so. The frequently-repeated story about a large
  technology company placing AI coaches inside engineering teams at roughly one per five to ten
  people **could not be traced to a primary source and is not used**: the pattern is taught, the
  anecdote isn't.
- The codification/documentation distinction, the who-removes-things test, the three properties of
  a surviving artifact, and the two-jobs mechanism are original to this course.
- Takes Module 6's early-adopter output as its raw material and sets up Module 8 directly.
