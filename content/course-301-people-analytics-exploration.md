# AI 301 · The Specialist — People Analytics track, exploration (pre-outline)

**Status:** working exploration, not an outline. Fifth role track. Written to the method in
`content/301-track-authoring-brief.md` §2: start from the job, find where AI meets it, subtract
everything 101, 201, and the four existing 301 tracks already teach.

**Scope decision, inherited rather than made.** The People Ops & HR Technology track drew this
boundary from its own side, before this document existed, and it is honored exactly:

> **Out of scope, by decision:** model building, regression, validity work, adverse-impact modeling
> — a People Analytics track's job. This track's relationship to analytics is retrieval and
> reporting, not inference.

So the line between the two tracks is **retrieval versus inference**, and it is a good line because
it is mechanical rather than topical. People Ops owns *getting the right rows to the right person*.
This track owns *what you are entitled to conclude from them*. §3 handles the one place the line
genuinely blurs, and answers the open question People Ops left for this track.

Titles in scope: People Analytics Analyst / Manager / Director, Workforce Analytics, HR Data
Scientist, Workforce Planning, Employee Listening / Engagement Survey owner, and the DEI
measurement lead where that sits with analytics rather than with a DEI function.

---

## 1. What this role actually does

Not the job description — the year. In a 1,000–10,000 person company this is one to six people, and
their calendar contains:

- **The recurring reporting surface.** Headcount, attrition, hiring funnel, representation, span
  and layers, comp distribution. The monthly HR scorecard, the quarterly board slide, the annual
  workforce report. Most of the function's *visible* output, and the least of its value.
- **The engagement survey program.** Instrument design or vendor selection, fielding, confidentiality
  thresholds, open-text analysis, results roadshows, action planning that mostly doesn't happen.
  Often pulse surveys on top. They own the promise made to respondents.
- **Attrition work.** Rates, cuts, cohort curves, exit-reason coding, regretted versus non-regretted,
  and — increasingly — a flight-risk model somebody asked for.
- **Workforce planning.** Headcount forecasts, scenario models, skills supply and demand, cost of a
  reorg, span-of-control targets. The models Finance actually argues with.
- **The leadership question.** *Why is attrition up in engineering? Is our onboarding working? Are
  we losing women at level 5? Is the return-to-office policy hurting us?* Arrives with a deadline,
  no design, and an implied answer.
- **DEI measurement.** Representation, hiring and promotion rates by group, pay equity in
  partnership with comp, sometimes an inclusion index. The most politically loaded numbers in the
  company.
- **Tooling.** The analytics platform, often a warehouse and a semantic layer, the listening tool,
  and the perennial question of whether to buy the vendor's model or build one.
- **And now: the AI question about the workforce itself.** *What will AI do to our headcount, our
  skills, our job architecture?* Leadership asks this of analytics because it looks like a
  forecasting question, and it is mostly not one.

## 2. What's distinctive about it

Eight properties that are not true of People work generally, and that a template would have missed.

**Their output is a belief, not a record or a transaction.** Every other track produces something
with a state: a requisition, a pay decision, a configured capability, a documented conversation.
This role produces **a claim about how the organization works** — and once leadership believes
*attrition is driven by manager quality*, that belief allocates budget for years, survives the
analyst who produced it, and is very hard to dislodge. **The characteristic failure of this
function is a durable wrong belief**, not a wrong number, and it has no error message.

**They make causal claims from observational data.** Which is the single most AI-transformed act in
the whole curriculum, because producing a fluent causal narrative from a correlation is exactly
what a language model is best at and exactly what it will never caveat unprompted.

**The cost of producing a plausible analysis collapsed, and it collapsed for everyone else too.**
An HRBP with a CSV can now produce a cut, a chart, a regression, and a confident paragraph in an
afternoon. This is structurally the recruiter track's signal collapse, one function over and with a
different consequence: **the scarce thing moves from producing analysis to adjudicating it.** That
transition is the diagnosis this track opens on, and it is the opposite of a productivity story.

**They promise confidentiality and then analyze the data.** Survey confidentiality is a real
promise with a numeric threshold under it, and it is the only place in People where the function's
credibility rests on a statistical property rather than a behavior. AI text analysis at scale
strains it in a genuinely new way — a human summarizing 400 verbatims smooths identifying detail
away as a side effect of being human; a model asked for themes with supporting quotes hands them
back with the detail intact.

**Their models act on individuals but are evaluated in aggregate.** A flight-risk model reported as
78% accurate is wrong about roughly one in five named people, and the intervention lands on named
people. Nobody else in the function routinely produces artifacts with that shape.

