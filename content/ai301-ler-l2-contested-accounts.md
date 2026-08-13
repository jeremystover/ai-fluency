# AI 301 · Labor & Employee Relations · Module 2 — Contested accounts

**Course:** AI 301 · The Specialist — Labor & Employee Relations track · Module 2 of 8
**Estimated time:** 30 min content · 10 min exercise · 30 min applied activity
**Prerequisite:** Module 1 (the ladder is the vocabulary) · builds on 101 M6 (confident wrongness) by
describing a failure 101 M6 does not cover
**Position in the track:** the signature module — the line another track marks and declines to draw

> `Concepts reviewed: [DATE] · Examples current as of: [DATE]`
> **Entirely stable layer.** This module contains no statistics. It is argued from craft, and the
> craft does not move.

---

## Calibration prompt — the claim to contest

*Commit before you read anything. Thirty seconds.*

**The claim:** *"A summary of three witness statements is a summary."*

**Is that true?** *True* or *not true*, and the one sentence you would defend it with. This is the one
claim in the track that is about the work rather than about your organization, because if it is
false, a large amount of what your function is currently doing with AI is wrong in a way nobody has
noticed.

**And the number you will check by running it.** The activity has you write three short conflicting
accounts of a fictional incident and **plant exactly five factual conflicts** in them, then ask a model
to summarize. **How many of your five conflicts will survive into the summary, unprompted?**

Out of five. Commit before you try it.

---

## Module brief

Every other role in this curriculum feeds a model material that has a fact behind it. A policy
document says what it says. A pay file contains numbers. A requisition has a scorecard. The material
may be wrong, stale, or badly assembled (101 M6 taught you to expect that) but there is a fact
somewhere the material is trying to describe.

**Your core input is two or more people telling incompatible stories about the same events.** And the
incompatibility is not noise around a signal. **The incompatibility is the evidence.** It is the thing
the investigation exists to surface, examine, and resolve.

Which produces a failure mode this curriculum has not described anywhere, and it is not the model
being wrong. It is the model being **right about every source and wrong about the whole**, because it
did the thing it is built to do.

There is one more reason this module exists here. The HR business partner track's legal module comes
close to this territory — it names "flagging inconsistencies between witness accounts" and marks it as
*approaching credibility*, then stops. That is exactly right for a generalist who writes an
investigation summary twice a year. **For a specialist who does this weekly, drawing the line is the
job**, and this module draws it.

## Learning objectives

By the end of this module you should be able to:

1. Explain why your source material has no ground truth, and what that changes about summarization.
2. Describe the harmonization failure: a model faithful to every source that destroys the finding.
3. Apply the line: **a model may locate conflicts; only a human may resolve them**, and recognize the
   request that crosses it while appearing analytical.
4. Explain why applying a standard of proof is itself weighing.
5. Handle silence — distinguishing what an account contains, omits, and contradicts, and keeping those
   three answers separate.

## Lesson 1 · There is no ground truth in your source material

Start with what makes this role's inputs different, because everything else follows from it.

When a comp analyst feeds a model a pay file, the file is an attempt to describe something real. When
a People Ops lead feeds it a leave policy, the policy is the authority. In both cases the model's job
is to represent the source accurately, and accuracy is a coherent thing to ask for.

Now consider what you feed it. Three people were in a meeting. One says the respondent shouted. One
says voices were raised on both sides. One says nothing happened that they would describe as unusual.
**There is no document that settles this.** The accounts are not corrupted copies of a true account.
They are the entirety of what exists, and the investigation's product is a *decision about them*
reached by a human who is accountable for it.

Two consequences that are easy to state and easy to forget under load.

**"Accurate to the source" is no longer a sufficient standard.** A summary can be faithful to every
one of three statements and still be useless, or worse than useless. Fidelity is necessary and it has
stopped being the test.

**And the useful structure of the material is its disagreement.** In every other application,
disagreement between sources is a problem to be resolved before the work proceeds. Here it is the
work. An investigator reading three statements is looking first at where they diverge, because that is
where the case is, and any process that reduces the divergence has removed the signal rather than the
noise.

