# AI 301 · EX & Internal Comms · Module 5 — The review discipline

**Course:** AI 301 · The Specialist — Employee Experience / Internal Comms track · Module 5 of 10
**Estimated time:** 30 min content · 10 min exercise · 25 min applied activity
**Prerequisite:** Module 2 (this module works the Verify link) · builds on 101 M6, which it does not repeat
**Position in the track:** the start of Part Two — the craft that replaces drafting

> `Concepts reviewed: [DATE] · Examples current as of: [DATE]`
> Almost nothing here is volatile. These failure modes are properties of how the models work, not
> of any particular product.

---

## Calibration prompt — before you start

*One claim. Commit before you read anything.*

Here is a factual assertion about your own organization:

> **"Every piece of AI-assisted content we publish has a named human who read it against its source
> before it went out — not just read it."**

**True of us, or not true of us?** Commit to one, in a sentence. Note the two words doing the work:
*against its source.* Someone reading the draft carefully, and liking it, is not what this claims.

Then predict one number: **of the four failure modes this module teaches, how many will you find at
least one uncorrected instance of** when you audit three recent AI-assisted pieces in the activity?
A number from 0 to 4.

---

## Module brief

Module 2 said Verify is newly expensive. This is why.

When a human wrote the draft, verification happened for free and nobody called it verification. The
person writing the benefits summary had read the plan documents — that was why they were writing it.
Their knowledge was a check running silently in the background, catching the claim that didn't
match, the caveat that mattered, the number that had changed. Nobody scheduled that check. Nobody
budgeted it. Most people never knew it was there.

A model has not read the plan documents. It has read a great deal *like* the plan documents, which
is a different thing and is exactly the thing that makes its output feel trustworthy. **Remove the
writer and you remove the check, and because the check was never a formal step, its removal is
invisible.** The output looks better than what you had before. That is the whole problem.

This module reinstates the check deliberately: what to look for that AI 101 didn't teach you, how to
read in a way that finds it, and where to draw lines that survive a busy week.

**What this module does not do** is re-teach hallucination. AI 101 Module 6 gave you the mechanism —
fluency is generated the same way whether the content is right or invented, so it carries no signal
about accuracy — plus the failure taxonomy and verification sized to stakes. All of that stands and
none of it is repeated. This module adds what published institutional prose needs on top.

## Learning objectives

By the end of this module you should be able to:

1. Name two failure modes that 101's taxonomy doesn't contain, and explain why they matter
   specifically for institutional writing.
2. Read a draft against its source rather than against your ear, and say why your ear is the wrong
   instrument.
3. Explain why omission is more dangerous than fabrication in this function, and how to catch it.
4. Write stop-rules as categories rather than instances, so they survive contact with a busy week.

## Lesson 1 · Two failure modes 101 doesn't have

AI 101 Module 6 taught four failure types: fabricated specifics, plausible-but-wrong reasoning,
confident gaps where organizational knowledge should be, and stale facts past the cutoff. Those are
properties of the model and they apply to everyone.

For published institutional prose, two more matter, and neither is on that list because neither is
an *error* in the ordinary sense. Both are cases where the output is accurate and still wrong.

**Voice flattening.** The model produces the median of everything it has read, and the median of
corporate communication is a specific and recognizable register: balanced, warm, slightly
enthusiastic, structurally identical every time. Three colons. A tricolon. An opening that
acknowledges the difficulty and a close that expresses confidence.

The flattening is not a quality problem — the prose is competent. It is an **identity** problem.
Your organization's voice is one of the few things that tells an employee this message came from
here rather than from anywhere. When every message reads like every other organization's message,
the channel loses the thing that made it recognizable, and you lose it gradually enough that no
individual message is worth objecting to. It compounds and it is invisible per instance, which is
the worst combination a defect can have.

The tell: read the piece and ask **could this have been sent by any employer?** If yes, and the
subject is specific to yours, something was flattened out of it.

**Lost nuance.** Summarization is compression, and compression discards. The model discards what it
judges least central — and it makes that judgment on textual salience, not on consequence. A
qualifier appearing once in a long document is a low-salience token. It may also be the only reason
the statement is true.

The canonical case: a policy with an exception. "Employees may carry over up to five days" is what
survives compression. "Employees may carry over up to five days, except in the first year of
employment, where carryover is not available" is the actual policy. The summary is not false about
what it says. It is false about what it leaves out, and the people it will harm are precisely the
new joiners least equipped to know they were misled.

These two matter here more than anywhere else in this curriculum because your output is
**published, at scale, to people who cannot ask a follow-up question.** A colleague who receives a
flattened, slightly-lossy summary asks. A workforce of nine thousand acts on it.

## Lesson 2 · Read against the source, not against your ear

Now the reading method, and it starts with a hard admission.

