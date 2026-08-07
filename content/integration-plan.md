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
5. **Honest tags.** Shallow modules render draft exercises as static text with `reveal` keys and
   a "interactive version ships with the full course" line — never a fake button.
6. **Instrument everything.** Per-module, per-modality funnel events (`module_opened` carries
   moduleId + modality; knowledge-check and calibration events added).
7. **Keys stay server-side.** Sorting keys, knowledge-check answers, rubrics: `fd_exercise`,
   never the client bundle.

## Phases

- **A · Consolidate (done):** PR #5 merged; tutor-chat branch merged with migration
  renumbering (`0005_chat`, idempotent); combined app verified: chat + podcast + admin + micro
  coexist on one worker.
- **B · Engine:** `fd_exercise` migration; package format + seed walker; generic module
  endpoints and `/module/:id` hub UI; KnowledgeCheck engine; convert 101-M1 to a package
  (proof the engine reproduces today's behavior exactly).
- **C · 201-M1 deep:** full package from the draft — calibration prompt, three lessons,
  12-task sorting exercise, capstone activity with its rubric, knowledge check, micro. Chat
  and podcast light up automatically.
- **D · 201 M2–M8 shallow:** draft-to-blocks converter script (`scripts/convert-draft.mjs`,
  heading-based, `[V]` detection); knowledge checks extracted (format is uniform); exercises
  as static + reveal; micros written from each module's takeaways; internal prereqs (M4→M5,
  M4+M6→M8) live via the existing prereq machinery, completion signal = knowledge check
  submitted.
- **E · Later:** bespoke engines for M3/M4/M5's exercise types; 201 activity grading tuned
  per capstone stage; the review queue wired to M8's peer-exchange flow end-to-end.
