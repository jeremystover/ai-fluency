# AI 401 · The Translator · Module 4 — Ownership contracts

**Course:** AI 401 · The Translator · Module 4 of 10
**Estimated time:** 25 min content · 10 min exercise · 30 min applied activity
**Prerequisite:** Modules 2 and 3 — the framework, and the partner you researched
**Position in the course:** the first module where you have to move a person

> `Concepts reviewed: [DATE] · Examples current as of: [DATE]`
> Lesson 1 is **[V]** volatile layer. The interface argument in Lesson 2 and the design rule in
> Lesson 3 are stable, and they are what survives the statistics.

---

## Calibration prompt — before you start

*One claim. Commit before you read.*

> **"Everyone on my team could name who owns the handoff between us and the team we work with
> most."**

**True of us, or not true of us?** One sentence. And name the handoff you've in mind, because
the rest of this module is about it.

Then: **if you asked three people on your team and three on theirs, how many of the six would give
the same answer?** A number out of six. You're going to go and ask.

---

## Module brief

Something specific happened to job boundaries in the last two years and most organizations have
diagnosed it wrong.

The visible symptom is turf. Two teams both think they own a piece of work, or neither does. People
are doing things that used to belong to someone else, sometimes well and sometimes not. Specialists
are being routed around. The obvious reading is that AI made people ambitious, or careless, or that
the org design needs a refresh.

**The actual mechanism is more interesting and it changes what you do about it.** The turf was
always undefined. What changed is that the people who were absorbing the undefinedness — clarifying
requirements, chasing the data, translating between two systems, quietly deciding — got busy doing
other things, or stopped being needed, or left and weren't replaced.

> **AI did not create your turf problem. It removed the people who were papering over it.**

Which means the work in front of you isn't conflict management. **It is design work you can do,
mostly with a document**, and this module produces the document.

## Learning objectives

By the end of this module you should be able to:

1. State what has actually happened to role boundaries, with evidence and its sample.
2. Explain why large teams hide bad interfaces and what that predicts as teams get leaner.
3. Decide where you want redundancy and where you want a single owner — rather than letting the
   fastest mover settle it.
4. Write an ownership contract at the workflow rather than the reporting line.
5. Judge when to send a boundary claim and when the right answer is *not yet*.

## Lesson 1 · What actually happened to job boundaries **[V]**

Atlassian's Teamwork Lab surveyed 1,000 US knowledge workers between 27 May and 9 June 2026. Four
findings, and the fourth is the one that matters.

**92% say their responsibilities have grown beyond their original job description in the last
year.** Nearly everyone. Whatever this is, it isn't happening to a subset.

**The heaviest AI users are nearly twice as likely to take on work from other teams.**

**They are twice as likely to use AI to handle specialized tasks without looping in the
specialist.**

**And non-AI users are seven times more likely to say their role has not changed at all** — which
makes AI adoption the single strongest signal in the data for whether someone's job is moving.

Carry the sample honestly: 1,000 US knowledge workers, self-reported, one point in time, and
"heaviest AI users" is a self-described category. It establishes a strong association between
AI use and scope expansion. It doesn't establish that the AI caused the expansion rather than
both being caused by the kind of person who does this — and the module's argument doesn't need
causation, only the pattern.

**Read the second and third findings together, because separately they are interesting and together
they are the whole module.** People are taking on other teams' work *and* handling specialist work
without the specialist. Those are the same behavior seen from two sides: **a boundary that used to
require a conversation now does not.** Not because anyone renegotiated it — because the cost of
crossing it fell to roughly zero.

> ### Try this — 3 minutes
> Think of the last piece of work you did that would have required someone else's involvement two
> years ago and did not this time. Now answer honestly: **did the person who used to be involved
> find out?** If not, ask yourself what they would have contributed — and whether the answer is
> "nothing, it was a formality" or "the thing I did not know I needed."

## Lesson 2 · Large teams hide bad interfaces

Here's the structural claim, and it explains why this arrived now rather than five years ago.

**Interfaces between teams have always been badly defined.** Almost nowhere is it written down
exactly where recruiting's responsibility for a hiring manager's decision ends and the manager's
begins, or where People operations' ownership of a data field stops and analytics' starts. The
documents that purport to define it are org charts and RACI matrices, and both describe reporting
and consultation rather than the actual seam where work passes between hands.

