# AI 301 · The Specialist — People Ops & HR Technology track, exploration (pre-outline)

**Status:** working exploration, not an outline. Fourth role track. Written to the method in
`content/301-track-authoring-brief.md` §2: start from the job, find where AI meets it, subtract
everything 101, 201, and the three existing 301 tracks already teach.

**Scope decision, made before writing.** The brief lists *People Analytics / HR Technology* and
*People Ops / HR shared services* as two separate roles with opposite characteristics. This track
is the **combined systems-and-service-delivery owner** — the person who owns the HCM, the
integrations, the employee-facing support layer, the process, and the reporting surface. Titles:
People Operations Manager, HR Operations, HRIS Analyst/Manager, People Technology Lead, HR Systems
Manager, Director of People Ops & Technology, HR Shared Services Lead.

**Explicitly out of scope, left for a People Analytics track:** model building, regression, validity
work, adverse-impact modeling. This track's relationship to analytics is *retrieval and reporting*,
not inference. Where that line gets thin is noted in §3.

---

## 1. What this role actually does

Not the job description — the year. In a 500–5,000 person company this is two to eight people, and
their calendar contains:

- **The system of record.** The HCM and every field, workflow, and business process definition in
  it. Effective dating. Org and position management. Cost centers. Security roles. They are the
  only people who know why the Job Family field has forty-seven values, eleven of which are
  deprecated and still in active use.
- **Integrations.** HCM ↔ payroll ↔ benefits carriers ↔ ATS ↔ identity provider ↔ IT provisioning
  ↔ learning ↔ engagement survey ↔ ticketing ↔ finance. Nightly files, SFTP, carrier feeds,
  SSO/SCIM. This is the actual heart of the job: when a start date changes and it doesn't
  propagate, the new hire has no laptop and nobody finds out until Monday.
- **Lifecycle transactions.** Onboarding, offboarding, transfers, promotions, leaves, terminations.
  Each is a cascade across a dozen systems with a compliance surface attached — I-9 timing,
  new-hire reporting, COBRA notice windows, final-pay rules that differ by state.
- **The support queue.** "How much PTO do I have?" "Where's my W-2?" "How do I add my baby to the
  plan?" Case management, SLAs, deflection targets, a knowledge base, and a shared inbox that is
  the real system of record for what employees actually need.
- **The back office of the annual calendar.** Open enrollment — the largest operational event of
  the year. The *execution* of the merit cycle: eligibility rules, manager access, approval
  routing, retro. Performance cycle launch. Compliance filings: EEO-1, ACA furnishing, 5500s,
  state pay-data reports, OSHA.
- **Everyone's data requests.** Finance wants headcount reconciled. The CHRO wants a board slide.
  Legal wants a litigation pull. Comp wants a census file for a survey submission. The answer is
  always harder than the asker thinks, because the data is not what they assume it is.
- **Vendor management.** RFPs, demos, implementations, renewals. They sit through more vendor demos
  than anyone else in the function, and every AI feature in every HR system eventually lands on
  their desk to evaluate, configure, and switch on — or not.
- **Access and security.** Who can see what. Role-based security in the HCM. Pay visibility.
  Audits. Retention schedules and legal holds.

## 2. What's distinctive about it

Seven properties that are not true of People work generally. A role course has to be built on
these, not on a template.

**They ship production systems that other people depend on, unattended.** An HRBP's bad advice
lands in one conversation. A broken integration lands on everyone, silently, until payroll runs.
This is the only role in the function whose failures are *systemic and delayed* — and the only one
where the relevant risk variable is not stakes but **time-to-detection**.

**They own the data every other function's AI runs on.** The comp track assumes a clean census
file exists. The recruiter track assumes the ATS record is right. HRBP M5 says out loud that you
cannot put AI on top of a shaky foundation and names it as a constraint. **This role is that
foundation** — which puts them in a position no other track occupies: they are the answer to a
problem another track diagnoses.

**Their AI arrives as a switch, not a prompt.** This is the single most distinctive fact about the
role. Everyone else in People decides whether to *use* AI. This role decides what four thousand
people *get*. The capability shows up as a feature in a system they already own, announced in
release notes, with a configuration surface and a blast radius — not as a tool they chose. Nothing
anywhere in the curriculum teaches evaluating a capability you are switching on for a population,
inside a system you cannot inspect.

