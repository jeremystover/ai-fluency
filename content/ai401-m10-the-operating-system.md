# AI 401 · The Translator · Module 10 — The operating system, and the bet

**Course:** AI 401 · The Translator · Module 10 of 10
**Estimated time:** 30 min content · 10 min exercise · 45 min applied activity (the course close)
**Prerequisite:** the course — this module assembles it
**Position in the course:** where culture becomes real, and where the whole thing is scored

> `Concepts reviewed: [DATE] · Examples current as of: [DATE]`
> Lessons 1 and 2 are **[V]** volatile layer. The pilot design in Lesson 3 and the deck rules in
> Lesson 4 are stable, and they are what you leave with.

---

## Calibration prompt — before you start

*The last claim of the course. Commit before you read.*

> **"The metrics my organization uses to track AI would still look good if AI were producing no
> value at all."**

**True of us, or not true of us?** One sentence. This one is uncomfortable to answer honestly and
that's the point.

Then: **how many AI-related metrics does your organization currently report, and how many of them
measure something other than usage?** Two numbers — total, and the non-usage subset. If the second
is zero, write zero.

---

## Module brief

Nine modules have produced specs, contracts, inventories, limits, and rules. This one is about
whether any of it survives contact with the machinery that actually governs behavior — and then it
assembles everything you've built into the one artifact that can move people who will never read
a spec.

Two halves.

**The operating system** is metrics, incentives, decision rights, and rituals. It is where culture
stops being a value statement and becomes a set of things that are rewarded. **If those keep
rewarding the old behavior, the new behavior dies regardless of how well everything upstream went** —
which is a sentence worth sitting with, because everything upstream is what the last nine modules
were.

**And the deck.** Module 1 said your deliverable is a spec with a tolerance and a trigger. That is
still true and it isn't sufficient, because a spec is what you manage with and **a deck is what
people follow.** The course closes by making you write both and understand why they are different
instruments.

## Learning objectives

By the end of this module you should be able to:

1. Map the four building blocks of change onto the instruments available to you, and say which ones
   you actually hold.
2. Recognize a metric that will produce itself.
3. Design a pilot whose result would be believed by someone who didn't want it.
4. Write a vision deck that could be disagreed with.
5. Read your own calibration record across ten modules and say what moved.

## Lesson 1 · Where culture becomes real **[V]**

McKinsey's influence model names four building blocks that change behavior, and the finding worth
carrying is that **successful transformations were nearly eight times more likely to use all four
than just one.** The blocks:

1. **Fostering understanding and conviction** — people know what's being asked and why it matters.
2. **Role modeling** — leaders and influential people visibly do the thing.
3. **Developing talent and skills** — people can actually do what's required, practiced on real work.
4. **Reinforcing through formal mechanisms** — systems, processes, metrics, and incentives align
   with the new behavior.

Now map them onto the instruments you actually have, because that mapping is this course's whole
argument arriving at its conclusion:

| Block | Instrument | Do you hold it? |
|---|---|---|
| Understanding and conviction | **Influence** | Yes — this is your deck, your partner briefings, your rehearsals |
| Role modeling | **Influence** | Yes, and cheaply — you can do it yourself tomorrow |
| Talent and skills | **Capability** | Usually yes — Module 7's codification, and enablement design |
| Reinforcing mechanisms | **Authority** | **Almost never** |

**You cannot influence your way to new promotion criteria.** You can't persuade a compensation
system. Metrics, incentives, decision rights, and promotion standards change when someone with
authority changes them, and at this rung that person isn't you.

Three consequences, and they are the honest version of what this course has been teaching.

**Three of the four blocks are genuinely available to you**, which is more than most people at this
rung believe. Understanding, role modeling, and capability are influence and capability work, and
you can do all of it without anyone's permission.

**The fourth is where transformations die**, and it's the one you have to get someone else to do.
Which makes it a Module 2 Step 7 problem — name the owner — and a Module 3 problem — know what they
are measured on before you ask.

**And going three-for-four is not eighty percent of the result.** The eight-times finding is about
using all four. A change with conviction, role modeling, and skills but no reinforcement is the
change everyone remembers fondly and nobody does anymore.

