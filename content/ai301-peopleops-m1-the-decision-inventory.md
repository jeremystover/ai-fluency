# AI 301 · People Ops & HR Technology · Module 1 — The decision inventory

**Course:** AI 301 · The Specialist — People Ops & HR Technology track · Module 1 of 8
**Estimated time:** 35 min content · 10 min exercise · 30 min applied activity
**Prerequisite:** AI 101 and AI 201 · extends 201 M1 (the workflow audit) and 201 M4 (the
verification budget)
**Position in the track:** the prerequisite nobody teaches — every later module indexes what you
build here

> `Concepts reviewed: [DATE] · Examples current as of: [DATE]`
> Lessons 2, 3 and 5 are **volatile layer** — adoption figures, survey samples, and statutory
> deadlines. The register, the six columns, and the two axes are stable.

---

## Calibration prompt — the claim to contest

*Commit before you read anything. Thirty seconds.*

**The claim:** *"Most of what your team calls work is deferred decisions — and most of what your
function calls its AI strategy is a description of what your vendors shipped."*

Two things to commit, and the second one is a number you will check against reality inside this
module.

**Is that true of your organization?** Answer *true of us* or *not true of us*, and give the one
sentence you would defend it with.

**And: how many AI capabilities are live in your stack right now?** Every feature, in every system,
that generates text, ranks something, recommends something, answers someone, or scores anything.
Your honest count, before you go looking.

Most people are wrong about the second number in the same direction. That direction is the module.

---

## Module brief

This module exists because of a mistake almost every People Ops function makes at the start, and
the mistake is not about AI at all. It is about what you inventory.

The instinct is to audit **tasks** — list what your team does, find the repetitive parts, and point
AI at those. That instinct is correct and 201 M1 taught you how to act on it, because when you are
building a workflow you own, frequency and structure are exactly the right filters.

This role has a different problem. **The things in your stack that carry risk are not tasks, they
are decisions** — eligibility rules, routing logic, approval thresholds, what the form lets someone
pick, which exception path exists and which does not. Each one was decided once, encoded, and then
ran for years without anyone revisiting it. A task audit does not see them, because from the
outside a decision that has been encoded looks exactly like a process step.

And that matters for one specific, practical reason: **you cannot enable AI on a decision nobody
owns, because there is nobody to sign the enablement.** Every module after this one asks you to
produce something a named person stands behind — an evaluation, a measurement plan, a
decision-rights map with a signature line. All of it fails at the first step if you cannot say who
decides.

So the module does two things. It replaces the task audit with a **decision register**, which is
the artifact the rest of the track runs on. And it makes you find out **what is already switched
on**, which is usually more than you think and almost never something your function chose.

## Learning objectives

By the end of this module you should be able to:

1. Distinguish a task from a deferred decision, and explain why the second is what carries risk in
   a systems role.
2. Describe where AI adoption actually sits in HR relative to your function `[V]`, and why "we
   haven't adopted AI yet" is usually false here.
3. Name the three ways AI arrives in an HR stack and identify which one has no gate.
4. Build a decision register with six columns, including honest blanks.
5. Sort systems work by reach and detection latency, and explain why **reversibility rather than
   accuracy** is the gate on automating it.

## Lesson 1 · Decisions, not tasks

Start with the distinction, because everything else in the track is built on it.

**A task audit produces a list of things to automate. A decision audit produces a list of things
somebody has to be able to defend.** Those are different lists, they overlap less than you would
expect, and only the second one survives contact with an auditor, a works council, a regulator, or
a plaintiff's lawyer.

Here is the shape of the thing you are looking for. Somebody decided, at some point, that leave
requests over ten days route to a second approver. There was probably a reason. It runs four
hundred times a year. Nobody currently working in your function knows who decided it or why, and
the rule is now indistinguishable from a fact about the system. **That is a decision wearing a
process step's clothes**, and your stack is full of them.

Three more, so the pattern is unmistakable:

- **The eligibility rule.** Who counts as benefits-eligible at what hours threshold, and what
  happens to someone who crosses it mid-month. Encoded in the HCM. Consequential. Unowned.
- **The picklist.** What the termination-reason field lets a manager choose. Every downstream
  analysis of why people leave is constrained by a list somebody wrote in an implementation
  workshop, and "Other" is doing more work than anyone admits.
