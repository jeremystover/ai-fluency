# AI 301 · Labor & Employee Relations · Module 5 — What you've done before

**Course:** AI 301 · The Specialist — Labor & Employee Relations track · Module 5 of 8
**Estimated time:** 30 min content · 10 min exercise · 30 min applied activity
**Prerequisite:** Module 1 (a comparator search is a rung-two use and needs the boundary first)
**Position in the track:** the best return in the course and the least glamour

> `Concepts reviewed: [DATE] · Examples current as of: [DATE]`
> Lesson 2 is **volatile layer** — a benchmark figure with a disclosed sample. The comparator doctrine,
> the detection/decision line, and the corpus-scoping rule are stable.

---

## Calibration prompt — the claim to contest

*Commit before you read anything. Thirty seconds.*

**The claim:** *"You cannot currently answer 'how have we handled this before?' without asking somebody
who remembers."*

**Is that true of your function?** *True of us* or *not true of us*, and the one sentence you would
defend it with.

**And the number you will check in your own system:** **what share of your closed matters have
substantiation recorded at the level of the issue type** (harassment, discrimination, retaliation,
policy breach) rather than only as a single overall outcome?

Whole percent. There is a published benchmark for this and Lesson 2 gives it, so commit before you
read on.

---

## Module brief

Every module so far has been about restraint, what a model may not do with contested accounts, what
you must not let a transcript become, which rung a sentence has climbed. This one is the opposite, and
it is worth saying plainly: **this is the highest-value AI use available to your function, it is
entirely permitted, and almost nobody is doing it.**

The reason is not risk. It is that the work is invisible and the tooling has never been aimed at it.
Your case management system is full of narrative text, which makes it a filing cabinet rather than a
record you can interrogate. So the question every experienced practitioner asks — *how have we handled
this before?* — gets answered from memory, by whoever has been there longest, and their memory is
selective in exactly the way memory is.

Which matters because there is somebody else who will run that analysis properly.

**Disparate treatment is proven by comparators.** Not by whether your decision was fair, not by whether
your process was thorough, by whether a similarly situated person outside the protected class was
treated differently. That analysis will be run against your case history, with discovery, by somebody
with more time than you have. **The only question this module asks is whether you ran it first.**

## Learning objectives

By the end of this module you should be able to:

1. Explain why comparator evidence rather than process quality decides disparate-treatment claims.
2. State why most case management systems cannot answer the comparator question `[V]`, and what
   granularity would change that.
3. Apply the line: **AI surfaces the precedent; a human decides whether it governs**, and explain why
   consistency is not uniformity.
4. Distinguish a legal comparator from a statistical control group, and say why importing intuitions
   between them is dangerous in both directions.
5. Scope a searchable case corpus so that building it does not create a new exposure.

## Lesson 1 · Disparate treatment is proven by comparators

Start with the doctrine, because the operational conclusion is downstream of it.

A disparate-treatment claim does not usually turn on whether your investigation was careful. It turns
on **comparison**: was a similarly situated employee outside the protected class treated more
favourably for materially the same conduct? Similarly situated is contested at the margins (same
supervisor, same rule, comparable seriousness, comparable record) and that contest is where these
cases are actually fought.

Which produces a consequence that is uncomfortable and useful:

> **Your process quality is not the primary defence. Your consistency is.**

You can run a thorough, well-documented, procedurally impeccable investigation and lose, because two
years ago somebody in a different business unit did materially the same thing and received a warning
where your respondent was dismissed. Nothing in your file is wrong. The problem is not in your file at
all.

**And the asymmetry of information is the whole issue.** Opposing counsel will look for comparators
systematically, using discovery to obtain the case history, with weeks to do it. You will look for
comparators by asking a colleague whether anything like this has come up before, in the ten minutes
you have before the decision meeting.

You are running the same analysis with worse tools, less time, and a memory that reconstructs the
past in the direction of your current decision. That is the gap this module closes, and closing it is
almost entirely a data problem rather than an AI problem.

## Lesson 2 · Most teams cannot answer the question **[V]**

Here is the specific reason the comparator question is hard, and it is measurable.

