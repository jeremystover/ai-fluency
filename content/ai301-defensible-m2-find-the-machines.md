# AI 301 · Defensible by Design · Module 2 — Find the machines

**Course:** AI 301 · The Specialist — Defensible by Design · Module 2 of 5
**Estimated time:** 30 min content · 10 min exercise · 25 min applied activity
**Prerequisite:** Module 1 — the exposure map tells you which of these obligations bind you
**Position in the track:** you cannot test, procure or defend a system you have not found

> `Concepts reviewed: [DATE] · Examples current as of: [DATE]`
> Lesson 4 is **[V]** volatile layer. The inventory method is stable.

---

## ⚖️ Counsel review required

**Lesson 4 describes a statutory provision that takes effect on 1 October 2026, with its principal
compliance obligations following a year later.** Effective dates, definitions and scope are exactly
the things that move.

Before this module ships in any deployment, Lesson 4 needs a read by counsel qualified in that
deployment's jurisdictions. Before you rely on it, so does your own position. Nothing here is legal
advice.

## Calibration prompt — before you start

*One claim. Commit before you read anything.*

Here is a factual assertion about your own organization:

> **"We have a list of every system that touches an employment decision here, and it is current."**

**True of us, or not true of us?** Commit to one, in a sentence.

Then predict one number: **how many distinct systems in your organization touch an employment
decision** — sourcing, screening, scheduling, assessment, performance, promotion, flight risk,
scheduling algorithms, selection for reduction? You'll count them in the activity.

Most people predict between three and six. Most inventories come back longer, and the difference is
almost entirely Lesson 2.

---

## Module brief

Everything in this track after this module assumes you know what you have. Testing assumes it.
Procurement assumes it. Defending a decision assumes it. And in almost every organization, the
assumption is wrong in the same direction.

The reason is not carelessness. It is that the question "what AI do we use in employment decisions"
gets answered by listing the things somebody *bought*, and a large and growing share of what
actually touches employment decisions was never bought at all. It arrived inside something you
already owned, as a feature, switched on by someone reasonable who did not think of it as
deploying an automated employment decision tool — because from where they sat, it wasn't. It was a
checkbox marked *enable smart ranking.*

This module is about finding those, and then about the harder question underneath: whether the human
review your organization believes it has is real.

## Learning objectives

By the end of this module you should be able to:

1. Map the decision points in your employment lifecycle where a system could touch an outcome.
2. Find the shadow stack — AI capability inside tools that were never procured as AI.
3. Apply the four-question test to any claimed human review.
4. State what Connecticut's AEDT framework does to the "a human reviewed it" defence, and what it
   does for a testing programme.

## Lesson 1 · Decision points, not systems

Start from the decisions rather than the software, because a system inventory built from a software
inventory inherits the software inventory's blind spots.

Walk the employment lifecycle and mark every point where an outcome is determined, narrowed, ordered
or scored:

**Sourcing** — who sees the posting at all. This one is skipped constantly, and it is the earliest
and most consequential filter in the funnel: a targeting model that shows a role to some populations
more than others has shaped the applicant pool before anyone applied.

**Screening and ranking** — who advances, in what order, and who is filtered before human contact.

**Assessment** — scores, simulations, video, game-based tools, skills inference.

**Scheduling and interview logistics** — usually benign, occasionally not, when availability
requirements act as a proxy for caregiving status or disability.

**Performance** — ratings, calibration support, review-language analysis, productivity metrics.

**Promotion and succession** — readiness scores, potential ratings, slate generation.

**Retention and flight risk** — attrition prediction, and what anyone does with it.

**Selection for reduction** — the highest-stakes decision point in the organization, and the one
most likely to involve a hastily assembled scoring spreadsheet nobody calls a system.

That last one deserves emphasis. **A weighted scoring model built in a spreadsheet by a manager over
a weekend is an automated employment decision tool in every way that matters** — it ranks people
against criteria, it determines outcomes, and it will be produced in discovery. It has no vendor, no
contract, no procurement record and no place on anybody's system list, which is exactly why it needs
to be on yours.

## Lesson 2 · The shadow stack

Now the finding this module exists for.

Ask any organization for its AI system inventory and you get the procurement list: the ATS, the
assessment vendor, maybe an HRIS module. That list is real and incomplete, because **the fastest-
growing category of AI touching employment decisions is capability delivered inside products that
were purchased before the capability existed.**

Your applicant tracking system shipped a match score in a release note. Your HRIS added flight-risk
indicators. Your collaboration suite added skills inference and now suggests internal candidates.
Your assessment vendor changed its underlying model and told you in a product update. Your job
advertising platform optimizes delivery in ways nobody in HR can describe.

Four properties make this category dangerous, and they compound:

**No procurement event.** Nothing triggered review, because nothing was bought. The capability
arrived in a version number.

**No owner who thinks of it as AI.** The person who enabled it was configuring a tool, and by any
ordinary description of their job, that is what they were doing.

**No documentation on your side.** You have a contract for the platform, not a specification of the
model, and often no record of when the feature was turned on.

**And it is frequently on by default.** Which means the deployment decision may have been made by a
vendor's product team rather than by anyone in your organization.

Five questions that find these. They work because they route around the word "AI," which is the word
that makes people say no:

1. **Where does anything produce a score, a ranking, a match percentage, a fit indicator or a
   sorted list?** Sorting is the tell. Alphabetical is a sort; *recommended* is a model.
2. **What has a release note in the last two years mentioning smart, intelligent, automated,
   predictive, recommended or assisted?**
3. **Which settings screens have something enabled that nobody remembers enabling?**
4. **What do recruiters and managers actually look at first?** People rely on whatever the interface
   puts at the top, whether or not anyone described it as a decision aid.
5. **What did someone build themselves?** Spreadsheets, scripts, a saved prompt a team uses for
   screening summaries. No vendor, no contract, real influence on outcomes.

> ### Try this — 3 minutes
> Open your ATS candidate list as a recruiter sees it. Is there a default sort? Is it chronological?
> If it isn't — if it's by match, fit, score, or *recommended* — you have just found a system that
> shapes who gets looked at first, and it is very likely not on your inventory.

## Lesson 3 · The four-question test

Now the harder half, because most organizations that find their systems then reassure themselves
about them incorrectly.

AI 101 taught that "a human reviewed it" is not automatically a defence when the human reviewed a
ranked list. This lesson is the operational version of that claim: a test you can apply to any
review layer and get a real answer from.

For a given system, ask whether the reviewer has:

**Information.** Can they see what the system did and why — the inputs, the weighting, the reason
this candidate ranked above that one? A reviewer looking at a ranked list without the ranking
rationale is not reviewing the decision; they are ratifying an ordering whose basis is invisible to
them.

**Time.** How many items, in how many minutes? Four hundred applications reviewed in ninety minutes
is fourteen seconds each, which is enough to confirm an ordering and not enough to challenge one.
This is the question that most often produces an uncomfortable silence, and it is arithmetic rather
than opinion.

**Authority.** Can they overrule it, in the system, without seeking permission? If overriding
requires an exception request, an approval, or an explanation to someone senior, then the default
carries institutional weight and the review is a formality with extra steps.

**Incentive.** What happens to them if they overrule it and are wrong? If a reviewer who follows the
system and gets a bad outcome is fine, and a reviewer who overrides it and gets a bad outcome is
answerable, you have built a system that punishes exactly the behaviour you are claiming as your
safeguard.

**Most review layers fail at least two of these, and the second and fourth are the usual pair.**

The point of the test is not to conclude that human review is worthless. It is that **human review
is a claim about a system that can be checked** — and if you are going to rely on it as a defence, a
control, or a line in a policy, you should check it before somebody else does. The failures are also
mostly fixable: time can be budgeted, authority can be granted, rationale can be surfaced,
incentives can be stated. What cannot be fixed is a review layer nobody ever examined.

## Lesson 4 · What the law now says about that defence **[V]**

Connecticut has legislated on exactly this point, and it is the most useful statutory text in this
track.

Its AI framework amends the state's Fair Employment Practices Act so that **the use of an automated
employment-related decision technology is not a defence to a complaint alleging a discriminatory
employment practice.** The statutory framework — definitions, enforcement structure, trade-secret
limits, and that non-defence amendment — takes effect **1 October 2026**, with the principal
compliance obligations, including interaction disclosures and pre-decision written notices, applying
from **1 October 2027**. Notice failures are treated as an unfair or deceptive trade practice,
enforceable exclusively by the Attorney General.

Read the non-defence provision first and it sounds purely punitive: you cannot hide behind the tool.

**But there is a second half, and it is the reason this track exists.** Evidence of anti-bias testing
and proactive compliance efforts **may be considered** in defence of such claims — and the framework
identifies what will be weighed: **the quality, efficacy, recency and scope of any testing; the
results obtained; and the employer's response to those results.**

That is not a general encouragement to be careful. It is close to a specification.

- **Quality and efficacy** — was the testing methodologically sound, or performative?
- **Recency** — when did you last run it? A rigorous test from three years ago is a document about a
  system that has since changed.
- **Scope** — which systems and which populations? Testing your ATS and not the sourcing tool is a
  scope answer somebody will ask about.
- **Results obtained** — you have to have looked at them.
- **And your response to those results** — the one that matters most, and the one an organization
  can most easily fail. **Testing that found a disparity and produced no action is worse than not
  testing**, because you have documented knowledge and inaction in the same file.

