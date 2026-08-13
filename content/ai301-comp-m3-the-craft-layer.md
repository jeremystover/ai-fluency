# AI 301 · Comp & Benefits · Module 3 — The craft layer

**Course:** AI 301 · The Specialist — Comp & Benefits track · Module 3 of 6
**Estimated time:** 60 min content · 10 min exercise · 35 min applied activity
**Prerequisite:** Modules 1–2 · builds on 101 M4 (data tiers) and 201 M2 (the context pack)
**Position in the track:** the longest module, and the one the rest of the track leans on

> `Concepts reviewed: [DATE] · Examples current as of: [DATE]`
> Everything here is **stable layer** except the tooling specifics in Lesson 3, which name
> capabilities rather than products for exactly that reason.

---

## Calibration prompt — before you start

*One claim and one number. Commit both before you read.*

> **"If someone asked me today, I could rebuild my last analysis from its raw inputs, in front of them."**

**True of me, or not true of me?** One sentence. In front of them is the operative phrase — not
*given a quiet afternoon*.

**And the number**, which you will score in the applied activity:

Think about the last analysis you handed to someone who acted on it. A market pricing round, a
merit model, a plan cost projection, an equity refresh.

**If someone asked you today to rebuild it from its raw inputs, in front of them, how confident
are you that every join and every filter would come out the same? Give a percent.**

Not "would the answer be roughly right." Would the *construction* reproduce.

## Module brief

This is the module the rest of the track leans on, and it's the one nothing else in this market
teaches, because it isn't about AI. It's about what has to be true around AI for a number to be
worth presenting.

The premise is uncomfortable and it's aimed directly at you: **your analytical training is the
reason you'll miss it.** You have spent years learning to read a model quickly — scanning for
shape, for whether the magnitudes look plausible, for whether the distribution behaves. That is a
genuinely expert skill and it is exactly the wrong one here, because **shape is the one thing a
model always gets right.** The output will be well-formed. The columns will be sensible, the
percentages will sum, the summary will read like something a good analyst wrote. The failure lives
underneath the shape, in a join that dropped 340 rows or a filter that silently excluded everyone
hired after October.

So this module builds toward one rule, and everything in it is machinery for making the rule
affordable:

> **Never present a number you couldn't rebuild from its inputs, in front of the person asking.**

That rule is not new. What's new is that AI makes it much easier to violate and much cheaper to
satisfy — and which of those two happens is entirely a matter of craft.

## Learning objectives

By the end of this module you should be able to:

1. Explain why analytical fluency increases rather than decreases exposure to model error.
2. Set the perimeter for comp data — what leaves the building, what doesn't, and what gets
   dropped before either question arises.
3. Specify verification explicitly: audit files, row counts, documented joins, reconciliation
   checks the model will not propose on its own.
4. Run the Python-then-Excel double-pass so a finance partner can review formulas the way they
   always have.
5. Build a durable starter kit — insights file, data map, terminology file, reconciliation spec —
   for an analysis you actually run.

## Lesson 1 · Why numerate people are more exposed

The standard story about AI risk in HR is that non-technical people will be fooled by confident
output. For this function, invert it.

**You read a formatted model the way you read a formatted sentence — quickly, and for shape.**
When a table arrives with the right columns, the right row count *approximately*, magnitudes in
the range you expected, and a summary paragraph that says what you thought it would say, your
expert pattern-matcher signs it off in about four seconds. That pattern-matcher was trained on
work produced by humans, where formatting quality correlated with care. A polished deck meant
someone had spent time. **AI severed that correlation.** Polish is now free and care is not, so the
signal you've relied on for a decade points at nothing.

Three specific failures that survive the shape check:

**The silent join.** You join headcount to comp data on employee ID. 340 people fail to match —
international IDs formatted differently, contractors converted mid-year, a rehire with two records.
The join completes. The output is beautifully formatted. Your population is now 340 people short
and every percentage in the analysis is computed on a denominator you didn't choose. Nothing about
the shape of the result tells you this.

**The silent filter.** Somewhere in a multi-step analysis, a step applies a condition that made
sense for that step and then persists. Active employees only — which quietly removes everyone who
left, which is exactly the population a turnover-cost analysis needed.

**The plausible coefficient.** A regression returns a gender coefficient of −1.8%. That is an
entirely believable number. It is believable if the model is right and it is believable if the
model controlled for job level in a way that absorbed the effect you were looking for. **The
number's plausibility is what makes it dangerous** — an implausible number gets checked.

