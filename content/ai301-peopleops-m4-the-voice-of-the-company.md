# AI 301 · People Ops & HR Technology · Module 4 — The voice of the company

**Course:** AI 301 · The Specialist — People Ops & HR Technology track · Module 4 of 8
**Estimated time:** 30 min content · 10 min exercise · 30 min applied activity
**Prerequisite:** Modules 1–3 · builds on 101 M6 (confident wrongness) and 101 M7 (the assist/decide
line)
**Position in the track:** the largest legal surface in the track

> `Concepts reviewed: [DATE] · Examples current as of: [DATE]`
> **Counsel review required before this module ships, and before you act on Lesson 3.** The
> chatbot-as-notice exposure is identified by employment counsel and is not settled by any decision
> we could find — it is framed in *may* throughout, deliberately. This module tells you which
> questions to take to your own lawyers. It is not legal advice.
> Lessons 1, 3 and 4 are **volatile layer.**

---

## ⚖️ Counsel review required

**Counsel review is required before this module ships, and before you act on Lesson 3.**

The chatbot-as-notice exposure in that lesson is identified by employment counsel and is **not
settled by any decision we could find**. It is framed in *may* throughout, deliberately — and that
hedging is the accurate state of the law, not authorial caution.

Lessons 1, 3 and 4 are volatile layer. This module tells you which questions to take to your own
lawyers. **It is not legal advice.**

## Calibration prompt — the claim to contest

*Commit before you read anything. Thirty seconds.*

**The claim:** *"Your AI has already told an employee something that wasn't true, and you cannot say
which employee."*

**Is that true of your organization?** *True of us* or *not true of us*, and the one sentence you
would defend it with. If you have no employee-facing AI at all, answer for the one you will have —
this module is mostly about what to do before you switch it on.

**And the number you will check:** the activity asks you to put **ten real questions** through your
employee-facing capability and check each answer against the document that governs it. **How many of
the ten will be answered from a document that is no longer current?**

Ten is the denominator. Commit a number between 0 and 10.

---

## Module brief

Every other AI output in this curriculum passes through a human before it reaches anyone who
matters. The HRBP's draft gets read by the HRBP. The comp analyst's model gets presented by the
analyst. The recruiter's summary gets checked by the recruiter.

**Yours goes straight to the employee.** Unmediated, at scale, about their own money and their own
health, in the company's voice. An employee who reads an answer from your service desk does not
experience it as a language model's output. They experience it as **what the company told them**, and
they act on it.

And there is a second asymmetry that nothing else in this curriculum has. Your capability does not
only send. **It receives.** An employee types something into it — and what they type may put the
employer on notice of a legal obligation, whether or not anybody at the company ever reads it.

Those two facts together make this the heaviest module in the track. The good news is that most of
the work is unglamorous and entirely within your control: it is document governance, routing design,
and one honest metric. The bad news is that the parts that are not settled are not settled by
anybody, which is why the counsel gate above is real rather than decorative.

## Learning objectives

By the end of this module you should be able to:

1. Explain why deflection is structurally the wrong metric `[V]`, and name what to measure instead.
2. Argue that the knowledge base — not the model — determines what your capability is competent to
   say, and name three controls over the corpus.
3. Describe the notice problem `[V]` and why escalation routing is a legal control rather than a
   design preference.
4. Design a must-route list that works even though **people do not use the words.**
5. Account for consistency, AI disclosure, and accessibility `[V]` as three distinct exposures on the
   same surface.

## Lesson 1 · Deflection is the wrong metric **[V]**

Start with the number your vendor will put on the slide, and why you should not accept it.

**Deflection** counts contacts that did not reach a human. It is the standard measure for
self-service, it is easy to compute, and it has one fatal property:

> **Deflection counts an abandoned conversation and a confidently wrong answer exactly the same as a
> genuine fix.**

All three look identical from the outside. The person did not come back to a human, so all three
increment the same counter.

The best-evidenced version of the gap comes from customer service rather than HR. Gartner reported
that **only about 14% of customer service and support issues are fully resolved in self-service**,
from a survey of 5,728 customers fielded in December 2023. The figure that circulates alongside it —
that AI deflects upwards of 45% of queries while roughly 14% reach genuine resolution, leaving about
31 points of gap — is widely attributed to the same research through secondary sources.

