# AI 301 · EX & Internal Comms · Module 7 — Listening at full fidelity

**Course:** AI 301 · The Specialist — Employee Experience / Internal Comms track · Module 7 of 10
**Estimated time:** 30 min content · 10 min exercise · 25 min applied activity
**Prerequisite:** Module 2 (Sense and Interpret) · builds on 101 M4 (tiers) and 201 M6 (people data in production)
**Position in the track:** the heaviest module, and the largest genuine unlock in the course

> `Concepts reviewed: [DATE] · Examples current as of: [DATE]`
> Lessons 3 and 4 are **[V]** volatile layer and move faster than anything else in this track.
> Lessons 1 and 2 are stable.

---

## ⚖️ Counsel review required

**This module is the counsel gate for this track.** Lessons 3 and 4 describe an absolute
prohibition, a definitional limit on that prohibition, four separate legal regimes, and an
enforcement posture that reversed within the last eighteen months. Every one of those is capable of
moving between review cycles, and two of them apply differently depending on where a single
employee happens to sit.

**Before this module ships in any deployment**, Lessons 3 and 4 need a read by counsel qualified in
that deployment's jurisdictions. **Before you field anything you design here**, your own programme
needs the same — and in the EU, works council consultation is frequently a precondition rather than
a courtesy.

Nothing in this module is legal advice. What it is for is making sure that when you talk to counsel
you arrive with a specific, answerable question rather than "are we allowed to do sentiment
analysis?" — which gets you a shrug, and deserves one.

## Calibration prompt — before you start

*One claim. Commit before you read anything.*

Here is a factual assertion about your own organization:

> **"The promise we made when we last fielded an employee survey would survive an audit of what we
> actually did with the responses."**

**True of us, or not true of us?** Commit to one, in a sentence. The promise is whatever the
introduction, the privacy note, or the platform's default text actually said — not what you
intended.

Then predict one number: **how many distinct sources of unread employee signal does your
organization already hold?** Not surveys — things nobody has ever analyzed. Intranet search logs,
help-desk tickets, all-hands Q&A submissions, Slack help channels, exit interview text, unanswered
questions. You'll inventory them in the activity.

---

## Module brief

This is the module with the largest upside in the track, and the largest way to destroy the thing
the rest of the track is protecting. Both halves are the same capability.

Your function has always been sitting on the highest-fidelity record in the organization of what
employees actually do not understand. Not what they say in a survey when asked a question you wrote
— what they typed into a search box at 11pm because they genuinely needed to know something and
couldn't find it. Every organization holds this. Almost none reads it, because reading four hundred
thousand unstructured strings was not a thing a communications team could do.

It is now. That is the unlock, and it is real.

The same capability, pointed slightly differently, reads what employees said to each other. And the
distance between those two things is smaller than it feels from inside a product demonstration:
both are "analyze unstructured employee text at scale." One tells you the enrollment page is
unfindable. The other tells you which team is unhappy, which sounds adjacent and is a different
activity with a different legal surface and a different effect on trust.

This module is about doing the first at full volume and knowing exactly where it becomes the second.

## Learning objectives

By the end of this module you should be able to:

1. Inventory the unread signal your organization already holds, and rank it by fidelity.
2. Name the interpretation trap and the re-identification problem, and say how each differs from
   the small-sample problem you already know.
3. State what the EU AI Act's workplace emotion-recognition prohibition actually covers — and what
   it does not.
4. Name the four regimes that govern employee listening where that prohibition doesn't reach, and
   explain why designing against enforcement posture is a mistake.
5. Write a listening charter that binds what you may do to what you promised.

## Lesson 1 · The unread signal

Start with the inventory, because most people underestimate what they already have.

**Intranet and search logs.** Every query, including the ones that returned nothing. Zero-result
searches are the single highest-value dataset in this list: each one is a person who needed
something specific enough to type it and did not get it. No survey produces information that clean.

**Help-desk and HR service tickets.** What people asked, in their words, with a timestamp and a
resolution. Volume spikes after a communication are a direct measure of whether it worked.

