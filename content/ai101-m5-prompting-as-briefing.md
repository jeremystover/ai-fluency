# AI 101 · Module 5 — Prompting as briefing

**Course:** AI 101 · The Foundation · Module 5 of 8
**Estimated time:** 35 min content · 10 min exercise · 20–25 min applied activity
**Prerequisite:** M1 — you can't brief well without knowing what you're briefing
**Builds on:** M1 (the model knows nothing about your org) · M4 (supplying material safely)
**Feeds:** 201 M2 (context that keeps — the briefing library)

> `Concepts reviewed: [DATE] · Examples current as of: [DATE]`
> Tool features (attachment handling, conversation controls) are **[V]** volatile layer.
> The briefing discipline is stable. It would have worked on the first chat models and
> will work on the next ones.

---

## Calibration prompt — before you start

*One prediction, thirty seconds. You'll score it during the applied activity.*

At the end of this module you'll run the same real task twice: once with the kind of one-line
prompt most people type, once with a proper brief. You'll compare the outputs side by side.

**How much better do you expect the briefed version to be, on a 1–10 scale?** Where 1 means
"barely different" and 10 means "unrecognizably better — the thin version was unusable."
Write your number down.

People who've never briefed properly tend to guess 3 or 4: the tool already seems pretty
good, how much better could it get? The gap surprises in a specific way: it's not that the
briefed output is more polished. It's that it's *yours*, the thin prompt's output could have
been written for any company on earth.

---

## Module brief

You know from M1 why the model needs material: it has never seen your organization, and what
you don't supply, it invents. M4 taught you to supply documents safely. This module is about
the other half of what the model needs — and it starts with the mental model that quietly
ruins most people's results.

Most people prompt like they search. Short query, sparse context, hit enter, judge the
result: *"write interview questions for a program manager role."* Against a search engine,
that works: the query just has to *match* something that exists. Against a model that
*generates*, it fails in a specific way: every detail you didn't specify gets filled from the
statistical average of everything the model has seen. Level, competencies, your interview
philosophy, what good answers sound like, all averaged. The output isn't wrong. It's
*generic*, which for your purposes is the same thing wearing better clothes.

The fix is a different mental model: **prompting is briefing a capable stranger.** Specifically:
a talented contractor on their first day — sharp, widely read, infinitely willing, and
knowing absolutely nothing about your organization, your standards, or what happened in the
meeting before this one. You already know how to brief such a person; you've onboarded
dozens. You'd never say "write interview questions" and walk away. You'd say who's hiring,
for what, what matters, what to avoid, what the output should look like, and you'd expect
their second draft to beat their first, because your feedback is part of the process.

That's the whole module. Four parts of a brief, the iteration habit that turns an okay first
draft into your draft, and the single strongest lever (examples) plus where to get them
without violating M4. None of it is technique for its own sake: every piece maps to
something the mechanism in M1 predicts.

## Learning objectives

By the end of this module you should be able to:

1. Explain why "briefing a capable stranger" produces good prompts where "typing a search
   query" produces generic ones: in M1's vocabulary, not as folklore.
2. Build a brief from the four parts (role, task, context, format) and say what each part
   buys you mechanically.
3. Treat the first output as a draft of the *brief*: diagnose what's off, and steer with the
   four moves that reliably work.
4. Use examples as the strongest single lever, sourced from your own work without violating
   M4's tiers.
