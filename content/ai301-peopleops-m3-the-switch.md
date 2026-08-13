# AI 301 · People Ops & HR Technology · Module 3 — The switch

**Course:** AI 301 · The Specialist — People Ops & HR Technology track · Module 3 of 8
**Estimated time:** 35 min content · 10 min exercise · 30 min applied activity
**Prerequisite:** Modules 1 and 2 (you review a decision from your register, and its kill condition
came from M2) · extends 201 M5 (the autonomy ladder) and 101 M2 (the vendor teardown)
**Position in the track:** the signature module — the one nothing on the market teaches, because the
market is selling the switch

> `Concepts reviewed: [DATE] · Examples current as of: [DATE]`
> Lessons 1 and 3 are **volatile layer**, survey figures and a pending case whose posture will
> change. The eight questions, the contract checklist and the piloting method are stable.

---

## Calibration prompt — the claim to contest

*Commit before you read anything. Thirty seconds.*

**The claim:** *"You couldn't produce, today, the evaluation that put your current AI capabilities
into production."*

Not a business case. Not a vendor deck. The document that says what was switched on, for whom, on
what evidence, with who accountable.

**Is that true of your organization?** *True of us* or *not true of us*, and the one sentence you
would defend it with.

**And the number you'll check:** this module asks eight questions of any capability before it is
enabled. **For the decision you chose in Module 1, how many of the eight can you answer today** —
with a citation, not a recollection? Guess before you see them.

---

## Module brief

Every other person in this curriculum learns to evaluate a tool **for themselves**. 101 M2 taught
the vendor teardown, 201 M5 taught the autonomy ladder, and both assume you're choosing something
you'll personally use and personally supervise.

You do something categorically different. **You impose a capability on a population**, inside a
system you didn't build and can't inspect, on the basis of a release note. The people affected
didn't choose it, mostly don't know it happened, and will experience it as the company speaking
to them. And when it goes wrong, the question won't be whether the vendor's model is good. It
will be **who decided to turn this on, and what did they look at.**

That document doesn't exist in most organizations. This module builds it.

Two things make the module harder than it sounds. Your organization's AI policy (if it has one)
almost certainly can't help you, for a structural reason worth understanding rather than
complaining about. And the guarantees you most need aren't architectural facts you can go and
verify; they are **contractual** facts that were fixed at signature, before anyone asked you.

So: why the policy fails, the eight questions, where the answers actually live, and how to pilot
something inside a system of record without either learning nothing or breaking payroll.

## Learning objectives

By the end of this module you should be able to:

1. Explain why a tool-named AI policy can't govern platform features `[V]`, and what a policy has
   to name instead to survive a release cycle.
2. Run the eight-question pre-enablement review, and distinguish an answer from a reassurance.
3. Identify the contractual terms that determine what autonomy is actually available to you, and why
   they can't be renegotiated later.
4. Ask the data-provenance question `[V]`, what third-party data does this capability depend on, and
   is there a route by which its subject could see and dispute it.
5. Design a production pilot in a system of record: scoped population, instrumented first, and a
   decision that can end in no.

## Lesson 1 · Why your policy can't help **[V]**

Start with the artifact you might reasonably expect to lean on, and why it won't hold your weight.

SHRM's *State of AI in HR 2026* found that **51% of organizations have no formal AI use policy at
all.** That figure gets quoted a lot and it is the less interesting half. The interesting half is
what happened to the organizations that did the work: among those with a policy, **54% report it is
too restrictive and too tightly tied to the specific AI tools available now**, and a further **23%
report theirs is too broad to guide practical behaviour.**

Sit with that arithmetic. Of the organizations that produced the artifact, roughly three in four
believe the artifact doesn't function. **This is not a compliance gap. It is a design failure**, and
it is repeating across the market because everyone is making the same mistake.

The mistake is naming products. A policy that says *employees may not enter confidential employee
data into ChatGPT* has a shelf life exactly equal to your vendors' release cadence. It says nothing
about the summarizer that appeared in your case tool, the ranking in your internal-mobility module,
or the agent your HCM shipped last Tuesday, and it can't be made to, because those things aren't
ChatGPT and no amount of careful drafting will make a product name cover a capability nobody had
heard of when the sentence was written.

