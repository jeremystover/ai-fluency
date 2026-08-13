# AI 301 · HRBP · Module 3 — The honest arithmetic

**Course:** AI 301 · The Specialist — HRBP track · Module 3 of 7
**Estimated time:** 45 min content · 10 min exercise · 25–30 min applied activity
**Prerequisite:** Module 2 (you can't measure what you haven't sorted) · builds on 201 M7 (measurement without theater)
**Position in the track:** the trust-earning module — the one the vendors will never build

> `Concepts reviewed: [DATE] · Examples current as of: [DATE]`
> Every survey figure, vendor case, and named implementation is **[V]** volatile layer. The audit
> method is stable.

---

## Calibration prompt — before you start

*One prediction, thirty seconds.*

There is a category of work that AI creates rather than removes: feeding it context, supervising
its output, debugging what it got wrong, and cleaning up downstream when something slipped
through. Researchers have started calling it **botsitting**, and it is almost never counted in
anyone's workload planning.

**How many hours a week do you personally spend botsitting?** Your own honest estimate, before
you see anyone else's number.

---

## Module brief

Every other module in this track makes you better at something. This one makes you harder to
sell to — including by us.

The premise is simple and slightly rude: **nobody in this market has an incentive to tell you
what AI actually costs in time.** Vendors count the minutes saved and not the minutes spent
supervising. Consultancies publish the case study with the good number. Your own team reports
the pilot went well, because that is what people say about pilots they championed. And you have
no baseline, so nothing in that chain gets checked.

The result is a function that can describe its AI adoption in confident detail and cannot say
whether any of it worked.

This module gives you the arithmetic to find out — four questions applied end to end to one real
workflow — and then turns the same skepticism outward at the claims you'll be shown. The
uncomfortable part is that the arithmetic sometimes returns a negative answer, and you have to
be willing to write that down. A function that only measures its wins isn't measuring.

## Learning objectives

By the end of this module you should be able to:

1. Explain the productivity paradox in this field — large perceived time savings, thin
   organizational value — and the mechanism that produces it.
2. Audit any workflow end to end with four questions, including the human time that most audits
   omit.
3. Recognize the volume trap: cheaper production shifts the constraint from making work to
   deciding which work matters.
4. Tear down a vendor claim on its evidence, its sample, and its falsifier — and know where in HR
   the credible proof actually clusters.
5. Name a specific destination for recovered time, and explain why an unnamed destination means
   the time wasn't recovered.

## Lesson 1 · The productivity paradox **[V]**

Three findings, which are hard to hold at once and are all well-evidenced.

**People believe AI saves them a great deal of time.** In a large multi-country study of digital
workers, the substantial majority reported AI saving them on the order of eleven hours a week.

**Organizations mostly can't find it.** In the same research, only about 13% said their
organization was performing significantly better as a result. And separately, Gartner reports
that **88% of HR leaders say their organizations have not realized significant business value
from AI tools.**

**And a measurable slice of the savings goes straight back out.** The same study measured an
average of **6.4 hours a week of botsitting** — feeding AI context, supervising its output,
debugging its mistakes, and cleaning up work downstream. That labour is largely unrecognized,
unbudgeted, and untracked.

Put those together and the paradox resolves without anyone lying. Individuals genuinely
experience relief — the blank page is gone, the first draft is instant. But a meaningful portion
of the saved time is consumed by supervision that nobody counts, and most of the remainder never
reaches the organization as anything visible, because it dissolves into the day rather than
being redirected anywhere.

The relief is real. The organizational value is what's missing, and it's missing for reasons
that are structural rather than mysterious.

## Lesson 2 · The four-question audit

The method, applied to one workflow, end to end.

**1. What is the total human time, including review and rework?** Not the generation time — the
*total*. Time briefing the model, time reading output critically, time fixing what was wrong,
time redoing it when the fix broke something else, and time you spent on the downstream mess if
something slipped through. This single question flips more workflows from positive to negative
than the other three combined, because the minutes it counts are exactly the minutes the vendor's
arithmetic omits.

**2. Did final quality actually improve, get worse, or stay the same?** Judged against what you
would have produced by hand, honestly, on the thing that mattered about the output. Faster and
slightly worse is a legitimate trade for some work and a disqualifying one for others — but you
have to name which you got.

**3. Where did the work move to?** Work rarely disappears; it relocates. Off your desk onto a
coordinator's. Out of drafting and into reviewing. From one person doing it slowly to three
people each checking a piece. Relocation can be a real win — reviewing is usually cheaper than
drafting — but relocation described as elimination is how a function convinces itself it saved
capacity it didn't.

