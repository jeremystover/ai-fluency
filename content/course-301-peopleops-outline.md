# AI 301 · The Specialist — People Ops & HR Technology track · "The Deployer" (draft v2, integrated)

**Audience:** People Operations, HR Operations, HRIS and HR Systems analysts and managers, People
Technology leads, HR shared-services leads — anyone who owns the HCM, the integrations, the
employee-facing support layer, or the process everyone else's work runs through.
**Level transition:** L3 The Specialist → L4 The Translator.
**Course id:** `ai301-peopleops` · role id `peopleops`, label "People Operations & HR Technology".
**Shape:** 8 modules · 25–45 min each · ~4h15 · same package as the rest of the ladder — read, micro
dose, tutor, podcast, one interactive, one AI-graded activity, one knowledge check. Async and
self-serve.
**Prerequisite:** AI 101 (or the diagnostic test-out) and AI 201. This track assumes the autonomy
ladder, the boundary sheet, and the verification budget are in hand and extends them.
**Tooling stance:** Tool-agnostic on purpose, which is unusual for a systems audience and is the
point — the platforms change quarterly and the obligations don't. Every statute, statistic, vendor
claim, and platform detail is volatile-layer `[V]`.
**Out of scope, by decision:** model building, regression, validity work, adverse-impact modeling —
a People Analytics track's job. This track's relationship to analytics is retrieval and reporting,
not inference.

Exploration and full verification log: `content/course-301-peopleops-exploration.md`.
**v2 integrates a human-written brief (PO 301–306). The verdict and what changed: Decisions 1–4.**

---

## The through-line

> **Everyone else in People decides whether to use AI. You decide what four thousand people get,
> whether they asked for it or not — and every statute in this curriculum calls you the deployer.**

Earned, not asserted: HR technology management is the **second-highest AI adoption area in the whole
function at 21%**, behind only recruiting — inside a function where **54% of organizations have
implemented no AI in HR and have no plans to in 2026** `[V]`. This audience is not behind. They are
the most deployed part of People. And almost none of it was their decision: it arrived in release
notes, as features in systems they already owned.

## Where the learner stands (design premise)

They finished 201 and they build things that run unattended, which nobody else in People does. Their
worry is not missing out. It is that things are already switched on in their stack that they never
evaluated, that someone will eventually ask them to account for, and that they have no document to
point at when that happens.

> "Half of this was on before I got a vote, and I'm the one who'll be asked to justify it. Tell me
> how to decide what stays on, prove I decided it properly, and stop pretending the risk is that I'm
> behind."

Three things make this track structurally different from the three above it. **The posture is
governing someone else's model, not using your own** — five of eight modules concern a capability the
learner did not build and cannot inspect. **The unit of analysis is a decision, not a task** — adopted
from the human brief, and it is the organizing idea of the whole track. And **this is the only track
whose capstone can legitimately end in "turn it off."**

## The spine: the decision register

Every module advances **one register of the recurring decisions the learner's function actually
makes**, and one live AI capability inside it. Not something the learner builds — this role's unit of
work is a decision that has already been delegated, often to a vendor, often without anyone
noticing.

| Module | What it does to the register |
|---|---|
| M1 | Build it: volume, reach, latency, reversibility, accountability, defensibility |
| M2 | Attach a measurement plan and a written kill condition to one live decision |
| M3 | Run the pre-enablement review that decision never got |
| M4 | If it faces employees: check what it says, and what it fails to route |
| M5 | Check the data underneath it |
| M6 | Test what it can actually reach — as someone other than you |
| M7 | Turn it into a decision-rights map with a signature line |
| M8 | Decide what the recovered capacity buys, and what comes off |

**Every module opens with a claim the learner must contest** — adopted from the human brief, and it
replaces the calibration prompt rather than sitting beside it. The claims are written as accusations
about the learner's own organization, which means contesting one *is* the prediction: the learner
commits to "true of us / not true of us" before any content, then verifies it against evidence from
their own systems during the module. **Evidence from the org, never a confidence rating** — also the
human brief's, and it is a real improvement on the calibration convention. M8 reads the pattern and
the rubric grades **evidence of updating**, never who guessed right.

---

## M1 · The decision inventory

*~35 min · the prerequisite nobody teaches · first because everything else indexes it*

**Claim to contest:** *"Most of what your team calls work is deferred decisions — and most of what
your function calls its AI strategy is a description of what your vendors shipped."*

- **Lesson 1:** Decisions, not tasks. A task audit produces a list of things to automate. A decision
  audit produces a list of things somebody has to be able to defend, which is the only version that
  survives contact with governance later. Most recurring People Ops "work" is a decision that was
  made once, encoded, and never revisited — eligibility rules, routing logic, approval thresholds,
  what the form lets you pick.
