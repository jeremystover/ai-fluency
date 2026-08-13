# AI 301 · People Analytics · Module 5 — Governing AI used on people

**Course:** AI 301 · The Specialist — People Analytics track · Module 5 of 6
**Estimated time:** 40 min content · 10 min exercise · 30 min applied activity
**Prerequisite:** Modules 1–2 · the prediction material from M2 L5 is assumed
**Position in the track:** Layer 5 — accountable standing

> `Concepts reviewed: [DATE] · Examples current as of: [DATE]`
> **Counsel review required before your organization ships anything built from this module.**
> Lessons 2–5 are heavily **[V]** volatile. One of the statutes below was postponed, enjoined,
> repealed and replaced inside thirteen months, which is a lesson rather than a footnote.
> **This is not legal advice.** It is a map of where you need some, and of what only you can produce.

---

## Claim to contest — before you start

*Commit before you read anything.*

> **"Nobody in your organization can produce a list of the AI systems currently touching a decision
> about a person."**

**True of us, or not true of us?** If you believe someone can, name them — and note whether you think
the list would include the model your own team built.

You'll go and build that list in the activity. It is the artifact this module exists to produce.

---

## Module brief

Three tracks in this curriculum have a floor module, and all three tell the learner to find out who
the deployer is. **This one is different, because the obligations land on you and the evidence that
discharges them is statistical.**

That is the argument for the whole module and it is worth saying plainly:

> **Legal cannot do this alone. They can read the statute. They cannot run an adverse impact
> analysis, validate an instrument against the Uniform Guidelines, or tell you whether a model's
> disparity is real or an artifact of the control set.**

The obligations are legal. **The evidence is statistical.** That combination exists in exactly one
function, and it is a stronger claim to territory than any org-chart argument you could make.

A subtraction note, so this module stays in its lane. Three shipped tracks already carry a regulatory
map, the HRBP track on state AI employment law and the agent doctrine, the recruiter track on adverse
impact and bias auditing **in a selection context**, the People Ops track on deployer obligations,
logs and works councils. **This module cross-references all three and re-teaches none of them.** What
is here's the analytics-specific surface: the three ways you acquire obligations that a systems owner
doesn't, and the disclosure problem that is yours alone.

## Learning objectives

By the end of this module you should be able to:

1. State why the legal obligation and the discharging evidence sit in different professions.
2. Read the current map well enough to know what has to be retained, testable and documented `[V]`.
3. Explain how building or repurposing a model makes you a provider rather than only a deployer `[V]`.
4. Identify purpose-limitation violations in secondary use of HR data `[V]`.
5. Apply disclosure control (thresholds, suppression, and the differencing attack) as distinct from
   access control.
6. Draw the surveillance line deliberately, before it is drawn by default.

## Lesson 1 · Why this is yours

Start with the mechanism rather than the claim.

A regulator, a works council, or a claimant asks: *does this system disadvantage a protected group?*
That question has a legal frame and a statistical answer. Somebody has to define the comparison
groups, choose the selection rate measure, decide what counts as a practical difference, determine
whether an observed gap survives controls, and say which controls are legitimate rather than
laundering. **Every one of those is a modelling decision with a fairness consequence**, and comp M4's
lesson applies at full force: *"explained" variance is a modelling decision, not a statistical fact.*

Your Legal team can't make those decisions. They can tell you the standard. **They cannot tell you
whether you have met it**, and if they try, they will do it by asking whoever built the model, which
is either you or a vendor with an interest in the answer.

Two consequences.

**You'll be asked for evidence you have not been asked to keep.** Retention obligations attach to
records that only exist if somebody decided to create them. A model's training population, the
selection rates it produced, the version that ran in March — none of these are automatic.

**And the reverse: involve counsel before you test, not after.** Where an analysis might surface a
disparity, whether it is privileged depends on how it was commissioned. The comp track's Module 4
covers this properly and it is the same lesson here — **the sophisticated posture is to run the
analysis at the direction of counsel**, and that has to be arranged in advance because privilege is a
fact about commissioning, not about content.

