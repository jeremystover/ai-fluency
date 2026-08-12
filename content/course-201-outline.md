# AI 201 · The Practitioner — Course Outline (draft v1)

**Audience:** People leaders who completed AI 101 (or tested out).
**Level transition:** L2 The Practitioner → L3 The Specialist.
**Shape:** 8 modules × ~30 min, each with a hands-on lab and an AI-graded activity. One capstone build threads through all eight — every module's activity advances the learner's own workflow, so by M8 they have shipped something real, not collected certificates.
**Tooling stance:** Opinionated and hands-on. Reference stack is Claude (Projects for durable context, tool use / MCP for agent work), taught concretely with screenshots. Labs assume Claude access; deployments tailor the lab track to the organization's provisioned tools, so learners always see what they actually have. **Every tool-specific passage is volatile-layer** `[V]` so it refreshes without touching the concepts. Parity notes for ChatGPT equivalents ride along as `[V]` blocks.

---

## Where the learner stands (design premise)

After 101 they can predict what AI will do well, brief it properly, and catch it lying. What they cannot do is make any of it *repeat*. Every use is artisanal: context retyped, quality varying with their energy, nothing shareable, nothing that survives a busy month. The 201 promise, in the learner's words:

> "Stop re-explaining my job to a chatbot every morning. Build things once that keep working — and know when it's safe to let them run."

The through-line inherited from 101 is the delegation heuristic, extended one level up:

> **You may only systematize what you have verified by hand. And a workflow, like a model, must not make decisions about people.**

**Calibration thread (kept from 101):** every module's activity opens with a prediction — build time, time saved, error rate the verification layer will catch — and closes by scoring it. Honesty and specificity graded, never accuracy.

---

## The capstone thread

In M1 the learner picks **one real workflow from their own week**. Each module then advances it:

| Module | Capstone stage |
|---|---|
| M1 | Pick it and spec it |
| M2 | Build its context pack |
| M3 | Design its pipeline |
| M4 | Design its verification layer |
| M5 | Decide: stays manual, or earns an agent |
| M6 | Clear its data boundary |
| M7 | Set its operating rhythm and metrics |
| M8 | Run it for real; prove the before/after |

---

## Module 1 · From one-offs to workflows

*~30 min · no prereqs beyond 101*

The workflow lens: what separates "I used AI for this once" from "this runs every week." Anatomy of a repeatable workflow — trigger, inputs, transformation, verification, output, owner. Which of your tasks earn the treatment (frequency × structure × stakes) and which never will.

- **Lesson 1:** The anatomy. Five parts every workflow has, whether you drew them or not.
- **Lesson 2:** The audit. A structured pass over your actual week: recurring, structured, material-supplying tasks surface; judgment calls and one-offs stay out.
- **Lesson 3:** The selection rules. Why "annoying" is not "automatable"; why your highest-stakes task is the wrong first candidate.
- **Interactive:** a sorting exercise in the 101 style — twelve tasks from a People leader's week, sorted into *workflow it / keep it manual / never*.
- **Capstone stage:** pick one workflow, write the five-part spec. **Calibration:** predict hours/month it currently costs you.
- **Activity (AI-graded):** the spec, graded on concreteness, honest frequency/stakes assessment, and whether the verification part exists at all.

## Module 2 · Context that keeps

*~30 min · builds on 101 M5 (prompting as briefing)*

101 taught that output quality is mostly the material you supply. 201 makes the supplying durable: the briefing library. Role documents, voice and style guides, org context packs, definitions of done — written once, attached always.