- **Lesson 2:** Where this function actually sits `[V]`. HR technology management is second at 21%,
  behind recruiting's 27%, ahead of L&D and employee experience — while 54% of organizations have
  deployed nothing in HR and have no plans this year, and 92% of CHROs expect more integration
  anyway. You are not behind. You are the front line of a function that mostly hasn't started.
- **Lesson 3:** And you didn't decide. The three ways AI arrives in an HR stack, and the fact that
  only one has a gate: **a feature in a system you already own** (release notes, no gate, by far the
  largest volume), **a new product** (procurement, has a gate), and **employees pasting HR data into
  consumer tools** (no gate, no visibility). All the governance attention is on the middle one.
  Reading release notes as a professional practice rather than an inbox chore.
- **Lesson 4:** The register's six columns, and why each one is there. Volume. **Reach** — how many
  people one failure touches. **Detection latency** — how long before anyone notices: immediately, at
  payroll, at the audit, in discovery, never. **Reversibility.** **Current accountability**, by name.
  And **defensibility**: could the person deciding defend it under challenge? The columns are not a
  taxonomy exercise; each one becomes a required field in M7's signed map.
- **Lesson 5:** The quadrant that matters, and the 201 extension. Wide reach plus long latency is the
  silent systemic failure — and it is exactly where AI is sold: bulk data operations, automated
  transactions, agentic multi-step workflows, mass communications. The pitch and the danger occupy
  the same square. So: 201 M4 sizes the verification budget to *stakes*; for systems work the
  variable that sets the cost is **latency**, because error cost compounds with every run before
  detection. Same budget, different denominator. And **reversibility is the gate, not accuracy** — an
  effective-dated bulk change that already flowed to payroll, the carriers, and the identity provider
  is not an undo, it is a correction project with its own blast radius. Worked examples of
  long-latency decisions with a statutory clock under them `[V]`: I-9 timing, COBRA election windows,
  final-pay rules by state, new-hire reporting, ACA furnishing. **AI can prepare and remind; it
  cannot be the control** — and if you automate a control, the audit question is where the evidence
  is that it ran.
- **Interactive:** sorting — twelve pieces of real People Ops and HRIS work into the reach × latency
  quadrants.
- **Activity:** *"The register"* — every recurring decision your function makes, with all six
  columns filled, plus an inventory of AI capabilities live in your stack right now and **who decided
  each one, when, on what evidence.** Blanks are the finding. Then pick the one decision this track
  will run on. **Graded on evidence, not completeness** — a register of twelve decisions with real
  latency numbers beats forty with guesses.

## M2 · How you'll know

*~30 min · the module that exists nowhere else in this market*

**Claim to contest:** *"You have never measured whether any AI deployment in your function
actually worked."*

- **Lesson 1:** Baseline before deploy, and why this role has no excuse. Every other function has to
  invent a measurement apparatus. **You own the ticket data, the system logs, the transaction volumes,
  and the cycle times already** — measurement is this role's native capability and almost nobody uses
  it on their own AI. If you cannot measure it before you switch it on, you have no baseline and you
  will never be able to prove either direction.
- **Lesson 2:** Engagement is not change. Logins, queries served, and "adoption" are activity
  metrics that move whether or not anything improved. **Self-initiated repeat use is the leading
  indicator worth watching** — if people don't come back voluntarily, it didn't work, whatever the
  dashboard says.
- **Lesson 3:** The rework tax, and where it lands. HRBP M3 measures botsitting on your own desk;
  this is the version that matters here: **a deployment relocates rework onto the employee, the
  manager, and your own queue** — and your queue is where the evidence shows up first. You are the
  function's early-warning system for everyone else's AI, and nobody has ever asked you for the data.
- **Lesson 4:** Scope is the variable, not technology `[V]`. The two coaching trials, read as a
  configuration lesson rather than a coaching one: the 2022 RCT gave the AI a narrow, structured
  goal-attainment protocol and it performed as well as human coaches; the 2026 trial removed the
  guardrails, put it in the coach's seat with senior leaders on open-ended development, and found no
  significant benefit. **The same technology, opposite results, and the difference was task scope.**
  The researcher who published the founding positive study co-authored the null result — which is the
  standard this course holds itself to. The configurer's takeaway: narrow the scope until it works,
  rather than widening it until it fails.
- **Lesson 5:** The kill condition. A deployment without a written condition under which you would
  turn it off is not a pilot, it is an installation. What makes a kill condition real: a threshold, a
  date, a named person who checks, and a rollback that somebody has actually performed.
- **Interactive:** choice — four evaluation plans; find the one measuring activity and calling it
  change.
- **Activity:** *"The evaluation plan"* — for one live decision from your register: the baseline
  (from your own systems, with the query or report named), the metric that would show change rather
  than activity, the rework check, the review date, and **the written kill condition.** Submit the
  baseline data, not a description of it.

## M3 · The switch

