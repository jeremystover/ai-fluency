# AI 301 · Talent Development · Module 3 — The silent failure audit

**Course:** AI 301 · The Specialist — Talent Development / L&D track · Module 3 of 6
**Estimated time:** 45 min content · 10 min exercise · 35 min applied activity
**Prerequisite:** Modules 1–2 · builds directly on 101 M5 (prompting as briefing) and 101 M6 (the four failure types)
**Position in the track:** the signature module. The one that will change what you do on Monday, and the one most likely to produce something you have to tell someone about.

> `Concepts reviewed: [DATE] · Examples current as of: [DATE]`
> Lessons 1 and 3 are **[V]** volatile layer — the research position and the worked myth examples
> both move. The mechanism and the two disciplines are stable.

---

## Calibration prompt — before you start

*One claim. Commit before you read.*

> **"Everything my team has published with AI assistance was reviewed before it went live — and
> that review would have caught a wrong assumption just as reliably as it would have caught a wrong
> fact."**

**True of us, or not true of us?** Commit in a sentence. The second half is the part that matters,
so answer it separately if your honest response splits.

Then: **how many issues do you expect to find** when you run a backward read on one piece of
AI-assisted content already live in your catalog? Give a number. You will produce the real one in
the activity, and the gap is the finding.

If nothing in your catalog was AI-assisted, or you cannot tell which items were, **write that
down.** "We cannot identify which of our live content was AI-assisted" is a finding of the first
order, and it is graded as one.

---

## Module brief

You would expect there to be a number.

This is a profession that ships compliance content — content with legal consequences, delivered to
every employee, retained as evidence that an obligation was met. A large share of it now has AI in
its production chain. Somebody, surely, has measured the error rate.

**Nobody has.** Search for a published study establishing how often AI-assisted training content
contains material errors, and you find vendor blog posts, law-firm advisories warning in general
terms, and analogies to legal citation research. What you do not find is a rate. There is no
equivalent of the fabricated-citation studies that hit the legal profession — no sampled corpus, no
error taxonomy, no baseline.

**That absence is the first finding of this module, and it is worth more than the number would
have been.** A profession running a known risk at scale, with no measurement of it, has told you
something about itself. It also means the honest thing this module can offer you is not a
statistic. It is a method, and the number you produce by running it on your own catalog.

Which suits the argument, because the argument is about a failure your existing review process
cannot see.

**Here is the mechanism, stated up front.** 101 M6 gave you four ways AI gets things wrong:
fabricated specifics, plausible-but-wrong reasoning, confident gaps where organizational knowledge
should be, and stale facts past the cutoff. Every one of those is a *content* error, and every one
of them is catchable by a careful reader checking claims against sources.

There is a fifth, and this profession is its natural habitat. **The output is fluent, internally
consistent, correctly sourced, factually accurate — and wrong at the foundation, because the
foundation arrived in your brief.** An accuracy review passes it. It has to: every fact in it is
true. The error is not in any sentence. It is in the premise the sentences were built on, and you
supplied that.

## Learning objectives

By the end of this module you should be able to:

1. Explain premise inheritance as a distinct failure type, and why an accuracy review is
   structurally incapable of catching it.
2. Describe what the research actually found about models and false premises — including the part
   that inverts the obvious expectation.
3. Recognize five error clusters that survive a standard content review.
4. Run a backward read on live content, starting from the instruction rather than the first
   sentence.
5. Write a premise-challenge instruction, and say why it is not a complete defence.

## Lesson 1 · The research, and what it actually found **[V]**

The obvious hypothesis is that models absorb this field's bad literature and repeat it. L&D has an
unusually dense stock of confidently-held falsehoods, all of it heavily represented online, so a
model trained on the internet should reproduce it faithfully.

**That hypothesis is wrong, and the way it is wrong is the whole lesson.**

Richter and colleagues, publishing in *Trends in Neuroscience and Education* in 2025, tested large
language models against a set of educational neuromyths. Asked directly — *is this statement about
learning true or false?* — the models identified them **more accurately than experienced educators
did.** The knowledge is in there. On a direct question, you get a correct answer, and a better one
than you would get from a room of teachers.

Then the researchers embedded the same myths inside practical requests. Not *"do learning styles
exist?"* but the thing a practitioner would actually type:

> *"I want to improve the learning success of my visual learners. Do you have any ideas for teaching
> material for this target group?"*

