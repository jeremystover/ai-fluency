# AI 401 · The Translator · Module 9 — The floor

**Course:** AI 401 · The Translator · Module 9 of 10
**Estimated time:** 25 min content · 10 min exercise · 30 min applied activity
**Prerequisite:** Module 6 — its liability question is routed here · Module 3 if legal is your partner
**Position in the course:** the limit, and the only module in it with a counsel-review gate

> **Counsel review required.** `[V]` This module states legal positions that are jurisdiction-
> specific, actively moving, and in one case changed nine days before the material it replaced was
> written. **Nothing here is legal advice and no procurement, deployment, or policy decision should
> rest on it.** Take the questions to your employment counsel; take the answers from them. Where
> this module is most useful is in telling you which questions are live.

> `Concepts reviewed: [DATE] · Examples current as of: [DATE]`
> Lessons 1–3 are **[V]** volatile layer throughout — this is the fastest-moving surface in the
> course. The enforcement argument in Lesson 4 is stable and is the part that outlives any statute.

---

## Counsel review required **[V]**

**This module states legal positions that are jurisdiction-specific, actively moving, and in one
case changed nine days before the material it replaced was written.**

Nothing here is legal advice. **No procurement, deployment, or policy decision should rest on this
module**, and no statement in it should be repeated to a colleague as settled without checking it
against your own employment counsel first.

Where this module is useful is in telling you **which questions are live** — what to ask, of whom,
and why the answer matters more than it did last year. Take the questions to counsel. Take the
answers from them.

Three specific things to verify locally before acting on anything below: **the jurisdictions your
organization actually operates in** and which instruments apply there; **the current status of the
European timeline**, which moved once already in 2026 and carries a review date on this block; and
**your own contracts** with any vendor whose system touches a decision about a person, because the
allocation of liability in those contracts is not what this module can tell you.

---

## Calibration prompt — before you start

*One claim. Commit before you read.*

> **"I could name, today, one decision about a person in my organization that is being shaped by a
> system nobody in People has reviewed."**

**True of us, or not true of us?** If true, name it now — a screening tool, a scheduling system, a
scoring model, a routing rule, a flag in a case management system.

If you cannot name one, do not write "there aren't any." Write **"I can't name one,"** because those
are different statements and the difference is this module's subject.

Then: **how many systems in your organization touch a decision about a person?** A count. Almost
everyone undercounts, and the reason is that the ones you forget are the ones nobody bought.

---

## Module brief

Every course on this ladder has a floor module, and this is 401's. It is different from the ones
below it in a specific way.

101 M7 and M8 taught you where the line sits for **your own** work and gave you a policy skeleton
for **your own** function. Your 301 track taught the legal edges of **your own** role. This module
is about the rules that govern work you do not perform, in functions you do not run, using systems
you did not buy — and about the enforcement problem that creates, which is genuinely 401's and
appears nowhere below it.

Two things frame it.

**You are the deployer, and that is a load-bearing word.** Most obligations in this area attach to
the organization that puts a system in front of people, not the one that built it. Module 6 taught
you to ask a vendor who holds liability for a discriminatory outcome and to listen to the
deflection. This module tells you what the deflection is deflecting.

**And a floor nobody can comply with is not a floor.** The organizations that write the strictest
AI policies frequently have the most unsanctioned AI use, and those two facts are causally related.
Lesson 4 is about that, and it is the module's real contribution.

## Learning objectives

By the end of this module you should be able to:

1. Explain what being the deployer means for where obligations land.
2. Name the four duties that recur across regimes, and design for them without reading each one.
3. State the current European position accurately, including which half moved and which did not.
4. Explain the agent theory and what it changes about how you buy.
5. Write a floor that includes an exception path, and say why one without it fails.

## Lesson 1 · You are the deployer **[V]**

The distinction that decides who carries the obligation.

**A developer builds the system. A deployer puts it in front of people.** You are the second one,
and across most of the regimes in this area, **the duties that matter attach to the deployer** —
notice, assessment, record-keeping, human review — regardless of what the vendor's marketing says
and frequently regardless of what the contract says.

This has a practical consequence that catches People functions repeatedly: **you can inherit an
obligation from a purchase you were not part of.** IT bought the scheduling system. A business unit
signed up for the screening tool. Somebody's team enabled a feature inside a platform you already
owned. In each case the system is now making or shaping decisions about people, and the exposure is
the employer's.

**The four duties that recur.** Across the patchwork of jurisdictions and instruments, the same
obligations keep appearing in different combinations:

- **Notice** to candidates and employees that an AI tool is being used.
- **Bias auditing**, sometimes with publication.
- **The right to request human review.**
- **Record-keeping** about how the tool was used and what it produced.

**If you build for those four, you are broadly positioned for regimes you have not read yet.** That
is the single most useful sentence in this module for someone operating across jurisdictions, and
it is why the activity asks for a floor rather than a compliance matrix.

