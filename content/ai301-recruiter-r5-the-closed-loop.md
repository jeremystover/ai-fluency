# AI 301 · Recruiter · Module 5 — The closed loop

**Course:** AI 301 · The Specialist — Recruiting / TA track · Module 5 of 7
**Estimated time:** 25 min content · 10 min exercise · 25 min applied activity
**Prerequisite:** Module 2 (you need the tier map) · builds on 201 M7 (measurement without theater)
**Position in the track:** the module with the longest half-life

> `Concepts reviewed: [DATE] · Examples current as of: [DATE]`
> The implementation examples and cost figures are **[V]**. The loop is stable — it's the same
> idea every mature measurement practice arrives at.

---

## Calibration prompt — before you start

*One prediction, thirty seconds.*

**Could you answer this today: which interview questions preceded your strong hires?** Not
"could you find out eventually": could you answer it this week, from something that already
exists?

Answer honestly: yes, roughly, or no. Then predict how many of your peers could.

---

## Module brief

Every other module in this track improves a decision. This one is about the thing that makes all
your future decisions better, and almost nobody builds it.

Here is the situation the previous four modules leave you in. Everyone has the same tools. Your
competitor can buy your ATS, your sourcing platform, your assessment vendor, and your scheduling
automation tomorrow — most of them already have. **The only asset in recruiting that cannot be
rented is your own record of who you hired and how they turned out.**

That record is what turns a loop from a process into a system that learns. Without it, every
requisition starts from the same place: the hiring manager's intuition, the recruiter's
experience, and a scorecard nobody has ever validated against an outcome. With it, you can answer
questions no vendor can sell you the answer to, which of your interviewers actually predicts
performance, which questions preceded strong hires, which sourcing channel produces people who
are still here in two years.

The reason nobody builds it isn't difficulty. It's that the payoff is six months away and the
work is unglamorous. This module makes the smallest version that works.

## Learning objectives

By the end of this module you should be able to:

1. Describe the four-stage loop and why breaking any stage collapses it.
2. Design a capture layer that answers one specific question six months from now.
3. Prefer integration over invention, and say why the boring version usually wins.
4. Name what to stop counting and what to start.
5. Run hiring manager calibration from transcripts, the highest-value use of the capture layer
   and the one almost nobody does.

## Lesson 1 · The loop

Four stages, and it only works closed.

**Instrument.** Decide what gets recorded before the process runs. Retroactive capture doesn't
exist — you cannot go back and record what questions were asked in interviews you didn't record.

**Capture.** Store it somewhere a query can reach. Not in a recruiter's notes app, not in
individual scorecards nobody aggregates, and not in a format that requires a human to read fifty
documents to answer one question.

**Analyze.** Ask a question the data can answer. This is where AI genuinely helps, reading
across hundreds of unstructured debriefs to surface patterns is precisely what it's good at, and
precisely what nobody had time to do before.

**Feed back into design.** Change a stage, a question, a rubric, and record that you changed it,
so the next analysis knows which period is which. **This is the stage everyone skips**, and
skipping it converts a learning system into a reporting system: you produce insight nobody acts
on, which trains everyone to stop reading the insight.

The asymmetry worth internalizing: **stages one and four are decisions, stages two and three are
increasingly cheap.** Storage and analysis used to be the hard parts and they aren't anymore.
Deciding what to record, and actually changing something because of it, remain exactly as hard as
they always were — which is why the loop is still rare in a world of abundant tooling.

## Lesson 2 · Worked examples **[V]**

Three real shapes, none of them exotic.

**Structured capture from conversations at scale.** Zapier's goal-setting practice runs the loop
on a non-recruiting process: roughly 91% participation, around 800 conversations analyzed, with
insights routed back into enablement. The relevant lesson isn't the numbers; it's that the
analysis had a *destination* attached before it ran. Somebody was going to receive the output and
change something.

**Interview summaries as an archive.** Docebo's interview summaries accumulate into a record of
which questions preceded strong hires. That's the exact question this module opened with, and the
only reason they can answer it is that somebody decided to store the summaries in a form a query
could reach, which was a decision, not a purchase.

**Integration beats invention.** Landing Point's build ran **inside the ATS**, on roughly $200 a
month and one engineer. This is the example to hold when a vendor proposes a platform: the
capture layer usually wants to live where the data already is, because a system requiring
recruiters to enter information twice will be populated inconsistently within a month and
abandoned within three.

The pattern across all three: **buy the boring, build only the part that's yours.** Storage,
transcription, and search are commodities. The question you're trying to answer in six months is
not, and that's the only part worth your engineering.

> ### Try this — 3 minutes
> Pick one question you'd want answered about your hiring in six months. Now ask: what would have
> to be recorded *starting today* for that question to be answerable? If the answer is "nothing
> new, it's already there," you have a query to run this week. Most people find it's one field.

