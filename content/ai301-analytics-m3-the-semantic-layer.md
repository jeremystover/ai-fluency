# AI 301 · People Analytics · Module 3 — The semantic layer

**Course:** AI 301 · The Specialist — People Analytics track · Module 3 of 6
**Estimated time:** 35 min content · 10 min exercise · 30 min applied activity
**Prerequisite:** Module 1 · independent of Module 2, and can be taken earlier
**Position in the track:** Layer 2 of the stack — definitional authority

> `Concepts reviewed: [DATE] · Examples current as of: [DATE]`
> Almost entirely stable. This module is about a problem that does not move.

---

## Claim to contest — before you start

*Commit before you read anything.*

> **"Two people in your company can ask the same attrition question today and get different numbers,
> and neither of them will know."**

**True of us, or not true of us?** Then the harder half: **name the metric where it is most likely to
be happening.**

You'll go and test it in the activity: actually test it, by asking the same question two ways.
Most people who commit to "not true of us" change their answer.

---

## Module brief

Module 1 called definitional authority the second layer of the stack: what the metric *means*, which
denominator, which population, which date basis, whether an internal transfer is attrition.

That has always been part of the job and it has always been slightly unglamorous — the memo nobody
reads, the footnote on the slide, the argument with Finance that gets settled and then unsettled when
someone leaves. What changed isn't that the ambiguity appeared. **The ambiguity became executable.**

When a CFO asks a natural-language question about attrition and gets a number back in nine seconds,
somebody decided which denominator to use. That somebody wasn't a person, it was a resolution step,
it left no record, and it may resolve differently next Tuesday because the model changed underneath.
**The decision still gets made. It just stopped being made by anyone.**

This module is about reclaiming that decision, and about the two harder problems that follow from
it. One about checking, one about how anyone learns to check.

## Learning objectives

By the end of this module you should be able to:

1. Explain what a model does with an underspecified metric question, and why it is worse than an
   error.
2. Write a definition precise enough to be machine-executable, including its edge cases.
3. State the verification problem, why knowing enough to check is a different skill from knowing the
   method.
4. Describe the apprenticeship problem and evaluate the second-brain pattern as a partial answer.
5. Distinguish an executable definition from a valid one, and say why a precise metric can still
   measure the wrong thing.

## Lesson 1 · Definitions become executable

Take one question: *what's our attrition rate in engineering?*

Here's what has to be decided before that has an answer.

- **Numerator.** Voluntary only, or all exits? Are terminations for cause in? Redundancies? Deaths and
  retirements? Fixed-term contracts reaching their end date — a leaver, or an expiry?
- **Denominator.** Headcount at period start, at period end, or average? Average of what: month-ends,
  or a daily average? Does the denominator include people who joined mid-period?
- **Population.** Is "engineering" the cost centre, the reporting line, or the job family? What about
  engineers embedded in product teams? Contractors? The team acquired last year still on legacy job
  codes?
- **Movement.** Is an internal transfer out of engineering attrition? It is a loss to engineering and
  not to the company, and both answers are defensible, which is exactly the problem.
- **Time.** Rolling twelve months, calendar year to date, or annualised from a shorter window? Is
  someone who joined and left within the period in both the numerator and the denominator?

Six families of decision, a dozen defensible combinations, and **a spread between the highest and
lowest defensible answer that is routinely larger than the year-over-year change everyone is
discussing.**

**None of this is new.** What is new is that all of it now gets resolved without a person. The model
picks the most common convention, or the one implied by your column names, or the one it used last
time in a different conversation — silently, plausibly, and with a confident sentence underneath.

**And this is worse than an error, for three reasons.**

It is **invisible**: the answer is well-formed and in the right range, so nothing prompts a check. It
is **unstable**: the same question next month, or from a different person, or after a model update,
can resolve differently, and now two true-looking numbers disagree with no way to trace why. And it
is **unattributable**: when Finance's number differs from yours, the conversation used to be a
disagreement between two people who each had a reason. Now it may be a disagreement between two
resolutions nobody made.