**4. What did the freed capacity actually become?** The question almost nobody asks, and the one
that determines whether any of this reaches the organization. Gartner found that **only 7% of
organizations give employees any guidance on how to use time AI saves** — from a July 2025 survey
of 114 HR leaders, which is a small sample and worth saying so, since this module is about
checking exactly that. Small sample or not, 7% is the kind of number that would have to be
wildly wrong to change the conclusion.

Without an answer to question four, saved time is absorbed rather than recovered. It becomes
slightly more email, slightly more Slack, and a week that feels identical.

> ### Try this — 3 minutes
> Take the AI-assisted task you did most recently. Answer question one out loud, honestly, in
> minutes — including the reading and the fixing. Then compare it to what the same task took you
> before. Most people find the answer is "about the same, but less unpleasant," which is a real
> benefit and is not the benefit anyone is claiming.

## Lesson 3 · The volume trap

There's a second-order effect that the four questions don't catch, and for a People function it
may be the most consequential thing in this module.

**When content gets cheaper to produce, organizations produce more of it.** That's not a
prediction; it's what has happened every time production costs have fallen. And the consequence
is a shift in where the constraint lives: you get faster at generating work and slower at
deciding which work matters, because the deciding didn't get any cheaper and there's now more to
decide about.

The HRBP-specific version is easy to recognize once named. More frameworks. More decks. More
survey cuts nobody asked for. Three versions of the policy instead of one, because generating the
alternatives was free. A manager toolkit that is now forty pages because forty pages cost the
same as twelve.

None of that is decisions. And an HRBP's actual product — Module 2's room and deep desk — is
decisions and the judgment behind them. **A function that gets faster at producing artifacts
while producing no more decisions has gotten worse, efficiently.**

The defence is to make the volume decision consciously: when a workflow gets cheaper, decide
explicitly whether you want more output or the same output with the time back. Both are valid.
Drifting into the first because it's the default is what produces the forty-page toolkit.

## Lesson 4 · Their arithmetic, torn down **[V]**

Now the same skepticism aimed outward. Three questions on any claim: **what's the evidence,
what's the sample, and what would falsify it?**

Watch it work on the cases this market is built on.

**The famous attrition-prediction figure.** IBM's widely-repeated claim of roughly $300 million
saved through AI attrition prediction is a *CEO statement* — never independently audited, never
methodologically published. That doesn't make it false. It makes it unverifiable, which is a
different thing, and a claim you can't check shouldn't be doing load-bearing work in your
business case.

**HireVue and facial analysis.** The company removed facial analysis from its assessments after
its own data indicated the visual component added negligible predictive value. Two lessons at
once: a widely-sold capability turned out not to work, and the company that discovered it was the
one selling it — which is what honest self-correction looks like and how rarely it happens.

**Amazon's recruiting tool.** Scrapped after it taught itself to penalize résumés containing
"women's." The canonical demonstration of 101 M7's argument: the model learned what the records
contained, which is what a learned system does.

And the pattern underneath the cases: **credible proof clusters at the front door and the back
office** — scheduling, coordination, high-volume transactional throughput, where outcomes are
countable and a failure is visible immediately. **The loudest claims live in assessment,
prediction, and people analytics** — where outcomes are slow, confounded, and nearly impossible
to attribute, which is precisely why the claims can be loud.

That asymmetry gives you a heuristic worth carrying into any vendor conversation:

> **Automating the "yes" is comparatively safe. Automating the "no" is where the risk starts.**

Accelerating someone through a process is recoverable and visible. Filtering someone out is
invisible to everyone including you — the person who was excluded never appears in your data,
which means the failure mode is structurally unmeasurable. That is 101 M7's line, arrived at from
the evidence side rather than the ethical one, and the two agreeing is not a coincidence.

### When the arithmetic is about your org chart

The same teardown, pointed at the artifact you are most likely to be handed this year.

A leader arrives with a restructure that has already been decided. There is a rationale document,
and it is **good** — the logic tracks, the spans are justified, the sequencing is sensible, the
risks have a section of their own. You are being asked to help land it, not to assess it, and it is
hard to articulate an objection to a document with no obvious hole in it.

Here is the move, and it is one line:

> **A generated rationale is coherent by construction. Coherence has stopped being evidence that
> anyone thought about it.**

Fluent structural arguments used to be expensive, so their fluency signalled that someone had done
the work. That signal is gone. The document in front of you may rest on two weeks of analysis or on
forty minutes and a prompt, and **it will read identically either way.**

So do not attack the logic — the logic is usually fine. **Attack the inputs.** Every org design
asserts things about the world that are checkable:

- *"These two teams duplicate work."* Do they? Which work, and who says so besides the deck?
- *"This layer adds no decision value."* Name three decisions it made last quarter.
- *"This span is manageable."* Manageable was Lesson 2's word — manageable at what work
  complexity, with what standards, and how novel is what this team does?
- *"We'll absorb the transition in Q3."* Alongside what else that is already scheduled?