HR Acuity's tenth annual benchmark — **274 US organizations of 1,000+ employees, representing 8.8
million employees, fielded early 2026 on 2025 practice, ±5.9 points** — finds that **only 32% of
organizations track substantiation by issue type.** Not whether matters are substantiated: whether the
substantiation is recorded at the granularity of *harassment*, *discrimination*, *retaliation*, or
*policy breach* separately.

Why that specific granularity is the one that matters: **without it, the pattern you most need to see
is invisible.** An organization that substantiates 60% of matters overall may substantiate 75% of
policy breaches and 25% of harassment complaints, and those are completely different institutional
facts. The second is the kind of number that appears in a claim, and the aggregate hides it perfectly.

Three other structural obstacles, all boring and all fixable:

**Narrative fields.** The account of what happened lives in prose. Prose does not answer *find me
matters involving lateness and a first-instance warning*, which means the search you need is not a
search your system supports.

**No conduct taxonomy.** Two coordinators describing the same behaviour will file it under different
categories, or the same category will hold three unlike things. Comparability requires that similar
conduct is labelled similarly, and most taxonomies were designed for reporting volume rather than for
finding comparators.

**Outcomes recorded without the aggravating and mitigating factors.** The outcome is in the system.
*Why* that outcome (the prior record, the admission, the seniority, the cooperation) is in the
report, which is a document rather than a field. So a query returns two dismissals and one warning and
cannot tell you whether the difference was justified.

**And this is exactly where AI is genuinely strong**, which is the good news the module is built on.
Retrieval and structured extraction across a corpus you already own, producing candidates a human then
checks. That is precisely the shape of task where a model outperforms an overloaded person, and every
result is verifiable by opening the file.

## Lesson 3 · AI surfaces the precedent; a human decides whether it governs

The line, and it is the same shape as the line in every other module of this track.

> **AI surfaces the precedent. A human decides whether it governs.**

**Permitted** — retrieval and extraction, which is rung two:

- Find closed matters involving conduct in this category.
- Extract, per matter: the conduct as recorded, the outcome, the stated aggravating and mitigating
  factors, the decision-maker, the business unit, the date.
- Flag matters where the recorded conduct is similar and the outcome differs.
- List what could not be determined from the record.

**Forbidden**: a recommended outcome, which is rung five however well-reasoned it looks. *"Based on
the three comparable matters, a final written warning would be consistent"* is a determination. It will
be fluent, it will cite the precedents, and it will have made your decision.

**And the corollary that keeps this honest, because the rule above can be read the wrong way:**

> **Consistency is not uniformity.**

Identical conduct with different aggravating factors properly produces different outcomes. A first
offence and a third are not the same case. An admission and a denial that collapsed under evidence are
not the same case. **What the file has to contain is *why*, written by the person who decided**, and
the comparator analysis is what tells you that a *why* is required, not what supplies it.

Which gives you the failure mode to avoid, and it is a real one:

**An AI that flattens your case history into an average is manufacturing the disparate-treatment
argument on your opponent's behalf.** A model asked *what is the usual outcome for this conduct?*
returns a central tendency. Deviating from a central tendency now looks like an anomaly requiring
justification, when in fact the distribution reflects legitimate differences the average has erased.
You have converted a defensible set of individual decisions into a norm you can be measured against.

So ask for **the matters and their factors**, never for the norm. Ten rows you can read beat one
sentence you cannot check.

> ### Try this — 3 minutes
> Pick a conduct category your function handles regularly. Try to name, from memory, the last three
> matters in it and their outcomes. Then ask yourself whether you could produce the *reasons* those
> outcomes differed. That second question is the one opposing counsel asks, and memory almost never
> has it.

## Lesson 4 · A legal comparator is not a control group

A short lesson, and it exists because the vocabularies collide and the collision is expensive.

**A comparator** is one similarly situated individual who was treated differently. **A single
comparator can carry a claim.** It is not a sample, it does not need to be representative, and its
evidential force does not depend on how many other cases point the other way.

**A control group** is a population assembled to support an inference about an average effect. One case
tells you nothing. Variance matters, sample size matters, and a single deviation is noise.

Importing intuitions between the two is dangerous **in both directions**, which is why this is a lesson
rather than a footnote:

**Dismissing a lone comparator as "n of 1" is how employers lose.** It is the statistically literate
instinct and it is legally wrong. One person, in the same unit, under the same supervisor, who did the
same thing and kept their job, is not an outlier to be averaged away. It is the case.

