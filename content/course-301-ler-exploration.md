# AI 301 · The Specialist — Labor & Employee Relations track, exploration (pre-outline)

**Status:** working exploration, not an outline. Fifth role track. Method per
`content/301-track-authoring-brief.md` §2: start from the job, find where AI meets it, subtract
everything 101, 201, and the four existing 301 tracks already teach.

**Why this one is the hardest subtraction so far.** The brief flags it in one line — *distinct in
unionized environments; ER documentation currently lives in HRBP M6* — and both halves of that are
structural. `ai301-hrbp` M6 is drafted and seeded, and its Lesson 3 already owns most of the
obvious ER content. So this track has to go *past* a shipped module rather than around it, and the
labor half has to carry more weight than a "distinct in unionized environments" aside implies.

**Scope:** the combined function as it is actually titled — Labor & Employee Relations, Employee &
Labor Relations, LER/ELR. ER specialists, investigators, ER centres of excellence, labor relations
managers, contract administrators, and the people who do both because the company only has one of
them.

---

## 1. What this role actually does

Two sub-functions, frequently one team, sometimes one person.

**Employee Relations.** Intake and triage of complaints from hotlines, ethics lines, manager
escalations, and anonymous reports. Workplace investigations — harassment, discrimination,
retaliation, bullying, policy violation, fraud, safety. Interviewing complainants, respondents, and
witnesses. Credibility assessment. Findings and investigation reports. Discipline recommendations
and the consistency review behind them. Performance escalations and PIPs. Terminations. Leave and
attendance abuse. Policy interpretation. RIF selection review. Threat assessment. Case management
in HR Acuity, Navex, Convercent, AllVoices. Metrics: volume, cycle time, substantiation rate,
repeat respondents, hotspot mapping.

**Labor Relations.** Bargaining preparation, proposal drafting, costing, table strategy. Contract
administration and the grievance steps. Arbitration advocacy and briefs. Contract interpretation
and past practice. Duty-to-bargain and unilateral-change analysis. NLRB proceedings — unfair labor
practice charges, representation petitions. Section 7 and Weingarten. Organizing campaigns.
Work-stoppage contingency planning. Joint labor-management committees. Successorship and WARN.

## 2. What's distinctive about it

Six properties, and they are not true of People work generally.

**Their work product has a designated opponent.** Not "might be read years later by someone
hostile" — HRBP M6 says that, and for a generalist it is the right framing. For this role the
hostile reader is not a risk, it is **the design specification.** An investigation report is written
knowing plaintiff's counsel will read it. An arbitration brief is written for a union advocate to
attack. No other role in the function produces work with a named adversary on the other side of it.

**They work to a standard of proof, not a standard of quality.** Preponderance of the evidence.
Corroboration. Contemporaneous notes. Chain of custody. Privilege. Admissibility. Every other
People role asks *is this good?* This one asks *would this hold?* 101 M6's verification-sized-to-
stakes is a quality frame, and it is not the same instrument.

**Their inputs are contested accounts of the same events.** This is the deepest difference and the
one with the sharpest AI consequence. Every other role's inputs are documents, data, or market
information — material with a ground truth somewhere behind it. This role's core input is two or
more people telling incompatible stories, where **the incompatibility is the evidence.** A model
asked to summarize three witness accounts will produce a coherent narrative, because coherence is
what summarization does — and coherence is precisely what the investigation exists not to presume.
No module anywhere in this curriculum addresses a failure mode where the model is fluent, accurate
to its source, and destroys the finding anyway.

**The process itself is statutorily constrained, not just the outcome.** Weingarten rights.
Protected concerted activity under Section 7 — which applies whether or not there is a union. The
duty to bargain before changing a mandatory subject. Recording consent. In this role, *how* you
reached a conclusion is regulated independently of whether the conclusion was right.

