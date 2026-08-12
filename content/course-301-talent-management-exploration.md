# AI 301 · Talent Management — exploration and assessment

**Status:** exploration, written to decide whether this is a track before anyone outlines one. The
Talent Development thread already ruled *"Talent Management is not a missing track"* (its Decision 6:
performance and calibration to HRBP, succession and high-potential to TD M5). This document tests
that ruling rather than assuming or overturning it.

**Why it needed testing.** The TD ruling answers *is the work covered?* The authoring brief's actual
test is different: **is there a job here with a week and a year to describe?** Comp is a track not
because pay conversations are uncovered — HRBPs have them constantly — but because *designing the pay
architecture* is a job. The same argument might hold for the architecture by which an organisation
judges and moves people.

**And §3a changes the arithmetic.** `trackForRole` resolves a learner to exactly one 301 course, so
overlap with a sibling track is not an argument against a track. The costs of splitting are authoring
effort and drift; the cost of *not* splitting is a learner served by neither course.

---

## 1. A correction to the claim that prompted this

The register's A-1 entry said skills taxonomy and skills inference were **covered nowhere** across
the built curriculum, and offered that as the strongest argument for a track. **That was wrong**, and
the error is worth recording because it is the failure mode the brief warns about — I grepped for a
term and counted files rather than reading what the files said.

**`ai301-talent-dev-m5` Lesson 4 covers skills inference, and covers it at the sharpest available
angle.** Not as taxonomy craft, but as a decision-about-people problem:

> *"Skills taxonomies are the fastest-growing thing in this profession and the least examined. A model
> infers an employee's skills… then that inference gates something. Eligibility for a development
> program. Visibility in an internal talent marketplace. Inclusion on a succession slate… and at that
> moment it stops being a description of a person and becomes **a decision about them**, made by a
> system, on evidence they have never seen and cannot correct. The tell is not what the system
> outputs. It is what happens downstream of the output."*

That is better than what a new track would likely have produced, and it means the headline argument
for A-1 is gone. What follows is the case that survives without it.

## 2. What the job actually is

In an organisation large enough to have one, a Talent Management lead owns:

- **The performance system as an instrument.** The rating scale and what each point means, the
  distribution guidance or its deliberate absence, the form, the cycle mechanics, the appeals path.
- **The competency or capability architecture.** What "good" is defined as, per level and per family,
  and how it connects to hiring, development, promotion and pay.
- **Calibration as a process.** Who is in the room, what evidence is admissible, how disagreement is
  resolved, what gets recorded.
- **Succession and potential.** Slates, criteria, the definition of potential, the review cadence,
  who sees the list.
- **Internal mobility mechanics.** Eligibility rules, posting norms, the talent marketplace if one
  exists.
- **The skills architecture**, increasingly, and often shared with People Ops (who own the field) and
  Talent Development (who consume it).

**The week:** running or preparing a cycle, arbitrating a rating dispute, redrafting a competency
nobody could apply, briefing executives before a talent review, defending the distribution to a
leader who thinks their team is exceptional.

**The year:** one or two cycles, a talent review season, an architecture revision every few years
that consumes a quarter and is remembered for a decade.

**This is a job.** In organisations above roughly 3,000 people it is a distinct person or team; below
that it is part of an HRBP lead's or a CHRO's portfolio. That size threshold matters and comes back
in §6.

## 3. What is distinctive — and it is one thing, held hard

Most of what this role does resembles work another track already teaches. One property does not:

> **This function builds the instruments by which the organisation decides who is good. Every other
> People function operates an instrument someone else built; this one writes it.**

Comp writes the pay architecture, which is the closest parallel and is a track. But a pay structure
is defensible against an external market: you can benchmark it. **A competency framework and a
potential definition have no external referent.** They are true because the organisation agreed they
are, which makes them the only major HR instrument whose validity is entirely internal.

That has a sharp AI consequence, and it is the strongest idea available to this track:

**A competency framework is now free to produce and no cheaper to justify.** Ask a model for a
capability architecture for a 4,000-person software company and you will get a good one in ninety
seconds — coherent, well-levelled, better written than most in production. What you cannot get is the
answer to *why these and not others, here.* The framework was never scarce. **The agreement was**, and
the agreement is what made it operative.

That is structurally the People Analytics scarcity stack, one function over: the artifact went to
zero and the thing above it — definitional authority, held by a person with standing — did not.
**Which is also an argument that the idea already has a home.**

## 4. The subtraction, done honestly

This is where the case is decided, and the result is uncomfortable.