There is a second, quieter failure underneath it. **A policy and an enablement decision are
different documents with different subjects.**

- A **policy** governs *people*: what employees may do with tools. Its reader is a person deciding
  how to behave, and it succeeds if they can comply without asking anyone.
- An **enablement decision** governs *a system*: what a capability is permitted to do, to whom, with
  which gate. Its reader is an auditor, a works council, or a regulator, and it succeeds if it
  explains a choice somebody made.

Most organizations have written the first and believe it covers the second. It never did, and the
missing document is the one this role owns.

So what does a durable policy name? **Capabilities and decisions, not products.** Compare:

> *"Employees must not use ChatGPT for HR data."*
> Obsolete the moment a vendor ships something. Silent on every feature you already own.

> *"No system may issue a final determination about an individual's eligibility, pay, leave, or
> employment status without a named human approver who can see the inputs."*
> Survives every release note ever written, and tells you what to do about the agent that shipped on
> Tuesday.

The second sentence is doing what Module 1's register was for. It is written in the vocabulary of
decisions rather than tools, which is why it doesn't expire.

## Lesson 2 · The pre-enablement question set

The method. Eight questions, asked before a capability reaches anyone, and the answers become the
document.

**1. What population — and can it be scoped?** Named and counted. "All employees" is an answer, and
it is the answer that should require the most work. Whether the capability can be limited to a
subset is the question that determines whether Lesson 4's pilot is even possible, which is why it is
first.

**2. What does it read?** Which data, from which systems, at what grain. Including the data it
reaches *indirectly*, a capability that reads your HCM reads everything your HCM holds unless
something stops it.

**3. What does it write?** This is the split vendors describe least clearly and it matters most.
**Read-only and write-capable are different risk classes**, and marketing copy puts them in the same
paragraph. Anything that writes to a system of record is a Module 1 wide-reach item by definition,
and anything that writes on a schedule without a human in the loop is the wide-reach long-latency
quadrant.

**4. Where is the human gate, and who is it, by name?** "With human oversight" isn't an answer to
this question; it is a reassurance shaped like one. The answer names a person or a role held by a
specific person, the step at which they act, and (the part that gets skipped) **whether they have
the authority and the time to refuse.** A gate staffed by someone with 400 items a day and no
mandate to reject isn't a gate.

**5. What artifact does it leave behind?** Logs, and three specifics: can you **export** them, what
is the **retention**, and does the log record the **input** as well as the output? A log of what the
system said, without what it was asked or what it read, can't reconstruct a decision. (Module 7
turns retention into a statutory number.)

**6. What is the rollback, and has anyone performed it?** Module 2's fourth part, arriving where it
belongs. Documented isn't performed.

**7. What happens when it is wrong at 3am on a Saturday?** Who notices, who can disable it without
waiting for a change window, and **does that person actually have the access.** This question finds
more real problems than any of the others, because the answer is usually a named person who doesn't
have the permission they would need.

**8. Who is accountable, by name?** Module 1's column, now for a capability rather than a decision.
Not the team, not the steering group. Module 7 ends in their signature.

Then the rule that makes the review worth running:

> **"The vendor says it's fine" is not an answer to any of these.**

An answer cites the **contract**, the **configuration screen**, or the vendor's own **documentation**,
in a form you could show to a third party. A sales engineer's verbal assurance in a call isn't an
artifact and won't be available to you in eighteen months.

And the counter-intuitive grading standard, which is also how the activity is marked: **blanks are
the output.** A review with four honest blanks, each assigned an owner and a date, is a real review
that has told you where your exposure is. A review with eight confident answers and no citations is
a story somebody told themselves.

> ### Try this — 3 minutes
> Take the capability you chose in Module 1 and answer question 7 out loud: if it started producing
> wrong output at 3am on a Saturday, who would notice, and who could switch it off before Monday? If
> the answer is a named person, check whether they have the access. Most people discover the
> answer is "me, and no."

## Lesson 3 · The contract is where the rungs are **[V]**

201 M5 gave you the autonomy ladder (draft-only, then propose-then-approve, then
act-with-audit-trail) and taught you to choose a rung deliberately and build guardrails as
permissions rather than hopes. That module assumed **you built the thing.** You owned the code, so
you owned the rungs.

