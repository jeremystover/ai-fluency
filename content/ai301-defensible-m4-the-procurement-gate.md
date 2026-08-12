# AI 301 · Defensible by Design · Module 4 — The procurement gate

**Course:** AI 301 · The Specialist — Defensible by Design · Module 4 of 5
**Estimated time:** 25 min content · 10 min exercise · 20 min applied activity
**Prerequisite:** Module 2 (the inventory) and Module 3 (you cannot read an audit you couldn't have run)
**Position in the track:** where your exposure is actually set, before anything is deployed

> `Concepts reviewed: [DATE] · Examples current as of: [DATE]`
> The adoption figures and the standards material are **[V]** volatile layer. The questions are
> stable.

---

## Calibration prompt — before you start

*One claim. Commit before you read anything.*

Here is a factual assertion about your own organization:

> **"For the systems that screen or score candidates here, we hold written validation evidence from
> the vendor — not a claim in a deck, a document."**

**True of us, or not true of us?** Commit to one, in a sentence.

Then predict one number: **of the systems on your Module 2 inventory, how many could you produce
written validation or fairness evidence for today, without asking the vendor?** You'll check the
files in the activity.

---

## Module brief

Everything in Modules 2 and 3 is remediation. You found systems that were already running and
designed testing for decisions already being made. This module is the only one in the track that
operates before the exposure exists.

Procurement is where the terms are set, where you have leverage you will never have again, and where
a question costs nothing. After signature you are asking a vendor to do you a favour. Before it, you
are a buyer.

And the work has moved. Half of HR buyers now run some form of pre-purchase evaluation of AI
systems, which is a genuine change in practice. The problem is what those evaluations contain,
because the single most common failure is not skipping the diligence — it is **accepting a document
that answers a different question than the one asked.** A vendor asked whether its tool is fair will
frequently produce something that is real, verifiable, expensive to obtain, and silent on fairness.

This module is about asking questions that can only be answered one way, and reading what comes back.

## Learning objectives

By the end of this module you should be able to:

1. State what the available evidence on procurement practice does and doesn't establish.
2. Ask the four questions a fairness claim has to survive.
3. Distinguish a fairness audit from a management-system certification, and say what ISO/IEC 42001
   does and does not tell you.
4. Explain why the agent doctrine puts this gate in your hands rather than procurement's.

## Lesson 1 · The state of practice, and who counted it **[V]**

The most-cited figures on AI procurement diligence in HR: roughly **50% of HR buyers now run formal
pre-purchase evaluations of AI systems**, against about **17%** relying mainly on vendor reputation,
and **75% of HR leaders naming bias a top concern** when evaluating AI tools — second only to data
privacy.

**Now read the funder, because this course does not exempt its own numbers.** Those figures come
from a vendor whose business is bias auditing, reporting on its own audit book. That is precisely the
teardown pattern taught elsewhere in this curriculum — a supplier publishing research whose finding
is that more organizations should buy what it sells.

Which does not make the numbers false. It makes them a claim with an interest attached, and the
correct handling is to use them for direction rather than magnitude: **pre-purchase evaluation has
moved from unusual to common, and buyers say bias is near the top of their concerns.** Both are
consistent with everything else in this track. Neither should be quoted to an executive as a precise
benchmark, because you cannot show the sample, the population or the question wording.

Stating this in the lesson rather than the footnote is deliberate. A module that teaches you to
interrogate a vendor's evidence while quoting a vendor's evidence uncritically would have failed its
own test in its first paragraph.

## Lesson 2 · The four questions

What to actually ask, in writing, before signature. Each is designed so that a non-answer is
recognizable as a non-answer.

**1. Validation evidence for a population like ours, in writing.**

Not "the tool is validated." *Show me the study: what outcome was predicted, on what population, at
what sample size, with what result — and how similar is that population to ours?* A model validated
on national data for a role you hire in one region, or on a workforce with a very different
composition, may be validated and irrelevant.

This question either produces a document or produces silence, **and both are answers.** Silence is
not proof of a bad product; it is proof you cannot rely on the claim, which is what you needed to
know.

**2. What was it trained on, and what does it optimize?**

The second is the more revealing and the less often asked. A model optimizing for "candidates
similar to current high performers" has an explicit objective of reproducing your existing
workforce's composition — which is a design decision, not a defect, and one you may be unable to
defend. A model optimizing for time-to-fill is optimizing something else entirely. Vendors will
usually answer this, because they are proud of it.

**3. What happens to the data of people who are rejected?**

The *Kistler* question from Module 1. If the system assembles information about a person from
sources beyond what they submitted, retains it, or uses it across employers, you are in territory
that may implicate consumer-report obligations regardless of whether the model is fair. **Ask it as
a data question, not a fairness question**, because the fairness answer will not surface it.

**4. What would we need from you if we were sued?**

The question that changes the room. Can they produce the model version in effect on a given date?
The configuration you were running? The audit contemporaneous with that version? Will they support
you, and is that written into the contract or dependent on goodwill?

Ask it before signature and it is a procurement term. Ask it after, and it is a request.

> ### Try this — 3 minutes
> Take the most recent AI-touching contract your organization signed. Search it for the words
> "audit," "validation," "bias," and "records." Most contracts of this kind contain none of them,
> which tells you what was negotiated and what was assumed.

## Lesson 3 · An audit is not a certification **[V]**

The most consequential distinction in this module, and the one most often collapsed in a sales
conversation.

**A fairness audit measures a system's outcomes on a population.** It asks whether *this tool*
produced disparate results for *these people* at *this time*. It is empirical, specific, and it can
come back bad.

**A certification attests that an organization runs a process.** It asks whether the *company* has
management practices of a defined shape. It is procedural, organizational, and it does not have an
outcome to come back bad.

**ISO/IEC 42001** is the standard you will be shown, and it is worth understanding precisely because
it is legitimate. It specifies requirements for establishing, implementing, maintaining and
improving **an AI management system** — governance, roles, competence, risk identification, controls
across the AI lifecycle, internal audit, management review. It is a **management system standard,
not a technical specification for an individual AI system.** It certifies organizational processes
and governance; it does not certify the fairness or performance characteristics of any particular
model. Nor does certification amount to compliance with the EU AI Act.

So:

> **ISO/IEC 42001 tells you the vendor has a process for thinking about this. It does not tell you
> the tool is fair. A vendor answering a fairness question with a certification has changed the
> subject — usually without intending to.**

That last clause matters. This is rarely deception. A salesperson asked "is it fair?" reaches for the
most rigorous-looking evidence available, and a certification *is* rigorous evidence — of something
else. Your job is to notice the substitution and re-ask, which works better when you can name what
each document is.

**Reading an audit summary.** When you do get one, five things determine whether it is usable:

**The population.** On whose data? A general-population audit tells you little about your
applicant pool.

**The date, and the version.** Audits describe a model at a moment. A 2024 audit of a product
updated three times since is a historical document.

**What was measured.** Selection rates by group? Which groups? Both four-fifths and a significance
test, or one? Any intersections?

**What was not measured.** The scope exclusions, which is where the interesting content usually is.

**And what the vendor did about the result.** An audit that found something and produced a change is
worth more than a clean one, because it demonstrates the finding-to-action pathway that Connecticut
weighs and that Module 3 built.

## Lesson 4 · Why this gate is yours

A short lesson about ownership, and it follows from a doctrine rather than a preference.

A tool that screens candidates on your behalf can be treated as acting **as your agent**. The
practical consequence: the employer does not get to say "that was the vendor's system," and the
vendor does not get to say "we only make the software." Responsibility for the outcome sits with the
deployer, jointly with whoever built it.

Which means **your exposure is set at procurement**, by terms negotiated by someone whose success is
usually measured in price and delivery date — and it is set most decisively by the questions nobody
asked.

That is the argument for this gate belonging to whoever can read the answers. Procurement can obtain
a document. Legal can review a contract. **Neither can tell you that a validation study used the
wrong comparison population, or that an audit reported four-fifths without a significance test, or
that a certification answered a different question.** Module 3 gave you that capability, and this
module is the highest-leverage place to spend it, because it is the only point in the lifecycle where
the answer is cheap.

The practical ask is small and it is the ask to make: **one page of fairness questions, owned by
you, that goes into every RFP and every renewal.** Not a veto, not a committee — a page. It costs the
organization nothing, it is easy to say yes to, and it changes what arrives.

## Key takeaways

- **Half of HR buyers now run pre-purchase evaluations of AI systems** `[V]`, with about 17% relying
  mainly on vendor reputation and 75% naming bias a top concern — **published by a vendor selling
  bias auditing**, so use it for direction, not magnitude.
- **Four questions:** validation evidence for a population like ours in writing; what it was trained
  on and **what it optimizes**; what happens to rejected candidates' data (the *Kistler* question,
  asked as a data question); and **what we'd need from you if we were sued** — which is a
  procurement term before signature and a favour after.
