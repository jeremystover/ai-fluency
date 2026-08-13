# AI 301 · The Specialist — "Defensible by Design" (draft v1, integrated)

**Supersedes** `course-301-dei-assessment.md`, which recommended against a track. That
recommendation was wrong. See §"Why the assessment reversed."

**Audience:** Anyone who owns whether the organization's people decisions can be defended —
adverse impact testing, algorithmic fairness, AEDT governance. In practice: DEI and pay-equity
leads, people analytics practitioners doing fairness work, and ER professionals who have inherited
it. **Stated prerequisite:** AI fluency at 101/201 level, plus two-plus years in a DEI, people
analytics, or ER role. The gate is part of the product — it signals depth and sets the register.
**Level transition:** L3 The Specialist → L4 The Translator.
**Shape:** 5 modules · 45–75 min each · ~4h30 · same package as the rest of the ladder. Async and
self-serve.
**Tooling stance:** Tool-agnostic. **Everything in this track is volatile layer `[V]`** — this is
the fastest-moving legal surface in the curriculum by a wide margin, and three of the five modules
turn on statutes that changed inside the last twelve months. **Counsel review required on M1, M2,
and M3 before ship**, not as a formality.

---

## The name: neither "DEI" nor "Culture and Belonging"

**Recommended: `ai301-defensible` · "Defensible by Design"** — the source brief's own subtitle,
which is the best name in either document.

**Why not "Culture and Belonging," even though it's the more forward-looking title.** The content
argues against it. There is not one lesson here about culture, belonging, ERGs, inclusion
programming, or engagement — it is AEDT inventories, four-fifths and standard-deviation analysis,
proxy detection, privilege sequencing, and vendor audit literacy. Three specific problems:

1. **It mis-routes at intake, which is the one thing `roles.ts` must get right.** Someone who took a
   Culture and Belonging job is doing ERG, engagement, and recognition work — which is the EX/comms
   track. They would pick this and get a statistics-and-statutes course.
2. **It contradicts the track's own posture.** M5 says *"restructuring is cover, relabeling isn't."*
   A course that teaches that and then wears a relabeled name has lost the argument in its own
   title.
3. **It's less forward-looking, not more.** The durable thing in this market is the technical
   capability, not the softer title. M5's whole argument is that the capability is what makes you
   structural.

**Why not "DEI" either.** The content is narrower than DEI, and there's a product problem: under
EO 14173 a federal contractor certifying it operates no "illegal DEI programs" may decline to
deploy a course with "DEI" in the title. That is a deployment blocker, not a political position.

**Name it for the capability.** "Defensible by Design" routes correctly, survives the political
weather in either direction, describes what every artifact in the chain produces, and is what a
buyer would actually search for. The intake role label should describe the *work* rather than a
title — *"Adverse impact, algorithmic fairness, and people-decision governance"* — so it catches
the three-role audience the prerequisite already names.

## Why the assessment reversed

The prior assessment argued no track on three grounds. The source brief defeats all three, and one
of my errors is worth naming because the authoring brief warns against it explicitly.

**I subtracted a topic where I should have compared designs.** My subtraction table sent "adverse
impact computation" to recruiter R6 and called it owned. But R6's version is *one lesson* teaching a
recruiter to **read** a vendor's bias audit — "so that a vendor's audit is a document you can read
rather than a document you file." M3 below teaches someone to **design and run the testing protocol
under privilege**: four-fifths *and* standard deviation analysis, proxy detection, intersectional
cuts, and the sequencing of privilege before evidence exists. That is the difference between a
consumer and a producer of the analysis. The authoring brief's own §3 says *"explorations compare
topics; outlines compare designs — and topics look far more alike than designs do."* I made exactly
that error, one step earlier in the process than the brief anticipates it.

**The shadow vendor stack is a module I missed entirely.** HRBP M6 and recruiter R6 both inventory
"AI systems touching your population." Neither teaches the harder problem: **AI features switched on
inside tools you already own, with no procurement event, that nobody knows exist.** That is real,
unowned, and the reason most inventories are wrong.

**The audience argument inverts.** I argued the DEI audience dispersed, so content should follow the
work into other tracks. The source brief's M5 makes the better read: the *capability* is scarce and
the *governance work* is growing, and whoever holds the capability should go claim the work. That
converts my objection into the track's thesis.

**And the strongest argument is one neither document had** — see M3's Connecticut material below.

## The through-line