*~35 min · the signature module*

**Claim to contest:** *"You could not produce, today, the evaluation that put your current AI
capabilities into production."*

- **Lesson 1:** Why your existing governance can't help `[V]`. **51% of organizations have no formal
  AI use policy at all — and of those that do, more than half say theirs is too restrictive and too
  tightly tied to specific current tools, with a further 23% saying theirs is too broad to guide
  practical behavior.** A policy that names ChatGPT cannot govern an agent your HCM shipped last
  Tuesday. That is the gap this module fills.
- **Lesson 2:** The pre-enablement question set — the module's core method. What population. What
  data does it index, and what does it *write* versus read. Where is the human gate and who is it,
  by name. What artifact does it leave behind. What is the rollback, and has anyone performed it.
  What happens when it's wrong at 3am on a Saturday. What is the kill condition (M2 wrote it).
- **Lesson 3:** The contract is where the rungs are defined. 201 M5's autonomy ladder assumed you
  built the thing; a vendor built this one, so the ladder's guarantees live in the agreement — model
  and subprocessor disclosure, whether your data trains anything, **log retention and whether you can
  export the logs**, incident notification, and the right to switch it off unilaterally. Plus the
  data-provenance question the Eightfold litigation put on the table `[V]`: **what third-party data
  does your vendor ingest that you have never disclosed to anyone?** A proposed class action filed in
  January 2026 alleges a talent-intelligence platform is a consumer reporting agency under FCRA
  because it compiled outside data — social media, code repositories, location data, tracking cookies
  — into candidate scores that were shared with employers and never shown to the candidates. Whatever
  the outcome, the compliance question is a **data-flow and disclosure-workflow** question, which
  makes it yours and not recruiting's.
- **Lesson 4:** Piloting inside a system of record. Sandbox versus production, and why sandbox
  rarely answers the real question. Choosing a population you can actually watch. Instrumented before
  enabled. And the narrowing move M2 earned: **the smallest scope that would prove anything.**
- **Interactive:** choice — four enablement reviews; find the one that survives an auditor reading it
  a year later.
- **Activity:** *"The review it never got"* — your live decision through the full question set, with
  blanks marked as blanks and each blank assigned an owner and a date. Graded on whether the unknowns
  are named rather than papered over, and on whether the answers cite the contract, the config
  screen, or the vendor's own documentation rather than an assumption.

## M4 · The voice of the company

*~30 min · the largest legal surface in the track · counsel review required before ship*

**Claim to contest:** *"Your AI has already told an employee something that wasn't true, and you
cannot say which employee."*

- **Lesson 1:** Deflection is the wrong metric `[V]`. In widely-cited service research roughly 45%
  of queries get deflected while only about 14% reach genuine self-service resolution — the other
  ~31% got a bot answer and came back through another channel. Two caveats stated in the lesson,
  because this module is about measuring the right thing: it is customer-service data, not HR, and we
  could not reach the primary source. Compare the most-cited HR figure available `[V]` — IBM reports
  its AskHR agent settles about **94% of routine staff requests**, with the residual ~6% being the
  complex and ethical calls that still land with people. That number is a company self-report and has
  not been independently audited, which is exactly the standard HRBP M3 applies to IBM's other famous
  figure, and we apply it here to a number that flatters our own argument. **The residual is the
  design problem, and it is where the entire legal surface of this module lives.**
- **Lesson 2:** The knowledge base *is* the model's competence. A superseded SPD, a leave policy that
  changed in March and lives in three places, a handbook nobody re-approved. An answer drawn from a
  stale document is not a bad summary — it is **a misstatement made by the employer.** This is
  document governance wearing an AI costume, and it is the highest-yield unglamorous work here. (201
  M3 owns the pipeline that produces change notes; this is about what the document set entitles the
  bot to say.)
- **Lesson 3:** The notice problem — the sharpest fact in this track `[V]`. An employer may receive
  **sufficient notice** of an FMLA-qualifying condition or an ADA accommodation request *through a
  chatbot*, and a bot that fails to respond appropriately can expose the employer to interference or
  denial claims. EEOC's position reaches disclosures made to a vendor the employer never heard from.
  **Notice to the bot is notice to you.** So escalation routing is not a UX preference, it is a legal
  control: accommodation requests, medical disclosures, leave intent, harassment, discrimination and
  retaliation reports, resignation intent, and anything mentioning counsel must route to a human by
  design. And what the employee typed may now be confidential medical information you are obliged to
  protect.
- **Lesson 4:** Consistency, disclosure, and access `[V]`. Two employees in materially identical
  situations getting different answers is a pattern — and now it is logged, which cuts both ways.
  Article 50's duty to disclose at first contact that a person is talking to an AI, in force since
  2 August 2026 (M7 has the timing). And accessibility: an AI-first channel a screen-reader user
  cannot complete is an access problem, and EEOC has said AI tools must be accessible to workers with
  visual disabilities.