**Your ear is the wrong instrument, and it is wrong in proportion to how good you are at this job.**

You spent a career developing an instinct for whether a piece of writing is any good. That instinct
reads for rhythm, structure, clarity, register, flow. It is fast, it is reliable, and it has been
trained on the assumption that fluent prose was produced by someone who knew what they were talking
about — because until very recently that assumption held. Fluency was a costly signal. It correlated
with competence because producing it required competence.

That correlation is now broken, and **fluency is the one thing the model always gets right.** So
the instrument you've spent twenty years sharpening is now precisely tuned to the single dimension
that carries no information about whether the content is true.

Worse: a flattened, lossy, confidently-wrong draft feels *better* to that instrument than the
messy, hedged, technically-correct thing a subject-matter expert would have written. Your expertise
is actively pulling you toward the failure.

The replacement is mechanical, and it is deliberately boring:

**Read the source first, then the draft, then the source again.** Not the draft first. If you read
the draft first it becomes the frame, and the source-read turns into confirmation — you'll find the
things the draft mentions and be structurally unable to notice what it doesn't.

**Read for what's missing, not for what's wrong.** Wrong things announce themselves. Missing things
don't, and that asymmetry is Lesson 3.

**Have the source open.** Not remembered — open. If there is no source document, that is itself the
finding: a draft with no source is a draft nobody can verify, and it should not be reviewed. It
should be sent back.

**Check every number, every date, every proper noun, and every conditional.** Conditionals are the
ones people skip: *may*, *must*, *up to*, *except*, *unless*, *after*. Each one is a place where
compression changes the meaning while preserving the sentence.

> ### Try this — 3 minutes
> Take any AI-assisted piece you published in the last month and open its source next to it. Don't
> re-read the piece. Instead, list three things in the source that a reader would need and check
> whether each survived. Most people find two of three. The third is the interesting one.

## Lesson 3 · Omission is worse than fabrication

This is the rule that changes how people review, and it inverts most people's instinct.

**A fabrication leaves evidence. An omission leaves nothing.**

If the model invents a statistic, a policy number, a date, or a citation, the invented thing is
sitting there in the text. It can be checked. Somebody who knows the subject will trip over it. Your
verification process — the one 101 M6 taught — is designed to catch exactly this, and it works.

If the model drops the exception clause, there is no artifact. Nothing in the draft is false.
Nothing looks odd. There is no string to search for, because the failure is the absence of a string.
The only way to catch it is to have the source open and be reading for absence — which is not what
reviewing feels like and is not what anybody does under time pressure.

And the consequences differ in the same direction. A fabricated number in an internal announcement
is embarrassing, gets corrected, and costs the function some credibility. **A dropped
eligibility condition is an employee who acted on your message and was wrong** — a missed enrollment
window, an unclaimed benefit, an entitlement they didn't know they had. That is a real cost to a
real person, traceable to your channel, and they will not learn it was your omission. They will
learn that what you publish cannot be relied on.

There is a second-order version worth naming because it is subtler. Models under-represent **things
that were contested in the source.** A document recording a genuine disagreement, a decision made
with reservations, a policy with a known unresolved edge — these compress toward the settled
version, because settled statements are more textually salient than qualified ones. Which means the
summary of a difficult decision reliably reads as more confident than the decision was. In change
communication, where the gap between what leadership actually agreed and what the workforce is told
is already the central risk, **that is the failure mode most likely to end up in a lawyer's
timeline.**

The practical response is a single question, asked of every summarized source:

> **What was in the source that is not in the draft, and who does that hurt?**

Not "is anything wrong." That question is answerable by reading the draft. This one is only
answerable by reading both.

## Lesson 4 · Stop-rules as categories, not instances

Reviewing well is a skill. Reviewing well *in a bad week* is a system, and the system is a short
list of categories that never go out without a named human check.

Most teams that try this write instance rules — "the benefits email gets checked," "the CEO's
all-hands note gets checked." Instance rules fail predictably, because next month brings a message
that isn't on the list and the list has no way to answer a case it didn't anticipate. Categories
answer new cases. That is the entire reason to write them that way.

Four categories that earn a stop in almost every organization. Yours may differ; the shape shouldn't.

**Anything an employee could act on to their own detriment.** Deadlines, eligibility, enrollment,
entitlements, safety instructions, anything with a date and a consequence. This is the Lesson 3
category, and it is the one that protects real people rather than the function's reputation.

**Anything summarizing a source with legal or contractual force.** Policy, handbook, plan documents,
terms of employment, regulatory notices. The check is against the source, by someone who can read
the source — which sometimes means the check isn't yours, and knowing that is part of the rule.

**Anything in a named person's voice.** Module 6 is entirely about this one, and it stops here
regardless of what that module concludes.