## Lesson 2 · The map, compressed **[V]**

Three tracks carry the detail. Here's what an analytics function has to *do* about each.

**California FEHA automated-decision systems.** In force since **1 October 2025**, applying to
employers with **five or more employees** in California. Records of selection criteria, ADS data and
applicant-flow logs must be retained for **four years**, doubled from two. And the reach extends to
**AI tool developers and agents**, which is the limb that matters here: if your team built it, the
regulation is looking at your team.

*What you do:* the four-year clock runs on records somebody has to be creating. Selection rates by
group, per version, per period. **If your model changed in June and you cannot say what the previous
version did, the record does not exist and the retention obligation cannot be met retrospectively.**

**Illinois.** In force since **1 January 2026**, amending the Human Rights Act. **Strict liability for
discriminatory effect, intent is not a defence.** Notice required where AI is used in recruitment,
hiring, promotion, discipline, discharge, or the terms of employment. **Zip codes as proxies for
protected classes are expressly prohibited.** One employee is enough to be covered, and implementing
rules are still being written.

*What you do:* the zip-code prohibition is the analytics-specific one, and it generalises further than
its text. **Any geographic, educational or behavioural feature can function as a proxy**, and strict
liability means you don't get to argue you didn't mean to. Feature-by-feature proxy review belongs
in your model documentation, not in Legal's.

**Colorado — and this one is the lesson.** SB 24-205 was the landmark state AI act. It was postponed
to 30 June 2026. Its enforcement was **blocked by a federal magistrate on 27 April 2026** following a
constitutional challenge with the Department of Justice intervening. It was then **repealed and
replaced by SB 26-189, signed 14 May 2026**, a scaled-back **disclosure-and-rights framework** for
automated decision-making technology, effective **1 January 2027**.

*What you do:* notice what would have happened to a compliance programme built to SB 24-205's specific
requirements. **Postponed, enjoined, repealed and replaced inside thirteen months.** The date survived
and the law behind it didn't. **Build an inventory that survives the statute rather than a checklist
keyed to one**, which is exactly what this module's activity produces, and why it asks for a risk
classification rather than a compliance status.

**And the EU timing, which the People Ops track carries in full.** The Annex III deferral to December
2027 is **not a repeal**, and the transparency duties that weren't deferred are already in force.
Article 26(7)'s works council obligations bind now.

## Lesson 3 · You may be the provider, not only the deployer **[V]**

Every other floor module in this curriculum assumes the model arrived from a vendor. **Yours may not
have**, and the obligations that attach to building aren't the ones that attach to buying.

The mechanism is specific rather than a general principle. **Article 25** transfers provider
obligations to a deployer or third party in three circumstances:

1. **Putting your own name or trademark** on a high-risk system already on the market.
2. **Making a substantial modification** to one while it remains high-risk.
3. **Changing the intended purpose** of a system so that it becomes high-risk.

**The third limb is the one this audience walks into**, and it doesn't feel like a legal act when you
do it. You take a general-purpose model, or a tool licensed for something else, and you point it at a
question about employment — promotion readiness, flight risk, performance forecasting. Nobody signed
anything. Nobody called it a deployment. **You have changed a system's intended purpose so that it
became high-risk, and the obligations that follow are the builder's, not the buyer's.**

The practical version, stated as a question to ask before any model gets built or repurposed:

> **If a regulator asked who is responsible for this system's design, is the honest answer "us"?**

If it is, the vendor's documentation isn't your documentation, the vendor's indemnity doesn't
discharge your obligation, and the conformity questions belong to you. **An in-house model is not the
safe option because it was built by people you trust.** It is the option where nobody else is holding
the paperwork.

## Lesson 4 · Purpose limitation **[V]**

This function's most common quiet violation, and it is quiet because every individual step looked
reasonable.

