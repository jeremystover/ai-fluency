# AI 101 · Module 2 — Choosing the tool for the task

**Course:** AI 101 · The Foundation · Module 2 of 8
**Estimated time:** 25 min content · 10 min exercise · 20–25 min applied activity
**Prerequisite:** none — pairs naturally with M1
**Builds on:** M1 (what an LLM actually is; the delegation heuristic)

> `Concepts reviewed: [DATE] · Examples current as of: [DATE]`
> Tool names, product features, and regulatory specifics are **[V]** volatile layer —
> refreshed independently of the concepts, tailored to your organization's provisioned tools.

---

## Calibration prompt — before you start

*One claim and one number. Commit both before you read.*

> **"I could list every system my People function runs that has AI inside it."**

**True of me, or not true of me?** One sentence. Most people can list the systems and are surprised
by which ones turned out to have AI switched on inside them.

**And the number**, which you will score in the applied activity:

By the end of this module you'll audit the systems your People function actually runs — the ATS,
the HRIS, the survey platform, the docs suite, the chat tools — and find the AI already inside
them.

**How many distinct systems in your stack have AI in them right now?** Count anything you or
your team touches in a normal month. Write the number down before you look.

Almost everyone guesses low. The gap between your number and the real one is the point: it
measures how much AI is already making or shaping calls around you without ever having been
chosen.

## Module brief

In M1 you built a working model of one thing: the large language model. This module is about a
harder, more practical problem — the word "AI" is currently stuck to at least three genuinely
different technologies, and a People leader meets all three in a single week, usually without
labels.

Here's the week. Monday, someone on your team asks whether they can use a chat assistant to
draft interview questions. Wednesday, your HRIS vendor demos a new "AI-powered" panel that
answers employees' benefits questions. Friday, a different vendor shows you a dashboard that
scores your open reqs' candidate pipelines and flags "high-potential applicants." All three got
called AI. Two of them are the technology you studied in M1. One is something else entirely —
and it's the one that can quietly make decisions about people.

Confusing them costs you in both directions. Treat a scoring engine like a chat assistant and
you'll under-scrutinize something with real adverse-impact exposure. Treat a drafting copilot
like a scoring engine and you'll wrap a harmless writing aid in three layers of approval nobody
needed. Over-trust and over-compliance are the same mistake — reasoning about the label instead
of the thing.

By the end of this module you'll be able to look at any "AI-powered" product from the outside —
in a demo, in your existing stack, in a teammate's excited Slack message — and answer the only
question that matters: *what shape of thing is this, and what does that shape make it good for,
bad at, and accountable to?*

## Learning objectives

By the end of this module you should be able to:

1. Sketch the broad arc of AI as a field — the rule-based era, the shift to machine learning,
   and what changed in 2017 — well enough to talk with a skeptical colleague without
   overclaiming or dismissing.
2. Distinguish the three shapes AI takes in a People leader's stack — assistants, copilots, and
   decision engines — by what goes in, what comes out, and where the context lives.
3. Identify which shape any product is from the outside, using four questions that need no
   technical access.
4. Explain why the failure modes differ by shape — and why the scoring shape carries the
   regulatory exposure.
5. Match a real task to the right shape, and name the one question you'd put to a vendor before
   trusting their label.

## Lesson 1 · The long arc, briefly

The term "artificial intelligence" was coined in 1956, at a summer workshop at Dartmouth
College. The researchers there genuinely believed they could crack most of the problem within a
generation. They were wrong — but their ambition set the field's agenda for decades, and the
field's history since is the fastest way to understand why this moment is different.

The first several decades were dominated by one approach: encode human knowledge as explicit
rules, then write programs that reason over those rules. It worked in narrow domains and
collapsed everywhere else — the world holds more edge cases than any rulebook can. Twice the
gap between promise and delivery grew wide enough that funding and attention drained away.
The field calls these the **AI winters**, and they're why some of your most experienced
colleagues reflexively file AI under "hype cycle." They watched it happen before. Their
skepticism is earned, and arguing with it head-on is both rude and ineffective.

The shift that ended the rules era was **machine learning**: instead of writing rules, show the
system enormous numbers of examples and let it find the patterns itself. That's the lineage the
M1 material comes from — and it's why *all training data carries bias* is a structural fact
rather than a scandal. A system that learns from examples learns what the examples contain.

The breakthrough that produced the current moment came in 2017, when researchers published the
**transformer** architecture — the design that made it practical to train language models at
enormous scale. Combined with a stubborn empirical finding — bigger models trained on more data
kept getting better, past every point where experts predicted the gains would flatten — it
produced the LLMs from M1. The "GPT" in ChatGPT stands for generative pre-trained *transformer*;
Claude and Gemini are built on the same family of architecture.