**The fix is not to stop people asking.** They will ask, the tooling will answer, and a function whose
response is *route all questions through us* has volunteered to be a queue. **The fix is that the
decisions are made in advance, written down in a form the machine reads, and owned by a named
person.** That is what a semantic layer is, whether or not you have a product called one, and it is
Layer 2 of the stack, made operational.

## Lesson 2 · The verification problem

Now the harder one, and it is the sharpest observation in this module.

> **Knowing enough to check is a different skill from knowing the method, and the second used to
> imply the first.**

That implication is what has quietly broken. For most of the history of this profession, the only way
to be able to evaluate a cohort curve was to have built one, badly, several times. The checking skill
came bundled with the production skill, free, as a side effect. Nobody had to design for it.

Now a competent analyst can receive a cohort curve they didn't build, in a format they didn't
choose, computed by a process they didn't specify. What can they actually do with it?

**They can check plausibility** — is the shape right, are the magnitudes sane, does it match what
they'd expect. Module 2 spent five lessons explaining why that isn't a check: **plausibility is
exactly the property a well-constructed wrong answer has.**

Three things do work, and they are worth naming because they are what the job becomes.

**Check the inputs, not the output.** You may not be able to re-derive the curve, but you can ask what
population went in and confirm the count against a number you already know. Comp M3's reconciliation
discipline, arriving here as the thing that survives when re-derivation isn't available.

**Check the edges.** Ask for the same figure on a subgroup where you know the answer. Ask for last
year, where you have a published number. **Rebuilding a number you already know is the strongest
check available to anyone** and it doesn't require rebuilding the method.

**Check the resolution, not the arithmetic.** Ask the system *what did you assume?*, which
denominator, which population, which date basis. This is the check that is specific to this era and
it is the one most people never run, because the output doesn't invite it. And notice: **if you have
done Lesson 1's work, the answer is checkable against a written definition rather than against your
memory.** The semantic layer is what makes verification possible for someone who didn't build the
thing.

## Lesson 3 · The apprenticeship problem

Follow Lesson 2 forward one generation and you get the problem this module can't fully solve.

If juniors no longer do the grunt work, **the path by which they learned to check disappears**, and
they will still be the people expected to check, five years from now, with none of the wrong turns
that used to produce the instinct.

Say precisely what is lost, because "juniors learn by doing" is too vague to act on. What the grunt
work taught was: the feel of a distribution that has been contaminated, the memory of the specific
join that dropped the contractors, the experience of presenting a number and being wrong in front of
someone who mattered. **The first two are knowledge. The third is a formative experience, and it is
the one that actually calibrates people.**

This is also the slowest-moving risk in the course. Capability doesn't fall next quarter; it falls
in four years, and by then nobody attributes it correctly — it presents as "we can't hire good
analysts any more," which is a story about the labour market rather than about a decision you made.

**The second-brain pattern is a partial answer, and the module is going to be honest that it is
partial.** Capture reasoning, decisions and dead ends in a durable, queryable form, not just the
final analysis but *why the first three approaches failed*, what the data turned out to be, which
assumption broke. Done well, it preserves the first two things on the list. A junior can query why
the transfer rule exists, and get the reasoning rather than the rule.

**What it does not reproduce is the third thing.** No repository gives you the experience of having
been confidently wrong in front of a stakeholder. If that is where calibration comes from (and the
counter-argument in Module 1 says it is) then the pattern buys you knowledge transfer and not
judgment transfer, and the gap has to be closed deliberately.

Which suggests the uncomfortable practical conclusion: **some production work should be protected
rather than automated, and assigned to the people who do not need to be doing it.** That is a real
cost with no short-term return, which is exactly the kind of cost that doesn't survive a budget
cycle unless somebody names it in advance. Naming it is your job, because you're the only person who
can see the mechanism.

