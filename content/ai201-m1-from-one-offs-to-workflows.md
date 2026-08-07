# AI 201 · Module 1 — From one-offs to workflows

**Course:** AI 201 · The Practitioner · Module 1 of 8
**Level transition:** L2 The Novice → L3 The Practitioner (first step)
**Estimated time:** 30 min content · 10 min sorting exercise · 20–25 min capstone activity
**Prerequisite:** AI 101 complete, or tested out

> `Concepts reviewed: [DATE] · Examples current as of: [DATE]`
> Passages marked **[V]** are volatile — tool names, product features, interface specifics. They
> refresh independently of the surrounding concepts. This module is almost entirely stable layer;
> that changes in M2, where the hands-on work begins.

---

## Calibration prompt — before you start

*One question, thirty seconds. You'll come back to it at the end of the course.*

Think of the recurring task you would most like to hand to AI.

**How many hours a month does it actually cost you right now?**

Write the number down. Most practitioners discover in Module 7 that their estimate was off by
half — in one direction or the other — and the direction says a lot about which workflows they
should build first.

---

## Module brief

You finished 101, which means you can do something most of your peers can't: predict what an AI
tool will do well before you ask, brief it properly when you do, and catch it when it's
confidently wrong. That's real fluency. And if you're honest about your week since then, you've
probably noticed something irritating about it.

Everything you do with AI, you do by hand, from scratch, every time.

You re-explain your company's voice before every draft. You re-describe what a good interview
debrief looks like every Thursday. The survey summary that took ninety minutes in March took
ninety minutes again in June, because nothing you learned in March was written down anywhere the
tool could see. You've become a skilled artisan working without a workshop — every piece
handmade, quality depending on your energy that day, nothing repeatable, nothing you could hand
to anyone else.

The jump from Novice to Practitioner is not learning more about AI. It's the jump from **tasks to
systems**: from "I used AI for this" to "this runs every week, the same way, with checks built
in, and I could show a colleague how." That jump is what this course is for, and it starts with a
change of lens, not a change of tools.

**One build, eight modules.** At the end of this module you will choose a single workflow from
your own week and write its spec. Every module that follows advances that same build: its context
pack in M2, its pipeline in M3, its verification design in M4, and so on until M8, where you run
it for real and prove what it saved. Choose like it matters, because you'll be living with this
choice for a while. The good news: this module's whole job is teaching you how to choose.

---

## Learning objectives

By the end of this module you should be able to:

1. Name the five parts every repeatable workflow has, and find them in a task you already do.
2. Audit your own week and surface the tasks that earn the workflow treatment.
3. Apply the selection rules — and explain why "most annoying" and "highest stakes" are both
   wrong answers for a first build.
4. Write a five-part workflow spec concrete enough that a colleague could challenge it.
5. State the practitioner's extension of the delegation heuristic from memory.

---

## Lesson 1 · The anatomy

Every repeatable workflow has the same five parts. Not because a framework says so, but because
when any part is missing, the thing stops being a workflow and goes back to being an improvisation.

**Trigger.** What makes it run: a day of the week, an event ("interviews finished"), an arrival
("survey closed," "notes exist"). If you can't name the trigger, you don't have a workflow — you
have a task you sometimes remember.

**Inputs.** The material you supply, and where it lives. 101's central lesson — the model knows
only what you give it — becomes an inventory question here: *which documents, in which state, from
where?* Vague inputs are where workflows quietly die.

**Transformation.** What the model actually does: summarize, restructure, draft variants,
translate registers, extract themes. One transformation per step. If you find yourself writing
"and then it also decides…" — stop. That's not a transformation, and Lesson 3 has words for you.

**Verification.** Who or what checks the output, how, and against what standard — *before* it
reaches anyone it could affect. In most people's implicit workflows this part simply doesn't
exist, which is why it gets its own module (M4) and a hard rule: you may not automate what you
can't verify.

**Output and owner.** What leaves the workflow, in what format, and — non-negotiable — the one
human whose name is on it. An output nobody owns is an incident that hasn't happened yet.

Here's the useful part: every recurring task you already do with AI has these five parts
*implicitly*. Drawing them out doesn't add bureaucracy; it exposes which part was always missing.
It's almost always verification. Sometimes it's the trigger — which is why the task happens in
March and then not again until someone's embarrassed in June.

> ### Try this — 3 minutes
> Take the last thing you used AI for at work. Any task, however small.
>
> 1. Name its five parts out loud: trigger, inputs, transformation, verification, output/owner.
> 2. Notice which one you can't name crisply.
> 3. Ask: if this ran next month without you remembering March, what would break?
>
> That missing part is not a personal failing. It's the difference between artisan work and a
> system, and it's exactly what this course builds.

