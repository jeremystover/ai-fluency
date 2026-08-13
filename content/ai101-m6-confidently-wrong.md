# AI 101 · Module 6 — When it's confidently wrong

**Course:** AI 101 · The Foundation · Module 6 of 8
**Estimated time:** 30 min content · 10 min exercise · 20–25 min applied activity
**Prerequisite:** M1 — this module follows M1's mechanism to its sharpest consequence
**Builds on:** M1 (confidence and correctness are decoupled) · M4 (supplied material is checkable material)
**Feeds:** M7 (the lines that don't move) · 201 M4 (verification by design)

> `Concepts reviewed: [DATE] · Examples current as of: [DATE]`
> Model behaviors and mitigation features (citations, browsing, grounding) are **[V]**
> volatile layer — they improve steadily and unevenly. The verification habits are stable
> precisely because they don't depend on the model behaving well.

---

## Calibration prompt — before you start

*One prediction, thirty seconds. You'll score it during the applied activity.*

At the end of this module you'll deliberately fish for a hallucination in your own domain,
asking about things you know cold, until the model produces something confident, plausible,
and wrong enough that you can prove it.

**How many attempts do you predict it takes?** Count each distinct question as one attempt.
Write the number down.

The miss is diagnostic in both directions. Way fewer attempts than predicted: you've been
over-trusting fluent output. Way more: the frontier has moved since you formed your
expectations **[V]** — which is its own lesson about keeping your model of the model current.

---

## Module brief

Everything in this module follows from one sentence in M1: *the model produces confident
output the same way whether the content is right or invented.* M1 gave you the mechanism.
This module is about living with its sharpest consequence, because somewhere between
"drafting a JD" and "citing a regulation in a termination memo," fluent-but-wrong stops
being an annoyance and becomes a professional incident with your name on it.

Start with why this is *hard*, not just important. Every credibility instinct you own was
trained on humans, and in humans, fluency is *evidence*. A person who answers precisely,
in confident prose, with specific citations, is usually a person who knows. Your whole
career has rewarded that inference. The model breaks it: fluency is how it generates
*everything*, so fluency carries zero information about accuracy. The most dangerous outputs
are the best-written ones (precise, specific, well-structured) because they're the ones
your instincts wave through. **More polish should trigger more scrutiny, not less.** That
inversion doesn't come naturally to anyone; this module is about installing it as a habit
rather than a slogan.

The good news: hallucination isn't random. It has a shape (four recurring failure types,
each with a tell you can learn) and it concentrates exactly where M1's mechanism predicts:
specifics the model was never given, gaps where your organization's knowledge should be,
and facts past the training cutoff. Verification, likewise, isn't "check everything" — that
kills the time savings and nobody sustains it. It's a small set of habits, sized to stakes,
that catch the failures where they cluster.

One reframe before we start: in People work, *you are usually the verification layer for
other people's AI use, not just your own.* Your hiring managers, your employees, your
vendors are all shipping fluent AI output at you. The habits in this module are what make
you the person who catches it, which, as M8 will argue, is quietly becoming part of the
job description.

## Learning objectives

By the end of this module you should be able to:

1. Explain why fluent output deserves *more* scrutiny, not less: the inversion of a
   career-long credibility instinct, grounded in M1's mechanism.
2. Recognize the four failure types (fabricated specifics, plausible-but-wrong reasoning,
   confident gaps, stale facts) and the tell for each.
3. Run verification sized to stakes: the two-minute habits for routine work, the deeper
   passes for output that leaves your hands.
4. Name the high-risk surface in People work (the outputs where a single fabrication is an
   incident) and treat everything on it as guilty until verified.
5. Produce, catch, and document a hallucination in your own domain — the applied activity,
   and the fastest way to make all of this visceral.

## Lesson 1 · Why confidence and correctness came apart

M1's mechanism, followed one step further than we took it there.

The model generates each fragment by asking: given everything so far, what plausibly comes
next? When the training data holds the answer thickly (the shape of a JD, the register of
a policy summary) plausible and true point the same direction, and output is reliable.
When the data runs thin (a specific statute number, your company's actual carryover rule, a
study on four-day weeks in manufacturing) the machinery doesn't stop, slow down, or flag
anything. It keeps producing the most plausible next fragment. And here's the step that
matters: **plausible text has the *form* of knowledge (specificity, structure, confidence)
because that's what answers look like in the training data.** A citation that doesn't exist
comes out formatted exactly like one that does: "29 CFR § 825.303" has the right shape
whether or not there's anything behind it. The model isn't lying, lying requires knowing
better. It's completing a pattern, and the pattern includes what certainty looks like.

