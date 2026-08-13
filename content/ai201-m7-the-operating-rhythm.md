# AI 201 · Module 7 — The operating rhythm

**Course:** AI 201 · The Practitioner · Module 7 of 8
**Estimated time:** 25 min content · 5 min exercise · 20 min capstone activity
**Prerequisite:** none — but the capstone scores the prediction you made back in M1, so it
assumes your build exists and has run.
**Builds on:** 201 M1 (the cost prediction) · M2 (review cadence) · M4 (sampling, the decay curve) · M5 (audit cadence)

> `Concepts reviewed: [DATE] · Examples current as of: [DATE]`
> Stable layer throughout. Rhythms outlive tools — that's rather the point.

---

## Calibration prompt — before you start

*One claim and one number. Scored at the end of the course — and revisited every time something breaks.*

> **"If I stopped maintaining my workflow today, I could name what would break first."**

**True of me, or not true of me?** One sentence, naming a specific element rather than a category.

**And the number**, which you will score in the applied activity:

Your workflow has parts now: a pack, a runbook, a verification budget, maybe an autonomy
profile, a boundary sheet.

**Which part decays first?** Name the specific element — not "the pack" but "the org brief in
the pack" — and the month you'd expect it to go quietly wrong if nobody looked.

## Module brief

Here is how workflows actually die. Not dramatically — no incident, no meeting about it. The
source format shifts slightly in October and the extract step starts dropping a column nobody
graphs. The org brief still says the old structure. The weekly sample quietly stops happening
during the November crunch, and by January the sign-off is a reflex. In March someone asks
whether the workflow is still worth it, and nobody has a number — just a feeling that it used
to be better.

Nothing failed. Everything *decayed*. And every piece of that story was predicted by a module
you've already taken: M2 told you context rots, M4 told you verification collapses under load
when it's priced wrong, M5 told you audit trails need reviewing on a cadence. What none of them
gave you is the thing that makes all of it actually happen in a calendar that's already full:
**a rhythm** — the small, scheduled, boring recurrence that keeps built things alive.

This module is deliberately the least glamorous in the course, and it's the one that separates
practitioners whose workflows survive the year from people who once built something clever. It
has three parts: where the work sits in your real week, how to measure without theater — and
when to kill a workflow that stopped earning its keep, which is a practitioner skill exactly
equal in seniority to M5's refusal.

It's also where a promise comes due. In M1 you predicted what your workflow's task cost you in
hours per month. You're about to find out, with numbers, which direction you were wrong in.

---

## Learning objectives

By the end of this module you should be able to:

1. Fit the maintenance of your workflows into a real week — in minutes, on a calendar, not in
   intentions.
2. Choose three honest numbers per workflow, record a baseline, and know theater metrics on
   sight.
3. Run the review that catches decay while it's cheap: samples, stamps, approval logs, and the
   one question per pack item.
4. Retire a workflow deliberately — with the criteria written down before sentiment argues.
5. Score a months-old prediction against measured reality, and name your systematic direction.

---

## Lesson 1 · The practitioner's week

The rhythm has to survive your actual calendar — the one with the investigation, the offsite,
and the Thursday that disappears. So it's built from three slots, sized in minutes, and the
sizing rule comes first:

**The maintenance of a workflow must cost a small fraction of what the workflow saves.** If
your build saves five hours a month, its rhythm gets fifteen to twenty minutes of that back.
The moment maintenance creeps past that fraction, you don't have an efficiency; you have a
hobby. (Retirement, Lesson 3, is where hobbies go.)

**Per run — seconds, embedded.** The checkpoint glances (M3), the person-test where it applies
(M6), the sign-off's reading list (M4). These aren't calendar items; they're built into the
run's shape, which is why the modules made them cheap. If a per-run check needs willpower,
it's priced wrong — that's M4's repricing signal, again.

