# AI 101 · Module 7 — The lines that don't move

**Course:** AI 101 · The Foundation · Module 7 of 8
**Estimated time:** 30 min content · 10 min exercise · 20–25 min applied activity
**Prerequisite:** M6 — you can't reason about adverse impact until you know why fluent output is unreliable
**Builds on:** M1 (the heuristic's final clause) · M2 (decision engines) · M6 (verification)
**Feeds:** M8 (what you own) · 201 M6 (people data in production)

> `Concepts reviewed: [DATE] · Examples current as of: [DATE]`
> Lesson 3's regulatory content is **[V]** volatile layer and flagged for counsel review
> before deployment-specific claims are added. The assist/decide line itself is stable —
> it holds under every regulatory regime on the horizon, which is rather the point.

---

## Calibration prompt — before you start

*One claim and one number. Commit both before you read.*

> **"Every AI use in my function is on the right side of the line between assisting and deciding."**

**True of us, or not true of us?** One sentence — including the uses that are seriously proposed
rather than only the ones already running.

**And the number**, which you will score in the applied activity:

At the end of this module you'll audit the AI uses in your own function — current and
seriously proposed — against the line this module draws.

**How many of them do you predict land on the wrong side?** Count anything live or under
real consideration: tools, features, team habits, the vendor pilot someone's excited
about. Write the number down.

The commonest miss isn't the direction you'd guess. People expect to find zero and fear
finding five; what they usually find is one or two — already running, adopted casually,
that nobody ever examined *as* a decision about people. The audit exists to make the
implicit explicit while it's still cheap to change.

## Module brief

Every module so far has taught you to use AI better. This one teaches you where using it
better is beside the point — because some applications fail not by working badly but by
*working at all*.

M1 ended its delegation heuristic with a clause this course has repeated like a drumbeat:
*and it must not make decisions about people.* This module is where the drumbeat becomes
an argument you can make out loud — to an excited vendor, an impatient executive, a
well-meaning teammate with a screening shortcut. The argument has to be made well, because
you will not be the most enthusiastic person in the room. Efficiency is on the other side.
"The human still decides" is on the other side. You'll need something better than
discomfort; you'll need the mechanism.

Here it is, compressed once, built out in Lesson 1. The model learned from human text and
human records. Those records contain every pattern in how organizations have actually
treated people — including the ones we've spent decades trying to correct. A system that
learns "what does a strong candidate look like" from history learns *who got called
strong*, and reproduces it at scale, fluently, with M6's signature confidence. Bias in AI
isn't a defect that better engineering removes; it's fidelity to data that contains the
world as it has been. In most domains that's a quality problem. In employment decisions
it has a legal name — adverse impact — and a moral one, and it lands on the population
you specifically exist to protect.

What this module is not: anti-AI. Six modules taught you the assist side, and the assist
side is enormous — drafting, summarizing, structuring, preparing. The line this module
draws is narrow, specific, and defensible: **AI assists with work about people; it does
not decide about people, rank people, or filter people.** Narrow lines hold. Vague
discomfort gets routed around by Q3.

## Learning objectives

By the end of this module you should be able to:

1. Explain why bias is a property of learned systems, not a bug — and why "we cleaned the
   data" and "we removed the protected fields" don't dissolve the problem.
2. Draw the assist/decide line through real cases — screening, ranking, performance
   language, promotion, termination — and say precisely why "a human reviewed it" isn't
   automatically a defense.
3. Sketch the regulatory shape **[V]** well enough to ask counsel the right questions —
   and no further.
4. Say no so it sticks: specific, tied to a named decision, with the assist-side
   alternative attached.
5. Audit your own function's AI uses against the line — the applied activity.

## Lesson 1 · Bias is a property, not a bug

The word "bias" invites a mental model of contamination — a stain in the data that
diligent cleaning removes. That model leads to the two most common false reassurances in
vendor conversations, so let's break it properly.

Recall M1: a learned system finds patterns in examples and reproduces them. Now ask what
the examples *are* for any employment-relevant model: decades of résumés, hiring
outcomes, performance ratings, promotion histories — records of what organizations
actually did. Those records don't contain "merit" as a clean signal. They contain *who
got hired, rated, promoted* — merit tangled with every systematic pattern in how those
calls were made: which schools got the benefit of the doubt, which names got callbacks,
which communication styles got called "leadership presence," who got mentored onto the
projects that make a résumé strong. A system trained to predict "strong candidate"
learns that tangle *as* the definition. It isn't malfunctioning when it reproduces the
pattern. It's doing exactly what it was built to do, on data that contains the world as
it has been.

Now the two reassurances. **"We removed gender, race, and age from the inputs."** The
tangle doesn't live in the labeled fields; it lives in everything correlated with them —
name, zip code, school, employment gaps, club memberships, word choice, the shape of a
career path. M4 taught you that identity survives redaction through combinations;
protected characteristics survive field-removal the same way. The literature's blunt
version: proxies are everywhere, and a capable learner finds them. **"Our model is more
objective than biased human reviewers."** This one deserves care, because the premise is
true — human review *is* biased; that's what the training data just proved. But a model
doesn't transcend the pattern; it *standardizes* it. A biased human decision is one
decision, varying by the human, contestable in the room. The same bias in a model runs on
every candidate, identically, at scale, wearing M6's fluent confidence — and (next
lesson) with the accountability diffused. "Less biased than a human" is an empirical
claim someone must *demonstrate for the specific system on the specific population* —
never a property the technology gets on principle.