---

## Lesson 2 · The audit

You can't choose a first build from memory, because memory surfaces the *loudest* task, not the
best candidate. The audit is a structured pass over your actual week, and it takes twenty minutes.

Pull up last week's calendar and sent mail. List every task that meets all three of these:

- **It recurs.** Weekly, monthly, per-event — but on a rhythm. One-offs, however painful, don't
  make the list.
- **It has a shape.** The same kind of input goes in and the same kind of output comes out, every
  time. If each occurrence is genuinely different, it's not structured — it's judgment wearing a
  routine's clothes.
- **You supply the material.** The inputs exist and you control them: your notes, your data
  export, your policy text. If the task needs knowledge nobody has written down, 101 told you
  exactly what the model will do with that gap — fill it, fluently, from nothing.

For each task that survives, score two more things, low/medium/high:

- **Stakes.** What happens if a bad version ships? A clumsy newsletter is low. Anything that
  touches a named person's pay, performance, or employment is high — and flagged for a different
  conversation entirely.
- **Current cost.** Honest hours per month. Not how much you resent it — how long it takes.

Most People leaders' audits surface the same families: interview notes → debriefs, survey
verbatims → themes, policy text → plain-language versions, data exports → narrative summaries,
bullet points → recurring communications. Yours will have its own shape, but expect between five
and ten survivors. That's your candidate pool — you only need one.

> ### Try this — the audit itself, 20 minutes
> Do the real thing, now if you can:
>
> 1. Open last week's calendar and sent mail. List recurring tasks — aim past ten before you judge
>    any of them.
> 2. Strike everything that fails the three tests: recurs, has a shape, you supply the material.
> 3. Score survivors for stakes and honest monthly cost.
> 4. Circle the three with the best cost-to-stakes ratio.
>
> Keep the list. The sorting exercise below will sharpen your instincts before you commit to one.

---

## Lesson 3 · The selection rules

You have candidates. Here is how practitioners choose — and the two seductive wrong answers to
refuse.

**Wrong answer one: the most annoying task.** Annoyance measures how you feel, not whether the
task can be systematized. The task you hate most is often hateful precisely *because* it resists
structure — every instance different, inputs scattered, judgment throughout. Building your first
workflow on it is learning to swim in a storm.

**Wrong answer two: the highest-stakes task.** The logic seems noble — "if I'm going to invest,
invest where it matters most." But your first workflow is where you'll make your learning
mistakes, and high-stakes work is where mistakes cost the most and verification is hardest to
design. You don't learn to drive on the motorway.

**The right first build scores like this:**

- **High frequency** — it runs at least weekly, so feedback comes fast and time savings compound.
- **High structure** — same shape in, same shape out, so the transformation stays simple.
- **You own the inputs** — no waiting on other people's data or undocumented knowledge.
- **Low-to-medium stakes** — a bad output embarrasses nobody and harms nobody while you learn.

Boring is a feature. The interview-notes debrief and the bullet-points newsletter are unglamorous
and perfect. Your first build's job is not to impress anyone; it's to teach you the anatomy on
something that can't hurt you, so your *second* build — the one with real leverage — inherits
working habits instead of hopeful ones.

And one boundary, before the exercise makes it concrete. 101 gave you the delegation heuristic;
201 extends it one level up, and this is the course's spine:

> **You may only systematize what you have verified by hand. And a workflow, like a model, must
> not make decisions about people — automation makes decisions faster, not fairer.**

The second sentence has teeth that surprise people. A workflow that *drafts* a rejection email
transforms material. A workflow that decides *who gets one* has crossed the line, no matter how
good the model is, and "a human clicks approve" doesn't move the line back if the human stopped
reading. M5 and M6 return to this with tooling; for now it shapes which tasks are even candidates.

### Sorting exercise — Workflow it, keep it manual, or never?

*Ten minutes. Commit before you look — an unscored guess teaches nothing.*

Twelve tasks from a People leader's real week. Sort each into **workflow it**, **keep it
manual**, or **never systematize**.

1. Turning each week's interview notes into structured debriefs
2. Drafting the monthly people-metrics narrative from a data export you own
3. Deciding which of two finalists receives the offer
4. Refreshing job postings each quarter to strip jargon and drift
5. Responding to an employee's grievance email
6. Summarizing exit-interview verbatims at quarter end
7. Setting performance ratings ahead of calibration
8. Drafting the weekly HR newsletter from bullet points you supply
9. Writing this year's reduction-in-force communication
10. Translating policy updates into plain-language change notes
11. Screening résumés for a hard-to-fill role
12. Preparing talking points for a sensitive conversation with a specific employee