**Acting on a prediction destroys the evidence for it.** The intervention paradox: if the model
flags someone and you retain them, the model was "wrong" and you did the right thing; if you do
nothing to preserve the evaluation, you deployed a model you refused to use. **This role is the only
one in People whose central artifact cannot be cleanly evaluated in production**, and almost nobody
in the field says so out loud.

**They are the function's evidence standard.** When comp cites a benchmark, when TA reports
quality-of-hire, when an HRBP claims a program worked — the standard being applied is whatever this
team taught the organization to accept. Getting it wrong is done on everyone's behalf.

**They are the only function positioned to run a real test.** Staggered rollouts, holdouts,
randomized manager assignments to a program. Rare, and the reason usually given is cost and design
difficulty — both of which AI just reduced. That makes *"we can't test that"* a weaker excuse than
it was eighteen months ago, which is the one genuinely affirmative thing this track has to say.

## 3. The subtraction — what is already owned

This role is the most at risk of duplication in the whole set, and not from 201 — from **comp M3
and M4**, which already teach analytical craft and method literacy to a numerate audience. Every
candidate has to state its delta against those two specifically, and the close calls have to be
named rather than glossed.

| Covered by | What it already gives this role |
|---|---|
| 101 M4 | Data tiers, the shown-to-the-person test, redaction discipline |
| 101 M6 | The four failure types; verification sized to stakes |
| 101 M7 | Assist vs. decide; the traveling test; bias as fidelity |
| 101 M8 | Accountability; disclosure by reader's stake |
| 201 M1 | Workflow anatomy; selection by frequency × structure × stakes |
| 201 M4 | The verification budget matched to failure mode |
| 201 M6 | People data in production; the boundary sheet; DPA vs. consumer tier |
| HRBP M3 | The vendor teardown by evidence / sample / falsifier; the volume trap |
| HRBP M5 | Arriving with a model rather than a story; the foundation named as a constraint |
| HRBP M6 | State AI employment law; the agent doctrine; ER documentation |
| Recruiter R5 | **The closed loop: instrument → capture → analyze → feed back; "name the decision that changes"** |
| Recruiter R6 | **Bias audits, adverse impact, the four-fifths rule — in a selection context** |
| Comp M2 | **Reading evidence: what's the evidence, what's the sample, what would falsify it** |
| Comp M3 | **The craft layer: audit files, row counts, documented joins, reconciliation specs** |
| Comp M4 L3 | **Method literacy: what a control set smuggles in; "explained variance is a modeling decision"** |
| People Ops M5 | The source system, effective dating, referential integrity — the record itself |
| People Ops M6 | Retrieval and permissions; the assistant that inherits its user's access |
| People Ops M7 | Deployer obligations under Article 26; logs; co-determination |

### The six close calls, stated honestly

**Comp M3's craft layer vs. the inference layer.** The closest call in the entire curriculum, and
worth being precise. Comp M3 verifies **construction** — did the join drop 340 rows, did a filter
persist, can you rebuild the number in front of the person asking. Its rule is *never present a
number you couldn't rebuild from its inputs.* That is necessary here and is **cited, not repeated.**
The delta is the layer above it: **a perfectly constructed table still does not license the claim
you are about to make from it.** This track's rule is the sibling — *never present a finding whose
alternative explanations you haven't stated* — and everything under it (confounding, selection,
survivorship, regression to the mean) is absent from comp M3, which is a verification module rather
than an inference module. Two rules, two layers, one cross-reference. If the drafted module ever
starts explaining row counts, it has drifted and should be cut back.

**Comp M4 L3's method literacy vs. modeling as the job.** Comp M4 teaches a comp practitioner to
read *someone else's* pay equity regression critically — what the control set smuggles in, why
"explained" variance is a modeling decision. That lesson is excellent and it is a **consumer's**
lesson, scoped to one question. This role builds the models, across many questions, and needs the
producer's version: which confounders are endemic to HR data specifically, what makes a control
legitimate versus laundering, and when a model should not be built at all. Real delta, but thinner
than it looks — the drafting rule is that this track **assumes comp M4 L3 and starts after it**,
and any lesson that would be useful to someone who hadn't read it is probably re-teaching it.

**Comp M2's teardown vs. being the one whose sample gets asked about.** Comp M2 teaches evidence,
sample, falsifier — applied to *incoming* claims from vendors and articles. The inversion is genuine
and it is one lesson, not a module: this role is the one **producing** the evidence, and the three
questions turned inward are a different experience entirely. Folded into M1 as the diagnosis's
sharp edge, not given a module.

