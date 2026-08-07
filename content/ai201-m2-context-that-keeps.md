# AI 201 · Module 2 — Context that keeps

**Course:** AI 201 · The Practitioner · Module 2 of 8
**Estimated time:** 30 min content · 10 min sorting exercise · 25–30 min capstone lab
**Prerequisite:** none beyond 101 — but the capstone stage builds on your M1 spec
**Builds on:** 101 M5 (prompting as briefing) · 101 M1 Lesson 4 (the data you supply)

> `Concepts reviewed: [DATE] · Examples current as of: [DATE]`
> This is the first hands-on module. Lesson 3 and the lab are **[V]** volatile layer — they teach
> a specific tool concretely, and they refresh when the tool changes. Your deployment tailors the
> lab track to the tools your organization has provisioned, so what you see is what you have.

---

## Calibration prompt — before you start

*Two predictions, thirty seconds. You'll score them at the end of the module.*

By the end of this module you'll have built a context pack for the workflow you specced in M1.

1. **How many distinct items will it need?** (A voice guide is one item. An example debrief is
   one item.) Write down a number.
2. **Which item will be hardest to write?** Name it.

Most people guess high on the first and wrong on the second. The miss is the lesson.

---

## Module brief

In 101 you learned the single most important fact about these systems: output quality is mostly
determined by the material you supply. Then you spent every week since re-supplying it.

Think about what you actually did the last time you asked AI to draft something in your
company's voice. You explained the voice. Again. You described what a good version looks like.
Again. You pasted the same three paragraphs of background that you pasted last Tuesday, from the
same document, with the same typo. Practitioners call this the **artisan tax**: the cost of
re-briefing a capable stranger who forgets you the moment you close the tab — paid per
conversation, forever.

101 told you why the tax exists: the model has no memory of you, and each conversation starts
from nothing but its training plus what you hand it. The Novice pays the tax every time. The
Practitioner notices that *the material barely changes between payments* — and writes it down
once, somewhere the tool can always see.

That once-written material is the **context pack**: the stable briefing for one workflow,
separated from the material that genuinely changes each run. Building the distinction between
those two — what keeps, what arrives fresh, and what must never be written into infrastructure at
all — is this module. It is the highest-leverage hour in this course: everything M3 through M8
builds runs on the packs you learn to make here.

---

## Learning objectives

By the end of this module you should be able to:

1. Explain the artisan tax and identify where you're currently paying it.
2. Split any workflow's material into pack (durable), fresh (per-run), and excluded (never
   infrastructure) — and defend each placement.
3. Build a working context pack in your organization's provisioned tool, using instructions and
   knowledge for what each does best. **[V]**
4. Date-stamp pack content and set a review cadence, so your context doesn't rot into confident
   misinformation.
5. State the boundary rule: people data must never become infrastructure.

---

## Lesson 1 · From prompt to pack

A prompt is what you say once. A pack is what stays true between runs.

The distinction sounds trivial until you inventory a real task. Take the interview-debrief
workflow — the canonical first build from M1. Every Thursday, some of what you give the model is
new: this week's notes, these candidates, this role. But most of it is *identical week to week*:

- What a good debrief looks like (structure, length, what a hiring manager actually reads)
- Your company's voice — direct, warm, no exclamation points, whatever yours is
- The competency language your org uses, and what each term means
- What the model should do when the notes are thin ("flag the gap; never fill it")
- The output format the ATS or the hiring team expects

That second list is the pack. It's the part of every prompt you were retyping — or worse,
half-retyping, differently each time, which is why Tuesday's output and Thursday's output had
different personalities.

Notice what the pack really is: **your M1 spec's "inputs" line, split by rate of change.** Fast
material stays per-run. Slow material gets written once, well, and attached always. In 101's
vocabulary: you're not teaching the model anything (you can't — training already happened).
You're arranging for the briefing to be permanently in view instead of re-performed.