The pattern the key will show you, stated in advance so you can test it as you sort:

> **Workflow the recurring transformations of material you own. Keep manual the judgment calls
> wearing repetitive clothes — and anything that happens once. Never systematize decisions about
> people.**

---

## Capstone stage 1 · Pick it and spec it

This is the module's applied activity, and the first artifact of your eight-module build.

**Choose one workflow** from your audit — the selection rules are your guide, and "boring but
weekly" beats "impressive but quarterly."

**Predict first, two numbers.** Before writing the spec, record: (1) honest hours per month the
task costs you today; (2) the percentage of that time you expect the workflow to save within a
month of shipping. As with everything calibration in this course, you're graded on honesty and
specificity, never on being right.

**Write the five-part spec:**

- **Trigger** — what makes it run, concretely enough to schedule.
- **Inputs** — each source of material, where it lives, and what state it arrives in.
- **Transformation** — what the model does, as verbs. One transformation per step; if you need
  three steps, say so.
- **Verification** — how you'll check output before it ships, even roughly. "I read all of it"
  is legitimate at this stage; M4 will make it cheaper. A blank here is the one thing the spec
  can't survive.
- **Output and owner** — format, destination, and the named human accountable. (That's you. Write
  it anyway. It matters in M8, when someone else runs this.)

**Then defend the choice** in a paragraph: why this one, against the selection rules — frequency,
structure, input ownership, stakes. If you rejected a more tempting candidate, say which and why.
That reasoning is worth more than the spec itself.

**[V]** Where to keep it: start a dedicated Claude Project for your build and put the spec in its
knowledge. Every module from M2 on adds to that same Project — by M8 it will contain your whole
workflow. If your organization uses a different provisioned tool, your deployment's lab track
shows the equivalent home.

### Rubric — 20 points

| Dimension | 5 points |
|---|---|
| **Spec concreteness** | All five parts present and specific enough that a colleague could challenge them. Inputs name real sources; the transformation is verbs, not vibes. |
| **Selection reasoning** | The choice is defended against the selection rules, honestly scored for frequency, structure, ownership, and stakes — including what was rejected and why. |
| **Verification exists** | The verification part is present and matched to stakes. It can be modest; it cannot be missing or hand-waved. |
| **Calibration** | Both predictions recorded before the spec, with enough specificity to score in M7. Honesty and precision graded; accuracy never. |

---

## Key takeaways

- **Fluency isn't practice.** 101 taught you to use AI well; nothing about using it well makes it
  repeatable. That's a different skill, and it's a systems skill.
- **Five parts, always:** trigger, inputs, transformation, verification, output-with-owner. The
  part you can't name is the part that fails in June.
- **Audit, don't remember.** Memory nominates the loudest task; the calendar and sent mail
  nominate the true candidates.
- **First build: high frequency, high structure, owned inputs, low stakes.** Boring is a feature.
  The impressive build comes second, and inherits working habits.
- **The practitioner's heuristic:** only systematize what you've verified by hand — and a
  workflow must not make decisions about people. Automation makes decisions faster, not fairer.

---

## Sorting exercise — answer key

**Workflow it** — recurring transformation of material you own:
**1** (interview debriefs — the canonical first build: weekly, structured, your notes),
**2** (metrics narrative — your export, same shape monthly; verification catches the numbers),
**4** (job posting refresh — quarterly but perfectly structured, pure transformation),
**6** (exit verbatims — same pattern as engagement summaries in 101's sorting exercise, with the
same caveat: read the raw comments too),
**8** (newsletter — low stakes, weekly, you supply every bullet),
**10** (policy change notes — text in, plainer text out).