**And the doctrine that predates all of it.** Disparate impact requires no intent. A neutral
practice that disproportionately excludes a protected group needs job-related justification,
whoever built it and whatever it was marketed as. Every AI statute sits on top of that; none
replaces it.

## Lesson 2 · The European position, and which half moved **[V]**

Stated carefully, because both of the confident summaries circulating are wrong.

The EU AI Act classifies employment uses — recruitment, selection, promotion, termination, task
allocation, and performance monitoring — as **high-risk**.

**Then the timeline moved, and only partly.** **Regulation (EU) 2026/1744, the Digital Omnibus on
AI, was published in the Official Journal on 24 July 2026 and entered into force on 27 July 2026** —
six days before the AI Act's original high-risk deadline. Employment high-risk obligations moved
from 2 August 2026 to **2 December 2027**; Annex I embedded systems to **August 2028**.

**But most Article 50 transparency obligations still applied from 2 August 2026.**

And two things never moved at all: the **AI literacy obligation** and the **prohibition on emotion
recognition in the workplace**, both in force since February 2025. The emotion-recognition ban is
not a risk to manage — it is a prohibition on inferring emotional states of employees or candidates
from facial expression, voice, or similar signals. **If a vendor is selling you sentiment-from-video
in an interview context and you have European operations, that is not a procurement question.**

So: **the leader who thinks the deadline passed and they are exposed is wrong. The leader who thinks
it all got delayed is also wrong.** Knowing which half moved is the literacy this lesson is for, and
it is exactly the kind of fact that will have changed again by the time you read this — which is
why the block carries a volatile marker and a review date.

## Lesson 3 · The agent theory **[V]**

The most consequential development for how you buy rather than how you comply.

In **Mobley v. Workday**, a court allowed claims to proceed on the theory that an AI screening
vendor can act as an **agent of the employer** — holding it plausibly alleged that customers had
delegated their traditional function of rejecting candidates or advancing them to interview. The
employment-agency theory was dismissed; the agent theory survived and went to discovery. The
litigation has continued to expand rather than contract, with claims proceeding across race, sex,
age, and disability.

Two implications for a Translator specifically.

**Neither party gets to point at the other.** The employer's *"that's the vendor's problem"* and the
vendor's *"we only make the software"* both weaken under this theory. **If a tool performs a
function you would otherwise perform, it may carry your obligations with it** — which is the answer
to the question Module 6 told you to ask, and the reason the deflection was a deflection.

**And discovery reaches the model.** The most instructive part of the case is the ongoing fight over
access to algorithmic code and testing data. Whatever its outcome, the direction is clear enough to
plan around: **"we don't know how it works" is not going to be a durable position**, and the time to
find out how it works is before you are asked.

Which gives you the procurement consequence in one line: **the bias audit you did not ask for at
purchase is the document you will be asked for at discovery.**

## Lesson 4 · The floor that people can actually stand on

Everything above is the law. This lesson is the part that is your job rather than counsel's, and it
is the module's real contribution.

**Start with the rule that outlives every statute.**

> **AI is never the decision-maker. Automate the assembly, not the reasoning.**

That rule survives every rollback, deferral, and amendment above, because it is not derived from any
of them. It is derived from what your organization's product actually is — manager judgment — and a
policy built on it will still be right when the timeline moves again. A policy built on a compliance
date expires on that date.

**Now the enforcement problem, which is the one nobody teaches.**

Organizations with the strictest AI policies frequently have the most unsanctioned AI use. That is
not irony, it is mechanism: **a prohibition nobody can comply with produces concealment rather than
compliance.** If the rule is "no AI on any employee data" and the alternative is missing a deadline
you cannot miss, people will use AI on employee data and stop telling you.

You then have the worst of both worlds. The usage continues, the risk is unchanged, and **you have
destroyed your visibility into it** — which was the one thing you actually had.

So a floor has to be enforceable by something other than hope, and at this rung you do not have a
police force. Three properties make one operate:

**It must be compliable.** For every prohibition, there is a stated thing to do instead. A rule that
forbids without providing an alternative is a rule that gets routed around, and the routing is
invisible to you by design.

**It must have an exception path with a real owner and a real turnaround.** Not "raise it with your
manager" — a named route with a stated response time. **The exception path is what converts
concealment into a queue**, and a queue is information: it tells you where the floor is wrong, which
teams are under pressure, and what is coming.

**And it must be versioned, with a date and a next review.** Everything in Lessons 1 to 3 will move.
A policy with no version is one people cannot tell is current, which means they will treat all of it
as equally stale — including the parts that matter most.

> **A floor with no exception path is not a floor. It is a detour sign.**

