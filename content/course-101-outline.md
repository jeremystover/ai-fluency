# AI 101 · The Foundation — Course Outline (draft v1)

**Audience:** People leaders — HR business partners, talent and ER leads, People ops, CHROs and their benches. Same audience 201 inherits; 101 assumes no prior AI use and no technical background.
**Level transition:** L1 The Avoider (the material's "The Risk") → L2 The Novice.
**Shape:** 8 modules × ~25–35 min, each with a module brief, four lessons, key takeaways, one applied AI-graded activity, and a knowledge check. No capstone thread — 101 builds the mental model; 201 is where a single build runs through all eight.
**Tooling stance:** Tool-aware, not tool-taught. 101 names real tools where naming them is the point (M2, M3) but teaches properties, not clicks — the hands-on lab track starts in 201. **Every passage naming a model, price, feature, or regulation is volatile-layer** `[V]` so it refreshes without touching the concepts.

---

## Where the learner stands (design premise)

They have used AI once or twice, or avoided it deliberately, and in either case they cannot predict it. It produced something impressive and something wrong and they have no model that explains both. They are being asked to have opinions — about a vendor's "AI-powered" screening module, about whether their team may paste an employee complaint into a chatbot — with nothing to reason from. The 101 promise, in the learner's words:

> "Stop guessing. Give me a working model of what this thing is, so I can tell when it's helping, when it's lying, and when it has no business near this decision at all."

The through-line, stated in M1 and carried by every module after it:

> **The delegation heuristic:** AI does well when you supply the material and ask for transformation; badly when the task needs organizational knowledge it was never given; and it must not make decisions about people.

Each module is one clause of that heuristic, made operational. M2–M5 build *supply the material*. M6–M7 build *and it must not*. M8 makes the whole thing something the learner can be accountable for out loud.

**Calibration thread (inherited by 201):** every module's activity opens with a prediction and closes by scoring it. Honesty and specificity graded, never accuracy. M1's diagnostic doubles as the test-out.

---

## What this draft borrows, and from where

The structural shape below — module brief → learning objectives → four numbered lessons → key takeaways → one named applied activity → sources and attribution — follows the Brainstorm AI 101 reference material, which uses tighter lesson granularity than our 201 outline does. Worth borrowing: a People leader reading a 30-minute module wants four labeled landings, not three long ones.

The **topics** are ours, unchanged from `content/modules.json`. Brainstorm's spine is written for GTM roles and carries two modules we don't want (a history module and a forecasting module) while missing the two that matter most for this audience: working with documents and employee data (M4) and the bias / adverse-impact module (M7). Those two are also load-bearing in `src/shared/goals.ts` — the `safety` and `strategy` goals point at them directly — so dropping them would silently break the intake's "recommended for you" mapping.

One piece of the Brainstorm material is worth keeping: its M2 history arc, whose real payoff is not the history but the poise it produces — being able to talk to a skeptical colleague without either overclaiming or dismissing. **Recommendation: fold it into M2 as Lesson 1 (~500 words), not a standalone module.** See Decision 1.

---

## Module 1 · What is AI?

*~30 min · no prereqs · **authored and shipping** — documented here for completeness*

A working mental model: what an LLM actually does, the vocabulary, why data decides everything, and the delegation heuristic the rest of the course leans on.

- **Lesson 1:** What we mean when we say "AI" — the category vs. the large language model, and the scoring/matching models already in the HR stack. `[V]` on tool and regulatory specifics.
- **Lesson 2:** What an LLM actually does, in plain English. One fragment at a time, predicted from everything in view. Why it doesn't remember you `[V]`; the honest part — nobody fully understands the inside.
- **Lesson 3:** The vocabulary, demystified — context window, knowledge cutoff `[V]`, hallucination, tokens, multimodal `[V]`, agent.
- **Lesson 4:** Why data is the whole game. Training data, the data you supply, and a first pass at what you may paste `[V]`.
- **Interactive:** sorting exercise — "Where does AI actually help?", twelve People-work tasks sorted by how much organizational knowledge each needs.
- **Activity:** *"Testing the Edges"* — three short conversations (where it's strong, where it's missing your context, where it's confidently wrong) plus a 250–350 word reflection.
- **Knowledge check:** 10 questions.

## Module 2 · Choosing the tool for the task

*~25 min · no prereqs · pairs naturally with M1*

Three different things wear the word "AI" in a People leader's week, and confusing them is how both over-trust and over-compliance start. Chat assistants, copilots embedded in tools you already pay for, and the scoring or matching engines inside the HR stack — what each is for, and how to tell a language model from a scoring engine before relying on either.

- **Lesson 1:** The long arc, briefly. Seventy years, two AI winters, and what actually changed in 2017 — enough history to hold the nuance with a skeptic without overclaiming or dismissing. *(Adapted from the Brainstorm M2 material — see Decision 1.)*
- **Lesson 2:** The three shapes. `[V]` Assistants (Claude, ChatGPT, Gemini), copilots (the AI inside your ATS, HRIS, docs suite), and decision engines (resume scorers, attrition models, matching). What each is optimized for and what each fails at.
- **Lesson 3:** Telling them apart from the outside. The four questions that identify what you're actually looking at — what goes in, what comes out, is the output text or a score, and who is accountable for it. The tell that matters most: *does it produce language, or a number that ranks a person?*
- **Lesson 4:** Choosing without getting paralyzed. Matching the shape to the task; why "which tool is best" is almost always the wrong question and "what is this task actually asking for" is the right one. `[V]` parity notes.
- **Interactive:** choice exercise — eight things a vendor said in a demo; identify which shape of AI each describes, and which claim can't be true of that shape.
- **Activity:** *"The Stack Audit"* — inventory the AI already touching your People function (three systems minimum, from tools you actually use), classify each by shape, and name the one question you'd ask each vendor. **Calibration:** predict how many of your systems have AI in them before you look.
- **Knowledge check:** 8 questions.

## Module 3 · What it costs and how it scales

*~25 min · no prereqs · sharpest module for anyone who sits in vendor conversations*

Tokens, context windows, and pricing — enough economics to size a use case, read a vendor quote without nodding along, and know when a more expensive model is worth it. The M1 vocabulary, now with money attached.

- **Lesson 1:** The token economy. What a token is, why everything is priced in them, and why "it's just a subscription" stops being true the moment something runs on a schedule. `[V]` on current prices.
- **Lesson 2:** The context window as a budget. Why long documents cost more than short ones, why a long conversation degrades, and the practical ceiling on "just paste the whole handbook." `[V]`
- **Lesson 3:** Why a bigger model isn't always the answer. Capability vs. cost vs. latency, and the honest read: most People-work tasks are served by the cheaper tier, and the tasks that aren't are usually the ones you shouldn't be delegating anyway.
- **Lesson 4:** Reading a vendor quote. Per-seat vs. per-use pricing, what "unlimited" means in practice, the questions that expose a thin wrapper `[V]`, and the procurement question this has quietly become.
- **Interactive:** choice exercise — four pricing structures against four usage patterns; match them, then find the one pairing that goes badly wrong at scale.
- **Activity:** *"Size One Use Case"* — take one recurring People task, estimate its volume and its inputs, and produce a defensible order-of-magnitude cost. **Calibration:** predict the monthly cost before doing the arithmetic, then score the gap.
- **Knowledge check:** 8 questions.

## Module 4 · Working with your documents and data

*~30 min · no prereqs · foreshadows M8 and 201 M6*

Getting your world into the model's view without crowding out the question — or crossing a line legal hasn't cleared. Attachments, long documents, and the paste question answered properly rather than nervously.

- **Lesson 1:** Supplying material beats describing it. M1's central lever made practical: the difference between "summarize our PTO policy" and attaching the policy.
- **Lesson 2:** What happens to a long document. Chunking, the lossy middle, and why a 60-page handbook doesn't arrive intact — with the symptom to watch for (confident summaries of sections it never really saw). `[V]`
- **Lesson 3:** The paste question, answered. `[V]` A tiering the learner can actually apply — public / internal / person-identifying / protected — and what each tier permits under a consumer tier vs. an enterprise agreement. The test that survives contact with reality: *could this run be shown to the person it concerns?* Verify specifics with your security team; this moves.
- **Lesson 4:** Redaction that isn't theater. What actually de-identifies an ER narrative and what only looks like it does — names removed but the office, the role, and the date left in.
- **Interactive:** sorting exercise — twelve real People artifacts (job posting draft, exit interview notes, engagement survey verbatims, a comp band, an accommodation request) sorted into the four tiers.
- **Activity:** *"The Redaction Pass"* — take one real document you'd want AI's help with, produce the version you'd actually paste, and write what you removed and why. **Calibration:** predict how much of it survives redaction.
- **Knowledge check:** 8 questions.

## Module 5 · Prompting as briefing

*~35 min · **prereq: M1** · the module that changes the learner's Monday*

Role, task, context, format. Prompting as briefing a capable stranger who has never seen your organization — and iteration as the keystone behavior that separates fluent users from frustrated ones.

- **Lesson 1:** Briefing a capable stranger. Why the mental model of "search query" produces bad prompts and "new contractor, first day, no context" produces good ones.
- **Lesson 2:** The four parts. Role, task, context, format — what each one buys, and which one People leaders skip most (context, always).
- **Lesson 3:** Iteration is the skill. The first output is a draft of the *brief*, not the work. Steering moves that reliably work: name what's wrong, supply the missing material, constrain the format, ask it to try again differently.
- **Lesson 4:** Examples as the strongest lever. One good example of the output you want beats three paragraphs describing it — and where to get examples in People work without leaking anything M4 flagged.
- **Interactive:** choice exercise — the same task briefed four ways; rank the briefs and identify what each one leaves the model to invent.
- **Activity:** *"Brief It Twice"* — one real task, a deliberately thin prompt and a properly built brief, both outputs submitted with a 200-word read on what changed. **Calibration:** predict how much better the second one will be, on a 1–10 scale, before running it.
- **Knowledge check:** 8 questions.

## Module 6 · When it's confidently wrong

*~30 min · **prereq: M1** · strong prereq for M7*

Hallucination in depth: why fluent output deserves more scrutiny rather than less, and the verification habits that keep a fabricated citation out of a document with someone's name on it.

- **Lesson 1:** Why confidence and correctness came apart. The mechanism from M1, followed to its conclusion — fluency is generated the same way whether the content is right or invented, so it carries no signal about accuracy.
- **Lesson 2:** The failure taxonomy. Fabricated specifics (citations, statutes, statistics), plausible-but-wrong reasoning, confident gaps where organizational knowledge should be, and stale facts past the cutoff `[V]`. Each has a different tell.
- **Lesson 3:** Verification habits that fit a real week. Spot-checking by stakes rather than reviewing everything, following claims to sources, and adversarial reading — "argue this summary is wrong" — as a two-minute move.
- **Lesson 4:** The high-risk surface in People work. Policy citations, legal references `[V]`, numbers in a board deck, and anything about a named individual. Where a single fabrication is a real incident rather than an annoyance.
- **Interactive:** choice exercise — four AI outputs on People topics, each containing one planted error; find it and name its failure type.
- **Activity:** *"Catch It Lying"* — get a model to produce something confidently wrong in your own domain, document how you caught it, and write the verification rule you'd give your team. **Calibration:** predict how many attempts it takes to produce a checkable falsehood.
- **Knowledge check:** 8 questions.

## Module 7 · The lines that don't move

*~30 min · **prereq: M6** · the module this audience is uniquely accountable for*

Bias, adverse impact, and decisions about people. Where AI assists, where it must stop, and how to say so in a way your organization will actually follow.

- **Lesson 1:** Bias isn't a bug in the data, it's a property of it. All training data carries it; in employment contexts that's the mechanism behind adverse impact, not a metaphor for it.
- **Lesson 2:** Assist vs. decide. The line the heuristic draws, applied to the cases that actually come up — screening, ranking, performance language, promotion packets, terminations. Why "the human reviewed it" is not automatically a defense when the human reviewed a ranked list.
- **Lesson 3:** The regulatory shape `[V]`. Employment as a high-risk category, disparate-impact exposure, the direction of travel in the EU and US. Enough to ask counsel the right question — not a substitute for asking.
- **Lesson 4:** Saying no so it sticks. Writing a line your organization will follow: specific, tied to a named decision, with the alternative attached. The refusal that names what you *will* do lands; the one that only forbids gets routed around.
- **Interactive:** sorting exercise — ten uses of AI in a People function sorted into *assist / assist with verification / never*.
- **Activity:** *"Draw the Line"* — one page for your own function: three uses you endorse, two you'd forbid, the reasoning a skeptical executive would accept, and who signs off. **Calibration:** predict how many of your own current or planned uses land on the wrong side.
- **Knowledge check:** 8 questions.

## Module 8 · What you own

*~25 min · no hard prereqs, but assumes M4, M6, M7 · the course lands*

Data agreements, disclosure, and accountability. What you're responsible for when AI touched the work — and the policy questions worth settling before someone asks.

- **Lesson 1:** The output is a draft, never a decision. Accountability doesn't transfer to a tool, and the sentence "the AI wrote it" has never once helped anyone.
- **Lesson 2:** The agreement layer `[V]`. Consumer tier vs. enterprise terms, training on your inputs, retention. What to verify before your team is told it's fine.
- **Lesson 3:** Disclosure. When AI involvement should be visible, to whom, and the honest test — would the person reading this feel misled to learn how it was made? Applied to candidate communications, ER documentation, and board material.
- **Lesson 4:** The five questions to settle now. A short policy skeleton a People leader can bring to legal and IT rather than wait for.
- **Interactive:** none — this module closes with the activity rather than an exercise.
- **Activity (course close):** *"The One-Pager"* — what you'll use AI for, what you won't, what you'll verify and how, and what you'd tell your team on Monday. Graded on specificity and whether the verification part exists at all. **Calibration:** score every prediction made across the eight modules; direction of error named.
- **Knowledge check:** 8 questions.
- **Completion:** manager one-pager, 101 edition — what changed in their model, and the one question a manager should ask them about it.

---

## Prerequisite map (101-internal)

- M1 first, or test out via the diagnostic (at most one knowledge miss).
- M2, M3, M4: open order after M1 — take what serves you.
- M5 needs M1 (you can't brief well without knowing what you're briefing).
- M6 needs M1; M7 needs M6 (you can't reason about adverse impact until you know why output is unreliable).
- M8 assumes M4, M6, M7 but doesn't hard-gate — nothing hard-locks in this product; prereqs are advisory and carry an `unlockHint`.
- Micro doses: every module gets the 2-minute cut.

## Per-module deliverables (what "authored" means)

Each module ships a package under `content/modules/<id>/`, generated from a draft at `content/ai101-mN-<slug>.md` via `scripts/convert-draft.mjs`, then hand-tuned:

| File | Drives | Notes |
|---|---|---|
| `blocks.json` | the read, the chat tutor, the podcast | generated from the draft |
| `micro.json` | the 2-minute cut | hand-written; three blocks — core, one callout rule, what the full module adds |
| `knowledge-check.json` | `capabilities.knowledgeCheck` | 8 questions (M1 has 10); keys stay server-side |
| `rubric.json` | `capabilities.activity` | 4 dimensions incl. Calibration |
| `sorting.json` *or* `choice.json` | `capabilities.sorting` | one per module except M8 |
| `activity.json` | the activity brief | generated from the draft |

Then `status` flips to `open` in `content/modules.json` and `node scripts/generate-seed.mjs` regenerates `seed/seed.sql`.

## Decisions (v1 review)

1. **The history arc: folded into M2 as Lesson 1, not a standalone module.** ~500 words, stable layer. It earns its place as poise with a skeptic, not as history for its own sake. The alternative — a ninth module, or displacing M4/M7 — costs us goal mappings in `goals.ts` for a topic this audience didn't ask for.
2. **Four lessons per module, borrowed from the reference structure.** Our 201 modules run three long lessons; 101's audience is newer to the material and reads better with four labeled landings.
3. **No capstone thread in 101.** Deliberate: 101 builds the model, 201 builds the thing. Module activities stand alone so a learner can take M3 without having taken M2.
4. **Knowledge checks at 8 questions**, matching 201. M1's existing 10 stays as-is rather than being trimmed for symmetry.
5. **Tool naming is volatile-layer everywhere.** 101 names more tools than 201 does (M2 and M3 require it), so the `[V]` discipline matters more here, not less.
6. **Source hygiene.** The Brainstorm reference material is CC BY-NC-SA 4.0, adapted from the AI Fluency Framework (Dakan & Feller, with Anthropic). We take structure and topic coverage, not prose. Any passage that ends up close to the source gets attributed in that module's sources block — open question flagged below.

## Open questions for review

- **Brand examples.** M2 Lesson 2 and M3 Lesson 4 read much better with named products. Do we keep them generic, or lean on the seeded brand profile (`aiTools` in `content/brands/*.json`) so each deployment sees its own stack?
- **M8's missing interactive.** Every other module has a sorting or choice exercise; M8 currently closes on the activity alone. Fine, or does it want one?
- **Attribution.** Confirm whether any Brainstorm-derived passage stays close enough to require a CC BY-NC-SA credit line, and whether that license is compatible with this product's commercial posture.
- **M7 and legal review.** The regulatory lesson `[V]` makes claims about employment as a high-risk category. Worth a counsel read before it ships, not after.