None of these are AI-specific failures. Every one of them has happened in Excel for thirty years.
What changed is the ratio: the analysis that used to take four hours, during which you touched
every step and would have noticed the row count, now takes eleven minutes, during which you touched
nothing. **The errors are the same. The number of eyes on them collapsed.**

And the consequence is asymmetric in a way it isn't elsewhere in HR. A wrong sentence in a policy
draft gets caught by the next reader. **A wrong model gets presented** — to a leadership team, a
comp committee, a board — by someone who is trusted precisely because they're good at this.

> ### Try this — 3 minutes
> Open the last analysis you ran with AI assistance. Find the row count at the start and the row
> count at the end. If you can't find either, you've learned the lesson without needing the rest
> of the module.

## Lesson 2 · The perimeter and the data

Before any of the verification craft, the question of what should be in the tool at all.

101 M4 gave you the data tiers, and individual pay data sits in Tier 4 — the most restricted
material in the building. It is also the core of your work, which means this function has the
worst version of the general problem: **the data you most need to analyze is the data you can
least freely move.**

Three controls, in order of how much they buy you per unit of effort.

**1. Stay inside the perimeter — but know what that actually means.** Enterprise deployments with
zero-retention terms, or a model running in your own cloud tenancy, are a genuinely different risk
posture from a consumer account, and this is the single highest-leverage decision your
organization makes about your work. But the perimeter is a contractual and architectural fact, not
a feeling. Someone in your organization can name your terms. **If you don't know whether your
deployment retains prompts, you don't know your perimeter** — and the correct action is a
ten-minute conversation with whoever signed the contract, this week, before Lesson 3 becomes
relevant.

**2. Drop columns you don't need.** This is the cheapest control in the discipline and it is
routinely skipped in favor of more sophisticated ones. If the analysis is about pay by level and
tenure, then name, employee ID, home address, date of birth, manager name, and job title free-text
are not inputs — they're liability you carried along because they came in the export. **The most
reliable protection for a data element is its absence.** No retention policy, encryption scheme, or
access control is as strong as not having sent it.

Say the quiet part: the reason people don't do this is that dropping columns takes four minutes and
feels like busywork, while anonymization feels like security work. One of them actually reduces the
data at risk.

**3. Pseudonymize, and hold the mapping outside the session.** When you need to trace a record back
— and in comp work you often do, because the outlier is the whole point — replace identifiers with
sequential keys and keep the mapping in a file that never enters the tool. You get individual-level
analysis and re-identification capability, and the tool holds neither name nor real ID.

Two warnings that matter specifically here. **Pseudonymization is not anonymization.** In a
600-person company, "Level 7, Engineering, San Francisco, hired 2019, $340k" identifies one person
regardless of what you called them, and small cuts in comp data are re-identifiable almost by
construction. And **executive comp resists all of this** — there are five of them, their pay is
public in a proxy, and no pseudonym helps. Treat executive analysis as a category where the
perimeter question is the only question.

## Lesson 3 · Verification as craft

This is the heart of the module. The rule from the brief — never present a number you couldn't
rebuild in front of the person asking — is satisfiable, but only if you specify how.

**The load-bearing fact: the model will not propose these checks itself, and its silence is not
reassurance.** It is not withholding a concern. It has no state in which it noticed the 340
dropped rows and decided not to mention them. **Absence of a warning carries no information**,
which is a different thing from a colleague not raising a concern, and it is the single most
common misreading of a model's confidence.

**Demand an audit file.** Not a summary — a file. For every analysis, ask for a companion output
that states: input row count, output row count, and the difference explained; every join with the
key used, match count, and unmatched count on both sides; every filter applied with the rows it
removed; and every record excluded for missing data, listed. This is thirty seconds of asking and
it converts the three failures from Lesson 1 from invisible into visible. **A join that dropped 340
rows is undetectable in the output and unmissable in the audit file.**

Then read it. An audit file you don't read is worse than none, because it feels like control.

**Specify reconciliation explicitly.** State the checks up front, in the instructions, before the
analysis runs: total compensation in the output must equal total compensation in the source; the
headcount must match the HRIS number you already know; the sum of the level bands must equal the
population; last year's figure must reproduce within a stated tolerance. **A reconciliation you
name in advance is a test. One you invent afterward is a rationalization**, because you will
construct it to pass.