**Two caveats, stated because this module is about measuring the right thing.** This is
customer-service data, not HR, and the populations differ in a way that probably matters: your
employees cannot switch providers, and they have to come back. And the 14% is the figure traceable
to Gartner's own release, while the 45%-deflected pairing reaches us second-hand. **What transfers is
the mechanism, not the arithmetic** — do not put 31 points on a slide as though it were your number.

The nearest HR-specific comparison is IBM's, and it points the same way once you read past the
headline. IBM reports its AskHR agent settling roughly **94% of routine requests**, with the residual
**~6%** being the complex and ethical calls that still land with people. That is the company's own
figure and it has not been independently audited — the same standard this curriculum applies to
IBM's widely-repeated attrition-savings claim, which it treats as unverifiable rather than false.

But notice which number is actually useful to you. It is not the 94%. **It is the 6%.** That residual
is where every hard case lives, and it is the entire legal surface of this module. A design that
handles 94% beautifully and routes the remaining 6% badly has not solved the problem; it has
concentrated it.

**So what to measure instead.** Four things, in ascending order of how much they cost and how much
they tell you:

1. **Repeat-contact rate** on the topics the capability handles. Module 2's number. Cheap, and it
   detects a wrong answer that the employee noticed.
2. **Escalation appropriateness.** Of the contacts that *should* have reached a human, how many did?
   This requires deciding the "should" in advance, which is Lesson 3.
3. **Answer correctness against the governing document.** Sample it. This is the only measure that
   catches a fluent, confident, wrong answer the employee accepted — and it is the only one that
   requires somebody to open the source document.
4. **Voluntary return** — Module 2's leading indicator. Do people come back when a human route is
   equally available?

And then the thing to hold onto, because it is the structural version of an argument this
curriculum makes elsewhere:

> **An employee who got a wrong answer and acted on it never appears in any of your metrics.**

They did not come back. They did not complain. They are a satisfied number in your deflection rate
and a live problem in your organization. HRBP M3 makes the general case — automating the "yes" is
comparatively safe, automating the "no" is where risk starts, because the person filtered out never
appears in your data. **This is that argument in its worst location**, because the person harmed here
is not a candidate who never knew. It is an employee who now believes something false about their own
leave entitlement, and the first time you learn about it is when the consequence lands.

## Lesson 2 · The knowledge base is the model's competence

Now the unglamorous half, which is most of the work and almost all of the value.

Teams evaluating an employee-facing capability spend their time on the model. Which model, how good,
how current, what the benchmarks say. That is nearly irrelevant, because **for this use case the
model is not the variable. Your document set is.**

A capable model reading a superseded summary plan description will produce a fluent, well-structured,
confidently wrong answer. A weaker model reading a current, well-scoped document will produce a
correct one. The quality difference between models shows up in tone and edge cases. **The quality
difference between document sets shows up in whether the answer is true.**

Here is the failure inventory, and every item is boring:

- A superseded SPD still sitting in the index alongside the current one.
- A leave policy that changed in March and lives in three places, two of them stale.
- A handbook nobody re-approved, which is authoritative in tone and wrong in two sections.
- A country supplement nobody tagged by country, so it answers for everyone.
- An internal wiki page from 2021 that reads like policy and never was.

And the reframing that makes this consequential rather than tidy:

> **An answer drawn from a superseded document is not a bad summary. It is a misstatement made by
> the employer** — in writing, to an employee, about their own money or health.

The model did not get it wrong. Your corpus did, and the model repeated it faithfully. That
distinction matters because it tells you where to spend: not on evaluating models, on governing
documents.

**A boundary worth drawing.** 201 M3 taught the pipeline that turns a handbook into a policy diff
into a plain-language change note. That is a genuinely useful pipeline and **it is not this.** That
was about *producing* a document. This is about what the document set **entitles** the capability to
say — a governance question about the corpus, not a transformation question about a file.

Three controls, cheapest first:

**1. One source per topic, and remove the others from the index.** Not "mark them superseded" —
remove them. Retrieval does not respect your intentions about which copy is canonical; it respects
what is reachable. This is the highest-yield hour available to you and it is unpleasant, because
deleting documents requires someone to agree.

**2. An effective-date field on every retrievable document, and a rule that the capability may not
answer from a document lacking one.** This sounds like bureaucracy and it is the single best control
in the module, because it converts an invisible failure into a refusal. A bot that says *I can't
answer that, here's who can* is enormously better than one that answers from a 2021 wiki page.