**All-hands Q&A submissions**, especially the unanswered ones and the ones asked repeatedly across
quarters. A question asked three quarters running is not a question; it is a finding.

**Slack or Teams help channels** — the public ones people use to ask "where do I find," which are
functionally a help desk nobody instrumented.

**Open text you already collected.** Exit interviews, onboarding surveys, pulse comments. Usually
read once, summarized into a slide, and never touched again.

Two properties make this material different from a survey, and both matter.

**It is unprompted.** A survey measures response to your question. This measures what someone
needed, unbidden, which means it is not shaped by what you already thought to ask — and the things
you didn't think to ask are precisely the gaps a communications function is blind to.

**It is behavioural.** Somebody did something. Search is a costly signal in the technical sense:
typing a query takes effort and is only worth it if you actually need the answer.

The practical starting point is the cheapest one: **zero-result searches, ranked by frequency, for
the last quarter.** In most organizations this is a report somebody in IT can produce in an
afternoon, and in the broadcast-desk shape from Module 4 it is already sitting inside the platform
you pay for. It is not a purchase. It is a request.

> ### Try this — 3 minutes
> Write down the three things you are most confident your workforce understands about a recent
> change. Now write down what you would search for if you did *not* understand each one. Those are
> the three queries to check first, and the check either confirms your confidence or is the most
> useful thing you'll learn this month.

## Lesson 2 · The interpretation trap, and the other small-numbers problem

Two failure modes, and neither is the one you already know from 101.

**The interpretation trap.** Give a model four hundred tickets and ask for themes, and you will get
themes. Five of them, cleanly named, plausibly distributed, with representative quotes. You will get
that output whether or not five themes exist, whether the underlying distribution is one dominant
issue and noise, or four hundred unrelated individual problems.

The model is not lying. Thematic synthesis is a task with no natural failure signal — there is no
equivalent of a hallucinated citation you can check. The output looks identical whether the
structure is real or imposed.

Three defences, and they are cheap:

**Ask for the distribution, not the themes.** How many of the four hundred fall into each? A theme
covering eleven items out of four hundred is a footnote presented as a finding.

**Ask what doesn't fit.** A model asked for themes will assign everything. A model asked "what
didn't fit any theme, and how much of it is there?" reports the residual — and a large residual is
the most informative single number in the analysis.

**Run it twice, separately, and compare.** Genuinely structured data themes consistently. Imposed
structure moves. This costs one extra run and catches most of it.

**And re-identification, which is not the small-sample problem.** You have met small-N before: a
population too small to support the inference, where the fix is a confidence interval or a refusal
to conclude. This is different in kind.

Here, the analysis may be perfectly sound and the problem is that **the output identifies people
against a promise you made.** "Three respondents from a team of five raised concerns about their
manager" is not a statistical error — it may be entirely accurate. It is a disclosure. The manager
reading it knows who the two silent ones probably are. And the promise made at fielding time said
this wouldn't happen.

The fix is not a confidence interval. It is a **reporting floor** — a minimum cell size below which
results are not reported at all, decided in advance, applied without exception, and stated in the
promise itself. Set before you see the data, because a floor you can waive when the finding is
interesting is not a floor.

Free text makes this much harder than counts, and it's worth saying plainly: **a verbatim can
identify someone even in a large group.** A comment referencing a specific project, a specific
meeting, or a distinctive turn of phrase is identifying regardless of how many people were in the
sample. Which means a reporting floor on counts is necessary and not sufficient, and verbatims need
their own rule.

## Lesson 3 · The prohibition, read properly **[V]**

Now the law, starting with the thing everyone has half-heard.

**The EU AI Act prohibits AI systems that infer emotions in the workplace.** Article 5(1)(f). In
force since **2 February 2025**. It is an outright prohibition, not a risk to manage — with narrow
exceptions for medical or safety purposes. Prohibited practices carry the Act's heaviest penalties.

Most people in this profession have heard some version of that and concluded that sentiment analysis
of employee messages is illegal in Europe. **That conclusion is very probably wrong, and the reason
is worth understanding properly, because the reasoning transfers.**