**Their counterparty is organized, professional, and entitled to information.** Comp M5 has the
counterparty who arrives briefed by a chatbot. Here the counterparty is a union with statutory
information rights and a trained advocate, a complainant who may now file through counsel-grade
prose they did not write, and a plaintiff's bar that will run every consistency analysis this team
has never run on itself.

**Their whole corpus is the material every other track says not to touch.** People Ops M6 names
investigation notes, disciplinary records, and legal-hold material as the worst-case corpus for an
AI assistant. That corpus is this role's daily working set. Which creates a genuine cross-track
tension worth resolving rather than glossing — see §3.

## 3. The subtraction — and HRBP M6 is the problem

| Covered by | What it already gives this role |
|---|---|
| 101 M4 | Data tiers, the shown-to-the-person test, redaction |
| 101 M6 | The four failure types, verification sized to stakes |
| 101 M7 | Assist vs. decide, the traveling test, bias as fidelity |
| 101 M8 | Accountability, disclosure by reader's stake |
| 201 M3 | Document pipelines, including interview notes → structured debrief |
| 201 M4 | The verification budget |
| 201 M6 | People data in production; the boundary sheet |
| 201 M7 | The operating rhythm |
| **HRBP M6 L3** | **ER documentation: structure, the completeness pass, language discipline, the stop line, provenance** |
| HRBP M6 L1–2 | The state patchwork, the four recurring duties, EU emotion-recognition ban, the agent theory |
| HRBP M4 | Adversarial rehearsal — the adversary set, committing your position, forbidding hedging |
| HRBP M3 | Vendor teardown; the volume trap; automate-the-yes-not-the-no |
| Recruiter R6 | Adverse impact, the four-fifths rule, bias audits |
| Comp M4 | Disparate impact from historical data; privilege in analysis |
| Comp M5 | The counterparty has AI too |
| People Ops M6 | Retrieval and permissions; summarization launders provenance |
| People Ops M7 | Article 26 as configuration; works-council consultation on deployment |

### What HRBP M6 Lesson 3 already owns, precisely

Read it before drafting anything here. It teaches: structure and consistency; **the completeness
pass — "what did I fail to ask?"**, explicitly called the underused one; language discipline
(flagging "was hostile" where "raised his voice twice, per two witnesses" belongs); the absolute
stop at credibility determinations, conclusions about what happened, and characterizations of a
person; and the provenance discipline ending in *if you couldn't defend a sentence's origin, rewrite
it.*

**None of that is out — and my first pass had this wrong.** I initially cut all of it and made the
track depend on HRBP M6 as a prerequisite, reasoning that re-teaching it would violate the
subtraction discipline. But `trackForRole` resolves a learner to exactly one 301 course id, so an LER
learner will never open the HRBP track. The overlap costs the *learner* nothing; it costs the
*authors* a maintenance liability. See brief §3a, written as a result: vertical subtraction against
101 and 201 stays absolute, horizontal subtraction against siblings is a drift problem, and the rule
is teach what the role needs, share the volatile evidence rather than the prose.

So the craft is taught here, in its specialist form, which is a genuinely different subject: not *how
to use AI on a document* but **what the document has to do.** Elements a finder of fact looks for
rather than a narrative. **"Which allegation did I fail to resolve?"** rather than "what did I fail to
ask?" — a coverage audit against a list, which is mechanical and safe. And the rung boundary
maintained sentence by sentence, which is the evidentiary ladder applied to prose. That became its
own module rather than a fragment, because report-writing is the highest-frequency output in the role
and the generalist track gives it one lesson.

### But HRBP M6 leaves a door open, and it is the best door in this exploration

Its knowledge check Q5 offers "flagging inconsistencies between witness accounts" as a distractor
and explains: *"B edges toward comparing accounts, which approaches credibility."* So the shipped
module identifies the contested-accounts problem, marks it as near the line, and **declines to
resolve it** — correctly, for a generalist who does this occasionally.

For a specialist who does it weekly, **the resolution is the content.** Inconsistency detection and
credibility determination are genuinely different acts, the line between them is fine, teachable,
and structural, and nobody has drawn it. That is this track's signature module and it exists
*because* of the shipped one rather than in spite of it.

