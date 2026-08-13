# AI 301 · Recruiter · Module 2 — Sorting your own job

**Course:** AI 301 · The Specialist — Recruiting / TA track · Module 2 of 7
**Estimated time:** 25 min content · 10 min exercise · 20 min applied activity
**Prerequisite:** Module 1 · builds on 201 M1 (the workflow audit) and 201 M5 (the autonomy ladder)
**Position in the track:** the map — R5 and R7 both need it

> `Concepts reviewed: [DATE] · Examples current as of: [DATE]`
> Adoption figures are **[V]**. The tiers and the archetype split are stable.

---

## Calibration prompt — before you start

*One claim and one number. Commit both before you read.*

> **"Most of my team's week goes to work that actually requires recruiting judgment."**

**True of us, or not true of us?** One sentence, before you count anything.

**And the number**, which you will score in the applied activity:

**What share of your team's week goes to throughput work** — the coordinating, formatting,
scheduling, chasing, and status-updating that has to happen and requires no recruiting judgment?
Whole percent.

## Module brief

Recruiting is the most AI-penetrated practice area in HR, at roughly 27% of deployed use cases —
more than double employee relations or organizational design. That sounds like good news and
mostly isn't, because **penetration arrived by product rather than by design.** Your ATS shipped
features. Your sourcing tool added a copilot. Somebody's Chrome extension writes outreach. Almost
none of it was chosen against a map of where your leverage actually is.

This module builds the map. Three tiers of work, one split that changes all the advice, a
diagnostic for deciding what to build, and a rule for when an agent is warranted rather than
automation.

The split matters most, so it's worth stating up front: **high-volume hourly hiring and
professional or senior hiring are different games**, and the same tactic is a win in one and a
trap in the other. Most bad recruiting advice — including most vendor advice — is advice from the
other archetype delivered without the qualifier.

## Learning objectives

By the end of this module you should be able to:

1. Sort recruiting work into throughput, insight, and redesign — and say where AI money usually
   goes versus where the leverage is.
2. Identify which hiring archetype you're in, and why advice transfers badly between them.
3. Run a five-question diagnostic on any friction point before proposing a solution to it.
4. Decide whether a workflow wants automation or an agent, using the judgment-step rule.
5. Name one narrow goal in a single sentence — the hardest step, and the one that makes the rest
   possible.

## Lesson 1 · Three tiers

**Throughput.** Volume work with no recruiting judgment in it: scheduling, formatting, status
updates, chasing feedback, moving candidates between stages, assembling the packet. High volume,
low variance, immediately measurable. **This is where most AI spend goes and where most of it
belongs** — the wins are real, they compound, and nobody's judgment is being replaced.

**Insight.** Work that requires reading a situation: which of these candidates is worth a
conversation, why this pipeline is stalling, what the hiring manager actually means by "not
senior enough." AI assists here — structuring, summarizing, surfacing patterns for you to judge —
and cannot do it, because the judgment is the work. **Most vendor claims live here and most of
them are the loud kind Module 1 warned about.**

**Redesign.** Changing the process itself: what stages exist, what each measures, what the loop is
for. Almost no AI spend goes here and it is where nearly all the leverage is, because Module 1
established that your funnel's stages stopped carrying information. **Optimizing the throughput of
a stage that measures nothing is the most expensive mistake available to a TA function right
now** — you get faster at doing something that isn't working.

The honest allocation: keep buying throughput, be sceptical of insight, and spend your own scarce
attention on redesign. Modules 3, 4, and 5 are all redesign.

## Lesson 2 · The archetype split

Two hiring games, and the constraint is different in each.

**High-volume hourly.** Retail, warehouse, hospitality, contact centre, care. Hundreds or
thousands of hires, largely interchangeable requirements, and the binding constraint is
**speed-to-contact** — the applicant who replies first often wins the candidate, because they're
applying to eight employers and accepting the first credible offer. Automation wins outright
here. Instant scheduling, immediate responses, and compressed time-to-offer are straightforwardly
good, and the signal-integrity problem is milder because the requirements are verifiable and the
stakes per hire are lower.

**Professional and senior.** Fewer hires, differentiated requirements, long consequences per
decision. The binding constraint is **signal integrity** — the thing Module 1 says has collapsed.
Here the high-volume playbook is actively harmful: faster screening of a signal-free funnel
processes more candidates through a filter that isn't measuring anything, and automated outreach
at volume degrades your employer brand with exactly the passive candidates you most need.