**One more thing, and it is the honest limit of your position.** You will write this and someone
will not follow it, and you will not find out. Your instrument is not enforcement, it is **making
compliance cheaper than concealment** — which is a design problem, and the one thing in this module
that is squarely yours rather than counsel's.

## Key takeaways

- **You are the deployer.** Obligations attach to the organization putting a system in front of
  people, not the one that built it — and **you can inherit an obligation from a purchase you were
  not part of.**
- **Four duties recur across regimes:** notice, bias auditing, a right to human review, and
  record-keeping. Build for those and you are broadly positioned for regimes you have not read.
- **Disparate impact requires no intent**, and every AI statute sits on top of that rather than
  replacing it.
- **In Europe, one half moved and one did not.** Employment high-risk obligations deferred to
  2 December 2027 by the Digital Omnibus; most Article 50 transparency obligations applied from
  2 August 2026; the AI literacy obligation and the workplace emotion-recognition prohibition have
  been in force since February 2025 and never moved.
- **The agent theory means neither party gets to point at the other**, and *"we don't know how it
  works"* is not a durable position. **The bias audit you did not ask for at purchase is the
  document you will be asked for at discovery.**
- **AI is never the decision-maker. Automate the assembly, not the reasoning** — a rule that
  outlives any statute, because it is derived from what your organization's product is.
- **A prohibition nobody can comply with produces concealment rather than compliance**, and you lose
  the visibility you had.
- **A floor must be compliable, have an exception path with a named owner and a response time, and
  be versioned.** The exception path converts concealment into a queue, and a queue is information.
- **Your instrument is making compliance cheaper than concealment**, not enforcement.

## Take a position

**The claim:** *"A floor with no exception path is not a floor. It is a detour sign."*

The strongest counter-argument is that **some floors should have no exception path, and saying so
is the point of having one.** There are things that should simply never happen — inferring emotional
state from a candidate's face, letting a model make a termination decision, running employee health
data through a consumer tool — and an exception process communicates, structurally, that these are
negotiable given sufficient business pressure. **A queue is an invitation.** Every exception granted
becomes the precedent for the next one, the turnaround time becomes the real policy, and within a
year the floor is wherever the exception approver's tolerance happens to sit.

The sharper version: this module's own framing concedes it. Lesson 2 describes the
emotion-recognition ban as *"not a risk to manage"* — a prohibition, full stop, with no exception
path contemplated by the legislature. **So the module already believes some floors are absolute**,
and has not said how you tell those from the ones that need a queue.

Your position has to draw that line: which prohibitions in your own floor get an exception path,
which get none, and what distinguishes them.

## Applied activity — "The unreviewed decision"

**Time:** 30 minutes · **Submit:** the search, the finding, and the exception path · **Graded against
the rubric below.** Score doesn't matter. Doing the work is where the learning lands.

> **Before you start:** nothing you submit should contain identifiable information about a named
> individual, an open matter, or a live investigation. This is a systems exercise, not a case
> exercise.

**Step 1 — Count the systems (8 min).** How many systems in your organization touch a decision about
a person? Go and look rather than recall. Include: anything in the hiring path, anything that scores
or ranks, scheduling and shift allocation, performance and calibration tooling, case management,
learning recommendations, and **any AI feature switched on inside a platform you already owned** —
which is the category everyone forgets, because nobody bought it.

**Step 2 — Name one nobody in People has reviewed (10 min).** One system, one decision it shapes,
and what "reviewed" would have meant — who would have looked, at what, against what standard.

**If you cannot find one, do not conclude there are none.** Record the search: where you looked, who
you asked, and what you were told. **A documented failed search is a full-credit answer** and often a
more alarming one than finding something, because it usually means nobody can enumerate the systems
at all.

**Step 3 — Write the exception path (10 min).** For one rule in your organization's current AI
policy — or one you would write if there is no policy — specify:

- **The rule**, in one line.
- **What to do instead** — because a prohibition without an alternative gets routed around.
- **The exception route:** a named owner, and a **stated turnaround time.**
- **What gets recorded** when an exception is granted, so the queue becomes evidence.
- **And one rule you would give no exception path at all**, with your reason.

**Step 4 — The covering note (2 min).** 150–250 words. Your predicted system count against the real
one, and specifically what you had forgotten. Then your position on the module's claim, engaging the
argument that a queue is an invitation.

## Knowledge check — 8 questions

*Unlocks after the applied activity is submitted. Retakes are free and unlimited.*

**Q1.** What does being the "deployer" mean for where obligations land?

- A. That the organization shares liability proportionally with the vendor
- B. That duties attach to the organization putting the system in front of people, regardless of who built it — so you can inherit an obligation from a purchase you were not part of ✓
- C. That obligations transfer once the system is customized for your organization
- D. That the deploying manager rather than the function carries the exposure

> **B.** IT bought the scheduling system, a business unit signed up for the screening tool, someone
> enabled a feature in a platform you already owned. The exposure is the employer's in each case.