Here a vendor built it. Which means the ladder still describes the risk perfectly and **you do not
control a single rung of it.** What autonomy is available to you, what evidence you get, and whether
you can stop it aren't architectural questions you can go and investigate. They are contractual
facts, fixed at signature, usually before anybody consulted you.

That converts an engineering problem into a procurement problem, and procurement has one property
that should organize your whole approach: **your leverage exists exactly once, and it is before you
sign.** Afterwards you have a renewal conversation in eighteen months and an obligation today.

What to get in writing, each mapping to a question from Lesson 2:

- **Model and subprocessor disclosure** — what model, whose infrastructure, and **notification when
  it changes.** The last clause is the one that gets dropped and the one that matters, because the
  capability you evaluated isn't necessarily the capability you're running next quarter.
- **Training.** Whether your data trains anything, stated as a term rather than a marketing page.
- **Logs**: retention period, **export in a usable format**, and whether inputs are captured. Ask
  for a sample log file during evaluation. Vendors who won't show you one are telling you
  something.
- **Incident notification with a time bound.** "Promptly" isn't a time bound.
- **The right to disable unilaterally**, by you, without a support ticket or a professional-services
  engagement. Test this in the configuration screen during evaluation, not in an incident.

### The data-provenance question

Then one question most People Ops teams have never asked, which a pending case has just made
unavoidable:

> **What third-party data does this capability depend on, that you have never disclosed to anybody?**

In January 2026, two job applicants filed a proposed class action against a talent-intelligence
platform — *Kistler et al. v. Eightfold AI Inc.*, since removed to federal court as No. 3:26-cv-1768
(N.D. Cal.). The complaint alleges the platform operated as an **unregistered consumer reporting
agency** under the Fair Credit Reporting Act: that it assembled outside data into "rich talent
profiles," assigned candidates "Match Scores" that were shared with employers, and did so without
disclosure, without consent, and **without any mechanism for the subject to see the record or dispute
what it said.** A California consumer-protection claim rides alongside it.

**The status matters and you should carry it accurately.** This is a complaint. As of this writing it
sits in the pleading stage, there has been no ruling on a motion to dismiss, and **no court has held
that FCRA applies to AI hiring or talent tools.** Anyone telling you the law has changed is ahead of
the record. Treat it as a live question, not a holding, the same standard the rest of this
curriculum applies to an unaudited vendor claim.

**But notice why it lands on your desk regardless of how it resolves.** Every question the complaint
raises is a data-flow question and a workflow question:

- Where does this data come from, and did we bring it in or did the vendor?
- Was the subject ever told this data was being assembled about them?
- **Is there a route by which they could see it and correct it?**

Those are integration diagrams and process designs. They are your artifacts. Recruiting owns the
hiring decision; **you own whether a disclosure-and-dispute path exists**, and that is a system you
either have or don't have.

Which gives you the transferable version, applicable to every AI feature in your stack and not just
the ones aimed at candidates:

> **Does this capability's output depend on data its subject has never seen?**

If yes, then sooner or later somebody (a regulator, a works council, an employee's lawyer, or the
employee) will ask for a way to see and challenge it. Building that path afterwards, retroactively,
across a live integration, is a project. Asking the question before enablement costs one line in a
review.

## Lesson 4 · Piloting inside a system of record

The last part, and the place good intentions usually die.

**Sandbox rarely answers the question you have.** It contains synthetic data, no real integration
traffic, and no real users — and the failures you actually care about are integration failures and
human failures. A sandbox test proves the feature exists and functions. It can't tell you that
your leave categories confuse it, that 12% of your records have the quirk that breaks it, or that
coordinators will work around it. Use sandbox for the rollback rehearsal from Module 2, and don't
mistake it for a pilot.

Which means piloting in production, on a scoped population, and that is only possible if the
capability can be scoped, which is why question 1 is question 1. If it can't be scoped, you don't
have a pilot available to you. You have a launch, and you should say so out loud rather than calling
it something softer.

**Choosing the population.** Three criteria and one that surprises people:

- **One you can watch.** Module 2's tags and queries have to cover it, or you're running an
  uninstrumented experiment.
- **One where failure is recoverable.** Not your executive population, not the group in the middle of
  a restructure, not the country with the works council you haven't consulted yet.