- **Silence is an answer.** A question that produces no document has told you that you cannot rely
  on the claim, which is what you needed to know.
- **An audit measures a system's outcomes; a certification attests that an organization runs a
  process.** **ISO/IEC 42001 certifies an AI management system — governance, roles, controls,
  review — not the fairness of any model**, and is not equivalent to EU AI Act compliance. A vendor
  answering a fairness question with a certification has changed the subject, usually without
  intending to.
- **Read an audit on five things:** population, date and version, what was measured, what was **not**
  measured, and what the vendor did about the result. An audit that found something and produced a
  change is worth more than a clean one.
- **The agent doctrine puts this gate in your hands.** The deployer owns the outcome, so exposure is
  set at procurement — by the questions nobody asked. Procurement can obtain a document; only you can
  tell that it answers a different question.

## Take a position

**The claim:** *"A certification is a vendor telling you they have a process. You asked whether the
tool is fair."*

The strongest counter-argument is that **process evidence is the only kind that scales, and demanding
outcome evidence from every vendor is a standard that would eliminate most of the market.** A
fairness audit on your population requires your data, which you cannot give a vendor before you buy;
audits on the vendor's population are of limited relevance to you; and small vendors — often the
ones building the most careful products — cannot fund per-customer validation. On that reading a
management-system certification is not a substitution but a **reasonable proxy for the thing you
actually want, which is a supplier that will behave well when a problem is found** — and insisting
on model-level fairness evidence at procurement filters for vendors with large compliance budgets
rather than for good products.

