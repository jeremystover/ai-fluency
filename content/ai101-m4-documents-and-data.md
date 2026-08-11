# AI 101 · Module 4 — Working with your documents and data

**Course:** AI 101 · The Foundation · Module 4 of 8
**Estimated time:** 30 min content · 10 min exercise · 20–25 min applied activity
**Prerequisite:** none — M1's "data is the whole game" is the natural on-ramp
**Builds on:** M1 (the data you supply; a first pass at what you paste) · M3 (the context window as a budget)
**Feeds:** M8 (what you own) · 201 M6 (people data in production)

> `Concepts reviewed: [DATE] · Examples current as of: [DATE]`
> Tool behaviors, agreement tiers, and regulatory specifics are **[V]** volatile layer.
> The tiering discipline and the shown-to-the-person test are stable.

---

## Calibration prompt — before you start

*One prediction, thirty seconds. You'll score it during the applied activity.*

At the end of this module you'll take one real document you'd genuinely like AI's help with —
an ER summary, survey verbatims, interview notes — and produce the version you'd actually
paste, redacting what shouldn't travel.

**What percentage of the document do you predict survives redaction?** Meaning: after you
remove what shouldn't be pasted under your current agreement, how much of the original text is
left? Write the number down.

Both directions of miss are instructive. Much survives that people expect to lose — most
redaction is precise, not wholesale. And what's lost is rarely what they guessed — names are
easy; it's the office, the role, and the date that carry identity out the door.

---

## Module brief

M1 left you with a clean principle: the model has never seen your organization, so quality
depends on the material you supply. This module is about the collision between that principle
and another one: **the material a People leader holds is the most sensitive material in the
building.**

Here's the collision in one scene. An HRBP has forty pages of exit-interview notes and a
Thursday deadline for a themes summary. The right move *capability-wise* is obvious — M1
taught it: supply the material, ask for transformation. The right move *stewardship-wise* is
not obvious at all: those notes contain names, grievances, a mention of a medical
accommodation, and a quote so distinctive that anyone in the department could identify its
author. Pasting them raw into a personal chat account is a data incident with extra steps.
Refusing to use AI at all hands back the Thursday problem. The skill this module builds is
the middle path: knowing exactly what may travel, making the rest travel-safe, and being able
to defend the call afterward.

