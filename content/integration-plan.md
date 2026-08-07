# Content → Course Integration Plan

*How the drafted course content (AI 201, and everything after it) becomes live modules in the
app — using the chat tutor, podcast generator, and micro doses as first-class modalities.*
*Decisions locked with the course owner: build on consolidated main · 201-M1 deep, M2–M8
shallow · 201 open for the demo (gate described, not enforced).*

---

## The principle that makes this cheap

The chat tutor and the podcast generator are both **content-driven**: they read a module's
`fd_content_block` rows and the learner's context, and neither needs code changes for a new
module. The tutor's own header says it: *"drop in a new module's content file, seed it, and
this file needs no changes."* So integration is not about wiring content to features — it's
about (a) packaging the drafted content as data, and (b) generalizing the app's spine, which is
currently hardcoded to Module 1.

## The module package

Every module becomes a folder of data files under `content/modules/<moduleId>/`:

```
blocks.json            reading blocks (stable/volatile, reviewedAt, dependsOn) —
                       includes new block kinds:
                         calibration_prompt  (predictions → fd_calibration, context "<moduleId>:cal:<key>")
                         reveal              (commit-free collapsible: exercise keys in shallow modules)
sorting.json           optional · interactive sorting exercise (key server-side)
rubric.json            optional · activity rubric + minChars → generic AI grading
knowledge-check.json   optional · questions with keys server-side → knowledge-check engine
micro/blocks.json      optional · the two-minute cut
```

Exercise data with answer keys seeds into a new `fd_exercise` table (module_id, kind,
payload_json) so keys never ship to the client; the seed generator walks the package
directories. 101-M1's existing flat files convert into the same format — one format, no
special cases.

## The module engine (generalizing the spine)

- **Worker:** `/api/module/:id` returns blocks + stamps + **capabilities** discovered from
  what's seeded (`{read, micro, chat, podcast, sorting, activity, knowledgeCheck}`). Generic
  endpoints: `/api/module/:id/{sorting, sort, activity, knowledge-check, micro}`. Grading
  parameterizes by the module's seeded rubric (prompt version per module). Chat and podcast
  already take a moduleId.
- **UI:** `/module/:id` becomes the generic route (old `/module/1` paths redirect). Each
  module opens on a small hub header offering every modality its package supports — **Read ·
  Chat · Podcast · Micro** — defaulting to the learner's stated style preference from intake.
  New components: KnowledgeCheck (diagnostic's one-question-per-screen grammar, immediate
  feedback, free retakes), CalibrationPrompt (capture before, echo at the activity), Reveal.
- **Path & plan:** the path renders per course (101, 201) from `fd_module`; 201's cards state
  the 101 gate without enforcing it (demo decision). The plan gains a 201 step once the 101
  activity is graded.

## Principles checklist (every integration change answers to these)

1. **Content is data.** Nothing from the drafts lands in JSX. Stable/volatile split and
   `reviewedAt` stamps survive packaging; the maintenance-agent story extends to 201 for free.
2. **Personalization first.** Modality choice honors intake styles; tutor and podcast get the
   learner's name, objective, calibration read, and progress — for every module, not just M1.
3. **Calibration is a thread, not a feature.** Each 201 module's opening prediction becomes a
   `calibration_prompt` block feeding `fd_calibration`; M7's reckoning can query the whole trail.
4. **Locks state their price.** Prereqs and gates always say how to unlock (201's gate is
   *described* in the demo even while unenforced).
5. **Honest tags.** Nothing pretends to be interactive when it isn't — and as of Phase E,
   nothing needs to: every 201 exercise runs on a real engine (sorting or choice), commit-first,
   with keys server-side.
6. **Instrument everything.** Per-module, per-modality funnel events (`module_opened` carries
   moduleId + modality; knowledge-check and calibration events added).
7. **Keys stay server-side.** Sorting keys, knowledge-check answers, rubrics: `fd_exercise`,
   never the client bundle.

## Phases

- **A · Consolidate (done):** PR #5 merged; tutor-chat branch merged with migration
  renumbering (`0005_chat`, idempotent); combined app verified: chat + podcast + admin + micro
  coexist on one worker.
