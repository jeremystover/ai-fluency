# AI 301 · EX & Internal Comms · Module 8 — The knowledge layer

**Course:** AI 301 · The Specialist — Employee Experience / Internal Comms track · Module 8 of 10
**Estimated time:** 25 min content · 10 min exercise · 25 min applied activity
**Prerequisite:** Module 6 (editorial responsibility) · builds on 201 M5's autonomy ladder
**Position in the track:** the start of Part Three — and the only module argued entirely from craft

> `Concepts reviewed: [DATE] · Examples current as of: [DATE]`
> Nothing in this module is volatile, because there is nothing in it to become stale — see
> Lesson 1. That is a finding about the category, not a gap in the research.

---

## Calibration prompt — before you start

*One claim. Commit before you read anything.*

Here is a factual assertion about your own organization:

> **"Somebody owns our employee-facing knowledge base — not the platform it sits on, the accuracy
> of what's in it — and their name is known."**

**True of us, or not true of us?** Commit to one, in a sentence. If you're claiming true, name them.

Then predict one number: **of your workforce's twenty most common questions, how many could your
current knowledge base answer correctly today?** Out of 20. You'll test it in the activity.

---

## Module brief

Every AI use in this curriculum so far produces a draft that a human owns before anyone sees it.
Modules 5 and 6 are entirely about that human. This module is about the one exception.

An employee-facing assistant — the HR bot, the intranet search agent, the benefits helper — speaks
**to employees, in your organization's voice, unsupervised, at 11pm.** There is no draft stage. There
is no reviewer. Whatever it says is published the instant it's said, to an audience of one who has
no way to know how it was produced and every reason to treat it as the company answering.

You did not deploy a tool. **You published a colleague, and you did it without an editor.**

Most organizations think of this as an IT project or a service-desk efficiency play, and the
business case arrives in tickets deflected. That framing is not wrong about the economics and it is
wrong about the risk, because the thing being deployed is a communication channel with a
person-shaped interface, and every question this track has asked about voice, accuracy, omission and
trust applies to it — with the review step removed.

## Learning objectives

By the end of this module you should be able to:

1. Explain why this module argues from craft rather than evidence, and what that tells you about
   the product category.
2. State why the knowledge base rather than the model is the product, and who should own it.
3. Design a refusal list, and recognize the questions that are disclosures wearing a question's
   clothes.
4. Reason about reliance — what an employee is owed when the assistant is wrong — and evaluate the
   vendor framing of that problem.

## Lesson 1 · Why there are no numbers in this module

Start with an admission, because this track has spent seven modules asking you to check other
people's evidence.

**Preparing this module, we went looking for independent evidence about employee-facing HR
assistants and did not find any.** Not thin evidence. Not contested evidence. The searches returned
vendor blogs, vendor case studies, vendor benchmark reports, and vendor-published statistics with no
stated methodology — deflection rates, accuracy claims, error-reduction ranges, satisfaction scores,
all produced by companies selling the product they describe.

Two named cases circulate in the practitioner literature and are frequently repeated: a widely-cited
internal assistant said to have succeeded because its team curated a very large document corpus, and
a widely-cited failure said to involve an assistant giving wrong answers about equity vesting.
**We could not verify either.** Neither traces to a primary source, a named organization willing to
be quoted, or a published account with enough detail to check. They may well be true. They are not
citable, and this course does not ship on vibes — the standard 101 M6 set applies to us first.

So this module has **no anchor statistic and no worked case study**, and that is deliberate rather
than a gap. It is also, itself, the most useful thing to know before you buy one of these:

> **You are about to make a decision about a product category with no independent evidence base.
> Every number you will be shown in a procurement cycle was produced by someone selling something.**

That does not mean the products don't work. It means the burden of proof is entirely yours, nothing
you are told is checkable, and the only evidence that will ever exist about your deployment is
evidence you generate. Which is what the activity has you start doing.

The rest of this module is argued from craft: from what these systems are, structurally, and what
follows from that.

## Lesson 2 · The knowledge base is the product