Set that beside California, which since 1 October 2025 has made anti-bias testing *or its absence*
relevant to a discrimination claim, and the direction is unmistakable:

> **Your testing programme is evidence, in both directions — and one legislature has now published
> the rubric it will be graded against.**

Which is what Module 3 builds.

## Key takeaways

- **Map decision points, not systems.** A system inventory built from a software inventory inherits
  its blind spots — and sourcing (who sees the posting) and selection for reduction are the two most
  commonly missed.
- **A weighted scoring spreadsheet built over a weekend is an automated employment decision tool.**
  No vendor, no contract, no procurement record, and it will be produced in discovery.
- **The shadow stack is the fastest-growing category:** AI arriving as a feature inside products
  bought before the capability existed. No procurement event, no owner who thinks of it as AI, no
  documentation on your side, and frequently on by default — so the deployment decision may have
  been made by a vendor's product team.
- **Five questions find them**, and they work by routing around the word "AI": where is anything
  scored or sorted; what release notes said smart or predictive; what's enabled that nobody
  remembers enabling; what do users actually look at first; and what did someone build themselves.
- **The four-question test on any claimed human review:** does the reviewer have the **information**
  (can they see why), the **time** (fourteen seconds each is ratification), the **authority** (can
  they overrule without an exception request), and the **incentive** (are they safer following it
  than overriding it)? Most review layers fail at least two.
- **Connecticut makes the tool not a defence** from 1 October 2026 `[V]` — **and makes your testing
  a mitigating factor**, weighed on quality, efficacy, recency, scope, results, and your response to
  them. **Testing that found a disparity and produced no action is worse than not testing.**

## Take a position

**The claim:** *"You do not have an inventory. You have a list of the tools somebody remembered to
buy."*

The strongest counter-argument is that **a complete inventory is unachievable, and pursuing one
produces worse outcomes than accepting an incomplete one.** Feature-level AI changes with every
release across dozens of platforms; by the time you have catalogued it, three vendors have shipped
updates. An organization that chases completeness spends its governance capacity on discovery rather
than on controlling the four or five systems that actually determine most outcomes — and a
half-finished exhaustive inventory is worse evidence than a well-maintained partial one, because it
demonstrates that you knew to look and stopped.

There is a sharper version. **The inventory is discoverable.** A thorough document listing every
system that touches an employment decision, including the ones nobody had noticed, is a roadmap for
opposing counsel — assembled at your own expense, on your own initiative. The prudent version of
this module's advice might be to find the machines and write down very little.

Take a position on that, in writing, in the activity. The strongest submissions engage the
discoverability version, because Module 3 answers it with a mechanism and you should decide whether
that mechanism satisfies you.

## Applied activity — "The AEDT inventory"

**Time:** 25 minutes · **Submit:** the inventory plus a 250–350 word write-up · **Graded against the
rubric below.** Score doesn't matter. Doing the work is where the learning lands.

**Step 1 — Decision points (5 min).** List every point in your employment lifecycle where an outcome
is determined, narrowed, ordered or scored. Use Lesson 1's list as a prompt, not a limit.

**Step 2 — Find the systems (10 min).** For each decision point, what touches it? Run all five
questions from Lesson 2 — especially the default-sort check and the built-it-ourselves one. For each
system: **what it is, what decision it touches, the vendor, whether it arrived through procurement
or as a feature, and whether anyone owns it.**

**Step 3 — Test the review (8 min).** For the three highest-stakes systems, apply the four
questions to whoever reviews their output. **Answer with facts, not intentions** — how many items,
in how many minutes, seeing what, able to override how. Where you don't know, write "don't know" and
name who would.

**Step 4 — Score the prediction (2 min).** Systems found against systems predicted. Direction and
size of the miss, and one sentence on what it reveals.

Then the write-up: how many were shadow-stack rather than procured; which review layer failed the
most questions; your position on the claim above with the counter-argument addressed — **including
the discoverability version**; and **the one system you found that you did not know existed.** If
there wasn't one, say what that suggests — either you have unusually good governance, or you
searched the procurement list.

## Knowledge check — 8 questions

*Unlocks after the applied activity is submitted. Retakes are free and unlimited.*

**Q1.** Why start from decision points rather than from systems?

- A. Because decision points are easier to enumerate
- B. Because a system inventory built from a software inventory inherits its blind spots — including sourcing and selection for reduction ✓
- C. Because regulators define obligations by decision type
- D. Because systems change more often than decisions do

> **B.** The question "what AI do we use" gets answered with what somebody bought. Sourcing — who sees the posting at all — shapes the applicant pool before anyone applies, and is skipped constantly.

**Q2.** Why is a manager's weekend scoring spreadsheet an automated employment decision tool?