> **Your testing program is evidence — in both directions. Two states have now written that into
> statute, and one of them enumerates the criteria you'll be judged on.**

## The spine: five artifacts that chain

Each module produces one work product, and each depends on the last. This is the most concrete
spine of any track on the ladder, and it comes from the source brief unchanged.

| Module | Artifact |
|---|---|
| M1 | One-page exposure map — jurisdictions, obligations, deadlines, one question for your GC |
| M2 | AEDT inventory — tool, decision, vendor, reviewer, and whether that reviewer can actually overrule it |
| M3 | Testing protocol memo, addressed to your GC |
| M4 | The fairness section of your RFP — one page, reusable, yours |
| M5 | 90-day plan plus a one-paragraph pitch to whoever owns AI governance in your building |

---

## M1 · The ground has moved

*~60 min · opens with the prediction gate · counsel review required*

- **Prediction gate, before any content:** write what you believe is legally required of you today.
  Held and scored in M5. (The EX/comms track's Module 1 device: commit first, reveal per module.)
- **Lesson 1:** Federal retreat, precisely `[V]`. EO 14173 and contractor certification; **EO 14281**
  directing agencies to eliminate disparate impact liability; the EEOC dropping its pending
  disparate impact cases and defunding state agencies bringing them; its **June 2026 National
  Enforcement Plan prioritizing disparate treatment**; and a **March 2026** order on contractor DEI
  activities.
- **Lesson 2:** What did *not* move, which is the lesson the rest of the track runs on `[V]`.
  **Disparate impact is codified in Title VII by the Civil Rights Act of 1991. An executive order
  cannot repeal it.** Most employment discrimination cases are brought by the private plaintiffs'
  bar, which no executive order binds, before courts that remain open — and private plaintiff
  attorneys are stepping up in Title VII disparate impact cases. **Enforcement posture is not duty.
  A compliance program built on a posture breaks when the posture flips.**
- **Lesson 3:** Your baseline is disappearing, and there's a date on it `[V]`. The EEOC sent OIRA a
  proposed rule on **14 May 2026** to rescind EEO-1, EEO-2, EEO-3, EEO-4, EEO-5 and the Title VII /
  ADA / GINA / PWFA reporting requirement. **It is proposed, not final** — current regulations still
  require filing on or before **30 September**, and employers should prepare to file. Two
  consequences worth sitting with: this may be the last cycle in which a federal baseline is
  created for you, and a baseline you stop collecting is one you cannot reconstruct later.
- **Lesson 4:** Where the states actually landed, corrected `[V]`. **California's Civil Rights
  Council regulations took effect 1 October 2025** and make bias testing — **or its absence** —
  explicitly relevant to discrimination claims, with extended recordkeeping for automated-decision
  data. **Illinois HB 3773 took effect 1 January 2026**: notice on AI use in employment decisions,
  and an explicit prohibition on **zip code as a proxy** for protected class. **Colorado is not the
  replacement it's often described as** — SB 24-205 was postponed to June 2026 after a failed
  special session, *and* a federal court paused enforcement on **27 April 2026** pending litigation.
  Stalled twice over. Teaching Colorado as the operative state answer would be wrong today.
- **Lesson 5:** The two litigation fronts, and why they're different `[V]`. **Mobley v. Workday** is
  the discrimination front: ADEA collective certified May 2025, opt-in closed March 2026, and on
  **22 June 2026** Judge Lin allowed the core claims to proceed — **the California FEHA claims and a
  proxy-discrimination disability claim survived.** **Kistler v. Eightfold AI** is the other front
  and it is *not a bias case*: filed January 2026 by former EEOC chair Jenny Yang with Towards
  Justice, alleging scraping of a billion-plus worker profiles, 0–5 applicant scoring, and rejection
  before human review — **under the Fair Credit Reporting Act's consumer-report rules.** It doesn't
  allege the algorithm was biased. It alleges it existed in secret. **As federal disparate-impact
  enforcement retreated, plaintiffs found a channel that doesn't require proving disparate impact
  at all.** That is Lesson 2's principle with a mechanism attached.
- **Interactive:** choice — four statements about what's legally required today; find the one that
  was true eighteen months ago and isn't now.
- **Activity:** *"Exposure map"* — your jurisdictions, obligations, deadlines, and **one open
  question for your GC.** Graded on whether the question is specific enough to get an answer rather
  than a shrug. **Calibration:** scored against the prediction gate in M5.
- **Claim:** *"The retreat you've been reading about is an enforcement story. Your exposure went up."*

## M2 · Find the machines

*~60 min · counsel review required*

- **Lesson 1:** Decision-point mapping. Where people decisions actually get made — not the org
  chart's version. Sourcing, screening, scheduling, assessment, promotion, calibration, flight risk,
  scheduling algorithms, termination selection.
- **Lesson 2:** **The shadow vendor stack.** The AI features switched on inside tools you already
  own, with no procurement event, no security review, and no owner. This is why most AEDT
  inventories are wrong, and it's the highest-yield hour in the track. *(Delta over HRBP M6 and
  recruiter R6, both of which inventory known systems: this finds the ones nobody declared.)*