The strongest single check available to you: **rebuild a number you already know.** Run the new
pipeline against last cycle's data and see whether it reproduces last cycle's published figure. If
it doesn't, you have learned something before it mattered.

**The Python-then-Excel double-pass.** This one is specific to your function and it is the most
practically useful thing in the module.

Analytical work with AI naturally lands in code — a script that loads, joins, computes, outputs.
That is fast, reproducible, and auditable line by line, and it is also completely unreviewable by
your finance partner, your comp committee, and most of the people whose sign-off you need. They
review formulas. They click a cell and see what feeds it. That is how they have checked work for
their entire careers, and **asking them to trust a script is asking them to stop reviewing your
work, which they will experience as being cut out.**

So do both. Build the analysis in code, then produce a workbook where the calculation is visible in
cells — real formulas, not pasted values — and reconcile the two. Three things fall out of this,
and only one of them is political:

- The reconciliation between the two passes is itself a verification. Two implementations agreeing
  is meaningfully stronger evidence than one implementation looking right.
- Your reviewers keep their method. Nobody is asked to trust a black box.
- Building the visible version forces you to state the logic in a form a human can follow, which
  is where you catch the step you accepted without reading.

The cost is real — this is maybe 30% more work than the code alone. It is also the difference
between a number that survives a comp committee and a number that gets tabled.

**The rule, restated with its teeth in:** if someone asked you to rebuild the number in front of
them, could you? Not "do you trust it." Could you *reconstruct* it, from inputs, live. If not,
you're not presenting an analysis — you're relaying one, and relaying is a thing you do with
someone else's number, under someone else's name.

## Lesson 4 · Durability

Everything above is per-analysis. This lesson is what makes it survive to the next cycle.

201 M2 taught the context pack: reusable material that gives a model the standing information it
needs so you stop re-explaining your world every session. Comp is the domain where that pays back
hardest, because **your vocabulary is a minefield and the model steps on it consistently.**

Four files. Together they're the starter kit, and building one is this module's activity.

**The insights file.** Standing facts about how your organization works that are not in any data
export: your levels and what they mean, your compensation philosophy and target positioning, your
merit cycle timing and mechanics, your geographic differentials and their logic, which populations
are on which plans, the acquisition in 2023 whose employees are still on legacy bands. Every one of
these is something you currently re-explain in every session, and every session you forget one is a
session with a subtly wrong premise.

**The data map.** What each file contains, what each column means, which system it came from, the
key it joins on, the known quirks. *"The `comp_ratio` field in the HRIS export is calculated
against last year's midpoint, not the current one"* is the sentence that prevents an entire class of
wrong answer, and it currently lives in your head.

**The terminology file** — the one that is specific to this function and the reason this lesson
exists. There is a set of terms models reliably fumble because they carry a general-usage meaning
that differs from your technical one:

- **Target vs. actual** compensation. Target bonus is what the plan provides at 100%; actual is
  what paid out. A model asked about "bonus" will drift between them, and a merit model that mixes
  them is wrong in a way that looks fine.
- **Grant date vs. vest date vs. exercise date.** Three dates, three different analyses, and the
  general-usage collapse of all three into "when they got the stock" is a real hazard in equity
  work.
- **FMV vs. strike vs. exercise price.** Related, distinct, and consequential.
- **Range penetration vs. compa-ratio.** Different denominators. Both get called "where they sit in
  the range."
- **Base vs. total cash vs. total compensation vs. total rewards.** Four scopes, routinely
  interchanged, and the difference between them is the entire content of most pay conversations.
- **Merit vs. market adjustment vs. promotion increase vs. equity adjustment.** Distinct budget
  pools with distinct governance. Collapsing them is how a merit budget gets silently overspent.

The file states your definition for each term and instructs the model to ask rather than infer when
a request is ambiguous between two of them. This costs you an hour once.

**The reconciliation spec.** For each recurring analysis, the checks that must pass before the
output is trusted, written down. Not remembered — written. This is what makes Lesson 3's discipline
survive a busy cycle, which is the only condition under which it matters.

**Why bundle them.** The kit converts craft from something you perform when you have time into
something that happens by default, and comp work is seasonal — the merit cycle is the moment your
care is scarcest and your consequences are largest. **A discipline that only operates when you're
not busy is not a discipline.** It's an intention.