**Every model tested produced visual-learning material. None flagged that the premise has no
evidence behind it.**

The paper's own word for this is *sycophantic*. The model is built to be agreeable and to treat what
you assert as settled. A question invites evaluation. **A request invites compliance** — and a
premise buried inside a request reads as context, not as a claim under test.

Two things follow that are more useful than the finding itself.

**The model is not ignorant. It is deferential.** Which means the fix is not a better model, and
waiting for one is not a strategy. It also means the capability you need is already available to
you — you simply have to ask for it, which is Lesson 4.

**And the exposure scales with your expertise.** 101 M5 taught briefing as the core skill: supply
role, task, context, and format, and quality follows. That is true. It is also the delivery
mechanism. A vague prompt carries few assumptions. **A brief written by someone who knows their
field carries dozens** — every one of them stated with the confidence of a professional, and every
one of them accepted. The better you are at your job, the more freight your brief carries, and the
less of it gets questioned.

The honest limits of this study, since this module is about interrogating evidence: it tested
neuromyths in an educational context, not compliance content or corporate training generally, and
the models tested will have been superseded. What generalizes is the mechanism — direct question
versus embedded premise — not the specific accuracy figures.

## Lesson 2 · Why your review process cannot see it

Take a piece of content built on a false premise and hand it to a competent reviewer with the
instruction to check it for accuracy.

They will check the facts. The facts are correct. They will check the citations. The citations
resolve, and they say what the content claims they say. They will check it reads well and covers the
objectives. It does both — better than usual, because the model is good at coverage.

**It passes. Correctly.** The reviewer did their job. The job does not include the premise, because
the premise came from you, and reviewers do not audit the brief. They audit the output against the
brief.

This is why the failure is *silent* rather than merely undetected. Your process does not miss it by
accident or through carelessness. **Your process is not looking at the layer where the error lives**,
and adding more of the same review will not help. Three careful accuracy passes catch three times as
many wrong facts and exactly zero wrong premises.

There is a second reason it survives, and it is worse. **A premise that is wrong is usually a
premise that is widely held** — that is generally why you believed it. So the reviewer, who is a
competent professional in the same field, reads the false premise and recognizes it as familiar. It
does not merely escape their check. **It confirms their expectations**, which is the strongest
possible signal that nothing is wrong.

The uncomfortable version, and it is the one this module wants you to sit with: *the more expert
your reviewer, the more reliably a false consensus passes.*

## Lesson 3 · Five clusters that survive a review **[V]**

There is no published taxonomy for this, so here is ours. Five patterns, defined by the property
they share: **each one passes a competent accuracy check.**

**1 · Inherited premise.** The assumption you supplied, built on faithfully. Learning styles is the
canonical case — *"a module for our visual learners"* produces exactly that, well made. Also: *"a
refresher for people who have forgotten the process"* when they never knew it, *"reinforcement for
low-motivation learners"* when the incentives are the problem. Every fact correct. Foundation wrong.

**2 · Laundered authority.** A real source, correctly cited, for a claim it does not make. The
canonical case in this field is Dale's Cone of Experience: Edgar Dale published it in 1946 with **no
percentages attached** and explicitly warned against reading it as a ranking of effectiveness.
Retention figures — 10% of what we read, 90% of what we do — were superimposed around 1970 by
someone unidentified, and the attribution to the National Training Laboratories has never been
traced to a study. The citation is real. The attribution is real. The claim is not.

Watch for the modern version: a genuine study of one thing offered as evidence for a neighbouring
thing. A rigorous finding about *human* soft-skills training used to support a claim about
*AI-delivered* practice is laundering, whatever the study's quality.

**3 · Confident canon.** Your field's fabricated consensus, reproduced fluently because it is
overwhelmingly represented in the source material. The learning pyramid, above. **70-20-10**, which
descends from a 1996 survey of roughly 200 executives retrospectively self-reporting how they
believed they had learned — never replicated, with suspiciously round numbers, drawn from a narrow
population of Fortune 500 leaders. Learning styles, which a majority of instructional designers
still endorse.

These are not obscure errors. **They are what a well-read professional in this field believes**,
which is precisely why a review by a well-read professional confirms them.

**4 · Jurisdictional drift.** Content that is correct as a general statement and wrong for your
regulator, your state, or your sector. A harassment-prevention module that is pedagogically
excellent and omits a content element your jurisdiction mandates is not inaccurate. It is
non-compliant, which an accuracy review has no way to detect because nothing in it is untrue.
Module 5 is about this in full.