- **Interactive:** sorting — ten real employee messages: the bot answers it / the bot routes it and
  says nothing else / a human only, and the bot should never have seen it.
- **Activity:** *"Ten questions and three disclosures"* — run ten real questions from your queue
  through your employee-facing capability and check each answer **against the governing document**,
  then send three messages that should trigger escalation and record what happened. Submit the
  failures and the transcript.

## M5 · The foundation

*~25 min · the only unambiguously good news in the track*

**Claim to contest:** *"Every AI outcome your function has promised is waiting on work only you can
do — and it has never been funded as an AI project."*

- **Lesson 1:** What "clean" actually means, concretely, in an HCM. Effective dating that can
  reconstruct history rather than just describe today. One identity across systems. Referential
  integrity when the org moves. Deprecated picklist values still in daily use. A manager hierarchy
  that is actually current. Job architecture that hasn't fractured into forty-seven flavors. And the
  distinction that does the work: **a field being populated is not a field being true.**
- **Lesson 2:** The inversion. This is the one place in the role where AI sits unambiguously on the
  right side of 101 M7's assist/decide line — **it makes no decisions about people; it finds where
  the record disagrees with itself.** Reconciling headcount across three systems, surfacing the
  forty-three employees whose manager left, finding the eleven dead picklist values, drafting the
  data dictionary nobody wrote. Highest value, lowest risk, completely invisible.
- **Lesson 3:** Which is why the module's real content is the business case. Not "we need better
  data" — the argument that a specific AI outcome your leadership has already promised is blocked by
  a specific data condition, costed, with the remediation scoped. (HRBP M5 teaches arriving with a
  model rather than a story; this is the one model this role always has standing to build.)
- **Lesson 4:** The discipline that keeps it on the right side of the line. **AI proposes candidate
  errors; a human confirms before a single record changes.** Detection is assist. Correction at scale
  is a decision with a blast radius, and M1 already recorded its latency. Scoping note: comp M3 owns
  verifying one analysis — audit files, row counts, documented joins. This module's subject is the
  source system, not the extract.
- **Interactive:** choice — four data-remediation proposals; find the one where AI should touch the
  detection and never the correction.
- **Activity:** *"The blocked outcome"* — one AI outcome your function has promised, the specific
  data condition blocking it, and a remediation proposal with detection assigned to AI and correction
  assigned to a named human. Submit **the failure counts from a reconciliation you actually ran**,
  not an estimate of them.

## M6 · What the assistant can reach

*~30 min · the sleeper module — the topic only this role would raise*

**Claim to contest:** *"Someone in your company can already read something you would never have
given them."*

- **Lesson 1:** The mechanism, which is the stable and teachable part `[V]`. An enterprise assistant
  inherits **the querying user's** existing access rights and answers from everything that user could
  technically reach — and that reach is wider than anyone intended, because of years of accumulated
  shares, inherited folders, and one broadly-permissioned site. **The AI did not create the exposure.
  It gave it a search box.** Reported HR instances — AI summaries of disciplinary discussions and
  legal-hold threads, salary data returned in answer to a benign question — come from security
  vendors and are labeled as such; the incident counts are not load-bearing, the mechanism is.
- **Lesson 2:** Why HR is the worst-case corpus. Compensation files, disciplinary records,
  investigation notes, accommodation documentation, exit interviews, legal-hold material. Nowhere
  else in the company is the ratio of restricted to routine content this high, which is why generic
  enterprise rollout guidance under-serves you specifically.
- **Lesson 3:** The genuinely new failure mode: **summarization launders provenance.** Someone who
  could never have located the document now receives its contents as an answer — no filename, no
  permission prompt, no trace in any audit log that they read it. Retrieval defeats the assumption
  every permission model was built on, which is that finding something is work.
- **Lesson 4:** What this role does about it. Inventory what each assistant indexes, separately from
  what the HCM's security model says — two different questions now. Sensitivity labeling at the
  source. **Test with a least-privileged account, not your own** — you are an administrator who can
  see everything, which makes you the worst possible tester and is the most common error in the
  discipline. And the reporting surface: an AI that writes queries against your HCM can aggregate its
  way back to an individual, which is small-N re-identification in a role that runs reports for
  everybody.
- **Interactive:** sorting — ten retrieval scenarios: fine as configured / configure before you
  enable / never index this at all.
- **Activity:** *"Ask as someone else"* — ten questions run against your capability from a
  **least-privileged test account**, with what came back verbatim. Then one thing you changed or
  escalated as a result.

## M7 · Where to stop, and who signs

*~45 min · the heaviest module in the curriculum · counsel review required before ship*

**Claim to contest:** *"You cannot name who is accountable when your AI is wrong."*