Data was collected to run payroll. To administer benefits. To field an engagement survey. To operate
a performance cycle. Each collection had a stated purpose and, usually, a lawful basis tied to it.

**Then it becomes a feature in a model predicting who will quit.** Nobody re-consented anyone. Nobody
issued notice. The data was already in the warehouse, the join was trivial, and the analysis was
authorised by whoever authorised the analysis.

**The engagement survey case is the sharpest, and it is the one to carry.** You told respondents their
answers were confidential and would be used to improve the organization. Using those answers as a
feature in an individual-level flight-risk model **breaks that promise even where it clears the legal
bar**, and it breaks it in a way that is unrecoverable, because the next survey is answered by people
who now know.

Three questions before any feature enters a model about people:

- **What was this collected for, and was that stated to the person?**
- **Would they recognise this use as consistent with what they were told?**
- **If the use became public inside the company tomorrow, what happens?**

The third isn't a legal test and it is the one that predicts the outcome best. It is 101 M8's
reader's-stake disclosure test, applied to a data lineage rather than to a document.

## Lesson 5 · Disclosure control, which is yours **[V]**

The People Ops track owns **access control**: who can *retrieve* what, where an assistant inherits its
user's rights, and the fix is permissions, indexing scope and least-privileged testing. Its failure
mode is *someone reached a document they shouldn't have.*

**This track owns disclosure control: what a legitimately-permissioned aggregate reveals about an
individual.** Its failure mode is *nobody's permissions were violated and the individual was
identified anyway.* Different mechanism, different remedy, and the professional obligation for the
second one is yours because you're the person publishing the aggregate.

**Minimum cell size** is the basic instrument, and every listening programme has a number. What
matters is that it is applied to **every published cut**, not to the primary table, which brings us
to the failure everybody misses.

**The differencing attack.** You publish engagement by department: Engineering, n=48, score 3.9. Later
you publish engagement by department and tenure band: Engineering with 5+ years, n=47, score 4.0.
Both cleared your threshold. **Subtract them and you have one person's score**, and depending on the
organization you may also know who they are.

Nobody violated a permission. Both publications were individually compliant. **Disclosure control is
about the set of things you have published, not about each thing you publish** — which means it is a
property of a process rather than of a report, and it requires somebody tracking what has already gone
out.

**And the new failure, in open text.** Thematic analysis of thousands of verbatims is a genuine and
large AI win: say that plainly, because it is one of the few unambiguous ones in this course. The new
failure is specific: **a model asked for themes with supporting quotes returns the quotes intact.** A
verbatim naming a team, a manager, an incident, a disability or a leave identifies its author to
anyone who was there. A human summariser smoothed that away as a side effect of being human; a model
has no such side effect.

So: **paraphrase rather than quote by default**, apply the same threshold to a quote that you apply to
a cell, and understand what is at stake — **an employee who reads their own words in a results deck
learns something about the confidentiality promise that no policy statement will unteach.**

## Lesson 6 · Draw the surveillance line deliberately

The closing move, and the one that has to happen before it happens by default.

**Start with the German position, because it destroys the sentence this function reaches for most
often** `[V]`. Under §87(1) no. 6 BetrVG, a works council holds co-determination (an enforceable
veto, not an opinion) over any technical system **objectively suitable** for monitoring employee
behaviour or performance. **The employer's intent is irrelevant.** Manager dashboards, productivity
scores and AI-driven workforce analytics are named examples.

So *"we're only analysing data we already have"* isn't a legal category. **A dashboard is a technical
device and suitability is assessed objectively**, which means the analytics function's most common
self-description (*purely observational*) has no standing. This is the delta from the People Ops
track: they cover co-determination for systems being deployed; **for you, the analysis output is
itself the monitoring device.**

Then the questions Module 2 raised and deliberately didn't answer, which belong here:

- **Does the individual know the score exists?**
- **Is there a route to contest it?**
- **Would you be comfortable telling them?**