**Weekly — ten minutes, scheduled.** One recurring block: run the M4 sample for the week,
glance at the approval log if you're on rung 2 (how often did you decline? — that's ladder
evidence accumulating), and note anything that felt off mid-run. The block is sacred in one
specific way: it may shrink, it may move, it may never silently vanish. A skipped week gets
skipped *out loud*, in the log: "skipped, crunch." Two consecutive skips is information.

**Monthly — twenty minutes, scheduled.** The M2 pack review (each volatile item: still true?),
the metrics check against baseline (Lesson 2), a drift-diff against the gold standard, and one
honest question: is this still earning its keep? Monthly is also when the boundary sheet's
re-verify dates get glanced at — not re-researched, glanced.

That's the whole system: seconds per run, ten a week, twenty a month, per workflow. Written
down, it looks almost insultingly small. That's the design. Rhythms fail by being ambitious;
this one is sized to survive the week you're firefighting — because the week you're
firefighting is exactly when the source format shifts.

> ### Try this — 2 minutes
> Open your calendar. Create the two recurring blocks — ten weekly, twenty monthly — named
> after your workflow, before finishing this module. Not as a commitment ritual: because
> Lesson 2 needs the monthly block to exist, and because every module so far has taught the
> same lesson about intentions versus structure.

---

## Lesson 2 · Measurement without theater

You need numbers for exactly two reasons: to know whether the workflow is still earning its
keep, and to be believed when you say so. Both die if the numbers are theater.

**Four numbers per workflow. Not seven. Four.**

1. **Time: minutes per run, measured occasionally.** Not self-reported "hours saved weekly" —
   time an actual run once a month, shuttling included (your M5 measurement was the first of
   these). Multiply by run count for the monthly figure. Compare to the baseline you're about
   to set — the *before* number, which is the M1-audit cost of doing it by hand.
2. **Cost: what the workflow spends to run.** Token or API charges where your deployment
   meters them, the workflow's share of seat licenses where it doesn't, plus the rhythm's
   maintenance minutes priced at a loaded rate. 101 M3 gave you the token economics; this is
   where they get used. A per-run estimate refreshed quarterly is enough precision. Most
   workflow costs turn out to be small — the point of the number is being able to *say* so:
   a CFO who hears "saves six hours a month" asks what it costs within one sentence, and
   "about eleven dollars and forty minutes of maintenance" is the answer that ends the
   conversation. A savings claim without a cost line doesn't survive its first finance review.
3. **Quality: the M4 sample's error rate.** You're already producing this number; the rhythm
   just graphs it. Direction matters more than level: a stable 4% is normal variation; a
   drift from 2% to 6% over three months is decay announcing itself politely.
4. **Use: did the output actually get used?** The debrief opened by the hiring manager, the
   FAQ linked in the channel, the narrative that survived into the exec deck. Roughest of the
   four, gathered lazily ("did anyone use this?" once a month is fine) — and the most honest,
   because a workflow whose outputs nobody uses has an error rate of irrelevant.

**Before/after or it didn't happen.** The baseline is recorded once, in the capstone, from
your M1 audit and first timed runs. Every future "this saves us six hours a month, at a cost
of eleven dollars" traces to it. This is what makes your numbers different from every
AI-enthusiasm anecdote your exec team has heard this year — and when a budget conversation
eventually asks what the team's AI practice is worth, you will be the only person in the room
with a before, an after, and the after's price.

**Theater, so you can spot it** — including in your own reporting: metrics that measure
activity instead of outcome (runs completed, prompts written, "AI touches"), metrics that
can't go down (cumulative anything), self-reported satisfaction with no denominator, and any
number gathered more expensively than the decision it informs. The test for every candidate
metric: *what would I do differently if this number moved?* No answer, no metric.

### Exercise — Signal or theater?

*Three minutes. Commit before you look.*

A practitioner proposes seven metrics for their debrief workflow. Keep four.