- **One that is representative**, and this is the surprising one: **not your most enthusiastic
  group.** Volunteers and early adopters produce results that don't generalize, because their
  tolerance for a clumsy tool is atypical and their willingness to work around it silently is high.
  A pilot's job is to predict what will happen to everybody, and a pilot run on people who wanted it
  predicts nothing about people who didn't.

**Instrumented before enabled.** Module 2's four numbers, saved, with the queries. This is the
sentence that makes the difference between a pilot and an anecdote, and it is the one most often
skipped for schedule reasons.

**The smallest scope that would prove anything.** Module 2's coaching trials gave the reason: a
scope wide enough to impress is usually wide enough that no result could disconfirm it. So the
design question isn't "what is the most we could turn on" but "what is the least that would settle
the question."

**And the pilot has to be able to end in no.** This is the part organizations get wrong most
reliably. If there is no outcome of the pilot under which the capability doesn't proceed (if the
vendor is already announced, the training built, the date in the newsletter) then it was never a
pilot. It was a rollout with a longer preamble and some optimistic paperwork, which is Module 2's
sentence arriving one module later and one level up.

So the pilot's output is a written decision with a date, and it has exactly three permitted values:
**proceed, change the scope, or stop.** Write which one, who decided, and what evidence moved them.
That document is what Module 7 asks you to sign.

## Key takeaways

- **Most AI policies cannot govern platform features, by construction** `[V]`. 51% of organizations
  have none; among those that do, 54% say theirs is too tied to today's specific tools and 23% say
  theirs is too broad — roughly three in four of the organizations that did the work think the
  artifact doesn't function.
- **A policy governs people; an enablement decision governs a system.** Different documents,
  different readers. Most organizations wrote the first and believe it covers the second.
- **Durable policies name capabilities and decisions, not products.** "No system may issue a final
  determination about eligibility, pay, leave or employment status without a named human approver who
  can see the inputs" survives every release note; a product name doesn't.
- **Eight questions before enablement:** population and whether it can be scoped; what it reads; what
  it *writes*; the human gate and who it is by name; the artifact it leaves, including whether the
  log captures inputs; the rollback and whether anyone performed it; what happens at 3am on a
  Saturday; and who is accountable by name.
- **"The vendor says it's fine" is not an answer.** An answer cites the contract, the configuration
  screen, or the documentation, in a form you could show a third party. **Blanks with owners and
  dates beat confident answers without citations.**
- **You do not own the autonomy rungs, the contract does.** Model and subprocessor disclosure *with
  change notification*, training terms, log retention and export and whether inputs are captured,
  time-bound incident notification, and the right to disable unilaterally. Your leverage exists once,
  before signature.
- **Ask the provenance question** `[V]`: does this capability's output depend on data its subject has
  never seen? If yes, a disclosure-and-dispute path will be demanded eventually, and retrofitting one
  across a live integration is a project. *Kistler v. Eightfold* is a **pending complaint with no
  ruling**: carry it as a live question, not a holding.
- **Sandbox proves the feature exists.** Pilot in production on a scoped population you can watch,
  where failure is recoverable, and that is **not your most enthusiastic group.** Smallest scope that
  would settle the question. And **a pilot that cannot end in "no" is a rollout with a preamble.**

## Take a position

**The claim:** *"A policy that names tools can't govern a platform that ships new ones every
quarter. If your AI policy would need rewriting because a vendor renamed a feature, it was never a
policy."*

The strongest counter-argument is that **capability-level policies sound rigorous and are
unenforceable, because they relocate the whole difficulty into classification.** A tool-named rule is
crude, but it is *legible*: an employee reads "don't put employee data into ChatGPT" and can comply
without consulting anybody. A capability-level rule replaces that with a question — *is this
summarizer shaping a decision about a person?* — which is answerable only by a small number of
specialists, case by case, slowly. And **a rule people can follow without you beats a better rule
that requires you**, because the second one silently converts into no rule at all every time you're
busy, on holiday, or three weeks behind.

On that view the honest design is the opposite of the module's: a short, blunt, tool-named list
maintained frequently, plus a mandatory escalation for anything not on it. The capability-level
principle then belongs in the enablement decision (read by a specialist, once, per capability)
rather than in a policy read by four thousand people.