**Anything about a change that affects someone's job.** Reorgs, role changes, site closures, RTO,
anything where the workforce will read it forensically. The failure mode is the contested-source
compression from Lesson 3: the draft will read more settled than the decision was.

Three properties make a stop-rule hold, and they're the same three that made 101 M7's lines hold:

**Named, not roled.** "Comms reviews it" is not a rule. A person's name is a rule.

**Attached to a source.** The rule should say what the check is *against*, not just that a check
happens. "Reviewed" is what people write when they read it and liked it.

**With a stated fallback.** What happens when the named person is on leave and the message must go
today. A rule with no fallback is a rule that gets ignored the first time it's inconvenient, and
after it's been ignored once it isn't a rule any more.

## Key takeaways

- **Verification used to be free and invisible.** The human writer had read the source — that's why
  they were writing. Remove the writer and you remove a check nobody knew was there.
- **Two failure modes 101's taxonomy doesn't have**, because neither is an error: **voice
  flattening** (accurate prose in the median corporate register — an identity problem that compounds
  invisibly; the tell is *could any employer have sent this?*) and **lost nuance** (compression
  discards by textual salience, not by consequence, so the qualifier that made the statement true is
  exactly what gets dropped).
- **Your ear is the wrong instrument, and it's wrong in proportion to your skill.** Fluency used to
  be a costly signal correlated with competence. It isn't now, and it is the one thing the model
  always gets right — so your trained instinct points at the dimension carrying no information.
- **The method is boring on purpose:** source first, then draft, then source again; read for what's
  missing rather than what's wrong; have the source open, not remembered; check every number, date,
  proper noun and conditional. A draft with no source shouldn't be reviewed — it should be sent back.
- **Omission is worse than fabrication.** A fabrication leaves evidence and your existing
  verification catches it. An omission leaves no artifact and no string to search for. And the
  consequences differ: a fabricated number embarrasses the function; a dropped eligibility condition
  costs an employee something real.
- **Contested sources compress toward the settled version**, so a summary of a difficult decision
  reads more confident than the decision was — the failure most likely to end up in a lawyer's
  timeline.
- **Stop-rules are categories, not instances.** Instance rules can't answer a case they didn't
  anticipate. Named not roled, attached to a source, with a stated fallback.

## Take a position

**The claim:** *"Your stop-rule list is too short."*

The strongest counter-argument is that **a long stop-rule list is a slow function, and slowness has
victims too.** Every category you add is a queue, and queues in communication have real costs: the
safety notice that waits for review, the rumour that fills the gap while the accurate message sits
in someone's inbox, the manager who stops asking comms for help because comms takes four days. The
function that reviews everything carefully and arrives late has not managed risk — it has moved it
somewhere less visible, which is precisely the failure this track spends Module 3 attacking in a
different form.

There is a sharper version. **The list will be exactly as long as your capacity, and pretending
otherwise produces a document that gets ignored** — at which point you have a written standard your
organization visibly doesn't follow, which is worse than having none, because it tells everyone the
function's own rules are decoration.

Take a position on that, in writing, in the activity. The strongest submissions state what they
would *stop stopping* to afford the list they've written — because a stop-rule list with no
capacity behind it is Module 3's kill list problem wearing different clothes.

## Applied activity — "Draft review protocol"

**Time:** 25 minutes · **Submit:** the audit, the protocol, and the stop-rule list, plus a 250–350
word write-up · **Graded against the rubric below.** Score doesn't matter. Doing the work is where
the learning lands.

**Step 1 — Audit three real pieces (12 min).** Three AI-assisted things your function published in
the last two months, each with its source open beside it. For each, check for all four failure
modes: fabricated specifics, voice flattening, lost nuance, and confident tone on shaky ground. Ask
the Lesson 3 question of each: *what was in the source that isn't in the draft, and who does that
hurt?*

Record what you find, including nothing. **If a piece is clean, say so** — three clean pieces is a
legitimate result and it tells you something about your existing process worth writing down.

If any of the three had **no retrievable source**, record that. It is the most significant thing
this audit can surface, and it scores at full credit.

**Step 2 — Write the protocol (6 min).** The reading method as your team would actually run it. Not
the principles — the sequence. What gets opened, in what order, what gets checked, and what the
reviewer does when a source doesn't exist.

**Step 3 — The stop-rule list (5 min).** Your categories. For each: the category, the named person,
what the check is against, and the fallback when that person isn't available. Categories, not
instances.

**Step 4 — Score the prediction (2 min).** How many of the four failure modes you found, against how
many you predicted. Direction and size of the miss, and one sentence on what it reveals.

Then the write-up: what the audit found, your position on the claim above with the counter-argument
addressed — including what you would stop stopping to afford your list — and **the one category you
know you should stop but won't, and why.** Naming it honestly is the strongest form of this
submission; a list nobody will follow is worth less than a shorter one that holds.

## Knowledge check — 8 questions