| Candidate topic | Already owned by | Verdict |
|---|---|---|
| Skills inference and taxonomies | **TD M5 L4**, at its sharpest angle | Owned |
| Potential / hi-po as prediction about individuals | **Analytics M2 L5** — base rates, the intervention paradox, who sees the score, would you tell them | Owned, and better than a TM track would do it |
| A model trained on past ratings recommending ratings | **Comp M4's circular zone** — structurally identical: the model learns what you did and reproduces it as a recommendation | Owned |
| Governance of inference about employees | **Analytics M5** — provider vs deployer, purpose limitation, disclosure control | Owned |
| Adverse impact in promotion decisions | **Defensible M2–M3** — AEDT inventory, four-fifths, proxy detection, privilege sequencing | Owned |
| Calibration facilitation, contested judgment | **HRBP** — its whole subject | Owned |
| Documentation that survives challenge | **LER L4** | Owned |
| Construct validity of an instrument | **Analytics M3 L4** — *executable is not valid*, latent constructs measured by proxy | Owned in principle, **not applied to performance instruments** |
| **Designing the rating scale and competency architecture** | — | **Uncovered** |
| **Calibration as a designed process rather than a facilitated meeting** | — | **Uncovered** |
| **The agreement problem — why a generated framework isn't operative** | Analytics M1/M3 in principle | **Uncovered in application** |

**Three things survive.** Not seven. And two of the three are the same idea seen twice.

## 5. Verification

Run before drafting anything, per brief §4.

**The skills-based organisation has an adoption–reality gap, and the barrier is measurement** `[V]`.
Only about **46% of employers plan to expand skills-based hiring in 2026** and **43% plan to increase
AI use in screening**; the most-cited obstacle is inadequate or costly platforms for skills testing
and verification, with organisations falling back on credentials, titles and years of experience
because assessment at scale is expensive. Sources are practitioner and vendor-adjacent — Forbes
reporting a survey, plus vendor playbooks — and none carries a disclosed instrument I could reach.
**Not usable as a module anchor**, and this is the same failure the People Analytics exploration hit:
the literature about this corner of HR is vendor-dominated.

**The finding underneath it is usable, and it reframes the topic.** The barrier to skills-based
working is not taxonomy quality — taxonomies are now cheap. It is **assessment**: knowing what a
person can actually do, at scale, defensibly. That is a *measurement validity* problem, which is
People Analytics' subject, and a *decision-about-people* problem, which is TD M5's and Analytics M5's.
It is not a new subject; it is two owned subjects meeting.

**Nothing else verified well enough to anchor on.** Performance-management AI content is almost
entirely vendor material. I found no credible primary evidence on whether AI-assisted calibration
changes rating distributions, or on the validity of AI-inferred skill profiles against any external
criterion — which is itself the most interesting fact available and belongs in whatever content
covers this.

## 6. Verdict

**Not a track. Three lessons, placed in tracks that already exist — and one of them is genuinely
valuable.**

The Talent Development thread's ruling stands, though not entirely for the reasons it gave. It is
right that the work is distributed. It is right for a reason it did not state: **the AI questions in
this role are not about talent management, they are about inference on people and the validity of
instruments — and this curriculum already teaches both, in tracks whose audiences overlap heavily
with this one.**

Three placements, in priority order:

**1. Construct validity for performance and potential instruments → People Analytics M3 L4.**
The strongest of the three. That lesson already teaches *executable is not valid* for engagement
constructs. **Performance ratings and potential definitions are the same problem with far higher
stakes and no external referent** — and Analytics M2 already names performance data as "a rating
produced by the system you are evaluating." One paragraph extends a lesson that is already doing the
work, and it closes a real gap: the curriculum currently treats a rating as a *confounder* without
ever asking whether it measures anything.

**2. The agreement problem → Talent Development M4, or a CPO lesson.** *A competency framework is
free to produce and no cheaper to justify; the framework was never scarce, the agreement was.* This
is a good idea and it needs a home rather than a course. TD M4 (*where the machine stops*) is the
closest fit.

**3. Calibration as a designed process → HRBP.** What evidence is admissible, what a model may do
with a distribution (surface outliers) and may not (resolve a disagreement). **This is the LER line —
*a model may locate conflicts; only a human may resolve them*** — applied to ratings instead of
witness accounts, and it belongs with the function that runs calibration. Files as a new CP item.

**What would change this verdict.** If the product ever serves organisations large enough that
Talent Management is reliably its own function — 10,000+ people, where the architecture team is
distinct from both HRBP and L&D — the audience exists and the subtraction would be worth re-running
against a different assumption about who the learner is. **That is a market question, not a content
question**, and it should be asked that way.

## 7. What this exploration cost, and what it bought

It bought a correction to a claim I made in the issue register on thin evidence, three placed
lessons, and a documented reason the answer is no — so the next person to ask does not re-derive it.

**And it repeated a lesson worth recording:** the DEI assessment reached "no track," was overturned
by a human brief that reframed the role, and became `ai301-defensible`. This verdict is offered the
same way. **If someone can reframe Talent Management around a job I have not seen — not a topic list,
a job — the subtraction should be re-run rather than this document cited.** The reframe that would do
it is not "competencies and succession"; it is whatever makes the *instrument-design* work
consequential enough to carry six modules on its own.