Notice that this is Module 1's counter-argument coming back with more force. There the objection was
that you can't personally gate every release note. Here it is that you can't personally classify
every capability either. Your position has to answer the operational question that follows: **who
classifies, how quickly, and what happens while that person is away?** If the answer is "it gets
escalated to me," you have built a queue with one server, and Module 8 will ask you what happens
when it saturates.

## Applied activity — "The review it never got"

**Time:** 30 minutes · **Submit:** the completed review, the contract findings, the pilot design, and
a 300–400 word write-up · **Graded against the rubric below.** Score doesn't matter. Doing the work
is where the learning lands.

Take the decision you chose in Module 1 and the capability attached to it, ideally one that is
**already live**, because a retrospective review is the honest hard case and the one your
organization actually needs.

**Step 1. The eight questions (12 min).** Answer each one. For every answer, **cite where it came
from**: the contract clause, the configuration screen, the documentation page. Where you can't
answer, **write "unknown" and assign an owner and a date** — don't resolve a blank with a plausible
guess. The blanks are the deliverable.

**Step 2. The contract check (6 min).** For the five terms in Lesson 3, subprocessor disclosure
with change notification, training, log retention and export and whether inputs are captured,
time-bound incident notification, and unilateral disable — record what your agreement actually says.
"Not addressed" is a common and important answer. If you can't see the agreement, say who can and
by when you'll have asked.

**Step 3. The provenance question (3 min).** Does this capability's output depend on data its
subject has never seen? If yes: is there any route today by which they could see and dispute it, and
if not, what would building one involve?

**Step 4. The pilot, or the admission (6 min).** Either design it — scoped population and why that
one, the instrumentation from Module 2, the smallest scope that would settle the question, and the
three permitted outcomes — **or state plainly that the capability cannot be scoped and therefore no
pilot is available**, which is a legitimate and useful finding.

**Step 5. Score the prediction.** Your predicted number of answerable questions out of eight
against how many you could actually answer with a citation. Direction and size of the miss.

Then the write-up: your position on the claim above, addressing the counter-argument's operational
question about who classifies and what happens while they are away; whether the opening claim turned
out to be true of your organization; and the specific one — **which blank you're going to close
first, who owns it, and by when.** One closed blank is worth more than a plan to close all of them.

## Knowledge check — 8 questions

*Unlocks after the applied activity is submitted. Retakes are free and unlimited.*

**Q1.** What does the module identify as the more revealing half of the AI-policy statistics? `[V]`

- A. That 51% of organizations have no formal AI use policy
- B. That among organizations which do have one, 54% say it is too tied to today's specific tools and 23% say it is too broad, so roughly three in four that did the work think the artifact doesn't function ✓
- C. That policies are usually written by legal rather than HR
- D. That employees are largely unaware their organization has a policy

> **B.** The 51% is a compliance gap. The 54%/23% split is a design failure, and it repeats because
> everyone makes the same mistake — naming products, which gives a policy a shelf life equal to the
> vendor's release cadence.

**Q2.** What is the difference between a policy and an enablement decision?

- A. A policy is mandatory; an enablement decision is advisory
- B. A policy is written by HR; an enablement decision is written by IT
- C. A policy governs people and succeeds if they can comply without asking anyone; an enablement decision governs a system and succeeds if it explains a choice somebody made to an auditor ✓
- D. They are the same document at different levels of detail

> **C.** Most organizations wrote the first and believe it covers the second. The missing document is
> the one this role owns, and Module 7 asks for its signature.

**Q3.** Which of the eight questions does the module say uncovers the most real problems?

- A. What population does it reach
- B. What does it write versus read
- C. What happens when it is wrong at 3am on a Saturday, because the answer is usually a named person who lacks the access they would need ✓
- D. Who is accountable by name

> **C.** The others surface design gaps. This one surfaces the gap between the named responder and
> their actual permissions, which only appears when you check.

**Q4.** Why is "with human oversight" not an answer to the human-gate question?

- A. Because oversight must be documented in the contract
- B. Because it names no person, no step, and says nothing about whether that person has the authority or the time to refuse, a gate staffed by someone with 400 items a day and no mandate to reject isn't a gate ✓
- C. Because human oversight is prohibited under the EU AI Act
- D. Because oversight should be automated for consistency

