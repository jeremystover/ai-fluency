# AI 201 · Module 6 — People data in production

**Course:** AI 201 · The Practitioner · Module 6 of 8
**Estimated time:** 30 min content · 10 min exercise · 25 min capstone activity
**Prerequisite:** none formally — but this module is a **strong prerequisite for M8**: nothing
ships without the boundary sheet you write here.
**Builds on:** 101 M1 Lesson 4 (what you paste) · 201 M2 (never infrastructure) · 201 M3 (pipeline steps) · 201 M5 (permissions, not hopes)

> `Concepts reviewed: [DATE] · Examples current as of: [DATE]`
> Lesson 3 is **[V]** volatile layer — agreements, retention, and deployment specifics move, and
> your deployment tailors them to your organization's actual contracts. The tiers and the
> person-test are stable: they will outlast every terms-of-service revision.

---

## Calibration prompt — before you start

*One claim and two numbers. The capstone scores them.*

> **"I could list every data element that flows through one run of my workflow."**

**True of me, or not true of me?** One sentence. The names inside a document count separately, which
is where most lists turn out to be incomplete.

**And the number**, which you will score in the applied activity:

Think about one full run of your workflow — everything that enters it.

1. **How many distinct data elements flow in per run?** (A document is one. A pasted table is
   one. The names inside them count separately.) A number.
2. **How many of those identify a person** — by name, or by description specific enough that a
   colleague could tell you who it is?

The second question has a trap in it, and the trap is the module.

## Module brief

In 101 you asked "what can I paste?" once, about one conversation, with your judgment fully
engaged. You learned the answer depends on the tool and the agreement, and you learned to find
out which situation you're in before pasting, not after.

Then you spent five modules building something that pastes on a schedule.

That's the shift this module exists for. A workflow asks the what-can-I-paste question every
run, forever — sometimes with your judgment engaged, eventually (M5) with an agent doing the
supplying and your judgment showing up only at defined gates. M2 planted the flag: **people data
must never become infrastructure.** This module builds the whole fence: a tier system for
inputs, redaction and minimization as *designed pipeline steps* rather than good intentions,
the agreement layer underneath it all, and — because honesty beats optimism — the escalation
path for the day something goes through anyway.

One reframe before we start, because it changes the mood of everything that follows. This
module is not the compliance tax on the fun modules. In People work, the data boundary *is* the
product: an exec who trusts your workflow's boundary sheet will let you run things no other
function gets to run, and an exec who doesn't will shut down your best build over one
carelessly pasted export. The boundary work is what makes the rest of the course deployable.

---

## Learning objectives

By the end of this module you should be able to:

1. Tier any input — public, internal, person-identifying, protected — in seconds, including the
   descriptions-without-names that fail the tier test people expect them to pass.
2. Apply the person-test to a run: could this run be shown to the person it concerns?
3. Design redaction and minimization as pipeline steps, and spot the re-identification traps
   that survive naive redaction.
4. Say which agreement situation your organization is in, and what each tier is permitted to
   touch there. **[V]**
5. Run the escalation path from memory — because the day it's needed is the wrong day to draft it.

---

## Lesson 1 · The tiers

Four tiers. The skill is speed — tiering should take seconds per input, which is why there are
four and not eleven.

**Tier 1 · Public.** Already published or publishable without a thought: your careers page, the
public holiday calendar, a job posting. Goes anywhere your organization permits AI use at all.

**Tier 2 · Internal.** Not secret, not personal: policy text, the org context brief from M2,
process docs, aggregated metrics that don't isolate individuals. The workhorse tier — most
workflow inputs should live here, and a well-designed pipeline (Lesson 2) *makes* them live
here. Permitted in your organization's sanctioned deployment; never in a personal consumer
account, which 101 already told you and Lesson 3 makes contractual.