Same tool, opposite verdicts. A "reduce time-to-first-contact by 60%" case study is a real win in
one archetype and a solution to a non-problem in the other.

Two practical consequences. **Read every vendor case study for its archetype first** — if it isn't
stated, assume high-volume, because that's where the countable wins are. And if you run both,
**run them as separate processes with separate tooling decisions**, because a single blended
process optimizes for neither.

> ### Try this — 2 minutes
> Take the last AI recruiting claim you saw. Which archetype was the customer in? If you can't
> tell from the case study, notice that the omission is doing work — the numbers are almost
> always from the high-volume side, where they're easiest to produce.

## Lesson 3 · The diagnostic

Five questions before you propose any solution. They take four minutes and they kill most ideas,
which is the point.

**1. What's the friction, specifically?** Not "scheduling is painful" — *"coordinating a
four-person panel across two time zones takes six emails and two days."* If you can't state it
with a number, you don't understand it yet.

**2. Who does it hurt most?** Recruiters, hiring managers, or candidates. This determines whether
anyone will actually adopt the fix, and it's the question most skipped. Friction that hurts the
person who has to change their behaviour is much harder to solve than friction that hurts them.

**3. What does solved look like, in one sentence?** If the sentence needs an "and," you have two
problems and should pick one. This question kills more bad projects than the other four combined.

**4. Should it even be an agent?** See Lesson 4. Most things shouldn't.

**5. Who owns it when it breaks?** Not who builds it — who gets the message at 7pm when it starts
scheduling interviews on a public holiday. **An unowned automation is a future incident with a
delay attached**, and this question is the one that quietly cancels projects that would have
embarrassed you.

## Lesson 4 · Automation or agent

A distinction worth holding precisely, because the market blurs it deliberately.

**If the flow is static and rule-based, you want automation.** Fixed inputs, deterministic
outputs, an if-this-then-that you could draw. Send the rejection when the status changes. Move
the candidate when the scorecard is submitted. Automation is cheaper, faster, debuggable, and
fails visibly — and most of what gets sold as an agent in recruiting is this with a language
model bolted on for no reason.

**An agent earns its place only when there's a genuine judgment step in the middle** — something
where the right next action depends on interpreting unstructured input. Reading an inbound reply
and deciding whether it's interest, a deferral, or a decline. Triaging a hiring manager's
free-text feedback into a structured signal.

And then 201 M5's autonomy ladder applies unchanged: draft-only, propose-then-approve, or
act-with-audit-trail. Recruiting has a specific reason to sit low on that ladder — **agent actions
in this function are frequently visible to candidates and rarely reversible.** A wrongly-sent
rejection cannot be unsent, and the person who received it is a member of the public with a
LinkedIn account.

The test that combines both ideas: **if you can draw the flowchart, don't buy an agent. If you
can't draw it because a step requires reading something, an agent may be justified — at the
lowest rung that works.**

## Key takeaways

- **Three tiers: throughput, insight, redesign.** Most AI spend goes to throughput and mostly
  belongs there. Most vendor claims live in insight. **Nearly all the leverage is in redesign, and
  almost no spend goes there.**
- **Optimizing the throughput of a stage that measures nothing is the most expensive mistake
  available right now** — Module 1 established that most early stages measure nothing.
- **The archetype split changes every verdict.** High-volume hourly is a speed-to-contact game
  where automation wins outright; professional and senior is a signal-integrity game where the
  same tactics are a trap. Read every case study for its archetype; if unstated, assume
  high-volume.
- **Five diagnostic questions**, of which two do the most work: what does solved look like *in one
  sentence*, and who owns it when it breaks. An unowned automation is a future incident with a
  delay attached.
- **If you can draw the flowchart, it's automation.** An agent earns its place only when a step
  requires interpreting unstructured input — and recruiting sits low on the autonomy ladder
  because agent actions here are visible to candidates and rarely reversible.

## Take a position

**The claim:** *"Most of what your team calls an AI opportunity is an automation project with
better branding."*

The strongest counter-argument is that **the branding is doing useful work.** "AI project" gets
budget, attention, and executive sponsorship that "workflow automation" has never attracted, and
a team that reframes its automation as AI may simply be reading its organization correctly.
Insisting on the distinction may be technically right and strategically naive. Your position has
to survive that.

## Applied activity — "Friction map"

**Time:** 20 minutes · **Submit:** the map plus a 250–350 word write-up · **Graded against the
rubric below.**