Governance as design, not values. Two halves that are one artifact: the decision rights you set, and
the obligations the law attaches to you for having set them.

- **Lesson 1:** Decision rights first, before any statute. Three tiers for every decision in your
  register: what AI may **draft**, what it may **recommend**, and what it may **never touch.** The
  axis that sorts them is not difficulty or stakes — it is whether the decision requires judgment
  that can be absent without anyone noticing. The failures that matter are the ones where nothing
  looked wrong. **The decision that matters most is where to stop**, and it is a design decision made
  in advance, not a value asserted afterwards.
- **Lesson 2:** Article 26, read as a configuration checklist rather than a statute `[V]`. Use in
  accordance with the instructions for use. **Competent human oversight, assigned to a named
  person.** Input-data governance. **Logs retained at least six months** — a retention setting
  somebody has to configure, which collides with a 90-day default. Notification of risks and serious
  incidents to provider and authority. And the sentence that settles every procurement argument you
  will ever have: **these obligations cannot be contracted away.**
- **Lesson 3:** The timing trap `[V]`, current as of this writing. Regulation (EU) 2026/1744 — the
  Digital Omnibus on AI — was published in the Official Journal on 24 July 2026 and entered into force
  on 27 July 2026, moving **Annex III high-risk obligations, where employment sits, from 2 August 2026
  to 2 December 2027.** It did **not** move Article 50. The transparency duties — including disclosing
  at first point of contact that a person is interacting with an AI — became enforceable on **2 August
  2026**, penalties reach €15M or 3% of worldwide turnover, and they catch an organization with no
  high-risk AI at all if it runs a chatbot. **The deadline your whole function is watching slipped
  sixteen months. The one that governs your service desk did not.**
- **Lesson 4:** Two legal systems, one conclusion `[V]`. US litigation is arriving at the same place
  from a different direction: in *Mobley v. Workday* the court has allowed claims to proceed on the
  theory that a vendor screening candidates on an employer's behalf is its **agent**, and so within
  the statutory definition of "employer" — with an ADEA collective conditionally certified and
  roughly 14,000 opt-ins, and rulings through mid-2026 keeping claims alive across race, sex, age and
  disability. A May 2026 ruling also held AI bias-testing data may be shielded from discovery by
  attorney-client privilege, which is a reason to involve counsel *before* you test, not after. **The
  agent doctrine and Article 26 say the same thing in two languages: the obligation does not transfer
  with the invoice.**
- **Lesson 5:** Co-determination as a gating dependency `[V]`. In Germany, BetrVG §90 requires
  informing and consulting the works council **at the planning stage** of an AI deployment — not at
  launch; §80(3) presumes an external expert is necessary at the employer's cost; §95 reaches
  selection criteria AI helped establish. A labour court has held that merely *permitting* employees
  to use ChatGPT in a browser did not trigger co-determination — so the line is not "AI," it is what
  the system does inside your estate. The Hans Böckler Foundation found 68% of German works councils
  reporting AI systems introduced and only 31% with a works agreement covering AI. For a global HRIS
  owner this is a dependency on the implementation plan, not a communications task.
- **Lesson 6:** Records, retention, and hold. AI conversation logs are records. A transcript where an
  employee described a medical condition is confidential medical information. A retention rule that
  deletes at 90 days collides with Article 26's six months and with a legal hold, and reconciling
  those three is nobody's job until it is yours. Then: what you can do this quarter without waiting
  for counsel, and the specific list to bring them so the answer isn't a shrug.
- **Interactive:** sorting — ten obligations: yours as deployer / the provider's / genuinely shared.
- **Activity:** *"The map, signed"* — a decision-rights map for your register: every decision sorted
  into draft / recommend / never touch, each with the named accountable human, what is logged and for
  how long, the rollback, the review date, and the disclosure posture. **With a signature line.** The
  artifact is the deliverable this whole track exists to produce, and it is what counsel, audit, and
  eventually a regulator will ask for.

## M8 · What the capacity buys

*~25 min · the course lands*

**Claim to contest:** *"You approved a tool without naming what the saved time would become."*

- **Lesson 1:** Redeploy, don't strand `[V]`. The most instructive reversal in the field: in 2023
  IBM's CEO said AI would replace thousands of back-office roles and froze back-office hiring; by
  February 2026 the company was **tripling entry-level hiring**, including in HR, with its CHRO's
  reasoning stated plainly — if you stop hiring juniors, in three to five years there is no pipeline
  and the well dries up. The jobs were rewritten rather than removed. Total employment went up. The
  lesson is not that automation failed; it is that **capacity you don't deliberately redeploy gets
  stranded, and the pipeline is the first thing you lose and the last thing you can rebuild.**