**And treating your case history as a dataset to be averaged is how employers manufacture the pattern
against themselves.** This is Lesson 3's flattening problem restated: aggregate analysis produces
central tendencies, disparities, and rates (the vocabulary of the other kind of claim entirely) and
having generated them, you now have to explain them.

If your organization has a People Analytics function, this distinction is worth sharing with them
explicitly, because their professional instincts run the other way and both of you will be more useful
for having noticed. Same word, different instrument.

## Lesson 5 · Where this corpus may and may not live

The last piece, and it is the one that determines whether building the capability is safe.

Making your case history searchable means creating an index over **investigation notes, disciplinary
records, accommodation documentation and legal-hold material** — which is, in the general enterprise
case, the worst possible corpus to index. An assistant retrieves what its user may reach, and access
that has accumulated over years is wider than anybody intended.

So the scoping rule is the content:

- **Scoped to the ER team's own access**, not to anybody with a licence.
- **Never joined to the general enterprise assistant.** If your case corpus is reachable from the
  same interface a manager uses to ask about policy, you have built something you cannot control.
- **Structured extracts rather than full documents where possible.** A table of conduct, outcome and
  factors is far less dangerous than an index over the narrative reports, and it answers the comparator
  question better.
- **And the discovery consideration, which is Lesson 5's real point:** a searchable comparator index
  is itself a thing that exists. Raise it with counsel **before** you build it, not after somebody
  requests the output of a query you ran. The *Take a position* section is about this exact trade.

## Key takeaways

- **Disparate treatment is proven by comparators**, so **your process quality is not the primary
  defence, your consistency is.** You can run an impeccable investigation and lose because of a matter
  in another unit two years ago.
- **The asymmetry is the issue:** opposing counsel searches systematically with discovery and weeks;
  you ask a colleague in the ten minutes before a decision meeting, using a memory that reconstructs
  the past in the direction of your current decision.
- **Only 32% of organizations track substantiation by issue type** `[V]`, and without that
  granularity, the pattern that matters is invisible, because an aggregate substantiation rate hides
  a 75%-for-policy-breach, 25%-for-harassment split perfectly.
- **Three fixable obstacles:** narrative fields that no query can search, no conduct taxonomy that
  makes similar things comparable, and outcomes recorded without the aggravating and mitigating factors
  that justified them.
- **AI surfaces the precedent; a human decides whether it governs.** Retrieval and extraction are
  rung two and permitted. A recommended outcome is rung five, however well it cites the precedents.
- **Consistency is not uniformity.** Identical conduct with different factors properly produces
  different outcomes; the file has to contain *why*, written by the decider. **An AI that flattens your
  case history into an average is manufacturing the disparate-treatment argument for your opponent** —
  so ask for the matters and their factors, never for the norm.
- **A single comparator can carry a claim; a single data point cannot support an inference.**
  Dismissing a lone comparator as "n of 1" is how employers lose. Averaging your case history is how
  they manufacture the pattern against themselves.
- **Scope the corpus:** ER team access only, never joined to the general assistant, structured extracts
  over full narrative documents, and **raise it with counsel before you build it.**

## Take a position

**The claim:** *"They will run this analysis on your case history. The question is whether you ran it
first."*

The strongest counter-argument is that **running it first creates a discoverable asset that did not
previously exist, and this is the same trade as the transcript in Module 3, in a sharper form.**

If you build a comparator capability, you will run queries. Those queries produce outputs. Outputs are
records. Which means opposing counsel can request **the analysis you ran before you made your
decision**, and if it showed an inconsistency and you proceeded anyway, you have handed them a
document showing you knew. *"We did not track that"* is a weak position. *"We tracked it, we saw the
pattern, and here is what we decided"* can be far worse, because it converts a possible oversight into
a documented choice.

On that reading the module is advising you to manufacture the evidence against yourself, and the
protective move is genuinely not to look — you cannot be compelled to produce an analysis you never
generated.

**The honest response to that argument, which your position has to engage rather than accept:** the
pattern exists whether or not you can see it, discovery reaches the underlying case files regardless,
and what you are actually choosing is **whether you find out before the decision or after the claim.**
Finding out before is the only version in which you can still act: by justifying the difference in
the file, or by making a different decision.