- **Lesson 3:** Why "a recruiter reviews everything" is not a defense, made operational. 101 M7
  states that a human reviewing a ranked list isn't automatically a defense; this gives the test that
  claim implies: **does that reviewer have the information, the time, the authority, and the
  incentive to overrule it?** Four questions, and most review layers fail at least two.
- **Lesson 4:** What the law now says about that defense `[V]`. Connecticut's Act amends the state
  Fair Employment Practices Act so that **use of an automated employment-related decision technology
  is not a defense to a discrimination complaint** — statutory framework effective **1 October
  2026**, principal compliance obligations **1 October 2027**, notice failures enforceable
  exclusively by the AG as an unfair or deceptive trade practice.
- **Interactive:** sorting — twelve review arrangements: real review / review theater / no review at
  all.
- **Activity:** *"AEDT inventory"* — tool, decision it touches, vendor, who reviews, and the
  four-question test applied to each reviewer. **Calibration:** predict how many systems you'll find
  before you look, and how many will turn out to be shadow-stack.
- **Claim:** *"You do not have an inventory. You have a list of the tools somebody remembered to
  buy."*

## M3 · Measure like it will be read in court

*~75 min · the methodological core · the module nothing else on the market has · counsel review required*

- **Lesson 1:** The two statutes that make this module structural rather than prudent `[V]`.
  **California (1 Oct 2025): bias testing, or its absence, is explicitly relevant to a
  discrimination claim.** **Connecticut (1 Oct 2026): using the tool is not a defense — but evidence
  of anti-bias testing may be considered in your defense, and the statute enumerates what will be
  weighed: the quality, efficacy, recency and scope of the testing; the results obtained; and the
  employer's response to those results.** Read those together and you get the track's thesis: **your
  testing program is evidence in both directions, and one legislature has already written down the
  rubric.**
- **Lesson 2:** The methods. Four-fifths *and* standard deviation analysis, and when each misleads.
  Proxy detection — with Illinois's zip-code prohibition as the named case and Mobley's surviving
  proxy-discrimination claim as the live one. Intersectional cuts, and why the marginal analysis
  passes while the intersection fails.
- **Lesson 3:** **Why external benchmarking hides the problem.** When half the gap sits in a fifth of
  firms, benchmarking to the industry average tells a firm in the bad fifth that it is normal. The
  comparison that matters is internal and longitudinal.
- **Lesson 4:** **The evidence problem — sequence privilege before you generate evidence.** AI
  collapsed the cost of producing analysis that is adverse to your own employer: what needed a
  statistician, a data pull, and a budget approval now takes four minutes in a chat window with
  retention, run by someone who never asked counsel. **Friction was the old control, and it is
  gone.** So the governing question is no longer *should we run it* but *who can run it, under what
  protection, and what happens to the output.* Running it and not acting is worse than not running
  it; not running it is also a position with consequences — and California has now made "we never
  tested" itself relevant evidence. *(Folded in from the prior assessment; it was the strongest
  surviving idea there and this is its right home.)*
- **Interactive:** choice — four testing designs; find the one whose results would be discoverable
  and unhelpful.
- **Activity:** *"Testing protocol memo"* — addressed to your GC. What you'd test, how, under what
  protection, on what cadence, and what you'd do with a bad result **before you have one.**
  **Calibration:** predict whether your organization's current testing would satisfy Connecticut's
  enumerated criteria.
- **Claim:** *"The analysis you're afraid to run is the one a plaintiff will run for you, without
  privilege and without your context."*

## M4 · The procurement gate

*~45 min*