- **The threshold nobody sees.** The tolerance at which a payroll variance triggers a hold versus
  passing through. Somebody picked that number.

The diagnostic question is short and it is uncomfortable: **can you name the person who would
defend this if it were challenged?** Not the team. The person. If you cannot, it is a deferred
decision — a decision that was made, then abandoned, and is still executing.

Two things follow. First, **the number of these is the real measure of your function's exposure**,
and it is much larger than the number of things your team would describe as decisions. Second, this
is why the register comes before any AI question. A capability enabled on top of an unowned
decision does not create the accountability gap. **It inherits one that was already there and makes
it move faster.**

## Lesson 2 · Where this function actually sits **[V]**

Now the diagnosis, and it is the opposite of the one this market sells you.

SHRM's *State of AI in HR 2026* mapped 138 AI use cases across 16 HR practice areas, from a survey
of 1,722 HR professionals fielded in December 2025. Where AI has actually landed, by practice area:
**recruiting at 27%, HR technology management at around 21%**, learning and development at 17%,
employee experience at 14%. Least adopted: inclusion and diversity, C-suite and board relations,
and ESG and compliance, each at 2% or less.

Your function is second. Only recruiting is ahead of you.

Now hold that against the other half of the same research: **54% of organizations have implemented
no AI in HR at all and have no plans to in 2026**, while **92% of CHROs expect greater AI
integration in the workforce** and 87% forecast more of it inside HR processes.

Put those together and the picture is specific. **You are the front line of a function that mostly
has not started.** More than half of organizations have deployed nothing; where anything has been
deployed, it is disproportionately in your territory; and the executives above you are near
unanimous that there will be more.

This is worth sitting with for a moment, because the entire market for AI content aimed at HR is
built on the assumption that its reader is behind. That assumption is wrong about you specifically.
The anxiety-driven purchase — buy something quickly because peers are ahead — is a bad move for
anyone and it is an especially bad move for the person who will have to operate, integrate,
support, and eventually defend whatever gets bought.

**Your problem is not that too little has happened. It is that a lot has happened and you cannot
currently account for it.** Nobody sells a product for that, which is why you are reading a course
about it instead.

## Lesson 3 · The three doors, and only one has a gate **[V]**

AI arrives in an HR stack through exactly three doors. They are wildly different in volume, and
your governance almost certainly watches the wrong one.

**Door one — a feature in a system you already own.** Your HCM ships a quarterly release. In it are
new AI capabilities: a summarizer in the case tool, ranking in the internal-mobility module, a
drafting assistant in the letter templates, an agent that answers policy questions. You did not
procure them. There was no evaluation, no security review, no decision. Some arrive switched on.
**This is by far the largest door and it has no gate at all.**

**Door two — a new product.** An RFP, demos, security review, a data processing agreement,
procurement, signature. Slow, documented, contested. **This is the only door with a gate, and it is
where essentially all of your organization's governance attention sits.**

**Door three — employees using their own tools.** Someone in your team pastes a policy question, a
draft letter, or a spreadsheet of employee records into a consumer chatbot because it is faster. No
gate, no visibility, no record.

The evidence that door one is real rather than a worry comes from the largest instrument in this
field. Sapient Insights Group's *28th Annual HR Systems Survey* for 2025–2026 draws on **9,886 HR
professionals representing 4,670 organizations** and references 1,539 technology solutions. It
finds 31% of organizations using some kind of AI-enabled technology — ChatGPT at 58% of those,
AI-supported meeting tools at 11%, **HR applications with embedded AI at 9%.** And the finding that
should stop you: **nearly one-third of organizations do not know whether AI features exist in their
current HR systems.**

Read that against Lesson 2 and notice they do not contradict each other. SHRM asked where AI is
being used across HR practice areas and found your function second. Sapient asked organizations
about their own systems estate and found a third cannot say what is in it. Different questions,
both sound, and **the space between them is door one** — capability that is present, counted by
somebody, and unaccounted for by the people who own the systems.

Which makes release notes a professional practice rather than an inbox chore. Concretely, four
questions per item, and it takes about an hour a quarter:

1. **Is this a new capability or a change to an existing one?**
2. **Does it arrive on or off?** Default-on is the one that matters, and vendors vary.
3. **What population does it reach, and can that be scoped?**
4. **What data does it touch, and does anything leave the system?**

You are not evaluating at this stage. You are producing a list of things that need evaluating,
which is a different and much cheaper act — and it is the only way door one ever acquires a gate.

> ### Try this — 3 minutes
> Open the most recent release notes for your primary HCM. Count the items that mention AI, a
> summary, a recommendation, a score, or an assistant. Then count how many of those you could say
> were reviewed by anyone before they shipped to your population. The second number is usually
> zero, and the gap between the two is what this module is asking you to write down.

## Lesson 4 · The register's six columns

The artifact. One row per recurring decision, six columns, and each column exists because something
later in the track needs it.

**Volume.** How often does this decision get made? Annually, monthly, four hundred times a year,
continuously. This is the only column a task audit would also have captured, and it is the least
important of the six.

**Reach.** How many people does one wrong instance touch? One person, a team, a population, the
whole company. Not how many people the decision applies to overall — how many are affected by a
single failure.

**Detection latency.** How long before anyone notices a wrong instance? The honest options are
narrower than they look: immediately, at the next payroll run, at the annual audit, at the
compliance filing, in litigation, or **never**. "Never" is a real and common answer and writing it
down is the point.

**Reversibility.** If this went wrong, what would undoing it take? A field edit, a corrected file
to a carrier, a retro payroll run, a disclosure, or a project. Note that this is a question about
*effort and blast radius*, not about whether the system has an undo button. Most of them do, and it
does not help.

**Current accountability — by name.** Who would defend this decision if it were challenged?
A person, not a team. **A team cannot sign anything**, and Module 7 ends in a signature. If the
honest answer is nobody, write nobody; that entry is more useful than a plausible team name.

**Defensibility.** Could that person actually defend it — do they know why the rule is what it is,
and is the reasoning available anywhere but in their memory? A decision with a named owner who
cannot reconstruct the rationale is a different risk from one with no owner, and it is treated
differently later.

Two rules for filling it in. **Blanks are entries, not failures** — a register with honest gaps is
the finding this module is looking for, and a register with no gaps is almost always a register
somebody guessed at. And **stop at twelve decisions.** Twelve rows with real latency values beat
forty with plausible ones, and you can extend it later. The register is a working document, not a
compliance deliverable.

## Lesson 5 · Reach, latency, and the gate that isn't accuracy **[V]**

Two of those six columns do more work than the others, and together they produce the map this whole
track navigates by.

Plot your decisions on **reach** and **detection latency**. Four quadrants:

- **Narrow reach, short latency.** One person, noticed immediately. A wrong answer to one
  employee's PTO question. Annoying, self-correcting, and where most AI attention goes.
- **Narrow reach, long latency.** One person, discovered much later. A misfiled I-9, an
  accommodation request that never got logged. Small blast radius, and it may surface in the worst
  possible forum.
- **Wide reach, short latency.** Everyone, noticed fast. A broken integration that stops payroll.
  Genuinely bad, and it gets fixed, because it announces itself.
- **Wide reach, long latency.** Everyone, and nobody notices for a month. A bulk effective-dated
  change with the wrong date. A benefits eligibility rule quietly wrong for one population. An
  agent that has been giving a wrong leave answer since April.

That last quadrant is where the damage lives. And here is the part worth writing on a wall:
**it is also exactly where AI is being sold to you.** Bulk data operations, automated transaction
processing, multi-step agentic workflows, mass employee communications — the pitch and the danger
occupy the same square. Not because vendors are careless, but because that square is where the
labour savings are, and the labour savings and the blast radius have the same cause.

**Which changes how you size verification.** 201 M4 taught you to size the verification budget to
*stakes*, and that is right for most work. For systems work, the variable that actually determines
what an error costs is **latency**, because the cost compounds with every run before anyone
notices. A 2% error rate detected immediately is a nuisance. The same 2% error rate detected at the
annual audit has run for a year across every transaction. Same budget, different denominator.