This is why the human credibility heuristic fails so specifically. With people, producing
precise, confident, well-cited prose *costs something*. You generally have to know the
material to fake the form, so form is honest evidence of substance. With the model, the
form costs nothing. It's the native output format of the machinery, right or wrong. Fluency
still feels like evidence — that feeling took a career to build and won't dissolve because
a course told it to. The realistic goal is a trained flinch: *the more a passage leans on
specifics I didn't supply (numbers, names, citations, dates) the more it needs checking
before it travels.*

One more consequence, because it sharpens everything: asking the model "are you sure?"
re-runs the same machinery. Sometimes it catches itself **[V]**; often it apologizes and
produces a new, equally confident wrongness, or (worse) capitulates on something that was
*right*, because deference is also a plausible pattern. Self-confirmation is not
verification. Verification means checking against something that *isn't* the model: a
source document, a system of record, your own expertise. (M4 already handed you the best
version of this: material you supplied is material you can check against.)

> ### Try this — 2 minutes
> Recall the last AI output that impressed you. Ask of it: which specifics did I supply,
> and which did the model produce on its own? Underline the second set mentally: numbers,
> names, citations, dates. That underlined set is where this module lives.

## Lesson 2 · The failure taxonomy

Four types cover nearly everything you'll meet. Learn the tell for each; they fail
differently, and knowing *which* failure you're looking at tells you how to check for it.

**Type 1 · Fabricated specifics.** Invented citations, statutes, statistics, quotes, case
names, URLs: the classic. *The tell: precision you didn't supply.* An exact percentage, a
named study, a section number, appearing in response to a question whose answer the model
was never given. The flinch rule: **a specific that didn't come from your material came
from the pattern** — treat it as decoration until a source confirms it. This type
concentrates wherever answers *conventionally contain* citations (legal, medical,
research-flavored questions) because the form demands specifics and the machinery obliges.