1. Cumulative debriefs generated since launch
2. Minutes per debrief, timed monthly, vs. the by-hand baseline
3. "Time saved feels significant" — team survey, quarterly
4. Errors per weekly five-debrief sample, classified
5. Number of prompts in the prompt library
6. Share of debriefs opened by the hiring manager within 48 hours
7. Monthly run cost — token or seat share plus maintenance minutes, estimated quarterly

*(Key at the end. One of the seven is defensible in either pile — the reasoning is the point.)*

---

## Lesson 3 · Retirement — and the review that earns it

**The review, first.** The monthly twenty minutes has a script: walk the volatile pack items
(one question each: *still true?*), read the month's sample tallies for direction, diff one
output against the gold standard, check the four numbers against baseline. Fifteen minutes of
looking, five of acting — a stamp updated, a step prompt tightened, a sample size nudged. Small
corrections, cheap because they're early. The review's job isn't celebration; it's catching
the October column-drop in November instead of March.

**Then, the skill nobody practices: killing your own workflow.** Retirement criteria get
written *now*, while you're fond of the thing, because the person who'll evaluate them in a
year owns sunk costs and a sunk identity — you built this. Three triggers, any one sufficient
to force the question:

- **The economics inverted:** maintenance plus verification now costs a meaningful fraction of
  what the workflow saves, and the trend is wrong.
- **The use number went quiet:** outputs ship and nothing downstream moves. It has an audience
  of one, and the one is you.
- **The world moved:** the source system changed, the task changed shape, or — the good
  ending — the org tooled the problem away properly and your workflow is now a workaround
  with a rhythm.

Retirement is cheap where the course put you: the spec, pack, and runbook archive to a
folder; the calendar blocks delete; a one-line note says what it was, what it saved (you have
the numbers), and why it ended. That note is practitioner history — the M8 portfolio's
quietest, most credible page. What retirement is *not* is failure: a workflow that saved five
hours a month for fourteen months and then stopped being needed is a complete success story
with an ending. The failure mode is the other thing — the zombie workflow, maintained out of
identity, consuming its rhythm slots while its use number sits at zero.

**And close the loop the course opened.** The M1 prediction — hours per month this task cost
you — now has a measured answer. So does M2's pack-size guess, M3's lossiest-step call, M4's
error-rate estimate, M5's shuttling split, M6's census counts. You've been predicting and
scoring for seven modules. The capstone asks the direction question one level up, because
*that* — not any single estimate — is what calibration training is for: when you're wrong
about your own work, which way are you wrong?

---

## Capstone stage 7 · Baseline, rhythm, and the reckoning

**Submit:**

1. **The four numbers, chosen and baselined.** Your workflow's time, cost, quality, and use
   metrics: current values, the by-hand *before* from your M1 audit, and one sentence per
   metric answering "what would I do differently if this moved?" The cost line may be a
   per-run estimate — lazy is fine, absent is not.
2. **The rhythm, installed.** The per-run checks (named, embedded where), and screenshots or
   equivalents of the weekly and monthly blocks on your actual calendar — with their scripts,
   in your words, short enough to run tired.
3. **The retirement clause.** Your workflow's three triggers, quantified where possible
   ("maintenance exceeds 20% of measured savings for two consecutive months"), written to be
   evaluated by a future you with sunk costs.