One more consequence, from M6: an LLM asked to *evaluate* a person produces the same
confident prose whether its judgment is sound or a reproduced pattern. "Rate this
candidate's leadership potential from their résumé" returns fluent, specific,
plausible-sounding assessment — and every word of it is pattern completion over exactly
the tangled history above. The fluency is not evidence. In this domain, it never is.

> ### Try this — 2 minutes
> Write down three things a hiring model could infer from a résumé that correlate with a
> protected characteristic but aren't one. (Lesson 1 named several.) This is the list
> you'll want in your pocket the next time someone says "we don't even look at
> demographics."

## Lesson 2 · Assist versus decide

The line, stated operationally: **AI may transform, structure, and prepare the material
humans decide from. It may not score, rank, filter, or characterize the people the
decision is about.** Run the week's real cases through it:

**Screening.** *Assist:* structuring intake notes; turning a hiring manager's rambling
brief into a crisp role spec; drafting interview questions from the competencies.
*Decide:* résumé scoring, "fit" ranking, auto-rejection, "top candidates" surfacing —
M2's decision engines. The tell from M2 applies: if candidates the system ranked low
never reach human eyes, the system decided, whatever the workflow diagram says.

**Performance.** *Assist:* helping a manager turn their own observations into clear,
specific written feedback; structuring peer input *the humans wrote*. *Decide:* generating
the assessment — "rate this employee," "summarize their performance from these tickets,"
any sentence about a person's quality that a human didn't originate. The manager's
judgment is the input; AI formats it. The moment AI supplies the judgment and the manager
formats *that*, the line is crossed even though a human typed the final version.

**Promotion, comp, termination.** *Assist:* checking a written case for clarity and
consistency; assembling the human-authored materials into a packet. *Decide:* flight-risk
scores feeding retention decisions, "potential" ratings, termination-list drafting — and
note that these arrive politely, as "data points for the conversation." A number about a
person in a decision meeting *is* a decision input; that's what numbers in meetings are
for (M6 told you what happens to numbers — they get repeated without caveats, and they
anchor).