**And the gate on automating something is reversibility, not accuracy.** This is the most useful
single sentence in the module. Teams evaluate a capability by asking how often it is right. The
better question is what happens the day it is wrong, because accuracy is a property you can measure
after the fact and reversibility is a property you have to design for beforehand. An effective-dated
bulk change that has already propagated to payroll, the benefits carriers, and the identity
provider is not an undo. **It is a correction project with a blast radius of its own** — and the
correction will itself be a bulk change, made under time pressure, by someone who is embarrassed.

Nowhere is this sharper than the decisions with a statutory clock underneath them `[V]`. A sample,
current as of this writing and worth verifying against your own counsel:

- **Form I-9.** The employee completes Section 1 no later than their first day of employment; the
  employer completes Section 2 **within three business days of the hire date.**
- **COBRA.** Where the employer is also the plan administrator, the election notice is generally
  due **within 44 days** of the qualifying event; where the employer notifies a separate
  administrator, that administrator has **14 days** from receiving notice. The qualified beneficiary
  gets at least a **60-day** election window and at least **45 days** after electing to make the
  first premium payment.
- **ACA reporting.** Forms 1095-C are furnished to employees by **2 March 2026**, or within 30 days
  of an employee's request.
- **Final pay.** Deadlines differ by state, and in some states final wages fall due on the
  termination date itself.

Every one of those is wide-reach or long-latency or both, and every one of them is a deadline rather
than a judgment — which makes them look like ideal automation candidates. They are, with one
condition:

> **AI can prepare and remind. It cannot be the control.**

Preparation is drafting the notice, assembling the file, flagging the approaching date, checking the
list for gaps. The control is the thing that guarantees the step happened, and a control has to
produce evidence. So if you do automate one, the audit question arrives immediately and it is not
about accuracy: **where is the record that it ran, and who looked at it?** A reminder nobody
acknowledged is not a control. It is a log entry that will be read out loud to you later.

## Key takeaways

- **A task audit lists things to automate; a decision audit lists things somebody has to defend.**
  Only the second survives an auditor, a works council, or a lawyer. Most of your risk sits in
  decisions that were made once, encoded, and abandoned while still executing.
- **The diagnostic question is "can you name the person who would defend this?"** Not the team. If
  you cannot, it is a deferred decision — and AI enabled on top of one inherits an accountability
  gap rather than creating it.
- **You are not behind** `[V]`. HR technology management is the second-highest AI adoption area in
  HR at ~21%, behind recruiting's 27% — inside a function where 54% of organizations have deployed
  nothing and have no plans this year, and 92% of CHROs expect more anyway.
- **Three doors, one gate.** A feature in a system you already own (biggest, no gate), a new product
  (procurement, gated), employees using their own tools (invisible). All the governance attention is
  on the middle one. Nearly a third of organizations cannot say whether their current HR systems
  contain AI features `[V]`.
- **Six columns:** volume, reach, detection latency, reversibility, accountability *by name*,
  defensibility. Blanks are entries. Twelve real rows beat forty guessed ones.
- **Wide reach plus long latency is where the damage lives — and it is exactly where AI is sold**,
  because the labour savings and the blast radius have the same cause.
- **Size verification to latency, not just stakes.** Error cost compounds with every run before
  detection, so the same error rate costs wildly different amounts depending on when it surfaces.
- **Reversibility is the gate, not accuracy.** Accuracy you measure afterwards; reversibility you
  design beforehand. And for anything with a statutory clock: **AI can prepare and remind, it cannot
  be the control** — a control has to produce evidence that it ran.

## Take a position

**The claim:** *"Your organization's AI adoption number is mostly a description of what your vendors
shipped, not what your function chose."*

The strongest counter-argument is not that the claim is false. It is that **it is true of all
enterprise technology and has never been a problem before.** You did not evaluate your payroll
engine's tax-table updates, your HCM's quarterly UI changes, or the TLS version your integrations
negotiate. You consume platform improvements without individually approving them, and that is
precisely the value of buying rather than building — the vendor's engineering becomes yours for
free. On that view, demanding an evaluation for every AI item in a release note is not governance,
it is a full-time job producing paperwork nobody will read, and it will lose to the business every
time because it should.

The honest version of the concern is therefore much narrower: **only capabilities that make or
shape a decision about a person need a gate**, and most release-note items do not. A better
summarizer in a case tool is a tax-table update. An agent that recommends who gets an exception is
not.