There is a sharper version. **You cannot audit your way to a fair outcome at the gate, because the
disparity is a property of the deployment, not the tool** — your applicant pool, your job, your
weighting, your configuration. On that argument the gate is close to theatre, and the real work is
all post-deployment, in Module 3.

Take a position on that, in writing, in the activity. The strongest submissions say what they'd
accept from a small vendor with no audit budget — because that is the case where a standard either
holds or reveals itself as a proxy for vendor size.

## Applied activity — "The RFP fairness section"

**Time:** 20 minutes · **Submit:** the page plus a 250–350 word write-up · **Graded against the
rubric below.** Score doesn't matter. Doing the work is where the learning lands.

**Step 1 — Check the files (7 min).** For each system on your Module 2 inventory, what validation or
fairness evidence do you actually hold, in writing, today? Count them. **"Nothing on file" is the
expected answer for most entries** and recording it is the point.

**Step 2 — Write the page (10 min).** One page, reusable, that goes into every RFP and renewal. The
four questions, phrased so a non-answer is recognizable. Plus what you will accept as an answer to
each — because a question with no acceptance standard gets answered with a brochure.

Include a **proportionality line**: what you require from a large established vendor versus a small
one, so the standard doesn't silently become a company-size filter.

**Step 3 — One renewal (3 min).** Name the next contract renewal or purchase where this page could
actually be used, and who you'd have to give it to.

Then the write-up: your evidence-on-file count against your prediction, with direction and size of
the miss; your position on the claim above with the counter-argument addressed — **including what
you'd accept from a small vendor with no audit budget**; and **the one question on your page you
expect the most resistance to**, from your own organization rather than from a vendor.

## Knowledge check — 8 questions

*Unlocks after the applied activity is submitted. Retakes are free and unlimited.*

**Q1.** How should the 50% / 17% / 75% procurement figures be used `[V]`?

- A. As a benchmark to show executives how far behind the organization is
- B. For direction rather than magnitude — they come from a vendor selling bias auditing, reporting on its own audit book ✓
- C. They should not be used at all, since vendor research is unreliable
- D. As evidence that pre-purchase evaluation is now a legal expectation

> **B.** Not false — a claim with an interest attached. A module teaching you to interrogate vendor evidence cannot quote vendor evidence uncritically, and you cannot show the sample or the question wording to an executive.

**Q2.** Why is "what does it optimize?" the more revealing of the training questions?

- A. Because vendors are reluctant to answer it
- B. Because a model optimizing for candidates similar to current high performers has an explicit objective of reproducing your workforce's existing composition — a design decision you may not be able to defend ✓
- C. Because the optimization target determines the model's accuracy
- D. Because it identifies whether the model uses protected characteristics

> **B.** And vendors usually answer it happily, because they are proud of it. The answer tells you what the tool is *for*, which is often not what the fairness discussion assumes.