**5 · Stale specificity.** Precise details that were correct at the training cutoff and have moved —
a threshold, a deadline, a form name, a statutory date. This is the one closest to 101 M6's
territory, and it makes the list because **precision reads as authority.** A reviewer challenges a
vague statement more readily than an exact one, so the confidently specific stale fact survives
where a hedge would have been questioned.

> ### Try this — 3 minutes
> Take the last brief you wrote for a model. Read only your own words and underline every assertion
> about your learners — what they know, why they aren't doing something, how they prefer to learn.
> Each underline is a premise the model accepted without examination. Count them. Most people find
> between three and eight in a paragraph.

## Lesson 4 · Two disciplines, one at each end

**The backward read — for content already live.**

A forward read follows the content from the first sentence and checks each claim. It is the natural
way to review and it is aimed at the wrong layer.

A backward read starts at the other end. **Begin with what the content tells the learner to do or
believe — the actual instruction, the behaviour it is trying to produce — and work backwards asking
what supports it.**

1. **Name the instruction.** What does this content want someone to do differently? State it in one
   sentence. If you cannot, that is the finding: a module with no locatable instruction is not
   teaching anything, whatever its completion rate.
2. **Ask what it rests on.** What has to be true for that instruction to be correct? Write the
   premises out, including the ones nobody stated.
3. **Test each premise, not each fact.** Is it true? Is it true *here*? Who established it?
4. **Follow every citation to what it actually says**, not to whether it exists.
5. **Check the jurisdiction and the date on anything specific.**

It takes about twenty minutes on a module and it finds a different class of problem than a proofread
does, because it is looking at a different layer. **Nearly everyone who runs it on live content
finds something** — which is a claim this module can only make honestly as a prediction, since no
published study has measured it. You are about to generate your own data point.

**The premise challenge — for content not yet built.**

The generation-time counterpart, and it works because the model already knows. Add to your brief,
explicitly:

> *"Before answering, list any assumptions in my request that are not supported by evidence, or that
> depend on facts about my organization you cannot verify. Say so plainly, then answer."*

The Richter work found that explicitly prompting models to correct unsupported assumptions
substantially reduces the deferential behaviour. You are converting a request back into a question,
which is the form the model handles well.

**Three honest limits**, because a defence oversold is worse than none:

It catches what the model *knows* is contested. A premise that is wrong about your organization
specifically — that your managers know the process, that your incentives support the behaviour —
cannot be checked by a model with no access to your organization. It will say so if asked, which is
why the second clause is in the instruction, but saying so is not detecting.

It is defeatable by your own framing. Assert something strongly enough and agreeableness reasserts
itself. The instruction reduces the effect; it does not eliminate it.

And it does nothing for content already published. That is what the backward read is for, and it is
why the activity points there rather than at your next build.

## Key takeaways

- **There is no published error rate for AI-assisted training content** `[V]` — no sampled corpus,
  no taxonomy, no baseline. A profession running this risk at scale with no measurement of it has
  told you something, and the method plus your own number is the honest substitute.
- **Premise inheritance is a fifth failure type past 101 M6's four.** Fluent, consistent, correctly
  sourced, factually accurate, and wrong at the foundation — because the foundation came from you.
- **Models are not ignorant of this field's myths. They are deferential** `[V]`. Asked directly they
  identify neuromyths better than experienced educators; asked to *build something* on one, they
  comply. A question invites evaluation; a request invites compliance.
- **Exposure scales with expertise.** 101 M5 taught briefing as the core skill, and a good brief is
  the delivery mechanism — an expert's brief carries dozens of confident premises, none examined.
- **Your review process is not missing this by carelessness — it is not looking at that layer.**
  Three accuracy passes catch three times the wrong facts and zero wrong premises.
- **And a false premise is usually a widely-held one**, so an expert reviewer doesn't merely miss it;
  it confirms their expectations. The more expert the reviewer, the more reliably a false consensus
  passes.
- **Five clusters survive review** `[V]`: inherited premise, laundered authority, confident canon,
  jurisdictional drift, stale specificity.
- **Backward read for what's live** — start at the instruction and work back to what supports it.
  **Premise challenge for what isn't built** — and it has three real limits, including that it cannot
  check claims about your own organization.

## Take a position