Two ideas do most of the work. A **four-tier classification** you can run on any document in
seconds, and a single test that catches what the tiers miss: **could this run be shown to the
person it concerns?** Around them: what actually happens to a long document inside the model
(M3's budget, now with failure modes), and what real redaction looks like — as opposed to the
theater of deleting names and calling it done.

One promise: nothing here requires a policy your organization hasn't written yet. This is the
judgment you can exercise *today*, under whatever agreement you currently have — and it's the
foundation M8 builds the policy skeleton on.

## Learning objectives

By the end of this module you should be able to:

1. Explain why supplying material beats describing it — and route any real task through
   attach-and-transform rather than describe-and-hope.
2. Predict how a long document degrades in the window — the lossy middle, silent truncation —
   and know the working habits that defend against both.
3. Tier any People-work artifact in under a minute — public / internal / person-identifying /
   protected — and say what each tier permits under your current agreement. **[V]**
4. Apply the shown-to-the-person test to catch what tiering misses.
5. Redact a real document so it actually de-identifies — not just de-names — and say out loud
   what was removed and why.

## Lesson 1 · Supplying material beats describing it

Run the same task both ways and the principle teaches itself.

*Describing:* "Summarize our PTO policy for new managers." The model has never seen your PTO
policy. M1 told you what happens next: it generates a fluent summary of *a* PTO policy — a
plausible average of the thousands in its training data. Accrual rates you don't offer,
carryover rules you don't have, delivered in confident prose. Nothing about it looks wrong,
and all of it is invented.

*Supplying:* paste the policy, then ask. Now every sentence has source material to draw on,
and — just as important — **you have something to check against.** When the summary says
"unused days lapse in March," you can look at the policy and verify it. Supplied material
doesn't just improve the output; it converts an unverifiable claim into a checkable one.
That's the difference M6 will lean on hard.

The habit, stated once and bluntly: **for any task touching your organization's specifics,
attach the source or expect invention.** The model fills gaps silently — that's its mechanism,
not a defect — so the only question is whether you filled them first.

And the immediate objection — *"but can I paste this?"* — is the right one. It's the rest of
this module. The answer is almost never "no, nothing"; it's "these parts, under these
conditions, in this form." Hold the objection for two lessons and you'll have the tools to
answer it precisely instead of nervously.

> ### Try this — 2 minutes
> Ask your AI tool to summarize a policy your organization actually has — by name, without
> attaching it. Read the confident result. Count the invented specifics. You've just watched
> the gap that every supplied document closes — and you'll never again wonder whether
> attaching the source matters.

## Lesson 2 · What happens to a long document **[V]**

M3 called the context window a budget. Here's what spending it on a big document actually
looks like — and the two failure modes that matter for People work.

**The lossy middle.** Current models advertise windows that hold hundreds of pages **[V]**,
and the marketing is technically true: the pages fit. But *fits is not attends* — every
fragment of output is predicted from everything in view, and the more there is in view, the
more it all competes. Empirically, material at the start and end of a long context holds the
model's attention best; the middle is where details go quiet. For a 60-page handbook, that
means a summary can be sharp on sections 1–3, sharp on the appendix, and strangely vague
about the grievance procedure buried in the middle — while sounding equally confident
throughout. The tell is *asymmetric thinness*: if a summary's detail level varies by section
for no editorial reason, suspect the middle, and probe it directly ("what does section 7 say
about escalation timelines?").

**Silent truncation.** A conversation that outgrows the window drops its oldest content
without announcement — including, eventually, the document you attached and the instructions
you opened with. A long working session that starts giving generic answers hasn't gotten
lazy; it has literally lost sight of your material.

The working habits that defend against both, cheap and boring by design: **ask for what you
need section by section** rather than one heroic full-document request; **put the thing that
matters most at the start or end** of what you supply, never the middle; **start fresh
conversations per task** instead of nursing one endless thread; and **spot-check the middle**
of anything long before you trust its summary. (201 M3 turns these habits into designed
pipelines; here they're just hygiene.)

## Lesson 3 · The paste question, answered **[V]**

"Can I paste this?" has a real answer, and it isn't a vibe. It's a tier and an agreement.

**The four tiers** — run any artifact through them in seconds:

**Tier 1 · Public.** Already published or intended to be: job postings, your careers page,
publicly filed policies. No new exposure — it's already out there.

**Tier 2 · Internal.** Organizational but not about a person: policy drafts, org design
notes, process docs, aggregate statistics, template language. Sensitive to the *organization*
(confidentiality, competitive), not to an individual.

**Tier 3 · Person-identifying.** About someone, or traceable to someone: interview notes,
performance narratives, survey verbatims, exit interviews, anything with a name — or with the
combination of details that works like a name. This is the tier people mis-sort most, in both
directions.

**Tier 4 · Protected.** The categories with legal weight of their own **[V]**: medical and
accommodation information, protected-class data, active investigation and legal-hold
material, compensation at the individual level. Not "be careful" — *stop*: this tier moves
only inside systems and processes your counsel has explicitly blessed, which a chat window
almost never is.

**What tiers permit depends on the agreement** — the M2 lesson about provisioned tools, now
with teeth. Under a consumer account, the safe assumption **[V]** is that anything pasted
may be retained and possibly used to improve the service: fine for Tier 1, defensible for
sanitized Tier 2, wrong for Tier 3. Under an enterprise agreement with negotiated
data-processing terms **[V]** — no training on your inputs, defined retention — Tier 2 is
ordinary work and Tier 3 becomes possible *in redacted form* (next lesson). Tier 4 stays
stop-and-ask under every agreement, because the constraint isn't the vendor's terms — it's
your own obligations. If you don't know which agreement covers the tool in front of you,
that's not a reason to guess; it's the single most useful question you can ask IT this week,
and M8 gives you the follow-ups.

**And the test that catches what tiering misses: could this run be shown to the person it
concerns?** Imagine the employee in your Tier 3 document reading the transcript — your
prompt, their information, the output. If your reaction is discomfort, the discomfort is
information: something traveled that shouldn't have, or the task itself is one M7 wants a
harder look at. The test works because it swaps an abstract compliance question for a
concrete loyalty one — *am I handling this person's information the way I'd defend to their
face?* — and People leaders' instincts on that question are already well trained.

> ### Try this — 3 minutes
> Tier the last five things you (or your team) put into an AI tool — or would have. Fast,
> gut-level, honest. Most people find four easy calls and one that makes them stop. The
> stopper is the point: write one sentence on *why* it's hard to place, and you've found
> either a redaction candidate (Lesson 4) or a question for M7.

## Lesson 4 · Redaction that isn't theater

Deleting names and calling a document safe is the most common redaction mistake in People
work, and it fails for a reason worth understanding: **identity lives in combinations, not
names.** "A senior engineer in the Denver office who raised concerns after the March reorg"
contains zero names and identifies one person to everyone who works there. Re-identification
is a *join* — each detail narrows the set of people it could be, and three or four details
in, the set has one member.

Real redaction is three moves, applied with the reader in mind — not a hypothetical stranger,
but the most-informed insider who could plausibly see the output:

**Generalize the quasi-identifiers.** Role, location, tenure, dates, team names — replace
each with the least specific version that still serves the task. "Senior engineer, Denver,
post-reorg" becomes "an experienced employee in a technical function." If the task genuinely
needs the specific — say, you're analyzing *Denver's* results — that's a sign the task wants
a more controlled setting than a chat window, not a sign to leave the detail in.

**Break the joins.** One distinctive detail is a flag; the *combination* is the identifier.
Ask which details, together, shrink the candidate set to one, and cut or blur until the set
is comfortably large. Distinctive phrasing counts: a verbatim quote with an unusual turn of
phrase identifies its author to colleagues as surely as a name — paraphrase it.

**Then run the shown-to-the-person test on what's left.** If the redacted version would still
make its subject flinch — because the *situation* is identifiable even with every detail
blurred — the document wasn't over-sensitive; the task was. Some analyses shouldn't run on a
small population at all, in any tool. Finding that out during redaction is the discipline
working, not failing.

Two habits complete the practice. **Redact before the material enters the tool**, not in the
prompt ("ignore the names" is an instruction to a system that has already received the
names). And **say what you removed** — a one-line note on the redacted version ("names,
office, dates generalized; two quotes paraphrased") turns your judgment into something a
colleague can review and M8 can call accountable. Silent redaction protects the data;
*narrated* redaction protects you.

## Key takeaways

- **Attach the source or expect invention.** Describing your organization's documents
  produces fluent averages of other people's; supplying them produces checkable output.
  The gap never closes on its own.
- **Long documents degrade predictably:** the lossy middle (fits ≠ attends — probe for
  asymmetric thinness) and silent truncation (long threads drop their oldest material without
  telling you). Section-by-section requests and fresh conversations are cheap insurance.
- **Four tiers, run in seconds:** public / internal / person-identifying / protected. The
  agreement determines what each permits **[V]** — and if you don't know which agreement
  covers your tool, that's this week's most useful question for IT.
- **Tier 4 is stop, not caution** — medical, protected-class, investigation, individual comp.
  The constraint is your obligations, not the vendor's terms, so no agreement upgrade
  unlocks it.
- **The shown-to-the-person test catches what tiers miss:** could this run — prompt, data,
  output — be shown to the person it concerns? Discomfort is information.
- **Identity lives in combinations, not names.** Real redaction generalizes
  quasi-identifiers, breaks the joins, paraphrases distinctive quotes — before the material
  enters the tool — and narrates what it removed so the judgment is reviewable.

## Applied activity — "The Redaction Pass"

**Time:** 20–25 minutes · **Submit:** the before/after redaction map plus a 250–350 word
reflection · **Graded against the rubric below.** Score doesn't matter. Doing the work is
where the learning lands. **Do not paste the original document into this submission** — the
map describes; it doesn't reproduce.

Take one real document you'd genuinely like AI's help with — interview notes, survey
verbatims, an ER summary, exit-interview material. Something Tier 3: honestly sensitive,
honestly useful.

**Step 1 — Tier it (3 min).** Name the document type and its tier. If parts land in
different tiers — a mostly-internal doc with one person-identifying section — map the parts.
Anything Tier 4 inside it: mark it *out of scope for any chat tool* and proceed with the
rest. That marking is itself a graded judgment.

**Step 2 — The redaction pass (10 min).** Produce the version you'd actually paste, using
the three moves: generalize quasi-identifiers, break the joins, paraphrase distinctive
quotes. Work against the most-informed insider, not a stranger.

**Step 3 — The map (5 min).** List what you changed, category by category — not the
sensitive originals, the *categories*: "4 names → roles · 2 offices → 'a regional office' ·
3 dates → quarters · 1 distinctive quote paraphrased · accommodation mention removed
entirely (Tier 4)." Then the one-line narration you'd attach for a colleague.

**Step 4 — Score the prediction (2 min).** Estimate what percentage of the original
survived. Compare with your opening prediction: direction of the miss, and whether what you
*lost* was what you expected to lose.

Then the reflection: which move did the real work; what the shown-to-the-person test flagged,
if anything; and the sentence you'd now say to a teammate who asks "can I paste exit
interviews?"

## Knowledge check — 8 questions

*Unlocks after the applied activity is submitted. Retakes are free and unlimited.*

**Q1.** Asked to "summarize our parental leave policy" with no document attached, the model produces a confident, detailed summary. What is that summary?

- A. A retrieval of your policy from the model's training data, current as of the cutoff
- B. A plausible average of the many parental leave policies in the training data — invented specifics, fluent delivery ✓
- C. A refusal in disguise — models won't summarize documents they haven't seen
- D. A summary of the most common policy among companies your size

> **B.** The model has never seen your policy (M1), so it generates *a* policy-shaped answer
> from patterns — accrual rules you don't have, delivered confidently. It won't decline (C);
> it fills the gap silently. A and D describe retrieval systems, which this isn't.

**Q2.** Beyond better output, what does supplying the source document change about the *checkability* of the result?

- A. Nothing — output quality and checkability are the same property
- B. Supplied documents make the model cite its sources automatically
- C. Every claim in the output can now be verified against material you hold — invention becomes catchable ✓
- D. Checkability only improves under an enterprise agreement

> **C.** With the source in hand, "unused days lapse in March" is a checkable claim instead
> of a plausible one — the conversion M6's verification habits depend on. B overstates what
> attachment does **[V]**; D confuses the data question with the quality question.

**Q3.** A summary of your 60-page handbook is detailed on early sections, detailed on the appendix, and oddly vague about the grievance procedure in the middle — all in equally confident prose. What's the most likely cause?

- A. The grievance procedure was written after the model's knowledge cutoff
- B. Attention degrades for material in the middle of a very long context — it fit, but it didn't attend ✓
- C. The model's safety filters suppressed the grievance content
- D. The handbook exceeded the window, so the middle was dropped entirely

> **B.** Asymmetric thinness with uniform confidence is the lossy middle's signature. D is a
> real failure mode but truncation drops the *oldest* material in an overgrown conversation,
> not the middle of one attachment; A confuses cutoff with context; C isn't this.

**Q4.** Which artifact is most likely to be *mis*-tiered as safely internal when it's actually person-identifying?

- A. The published careers-page description of your hybrid work policy
- B. A template offer letter with all fields blank
- C. Aggregate survey scores by 200-person division
- D. Survey verbatims with names stripped but role, office, and a distinctive complaint intact ✓

> **D.** Identity lives in combinations: role + office + recognizable grievance identifies
> the author to any informed insider, names or no names. A is public, B is internal template
> language, C is aggregated past the point of individual traceability — the classic safe
> versions of each tier.

**Q5.** What makes Tier 4 (medical, protected-class, investigation, individual comp) different in kind from Tier 3 — not just more sensitive?

- A. Tier 4 documents are longer and exceed context windows
- B. The constraint comes from your own legal obligations, so no vendor agreement upgrade unlocks a chat window for it ✓
- C. Tier 4 material confuses models and produces lower-quality output
- D. Nothing — Tier 4 is Tier 3 with more thorough redaction required

> **B.** Tiers 1–3 are governed by what your tool's agreement permits **[V]**; Tier 4 is
> governed by obligations that attach to the data itself — which is why the answer stays
> "stop and ask" under every agreement, and why it moves only in systems counsel has
> explicitly blessed. D is the tempting wrong answer: redaction quality isn't the issue.

**Q6.** The point of the shown-to-the-person test — could this run be shown to the person it concerns? — is that it:

- A. Replaces the tier system with a single easier question
- B. Converts an abstract compliance question into a concrete one your existing instincts can actually answer — and catches tasks the tiers technically permit ✓
- C. Is a legal requirement under current privacy regulation
- D. Confirms the model handled the data securely on the vendor's side

> **B.** It complements the tiers rather than replacing them (A): a properly redacted run can
> still fail it when the *task* is the problem — surfacing exactly the cases M7 wants. C
> overstates its status **[V]**; D tests something no prompt-side judgment can see.

**Q7.** Why does "ignore the names and any identifying details" *in the prompt* fail as redaction?

- A. Models can't follow negative instructions of any kind
- B. The instruction consumes context budget better spent on the task
- C. The identifying material has already entered the tool — retention and exposure happened at paste time, whatever the output ignores ✓
- D. It doesn't fail — prompt-level redaction is equivalent to editing the document first

> **C.** Redaction is about what *enters* the system, not what the output mentions. An
> instruction to ignore data is received by a system that now holds the data. Redact before
> the material goes in — that's why it's a document-editing pass, not a prompting technique.

**Q8.** Your redacted ER summary — every name, office, and date generalized — would still make its subject flinch, because anyone close to the situation would recognize it. What does the discipline say?

- A. The redaction failed on technique — generalize harder until the flinch goes away
- B. Flinching isn't the test; if the tiers and agreement permit it, proceed
- C. Ship it but add a note disclosing that redaction was performed
- D. The task, not the document, is the problem — some analyses shouldn't run on a small population in any tool, and finding that out now is the discipline working ✓

> **D.** When the situation itself is identifiable at any blur level, no technique fixes it —
> the shown-to-the-person test has caught a task that needs a more controlled setting or
> shouldn't run at all (M7's territory). A mistakes a task problem for a technique problem;
> B inverts the test's whole purpose; C narrates a decision that shouldn't ship.

## Sources and attribution

This module draws on the following material:

- **The AI Fluency Framework** (Rick Dakan & Joseph Feller, in collaboration with Anthropic,
  CC BY-NC-SA 4.0) — the supply-don't-describe framing extends its treatment of context as
  the lever on output quality.
- Provider documentation on data handling, retention, and training-use defaults across
  consumer and enterprise tiers — verify against your vendor's current published terms and
  your own agreement; both move. **[V]**
- The four-tier classification, the shown-to-the-person test, and the three-move redaction
  discipline are original to this course, developed for the People-leader context. The
  re-identification-by-combination principle reflects the long-standing privacy research
  consensus on quasi-identifiers.
- Regulatory treatment of employee data varies by jurisdiction and moves quickly — this
  module teaches judgment, not compliance advice. *Verify specifics with counsel.* **[V]**