The central error in this category is treating the model as the thing you bought.

An employee-facing assistant is a retrieval system with a language model on the front. It finds
material in a corpus you supplied and renders it fluently. Its answers are only as good as that
corpus, and the fluency is constant regardless — **a confident, well-structured, completely wrong
answer about parental leave costs exactly the same to generate as a right one.**

Which gives the reframe:

> **A wrong answer about parental leave is not a model failure. It is a content failure with a
> model's confidence attached.**

The stale policy page has always been there. Before the assistant, it was a nuisance: someone found
it, noticed it looked old, asked a human, and got the real answer. The page's wrongness was
buffered by the difficulty of finding it and by every employee's reasonable instinct to check
something that looked out of date.

The assistant removes both buffers. It finds the stale page instantly, and it renders its contents
in the same confident register as everything else, stripped of the visual cues — the old formatting,
the 2019 date, the departed author's name — that were doing the warning. **Nothing about the content
debt changed. The blast radius did.**

Three consequences.

**Content debt converts from annoyance to liability on the day the assistant goes live.** Every
superseded policy, every duplicate page with an older version, every document nobody archived
because archiving is nobody's job — all of it becomes reachable, quotable, and authoritative-sounding.

**So the corpus needs an owner, and that owner is an EX responsibility rather than an IT one.** IT
owns whether retrieval works. Somebody has to own whether the retrieved thing is true, which is an
editorial function, and this track has spent two modules establishing that editorial responsibility
means a name.

**And the corpus decays continuously**, which makes this a standing job rather than a launch task. A
knowledge base is accurate on the day it's curated and degrades from then on, at a rate set by how
fast your policies change. A launch project with no review cadence is a system that is most accurate
on its first day and least accurate on the day someone finally complains.

> ### Try this — 3 minutes
> Search your own intranet for a policy you know changed in the last two years. Count how many
> documents come back, and how many are the current version. Whatever ratio you find is roughly
> what an assistant would be working from.

## Lesson 3 · Refusal design

The second half of the craft, and the half almost nobody specifies.

Every conversation about these systems is about what they should answer. The more important
question, and the one that will not come up in a vendor demonstration, is **what they must refuse,
and what happens next when they do.**

Three categories that should be refusals in almost every deployment.

**Anything about the employee's own case.** "How much leave do *I* have left," "what is *my* vesting
schedule," "am *I* eligible." The moment an answer depends on an individual's record, the system is
making a representation about a specific person's entitlement, and the cost of being wrong lands on
one identifiable human who acted on it. General policy: answer. This person's application of it:
route to someone accountable.

**Anything touching leave, medical, accommodation, or a protected characteristic.** These are
questions where the answer is often legally consequential, where the employee may be disclosing
something sensitive in the act of asking, and where a chirpy automated response is its own harm
regardless of accuracy.

**Anything that is a disclosure wearing a question's clothes.** This is the one that gets missed, and
it is the most serious thing in this module.

> **A bot that helpfully answers a harassment question has intercepted a report.**

Consider what actually happens. An employee types "what happens if my manager keeps making comments
about my appearance." That is not a policy query. It is a person, probably at night, probably after
a long time working up to it, testing whether this organization is safe to tell. A well-built
assistant will retrieve the anti-harassment policy and render a clear, accurate, four-paragraph
summary of the complaints procedure.

And the moment is gone. Nobody is alerted. No case exists. There is no record that anyone asked. The
employee has been handled instead of heard, by a system that performed exactly as designed, and the
organization's first knowledge of the matter will arrive much later and much more expensively.

The same shape applies to questions about safety concerns, about whistleblowing, about resignation
intent. In each, the question is a bid for contact, and answering it competently is how you miss it.

**Which makes escalation design the actual product.** Three properties:

**Context travels.** The employee should not have to retype what they already typed. A refusal that
dead-ends into "please contact HR" has made the employee's situation worse than if the bot hadn't
existed, because they have now made the effort once and been rebuffed.

**A named destination, not a queue.** Somebody receives this. On these categories, the assistant
should be quieter and warmer than its default register — the correct response to a disclosure is not
a well-formatted policy summary.