> ### Try this (4 minutes
> Take a rule your team follows that a junior could not derive) the transfer rule, the contractor
> exclusion, the reason one field is never trusted. Is the *reasoning* written down anywhere, or only
> the rule? If only the rule, you have found the first entry for the second brain.

## Lesson 4 · Executable is not valid

The last one, and it is the trap that sits at the end of doing everything else right.

**A definition precise enough for a machine to execute is not thereby a definition of the thing you
meant.** Precision and validity are independent properties, and this module has spent three lessons
making you better at precision.

*Engagement.* *Inclusion.* *Manager effectiveness.* *Productivity.* *Potential.* Every one is a latent
construct measured by proxy, and the proxy is a design choice that travels invisibly into every
downstream finding. You can define your engagement index to six decimal places and have it remain a
weighted average of answers to questions somebody chose in 2019.

Two consequences that are specific to a listening programme and that this function owns.

**AI-written survey items are psychometrics wearing a drafting task's clothes.** Asking a model to
improve the wording of a survey item produces something clearer, better balanced, and often genuinely
better written, and **a reworded item is a different item.** It breaks comparability with every prior
wave, which is usually the entire value of the instrument. A trend line across a wording change is
not a trend line. If you change items, you change them deliberately, you say so, and you either
re-baseline or run both.

