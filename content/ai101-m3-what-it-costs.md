# AI 101 · Module 3 — What it costs and how it scales

**Course:** AI 101 · The Foundation · Module 3 of 8
**Estimated time:** 25 min content · 10 min exercise · 20–25 min applied activity
**Prerequisite:** none — M1's vocabulary (tokens, context window) helps and is re-introduced
**Builds on:** M1 (tokens, context window)

> `Concepts reviewed: [DATE] · Examples current as of: [DATE]`
> All prices, model names, tier boundaries, and window sizes are **[V]** volatile layer —
> the *structure* of the economics is stable; the numbers move constantly and are illustrative.

---

## Calibration prompt — before you start

*One claim and one number. Commit both before you read.*

> **"I could say roughly what one of my recurring tasks costs to run — in time, and in money."**

**True of me, or not true of me?** One sentence, about a task you actually own.

**And the number**, which you will score in the applied activity:

At the end of this module you'll take one recurring task from your own function — say,
summarizing your engagement survey's free-text comments twice a year, or drafting every job
description your team posts — and estimate what it would cost per month to run through an AI
tool.

**Pick your task now, and predict its monthly cost in dollars.** Gut number, no arithmetic.
Write it down.

Most people miss by an order of magnitude — and the *direction* of the miss is what's
interesting. Guessing high usually means pricing the hype; guessing low usually means
forgetting the reviewing human. Either way, the miss is the lesson.

## Module brief

You don't need to understand AI economics to use a chat assistant. You need it the moment the
conversation stops being about *you* using a tool and starts being about *scale*: a vendor
quote lands on your desk, someone proposes running every exit interview through a summarizer,
or Finance asks why the AI line item doubled. In those conversations, the person who
understands what the meter is actually counting has a structural advantage over the person
nodding along.

The good news: the entire subject rests on one unit you already met in M1 — the token — and
three pricing structures built on top of it. Learn those and vendor quotes stop being
mysterious documents. You can size a use case on a napkin, spot the pricing model that goes
wrong at your volume, and ask the question that makes a thin product wrapper visibly thin.

The honest framing before we start: **the numbers in this module are illustrative, and the
structure is the lesson.** Per-token prices have moved constantly since these tools launched
— mostly down, sometimes by a lot **[V]** — and any specific figure printed here would be stale
in months. What doesn't move is the shape: everything is metered in tokens, tokens map to
volume of text, and every pricing plan is a bet about your usage that someone — you or the
vendor — is on the wrong side of.

## Learning objectives

By the end of this module you should be able to:

1. Explain what a token is and why every AI cost, limit, and price traces back to counting
   them.
2. Reason about the context window as a budget — why long documents and long conversations
   cost more, degrade, or both.
3. Decide when a more capable model is worth its price, and recognize the People-work tasks
   where the cheaper tier is the right call.
4. Read a vendor quote: identify which of the three pricing structures you're looking at, and
   what usage pattern makes each one go wrong.
5. Produce a defensible order-of-magnitude cost estimate for one real use case — the applied
   activity.

## Lesson 1 · The token economy **[V]**

M1 told you a language model reads and writes in **tokens** — fragments of words, roughly
three-quarters of an English word each. What M1 didn't say is that the token is also the
industry's billing unit. Every price you will ever see, whatever it's dressed as, is
ultimately a price for tokens in and tokens out.

Rough sizes, to build intuition **[V]**: a one-page memo runs several hundred tokens. A
ten-page policy, a few thousand. Two hundred engagement-survey comments, maybe ten to twenty
thousand. Your whole employee handbook, likely into the hundreds of thousands. When you paste
a document into a chat window, you are spending tokens; when the model answers, it spends
more. A "conversation" is a running token bill that both sides are adding to.

Two consequences follow immediately.

**Input and output are priced separately, and output usually costs more per token** **[V]**.
This is why "summarize this long document" (huge input, small output) and "write me a long
report from these notes" (small input, huge output) have very different cost shapes even
though both are one prompt.