- **B · Engine (done):** `fd_exercise` migration (0006); package format + seed walker; generic
  `/module/:id` endpoints with capability discovery; KnowledgeCheck engine (new — the checks
  existed in every draft but never had an app surface); 101-M1 converted to a package with
  verified parity, gaining its knowledge check in the process.
- **C · 201-M1 deep (done):** full package from the draft via `scripts/convert-draft.mjs` plus
  hand-tuning — calibration prompt block, three lessons, 12-task sorting exercise with its own
  buckets, capstone activity with two rubric-declared calibration fields, 8-question knowledge
  check, micro dose. Chat and podcast lit up automatically, as designed. The path renders per
  course; the plan continues into 201 once the 101 capstone is graded.
- **D · 201 M2–M8 shallow (done):** all seven drafts converted via the converter — reading
  view with volatile lab lessons detected, exercises as static prose with commit-first
  `reveal` keys, knowledge checks extracted and live, rubrics extracted so the generic graded
  activity works on every capstone stage, micros written for all seven. Internal prereqs are
  enforced on the path (M4→M5, M4+M6→M8): a strong prerequisite locks even an open module,
  and 60%+ on the prerequisite's knowledge check clears the gate (retakes free). All eight
  201 modules now run in every modality — read, chat, podcast, micro — plus checks and graded
  activities.
- **E · Interactive everywhere + the review loop (done):** every static exercise became a real
  engine. The sorting engine generalized — two to four buckets, adaptive layout, and an `also`
  field so deliberately-arguable items score as correct with the reasoning carrying the argument
  — and now runs M2 (pack sort), M4 (buy the right verification), M5 (assign the rung, four
  rungs), M6 (tier the inputs, four tiers), M7 (signal or theater, two piles). M3 got a new
  **choice engine**: artifacts presented as evidence cards, one committed answer, the reveal
  argues back (key server-side like everything else). And the review loop closed: operator
  reviews written in the admin queue now surface to the learner on the activity screen — "From
  the review desk · a human read this" — with score, date, and an earlier-draft marker when the
  learner has since resubmitted.
- **F · Depth for M2–M8: thread, measure, reckon (in progress).** After Phase E the "shallow"
  label undersells these modules — the gap left is connective tissue, not content volume. Three
  moves, in order of value:
  1. **Thread the capstone.** 201's premise is one build advanced across eight modules, but
     each stage is graded blind. The activity screen gains "your build so far" — the learner's
     prior-stage submissions, collapsible above the editor — and the grader receives the same
     trail in its prompt, so stage 4's feedback can actually reference the stage 1 spec. No new
     schema; `fd_submission` already holds everything.
  2. **Structured calibration per stage.** Each module's opening prediction currently captures
     free text only. Where the prediction is genuinely numeric — M2's pack-item count, M4's
     errors-per-ten, M5's shuttling split, M6's two census counts — the calibration prompt gains
     declared numeric fields (`opening` in the rubric), stored to `fd_calibration` as
     predictions. The matching activity field is marked `actualFor` and closes the loop at
     submission time: actual recorded, delta computed. Qualitative predictions (M3's lossiest
     step, M7's first-decay element, M8's stall point) stay free text and get echoed back on the
     activity screen instead of asking the learner to scroll up. M7's measured-savings field
     writes the actual onto M1's savings prediction — the course's oldest open loop.
  3. **The reckoning and the portfolio.** M7's rubric sets `includeTrail`: its activity screen
     renders the whole calibration trail — prediction vs. actual pairs as dumbbells, sorting
     scores per module, the free-text predictions quoted — so "which way are you wrong about
     your own work?" is answered from data, not memory. M8 gets the same trail plus the full
     build-so-far stack, which together are the portfolio; its cold-reader handoff test runs
     through the Phase E review desk. M8's knowledge check grows from six questions to eight,
     matching its siblings.
- **Later:** org-tailored [V] lab lessons; a second maintenance-agent pass over volatile blocks.