## Lesson 3 · What to stop counting, and what to start

Metrics inherited from a different era, and what replaces them.

**Stop treating time-to-fill as a headline.** At 254 applicants per posting it is close to a
vanity metric — it moves with req difficulty, market conditions, and how aggressively you cut
corners, and it can always be improved by lowering the bar. It remains useful as an operational
diagnostic and useless as a measure of whether hiring is working.

**Stop counting applications and pipeline volume as success.** Module 1 established that volume
went up while signal went down. Reporting a 40% increase in applicants is reporting that the
collapse reached you.

**Start counting what survives contact with reality:**

- **Quality of signal per stage**, for each stage, what share of the candidates it advanced went
  on to succeed at the next one. A stage that advances everyone is measuring nothing, which is a
  finding you can act on.
- **Hiring manager rework**, how often a hire needed significant support in the first ninety
  days that a better process would have predicted. Uncomfortable, and the closest available proxy
  for whether your loop works.
- **Retention at twelve months by sourcing channel and by loop version.** The single most valuable
  number in recruiting, and it requires only that you record which loop version each hire went
  through.
- **Decline reasons, categorized.** Free capture, and it tells you whether you're losing on comp,
  process length, or something you can actually fix.

The honest caveat: **all of these are slow.** You will not have twelve-month retention data for a
year. Which is exactly why the instrument stage happens now rather than when someone asks.

## Lesson 4 · Hiring manager calibration

The highest-value use of the capture layer, and the one almost nobody attempts.

Once interview records accumulate, you can answer a question that changes how your loops run:
**which of your interviewers are actually consistent, and which move the bar between candidates?**