### The four close calls

**HRBP M4's adversarial rehearsal vs. preparing for arbitration.** Real overlap, and under §3a it is
not a reason to withhold anything. The distinctive part is that here the adversary's position is
**discoverable from a corpus** — the contract language, the past-practice record, prior awards, the
steps already taken — so it is retrieval and interpretation rather than imagination, which is a
different technique with a different failure mode (fabricated citations rather than a flattering
sparring partner). Where a learner also needs the rehearsal mechanics, teach them; they have not seen
them. Currently unplaced in the outline — the honest reason is that arbitration advocacy is the
thinnest-evidenced area in this exploration, not that another track owns it.

**People Ops M6 vs. building a case-history index.** People Ops says never index investigation
files into a general assistant. This track wants exactly that corpus searchable for comparator
analysis. Both are right, and the resolution belongs in the content: the index must be scoped to
the ER team's own access, must never join the enterprise assistant, and its existence is itself a
discovery consideration. Naming this makes both tracks stronger; leaving it implicit makes them
contradict.

**Comp M5 vs. the organized counterparty.** Comp owns *the counterparty has AI too.* The delta is
that this counterparty has legal rights — a union's right to information is a statutory entitlement,
and a complainant's grievance triggers obligations regardless of who drafted it.

**HRBP M3's volume trap, inverted.** HRBP M3: when production gets cheaper, your function makes more
artifacts. Here it runs the other way — **production got cheaper for the other side, and your
obligation per matter did not change.** Same mechanism, opposite direction, and the staffing data
makes it concrete rather than clever.

### Deliberately not modules

- **ER documentation craft.** HRBP M6 L3. The single strongest temptation in this exploration.
- **The regulatory patchwork and the agent theory.** HRBP M6 L1–2; recruiter R6.
- **Adverse impact computation.** Recruiter R6 owns the four-fifths rule. RIF selection review
  survives only as a comparator problem inside the consistency module.
- **A document-pipeline module.** 201 M3, whose gallery includes interview notes → structured
  debrief.
- **An ER-analytics module.** Recruiter R5 owns instrument → capture → analyze → feed back.
  Substantiation tracking survives inside the consistency module, where it is evidence rather than
  measurement practice.
- **Works-council consultation on AI deployment.** Just assigned to People Ops M7 as a deployment
  dependency. This track takes the *US duty to bargain*, which is a different legal mechanism, and
  cross-references rather than duplicates. Worth a second look — see §6.

## 4. Candidate topics, ranked

**A. Contested accounts.** The signature. There is no ground truth in the source material, and
**summarization harmonizes.** The teachable line HRBP M6 declines: a model may *locate* conflicts —
"A says Tuesday, B says Thursday, the calendar says Wednesday" — and may never *resolve* them.
Asking which account is more consistent with the other evidence is credibility work in an analytical
costume. Preponderance of the evidence requires weighing, and weighing is the determination. Plus
what a model does with silence: an account that omits something is not an account that denies it,
and models fill gaps. *Delta:* an entirely new failure mode — fluent, faithful to its source, and
destructive of the finding. Highest confidence in the set.

**B. The interview and the record.** Fully verified and completely unserved. AI notetakers in
investigations: chilling candor, which undermines the promptness and effectiveness the employer's
own defense depends on; a verbatim timestamped record that would not otherwise exist and is
discoverable; two-party consent; biometric-privacy exposure; transcript fabrication and
misattribution; and the finding that makes it role-specific — **if transcription quality is
systematically worse for some speakers, the record itself becomes bias evidence.** Plus Weingarten,
and the honest judgment that a verbatim record cuts both ways. *Delta:* HRBP M6 governs the document
you write; nothing governs the record of the conversation. Second-highest confidence.