**Type 2 · Plausible-but-wrong reasoning.** The facts are fine; the logic connecting them
quietly isn't. A benefits comparison that mishandles a threshold, an adverse-impact
calculation that compares the wrong groups, a policy inference that generalizes from the
wrong clause. *The tell: smooth transitions carrying steps that carry the conclusion* — "therefore,"
"which means," "as a result" gliding past the exact point where you'd slow down. These
survive spot-checks aimed at facts, because every individual fact checks out; you catch
them by re-deriving the *conclusion*, which is why high-stakes reasoning needs a human
re-walk (Lesson 3's deepest pass).

**Type 3 · Confident gaps.** M1's signature failure: asked about *your* organization
without material, the model answers anyway, from the average. Your PTO policy, your
escalation path, why your Denver office's attrition spiked. *The tell: the output is
generic where it should be specific*. It describes a company, not your company. This is
the most catchable type (M4 killed most of it: supply the material or expect invention),
and the most dangerous residue lands on *other people*, the employee who asks the
benefits copilot a question the underlying docs don't cover, and gets a confident answer
assembled from the average of everyone else's benefits.

**Type 4 · Stale facts. [V]** Right at training time, wrong now: the regulation amended
last spring, the tool feature that shipped or died, the salary benchmark from two years
ago. *The tell: time-sensitivity itself.* Anything that moves (law, prices, products,
people in roles) carries an implicit "as of when?" that the output won't volunteer.
Some tools now browse or ground answers in live sources **[V]**, which converts this type
into "check the cited source" (Type 1's remedy) rather than eliminating it: retrieval can
still fetch a stale or wrong page, fluently.

The types compound (a stale regulation, precisely cited, inside smooth reasoning, is
Types 4+1+2 in one paragraph) but the tells stack the same way: specifics you didn't
supply, transitions carrying weight, generic-where-specific, and anything with a clock on
it. That's the whole checklist, and it fits on a sticky note.

## Lesson 3 · Verification that fits a real week

"Check everything" is not a verification strategy; it's a resolution that dies by
Wednesday. Real verification is *sized to stakes* — a budget, exactly like M3's window
budget, spent where the failure types cluster. Three levels:

**Level 1, the two-minute scan (everything).** For any output you'll use at all: underline
the specifics you didn't supply (Type 1), circle anything time-sensitive (Type 4), and ask
whether anything is generic where it should be specific (Type 3). Not checking yet, just
*seeing*. The scan costs two minutes and converts unknown risk into a visible list of
claims-to-check. Most routine output (a reworded email, a first-draft JD) has nothing on
the list, and the scan *is* the verification. Done.

**Level 2 — follow the claims (anything that informs a decision or leaves your desk).**
Every underlined specific gets traced to something that isn't the model: the statute looked
up, the statistic found in a real source, the policy claim checked against the actual
policy (which M4 taught you to have attached in the first place, supplied material makes
this step fast). The discipline: **a claim you can't trace gets cut or flagged, never
shipped on vibes.** Cutting is usually free, the memo survives without the impressive
statistic; it does not survive the statistic being fake.

**Level 3 — adversarial reading (high stakes: it decides something, it's about people, or it
ships under your name).** Two moves. Re-derive the reasoning yourself, walk every
"therefore" and check it holds, because Type 2 hides in exactly the steps you'd otherwise
glide past. And run the two-minute red team: ask the model itself, in a fresh conversation
**[V]**, "argue that this analysis is wrong, what would its critics say?" This isn't
self-confirmation (Lesson 1's trap) — you're not asking it to certify truth, you're using
its fluency to *generate attack surface* your own review might miss. The critique is raw
material for your judgment, not a verdict.

Who verifies matters as much as how: **the checker needs to be someone who could catch the
error**, which for organizational specifics means you or a colleague who knows, not a
second model *(a second model can widen Level 3's attack surface, but agreement between two
models is still not evidence. They share training-data instincts, and plausible-but-wrong
is exactly what they agree on)*. And write the check down where it matters: "verified
against [source], [date]" on anything Level 2+ costs one line and changes the conversation
M8 cares about — from "the AI said" to "I checked."

> ### Try this — 3 minutes
> Take one recent AI output you actually used. Run the Level 1 scan on it now, after the
> fact: underline, circle, generic-check. If the list is empty, notice how fast that was.
> If it isn't. You know what tonight's Level 2 looks like.

## Lesson 4 · The high-risk surface in People work

Some outputs deserve standing suspicion, not because the model fails there more often,
but because the *cost per failure* is a different species. Four zones make up the surface,
and everything on it starts at Level 2 minimum, no exceptions for being busy:

**Legal and policy citations. [V]** Statutes, regulations, compliance claims, "employment
law requires…" — Type 1's favorite habitat, because legal answers conventionally bristle
with specifics. A fabricated "29 CFR § 825.303" in a termination memo isn't an error;
it's an exhibit. The rule: every legal specific traced to the actual source or cut, and
the *reasoning* about what the law means for your case goes to counsel, not to Level 3.
The model can help you *prepare the question for counsel*; it doesn't get to be counsel.

**Numbers that will be re-said.** Anything quantitative headed for a board deck, an
all-hands, a budget doc. Numbers have a property prose doesn't: **they get repeated
without their caveats.** Your careful "roughly 12%, per the model's summary" becomes
"12%" in the CFO's mouth by Thursday. Any number that will outlive its context gets
traced to a real source, or presented as illustrative, loudly.

**Anything about a named individual.** A fabrication inside an ER summary, a performance
narrative, a reference check isn't a quality miss — it's a false statement about a person,
in a document with consequences, bearing your name. This zone overlaps M4 (what may enter
the tool) and M7 (what the tool may influence); M6's contribution is blunt: *every factual
claim about a person gets verified against the record by a human, every time.* There is no
routine tier here.

**Answers other people take directly.** The copilot in the HRIS, the benefits bot, the
FAQ draft you published, output consumed without a professional in the loop. Your
verification here is *structural*, not per-answer: what material grounds these answers
(M4), what happens when the material doesn't cover the question, who audits samples, and
where does the disclaimer actually point? (This is 201 M6's territory in miniature; for
now, know the zone exists and that "the vendor handles that" is a claim, not an answer.)

The surface is small (four zones) and that's the point. Guard it without apology, spend
Level 1 everywhere else, and you get the time savings *and* keep your name clean. The
applied activity now makes all of this visceral: you're going to manufacture a Type 1 in
your own domain, on purpose, and watch how good it looks.

## Key takeaways

- **Fluency carries zero information about accuracy.** The model produces confident,
  well-formed output the same way whether it's right or invented, so polish should
  trigger scrutiny, not lower it. That's an inversion of a career-trained instinct, and
  it installs as a flinch: *specifics I didn't supply need checking before they travel.*
- **Four failure types, four tells:** fabricated specifics (precision you didn't supply),
  plausible-but-wrong reasoning (smooth transitions carrying load), confident gaps
  (generic where it should be specific), stale facts (anything with a clock on it).
- **"Are you sure?" is not verification.** Checking means something that isn't the model:
  a source, a system of record, your own expertise. Supplied material (M4) is what makes
  checking fast. Two models agreeing is still not evidence.
- **Size verification to stakes:** the two-minute scan on everything, claim-tracing on
  whatever informs decisions or leaves your desk, adversarial re-derivation on the
  structural. A claim you can't trace gets cut, not shipped.
- **The high-risk surface gets no routine tier:** legal citations, numbers that will be
  re-said, claims about named individuals, and answers other people consume directly.
  Level 2 minimum, human eyes always, "verified against [source]" written down.
- **You are the verification layer** — for your own use and, increasingly, everyone
  else's. That's not overhead on the job; it's becoming the job.

## Applied activity — "Catch It Lying"

**Time:** 20–25 minutes · **Submit:** the transcript excerpts, your documentation, and a
250–350 word reflection · **Graded against the rubric below.** Score doesn't matter.
Doing the work is where the learning lands.

You're going to make the model produce something confidently wrong in the domain you know
best, and prove it. Nothing builds the flinch like watching a fabrication assemble itself
in front of you, wearing your profession's vocabulary.

**Step 1. Pick your ground (2 min).** A People-work area where you're genuinely expert:
the leave policy you administer, the ER process you own, the comp philosophy you wrote.
You must be able to *prove* wrongness against a real source — your expertise plus a
document, not just your recollection.

**Step 2. Fish (10 min).** Ask questions in that area *without supplying material*.
You're deliberately doing what M4 taught you not to. Aim where the types live: specifics
(ask for citations, numbers, named sources), your org's particulars (Type 3 territory),
time-sensitive details **[V]**. Count your attempts. If the model honestly declines or
hedges instead of inventing **[V]** — note that too; it's data, and it counts as an
attempt.

**Step 3. Catch and prove (5 min).** When you get one: capture the exact wrong claim,
state what's actually true, and name your proof (the policy section, the real statute,
the source of record). Classify it: which of the four types, and which tell should have
caught it?

**Step 4. Score the prediction (2 min).** Attempts predicted vs. actual, direction of
miss, and the honest sentence about what that says about your current trust calibration.

Then the reflection — including the deliverable that makes this transfer: **the
verification rule you'd give your team**, written as one enforceable sentence aimed at
the type you caught. Not "be careful with AI": a rule someone could actually follow and
someone else could audit. ("Every statute or regulation cited in any document leaving
this team gets traced to the primary source before it ships" is the shape.)

## Knowledge check — 8 questions

*Unlocks after the applied activity is submitted. Retakes are free and unlimited.*

**Q1.** Why does the human credibility heuristic (precise, confident, well-cited prose signals knowledge) fail specifically for model output?

- A. Models are trained to deceive users into over-trusting them
- B. For humans the form costs something (you must know the material to fake it) while for the model, confident form is the native output format, right or wrong ✓
- C. It doesn't fail, fluent model output is in fact more likely to be accurate
- D. Human writing contains verifiable citations while model output never does

> **B.** With people, form is honest evidence of substance because producing it requires
> substance. The model produces the form (specificity, structure, certainty) as pattern
> completion, identically for true and invented content. No deception is involved (A):
> lying requires knowing better.

**Q2.** "29 CFR § 825.303" appears in a leave-policy answer you asked for without supplying any material. Before anything else, this citation is best treated as:

- A. Reliable — that level of precision indicates the model found the real regulation
- B. A formatting artifact with no meaning at all
- C. A specific you didn't supply, decoration until a source that isn't the model confirms it ✓
- D. Verified, provided the model confirms it when asked "are you sure?"

> **C.** The flinch rule: precision you didn't supply is Type 1's tell, and a fabricated
> section number comes out formatted exactly like a real one: the form is identical
> either way, which is what makes A the career-trained trap. D re-runs the same machinery
> and is the module's named non-verification.

**Q3.** A benefits comparison cites accurate plan facts throughout, but its recommendation mishandles an eligibility threshold on the way to a confident conclusion. Which type is this, and why do fact-focused spot-checks miss it?

- A. Type 1 — the threshold was a fabricated specific
- B. Type 3: the model lacked organizational material
- C. Type 4: the plan facts were stale
- D. Type 2 — every individual fact checks out, so the error lives in the reasoning steps that checks aimed at facts never touch ✓

> **D.** Plausible-but-wrong reasoning survives claim-tracing precisely because the claims
> are fine; the decisive "which means…" is where it hides. The remedy is re-deriving
> the conclusion (Level 3's human re-walk) not more fact-checking.

**Q4.** An employee asks the HRIS benefits copilot about a situation the underlying documents don't cover, and gets a confident, specific answer. What has most likely happened, and why is this zone structurally risky?

- A. A confident gap (the answer assembled from the average of everyone else's benefits) consumed by someone with no professional in the loop ✓
- B. A stale fact: the copilot's documents are outdated
- C. Nothing risky, copilots only answer from their grounding documents
- D. A Type 2 failure — the reasoning was wrong but the facts were right

> **A.** Type 3's most dangerous residue: where the material runs out, the machinery keeps
> answering from the average (M1), and the person consuming it can't tell (M2's borrowed
> credibility). That's why Lesson 4 makes this zone *structural* (grounding, coverage
> gaps, sample audits) rather than per-answer. C describes the marketing, not the
> guarantee **[V]**.

**Q5.** Why is asking the model "are you sure?" not verification, and what is?

- A. It is verification, as long as you ask in the same conversation
- B. The question re-runs the same machinery, which may double down, or capitulate on something that was right; verification means checking against something that isn't the model ✓
- C. It fails only because models are programmed to always agree with users
- D. Verification requires asking at least two different models the same question

> **B.** Deference is also a plausible pattern — so the reply is more generation, not
> evidence. A source document, a system of record, or your own expertise is the standard.
> D is the subtle trap: two models share training-data instincts, and plausible-but-wrong
> is exactly where they agree.

**Q6.** Under the three-level discipline, which output is the *minimum* that requires Level 2 (tracing claims to real sources) rather than just the two-minute scan?

- A. A reworded internal email where the scan found nothing to underline
- B. Any output produced by a frontier-tier model
- C. A first-draft JD that a recruiter will heavily edit anyway
- D. A market-practice summary whose statistics will inform your comp proposal ✓

> **D.** It informs a decision, so every specific it contributed gets traced, and any
> untraceable statistic gets cut, because the proposal survives without the statistic but
> not with a fake one. A and C are Level 1's home ground; B confuses model tier with
> stakes, which the discipline prices by consequence, not capability.

**Q7.** Why do numbers get their own zone on the high-risk surface?

- A. Models are categorically worse at arithmetic than at prose
- B. Numbers get repeated without their caveats — "roughly 12%, per the summary" becomes "12%" in Thursday's board meeting ✓
- C. Numerical output is harder to read than prose output
- D. Regulators require all workplace statistics to be independently audited

> **B.** The property is social, not statistical: a number outlives its context and
> sheds its hedges as it travels. So any number that will be re-said gets traced to a
> real source, or labeled illustrative loudly enough to survive repetition.

**Q8.** In "Catch It Lying," the model responds to several of your fishing attempts by declining or hedging instead of inventing. What does the activity say this means?

- A. Your domain has no hallucination risk and needs no verification budget
- B. The activity failed and you should switch to a different model
- C. It's data — count it, note it, and let it update your calibration; the frontier moves, and your trust settings should track what the model actually does now ✓
- D. The model detected the test and behaved differently than it would in real use

> **C.** Honest declines are a real and improving behavior **[V]**, and the activity's
> calibration works in both directions: fishing that takes far *more* attempts than
> predicted means your expectations were formed on older behavior. A overgeneralizes from
> a sample; the habits stay, because the failure types remain wherever the data runs thin.

## Sources and attribution

This module draws on the following material:

- **The AI Fluency Framework** (Rick Dakan & Joseph Feller, in collaboration with
  Anthropic, CC BY-NC-SA 4.0), the treatment of critical evaluation of AI output and
  calibrated trust adapts its "Discernment" competency for the People-leader context.
- **Anthropic's published research on model behavior** — including work on why models
  produce confident errors and on training models to acknowledge uncertainty; behaviors
  improve unevenly across models and versions. **[V]**
- The four-type taxonomy, the three-level verification discipline, and the high-risk
  surface map are original to this course, developed for the People-leader context.
- Nothing in this module is legal advice; the legal-citations zone exists precisely
  because that boundary is real. *Counsel verifies legal reasoning; this module only
  keeps fabrications from reaching them.*