The payoff compounds in three directions at once. Consistency: outputs stop depending on how
completely you briefed today. Speed: the per-run prompt shrinks to just what's new. And
transfer — the sleeper benefit that pays off in M8: a colleague who can see your pack can run
your workflow. The artisan's skill was trapped in the artisan. The practitioner's is written down.

> ### Try this — 3 minutes
> Find the last three prompts you wrote for the same kind of task (sent mail to yourself, chat
> history, wherever they live).
>
> 1. Highlight every sentence that appears, in some form, in more than one of them.
> 2. That highlighted material is pack content you've been paying the artisan tax on.
> 3. Notice whether the *unhighlighted* parts are genuinely per-run material — or briefing you
>    forgot to repeat, which explains the run that came out worse.

---

## Lesson 2 · What goes in — and what stays out

Three bins, and the discipline to keep them separate. This sorting is the module's core skill.

**The pack: durable and impersonal.** Material that's true for months and identifies nobody.
The test is two questions: *Will this still be right in ninety days?* and *Does it name or
describe an identifiable person?* Only yes-and-no earns a place. Typical residents:

- **A gold-standard example.** The single best output you've ever produced for this workflow,
  lightly annotated. One great example outworks three paragraphs of description — 101 M5 taught
  you why: you're narrowing the prediction toward a target you've actually shown.
- **The definition of done.** A checklist the output must pass. This becomes load-bearing in M4,
  when verification needs something to verify *against*.
- **Voice and register.** Not "professional but friendly" — actual rules, with a before/after
  pair.
- **The glossary.** Your org's acronyms, level names, competency terms. The model has never seen
  your org (101, Lesson 4); this is the piece of your org it may safely see.
- **The org context brief.** What the company does, roughly how big, how the team is shaped — no
  names, no numbers you'd redact from a conference talk.

**Fresh: this run's material.** The reason the workflow runs at all — this week's notes, this
quarter's verbatims, the policy paragraph being rewritten today. It arrives, gets transformed,
and leaves. Putting fresh material in the pack is how you get March's survey themes confidently
cited in June: the second way context rots, and the quieter one.

**Excluded: people data.** Here the module plants a flag, and M6 will build the full fence:

> **People data must never become infrastructure.**

A named employee's performance history. Grievance details. A raw HRIS export with IDs. The
moment material like this is written into a pack, you've turned a one-time judgment call ("may I
paste this, here, today, under this agreement?") into a standing condition nobody re-decides —
sitting in every future conversation, visible to every future run, long after you've forgotten
it's there. Even when a single run may legitimately touch sensitive material (M6 covers when and
how), it enters as fresh input, under that run's judgment, and leaves with it. Infrastructure is
forever; people data must not be.

### Sorting exercise — Pack it, fresh, or keep it out?

*Ten minutes. Commit before you look.*

Twelve pieces of material from a People leader's workflows. Sort each into **lives in the
pack**, **supplied fresh each run**, or **never enters the system**.

1. Your company's voice and style guide
2. The best interview debrief you've ever written, as an example
3. This week's interview notes
4. The comp philosophy one-pager
5. A named employee's performance history
6. This quarter's engagement survey verbatims
7. The definition-of-done checklist for the output
8. Grievance details naming the individuals involved
9. The team glossary — acronyms, level names, competency terms
10. A raw HRIS export, employee IDs included
11. The policy paragraph being rewritten this run
12. Your org context brief — what the company does, size, shape, no names

The pattern, stated in advance so you can test it as you sort:

> **Durable and impersonal lives in the pack. Run-specific material arrives fresh and leaves with
> the run. Anything identifying a person never becomes infrastructure.**

---

## Lesson 3 · The lab — building it in Claude **[V]**

*This lesson is volatile layer: it describes a specific tool as it currently works. If your
organization provisions a different tool, your lab track shows the equivalent steps there.*