**Keep it manual** — judgment wearing a routine's clothes, or a true one-off:
**5** Grievance response — arrives on a rhythm, but each one is a distinct human situation
carrying legal weight. AI can help you *understand* a policy; the response is authored, not
generated.
**9** RIF communication — a one-off, and one of the highest-stakes documents you'll ever write.
Fails the "recurs" test before stakes even enter it.
**12** Sensitive-conversation prep — the material that matters (history, relationship, what you
know that isn't written down) is exactly what no system holds.

**Never systematize** — decisions about people:
**3** The offer decision, **7** performance ratings, **11** résumé screening — all three for the
same reason, and it isn't capability. These are the decisions where 101's bias lesson stops being
abstract: automation reproduces patterns at scale and speed, and adverse impact is the mechanism.
Résumé screening deserves its own flag: it's also where your *vendors* quietly systematize the
decision for you — you wrote the questions to ask them in 101, Lesson 3.

**If you missed several, look at which kind.** Putting judgment calls in "workflow it" means
you'll build something that launders discretion through a template. Putting good transformations
in "keep it manual" means the artisan tax continues for no reason. Both are fixable; that's what
the selection rules are for.

---

## Knowledge check — 8 questions

*Unlocks after the capstone spec is submitted. Retakes are free and unlimited.*

**Q1.** What most reliably separates a workflow from a one-off AI task?
- A. It uses a more capable model
- B. It has a named trigger, and runs the same way without you re-inventing it each time ✓
- C. It saves more than an hour a week
- D. It involves more than one prompt

> **B.** The anatomy is the definition: a trigger and a repeatable shape. Model choice, time
> saved, and prompt count are all properties a workflow *might* have; the trigger and the
> sameness are what make it one.

**Q2.** Which part of the anatomy is most often missing from people's implicit workflows?
- A. The trigger
- B. The inputs
- C. Verification ✓
- D. The output format

> **C.** Almost everyone has an intuitive trigger, inputs, and output. Almost nobody has designed
> the checking step — which is why it gets its own module and why the spec cannot ship without it.

**Q3.** Why is "the task that annoys me most" a poor basis for a first build?
- A. Annoying tasks are usually someone else's responsibility
- B. Annoyance often signals the task resists structure — each instance different, judgment throughout ✓
- C. First builds should target the highest-stakes work instead
- D. It isn't — high annoyance is a good proxy for high value

> **B.** The tasks that grate hardest often do so *because* they won't routinize. And C is the
> other seductive wrong answer: high stakes belong with your second build, after the habits work.

**Q4.** A workflow drafts rejection emails from your notes on each candidate. Another selects which candidates receive them. Under the practitioner's heuristic:
- A. Both are acceptable if a human clicks approve
- B. Neither is acceptable in People work
- C. The first transforms material you supply; the second makes a decision about people, and stays with a human ✓
- D. Both are acceptable once the model is accurate enough

> **C.** Drafting is transformation — the center of the model's competence. Selection is a
> decision about a person, and the heuristic's second sentence doesn't bend for accuracy (D) or
> for a rubber-stamp click (A) if the human has stopped genuinely deciding.

**Q5.** What makes "you supply the material" a hard requirement for a workflow candidate?
- A. Supplied material is cheaper to process
- B. Without it, the model fills the gap with fluent invention — 101's central failure mode, now on a schedule ✓
- C. It's a data-privacy requirement
- D. It keeps the context window small

> **B.** A one-off hallucination is an error; a scheduled workflow built on missing inputs is an
> error *generator*. The audit's third test exists to catch this before you build on it.

**Q6.** Your first build should score:
- A. High frequency, high structure, owned inputs, low-to-medium stakes ✓
- B. High stakes, high visibility — invest where it matters most
- C. Low frequency, so mistakes surface slowly
- D. Whatever your manager most wants automated

> **A.** Fast feedback, simple transformation, no dependency on others' data, and mistakes that
> can't hurt anyone while you learn. The high-stakes build is the second one.

**Q7.** The audit uses last week's calendar and sent mail rather than your recollection because:
- A. Memory surfaces the loudest task, not the best candidate ✓
- B. Calendars record time more precisely
- C. It produces documentation for your manager
- D. Sent mail shows which tasks involve other people

> **A.** The point is candidate *selection*, and recollection is biased toward recency and
> resentment. The paper trail is flatter and more honest.

**Q8.** "A workflow, like a model, must not make decisions about people." The strongest reason, from this course:
- A. Regulation prohibits all AI involvement in HR decisions
- B. Models aren't yet accurate enough for employment decisions
- C. Automation reproduces bias patterns at scale and speed — adverse impact's mechanism — and accuracy doesn't cure it ✓
- D. Employees prefer decisions made by humans

> **C.** A is false (regulation targets specific decision contexts, as 101 covered), and B fails
> because the rule survives arbitrary accuracy: the issue is what a decision *is*, not how well a
> system scores. D may be true but is not the mechanism.

---

## Sources and attribution

Builds directly on AI 101 Module 1 (delegation heuristic, training-data bias, vendor questions)
and Module 6 (verification habits). Workflow anatomy synthesized for this course; the
selection-rule framing (frequency × structure × ownership × stakes) is original to the course.
*Cross-references to be verified against the final 101 module numbering before publication.*