So when the skeptic on your leadership team says "we've seen AI hype before," the honest answer
is: *yes, twice, and the pattern was real — and this wave is built on a different mechanism than
the ones that stalled.* The previous eras tried to hand-encode intelligence; this one grew a
general language capability from data at scale. That doesn't mean every product demo is real —
most of what you'll be pitched is thin wrapping around someone else's model. It means the
underlying capability is not going to un-happen. Holding both of those at once — no
overclaiming, no dismissing — is the posture this whole course tries to build. You'll practice
saying it out loud in M8.

> ### Try this — 2 minutes
> Think of the most AI-skeptical person you work with. In two sentences — write them down —
> explain what changed in 2017 without using the words "transformer" or "architecture."
> If your sentences survive their eye-roll, you've got the arc.

## Lesson 2 · The three shapes **[V]**

Every "AI" a People leader meets is one of three shapes. The technology overlaps; the shape —
what goes in, what comes out, where the context lives — is what determines how to treat it.

**Shape 1: Assistants.** Claude, ChatGPT, Gemini, Copilot as a standalone chat. A general-purpose
LLM in a conversation window. *You* supply the material and the briefing; it transforms,
drafts, summarizes, critiques. Its defining property is breadth with zero built-in knowledge of
your organization — everything M1 taught. It is the most capable shape and the most dependent
on how well you drive it. When this course says "your AI tool," it means this shape.

**Shape 2: Copilots.** The same LLM technology, embedded inside software you already use — the
drafting panel in your ATS that writes job descriptions, the summarizer in your docs suite, the
benefits-question bot inside the HRIS, the meeting notes in your video tool. The host
application supplies the context automatically, which is the convenience — and the constraint.
A copilot sees what its host shows it and nothing else, does the narrow set of tasks the vendor
built, and quietly inherits every property of LLMs from M1: same fluency, same hallucination
risk, same decoupling of confidence from correctness. The danger with copilots isn't the
technology — it's the packaging. Output that appears inside a trusted system of record borrows
that system's credibility without earning it.

**Shape 3: Decision engines.** Resume screeners and rankers, "candidate match" scores,
attrition-risk predictors, engagement-driver models, comp benchmarking. Mostly not language
models at all — these are scoring and matching systems, often older than the current wave,
rebranded "AI" because the label sells. Structured data about people goes in; a number, rank,
or flag about a person comes out. This is the shape M1 warned about: it doesn't assist a
decision about a person, it *makes* one and hands you the output. It's also where regulatory
frameworks concentrate — employment-related scoring is the canonical high-risk category **[V]**
— and where adverse impact stops being abstract. You'll spend M7 on this shape. For now, one
rule: when the output is a number attached to a person, everything in this course about
"drafts" stops applying. A draft can be edited. A score has already decided something.

> **In your stack [V]:** Your organization's provisioned tools slot into these shapes — the
> assistants you've been given, the copilots already embedded in your HR systems, and any
> scoring features switched on inside them. If you don't know which of the three shapes a given
> system is, that's not a gap in your technical knowledge — it's the audit this module's
> activity has you run.

## Lesson 3 · Telling them apart from the outside

You will never be shown a product's architecture, and you don't need it. Four questions,
answerable from a demo or a settings page, identify the shape of anything.

**1. What goes in?** Material you choose to give it, per use (assistant). Whatever the host
application already holds (copilot). Structured records about people — resumes, performance
data, survey responses — flowing in automatically (decision engine).

**2. What comes out?** Language you'll edit — a draft, a summary, an answer (assistant or
copilot). Or a number, rank, score, match percentage, or flag (decision engine). This is the
single sharpest tell: **does it produce language, or a number about a person?** Language can be
read, judged, and rewritten before it touches anyone. A number invites sorting, and sorted
lists become decisions the moment someone is busy.

**3. Where would an error land?** A bad draft lands on *your* desk, caught or not by your
review. A bad copilot answer lands on an employee who asked the benefits bot and believed it. A
bad score lands on a candidate who never knows they were filtered. The further the output lands
from your desk, the less "human review" describes anything real.

**4. Who's accountable for the output?** If the honest answer is "whoever edits and ships it,"
you're looking at a drafting tool and M1's rules apply. If the honest answer is "nobody edits
it — it just routes people," you're looking at a decision engine, whatever the marketing says —
and it's carrying accountability no one has consciously accepted.

Ask these four in that vendor demo and watch what happens. A good vendor answers cleanly. A
telling vendor answers the language question with the score question's answer — "our AI
surfaces the best candidates" — and that blur is your cue to slow the meeting down.

> ### Try this — 3 minutes
> Pick one system in your stack with an AI feature you've never examined. Answer the four
> questions from what you already know. If you can't answer #3 — where an error would land —
> you've found this week's most useful email to send.

## Lesson 4 · Choosing without getting paralyzed