## Lesson 2 · Goodhart, hard **[V]**

The specific way the fourth block goes wrong when you do get it.

**Measure AI consumption and you'll get AI consumption.** Longer prompts, repeat requests,
unnecessary experimentation, and querying a model for things you already knew all become rational
career behavior the moment usage is what counts.

**The worked example, which is real and instructive.** A UK law firm — Shoosmiths — put a **£1
million bonus pool** against the firm collectively hitting **one million Microsoft Copilot
prompts** in a financial year, with usage tracked and shared internally and monthly updates to
encourage adoption. **They hit the target more than four months early**, and the pool was released.

Read that carefully, because the interesting part isn't that the target was gamed. There is no
evidence it was, and the firm reports genuine adoption gains. **The interesting part is that hitting
it four months early tells you nothing about whether it was worth hitting.** A prompt count can't
distinguish a lawyer who restructured how they work from a lawyer who asked a model to rewrite an
email they had already written. The metric succeeded completely and remains silent on the only
question that matters.

**And there's a real argument on the other side**, which you should be able to make before you
dismiss it: a usage target is a *deliberately crude instrument for the earliest phase*, when the
binding constraint is that people won't try the thing at all. As a permission signal with money
attached, it may have been exactly right — and the failure would be leaving it in place once the
constraint changed.

**What most organizations measure:** log-ins, licenses, prompt volume, agent invocations, training
completions.

**What they should be measuring:** cycle time, quality, decision speed, risk reduction, value per
workflow — and then, as it matures, value created per workflow, cost per task, human review burden,
and quality improvement over time.

**Notice what the second list has in common:** every item requires you to know what the work
produced, not what the tool did. Which is harder, which is why the first list wins, and which is
what makes this a leadership problem rather than an analytics one.

**And how far behind the rhetoric the machinery actually is** `[V]`: as of 2025 proxy disclosures,
roughly **5.9% of S&P 500 companies disclosed at least one AI-related metric in executive
compensation, most often inside a strategic or individual performance assessment rather than as a
standalone measure.** The qualifier is the more interesting half — even where AI reaches executive
pay, it usually arrives as a judgment call rather than a number. **The reinforcement block, at the
top of the house, is mostly still empty.**

> ### Try this — 3 minutes
> Take the AI metric your organization reports most often. Ask: **what would this number look like
> if the initiative were producing no value whatsoever, but everyone kept using the tools?** If the
> answer is "exactly the same," you've found a metric that produces itself.

## Lesson 3 · The pilot that produces a defensible number

Which brings the thing this course promised and hasn't yet delivered: how to run something that
produces evidence rather than an anecdote.

**Start with the sentence that reframes it**, carried over from the CPO track because it's the
sharpest statement of the problem:

> **"We cannot tell if it worked" and "it did not work" produce an identical conversation with a
> CFO.**

That converts measurement from a reporting activity into a **design constraint that binds before
the pilot starts.** Four things have to exist before anyone does any work.

**1 · A baseline, agreed in advance, by the person who will judge the result.** Not measured
afterwards — agreed beforehand, in writing, by the skeptic. A baseline established after the fact is
a negotiation, and you'll lose it. If no clean baseline exists, say so before you start and
consider picking a different pilot: **place your first bets where you already have trusted
baselines**, even when those aren't the highest-value problems, because you have to survive the
first review to get to the second.

**2 · A pre-committed decision rule.** What result would make you scale this, and what result would
make you stop? Written down, before. A pilot without a decision rule doesn't produce a decision; it
produces a discussion in which the most senior opinion wins.

**3 · A stated tolerance for the trough** — and this is the piece that connects to everything else
in the course. **Adoption gets worse before it gets better.** People are slower with a new process,
quality dips while judgment recalibrates, and the reconciliation cost from Module 6 arrives before
the production gain does. **A threshold measured inside the expected decline will stop something
that was working.** So name the shape you expect and the depth you'll tolerate, in advance — and
name how long you'll hold.

**4 · A kill condition.** The thing that makes you stop regardless of sunk cost, sponsor
enthusiasm, or how much has already been announced. This is Module 2's trigger, pointed at your own
initiative rather than at the world, and it's the hardest one to write honestly because you're
writing it about something you want to succeed.