**Step 1 — Log the week (7 min).** Your team's actual week, in blocks. Include the interrupt work
that never hits a calendar — chasing feedback, re-sending, answering the same hiring manager
question.

**Step 2 — Sort into tiers (4 min).** Throughput, insight, redesign, with a percentage
distribution. Most teams find redesign at or near zero, which is the finding.

**Step 3 — Pick one friction and run the diagnostic (6 min).** All five questions on a single real
friction point. Answer question 3 in **one sentence with no "and" in it** — if you can't, split
the problem and pick the half you'd solve first.

**Step 4 — Name your archetype (1 min).** High-volume, professional/senior, or both — and if both,
say which one your current tooling is actually optimized for.

**Step 5 — Score the prediction (2 min).** Your predicted throughput share against what you found.

Then the write-up: the one-sentence goal, whether it wants automation or an agent and why, who
owns it when it breaks, your position on the claim above with the counter-argument addressed, and
what you'd have to stop doing to make room for any redesign at all.

## Knowledge check — 6 questions

*Unlocks after the applied activity is submitted. Retakes are free and unlimited.*

**Q1.** Where does most AI spend in recruiting go, and where is most of the leverage?

- A. Spend and leverage both concentrate in insight work
- B. Spend goes to throughput and mostly belongs there; leverage is in redesign, where almost no spend goes ✓
- C. Spend goes to redesign, which is why returns disappoint
- D. Both are evenly distributed across the three tiers

> **B.** Throughput spend is genuinely well-placed — the wins are real and nobody's judgment is
> replaced. The problem is that redesign, where the funnel's actual defect lives, gets almost
> nothing.

**Q2.** Why is optimizing throughput on an early-stage screen described as the most expensive mistake available?

- A. Because throughput tools are the most costly category
- B. Because Module 1 established those stages measure nothing — so you get faster at doing something that isn't working ✓
- C. Because early-stage automation has the highest failure rate
- D. Because candidates notice automated screening and disengage

> **B.** Speed applied to a stage with no information content produces more of the same
> non-result, faster, while feeling like progress — and it consumes the attention redesign needed.

**Q3.** A vendor case study reports a 60% reduction in time-to-first-contact. What should you ask first?

- A. Which AI model the product uses
- B. Whether the customer was high-volume hourly or professional/senior ✓
- C. What the implementation cost was
- D. Whether the result has been independently audited

> **B.** In high-volume hourly, speed-to-contact is the binding constraint and this is a genuine
> win. In professional hiring it solves a non-problem — and if the archetype isn't stated, assume
> high-volume, since that's where countable wins are easiest to produce.

**Q4.** Which diagnostic question does the module say kills the most bad projects?

- A. What's the friction, specifically?
- B. Who does it hurt most?
- C. What does solved look like, in one sentence? ✓
- D. Should it even be an agent?

> **C.** Because if the sentence needs an "and," there are two problems and neither will be
> solved well. B is the most-skipped question, which is different from the most decisive one.

**Q5.** When does an agent earn its place over plain automation?

- A. When the volume exceeds what automation can process
- B. When the workflow spans multiple systems
- C. When a step requires interpreting unstructured input, so the right next action can't be drawn as a flowchart ✓
- D. When the process needs to run outside business hours

> **C.** If you can draw it, it's automation — cheaper, debuggable, and it fails visibly. Most
> "agents" sold into recruiting are rule-based flows with a language model attached for no reason.

**Q6.** Why does recruiting sit low on the autonomy ladder specifically?

- A. Because recruiting data is more sensitive than other HR data
- B. Because agent actions here are frequently visible to candidates and rarely reversible — a wrongly-sent rejection can't be unsent ✓
- C. Because ATS platforms don't support higher autonomy levels
- D. Because compliance requires human approval of all candidate communications

> **B.** The recipient of the error is a member of the public with no relationship to protect and
> a LinkedIn account. That combination is rarer in other People functions and is why this track
> defaults to the lower rungs.

## Sources and attribution

- **SHRM, *The State of AI in HR 2026*** — recruiting as the most AI-penetrated practice area
  (~27% of mapped use cases) and the practice-area distribution. **[V]**
- The three tiers, the archetype split, and the automation-versus-agent test are original to this
  course; the five-question diagnostic adapts a published practitioner framework for evaluating
  AI project proposals.
- Builds on 201 M1 (the workflow audit) and 201 M5 (the autonomy ladder), which this module
  applies rather than re-teaches.