**Tier 3 · Person-identifying.** Anything that points at an identifiable individual: names in
interview notes, a single person's compensation, performance commentary, an email thread with
an employee. Here's the trap from the calibration prompt: **identification doesn't require a
name.** "The only woman on the Denver sales team." "Our newest director, the one who joined
from the retailer." "The employee on leave since March." If a colleague could tell you who it
is, it's Tier 3, whatever the redaction looked like. Tier 3 may enter a run — *fresh, minimized,
under that run's judgment, in a sanctioned deployment* — and it never enters infrastructure:
not packs, not instructions, not runbooks, not saved artifacts that outlive their purpose.

**Tier 4 · Protected.** The material where a mistake isn't embarrassing but reportable: health
and medical information, investigation files, protected characteristics, anything under legal
hold or active dispute. Default answer: **it doesn't go in.** Not "be careful" — doesn't go in,
absent an explicit, named, written clearance from whoever owns that risk in your organization
(usually legal), for a specific purpose, in a specific deployment. If your workflow seems to
need Tier 4 routinely, the finding isn't "get clearance routinely"; it's M1's finding — this
shouldn't be a workflow.

**The person-test**, which compresses the whole tier system into one question you can ask at
the checkpoint pause:

> **Could this run — inputs, prompts, and outputs — be shown to the person it concerns?**

Not "would it be comfortable." Could it be shown without breaching a confidence, exposing
someone's health or dispute, or revealing that their treatment was shaped by material they've
never seen? A run that passes is almost always tiered right. A run that makes you wince is
telling you which input to go re-tier.

---

## Lesson 2 · Redaction and minimization, as steps

Good intentions redact; pipelines redact *reliably*. The difference is where the redaction
lives — and M3 already gave you the answer: it's a step, with a checkpoint, at the front.

**Step zero.** Sensitive workflows get a preparation step before the model sees anything: the
raw export goes in, the minimized artifact comes out, and the checkpoint is a human glance at
*that artifact* — not at the raw file — before anything proceeds. In M5 terms, later steps
never even hold the unminimized material: permissions, not hopes, applied to data.

**Minimization first, redaction second.** The stronger move is not masking what's sensitive —
it's not carrying it at all. Ask the M1 question in reverse: *what does this transformation
actually need?* The debrief pipeline needs the candidate's interview evidence; it doesn't need
their address, their current employer, or their salary expectations, and a step-zero that
extracts only competency-relevant material outperforms any masking of the rest. Then redact
what remains: roles for names ("Candidate A," "the manager"), buckets for exact figures, dates
coarsened to what the analysis needs.

**The re-identification traps** — the three ways naively redacted material stays Tier 3:

- **Small-n.** "One of the three engineers on the platform team said…" is a name with extra
  steps. Aggregations below a floor (five is a common one; your org may set its own) stay
  identifying no matter how neutral the wording.
- **Distinctive detail.** Tenure + office + role narrows to one human fast. The Denver survey
  pipeline from M3 handled concentration honestly at the *theme* level — "concentrated in
  Denver" — without quoting the one comment whose phrasing everyone in Denver would recognize.
  Both halves of that were design choices.
- **Convergence.** Each artifact is clean; the set is not. The theme table says Denver, the
  quote mentions a product launch, the narrative mentions tenure — assembled, they point at one
  person. This is why the person-test runs on *the run*, not on each artifact separately.

**And the boundary between judgment and infrastructure, restated as practice.** A Tier 3 run
ends with hygiene: the fresh material leaves with the run. Artifacts that persist — saved
tables, audit logs, the M8 portfolio — persist in their minimized form. If you find Tier 3
material accumulating anywhere a future conversation can see, you've rebuilt the thing M2
prohibited, one convenient save at a time.

> ### Try this — 3 minutes
> Take a real artifact from your workflow's last run — the theme table, a debrief, whatever
> exists.
>
> 1. Run the person-test on it.
> 2. Hunt specifically for the three traps: small-n, distinctive detail, convergence with its
>    sibling artifacts.
> 3. If it passes clean, ask the sharper question: did it pass by design, or by luck? A step
>    zero is the difference.