**And a designed silence.** For the disclosure categories, there is a strong argument that the
assistant should say very little: acknowledge, offer the human route, and stop. Every additional
helpful sentence is a further reason for the employee to feel the matter has been dealt with.

## Lesson 4 · Reliance, and what the vendors say about it

The last question, and the one that decides what kind of organization you are.

An employee asks the assistant about the enrollment deadline. It answers, confidently, from a page
that hadn't been updated. They act on it. They miss the window and lose a year of coverage.

**What do you owe them?**

Not legally — that is jurisdiction-specific and it is a question for counsel. Practically, and as a
matter of what your channel is for. The employee did what you built the system for them to do. They
had no way to assess its reliability, no visual cue that the underlying page was stale, and a
reasonable belief that the company's own assistant speaks for the company.

There is a vendor answer to this and you will encounter it. It runs, roughly: *if an employee claims
they were given wrong information, the audit log is your defence.*

Read that carefully, because it is a real position, publicly stated, and it tells you what the
product is optimized for. **It reframes an employee's harm as the employer's litigation exposure,
and offers a solution that protects the organization while doing nothing whatsoever for the person
who missed their enrollment window.** The audit log does not restore their coverage. It establishes
what they were told, which is useful only in a dispute — and a dispute is what happens after you
have already failed them.

That framing should not survive this track's teardown, and the alternative is not complicated:

**Decide the make-good in advance.** Before launch, answer the question: when the assistant is wrong
and someone relies on it, what do we do? A named remedy decided in the calm is worth more than a
sympathetic improvisation under pressure, and it is the difference between a system with
accountability and a system with a disclaimer.

**And the disclaimer is not the answer.** "This assistant may make mistakes; verify important
information" appears under most of these deployments. It is honest, it is worth including, and it
does approximately nothing, because it asks an employee to verify an answer they had no way to
verify — if they could check the policy themselves, they wouldn't have asked. A disclaimer that
transfers responsibility to someone without the means to discharge it is decoration.

Which brings this module to the same place Modules 5 and 6 arrived from different directions. Not
*how accurate is it* and not *did we disclose*. **Who owns this sentence?** If the answer is nobody,
you have published a colleague with no editor and no supervisor, and the only remaining question is
how long until it says something you have to answer for.

## Key takeaways

- **This is the only AI in the curriculum that speaks to employees unsupervised.** No draft stage,
  no reviewer, published the instant it's said. You published a colleague without an editor.
- **The module has no statistic and no case study, deliberately.** Independent evidence about this
  product category does not appear to exist — the available material is vendor-produced, and the two
  cases that circulate in practitioner literature could not be verified. **Every number you'll see
  in a procurement cycle was produced by someone selling something**, so the burden of proof is
  entirely yours.
- **A wrong answer about parental leave is a content failure with a model's confidence attached.**
  The stale page was always there; the assistant removed both buffers — the difficulty of finding it
  and the visual cues that used to warn you. Nothing about the debt changed. The blast radius did.
- **The corpus is the product, it needs a named editorial owner rather than an IT owner, and it
  decays continuously** — accurate the day it's curated, degrading at the rate your policies change.
- **Refuse three categories:** the employee's own case, anything touching leave or medical, and
  **anything that is a disclosure wearing a question's clothes.** A bot that helpfully answers a
  harassment question has intercepted a report — nobody is alerted, no case exists, and the employee
  has been handled instead of heard.
- **Escalation is the actual product:** context travels, a named destination rather than a queue,
  and a designed silence on disclosure categories, because every extra helpful sentence is another
  reason to feel the matter is dealt with.
- **Decide the make-good before launch.** The vendor framing — the audit log is your defence —
  converts an employee's harm into the employer's litigation exposure and does nothing for the
  person who missed their window. A disclaimer asking someone to verify what they couldn't verify is
  decoration.

## Take a position

**The claim:** *"You didn't deploy a tool. You published a colleague — and you did it without an
editor."*