The text of the prohibition does not itself say "biometric." But the European Commission's guidance
ties the prohibition to the Act's defined term — an *emotion recognition system* is defined as an
AI system for identifying or inferring emotions or intentions of natural persons **on the basis of
their biometric data**. Biometric data means data resulting from technical processing of physical,
physiological or behavioural characteristics: faces, voices, gait, physiological signals.

So the line falls in a place most summaries miss:

- **A camera inferring engagement from faces in a town hall.** Squarely prohibited.
- **Voice-stress analysis on recorded calls.** Squarely prohibited.
- **Sentiment scoring of Slack messages or survey verbatims.** Text is not biometric data. Very
  probably outside the prohibition — and genuinely unsettled at the edges, particularly where the
  inference drives decisions about individuals.

Three things follow, and the third is the one to carry.

**First, the thing everyone assumes is banned mostly isn't** — which means "we can't, it's illegal
in the EU" is not available to you as a reason, and if you have been using it, you have been winning
an argument on a premise that won't survive the first person who checks.

**Second, the thing nobody worries about is squarely prohibited.** Emotion analytics bundled into a
video platform, a webcam-based engagement product, a voice tool in a contact centre — these arrive
as features, get switched on by someone who never framed it as emotion recognition, and are exactly
what Article 5(1)(f) is aimed at.

**Third, and this is the transferable part: *not prohibited* is not *cleared*.** Text sentiment
analysis escaping this prohibition tells you nothing about whether it is lawful under data
protection law, whether it requires works council consultation, whether your monitoring notice
covers it, or whether it is a good idea. It clears exactly one gate of at least four.

## Lesson 4 · What actually governs it **[V]**

Four regimes, and none of them is the one from Lesson 3.

**Data protection, in the EU and increasingly elsewhere.** Employee data is processed under a legal
basis, and in the employment context consent is generally a weak basis because the power imbalance
undermines its freeness. Profiling employees from their communications is high-risk processing that
typically demands a documented assessment before it starts. This is usually the binding constraint,
and it is the one that gets skipped because it doesn't have a headline attached.

**Works councils and co-determination.** In Germany, the Netherlands, France and elsewhere,
introducing a system capable of monitoring employee behaviour or performance is frequently subject
to consultation or co-determination rights. Practically: **the works council can stop this, and
"we already built it" is the worst possible position to consult from.** If your organization has
one, they are a stakeholder before the pilot, not after it.

**US federal and state monitoring law.** Under the ECPA, employer monitoring generally proceeds on
consent, typically established through handbook acknowledgment. Layered on top are state notice
regimes — and note what they require:

- **New York** (effective May 2022): private employers monitoring telephone, email or internet usage
  must give written or electronic notice on hire, obtain acknowledgment, and post it conspicuously.
  Attorney-General enforced, with escalating penalties of $500, $1,000, and $3,000 per violation.
- **Connecticut** (Gen. Stat. § 31-48d): written notice covering all forms of electronic monitoring,
  a conspicuously posted notice describing the methods, and employee acknowledgment. Penalties from
  $500 to $3,000.
- **Delaware**: either a daily electronic reminder when employees log on to monitored systems, or a
  single written notice with acknowledgment. $100 per violation.

**These are notice regimes, not consent regimes.** They do not prohibit monitoring; they require you
to have said you were doing it. Which turns the practical question into a specific and checkable
one: **does the notice your employees actually acknowledged cover what you are proposing to build?**
A notice from 2019 saying "telephone, email and internet usage may be monitored" is not obviously a
notice that you will run sentiment inference across internal chat. That is a question for counsel,
and it is answerable — unlike "are we allowed to do this?"

**And the National Labor Relations Act, where the instructive thing is what changed.** Section 7
protects employees engaging in concerted activity, and surveillance that would tend to interfere
with it has long been unlawful under settled Board law. In October 2022 the NLRB General Counsel
issued a memorandum, **GC 23-02**, signalling aggressive enforcement against intrusive electronic
monitoring and algorithmic management. Anyone designing a listening programme in 2023 or 2024 treated
it as the governing constraint.