Your position has to say where that line falls and who is competent to draw it — because if the
answer is "it depends, case by case, and I'll know it when I see it," you have not built a gate.
You have described yourself as one, and you do not scale.

## Applied activity — "The register"

**Time:** 30 minutes · **Submit:** the register, the live-AI inventory, and a 300–400 word write-up
· **Graded against the rubric below.** Score doesn't matter. Doing the work is where the learning
lands.

This is the artifact the whole track runs on. Every later module edits it.

**Step 1 — The decisions (10 min).** List the recurring decisions your function actually makes.
Aim for **eight to twelve** — not forty. Look in the places Lesson 1 pointed at: eligibility rules,
routing and approval logic, thresholds, picklist definitions, exception paths, and anything a
system does automatically that somebody once chose. If a row feels like a task rather than a
decision, ask what was decided in order for the task to have its current shape.

**Step 2 — The six columns (10 min).** For each row: volume, reach, detection latency,
reversibility, accountability **by name**, and defensibility. **Write "don't know" and "nobody"
where they are true** — those entries are the most valuable output of this exercise and they are
what Module 7 will need. Do not resolve a blank by naming a team.

**Step 3 — What's already on (8 min).** Separately, inventory the AI capabilities live in your
stack right now — every feature that generates text, ranks, recommends, answers, or scores. For
each: **who decided, when, and on what evidence.** Include features that arrived switched on inside
systems you already had. If your primary system's release notes are accessible, read the last two
quarters before you finish this step.

**Step 4 — Pick one (2 min).** Choose the single decision from your register that this track will
run on for the next seven modules. Pick one that is live, that you can actually observe, and where
an AI capability is either already involved or about to be. Say why you chose it.

**Step 5 — Score the prediction.** Your predicted count of live AI capabilities against what you
found. Direction and size of the miss, and one sentence on what it tells you.

Then the write-up: your position on the claim above with its counter-argument addressed
specifically; whether the opening claim turned out to be true of your organization and what
evidence settled it; and the honest one — **how many of your register's accountability cells are
empty, and what you plan to do about the first one.** A specific first row beats a general
intention to improve governance.

## Knowledge check — 8 questions

*Unlocks after the applied activity is submitted. Retakes are free and unlimited.*

**Q1.** Why does this module replace the task audit with a decision register?

- A. Because tasks are harder to inventory accurately than decisions
- B. Because the things carrying risk in a systems role are decisions that were made once, encoded, and abandoned while still executing — and a task audit cannot see them, since an encoded decision looks like a process step ✓
- C. Because 201's task audit was superseded by better practice
- D. Because decisions are more frequent than tasks in People Operations work

> **B.** 201 M1's task audit is right for building a workflow you own. This is a different question,
> and the practical consequence is that you cannot enable AI on a decision nobody owns, because
> there is nobody to sign the enablement.

**Q2.** What is the module's diagnostic question for identifying a deferred decision?

- A. How often does this decision get made?
- B. Is this decision documented anywhere?
- C. Can you name the person — not the team — who would defend it if challenged? ✓
- D. Was this decision reviewed in the last twelve months?

> **C.** A team cannot sign anything, and Module 7 ends in a signature. "Nobody" is a valid and
> highly informative answer. D is a reasonable hygiene question and not the diagnostic.

**Q3.** Where does HR technology management sit in AI adoption across HR practice areas? `[V]`

- A. Roughly mid-pack, behind recruiting, L&D and employee experience
- B. Second at around 21%, behind recruiting's 27% — inside a function where 54% of organizations have deployed no AI in HR at all and have no plans this year ✓
- C. Lowest, alongside compliance and board relations
- D. Highest, ahead of recruiting

> **B.** From SHRM's 2026 mapping of 138 use cases across 16 practice areas, n=1,722. The pairing is
> the point: you are the front line of a function that mostly has not started, which makes
> "we haven't adopted AI yet" usually false in your stack specifically.

**Q4.** Which of the three doors AI arrives through has no gate — and is the largest?

- A. Employees using their own consumer tools
- B. New product procurement
- C. A feature arriving in a system you already own, via a release note ✓
- D. Pilot programs run by other functions

