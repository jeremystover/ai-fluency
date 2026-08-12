# AI 301 · Recruiter · Module 4 — Designing signal that's expensive to fake

**Course:** AI 301 · The Specialist — Recruiting / TA track · Module 4 of 7
**Estimated time:** 25 min content · 10 min exercise · 25 min applied activity
**Prerequisite:** Module 1 (the diagnosis) and Module 3 (the loop inherits the scorecard)
**Position in the track:** the signature module — where the diagnosis becomes a design

> `Concepts reviewed: [DATE] · Examples current as of: [DATE]`
> The validity coefficients and policy examples are **[V]**. The design principle is stable, and
> the selection science it rests on predates AI by decades.

---

## Calibration prompt — before you start

*One prediction, thirty seconds.*

Rank these five selection methods by how well they predict job performance, best first: **general
mental ability tests · structured interviews · unstructured interviews · years of relevant
experience · biodata (structured background information).**

Write your ranking down before Lesson 1. Most people get the top two the wrong way round, for a
reason that was the field's consensus until quite recently.

---

## Module brief

Module 1 told you the signals collapsed. Module 3 told you the loop inherits the scorecard. This
module is where you rebuild the loop so that what it measures survives contact with tools that
both sides now have.

The good news arrives from an unexpected direction: **the methods that survive AI are, almost
exactly, the methods that were always better.** The selection science was re-examined recently and
the ranking changed — and the methods that came out on top are the ones a candidate cannot
outsource, while the ones that fell are the ones AI makes free.

That's a rare piece of luck. You are not being asked to trade rigour for defensibility. You are
being asked to stop doing the things that were never predictive and became indefensible.

Then the decision this module forces: **your candidate AI policy.** There are two coherent
positions and one losing one — and the losing one is the position most organizations currently
hold by default.

## Learning objectives

By the end of this module you should be able to:

1. State what the revised selection science says about which methods predict performance.
2. Design for expensive-to-fake rather than detection — and say what "expensive" means precisely.
3. Choose between ban-and-verify and require-and-grade, and explain why incoherence is worse than
   either.
4. Handle verification at the right stage, through the right channel.
5. Rebuild one interview loop and write a candidate-facing AI policy in under 150 words.

## Lesson 1 · What actually predicts performance **[V]**

For decades the field's consensus, from a foundational 1998 meta-analysis, was that general mental
ability was the strongest single predictor of job performance. A great deal of assessment product
was built on that.

In 2022, Sackett, Zhang, Berry and Lievens re-examined the underlying meta-analytic estimates and
found a **systematic overcorrection for range restriction** running through decades of the
literature. Correcting it re-ranked the field:

| Method | Corrected validity `[V]` |
|---|---|
| **Structured interviews** | **≈ .42** |
| Job knowledge tests | ≈ .40 |
| **Biodata** | **≈ .38** |
| **General mental ability** | **≈ .31** |
| Years of experience | near the bottom |
| Unstructured interviews | near the bottom |

Two things follow, and the second is the one this module is built on.

**Structure is the active ingredient.** The same conversation, with defined competencies, the same
questions in the same order, and independent scoring against a rubric, roughly doubles the
predictive value of an unstructured version of itself. That is a process change, not a purchase.

**And the ranking maps almost perfectly onto fakeability.** Look again: the methods at the top
require *demonstrated behaviour under observation*. The methods at the bottom — years of
experience, credentials, unstructured conversation — are the ones a language model can produce a
convincing version of in seconds. The evidence and the AI-resistance point the same way, which
means you can make this argument to a hiring manager on effectiveness grounds without ever
mentioning AI.

## Lesson 2 · Expensive-to-fake by design

"Expensive" is doing precise work here. Three costs a faker cannot compress:

**Time they can't compress.** Not "takes a long time" — *cannot be produced faster with a tool*. A
take-home essay takes a candidate four hours or four minutes depending on their tooling. A live
working session takes forty minutes for everybody.

**Presence they must supply.** Real-time, responsive, with follow-ups that depend on what they just
said. The value isn't surveillance; it's that a conversation branches, and a branching conversation
cannot be pre-generated.

**Specificity they can't generate.** Details of work they actually did — what broke, what they'd
do differently, who disagreed and how it resolved. A model can produce a plausible project story;
it cannot produce *their* project's second-order details under follow-up, because those details
were never written down anywhere.

Which yields three design moves:

**Work-sample-first and observed.** The single highest-leverage change available. Give a realistic
task, watch some portion of it happen, and ask about the reasoning rather than the output. Note
that AI use during it is now *fine* — you're evaluating how they think with the tools they'll
actually have, which is what the job involves.

**Live defence over polished submission.** If a take-home stays, its function changes: it becomes
the material for a conversation rather than an artifact to be scored. "Walk me through why you
made this choice, and what you'd do if the constraint changed" is unfakeable in a way the
document never was.