- A. Because spreadsheets contain formulas, which are algorithms
- B. Because it ranks people against criteria and determines outcomes — and it will be produced in discovery, despite having no vendor, contract or procurement record ✓
- C. Because most regulations define AEDTs to include any software
- D. It isn't — the definition requires machine learning

> **B.** No procurement record is exactly why it needs to be on your inventory. It is also, in a reduction, likely to be the highest-stakes scoring instrument in the organization.

**Q3.** What defines the shadow stack?

- A. Systems purchased by departments outside HR
- B. Unapproved tools employees use without permission
- C. AI capability delivered inside products bought before the capability existed — no procurement event, no owner who thinks of it as AI, no documentation, and frequently on by default ✓
- D. Vendors' subprocessors and downstream model providers

> **C.** Which means the deployment decision may have been made by a vendor's product team rather than by anyone in your organization.

**Q4.** Why do the five discovery questions avoid the word "AI"?

- A. Because the term is legally ambiguous
- B. Because asking "do you use AI" gets a no from people configuring a tool — the questions route around the word by asking about scores, sorts, release notes and defaults ✓
- C. Because vendors dispute whether their products qualify
- D. Because it avoids alarming stakeholders

> **B.** "Is there a default sort, and is it chronological?" gets an answer. "Do you use AI in screening?" gets a denial from someone who genuinely believes it.

**Q5.** A recruiter reviews 400 applications in 90 minutes against a ranked list, without seeing the ranking rationale. Which of the four questions does this fail?

- A. Authority and incentive
- B. Information and time — they cannot see why the system ranked as it did, and fourteen seconds per item is enough to confirm an ordering, not challenge one ✓
- C. Time only
- D. None — the review is genuine as long as they can override

> **B.** And note that the time question is arithmetic rather than opinion, which is why it most often produces an uncomfortable silence in the room.

**Q6.** Why does the incentive question matter?

- A. Because reviewers should be compensated for review work
- B. Because reviewers who follow the system and get a bad outcome are fine, while reviewers who override it and get a bad outcome are answerable — so the structure punishes the behaviour you're claiming as your safeguard ✓
- C. Because incentives determine how much time reviewers allocate
- D. Because performance metrics are themselves an AEDT

> **B.** Along with authority, it's the usual failing pair. Most of these failures are fixable — time can be budgeted, authority granted, rationale surfaced. What can't be fixed is a review layer nobody ever examined.

**Q7.** What does Connecticut's framework do beyond removing the tool as a defence `[V]`?

- A. It requires annual third-party audits of all AEDTs
- B. It creates a private right of action for algorithmic discrimination
- C. It makes evidence of anti-bias testing a mitigating factor, and identifies what gets weighed — quality, efficacy, recency, scope, results, and the employer's response to them ✓
- D. It prohibits AEDTs in hiring decisions entirely

> **C.** Which is close to a specification rather than general encouragement. Statutory framework effective 1 October 2026; principal compliance obligations from 1 October 2027.

**Q8.** Under that framework, why is testing that found a disparity and produced no action worse than not testing?

- A. Because it wastes resources that could fund remediation
- B. Because the employer's response to results is among the factors weighed — so you have documented knowledge and inaction in the same file ✓
- C. Because untested systems are presumed compliant
- D. Because testing without remediation violates the notice requirements

> **B.** It is the factor an organization can most easily fail, and it is why Module 3 asks you to decide what you'll do with a bad result *before* you have one.

## Sources and attribution

- **Connecticut's AI framework** — the amendment to the Connecticut Fair Employment Practices Act
  providing that use of an automated employment-related decision technology is not a defence to a
  discrimination complaint; the anti-bias-testing mitigation factors and their enumerated criteria
  (quality, efficacy, recency, scope, results, and the employer's response); effective dates of 1
  October 2026 for the statutory framework and 1 October 2027 for principal compliance obligations;
  and AG-exclusive enforcement of notice failures as an unfair or deceptive trade practice.
  **Counsel review required — see the gate at the top.** **[V]**
- **California Civil Rights Council** automated-decision regulations, effective 1 October 2025,
  making anti-bias testing or its absence relevant to a discrimination claim. **[V]**
- The decision-point method, the shadow-stack category and its five discovery questions, and the
  four-question review test are original to this course. The underlying claim that a human reviewing
  a ranked list is not automatically a defence is established in **AI 101 Module 7**; this module
  supplies the operational test that claim implies.
- **Cross-track note:** the HRBP and Recruiting tracks each build an inventory of AI systems
  touching their own population or requisition, at the depth those roles need. This module owns the
  shadow stack and the review test. No learner sees two role tracks.
- Structure and topic coverage follow the AI Fluency Framework (Dakan & Feller, in collaboration
  with Anthropic, CC BY-NC-SA 4.0); prose is original.
