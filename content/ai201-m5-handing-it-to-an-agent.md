# AI 201 · Module 5 — Handing it to an agent

**Course:** AI 201 · The Practitioner · Module 5 of 8
**Estimated time:** 35 min content · 10 min exercise · 25 min capstone activity
**Prerequisite:** **M4, strictly.** The autonomy ladder is priced in verification evidence — your
M4 sample results and escalation line are inputs to this module's capstone. No budget, no ladder.
**Builds on:** 101 M1 (the word "agent") · 201 M3 (pipelines, artifacts) · 201 M4 (the budget, the sign-off, the escalation line)

> `Concepts reviewed: [DATE] · Examples current as of: [DATE]`
> Lesson 3 is **[V]** volatile layer — MCP mechanics and tool specifics, refreshed independently,
> tailored to your organization's provisioned tools. The ladder itself is stable: it will outlive
> every product named near it.

---

## Calibration prompt — before you start

*One prediction, thirty seconds. The capstone measures it.*

Think about actually running your workflow, end to end, yourself.

**What percentage of that runtime is mechanical shuttling** — pasting artifacts between steps,
re-attaching files, moving outputs to where they live — **versus actual judgment?** Write the
split down (e.g., "70% shuttling / 30% judgment").

This number is the honest case for agents, and most people get it wrong in a revealing
direction: they overestimate the judgment share, because judgment is what they remember doing.

---

## Module brief

101 gave you the word: an **agent** is a model configured to take actions rather than only
respond — within whatever permissions it's been given. You didn't need it then. You need it now,
because your workflow has reached the point where the word gets practical.

Look at what you built across M1–M4. A spec. A pack. A pipeline whose steps run from a runbook,
one conversation each, artifacts carried between. A verification layer with real sample data.
And notice who's doing the carrying: you, pasting a theme table from one conversation into the
next, every run, forever. The pipeline thinks; you shuttle.

An agent, concretely, is the thing that does the shuttling — and possibly more. It can run your
step prompts in sequence, read the source files itself, save the artifacts where they live, and
stop to ask you at the moments you've defined. The question this module teaches is not *whether
that's possible* (it is, and Lesson 3 shows it) but *how much of it your workflow has earned* —
because autonomy is not a feature you turn on. It's a level of trust you extend, one rung at a
time, priced in the verification evidence you built in M4.

Two sentences frame everything that follows. A wrong draft wastes minutes; a wrong action may
not be reversible. And the practitioner's heuristic hasn't moved: a workflow must not make
decisions about people — which means there are rungs some workflows must never climb, and
saying so in writing is the most senior judgment this course teaches.

---

## Learning objectives

By the end of this module you should be able to:

1. Place any workflow step on the autonomy ladder — draft-only, propose-then-approve,
   act-with-audit-trail — and price the rung in M4 verification evidence.
2. Explain what agents change about failure: reversibility, blast radius, and why speed makes
   old failure modes worse rather than new ones rarer.
3. Distinguish a guardrail from a hope — permissions and tool scope versus polite instructions.
4. Describe what MCP is and watch a supervised agent run a pipeline step behind an approval
   gate. **[V]**
5. Write a refusal: a defensible "this workflow stays manual" with reasons that survive a
   curious executive.

---

## Lesson 1 · The autonomy ladder

Three rungs. Each is a different answer to "what may the system do without waiting for you?" —
and each has a price, payable in evidence from M4, not in enthusiasm.

**Rung 1 — Draft-only.** The model produces; a human does everything else — reviews, decides,
moves, sends. This is where every workflow in this course has lived so far, and it is not the
beginners' rung; it is the *permanent* rung for whole categories of work (Lesson 4). Price of
admission: the M4 baseline — a budget, a sign-off, an honest sample. You've paid it.

**Rung 2 — Propose-then-approve.** The agent executes steps and *stages* actions — the debrief
is formatted and sitting in the shared drive as a draft, the artifact is saved, the email is in
the outbox — but nothing crosses a boundary until a human approves. The approval *is* your M4
sign-off, reading list attached: what the approver looks at is defined, short, and real. Price:
your sampled error rate is below the escalation line you set in M4, across enough runs to mean
something — and the staged action is inspectable in seconds, not minutes. If approving takes as
long as doing, the rung bought nothing.