And the design question underneath all three: **where is the line between understanding the
organization and monitoring the people in it?** It is a real line, it isn't obvious, and it will be
drawn either way, by you, deliberately, in advance; or by accumulation, one reasonable-seeming
request at a time, until somebody outside the function draws it for you in a worse place.

**What you can do this quarter without waiting for counsel.** Build the inventory. Classify by risk.
Identify which systems your team built or repurposed. Check what records exist and how far back.
Review features for proxies. Write down the surveillance line as you currently understand it.

**And the list to bring counsel**, so the conversation isn't a shrug: which systems you believe make
you a provider rather than a deployer; where retention obligations exceed what you currently keep;
where a secondary use may exceed its collection purpose; and the analyses you would want run under
privilege before they are run at all.

## Key takeaways

- **Legal cannot do this alone.** The obligations are legal and **the evidence that discharges them is
  statistical** — a combination that exists in one function. That is a stronger claim to the territory
  than any org-chart argument.
- **You'll be asked for evidence you were never asked to keep**, and **you should involve counsel
  before you test, not after**, because privilege is a fact about commissioning.
- **The map, as things you must do** `[V]`: California's four-year retention on records somebody has
  to be creating; Illinois's **strict liability with intent no defence** and the zip-code proxy ban,
  which generalises to any proxy feature; and Colorado, **postponed, enjoined, repealed and replaced
  inside thirteen months**, so **build an inventory that survives the statute, not a checklist keyed
  to one.**
- **Article 25 makes you a provider** `[V]` if you put your name on it, substantially modify it, or
  **change its intended purpose so it becomes high-risk**, which is what pointing a general model at
  an employment question does, without anyone signing anything.
- **Purpose limitation is the quiet violation**, and the engagement survey is the sharpest case:
  survey answers as model features break the promise even where they clear the legal bar, and break it
  unrecoverably.
- **Disclosure control is yours; access control is People Ops'.** The failure mode is *nobody's
  permissions were violated and the individual was identified anyway.* **The differencing attack**
  means disclosure control is a property of everything you have published, not of each publication.
- **A model asked for themes with supporting quotes returns the quotes intact.** Paraphrase by
  default; apply the cell threshold to quotes.
- **"Purely observational" is not a legal category** `[V]`. Suitability for monitoring is assessed
  objectively and intent is irrelevant — **for you, the analysis output is the monitoring device.**

## Take a position

**The claim:** *"Legal can read the statute. They can't tell you whether you have met it — which
makes AI governance an analytics obligation, not a legal one."*

The strongest counter-argument is that **this is a function arguing itself into liability it is not
resourced to carry.** Accountability should sit where authority sits, and a three-person analytics
team reporting into HR Ops has neither the mandate to stop a deployment nor the standing to survive
being wrong about one. Claiming the obligation without the authority produces the worst available
outcome: **you own the failure and someone else owns the decision.** There is also a competence
argument, adverse impact analysis under the Uniform Guidelines is a specialist discipline with
established expert practitioners, and a generalist analytics function doing it in-house because it
owns the data may produce work that is worse than an external assessment while carrying more weight
internally because it is ours. On that view the right move is to be the *commissioner and critic* of
this evidence rather than its author. Your position has to say where accountability without authority
becomes untenable, and what you would need before accepting it.

## Applied activity — "The inventory"

**Time:** 30 minutes · **Submit:** the inventory plus a 300–400 word write-up · **Graded against the
rubric below.** Score doesn't matter. Doing the work is where the learning lands.

**Counsel review before anything here's adopted.** You're producing the practitioner's version; the
lawyer's version comes after, and the point of this artifact is to make that conversation specific.

**Step 1. Find them (10 min).** Every AI system currently touching a decision about a person in your
organization. Go wider than HR's own stack — recruiting tools, screening or assessment vendors,
scheduling and workforce management, performance or engagement platforms with scoring features,
anything in a system you already own that got switched on in a release, and **anything your own team
built or fitted.**