*Unlocks after the applied activity is submitted. Retakes are free and unlimited.*

**Q1.** Why is Verify described as newly expensive rather than newly necessary?

- A. Because verification tools now require licensing
- B. Because the check used to run for free inside the writer — they had read the source, that's why they were writing — and removing the writer removed a check nobody knew was there ✓
- C. Because AI output contains more errors than human drafts
- D. Because regulators now require documented verification

> **B.** It was never a formal step, which is why its removal is invisible. And the output looks better than what you had before, which is the whole problem.

**Q2.** What makes voice flattening different from the failure types AI 101 taught?

- A. It only occurs in long documents
- B. It is caused by the prompt rather than the model
- C. It isn't an error at all — the prose is accurate and competent. It's an identity problem: the channel stops sounding like your organization, gradually enough that no single message is worth objecting to ✓
- D. It can be detected automatically

> **C.** The tell is a question: could this have been sent by any employer? It compounds and is invisible per instance, which is the worst combination a defect can have.

**Q3.** Why does compression drop the qualifier that made a statement true?

- A. Because qualifiers are usually placed at the end of documents
- B. Because the model discards by textual salience rather than by consequence, and a condition appearing once in a long document is low-salience ✓
- C. Because the model is optimizing for reading level
- D. Because qualifiers are ambiguous and the model avoids ambiguity

> **B.** "Employees may carry over up to five days" survives; "except in the first year of employment" doesn't. The summary isn't false about what it says — it's false about what it omits, and it harms the new joiners least equipped to know.

**Q4.** Why is a skilled communicator's ear the wrong instrument for reviewing AI output?

- A. Because it is slower than a structured checklist
- B. Because it was trained on external communications rather than internal
- C. Because it reads for fluency, which used to be a costly signal correlated with competence and no longer is — and fluency is the one thing the model always gets right ✓
- D. Because it cannot detect factual errors

> **C.** And it's worse than neutral: a flattened, lossy, confident draft feels *better* to that instrument than the messy, hedged, correct thing an expert would have written. The expertise pulls toward the failure.

**Q5.** Why must you read the source before the draft rather than after?

- A. Because it is faster to work in that order
- B. Because reading the draft first makes it the frame, so the source-read becomes confirmation and you're structurally unable to notice what the draft doesn't mention ✓
- C. Because sources contain information the draft cannot include
- D. Because the draft may bias your assessment of the source's reliability

> **B.** You'll find the things the draft mentions. Omissions are only visible when the source is the frame.

**Q6.** Why is omission more dangerous than fabrication in this function?

- A. Omissions occur more frequently than fabrications
- B. A fabrication leaves evidence in the text and existing verification catches it; an omission leaves no artifact and no string to search for — and a dropped eligibility condition costs a real employee something real ✓
- C. Fabrications are usually caught by legal review
- D. Omissions cannot be corrected after publication

> **B.** The consequences differ in the same direction as the detectability. A fabricated number embarrasses the function and gets corrected. A missed enrollment window costs an employee money, and they never learn it was your omission — only that your channel can't be relied on.

**Q7.** What happens to a source that recorded genuine disagreement when a model summarizes it?

- A. The model flags the disagreement explicitly
- B. The summary omits the topic entirely
- C. It compresses toward the settled version, because settled statements are more textually salient than qualified ones — so the summary reads more confident than the decision was ✓
- D. The model reproduces both positions at equal length

> **C.** In change communication, the gap between what leadership actually agreed and what the workforce is told is already the central risk. This is the failure mode most likely to end up in a lawyer's timeline.

**Q8.** Why must stop-rules be written as categories rather than instances?

- A. Because categories are shorter to write and easier to remember
- B. Because instance rules cannot answer a case they didn't anticipate, and next month always brings one ✓
- C. Because named instances create single points of failure
- D. Because categories are easier to audit for compliance

> **B.** "The benefits email gets checked" has nothing to say about the message that isn't on the list. Categories answer new cases, which is the entire reason to write them that way — alongside being named rather than roled, attached to a source, and carrying a stated fallback.

## Sources and attribution

- No external statistics are load-bearing in this module, and none should be. The failure modes
  described are properties of how language models compress and generate, observable directly in any
  organization's own output — which is what the activity has the learner do rather than take on
  faith.
- **AI 101 Module 6** supplies the mechanism (fluency carries no signal about accuracy) and the
  four-type failure taxonomy this module extends. It is referenced and deliberately not repeated.
- Voice flattening and lost nuance as named failure modes for institutional prose, the
  source-first reading sequence, the omission-over-fabrication rule, the contested-source
  compression finding, and the category-not-instance stop-rule test are original to this course.
- Structure and topic coverage follow the AI Fluency Framework (Dakan & Feller, in collaboration
  with Anthropic, CC BY-NC-SA 4.0); prose is original.