## Key takeaways

- **Your analytical training increases your exposure.** You read models for shape, quickly, and
  shape is the one thing the model always gets right. AI severed the correlation between polish
  and care that your judgment was calibrated on.
- **Three failures survive the shape check:** the silent join (rows dropped, denominators changed),
  the silent filter (a condition that made sense once and persisted), and the plausible coefficient
  (believable whether or not it's right, which is why it doesn't get checked).
- **A wrong sentence gets caught. A wrong model gets presented** — by someone trusted because
  they're good at this.
- **Dropping columns beats anonymizing them.** The most reliable protection for a data element is
  its absence. Pseudonymize when you need traceability and hold the mapping outside the session —
  and remember that small cuts in comp data are re-identifiable regardless of what you called
  people.
- **The model will not propose verification, and its silence carries no information.** Demand audit
  files with row counts, documented joins with match and unmatch counts, and every filter's effect.
  Then read them.
- **A reconciliation named in advance is a test; one invented afterward is a rationalization.** The
  strongest check available is rebuilding a number you already know.
- **Python-then-Excel double-pass:** build in code, produce reviewable formulas, reconcile the two.
  Roughly 30% more work, and it keeps your reviewers' method intact rather than asking them to
  trust a black box.
- **The starter kit — insights, data map, terminology, reconciliation spec** — makes the craft
  survive the merit cycle, which is the only time it matters.
- **The rule: never present a number you couldn't rebuild from its inputs, in front of the person
  asking.**

## Take a position

**The claim:** *"Your analytical training is why you'll miss it. You read models for shape, and
shape is the one thing the model always gets right."*

The strongest counter-argument is that **this inverts a real and well-evidenced advantage.**
Numerate practitioners catch magnitude errors, distributional weirdness, and impossible
relationships that non-analytical readers sail past — and they catch them *because* of fast shape
reading, which is a genuine expert skill rather than a bias. On that view the module has taken a
strength and rebranded it as a vulnerability, and the honest correction is narrower: analytical
training protects you against wrong *answers* and does nothing about wrong *construction*, which
is a real gap but a much smaller claim than the one on the tin. Your position has to say whether
the claim as stated survives that narrowing, or whether the narrower version is simply the true
one.

## Applied activity — "The starter kit"

**Time:** 35 minutes · **Submit:** the four files plus a 300–400 word write-up · **Graded against
the rubric below.** Score doesn't matter. Doing the work is where the learning lands.

Pick **one recurring analysis you actually run** — market pricing refresh, merit modeling, plan
cost projection, pay equity review, equity refresh. Recurring matters: the kit's whole value is
that it's there next time.

**Step 1 — The insights file (8 min).** The standing facts about your organization someone would
need to interpret this analysis correctly and that appear in no data export. Levels, philosophy,
positioning, cycle mechanics, differentials, legacy populations. Aim for the things you re-explain
every time.

**Step 2 — The data map (8 min).** Every input file: what it contains, what the non-obvious columns
mean, source system, join key, known quirks. **The quirks are the valuable part** — write down at
least two things that are true about your data that would mislead someone who didn't know them.

**Step 3 — The terminology file (8 min).** At least six terms from your actual work where your
technical meaning differs from general usage, each with your definition and the ambiguity it
resolves. Use the module's list as a starting point, then add the ones specific to your
organization — every comp function has internal terms that mean something local.

**Step 4 — The reconciliation spec (8 min).** The checks that must pass before you'd present this
analysis. Row counts, totals that must tie to a known figure, a prior-period result that must
reproduce within tolerance, populations that must sum. **Include at least one check against a
number you already know**, because that's the strongest one available.

**Step 5 — Score the prediction (3 min).** Your calibration percent against what you now think.
Would your current workflow survive an audit of its joins? Most people revise this number
downward, and the revision is the finding.

Then the write-up: what the kit covers, the two data quirks you'd forgotten were quirks, whether
your workflow would survive the audit, your position on the claim above with its counter-argument
addressed, and — the honest one — **which of Lesson 3's checks you have not been doing.** Naming
one specifically is worth more than a general commitment to rigor.

## Knowledge check — 8 questions

*Unlocks after the applied activity is submitted. Retakes are free and unlimited.*

**Q1.** Why does the module argue that analytical training increases exposure to model error?