**Organizations coped by staffing the seam.** Not deliberately — nobody has a headcount line called
"absorbs ambiguity." But when there are enough people, somebody always ends up clarifying the
requirement, chasing the missing field, translating between two systems, noticing that both teams
assumed the other one was doing it. That absorption is invisible, unrewarded, and it's what made
the badly-defined interface work.

**So a large team is not just a team with more capacity. It is a team with more slack for
absorbing bad design** — and the bad design is therefore never surfaced, never fixed, and never
even known about.

Two things then happen at once, and they compound.

**The absorbers get busy or get leaner.** Module 5 is entirely about this, so take it here as a
premise: the people with slack have less of it.

**And the cost of crossing the boundary collapses.** Someone who would have had to ask the
specialist can now produce a passable version themselves in twenty minutes. Sometimes that's
excellent — the specialist was a bottleneck for work that didn't need them. Sometimes it's a
disaster with a six-month delay on it. **From the outside, on the day it happens, the two look
identical**, and that's precisely the problem this module exists to address.

The claim, stated so you can disagree with it:

> **The turf conflict in your organization is not new. It is a pre-existing design flaw becoming
> visible because the people who were absorbing it stopped.**

## Lesson 3 · Redundancy is sometimes the right answer

The instinct once you accept the above is to define every boundary and assign every piece of work
a single owner. Resist it, because it's wrong about half the time and the half is predictable.

**Single ownership buys you accountability and consistency.** One name, one standard, one place the
decision gets made. You want it where the cost of an inconsistent answer is high, where the work is
irreversible, or where somebody has to be accountable to an outside party.

**Redundancy buys you resilience and speed.** Two or more people can do it, so the work doesn't
stop when one is unavailable, and nobody waits in a queue. You want it where the work is
high-volume and low-stakes, where the queue itself is the biggest cost, or where the second person
catches the first person's errors.

Most organizations have this backwards in a specific way: **redundancy on the judgment calls
(because everyone feels entitled to have a view) and a single owner on the throughput (because
that person "owns the system").** The reversal is worth checking for in your own unit.

**The design question, then, is not "who owns this?" It is: where do we want redundancy, where do
we want a single owner, and have we decided — or has it been settled by whoever moved fastest?**

That last clause is the module's real subject. In the absence of a decision, boundaries get
resolved by speed, and AI has made some people much faster than others. **An interface settled by
who got there first is not a design. It is an outcome.**

## Lesson 4 · Writing the contract

The artifact. It is short — a good one fits on a page — and it's written **at the workflow, not at
the reporting line**, which is the single thing that distinguishes it from a RACI nobody reads.

A workflow-level ownership contract names five things.

**1 · The workflow, in one line, from trigger to output.** Not the function. Not the team. The
actual sequence: *a hiring manager requests a level exception → someone assesses it against the
architecture → someone decides → someone communicates it.*

**2 · The seam.** The specific point where the work passes between you. Not "we collaborate
throughout" — the moment, and what's in hand when it passes.

**3 · Who owns each side, by name**, and where you've deliberately chosen redundancy, saying so
explicitly, so it reads as a decision rather than an omission.

**4 · What each side may decide alone**, and what requires the other. This is where the contract
earns its existence, and where the AI-specific question lives: **what may be produced with AI
without telling the other side?** A draft, probably. An assessment the other side will rely on,
probably not. Write your answer down, because the current answer in most organizations is
"whatever each person privately decided," and that's Module 1's cultural debt, stated in a line.

**5 · What happens when it's contested.** Module 2's Step 7, at the seam. When you disagree about
who owns something, who decides? If the honest answer is that it escalates to two managers who
will have a conversation, write that.

**Then the part most people skip: send it, or decide not to.**

A boundary claim to a peer is a political act. It says *I think this is mine, or ours, and I am
putting it in writing.* Sending it at the wrong moment — mid-crisis, during their reorganization,
a week after you took something else from them — can cost you more than the ambiguity was costing.

> **"Not yet, and here's what has to be true first" is frequently the right answer, and this
> course grades it identically to sending.**

What it doesn't grade identically is *not deciding.* Holding a contract you've written, for a
stated reason, with a condition attached, is a position. Never writing one because it might be
awkward is the thing this module exists to prevent.

