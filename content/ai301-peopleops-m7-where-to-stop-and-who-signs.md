# AI 301 · People Ops & HR Technology · Module 7 — Where to stop, and who signs

**Course:** AI 301 · The Specialist — People Ops & HR Technology track · Module 7 of 8
**Estimated time:** 45 min content · 10 min exercise · 35 min applied activity
**Prerequisite:** Modules 1 and 3 (the register, and the review the map documents) · builds on 101 M7
(assist vs. decide) and 101 M8 (accountability)
**Position in the track:** the floor, and the heaviest module in this curriculum

> `Concepts reviewed: [DATE] · Examples current as of: [DATE]`
> **Counsel review required before this module ships.** Lessons 2 through 5 are **volatile layer** and
> move faster than anything else in this curriculum — a regulation was published, a Board changed
> composition, and a discovery ruling issued while this track was being written. This module teaches
> you which questions have legal answers and how to bring counsel a specific list. **It is not legal
> advice.**

---

## Calibration prompt — the claim to contest

*Commit before you read anything. Thirty seconds.*

**The claim:** *"You can't name who is accountable when your AI is wrong."*

**Is that true of your organization?** *True of us* or *not true of us*, and the one sentence you would
defend it with.

**And the number you'll check against your own register:** of the AI capabilities you inventoried
in Module 1, **how many have a named accountable human**: a person, not a team, not a steering
group? Count from the register when you get there.

---

## Module brief

Governance is usually taught as values. A set of principles, a statement about fairness, a commitment
to human oversight. Those documents are sincere and they do nothing, because a principle has no
configuration screen.

**This module treats governance as design.** Every obligation in it resolves to something somebody has
to do: a tier assigned to a decision, a retention period set in a settings pane, a name in a field, a
signature on a page. If a lesson here doesn't end in something you can act on this quarter, it has
been written wrongly.

Two halves, and they are one artifact.

The first half is **the decision rights you set**: for every decision in your register, what a system
may draft, what it may recommend, and what it may never touch. That is internal, discretionary, and
entirely yours.

The second half is **the obligations the law attaches to you for having set them.** Those aren't
discretionary, they are increasingly specific, and (the part that surprises people) several of them
are settings rather than statements.

Three tracks in this curriculum end their legal module by telling the learner to find out who the
deployer is. **For you, it is you.** That isn't a rhetorical flourish; it is a statutory allocation
of duties that can't be moved by contract, and this module is about what it actually requires.

## Learning objectives

By the end of this module you should be able to:

1. Sort every decision in your register into draft / recommend / never touch, and explain the axis
   that does the sorting.
2. Read Article 26 as a configuration checklist `[V]` and identify which of its duties are settings
   somebody must configure.
3. Explain the timing trap `[V]` — why the deadline your function is watching moved and the one
   governing your service desk didn't.
4. Describe how the agent theory and Article 26 reach the same conclusion by different routes `[V]`,
   and state the *Mobley* privilege ruling precisely enough to act on it.
5. Treat works-council consultation as a gating dependency on an implementation plan `[V]`.
6. Reconcile AI conversation logs against retention rules, statutory minimums, and legal hold.

## Lesson 1 · Decision rights before statutes

Start here, before any law, because the law will ask you what you decided and you need an answer.

For every decision in your Module 1 register, three tiers:

**May draft.** The system produces a first version a human then owns. The human's name goes on the
output. Nothing reaches anyone until they have read it.

**May recommend.** The system produces an option, a ranking, or a flag, and a human chooses. The
critical property, easy to lose: **a recommendation only counts as a recommendation if declining it is
normal.** If your reviewers accept 99% of recommendations, you don't have a recommend tier. You have
an automated decision with a signature step, and everybody involved will discover this at the same
awkward moment.

**May never touch.** The system doesn't participate. Not draft, not rank, not summarize the inputs.

Now the axis that sorts them, because the intuitive candidates are both wrong. It isn't **stakes**,
high-stakes decisions are often well-supervised precisely because they are frightening. It isn't
**difficulty** — hard decisions attract attention. The axis is:

> **Does this decision require judgment whose absence nobody would notice?**

That is where the danger concentrates. A wrong termination decision gets contested. A wrong
eligibility determination for one person in an edge case, produced fluently and approved without
comment, gets filed. **The failures that matter are the ones where nothing looked wrong**, which is
Module 1's detection-latency argument arriving as an ethical criterion rather than an operational one.

And then the sentence this module is named for:

> **The decision that matters most is where to stop, and it is a design decision made in advance,
> not a value asserted afterwards.**

Asserted afterwards, "we always keep a human in the loop" is a description of a hope. Decided in
advance and written into a tier, it is a constraint that survives the quarter when everyone is busy.

## Lesson 2 · Article 26 as a configuration checklist **[V]**

Now the law, and the useful discovery is that most of it is settings.

Article 26 of the EU AI Act sets out what **deployers** of high-risk AI systems must do. Employment
uses (recruitment, selection, promotion, termination, task allocation, and performance monitoring)
are classified as high-risk. If you administer the systems those uses run on, the deployer is your
organization, and in practice the person who can discharge most of these duties is you.

Read as a checklist rather than a statute, the duties are:

- **Use the system in accordance with the provider's instructions for use.** Which requires that
  somebody has read them. This is a lower bar than it sounds and it is frequently not met.
- **Assign competent human oversight** — and note the two words. Not oversight in the abstract:
  *competent*, meaning the person has the knowledge and the standing to intervene, and *assigned*,
  meaning to a person rather than to a function. **This is Module 1's accountability column with a
  statute behind it.**
- **Manage input data**, ensuring it is relevant and sufficiently representative for the system's
  intended purpose. Module 5 is how you would actually do this.
- **Keep logs for at least six months.** A retention period. Somebody sets it in a configuration
  pane, and the default in many systems is shorter — 30 or 90 days is common. **This is the single
  most actionable sentence in the module**, because it is a setting that is probably wrong right now
  and takes minutes to fix.
- **Monitor operation** and **inform the provider and the relevant authority** of risks and serious
  incidents.

And the sentence that ends every procurement argument you'll ever have:

> **These obligations attach to the deployer and cannot be contracted away.**

An indemnity is a financial arrangement about who pays afterwards. It isn't compliance, and it does
not move a duty. You can negotiate who bears the cost of a failure; you can't negotiate away the
requirement to have assigned competent human oversight.

One framing worth carrying into Lesson 3: **the deferral of high-risk obligations changes when
enforcement starts, not what is required.** Everything above is settled text. The date is the only
thing that moved.

## Lesson 3 · The timing trap **[V]**

This is the fact most likely to be wrong in the room you walk into, and it is worth getting exactly
right.

**What moved.** Regulation (EU) 2026/1744, the Digital Omnibus on AI, was published in the Official
Journal on **24 July 2026** and entered into force on **27 July 2026**, following Parliament's approval
on 16 June and the Council's on 29 June. It moved the **Annex III high-risk obligations, which is
where employment sits, from 2 August 2026 to 2 December 2027.** Sixteen months.

**What did not move: Article 50.** The transparency duties were left out of that deferral, and they
became enforceable on **2 August 2026** — which, at the time of writing, has already happened. Article
50 requires, among other things, that a person interacting with an AI system **be told so at the first
point of contact**, not in a document they will never open. Penalties for transparency breaches reach
**€15 million or 3% of total worldwide annual turnover**, whichever is higher.

Put those two together and you get the trap:

> **The deadline your entire function is watching slipped sixteen months. The one that governs your
> service desk did not.**

And the consequence that catches people who assumed they were out of scope entirely: **an organization
with no high-risk AI at all is still caught by Article 50 if it operates a chatbot.** You don't need
to be doing anything the Act considers high-risk. You need to be answering employees with a machine.

Two practical notes.