**Then ask the one question that separates the two cases:** *what did you look at to conclude that?*
A design built on evidence answers it immediately and specifically. A design built on plausibility
answers it with the reasoning restated more confidently — which is the tell, and it is the same tell
as everywhere else in this module.

**None of this makes you the obstacle.** You are not arguing the restructure is wrong; you are
establishing which of its claims anybody checked, because you are the person who will be asked to
defend those claims to the people affected. **Being handed a decision does not transfer its
evidence, and you will be asked for the evidence.**

## Key takeaways

- **The paradox resolves without anyone lying** `[V]`: people genuinely feel ~11 hours a week of
  relief, ~6.4 hours goes back out as unbudgeted botsitting, and 88% of HR leaders report no
  significant business value — because the remainder dissolves into the day instead of being
  redirected.
- **Four questions, end to end:** total human time *including review and rework*; whether quality
  actually moved; where the work relocated to; and what the freed capacity became. The first
  flips more workflows negative than the rest combined.
- **Only about 7% of organizations tell anyone what the saved time is for** `[V]`. Without an
  answer, time is absorbed rather than recovered.
- **The volume trap:** cheaper production means more production, so the constraint moves from
  making work to deciding which work matters. A function producing more artifacts and no more
  decisions has gotten worse, efficiently.
- **Tear down claims on evidence, sample, and falsifier.** An unaudited CEO figure isn't false —
  it's unverifiable, which disqualifies it from load-bearing use.
- **Proof clusters at the front door and back office; the loudest claims live where outcomes are
  slow and confounded.** Automating the "yes" is comparatively safe; automating the "no" is where
  risk starts — and the people filtered out never appear in your data.
- **A generated rationale is coherent by construction, so coherence has stopped being evidence that
  anyone thought about it.** When you are handed a decided restructure, don't attack the logic —
  attack the inputs, and ask what they looked at to conclude it. Being handed a decision does not
  transfer its evidence, and you will be the one asked for it.

## Take a position

**The claim:** *"A workflow whose time savings you can't trace to a named destination hasn't
saved you time. It has redistributed it into work nobody asked for."*

The strongest counter-argument is not that measurement is hard. It is that **some of the real
value here is unmeasurable and legitimately so** — reduced cognitive load, a lower activation cost
for starting hard things, slack that gets spent on thinking rather than output. Demanding a named
destination for every recovered hour may be a category error that treats knowledge work like a
production line. Your position has to survive that.

## Applied activity — "One workflow, measured"

**Time:** 25–30 minutes · **Submit:** the audit plus a 250–350 word write-up · **Graded against
the rubric below.** Score doesn't matter. Doing the work is where the learning lands.

Pick one AI-assisted workflow you actually run — ideally one you'd defend, since the point is to
find out whether you should.

**Step 1 — The before-number (5 min).** What did this take before AI, in human minutes, per run,
including review? If you never measured, reconstruct it honestly and label it an estimate. An
acknowledged estimate is usable; a confident invention is not.

**Step 2 — The after-number, honestly (10 min).** All four questions. Total human time including
briefing, reading, fixing, and rework. Quality: better, worse, or same, against what mattered.
Where the work moved to. And what the freed capacity actually became.

**Step 3 — Name the destination (5 min).** Specifically. "More strategic work" fails this step;
that phrase is what people say when the honest answer is "I don't know." Name the thing —
a quadrant from Module 2, a piece of work you were skipping, hours given back to a team.

**Step 4 — Score the prediction (3 min).** Your predicted botsitting hours against what this
audit suggests. Direction and size of the miss, and one sentence on what it reveals.

Then the write-up: whether the workflow survives its own audit, your position on the claim above
with the counter-argument addressed, and — if it doesn't survive — what you're going to do about
it. **A workflow you measured and killed is the strongest possible submission for this module.**

## Knowledge check — 8 questions

*Unlocks after the applied activity is submitted. Retakes are free and unlimited.*

**Q1.** Workers report AI saving roughly 11 hours a week while only 13% say their organization performs significantly better `[V]`. What best explains the gap?

- A. Workers are overstating their savings to appear productive
- B. Real relief, minus unbudgeted botsitting, minus a remainder that dissolves into the day rather than being redirected ✓
- C. Organizational performance measures are too crude to detect the improvement
- D. The savings are real but take three to five years to appear in performance data

> **B.** No dishonesty is required. The individual experience of relief is genuine; a measured
> 6.4 hours goes back out as supervision nobody counts; and what's left is absorbed because
> almost nobody names a destination for it. A and C explain the gap by dismissing one side of it.

**Q2.** Which of the four audit questions most often flips a workflow from positive to negative?

- A. Whether final quality improved
- B. Where the work moved to
- C. Total human time including review and rework ✓
- D. What the freed capacity became