**Recruiter R5's closed loop vs. measurement design.** R5 already teaches the best version of "name
the decision that changes" and the four-stage loop, for a TA team instrumenting its own funnel. It
transfers, and it is **cited**. What R5 does not cover is measurement *validity* — whether the thing
you captured is the thing you meant, which is the survey instrument's whole problem and is where
this track's M4 lives. Loop mechanics out; construct validity in.

**Recruiter R6's fairness work vs. prediction on incumbents.** R6 owns adverse impact, the
four-fifths rule, and bias auditing **in a selection context** — hiring, where the legal doctrine is
mature and the regulatory attention is concentrated. This track's fairness surface is different in
kind: **prediction about people already employed** — flight risk, performance forecasting, promotion
readiness, "high potential" scoring. Different data, different doctrine, different failure. R6's
technical apparatus is cited; the incumbent-prediction surface is uncovered and is this track's M3.

**People Ops M6's re-identification vs. this track's.** People Ops raised this as an open question —
whether re-identification belongs to them as a permissions problem or pulls enough weight to move
here. **Both, and the split is clean, so it should be written down before either track drifts:**

- **People Ops owns access control.** Who can retrieve what. The assistant inherits its user's
  rights; the fix is permissions, indexing scope, sensitivity labels, and testing from a
  least-privileged account. Mechanism: *someone reached a document they shouldn't have.*
- **This track owns disclosure control.** What a legitimately-permissioned aggregate reveals about
  an individual. Small-N cells, differencing attacks across two published cuts, and verbatim quotes
  that identify their author. The fix is thresholds, suppression, and what you agree to publish.
  Mechanism: *nobody's permissions were violated and the individual was identified anyway.*

Different failure, different remedy, no overlap once stated. Recommend both tracks carry the
sentence.

### Deliberately not modules

- **A statistics course.** The audience already has more of this than the rest of the function.
  Anything a competent analyst learned in training stays out; what stays in is what changes because
  a model will now produce it fluently on request.
- **Dashboard and visualization craft.** Real work, not AI-transformed in any way worth 45 minutes.
- **A data-quality module.** People Ops M5 owns the source system. This track's relationship to it
  is a dependency and a sentence, not a module.
- **A tooling or platform module.** 101 M2 and 201, plus the platforms change quarterly.
- **"AI and the future of work" headcount modeling.** Leadership will ask; it is mostly not a
  forecasting question, and pretending otherwise is the single most likely way this function
  destroys its credibility this year. It earns **a lesson in the closing module** — specifically,
  how to decline a forecast honestly and offer what you can actually support — not a module.
- **Arguing the finding to an executive.** Structurally comp M5's counterparty module and HRBP M5's
  argument. Real here — leadership now runs its own analysis and arrives disagreeing — but it is a
  lesson, folded into the close.
- **Driving analytics adoption across the function.** 401 · The Translator.

## 4. Candidate topics, ranked by how much they earn their place

The test: would a People Analytics lead read the description and think *finally, someone understands
my actual job?*

**A. What you're for now, and the four verbs.** The diagnosis plus the decomposition, merged. The
cost of a plausible analysis collapsed and it collapsed for your stakeholders too, so the scarce
thing moves from **production to adjudication**. Then the work ladder that is also a risk gradient:
**describe → explain → predict → prescribe.** Each verb requires something the one before it
doesn't, each is a step change in what has to be true for you to be entitled to speak, and AI has
made the *fluency* of all four identical while changing the *warrant* for none of them. Plus the
inversion of comp M2's teardown: you are now the one whose sample gets asked about. Highest
confidence — it is the diagnosis, the decomposition, and the through-line in one place.

**B. From table to claim.** The signature module and the one nothing else in this market teaches.
Comp M3 verifies the table; **this verifies the leap.** The alternative-explanations artifact as a
required deliverable. The confounders endemic to HR data: exit reasons are what people were willing
to say on the way out; performance data is a rating produced by the system you're evaluating;
promotion data is censored by everyone who left first; survivorship runs through nearly every
tenure analysis. Regression to the mean as the explanation for most "our intervention worked"
findings. And the specifically-AI part: **a model will generate a coherent causal story from a
correlation on request, and it will not volunteer the confound, because nothing in what it is doing
corresponds to looking for one.** Highest confidence in the set.