But that response has a cost the module should not hide, and your position has to price it. So the
question to answer is not whether the capability is good in principle. It is: **what will you do on
the day the first query returns a pattern you do not like?** If the answer is that you will document
the justification, say who writes it and to what standard. If the answer is that you do not know, then
the counter-argument is describing your situation accurately and you should decide that before you
build anything.

## Applied activity — "The query you can't run"

**Time:** 30 minutes · **Submit:** the query design, the system gap, the scoping rule, and a 300–400
word write-up · **Graded against the rubric below.** Score doesn't matter. Doing the work is where the
learning lands.

**No case facts.** Submit the **query design and the aggregate gap**: never the matters, never the
outcomes of specific cases, never anything that identifies a person.

**Step 1 — Write the question (6 min).** The single comparator question you most need answered about
your matter type, written precisely enough to be executed. Not *"how do we usually handle
timekeeping?"* but *"closed matters in the last 36 months involving unauthorised absence, with the
outcome, the stated aggravating and mitigating factors, and the deciding manager."* **Precision is the
graded part**: a vague question cannot fail, and cannot be built for either.

**Step 2. What your system returns today (8 min).** Actually try it. What comes back? What is in a
narrative field that a query cannot reach? Is substantiation recorded by issue type? **Report the
aggregate numbers only** — how many matters, how many with the factors recorded, what proportion
required opening a document to answer.

**Step 3. What would have to be true (8 min).** The specific changes that would let the question be
answered: fields, taxonomy, a required factors entry at closure, a retention window. Distinguish what
you could change this quarter from what needs a system project.

**Step 4. The scoping rule (5 min).** If you built it: whose access, why it is not joined to the
general assistant, structured extract versus full documents, and **what you would raise with counsel
before building.** One sentence each.

**Step 5 — Score the prediction.** Your predicted share of matters with substantiation by issue type
against what your system actually shows. The published benchmark is 32%.

Then the write-up: your position on the claim above, and it must answer **what you will do on the day
the first query returns a pattern you do not like**, specifically enough that somebody could hold you
to it; whether the opening claim turned out to be true of your function; and the concrete one — **the
one field or taxonomy change you are making first, and who has to approve it.**

## Knowledge check — 8 questions

*Unlocks after the applied activity is submitted. Retakes are free and unlimited.*

**Q1.** Why is process quality not the primary defence in a disparate-treatment claim?

- A. Because procedural fairness is presumed unless challenged
- B. Because the claim turns on whether a similarly situated person outside the protected class was treated differently, so you can run an impeccable investigation and lose because of a matter in another unit two years ago ✓
- C. Because process quality cannot be evidenced after the fact
- D. Because tribunals defer to the employer on process questions

> **B.** Nothing in your file is wrong. The problem is not in your file at all — which is why
> consistency rather than thoroughness is the thing to be able to demonstrate.

**Q2.** What is the information asymmetry the module describes?

- A. Opposing counsel has access to industry benchmarks you do not
- B. Opposing counsel searches your case history systematically with discovery and weeks; you ask a colleague in the ten minutes before a decision meeting ✓
- C. Employees know their own history better than the employer does
- D. Case management vendors withhold analytical features

> **B.** Same analysis, worse tools, less time, and a memory that reconstructs the past in the
> direction of the decision you are about to make.

**Q3.** Why does substantiation by issue type matter more than an overall substantiation rate? `[V]`

- A. Because regulators require issue-level reporting
- B. Because an aggregate rate hides the split that matters — 75% for policy breaches and 25% for harassment complaints are completely different institutional facts, and the second is the kind of number that appears in a claim ✓
- C. Because issue types correlate with investigation cost
- D. Because it allows benchmarking against peers

> **B.** Only 32% of organizations track it at that granularity, which means for most, the pattern
> they most need to see is invisible in their own system.

**Q4.** Which of these is a permitted AI use in comparator work?

- A. "Based on the three comparable matters, what outcome would be consistent?"
- B. "What is the usual outcome for this conduct in our organization?"
- C. "Find closed matters in this conduct category and extract the outcome, the stated factors, and the deciding manager for each." ✓
- D. "Which of these prior matters is most similar to the current one?"