The strongest counter-argument is that **this holds the assistant to a standard the thing it
replaced never met, and the comparison that matters is not perfection but the status quo.** Before
the assistant, the employee's options at 11pm were: search an intranet that returns twelve versions
of the same policy with no indication which is current, ask a manager who guesses, or wait three days
for an HR inbox and get an answer from someone junior reading the same stale page. **A system that is
right 85% of the time, instantly, at any hour, may be a substantial improvement on a system that was
right 60% of the time, slowly, and only during office hours** — and refusing to deploy it because it
is imperfect leaves in place something worse for the exact population the caution claims to protect:
shift workers, frontline staff, people without a well-connected manager to ask.

There is a sharper edge. **The refusal list, applied strictly, mostly refuses the questions people
most need answered** — their own case, their own leave, their own eligibility. A system that answers
only general policy and routes everything personal to a human has reproduced the intranet, with a
chat interface and a larger bill.

Take a position on that, in writing, in the activity. The strongest submissions say what the
realistic alternative in *their* organization actually is — because if the honest baseline is a
three-day inbox and a stale intranet, the argument changes shape considerably.

## Applied activity — "The twenty questions and the refusal spec"

**Time:** 25 minutes · **Submit:** the test results and the spec, plus a 250–350 word write-up ·
**Graded against the rubric below.** Score doesn't matter. Doing the work is where the learning
lands.

**Step 1 — Write the twenty (5 min).** Your workforce's twenty most common questions. Take them from
help-desk tickets, the search logs from Module 7, or the questions your team gets asked directly —
not from imagination. If you have Module 7's inventory, use it.

**Step 2 — Test the corpus (10 min).** For each of the twenty, find what your current knowledge base
would give as the answer. Mark each: **correct**, **wrong**, **stale but findable**, or **absent**.
Count the correct ones. That is the number you predicted.

If you have no assistant deployed, run the test against your intranet search — that corpus is what
an assistant would be built on, so the result is the same finding either way.

**Step 3 — The refusal spec (7 min).** For a real or proposed assistant: the categories it must not
answer; for each, the escalation path including **what context travels with the employee**; the named
destination; and the register it should use on disclosure categories.

**Step 4 — Ownership and make-good (3 min).** Who owns corpus accuracy, by name, and how often it is
reviewed. Then the make-good: when the assistant is wrong and someone relies on it, what do you
actually do? Decide it now, in writing.

Then the write-up: your correct count against your prediction, with direction and size of the miss;
your position on the claim above with the counter-argument addressed — **including what the realistic
alternative is in your organization**; and **the one question from your twenty that you would not
want an assistant to answer at all**, with your reason.

## Knowledge check — 8 questions

*Unlocks after the applied activity is submitted. Retakes are free and unlimited.*

**Q1.** Why does this module carry no anchor statistic or worked case study?

- A. Because the technology is too new for research to exist
- B. Because independent evidence about this product category does not appear to exist — the available material is vendor-produced, and the two circulating cases could not be verified ✓
- C. Because statistics about chatbots become stale too quickly to publish
- D. Because the module's argument is ethical rather than empirical

> **B.** Which is itself the most useful thing to know before a procurement cycle: every number you'll be shown was produced by someone selling something, so the burden of proof is entirely yours and the only evidence that will exist about your deployment is evidence you generate.

**Q2.** What makes an employee-facing assistant categorically different from other AI uses in this curriculum?

- A. It uses a larger model than drafting tools
- B. It processes personal data, which drafting tools don't
- C. It speaks to employees in the organization's voice, unsupervised, with no draft stage and no reviewer — published the instant it's said ✓
- D. It operates outside the communications function's control

> **C.** Every other AI use produces a draft a human owns before anyone sees it. This one is a publishing surface with no editor, which is why the module's framing is that you published a colleague rather than deployed a tool.

**Q3.** Why is a wrong answer about parental leave described as a content failure rather than a model failure?