**Follow-up depth over question breadth.** Three questions with four follow-ups each beats twelve
questions with none. Prepared answers survive the first question and fall apart on the third —
and this costs nothing to implement.

**And the thing to stop doing:** scoring polish. Written communication quality in an application
is now approximately free and therefore approximately uninformative. If your rubric rewards it,
you are selecting for tool access.

> ### Try this — 3 minutes
> Take the highest-scoring stage from your Module 1 signal audit. Add one follow-up question that
> can only be answered from real experience — *"what surprised you about that?"* is a good default.
> That single addition typically moves a stage from a 1 to a 2 on the audit scale.

## Lesson 3 · The policy fork **[V]**

Your candidates are using AI. You need a stated position, and there are exactly two coherent ones.

**Ban-and-verify.** AI use prohibited in assessment stages, and your process is built so that
matters — which means live, observed, follow-up-heavy stages where the prohibition is
*structurally* enforced rather than trusted. The honest version says so plainly: *"our assessment
stages are live because we're evaluating you, not your tools."*

**Require-and-grade.** AI use expected, and how well they use it is part of what you're
evaluating. Canva requires candidates to use AI in parts of its process; Meta has permitted it in
a coding round with AI-generated code verification built into the evaluation. This is
increasingly the honest position for roles where the work itself involves these tools daily —
which is most knowledge work now.

**Incoherence is the only losing choice**, and it is the default state of most organizations: a
policy prohibiting AI, no stage where the prohibition is enforceable, and interviewers privately
assuming everyone uses it. That teaches candidates that your stated process does not mean what it
says — and the ones who learn that fastest are the ones who read your process most carefully,
which is a group you were trying to select *for*.

Two rules whichever fork you take. **Say it in the invitation, not in the fine print** — a
candidate who discovers your policy at the assessment has already prepared for a different one.
And **apply it identically to everyone**, because inconsistently enforced policy is the ban's
disparate-impact problem arriving by a different route.

## Lesson 4 · The detection trap, paid off

Module 1 seeded this. Here is what to do instead.

**Detection tools are vendor claims like any other**, and they get 101 M2's teardown: what's the
evidence, what's the sample, what would falsify it. Recall the asymmetry — confidence is
measurable and high, accuracy is not published. A tool sold on a capability with no error rate is
a tool you cannot size the risk of.

**Their false positives are a screening decision with disparate impact**, landing predictably on
non-native speakers, neurodivergent candidates, and anyone who prepared unusually hard. Module 6
covers what that means when the regime requires a bias audit; the design answer is simpler —
**a process that doesn't depend on detection has no false positives to defend.**

**And verification belongs at screening, through official channels, not sprung at offer.**
Employment dates, credentials, references — verify through the issuing institution or the
employer, early enough that a discrepancy is a conversation rather than a rescinded offer.
Verification of *facts* is legitimate and always was. Detection of *tool use* is a different
activity that has been quietly sold under the same word, and separating them is most of what this
lesson is for.

## Key takeaways

- **The methods that survive AI are the methods that were always better** `[V]` — structured
  interviews ≈.42, biodata ≈.38, general mental ability revised down to ≈.31, with experience and
  unstructured interviews near the bottom. You can argue this on effectiveness without mentioning
  AI.
- **Structure is the active ingredient**, and it's a process change rather than a purchase: same
  questions, same order, independent scoring against a rubric.
- **Expensive means three things a faker can't compress:** time, presence, and specificity about
  work they actually did.
- **Work-sample-first and observed; live defence over polished submission; follow-up depth over
  question breadth.** Prepared answers survive the first question and fall apart on the third.
- **Stop scoring polish.** Written quality in an application is free, therefore uninformative — and
  rewarding it selects for tool access.
- **Two coherent policies, one losing default.** Ban-and-verify or require-and-grade; incoherence
  teaches candidates your process doesn't mean what it says, and the most attentive ones learn it
  first.
- **A process that doesn't depend on detection has no false positives to defend.** Verify facts
  through official channels at screening; that is a different activity from detecting tool use.

## Take a position

**The claim:** *"Polished answers are free now. If your loop still rewards polish, you're
selecting for tool access."*

The strongest counter-argument is that **for many roles, polish is the job.** A content marketer,
a customer-facing AE, or a communications hire will use exactly these tools in the work — so a
polished application is a valid work sample rather than noise, and treating polish as
uninformative discards a real signal about output quality. Your position has to engage that,
because for some of your requisitions it's simply correct.

## Applied activity — "Redesign the loop"

**Time:** 25 minutes · **Submit:** the redesigned loop, the policy, and a 250–350 word write-up ·
**Graded against the rubric below.**

Use the requisition you're carrying through the track.

**Step 1 — Score the current loop (5 min).** Carry forward your Module 1 audit: each stage 0–3 on
what it costs a faker.