> **C.** Procurement is the only gated door and it receives essentially all governance attention.
> A is real and invisible but smaller. Nearly a third of organizations cannot say whether their
> current HR systems contain AI features, which is door one's signature.

**Q5.** Why does the register require accountability by named person rather than by team?

- A. Because individuals are more reliable than teams
- B. Because a team cannot sign anything, and the track's final artifact is a decision-rights map with a signature line ✓
- C. Because regulators require named individuals for all HR decisions
- D. Because team ownership is usually inaccurate in HR functions

> **B.** And resolving an honest blank by writing a plausible team name destroys the entry's value.
> C overstates the legal position; the reason is that a signature needs a signatory.

**Q6.** What makes the wide-reach, long-latency quadrant the dangerous one?

- A. Errors there are more frequent than in other quadrants
- B. Nothing announces the failure, so the error runs across every transaction until an audit or a filing surfaces it — and this is precisely the quadrant AI is sold into, because the labour savings and the blast radius have the same cause ✓
- C. Those decisions are usually the highest-stakes ones
- D. Regulators focus enforcement there

> **B.** Wide-reach short-latency failures are bad and they get fixed, because they announce
> themselves. C confuses stakes with the axes; the module's argument is that stakes are the wrong
> variable here.

**Q7.** How does the module modify 201 M4's verification budget for systems work?

- A. Verification should be doubled for any automated process
- B. Size it to detection latency rather than only to stakes, because error cost compounds with every run before anyone notices ✓
- C. Verification should be sized to the number of people affected
- D. Systems work needs no verification budget because logs provide an audit trail

> **B.** The same error rate costs wildly different amounts depending on when it surfaces — a
> nuisance if caught immediately, a year of transactions if caught at the annual audit. Same
> budget, different denominator.

**Q8.** What does "AI can prepare and remind, but it cannot be the control" require in practice?

- A. That a human performs every step of any process with a statutory deadline
- B. That AI is never used for compliance-related work
- C. That an automated control produce evidence it ran which somebody actually looked at — a reminder nobody acknowledged is a log entry, not a control ✓
- D. That controls be tested annually by internal audit

> **C.** Preparation is drafting, assembling, and flagging. The control is what guarantees the step
> happened, and guarantees need evidence. A prohibits far more than the rule requires.

## Sources and attribution

- **SHRM, *The State of AI in HR 2026*** — the practice-area adoption split (recruiting 27%, HR
  technology management ~21%, L&D 17%, employee experience 14%), the 138 use cases across 16
  practice areas, the 54% with no AI in HR and no plans for 2026, and the 92% of CHROs expecting
  greater integration. Survey of 1,722 HR professionals, fielded 5–23 December 2025. Phrasing
  aligned with `ai301-hrbp-m2`, which uses the same source, so the two do not drift. **[V]**
- **Sapient Insights Group, *28th Annual HR Systems Survey Report* (2025–2026)** — 31% of
  organizations using some AI-enabled technology (ChatGPT 58%, AI-supported meeting tools 11%, HR
  applications with embedded AI 9%), and the finding that nearly one-third of organizations do not
  know whether AI features exist in their current HR systems. Based on 9,886 HR professionals
  representing 4,670 organizations and referencing 1,539 technology solutions. **[V]**
- **Statutory deadlines** — Form I-9 Section 1 by the first day of employment and Section 2 within
  three business days of the hire date (USCIS / E-Verify); COBRA election notice at 44 days where
  the employer is the plan administrator or 14 days after a separate administrator is notified,
  with a 60-day election window and 45 days for the initial premium (US Department of Labor);
  ACA Form 1095-C furnished by 2 March 2026. Final-pay timing differs by state. **Deadlines move and
  state rules vary — verify against counsel before relying on any of these. [V]**
- The decision register and its six columns, the three-doors framing, the reach × latency map, the
  latency-not-stakes extension of 201 M4, and the reversibility gate are original to this course.
- Builds on 201 M1 (the workflow audit, which this deliberately replaces for this role) and 201 M4
  (the verification budget, extended here).
- **A note on what is not here.** We looked for a credible measurement of HR data quality to use in
  this track and could not find one with a disclosed sample. Module 5 says so out loud, because the
  absence turns out to be the argument.