**Their work is the most automatable in the function and the most consequential to automate
wrong.** High volume plus rules-based is the ideal AI target. But the transactions have statutory
clocks under them and the failures are close to irreversible: an effective-dated bulk change that
has already flowed to payroll, the carriers, and the IdP is not an undo, it's a correction project.
This is the exact inverse of the HRBP track's situation, and it is the honest answer to the brief's
worry that this role is a 201 re-run. It isn't — because 201's "one workflow from your week" never
had a statute or a population under it.

**Their AI speaks to employees directly, in the company's voice.** Every other 301 track's AI
output goes to a manager, an executive, or a candidate — through a human who reviews it. This
role's output goes to the employee, unmediated, at scale, about their own money and their own
health. And it can *receive* things: an employee describing a medical condition to a benefits bot
may have given the employer legally-operative notice. No other track has AI on the receiving end
of anything.

**They have the shortest feedback loop to AI failure in the whole function** — the ticket queue.
When someone else's AI produces a wrong answer, an employee complains to this team. They are the
first to know and the last to be asked.

**They are the deployer.** Every other track in this curriculum ends its legal module telling the
learner to find out who the deployer is. For this role, it is them. That is not a framing device;
it is a statutory allocation of obligations, and it is the through-line.

## 3. The subtraction — what is already owned

The failure mode for a role course is 201 with different nouns. This role is the most at risk of
that in the whole set, because its work is high-volume and process-shaped, which is exactly what
201 is about. So every candidate has to state its delta, and the close calls have to be named
rather than glossed.

| Covered by | What it already gives this role |
|---|---|
| 101 M2 | Choosing a tool; the vendor-claim teardown in its first form |
| 101 M4 | Data tiers, the shown-to-the-person test, redaction discipline |
| 101 M6 | The four failure types, verification sized to stakes |
| 101 M7 | Assist vs. decide, the traveling test, bias as fidelity |
| 101 M8 | Accountability, disclosure by reader's stake, the agreement layer |
| 201 M1 | Workflow anatomy; selection by frequency × structure × stakes |
| 201 M2 | Context packs |
| 201 M3 | Document pipelines — **including handbook → policy diff → plain-language change note** |
| 201 M4 | The verification budget matched to failure mode |
| 201 M5 | **The autonomy ladder, guardrails as permissions, MCP** |
| 201 M6 | **People data in production; the boundary sheet; DPA vs. consumer tier** |
| 201 M7 | The operating rhythm, measurement, retirement criteria |
| HRBP M3 | Vendor teardown by evidence/sample/falsifier; the volume trap; automate-the-yes |
| HRBP M5 | The foundation problem, *named as a constraint* |
| HRBP M6 | State AI employment law, the agent doctrine, ER documentation |
| Recruiter R5 | The closed loop: instrument → capture → analyze → feed back |
| Recruiter R6 | Bias audits, adverse impact, the four-fifths rule |
| Comp M3 | **The craft layer: audit files, row counts, documented joins, reconciliation specs** |
| Comp M4 | The exclusion zone; ERISA and fiduciary duty; pay transparency |

### The five close calls, stated honestly

These are the adjacencies that will produce a duplicate module if nobody names them.

**201 M5's autonomy ladder vs. an enablement decision.** 201 teaches a ladder — draft-only,
propose-then-approve, act-with-audit-trail — for a workflow *the learner built and controls*. The
delta: this role applies it to a capability a **vendor** built, whose prompt they cannot see, whose
model changes in a quarterly release, and whose audit trail is whatever the vendor chose to expose.
The ladder is not re-taught. What's new is that you don't own the rungs, and the contract is where
the rungs are actually defined.

**201 M6's boundary sheet vs. what an assistant can reach.** 201 asks what *you* may put into a
tool — an outbound question, one workflow at a time. The delta runs the other direction: what a
system may **retrieve on someone else's behalf**, at rest, across the entire corpus, forever. A
boundary sheet does not answer it, because nobody is pasting anything.

**201 M3's pipelines vs. the knowledge base.** 201's worked example literally includes handbook →
policy diff → change note. The pipeline mechanics do not come back. What survives is a different
claim: the document set **is the model's competence surface**, and an answer given to an employee
from a superseded policy is not a bad summary, it is a misstatement made by the employer.

**Comp M3's craft layer vs. the foundation.** Real overlap, and the thinnest line here.
Reconciliation as a concept belongs to comp M3 and gets cited, not repeated. The delta: comp's
craft is one analyst verifying one analysis on an extract they pulled. This role's subject is **the
source system and the pipelines between systems** — effective dating, identity across platforms,
referential integrity, a field being populated versus a field being true. Not one analysis. The
record itself.