**C. Prediction about people.** Flight risk, performance forecasting, promotion readiness, "high
potential." The intervention paradox — acting on the prediction destroys the ability to evaluate it
— which is genuinely unaddressed anywhere in the field. Aggregate accuracy versus individual
consequence. The base-rate problem: a model with impressive accuracy against a 12% event is often
worse than useless at the individual level, and this is the arithmetic most flight-risk conversations
never do. Who sees the score, and what a manager does with *78% likely to leave* — including the
part where the score changes their behavior toward the person. And the question to ask before
building: **what decision changes, and would we be comfortable telling the person the score
existed?** High confidence, and role-unique.

**D. The instrument.** Surveys and listening. Construct validity — whether the thing you measured is
the thing you meant — which R5's loop does not reach. Confidentiality as a promise with a number
under it, and disclosure control as the professional obligation: thresholds, suppression, the
differencing attack across two published cuts. Open-text analysis at scale, where the new failure is
that **a model returns themes with supporting verbatims and the verbatims identify their authors** —
a human summarizer smoothed that away by accident. AI-written survey items and why item wording is
not a drafting task. And the counterparty turn: **employees answer surveys with AI too**, which does
something to your open-text signal that nobody has measured yet. High confidence.

**E. The floor.** The legal and ethical surface specific to inference about employees. **This role
may be a *provider* as well as a deployer** — an organization that builds its own model for
employment decisions occupies both positions, and every other track's floor module assumes the model
came from a vendor. Automated decision-making and the right to human review. **Purpose limitation:**
data collected to run payroll, or to answer an engagement survey, being used to train a model
predicting who will quit. Monitoring and co-determination where analytics rather than systems
triggers it. Counsel-review gate. High confidence on the *provider* framing specifically, which is
new to the curriculum; medium on the rest until verification lands.

**F. The experiment.** The affirmative module, and the answer to everything B through E raises.
Staggered rollouts, holdouts, natural experiments already sitting in your data. What AI changed: the
cost of designing, powering, and analyzing a study fell, so *"we can't test that"* is a weaker
excuse than it was. Where a test is feasible in HR and where it genuinely is not, and the ethics of
withholding a program from a control group. Medium-high confidence — the content is strong, the
question is whether it is a module or two lessons inside B. Flagged as the likeliest cut.

**G. The narrative, and the exec who ran their own numbers.** Leadership arrives having asked a model
the same question and gotten a different answer. Real, and structurally comp M5. A lesson in the
close.

**H. Forecasting AI's workforce impact.** The question this function will be asked most often in the
next two years and can least defend. How to decline honestly and substitute something supportable.
A lesson, and an important one.

## 5. Verification, done before any of this was written

Per the brief §4. The result here is unusual and it changed the shape of the track: **the verification
mostly failed, and the pattern of the failure is the best material in the exploration.**

**Confirmed, and it sets the diagnosis.** SHRM *State of AI in HR 2026* (n=1,722, fielded 5–23
December 2025, 138 HR tasks): AI use concentrates in recruiting 27%, HR technology management 21%,
L&D 17%, employee experience 14% — while **54% of organizations have implemented no AI in HR and
have no plans to in 2026**, and 92% of CHROs expect greater integration. **People analytics does not
appear as a named category in the top adoption areas.** State this carefully: absence from a
published top-four list is not evidence of a low rate, and the module must say so rather than
inferring one. What it does support is narrower and still useful — *the function whose whole subject
is evidence is not where this function's AI adoption is being reported.*

**Failed, and it removes an anchor I wanted.** I could not establish a credible primary figure for
how often people analytics functions influence decisions, how many run predictive models, or whether
deployed attrition models reduce attrition. The literature that comes back is overwhelmingly vendor
blogs, maturity-model marketing, and practitioner Medium posts, with a thin layer of academic work
that does not answer the deployment question. **No module may be anchored on a maturity-model
statistic**, and the honest version of the adoption picture is qualitative.

**Failed, and instructively.** The most quotable number in this space — *"81% of people analytics
projects are jeopardized by ethics and privacy concerns"* — traces to secondary citation with no
reachable instrument. It is the exact shape of claim comp M2 teaches learners to reject. **Do not
use it.**