---

## Lesson 3 · The agreement layer **[V]**

*Volatile layer: contracts, retention, and deployment specifics change — and differ by
organization. Your deployment tailors this lesson to your actual situation; the questions below
are the stable part.*

Everything in Lessons 1–2 assumed a phrase: "sanctioned deployment." Here's what stands behind
it, and what you need to know about yours — not to negotiate it, but to stop being wrong about it.

**The situations, in rising order of what they permit.** A personal consumer account: your
agreement, not your employer's; Tier 1 only, and honestly not even that for work purposes if
your org has a sanctioned alternative. A business/enterprise deployment: the organization's
agreement, typically with commitments that customer data isn't used for training and with
admin-controlled retention — this is usually what "sanctioned" means, and where Tier 2 lives
comfortably and Tier 3 can enter runs under the rules above. Deployments with a data processing
agreement and security review: where your org has done the diligence that makes the Tier 3
rules defensible rather than hopeful.

**The four questions that define your situation** — get the answers from whoever owns the
deployment (IT, security, legal), write them into your boundary sheet, and re-verify on your
volatile cadence:

1. Which tools are sanctioned, and which account am I actually signed into right now?
2. Is our data used for model training, and where's that written?
3. What's the retention — how long do conversations and uploads persist, and who can delete?
4. Who owns this contract, and who do I call when something goes wrong? (Lesson 4 needs this
   name.)

**If nobody has these answers,** 101 said the gap is worth raising; the practitioner's version
is stronger: the gap is *your finding*, and surfacing it — "I built a workflow worth running
and can't determine whether it's permitted" — is exactly the kind of contribution that gets a
People leader invited into the AI governance conversation. That's AI 401's whole territory;
you're allowed to arrive early.

**The provisional boundary sheet.** What the gap must not do is stop the course. IT, security,
and legal answer on their calendars, not yours, and a question in flight is not a reason to
stall a build for a month. The mechanism: any unanswered question is marked **UNKNOWN**, with
the owner you asked and the date you asked them. The sheet's status becomes **provisional —
sign-off pending**, and while it stays provisional the workflow runs under the most restrictive
plausible answers: Tier 2 ceiling, no Tier 3 inputs, nothing above draft-only autonomy for
steps the unknowns touch. M8 accepts a provisional sheet — the gap rides visibly on the index
page, where a reviewer sees it before anything else. A provisional sheet with named unknowns
and recorded pursuit is a working control. A course stalled on someone else's inbox is not.

**MCP note, because M5 opened the door:** every server your agent connects is part of the
agreement layer. A document store connected to Claude is data flowing under *some* agreement —
the four questions apply to it, per server, and "read-only" answers the ladder question, not
the agreement question.

---

## Lesson 4 · When it goes wrong anyway

Someone will paste the wrong thing. Possibly you. The measure of a practitioner isn't a
spotless record — it's whether the bad day was handled in minutes by a path written in
advance, or improvised in a panic and half-hidden.

**The path, four steps, in order:**

1. **Stop the run.** Don't finish the pipeline, don't let staged actions fire, don't "just get
   this output first."
2. **Record the facts while they're fresh:** what went in, which tool and account, when, what
   the material contained, whether outputs were produced or actions taken. Five minutes,
   written down.
3. **Tell the deployment owner** — the name from Lesson 3, question 4. They know what the
   agreement provides: deletion mechanisms, retention overrides, whether this rises to a
   notifiable event. **[V]** Provider deletion and retention controls vary by tool and tier of
   contract; that's their lookup, not your guess.
4. **Fix the system, not just the moment.** M4's reflex, one more time: how did the material
   get to the model? A missing step zero, a raw file where a minimized artifact belonged, a
   pack that quietly accumulated? The incident is data about the workflow. Spend it.