## Lesson 2 · Summarization harmonizes

Now the failure, stated precisely, because the imprecise version leads people to the wrong fix.

Ask a capable model to summarize three conflicting accounts and it will produce something coherent.
Not because it is careless — **because coherence is what summarization is.** The operation compresses
by finding the through-line, resolving redundancy, and producing prose that reads as a single account
of events. That is the correct behaviour for every other use of summarization in this curriculum.

Here it means:

> **A model can be accurate to every source it was given and still destroy the finding, by producing a
> coherent account of events that were never coherent.**

How it shows up in practice, four mechanisms, and none of them is a hallucination:

**Smoothing.** *"Witnesses described a heated exchange in the 14 March meeting."* Every word defensible.
It has silently merged an allegation of shouting, a description of mutual raised voices, and an account
of nothing unusual, into a single characterization that no witness gave.

**Averaging.** Where accounts differ on a detail, the summary lands on the middle or the modal version
— which is a form of weighing, performed invisibly, with no record that a choice was made.

**Confidence flattening.** *"I think it was Tuesday, but I might be wrong"* and *"It was Tuesday"*
arrive in the summary identically. The hedge was the most useful word in the sentence.

**Narrative completion.** Three partial accounts get assembled into a sequence that runs start to
finish, and the joins are inferences the model supplied because a narrative needs them.

**Why this is not 101 M6.** That module taught you that fluent output can be confidently wrong, and the
answer was verification — check the claim against the source. **That answer does not work here**, because
if you check this summary against the sources, every sentence checks out. There is no fabrication to
find. The error is not in the relationship between the summary and any source; it is in the
relationship between the summary and **the state of the evidence**, which the summary has misrepresented
as more settled than it is.

That is why this module exists rather than being a caution in a module you already took.

> ### Try this — 3 minutes
> Think of a matter type where you have read multiple accounts. Now imagine the two-paragraph summary
> that a competent colleague would write, and ask: could someone reading only that summary tell what
> the parties **disagreed about**? If the answer is no, the summary has already harmonized, and no
> model was involved.

## Lesson 3 · The line, drawn

Here is the resolution, and it is finer than the general instinct that "AI shouldn't judge people."

> **A model may locate conflicts. Only a human may resolve them.**

**Locating** is factual and independently checkable. *Account A places the meeting on Tuesday. Account
B places it on Thursday. The calendar entry says Wednesday.* Three statements about what the material
says, each verifiable in seconds by opening the material. This is rung two, it is safe, and it is
genuinely valuable, an investigator working a large file will miss conflicts a systematic pass will
catch.

**Resolving** is a credibility determination. *Account A is more reliable.* Rung four. Forbidden, and
comparatively easy to avoid, because the sentence announces itself.

**And now the request in between, which is where careful people go wrong.** It sounds analytical, it
feels like rung two, and it is resolution:

> *"Which account is most consistent with the other evidence?"*

That is weighing. It takes the conflicts you legitimately located and asks for a ranking against a
standard, and a ranking against a standard is a finding. The model will answer (helpfully, fluently,
with reasons) and you will now have a credibility determination in your process whose author is a
system, arrived at by a route you cannot reconstruct, and you will not be able to say when it entered
your thinking.

Three more requests on the wrong side of the line, all of which get asked in good faith:

- *"Does the respondent's account hold together?"*, internal-consistency assessment as a proxy for
  credibility.
- *"Rate each account's reliability."* — the same thing with a number on it, which is worse, because
  numbers travel.
- *"Which parts of this account should I be sceptical about?"*, scepticism allocation is the
  investigator's job, and outsourcing it is outsourcing the finding one step upstream.

**And the deeper reason the line sits exactly here.** Your standard of proof (the balance of
probabilities, preponderance of the evidence) is not a threshold you check a number against. **It is
an instruction to weigh.** Which means:

> **A model that weighs has applied your standard of proof on your behalf, and you cannot say how.**

Not "cannot say precisely." Cannot say at all. You will have a conclusion, an impression of why, and no
reconstructable path from evidence to finding, which is the one thing an investigation report has to
contain, and the thing the opposing side will spend its time attacking.