**Weakened by its source, which is a teaching opportunity.** The strongest available employee-side
figures on monitoring — 56% reporting stress from workplace surveillance, only 22% aware they are
monitored against 74% of employers using tracking tools, 59% saying tracking damages trust, 77%
saying advance notice would reduce their concern — come from a **2025 ExpressVPN survey of 1,500 US
workers.** Sample disclosed, which is better than most of this field. But it is a **VPN vendor
publishing research on the harms of surveillance**, which is a commercial interest in the finding,
and a track about evidence cannot cite it without saying so. Usable **only** with the interest stated
in-lesson — and doing that is itself the lesson. The monitoring/analytics distinction also needs
care: these figures are about tracking, not about analytics, and conflating them would be the same
error the track is trying to teach against.

**The finding underneath all of it, and it belongs in the content.** **The evidence base about
people analytics is worse than the evidence base people analytics demands of everyone else.** A
function whose professional standing rests on methodological rigor has a literature about its own
efficacy composed largely of vendor maturity models and self-reported case studies. That is not a
cheap shot — it is the strongest possible opening for a track about inference, it is verifiable by
any learner in ten minutes, and it makes the course's central demand credible by applying it first
to the course's own subject. **This replaces the adoption statistic as M1's anchor.**

**Blocking before drafting.**
- **M3:** a credible primary source on flight-risk model performance in deployment, and on whether
  any published evaluation survives the intervention paradox. If none exists, the module says so —
  which is a stronger lesson than a borrowed number.
- **M4:** confidentiality threshold conventions actually in use (the *n* below which results are
  suppressed) and any published work on re-identification from survey verbatims.
- **M5:** the provider-versus-deployer classification for an organization building its own
  employment-related model; automated-decision-making rules and the right to human review; purpose
  limitation as applied to secondary use of HR data; and whether analytics-driven monitoring
  triggers co-determination on a different footing than People Ops M7's systems examples. **All of
  M5 is blocking.** It is also the module most likely to change shape once verified, on the evidence
  of every other track's floor module doing exactly that.
- **M6:** at least one documented HR field experiment worth teaching from.

## 6. What this suggests the course actually is

**This role's 301 is about the warrant for a claim, in a year when the fluency of a claim stopped
being evidence of anything.** Not one module is about producing analysis faster, and the track should
say so in its first paragraph, because a course that promised that would be selling the exact
capability that just stopped being scarce.

Three consequences for design:

**The spine is one real question the learner owes someone.** Not a workflow, not a capability, not a
cycle — **a live analytical question with a requester and a deadline**, of the kind that arrives with
an implied answer. It gets decomposed in M1, its alternative explanations enumerated in M2, its
prediction ambitions tested in M3, its instrument examined in M4, its floor checked in M5, and in M6
the learner asks whether it could have been a test instead. The close decides what to actually say
and — the move this track uniquely allows — **whether the honest answer is that you cannot answer
it.**

**The artifact is a finding with its alternatives attached.** Every other track produces a plan, a
map, a policy, or a bet. This one produces **a claim, its warrant, the explanations it survived, and
the ones it didn't** — a document the function does not currently produce and which is the only real
defense against the durable wrong belief. It should carry a confidence statement that a reader can
act on, and a named condition under which the finding should be revisited.

**The through-line writes itself from §2 and it is the inverse of every other track's.** Every other
301 track tells its audience that fluent output is dangerous because they will over-trust it. This
audience's exposure runs the other way: they are the people best equipped to catch a bad number and
**the claim is not the number.** Their training protects the table and says nothing about the leap.

## 7. Open questions for review

- **Is F a module or two lessons?** The experiment is the track's only affirmative content, which
  argues for keeping it whole. But M2 and M3 both end at the same place — *this would have been
  answerable with a test* — which argues it is the natural conclusion of each rather than a separate
  destination. Flagged as the likeliest cut in the set; recommend keeping it and watching completion.
- **How much does this track assume the learner builds models?** A meaningful share of people
  analytics functions buy a vendor's flight-risk score rather than fitting one. If M3 assumes
  building, it misses them; if it assumes buying, it becomes comp M2's teardown again. Current lean:
  write M3 so the questions are identical either way, since *what decision changes* and *what is the
  base rate* do not depend on who fit the model.
- **Does the DEI measurement surface need its own module?** It is the most politically loaded
  reporting this role does, the disclosure-control problem is at its sharpest there, and the legal
  exposure is real. Current lean: it is the worked example running through M4 and M5 rather than a
  module, because separating it invites treating disclosure control as a DEI topic rather than a
  professional obligation.
- **The convention change lands here first.** The People Ops outline retires the numeric calibration
  prompt course-wide in favor of **a claim about the learner's own organization, contested before
  content and verified against evidence from their systems.** This track is built that way from the
  start. For an analytics audience it is unusually well-suited — *contest this, then go and check* is
  the job — but it raises a question the People Ops document did not: **what does a learner do when
  the evidence in their systems cannot settle the claim?** That is a real outcome here, more than
  anywhere else, and the rubric has to reward reaching it rather than treating it as a failed
  activity.