- **Lesson 2:** Job architecture as a system object, which is the version of this only you can act
  on. Segmenting an architecture into human-led and AI-augmented work is not an org-design essay when
  you own position management — it is a configuration task with reporting consequences. Including the
  question nobody has a convention for yet: **what a manager's span means when part of the team is an
  agent**, and which system of record is supposed to hold that.
- **Lesson 3:** The bet, with a baseline — and this role's unique fourth term. Which decision, what
  you'd measure at 90 days (M2 built it), what you'd stop doing to fund it, and **what you would turn
  off.** No other track can subtract. A retired integration, a disabled feature, a process removed
  rather than automated is a legitimate and frequently better bet than anything new.
- **Lesson 4:** The seat you already have `[V]`, and what the function is for after. In 52% of
  organizations HR has no direct involvement in overall AI strategy — and yet this role is in every AI
  conversation the company has, because it owns the systems the AI runs on. That is a functional seat
  the function's own leadership often lacks. Not the back office: **the control surface**, the place
  where the whole function's AI is governed, because it is the only place where it can be.
- **Interactive:** choice — four proposed bets; find the one that is actually a migration.
- **Activity (course close):** *"Stays on, changes, or comes off"* — the decision on your live
  capability, one page: baseline, 90-day measure, funding line, review date, the reinvestment
  commitment naming where the capacity goes, and what comes off. Then **the delta**: every claim you
  contested in M1–M7, which ones turned out to be true of your organization, and what changed. The
  rubric grades the account of the change and the evidence behind it, never who guessed right.

---

## Prerequisite map

- 101 and 201 assumed. Modules point at 201 material rather than re-teaching it.
- M1 first, always — every later module indexes the register.
- M2 before M3 (you cannot design a pilot before you know what you'd measure) and before M8 (the bet
  reuses the baseline).
- M3 before M7 (the signed map documents the review).
- M4 only if the learner's chosen decision faces employees; otherwise a supplied service-desk case.
  **The one module with a conditional spine attachment** — see open questions.
- M5 and M6 open order, but M6 before any assistant rollout the learner has scheduled.
- M7 after M1 and M3. M8 last — it carries the delta reckoning.

## Per-module deliverables

Same package and pipeline as the rest of the ladder: draft at `content/ai301-peopleops-mN-<slug>.md`
→ `scripts/convert-draft.mjs` → hand-tuned `blocks.json`, `micro.json`, `knowledge-check.json`,
`rubric.json`, `sorting.json` or `choice.json`, `activity.json` → add rows to `content/modules.json`
**only when the track is complete** → register in `src/shared/roles.ts` → `generate-seed.mjs`.

Registration note: `roles.ts` currently folds People Ops and analytics into the `other` choice, which
falls back to `ai301-hrbp`. Shipping this means adding a `peopleops` choice and leaving `other` for
talent development, employee experience, and function leadership.

## Decisions (v2)

**1. The human brief's spine wins on the unit of analysis; the exploration's wins on which modules
exist.** These are different layers, so this is not a split-the-difference. *The decision, not the
task* is a better organizing idea than my "one configured capability," because it generalizes across
the switch decision, the routing decision, the correction decision, and the kill decision — and
because a decision register is the document that survives into governance, which is where this role's
actual exposure sits. Adopted as the spine, and it improved M1 in a way I would not have found.

**But the human arc has no systems in it.** PO 301–306 contain no data-foundation module, no
retrieval-and-permissions module, and no employee-facing module. Those are the three most role-unique
findings in the exploration, and two of them — the assistant that can reach what its user shouldn't,
and the bot that receives legally-operative notice — are the ones that most clearly pass the brief's
test of *would only someone in this role raise this?* They survive as M4, M5, M6, and they are the
middle of the course the convention exists to protect.

**2. Four things from the human brief are straight improvements and are adopted whole.**
- **Claim-at-the-open, replacing the calibration prompt.** Better for this audience, and the synthesis
  is better than either input: because the claims are written as accusations about the learner's *own
  organization*, contesting one is already a prediction — commit to "true of us / not true of us,"
  then verify against your own systems. One gate instead of two, and it satisfies the next point.
- **Evidence over self-report.** Every activity now demands an artifact from the learner's systems —
  the baseline query, the reconciliation failure counts, the verbatim transcript — rather than a
  confidence rating or a reflection. This is a real critique of the calibration convention and it is
  correct; "score the delta" survives, but the delta is now measured against evidence.
- **A measurement module with a written kill condition.** M2 exists because of the human brief. I had
  measurement as one lesson inside the enablement module, and that was wrong: the claim *you have
  never measured whether any deployment worked* is retrospective and about live systems, which is a
  different job from designing a pilot. **Self-initiated repeat use as the leading indicator** is the
  best single metric idea in either document.
- **The decision-rights map with a signature line.** Strictly better than my "deployer's record" as
  both a name and an artifact, and the signature line is what makes it real. M7's activity is theirs.