**The practical form**, and it is a prompt discipline rather than a policy:

- Ask for conflicts **as a list**, one per row, each with the accounts it involves and the exact words
  at issue. A list resists being read as a narrative.
- Ask for it **without commentary.** Adding "and note which seems more plausible" is the whole failure.
- **Never ask a question whose answer is a comparison of people.** Compare *statements* to
  *statements*, and *statements* to *documents*. Never accounts to each other on quality.
- And record it as located rather than concluded, so that when the human resolution happens, it is
  visibly a human resolution — which is Module 4's provenance problem arriving early.

## Lesson 4 · Silence, and what a model does with it

One more property of your material, and it is the one that produces the worst outcomes because it is
invisible.

**An account that omits something is not an account that denies it.** A witness who does not mention
the 14 March meeting may not have been there, may not remember, may not have been asked, or may be
avoiding it. Those are four completely different evidential states and the statement is identical in
all four.

**Models fill gaps**, because filling gaps is most of what generative systems do. Give one three
partial accounts and ask what happened, and the answer will be more complete than the inputs. The
completion is not marked. It is not flagged as inference. It reads exactly like the parts that came
from the material.

Which makes the omission (often the most important thing in a statement) the single thing a fluent
summary most reliably disappears. *Nobody mentioned the earlier conversation* is a finding. *The
summary does not mention the earlier conversation* looks like nothing at all.

**The practical consequence is a change in what you ask for.** Never ask what an account
*establishes*. Ask three separate questions and keep the three answers separate on the page:

1. **What does this account contain?** Assertions actually made, ideally quoted.
2. **What does it omit?** Specifically: which of the matters at issue does it not address? This is the
   question that requires you to have a list of matters at issue, which is why intake structure from
   Module 1 pays off here.
3. **What does it contradict?** Which other account or document, on which point, in whose words.

Three answers, three headings, never merged. Merging them is harmonization performed by you rather than
by the model, and the resulting document is no better for having been assembled by hand.

And the check worth running on any AI-assisted output before it goes near a file: **does this text
distinguish what somebody said from what somebody did not say?** If it does not, it has treated silence
as agreement, and silence is where the case usually is.

## Key takeaways

- **Your source material has no ground truth.** Two or more people telling incompatible stories, where
  **the incompatibility is the evidence** rather than noise around it.
- **"Accurate to the source" has stopped being a sufficient standard.** A summary can be faithful to
  every statement and still be worse than useless.
- **Summarization harmonizes, and that is the failure**, not a hallucination. Four mechanisms:
  **smoothing** (a merged characterization no witness gave), **averaging** (invisible weighing on
  contested details), **confidence flattening** (the hedge was the most useful word), and **narrative
  completion** (joins the model supplied because a narrative needs them).
- **This is not 101 M6, and verification does not fix it.** Check the summary against the sources and
  every sentence holds. The error is in the relationship between the summary and **the state of the
  evidence.**
- **A model may locate conflicts; only a human may resolve them.** Locating is checkable in seconds;
  resolving is a credibility determination.
- **The request that crosses the line while appearing analytical:** *"which account is most consistent
  with the other evidence?"* Also: does the account hold together, rate each account's reliability, and
  which parts should I be sceptical about.
- **Your standard of proof is an instruction to weigh** — so **a model that weighs has applied your
  standard on your behalf and you cannot say how**, which leaves you with a conclusion and no
  reconstructable path from evidence to finding.
- **Ask for conflicts as a list, without commentary; compare statements to statements and statements to
  documents, never accounts to each other on quality.**
- **An account that omits something is not an account that denies it**, and models fill gaps
  unmarked. Ask three separate questions (**contains, omits, contradicts**) and never merge the
  answers. **Silence is where the case usually is.**

## Take a position

**The claim:** *"A model may locate conflicts. Only a human may resolve them, and asking which
account is most consistent with the other evidence is resolution wearing an analytical costume."*

The strongest counter-argument is that **the line is unworkable, because every act of locating is
already an act of selection.**