**Rung 3 — Act-with-audit-trail.** The agent completes defined actions without per-action
approval, and every action lands in a log reviewed on a cadence — sampling for actions, exactly
parallel to M4's sampling for outputs. Price, and it's steep: a *sustained* low error rate over
a run history, actions that are mechanical and checkable (file this artifact, update this
table), and — the master question — **reversibility**. An action you can undo cheaply may earn
rung 3. An action you can't take back (a sent email, an external message) needs rung 2 at most,
usually forever.

Two rules make the ladder usable rather than decorative:

**Autonomy is granted per step, not per workflow.** Your pipeline's extract step might earn
rung 3 (read files, produce a table — reversible, checkable); the narrate step rung 2; anything
person-adjacent stays rung 1. A workflow is a profile of rungs, not a single setting. This one
idea prevents both failure modes of agent adoption: all-or-nothing paralysis and all-at-once
recklessness.

**Skipping a rung is how the cautionary tales start.** Draft-only teaches you the failure modes
(M4's sample). Rung 2 teaches you the *approval load* — how often you actually say no, which is
data: an approval you've never once declined in thirty runs is evidence for rung 3; an approval
you decline weekly is evidence the workflow isn't ready, whatever the demo looked like. Rung 3
without that history isn't automation; it's hope with permissions.

> ### Try this — 2 minutes
> Take your pipeline's steps from M3. For each, answer only the master question:
>
> *If this step did its worst plausible thing, could I undo it in under five minutes?*
>
> Yes, cheaply → rung 3 is discussable someday. Yes, awkwardly → rung 2 ceiling. No → rung 1,
> and write down why. You've just drafted your autonomy profile.

---

## Lesson 2 · What agents change about failure

Nothing about 101's failure modes went away. The model still fabricates, still flattens, still
can't know your org beyond what you supply. What an agent changes is the *physics* around those
failures — three shifts, each with a design response.

**Reversibility replaces quality as the first question.** A bad draft costs the minutes it
takes to notice. A bad action costs whatever it costs — a wrong file overwritten, a half-updated
tracker, a message that left the building. Before an agent gets any action, you ask not "how
often will it be wrong?" but "when it's wrong, what does undo look like?" That's why the ladder
prices rung 3 on reversibility, and why "the agent drafts the email" and "the agent sends the
email" are different rungs separated by an irreversibility boundary, not a feature toggle.

**Speed multiplies exposure.** Your manual workflow produced errors at some rate, caught by an
M4 budget sized to a human pace. An agent runs the same workflow — same error rate — twenty
times while you're in a meeting. The response is mechanical: when run frequency goes up, sample
size and audit cadence go up *with* it. An M4 budget priced for weekly manual runs is not a
budget for hourly agent runs; repricing is part of climbing.

**Guardrails must be permissions, not hopes.** "Please don't email anyone" in a prompt is a
hope — a sentence competing with everything else in the context window. Not connecting the
email tool is a permission: a fact about what the agent *can* do, true regardless of what the
model predicts next. The design rule: **an agent's tool list should mirror its rung, not its
potential.** Rung 2 agents get read tools and staging tools; send-and-commit tools simply
aren't attached. You'll recognize the pattern — it's M2's boundary discipline again, applied to
capabilities instead of data: what must not happen shouldn't be *representable*, not just
discouraged.

And the people-line, one level up, stated without softening: **an agent must never hold
permissions that let it act on a person** — send the rejection, change the employment status,
update the candidate stage. Not because approval gates can't be built, but because M4 showed
you what happens to approvals under load: they decay into rubber stamps, and a rubber-stamped
action on a person is the exact laundering M1 prohibited, now running at machine speed. Person-
affecting actions stay in human hands. The agent may prepare; it may never touch.

---

## Lesson 3 · The lab — MCP, and an agent behind a gate **[V]**

*Volatile layer: current mechanics, tailored to your organization's provisioned tools.*

**What MCP is, in course vocabulary.** The Model Context Protocol is a standard way to give a
model tools and data access — a defined set of things it may read and do, offered by a server,
connected to your assistant. When your organization connects an MCP server to Claude, it's
answering exactly the questions this module taught: *what may this agent see, what may it do,
and what's simply not attached?* The protocol is the permissions-not-hopes rule with a spec
sheet.

**What connecting looks like.** In Claude, an MCP connection appears as a set of named tools
the model can call — read this folder, search that system, save an artifact there. You (or your
admin) choose which servers, and each server declares its tools. The People-work examples that
matter: a document store scoped to your policy folder (read-only), a calendar, an export from
the HRIS that's already been through the redaction you'll design in M6. Note what's happening
in ladder terms: *read* tools are cheap trust; *write* tools are rung decisions.

**The demonstration — this course, eating its own cooking.** This course ships as an MCP
server. Connected to Claude, it exposes the curriculum as tools: fetch a module's runbook
patterns, pull the delegation heuristic, check a workflow spec against the course's rules. In
the lab you watch a supervised agent run one step of a survey pipeline using it: the agent
reads the step prompt from the runbook, produces the theme table, and *stops* — the approval
gate — showing you the artifact and the action it wants to take ("save to the project's
artifacts"). You read the table (your M3 checkpoint, unchanged), approve, and watch the action
land in the audit log. That pause is rung 2, made visible: the agent did the shuttling; the
checkpoint stayed human.

**What to notice.** Three things, all course-vocabulary made concrete: the agent never had a
send-anything tool (permissions, not hopes); the approval showed you an inspectable artifact,
not a summary of one (M4's reading list); and the log entry is the audit trail rung 3 would
live on, if this step ever earns it.

**[V]** *Parity note:* ChatGPT and other assistants connect to MCP servers or equivalent tool
frameworks; names and connection flows differ, the ladder does not. Your deployment's lab track
shows the mechanics in the tools your organization has actually provisioned.

---

## Lesson 4 · The refusal

Some workflows must never climb. Saying so, in writing, before anyone asks — that's not
timidity; it's the most senior artifact this course produces.

**What earns a permanent rung 1 (or a permanent "no workflow at all"):**

- **Person-affecting output or action** — the M1 line and its agent-level extension from
  Lesson 2. The packet informs; the human decides; nothing about that is waiting for better
  models.
- **Judgment-dense work in repetitive clothes** — the grievance response, the sensitive
  conversation. M1's sorting exercise flagged these; agent tooling doesn't unflag them.
- **Low-frequency, high-stakes work** — the RIF communication. No run history can ever
  accumulate, so no rung above 1 can ever be priced. The ladder isn't pessimistic about these;
  it's *unpriceable*, which is the same answer with better reasoning.
- **Material that can't safely be supplied** — where the inputs themselves are the problem.
  M6 makes this precise next module.

**Writing the no.** One line in the spec, three parts: the ceiling, its permanence, the reason.
*"Autonomy ceiling: draft-only, permanent. This workflow's output shapes treatment of named
individuals; under the course heuristic it must not act, and approval-gated action would decay
into laundering under load."* That sentence does real work. It survives the M8 handoff — your
successor inherits the boundary with its reasoning attached. And it survives the executive who
asks, reasonably, "can't we automate the rest of this?" — because it shows the automation
*decision was made*, deliberately, by someone who understood the ladder, rather than defaulted
into by someone who feared it.

**The refusal is reviewable, not sacred.** Permanent ceilings get revisited when the *reasons*
change — the workflow's scope shifts, the inputs change tier — never merely because the tools
got better. "The model is more capable now" changes nothing about an unpriceable run history or
a person on the receiving end. Write the review trigger into the line if it has one.

### Exercise — Assign the rung

*Five minutes. Commit before you look.*

Six steps from a People team's workflows. Assign each its **maximum responsible rung**: 1
(draft-only) · 2 (propose-then-approve) · 3 (act-with-audit-trail) · R (refusal — shouldn't be
in an agent's hands at all). Assume M4 budgets exist and error rates are good.

1. Extract a theme table from this quarter's survey verbatims
2. Draft rejection emails for the week's declined candidates
3. Save the formatted debrief into the hiring channel's shared folder
4. Send the weekly HR newsletter to the all-staff list
5. Update each candidate's stage in the ATS after the debrief meeting
6. Compile the weekly people-metrics table from the HRIS export

*(Key at the end. Two items are rigged to separate "reversible" from "feels routine.")*

---

## Capstone stage 5 · The decision memo

Your workflow's autonomy profile, decided and defended. This memo is graded hardest on the
reasoning for the rung — ambition earns nothing; evidence does.

**Submit:**

1. **The shuttling measurement.** Time one real run. Report the actual shuttling/judgment
   split against your calibration prediction from the top of the module, direction of miss
   named. This is your honest case for (or against) bothering with an agent at all.
2. **The profile.** Each pipeline step: its rung, priced in your M4 evidence — sampled error
   rate vs. your escalation line, what the approval would read (rung 2), reversibility and
   audit cadence (rung 3). A step you're keeping at rung 1 needs a sentence too: "not yet" and
   "never" are different answers with different reasons.
3. **The guardrail spec** — for any step above rung 1: tools granted, tools *deliberately not
   attached* (name them — the unattached list is the design), approval points and their
   reading lists, the audit log and who reviews it on what cadence, and the blast-radius
   sentence: the worst plausible action and what undo looks like.
4. **The refusal, if it applies** — and for most first workflows it applies somewhere: the
   ceiling line, written per Lesson 4, review trigger included if one exists.

### Rubric — 20 points

| Dimension | 5 points |
|---|---|
| **Rung reasoning** | Every rung priced in verification evidence, not capability enthusiasm. "Not yet" distinguished from "never," both defended. |
| **Guardrails are permissions** | The spec controls what's attached, not what's requested. The not-attached list is present and thoughtful. Blast radius stated honestly. |
| **Per-step granularity** | The profile treats steps individually; any all-or-nothing answer is argued for, not defaulted to. |
| **Calibration** | Shuttling prediction recorded first, measured against a real run, direction of miss named. Honesty and specificity graded; accuracy never. |

---

## Key takeaways

- **Autonomy is trust extended one rung at a time** — draft-only, propose-then-approve,
  act-with-audit-trail — priced in M4 evidence, granted per step, never per workflow.
- **Reversibility is the master question.** A wrong draft costs minutes; a wrong action costs
  whatever undo costs. Irreversible actions cap at rung 2 — usually forever.
- **Speed multiplies exposure.** Agent-rate runs need agent-rate sampling. Climbing a rung
  reprices the M4 budget; that's part of the fare.
- **Guardrails are permissions, not hopes.** The tool list mirrors the rung; what must not
  happen isn't representable. "Please don't" is not a control.
- **An agent must never hold permissions that act on a person.** Approval gates decay under
  load; a rubber-stamped action on a person is laundering at machine speed. Prepare, never touch.
- **The refusal is a senior artifact.** Ceiling, permanence, reason — written before anyone
  asks, reviewed when reasons change, never merely because tools improved.

---

## Exercise key — Assign the rung

**1. Extract theme table — rung 3.** Read-only input, structured checkable output, trivially
reversible (regenerate), and your M3 checkpoint still reviews the artifact downstream. This is
what rung 3 was made for: mechanical transformation with an audit trail.

**2. Draft rejection emails — rung 1, permanent.** Drafting is legitimate (M1's sorting said
so); anything above draft-only walks toward the person-line. The draft lands in a human's
hands; a human sends, every time. Note the trap in the wording: "draft" was always the rung —
the question is refusing the climb.

**3. Save the debrief to the shared folder — rung 2, arguably 3 with history.** First rigged
item. It *feels* routine, and it's probably reversible (versioned drive, delete-able file) —
but "save to where the hiring team reads" is a small publish. Rung 2 until the approval log
shows you never decline; then rung 3 is an evidence-based conversation.

**4. Send the newsletter — rung 2, ceiling.** Second rigged item, the reverse trap: low
stakes, so rung 3 feels fine — but *send to all-staff* is irreversible. Reversibility, not
stakes, sets the cap. The agent stages it in the outbox; a human's click is the boundary
crossing. That click costs three seconds; the un-sendable email costs more.

**5. Update candidate stages in the ATS — R.** An action on a person's process in the system
of record. The agent may *prepare* the list of stage changes as an artifact (rung 1–2 work);
the human executes in the ATS. If the volume makes that painful, the pain is information about
the process, not a case for permissions.

**6. Compile the metrics table — rung 3.** Mechanical, checkable against the export,
regenerable, feeding a human-owned narrative downstream. With a sampled error history, this is
the least controversial climb on the board.

**The pattern:** rung 3 lives where work is mechanical, checkable, and undoable. The boundary
crossings — publish, send, touch a person's record — are where humans stand, and the two rigged
items show the tell isn't how routine a step *feels* but what its undo costs.

---

## Knowledge check — 8 questions

*Unlocks after the decision memo is submitted. Retakes are free and unlimited.*

**Q1.** The three rungs of the autonomy ladder, in order of extended trust:
- A. Read-only → read-write → admin
- B. Draft-only → propose-then-approve → act-with-audit-trail ✓
- C. Manual → assisted → autonomous
- D. Chat → project → agent

> **B.** Each rung is an answer to "what may the system do without waiting for you?" — and each
> is priced in verification evidence, not capability.

**Q2.** What is the "price" of rung 2 (propose-then-approve)?
- A. An enterprise license for agent features
- B. A sampled error rate below your M4 escalation line, plus an approval that's inspectable in seconds with a defined reading list ✓
- C. Manager authorization
- D. A successful demo of the agent completing the workflow

> **B.** The ladder is priced in M4 currency. A demo (D) is capability evidence; the ladder
> runs on *verification* evidence — your error history, your escalation line, your reading list.

**Q3.** Why does reversibility, not stakes, cap the newsletter-send at rung 2?
- A. Newsletters are high-stakes communications
- B. Sending to all-staff cannot be undone, and irreversible actions keep a human at the boundary regardless of how low the stakes are ✓
- C. Email tools cannot be connected to agents
- D. It doesn't — low stakes justify rung 3

> **B.** The master question is what undo costs. Low stakes shrink the *harm*; they don't
> restore the *option*. The three-second human click is the cheapest control in the module.

**Q4.** "Guardrails are permissions, not hopes" means:
- A. Write guardrail instructions in the system prompt, prominently
- B. Control what tools are attached — what must not happen shouldn't be representable ✓
- C. Require the agent to confirm it understands its restrictions
- D. Log all agent actions for review

> **B.** An instruction is a sentence competing inside a context window; an unattached tool is
> a fact. A and C are hopes with better formatting; D is necessary for rung 3 but doesn't
> *prevent* anything.

**Q5.** An approval you have never once declined across thirty runs is:
- A. Proof the approval step is unnecessary bureaucracy
- B. Evidence for a rung-3 conversation about that step — the approval load data the ladder asks for ✓
- C. Evidence the approver isn't reading carefully
- D. Normal, and means nothing

> **B.** Rung 2 generates exactly this data: how often the human actually says no. A clean
> approval history is the evidence-based case for climbing; a decline-heavy one is the case
> the workflow isn't ready. (C is possible — which is why the approval's reading list is
> defined; an approver who stopped reading is M4's repricing signal.)

**Q6.** Why does the module bar agents from holding person-affecting permissions even behind approval gates?
- A. Regulations prohibit all agent actions in HR systems
- B. Models aren't accurate enough yet for personnel actions
- C. Approvals decay into rubber stamps under load, and a rubber-stamped action on a person is decision-laundering at machine speed ✓
- D. Person-affecting actions are too slow to automate profitably

> **C.** The argument is structural, not statistical: M4 showed what load does to approvals,
> and M1's line — the human must genuinely decide — can't survive that decay when actions fire
> at agent speed. B implies better models change the answer; they don't.

**Q7.** The RIF communication can never climb above rung 1 because:
- A. It's too emotionally sensitive for a model to draft
- B. As low-frequency, high-stakes work, no run history can accumulate — so no higher rung can ever be priced ✓
- C. Legal review is required for RIF communications
- D. It can, once error rates on other workflows are established

> **B.** The ladder's currency is run history for *this* work; other workflows' evidence (D)
> doesn't transfer. "Unpriceable" is the ladder's own vocabulary for why some ceilings are
> permanent — better reasoning than "too risky," same conclusion.

**Q8.** A well-written refusal contains:
- A. The ceiling, its permanence, the reason — and a review trigger tied to changed reasons, not improved tools ✓
- B. A list of the agent features evaluated and rejected
- C. The date after which automation will be reconsidered
- D. Sign-off from IT and Legal

> **A.** The refusal is a decision artifact: it shows the automation decision was *made*, with
> reasoning a successor and a curious executive can both read. C reconsiders on a calendar;
> the module reconsiders when reasons change — "the model got better" isn't one.

---

## Sources and attribution

Builds on 101 M1 (the agent definition; the decisions-about-people line) and 201 M2–M4 (boundary
discipline extended from data to capabilities; pipelines and artifacts; the budget, sign-off
decay, and escalation line). The three-rung ladder, per-step autonomy profiles, approval-load-
as-evidence, reversibility as the master question, and the refusal-as-artifact framing are
original to this course. Lesson 3 and marked passages are volatile layer — MCP and tool
mechanics current as of the stamp date, tailored per deployment.