**And the culture line, which is also a design line:** the escalation path only works if using
it is safe. A team where a wrong paste means quiet shame produces hidden incidents, and hidden
incidents are the only truly unmanageable kind. You're a People leader; you already know this
pattern from every other kind of incident. It applies to this one.

### Exercise — Tier the inputs

*Five minutes. Commit before you look.*

Ten inputs headed into a People team's workflows. Tier each: **1 Public · 2 Internal · 3
Person-identifying · 4 Protected.**

1. The employee handbook, current version
2. This week's interview notes on four named candidates
3. An engagement survey theme table: counts by office, no quotes, smallest group is 47
4. A comment from that survey: "as the only nurse on the night shift, I feel unheard"
5. The comp philosophy one-pager
6. A spreadsheet of salaries by employee ID (names removed)
7. An email thread about an employee's accommodation request
8. Your published careers page
9. Exit interview notes: "a senior engineer, here 11 years, leaving over the reorg"
10. The plain-language benefits FAQ your workflow produced last week

The pattern, stated in advance:

> **Tier by what a reader could learn, not by what a label says.** Names removed isn't
> identity removed; aggregated isn't always anonymous; and health, investigations, and
> accommodations are Tier 4 wherever they appear — even one sentence deep in a thread.

---

## Capstone stage 6 · The boundary sheet

One page that makes your workflow deployable. This is the document M8 checks at the door, and
the one an exec or security reviewer reads first.

**Submit:**