**And employees answer open-text questions with AI now.** Nobody has measured what that does to your
signal, and this module isn't going to invent a number for it. What it means practically is
immediate: **verbatim volume and polish have stopped being evidence of engagement with the survey.**
A long, well-structured, articulate comment used to indicate someone who cared enough to write it.
That inference is no longer safe, and any process that weights comments by length or fluency (yours,
or a model's summarisation) is now weighting something else.

**And the highest-stakes case is not a survey construct at all — it is the performance rating.**
Module 2 named it as a confounder: *performance data is a rating produced by the system you're
evaluating.* That is true and it stops short. The prior question is whether the rating **measures
anything**, whether "performance," as operationalised by your scale, your competency definitions
and your calibration process, is a construct with any validity at all.

Note what makes this worse than engagement. **An engagement index has a weak external referent;
a performance rating has none.** A pay range can be benchmarked against a market. A competency
framework is true because your organisation agreed it is, which makes performance and potential the
only major HR instruments whose validity is entirely internal, and they gate promotion, pay and
succession.

Which yields a question worth asking out loud in a room where nobody has: **when a model generates
a competency framework in ninety seconds, what exactly was scarce about the old one?** Not the
document. The **agreement** — and the agreement is what made it operative. That is the same move as
this course's opening: the artifact went to zero and the authority above it didn't.

**The check that survives all of this is the oldest one in measurement:** can you state what would
have to be true for this metric to be measuring something other than what it is named after? If you
can't, you have a number, not a measure.

## Key takeaways

- **The ambiguity did not appear. It became executable.** One attrition question has six families of
  decision under it, and the spread across defensible answers routinely exceeds the year-over-year
  change being discussed.
- **The decision still gets made. It just stopped being made by anyone**, silently, plausibly, and
  possibly differently next Tuesday.
- **Worse than an error in three ways:** invisible (well-formed, in range, nothing prompts a check),
  unstable (two true-looking numbers disagreeing with no traceable why), and unattributable (a
  disagreement between two resolutions nobody made).
- **The fix is not routing questions through you**. That volunteers your function as a queue. It is
  decisions made in advance, written where the machine reads them, owned by a named person.
- **Knowing enough to check is a different skill from knowing the method, and the second used to imply
  the first.** What works now: check the inputs, check the edges by rebuilding a number you already
  know, and **check the resolution — ask what it assumed.**
- **The apprenticeship problem is the slowest-moving risk in the course.** It presents in four years
  as "we can't hire good analysts any more," which is a story about the labour market rather than
  about a decision.
- **The second brain is a partial answer**. It transfers knowledge, not the experience of having been
  confidently wrong in front of someone who mattered.
- **Executable is not valid.** A metric defined to six decimals can still be a weighted average of
  questions somebody chose in 2019. **A reworded item is a different item**, and **verbatim polish
  has stopped being evidence of engagement.**

## Take a position

**The claim:** *"A function whose answer to natural-language analytics is 'route all questions through
us' has volunteered to be a queue."*

The strongest counter-argument is that **the queue is the control, and giving it up is how the
definitional layer gets lost.** Self-service was sold to this profession once already, as dashboards,
and what it produced was a decade of stakeholders confidently misreading their own filters, the
semantic layer is a better version of the same bet, and it has the same failure mode: **a written
definition governs only the questions somebody anticipated.** Real questions arrive underspecified in
ways no dictionary covers, and the moment a system answers them without a human, the function has
handed away Layer 2 in exchange for looking responsive. On that view a deliberate queue (slower,
resented, and correct) is the only mechanism that reliably keeps the decision with the person
accountable for it, and the module has mistaken a governance question for a UX one. Your position has
to say what happens to a question the semantic layer doesn't cover, and who finds out.

## Applied activity — "The three contested metrics"

**Time:** 30 minutes · **Submit:** the three definitions plus a 300–400 word write-up · **Graded
against the rubric below.** Score doesn't matter. Doing the work is where the learning lands.

**Step 1 — Test the claim first (6 min).** Before defining anything, go and find out whether the
opening claim is true of you. Take your most contested metric and **ask for it two ways**, through
whatever natural-language or self-service surface your stakeholders actually use, phrased as two
different people would phrase it. A CFO's version and an HRBP's version. Record both numbers and, if
the tooling will tell you, both resolutions.

If you have no such surface, the test still works: **ask two colleagues to define the metric from
memory, separately.** The disagreement rate is the finding either way.

**Step 2. Define three metrics (15 min).** Your **three most-contested metrics** — the ones that
generate arguments, not the ones that are hardest to compute. For each: numerator, denominator,
population, movement treatment, time basis, and the owner by name.

**Then the graded part: the edge cases.** At least four per metric, because that is where the contest
actually lives. The internal transfer. The fixed-term expiry. The person who joined and left inside
the period. The acquired population on legacy codes. The contractor who converted. The leave of
absence that spans the boundary. **Write the ruling, not the question** — "we don't currently handle
this" is an honest entry and is better than silence, but it is a ruling you now owe someone.

**Step 3. One second-brain entry (5 min).** Take one of the rulings above and write down **why**:
the reasoning, what it was decided against, what would make you revisit it. Not the rule; the
argument. This is one entry, and it should tell you how expensive the full practice would be.

**Step 4 — The validity check (4 min).** For one of the three, answer the oldest question in
measurement: **what would have to be true for this metric to be measuring something other than what
it is named after?** If you can't answer, say so. You have a number rather than a measure, and
knowing which is the point.

Then the write-up: what the two-ways test returned, the edge case that was hardest to rule on and why,
whether your rulings existed anywhere before today, your position on the module's claim with its
counter-argument addressed, and (the honest one) **which of your three definitions you expect
someone to disagree with, and whether you have the standing to make it stick.**

## Knowledge check — 8 questions

*Unlocks after the applied activity is submitted. Retakes are free and unlimited.*

**Q1.** What actually changed about metric ambiguity?

- A. Models introduce new ambiguities that didn't exist in dashboards
- B. Nothing changed about the ambiguity. It became executable, so the decision still gets made but stopped being made by anyone ✓
- C. Stakeholders now ask more sophisticated questions than the definitions anticipated
- D. Natural-language interfaces are less precise than SQL

> **B.** The six families of decision under an attrition question were always there. What is new is a
> resolution step that leaves no record and may resolve differently next Tuesday.

**Q2.** Why is a silent resolution worse than an error?

- A. Because errors are logged and resolutions aren't
- B. Because it is invisible (well-formed and in range, so nothing prompts a check), unstable (two true-looking numbers that disagree with no traceable why), and unattributable ✓
- C. Because models resolve ambiguity less consistently than junior analysts
- D. Because it produces numbers outside the expected range

> **B.** D is the opposite of the problem — a number outside the range would get checked. The danger
> is precisely that it looks right.

**Q3.** Why does the module reject "route all questions through us" as the fix?

- A. Because stakeholders will ignore the policy
- B. Because it volunteers the function as a queue, the tooling will answer regardless, and the fix is decisions made in advance, written where the machine reads them, owned by a named person ✓
- C. Because it slows the organization down more than the errors cost
- D. Because it conflicts with self-service analytics strategy

> **B.** Though see the module's own counter-argument, which makes the serious case that the queue is
> the control. C is a real consideration and is not the module's reason.

**Q4.** What is the verification problem?

- A. That AI-generated analyses can't be reproduced
- B. That checking requires more expertise than producing
- C. That knowing enough to check is a different skill from knowing the method, and the second used to imply the first, because the checking skill came bundled with the production skill ✓
- D. That verification tooling hasn't kept pace with generation tooling

> **C.** The implication broke quietly. Nobody had to design for the checking skill before, because it
> arrived free as a side effect of having built things badly several times.

**Q5.** Which check is specific to this era and most often skipped?

- A. Reconciling the input population against a known count
- B. Rebuilding a figure you already know, on a prior period
- C. Asking the system what it assumed — which denominator, which population, which date basis ✓
- D. Comparing the output against the previous month's report

> **C.** The output does not invite it. And it only becomes a real check once Lesson 1's work exists,
> because then the answer is checkable against a written definition rather than against your memory.

**Q6.** What does the second-brain pattern transfer, and what does it not?

- A. It transfers method but not domain knowledge
- B. It transfers knowledge (the reasoning, the dead ends, what the data turned out to be) but not the experience of having been confidently wrong in front of someone who mattered ✓
- C. It transfers judgment but requires ongoing curation to stay current
- D. It transfers both, provided the capture is disciplined enough

> **B.** Which is why the module calls it a partial answer, and why it lands on the uncomfortable
> conclusion that some production work should be protected rather than automated.

**Q7.** Why is a reworded survey item a problem even when the new wording is better?

- A. Because employees notice changes and respond to them
- B. Because a reworded item is a different item, and it breaks comparability with every prior wave, which is usually the entire value of the instrument ✓
- C. Because AI-written items are less psychometrically valid on average
- D. Because item wording must be approved by the vendor

> **B.** Improved wording is still a change. If you change items you do it deliberately, say so, and
> either re-baseline or run both.

**Q8.** What has stopped being evidence of engagement with a survey?

- A. Response rate
- B. Completion time
- C. Verbatim volume and polish: a long, articulate comment no longer indicates someone who cared enough to write it ✓
- D. The proportion of respondents who leave open text blank

> **C.** Which matters most for any process that weights comments by length or fluency — including a
> model's summarisation of them.

## Sources and attribution

- **The semantic layer framing, the verification problem, and the second-brain pattern as a partial
  answer to the apprenticeship problem** come from a human-authored brief for this track.
- **The six families of decision under an attrition question, the three checks that survive, and
  "executable is not valid"** are original to this course.
- Builds on Module 1 (definitional authority as Layer 2), Module 2 (plausibility isn't a check),
  comp M3 (reconciliation, which is what survives when re-derivation is unavailable), and recruiter
  R5's closed loop, which teaches capturing data against a decision and doesn't reach construct
  validity, which is why Lesson 4 exists.
- The measurement-validity material is standard psychometrics; the application to AI-assisted
  instrument design is this course's.
