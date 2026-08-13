# AI 201 · Module 3 — Document pipelines

**Course:** AI 201 · The Practitioner · Module 3 of 8
**Estimated time:** 35 min content · 10 min exercise · 30 min capstone lab
**Prerequisite:** none beyond 101 — but the capstone stage assumes your M1 spec and M2 pack
**Builds on:** 101 M1 (context window, "one fragment at a time") · 201 M1 (one transformation per step) · 201 M2 (the pack)

> `Concepts reviewed: [DATE] · Examples current as of: [DATE]`
> Lesson 3 and the lab are **[V]** volatile layer — tool-specific, refreshed independently,
> tailored to your organization's provisioned tools.

---

## Calibration prompt — before you start

*One claim and one number. Commit both before you read.*

> **"I know which step of my workflow degrades quality most."**

**True of me, or not true of me?** One sentence. Degrade, not fail — the steps that fail loudly are
the ones you already know about.

**And the number**, which you will score in the applied activity:

By the end of this module you'll have designed your workflow as a pipeline — a chain of small
steps — and run it on real material.

**Which step do you expect to degrade quality most?** Not fail loudly — degrade: lose detail,
flatten nuance, drop the thing that mattered. Name the step and write one sentence on why.

Almost nobody guesses right the first time, and the miss teaches you where your verification
budget should go. That's M4's opening move.

## Module brief

Here is a prompt a smart, 101-fluent person writes every quarter:

> "Here are 200 survey comments. Summarize the themes, pull representative quotes, note anything
> concerning, and draft a summary for the exec team in our company voice."

One prompt, four jobs. The output arrives fluent and confident, and it is quietly worse than it
looks — themes flattened, one office's problem averaged into "minor concerns," a quote that's
almost-but-not-quite what anyone wrote. Worst of all, there's nothing to check: when the final
prose is wrong, you can't see *where* it went wrong, because everything happened in one
invisible leap.

You know from 101 why this happens. The model generates one fragment at a time, each predicted
from everything in view; ask it to juggle four objectives across two hundred comments and the
middle objectives lose the tug-of-war quietly. More instructions in one prompt doesn't mean more
gets done — it means everything competes.

The practitioner's move is the same one every other discipline made when work got serious:
**break the leap into steps with inspectable states in between.** Summarize → extract →
transform → format, each step doing one job, each producing an artifact you can read before the
next step consumes it. This is a pipeline, it is the transformation line of your M1 spec grown
up, and designing one well is mostly about knowing where chains break: long documents, lossy
middles, and formats that drift.

One promise before we start: this is not about making everything elaborate. Most tasks still
deserve a single prompt. The skill is knowing which tasks don't — and building the smallest
chain that fixes them.

---

## Learning objectives

By the end of this module you should be able to:

1. Explain why one mega-prompt loses to a short chain — in the mechanism vocabulary of 101, not
   as folklore.
2. Design a checkpoint: an intermediate artifact a human could actually catch an error in.
3. Recognize the lossy middle — the step where structure becomes prose and detail dies — and
   defend against it.
4. Run a multi-step pipeline in your organization's tool, carrying artifacts forward cleanly. **[V]**
5. Know when *not* to chain: the single-prompt tasks that chains only slow down.

---

## Lesson 1 · Chain thinking

A pipeline is three design decisions, repeated: what each step does, what it hands to the next
step, and what you look at in between.

**One transformation per step.** M1's rule, now load-bearing. "Extract the themes" is a step.
"Extract the themes and draft the summary" is two steps written as one prompt, and the model
will do the first at half attention while performing the second. If your step prompt contains "and
then also," split it.

