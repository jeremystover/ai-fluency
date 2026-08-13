# AI 101 · Module 8 — What you own

**Course:** AI 101 · The Foundation · Module 8 of 8
**Estimated time:** 25 min content · 10 min exercise · 25–30 min applied activity (the course close)
**Prerequisite:** none hard — but this module assumes M4 (tiers), M6 (verification), and M7 (the line); it's where they land
**Builds on:** M4 · M6 · M7 — the whole course, gathered
**Feeds:** AI 201 (the practitioner's build), and Monday morning

> `Concepts reviewed: [DATE] · Examples current as of: [DATE]`
> Agreement terms, retention defaults, and disclosure norms are **[V]** volatile layer.
> The accountability principle is stable. It predates AI by several thousand years.

---

## Calibration prompt — before you start

*One prediction, thirty seconds — the last one, and it's about all the others.*

Across this course you've made a prediction at the top of most modules and scored it in the
activity. The final activity asks you to gather them and look at the pattern.

**Before you look back: in which direction do you think you've mostly missed?** Over,
expecting more from these tools than they delivered? Under, expecting less? Mixed? Write
one sentence, including your best guess at *why* your misses lean the way they do.

This one has no numeric field on purpose. The last calibration is a judgment about your own
judgment — which is, not coincidentally, the skill the whole course was building.

---

## Module brief

Here is the situation the previous seven modules leave you in. You can predict what a model
will do well (M1), identify what shape of AI you're looking at (M2), size a use case (M3),
move material safely (M4), brief and steer (M5), catch fabrications (M6), and say where
the machines must stop (M7). One question remains, and it's the one your organization will
actually ask you, usually on a bad day: **when AI touched the work, who owns the result?**

The answer is one word long (*you*) and this module is about making that answer
survivable. Because "you own it" without infrastructure is just exposure: you own output
you didn't verify, under agreements you haven't read, with disclosure norms nobody wrote
down, against questions nobody settled. The module builds the infrastructure: the
accountability principle stated so it can't be misread, the agreement layer that determines
what your tools may do with what you give them **[V]**, the disclosure judgment for when
"AI helped" needs saying out loud, and the five questions to settle with legal and IT
*before* the bad day, plus the one-pager that closes the course by writing your answers
down.

One reframe to carry through the module: ownership is not the tax on using AI. It's the
*license*. The person who can say "I use these tools, here's what I verify, here's my
line, and here's my name on the result" gets to use them without asking permission every
time, and becomes the person others ask. That's the posture 201 builds on, and the reason
this module closes the course instead of opening it: you can only own what you understand,
and now you understand it.

## Learning objectives

By the end of this module you should be able to:

1. State the accountability principle (the output is a draft, never a decision) and apply
   it to the excuses that arrive when AI-assisted work goes wrong.
2. Read your tools' agreement layer **[V]**: what's retained, what's trained on, and the
   difference between consumer defaults and enterprise terms — and know which questions go
   to IT versus counsel.
3. Make the disclosure call with the honest test: would the person reading this feel misled
   to learn how it was made?
4. Bring legal and IT the five questions worth settling now, as a policy skeleton rather
   than an open-ended worry.
5. Write your own one-pager (use, verify, disclose, refuse) and score your calibration
   across the whole course. The applied activity, and the course close.

## Lesson 1 · The output is a draft, never a decision

The principle first, stated so it can't be misread: **AI output is a draft handed to you.
The moment you ship it (send it, file it, say it in a meeting) it stops being AI output
and becomes your work.** Accountability doesn't transfer to a tool, because the tool can't
hold it: it can't be questioned about intent, can't correct the record, can't make the
person harmed whole, can't be sanctioned into doing better. Every mechanism accountability
runs on requires a person. That's not a course rule; it's how your organization, your
profession, and the law already work. This module just refuses to pretend AI changed it.

The principle earns its keep on the bad day, when the excuses arrive. Hold four of them up
to the light. You'll hear all four eventually, possibly in your own voice, and each one
is actually a *confession* wearing a defense:

**"The AI wrote it."** Confesses: I shipped work I didn't stand behind. The provenance of a
draft has never mattered to accountability — nobody accepts "the intern wrote it" or "the
template said that" from the person who signed. This excuse has never once helped anyone,
and its M1-shaped error is treating the tool as an *author* (an entity that could own
words) rather than machinery that produced them.

**"I reviewed it."** Better (review is the right *category*) but as a defense it claims
whatever the review could actually catch, no more. M6 priced this precisely: a Level 1
scan defends against nothing on the high-risk surface; "I reviewed it" for a fabricated
statute means "I read it and it sounded right," which is M6's exact description of how
fabrications ship. The honest version has content: *"I traced its claims against the plan
documents"*: a defense with a verb in it.

**"It was only a draft."** Confesses: I lost track of the boundary between drafting and
shipping. The principle is precisely that draft-ness *ends*: at the send button, at the
meeting, at the moment a colleague could rely on it. Sharing "just a draft" analysis that
someone acts on shipped it, whatever the filename said.

**"The vendor said it was compliant."** M7 already broke this one — accountability doesn't
outsource, and a vendor's assurance is a deferred question, not a defense. Confesses: I
let someone else's claim stand where my organization's verification should be.

Notice what all four have in common: each one tries to relocate agency: to the tool, the
glance, the label, the vendor. The principle's whole content is that agency stayed with
you the entire time. Which is also (turn it around) the *good* news, and the license
this module opened with: work you verified, under terms you know, is work you can put
your name on without flinching.

> ### Try this — 3 minutes
> The excuse audit. For each of the four ("the AI wrote it," "I reviewed it," "it was
> only a draft," "the vendor said it was compliant") write the one-line honest version:
> what would you have needed to *actually do* for the sentence to hold up? You've just
> written the four working standards of this module; keep them.

## Lesson 2 · The agreement layer **[V]**

M4 told you what may enter a tool depends on the agreement covering it. This lesson is
that agreement layer up close, because "what happens to what I paste?" has a knowable
answer, it's in a document, and *you are allowed to ask for it.* Most people never do;
they use tools under terms they've never seen and describe the result as a mystery. Three
questions organize everything worth knowing:

**Is my input used to train or improve the models?** The question that settles it. Consumer
tiers vary and have historically defaulted toward *yes, unless you opt out* **[V]**;
enterprise agreements typically answer *no, contractually*. The difference is the M4
distinction with teeth: material that trains a model may surface, in some transformed
form, outside your control forever. This single question is most of why "the provisioned
tool used well beats the better tool used personally" (M2) is the professional's answer.

**What's retained, and for how long?** Even without training, inputs and outputs persist
somewhere — conversation history, vendor logs, safety review **[V]**. Retention determines
what exists to be breached, subpoenaed, or surprised by. Enterprise terms typically
negotiate retention windows and deletion; consumer tiers typically don't. The M4
connection runs both directions: retention is why redaction mattered, and redaction is
your control when retention isn't.

**Who can see it?** Vendor staff under what circumstances, your own admins under what
controls, and (increasingly relevant) what the vendor's own AI features do with your
content inside their platform **[V]**.

What to do with the three questions is a routing rule. **IT/security answers them**, for
each provisioned tool, in writing; if the answer is "we don't know," you've found real
work, and asking it is a contribution, not a nuisance. **Counsel handles what the answers
imply**: whether those terms satisfy your obligations for Tier 3 material, what your
regulators require **[V]**. **You enforce the boundary that follows:** the tier rules of
M4, now with a documented *why* behind them, which is what makes them teachable to your
team instead of arbitrary. And one habit closes the loop: when the answers arrive, put
them where your team can see them — a one-line-per-tool grid ("Tool X: no training,
90-day retention, enterprise terms. Tier 2 OK, Tier 3 redacted only"). That grid is the
most-requested artifact in every organization's AI rollout, and almost nobody has made
it. Be the one who did.

## Lesson 3 · Disclosure — would they feel misled?

Somewhere between "spell-check" and "the AI wrote my performance reviews," AI assistance
starts needing to be said out loud. The interesting question is where — and the answer
that actually works isn't a percentage of AI involvement. It's a question about the
*reader*: **would this person feel misled if they learned how this was made?** Misled is
the precise word. Not surprised, not impressed — *misled*: they took the artifact as
evidence of something it isn't.

Watch the test sort real cases. A job posting drafted by AI from your role spec, edited
and approved by your recruiter? Nobody feels misled, no reader takes a job posting as
someone's personal prose; the organization stands behind the content, which is exactly
what the artifact claims. A board slide whose numbers came from an AI summary of survey
data? The board takes those numbers as *verified facts*, what needs disclosing isn't
"AI helped" but provenance and verification status: "figures from the Q3 survey analysis,
methodology in appendix." A condolence note, a personal thank-you, a reference you're
asked to give *as you* — here the artifact's entire value is that a person meant it
personally; discovering it was generated voids the thing itself, which is why "AI wrote
my heartfelt note" stories keep ending badly. And the candidate rejection note: the
company's decision in the company's voice, AI drafting fine, provided the *decision*
was made the M7 way, which is the thing the reader actually cares about being real.

The pattern the cases reveal: **disclosure tracks the reader's stake in how it was made,
not the amount of AI involved.** Readers have a stake when the artifact implies a
human's personal witness (the note, the reference), when they'll rely on unverified
specifics as verified (the board numbers), or when the making *is* the message. They
have no stake in the mechanics of routine institutional prose, nobody needs a
provenance label on a meeting-notes summary.

Three practices operationalize it. **Per-artifact, ask the test** — it takes five
seconds and it's usually obvious. **Where disclosure is owed, disclose the useful
thing**, verification status and provenance ("drafted with AI assistance, reviewed and
verified by me") rather than a vague AI-was-here sticker. **And for recurring artifact
types, decide once**, your team shouldn't re-derive the ethics of AI-assisted JDs
weekly; that's a norms question, it belongs in the one-pager, and Lesson 4 files it
there. One boundary case gets a flag because it's yours: *ER documentation and anything
that may become evidence* (where provenance of every sentence can end up examined under
oath **[V]**) routes to counsel's guidance, not to per-artifact judgment.

## Lesson 4 · The five questions to settle now

Everything so far in this module is judgment you can exercise alone. This lesson is the
part you can't do alone — the questions that need legal, IT, and leadership answers, and
that are *cheap to settle now and expensive to settle during an incident.* Five, phrased
to bring to the meeting:

**1. Which tools, which tiers?** The approved-tools grid from Lesson 2: each tool's
agreement answers, and what data tier each may touch (M4). This is the question that
retires "is it OK if I paste…?" forever.

**2. Where's the line, and who owns it?** M7's one-pager, adopted: what AI must not
decide, who signs off on new people-touching tools, in writing.

**3. What are our disclosure norms?** Lesson 3's decide-once list: which artifact types
carry a note, what the note says, and who decides novel cases.

**4. What's our verification standard?** M6's levels, assigned: what must be true before
AI-assisted work ships (by stakes, with the high-risk surface named) so "I reviewed
it" has organizational content instead of personal interpretation.

**5. What happens when something goes wrong?** The one nobody wants to write and
everyone needs: who gets told when AI-assisted work ships with an error, what's the
correction path, and (critically) what's the *no-blame lane* for self-reporting? An
organization that punishes the person who says "my AI-assisted memo had a fabricated
citation, here's the correction" trains everyone to stop saying it. The incident you
hear about early is cheap; the incident that hides is the expensive one.

Bring the five as a skeleton (proposed answers, not open questions; you have all the
material from seven modules) and you'll leave the meeting with a policy. Bring them as
worries and you'll leave with a follow-up meeting. The applied activity has you draft
exactly that skeleton for yourself, which is also the course closing the loop: in M1 you
predicted where AI would help; now you're writing the terms under which you'll let it.

## Key takeaways

- **The output is a draft, never a decision.** Shipping converts AI output into your
  work: send, file, or say it, and it's yours. Every excuse on the bad day ("the AI
  wrote it," "I reviewed it," "only a draft," "the vendor said") is a confession about
  relocated agency; the honest versions all have verbs in them.
- **The agreement layer is knowable — ask three questions [V]:** trained on? retained
  how long? visible to whom? IT answers, counsel interprets, you enforce the tier rules
  that follow, and publish the one-line-per-tool grid nobody else has made.
- **Disclosure tracks the reader's stake, not the AI percentage.** The test: would they
  feel misled about what this artifact is evidence of? Disclose the useful thing:
  verification and provenance, not a vague sticker. Decide once per artifact type.
- **Five questions settle the policy before the incident:** tools and tiers, the line
  and its owner, disclosure norms, verification standards, and the no-blame correction
  path. Bring skeletons, not worries.
- **Ownership is the license, not the tax.** "I use these tools, here's what I verify,
  here's my line, my name's on the result" is the sentence that earns autonomy — and
  the posture 201 builds a practitioner on.

## Applied activity — "The One-Pager"

**Time:** 25–30 minutes · **Submit:** your one-pager plus a 250–350 word calibration
review · **Graded against the rubric below.** Score doesn't matter. This one is the
course landing. Doing the work is where the learning lands.

Two parts: the artifact, and the look back.

**Part 1. Your one-pager (15–20 min).** One page, first person, real: the terms under
which you use AI in your work, written so your manager or team could read it Monday.
Four sections —
- **Use:** the three to five tasks where AI now has a standing place in your week, each
  in one line with its M5-shaped habit ("JDs — drafted from role specs with two
  examples attached, recruiter-reviewed").
- **Verify:** your M6 commitments, by stakes: what gets the scan, what gets claims
  traced, what gets adversarial review, and your personal high-risk surface, named.
- **Disclose:** your Lesson 3 decide-once list: artifact types that carry a note, what
  the note says.
- **Refuse:** your M7 line, in your own words, plus the M4 tiers you won't move without
  the agreement answers — and the one question you're taking to IT or counsel first.

**Part 2. The calibration review (10 min).** Gather your predictions from across the
course (M1's edges, the stack count, the cost guess, the improvement score, the
attempt count, the wrong-side audit) and score the pattern, not the points: which
direction did you mostly miss, does it match what you predicted at the top of *this*
module, and what does the pattern tell you about your starting posture toward these
tools? End with the one-sentence version you'd say out loud: how your model of AI
changed from Module 1 to now, specific enough that it couldn't have been written
before you took the course.

## Knowledge check — 8 questions

*Unlocks after the applied activity is submitted. Retakes are free and unlimited.*

**Q1.** What exactly converts AI output from "a draft" into "your work"?

- A. Editing at least half of it before use
- B. Shipping it — sending, filing, or saying it where someone could rely on it ✓
- C. The tool's terms of service assigning you the copyright
- D. Nothing, AI-generated content remains the tool's output permanently

> **B.** The boundary is the moment of reliance, not the degree of editing, unedited
> output you ship is fully yours, and heavily edited output still in your drafts folder
> is nobody's yet. That's also why "it was only a draft" fails once a colleague acted
> on it: sharing it where someone could rely on it *was* the shipping.

**Q2.** Why does "the AI wrote it" fail as a defense — at the level of principle, not just optics?

- A. Because current law hasn't caught up to AI authorship yet
- B. Because it's usually false: the human edited the text somewhat
- C. Accountability requires an entity that can answer for the work (be questioned, correct the record, make harm whole) and a tool can't hold any of it ✓
- D. It doesn't fail, provenance genuinely mitigates responsibility

> **C.** Every mechanism accountability runs on needs a person, which is why provenance
> of a draft has never mattered: nobody accepts "the intern wrote it" from the person
> who signed. The excuse just relocates agency that never moved.

**Q3.** Under the excuse audit, what's the difference between "I reviewed it" and a defense that holds?

- A. A defense that holds names what the review actually did ("I traced its claims against the plan documents") and covers only what that could catch ✓
- B. There is no difference — review is review
- C. A holding defense requires a second person to also review the work
- D. "I reviewed it" holds as long as the reviewer was senior enough

> **A.** M6 priced review precisely: a defense claims what the verification level could
> actually catch, no more. "I read it and it sounded right" is the exact mechanism by
> which fabrications ship, so the honest version has a verb and a source in it.

**Q4.** Of the three agreement-layer questions **[V]**, which one settles it, and why?

- A. Retention, because deleted data can't be breached
- B. Whether inputs train or improve the models — because trained-on material may surface, transformed, outside your control forever ✓
- C. Visibility, because vendor staff access is the main exposure
- D. None individually, only the full contract matters

> **B.** Training is the irreversible one: retention windows expire and access can be
> controlled, but what entered a model's training doesn't come back out on request.
> It's also most of the reason the provisioned tool beats the personal account — the
> enterprise "no, contractually" versus the consumer default **[V]**.

**Q5.** Your board slide includes figures that came from an AI summary of survey data. What does the disclosure test actually require here?

- A. Nothing, internal slides never require disclosure
- B. A footer stating "this presentation was created with AI assistance"
- C. Provenance and verification status, the board will rely on the numbers as verified facts, so what they're owed is where the figures came from and whether they were checked ✓
- D. Removing the figures, since AI-derived numbers can't be presented to boards

> **C.** The reader's stake is in the numbers' *verifiedness*, not in which software
> touched them — M6 told you numbers get repeated without caveats, which is exactly why
> their status must travel with them. B discloses the useless thing; the sticker
> satisfies no stake the board actually has.

**Q6.** Why do the personal cases (condolence notes, references given as you) sit at the far end of the disclosure spectrum?

- A. They're legally protected categories of communication
- B. The artifact's entire value is a person's personal witness: discovering it was generated voids the thing itself, so no disclosure fixes it ✓
- C. They're too short for AI assistance to matter
- D. They don't, all artifacts follow the same disclosure rule

> **B.** For institutional prose, the reader's stake is in the organization standing
> behind content. Here the making *is* the message — the reader took the artifact as
> evidence of personal attention, so the failure isn't undisclosed AI, it's that the
> artifact claims something untrue about itself. The test catches this without any
> percentage rule.

**Q7.** Why does the fifth question (what happens when something goes wrong) specifically need a no-blame lane for self-reporting?

- A. Because blame-free cultures are more pleasant to work in
- B. To satisfy whistleblower-protection requirements
- C. Because punishing the self-report trains everyone to stop reporting, and the incident that hides is the expensive one ✓
- D. It doesn't, accountability requires consequences for errors

> **C.** The incentive design is the point: you want the fabricated citation surfaced by
> its author on Tuesday, not discovered by opposing counsel in a year. D confuses
> accountability (owning and correcting the work) with punishment (which, applied to
> self-reports, purchases silence at the worst price available).

**Q8.** The module calls ownership "the license, not the tax." What does that mean in practice?

- A. Organizations should license AI tools before taxing their use
- B. Ownership costs are deductible against AI productivity gains
- C. Accepting accountability is the price of being left alone by IT
- D. The person who can say "here's what I use, verify, disclose, and refuse — my name's on it" earns autonomy with the tools and becomes who others trust on them ✓

> **D.** The one-pager isn't defensive paperwork. It's the sentence that lets you use
> everything the course taught without asking permission per use, and it's the posture
> 201 assumes: you can only own what you understand, and now you do.

## Sources and attribution

This module draws on the following material:

- **The AI Fluency Framework** (Rick Dakan & Joseph Feller, in collaboration with
  Anthropic, CC BY-NC-SA 4.0), the accountability stance and the treatment of
  responsible disclosure adapt its "Diligence" competency; the course's four-competency
  inheritance (Delegation, Description, Discernment, Diligence) is its framework
  throughout.
- Provider terms of service, data processing agreements, and enterprise documentation —
  training defaults, retention windows, and visibility rules are moving targets; verify
  against your vendor's current terms and your own agreement. **[V]**
- The excuse audit, the reader's-stake disclosure test, and the five-question policy
  skeleton are original to this course, developed for the People-leader context.
- Evidentiary treatment of AI-assisted workplace documentation is an evolving area,
  the ER-documentation flag exists because provenance can be examined in ways that
  are jurisdiction- and case-specific. *Counsel's guidance governs there, not this
  course.* **[V]**