"Which AI tool is best?" is the question everyone asks, and it's the wrong one — it assumes the
tools compete on one axis. The right question is older and calmer: **what is this task actually
asking for?** Run the task, not the tool, through the shapes.

**Transformation of material you have** — rewrite this policy in plain language, structure these
interview notes, draft three versions of this announcement — wants an assistant. This is the
delegation heuristic's home ground: you supply everything it needs, and your review is the
quality gate. When people ask "which assistant," the honest answer **[V]** is that the leading
ones are close enough that *the one your organization has provisioned, used well,* beats the
marginally better one used through a personal account — because the provisioned one comes with
an agreement about your data, and M8 will show you why that dwarfs any capability difference.

**Work that lives inside a system** — JD drafting in the ATS, summaries in the docs suite —
wants the copilot that's already there, with one habit attached: read its output with exactly
the M1 skepticism you'd give a chat window. The system of record it appears in vouches for
nothing.

**Anything that scores, ranks, or filters people** doesn't get a tool recommendation. It gets
M7's question first: should any system be doing this at all — and under whose sign-off? That
one is never answered in a product demo.

And a counterweight, because tool-shopping is a genuine failure mode: for the tasks in this
course, the capability differences between major assistants are smaller than the difference
between a thin brief and a good one. M5 — prompting as briefing — will move your results more
than any tool switch. If you're spending more time comparing tools than briefing them, the
comparison has become the procrastination.

## Key takeaways

- **"AI" currently names three different shapes** in a People leader's stack: assistants (you
  supply material, it drafts), copilots (embedded in a host app, context comes along), and
  decision engines (data about people in, scores about people out).
- **The field's history explains the skeptics.** Two AI winters made "hype cycle" a reasonable
  prior. What changed in 2017 — learned language capability at scale, not hand-coded rules — is
  a different mechanism, which is the honest, non-dismissive answer.
- **The sharpest tell is the output: language, or a number about a person?** Language gets
  edited before it touches anyone. A number attached to a person has already decided something.
- **Copilots borrow credibility from their host system without earning it.** Same LLM, same
  failure modes, more trusted wrapper. Read them with chat-window skepticism.
- **Errors land in different places by shape** — your desk, an employee's inbox, a candidate's
  silent rejection. "Human review" only describes the first.
- **Choose by task, not by leaderboard.** The provisioned assistant used well beats the
  marginally better one used outside your data agreement — and briefing quality moves results
  more than tool choice ever will.

## Applied activity — "The Stack Audit"

**Time:** 20–25 minutes · **Submit:** your audit table plus a 250–350 word write-up · **Graded
against the rubric below.** Score doesn't matter. Doing the work is where the learning lands.

Before you started this module, you predicted how many systems in your People stack have AI in
them. Now go count.

**Step 1 — Inventory (10 min).** List the systems you or your team touch in a normal month:
ATS, HRIS, payroll, survey platform, LMS, docs suite, meeting tools, chat tools, scheduling
tools. For each, note whether it has an AI feature — announced, embedded, or switched on
without ceremony in the last two years. Vendor release notes and settings pages are fair game.
Three systems minimum; most people find more.

**Step 2 — Classify (5 min).** For each AI feature you found, name its shape — assistant,
copilot, or decision engine — using the four questions from Lesson 3. Where a system contains
more than one shape (many do), say so: "HRIS: benefits-answer copilot + attrition-risk decision
engine" is exactly the kind of precision this exercise is after.

**Step 3 — One question each (5 min).** For each decision engine you found — and at least one
copilot — write the single question you'd put to the vendor. Make it concrete enough that a
vendor could actually answer it, and revealing enough that the answer would change what you do.

**Step 4 — Score your prediction (5 min).** Compare the count you predicted against what you
found. Name the direction of your miss and your best one-sentence theory of why.

Then write the reflection: what you found, what surprised you, which single system most needs a
closer look, and why.

## Knowledge check — 8 questions

*Unlocks after the applied activity is submitted. Retakes are free and unlimited.*

**Q1.** A colleague says "AI is just another hype cycle — I've seen this before." What's the most honest and accurate response?

- A. They're wrong — this technology has no precedent and the old pattern doesn't apply
- B. They're right — the field has overpromised before and this wave will fade the same way
- C. The skepticism is earned — the field stalled twice — but this wave runs on a different mechanism: learned capability from data at scale, not hand-coded rules ✓
- D. It doesn't matter either way, because the tools change too fast for the history to be relevant

> **C.** Both winters were real, which is why the skepticism deserves respect rather than
> rebuttal — and the mechanism shift is why the pattern doesn't simply repeat. A overclaims,
> B dismisses, and D dodges the question the skeptic actually asked.

**Q2.** What changed in 2017 that made the current generation of AI tools possible?