**The test for the whole design, in one question:** *would someone who didn't want this result
believe it?* If the answer is no, you've designed a demonstration rather than a pilot.

## Lesson 4 · The deck

Everything you've built in this course is a spec. Specs govern. **They do not recruit.**

The market's characteristic mistake is producing a deck and calling it a plan. The mistake this
course would make without this lesson is the opposite one: producing a spec and calling it
leadership. **They are different instruments carrying different loads**, and Lesson 1 tells you
exactly which load the deck carries — understanding and conviction, and role modeling. Two of the
four blocks, both yours.

So the deck isn't a summary of your spec. It is the argument for it, aimed at people who will never
read it. Four rules keep it from becoming a slogan:

**1 · Every claim traces to a line in the framework.** Load, what's carrying it, what's dissolving,
the replacement, the tolerance, the trigger, the owner. If a slide traces to nothing, it's
decoration — and Module 1 told you what decoration is.

**2 · At least one named thing you are not doing.** A strategy that doesn't exclude anything is a
list. This is also the slide that buys you the most credibility per word, because it's the one
nobody else's deck has.

**3 · At least one falsifiable trigger, on a slide, not in an appendix.** Visible. Where an executive
reads it. Putting your own failure condition in front of the room is the single most persuasive
thing available to a person without authority, precisely because nobody does it.

**4 · The anti-slogan test: could a reasonable person disagree with this?** Read every slide and ask
whether someone competent and well-intentioned could hold the opposite view. If not, you've
written a mission statement — true, unobjectionable, and inert.

**And the failure mode to plan for, because it's the likely one.** You won't be rejected. You
will be **agreed with.** Everyone will nod, several people will say this is exactly right, and
nothing will change — because agreement is free and reinforcement mechanisms aren't. Enthusiastic
assent with no behavior change is the standard outcome for a good deck presented by someone without
authority.

**The counter is to leave with something specific rather than something warm.** One commitment, from
one named person, with a date. If you can't get that, the honest read is that you got a compliment,
and a compliment isn't an outcome.

## Key takeaways

- **Four building blocks change behavior, and successful transformations were nearly 8x more likely
  to use all four than one.** Understanding and conviction, role modeling, talent and skills,
  reinforcement through formal mechanisms.
- **Three of the four are influence and capability work you already hold. The fourth is authority,
  and it's almost never yours** — and it's where transformations die. **Going three-for-four is
  not eighty percent of the result.**
- **You cannot influence your way to new promotion criteria.**
- **Measure AI consumption and you get AI consumption.** A £1m bonus pool against a million Copilot
  prompts was hit four months early — and hitting it early says nothing about whether it was worth
  hitting.
- **Even where AI reaches executive pay it's usually a judgment call rather than a number** —
  roughly 5.9% of S&P 500 companies disclosed any AI-related metric in 2025, mostly inside strategic
  assessments. The reinforcement block at the top of the house is mostly still empty.
- **"We cannot tell if it worked" and "it did not work" produce an identical conversation with a
  CFO.** So a pilot needs four things agreed before it starts: **a baseline agreed by the skeptic, a
  pre-committed decision rule, a stated tolerance for the trough, and a kill condition.**
- **A threshold measured inside the expected decline will stop something that was working.**
- **The test: would someone who did not want this result believe it?** If not, it's a demonstration.
- **A spec governs; a deck recruits.** Every claim traces to the framework, one named thing you're
  not doing, one falsifiable trigger on a slide, and it must be possible to disagree with.
- **You will not be rejected — you'll be agreed with.** Leave with one commitment, one name, one
  date. A compliment isn't an outcome.

## Take a position

**The claim:** *"A metric that can't embarrass you isn't a measurement, it's a mirror."*

The strongest counter-argument is that **embarrassing metrics do not survive contact with an
organization, so recommending them is advice that only works for people who do not need it.** The
person who proposes a measure capable of showing their own initiative failing is proposing to hand
their critics a weapon, in an environment where the initiatives that continue are the ones with
favorable numbers. Usage metrics aren't naive — they are **adaptive.** They keep funding flowing
during the trough Lesson 3 tells you to expect, and funding through the trough is the actual
precondition for anything working.