**"Unlimited" plans are a bet, not a description.** A flat per-seat subscription doesn't make
tokens free — it means the vendor predicted your usage and priced above it. Push usage far
enough past the prediction and you meet the fine print: rate limits, throttling, "fair use"
caps **[V]**. This isn't vendor malice; it's the token meter reasserting itself. The practical
habit: whenever a price looks flat, ask what happens at ten times your expected volume. The
answer tells you where the meter actually is.

For a casual user none of this matters — the subscription is genuinely simpler and usually
cheaper than metered pricing at low volume. It starts to matter exactly when *you* start to
matter: the moment a task runs on a schedule rather than on a whim, tokens stop being an
abstraction and become a line item. That moment is the subject of the rest of this module.

> ### Try this — 2 minutes
> Take the last substantial thing you pasted into an AI tool — or would paste. Estimate its
> tokens: word count × 1.3, roughly. Now imagine the task running weekly for a year, for
> everyone on your team. You've just done real AI cost analysis — that multiplication is the
> whole method, and Lesson 4's vendors are hoping you never do it.

## Lesson 2 · The context window as a budget **[V]**

M1 introduced the **context window** — everything the model can see at once: your instructions,
the documents you've supplied, and the conversation so far. This lesson makes it economic: the
window is a *budget*, and treating it as unlimited is the most common way careful people get
bad results at scale.

Three budget behaviors are worth internalizing.

**Filling it costs money.** Everything in the window is input tokens, re-sent with every turn
of the conversation. A long chat with a large document attached re-reads that document, in
token terms, every time you follow up **[V]** — which is why a rambling twenty-turn
conversation over your handbook can cost more than twenty clean one-shot questions, and why
the practitioners' habit of starting fresh conversations per task (which you'll build in 201)
is a cost habit as much as a quality habit.

**Filling it degrades attention.** The window is bigger than it used to be — current models
advertise room for hundreds of pages **[V]** — but *fits* is not *attends*. M1's mechanism
explains why: every fragment is predicted from everything in view, and the more you put in
view, the more everything competes. Material buried in the middle of a very long context is
where details quietly stop influencing the output. The symptom to watch for: confident,
fluent summaries of a long document that are strangely thin on its middle sections. (M4 gives
this failure a full lesson; here it's enough to know the budget has a quality dimension, not
just a cost one.)

**Overflowing it silently truncates.** When a conversation outgrows the window, the oldest
material drops out of view — the model doesn't announce this, and its fluency doesn't dip.
Your instructions from the start of a long session may simply no longer exist as far as the
model is concerned. If a long conversation seems to have "forgotten" its brief, it likely
has — literally.

The budget mindset, in one line: **decide what the model needs to see for *this* question, and
supply that** — not everything you have. It's cheaper, and it's better. The instinct to paste
more context is usually right in direction (M1: the model knows nothing about your org) and
wrong in indiscriminateness; M5 will turn that instinct into technique.

## Lesson 3 · When the bigger model is worth it **[V]**

Every provider sells a range: a frontier model — the most capable, priced accordingly — and
one or more cheaper, faster tiers that are a fraction of the cost per token **[V]**. The gap
matters at scale: at meaningful volume, tier choice can move a project's cost by multiples.
So the question "which tier?" is a real budgeting decision, and it has a calmer answer than
the marketing suggests.

**Where the cheap tier wins** — which, for People work, is most of the time: transformation
tasks with clear instructions and supplied material. Reformatting notes into a debrief.
Extracting themes from comments *you provide*. Drafting routine communications from a solid
brief. First-pass summaries a human will review anyway. These sit at the delegation
heuristic's center — you supplied everything, the shape of the output is known — and the
cheaper tier does them roughly as well as the frontier model, several times cheaper and
faster.