**3. Cut from the human brief, plainly.**
- **PO 304 · Rebuilding Signal — cut entirely.** This is the recruiter track. R1 is the two-sided
  signal collapse and R4 is *Designing signal that's expensive to fake*, with the validity table, the
  work-sample argument, verification design, and a near-identical claim. It is not merely outlined —
  `ai301-recruiter-r1` and `r4` are drafted and seeded. The subtraction discipline kills it; the
  track carries a pointer instead.
- **PO 306's capstone — cut to one lesson (M8 L2).** A twelve-month operating-model proposal is how
  401 · The Translator is defined, and *defended to peers* assumes a surface the product does not have
  — there is no learner-to-learner exchange, only `fd_review` and the tutor. What survives is the part
  that is genuinely this role's: job architecture and manager span are **system objects** they
  configure, not an essay they write.
- **The 7% guidance statistic — cut, but not for the reason first given.** v1 cut it because it is
  HRBP M3's anchor. Under brief §3a that is not a reason — a People Ops learner never opens the HRBP
  track. It stays cut on merit: the IBM reversal is stronger material for this argument than a
  borrowed number, and reusing an HR-wide statistic across tracks is fine so long as it comes from
  the shared evidence library rather than a second hand-authored copy.
- **Bias testing under privilege — reduced to one clause on relevance, not on ownership.** A People
  Ops lead does not commission bias tests, so the depth belongs elsewhere; the clause that earns its
  place is that the May 2026 privilege holding in *Mobley* is a reason to involve counsel before
  testing rather than after.
- **"Transform, not transfer" — cut as a quotation.** I could not confirm it as an IBM formulation.
  The concept survives as *redeploy, don't strand*.

**4. Cut from the exploration's own v1.** The standalone diagnosis module (v1's P1) and the standalone
decomposition module (v1's P2) merge into M1, because the register cannot be built without the axes
and the "you're already deployed" diagnosis is what motivates building it. And v1 kept decision
rights separate from the statutory floor; the human brief is right that they belong together, because
**the decision-rights map and the deployer's record are the same document** — splitting them produces
two artifacts nobody maintains. Net: 9 candidate modules integrated down to 8.

**5. Eight modules at 25–45 minutes, ~4h15.** Same total as the HRBP track across one more, shorter
module. M7 at ~45 min is the heaviest module in the curriculum and the likeliest split in the set —
shipping merged anyway, because the artifact is one artifact. Watch completion.

**6. The analytics boundary is drawn and stated in the content.** Regression, validity, and
adverse-impact modeling belong to a People Analytics track. What survives here is retrieval and
re-identification (M6), because those are permissions problems, not statistics problems. Stated out
loud, following the comp track's refusal — a credibility move with a technical audience.

**7. Verified before this outline was written, and it changed the design.** Confirmed: SHRM *State of
AI in HR 2026* adoption split and policy findings (n=1,722, fielded 5–23 December 2025); Regulation
(EU) 2026/1744's OJ publication, entry into force, and the Annex III move to 2 December 2027;
**Article 50's exclusion from that deferral and its 2 August 2026 enforceability**; Article 26's
duties including six-month log retention and the no-contracting-away rule; BetrVG §§80/87/90/95 and
the Hans Böckler figures; FMLA/ADA chatbot-notice exposure and EEOC's vendor-disclosure position; the
assistant-retrieval mechanism; *Kistler v. Eightfold AI* (filed 20 January 2026, FCRA/CRA theory);
*Mobley v. Workday*'s agent-theory posture, ADEA collective with ~14,000 opt-ins, the May 2026
privilege ruling and rulings through 22 June 2026; the two coaching trials and the **task-scope**
reading; and IBM's 2023 freeze, the February 2026 entry-level tripling, and the AskHR ~94% figure.
Four of these changed the design rather than confirming it: the Article 50 timing trap, deployer
obligations as configuration settings, the chatbot-notice problem, and the Eightfold data-provenance
question — none of which were on the candidate list before the searches.

**8. One intended anchor was removed by verification.** M5 was going to open on "37.6% of HR leaders
say better data quality would most increase their willingness to expand AI in talent decisions," plus
two supporting figures. All three trace to the **Fuel50 Q1 2026 State of AI Readiness in Talent
Decisions** survey — a vendor instrument whose sample size could not be established after a targeted
search. A track that teaches learners to ask *what is the sample* cannot anchor a module on a number
whose sample is undisclosed. **M5's anchor is unresolved and blocking.** The instrument to mine is the
**Sapient Insights Annual HR Systems Survey**, not yet read.

**9. Still blocking before drafting.** A primary citation for the deflection/resolution gap (M4) —
currently secondary sources only, and customer-service rather than HR, both of which the lesson must
state. Independent corroboration of IBM's AskHR ~94% (M4) — used *as* a self-report and labeled, but
the label needs to be accurate. The Worxogo case behind "where to stop" (M7 L1) — the principle stands
without it; the case is unverified and currently omitted. And for M1's worked examples: I-9 and
E-Verify timing, COBRA windows, final-pay timing by state, new-hire reporting, ACA furnishing, and
current state pay-data regimes.

**10. Two counsel-review gates, M4 and M7** — no other track needs two. M4's is the heavier: FMLA and
ADA notice through a chatbot is unsettled enough that the content must state the gate itself.

**11. The rung question is resolved, and it produces a drafting rule.** Five of the human brief's six
modules would read almost verbatim for a CHRO or a People Analytics lead, which is the risk the brief
names when it flags CHRO/CPO as possibly belonging at 401. The resolution: the governance arc stays at
301, and **every governance lesson must land on something the learner configures** — their own
register, a retention setting, a routing rule, a signature line. The test to apply to each lesson
while drafting: **can this learner act on it alone, this quarter, without convening anyone?** If not,
it is 401 material and comes out. That rule is what removed PO 306's operating-model proposal and what
keeps M8's job-architecture lesson, since position management is a system they administer.

**12. The calibration prompt is replaced course-wide, not just here.** The human brief's critique —
self-report is not evidence — is correct and general, and it wins over the convention. All four tracks
should open each module on **a claim about the learner's own organization, contested before content
and verified against evidence from their systems**, rather than a numeric confidence prediction.
"Score the delta" survives unchanged in purpose; the delta is now measured against artifacts instead
of guesses. This track is built that way from the start. **The retrofit is a real body of work and is
not in this outline's scope:** `ai301-hrbp` (7 modules, drafted and seeded), `ai301-recruiter` (7,
drafted), and `ai301-comp` (6, drafted) each carry calibration prompts in `blocks.json` and prediction
fields in `rubric.json`, and 101 and 201 carry the thread too. It should be scoped as its own change
with the brief's §5 convention text updated in the same pass, since that document currently records
the opening prediction as the one genuinely shared mechanism.