## Key takeaways

- **AI did not create your turf problem. It removed the people who were papering over it.** The
  work is design, not conflict management.
- **92% say their responsibilities grew beyond their job description in the last year.** The
  heaviest AI users are ~2x as likely to take on other teams' work and ~2x as likely to handle
  specialist tasks without the specialist; non-users are 7x more likely to report no change.
  n=1,000 US knowledge workers, self-reported, May–June 2026.
- **Those two findings are one behavior from two sides:** a boundary that used to require a
  conversation now doesn't — not because anyone renegotiated, but because crossing it became free.
- **Large teams hide bad interfaces.** Slack gets spent absorbing ambiguity nobody designed away,
  so the bad design is never surfaced. Lean teams surface it immediately.
- **From the outside, on the day it happens, routing around a specialist correctly and routing
  around one disastrously look identical.**
- **Decide where you want redundancy and where you want a single owner** — and check for the common
  reversal: redundancy on judgment, single ownership on throughput.
- **An interface settled by who got there first is not a design. It is an outcome.**
- **Write the contract at the workflow, not the reporting line**, and include what may be produced
  with AI without telling the other side.
- **"Not yet, and here's what has to be true first" is a position.** Never writing one isn't.

## Take a position

**The claim:** *"AI didn't create your turf problem. It removed the people who were absorbing
it."*

The strongest counter-argument is that **this is too flattering to the past.** It implies there was
a functioning system that AI disturbed, when the more likely truth is that a lot of that absorption
was never benign: it was invisible, gendered, unrewarded work that fell to whoever was least able
to refuse it, and it made bad design survivable at the direct expense of specific people's careers.
On that view, the interfaces becoming visible isn't damage — **it's a decade of hidden labor
finally showing up in the light**, and the right response is to celebrate the surfacing rather than
mourn the absorbers.

The version that cuts hardest at the module: **if absorption was the problem all along, then this
module's careful ownership contracts are just a slower way of doing what the fast movers are
already doing** — and the organizations that let boundaries get settled by speed may end up
better-designed than the ones that convened working groups about it.

Your position has to say who was doing the absorbing in your organization, whether you would want
it back, and what that implies about the pace of the work you're about to do.

## Applied activity — "The ownership contract"

**Time:** 30 minutes · **Submit:** the contract, the send decision, and the covering note ·
**Graded against the rubric below.** Score doesn't matter. Doing the work is where the learning
lands.

**Step 1 — Go and ask (8 min).** Your calibration answer was how many of six people would name the
same owner for your handoff. **Ask them.** Three on your side, three on theirs, one question:
*"Who owns X?"* Record the answers as given, including the ones that are questions back at you.

If you can't ask six, ask who you can and say so. **If the answers are so various that the
question does not parse, that's the finding** and it earns full credit.

**Step 2 — Write the contract (14 min).** One page, five parts, at the workflow:

1. The workflow from trigger to output, in one line.
2. The seam — the moment work passes, and what's in hand when it does.
3. Who owns each side, by name, with any deliberate redundancy stated as a choice.
4. What each side may decide alone — **including what may be produced with AI without telling the
   other side.**
5. What happens when it's contested, with a name.

**Step 3 — The send decision (4 min).** Address it to the peer on the other side of the seam. Then
decide: **send, or not yet.** Either is a full-credit answer. If not yet, name the condition — the
specific thing that has to be true before you send — and the date you'll check it. Then predict
their response in one or two sentences: **which of the five parts do they push back on first?**

**Step 4 — The covering note (4 min).** 200–300 words. Your calibration number against what the six
people actually said. Whether the redundancy/single-owner pattern in your unit is reversed. And
your position on the module's claim, engaging the counter-argument about who was doing the
absorbing.

## Knowledge check — 8 questions

*Unlocks after the applied activity is submitted. Retakes are free and unlimited.*

**Q1.** What does the module identify as the actual mechanism behind rising turf conflict?

- A. AI made individual contributors more ambitious about scope
- B. Org designs haven't been refreshed to account for new AI-enabled roles
- C. The interfaces were always badly defined, and the people absorbing that ambiguity stopped ✓
- D. Specialists are being deliberately excluded to speed up delivery