**3. A named owner per topic** whose responsibilities explicitly include the index. Module 1's
accountability column, applied to documents instead of decisions, and it fails the same way when
assigned to a team.

Then the sequencing point, which is where most programmes go wrong: **this is not AI work, and it is
the prerequisite for the AI work.** It is also the first thing cut when a launch date moves. If your
document set is not ready for a topic, **narrow the capability's scope to the topics that are** —
Module 2's rule, arriving with teeth. Launching broadly across an ungoverned corpus does not produce
a slightly worse bot. It produces an employer making written misstatements at scale.

> ### Try this — 3 minutes
> Pick the single topic your service desk gets most questions about. Now find every document in your
> retrievable corpus that touches it. If there is more than one, and you cannot immediately say which
> is canonical, your capability cannot either — and it will pick one.

## Lesson 3 · The notice problem **[V]**

This is the sharpest thing in the track, and the reason this module has a counsel gate.

Your capability receives input from employees. Some of that input is not a question. It is, in legal
terms, **notice.**

Employment counsel analysing chatbots in HR settings identify the following exposure. An employer
**may** receive sufficient notice of a serious health condition supporting a need for leave under
the FMLA, or of a request for reasonable accommodation under the ADA, **through a chatbot
interaction** — and where the chatbot does not respond appropriately, the employer **may** face a
claim of interference with or denial of rights under those statutes. Separately, where an employee
volunteers details of a health condition while seeking benefits information, the employer **may**
hold obligations to protect and retain that communication as confidential medical information. And
the EEOC's position on vendor-mediated disclosures reaches situations where the employer never saw
what was said.

**Carry the modality accurately.** Every one of those is *may*. They are risk analyses from
employment counsel, not holdings, and we did not find a controlling decision on chatbot-as-notice.
That is not a reason to discount them — it is the reason the gate at the top of this module exists.
The exposure is identified by the people who defend these claims for a living, and the boundaries
are unsettled.

The operational consequence does not depend on how the law resolves:

> **Notice to the bot is notice to you.**

Which converts escalation routing from a design preference into a control. It is not about employee
experience. It is about whether an obligation attached to your organization at 11pm on a Sunday and
nobody knows.

**The must-route list.** These reach a human, and the capability should say so plainly rather than
attempting an answer:

- Accommodation requests, however phrased
- Any medical disclosure, including incidental ones
- Leave intent, including "thinking about"
- Harassment, discrimination, retaliation, or safety reports
- Resignation or constructive-dismissal intent
- Anything naming a lawyer, a regulator, a claim, or a tribunal

And then the hard part, which is why most implementations of this list do not work:

> **People do not use the words.**

*"I'm struggling to get in for 9am since my treatment started"* is an accommodation request
containing neither the word accommodation nor the word disability. *"Is there any way to reduce my
hours for a while, my mum's not well"* is potentially FMLA notice phrased as a scheduling question.
*"I don't think I can keep working for him"* may be a resignation, a harassment report, or neither.

So keyword routing fails, and it fails in the direction that hurts. Three design consequences:

**Route on topic proximity and uncertainty, not on trigger words.** If a question sits near leave,
health, discipline, or conduct, and the capability's confidence is anything short of high, it goes to
a human. The rule is about the *neighbourhood*, not the vocabulary.

**Accept a false-positive rate a product manager will dislike.** Over-routing costs you a coordinator
reading something they did not need to. Under-routing costs you a statutory obligation nobody
noticed. Those are not symmetrical and the design should not treat them as though they were.

**Never let the capability close the loop on a routed item.** "I've passed this to the team" is fine.
"You'll need to submit a leave request within 15 days" is the capability giving advice on a matter it
was just instructed not to handle.

And the consequence that lands on Module 7: whatever the employee typed **is now a record.** If it
contains health information it may need handling different from the rest of your chat logs — which
collides directly with the retention arithmetic in Module 7, and with any legal hold.

## Lesson 4 · Consistency, disclosure, and access **[V]**

Three more exposures on the same surface. Each is short and none of them is optional.

**Consistency, which now cuts both ways.** Two employees in materially identical circumstances
receiving different answers used to be an anecdote that surfaced only if the two of them compared
notes. Now it is **logged, at scale, with timestamps.** That is genuinely the best evidence you will
ever have that your function treats people the same way — and it is the best evidence anyone else
will ever have that it does not. The log is not neutral; it is a record that will be read by whoever
has the most to gain from it. Which is an argument for reading it first, yourself, on a sample.