**Structured intermediates.** What a step hands forward should be *more* structured than what
it received: a table, a list with counts, sections with headings — not polished prose. Two
reasons. The next step predicts better from structure than from narrative (you're supplying
cleaner material — 101's central lever). And structure is checkable: a count can be verified, a
quote can be traced. Prose can only be believed.

**Checkpoints, honestly defined.** An intermediate artifact is only a checkpoint if a human
glancing at it could catch a real error. "Themes: communication, workload, recognition" checks
nothing — it would look identical whether the analysis was faithful or invented. "Communication:
41 mentions, 9 strongly negative, concentrated in the Denver office, sample quotes below" is a
checkpoint: every claim in it can be spot-checked against the raw comments in two minutes. When
you design a step, design what failure would look like at its checkpoint — if you can't say what
a wrong version would show, the checkpoint is decoration.

**Fresh context per step.** Each step should see its input artifact, the relevant pack material,
and nothing else. Don't run a whole pipeline down one endless conversation out of convenience:
101 told you what happens when the window fills — early material drops out of view, and your
step 3 quietly stops seeing the instructions from step 1. (Lesson 3 shows the clean mechanics.)

**And the counterweight: don't chain what doesn't need it.** A chain earns its friction under
three conditions — the input is long, the stakes are real, or a failure would be invisible in
final prose. "Rewrite this paragraph plainly" meets none of them; one prompt, done. The
practitioner's tell isn't elaborate pipelines everywhere; it's *small* pipelines exactly where
the three conditions hold, and single prompts everywhere else.

> ### Try this — 2 minutes
> Take the most complex prompt you've written this month — the one with several jobs in it.
>
> 1. Count the distinct transformations it asks for. (Verbs are the tell: summarize, pull,
>    note, draft — that's four.)
> 2. For each, ask: if this part came back subtly wrong, would I be able to see that in the
>    final output?
> 3. Every "no" is a place a checkpoint would have caught what you currently can't.

---

## Lesson 2 · The People-work gallery

Three pipelines that cover most of what a People team feeds to a model. Learn the shapes — your
own workflows will mostly be one of these wearing different clothes.

### Pipeline 1 · Survey verbatims → themes → exec summary

- **Step 1 — Extract** (comments in → theme table out): themes with counts, intensity,
  *concentration* (which office, which function), representative quotes verbatim, and an
  explicit section for minority and dissenting signals. The prompt says: preserve counts, quote
  exactly, never average away a concentrated problem.
  **Checkpoint:** pick two themes, spot-check counts and quotes against the raw comments. 101's
  survey caveat — the model flattens minority views — is *engineered against* here, not hoped
  against.
- **Step 2 — Narrate** (theme table in → analysis draft out): draft the narrative *from the
  theme table only* — the raw comments are deliberately out of view, so the narrative can't
  quietly re-analyze. The prompt requires every claim to carry its number and concentration.
  **Checkpoint:** every sentence traceable to a table row.
- **Step 3 — Format** (draft in → exec-pack section out): voice, length, layout from your pack.
  No new facts may enter. **Checkpoint:** diff-read — formatting changed, claims didn't.

### Pipeline 2 · Policy update → change list → plain-language note

- **Step 1 — Enumerate** (old + new text in → change table out): every changed clause, old
  wording, new wording, one line each. The prompt's key instruction: *enumerate, don't
  summarize* — a "summary of changes" is exactly the lossy move that lets a changed clause slip
  through unannounced. **Checkpoint:** mechanical — walk the table against the documents; it's
  complete or it isn't.
- **Step 2 — Explain** (change table in → plain-language explanations out): what each change
  means for an employee, in the register your pack defines, flagged where a change might be
  contentious. **Checkpoint:** explanations match clauses; the flags look right to someone who
  knows the org.
- **Step 3 — Draft** (explanations in → comms note out): the note itself, pack voice, standard
  disclaimers. This step also gets a standing reminder from 101: general statutory framing may
  ride along, but *your jurisdiction's specifics get verified by a human, every time*.

### Pipeline 3 · Interview notes → debriefs → decision packet

- **Step 1 — Structure per candidate** (your notes in → structured debrief out): evidence
  organized under your competency headings — from the notes only, gaps flagged as gaps ("notes
  don't cover competency X"), never filled. One run per candidate, so no cross-contamination.
  **Checkpoint:** every claim traceable to something you actually wrote down.
- **Step 2 — Assemble** (debriefs in → packet out): side-by-side *evidence* — where each
  candidate showed what, where the gaps are. The prompt explicitly does not ask for a ranking or
  recommendation, because M1's line hasn't moved: the packet informs a human decision; it is not
  the decision. **Checkpoint:** the packet contains comparisons of evidence and zero verdicts.
- **Step 3 — Format** for the debrief meeting, pack template.

**The shape underneath all three:** the first step turns raw material into structure and
preserves traceability (counts, quotes, clauses, sources). Middle steps transform structure
*into* structure. The last step — and only the last — is allowed to make prose. Hold that shape
and notice where the danger concentrates: the step where structured detail becomes readable
narrative. That's the lossy middle, and it's where the exercise below takes you.

### Exercise — Find the lossy step

*Five minutes. Commit before you look.*

A People team ran Pipeline 1 on their Q2 survey. Here are the actual artifacts, abridged:

**Raw comments (step 0):** 214 comments. Among them, 41 mention manager communication; 9 of
those are strongly negative, and all 9 come from the Denver office.

**Theme table (after step 1):** "Manager communication — 41 mentions · 9 strongly negative ·
negative mentions concentrated in Denver · quotes: [three verbatim quotes]."

**Narrative draft (after step 2):** "Some employees expressed concerns about manager
communication, though sentiment in this area was mixed rather than uniformly negative."

**Exec summary (after step 3):** "Overall sentiment remains positive, with minor communication
concerns noted."

By the final artifact, a localized problem — nine strongly negative comments from one office —
has become "minor concerns." **Which step killed the signal?** Commit to an answer, and to one
sentence on how you'd fix that step's prompt.

*(Key at the end of the module. The exercise is rigged to teach one specific reflex: read the
artifacts, not the vibes.)*

---

## Lesson 3 · The lab — running a pipeline in Claude **[V]**

*Volatile layer: specific tool, current mechanics, tailored to your organization's provisioned
tools.*

Your pipeline lives in the same Project as its pack (M2). Two additions make it runnable.

**The runbook.** One knowledge document — "Pipeline: [workflow name]" — holding each step's
prompt, numbered, with its expected input and output format. Step prompts are pack content by
M2's own test: durable, impersonal, reviewed on a cadence. When you improve a step prompt after
a bad run, you improve it *in the runbook* — fix the pack, not the output.

**One conversation per step.** Start a fresh conversation in the project for each step; give it
the step prompt and the incoming artifact; take the outgoing artifact and move on. This buys
you clean context per step (nothing stale in view, nothing crowded out), a natural checkpoint
pause where you actually look at the artifact — and an audit trail: each step's conversation
*is* its record, which M4 will sample and M8 will show a colleague.

**Artifacts, concretely.** Ask each step to produce its output as a single well-formed document
— a markdown table, a structured file — not scattered through chat replies. Claude can produce
these as discrete artifacts you can carry forward, save alongside the runbook, and diff between
runs. Boring formats win: a table you can scan beats an eloquent essay at every checkpoint.

**When one long conversation is fine.** Short chain, small documents, you refining
interactively — a single conversation is less friction and works. Know what you're trading:
around the point where the material stops fitting comfortably in view, earlier instructions
start dropping out of it, and the failure is silent. If a late step seems to have "forgotten"
an early rule, you didn't hit a mood; you hit the window. Split the steps.

**[V]** *Parity note:* in ChatGPT the same shape holds — a Project holding the runbook,
conversations per step, files carried forward. The design (structure forward, checkpoints
between, prose last) transfers untouched.

---

## Capstone stage 3 · Design and run your pipeline

Your M1 spec named a transformation. Turn it into the smallest pipeline that fixes what a
single prompt gets wrong — for many first builds that's two steps, and two is a fine answer.
(If it's genuinely one step, say so, defend it against Lesson 1's three conditions, and run it
with a checkpoint anyway.)

**Submit:**

1. **The pipeline design** — each step: name (a verb), one-line job, input artifact, output
   artifact with format, and its checkpoint *including what a wrong version would look like*.
   That last clause is where the thinking lives.
2. **The runbook** — the step prompts, verbatim, as they now live in your project.
3. **A real run** — on genuine, M6-safe material (yours to judge for now: nothing
   person-identifying; the full rules arrive in M6). Include every intermediate artifact, not
   just the final output.
4. **The calibration score** — which step you predicted would degrade quality most, what the
   run showed, and the direction you were wrong in. If the run went suspiciously perfectly, say
   what you'd watch across the next three runs instead.

### Rubric — 20 points

| Dimension | 5 points |
|---|---|
| **Step discipline** | One transformation per step; structured intermediates; prose only at the end. A deliberately small pipeline defended well outscores an elaborate one. |
| **Checkpoint design** | Each checkpoint names what failure would look like there, and a human could realistically catch it in the artifact submitted. |
| **The run is real** | Genuine material, all intermediates included, and evidence the checkpoints were actually looked at — not a pipeline run for the grade. |
| **Calibration** | Prediction recorded before the run, scored honestly after, direction of error named. Accuracy isn't graded; honesty and specificity are. |

---

## Key takeaways

- **One prompt, four jobs is how good work goes quietly wrong.** Objectives compete inside a
  single generation; the middle ones lose without a sound.
- **Structure forward, prose last.** Steps hand forward tables and lists with counts and
  traceable quotes; only the final step is allowed to make narrative.
- **A checkpoint is only real if you can say what a wrong version would show.** Otherwise it's
  decoration between steps.
- **The lossy middle is where detail dies** — the structured-to-prose transformation. Engineer
  it: require claims to carry their numbers, and check the artifact against the one before it.
- **Chain only under the three conditions** — long input, real stakes, invisible failure.
  Everything else stays a single prompt. Small pipelines, exactly where they're needed, are the
  practitioner's signature.

---

## Exercise key — Find the lossy step

**Step 2 killed the signal.** The theme table after step 1 was faithful: 41 mentions, 9 strongly
negative, concentrated in Denver, verbatim quotes. The narrative draft dropped the count, the
intensity, and — fatally — the concentration, dissolving a localized management problem into
"mixed sentiment." Step 3 then did its job honestly on corrupted input: "minor communication
concerns" is a fair formatting of a false narrative.

Two fixes, both to step 2, both from Lesson 1: the step prompt requires every claim to carry
its number and concentration ("no theme may be described without its count and where it
clusters"), and the checkpoint compares the narrative against the theme table row by row —
which would have caught this in under a minute.

Two reflexes to keep. First: when the final output is wrong, walk *backward* through the
artifacts to find the last one that was right; the step after it is your culprit. Second: notice
that the exec summary read as entirely plausible. Nothing in the final prose looked broken.
That's why checkpoints exist — by the time the loss is visible in the output, it isn't visible
in the output.

---

## Knowledge check — 8 questions

*Unlocks after the capstone pipeline is submitted. Retakes are free and unlimited.*

**Q1.** Why does a four-job mega-prompt underperform a short chain, mechanically?
- A. Long prompts exceed the context window
- B. Objectives compete within a single generation, and middle objectives quietly lose ✓
- C. The model refuses compound instructions
- D. Chains use more capable models by default

> **B.** Generation is one fragment at a time, predicted from everything in view; multiple
> objectives dilute each other, and the loss is silent. A confuses prompt length with window
> limits; C and D aren't how any of this works.

**Q2.** What makes an intermediate artifact a real checkpoint?
- A. It's produced between two steps
- B. It's written in polished prose
- C. A human glancing at it could catch a real error — you can say what a wrong version would show ✓
- D. It's saved in the project's knowledge

> **C.** The design test is naming what failure looks like there. An artifact that reads
> identically whether the work was faithful or invented checks nothing, wherever it's saved.

**Q3.** Steps should hand forward structure (tables, counted lists) rather than prose because:
- A. Structure uses fewer tokens
- B. The next step predicts better from clean material, and structure can be verified — counts check, quotes trace ✓
- C. Prose is against the pipeline convention
- D. Structured formats prevent hallucination entirely

> **B.** Both halves matter: better input for the next step (101's supply-the-material lever)
> and checkable claims for the human between steps. D overclaims — structure makes errors
> *catchable*, not impossible.

**Q4.** The "lossy middle" is:
- A. The middle of a long document, which models skip
- B. The step where structured detail becomes narrative, and counts, intensity, and concentration quietly drop ✓
- C. A context-window overflow
- D. The degradation of quality in long conversations

> **B.** It's the structured-to-prose transformation — the exercise's step 2. The defense is a
> prompt that requires claims to carry their numbers, and a checkpoint that compares the
> narrative to the structure it came from.

**Q5.** In the survey pipeline, step 2 drafts the narrative from the theme table *only*, with raw comments out of view, because:
- A. The comments no longer fit in the window
- B. It stops the step from quietly re-analyzing — the narrative can only use what the checkpointed table contains ✓
- C. Raw comments are too sensitive for later steps
- D. It makes the step run faster

> **B.** Limiting a step's view is a design tool: what the step can't see, it can't silently
> reinterpret. Your verified artifact becomes the single source of truth for everything
> downstream.

**Q6.** Which task has *not* earned a pipeline?
- A. 200 survey verbatims into an exec summary
- B. A handbook revision into a plain-language change note
- C. Rewriting one clunky policy paragraph for clarity ✓
- D. Six candidates' interview notes into a decision packet

> **C.** One short transformation, low stakes, failure visible on reading — none of the three
> conditions hold. Chaining it is ceremony. The other three are long, consequential, or fail
> invisibly — usually two of the three at once.

**Q7.** Your pipeline's final output is wrong. The practitioner's first move:
- A. Rerun the whole pipeline — randomness may fix it
- B. Rewrite the final step's prompt
- C. Walk backward through the artifacts to the last correct one; the step after it is the culprit ✓
- D. Add a verification step at the end

> **C.** The artifacts exist precisely so failure has an address. Rerunning (A) discards the
> diagnosis; B assumes the last step failed, which the exercise shows is often exactly wrong.

**Q8.** The interview pipeline's assemble step compares evidence but produces no ranking, because:
- A. Rankings exceed what the model can do accurately
- B. The packet informs a human decision about people; it must not become the decision ✓
- C. Hiring managers prefer making their own comparisons
- D. Rankings would require a larger context window

> **B.** M1's line, unmoved by pipeline sophistication: a workflow may organize the evidence for
> a people decision; the decision stays human. Capability (A) isn't the reason — the rule holds
> however good the ranking would be.

---

## Sources and attribution

Builds on 101 M1 (generation mechanics, context window, the survey-flattening caveat in the
sorting key) and 201 M1–M2 (one transformation per step; the pack; fix-the-pack-not-the-output,
here extended to runbooks). The checkpoint test ("name what a wrong version would show"), the
lossy-middle framing, and the structure-forward/prose-last rule are original to this course.
Lesson 3 and marked passages are volatile layer, tailored per deployment.