**GC 23-02 was rescinded on 14 February 2025**, in GC 25-05, among 29 rescinded memoranda.

Read what did and didn't happen there. **The statute did not change. Section 7 says exactly what it
said. The Board's decisional law is where it was.** What changed was the enforcement appetite of one
office, which is a thing that changes with administrations, in both directions.

> **A compliance programme designed against an enforcement posture breaks when the posture flips.
> Design against the underlying duty instead.**

That principle is the most valuable thing in this module, and it outlives every specific in it. A
team that built its listening rules in 2023 around a General Counsel memo now has rules with no
foundation. A team that built them around "don't build systems that would tend to chill protected
concerted activity" has rules that are exactly as valid as they were, and will still be valid when
the posture flips back.

### The rule that survives all four

You will not resolve four regimes, in every jurisdiction you operate in, from a module. What you can
carry is the rule that binds regardless:

> **The promise you made when you fielded it governs what you may do with the answers — whatever the
> tool is now capable of.**

Capability arriving after the promise does not amend the promise. If the survey said responses are
anonymous and reported only in aggregate, then a model that could now identify patterns by team does
not get to, and the fact that it is technically trivial is not an argument. This is not a legal
standard. It is the one that keeps the instrument working, because a listening programme people stop
trusting stops producing signal, at which point you have destroyed the asset to get one quarter's
insight out of it.

## Key takeaways

- **The unread signal is already yours** — zero-result searches, help-desk tickets, repeated
  all-hands questions, help channels, and open text collected once and never re-read. Unprompted and
  behavioural, which is what makes it better than a survey. Start with zero-result searches; it's a
  request, not a purchase.
- **The interpretation trap:** thematic synthesis has no natural failure signal. Ask for the
  distribution, ask what didn't fit and how much, and run it twice to see whether the structure
  holds.
- **Re-identification is not the small-sample problem.** The analysis can be sound and still
  disclose. The fix is a **reporting floor** set before you see the data — and because a verbatim
  can identify someone in any size group, verbatims need their own rule on top.
- **Article 5(1)(f) is narrower than it reads** `[V]`. In force since 2 February 2025 and absolute,
  but tied by Commission guidance to inference from **biometric data** — so faces in a town hall and
  voice-stress analysis are squarely prohibited, while text sentiment very probably isn't. The thing
  everyone assumes is banned mostly isn't; the thing nobody worries about squarely is.
- **Not prohibited is not cleared.** Escaping Article 5 clears one gate of at least four.
- **Four regimes actually govern it** `[V]`: data protection (usually the binding one, and the one
  that gets skipped); works councils, who can stop this and should be consulted before the pilot;
  US notice regimes in New York, Connecticut and Delaware — **notice, not consent**, so the question
  is whether the notice your employees acknowledged covers what you're building; and NLRA §7.
- **GC 23-02 was rescinded in February 2025** `[V]`. The statute didn't move; the enforcement
  appetite did. **Design against the duty, not the posture** — that principle outlives every
  specific in this module.
- **The promise you made when you fielded it governs what you may do with the answers.** Capability
  arriving later does not amend it.

## Take a position

**The claim:** *"'The tool could do it' and 'we told them we wouldn't' are both true. Only one of
them is a decision."*

The strongest counter-argument is that **this treats the promise as sacred when the promise was
mostly boilerplate nobody read, and in doing so protects the organization's comfort rather than the
employee's interest.** Most survey anonymity language was written by a vendor, pasted by an
administrator, and skimmed by nobody. Treating it as a binding constraint means a real signal —
a team in genuine distress, a manager causing harm — goes unexamined because of a sentence nobody
authored and nobody relied on. On that reading, the ethical move is sometimes to look, and the
honest response is to *change the promise going forward* rather than let a dead sentence prevent
you from acting on something that matters.