5. Recognize when a brief has hit diminishing returns — and when the task itself was the
   wrong delegation (M1's heuristic, closing the loop).

## Lesson 1 · Briefing a capable stranger

Watch the two mental models produce two different prompts for the same Monday task.

*The search query:* "write a job description for a senior data analyst."

*The brief:* "You're helping a People team at a 400-person healthcare company write a job
description. The role: senior data analyst on the People Analytics team, reporting to me:
first dedicated analytics hire, so they'll build the function, not inherit it. We compete
for talent against tech companies but can't match their comp; we win on mission and scope.
Tone: direct and warm, no corporate filler, here are two recent postings of ours that got
the tone right [attached]. Draft the posting: 400–500 words, structured as hook, role,
must-haves (keep to five), nice-to-haves, comp range $95–115k."

Read what the second prompt is doing through M1's mechanism. Every sentence *pins* something
that would otherwise float to the statistical average: the company size and industry pin the
register; "first hire, builds the function" pins the seniority framing; "can't match tech
comp, win on mission" pins the persuasion strategy; the attached postings pin the voice; the
structure list pins the shape. The model generates one fragment at a time from everything in
view — so everything you put in view is a constraint on what gets generated, and everything
you leave out is a dimension where you've delegated the choice to the training data's
average. A brief isn't politeness. It's *narrowing the prediction*.

One reframe makes the discipline stick: **the brief is where your expertise enters the
system.** People worry AI will make their skills irrelevant; the mechanism says the opposite.
Two people with the same tool and the same task get wildly different results, and the
difference is exactly the judgment in their briefs, knowing that the comp positioning
matters, that five must-haves is the ceiling before candidates self-deselect, that your org's
voice is direct-and-warm. The tool amplifies the expertise you articulate. It can't amplify
what you didn't say.

> ### Try this — 2 minutes
> Take the last prompt you actually typed into an AI tool. Rewrite the *first sentence* as
> you'd open a briefing to a first-day contractor: who you are, what this is for. Just that
> one sentence. Notice how much it already pins.

## Lesson 2 · The four parts

A workable brief has four parts. You won't always need all four at full strength, but when
an output disappoints, one of these is almost always the missing part, and knowing which is
the diagnostic skill.

**Role.** Who the model should be, and who it's working for: "You're an experienced HR
communications writer helping a People team at a manufacturing company." Role pins register,
vocabulary, and level of assumed knowledge — the difference between output aimed at HR
professionals and output aimed at everyone.

**Task.** The verb and the deliverable, sharply: not "help me with our engagement survey"
but "draft the five open-ended questions for the manager-effectiveness section." One task
per ask, M1's tug-of-war applies: pile four jobs into one prompt and the middle jobs get
half attention. (When work genuinely has multiple stages, run them as stages — 201 M3 makes
a discipline of it.)

**Context.** The part People leaders skip most, because it's the part that feels obvious *to
you*, and nothing is obvious to a system that has never seen your organization. What's the
situation, who's the audience, what constraints bind, what happened already, what does
success look like? Context is also where M4's material goes: the attached policy, the
redacted examples, the survey verbatims. Rule of thumb: if a first-day contractor would need
to know it, it goes in the brief. If they'd need to know it and you *can't* share it (Tier
3–4 unredacted), that's not a prompting problem — handle it with M4's discipline before it
enters the window.

**Format.** What the output should literally look like: length, structure, headings, table
or prose, tone reference. Format is the cheapest quality win available — "500 words, three
sections, plain language, no bullet-point walls" costs you ten seconds and saves an entire
revision round, because format is otherwise decided by the training data's average, and the
training data's average loves bullet-point walls.

Two calibration notes. First, scale the brief to the stakes: a two-line prompt is *correct*
for "make this email friendlier": the four parts are a diagnostic checklist, not a form to
fill. Second, when you find yourself re-typing the same role and context every morning,
you've discovered the tax that 201 M2 eliminates with a briefing library. Feel the tax for
now; it's motivation.

## Lesson 3 · Iteration is the skill

Here is the sentence that separates fluent users from frustrated ones: **the first output is
a draft of the brief, not the work.** When it disappoints, the frustrated user concludes the
tool is overhyped and quits; the fluent user reads the output *as information about what the
brief failed to pin* and steers. Fluent users iterate two or three times as a matter of
course. It's not remedial. It *is* the workflow.

Four steering moves cover most situations:

**Name what's wrong, specifically.** "Make it better" re-rolls the dice. "The tone is too
formal for our culture, and must-have #3 would exclude the internal candidates we want".
That's new constraint, and the mechanism gives you a visibly different next draft. If you
can't name what's wrong, that's your signal the *task* was under-specified: what would good
look like? Answer that, then say it.

**Supply what's missing.** When output goes generic in a specific area, that area needed
material: attach the document, paste the (M4-safe) example, state the fact it invented.

**Constrain the format.** Structure drifting, length ballooning, bullet-walls returning —
re-pin: "keep to 400 words, prose, no bullets."

**Ask for variants.** When you can't articulate what's off: "give me three versions,
formal, direct, warm." Recognition is easier than specification; picking beats describing,
and the one you pick becomes an example (next lesson) for everything after.

Two boundaries keep iteration honest. **Know when to stop:** each round should produce a
visibly better draft; two rounds of sideways movement mean stop steering and start editing.
You're the senior editor, and the last 10% is usually your judgment, which was never
delegable. And **know when it was the wrong delegation:** if iteration keeps failing on the
same dimension (the output can't get *your org* right no matter what you say) check the
task against M1's heuristic. Needs organizational knowledge you can't supply (Tier 4, or
tacit)? Judgment call about a person? No amount of briefing fixes a delegation error.

> ### Try this — 3 minutes
> Find a disappointing AI output from your recent history (everyone has one). Diagnose it
> against the four parts: which was missing? Write the one steering message you'd send now —
> name what's wrong, supply what's missing, or re-pin the format. If you can't write it,
> notice why: was it the brief, or was it the delegation?

## Lesson 4 · Examples — the strongest lever

Everything in Lessons 1–3 describes what you want. An example *shows* it, and for reasons
straight out of M1, showing beats describing every time. Describing your tone ("direct and
warm, professional but not stiff") makes the model interpret adjectives, and adjectives are
generic: a thousand companies' "direct and warm" averaged together. Attaching two
announcements that *sound like you* makes the model continue a demonstrated pattern.
Patterns pin what adjectives wave at: sentence length, greeting conventions, how much warmth,
where the caveats go, what never gets said.

The practice is almost embarrassingly simple: **one or two good examples of the output you
want, attached to the brief.** "Draft the promotion announcement — here are two past ones
that got it right" outperforms three paragraphs of tone description, every time, and takes
less effort to assemble. Three refinements make it work harder:

**Curate for the property you want copied.** The example teaches everything it contains:
structure, length, tone, *and* flaws. Pick examples excellent in the dimension that matters,
and say which dimension: "match the tone of these, not the length."

**Show the transformation, not just the destination.** For recurring conversions (messy
notes → structured debrief) one before/after pair teaches the mapping better than any
instruction list. This is the seed of the reusable workflow 201 builds.

**Source them M4-safely.** Examples are supplied material; the tiers apply. Template
language and published docs: clean. A past PIP as a format example: Tier 3, redact it with
Lesson 4's discipline (the *format* is what you want copied; the person in it is exactly
what shouldn't travel). Building a small library of sanitized, excellent examples (your
best JD, announcement, debrief, scrubbed once and reused forever) is 201 M2's briefing
library arriving early. Start the folder this week.

## Key takeaways

- **Brief a capable stranger; don't type a search query.** A talented first-day contractor:
  infinitely willing, completely ignorant of your organization. You already know how to
  brief that person.
- **Every unpinned detail floats to the training data's average.** A brief works by
  narrowing prediction — role pins register, task pins the deliverable, context pins your
  reality, format pins the shape. The part People leaders skip is context, because it's
  obvious, to them.
- **The brief is where your expertise enters the system.** Same tool, same task, different
  results: the difference is the judgment articulated in the brief. The tool amplifies
  what you say, not what you know.
- **The first output is a draft of the brief.** Steer: name what's wrong, supply what's
  missing, constrain the format, ask for variants. Two sideways rounds → stop steering,
  start editing.
- **Examples beat descriptions.** One or two curated, M4-safe examples pin what adjectives
  can't. Say which property to copy. Start the sanitized-examples folder now — 201 turns it
  into a library.
- **Some failures are delegation errors, not briefing errors.** If iteration keeps missing
  on organizational knowledge you can't supply (or the task judges a person) no brief
  fixes it. That's the heuristic, still in charge.

## Applied activity — "Brief It Twice"

**Time:** 20–25 minutes · **Submit:** both prompts, both outputs (or faithful excerpts),
and a 250–350 word comparison · **Graded against the rubric below.** Score doesn't matter.
Doing the work is where the learning lands.

Pick one real writing or transformation task from your actual week — a JD, an announcement,
turning notes into a debrief, a policy summary for managers. M4 rules apply: redact anything
Tier 3 before it enters the window.

**Step 1. The thin version (3 min).** Prompt the task the way most people would: one or two
lines, no context. Save the output. Don't soften the thinness to make the comparison kinder:
the honest baseline is the experiment.

**Step 2 — The brief (10 min).** Fresh conversation **[V]**. Build the full four-part brief:
role, task, context (including at least one attached or pasted piece of M4-safe material:
an example counts), format. Save the output.

**Step 3. One steering round (5 min).** Whatever the briefed draft got most wrong, steer it
with one of the four moves. Save the result. (If it got nothing wrong, say so — and steer
for a variant anyway to see what moves.)

**Step 4. Score the prediction (2 min).** Side by side: thin vs. final. Your 1–10
improvement score, versus what you predicted at the top of the module. Direction of miss,
one-sentence theory.

Then the comparison: which of the four parts did the most work (point to specific
differences in the outputs), what the steering round changed, and the one-sentence briefing
rule you're taking into next week.

## Knowledge check — 8 questions

*Unlocks after the applied activity is submitted. Retakes are free and unlimited.*

**Q1.** Why does "write interview questions for a program manager role" produce generic output, mechanically?

- A. The model can't access current examples of interview questions
- B. Every unspecified detail (level, competencies, philosophy) is filled from the statistical average of the training data ✓
- C. The prompt is too short for the model to process reliably
- D. Interview design requires reasoning that models can't perform

> **B.** The model generates from everything in view; what's not in view gets the average.
> The output isn't wrong. It's *anyone's*, which is the failure. A, C, and D mislocate the
> problem: it's not access, length, or capability. It's an unpinned prediction.

**Q2.** The "capable stranger" of the mental model is a talented contractor who is:

- A. Sharp and widely read, but knows nothing about your organization, standards, or prior conversations ✓
- B. Experienced at your company but unfamiliar with AI tools
- C. Skilled but unreliable, requiring you to verify every claim
- D. Knowledgeable about your industry but weak at writing

> **A.** Capability without organizational knowledge — exactly M1's model. You'd never hand
> that person a one-line request and walk away; the whole discipline follows from taking the
> mental model seriously. C is true of models (M6's subject) but it's not what *this* frame
> is teaching.

**Q3.** Of the four parts, which do People leaders most commonly under-supply, and why?

- A. Role. It feels presumptuous to assign the model a persona
- B. Task, deliverables are hard to define in People work
- C. Context — because it's obvious to them, and nothing is obvious to a system that has never seen their organization ✓
- D. Format, output structure can't be controlled reliably

> **C.** The curse of knowledge: the situation, audience, and constraints feel too obvious
> to state. The stranger test breaks the curse, if a first-day contractor would need it, it
> goes in the brief. D is exactly backwards: format is the cheapest control you have.

**Q4.** A briefed draft comes back with the wrong tone and one requirement that would exclude internal candidates. What's the fluent move?

- A. Start over with a longer brief in a fresh conversation
- B. Accept it — first drafts reflect the model's actual capability ceiling
- C. Reply "make it better" and regenerate until it improves
- D. Name both problems specifically (the tone gap and the excluding requirement) as new constraints ✓

> **D.** Specific critique is new information that narrows the next generation; that's
> steering. "Make it better" (C) re-rolls the dice with no new constraint. A wastes a
> mostly-good draft; B mistakes an unpinned brief for a capability ceiling: the core
> frustrated-user error.

**Q5.** Iteration has gone two rounds and the draft is moving sideways, not improving. The discipline says:

- A. Keep iterating, quality is a function of round count
- B. Stop steering and start editing — the last stretch is your judgment, which was never delegable ✓
- C. Switch to a more capable model tier and re-run the brief
- D. The task was mis-delegated and should not have used AI

> **B.** Each round should visibly improve the draft; sideways movement means the remaining
> gap is editorial judgment, yours. C is M3's escalate-on-evidence, but "sideways" isn't
> capability evidence. D is the right call only when iteration keeps failing on the *same
> organizational-knowledge dimension*: a different signature than diminishing returns.

**Q6.** Why does attaching two past announcements outperform three paragraphs describing your company's tone?

- A. Attachments are weighted more heavily than prompt text
- B. Adjectives get interpreted as the average of everyone's "direct and warm"; a demonstrated pattern pins sentence length, warmth, and structure directly ✓
- C. It doesn't — precise description and examples perform identically
- D. Examples save typing but produce the same output quality

> **B.** Describing makes the model interpret generic words; showing gives it a pattern to
> continue, M1's mechanism again. The refinements matter because the example teaches
> *everything* it contains: curate for the property you want, and say which. A invents a
> weighting rule; C and D deny the lever this lesson exists to hand you.

**Q7.** You want to use a past PIP as a format example for drafting a new one. The M4-safe move is:

- A. Attach it as-is, format examples aren't really "using" the content
- B. Don't use examples for sensitive document types; describe the format instead
- C. Redact it first (generalize identifiers, break the joins) because the format is what you want copied and the person is what shouldn't travel ✓
- D. Paste it with an instruction telling the model to ignore the personal details

> **C.** Examples are supplied material, so the tiers apply — and redaction preserves
> exactly what the example is for (structure, register) while removing what it must not
> carry (the person). D is M4's named anti-pattern: the data enters the tool regardless of
> what the output ignores. B surrenders the strongest lever unnecessarily.

**Q8.** After four steering rounds, output for "draft talking points for Friday's restructuring announcement" keeps inventing wrong specifics: who's affected, what changes. The brief can't include the real details: the reorg is confidential and the details are Tier 3–4. What's the honest diagnosis?

- A. A delegation problem, not a briefing problem: the task needs material that can't travel, so this part of the work stays with you ✓
- B. A briefing problem — a more detailed role and format section would fix the inventions
- C. A capability problem: a frontier-tier model would stop inventing the specifics
- D. An iteration problem, steering moves need several more rounds to converge

> **A.** The failure signature from Lesson 3: iteration keeps missing on the same
> dimension, and the missing dimension is material you *can't* supply. M1's heuristic closes
> the loop — what the model isn't given, it invents, and no brief, tier, or round count
> changes that. The fluent user drafts the shareable scaffolding and keeps the specifics
> human.

## Sources and attribution

This module draws on the following material:

- **The AI Fluency Framework** (Rick Dakan & Joseph Feller, in collaboration with Anthropic,
  CC BY-NC-SA 4.0), the briefing-over-querying stance and the treatment of iteration as
  core practice adapt its "Delegation" and "Description" competencies for the People-leader
  context.
- **Anthropic's published prompting guidance**, the role/task/context/format decomposition
  is consistent with provider best-practice documentation, which evolves; check current
  guidance for tool-specific features. **[V]**
- The capable-stranger framing, the four steering moves, and the M4-safe example-sourcing
  discipline are original to this course.