**C. What you've done before.** The consistency and comparator module, and the good-news one.
Disparate treatment is proven by comparators, opposing counsel will run that analysis, and most
teams cannot. AI over your own case corpus, before you decide, is high-value and defensible — the
line being that AI surfaces the precedent and a human decides whether it governs. Consistency is not
uniformity: identical conduct with different aggravating factors properly gets different outcomes,
and the file has to say why. *Delta:* the same detection/correction line People Ops M5 draws over
data, drawn here over people, which makes it harder. High confidence.

**D. The counterparty, organized.** AI-drafted grievances and what they do to volume and to truth;
the rule that you judge the content and not the tool; the union's information rights; the union's own
AI use in costing and contract analysis. High confidence, with comp M5 cited.

**E. Three layers of law.** The floor, and the labor half's home. Statute, Board doctrine, and
General Counsel priorities move at three different speeds, and **advice built on the wrong layer
expires.** The duty to bargain over AI; what unions have actually won; Section 7 without a union;
the enforcement gap and its closure. High confidence and unusually well evidenced.

**F. Intake triage.** Where a matter begins, and the decision that determines whether it is
investigated at all. **HRBP M3's automate-the-yes-not-the-no heuristic in its worst possible
location** — the complainant whose matter was downgraded never appears in your substantiation data,
so the failure is structurally unmeasurable. Excellent content, and it is one lesson rather than a
module. Belongs at the front.

**G. Privilege architecture.** When an investigation is privileged, dual-purpose problems, whether a
third-party tool breaks confidentiality. Genuinely important and **I have not verified it.** Belongs
as a lesson inside B with an explicit counsel gate, not as a module built on unverified ground.

**H. Threat assessment and duty of care.** Real, narrow, and out.

## 5. Verification, done before writing — and it changed three things

**The anchor, and the collision that opens the track.** HR Acuity's *Tenth Annual Employee Relations
Benchmark Study* — fielded with Isurus Market Research, 23 January – 24 March 2026, reporting on
calendar 2025, **274 US organizations of 1,000+ employees representing 8.8 million employees,
margin of error ±5.9 points at 95%.** A vendor-sponsored study, independently fielded with disclosed
methodology, which is the opposite of the problem that killed the People Ops track's data anchor. It
does not describe employers under 1,000 people, and the lesson must say so. Findings: case volumes
and serious misconduct claims at or near decade highs; **serious misconduct allegations more than
doubled since 2021** while ER staffing moved only 0.6 → 0.68 professionals per 1,000 employees;
**70% of ER teams experimented with or actively deployed AI for employee relations and investigations
in 2025**; 56% restrict AI to approved, secured tools for confidential case content; 38% still have
no required investigation process; and **only 32% track substantiation by issue type.**

**Changed the design — the collision.** HRBP M2 teaches, from SHRM, that AI is *least* adopted in
employee relations. HR Acuity says 70% of ER teams used or trialled it in 2025. Both are sound and
they measure different things: SHRM asked organizations where AI is deployed in HR practice areas —
institutional adoption; HR Acuity asked ER teams what they had done, and "experimented with" is a low
bar — practitioner behaviour. **The gap between those two numbers is unsanctioned use in the
highest-stakes documents in the company**, and the 56%-restrict figure means roughly two in five
teams are not confining AI to approved tools for confidential case content. That is a better opening
than anything I had planned, and it exists only because two sources disagreed.

**Changed the design — there is no holding.** I was going to write that unilateral AI implementation
is an unfair labor practice. It is not established. What is established is the 8(a)(5) doctrine:
AI that affects wages, hours, or terms and conditions is very likely a mandatory subject, and a
mandatory subject cannot be changed unilaterally without notice and an opportunity to bargain. What
does **not** exist is a Board decision applying that to AI. **SAG-AFTRA filed a charge against Llama
Productions in May 2025 arguing a duty to bargain before replacing workers with AI, and the Board has
yet to opine on AI-induced layoffs.** Secondary sources state the conclusion as though it were
settled; it is settled doctrine with unsettled application, and a track teaching evidentiary
discipline has to say which. This is HRBP M3's *unverifiable is not the same as false*, applied to
law instead of a vendor claim.