There is a sharper version. **The promise-based rule systematically protects the powerful.** The
patterns most likely to be suppressed by a reporting floor are the ones concentrated in small teams
— which is exactly where a bad manager's effects show up, and exactly the population least able to
escalate through normal channels. A floor set at five may be protecting the manager rather than the
five.

Take a position on that, in writing, in the activity. The strongest submissions say what they would
actually do with a small-team signal that suggests harm — because "the floor forbids it" is a
policy, not an answer, and every listening programme eventually meets this case.

## Applied activity — "The unread signal inventory and charter"

**Time:** 25 minutes · **Submit:** the inventory, the pilot, and the charter, plus a 250–350 word
write-up · **Graded against the rubric below.** Score doesn't matter. Doing the work is where the
learning lands.

**Step 1 — Inventory (8 min).** Every source of unread employee signal your organization already
holds. For each: what it is, who owns the system, whether you could get it this quarter, and how
high-fidelity it is. Include the ones you can't get, and say why not — a source blocked by another
function is a finding, and it names the conversation to have.

**Step 2 — One pilot, 30 days (5 min).** Pick one source. What single question will it answer, what
you'll do with the answer, and who sees it. **One question, not a capability.** "Understand employee
sentiment" is not a question; "which three things did people search for and not find after the
benefits announcement" is.

**Step 3 — The charter (10 min).** For that pilot: what is collected; what was promised to the
people it came from, quoted exactly if a promise exists; who can see it at what grain; the reporting
floor and the separate rule for verbatims; what is prohibited outright; and **which of the four
regimes from Lesson 4 you have not checked.** Naming what you haven't checked is worth more than
asserting compliance you can't demonstrate.

**Step 4 — Settle the opening claim (2 min).** You committed on whether your last survey's promise
would survive an audit of what you actually did. Go and read the promise. What did it say, and what
did you do?

Then the write-up: your inventory count against your prediction, with direction and size of the miss;
your position on the claim above with the counter-argument addressed — **including what you would
actually do with a small-team signal that suggests harm**; and the one source you have access to
today and have never read.

## Knowledge check — 8 questions

*Unlocks after the applied activity is submitted. Retakes are free and unlimited.*

**Q1.** What makes zero-result search logs higher-fidelity than a survey?

- A. They have a larger sample size
- B. They are unprompted and behavioural — someone needed something enough to type it, and it isn't shaped by a question you thought to ask ✓
- C. They are easier to analyze with AI
- D. They are anonymous by default

> **B.** A survey measures response to your question, so it is blind wherever your assumptions are. Search measures what someone needed unbidden, and typing a query is a costly signal — only worth it if you actually need the answer.

**Q2.** Why is thematic synthesis particularly prone to false confidence?

- A. Models are trained mostly on formal writing
- B. Because there is no natural failure signal — no equivalent of a checkable fabricated citation — so the output looks identical whether the structure is real or imposed ✓
- C. Because themes are inherently subjective
- D. Because ticket data is usually incomplete

> **B.** Ask for four hundred tickets to be themed and you'll get themes, whether or not themes exist. The three cheap defences: ask for the distribution, ask what didn't fit and how much, and run it twice to see whether the structure holds.

**Q3.** How does re-identification differ from the small-sample problem?

- A. It only applies to qualitative data
- B. It affects large organizations rather than small ones
- C. The analysis can be perfectly sound — the problem is that the output identifies people against a promise you made, so the fix is a reporting floor rather than a confidence interval ✓
- D. It is a statistical error rather than a disclosure

> **C.** "Three of five raised concerns about their manager" may be entirely accurate. It is also a disclosure, and the manager reading it knows who the silent two probably are.

**Q4.** What does the EU AI Act's workplace emotion-recognition prohibition actually cover `[V]`?

- A. Any AI system that infers employee sentiment, including from text
- B. Inference from biometric data — so a camera reading faces in a town hall is prohibited, while text sentiment analysis very probably falls outside it ✓
- C. Only systems used in performance management decisions
- D. Nothing yet; the obligations begin in 2027

> **B.** The prohibition's text doesn't say "biometric," but Commission guidance ties it to the Act's defined term, which is limited to inference from biometric data. In force since 2 February 2025 and absolute, with narrow medical and safety exceptions.