> **B.** It is a reassurance shaped like an answer. The test is whether refusal is actually available
> to the named person.

**Q5.** Why does the autonomy ladder from 201 M5 need rethinking for a vendor-built capability?

- A. Because vendor capabilities are always more autonomous than self-built ones
- B. Because the ladder still describes the risk exactly, but you control none of its rungs — what autonomy, evidence and stopping power you have are contractual facts fixed at signature ✓
- C. Because the ladder only applies to workflows involving employee data
- D. Because vendors implement the middle rung by default

> **B.** Which turns an engineering question into a procurement one, and your leverage exists exactly
> once, before you sign. Afterwards you have a renewal in eighteen months and an obligation today.

**Q6.** How should the *Kistler v. Eightfold* litigation be characterized? `[V]`

- A. A ruling establishing that AI hiring tools are consumer reporting agencies under FCRA
- B. A settled case that changed employer obligations for candidate data
- C. A pending complaint in the pleading stage with no ruling on a motion to dismiss: a live question rather than a holding ✓
- D. Irrelevant to People Operations, since it concerns recruiting tools

> **C.** Carry the posture accurately; anyone saying the law has changed is ahead of the record. And
> D is wrong for a specific reason: the questions it raises (where data came from, whether the
> subject was told, whether a dispute path exists) are data-flow and workflow questions, which are
> this role's artifacts.

**Q7.** What is the transferable provenance question the module extracts?

- A. Whether the vendor has a SOC 2 report covering its data sources
- B. Whether the capability's output depends on data its subject has never seen — because a disclosure-and-dispute path will eventually be demanded, and retrofitting one across a live integration is a project ✓
- C. Whether third-party data is stored inside your tenancy
- D. Whether the data was obtained with consent from the original platform

> **B.** It applies to every AI feature in the stack, not only candidate-facing ones. Asking before
> enablement costs one line in a review.

**Q8.** Why does the module say sandbox testing rarely answers the real question?

- A. Because sandbox environments run older software versions
- B. Because sandboxes have synthetic data, no integration traffic and no real users, while the failures that matter are integration failures and human failures ✓
- C. Because sandbox results can't be included in an audit trail
- D. Because vendors restrict AI features in non-production environments

> **B.** Sandbox proves the feature exists and functions. Use it for the rollback rehearsal, then
> pilot in production on a scoped population, which is only possible if the capability can be
> scoped, which is why that is question one.

## Sources and attribution

- **SHRM, *The State of AI in HR 2026*** — 51% of organizations with no formal AI use policy; among
  those with a policy, 54% reporting it too restrictive and too tightly tied to currently available
  tools, and 23% reporting theirs too broad to guide practical behaviour. Survey of 1,722 HR
  professionals, fielded 5–23 December 2025. Same instrument as Module 1's adoption split. **[V]**
- ***Kistler et al. v. Eightfold AI Inc.***, No. 3:26-cv-1768 (N.D. Cal.) — proposed class action
  filed January 2026 and removed to federal court, alleging the platform acted as an unregistered
  consumer reporting agency under the FCRA by assembling third-party data into talent profiles and
  assigning candidate Match Scores shared with employers without disclosure, consent, or a dispute
  mechanism, plus a California consumer-protection claim. **In the pleading stage; no ruling on a
  motion to dismiss; no court has held FCRA applies to AI hiring tools. Posture changes between
  review cycles, re-verify before relying on any characterization of it. [V]**
- The eight-question pre-enablement review, the policy-versus-enablement-decision distinction, the
  capability-not-product drafting rule, the contract checklist, the provenance question, and the
  production-pilot criteria including the not-your-enthusiasts rule are original to this course.
- Builds on 101 M2 (the vendor teardown, aimed here at a configuration rather than a claim), 201 M5
  (the autonomy ladder, whose rungs this role doesn't own), Module 1 (reach, latency,
  reversibility, accountability by name) and Module 2 (the four numbers and the kill condition, both
  of which this review consumes).
- **This module is not legal advice.** The provenance question is a systems-design question; whether
  any specific capability triggers FCRA or comparable obligations is a question for counsel.