**Expect the room to be wrong about this, in both directions.** Some colleagues will tell you
everything is deferred to December 2027. They read a headline in June and didn't read Article 50.
Others will tell you the deferral never completed, because a great deal of commentary was written
between the June votes and the July publication and much of it has never been updated. When you
encounter a source saying the Omnibus "awaits Council adoption and Official Journal publication," you
have found writing that predates 24 July 2026 and wasn't revised.

**Which is the transferable skill, not the dates.** The dates in this lesson will be wrong eventually.
The habit that won't be wrong is: **find out whether the thing you're relying on is in force, and
on what date, from a primary source**: the Official Journal, the regulation's own text, the agency's
own release. Every other module in this track asks you to demand a citation from a vendor. This one
asks you to hold your own legal understanding to the same standard.

## Lesson 4 · Two legal systems, one conclusion **[V]**

The EU isn't the only place arriving at the conclusion that obligations don't travel with the
invoice. US litigation is getting there by a completely different route.

In *Mobley v. Workday* (N.D. Cal.), the court has allowed claims to proceed on the theory that a
vendor screening candidates on an employer's behalf can be the employer's **agent** — and therefore
within the statutory definition of "employer" for discrimination purposes. The posture as of writing:

- Preliminary collective certification on the ADEA claim in **May 2025**, extended in **July 2025** to
  applicants whose applications were scored, ranked, or screened using the vendor's AI features. A
  notice plan was approved in **December 2025**, and roughly **14,000 people opted in** by the
  March 2026 deadline.
- A **March 2026** ruling rejected the argument that the ADEA doesn't cover job applicants.
- Rulings through **June 2026** have kept claims moving across race, sex, age, and disability.
- The case remains in **pre-trial discovery**. There is no final judgment, and procurement behaviour
  should change on the theory surviving rather than on an eventual verdict.

**And the discovery ruling you need to state precisely, because the loose version is wrong.** In
**May 2026** a magistrate judge denied the plaintiffs' motion to compel production of the vendor's
bias-testing data, finding it protected by attorney-client privilege **because the vendor's attorneys
had curated the analysis and used its results in providing legal advice.**

That isn't a holding that bias testing is privileged. It is a ruling that on these facts, structured
this way, privilege applied, and the structure is the whole lesson:

> **Whether your testing is protected depends on how you set it up, which means counsel has to be
> involved before you run it, not after somebody asks for it.**

An audit commissioned by HR as an operational exercise and an audit commissioned by counsel as part
of legal advice may be the same analysis with entirely different discovery consequences. That is a
ten-minute conversation to have now and an impossible one to have retroactively.

So the two systems converge:

> **The agent doctrine and Article 26 say the same thing in two languages. The obligation does not
> transfer with the invoice.**

## Lesson 5 · Co-determination as a gating dependency **[V]**

If any part of your estate covers Europe, this lesson determines your implementation plan, and it is
routinely discovered too late.

In Germany, the Works Constitution Act gives works councils enforceable rights over the introduction
of technical systems capable of monitoring employee conduct or performance. Three provisions matter
for you specifically:

- **§90** requires the employer to inform and consult the works council **at the planning stage** of
  an AI deployment: a change introduced by the Works Council Modernization Act in 2021. Not at
  launch. **At planning.**
- **§80(3)** creates a presumption that engaging an external expert is necessary when the council
  assesses AI, **at the employer's cost.**
- **§95** covers selection criteria, extended by the same 2021 amendment to criteria that AI helped
  establish.

And the distinction that keeps this from becoming "AI requires co-determination," which isn't true. A
German labour court has held that **merely permitting employees to use a browser-based AI tool did not
trigger co-determination** — because the question isn't whether the technology is AI. The question is
what the system does inside your estate, and specifically whether it is capable of monitoring conduct
or performance.

Which gives you a usable line: **permitting a general-purpose tool is a different question from
enabling a monitoring-capable feature inside your HCM.** The first may not engage co-determination.
The second very likely does.