**Q5.** What is the practical consequence of "not prohibited is not cleared"?

- A. That legal review is unnecessary where no prohibition applies
- B. That escaping Article 5 clears one gate of at least four — data protection, works councils, monitoring notice, and §7 all still apply ✓
- C. That organizations should apply the strictest jurisdiction's rules everywhere
- D. That prohibitions are less important than guidance

> **B.** And it cuts the other way too: "we can't, it's illegal in the EU" is not available as a reason for text analysis, so anyone who has been using it has been winning an argument on a premise that won't survive the first person who checks.

**Q6.** New York, Connecticut and Delaware require what, precisely `[V]`?

- A. Employee consent before any electronic monitoring
- B. Notice — written or electronic, with acknowledgment and in some cases conspicuous posting. They do not prohibit monitoring; they require you to have said you were doing it ✓
- C. Annual reporting of monitoring activity to the state
- D. A documented impact assessment before monitoring begins

> **B.** Which turns the question into a specific, answerable one: does the notice your employees actually acknowledged cover what you're proposing to build? A 2019 notice about telephone, email and internet usage is not obviously notice of sentiment inference across internal chat.

**Q7.** GC 23-02 on electronic surveillance was rescinded in February 2025 `[V]`. What should a listening programme conclude?

- A. That electronic monitoring is now permitted under the NLRA
- B. That §7 no longer applies to algorithmic management
- C. That the statute and the Board's decisional law are unchanged — only the enforcement appetite of one office moved, and a programme designed against posture breaks when posture flips ✓
- D. That the rescission will likely be reversed, so the memo should still be followed

> **C.** A team that built its rules around the memo now has rules with no foundation. A team that built them around "don't build systems that would tend to chill protected concerted activity" has rules exactly as valid as before — and still valid when the posture flips back.

**Q8.** What is the strongest argument *against* the promise-based rule?

- A. That employees do not read privacy notices, so the promise has no effect
- B. That it systematically protects the powerful — the patterns suppressed by a reporting floor are concentrated in small teams, which is exactly where a bad manager's effects show up, among the people least able to escalate ✓
- C. That anonymity cannot be guaranteed in any dataset
- D. That competitors who analyze freely will gain an advantage

> **B.** A floor set at five may be protecting the manager rather than the five. That is why the activity asks what you'd actually do with a small-team signal suggesting harm — "the floor forbids it" is a policy, not an answer, and every listening programme eventually meets this case.

## Sources and attribution

- **EU AI Act, Article 5(1)(f)** — the workplace emotion-recognition prohibition, in force 2
  February 2025, absolute save for medical and safety purposes; and the European Commission's
  guidance linking it to the Act's definition of an emotion recognition system, which is limited to
  inference from biometric data. **Counsel review required — see the gate at the top.** **[V]**
- **NLRB General Counsel Memorandum GC 23-02** (October 2022) on electronic surveillance and
  algorithmic management, **rescinded 14 February 2025** in GC 25-05, among 29 rescinded memoranda. Cited for the
  posture-versus-duty lesson rather than as guidance. **[V]**
- **US state electronic-monitoring notice regimes** — New York (notice on hire, acknowledgment,
  conspicuous posting; AG-enforced at $500 / $1,000 / $3,000), Connecticut (Gen. Stat. § 31-48d;
  $500–$3,000), Delaware (daily logon reminder or single acknowledged notice; $100 per violation).
  Notice regimes, not consent regimes. **[V]**
- **ECPA**, and EU data protection and works council consultation duties — described in outline
  only, deliberately, because the specifics vary by member state and by employer. **[V]**
- The unread-signal inventory, the three defences against the interpretation trap, the
  reporting-floor-versus-confidence-interval distinction, the design-against-duty-not-posture
  principle, and the promise rule are original to this course.
- Structure and topic coverage follow the AI Fluency Framework (Dakan & Feller, in collaboration
  with Anthropic, CC BY-NC-SA 4.0); prose is original.
