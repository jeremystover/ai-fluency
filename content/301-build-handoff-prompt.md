# AI 301 · Build handoff prompt

Paste the block below into each thread that has an approved outline. One thread per track.
Everything above the rule is context for whoever is dispatching; everything below it is the prompt.

**Ready to build, one thread each:** People Ops & HR Technology (8 modules) · Labor & Employee
Relations · Talent Development / L&D · Employee Experience & Internal Comms. People Analytics is
being built in the thread that outlined it.

**The one rule that matters most:** nobody registers their track. Content packages live in
per-module directories and never collide; `content/modules.json`, `src/shared/roles.ts`, and
`seed/seed.sql` are shared, and `seed.sql` is generated — four threads regenerating it produces a
2,000-line conflict per track and a corrupted seed. Registration happens once, at the end, in a
single integration pass.

---

Build the full content for the AI 301 track you outlined. The outline is approved — draft it, don't
re-litigate it. If drafting surfaces something the outline got wrong, fix it and record why in the
outline's Decisions section.

**Read first, in this order:**
1. `content/301-track-authoring-brief.md` — the whole thing. §3a (the two subtractions) and §5
   (what recurs) are the load-bearing sections and both changed recently.
2. Your own outline and exploration doc.
3. `content/ai301-hrbp-m3-the-honest-arithmetic.md` or `content/ai301-comp-m3-the-craft-layer.md` —
   **read one end to end for voice before writing a word.** Register, density, how a claim is stated
   and then argued against, how a lesson lands on something the learner can do.
4. One complete shipped package: `content/modules/ai301-comp-m3/` — all six files. That is the
   target shape.

**Verify before you draft, not after.** This is not optional and it is not a final pass. Every
statistic, statute, case, and vendor claim gets checked before it goes in a lesson, because the
correction rate has been high and the corrections change designs rather than wording. Real examples
from shipped work: a claimed "~1% of organizations have a written AI policy" turned out to be 68%
and the module's whole activity had to be reframed; a "75% of managers fail to detect AI-written
applications" figure did not verify at all and was replaced. **If a claim fails, say so in the
outline's verification record and design around it — a module that reports "no credible source
exists for this" is stronger than one built on a borrowed number.** Where a figure survives, carry
its sample and date into the lesson.

**Reuse the shipped wording for HR-wide facts rather than re-deriving them.** The EU AI Act timeline
and the Omnibus deferral, *Mobley v. Workday*'s posture, the SHRM *State of AI in HR 2026* adoption
split, the coaching trials — these already appear in shipped tracks with verified phrasing and
sample notes. Copy that phrasing and note in your Sources block that you did. Six independently
worded copies of the same statute will drift, and the maintenance agent re-checks volatile blocks
against the web on a cycle. Role-specific evidence you verify yourself.

**Per module, produce:**
- A draft at `content/ai301-<role>-mN-<slug>.md`, then
  `node scripts/convert-draft.mjs <draft> <moduleId> <YYYY-MM-DD>`.
- Hand-tune the package at `content/modules/<moduleId>/`: `blocks.json`, `micro.json`,
  `knowledge-check.json` (8 questions, keys server-side), `rubric.json` (4–6 dimensions),
  `sorting.json` **or** `choice.json`, `activity.json`.
- `**[V]**` in a lesson heading is what marks a block volatile — backticked `` `[V]` `` in body text
  does not, so check the converter's volatile count matches what you intended.
- Insert the exercise embed and the `activity_link` block around the takeaways block by ordinal;
  copy the pattern from `content/modules/ai301-comp-m3/blocks.json`.
- Commit per module. Don't batch a whole track into one commit.

**Two conventions that are mid-migration — get these right:**

*Opening gate.* Every module opens on **a claim the learner must contest** — a factual assertion
about their own organization, committed to as "true of us / not true of us" before any content, then
checked against evidence from their own systems. This replaced the numeric calibration prompt,
because a confidence rating is self-report and self-report is not evidence.

*Numeric fields are not gone, and they are now worth more.* Keep an `opening`/`calibration` pair in
`rubric.json` **wherever a real measurable exists to close the loop against** — a figure from the
module, or something the learner measures during the activity. Cohort aggregation now ships: once
five other learners have answered the same field, a learner who commits their own number sees the
median, the interquartile range, and how far people typically missed. So a numeric field buys a peer
comparison it did not buy before. **Claim always; number when there is something honest to check it
against.** Don't invent a measurable to earn the feature.

*And where "go and check" cannot settle the claim, that is a finding.* Say so in the rubric's
`activityContext` and score it at full credit with an account of why. Several of these roles will hit
it often, and a rubric that punishes the honest answer teaches the wrong lesson.

**Hold these lines:**
- **Vertical subtraction is absolute.** Nothing 101 or 201 already taught. The two recurring
  temptations are a document-pipelines module (201 M3) and an AI-in-your-annual-calendar module
  (201 M7); both feel role-specific and are not.
- **Horizontal duplication with sibling 301 tracks is allowed and often correct** — no learner sees
  two role tracks. But *name* the overlaps in your Decisions section, in both directions, so the
  copies stay reconcilable.
- **Every module ends on a contestable claim with a genuinely strong counter-argument** — the real
  one, written at its strongest, not a strawman. The best ones turn the module's own technique on
  itself.
- **Score the delta, not the score.** State it explicitly in every rubric's `activityContext`: grade
  the account of the gap, never prediction accuracy.
- **Don't invent product surfaces.** Async, single learner. No peer exchange, no live session, no
  cohort discussion. Workshop framing converts: artifacts-brought-to-a-room become graded activity
  submissions, a Demo Day becomes the closing reckoning.
- **Counsel-review gates go in the content itself**, as a visible line at the top of any module whose
  legal surface is unsettled.

**Do NOT do any of this — it is the shared integration pass and it will be done once, at the end:**
- Do not add rows to `content/modules.json`.
- Do not edit `src/shared/roles.ts`.
- Do not run `scripts/generate-seed.mjs` or touch `seed/seed.sql`.

Registering a track early is also what caused the bug this whole body of work started from: module
rows without content packages render as an unclickable "yours whenever" dead end.

**When the track is done**, push your branch and report: the module list with one line each, every
citation that failed verification and what you did instead, every counsel-review gate you flagged,
each horizontal overlap you noticed with a sibling track, and anything in your outline that drafting
proved wrong.