**Q3.** Why ask about rejected candidates' data as a data question rather than a fairness question?

- A. Because data teams answer more precisely than sales teams
- B. Because the fairness answer will not surface it — and if the system assembles information from beyond what the candidate submitted, you may be in consumer-report territory regardless of whether the model is fair ✓
- C. Because retention periods are contractually negotiable
- D. Because privacy regulators enforce more aggressively than employment regulators

> **B.** This is the *Kistler* question. That case doesn't allege the algorithm was biased — it alleges an FCRA disclosure failure, which is a liability route that runs entirely around fairness.

**Q4.** What makes "what would we need from you if we were sued?" worth asking before signature?

- A. It signals to the vendor that you are a sophisticated buyer
- B. Because before signature it is a procurement term, and after signature it is a request that depends on goodwill ✓
- C. Because it establishes the vendor's litigation history
- D. Because it is required under most state AEDT regimes

> **B.** Can they produce the model version in effect on a given date, the configuration you ran, and the contemporaneous audit? That is either written into the contract or it isn't.

**Q5.** What does ISO/IEC 42001 certify `[V]`?

- A. That a specific AI model has been tested for bias and passed
- B. That an organization has an AI management system — governance, roles, controls, review — rather than that any particular model is fair ✓
- C. Compliance with the EU AI Act
- D. That the vendor's training data is representative

> **B.** It is a management system standard, not a technical specification for an individual system. Legitimate evidence — of something other than what a fairness question asked.

**Q6.** A vendor answers your fairness question by citing its ISO/IEC 42001 certification. What has happened?

- A. Deliberate deception that should end the procurement
- B. A subject change, usually unintentional — a salesperson asked "is it fair?" reached for the most rigorous evidence available, and it is rigorous evidence of something else ✓
- C. An adequate answer, since certification implies fairness testing
- D. A legal misrepresentation

> **B.** Which is why naming what each document is matters: it lets you re-ask without accusing anyone of anything, and re-asking is the whole move.

**Q7.** Which finding in an audit summary is worth *more* than a clean result?

- A. A large sample size across multiple customer deployments
- B. An audit conducted by a Big Four firm
- C. An audit that found something and produced a change — it demonstrates the finding-to-action pathway ✓
- D. An audit covering every protected characteristic

> **C.** It shows the vendor's response-to-results mechanism works, which is the criterion Connecticut weighs and the thing Module 3's protocol is built around. A clean audit demonstrates nothing about what happens when it isn't clean.

**Q8.** What is the sharpest argument *against* this module's gate?

- A. That procurement teams lack the expertise to evaluate fairness claims
- B. That the disparity is a property of the deployment — your pool, your job, your configuration — not of the tool, so no pre-purchase audit can establish it and the real work is all post-deployment ✓
- C. That vendors will refuse to answer these questions
- D. That contract terms cannot bind model behaviour

> **B.** It has real force, and the weaker version of the counter is also worth holding: demanding model-level outcome evidence at the gate filters for vendors with large compliance budgets rather than for good products, which is why the activity asks for a proportionality line.

## Sources and attribution

- **Procurement practice figures** — approximately 50% of HR buyers running formal pre-purchase
  evaluations of AI systems, ~17% relying mainly on vendor reputation, and 75% of HR leaders naming
  bias a top concern. **Published by a vendor whose business is AI bias auditing**, reporting on its
  own audit book; identified as such in Lesson 1 and used for direction rather than magnitude.
  **[V]**
- **ISO/IEC 42001:2023** — an AI management system standard specifying requirements for
  establishing, implementing, maintaining and improving an AI management system. A management
  system standard rather than a technical specification for individual AI systems; it certifies
  organizational processes and governance, not the fairness or performance of a model, and is not
  equivalent to EU AI Act compliance. **[V]**
- **The agent doctrine** — that a tool screening candidates on an employer's behalf may be treated
  as its agent, with the deployer owning the outcome jointly with the builder. Carried from the
  shipped wording used in the HRBP and Recruiting tracks rather than re-derived, so the three stay
  reconcilable. **[V]**
- ***Kistler v. Eightfold AI*** supplies the rejected-candidate-data question; see Module 1. **[V]**
- The four questions, the silence-is-an-answer rule, the audit-versus-certification distinction as
  applied here, and the five-point audit reading are original to this course.
- Structure and topic coverage follow the AI Fluency Framework (Dakan & Feller, in collaboration
  with Anthropic, CC BY-NC-SA 4.0); prose is original.