- **Lesson 1:** The state of practice `[V]`. Roughly **50% of HR buyers now run formal pre-purchase
  evaluations of AI systems**, against **17%** relying mainly on vendor reputation; **75% of HR
  leaders name bias a top concern**, second to data privacy. **Read the funder:** this figure comes
  from a vendor that sells bias auditing, reporting on its own audit book — which is precisely the
  teardown the comp track's M2 teaches, applied here to a statistic this course wants to be true.
  Stated in-content, because a module about vendor claims cannot exempt its own.
- **Lesson 2:** What to actually ask. Validation evidence for a population like yours, in writing.
  What the model was trained on. What it optimizes. What happens to rejected candidates' data —
  Kistler's question.
- **Lesson 3:** **Fairness audit versus certification, which are not the same object.** An audit
  measures a system's outcomes on a population. A certification attests to a *process*. **ISO/IEC
  42001 certifies that you run an AI management system — it does not say your tool is fair**, and a
  vendor answering a fairness question with a certification has changed the subject. How to read an
  audit summary: population, date, what was measured, what wasn't, and what the vendor did about
  the result.
- **Lesson 4:** The agent doctrine, and why this gate is yours `[V]`. A tool screening candidates on
  your behalf can be treated as your agent — the employer loses "that's the vendor's problem."
  Which means procurement is where your exposure is actually set, and the fairness section belongs
  to whoever can read the answer.
- **Interactive:** choice — four vendor responses to a fairness question; find the one that answers
  it.
- **Activity:** *"RFP fairness section"* — one page, reusable. **Calibration:** predict how many of
  your current vendors could answer it.
- **Claim:** *"A certification is a vendor telling you they have a process. You asked whether the
  tool is fair."*

## M5 · Make yourself hard to route around

*~45 min · the course lands*

- **Lesson 1:** The vacancy, stated plainly. Someone will own AI governance in your organization —
  most likely Legal or IT. **Neither can define a four-fifths analysis or recognize a proxy.** The
  scarce thing is not the governance mandate; it's the capability, and you have it.
- **Lesson 2:** The naming question, honestly. Restructuring is cover; relabeling isn't. What a
  retitle does and doesn't protect, and how to tell which one happened to you. *(This is also the
  argument for this course's own name — see the naming section above. The track holds itself to it.)*
- **Lesson 3:** The market signal `[V]`. Roles combining AI governance with employment-fairness
  expertise are being posted at major employers. Treated as a *signal with a date on it* rather than
  a trend, and the learner is asked to find the equivalent posting in their own market rather than
  take ours on faith.
- **Lesson 4:** The pitch. One paragraph to whoever owns AI governance in your building, built from
  the four artifacts you now hold. Not a request for a mandate — an offer of a capability they
  cannot buy quickly.
- **Interactive:** choice — four pitches to an AI governance owner; find the one that gets a meeting.
- **Activity (course close):** *"90-day plan plus the pitch."* Then **the reckoning**: your M1
  prediction about what was legally required of you, scored against what you now know, plus the
  direction of the miss. The rubric grades the account of the change, never the accuracy of either
  end.
- **Claim:** *"Nobody is going to hand you this. The capability is scarce, the work is growing, and
  the only question is whether you ask before someone less qualified is assigned it."*

---

## Decisions (v1 — the integration)

1. **The source brief's spine is adopted whole:** five modules, the artifact chain, the prediction
   opener, and the closing career module. Nothing was added and no module was cut. The artifact
   chain is the most concrete spine on the ladder and it needed no help.
2. **Renamed. "Defensible by Design," not DEI and not Culture and Belonging** — reasoning in the
   naming section. This is the one place I'd push back hardest on the source brief, and it's a
   product-routing argument more than an editorial one.
3. **Async conversions.** *"Artifacts the participant brings to the live session"* → AI-graded
   activity submissions; the artifacts are unchanged and are the forcing function either way, which
   is why this track converts more cleanly than any of the previous three. *"You'll use the gap
   live"* → the M1 prediction is held and scored in M5's reckoning. *"The gate makes the live
   discussion possible"* → the prerequisite stays as a **stated** prerequisite, which the source
   brief already frames correctly ("state them, and mean it"); nothing in the product enforces it,
   and nothing should.
4. **The prerequisite stays, and it is doing product work.** Every other track's prerequisite is
   ladder position. This one adds domain tenure, and that's right: M3 assumes the learner knows what
   a standard deviation is. Flag for review — it's the first track with an audience gate the intake
   can't verify.