- A. Because models rarely make factual errors in retrieval systems
- B. Because the assistant retrieves from a corpus you supplied — the answer is only as good as that corpus, and the fluency is constant regardless ✓
- C. Because the vendor is responsible for model accuracy under most contracts
- D. Because content errors are easier to fix than model errors

> **B.** A confident, well-structured, completely wrong answer costs exactly the same to generate as a right one. What the assistant changed is not the correctness of your content but the reachability of it.

**Q4.** What did the assistant remove that used to buffer stale content?

- A. The requirement to log in before accessing policy documents
- B. The difficulty of finding the stale page, and the visual cues — old formatting, an outdated date, a departed author — that used to prompt someone to check ✓
- C. The ability of HR to correct wrong answers before employees saw them
- D. Version control on the underlying documents

> **B.** Nothing about the content debt changed. The blast radius did — which is why content debt converts from annoyance to liability on the day the assistant goes live.

**Q5.** Why should the knowledge base have an editorial owner rather than an IT owner?

- A. Because IT lacks access to HR policy documents
- B. Because IT owns whether retrieval works; somebody has to own whether the retrieved thing is true, which is an editorial function and therefore needs a name ✓
- C. Because employees trust HR-owned content more
- D. Because content ownership determines platform licensing

> **B.** And it's a standing job rather than a launch task, because the corpus is accurate the day it's curated and degrades from then on at the rate your policies change.

**Q6.** What is the most serious refusal category, and why?

- A. Questions about the employee's own entitlements, because the cost of error lands on an identifiable person
- B. Questions touching leave or medical matters, because the answers are legally consequential
- C. Questions that are disclosures wearing a question's clothes — a bot that helpfully answers a harassment question has intercepted a report ✓
- D. Questions about compensation, because the data is most sensitive

> **C.** A and B are real refusals and matter. C is worse because the failure is invisible: nobody is alerted, no case exists, no record shows anyone asked. The employee was handled instead of heard, by a system performing exactly as designed.

**Q7.** What are the three properties of good escalation design?

- A. Speed, accuracy, and availability
- B. Context travels so the employee doesn't retype, a named destination rather than a queue, and a designed silence on disclosure categories ✓
- C. Automated ticketing, priority routing, and service-level agreements
- D. Manager notification, HR notification, and an audit record

> **B.** A refusal that dead-ends into "please contact HR" leaves the employee worse off than if the bot hadn't existed — they made the effort once and were rebuffed. And on disclosures, every additional helpful sentence is another reason to feel the matter is dealt with.

**Q8.** How should the vendor position "if an employee claims they were given wrong information, the audit log is your defence" be read?

- A. As sound risk management that every deployment should adopt
- B. As a reframing of an employee's harm into the employer's litigation exposure — it establishes what they were told, which helps only in a dispute, and does nothing for the person who missed their window ✓
- C. As a legal requirement in most jurisdictions
- D. As evidence that these systems are too risky to deploy

> **B.** It tells you what the product is optimized for. The alternative is a make-good decided before launch — a named remedy chosen in the calm, which is the difference between a system with accountability and a system with a disclaimer.

## Sources and attribution

- **No external sources are cited in this module, and Lesson 1 explains why.** A search for
  independent evidence on employee-facing HR assistants returned vendor blogs, vendor case studies
  and vendor-published statistics without stated methodology. **Two cases that circulate widely in
  the practitioner literature — a large-corpus curation success and an equity-vesting failure —
  could not be traced to any primary source and are deliberately not used.** They may be true; they
  are not citable, and this course applies 101 M6's standard to itself first.
- The vendor position quoted in Lesson 4 — that an audit log is the employer's defence against a
  wrong-information claim — is a paraphrase of framing that appears across vendor marketing in this
  category. It is quoted to be examined, not endorsed.
- The publishing-surface framing, the content-debt-to-liability conversion, the
  disclosure-wearing-a-question's-clothes refusal category, the three escalation properties, and the
  decide-the-make-good-in-advance rule are original to this course.
- Structure and topic coverage follow the AI Fluency Framework (Dakan & Feller, in collaboration
  with Anthropic, CC BY-NC-SA 4.0); prose is original.