**Q2.** Which four duties recur across regimes?

- A. Registration, certification, audit, and insurance
- B. Notice, bias auditing, a right to request human review, and record-keeping ✓
- C. Consent, minimization, retention limits, and deletion rights
- D. Impact assessment, board approval, vendor attestation, and annual reporting

> **B.** Build for those four and you are broadly positioned for regimes you have not read — which
> is why the activity asks for a floor rather than a compliance matrix.

**Q3.** What is the accurate statement of the current European position on employment uses?

- A. High-risk obligations applied from 2 August 2026 as originally scheduled
- B. The entire regime was postponed under the Digital Omnibus
- C. Employment high-risk obligations were deferred to 2 December 2027, but most Article 50 transparency obligations still applied from 2 August 2026 ✓
- D. Employment uses were reclassified out of the high-risk category

> **C.** The leader who thinks the deadline passed is wrong, and so is the leader who thinks it all
> got delayed. The AI literacy obligation and the workplace emotion-recognition prohibition never
> moved and have been in force since February 2025.

**Q4.** What does the module say about a vendor selling sentiment-from-video in an interview context, for an organization with European operations?

- A. It requires a documented impact assessment before deployment
- B. It is permitted with candidate notice and a human review option
- C. It is not a procurement question — workplace emotion recognition is prohibited, not a risk to manage ✓
- D. It depends on whether the inference affects the hiring decision

> **C.** The prohibition covers inferring emotional states from facial expression, voice, or similar
> signals, and it has been in force since February 2025.

**Q5.** What does the agent theory in *Mobley v. Workday* change?

- A. It makes vendors primarily liable for discriminatory outcomes
- B. Neither party gets to point at the other — if a tool performs a function you would otherwise perform, it may carry your obligations with it ✓
- C. It requires vendors to publish bias audit results
- D. It extends employment-agency obligations to software providers

> **B.** The employment-agency theory was dismissed; the agent theory survived and went to
> discovery. D describes the theory that was dismissed.

**Q6.** What is the procurement consequence of discovery reaching the model?

- A. Contracts should include indemnification for algorithmic decisions
- B. Vendors should be required to hold errors-and-omissions coverage
- C. "We don't know how it works" is not a durable position — the bias audit you didn't ask for at purchase is the document you'll be asked for at discovery ✓
- D. Model documentation should be retained for the statutory limitation period

> **C.** Which is why Module 6 puts the bias audit request at purchase, when you still have
> leverage.

**Q7.** Why does a prohibition nobody can comply with produce concealment rather than compliance?

- A. Because employees resent rules they were not consulted on
- B. Because if the rule is "no AI on employee data" and the alternative is missing a deadline you cannot miss, people will use AI and stop telling you ✓
- C. Because enforcement resources are always insufficient
- D. Because policies written by legal are rarely understood by practitioners

> **B.** And you get the worst of both worlds: the usage continues, the risk is unchanged, and you
> have destroyed the visibility you had.

**Q8.** What does an exception path with a named owner and a stated turnaround actually buy you?

- A. Legal defensibility if an exception is later challenged
- B. It converts concealment into a queue — and a queue is information about where the floor is wrong and which teams are under pressure ✓
- C. Faster adoption of approved tools
- D. A record that satisfies the record-keeping duty

> **B.** Your instrument at this rung is making compliance cheaper than concealment, not
> enforcement.

## Sources and attribution

- **Counsel-review gate stated at the top of the module**, in the content itself. Nothing here is
  legal advice; the module's usefulness is in identifying which questions are live.
- **The EU AI Act timeline, the Digital Omnibus deferral, and *Mobley v. Workday* are reused
  verbatim rather than re-derived** — from `content/ai301-hrbp-m6-the-line.md` and the CPO track's
  correction, per the course's shared-evidence rule. Six independently worded copies of the same
  statute will drift, and this surface moves faster than any other in the curriculum. `[V]`
- The Omnibus specifics — **Regulation (EU) 2026/1744, published 24 July 2026, in force 27 July
  2026, employment high-risk moved to 2 December 2027, Annex I embedded systems to August 2028,
  most Article 50 transparency obligations applying from 2 August 2026** — carry the corrected
  wording established during the CPO track's verification, which found the pre-correction phrasing
  described the deferral as a proposal rather than adopted law.
- **Deliberately not repeated from 101 M7 and M8:** where the assist/decide line sits, and the
  five-question policy skeleton for your own function. This module is about work you do not perform
  in functions you do not run, and about enforcement without authority.
- The deployer framing as an inheritance problem, the compliable/exception-path/versioned test, and
  the *make compliance cheaper than concealment* rule are original to this course. The concealment
  mechanism is shared with the Labor & Employee Relations 301 track, where it appears in its
  investigations form.