**Disclosure.** Under Article 50 of the EU AI Act, a person interacting with an AI system must be
told so **at the first point of contact** — not in a terms-of-service page they will never open. This
became enforceable on **2 August 2026**, and the detail that matters for you is in Module 7: it was
**not** deferred with the high-risk employment obligations. An organization with no high-risk AI at
all is caught by this simply by operating a chatbot. If your service desk assistant does not announce
itself, that is a same-quarter fix and not a roadmap item.

**Access.** An AI-first support channel that a screen-reader user cannot complete is an access
problem, and the EEOC has said employers must ensure AI tools are accessible to workers with visual
disabilities. There is a specific trap here worth naming: if the capability is the **only** route to
something with a deadline — an enrollment window, a leave request, a claim — then accessibility stops
being a quality-of-experience question and becomes the difference between an employee meeting a
deadline and missing one.

Which produces a rule that is easy to state and frequently violated in the name of driving adoption:

> **Always keep a human route, and never make it harder to find than the bot.**

Module 2's IBM case is the evidence. The mandate that removed the human route drove satisfaction from
+19 to −35. Adoption pressure and accessibility point in opposite directions, and only one of them
is a legal obligation.

## Key takeaways

- **Deflection counts an abandoned conversation and a confidently wrong answer identically to a
  genuine fix** `[V]`. Gartner found only ~14% of customer service issues fully resolved in
  self-service (n=5,728, fielded December 2023) — customer-service data, not HR, and the widely-quoted
  45%-deflected pairing reaches us second-hand. The mechanism transfers; the arithmetic should not go
  on your slide.
- **The useful number in IBM's AskHR figures is the 6%, not the 94%** `[V]` — the residual is where
  every hard case lives and it is this module's entire legal surface. And the 94% is unaudited
  self-report.
- **Measure repeat contact, escalation appropriateness, answer correctness against the governing
  document, and voluntary return.** Only the third catches a fluent wrong answer the employee
  accepted.
- **An employee who got a wrong answer and acted on it never appears in your metrics.** They are a
  satisfied number and a live problem — automate-the-no in its worst location.
- **The model is not the variable; your document set is.** An answer from a superseded document is
  **not a bad summary, it is a misstatement made by the employer.**
- **Three corpus controls:** one source per topic with the others *removed from the index*, an
  effective-date field with a rule that the capability may not answer without one, and a named owner
  per topic. If the corpus is not ready, **narrow the scope** rather than launching broadly.
- **Notice to the bot is notice to you** `[V]`. Counsel identify chatbot interactions as capable of
  constituting FMLA or ADA notice, with interference exposure where the bot responds inappropriately —
  framed in *may*, unsettled, and the reason this module carries a counsel gate. Escalation routing is
  a legal control, not a design preference.
- **People do not use the words.** Route on topic proximity and uncertainty rather than keywords,
  accept an asymmetric false-positive rate, and never let the capability close the loop on something
  it just routed.
- **Consistency is now logged and cuts both ways. Disclosure at first contact has been enforceable
  since 2 August 2026. And always keep a human route, never harder to find than the bot** `[V]`.

## Take a position

**The claim:** *"Deflection measures that they stopped asking you. It does not measure that they got
the right answer — and for leave and accommodation, those are two different legal facts."*

The strongest counter-argument is that **this proves far too much, and applied consistently it would
condemn every self-service channel HR has ever built.** Your intranet policy page answers employees
with no human verifying comprehension. Your benefits portal FAQ can be out of date. The printed
handbook cannot escalate an accommodation request, has never once noticed that somebody mentioned a
medical condition, and nobody has ever measured whether a reader acted on it correctly. HR has
deflected for thirty years. On this view the assistant is not a new legal category at all — **it is a
better search box**, and holding it to a standard your static content has never met is a double
standard with a predictable outcome: the capability gets scoped into uselessness, employees go back
to the stale intranet page, which is *worse*, and no one's rights are better protected than before.

That argument is strong and it deserves a real answer rather than a caveat. Your position has to say
what makes conversational answering **different in kind** from a policy page — and if your answer is
that it feels authoritative and personalized, you have to say whether that is a legal distinction or
an aesthetic one.

Two candidate distinctions are available to you, and you should either use them or explain why they
fail. **A policy page cannot receive anything** — it has no inbound channel, so it can never be put
on notice. And **a policy page does not personalize** — it states a general rule the reader must
apply to themselves, where an assistant tells *this* employee what applies to *them*, which is
closer to advice than to publication. Whether those two differences carry the weight the claim needs
is the thing to argue.