**Where the frontier model earns its price:** long or subtle judgment over lots of material at
once — the tasks where quality failures are expensive and hard to spot. Nuanced synthesis
across many documents, careful reasoning about an ambiguous situation, drafting where tone
misfires carry real cost. And note the pattern in that list: as tasks climb toward requiring
organizational judgment, they climb toward the heuristic's *boundary* — the tasks where the
question stops being "which tier" and becomes "should the model be doing this without heavy
human involvement at all." **If a task seems to need the smartest possible model, treat that
as a flag to increase your review, not just your spend.**

Two practical corollaries. First, *start cheap and escalate on evidence*: run the task on the
cheaper tier, look at the output, and pay up only where you can articulate what was missing —
that articulation is itself the review skill M6 builds. Second, *latency is a price too*:
frontier models are slower, and for interactive drafting work, a fast good-enough model often
beats a slow brilliant one because you iterate more. M5 will show that iteration count drives
quality more than model choice does.

> ### Try this — 3 minutes
> Take three AI-suitable tasks from your own week (steal them from M1's sorting exercise if
> you did it). For each, one-line verdict: cheap tier, frontier, or "the tier question is the
> wrong question — this one needs a human." If everything landed in the frontier column,
> re-read the flag above: you may be describing tasks that need review, not horsepower.

## Lesson 4 · Reading a vendor quote **[V]**

Every AI price you'll ever be quoted is one of three structures — or a bundle hiding one
inside another. Each is a bet about usage, each goes wrong at a predictable place, and your
job in a procurement conversation is to find where.

**Per-seat subscription.** Flat monthly price per user **[V]**. The vendor's bet: average
usage stays modest. Goes wrong at the edges: heavy automated usage hits the fine-print caps
(Lesson 1), while a sea of licensed-but-inactive seats means you're paying retail for shelf
space. The question to ask: *what does the fine print say at 10× typical usage — and what
share of our seats were active last month?* For the second half, demand the usage report;
every vendor has one.

**Metered (per-use) pricing.** Pay per token, per document, per "credit" **[V]**. The bet
runs the other way: the vendor wins when you use more. Predictable at steady volume, goes
wrong at spikes — the surge you didn't forecast (survey season, annual review cycle, a
reorg's worth of documents) arrives as an invoice. The questions: *what exactly is metered —
tokens, documents, or something the vendor invented* (a "credit" is a markup wearing a
costume) — *and what does our peak month look like, priced out?*

**Enterprise agreement.** Negotiated flat rate for an organization **[V]**, typically bundling
capability with the things M8 cares about — data terms, admin controls, retention promises.
Goes wrong through mismatch: paying for an org-wide capability that fifty people use, or —
the reverse and more common failure — buying the cheap thing and discovering the data terms
you actually needed were in the tier you skipped. The question: *which parts of this price
are capability and which are the data agreement?* — because (M8 will argue) the second part
is the part you can't do without.

And one structural question that cuts across all three, for any product that isn't from a
model provider directly: **"which model does this run on, and what happens to our price when
your model costs change?"** Most AI products are a workflow layer over someone else's model —
often a genuinely valuable layer, sometimes a thin one. A vendor with a real product answers
cleanly. A vendor selling tokens at retail with a logo on top gets vague — and per-token
prices' historical direction of travel **[V]** means their margin is a melting asset you'd be
locking in at today's rate. Thin isn't automatically bad; *unpriceable* is. If they can't
answer, you can't size the deal, and that — not any single number — is what "being the person
who understands the meter" buys you in the room.

## Key takeaways

- **The token is the billing unit of everything.** Word count × 1.3, in and out, forever.
  Every plan — subscription, metered, enterprise — is a structure built on that meter, and
  every flat price is a bet someone placed on your volume.
- **The context window is a budget with a quality dimension.** Filling it costs tokens on
  every turn; overfilling it degrades attention in the lossy middle; overflowing it silently
  drops your earliest instructions. Supply what the question needs, not everything you have.
- **The cheap tier is the right call for most People work** — supplied material, clear
  instructions, human review. Pay for the frontier model on evidence, not vibes — and treat
  "this needs the smartest model" as a flag for more review, not just more spend.