Deciding which discrepancies are worth surfacing is a judgment about **materiality**. A pass that
returns every inconsistency (one witness said "about three", another said "just after three", one
wrote "Weds" and another "Wednesday") is noise, and an investigator handed forty trivial conflicts has
been given more to read rather than less. A pass that returns only the material conflicts has
**already weighed**, on exactly the dimension the rule forbids. So the line either produces something
useless or smuggles in the judgment it prohibits, and pretending otherwise is a rule that survives on
paper because nobody tests it.

And the sharper version, which uses Module 1's own argument. Investigators reach for these tools
**because the caseload doubled.** A rule whose only permitted output is an unfiltered conflict list
makes the work longer. **Rules that make the work longer lose to the workaround** (Module 1 said so
explicitly) so this one will be quietly abandoned by the people it was written for, and its
abandonment will be invisible.

On that view the honest design is different: **accept that materiality filtering is weighing, permit
it explicitly, and have the human check the filter rather than the list.** Ask the model which
conflicts it judged immaterial and why, and review *that*, which puts the judgment on the page where
it can be examined instead of pretending it did not happen.

Your position has to say whether materiality filtering falls on the safe side of the line. If you say
it does, explain what stops it becoming credibility assessment by degrees. If you say it does not, say
**what makes the rule usable by somebody carrying twice the allegations they carried in 2021** — because
a rule that only works at 2021 volumes is not a rule, it is a preference.

## Applied activity — "The conflict rule"

**Time:** 30 minutes · **Submit:** the constructed test and its result, the written rule, and a
300–400 word write-up · **Graded against the rubric below.** Score doesn't matter. Doing the work is
where the learning lands.

**No case facts.** This activity is built so that you never need them: you will construct a fictional
scenario. Do not adapt a real matter, even lightly — "changing the names" is how identifiable content
reaches a submission.

**Step 1. Build the test (10 min).** Invent a workplace incident. Write **three short accounts** of it
— 100 words each is plenty, from three fictional people. Plant **exactly five factual conflicts**
between them, and list your five privately before you go on. Make them varied: one on timing, one on
who was present, one on what was said, one where an account **hedges** and another is certain, and one
where a matter is **omitted** by one account entirely.

**Step 2 — Run it (5 min).** Give a model the three accounts and ask it to summarize them, using
whatever wording you would naturally use. **Do not prompt it to look for conflicts**. That is the
point of the test. Keep the output.

**Step 3. Count (5 min).** How many of your five conflicts survive into the summary in a form a reader
could detect? Note specifically what happened to the **hedge** and to the **omission** — those two are
usually the first to disappear.

**Step 4. Write the rule (8 min).** A rule your team can operate, covering: what a model may be asked
about conflicting accounts, what it may never be asked, **two or three exact prompt patterns** that
stay on the safe side, and how a located conflict gets recorded so that the human resolution is
visibly a human resolution. **Graded on whether a colleague could apply it without you in the room.**

**Step 5. Score the prediction.** Predicted conflicts surviving against actual, out of five.

Then the write-up: your position on the claim above — including whether **materiality filtering** is on
the safe side, and what makes your rule usable at current caseloads; what the test showed you,
especially about the hedge and the omission; and the honest one — **which of the four harmonization
mechanisms you have most likely already shipped in your own hand-written summaries**, before any model
was involved.

## Knowledge check — 8 questions

*Unlocks after the applied activity is submitted. Retakes are free and unlimited.*

**Q1.** What makes this role's source material different from every other role's in this curriculum?

- A. It is more sensitive and more heavily regulated
- B. There is no ground truth, the material is incompatible accounts, and the incompatibility is the evidence rather than noise around a signal ✓
- C. It is unstructured rather than tabular
- D. It arrives continuously rather than in batches

> **B.** Which means "accurate to the source" stops being a sufficient standard: a summary can be
> faithful to all three statements and still be worse than useless.

**Q2.** Why is harmonization not a hallucination?

- A. Because the model is following its instructions correctly
- B. Because coherence is what summarization *is*, the operation compresses by finding a through-line, so nothing is fabricated and every sentence checks out against a source ✓
- C. Because the errors are small enough to fall within tolerance
- D. Because the model discloses its uncertainty