**201 M1's selection rules vs. sorting systems work.** 201 sorts by frequency × structure × stakes.
That framework does not fit work whose defining property is that failures are invisible for a
month. The delta is a different pair of axes — reach and detection latency — and a different gate:
reversibility rather than accuracy.

### Deliberately not modules

- **The HR calendar as workflows.** 201 M7 owns the operating rhythm. This is the strongest
  temptation for this role of any in the set, and it is out.
- **A document-pipeline module.** 201 M3. The knowledge base survives as a *governance* problem,
  never as a pipeline exercise.
- **An analytics or modeling module.** Regression, validity, adverse-impact modeling belong to a
  People Analytics track. Reporting survives here only as a **retrieval and re-identification**
  problem, which is a permissions question, not a statistics one.
- **Prompting or tooling.** 101 and 201. This track says so out loud, following the comp track's
  refusal.
- **"AI for onboarding and offboarding."** The obvious module, and mostly 201 M5's ladder wearing a
  lanyard. The *cascade* idea — one event fanning across twelve systems, failing silently in three
  — survives as a worked example of long-latency failure. It does not earn a module.
- **Driving AI adoption across the function.** Change management and cross-team leadership are how
  401 · The Translator is defined.

## 4. Candidate topics, ranked by how much they earn their place

The test: would a People Ops & HR Technology lead read the description and think *finally, someone
understands my actual job*?

**A. The enablement decision — AI as a switch you own.** How to evaluate an AI capability in a
system of record before it is on for everyone. The three ways AI arrives and the fact that only one
of them has a gate: a feature in a system you already own (release notes, no gate, biggest volume),
a new product (procurement, has a gate), and employees pasting HR data into consumer tools (no
gate, no visibility). Release-note reading as a professional skill. The pre-enablement question
set. The contract layer — subprocessors, training terms, log retention and export, incident
notification, the right to turn it off. Pilot design inside a system of record: instrumented before
enabled, on a population you can actually watch. *Delta:* 101 M2 chooses a tool for yourself, 201
M5 builds a ladder for your own workflow, HRBP M3 tears down a claim in a deck. **Nothing evaluates
a configuration you are imposing on a population.** Highest confidence in the set; the signature
module.

**B. The voice of the company — AI that talks to employees.** Output going to the workforce,
unmediated, about pay, leave, and benefits. Why deflection is the wrong metric and what to measure
instead. The knowledge base as the model's competence. And the sharp part: a chatbot can constitute
**sufficient notice to the employer** of an FMLA-qualifying condition or an ADA accommodation
request, which makes escalation routing a legal control rather than a UX preference. Consistency as
a discrimination surface, now logged. Accessibility of an AI-first channel. Disclosure at first
contact. *Delta:* nothing in the curriculum has AI addressing the workforce or receiving notice
from it. HRBP M7 is about managers *using* AI; this is the company's AI *speaking as the company*.
Second-highest confidence, and the largest legal surface in the track.

**C. The foundation — data quality as the actual AI project.** Every other function's AI ambition
is blocked by this role's data and has never been funded as an AI project. What clean means
concretely in an HCM. And the inversion that makes this the best module for morale: **this is the
one place in the role where AI is unambiguously on the right side of the assist/decide line.**
Reconciling across systems, finding the eleven dead picklist values, surfacing the forty-three
employees whose manager left, drafting the data dictionary nobody wrote — it makes no decisions
about people; it finds where the record disagrees with itself. Highest-value, lowest-risk AI work
in the entire function, and invisible, which is why it never gets funded. So the module's real
content is the business case. *Delta:* HRBP M5 names the constraint; comp M3 verifies one analysis.
Neither fixes the source, and neither has to pay for it. High confidence.

**D. What the assistant can reach.** The sleeper. Role-based security in an HCM is years of
deliberate scoping, and an assistant with a broad index flattens it. The mechanism, which is the
teachable part: the assistant inherits the querying user's access, and that access is wider than
anyone intended because of accumulated shares. **The AI did not create the exposure; it gave it a
search box.** HR is the worst-case corpus — comp files, disciplinary records, investigation notes,
legal-hold material, accommodation documentation. The genuinely new failure: **summarization
launders provenance.** Someone who could never have found the document now gets its contents as an
answer, with no filename, no permission prompt, and no trace that they read it. What this role has
to do about it, including the most common testing error in the discipline: testing as yourself,
when you are an administrator who can see everything. High confidence, and the topic only someone
in this role would think to raise — which is the brief's test.