5. **Corrections to the source brief, all from verification, all in-content above.** Kistler is an
   FCRA case, not a bias case — and that makes the two-fronts story stronger. Colorado is stalled
   twice over and should not be taught as the state-level replacement. The EEO-1 rescission is
   proposed, not final, with a live 30 September filing obligation. Connecticut is much stronger than
   the brief states: not just a non-defense provision but a statutory enumeration of how testing will
   be judged, which becomes M3's opening argument.
6. **One idea folded in from the abandoned assessment:** the evidence problem, as M3 Lesson 4. It
   was the strongest thing in that document and M3 is where it belongs.
7. **The M4 statistic gets torn down in-content.** The 50%/17%/75% figures come from a vendor selling
   bias audits. Usable with the funder named — and naming it demonstrates the module's own method,
   which is worth more than the number.
8. **Subtraction renegotiated with two outlined tracks.** Recruiter R6 keeps *reading* a bias audit
   and loses nothing; this track owns *producing* the analysis. Comp M4 keeps pay-equity regression
   under privilege; the general evidence-generation problem moves here. Both are outlines, not
   drafts, so this is free — but it has to be written into their Decisions sections before either is
   drafted, or the overlap ships.
9. **Everything is volatile layer.** Three of five modules turn on statutes that changed within
   twelve months, and two carry effective dates in the future (Connecticut, 1 Oct 2026 and 1 Oct
   2027). This track will be the maintenance agent's heaviest customer by a wide margin — heavier
   than the HRBP track, which currently holds that title.

## Verification ledger

**Confirmed before writing.** EO 14173, EO 14281, the EEOC's dropped disparate-impact cases and its
June 2026 National Enforcement Plan, and the March 2026 contractor order. Disparate impact's
codification in Title VII by the Civil Rights Act of 1991 and the private plaintiffs' bar's
continued access. The EEO-1 rescission as a **proposed** rule sent to OIRA 14 May 2026, with the 30
September filing obligation still live. California CRD regulations effective 1 October 2025 making
bias testing or its absence relevant. Illinois HB 3773 effective 1 January 2026, including the
zip-code proxy prohibition. Colorado SB 24-205's postponement and the 27 April 2026 federal
enforcement pause. Mobley v. Workday: ADEA collective certification May 2025, March 2026 opt-in
deadline and MTD denial, and the 22 June 2026 ruling allowing core claims with FEHA and
proxy-discrimination disability claims surviving. Kistler v. Eightfold AI as a January 2026 FCRA
class action brought by Jenny Yang and Towards Justice. Connecticut's AEDT framework: the
non-defense amendment, the anti-bias-testing mitigation factors and their enumerated criteria, and
the 1 Oct 2026 / 1 Oct 2027 effective dates. The Warden AI 50%/17%/75% procurement figures, with the
funder identified.

**Blocking before drafting.** The March 2026 executive order's operative text and scope. Litigation
status of the challenges to EO 14173. The Mobley June 2026 ruling on **limits to AI bias testing and
applicant data disclosure** specifically — it surfaced in the search and is directly on point for
M3's privilege sequencing, and it has not been read. ISO/IEC 42001's exact scope, stated carefully
enough to survive a vendor's objection. The JPMorgan posting from the source brief — a single job
ad is not a durable citation, which is why M5 Lesson 3 asks the learner to find their own; if it
stays, it needs an archived link and a date. Standard deviation analysis conventions as actually
applied by the agencies. And **all three counsel gates**.

## Open questions for review

- **Scope collision with People Analytics**, which the authoring brief ranks as the highest-priority
  remaining track. This track's audience explicitly includes people analytics practitioners, and the
  two overlap on method literacy. Proposed line: People Analytics owns *building and evaluating
  models the function consumes*; this track owns *the defensibility of people decisions*. That needs
  agreeing before the People Analytics track is outlined, not after — same failure mode as the EX
  comms / People Ops boundary.
- **Does the domain prerequisite exclude the people who most need this?** An HRBP who just inherited
  AEDT governance has zero years in a DEI or analytics role and is exactly the person M5 is written
  for.
- **Is five modules enough, or does M1 split?** It carries five lessons where every other module
  carries four, and it spans federal posture, state law, and two litigations. The alternative is
  splitting the litigation front into its own module and going to six.
- **Should the 101 M7 Lesson 3 correction still happen?** Yes, independently of this track — it is
  shipped and open and its federal-enforcement claim is stale. This track is not a substitute for
  fixing it.