The scale of the gap is documented. The Hans Böckler Foundation found that **68% of German works
councils report AI systems having been introduced in their organizations, while only 31% have a works
agreement covering AI use.**

For a systems owner, the operational translation is a single sentence, and it is a project-plan fact
rather than a communications one:

> **Consultation is a dependency with a lead time, not a message you send at go-live.**

Put it on the plan as a task with a duration and a predecessor. A deployment that reaches a German
population without it isn't a communications problem to smooth over afterwards; it may have to be
switched off.

## Lesson 6 · Records, retention, and hold

The last piece, and it is where three rules collide in a way that is nobody's job until it is yours.

**AI conversation logs are records.** Not telemetry, not debug output. If an employee asked your
assistant about their leave and it answered, that exchange documents an interaction between the
employer and the employee about a statutory entitlement.

Three rules now apply to the same data and they don't agree:

1. **Your retention schedule** probably says something short for chat and support data — 30 or 90
   days is a common default, often set by whoever configured the tool.
2. **Article 26** requires logs kept for **at least six months** where the system is high-risk.
3. **A legal hold** requires that relevant material be preserved from the moment litigation is
   reasonably anticipated, which overrides both of the above and applies to a system your legal team
   may not know is generating records.

And a fourth complication specific to Module 4's territory: **a transcript in which an employee
described a health condition may be confidential medical information**, with handling requirements
different from the rest of your chat logs. That is a data-classification problem inside a chat
archive, which is a genuinely hard thing to solve and a very easy thing to haven't noticed.

**What you can do this quarter, without waiting for anyone:**

- Find out what the retention setting actually is on each AI capability. Not what the policy says,
  what the setting says. These differ more often than not.
- Establish whether logs can be **exported and placed on hold**. A capability whose logs can't be
  preserved is a capability that can't survive litigation, and that is a procurement finding.
- Tell your legal team the system exists and generates records. This sounds trivial. It is frequently
  the single most valuable sentence in the whole exercise, because a hold can't reach a system nobody
  mentioned.

**And the list to bring counsel**, which is the point of the module. Not *"are we compliant with AI
law?"*. That gets a shrug, and deserves one. Instead:

> *"We have these four capabilities. Here's what each one decides, who it reaches, and what it logs.
> Two of them touch employment decisions in the EU. One answers employees directly and has been
> disclosing itself as AI since August. Logs are set to 90 days. One population is covered by a works
> council we have not consulted. Which of these needs to change first, and what am I wrong about?"*

That question has answers. The general one doesn't, and asking it is how a function spends two years
being reassured.

> ### Try this — 3 minutes
> Open the configuration for one AI capability in your stack and find the log retention setting. Note
> the number. If it is under six months and the capability touches an employment decision in Europe,
> you have found something you can fix today.

## Key takeaways

- **Governance is design, not values.** Every obligation here resolves to a tier, a setting, a name,
  or a signature. A principle has no configuration screen.
- **Three tiers per decision (draft, recommend, never touch**) and **a recommendation only counts as
  one if declining it is normal.** 99% acceptance means you have an automated decision with a
  signature step.
- **The sorting axis is neither stakes nor difficulty. It is whether the decision requires judgment
  whose absence nobody would notice** — because the failures that matter are the ones where nothing
  looked wrong.
- **Article 26 is mostly settings** `[V]`: follow the instructions for use, assign *competent* human
  oversight to a *person*, manage input data, **keep logs at least six months**, monitor, and notify.
  And **these duties cannot be contracted away**: an indemnity allocates cost, not obligation.
- **The timing trap** `[V]`: Regulation (EU) 2026/1744 (in force 27 July 2026) moved Annex III
  employment obligations to **2 December 2027**. **Article 50 was not deferred and has been enforceable
  since 2 August 2026**, requires disclosure at first contact, carries penalties up to €15M or 3% of
  worldwide turnover, and **catches an organization with no high-risk AI at all if it runs a chatbot.**
- **Expect the room to be wrong in both directions**, and treat your own legal understanding to the
  standard you demand of vendors: **is it in force, on what date, per a primary source?**