Specifically, from the record: who scores systematically higher or lower than the panel; whose
scores correlate with subsequent performance and whose don't; whose stated reasons shift between
similar candidates; and who asks different questions of different candidates for the same role,
which is both a signal problem and (Module 6's territory) a disparate-impact problem waiting to
be discovered by somebody less friendly.

AI makes this tractable for the first time. Reading two hundred debriefs for consistency of
reasoning is a task nobody had hours for; it is now an afternoon.

**Two rules, and they're what separate this from something dangerous.** First, it is about the
*interviewer's process*, not their worth — you're auditing consistency of a professional
practice, which is squarely assist-side under 101 M7. Second, **the output goes to the
interviewer first**, as development, before it goes anywhere else. An interviewer who discovers
their calibration report reached their manager before it reached them will disengage, and every
other interviewer will hear about it by Friday.

Handled well, this is the most valuable thing an experienced recruiter can offer a hiring
manager: *"here's how your interviewing actually behaves, and here's the one change that would
make it more predictive."* Nobody else in the organization can say that.

## Key takeaways

- **The only asset in recruiting you can't rent is your own record of who you hired and how they
  turned out.** Everything else your competitor can buy tomorrow.
- **Four stages, and it only works closed:** instrument, capture, analyze, feed back. Everyone
  skips the fourth, which converts a learning system into a reporting system nobody reads.
- **Stages one and four are decisions; two and three are cheap now.** Storage and analysis stopped
  being the hard part; deciding what to record and actually changing something did not.
- **Integration beats invention** `[V]`: the capture layer wants to live where the data already
  is. A system requiring double entry is inconsistent in a month and abandoned in three. Buy the
  boring, build only the part that's yours.
- **Stop headlining time-to-fill and application volume.** Start on signal quality per stage,
  hiring manager rework, twelve-month retention by channel and loop version, and categorized
  decline reasons. All slow, which is why you instrument now.
- **Hiring manager calibration from the record is the highest-value use and almost nobody does
  it.** It's about the interviewer's process, not their worth — and the report goes to them
  first.

## Take a position

**The claim:** *"The only asset here you can't rent is your own record of who you hired and how
they turned out."*

The strongest counter-argument is **turnover and time-scale.** Recruiting teams, hiring managers,
role definitions, and even business models change faster than the twelve-month outcome data
accumulates, so by the time your record is large enough to be useful it may describe a company
that no longer exists. On that view the record is an asset with a short half-life, and the
resources it takes might be better spent on the loop design that Module 4 says matters more. Your
position has to engage that.

## Applied activity — "The capture layer"

**Time:** 25 minutes · **Submit:** the design plus a 250–350 word write-up · **Graded against the
rubric below.**

Design the capture layer for your live requisition, and be ruthless about scope. **A design that
records four things and gets built beats one that records twenty and doesn't.**

**Step 1 — Name the question (5 min).** **One** question you want answerable in six months. Specific
enough to have an answer: not "is our hiring effective" but "does the technical screen predict
who passes the panel?"

**Step 2. Work backwards to the fields (8 min).** What must be recorded, starting now, for that
question to be answerable? For each: where it lives, who records it, and whether it's captured
today. If a field requires anyone to enter data twice, redesign it or cut it.

**Step 3. Name the reviewer and the cadence (5 min).** Who looks at this, how often, and what
decision they're expected to make. **A capture layer with no named reviewer is storage**, and the
feed-back stage is the one everyone skips.

**Step 4 — Say what changes (4 min).** If the answer comes back one way, what do you change? If it
comes back the other way? If you can't answer both, the question wasn't decision-relevant and you
should pick a different one.

**Step 5. Score the prediction (3 min).** Could you answer the strong-hires question today? What
did you predict for your peers, and what does the gap suggest?

Then the write-up: the question, the smallest set of fields that answers it, who owns it, your
position on the claim above with its counter-argument addressed, and the one thing you could
start recording **this week** with no tooling change at all.

## Knowledge check — 6 questions

*Unlocks after the applied activity is submitted. Retakes are free and unlimited.*

**Q1.** Which stage of the loop does the module say everyone skips, and what happens?

- A. Instrument, teams start capturing without deciding what matters
- B. Capture — data ends up in formats queries can't reach
- C. Analyze, nobody has time to read the accumulated records
- D. Feed back, insight gets produced and nothing changes, which converts a learning system into a reporting system nobody reads ✓

> **D.** And the second-order effect is what kills it: people learn the insight doesn't lead
> anywhere and stop reading it. B and C are real failure modes that have become much cheaper to
> solve; the fourth stage is a decision and hasn't got any easier.

**Q2.** Why does the module say integration beats invention? `[V]`

- A. Custom builds are prohibitively expensive for TA functions
- B. The capture layer wants to live where the data already is — a system requiring double entry is inconsistent within a month and abandoned within three ✓
- C. ATS vendors provide better analytics than custom tools
- D. Integration projects have higher success rates than greenfield builds

> **B.** It's about adoption, not cost, though the $200-a-month-and-one-engineer example makes
> both points at once. Buy the boring; build only the part that's yours.

**Q3.** Why is time-to-fill described as close to a vanity metric?

- A. It's difficult to measure consistently across requisitions
- B. It moves with req difficulty and market conditions, and can always be improved by lowering the bar, so it doesn't measure whether hiring is working ✓
- C. It's no longer tracked by modern ATS platforms
- D. Candidates don't care about process speed

> **B.** It stays useful as an operational diagnostic and fails as a headline measure of success.
> The improvable-by-lowering-the-bar property is the disqualifying one.

**Q4.** What makes "quality of signal per stage" a useful measure?

- A. It can be reported weekly, unlike retention data
- B. It shows which stage removes the most candidates
- C. It reveals whether each stage's advanced candidates went on to succeed at the next — and a stage that advances everyone is measuring nothing ✓
- D. It correlates strongly with candidate satisfaction

> **C.** It turns Module 1's diagnosis into an ongoing measurement: a stage with no
> discriminating power shows up in the data rather than only in an audit. B is throughput, which
> is what you're trying to stop headlining.

**Q5.** What are the two rules governing hiring manager calibration from the record?

- A. Anonymize interviewers, and report only aggregate patterns
- B. It's about the interviewer's process rather than their worth; and the output goes to the interviewer first, before anywhere else ✓
- C. Only calibrate interviewers with at least twenty interviews; and exclude senior leaders
- D. Require interviewer consent; and delete records after twelve months

> **B.** The first keeps it assist-side under 101 M7: auditing consistency of a professional
> practice, not judging a person. The second is practical: an interviewer whose report reached
> their manager first will disengage, and everyone else hears about it by Friday.

**Q6.** Why does the activity require you to say what changes under each possible answer?

- A. To satisfy stakeholders who need a business case
- B. Because if you can't say what you'd do under either outcome, the question wasn't decision-relevant and a different one should be chosen ✓
- C. Because it makes the analysis faster to run
- D. Because pre-registering conclusions prevents bias in interpretation

> **B.** It's the cheapest available test of whether a measurement is worth building. D describes
> a real scientific practice but isn't why this step exists here.

## Sources and attribution

- Implementation examples, the goal-setting capture practice at Zapier (participation and
  conversation volume, with insights routed to enablement), interview summaries accumulating as
  a question-to-outcome archive at Docebo, and an in-ATS build at Landing Point at roughly $200 a
  month with one engineer. Publicly reported; re-verified each review cycle. **[V]**
- The four-stage loop, the stop/start metric set, and the hiring-manager-calibration discipline
  (process not worth; interviewer first) are original to this course.
- Builds on 201 M7 (measurement without theater) and 101 M7 (what makes an analysis assist-side).