**E. You are the deployer.** The floor. Article 26 obligations read as configuration decisions —
human oversight assigned to a named person, input-data governance, log retention set long enough,
incident notification — and the fact that they **cannot be contracted away**, so a vendor indemnity
is not compliance. The timing trap (see §5). Works councils as a gating dependency on an
implementation plan rather than a comms step. Records, retention, and legal hold applied to AI
conversation logs. Counsel-review gate. *Delta:* three tracks say *name the deployer*; this one is
the deployer, and the obligations are settings someone has to configure. High confidence.

**F. The transaction floor — automating work with a statutory clock.** I-9 timing, COBRA windows,
final-pay rules by state, new-hire reporting, ACA furnishing. The rule: **AI can prepare and
remind; it cannot be the control** — and if you automate a control, the audit question is where the
evidence is that it ran. Genuinely role-specific. But it risks reading as a compliance list rather
than a method, and its underlying idea — long-latency failure — is the same axis the decomposition
module runs on. **Recommend folding into the decomposition as its worked examples**, not a module.

**G. Process redesign versus process automation.** The specific trap: the process exists because of
a 2019 system limitation, and AI now lets you automate around it instead of removing it. Real, but
substantially 201 M1's selection rules. A lesson, not a module.

**H. The ticket queue as the function's early-warning system.** They see everyone else's AI fail
first. Genuinely distinctive, but it is one lesson — and it belongs inside B.

**I. Build vs. buy vs. configure vs. wait.** The only architecture decision in the People function.
A lesson inside A.

## 5. Verification, done before any of this was written

Per the brief §4, before drafting anything. Three results changed the design; one removed a
statistic I had intended to build a module on.

**Confirmed, and it justifies the track.** SHRM *State of AI in HR 2026* (n=1,722, fielded 5–23
December 2025, 138 HR tasks): AI use concentrates in recruiting 27%, **HR technology management
21%**, L&D 17%, employee experience 14%. So this role sits second in the function — inside a
function where **54% have implemented no AI in HR and have no plans to in 2026**, while 92% of
CHROs expect greater integration. The diagnosis writes itself and it is the opposite of the HRBP
track's: this audience is not behind. They are already deployed, and they did not decide.

**Changed the design — the timing trap.** Regulation (EU) 2026/1744, the Digital Omnibus on AI, was
published in the Official Journal on 24 July 2026 and entered into force on 27 July 2026 (Parliament
16 June, 423–57 with 174 abstentions; Council 29 June). It moved Annex III high-risk obligations —
which is where employment sits — from 2 August 2026 to **2 December 2027**. **It did not move
Article 50.** The transparency duties, including disclosing at first point of contact that a person
is interacting with an AI system, became enforceable on **2 August 2026** — eleven days before this
document was written. An organization with no high-risk AI at all is still caught if it runs a
chatbot, penalties reach €15M or 3% of worldwide turnover, and the duty is shared between provider
and deployer. So: the deadline the whole function is watching slipped sixteen months, and the one
that governs this role's service-desk bot went live this month. The HRBP outline records the
deferral as settled and does not carry Article 50; **that is a gap in a shipped track**, not just a
finding for this one.

**Changed the design — deployer obligations are configuration settings.** Article 26 requires use
per instructions, competent human oversight, input-data management, **logs retained at least six
months**, and notification of risks and serious incidents to provider and authority. Log retention
is a setting somebody has to configure, and oversight is a named person. And the obligations cannot
be contracted away. That converts the floor module from a law lecture into a configuration
checklist, which is the right shape for this audience.

**Changed the design — the notice problem.** Employment-counsel sources (Littler, Ogletree,
Constangy) and EEOC guidance: an employer may receive **sufficient notice** of an FMLA-qualifying
condition or an ADA accommodation request *through a chatbot*, and a bot that fails to respond
appropriately can expose the employer to interference or denial claims. EEOC's position extends to
disclosures made to a vendor the employer never heard about. Health details volunteered to a bot may
become confidential medical information the employer must protect. This is the strongest legal
material in the track and it is entirely role-unique — it makes escalation routing a control, and
it was not on my list before the search.

**Confirmed, and better than expected.** German BetrVG §90 requires informing and consulting the
works council **at the planning stage** of AI deployment (Works Council Modernization Act, 2021);
§80(3) presumes an external expert is necessary at the employer's cost; §95 covers AI-established
selection criteria; §87(1)(6) covers technical monitoring systems. Hans Böckler Foundation (2024):
68% of German works councils report AI systems introduced, only 31% have a works agreement covering
AI. And a German labour court held that merely **permitting** employees to use ChatGPT in a browser
did *not* trigger co-determination. That contrast — permitting a browser tool is not
co-determination, enabling a monitoring-capable feature inside your HCM is a different question —
is precisely a systems-owner's distinction and appears nowhere in the curriculum.