Claude's home for a context pack is a **Project**: a workspace where instructions and reference
files persist across every conversation started inside it. The mechanics take ten minutes; the
design judgment is what you brought from Lessons 1 and 2.

**Step 1 — Create the Project.** One project per workflow, named after the workflow, not the
tool ("Interview debriefs," not "Claude experiments"). Your capstone build gets its own; you
started it in M1 if you followed the pointer.

**Step 2 — Instructions: the standing brief.** Project instructions are applied to every
conversation in the project — they are the part of the briefing that should always be in force.
Keep them short and behavioral: the role ("You turn my raw interview notes into structured
debriefs for hiring managers"), the definition of done, the voice rules, and the failure
instruction ("When the notes don't cover a competency, say so — never fill the gap"). If it
reads like a job description for the workflow, it's right. If it's three pages, you've pasted
knowledge into instructions — move it.

**Step 3 — Knowledge: the reference shelf.** Upload the pack's reference documents: the
gold-standard example, the glossary, the org brief, the style guide. Knowledge is consulted as
needed rather than recited every turn — the right home for material that's *sometimes* relevant.
The rule of thumb: **instructions are what it must always do; knowledge is what it may need to
look at.**

**Step 4 — Run it fresh.** Start a new conversation in the project and give it only fresh
material — this week's notes, nothing else. Watch what you didn't have to say. That silence is
the artisan tax, refunded.

**Two cautions from 101, now operational.** First: conversations inside a project do not teach
the project — nothing you say in a chat updates instructions or knowledge unless you edit them
deliberately. The pack changes when you change it, which is exactly what makes it auditable.
Second: the context window is still finite. A pack is not an attic; every stale document you
leave in knowledge is crowding something current out of view.

**[V]** *Parity note:* in ChatGPT, the equivalent shape is a Project (or a custom GPT) —
instructions map to instructions, knowledge to attached files, with the same design judgment
applying. The concepts in this module do not care which tool you're in; only this lesson does.

> ### Try this — the ten-minute version
> Even if your capstone lab comes later, feel the mechanics now:
>
> 1. Create a project for any recurring task. Write three sentences of instructions: role,
>    definition of done, one failure rule.
> 2. Upload one gold-standard example as knowledge.
> 3. Run the task fresh, supplying only today's material.
> 4. Compare against your last unpacked attempt. The difference is what you've been retyping.

---

## Lesson 4 · Context rots

The pack you built today is correct today. That sentence has an expiry date, and nobody will
tell you when it passes.

The org chart brief goes stale at the next reorg. The comp philosophy one-pager survives until
the cycle changes it. The voice guide outlives both — until a rebrand. Pack content doesn't fail
loudly like a broken link; it fails the way 101 taught you fluent output fails: the model keeps
producing confident, well-formed answers built on last quarter's truth. **Stale context is a
hallucination you installed yourself.**

The fix is a discipline you've already seen working — this course runs on it. Every module page
carries two stamps: concepts reviewed on one date, examples current as of another, because the
two layers age at different speeds. Your pack deserves the same split:

- **Date-stamp every item.** A line at the top: `Reviewed: 2026-08-07`. Thirty seconds at
  creation; the difference between "I think this is current" and knowing.
- **Sort your pack by rate of change.** The glossary and voice guide are your stable layer —
  check twice a year. The org brief and anything touching money or structure are your volatile
  layer — check monthly, and always after a reorg, a cycle, or a policy change.
- **Put the review on your calendar.** Ten minutes monthly, all packs, or it will not happen.
  (In M7 this slot joins your operating rhythm; for now, one recurring invite.)
- **Prune as ruthlessly as you add.** An item nobody's needed in two review cycles comes out.
  The context window you free is worth more than the "just in case."

One more habit that pays forward: when a run produces a wrong output *because the pack was
wrong*, fix the pack before you fix the output. Artisans correct the draft; practitioners
correct the system that drafted it.

---

## Capstone stage 2 · Build your workflow's pack

Your M1 spec named the workflow's inputs. Now split and build them.

**First, score your calibration** from the top of the module: how many items did the pack
actually need, and which was genuinely hardest to write? Record both misses with a sentence on
the direction — too many predicted items usually means fresh material was headed for the pack;
the "hardest item" miss usually reveals which part of your own standards you'd never written
down.

**Then submit, from your organization's tool:**

1. **The three-bin inventory** — every input from your M1 spec, placed in pack / fresh /
   excluded, one clause of reasoning each.
2. **The instructions** — pasted verbatim. Role, definition of done, voice, failure rule.
3. **The knowledge list** — each document's name, one line on why it earned the place, and its
   review date and cadence (stable or volatile).
4. **A fresh-run transcript** — one real run supplying only per-run material, with a sentence on
   what you no longer had to say.

### Rubric — 20 points

| Dimension | 5 points |
|---|---|
| **Pack design** | Instructions are short and behavioral; knowledge is reference, not recitation; a gold-standard example and definition of done are present. The split shows judgment, not just sorting. |
| **Boundary discipline** | Nothing person-identifying anywhere in pack or instructions; fresh vs. pack placements are defensible; the excluded bin shows they know *why* those items are excluded. |
| **Durability design** | Every knowledge item carries a review date and a stable/volatile designation; a real review cadence exists somewhere a calendar can enforce it. |
| **Calibration** | Both predictions recorded before building, scored honestly after, with the direction of error named. Accuracy isn't graded; honesty and specificity are. |

---

## Key takeaways

- **The artisan tax is real and optional.** You pay it every time you re-brief material that
  hasn't changed. The pack is the once-written refund.
- **Three bins, one discipline:** durable-and-impersonal in the pack, run-specific fresh,
  people data never in infrastructure. The middle of the module and the middle of the practice.
- **Instructions are always-on behavior; knowledge is look-it-up reference. [V]** Short standing
  brief, well-chosen shelf — in whatever tool your organization provisions.
- **Stale context is a self-installed hallucination.** Date-stamp, split by rate of change,
  review on a calendar, prune. Fix the pack before you fix the output.
- **A written pack is transferable fluency.** It's what makes M8's handoff test passable — and
  it's the first artifact of yours a colleague could actually learn from.

---

## Sorting exercise — answer key

**Lives in the pack** — durable, impersonal:
**1** (voice guide — the canonical pack item), **2** (gold-standard example — one great example
outworks three paragraphs of description), **4** (comp *philosophy* — principles, not numbers or
names; when the cycle changes it, the review cadence catches it), **7** (definition of done —
M4's verification will need it), **9** (glossary — the slice of your org the model may safely
see), **12** (org brief — impersonal by construction).

**Supplied fresh each run:**
**3** (this week's notes — the reason the run exists), **6** (this quarter's verbatims — pack
them and June confidently cites March), **11** (the paragraph being rewritten — it leaves with
the run).

**Never enters the system:**
**5** (a named person's performance history), **8** (grievance details with names), **10** (raw
HRIS export with IDs) — all three for the same reason: writing them into infrastructure converts
a one-time judgment call into a standing condition nobody re-decides. Where a single run
legitimately needs sensitive material, M6 governs how it enters — fresh, minimized, under that
run's judgment — and how it leaves.

**If you put fresh material in the pack**, you built the quiet failure: current-sounding answers
from stale truth. **If you packed people data**, stop before building anything and read M6's
opening — this is the one sorting error with legal weight.

---

## Knowledge check — 8 questions

*Unlocks after the capstone pack is submitted. Retakes are free and unlimited.*

**Q1.** What is the "artisan tax"?
- A. The subscription cost of professional AI tools
- B. The recurring cost of re-briefing unchanged context in every conversation ✓
- C. The time spent verifying AI output
- D. The premium for larger context windows

> **B.** It's the per-conversation cost of re-supplying material that barely changes between
> runs. Verification (C) is a cost worth keeping — M4 designs it rather than eliminating it.

**Q2.** The two-question test for whether material belongs in the pack:
- A. Is it useful? Is it well-written?
- B. Will it still be right in ninety days? Does it identify a person? ✓
- C. Is it shorter than a page? Is it approved by legal?
- D. Has it been used more than twice? Is it confidential?

> **B.** Durable *and* impersonal — yes to the first, no to the second. Everything else in the
> module's three-bin sorting follows from those two questions.

**Q3.** Why does putting this quarter's survey verbatims in the pack cause trouble?
- A. Verbatims are too long for knowledge files
- B. Survey data is always too sensitive to use
- C. Fresh material packed as durable gets confidently cited long after it's stale ✓
- D. It doesn't — verbatims are ideal pack content

> **C.** That's the quiet rot: June's run cites March's themes, fluently, with no signal
> anything is wrong. Verbatims are legitimate *fresh* input (B overshoots); they just must leave
> with the run.

**Q4.** Instructions versus knowledge, in one rule: **[V]**
- A. Instructions are what it must always do; knowledge is what it may need to look at ✓
- B. Instructions are for formatting; knowledge is for facts
- C. Instructions are temporary; knowledge is permanent
- D. They're interchangeable — use whichever has space

> **A.** The standing brief stays short and behavioral; the shelf holds reference consulted as
> needed. Three pages of instructions is knowledge in the wrong house.

**Q5.** "People data must never become infrastructure" means:
- A. People data may never be used with AI at all
- B. Sensitive material may enter a run as fresh input under that run's judgment, but never live in packs or instructions ✓
- C. People data belongs in knowledge files, not instructions
- D. Only aggregated people data may go in the pack

> **B.** The rule targets *standing* exposure — material written once and present in every
> future conversation, with nobody re-deciding. A is broader than the course teaches (M6 governs
> per-run use); C is precisely the violation.

**Q6.** A conversation inside a Claude Project produces a much better debrief format than your pack specifies. Next week's runs will: **[V]**
- A. Use the improved format — the project learns from its conversations
- B. Use the old format, until you deliberately edit the instructions or knowledge ✓
- C. Alternate between formats
- D. Ask which format you prefer

> **B.** Conversations don't teach the project — 101's "you're not training it" lesson, now
> operational. That's a feature: the pack changes only when you change it, which is what makes
> it auditable. Fix the pack, not the output.

**Q7.** The stable/volatile split applied to your own pack means:
- A. Keeping two separate packs per workflow
- B. Reviewing fast-aging items (org brief, anything touching money or structure) on a short cadence, and slow-aging items on a long one ✓
- C. Marking which items the model may quote directly
- D. Storing volatile items as instructions and stable items as knowledge

> **B.** Different material ages at different speeds, so it gets reviewed at different speeds —
> the same discipline this course's own content runs on, applied to your infrastructure.

**Q8.** A run produces a wrong output because the org brief in your pack predates the reorg. The practitioner's move:
- A. Correct the output and ship it
- B. Correct the output, then update the pack and its review cadence ✓
- C. Delete the org brief — packs shouldn't contain anything that changes
- D. Add a disclaimer to the output

> **B.** Ship the corrected work, then fix the system that drafted it — otherwise next week
> pays the same cost. C throws away the pack's value; the answer to aging content is a cadence,
> not exclusion.

---

## Sources and attribution

Builds on AI 101 M5 (briefing, gold-standard examples as prediction-narrowing) and 101 M1
Lesson 4 (the data you supply; "the model has never seen your organization"). The
pack/fresh/excluded three-bin model and "people data must never become infrastructure" are
original to this course; M6 develops the exclusion rule into full data-tier practice. Lesson 3
and marked passages are volatile layer — tool specifics current as of the stamp date, tailored
per deployment to the organization's provisioned tools.