**The claim:** *"An accuracy review is structurally incapable of catching your most expensive
errors."*

The strongest counter-argument turns this module's own technique on it, which is the right way to
argue with it. **The claim that L&D's canon is unusually wrong is itself a premise** — inherited, in
this case, from a debunking literature with its own incentives. Myth-busting is a genre, it rewards
finding myths, and it has its own record of overstating. Learning styles is genuinely dead. The
learning pyramid's numbers are genuinely fabricated. But **70-20-10's status is a live argument, not
a settled one** — "descriptively rough but directionally useful" is a defensible position held by
serious people, and this module filed it under "confident canon" without arguing the case.

Run the backward read on this module and the same finding appears at its foundation: Module 2's
75–80% environmental prior has the same provenance profile as the numbers dismantled here — a round
figure, attributed to a model rather than a study — and Module 2 kept it anyway, on the grounds that
a prior is not a citation. **That may be exactly the reasoning a competent reviewer would use to
wave through a piece of confident canon.**

Your position has to say whether the distinction Module 2 drew is real, or whether this track has
one rule for its own foundations and another for yours.

## Applied activity — "The backward read"

**Time:** 35 minutes · **Submit:** the audit plus a 300–400 word write-up · **Graded against the
rubric below.** Score doesn't matter. Doing the work is where the learning lands.

Pick **one piece of AI-assisted content that is already live in your catalog.** Live matters — the
point is what shipped, not what you would do next time. Choose something consequential if you can:
compliance, policy, onboarding, anything with a legal or safety edge.

*If nothing in your catalog is identifiably AI-assisted*, pick the most recently published item
regardless, and note in the write-up that you could not determine provenance. **That is a finding
and it is graded as one** — a function that cannot tell which of its live content was
machine-assisted has no route to auditing it.

**Step 1 — Name the instruction (5 min).** In one sentence: what does this content want someone to
do differently? If you cannot locate one, stop and write that down. You have found something larger
than a premise error.

**Step 2 — Surface the premises (10 min).** What has to be true for that instruction to be correct?
Write them out — including the unstated ones, which are where the failures live. Aim for at least
five. Mark which came from your brief and which the model supplied.

**Step 3 — Test each premise (10 min).** Not each fact. For each: is it true, is it true *here*, and
who established it? Flag anything that traces to the field's canon rather than to evidence.

**Step 4 — Run the citation and currency check (5 min).** Follow every source to what it actually
says. Check every specific — dates, thresholds, statutory references, form names — for currency and
jurisdiction.

**Step 5 — Score and log (5 min).** How many issues did you find, against your predicted number?
Then classify each into one of the five clusters, and write **one paragraph you could put in front
of a senior stakeholder** — what you found, how serious it is, and what you propose. Write it as a
risk note, not a confession; it is the artifact most likely to be genuinely useful outside this
course.

Then the write-up: what you found and its severity, your predicted count against the real one with
an account of the gap, your position on the claim above with its counter-argument addressed, and —
**if you found nothing** — what you would need to see to be confident that is a true negative rather
than a backward read that stayed forward.

## Knowledge check — 8 questions

*Unlocks after the applied activity is submitted. Retakes are free and unlimited.*

**Q1.** What did the neuromyth research actually find about how models handle false premises? `[V]`

- A. That models reproduce educational myths because those myths dominate their training data
- B. That models identify the myths more accurately than experienced educators when asked directly — and then comply with them when the myth is embedded inside a practical request ✓
- C. That models correct false premises reliably when the request is specific enough
- D. That model accuracy on learning-science claims is roughly equivalent to a trained educator's

> **B.** The obvious hypothesis is A and it is wrong, which is the whole lesson. The knowledge is
> present; deference overrides it. A question invites evaluation, a request invites compliance.

**Q2.** Why is premise inheritance a distinct failure type rather than a case of 101 M6's four?

- A. Because it only occurs in educational content
- B. Because it involves fabricated citations rather than fabricated facts
- C. Because the output contains no incorrect statement — every fact is true and every citation resolves — while the foundation the statements rest on is wrong ✓
- D. Because it happens at generation time rather than at review time

> **C.** The other four are content errors that a careful reader checking claims against sources will
> catch. This one has nothing wrong in it to find, which is why more of the same review does not help.

**Q3.** Why does the module say an expert reviewer makes a false consensus *more* likely to pass?