4. **The reckoning.** Score the M1 prediction: predicted hours/month vs. measured. Then the
   direction paragraph: across all seven predictions so far, which way do you systematically
   miss on your own work — and what will you *do* with that? ("I under-estimate costs and
   over-estimate my own verification appetite, so my next build gets a smaller budget and a
   boring-er first workflow" is the shape. Yours will be yours.)
5. **This module's prediction,** logged: the element you named as first-to-decay, and the
   month. The monthly review will score it — the rhythm grading its own forecast.

### Rubric — 20 points

| Dimension | 5 points |
|---|---|
| **Honest numbers** | Four metrics, each with a baseline and a would-do-differently answer. No theater; the cost line is present; the use metric is genuinely about downstream use. |
| **A rhythm that survives** | Blocks exist on a real calendar, sized to the maintenance fraction, with scripts runnable in a bad week. Skips are logged, not hidden. |
| **The retirement clause has teeth** | Triggers are specific enough that a reluctant future owner couldn't argue past them, and retirement is framed as an outcome, not a failure. |
| **Calibration** | The M1 reckoning is done with real numbers; the direction paragraph names a systematic bias and a concrete consequence for the next build. |

---

## Key takeaways

- **Workflows die of decay, not drama** — and every decay mode was already predicted by an
  earlier module. The rhythm is what makes those modules' answers actually recur.
- **Seconds per run, ten a week, twenty a month.** Maintenance sized to a fraction of savings;
  oversize the rhythm and it stops surviving bad weeks.
- **Four numbers: time against a baseline, cost to run, the sample's error direction, and real
  downstream use.** Before/after or it didn't happen — and the after carries its price.
- **Every metric must answer "what would I do differently if this moved?"** No answer, no
  metric — that one test deletes most theater on contact.
- **Write retirement criteria while you're still fond of the thing.** A retired workflow with
  measured savings is a success story with an ending; a zombie workflow is the actual failure.
- **The reckoning is the point:** seven predictions in, you know which way you miss on your
  own work. The next build starts from that knowledge.

---

## Exercise key — Signal or theater?

**Keep: 2, 4, 6, 7.** The course's four numbers exactly — time against baseline (2), quality
direction from the existing sample (4), real downstream use (6, and the best of the board: it
measures the *hiring manager's* behavior, not yours), and cost (7) — estimated lazily, but
present, because a value claim without a cost line doesn't survive its first CFO.

**Cut: 1 and 5, without ceremony.** Cumulative counts can't go down — they measure elapsed
time, nothing else. Library size measures accumulation, not value; by M2's own hygiene rules a
*shrinking* library is often the healthier sign.

**The arguable one: 3.** Sentiment isn't worthless — a team that hates a workflow is
information. But as proposed it fails the test twice: no denominator, no would-do-differently
answer ("feels significant" moving from agree to strongly-agree changes nothing). If you kept
it, the defensible version is a *repurposed* one — one question, asked at the monthly review,
treated as a smoke detector for the use metric rather than as a number. If you kept it as a
KPI, that's the theater reflex the lesson is after.

---

## Knowledge check — 8 questions

*Unlocks after the capstone is submitted. Retakes are free and unlimited.*

**Q1.** How do workflows usually die?
- A. A visible incident forces a shutdown
- B. Quiet decay: sources shift, samples stop, and months later nobody has a number — just a feeling it used to be better ✓
- C. The model provider deprecates a feature
- D. They rarely die; maintained workflows are stable

> **B.** No single failure, just unattended drift — every mode of which an earlier module
> predicted. The rhythm exists because decay is the default, not the exception.

**Q2.** The sizing rule for a workflow's maintenance rhythm:
- A. As thorough as the workflow is important
- B. A small fraction of what the workflow saves — past that, it's a hobby ✓
- C. One hour per week, standardized across workflows
- D. Whatever the owner can sustain

> **B.** The fraction test keeps the rhythm honest in both directions: enough to catch decay,
> never enough to consume the savings it protects. It's also a retirement trigger when it
> inverts.

**Q3.** A skipped weekly review should be:
- A. Made up with a double review next week
- B. Logged out loud — "skipped, crunch" — because two consecutive skips is information ✓
- C. Avoided by automating the review
- D. Ignored; the monthly review covers it

> **B.** The skip isn't the sin; the silent skip is. A visible skip pattern is exactly the
> M4-style decay signal the rhythm exists to surface — about itself.

**Q4.** Why is "share of debriefs opened by the hiring manager" the strongest of the kept metrics?
- A. It's the easiest to collect
- B. It measures downstream behavior — whether the work product actually matters to its audience ✓
- C. It can be tracked automatically
- D. It correlates with time saved

> **B.** Time, cost, and quality can all look excellent on a workflow nobody uses. The use
> metric is the one that catches the workflow whose quality no longer matters to anyone.

**Q5.** The test that deletes theater metrics on contact:
- A. Can this number be gathered automatically?
- B. What would I do differently if this number moved? ✓
- C. Does this number always increase?
- D. Would an executive find this number impressive?

> **B.** No decision downstream, no metric. (C is a good tell — always-up numbers restate
> elapsed time — but B is the test that also catches subtle theater.)

**Q6.** Retirement criteria are written at baseline time because:
- A. Baselines are required for retirement calculations
- B. The future evaluator owns sunk costs and a builder's identity — the criteria must predate the fondness that will argue with them ✓
- C. Criteria written later would be less accurate
- D. The rhythm has no other place to put them

> **B.** It's a pre-commitment against a bias you can name today and will feel next year.
> Same reasoning as M5's refusal: write the judgment down before the pressure arrives.

**Q7.** A workflow saved five hours a month for a year; then the org's new HRIS made it unnecessary, and it was archived with its numbers. This is:
- A. A failure to future-proof the design
- B. A complete success story with an ending — the failure mode is the zombie, not the retirement ✓
- C. Evidence the workflow was never necessary
- D. A reason to rebuild it against the new system

> **B.** Fourteen months of measured savings is the win; the world moving is trigger three
> working as designed. (D might *also* be true — but that's a new M1 audit, not a reflex.)

**Q8.** The point of scoring the M1 prediction against measured reality is:
- A. Grading the accuracy of the original estimate
- B. Surfacing your systematic direction of error about your own work, and feeding it into the next build ✓
- C. Producing a success number for the M8 portfolio
- D. Proving the workflow was worth building

> **B.** As everywhere in both courses: accuracy isn't the graded thing — direction is.
> Seven predictions produce a pattern; the practitioner's edge is knowing their own lean and
> pricing the next build against it.

---

## Sources and attribution

Builds on 201 M1 (the cost prediction now scored), M2 (rot and review cadence), M4 (sampling,
the decay curve, repricing), M5 (approval-log evidence), M6 (re-verify dates), and 101 M3
(the token economics the cost number spends). The four-number rule and the maintenance
fraction are this course's packaging; the measurement-design warnings have a real literature,
and the theater section in particular is standing on it:

*To be verified against editions and current URLs before publication.*

1. **Goodhart's law, via Strathern, M. — "'Improving Ratings': Audit in the British University
   System," *European Review* 5(3) (1997).** "When a measure becomes a target, it ceases to be
   a good measure" — the one-line ancestry of the entire theater section.
2. **Choi, J., Hecht, G. & Tayler, W. — "Lost in Translation: The Effects of Incentive
   Compensation on Strategy Surrogation," *The Accounting Review* (2012).** Surrogation:
   managing the metric instead of the thing it stands for — the failure the
   would-do-differently test is built to catch.
3. **Forsgren, N., Humble, J. & Kim, G. — *Accelerate* (2018).** The best-known modern case
   for outcome-over-activity metrics and small honest metric sets; the nearest published
   relative of the four-number rule.
4. **Muller, J. Z. — *The Tyranny of Metrics* (2018).** The costs of measurement theater,
   surveyed across fields — useful ammunition when someone asks for the fifth, sixth, and
   seventh number.
5. **Tetlock, P. & Gardner, D. — *Superforecasting* (2015); Lichtenstein, S., Fischhoff, B. &
   Phillips, L. — "Calibration of Probabilities" in *Judgment Under Uncertainty* (1982).** The
   scored-prediction thread that runs through both courses: calibration improves with rapid,
   repeatedly scored feedback — which is what the module-by-module predictions and this
   module's reckoning are for.

Stable layer throughout.
