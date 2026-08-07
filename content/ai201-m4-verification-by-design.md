# AI 201 · Module 4 — Verification by design

**Course:** AI 201 · The Practitioner · Module 4 of 8
**Estimated time:** 30 min content · 10 min exercise · 25 min capstone activity
**Prerequisite:** none formally — but this module is the **strong prerequisite for M5**: the
autonomy ladder's rungs are defined by what you can verify, so nothing climbs until this is built.
**Builds on:** 101 M6 (confidence ≠ correctness) · 201 M1 (the spec's verification line) · 201 M3 (checkpoints)

> `Concepts reviewed: [DATE] · Examples current as of: [DATE]`
> This module is almost entirely stable layer. Verification is the part of the practice that
> tool updates change least — and the part that matters most when they change everything else.

---

## Calibration prompt — before you start

*Two predictions, thirty seconds. The capstone scores them.*

At the end of this module you'll run a real verification sample on your workflow's output.

1. **Out of ten outputs, how many will contain at least one real error?** A number, not a range.
2. **What kind will dominate?** Wrong (contradicts the source) · missing (source material that
   should be there and isn't) · invented (content with no source at all).

The second prediction is the interesting one. Most practitioners guess "invented," because 101
taught them to fear hallucination. Volume workflows usually surprise them.

---

## Module brief

There are two ways to run a workflow irresponsibly, and only one of them looks irresponsible.

The visible way is checking nothing: outputs ship on fluency, and 101 M6 told you exactly how
that story goes — the failure is quiet, plausible, and wearing your name. Nobody in this course
is doing that.

The invisible way is more common among people who finished 101: **checking everything.** Every
output, read end to end, every run. It feels like diligence. It is actually two failures at
once. First, it silently refunds the time the workflow saved — your M1 calibration
predicted hours back, and full-read review hands most of them right back. Second, it doesn't
survive contact with a busy month. Willpower-based verification decays: you read every word in
week one, skim in week three, and by week six you're approving on fluency — which is checking
nothing, plus a false sense of coverage. That last step off the cliff is where "a human reviews
everything" becomes the most dangerous sentence in the building, because everyone has stopped
worrying.

The practitioner's alternative is a **verification budget**: a designed, honest answer to "how
much checking does this output deserve, of what kind, by whom" — written into the workflow so it
happens by structure rather than by mood. Sized to stakes, matched to failure mode, cheap enough
to survive week six. That's this module. It's also the toll gate for the rest of the course:
M5's autonomy ladder is built entirely out of what you can verify, and M8 won't let anything
ship without the plan you write here.

---

## Learning objectives

By the end of this module you should be able to:

1. Size a verification budget to stakes — and defend both the spending and the *not*-spending.
2. Match technique to failure mode: sampling for volume, tracing for facts, adversarial reading
   for judgment-adjacent prose, diffing for drift.
3. Run an honest sample, classify what it finds, and know the escalation path when the rate is
   too high.
4. Write a sign-off that means something: one name, and a definition of what that name actually
   reads.
5. Run the output-incident path when something shipped wrong anyway — including the case where
   it influenced a decision about a person.
6. State what "verified by hand" in the practitioner's heuristic operationally requires.

---

## Lesson 1 · The verification budget

Start from the two ends, because both are wrong for almost everything.

**100% review** is correct exactly where a single bad output can do real harm to a person or
the organization — and if your workflow produces such outputs, M1 already asked whether it
should be a workflow at all. **0% review** is correct nowhere in People work; even the
lowest-stakes newsletter carries your credibility in it.

Everything real lives between, and the budget question has three parts:

**How much?** Scale to stakes, which you scored in M1's audit. Low stakes (internal newsletter,
jargon-stripped postings): sample. Medium (survey narratives, policy notes — things leaders act
on): sample harder, plus a targeted pass on the riskiest section. High (anything adjacent to an
individual's treatment): full review, every time, by design — the budget for these isn't "less
reading," it's *structured* reading.

**Of what?** This is M3's dividend. You verify *artifacts at checkpoints*, not final prose from
scratch. Checking a theme table against raw comments is minutes; auditing a finished exec
summary with no intermediates is an afternoon — and less reliable, because by the time loss is
visible in prose, it isn't visible in prose. A workflow with good checkpoints has already paid
most of its verification bill.

**Paid by whom, when?** In-run checkpoints (you, at the pause between steps) catch process
failures. Across-run sampling (you or a delegate, weekly or per-batch) catches *decay*: the
pack going stale, the source format shifting, the step prompt that worked in March eroding in
June. Both lines go in the budget; they find different things.

And one design constraint that outranks the others: **the budget must be cheap enough that
week six runs it exactly like week one.** A verification plan you'd abandon under deadline will
end as fluency-approval anyway. When in doubt, buy a smaller budget you'll actually spend.

> ### Try this — 2 minutes
> Take the last AI-assisted output you actually shipped.
>
> 1. What percentage of it did you genuinely verify — not read, *verify*?
> 2. Was that a decision, or a mood?
> 3. If a colleague shipped the same output with the same checking, would you call it diligent?
>
> No score. Just notice whether your current budget was designed by anyone, including you.

---

## Lesson 2 · Technique matches failure mode

"Check it" is not a technique. What checking means depends entirely on how the output fails —
and 101 gave you the failure taxonomy; this lesson pairs each entry with its counter.

**Volume transformations fail by erosion → spot-check sampling.** Debriefs, FAQs, rewritten
postings: the failure mode is rarely one spectacular fabrication; it's a slow leak — a dropped
qualifier here, a flattened nuance there. Counter: fixed-size sample per run or per week (three
outputs, rotating), each checked against its *source*, findings classified **wrong / missing /
invented**. The classification isn't bookkeeping — it's diagnosis. Wrong and missing usually
mean a step prompt or pack problem (fixable in the runbook, M3); invented means the model is
filling gaps in supplied material (fix the inputs, or the workflow's scope).

**Factual claims fail by fabrication → trace to source.** Numbers, citations, regulation
references, quotes: fluency tells you nothing (101 M6, permanently). Counter: every claim
traces to an artifact — the count to the theme table, the quote to the raw comments, the
regulation to the actual text *by a human, every time*, never to the model's memory of it. The
M3 pipeline design makes this cheap: claims that carry their numbers and sources are traceable
in minutes; claims that don't are unverifiable by construction, which is a design failure, not
a checking failure.

**Judgment-adjacent prose fails by plausible slant → adversarial reading.** Narratives leaders
will act on: the survey story, the change note, the packet. The output isn't false; it's
*angled* — smoothed, averaged, one office's problem dissolved into "mixed sentiment." Counter:
read it as its strongest critic. Three prompts to run in your own head or hand to a fresh
conversation: *What would the person most affected say is missing? Which sentence would I
delete if I had to defend every remaining one? Argue this summary is materially wrong.* A
second-model pass — a clean conversation given the source artifact and asked to critique the
narrative against it — is a cheap, genuinely useful skeptic. Treat it as a smoke detector, not
a guarantee: it shares the first pass's blind spots, and it must never *replace* the human
read on high-stakes output, only sharpen it.

**Format and drift fail silently → diff against the standard.** The output slowly stops
matching the definition of done; nobody notices because each step was small. Counter: your M2
pack already holds the gold-standard example and the checklist — put a periodic diff against
both into the sampling rotation. Thirty seconds; catches the slide while it's still cosmetic.

### Exercise — Buy the right verification

*Five minutes. Commit before you look.*

Six outputs from a People team's workflows. For each, pick the **primary** technique — sample /
trace / adversarial read / diff — and the budget level — light / standard / full. (Most items
deserve more than one technique; choose what you'd spend *first*.)

1. Forty rewritten job postings, batch-produced monthly
2. The exec survey narrative, quoting counts by office
3. A benefits FAQ produced weekly from the plan summary
4. A change note claiming "this complies with the new state leave law"
5. The interview evidence packet for tomorrow's debrief
6. This week's newsletter, drafted from your bullets

*(Key at the end of the module. Two of the six are designed to be argued about.)*

---

## Lesson 3 · The sign-off

M1 said it as a rule: an output nobody owns is an incident that hasn't happened yet. This
lesson makes the rule operational, because "accountability" that lives in a feeling is not a
control.

**One name.** Every workflow's spec carries exactly one human whose name is on its outputs. Not
a team, not "People Ops," not whoever ran it that day. The test is brutal and clarifying: *when
this output turns out to be wrong in a way that matters, who gets the call?* If the answer
requires discussion, the workflow doesn't have an owner yet.

**What the name actually reads.** A sign-off is defined by its inputs, or it's theater. Write
down, in the spec, what the owner looks at before an output ships: which checkpoint artifacts,
which sample results, which sections in full. This is where the budget from Lesson 1 becomes a
checklist a person can actually run — and where you inoculate against the decay curve, because
"sign-off = read the theme-table diff and this week's three samples" survives a busy month in a
way "sign-off = review it" never has.

**The rubber-stamp trap, named again.** M1 warned that "a human clicks approve" doesn't move
the decisions-about-people line if the human stopped deciding. The same mechanism eats
sign-offs: an approval that no longer reads its defined inputs is worse than no approval,
because it *launders* — it stamps unverified output with a person's credibility. Two defenses.
Keep the sign-off's reading list short enough to be real (Lesson 1's constraint again). And
when the owner catches themselves approving without reading, treat it as the workflow's
failure, not the person's: the budget was priced wrong. Reprice it.

**Delegation, honestly.** The owner need not run the checks — a coordinator can run samples, a
second model can pre-read. The owner is the one who *cannot delegate the consequences*. That
asymmetry is the whole design: checks can move; the name doesn't.

This line item — the name, and what the name reads — is the difference between M8 shipping
your workflow and M8 shipping your liability. It's also the first thing a colleague inherits
in the handoff test, which is why the spec writes it down rather than assuming it.

---

## Lesson 4 · When it shipped anyway

Everything so far catches errors before they leave. Some won't be caught. The debrief that
mischaracterized a candidate went to the hiring manager last Tuesday; the theme summary that
misread a team's comments already shaped a staffing conversation. In People work this is both
more likely and more consequential than a data spill — and it needs its own path, written in
advance, exactly like the spill path M6 will give you. Four steps, in order:

**1. Correct the record, at the error's own prominence.** Identify everyone who consumed the
output — your M3 artifacts and M5 audit trail tell you who, which is a quiet argument for both.
The correction goes to all of them, through the same channel the error traveled, stated
plainly: what was wrong, what's right, what's being done. A correction buried in a reply-all
three days later is not a correction at the error's prominence.

**2. Check for decision impact — and reopen what was touched.** The question a general counsel
will eventually ask, so answer it before they do: *did this output influence a decision about a
person?* If the mischaracterized debrief fed a hiring call, the call gets revisited with
corrected input, and the revisit is documented — who reconvened, what changed, what didn't and
why. This is the step that distinguishes an error from a harm: the error was the output; the
harm is a decision standing on it after you knew.

**3. Trace the miss to its budget line.** Which layer should have caught it — a checkpoint, the
sample, the sign-off's reading list? M3's backward walk gives the address. "It slipped through"
is not a finding; "the adversarial read doesn't cover per-candidate debriefs" is.

**4. Reprice.** The specific line changes: a checkpoint gains a what-would-wrong-look-like
clause, the sample widens for that output type, the reading list grows by one item. One
incident, one design change — resist the urge to add three; untargeted controls are how budgets
stop surviving week six.

The ownership is already decided: the sign-off name from Lesson 3 owns the correction — that is
part of what the name means. And the culture rule is the same one M6 will state for spills: the
path only works if using it is safe. An output incident that gets quietly patched downstream,
without the correction or the decision check, is the version of this that ends up in front of
counsel with the timeline against you.

---

## Capstone stage 4 · The verification plan — and the first honest sample

Your workflow now has a spec (M1), a pack (M2), and a pipeline with checkpoints (M3). Write
its verification plan, then prove it against reality.

**Submit:**

1. **The budget** — stakes level (from your M1 audit, restated honestly), what gets verified
   at checkpoints in-run, what gets sampled across runs, at what size and rhythm, and the one
   sentence that matters: *why this is enough, and why it's not more.* Both directions need
   defending.
2. **The technique map** — your workflow's main failure modes (wrong / missing / invented /
   drift / slant), and which technique from Lesson 2 counters each. If adversarial reading
   applies, include the two or three critic-questions you'll actually use, written for your
   output, not copied from this module.
3. **The sign-off line** — the name (yours, for now), and the defined reading list: exactly
   what gets looked at before an output ships. Short enough to survive week six.
4. **The sample, run for real** — at least five outputs (from real runs; produce them if your
   workflow is young), each checked against source, findings classified wrong / missing /
   invented, and the honest tally. Then score your calibration from the top of the module:
   both predictions, both misses, direction named. If the sample found nothing, say what
   you'll watch across the next three runs rather than declaring victory — five clean outputs
   is a good sign, not a verdict.
5. **The escalation line** — the error rate at which you stop and fix (runbook first — M3's
   backward walk), and the rate at which you'd conclude this workflow isn't ready for more
   autonomy. That number is your admission ticket to M5; you'll use it there.
6. **The output-incident path** — Lesson 4, written for your workflow: who consumed last
   month's outputs and how you'd reach them, what the correction channel is, and what a
   decision-impact check would look like for this output specifically.

### Rubric — 20 points

| Dimension | 5 points |
|---|---|
| **Fit to stakes** | The budget matches the M1 stakes honestly — no full-read theater on low stakes, no sampling hand-waves on high. The "why not more" sentence shows real reasoning. |
| **Technique match** | Failure modes identified for *this* workflow, each paired with the right counter; adversarial questions are bespoke, not boilerplate. |
| **The sample is honest** | Real outputs, real source-checking, findings classified, and the tally reported straight — including the awkward ones. A suspiciously clean sample with no follow-up plan scores low. |
| **Calibration** | Both predictions recorded first, scored honestly, direction of error named. Accuracy isn't graded; honesty and specificity are. |

---

## Key takeaways

- **Checking everything is the invisible failure.** It refunds the workflow's savings, then
  decays into checking nothing — with a false sense of coverage on top.
- **The budget has three parts:** how much (sized to stakes), of what (artifacts at
  checkpoints, not prose from scratch), by whom and when (in-run pauses catch process;
  across-run samples catch decay).
- **Technique matches failure mode.** Sample for erosion, trace for fabrication, read
  adversarially for slant, diff for drift. "Check it" is not a technique.
- **Classification is diagnosis:** wrong and missing point at the runbook or pack; invented
  points at the inputs. The tally tells you what to fix, not just how worried to be.
- **One name, defined reading.** A sign-off is its reading list. An approval that stopped
  reading launders credibility — when you catch it, reprice the budget.
- **When something ships wrong anyway:** correct the record at the error's own prominence,
  check whether a decision about a person stood on it and reopen what was touched, trace the
  miss to its budget line, change that one line. The sign-off name owns the correction.
- **"Verified by hand" now has a definition** — and it's the currency M5's autonomy ladder is
  priced in.

---

## Exercise key — Buy the right verification

**1. Forty postings, monthly** — *sample, light.* Volume transformation, low stakes, erosion
failure. Three per batch against source, classified. Full reads here are the budget-killer
from Lesson 1.

**2. Exec survey narrative** — *trace, standard, plus adversarial read.* Every count and
concentration to the theme table (minutes, thanks to M3), then the critic's pass — this is the
Denver scenario's home ground. One of the two arguable items: trace vs. adversarial as
primary. Defensible either way; the indefensible answer is "sample" — you don't sample the
one narrative leadership acts on.

**3. Weekly benefits FAQ** — *sample, standard.* Volume-ish and pack-driven, but benefits
errors reach real people's decisions, so the sample runs weekly and any *invented* finding
triggers a full pass. Drift-diff joins the rotation monthly.

**4. "Complies with the new state leave law"** — *trace, full — by a human, to the actual
text.* The one answer designed not to be arguable. A compliance claim is never sampled, never
delegated to the model's memory of the law, and 101's rule stands: verify current specifics
with counsel. If the workflow routinely produces sentences like this, the workflow's scope is
wrong, not just its verification.

**5. Interview evidence packet** — *trace, full.* Every claim to your notes, every gap
confirmed as flagged-not-filled. Adjacent to a decision about people: budget is structured
full review, and the M1 line is part of what you're verifying — evidence, no verdicts.

**6. Newsletter from your bullets** — *diff, light.* Lowest stakes on the board; the real risk
is drift from the definition of done. The other arguable item: a light sample also fine. What
it must not consume is the budget the packet and the compliance claim need.

**The pattern:** spend where failure is invisible or touches people; save where failure is
cosmetic and loud. If your six answers were all "standard," you've met the exercise's real
target — a flat budget is a default, not a design.

---

## Knowledge check — 8 questions

*Unlocks after the capstone plan is submitted. Retakes are free and unlimited.*

**Q1.** Why is "a human reviews everything" often the most dangerous verification plan?
- A. Human review is less accurate than automated checks
- B. It refunds the workflow's time savings, then decays under load into fluency-approval — while everyone believes coverage is total ✓
- C. It violates the delegation heuristic
- D. Full review is only dangerous for high-stakes outputs

> **B.** The decay curve is the danger: week one reads everything, week six approves on
> fluency, and the plan's reputation for rigor is exactly what stops anyone from noticing.

**Q2.** The cheapest place to verify a pipeline's work is:
- A. The final output, read end to end
- B. The artifacts at checkpoints, against their sources ✓
- C. A second model's opinion of the final output
- D. User complaints after shipping

> **B.** M3's dividend: a theme table checks against raw comments in minutes, and catches loss
> that final prose hides by construction. A is the expensive, less reliable afternoon; C is a
> useful smoke detector, not a foundation.

**Q3.** Your weekly sample of debriefs finds two "missing" findings and no "invented" ones. The likely fix lives in:
- A. The model — switch to a more capable one
- B. The step prompt or pack — source material is being dropped, which is a runbook problem ✓
- C. The sample size — too small to conclude anything
- D. Nothing — missing findings are acceptable at low rates

> **B.** Classification is diagnosis: wrong/missing point at instructions and pack; invented
> points at gaps in supplied material. That's why the tally is classified at all — the
> categories have different addresses.

**Q4.** Adversarial reading exists because judgment-adjacent prose fails by:
- A. Fabricating citations
- B. Being angled — smoothed and averaged in ways that are plausible rather than false ✓
- C. Exceeding the context window
- D. Drifting from the output format

> **B.** The Denver summary wasn't a lie; it was a slant. Tracing catches false claims;
> only a critic's read catches a true-ish narrative that buries the signal.

**Q5.** A second-model critique pass should be treated as:
- A. A replacement for human review on routine outputs
- B. A guarantee against hallucination
- C. A cheap skeptic that sharpens the human read but shares the first pass's blind spots ✓
- D. Forbidden — models must not check models

> **C.** It's a smoke detector: genuinely useful, cheap to run, and never the thing that
> makes high-stakes output safe on its own. A is the rubber-stamp trap with extra software.

**Q6.** A real sign-off is defined by:
- A. The seniority of the person approving
- B. Its reading list — the named inputs the owner looks at before shipping ✓
- C. The approval being recorded in writing
- D. A second approver for high-stakes outputs

> **B.** "Sign-off = the theme-table diff plus this week's three samples" is a control.
> "Sign-off = review it" is a sentiment with a signature line. The name matters too — but only
> paired with what the name reads.

**Q7.** The owner catches herself approving outputs without reading the defined inputs. The module's prescription:
- A. Replace the owner
- B. Add a second approver
- C. Treat it as a pricing failure — the budget was too expensive to survive a busy month — and reprice it ✓
- D. Automate the sign-off

> **C.** Willpower failures of well-designed systems are rare; willpower failures of
> overpriced ones are guaranteed. Fix the design, and the person's diligence becomes
> affordable again.

**Q8.** "You may only systematize what you have verified by hand" — after this module, "verified" operationally means:
- A. The owner has read every output the workflow has produced
- B. A sample was run once before launch
- C. A written budget exists — sized to stakes, techniques matched to failure modes, a defined sign-off — and an honest sample has been run against real outputs ✓
- D. No errors have been reported by recipients

> **C.** Not everything read (A is the decay trap), not one pre-launch glance (B), and never
> silence-as-evidence (D). A designed, running, honest verification layer — which is exactly
> the ticket M5 checks at the door.

---

## Sources and attribution

Builds on 101 M6 (confidence/correctness decoupling, verify-specifics-with-counsel) and 201
M1–M3 (stakes scoring, the pack's definition of done, checkpoints and the backward walk). The
verification-budget framing, the wrong/missing/invented classification, and "a sign-off is its
reading list" are this course's adaptations of a real literature — the sampling and
human-oversight ideas here are older than AI, and that ancestry is worth citing when a
data-literate reviewer pushes:

*To be verified against editions and current URLs before publication; re-check on the Tier 1
quarterly cadence.*

1. **Deming, W. E. — *Out of the Crisis* (1986).** "Cease dependence on inspection to achieve
   quality" — the classic argument behind Lesson 1's case that checking everything is the wrong
   spend, and that quality lives in the process design.
2. **Shewhart, W. A. — *Economic Control of Quality of Manufactured Product* (1931).** Process
   behavior over single-inspection thinking; the ancestry of reading error rates by direction
   and trend rather than level.
3. **ANSI/ASQ Z1.4 (successor to MIL-STD-105), *Sampling Procedures and Tables for Inspection
   by Attributes*.** The formal home of fixed-size, classified acceptance sampling — Lesson 2's
   spot-check design, industrialized.
4. **Bainbridge, L. — "Ironies of Automation," *Automatica* 19(6) (1983).** Why the human
   checker's job gets harder, not easier, as the automated part improves — the decay curve's
   classic statement, twenty years before LLMs.
5. **Parasuraman, R. & Riley, V. — "Humans and Automation: Use, Misuse, Disuse, Abuse,"
   *Human Factors* 39(2) (1997).** Automation complacency: the rubber-stamp trap, formally
   studied.
6. **Vaughan, D. — *The Challenger Launch Decision* (1996).** Normalization of deviance — what
   unlogged skipped reviews become, at the highest stakes on record.
7. **Gawande, A. — *The Checklist Manifesto* (2009).** The sign-off reading list is checklist
   design; this is the accessible case for why short, defined lists outperform diligence.

Stable layer throughout; the practices here are deliberately tool-independent.