- **Every pricing structure has a predictable failure point:** per-seat fails at heavy use and
  idle seats; metered fails at spikes; enterprise fails at mismatch. Price your peak month
  and your idle seats before signing anything.
- **Ask any non-provider vendor which model they run on** and what happens to your price when
  their costs change. Clean answer: real product. Vague answer: you're buying tokens at
  retail, at a locked-in markup on a falling price.
- **Numbers here are illustrative; the structure is the lesson.** Prices move monthly. The
  napkin math — volume × tokens × rate, plus the human review time — is what transfers.

## Applied activity — "Size One Use Case"

**Time:** 20–25 minutes · **Submit:** your estimate table plus a 250–350 word write-up ·
**Graded against the rubric below.** Score doesn't matter. Doing the work is where the
learning lands.

At the top of this module you picked one recurring task and predicted its monthly cost. Now
do the arithmetic and score yourself.

**Step 1 — Define the unit (5 min).** What is one "run" of this task? (One survey cycle
summarized, one JD drafted, one week's exit interviews processed.) Describe the input and
output of a single run concretely.

**Step 2 — Count the tokens (5 min).** Estimate the input size (word count × 1.3, include
*everything* the model must see — instructions, documents, examples) and the output size.
Multiply by runs per month. Show the arithmetic; round numbers are fine, reasoning is the
point.

**Step 3 — Price it two ways (5 min).** (a) As metered usage, using a current published
per-token price for a mid-tier model — note which one and the date **[V]**. (b) As a slice of
a per-seat subscription: whose seat, and what share of that seat's monthly price does this
task plausibly represent? One sentence on which structure fits this task better and why.

**Step 4 — Add the human (3 min).** Estimate the review time per run, in minutes, and note
who does it. This number is usually the real cost. If your task's review time rivals doing
the task by hand, say so — that's a finding, not a failure.

**Step 5 — Score the prediction (2 min).** Predicted vs. computed: direction of miss, size
of miss, one-sentence theory of why.

Then the write-up: your table, the comparison, and one decision this estimate would actually
change — a tool you'd adopt or skip, a quote you'd push back on, a task you'd leave manual.

## Knowledge check — 8 questions

*Unlocks after the applied activity is submitted. Retakes are free and unlimited.*

**Q1.** Why does a long back-and-forth conversation over an attached document cost substantially more than the same questions asked as clean, separate one-shot prompts?

- A. Conversations are billed at a premium rate compared to single prompts
- B. The full context — document included — is re-sent as input tokens on every turn ✓
- C. The model writes longer answers in conversations than in one-shot prompts
- D. It doesn't — conversation turns after the first are free on most plans

> **B.** The window is re-supplied each turn, so the document's tokens are effectively
> re-read every time you follow up. That's the economic half of the fresh-conversation habit;
> the quality half is attention. A and D describe billing structures that don't exist, and C
> isn't the mechanism.

**Q2.** A vendor's plan is "unlimited AI drafting, $30 per seat per month." What is this price, structurally?

- A. Evidence that the vendor has found a way to make tokens genuinely free at scale
- B. A loss-leader that must disappear once the vendor's investors demand profitability
- C. A bet that average usage stays modest — with fine print (rate limits, fair-use caps) standing where the token meter reasserts itself ✓
- D. Proof the product doesn't use a large language model, since LLM costs are always metered

> **C.** Flat prices don't remove the meter; they hide it behind a usage prediction. The
> practical habit: ask what happens at ten times your expected volume — the answer locates
> the real limit. B might even prove true for a given vendor, but it's a guess about one
> company, not the structure of the price.

**Q3.** Your team runs a 40-page report through an assistant and gets a fluent summary that's strangely thin on the report's middle sections. What most likely happened?

- A. The middle sections exceeded the model's knowledge cutoff
- B. The document filled a large share of the context window, and material in the middle of a long context received the least attention ✓
- C. The model's safety filters removed the middle content
- D. The subscription's fair-use cap truncated the output

> **B.** Fits is not attends: everything in the window competes for influence, and the middle
> of a long context is where details stop mattering first — while fluency stays perfect,
> which is what makes it dangerous. A confuses the cutoff (training time) with the window
> (right now); C and D aren't this mechanism.

**Q4.** For which task is the cheaper model tier most clearly the right choice?

- A. Reformatting your own interview notes into the team's standard debrief template ✓
- B. Synthesizing an ambiguous ER situation across a year of scattered documentation
- C. Drafting a sensitive org-change announcement where tone missteps carry real cost
- D. Any task involving employee data, since cheaper models are safer with sensitive inputs

> **A.** Supplied material, clear instructions, known output shape, human review — the
> delegation heuristic's center, where tier differences barely show. B and C are the
> judgment-heavy profile where the frontier model earns its price — and where the real flag
> is more review, not just more spend. D confuses the tier question with the data question;
> model size has nothing to do with data terms.

**Q5.** A team that runs heavy, predictable daily volume is choosing between per-seat and metered pricing. What's the structural trade?

- A. Metered pricing is always cheaper at high volume
- B. Per-seat absorbs their heavy steady usage until fine-print caps bite; metered prices it accurately but punishes unforecast spikes ✓
- C. There is no real difference — both bill the same tokens underneath
- D. Per-seat is only available in enterprise agreements

> **B.** Each structure fails at its own edge: flat plans at sustained heavy use (that's what
> the fine print is for), metered at the surge you didn't forecast — survey season arriving
> as an invoice. C is true of the underlying meter but false about who carries the risk,
> which is the entire question.

**Q6.** During procurement, which single question most directly exposes whether an "AI-powered" product is a thin wrapper around someone else's model?

- A. "Is your product SOC 2 compliant?"
- B. "How many engineers are on your AI team?"
- C. "Which model does this run on, and what happens to our price when your model costs change?" ✓
- D. "Does your product use the latest generation of models?"

> **C.** A vendor with a real workflow layer answers cleanly; a reseller of tokens at retail
> gets vague, because their margin is the gap between your locked-in price and a falling
> cost they don't control. A matters for M8's reasons but doesn't locate thinness; B and D
> invite theater.

**Q7.** Why should "this task seems to need the most capable model available" prompt a second look rather than just a bigger budget?

- A. Frontier models are usually too slow to be usable for any real work
- B. Tasks that seem to need maximum capability are usually climbing toward judgment calls — where the right response is more human review, not just more model ✓
- C. Capability differences between tiers are pure marketing with no real effect
- D. Cheaper models produce more reliable outputs than frontier models

> **B.** The pattern from the lesson: as tasks climb toward organizational judgment, they
> approach the delegation heuristic's boundary, where "which tier" becomes "how much human."
> A overstates a real latency trade; C and D are both false.

**Q8.** In the Size One Use Case activity, why does the estimate require a line for human review time?

- A. Because review time is usually the dominant real cost, and a task whose review rivals doing it by hand may not be worth automating ✓
- B. Because regulators require documented human oversight of all AI usage
- C. To calculate how many tokens the reviewer will consume re-reading the output
- D. To determine which employees need training on the tool

> **A.** Token costs are usually the small number; the reviewing human is the big one. An
> estimate without that line flatters every use case and hides the honest finding —
> sometimes the verdict is "leave it manual," and the activity treats that as a result, not
> a failure. B overstates current requirements (M7 covers what actually applies); C and D
> aren't what the line is for.

## Sources and attribution

This module draws on the following material:

- **The AI Fluency Framework** (Rick Dakan & Joseph Feller, in collaboration with Anthropic,
  CC BY-NC-SA 4.0) — the treatment of tokens and context as practical constraints adapts its
  framing of how model mechanics surface in everyday use.
- Provider pricing and documentation pages — current per-token prices, tier names, context
  window sizes, and plan terms move constantly; verify against the provider's published
  pricing at time of use. **[V]**
- The three-pricing-structures taxonomy, the failure-point analysis, and the napkin method
  are original to this course, developed for the People-leader procurement context.