**13. Three citations are now shared across tracks and should move to a shared evidence library** —
and brief §3a has since made this load-bearing rather than tidy. Sanctioning duplication across
sibling tracks removes the pedagogical objection to overlap and leaves drift as the only real cost,
which is exactly what a shared library prevents. The
coaching trials (HRBP M7 and M2 here, with genuinely different readings — allocation there, task scope
here), *Mobley* and the agent doctrine (HRBP M6, recruiter R6, M7 here), and SHRM's 52% (HRBP's
unsettled debates, M8 here). The brief already recommends authoring these once and referencing them;
this track is the point at which not doing so starts producing drift.

## Open questions for review

- **M4's conditional spine attachment.** It is the strongest legal module in the track and it applies
  only if the learner's chosen decision faces employees. Supply a worked service-desk case as the
  alternate path, or require an employee-facing decision as the spine and lose learners whose stack
  has none?
- **How much does M6 assume the learner controls the AI layer?** In many companies the assistant
  tenant belongs to IT and this role has no admin rights. The module may need an explicit
  influence-without-authority path — the one place this track touches HRBP territory, and an argument
  for a cross-reference rather than new content.
- **Should the decision register and the signed map be product artifacts rather than activity
  submissions?** They are the most reusable things any track produces, and templates that outlived
  the course would be independently valuable. A product decision, not a content one.
- **Three maintenance tickets against shipped content, found here.** Stated precisely, because two of
  them are narrower than they first looked. **(a) Article 50 appears nowhere in the curriculum** — a
  grep across `content/` returns only this track's two documents. `ai301-hrbp` M6 and
  `ai301-recruiter` R6 both cover the Annex III deferral and correctly keep the emotion-recognition
  ban and AI-literacy duty in force from February 2025, but neither carries the transparency duties
  that became enforceable on 2 August 2026 — which is the obligation most likely to bite an HR
  chatbot. **(b) HRBP M6 describes the Digital Omnibus as an "agreement."** It is now Regulation (EU)
  2026/1744, published 24 July 2026 and in force 27 July 2026; "agreement" was accurate when drafted
  and is now stale. **(c) *Mobley*'s 2026 developments are missing, but the case is not.** Both
  drafted floor modules do carry the agent theory — my earlier note that they list it as "unverified
  and blocking" described their *outlines*, not the shipped drafts, and was wrong about the drafts.
  What neither carries is the ADEA collective with roughly 14,000 opt-ins, the rulings of 6 March and
  22 June 2026, or the 28 May 2026 privilege holding as an actual citation. **All three should be
  filed separately, not fixed as a side effect of this work.**
- **Track length convention.** Four tracks now sit at ~2h55 (7 modules), ~4h15 (7), ~5h (6), and this
  one at ~4h15 (8). The spread is wide enough that it is either a deliberate per-role call or drift.
  Worth naming which.