## Applied activity — "Ten questions and three disclosures"

**Time:** 30 minutes · **Submit:** the ten results, the three routing tests, and a 300–400 word
write-up · **Graded against the rubric below.** Score doesn't matter. Doing the work is where the
learning lands.

**Before you start, two rules.** Use **your own test account** and **your own test messages** — do
not read, quote, or paste any real employee's conversation, and do not submit anything
employee-identifying. The questions come from your queue's *topics*, not from anybody's transcript.
And if your organization has no employee-facing capability yet, run the ten questions against
whatever your employees would use today — the intranet, the portal, the handbook — and answer the
same questions about it. The exercise works either way and the comparison is instructive.

**Step 1 — Ten questions (12 min).** Pick the ten most common question *topics* from your queue and
ask them yourself. For each, record the answer you got and **the document that actually governs it**,
then mark whether the answer was: correct against the current document; correct against a superseded
document; incomplete; or wrong. The middle category is the one to watch — a fluent answer sourced
from a stale document is this module's central failure and it will not look like a failure.

**Step 2 — Three routing tests (8 min).** Send three messages that **should** reach a human, written
the way an employee would actually write them — **without using the trigger words.** One with an
implied accommodation need, one with implied leave intent, one implying a conduct or treatment
concern. Record exactly what the capability did. If it answered instead of routing, keep the output;
that is the finding.

**Step 3 — The corpus check (5 min).** For your single highest-volume topic: how many documents in
your retrievable corpus touch it, which one is canonical, do they carry effective dates, and who owns
the topic by name?

**Step 4 — Disclosure and route (3 min).** Does the capability announce itself as AI at first
contact? And is the human route available and no harder to find than the bot? Two yes/no answers and
what you would change.

**Step 5 — Score the prediction.** Your predicted count of answers-from-stale-documents against what
you found, out of ten.

Then the write-up: your position on the claim above, engaging the search-box counter-argument
directly — say whether receiving and personalizing are the distinctions that carry it, or whether the
claim needs narrowing; whether the opening claim turned out to be true of your organization; and the
specific commitment — **which document you are removing from the index this month, and who has to
agree.** One removal beats a corpus-governance plan.

## Knowledge check — 8 questions

*Unlocks after the applied activity is submitted. Retakes are free and unlimited.*

**Q1.** What is structurally wrong with deflection as a metric?

- A. It is difficult to compute consistently across channels
- B. It counts an abandoned conversation and a confidently wrong answer identically to a genuine fix, because all three look like "didn't come back" ✓
- C. It excludes contacts that arrive outside business hours
- D. It cannot be benchmarked against other organizations

> **B.** Which is why the module replaces it with repeat contact, escalation appropriateness, answer
> correctness against the governing document, and voluntary return.

**Q2.** Which of IBM's AskHR figures does the module say is the useful one, and why? `[V]`

- A. The 94% containment, because it demonstrates achievable scale
- B. The 75% ticket reduction, because it is the longest-running measure
- C. The residual ~6%, because that is where every hard case lives and it is the module's entire legal surface ✓
- D. The 40% cost reduction, because it is what funds the programme

> **C.** A design that handles 94% beautifully and routes the remaining 6% badly has concentrated
> the problem rather than solved it. Note also that the 94% is unaudited self-report.

**Q3.** Why does the module say the model is not the variable for this use case?

- A. Because all current models perform equivalently on HR questions
- B. Because a capable model reading a superseded document produces a fluent, confident, wrong answer, while a weaker model reading a current one produces a correct answer — the document set determines whether the answer is true ✓
- C. Because model quality cannot be evaluated without benchmarks
- D. Because vendors do not disclose which model they use

> **B.** Model quality shows up in tone and edge cases. Document-set quality shows up in whether the
> answer is true, which is where the spending should go.

**Q4.** How does the module characterize an answer drawn from a superseded document?

- A. A retrieval error to be fixed in configuration
- B. A misstatement made by the employer, in writing, to an employee, about their own money or health ✓
- C. A model hallucination
- D. An acceptable risk if the error rate is low

> **B.** The model did not get it wrong; the corpus did, and the model repeated it faithfully. C is
> the specific misdiagnosis to avoid — nothing was fabricated.

**Q5.** Which corpus control does the module call the single best one?