**Expect to find more than you predicted, and expect the list to be incomplete.** Note explicitly what
you couldn't find out and who would know.

**Step 2. Classify (8 min).** For each: what decision it touches, whether it recommends or decides,
who the subject is, whether the subject knows it exists, and a **first-pass risk rating** with your
reason. Risk here's exposure to a person, not technical sophistication.

**Step 3. The three analytics-specific questions (7 min).** Across the inventory:

- **Which of these did we build or repurpose?** Those are the Article 25 candidates, and the honest
  test is whether a regulator asking who is responsible for the design would get "us" as the answer.
- **Where does a secondary use exceed its collection purpose?** Especially anything drawing on survey
  data.
- **What records exist, and how far back?** Against the retention obligations that apply to you.
  Blanks here are the most common finding and are worth more than a confident yes.

**Step 4 — The line (5 min).** One paragraph: **where is the line between understanding the
organization and monitoring the people in it, in your organization, as you would draw it today?** Then
name one thing currently on the wrong side of it, or explain why you believe nothing is.

**Blanks get an owner and a date**, following the convention the People Ops track uses: an unassigned
gap is a note, and an assigned one is a plan.

Then the write-up: how many systems you found against how many you expected, the one that surprised
you, whether anything on the list makes you a provider rather than a deployer, your answer on the
opening claim, your position on the module's claim with its counter-argument addressed, and (the
honest one) **the system you would most prefer nobody asked you about.**

## Knowledge check — 8 questions

*Unlocks after the applied activity is submitted. Retakes are free and unlimited.*

**Q1.** What is the argument for AI governance belonging to analytics rather than Legal?

- A. That analytics teams have better access to the underlying data
- B. That the obligations are legal but the evidence that discharges them is statistical. Legal can state the standard and can't tell you whether you met it ✓
- C. That Legal teams are typically under-resourced for AI work
- D. That analytics owns the vendor relationships for most HR AI tools

> **B.** Defining comparison groups, choosing the selection-rate measure, and deciding which controls
> are legitimate rather than laundering are modelling decisions with fairness consequences. See the
> module's own counter-argument for the serious case against claiming this.

**Q2.** Why does the module treat Colorado as a lesson rather than a date? `[V]`

- A. Because the January 2027 date is likely to move again
- B. Because SB 24-205 was postponed, enjoined, repealed and replaced within thirteen months — so a compliance programme keyed to one statute's requirements would have been rebuilt twice ✓
- C. Because the replacement framework is materially stricter
- D. Because Colorado's law conflicts with federal guidance

> **B.** The date survived and the law behind it did not. **Build an inventory that survives the
> statute rather than a checklist keyed to one.**

**Q3.** What makes Illinois's zip-code provision analytics-specific? `[V]`

- A. That it requires geographic data to be excluded from all models
- B. That it generalises, any geographic, educational or behavioural feature can function as a proxy, and strict liability means intent isn't a defence, so feature-by-feature proxy review is a modelling task ✓
- C. That it applies only to models built in-house
- D. That it requires notice to be given before geographic data is collected

> **B.** A is too strong and misses the mechanism. The prohibition names zip codes; the obligation
> reaches every feature that could do the same work.

**Q4.** Which limb of Article 25 does this audience most often trigger? `[V]`

- A. Putting your name or trademark on a high-risk system already on the market
- B. Making a substantial modification to an existing high-risk system
- C. Changing a system's intended purpose so that it becomes high-risk, pointing a general model at an employment question ✓
- D. Distributing a high-risk system to another organization

> **C.** And it does not feel like a legal act when you do it. Nobody signed anything and nobody
> called it a deployment. **An in-house model is not the safe option; it is the one where nobody else
> is holding the paperwork.**

**Q5.** Why is the engagement survey the sharpest purpose-limitation case?