> **B.** Which is why 101 M6's answer (verify the claim against the source) does not work here. The
> error is in the relationship between the summary and the *state of the evidence*.

**Q3.** Which harmonization mechanism describes a summary landing on the middle version of a contested detail?

- A. Smoothing
- B. Averaging ✓
- C. Confidence flattening
- D. Narrative completion

> **B.** And it is a form of weighing performed invisibly, with no record that a choice was made.
> Smoothing merges accounts into a characterization nobody gave; flattening loses the hedge;
> completion supplies the joins a narrative needs.

**Q4.** Where exactly is the line this module draws?

- A. AI may not be used on investigation material at all
- B. AI may summarize but a human must approve the summary
- C. A model may locate conflicts; only a human may resolve them ✓
- D. AI may assess consistency but not assign credibility

> **C.** Locating is factual and checkable in seconds. Resolving is a credibility determination. D is
> the specific error the module warns about — consistency assessment *is* resolution.

**Q5.** Which request crosses the line while appearing analytical?

- A. "List every point on which these accounts differ."
- B. "Which of these accounts is most consistent with the other evidence?" ✓
- C. "Quote the exact words each account uses about the meeting."
- D. "Which matters at issue does this account not address?"

> **B.** It takes conflicts you legitimately located and asks for a ranking against a standard, which
> is a finding. A, C and D are all rung-two requests about what the material says.

**Q6.** Why does the module say a standard of proof makes this a bright line?

- A. Because standards of proof are set by statute and cannot be delegated
- B. Because the balance of probabilities is not a threshold to check a number against. It is an instruction to weigh, so a model that weighs has applied your standard and you cannot say how ✓
- C. Because different jurisdictions apply different standards
- D. Because standards of proof require documented reasoning for audit purposes

> **B.** Which leaves you with a conclusion, an impression of why, and no reconstructable path from
> evidence to finding, the one thing the report has to contain and the first thing the other side
> attacks.

**Q7.** What does the module say about an account that omits a matter at issue?

- A. It should be treated as agreement with the other accounts
- B. It is not a denial — the statement looks identical whether the person wasn't there, doesn't remember, wasn't asked, or is avoiding it ✓
- C. It should be excluded until clarified
- D. Omissions are only significant if the witness was directly asked

> **B.** Four completely different evidential states, one identical statement, and models fill gaps
> unmarked, which makes the omission the thing a fluent summary most reliably disappears.

**Q8.** What three questions does the module substitute for "what does this account establish?"

- A. Who, what, and when
- B. Contains, omits, and contradicts, kept as three separate answers that are never merged ✓
- C. Reliable, unreliable, and unknown
- D. Corroborated, uncorroborated, and disputed

> **B.** Merging them is harmonization performed by you rather than by the model, and the document is
> no better for having been assembled by hand. Question two also requires a list of matters at issue,
> which is why intake structure pays off here.

## Sources and attribution

- **This module cites no statistics and contains no volatile content.** It is argued entirely from
  craft, which is deliberate: the harmonization failure is a property of what summarization does, not
  of any particular model or vintage, so nothing here should need re-verification.
- The no-ground-truth framing, the four harmonization mechanisms, the
  **locate-but-never-resolve** line, the analysis of why a standard of proof makes that line sharp, the
  three requests that cross it while appearing analytical, and the **contains / omits / contradicts**
  substitution are original to this course.
- **On its relationship to `ai301-hrbp-m6`.** That module's knowledge check offers "flagging
  inconsistencies between witness accounts" as a distractor and explains that it *edges toward
  comparing accounts, which approaches credibility.* That is correct for a generalist and it stops
  there. This module resolves what it declines to, which is the appropriate division: the generalist
  needs to know the territory is dangerous, the specialist needs the line. Recorded so the two do not
  drift, and so nobody reads them as contradicting each other.
- Builds on 101 M6 (confident wrongness — and explains why its remedy does not reach this failure),
  101 M7 (decisions about people), and Module 1 of this track (the evidentiary ladder, whose rung-four
  boundary this module is a detailed account of). The *Take a position* counter-argument uses Module
  1's own cheaper-than-the-workaround rule against this module's line.