- A. Computers finally became fast enough to run the rule-based systems designed in the 1980s
- B. The transformer architecture made it practical to train language models at enormous scale ✓
- C. Governments began funding AI research again after the second AI winter
- D. Companies started collecting employee data in large enough volumes to train on

> **B.** The transformer is the architecture behind the "T" in GPT — and behind Claude and
> Gemini. Combined with the finding that bigger models kept improving, it produced modern LLMs.
> A describes the era that failed; C and D aren't the mechanism.

**Q3.** Your HRIS vendor announces an "AI-powered" panel that answers employees' benefits questions inside the HRIS. Which shape is this, and what's its defining property?

- A. An assistant — the employee supplies all the context it uses
- B. A decision engine — it processes structured employee records
- C. A copilot — LLM technology embedded in a host system, drawing context from that system and borrowing its credibility ✓
- D. Not AI at all — question answering is a search feature

> **C.** Embedded in a host app, context supplied by the host, narrow task set — and output
> that appears inside a trusted system of record, which is exactly why its errors are dangerous:
> an employee who asked the official HRIS believes the answer.

**Q4.** Of the four outside questions, which single tell most sharply separates a decision engine from the other two shapes?

- A. Whether the product uses a large language model internally
- B. Whether the output is language you'll edit, or a number, rank, or flag attached to a person ✓
- C. Whether the vendor calls the feature "AI-powered" in their marketing
- D. Whether the tool requires a separate login from your other systems

> **B.** Language gets read, judged, and rewritten before it touches anyone; a number about a
> person invites sorting, and sorted lists become decisions. A is invisible from the outside,
> C is marketing, D is IT trivia.

**Q5.** Why does a copilot's output deserve the same skepticism as a chat assistant's, even though it appears inside your system of record?

- A. It doesn't — the host system's data makes copilot output more reliable
- B. Copilots run on older, weaker models than standalone assistants
- C. It's the same LLM technology with the same failure modes — the trusted wrapper adds credibility without adding correctness ✓
- D. Copilot output is unreliable because host systems restrict what the model can see

> **C.** Same fluency, same hallucination risk, same confidence–correctness decoupling from M1.
> The packaging is the hazard: output inside the official HRIS *looks* vouched for. B isn't
> reliably true, and D describes a constraint, not the reason for skepticism.

**Q6.** A vendor demo shows a dashboard that ranks your candidate pipeline and flags "high-potential applicants." Where would this system's errors land?

- A. On your desk, caught by your normal review before anything ships
- B. On the vendor, who is accountable for their model's outputs
- C. Nowhere serious — a ranking is only a suggestion until a human acts on it
- D. On candidates who get filtered or deprioritized without anyone ever reviewing the call ✓

> **D.** A ranked list does its damage upstream of review: the people it sorts to the bottom
> silently fall out of a busy pipeline. That's why "human review" describes drafting tools, not
> scoring tools — the human reviews the survivors, not the decision.

**Q7.** Your team wants to turn messy panel-interview notes into structured debriefs. Which shape fits, and why?

- A. An assistant — you supply the notes, it transforms them, and your review is the quality gate ✓
- B. A decision engine — interview evaluation is fundamentally a scoring task
- C. A copilot only — notes should never leave the system they were taken in
- D. None — interview material is too sensitive for any AI shape to touch

> **A.** Transformation of material you supply is the assistant's home ground and the
> delegation heuristic's center. B would convert your notes into scores about people — exactly
> the shape shift M7 exists to stop. C and D confuse the shape question with the data question,
> which M4 handles on its own terms.

**Q8.** What's the strongest argument for using the assistant your organization has provisioned rather than a marginally better one through a personal account?

- A. The provisioned one is always the most capable option available
- B. The provisioned one comes with an agreement about your data — and that outweighs capability differences that briefing quality dwarfs anyway ✓
- C. IT departments block personal accounts, so the question never arises
- D. Using multiple assistants confuses the models and degrades their output

> **B.** The data agreement is the real difference — M8 makes this concrete — and M5 will show
> that briefing quality moves results more than tool choice. A isn't guaranteed, C isn't
> reliably true, and D isn't a thing.

## Sources and attribution

This module draws on the following material:

- **The AI Fluency Framework** (Rick Dakan & Joseph Feller, in collaboration with Anthropic,
  CC BY-NC-SA 4.0) — the historical arc in Lesson 1 and the overclaiming/dismissing framing
  adapt its treatment of AI's history and of calibrated judgment about AI capability.
- **"Attention Is All You Need"** (Vaswani et al., 2017) — the transformer paper behind
  Lesson 1's account of what changed. **[V]**
- The three-shapes taxonomy and the four outside questions are original to this course,
  developed for the People-leader context.
- Regulatory framing (employment as a high-risk category) follows the EU AI Act's treatment of
  employment-related AI systems — introduced in M1, deepened in M7. *Verify current specifics
  with counsel; this area moves.* **[V]**