- A. Because analysts use AI more heavily than other HR functions
- B. Because expert readers scan formatted output quickly and for shape — and shape is the one thing the model always gets right, so the fast check passes while the construction underneath goes unexamined ✓
- C. Because analysts are more likely to trust statistical output uncritically
- D. Because comp data is more complex than other HR data

> **B.** The skill is real; it's aimed at the wrong layer. AI also severed the correlation between
> polish and care that the fast check was calibrated on — polish is now free.

**Q2.** What makes the "plausible coefficient" dangerous?

- A. That regression coefficients are frequently miscalculated by language models
- B. That it's believable whether the model is right or whether a control absorbed the effect you were looking for — and plausibility is exactly what stops it being checked ✓
- C. That coefficients are hard for non-statisticians to interpret
- D. That small coefficients are usually statistically insignificant

> **B.** An implausible number gets checked. That's the asymmetry, and it's why the failures that
> survive are the ones that look fine.

**Q3.** Which data control does the module call the cheapest in the discipline?

- A. Pseudonymizing identifiers before upload
- B. Negotiating zero-retention terms with the vendor
- C. Dropping columns the analysis doesn't need — the most reliable protection for a data element is its absence ✓
- D. Restricting tool access to a named group of analysts

> **C.** And it's routinely skipped because it takes four minutes and feels like busywork, while
> anonymization feels like security work. Only one of them actually reduces the data at risk.

**Q4.** What does it mean that the model didn't flag a problem with your analysis?

- A. That the analysis probably passed the model's internal checks
- B. Nothing — absence of a warning carries no information, because there is no state in which it noticed the dropped rows and chose not to mention them ✓
- C. That the problem is below the model's confidence threshold for reporting
- D. That the analysis was well-specified enough not to trigger a warning

> **B.** This is the most common misreading of model confidence, and it's different from a
> colleague not raising a concern — a colleague was looking.

**Q5.** Why does the module insist reconciliation checks be specified *before* the analysis runs?

- A. Because the model performs better when given checks up front
- B. Because a reconciliation named in advance is a test, while one invented afterward is a rationalization — you'll construct it to pass ✓
- C. Because retrospective checks are technically harder to implement
- D. Because auditors require documented controls to predate the work

> **B.** The order is the whole control. D is a real compliance consideration and not the module's
> reason.

**Q6.** What's the primary argument for the Python-then-Excel double-pass?

- A. Excel is more accurate than code for compensation calculations
- B. Two implementations that agree is stronger evidence than one that looks right, and it keeps reviewers' method intact rather than asking a finance partner to trust a black box ✓
- C. It's required for SOX compliance in most organizations
- D. Code-based analysis can't be version-controlled effectively

> **B.** Building the visible version also forces you to state the logic in a form a human can
> follow, which is where you catch the step you accepted without reading. It costs roughly 30%
> more work.

**Q7.** Why does the terminology file matter more in compensation than in most functions?

- A. Because compensation uses more jargon than other HR disciplines
- B. Because a set of terms carry a general-usage meaning that differs from the technical one — target vs. actual, grant vs. vest, compa-ratio vs. range penetration — so the model drifts between them and produces work that is wrong in a way that looks fine ✓
- C. Because compensation terminology varies more between organizations
- D. Because models have less training data on compensation topics

> **B.** C is also true and is why the activity asks for your organization's local terms as well.
> But the drift between two real, close meanings is the failure the file exists to prevent.

**Q8.** Why bundle the four files into a reusable kit rather than build them per analysis?

- A. Because reusable context produces better model output on average
- B. Because comp work is seasonal — the merit cycle is when your care is scarcest and your consequences are largest, and a discipline that only operates when you're not busy is an intention rather than a discipline ✓
- C. Because it reduces the time spent on each individual analysis
- D. Because auditors prefer standardized documentation

> **B.** The point isn't efficiency, it's survival under load. A is true and much weaker.

## Sources and attribution

- The three failures that survive the shape check, the audit-file specification, the
  reconciliation-in-advance rule, the Python-then-Excel double-pass, and the four-file starter kit
  are original to this course.
- Builds on 101 M4 (data tiers — individual pay as Tier 4), 101 M6 (confident wrongness), and 201
  M2 (the context pack), specialized here to a domain where the vocabulary itself is a hazard.
- The terminology list is drawn from standard total rewards practice; definitions vary by
  organization, which is the activity's point.