- **Two legal systems, one conclusion** `[V]`. The agent theory in *Mobley* and Article 26 both say the
  obligation doesn't transfer with the invoice. And the May 2026 privilege ruling is narrow but
  actionable: protection depended on **counsel curating the testing and using it in legal advice**, so
  **involve counsel before you test.**
- **Co-determination is a dependency with a lead time** `[V]`. §90 requires consultation **at the
  planning stage**; §80(3) presumes an employer-funded external expert; §95 reaches AI-established
  selection criteria. Permitting a browser tool is a different question from enabling a
  monitoring-capable feature in your HCM.
- **Four rules collide on your logs**: your retention schedule, Article 26's six months, legal hold,
  and possible confidential medical information. **Tell legal the system exists and generates records**:
  a hold can't reach a system nobody mentioned.

## Take a position

**The claim:** *"'The vendor is responsible for their model' is true and irrelevant. The obligations
attach to whoever flipped the switch, they can't be signed away, and that was you."*

The strongest counter-argument is that **this is a claim about legal allocation dressed up as a claim
about competence, and the two come apart badly.**

Article 26 does assign duties to deployers and they can't be contracted away. But that says nothing
about who is *equipped* to discharge them. You can't audit a model. You can't inspect a training
corpus, evaluate whether a system is fit for its declared purpose, or verify a provider's conformity
assessment. Assigning non-transferable obligations to a person without the technical capacity to meet
them doesn't produce compliance — **it produces a signature on a document nobody could have
validated**, which is worse than no signature, because it converts a genuine capability gap into
apparent assurance. The regulator, later, will read the signature and not the gap.

On that view the honest reading is that deployer obligations are **institutional rather than
individual**: the organization owes them, and the right artifact is a named accountable **executive**
plus a documented, reasonable reliance on the provider's declared conformity — not a systems manager
personally attesting to properties of a model they have no means to examine.

Your position has to answer the question that follows, and it is the sharpest question in the track:
**what, precisely, are you attesting to when you sign?**

If the answer is *"I confirmed the configuration, the population, the gate, the retention setting, and
the rollback"*. That is a defensible scope, it is genuinely yours, and you should say so on the
document rather than leaving the reader to infer it. If your signature implies more than that, you
need to either narrow it explicitly or get somebody else's name next to yours.

## Applied activity — "The map, signed"

**Time:** 35 minutes · **Submit:** the decision-rights map with its signature block, and a 300–400
word write-up · **Graded against the rubric below.** Score doesn't matter. Doing the work is where the
learning lands.

This is the artifact the whole track exists to produce. It is what counsel, internal audit, a works
council, and eventually a regulator will ask you for, and almost no People function has one.

**Step 1. Tier every decision (12 min).** Take your Module 1 register. For each decision: **may
draft / may recommend / may never touch.** For anything in the recommend tier, state **how often
recommendations are actually declined** — and if the answer is never, reclassify it or say why it
stays.

**Step 2. Fill the required fields (10 min).** For each capability attached to those decisions: the
**named accountable human**, the **competent human oversight** assignment and why that person is
competent to intervene, **what is logged and for how long** (the actual setting, not the policy), the
**rollback**, the **review date**, and the **disclosure posture**, does it tell people it is AI at
first contact.

**Step 3 — The dependencies (5 min).** Any population covered by a works council or comparable body,
and whether consultation has happened. Any capability whose logs can't be exported or held. Any
retention setting under six months on something touching an employment decision in the EU.

**Step 4. The signature block (3 min).** A name, a date, and (the part that matters) **an explicit
statement of what the signature attests to.** Write the scope. This is where the *Take a position*
argument becomes an artifact rather than an opinion.

**Step 5. The counsel list (5 min).** Three to five specific questions in the form Lesson 6 models.
Not "are we compliant." Named capabilities, what each decides, and what you think is wrong.

**Score the prediction:** your predicted count of capabilities with a named accountable human against
what the register actually shows.