- **Lesson 1:** From prompt to pack. Why retyping context is the biggest silent tax on AI use.
- **Lesson 2:** What goes in a context pack — and what must not (foreshadows M6: no employee-identifying data lives in a pack).
- **Lesson 3 `[V]` hands-on:** Claude Projects concretely — project instructions vs. attached knowledge, when each wins, screenshots. Parity note: ChatGPT custom GPTs / projects.
- **Lesson 4:** Maintenance. Context rots like documentation; a review cadence keeps packs honest (the course's own stable/volatile split, turned into a personal practice).
- **Capstone stage:** build the context pack for your workflow.
- **Activity:** submit the pack; graded on completeness, reusability, and the absence of anything M6 would flag.

## Module 3 · Document pipelines

*~35 min · the hands-heaviest module*

Long documents in, structured outputs out. Chains: summarize → extract → transform → format. Where pipelines break: context windows (101 M1 vocabulary, now load-bearing), lossy middle steps, format drift.

- **Lesson 1:** Chain thinking. Why one mega-prompt loses to three small steps with checkpoints.
- **Lesson 2:** The People-work pipeline gallery: survey verbatims → themes → exec summary; handbook → policy diff → plain-language change note; interview notes → structured debrief → calibrated packet.
- **Lesson 3 `[V]` hands-on:** running a real pipeline in Claude — attachments, step prompts, carrying outputs forward; when a Project beats a long conversation.
- **Interactive:** a broken-pipeline exercise — given a three-step chain with a lossy middle step, find where the numbers went wrong.
- **Capstone stage:** design your workflow's pipeline: steps, checkpoints, formats.
- **Activity:** run the pipeline on real (M6-safe) material; submit input, steps, output. **Calibration:** predict which step degrades quality most, then check.

## Module 4 · Verification by design

*~30 min · strong prereq for M5 — you may not automate what you can't verify*

101 M6 taught that fluent output deserves scrutiny. 201 turns scrutiny into architecture: verification as a designed layer, not a vibe. Sampling strategies, red-flag checklists, second-model review, and the sign-off question: who is accountable for this output when it leaves your hands?

- **Lesson 1:** The verification budget. 100% review kills the time savings; 0% ships fabrications. Sizing review to stakes.
- **Lesson 2:** Techniques by failure mode — spot-check sampling for volume work, citation-following for factual claims, adversarial reading ("argue this summary is wrong") for judgment-adjacent output.
- **Lesson 3:** The sign-off. Every workflow output has exactly one accountable human name on it. Writing that into the spec.
- **Capstone stage:** the verification plan for your workflow. **Calibration:** predict the error rate your sampling will find; run a sample; compare.
- **Activity:** verification plan + the sample results, graded on fit-to-stakes and honesty about what was found.

## Module 5 · Handing it to an agent

*~35 min · strong prereq: M4 · ceiling module — supervised autonomy, not orchestration platforms*

The word "agent" from 101's vocabulary, now operational: a model that takes actions within permissions. The autonomy ladder — draft-only → propose-then-approve → act-with-audit-trail — and why People work rarely goes past the middle rung. MCP as the connective tissue.

- **Lesson 1:** The autonomy ladder. Each rung, what it requires from your M4 verification design, and what breaks if you skip a rung.
- **Lesson 2:** What agents change about failure. A wrong draft wastes minutes; a wrong action can't always be taken back. Guardrails as permissions, not hopes.
- **Lesson 3 `[V]` hands-on:** MCP concretely — what a server is, connecting one to Claude, watching a supervised agent work with an approval gate. (This is also where the course itself, as an MCP server, appears — eating its own cooking.)
- **Lesson 4:** The refusal. Some workflows should stay manual forever; writing "no" into a spec is practitioner judgment, not failure.
- **Capstone stage:** the decision — manual, or which rung of the ladder — with the guardrail spec if it climbs.
- **Activity:** the decision memo, graded hardest on the *reasoning for the rung chosen*, not ambition.

## Module 6 · People data in production

*~30 min · strong prereq for M8 — nothing ships without this sign-off*

101 M4 asked "what can I paste?" once. A workflow asks it every run, forever, sometimes with nobody watching. Operationalizing the boundary: data tiers, redaction as a pipeline step, agreements (DPA vs. consumer tier — `[V]`), escalation, and the audit trail.

- **Lesson 1:** Tiering your inputs. Public / internal / person-identifying / protected — and what each tier permits.
- **Lesson 2:** Redaction and minimization as *designed steps*, with the test: could this run be shown to the person it concerns?
- **Lesson 3 `[V]`:** The agreement layer — enterprise deployments, data processing terms, retention. Verify with your security team; specifics move.
- **Lesson 4:** When it goes wrong anyway: the escalation path, written down before it's needed.
- **Capstone stage:** the data boundary sheet for your workflow — tiers touched, mitigations, the named sign-off.
- **Activity:** boundary sheet, graded on tier honesty and whether the mitigation matches the tier.

## Module 7 · The operating rhythm

*~25 min*

Workflows die of neglect, not failure. The personal system that keeps them alive: a weekly cadence, prompt/pack library hygiene, measurement that survives scrutiny (time saved, error rate caught, outputs shipped), and retirement — killing a workflow that stopped earning its keep.

- **Lesson 1:** The practitioner's week. Where AI work actually sits in a calendar that's already full.
- **Lesson 2:** Measurement without theater. Three numbers per workflow, tracked lazily but honestly. Before/after or it didn't happen.
- **Lesson 3:** Library hygiene and the review cadence — your personal stable/volatile split.
- **Capstone stage:** metrics chosen, baseline recorded, run schedule set.
- **Activity:** the rhythm doc. **Calibration:** predict which workflow element will decay first.

## Module 8 · Ship it and prove it

*~40 min · strong prereqs: M4 and M6 · the capstone lands*

Run the workflow for real, on real work, at least twice. Document the before/after with M7's numbers. Package it for handoff — could a peer run this from your documentation alone? Defend the verification and data design in writing.

- **Lesson 1:** The shipping checklist — spec, pack, pipeline, verification, boundary sheet, rhythm, all in one place.
- **Lesson 2:** The handoff test — run as a **minimal peer exchange**: each learner is paired with one other, runs the first step of their peer's workflow from the documentation alone, and returns a three-question structured review (Could I start? Where did I stall? What did the doc assume I knew?). Documentation quality measured by a stranger's success, not your satisfaction.
- **Lesson 3:** What's next — what the build seeded for the rungs above: 301's role depth, and the credibility 401's Translator work runs on.
- **Activity (the capstone grade):** full portfolio submission, graded across the course's four inherited dimensions — engagement with real work, observation of mechanics, calibration honesty across all eight predictions, practical insight — plus one new: *would a reasonable colleague trust this workflow's guardrails?*
- **Completion:** manager one-pager, 201 edition — what they built, the measured result, and the one question a manager should ask about it.

---

## Prerequisite map (201-internal)

- M1, M2, M3, M7: open order — take what serves you.
- M5 needs M4 (never automate unverified work).
- M8 needs M4 + M6 (nothing ships without verification and a data sign-off).
- Micro doses: every module gets the 2-minute cut, same as 101.

## Decisions (v1 review)

1. **Labs assume Claude access.** Deployments tailor lab content to the organization's provisioned tools — learners always see what they already have.
2. **Capstone privacy:** deferred. No sanitized track for now; revisit if real usage surfaces the problem.
3. **Peer exchange: in — with an async backstop.** Minimal mechanic at M8's handoff test (paired learners, run each other's first step, three-question structured review). Backed by a review queue: solo learners submit to it and an operator reviews cold with the same three questions; stalled pairings (no review within a week) route there automatically; solo learners give their review against a queued submission from the library. Requires an admin surface in the product (login, review queue, reporting, access-code management).
4. **Volatile refresh:** to be solved by automated scanning that incorporates tool changes into volatile blocks in near-realtime — the maintenance-agent story. Out of scope for now; the `[V]` discipline in the content keeps the door open.