Sharper still, and it turns the course's own tools on it: this module tells you to design a pilot a
skeptic would believe, and Module 6 tells you the trough is normal and deep. **Those two
instructions conflict.** A skeptic looking at honest month-four numbers sees a failure, because at
month four it *is* a failure by every measure you agreed with them in advance. The rigor this module
demands may be exactly what kills the initiative that would have worked.

Your position has to say how you would hold both — what you would agree with a skeptic in advance
that would still be true at the bottom of the J-curve.

## Applied activity — "What we're keeping standing"

**Time:** 45 minutes · **Submit:** the deck, the bet, and the reckoning · **Graded against the
rubric below.** This is the course close, and the grade for the whole thing.

Everything you've built across ten modules assembles here. Your prior submissions are on this
screen — use them rather than starting over.

**Step 1 — The deck (20 min).** *"What we're keeping standing"* — five to eight slides, or their
written equivalent, addressed to a **named audience**. Not "leadership." A person or a specific
group, chosen because they hold something you need.

It must contain, and the rubric checks each one:

- **The load**, and what's dissolving — from Module 2.
- **What you're keeping standing**, as a spec rather than a drawing.
- **At least one named thing you are not doing.**
- **At least one falsifiable trigger, on a slide.** Visible, not appended.
- **The ask** — what you want this audience to do, specifically.

Then apply the anti-slogan test yourself and report the result: **which slide is the one a
reasonable person could disagree with?** If there isn't one, say so — that's a finding about your
deck, not a gap in the assignment.

**Step 2 — The bet (10 min).** Four fields, and the third is the one that matters:

1. **The bet.** One thing you'll do, or one metric you would replace with a better one.
2. **The baseline metric** it will be judged against.
3. **Today's value of that metric.** The actual number, today. **If you cannot fill this in, that
   is the lesson** — say so explicitly, and say what you would have to do to be able to.
4. **The date you'll report against it.**

Plus two more the course has earned: **what you would turn off** to make room for it, and **the kill
condition** — what would make you stop regardless of sunk cost.

**Step 3 — The reckoning (10 min).** Ten modules, ten opening claims about your own organization.
Go back through them.

- Which claims did you commit to as true and find were **not** true when you checked?
- Which numbers moved most between your prediction and what you found?
- **And the one that matters: is there a direction to your errors?** Most people find one — usually
  overestimating how much is owned, named, written down, or known by someone. Name yours.

**The rubric grades the account of the change, never the accuracy of either end.** A large,
specifically-explained miss is the best possible result here.

**Step 4 — The send decision (5 min).** Send the deck, or not yet. If not yet, the condition and the
date. Then predict: **if you present this, what does agreement-with-no-action look like in your
organization, and what one commitment would you push for instead?**

## Knowledge check — 8 questions

*Unlocks after the applied activity is submitted. Retakes are free and unlimited.*

**Q1.** Which of the four building blocks of change is almost never available to someone at this rung?

- A. Fostering understanding and conviction
- B. Role modeling
- C. Developing talent and skills
- D. Reinforcing through formal mechanisms — metrics, incentives, decision rights, promotion criteria ✓

> **D.** You cannot influence your way to new promotion criteria. Three of the four are influence
> and capability work you already hold; the fourth requires authority, and it's where
> transformations die.

**Q2.** Why does the module say going three-for-four isn't eighty percent of the result?

- A. Because the blocks have different costs to implement
- B. Because the eight-times finding is about using all four — and a change with conviction, role modeling and skills but no reinforcement is the one everyone remembers fondly and nobody does anymore ✓
- C. Because reinforcement mechanisms take longest to change
- D. Because the blocks must be sequenced in a specific order

> **B.** The blocks reinforce one another, which is why the multiple applies to the combination
> rather than to each.

**Q3.** What is the instructive part of the £1m-for-a-million-prompts example?

- A. That the target was gamed by employees seeking the bonus
- B. That hitting it more than four months early tells you nothing about whether it was worth hitting ✓
- C. That financial incentives are ineffective for behavior change
- D. That prompt volume correlates poorly with license utilization