Then the write-up: your position on the claim above, answering **what precisely you're attesting to
when you sign**; whether the opening claim turned out to be true of your organization; and the single
change you're making this week — **the retention setting, the works-council task on the plan, or the
sentence to your legal team that the system exists.**

## Knowledge check — 8 questions

*Unlocks after the applied activity is submitted. Retakes are free and unlimited.*

**Q1.** What makes a "recommend" tier real rather than nominal?

- A. That a human signs off on every recommendation
- B. That declining a recommendation is normal — if reviewers accept 99% of them, it is an automated decision with a signature step ✓
- C. That the recommendation includes a confidence score
- D. That the recommendation is logged before the decision is made

> **B.** A signature step is not a gate. The test is whether refusal actually happens, which is the
> same test Module 3 applies to the human gate in its eight questions.

**Q2.** What is the axis that sorts decisions into the three tiers?

- A. The stakes attached to the decision
- B. How difficult the decision is
- C. Whether the decision requires judgment whose absence nobody would notice ✓
- D. How many people the decision affects

> **C.** High-stakes and difficult decisions attract supervision precisely because they are
> frightening. The danger concentrates where a fluent, wrong output gets filed without comment —
> Module 1's detection-latency argument arriving as an ethical criterion.

**Q3.** Which Article 26 duty is a configuration setting you can check today? `[V]`

- A. Managing input data for representativeness
- B. Following the provider's instructions for use
- C. Keeping logs for at least six months: a retention period somebody sets, where the common default of 30 or 90 days is probably already wrong ✓
- D. Notifying authorities of serious incidents

> **C.** The module calls it the single most actionable sentence in it, because the fix takes minutes
> and the default is usually non-compliant for high-risk uses.

**Q4.** What does "these obligations can't be contracted away" mean for procurement? `[V]`

- A. That vendor contracts can't include indemnities for AI failures
- B. That an indemnity allocates who bears the cost of a failure but doesn't move the duty, so indemnity isn't compliance ✓
- C. That deployers must renegotiate all existing AI contracts
- D. That the provider and deployer share obligations equally

> **B.** You can negotiate who pays. You cannot negotiate away the requirement to have assigned
> competent human oversight.

**Q5.** What is the timing trap? `[V]`

- A. That the entire EU AI Act was deferred to December 2027
- B. That Annex III employment obligations moved to 2 December 2027 while Article 50's transparency duties weren't deferred and became enforceable on 2 August 2026 — catching any organization that runs a chatbot, even one with no high-risk AI ✓
- C. That Article 50 was deferred while high-risk obligations took effect on schedule
- D. That the deferral applies only to organizations headquartered in the EU

> **B.** Regulation (EU) 2026/1744 entered into force 27 July 2026 and moved the high-risk date.
> Article 50 was left out of the deferral. Expect colleagues to be wrong in both directions, and check
> against a primary source.

**Q6.** How should the May 2026 privilege ruling in *Mobley* be stated? `[V]`

- A. As establishing that AI bias-testing data is privileged
- B. As a denial of a motion to compel on these facts, where privilege applied because the vendor's attorneys curated the analysis and used its results in providing legal advice, so the structure determines the protection ✓
- C. As holding that bias testing is discoverable in all circumstances
- D. As unrelated to employers, since it concerned a vendor's own data

> **B.** Which produces the actionable version: involve counsel *before* you run testing, not after
> somebody asks for it. The same analysis run as an HR operational exercise may have entirely
> different discovery consequences.

**Q7.** When does German co-determination require works-council involvement in an AI deployment? `[V]`

- A. At launch, as a notification
- B. At the planning stage, under §90, with §80(3) presuming an employer-funded external expert, and §95 reaching AI-established selection criteria ✓
- C. Only where the system makes automated decisions without human review
- D. Only in organizations above a headcount threshold