Now the sentence you'll hear most: **"it's fine — a human makes the final call."** Here's
why that's not automatically a defense, mechanically. Human review checks a *specific
failure* you can articulate: M6's Level 2 traces a citation, a manager re-derives a
recommendation. But review of a ranked list checks — what, exactly? The reviewer sees the
survivors, not the filtered; they can't re-derive a score built on ten thousand tangled
examples; and the anchor is already set — disagreeing with the machine now requires a
*reason*, and the machine's reason looked so fluent. Review without the ability to catch
the failure is M6's definition of theater: **a human in the loop is a defense only when
the human could actually catch the error.** For a fabricated citation, they can. For
"why did the model rank her 47th?", nobody can — including the vendor.

The line's honest gray zone: aggregate analysis. "Summarize themes from 400 exit
interviews" is about *people*, plural, and it shapes decisions — but it characterizes a
population, not a person, and no individual is scored. That's assist-side, with M4's
redaction and M6's verification riding along — *until* the aggregate gets small enough
to point at individuals (M4's small-population flag) or the themes get re-attached to
named people. The test that travels: **could this output change one identifiable
person's outcome?** Yes → the decide side's rules apply, whatever the tool looks like.

## Lesson 3 · The regulatory shape **[V]**

*Everything in this lesson is direction-of-travel, not legal advice, and it moves —
verify with counsel before relying on any specific here. The lesson's purpose is to make
your conversation with counsel better, not to replace it.*

The shape, in four strokes. **Employment decisions are a named high-risk category** in
the emerging regulatory landscape — the EU AI Act treats AI systems used in employment,
worker management, and access to self-employment as high-risk, with obligations to
match; and a fast-growing body of state and city rules targets automated employment
decision tools specifically — audit requirements, disclosure requirements, and
definitions that turn on whether a tool *substantially assists or replaces* discretionary
decisions. **[V]**

**And the U.S. federal picture moved, in a way worth reading carefully, because the
obvious reading is wrong.** In January 2025 the EEOC removed its AI guidance documents —
the 2023 technical assistance on Title VII and the 2022 material on the ADA — following a
change of administration and the rescission of the prior executive order. It would be easy
to read that as the rules relaxing. **They didn't. Guidance was withdrawn; the statutes
were not.** Title VII, the ADA and the ADEA apply to an algorithmic decision exactly as
they applied before, because they were never AI-specific in the first place — and private
plaintiffs, who bring most employment litigation, do not need an agency's guidance
document to sue. What actually changed is that **the federal government stopped telling
you how it reads the law, while the states started telling you how they read theirs.** You
have less warning, not less exposure. **[V]**

**Disparate impact doesn't need intent.** The doctrine long predates AI: a neutral-seeming
practice that disproportionately excludes a protected group needs job-related
justification, regardless of anyone's intentions. Map that onto Lesson 1 — a system that
learned the tangle reproduces the disparity at scale, no malice required — and you see why
"the vendor assured us it's unbiased" is not a defense but a deferred question: *show me
the analysis, for this system, on a population like ours.* Vendors making bias claims
should expect to produce validation evidence; that expectation is increasingly
regulatory, not just prudent. **[V]**

**Accountability doesn't outsource.** The consistent regulatory and enforcement posture:
the employer using the tool owns the outcome, jointly with whoever built it — buying a
biased system is doing a biased thing. M8 generalizes this ("the sentence 'the AI did
it' has never once helped anyone"); here it lands specifically: your organization's name
is on every decision its tools make.

What this means you should *do*, this quarter, without waiting for counsel: **inventory**
(the M2 stack audit, re-read for decision engines — you likely already have automated
employment decision tools you didn't name that way); **ask vendors for their validation
evidence** in writing; and **bring counsel a specific list** — "these three systems
touch hiring and performance; here's what each decides" — because "is our AI compliant?"
gets you a shrug, and the specific list gets you an answer. The questions for counsel:
which of our jurisdictions regulate these tools today, what do they require of us this
year, and what's coming that we should build for now? **[V]**

## Lesson 4 · Saying no so it sticks

You now own an argument. This lesson is about deploying it so it survives contact with
enthusiasm — because vague discomfort loses to a vendor deck every time, and a blanket
"no AI near people decisions" gets routed around the moment it blocks something a leader
wants. Four properties make a line hold:

**Specific.** Name the decision, not the technology. Not "we're cautious about AI in
hiring" — "no system ranks, scores, or filters candidates; screening decisions are made
by humans reading human-legible material." A specific line can be checked against any
new tool in thirty seconds; vagueness has to be re-litigated per vendor.

**Attached to its alternative.** Every no arrives with the assist-side yes: "we don't
score candidates — we *do* use AI to structure intake, draft interview kits, and turn
your notes into clean debriefs, and here's who sets that up for your team." The
alternative isn't a consolation prize; it's what makes the line politically survivable.
People route around prohibitions; they adopt trades.

**Reasoned in the room's language.** For the executive: standardized bias at scale,
disparate impact without intent, accountability that doesn't outsource — risk language,
with Lesson 3's specifics ready. For the team: "we can't catch this system's errors, and
we don't ship what we can't verify" — M6's language, which they've now internalized. For
the vendor: "show me your validation evidence for a population like ours, in writing" —
which either produces evidence or produces silence, and both are answers.

**Owned by a name.** A line nobody owns is a suggestion. The line gets a sign-off — new
tools touching people decisions clear [name/role] before pilot, and that person's answer
is the answer. (M8 builds the full policy skeleton; this is its first entry, and the
applied activity has you draft it.)

And the posture that makes all four land: the line is not a hedge against the future —
it's how you get to use everything else *confidently*. The teams that drew it clearly
are the ones moving fastest on the assist side, because nobody's wondering where the
edge is. That's the version of this module you want your organization to remember: not
the department of no — the people who knew exactly where yes lives.

## Key takeaways

- **Bias is fidelity, not malfunction.** Learned systems reproduce the patterns in their
  training records — which for employment data means the tangle of merit with every
  systematic skew in how organizations actually treated people. Cleaning intentions out
  of the data isn't an option; the tangle *is* the data.
- **Field-removal doesn't work and "more objective than humans" proves too much.**
  Proxies survive deletion the way identity survives redaction; and a model doesn't
  transcend human bias — it standardizes one instance of it at scale, fluently. "Less
  biased" is an empirical claim requiring demonstration, per system, per population.
- **The line: AI transforms and prepares the material humans decide from; it does not
  score, rank, filter, or characterize the people decided about.** The traveling test:
  could this output change one identifiable person's outcome?
- **"A human reviews it" defends only what the human could actually catch.** Nobody can
  re-derive a ranking built on ten thousand tangled examples — review of the unreviewable
  is theater, and the filtered-out never reach the reviewer at all.
- **The regulatory shape [V]: employment is a named high-risk category, disparate impact
  needs no intent, and accountability doesn't outsource.** Inventory your decision
  engines, demand validation evidence in writing, bring counsel a specific list.
- **A line that holds is specific, attached to its assist-side alternative, reasoned in
  the room's language, and owned by a name.** Drawn well, it's not the department of no
  — it's what lets everything else move fast.

## Applied activity — "Draw the Line"

**Time:** 20–25 minutes · **Submit:** your one-pager plus a 250–350 word reflection ·
**Graded against the rubric below.** Score doesn't matter. Doing the work is where the
learning lands.

One page, for your own function, that you could actually circulate. Before you write it:
the audit you predicted on.

**Step 1 — The audit (7 min).** List your function's AI uses — live and seriously
proposed. Include the unglamorous ones: the ATS feature someone switched on, the survey
platform's "AI insights," the manager who mentioned using a chatbot for review drafts.
For each: which side of the line, using the traveling test. Count the wrong-side
findings and score your prediction — direction of miss, one sentence on why.

**Step 2 — The one-pager (12 min).** Four sections, all concrete:
- **Three uses you endorse** — assist-side, from your real work, each with its M6
  verification note ("JD drafting — recruiter reviews, no verification beyond read" vs.
  "policy summaries — Level 2, claims traced").
- **Two uses you forbid** — named specifically (the decision, not the technology), each
  with its reasoning in one or two sentences an executive would engage with.
- **The trade** — for each no, the assist-side yes that replaces it.
- **The sign-off** — who clears new people-touching tools before pilot, by name or role.

**Step 3 — The stress test (3 min).** Read your forbidden list as the most enthusiastic
AI adopter you know. Write down the workaround they'd find. If the workaround is easy,
tighten the specific wording — that gap is where the line will actually be tested.

Then the reflection: what the audit surprised you with, which forbidden use was hardest
to write the reasoning for (that's the one that needed this module), and what you'd need
from M8 to make the one-pager real policy.

## Knowledge check — 8 questions

*Unlocks after the applied activity is submitted. Retakes are free and unlimited.*

**Q1.** Why is bias in an employment-trained model a property rather than a bug?

- A. Vendors deliberately train models on biased data because it's cheaper
- B. The training records contain merit tangled with every systematic skew in how organizations actually decided — and the system learns that tangle as the definition ✓
- C. Models are programmed with the biases of their developers
- D. It is a bug — sufficiently careful data cleaning removes the bias

> **B.** The records are what organizations *did*, not what merit *was* — who got hired,
> rated, promoted, with every pattern in those calls included. A system that predicts
> "strong candidate" from history reproduces the history. D is the contamination model
> this lesson exists to break: you can't clean intentions out of outcomes.

**Q2.** A vendor explains their screening tool can't be biased because gender, race, and age were removed from the inputs. What's wrong with this reassurance?

- A. Nothing — removing protected fields is the accepted standard for fairness
- B. The fields can be reconstructed from metadata the vendor forgot to strip
- C. The patterns live in everything correlated with those fields — names, schools, gaps, word choice, career shapes — and a capable learner finds the proxies ✓
- D. Removing fields reduces accuracy, which is itself a form of bias

> **C.** Protected characteristics survive field-removal the way identity survives
> name-deletion in M4 — through combinations. The tangle doesn't live in labeled columns;
> it lives in the correlated everything-else, which is why field-removal is the first
> false reassurance of Lesson 1.

**Q3.** "Our model is less biased than human reviewers" is best treated as:

- A. True on principle — algorithms don't have feelings, so they can't discriminate
- B. False on principle — software is always more biased than people
- C. Irrelevant — bias comparisons between humans and models are meaningless
- D. An empirical claim requiring demonstration for the specific system on a relevant population — because a model standardizes one bias pattern at scale rather than transcending it ✓

> **D.** The premise is even true — human review is biased; that's what the training data
> proves. But the model doesn't rise above the pattern, it runs one instance of it on
> every candidate identically, fluently, at scale. So the claim is checkable, sometimes
> even true — and never a property the technology gets for free. Ask for the validation
> evidence, in writing.

**Q4.** A manager uses AI to turn their own written observations into a clear, well-structured performance review. A second manager pastes an employee's tickets and asks the model to "summarize their performance," then edits the result. The line says:

- A. Both are fine — a human shipped the final text in both cases
- B. The first is assist (AI formats the manager's judgment); the second crossed the line (AI originated the judgment, and the human formatted it) ✓
- C. Both crossed it — AI should never touch performance documents
- D. The second is safer, because tickets are objective data

> **B.** The direction of origination is the whole test: judgment from the human, formatting
> from the machine is assist; judgment from the machine, formatting from the human is
> decide — even though a person typed the final version in both. D is the seductive one:
> "objective" inputs don't make the characterization of a person any less a
> characterization.

**Q5.** Why isn't "a human makes the final call" automatically a defense for a résumé-ranking system?

- A. Because regulations prohibit humans from overriding algorithmic outputs
- B. Humans always agree with the machine, so review changes nothing
- C. The reviewer sees only the survivors, can't re-derive the scores, and is anchored by them — review is a defense only where the human could actually catch the error ✓
- D. It is a defense — human review resolves the concern in full

> **C.** M6's principle, sharpened: verification requires the checker to be capable of
> catching the failure. The filtered-out candidates never reach the reviewer; the score's
> reasoning isn't re-derivable by anyone, vendor included; and disagreeing with a fluent
> number now requires a reason. Review of the unreviewable is theater.

**Q6.** "Summarize the themes in these 400 redacted exit interviews" sits on the assist side. What moves this kind of work across the line?

- A. Using more than one model to generate the summary
- B. The population getting small enough to point at individuals, or themes getting re-attached to named people — anything that could change one identifiable person's outcome ✓
- C. Nothing — aggregate analysis is always safe regardless of size
- D. Using the summary in any meeting where decisions are made

> **B.** The traveling test. Aggregates characterize populations, and that's assist-side
> work with M4 and M6 riding along — until the aggregate thins into de-facto individual
> assessment. C ignores M4's small-population flag; D would outlaw using analysis for
> anything, which isn't the line — informing decisions about *policies* is what analysis
> is for.

**Q7.** Per the regulatory shape **[V]**, why does "the vendor assured us their tool is unbiased" fail as a defense under disparate-impact doctrine?

- A. Vendor statements are inadmissible in legal proceedings
- B. Disparate impact turns on outcomes, not intent — so the question is validation evidence for this system on a population like yours, and the employer owns the outcome either way ✓
- C. It doesn't fail — good-faith reliance on vendor assurances transfers the liability
- D. Because all vendor tools are in fact biased

> **B.** No malice is required — a neutral-seeming practice that disproportionately
> excludes needs job-related justification, whoever built it. Accountability doesn't
> outsource: buying a biased system is doing a biased thing. Hence the module's homework —
> validation evidence in writing, and a specific list for counsel rather than "are we
> compliant?"

**Q8.** Which version of the line is most likely to actually hold inside an organization?

- A. "We take an appropriately cautious approach to AI in talent processes"
- B. "No AI anywhere near anything involving people, effective immediately"
- C. "No system ranks, scores, or filters candidates — screening stays human. AI does structure intake, draft kits, and clean up debriefs; [Name] clears any new people-touching tool before pilot" ✓
- D. Whichever version the vendor's legal team is comfortable signing

> **C.** The four properties: specific (checkable against any new tool in seconds),
> attached to its assist-side trade (adoptable, not just prohibitive), reasoned, and
> owned by a name. A re-litigates per vendor; B routes around by Q3 because it blocks
> the assist side too — the blanket version is the *weaker* version, which is this
> module's least intuitive lesson.

## Sources and attribution

This module draws on the following material:

- **The AI Fluency Framework** (Rick Dakan & Joseph Feller, in collaboration with
  Anthropic, CC BY-NC-SA 4.0) — the treatment of ethical responsibility and human
  accountability for AI-assisted decisions adapts its "Diligence" competency for the
  employment context.
- The disparate-impact framing follows long-standing U.S. employment-law doctrine;
  the high-risk categorization of employment AI follows the EU AI Act's published
  framework. **US federal guidance `[V]`:** the EEOC removed its AI technical assistance
  documents in January 2025 — the May 2023 Title VII material and the May 2022 ADA
  material — following Executive Order 14179 and the rescission of the prior
  administration's AI executive order. **The underlying statutes were not amended**, and
  the agency's Strategic Enforcement Plan listing AI remained in place; what withdrew was
  guidance, not law. **This lesson is direction-of-travel, not legal advice — verify all
  specifics with counsel before relying on them. Flagged for counsel review before any
  deployment-specific claims are added. [V]**
- The proxy-variable problem and the standardization-of-bias argument reflect the
  published algorithmic-fairness research consensus.
- The assist/decide line, the traveling test, the review-theater argument, and the
  four properties of a line that holds are original to this course.