- A. Removing superseded documents from the index rather than marking them superseded
- B. An effective-date field on every retrievable document, with a rule that the capability may not answer from a document lacking one ✓
- C. A named owner per topic
- D. Quarterly review of the full document set

> **B.** Because it converts an invisible failure into a refusal — a capability that says "I can't
> answer that, here's who can" is enormously better than one that answers from a 2021 wiki page. A is
> the highest-yield *hour*; B is the best standing control.

**Q6.** What does "notice to the bot is notice to you" mean in practice? `[V]`

- A. That all chatbot conversations must be reviewed by HR staff
- B. That employees must be warned not to disclose medical information to the assistant
- C. That an employee's message may put the employer on notice of an FMLA or ADA obligation whether or not anyone at the company reads it — which makes escalation routing a legal control rather than a design preference ✓
- D. That chatbots must be disabled for leave and accommodation topics

> **C.** Counsel frame this exposure in *may* and we found no controlling decision, which is why the
> module carries a counsel gate. D over-corrects: the answer is routing design, not prohibition.

**Q7.** Why does keyword-based escalation routing fail?

- A. Because employees deliberately avoid trigger words to bypass the system
- B. Because people do not use the words — "I'm struggling to get in for 9am since my treatment started" is an accommodation request containing neither the word accommodation nor disability ✓
- C. Because keyword lists cannot be maintained across languages
- D. Because models cannot reliably detect keywords in long messages

> **B.** So route on topic proximity and uncertainty rather than vocabulary, and accept an asymmetric
> false-positive rate: over-routing costs a coordinator's time, under-routing costs a statutory
> obligation nobody noticed.

**Q8.** Why does the module insist on keeping a human route no harder to find than the bot? `[V]`

- A. Because employees prefer human contact in most surveys
- B. Because accessibility obligations, and the fact that a capability which is the only route to a deadline makes access the difference between meeting that deadline and missing it — while adoption pressure pushes the other way ✓
- C. Because AI disclosure requirements mandate an alternative channel
- D. Because deflection targets should be capped

> **B.** And Module 2's IBM case is the evidence: removing the human route drove satisfaction from
> +19 to −35. C is not what Article 50 requires — that is about disclosure, not alternatives.

## Sources and attribution

- **Gartner** — approximately 14% of customer service and support issues fully resolved in
  self-service, from a survey of 5,728 customers fielded December 2023. The associated
  45%-deflected / ~31-point-gap framing is widely attributed to the same research via secondary
  sources and is **presented here as mechanism rather than as a figure to reuse.** Customer-service
  population, not HR — stated in-lesson. **[V]**
- **IBM AskHR** — approximately 94% of routine requests settled with the residual ~6% being complex
  and ethical calls that still reach people. IBM's own figure, not independently audited; the same
  standard `ai301-hrbp-m3` applies to IBM's attrition-savings claim. See Module 2 of this track for
  the fuller case, including the documented satisfaction collapse. **[V]**
- **Employment counsel analysis of HR chatbots** (Ogletree Deakins and others) — that an employer
  **may** receive sufficient notice of an FMLA-qualifying condition or an ADA accommodation request
  through a chatbot interaction, with interference or denial-of-rights exposure where the chatbot does
  not respond appropriately; and that an employee's volunteered health details **may** create
  obligations to protect and retain the communication as confidential medical information. Plus the
  EEOC's position reaching vendor-mediated disclosures the employer never saw, and its statement that
  employers must ensure AI tools are accessible to workers with visual disabilities. **These are risk
  analyses framed in *may*, not holdings; no controlling decision on chatbot-as-notice was found.
  Counsel review required. [V]**
- **EU AI Act Article 50** — the duty to disclose at first point of contact that a person is
  interacting with an AI system, enforceable from 2 August 2026 and excluded from the Digital Omnibus
  deferral. Full timing and the regulation citation are in Module 7 of this track. **[V]**
- The four replacement metrics, the corpus controls, the must-route list, the
  route-on-proximity-not-keywords rule, and the human-route rule are original to this course.
- Builds on 101 M6 (fluent output deserves scrutiny), 101 M7 and `ai301-hrbp-m3`
  (automate-the-yes-not-the-no, applied here to an invisible harmed employee), 201 M3 (whose
  document-pipeline this module deliberately distinguishes itself from), and Modules 1–3 of this
  track.
- **This module is not legal advice.** It is a guide to which questions to take to your own counsel,
  and Lesson 3 should not be acted on without them.