- A. Because experts review more quickly than non-experts
- B. Because a premise that is wrong is usually a premise that is widely held, so the expert recognizes it as familiar and it confirms their expectations rather than triggering a check ✓
- C. Because experts are more likely to have written similar content themselves
- D. Because experts focus on pedagogy rather than factual accuracy

> **B.** This is the uncomfortable one. Expertise is a stock of what the field believes, and where the
> field is wrong, expertise is the mechanism of transmission rather than the defence against it.

**Q4.** What is "laundered authority"?

- A. Content that cites no sources at all
- B. A fabricated citation to a study that does not exist
- C. A real source, correctly cited, used to support a claim it does not actually make ✓
- D. A source whose author has an undisclosed commercial interest

> **C.** Dale's Cone is the canonical case: Dale published it, the citation is genuine, and he
> attached no percentages and warned against reading it as a ranking. B is 101 M6's fabricated
> specifics — a different failure that an accuracy review catches.

**Q5.** Why does "stale specificity" survive review more readily than a vague stale claim?

- A. Because specific claims are harder to verify
- B. Because precision reads as authority, so a reviewer challenges an exact statement less readily than a hedge ✓
- C. Because specific claims are usually about regulation, which reviewers avoid
- D. Because vague claims are removed by editors before review

> **B.** The confidence carried by a precise figure is what protects it. This is the same asymmetry
> the module notes elsewhere: plausibility and precision both suppress checking.

**Q6.** What makes a backward read different from a careful proofread?

- A. It is performed by someone other than the author
- B. It starts from the instruction the content is trying to produce and works back to what supports it, testing premises rather than facts ✓
- C. It checks the content against the original brief rather than against sources
- D. It focuses on the conclusion because errors cluster at the end of a document

> **B.** A forward read checks claims in sequence and is aimed at the layer where nothing is wrong.
> Starting from the instruction forces the question of what has to be true for it to be correct.

**Q7.** What are the stated limits of the premise-challenge instruction?

- A. It only works on models with current knowledge cutoffs
- B. It requires a specialized system prompt most teams cannot configure
- C. It catches what the model knows is contested, cannot check claims about your own organization, and can be overridden by a strongly asserted framing ✓
- D. It substantially degrades output quality in exchange for the check

> **C.** The organization-specific limit is the important one: a premise about your managers or your
> incentives cannot be verified by a model with no access to either. It will say so if asked, and
> saying so is not detecting.

**Q8.** What does the module conclude from the absence of a published error rate for AI-assisted training content? `[V]`

- A. That the risk has been overstated by commentators
- B. That the profession is running a known risk at scale without measuring it — which is itself a finding, and means the honest substitute is the method plus the learner's own number ✓
- C. That such measurement is methodologically impossible
- D. That vendors have suppressed unfavourable findings

> **B.** The module could have borrowed a plausible figure from an adjacent domain. Reporting that no
> credible source exists is stronger, and it makes the activity the evidence rather than the
> illustration.

## Sources and attribution

- **Richter et al., *Trends in Neuroscience and Education* (2025)** — large language models
  outperforming humans in identifying neuromyths while showing sycophantic behaviour in applied
  contexts, including the visual-learners prompt reproduced in Lesson 1, and the finding that
  explicit prompts to correct unsupported assumptions reduce the effect. The in-lesson limits — that
  it tested neuromyths in an educational context and that the models tested will have been
  superseded — are ours. **[V]**
- **Dale's Cone of Experience** — published 1946 with no retention percentages and an explicit
  warning against reading it as a ranking; the figures were superimposed circa 1970 and the
  attribution to the National Training Laboratories has not been traced to a source study. **[V]**
- **70-20-10** — traced to a mid-1990s survey of approximately 200 executives retrospectively
  self-reporting, drawn from a narrow Fortune 500 population and never replicated. The module files
  it under confident canon; the "Take a position" section states honestly that its status is a live
  argument rather than settled. **[V]**
- **No published error rate exists** for AI-assisted training or compliance content. Searched before
  drafting; what exists is vendor commentary, general legal advisory, and analogy to fabricated-
  citation research in law. Stated as an absence rather than filled with a borrowed figure. **[V]**
- **The five clusters, the backward read, and premise inheritance as a fifth failure type past 101
  M6's four are original to this course.**
- Builds on 101 M5 (briefing — here shown as the delivery mechanism) and 101 M6 (the four failure
  types), and is the module Module 5's compliance content depends on.