1. **The input census** — every input from your M3 pipeline design, tiered, with one clause of
   reasoning where the tier isn't obvious. Score your calibration from the top of the module:
   both counts, both misses, direction named. (The usual miss: Tier 3 hiding in "descriptions
   without names.")
2. **The mitigations** — for anything Tier 3: the step zero that minimizes it, what the
   minimized artifact looks like, and where the person-test runs. For anything Tier 4: the
   removal — or the named, written clearance, if you genuinely hold one.
3. **The agreement answers** — Lesson 3's four questions, answered for your actual deployment,
   with the source of each answer and its re-verify date. "I don't know yet, and here's who
   I've asked" is an honest, gradeable answer; a guess is not. If any answer is UNKNOWN, mark
   the sheet **provisional**: record the owner and date asked, state the lowered ceiling you're
   operating under until it lands, and carry the status line forward — it appears on your M8
   index page until the sign-off completes.
4. **The escalation card** — the four steps with your organization's real names and channels
   filled in, short enough to use mid-incident.
5. **The sign-off line, extended** — your M4 sign-off now reads the boundary too: one sentence
   adding the person-test (and, where relevant, the minimized-artifact check) to the owner's
   reading list.

### Rubric — 20 points

| Dimension | 5 points |
|---|---|
| **Tier honesty** | The census is complete and the tricky calls — descriptions, small-n, convergence — are caught and reasoned, not waved through. |
| **Mitigation matches tier** | Step-zero designs are real pipeline steps with checkpoints; Tier 4 handling is removal or named clearance, never "carefully." |
| **The agreement layer is factual** | Four questions answered from sources, not assumptions; unknowns owned honestly with a pursuit plan. |
| **Calibration** | Both counts predicted first, scored against the census, direction of error named. Honesty and specificity graded; accuracy never. |

---

## Key takeaways

- **A workflow asks "what can I paste?" every run, forever** — so the answer has to live in the
  design, not in the mood of the person running it.
- **Four tiers, seconds each:** public, internal, person-identifying, protected. Identification
  doesn't require a name; a description a colleague could resolve is Tier 3.
- **The person-test:** could this run be shown to the person it concerns? Run it on the run,
  not the artifact — convergence is the trap that survives per-artifact checks.
- **Minimize before you redact; redact as a step, not an intention.** Step zero, checkpoint on
  the minimized artifact, later steps never hold the raw material.
- **Tier 4 doesn't go in.** Routine need for Tier 4 means it shouldn't be a workflow — M1's
  finding, arrived at from the data side.
- **Know your agreement situation, and the name you'd call.** [V] The four questions, answered
  and dated, are what "sanctioned" actually means. Unanswered questions make the sheet
  provisional — lowered ceiling, pursuit recorded, gap visible — not the course stuck.
- **The escalation path is written before it's needed, and safe to use** — because hidden
  incidents are the only unmanageable kind.

---

## Exercise key — Tier the inputs

**1. Handbook — Tier 2.** Internal, impersonal, the workhorse tier. (Public *if* yours is
published; most aren't.)
**2. Interview notes, named candidates — Tier 3.** The canonical case: enters fresh, minimized
by step zero, leaves with the run.
**3. Theme table, min group 47 — Tier 2.** Aggregation above any reasonable floor, no quotes.
This is what good step-zero output looks like — Tier 3 in, Tier 2 artifact out.
**4. "Only nurse on the night shift" — Tier 3.** No name, full identification. Small-n and
distinctive detail in one sentence; this is the calibration prompt's trap in the wild.
**5. Comp philosophy — Tier 2.** Principles, not people. (One person's *salary* is Tier 3;
the philosophy never is.)
**6. Salaries by employee ID, names removed — Tier 3.** IDs resolve to people by design;
"names removed" is the label, not the fact. With small teams, even bucketed versions need the
small-n floor.
**7. Accommodation request thread — Tier 4.** Health-adjacent by nature. Doesn't go in —
including "just to summarize it." If accommodation workflows need support, that's a
sanctioned-system conversation with legal in the room, not a pipeline decision.
**8. Careers page — Tier 1.** Published is published.
**9. "Senior engineer, 11 years, leaving over the reorg" — Tier 3.** Distinctive-detail trap:
tenure + seniority + context resolves fast in most orgs. Step zero coarsens it to what the
exit-themes analysis needs.
**10. The benefits FAQ your workflow produced — Tier 2, and worth the double-take.** Outputs
have tiers too. This one's clean by construction *if* the pipeline was — which is why M4
sampling includes a boundary glance, and why artifacts persist minimized.

**If you tiered 4, 6, or 9 at Tier 2,** you've found your pattern: you're tiering by label
(name present/absent) rather than by what a reader could learn. That's the module's central
correction, and it's fixable by running the person-test twice more this week.

---

## Knowledge check — 8 questions

*Unlocks after the boundary sheet is submitted. Retakes are free and unlimited.*

**Q1.** Why does a workflow change the "what can I paste?" question from 101?
- A. Workflows process larger volumes of data
- B. The question now gets asked every run, forever — eventually by an agent — so the answer must live in design, not per-moment judgment ✓
- C. Workflows are subject to different regulations than conversations
- D. It doesn't — the question is identical

> **B.** One conversation gets your full judgment; a scheduled pipeline gets whatever the
> design encoded. That's the entire case for tiers, step zero, and the boundary sheet.

**Q2.** "The only woman on the Denver sales team said…" is Tier 3 because:
- A. Survey comments are always person-identifying
- B. Identification doesn't require a name — a description a colleague could resolve to one person identifies them ✓
- C. Denver is a small office
- D. It isn't — no name appears, so it's Tier 2

> **B.** The tier turns on what a reader could learn, not on whether a name-shaped string is
> present. Small-n and distinctive detail are how "anonymous" material stays identifying.

**Q3.** The person-test runs on the whole run rather than each artifact because:
- A. Testing artifacts individually takes too long
- B. Individually clean artifacts can converge — assembled, they point at one person ✓
- C. Only final outputs matter for privacy
- D. The test requires seeing the original inputs

> **B.** The convergence trap: theme table + quote + narrative, each fine alone, jointly
> identifying. Run-level review is the only place that failure is visible.

**Q4.** Minimization beats redaction as the primary move because:
- A. Redaction tools are unreliable
- B. Material you never carry can't leak, converge, or be re-identified — the transformation should receive only what it needs ✓
- C. Minimized documents use fewer tokens
- D. Redaction is only required for Tier 4

> **B.** Masking what remains is the second line; not carrying it is the first. It's the M1
> what-does-this-need question, pointed at data instead of capability.

**Q5.** Your workflow turns out to routinely need investigation files to function. The module's conclusion:
- A. Get a standing legal clearance for the workflow
- B. Add a stronger redaction step
- C. This shouldn't be a workflow — routine Tier 4 need is M1's should-this-exist finding, reached from the data side ✓
- D. Run it only in the enterprise deployment

> **C.** Tier 4's default is "doesn't go in," and a *routine* need isn't a mitigation problem.
> A and B engineer around a finding; the finding is about the workflow's existence.

**Q6.** The four agreement-layer questions establish: **[V]**
- A. Whether AI use is permitted at your organization at all
- B. Which tools are sanctioned, whether data trains models, what retention applies, and who owns the contract ✓
- C. The price tier of your organization's deployment
- D. Which model versions are approved

> **B.** Those four answers, sourced and dated, are what "sanctioned deployment" concretely
> means — and question four's name is the escalation path's third step.

**Q7.** The strongest reason the escalation path must be blame-safe:
- A. Blame slows down incident response
- B. Hidden incidents are the only truly unmanageable kind — shame produces hiding ✓
- C. Most incidents turn out to be harmless
- D. Legal requires no-fault reporting

> **B.** Every other property of the path — speed, facts, the right name — depends on the
> incident being surfaced at all. A People leader already knows this pattern; this is it, again.

**Q8.** After a wrong paste, the fourth step — "fix the system, not just the moment" — means:
- A. Retrain everyone on data handling
- B. Trace how the material reached the model (missing step zero, raw file, accumulating pack) and change that design ✓
- C. Add an approval gate to every step
- D. Retire the workflow

> **B.** M4's reflex applied to boundaries: the incident is diagnostic data about a specific
> design gap. A, C, and D are moods — broad, expensive, and unaimed.

---

## Sources and attribution

Builds on 101 M1 Lesson 4 (the paste gradient; find out which situation you're in) and 201
M2/M3/M5 (never-infrastructure, step design, permissions-not-hopes). The four-tier system and
the person-test are this course's packaging; the re-identification material and the small-n
floor sit on an established disclosure-control literature, which is where a privacy counsel or
a data-literate reviewer will (correctly) look for the load-bearing claims:

*To be verified against editions and current URLs before publication; the regulatory items move
— re-check with counsel on the Tier 1 quarterly cadence.*

1. **Sweeney, L. — "k-Anonymity: A Model for Protecting Privacy," *International Journal of
   Uncertainty, Fuzziness and Knowledge-Based Systems* 10(5) (2002).** The formal basis for
   the small-n idea: a record is only as anonymous as the size of the group it hides in.
2. **Narayanan, A. & Shmatikov, V. — "Robust De-anonymization of Large Sparse Datasets,"
   *IEEE Symposium on Security and Privacy* (2008).** Re-identification through auxiliary
   information — the convergence trap, demonstrated at scale on data everyone thought was clean.
3. **Hundepool, A. et al. — *Statistical Disclosure Control* (Wiley, 2012).** The official-
   statistics treatment of threshold rules. Lesson 2's "five is a common floor" reflects
   national-statistics practice, where minimum cell sizes of roughly three to ten are standard;
   the module's advice stands: set your organization's floor deliberately, don't inherit one.
4. **HIPAA de-identification standard, 45 CFR §164.514 [V].** Safe Harbor and Expert
   Determination — the US regulatory version of tiering and minimization, and useful precedent
   language when writing your own floor.
5. **Article 29 Working Party — Opinion 05/2014 on Anonymisation Techniques [V].** The EU
   analysis of why "names removed" is not anonymized — the regulator's version of this
   module's central correction.

Lesson 3 and marked passages are volatile layer — agreement and retention specifics verified
per deployment, on the stamp date's cadence, with counsel where it counts.