- **Registration.** `roles.ts` currently folds analytics into `other`, which falls back to
  `ai301-hrbp`. Shipping this means a `peopleanalytics` choice alongside the `peopleops` one the
  other outline requires — and at that point `other` covers talent development, employee experience,
  and function leadership only.

---

# Verification record — run before drafting (v2)

Six blocking items from the outline's Decision 9. All resolved. **Two changed the design, and one
resolved itself into the best worked example in the track.**

## M2 L5 — flight-risk model performance in deployment

**The blocking question was whether any published evaluation shows a deployed attrition model
reduces attrition. The answer is that the literature does not ask.** It is almost entirely about
algorithmic performance on benchmark datasets, and the strongest available reading is that
"research primarily focuses on algorithmic performance rather than real-world effectiveness."

**And the benchmark is the finding.** The headline accuracies in this literature — 98.8% for XGBoost,
98.7% for Random Forest, and a run of near-perfect scores from boosting variants — are largely
measured on the **IBM HR Analytics Employee Attrition & Performance dataset**, which is **explicitly
fictional: 1,470 fabricated employee records created by IBM data scientists**, 35 features, widely
redistributed on Kaggle.

So the module does not need a citation it cannot get. **It gets a worked example instead**, and a
better one: a 98.8%-accurate model, on invented people, cited as evidence that flight-risk scoring
works. Every question this course teaches — what's the evidence, what's the sample, what would
falsify it — fails at the first one. **This is now M2 L5's anchor.** The honest statement stands
alongside it: *nobody has published an evaluation of whether acting on these scores changes
anything, and the intervention paradox is why that is hard rather than lazy.*

## M5 — the floor, all of it

| Item | Result |
|---|---|
| **California FEHA ADS** | Confirmed. Effective **1 October 2025**, employers with **5+ employees** in California. Records of selection criteria, ADS data and applicant-flow logs retained **four years** — up from two. Reach extended to **AI tool developers/agents**, which is the part that matters for an in-house model. |
| **Illinois HB 3773** | Confirmed and sharper than expected. Effective **1 January 2026**, amending the Human Rights Act. **Strict liability for discriminatory effect — intent is not a defence.** Notice required when AI is used in recruitment, hiring, promotion, discipline, discharge or terms of employment. **Zip codes as proxies for protected classes are expressly prohibited.** One employee is enough to be covered. Implementing rules still in progress at IDHR. |
| **Colorado** | **The brief's entry is wrong and the correction is a lesson.** SB 24-205 was postponed to 30 June 2026, then **enforcement was blocked by a federal magistrate on 27 April 2026** (xAI challenge, with DOJ intervening), and then **repealed and replaced by SB 26-189, signed 14 May 2026** — a scaled-back **disclosure-and-rights framework** for automated decision-making technology, effective **1 January 2027**. So the date survives and the law behind it does not. |
| **Provider vs deployer** | Confirmed, and the mechanism is **Article 25**, not a general principle. A deployer *becomes* a provider — and picks up Article 16 obligations — by putting its name or trademark on a high-risk system, **making a substantial modification** to it, or **changing its intended purpose so it becomes high-risk.** That last limb is the one this audience walks into: taking a general model or a vendor tool and pointing it at an employment decision. |
| **Co-determination for analysis vs deployment** | Confirmed, and the delta from People Ops M7 is real. **§87(1) no. 6 BetrVG turns on whether a technical system is *objectively suitable* for monitoring behaviour or performance — the employer's intent is irrelevant.** Manager dashboards, productivity scores and AI-driven workforce analytics are named examples. So "we're only analysing data we already have" is not a defence, the works council holds an enforceable veto rather than an opinion, and engagement belongs in design rather than after deployment. **This is the analytics-specific version People Ops M7 does not carry.** |

## Two design consequences

**M5's Colorado lesson changes shape.** It is no longer "a date to diarise." It is **a worked example
of a regulatory map moving under you** — postponed, enjoined, repealed and replaced inside thirteen
months — which is the argument for building an inventory that survives the statute rather than a
compliance checklist keyed to one.

**M5 L4's purpose-limitation lesson gains a second, sharper edge.** The German position means the
analytics function's most common self-description — *purely observational* — is not a legal category.
A dashboard is a technical device, and suitability is assessed objectively.