**Changed the design — three layers, not one.** The labor authorities move at visibly different
speeds, and stacking them is more useful than listing them.
- *Statute, stable.* Section 7, the duty to bargain, Weingarten.
- *Board doctrine, flips with administrations.* **Endurance Environmental Solutions** (10 December
  2024) reversed the 2019 *MV Transportation* "contract coverage" test and restored **clear and
  unmistakable waiver**, retroactively — making it materially harder to rely on a general
  management-rights clause. Decided by a Democratic-majority Board.
- *General Counsel priorities, fastest of all.* **GC 23-02**, on electronic monitoring and
  algorithmic management interfering with Section 7 rights, was **rescinded on 14 February 2025** by
  Acting General Counsel Cowen in GC 25-05, among 29 memoranda withdrawn, with case backlog cited as
  the reason.

And the layer that makes it urgent: **the Board lost quorum for nearly a year and got it back on 7
January 2026**, when Scott Mayer and James Murphy — confirmed 18 December 2025 — were sworn in
alongside General Counsel Crystal Carey, with David Prouty the sole remaining Biden-era member. So
the composition that decided *Endurance* no longer holds, which puts the waiver standard in play; and
matters implemented during the quorum gap are now reachable by a Board working its backlog. A learner
who memorised GC 23-02 in 2024 is wrong today. A learner who concludes from the rescission that the
exposure is gone is also wrong, because **the statute never moved.**

**Confirmed, and better than expected — what unions have actually won.** CWA negotiated a contract at
Microsoft subsidiary ZeniMax requiring notice to the union when AI implementation affects work
performed by bargaining-unit employees, and reused it as a template elsewhere in tech. NewsGuild-CWA
has roughly 85–90 agreements containing AI language, with 58 ratified contracts covering newsroom AI
use. **The UPS Teamsters contract prohibits using sensor data as the sole basis for discipline and
requires human review of context before AI-generated performance data is acted on** — which is 101
M7's assist/decide line written into a collective bargaining agreement by the other side. About 38%
of union members report at least one contract provision on automated management or surveillance, most
commonly a notice requirement. **Contract and statute are converging on the same duties HRBP M6 lists
as the recurring statutory obligations** — notice, human review, records — arriving by a completely
different mechanism.

**Confirmed — the interview record.** From employment and privacy counsel (Mayer Brown, June 2026;
Littler; Duane Morris, February 2026; Goodwin, April 2026; Pillsbury): recording intake interviews,
witness statements, and investigative meetings may chill candour and discourage participation,
undermining the employer's ability to investigate promptly and effectively; transcripts are
discoverable and create a comprehensive timestamped record that would not otherwise exist, preserving
every offhand remark; two-party consent states including California, Florida and Pennsylvania require
all participants to consent; a **February 2026 class action against Microsoft alleges Teams live
transcription captured voice biometric data without consent under Illinois law**; notetakers can
fabricate or misattribute statements, and a hallucinated transcript is discoverable evidence; and
**if transcription quality is systematically worse for speakers of particular ethnicities or
linguistic backgrounds, the resulting records may themselves support a bias allegation.** That last
finding is the strongest single fact for this module and it was not on my list.

**Confirmed — the AI-drafted grievance.** Employees now routinely use general-purpose AI to draft
grievances, appeal discipline, challenge redundancies, and prepare tribunal claims. A grievance that
was two pages is commonly 8–12. The prose reads as though written by a lawyer — formal register,
statutory references — even where the employee's grasp of the law or the underlying facts is thin, and
minor incidents get restated in the language of bullying, harassment, or discrimination. And the rule
that governs the response: **you judge the content, not the tool.** Much of this evidence is UK — the
Acas Code, the Equality Act 2010, employment tribunals — and the lesson must say so; the US analogue
is retaliation exposure and the destruction of the prompt-and-appropriate-corrective-action posture
an employer's defense depends on. The "83% of HR directors" figure circulating with this material
traces to a trade-press survey with no methodology and is not usable as an anchor.