> **C.** Retrieval and extraction, rung two. A is a determination. B produces a central tendency and
> is the flattening failure. D is a similarity judgment that decides which precedent governs, which is
> the human's job.

**Q5.** Why is asking for "the usual outcome" the wrong request?

- A. Because averages are statistically unreliable on small numbers
- B. Because a central tendency erases the legitimate differences behind the distribution, so deviating from it now looks like an anomaly requiring justification. You have converted defensible individual decisions into a norm you can be measured against ✓
- C. Because outcome data is often incomplete
- D. Because it requires access to matters outside your business unit

> **B.** An AI that flattens your case history into an average is manufacturing the disparate-treatment
> argument on your opponent's behalf. Ask for the matters and their factors — ten rows you can read
> beat one sentence you cannot check.

**Q6.** What does "consistency is not uniformity" mean in practice?

- A. That outcomes should vary to avoid appearing formulaic
- B. That identical conduct with different aggravating factors properly produces different outcomes, and the file has to contain why, written by the person who decided ✓
- C. That consistency applies within business units but not across them
- D. That precedent is advisory rather than binding in internal processes

> **B.** The comparator analysis tells you that a *why* is required. It does not supply the why.

**Q7.** How does a legal comparator differ from a statistical control group?

- A. A comparator must be from the same business unit; a control group need not be
- B. A single comparator can carry a claim, while a single data point supports no inference, so dismissing a lone comparator as "n of 1" is how employers lose ✓
- C. Comparators are chosen by the employer; control groups by the claimant
- D. They are the same concept applied in different forums

> **B.** And the error runs both ways: treating your case history as a dataset to be averaged is how
> employers manufacture the pattern against themselves. Same word, different instrument.

**Q8.** What is the scoping rule for a searchable case corpus?

- A. Index everything, and rely on access controls at query time
- B. ER team access only, never joined to the general enterprise assistant, structured extracts preferred over full narrative documents, and raised with counsel before building ✓
- C. Retain only closed matters, and only for three years
- D. Restrict it to matters where the employee has consented to their record being used

> **B.** An assistant retrieves what its user may reach, and years of accumulated access is wider than
> anyone intended. And the index is itself a thing that exists — which is what the module's
> counter-argument is about.

## Sources and attribution

- **HR Acuity, *Tenth Annual Employee Relations Benchmark Study*** — 32% of organizations tracking
  substantiation by issue type. Conducted with Isurus Market Research, fielded 23 January to 24 March
  2026 on calendar-2025 practice: **274 US organizations of 1,000+ employees representing 8.8 million
  employees, ±5.9 points at 95% confidence.** Vendor-sponsored, independently fielded, disclosed
  sample; **does not describe employers below 1,000 employees.** Same instrument as Module 1 of this
  track. **[V]**
- **Disparate-treatment comparator doctrine**. That a claim turns on whether a similarly situated
  person outside the protected class was treated more favourably for materially the same conduct, and
  that "similarly situated" is contested at the margins on factors including supervisor, rule,
  seriousness and record. Long-settled and jurisdiction-specific in its detail; **the module teaches
  why comparators matter operationally rather than how any jurisdiction defines them.**
- The three structural obstacles, the surfaces-not-decides line, the flattening-manufactures-the-
  argument argument, the comparator-versus-control-group distinction, and the corpus-scoping rule are
  original to this course.
- **Horizontal note.** `ai301-analytics` teaches natural experiments and causal inference, where
  "comparison" means something incompatible with what it means here: a control group rather than a
  comparator. Lesson 4 draws that boundary explicitly. Recorded so the two tracks do not drift, and
  because a learner who has worked with a People Analytics function will encounter both vocabularies.
- **Horizontal note.** The corpus-scoping rule in Lesson 5 is the ER-specific application of the
  retrieval-permissions problem that `ai301-peopleops-m6` treats in general. That module argues an
  investigation corpus is the worst case for a general enterprise assistant; this one wants it
  searchable anyway, and the scoping rule is how both can be true. Whoever builds it should read both.
- Builds on Module 1 of this track (a comparator search is a rung-two use, and the boundary has to come
  first) and Module 3's discoverability argument, which the *Take a position* counter-argument
  restates in a sharper form.