**Step 2 — Redesign it (12 min).** Rebuild so that at least one stage before the final scores a 2
or higher, using the three moves. For each change, name **which competency from your Module 3
scorecard it tests** — a redesign that doesn't map to the scorecard is a preference, not a design.
Do not add stages: this is a redesign, not an escalation, and lengthening a loop is a real cost
to candidates.

**Step 3 — Write the candidate-facing AI policy (5 min).** **Under 150 words**, in plain language,
stating which fork you chose and what candidates should actually expect. Write it as it would
appear in the invitation email.

**Step 4 — Score the prediction (3 min).** Your opening ranking of the five methods against the
table in Lesson 1. Which pair did you invert, and what does that reveal about the model of
hiring you've been carrying?

Then the write-up: what the loop measures now that it didn't, which stage you removed to make
room, your position on the claim above with its counter-argument addressed, and what you'd tell a
hiring manager who says the new loop is "too much process."

## Knowledge check — 6 questions

*Unlocks after the applied activity is submitted. Retakes are free and unlimited.*

**Q1.** What did the 2022 re-examination of the selection literature find? `[V]`

- A. That structured interviews had been overvalued relative to cognitive testing
- B. A systematic overcorrection for range restriction, which re-ranked structured interviews (≈.42) above general mental ability (≈.31) ✓
- C. That all selection methods have roughly equivalent predictive validity
- D. That validity coefficients cannot be meaningfully compared across methods

> **B.** Decades of estimates carried the same statistical overcorrection; correcting it inverted
> the top of the ranking. And usefully, the corrected ranking maps almost exactly onto
> fakeability — the evidence and the AI-resistance point the same way.

**Q2.** What does the module mean by "structure is the active ingredient"?

- A. That interviews should be longer and cover more competencies
- B. That structured interviews require specialized assessment software
- C. That defined competencies, the same questions in the same order, and independent rubric scoring roughly double an unstructured interview's predictive value — a process change, not a purchase ✓
- D. That structure matters mainly for legal defensibility

> **C.** The same conversation, structured, is a different instrument. D is a genuine side
> benefit that Module 6 covers, but leading with it makes the change a compliance chore rather
> than an effectiveness win.

**Q3.** Which best captures what "expensive to fake" means?

- A. Costly for the employer to administer
- B. Time the candidate can't compress, presence they must supply, and specificity about work they actually did ✓
- C. Requiring specialized knowledge that can't be looked up
- D. Long enough that candidates without genuine interest drop out

> **B.** Note that "takes a long time" isn't sufficient — a take-home takes four hours or four
> minutes depending on tooling. Forty minutes of live work takes forty minutes for everybody.

**Q4.** Why does the module say a work sample should permit AI use during it?

- A. Because prohibiting it is unenforceable in a remote setting
- B. Because you're evaluating how they think with the tools they'll actually have, which is what the job involves ✓
- C. Because AI use improves the quality of work samples
- D. Because prohibiting it creates disparate impact

> **B.** The observed reasoning is the signal, not the artifact. A is true and is a weaker
> argument — enforceability is a reason the ban fails, not a reason the permission is right.

**Q5.** Why is incoherence worse than either coherent policy?

- A. Because it creates legal exposure that a stated policy avoids
- B. Because it teaches candidates your stated process doesn't mean what it says — and the ones who learn that first are the most attentive ones, whom you were trying to select for ✓
- C. Because interviewers apply it inconsistently across candidates
- D. Because candidates will assume the strictest interpretation

> **B.** The selection effect is the sting: your policy is a signal about your organization, and
> the candidates who read it most carefully are the ones you claimed to want. C is a real
> consequence and Module 6 shows why it's also a disparate-impact problem.

**Q6.** What distinction does the module draw about verification?

- A. Verification should happen at offer stage, when the investment justifies the cost
- B. Verification of facts through official channels is legitimate and always was; detection of tool use is a different activity sold under the same word ✓
- C. Verification is only defensible when disclosed to the candidate in advance
- D. Verification should be outsourced to a specialist provider

> **B.** Separating the two is most of the lesson. And facts get verified at screening rather
> than at offer, so a discrepancy is a conversation instead of a rescinded offer.

## Sources and attribution

- **Sackett, Zhang, Berry & Lievens (2022)**, *Journal of Applied Psychology* — the corrected
  meta-analytic estimates addressing systematic overcorrection for range restriction, re-ranking
  structured interviews above general mental ability. The 1998 Schmidt & Hunter meta-analysis is
  the prior consensus it revises. **[V]**
- Published candidate AI policies from employers including Canva and Meta, cited as examples of
  the two coherent forks. Policies change; verify current practice before citing them to a
  hiring manager. **[V]**
- The expensive-to-fake framing, the three design moves, and the
  verification-versus-detection distinction are original to this course.
- Builds on 101 M2 (vendor claim teardown), 101 M7 (screening decisions about people), and
  Module 3 of this track (the loop inherits the scorecard).