**Unverified and blocking before drafting.** Privilege architecture for investigations conducted with
AI assistance — the dual-purpose problem, waiver risk from third-party tools, who the client is
(candidate G, and the reason it is a lesson rather than a module). Weingarten's application to
recorded or AI-assisted interviews, where I found no authority. Any published labor arbitration award
addressing AI-assisted work product or fabricated citations. And the current status of the waiver
standard under the Board seated in January 2026, which should be re-checked immediately before
drafting because it is the most likely thing here to have changed.

## 6. What this suggests the course actually is

**The most adversarial track in the curriculum, and the only one where the AI failure that matters is
fluency rather than error.** Every other track worries about the model being wrong. This one has to
worry about the model being right about each source and wrong about the whole — because it produced a
coherent account of events that were never coherent.

Three design consequences, and the first is a constraint no other track has faced.

**The spine cannot be a live case.** Recruiting runs on a live requisition, comp on a live cycle,
People Ops on a live capability. The equivalent here would be a live matter, and **a learner must
never submit case facts** — not to an AI-graded activity, not to an operator review queue, not to the
tutor. So the spine has to sit one level up: **one matter type the learner owns end to end** — a
harassment intake process, a discipline consistency standard, a grievance-handling step, a bargaining
subject — advanced at the level of process rather than facts. Every activity produces a process
artifact: a triage rubric, a comparator query design, a documentation standard, a bargaining
position. **This should be written into the rubrics as a rejection condition**, not left to the
learner's discretion, and it is the clearest example yet of a role property dictating product
mechanics.

**It interacts with the assessment decision just made.** Activities are now supposed to demand
evidence from the learner's own organization rather than self-report. Here that has to mean *process
and aggregate* evidence — substantiation rates, cycle times, whether a required process exists, what
the case management system can and cannot query — never case content. The two rules are compatible
but the interaction has to be stated explicitly or a learner will resolve it the wrong way.

**The decomposition writes itself, and it is not a quadrant.** Every piece of work product in this
function sits on an evidentiary ladder: **observation → corroboration → inference → finding →
determination.** It is how investigators are trained to write, AI's permission changes at every rung,
and it stops hard between inference and finding. Comp uses five work types; this uses five
evidentiary rungs; the shape is shared and the content is not, which is what the brief means by
adapt rather than copy.

## 7. Open questions for review

- **Does HRBP M6 Lesson 3 get trimmed once this track exists?** No — HRBPs genuinely write ER
  documents and need the basics, and under §3a the duplication is sanctioned. What it does need is a
  reconcilable relationship: the two teach the same discipline at different depths for audiences that
  never overlap, so the risk is contradiction rather than repetition, and only a periodic read of both
  will catch it.
- **Does the track assume a represented workforce?** Resolved by design rather than by asking:
  Section 7 protects concerted activity with or without a union, so the floor applies to everyone,
  and the bargaining material is marked as conditional depth. But in heavily unionized industries
  labor relations is its own function with its own craft, and a separate LR track is arguable.
- **Should works-council consultation move here from People Ops M7?** It sits there now as a
  deployment dependency, which is right for a systems owner. In Europe it is core LR work. Current
  answer: People Ops keeps deployment consultation, this track takes the US duty to bargain, and both
  cross-reference — but a European learner may find the split arbitrary.
- **Is the case-history index a product feature or a warning?** The consistency module wants a
  searchable corpus of investigation files. That is valuable, it is exactly what People Ops M6 says
  not to index into a general assistant, and it has its own discovery implications. The content can
  teach the scoping rule; whether we should also ship a reference architecture is a different question.
- **Seven modules and a 40-minute floor.** Same overload risk as the other three legal modules, with
  more of it — three layers of authority plus the bargaining duty plus contract language plus Section
  7. Ship as one and watch completion, consistent with the rest of the ladder.