- A. Because survey data is legally protected in most jurisdictions
- B. Because the promise made to respondents is broken even where the secondary use clears the legal bar — and broken unrecoverably, since the next survey is answered by people who now know ✓
- C. Because survey responses are more identifying than transactional HR data
- D. Because consent for survey participation can't cover model training

> **B.** The legal question and the promise question can come apart, and the promise is the one that
> destroys the instrument.

**Q6.** What distinguishes disclosure control from access control?

- A. Disclosure control applies to external publication, access control to internal
- B. Access control governs who can retrieve what and is fixed with permissions; disclosure control governs what a legitimately-permissioned aggregate reveals and is fixed with thresholds and suppression ✓
- C. Disclosure control is a legal obligation, access control is a security practice
- D. They are the same problem addressed at different layers of the stack

> **B.** Two failure modes: *someone reached a document they should not have* versus **nobody's
> permissions were violated and the individual was identified anyway.** The second is yours.

**Q7.** Why does the differencing attack make disclosure control a process rather than a report property?

- A. Because thresholds must be recalculated for each publication
- B. Because two individually-compliant published cuts can be subtracted to isolate one person, so what matters is the set of everything you have published, not each thing ✓
- C. Because aggregate suppression rules vary by jurisdiction
- D. Because open-text responses can't be suppressed by cell size

> **B.** Which requires somebody tracking what has already gone out: a role most listening programmes
> have not assigned to anyone.

**Q8.** What does "we're only analysing data we already have" establish under German co-determination? `[V]`

- A. That the analysis falls outside §87(1) no. 6, since no new system is deployed
- B. Nothing, co-determination turns on whether a technical system is objectively suitable for monitoring behaviour or performance, and the employer's intent is irrelevant ✓
- C. That consultation is advisory rather than binding for existing data
- D. That the works council's rights attach only once results are shared with managers

> **B.** Manager dashboards, productivity scores and AI-driven workforce analytics are named examples.
> **"Purely observational" is not a legal category, and for you the analysis output is the monitoring
> device.**

## Sources and attribution

- **The Legal-cannot-do-this-alone argument and the inventory artifact** come from a human-authored
  brief for this track.
- **California `[V]`:** FEHA automated-decision-system regulations, effective 1 October 2025;
  employers with 5+ employees; four-year retention of selection criteria, ADS data and applicant-flow
  logs, doubled from two; reach extended to AI tool developers and agents.
- **Illinois `[V]`:** HB 3773, amending the Human Rights Act, effective 1 January 2026. Strict
  liability for discriminatory effect; notice obligations; zip codes as proxies expressly prohibited;
  implementing rules in progress at the Department of Human Rights.
- **Colorado `[V]`:** SB 24-205 postponed to 30 June 2026; enforcement blocked by a federal magistrate
  27 April 2026; repealed and replaced by SB 26-189, signed 14 May 2026 — a disclosure-and-rights
  framework effective 1 January 2027.
- **EU AI Act `[V]`:** Article 25 (responsibilities along the value chain: name/trademark,
  substantial modification, change of intended purpose). Article 26(7) works council obligations and
  the Annex III deferral are carried in full by the People Ops track and cross-referenced here.
- **Germany `[V]`:** BetrVG §87(1) no. 6, enforceable co-determination over technical systems
  **objectively suitable** for monitoring behaviour or performance, intent irrelevant; manager
  dashboards and workforce analytics named as examples.
- The disclosure-control/access-control split is a cross-track convention agreed with the People Ops
  track and stated in both. The differencing-attack framing and the verbatim-quote failure are
  original to this course.
- Builds on comp M4 (privilege, and "explained variance is a modelling decision"), recruiter R6
  (adverse impact in a selection context), HRBP M6 (state employment law), 101 M8 (the reader's-stake
  test), and Module 2 (the questions this module answers).
- **This module is not legal advice, and its surface is volatile.** Counsel review is required before
  your organization adopts anything built from it.