> **C.** Because the minutes it counts — briefing, critical reading, fixing, redoing — are
> precisely the minutes every vendor's arithmetic omits. D is the question that determines
> whether value reaches the organization, but C is the one that most often changes the sign.

**Q3.** Your team's AI-assisted debrief process moved the work from you drafting for 40 minutes to a coordinator reviewing for 25. What does question three require you to conclude?

- A. Nothing changed — the same work is being done
- B. The workflow failed, since work should be eliminated rather than moved
- C. The work relocated, which may well be a genuine win — but calling relocation "elimination" is how a function claims capacity it didn't create ✓
- D. The coordinator should be given AI tools too, to complete the elimination

> **C.** Relocation is often good: reviewing is usually cheaper than drafting. The error the
> question guards against is describing a move as a removal, which produces a capacity claim the
> function can't cash.

**Q4.** The volume trap says that when content gets cheaper to produce:

- A. Quality falls because less care goes into each artifact
- B. Organizations produce more of it, moving the constraint from making work to deciding which work matters ✓
- C. Costs rise as consumption of AI services increases
- D. Employees resist the new tools because output expectations rise

> **B.** The constraint relocates. For an HRBP that shows up as more frameworks, more decks, more
> survey cuts, three versions of the policy — none of which are decisions, which is the actual
> product. A function producing more artifacts and no more decisions has gotten worse,
> efficiently.

**Q5.** IBM's widely-cited ~$300M attrition-prediction saving is best characterized as `[V]`:

- A. False — the figure has been debunked
- B. Verified, since it came from the company with access to the data
- C. Unverifiable — a CEO claim, never independently audited or methodologically published, which disqualifies it from load-bearing use ✓
- D. Irrelevant, because attrition prediction is prohibited under 101 M7

> **C.** Unverifiable is not the same as false, and the distinction matters: you don't have to
> allege dishonesty to refuse to build a business case on a number nobody can check. D
> overstates the line — prediction feeding *decisions about individuals* is the problem, not all
> attrition analysis.

**Q6.** Why does credible proof cluster at the front door and back office rather than in assessment and prediction?

- A. Vendors invest more engineering effort in transactional products
- B. Assessment products are newer and haven't accumulated evidence yet
- C. Transactional outcomes are countable and fail visibly, while assessment and prediction outcomes are slow and confounded — which is exactly why claims there can be loud ✓
- D. Regulators prohibit publishing efficacy data for assessment tools

> **C.** The asymmetry is about measurability, not effort or maturity. Where a failure would be
> obvious, claims stay modest; where attribution is nearly impossible, claims are free.

**Q7.** What does "automating the yes is safe; automating the no is where the risk starts" mean in practice?

- A. Approvals are lower-stakes decisions than rejections in every context
- B. Accelerating someone through a process is visible and recoverable, while filtering someone out is invisible — the excluded person never appears in your data, so the failure mode is structurally unmeasurable ✓
- C. Rejection decisions carry more legal exposure than approval decisions
- D. Automated approvals require less accuracy than automated rejections

> **B.** The heuristic is about measurability and recoverability. C is also true and is a
> consequence of B rather than the reason for it — and note this arrives at 101 M7's line from
> the evidence side rather than the ethical one.

**Q8.** The activity asks you to name what the recovered time became, and rejects "more strategic work." Why?

- A. Strategic work isn't a legitimate destination for recovered capacity
- B. The phrase is what people say when the honest answer is "I don't know" — and an unnamed destination means the time was absorbed rather than recovered ✓
- C. Because only 7% of organizations provide guidance, so learners shouldn't attempt it
- D. Because strategic work can't be measured, and the activity requires measurable outcomes

> **B.** The phrase functions as a placeholder for absent knowledge. A specific destination — a
> Module 2 quadrant, a piece of work you were skipping, hours returned to a team — is checkable
> in a way that "more strategic work" never is.

## Sources and attribution

- **Glean, *The Work AI Index 2026*** — the ~11 hours perceived saving, the 13% organizational
  performance figure, and the 6.4-hours-per-week botsitting measurement (n≈6,000 digital workers
  across the US, UK, and Australia, fielded December 2025 – January 2026). **[V]**
- **Gartner** — 88% of HR leaders reporting no significant business value from AI tools; and the
  finding that only 7% of organizations provide guidance on using time saved by AI (July 2025
  survey of 114 HR leaders — a small sample, noted in-lesson because this module is about saying
  so). **[V]**
- Vendor and implementation cases — the IBM attrition figure, HireVue's removal of facial
  analysis, and Amazon's scrapped recruiting tool. Publicly reported; re-verified each review
  cycle. **[V]**
- The four-question audit, the volume trap as applied to People work, and the
  automate-the-yes-not-the-no heuristic are original to this course.