> **B.** There is no evidence it was gamed and the firm reports real adoption gains. A prompt count
> cannot distinguish someone who restructured their work from someone who had a model rewrite an
> email they had already written.

**Q4.** What do the metrics the module recommends have in common?

- A. They are all leading rather than lagging indicators
- B. They can be collected automatically from existing systems
- C. Every one requires you to know what the work produced, not what the tool did ✓
- D. They are benchmarked against industry peers

> **C.** Which is harder, which is why the usage list wins by default, and which makes it a
> leadership problem rather than an analytics one.

**Q5.** What must be agreed before a pilot starts for its result to be defensible?

- A. Budget, sponsor, scope, and timeline
- B. A baseline agreed by the person who will judge it, a pre-committed decision rule, a stated tolerance for the trough, and a kill condition ✓
- C. Success criteria, a control group, a measurement plan, and a reporting cadence
- D. Executive sponsorship, a communications plan, and a named owner

> **B.** A baseline established after the fact is a negotiation and you'll lose it. And a pilot
> without a decision rule produces a discussion in which the most senior opinion wins.

**Q6.** Why does a pilot need a stated tolerance for the trough?

- A. Because sponsors lose patience faster than transformations deliver
- B. Because a threshold measured inside the expected decline will stop something that was working ✓
- C. Because early results are statistically unreliable
- D. Because adoption curves vary too much between teams to predict

> **B.** Adoption gets worse before it gets better — people are slower with a new process and the
> reconciliation cost arrives before the production gain. Name the shape, the depth, and how long
> you'll hold.

**Q7.** What is the anti-slogan test for a vision deck?

- A. Whether it fits on one page
- B. Whether every claim is supported by data
- C. Whether a reasonable person could disagree with it ✓
- D. Whether it avoids jargon and abstraction

> **C.** If nobody competent and well-intentioned could hold the opposite view, you've written a
> mission statement — true, unobjectionable, and inert.

**Q8.** What does the module say is the likely failure mode when you present the deck?

- A. Being rejected on cost grounds
- B. Being asked for a roadmap instead
- C. Being agreed with, warmly, with no behavior change — because agreement is free and reinforcement mechanisms aren't ✓
- D. Being referred to a committee

> **C.** Leave with one commitment, from one named person, with a date. A compliment is not an
> outcome.

## Sources and attribution

- **McKinsey's four building blocks of change** `[V]` — fostering understanding and conviction,
  role modeling, developing talent and skills, and reinforcing through formal mechanisms; with the
  finding that successful transformations were nearly eight times more likely to use all four than
  one. **A correction is recorded here rather than hidden:** an earlier draft of this course
  attributed a five-stage "Awareness, Belief, Commit, Develop, Enforce" model to McKinsey. That is
  not their model. The verified four blocks map onto the influence / capability / authority split
  more cleanly than the five-stage list did, so the correction improved the lesson.
- **Shoosmiths** `[V]` — £1 million firmwide bonus pool tied to one million Microsoft Copilot
  prompts in a financial year, target reached more than four months early. Reported by the firm and
  by multiple independent legal-sector sources.
- **Executive compensation disclosure** `[V]` — roughly 5.9% of S&P 500 companies disclosed at least
  one AI-related metric in 2025 proxy statements, most often within strategic or individual
  performance assessments rather than as a standalone measure. **A claim was replaced here:** an
  earlier draft carried "of ~2,500 proxy statements filed in 2026, about 2% incorporate AI into
  executive incentives and 12% of those use an explicit AI metric." It didn't verify and isn't
  used.
- **"We cannot tell if it worked" and "it did not work" produce an identical conversation with a
  CFO** is carried from the AI 301 CPO / CHRO track with credit; the baseline-first rule is shared
  with it.
- The instrument mapping, the pilot's four preconditions, the trough-threshold interaction, the
  four deck rules, and the agreed-with-no-action failure mode are original to this course.
- **Deliberately not repeated from AI 201 M7:** measurement without theater and the three numbers
  per workflow. That was measurement of your own build; this is measurement of work you don't
  perform, inside an incentive system you don't control.