> **B.** Which makes consultation a dependency with a lead time on the project plan rather than a
> message sent at go-live. Note the boundary: a labour court held that merely permitting a
> browser-based AI tool did not trigger co-determination — the question is what the system does inside
> your estate.

**Q8.** Which of the four rules colliding on your AI logs overrides the others?

- A. Your organization's retention schedule, since it is the organization's own policy
- B. Article 26's six-month minimum
- C. A legal hold, which requires preservation from the moment litigation is reasonably anticipated, and which can't reach a system nobody told legal about ✓
- D. The vendor's default configuration

> **C.** Which is why the module says telling your legal team the system exists and generates records
> is frequently the most valuable sentence in the exercise. The medical-information complication sits
> on top of all four.

## Sources and attribution

- **EU AI Act, Article 26**, deployer obligations: use in accordance with the instructions for use,
  assignment of competent human oversight, input-data management, retention of logs for at least six
  months, monitoring, and notification of risks and serious incidents to the provider and relevant
  authority; and that these obligations attach to the deployer and can't be contracted away. **[V]**
- **Regulation (EU) 2026/1744 (the Digital Omnibus on AI)** — published in the Official Journal on
  24 July 2026 and in force from 27 July 2026, following European Parliament approval on 16 June 2026
  and Council approval on 29 June 2026; moves **Annex III** high-risk obligations, including
  employment, from 2 August 2026 to **2 December 2027**. **A large volume of commentary was written
  between the June votes and the July publication and never updated, sources describing the Omnibus
  as awaiting Council adoption predate 24 July 2026.** Verify against the Official Journal. **[V]**
- **EU AI Act, Article 50**, transparency duties, including disclosure at first point of contact that
  a person is interacting with an AI system; **excluded from the Digital Omnibus deferral and
  enforceable from 2 August 2026**; penalties up to €15 million or 3% of total worldwide annual
  turnover. Reaches organizations with no high-risk AI that operate a chatbot. **[V]**
- ***Mobley v. Workday, Inc.*** (N.D. Cal.) — the agent theory permitted to proceed; ADEA collective
  preliminarily certified May 2025 and extended July 2025 to applicants scored, ranked or screened by
  the vendor's AI features; notice plan approved December 2025 with roughly 14,000 opt-ins by the
  March 2026 deadline; a March 2026 ruling rejecting the argument that the ADEA doesn't cover
  applicants; rulings through June 2026 keeping claims alive across race, sex, age and disability; and
  a **May 2026 magistrate ruling denying a motion to compel the vendor's bias-testing data on
  attorney-client privilege grounds, because counsel curated the analysis and used its results in
  giving legal advice.** Still in pre-trial discovery; no final judgment. Agent-theory phrasing aligned
  with `ai301-hrbp-m6` and `ai301-recruiter-r6`, which cover the same case, so the three don't
  drift. **Litigation posture changes between review cycles. [V]**
- **German Works Constitution Act (BetrVG)** — §90 information and consultation at the planning stage
  of AI deployment (Works Council Modernization Act, 2021); §80(3) presumption of a necessary external
  expert at the employer's cost; §95 on selection criteria, extended to AI-established criteria; and
  §87(1)(6) on technical monitoring systems. Plus a German labour court holding that permitting
  employees to use a browser-based AI tool didn't itself trigger co-determination. **Hans Böckler
  Foundation**: 68% of German works councils reporting AI systems introduced, 31% with a works
  agreement covering AI. **[V]**
- The three-tier decision-rights model, the judgment-whose-absence-nobody-notices axis, the
  declining-must-be-normal test, Article 26 read as a configuration checklist, the four-rules-on-one-log
  collision, and the counsel-list form are original to this course.
- Builds on 101 M7 (assist vs. decide, extended from a binary to three tiers), 101 M8
  (accountability), and Modules 1 and 3 of this track, the register supplies the rows and the
  enablement review supplies the evidence.
- **This module is not legal advice.** Every statute, regulation, case and date here moves. It teaches
  which questions have legal answers and how to bring counsel a specific list. **Counsel review
  required before ship.**