> **C.** Which changes the response: this is design work you can mostly do with a document, not
> conflict management.

**Q2.** In the Atlassian data, why are the two findings about heavy AI users read together rather than separately?

- A. Because both figures come from the same subgroup and share sampling error
- B. Because they are the same behavior seen from two sides — a boundary that used to require a conversation now doesn't ✓
- C. Because taking on other teams' work is a precondition for handling specialist tasks
- D. Because separately neither reaches statistical significance

> **B.** Not because anyone renegotiated the boundary — because the cost of crossing it fell to
> roughly zero.

**Q3.** What does "large teams hide bad interfaces" mean?

- A. Larger teams have more layers of management obscuring accountability
- B. Big teams generate more handoffs, so problems are harder to trace
- C. Slack gets spent absorbing ambiguity nobody designed away, so the bad design is never surfaced or fixed ✓
- D. Larger organizations invest less in process documentation

> **C.** A large team is not just a team with more capacity — it's a team with more capacity to
> absorb bad design, which is why the flaw is never even known about.

**Q4.** What does the module say about routing around a specialist?

- A. It is nearly always a mistake and should be prevented by policy
- B. It is a reasonable efficiency when the specialist agrees in advance
- C. Sometimes it's excellent and sometimes it's a disaster with a six-month delay — and on the day it happens the two look identical ✓
- D. It is acceptable for drafts but not for finished work

> **C.** That indistinguishability on the day is exactly why the boundary needs deciding in advance
> rather than judging case by case.

**Q5.** When does the module say you want redundancy rather than a single owner?

- A. Wherever two or more people are already capable of the work
- B. Where the work is high-volume and low-stakes, where queueing is the biggest cost, or where a second person catches the first's errors ✓
- C. Wherever the work crosses a functional boundary
- D. Where the team is too small to support specialization

> **B.** And the common reversal is worth checking for: redundancy on the judgment calls, single
> ownership on the throughput, which is backwards.

**Q6.** What distinguishes an ownership contract from a RACI matrix?

- A. It is shorter and easier to maintain
- B. It is agreed bilaterally rather than imposed by management
- C. It is written at the workflow — trigger to output, with the seam named — rather than at the reporting line ✓
- D. It includes escalation paths, which RACI matrices omit

> **C.** Org charts and RACI describe reporting and consultation. The contract describes the actual
> moment work passes between hands, and what's in hand when it does.

**Q7.** Which AI-specific question does the contract have to answer?

- A. Which tools each side is approved to use
- B. What may be produced with AI without telling the other side ✓
- C. Whether AI-assisted work requires additional review
- D. Who pays for the licenses at the seam

> **B.** The current answer in most organizations is "whatever each person privately decided,"
> which is cultural debt, stated in a line.

**Q8.** How does the course grade a decision not to send the contract?

- A. Lower than sending, because the artifact has no effect until it's delivered
- B. Identically to sending, when the condition that has to be true first is named ✓
- C. Higher than sending, because timing judgment is the harder skill
- D. It isn't graded; only the contract itself is assessed

> **B.** Timing is most of the skill in a boundary claim. What is not graded identically is never
> writing one — holding a contract for a stated reason is a position; avoiding the awkwardness is
> not.

## Sources and attribution

- **Atlassian Teamwork Lab** `[V]` — 92% reporting responsibilities grown beyond their original job
  description in the last year; heaviest AI users nearly 2x as likely to take on work from other
  teams and 2x as likely to handle specialist tasks without the specialist; non-AI users 7x more
  likely to report no change. n=1,000 US knowledge workers, fielded 27 May – 9 June 2026,
  self-reported. The sample and its limits are stated in the lesson.
- **A claim was dropped rather than left silently out.** An earlier draft carried "nearly half of
  occupation-specific AI use involves tasks from other professions," attributed to the Anthropic
  Economic Index. It couldn't be confirmed in that reporting and isn't used. The Atlassian
  figures cover the same ground with a stated sample.
- The interface argument, the redundancy/single-owner reversal, the five-part contract, and the
  send/don't-send discipline are original to this course.
- Applies Module 2's Step 7 at a seam, and uses Module 3's partner research as its counterpart
  input. Sets up Module 5, which is about what happens to the absorbers.