**Confirmed as mechanism, vendor-sourced as incident.** Microsoft 365 Copilot inherits the querying
user's access rights and surfaces content that user could technically reach but was never intended
to see; Microsoft has shipped oversharing-mitigation guidance, which is the vendor conceding the
problem. Reported HR instances — AI summaries of disciplinary discussions and legal-hold threads,
salary data returned from a broadly-permissioned HR file — come from security vendors and should be
labeled as such. The mechanism is the stable, teachable layer; the incident counts are not.

**Weakened, and this removes an intended anchor.** I had planned to anchor the foundation module on
"37.6% of HR leaders say better data quality and coverage would most increase their willingness to
expand AI in talent decisions," with 31% naming data readiness a top barrier and 12.8% having paused
an initiative over data infrastructure. All three trace to the **Fuel50 Q1 2026 State of AI
Readiness in Talent Decisions survey** — a vendor instrument whose sample size I could not establish
after a targeted search. A track that teaches learners to ask *what is the sample* cannot anchor a
module on a number whose sample is undisclosed. **The foundation module's anchor is unresolved.**
The right instrument to mine instead is the **Sapient Insights Annual HR Systems Survey**, the
long-running HR-systems research in this field, which I have not yet read. Blocking before drafting
M5.

**Corroborated but primary not reached.** The deflection-versus-resolution gap attributed to Gartner
— roughly 45% of queries deflected, only ~14% reaching genuine self-service resolution, the other
~31% arriving again through a different channel — appears across many secondary sources, none
primary. It is also customer-service data, not HR. Usable as B's anchor only with both caveats
stated in the lesson; the primary citation is blocking before drafting.

**Unverified and blocking before drafting the floor.** I-9 and E-Verify timing, COBRA election
windows, final-pay timing by state, state new-hire reporting deadlines, ACA furnishing dates, and
current state pay-data reporting regimes. All stated as `[V]` and none what carries the
outline's design.

## 6. What this suggests the course actually is

A shape emerged that no template would have produced, and it is not the HRBP track with systems
nouns.

**This role's 301 is about capabilities you did not choose, running on data nobody funded, talking
to employees in your company's voice, under obligations the law assigns to you personally.** Not
one module of it is about building a workflow. Three of the five strongest candidates (A, D, E) are
about *governing someone else's model*, which is a posture no other track occupies.

Two consequences for design:

**The spine should be a capability, not a project.** The other tracks run on something the learner
*makes* — a workflow, a requisition, a cycle. This role's unit of work is a **configured
capability**, and the honest spine is *one capability already live or about to be* — a feature their
HCM shipped, a service-desk bot, a Copilot rollout — audited across all eight modules. It inverts
the usual capstone: the other tracks build; this one examines something that is already running.
And it is the only track whose capstone can legitimately end in **turn it off**, which is a real and
available outcome here and nowhere else.

**The artifact is a decision record.** Not a business case, not a workflow spec: an **enablement
decision record** — what was turned on, for whom, on what evidence, with which human accountable,
what gets logged and for how long, what the rollback is, and when it gets reviewed. This role has
never had that document and will be asked for it by counsel, by audit, and eventually by a
regulator. It is the most immediately valuable artifact any track in this curriculum produces.

## 7. Open questions for review

- **Eight modules is one more than any other track.** The subtraction left five strong depth
  candidates plus the four convention slots, and folding F into the decomposition got it to eight,
  not seven. The fallback is merging the diagnosis into the decomposition — but the diagnosis here
  is a genuine inversion of the HRBP framing and probably needs to land on its own first.
- **Does the floor split?** Article 26 configuration duties, the Article 50 timing trap,
  co-determination, and records/legal-hold is more legal surface than either HRBP M6 or recruiter
  R6 carries. Same answer for now — ship as one, watch completion — but it is the likeliest split
  in the set.
- **How much does D assume the learner controls the AI layer?** In many companies the Copilot
  tenant belongs to IT and this role has no admin rights. The module may need an explicit
  influence-without-authority path, which is the one place this track touches HRBP territory.
- **Where does the reporting-and-re-identification lesson live** — inside D as a permissions
  problem, as designed here, or does it pull enough weight to argue the People Analytics track
  should absorb it?
- **The Article 50 gap in the HRBP track.** Verification for this track surfaced a live obligation
  a shipped track does not carry. That is a maintenance ticket against `ai301-hrbp`, not a note in
  this document, and it should be raised separately.
