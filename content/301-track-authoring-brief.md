# AI 301 · Authoring brief for the remaining role tracks

**Purpose:** everything a fresh session needs to outline a new 301 role track to the same
standard as the three that exist. Read this, then the reference files listed at the bottom.

---

## 1. The product, in one screen

An AI-fluency course for **People / HR professionals**, delivered as an **async, self-serve web
app** — not a workshop, not a cohort, no live session. A learner reads modules, does AI-graded
activities, takes knowledge checks, and can work with an MCP-connected tutor. There is a podcast
surface that generates two-host episodes per module.

**The ladder is four rungs, and each rung names the audience for its course:**

| Rung | Course | |
|---|---|---|
| L1 · The Novice | AI 101 · Foundations | working mental model — **8 modules, shipped** |
| L2 · The Practitioner | AI 201 · The Practitioner | workflows that stick — **8 modules, shipped** |
| L3 · The Specialist | AI 301 · The Specialist | **your actual role, in depth — role-specific tracks** |
| L4 · The Translator | AI 401 · The Translator | cross-team leadership, change, governance — not started |

**301 is not one course.** It is a set of per-role tracks, each its own course id, and a learner
sees exactly one — resolved from the role they pick at intake (`src/shared/roles.ts`).

| Track | Course id | State |
|---|---|---|
| HR Business Partner | `ai301-hrbp` | **Authored, registered, seeded** — 7 modules |
| Recruiting / TA | `ai301-recruiter` | **Authored, registered, seeded** — 7 modules |
| Compensation & Benefits | `ai301-comp` | **Authored, registered, seeded** — 6 modules |
| People Analytics | `ai301-analytics` | **Authored, registered, seeded** — 6 modules |
| Employee Experience / Internal Comms | `ai301-excomms` | Authored — 10 modules, packages complete, **unregistered** |
| People Ops & HR Technology | `ai301-peopleops` | Authored — 8 modules, packages complete, **unregistered** |
| Talent Development / L&D | `ai301-talent-dev` | Authored — 6 modules, packages complete, **unregistered** |
| CHRO / CPO | `ai301-cpo` | Authored — 6 modules, packages complete, **unregistered** |
| Defensible by Design *(was DEI)* | `ai301-defensible` | Authored — 5 modules, packages complete, **unregistered** |
| Labor & Employee Relations | `ai301-ler` | Outlined — 8 modules; **2 drafted**, in progress |
| Everything else | — | **Not started. This brief is for these.** |

Only the first four are registered in `src/shared/roles.ts` and present in `content/modules.json`.
Everything below that line has content packages on disk and no rows anywhere — which is correct and
deliberate: module rows go in **only when a track is complete**, since locked rows render as an
unclickable dead end, and **registration is a single integration pass, not something each track does
for itself.** Several tracks were built in parallel by separate sessions; the reason the shared files
merge cleanly is that none of those sessions touched `modules.json`, `roles.ts` or `seed.sql`. Keep
it that way.

> **Before outlining or drafting anything, also read `301-cross-track-alignment.md`.** This brief
> says how to build a track. That register says what the track next to yours already owns, which
> corrections are outstanding against live content, and which boundaries are still unsettled. With
> ten tracks in flight it is the only place the boundaries are written down.

---

## 2. The working pattern

This is how the three existing tracks were produced, and it worked. Keep it.

**Step 1 — Claude explores the role from the job.** Not from a template. Describe what the role's
actual week and year contain, find where AI meets it, then **subtract** — under the two different
rules in §3a, because subtracting against 101/201 and subtracting against a sibling 301 track are
not the same operation and treating them the same produces a worse course. What survives is the
course. Write it as an exploration doc.

**Step 2 — Claude writes an outline** from the exploration.

**Step 3 — The human brings their own independently written outline.** Every time, theirs has been
better in specific places — usually because it carries current research with citations, and
because it comes from someone who knows the audience. Expect this and leave room for it.

**Step 4 — Integrate, honestly.** Say plainly which outline is the better spine and adopt it. Name
what is better in theirs, what must survive from Claude's, and what to cut from both. Do not split
differences to be diplomatic — in all three tracks, the human's spine won and two or three
specific things from Claude's were folded in.

**Step 5 — Verify the load-bearing citations before writing anything.** See §4.

---

## 3. Hard-won lessons that must transfer

**Explorations compare topics; outlines compare designs — and topics look far more alike than
designs do.** After comparing two *explorations* the claim was "7 of 8 modules map across roles."
After writing the actual outlines it was clear that was badly overstated. Do not conclude a
pattern from explorations.

**The subtraction discipline is the highest-value move** — see §3a for the two rules, which is the
one place this brief has been corrected since it was written.

**But subtract on designs, not topics — the same discipline, one step earlier, and it is easy to
miss.** The DEI exploration subtracted "adverse impact computation" because recruiter R6 has a
lesson with that name, and concluded there was no track. R6 teaches a recruiter to *read* a vendor's
bias audit; the track that survived teaches someone to *design and run the testing protocol under
privilege*. Same topic, different designs, and subtracting the first killed the second. The lesson
above about explorations-versus-outlines applies to the subtraction table too: **a shared topic is
not a shared design, and the subtraction step is where that mistake is cheapest to make and most
expensive to keep.** When a candidate topic appears to be owned, check what the owning module
actually *does* with it before crossing it off.

**Depth modules are discovered from the role, never derived from a convention.** This rule
produced the three best modules in the curriculum — the recruiter track's intake module and
closed loop, and the comp track's craft layer. A template would have prevented all three.

**Every track's best material is role-unique.** Six for six. If a proposed track reads like the
HRBP track with different nouns, it is wrong. Note what this claim is and isn't: it says the
distinctive material is *findable*, not that shared material must be *withheld*. Conflating those
two is what §3a corrects.

---

## 3a. The subtraction has two rules, not one

The original version of this brief said "subtract everything 101, 201, and the other 301 tracks
already teach." That is right about the first two and wrong about the third, and the reason is in
the product: **`trackForRole` resolves a learner to exactly one 301 course id.** No learner will
ever see two role tracks.

So the two subtractions are solving unrelated problems.

**Vertical subtraction — against 101 and 201 — is absolute.** Every learner took those rungs. Any
re-teaching bores them, wastes runtime that a 301 does not have, and signals the course does not
know what it already said. This is the discipline that kills the recurring temptations, and both
of the classic ones are vertical: a "document pipelines" module (201 M3, whose worked example is
literally survey verbatims → themes → exec summary) and an "AI in your annual calendar" module
(201 M7, the operating rhythm). Both feel role-specific and are not. **Nothing here relaxes.**

**Horizontal subtraction — against sibling 301 tracks — is not about the learner at all.** It
cannot be: they see one track. It is purely an authoring-and-maintenance concern, so it gets a
different rule:

> **Teach whatever the role actually needs, specialized to the role. Share the volatile evidence,
> not the prose.**

Three consequences.

**Duplication across sibling tracks is allowed and often correct.** If ER investigators need
documentation craft and HRBPs need documentation craft, both tracks teach it — because the
specialist version and the generalist version are genuinely different content, and the specialist
learner has never seen the generalist one. Writing a *cross-track prerequisite* to avoid the
duplication is the wrong fix: it sends a learner into another role's course for one lesson, which
is worse for them than a well-aimed duplicate.

**The real cost of duplication is drift, and it is severe here.** These tracks run ~80% volatile
against 101's ~20%, and `scripts/maintenance-agent.mjs` re-checks volatile blocks against the web.
Six copies of the EU AI Act timeline, the *Mobley* posture, or an adoption statistic will diverge,
and the divergence will be invisible until a learner or a reviewer catches two tracks disagreeing.
**This is what makes the shared evidence library (§5, "what to build") urgent rather than tidy** —
author the HR-wide facts once, reference them from every track, and let each track write its own
prose around them.

**Do still name the horizontal overlaps, in both directions.** Not to withhold content, but so the
copies stay reconcilable and so genuinely conflicting advice gets caught. The example worth
copying: the LER track's comparator lesson and the People Analytics track's natural-experiment
module use "comparison" to mean incompatible things, and one legal comparator is dispositive where
one data point is nothing. That note makes both tracks better and it is only visible from the
overlap.

**How to tell which rule applies:** ask whether *this learner* has already been taught it. If yes,
cut it. If it merely exists somewhere in the curriculum they will never open, that is a maintenance
note, not a reason to leave a gap in their course.

**Adapt workshop framing to the product, don't pivot the product.** All three human-written
outlines arrived as flipped-classroom designs with pre-work and a live "Demo Day." The product is
async. The conversions that worked: *artifacts brought to a room* → AI-graded activity
submissions; *claims argued in discussion* → a contestable claim stated in-content, with the
learner's position captured in the activity and graded on whether they engaged the strongest
counter-argument; *the Demo Day* → the closing reckoning. **Do not invent product surfaces.**
There is no learner-to-learner peer exchange (only an operator review queue, `fd_review`), and
`get_scenario_challenge` is the sorting exercise staged conversationally, not a debate tool.

**Score the delta, not the score.** Every module opens with a prediction; the final module gathers
them and asks what moved and why. Grade *evidence of updating*, never prediction accuracy. Put
this in the rubric's `activityContext` explicitly.

**Every module ends on a contestable claim — with a genuinely strong counter-argument.** Not a
strawman. Write the best version of the case against the module's own position and require the
learner to engage it. The best ones turn the module's technique on itself.

---

## 4. Verification is not optional, and it is not a final pass

Verify every load-bearing statistic **before drafting the module that uses it**, with web search.
This has changed content repeatedly, not just confirmed it:

- The HRBP outline said "31% of organizations haven't deployed AI at all." The finding is 31%
  have **no plans to launch AI initiatives** — different and stronger. The check also surfaced a
  better statistic (≈90% of CHROs expect more adoption while over half have implemented none)
  which reframed the whole module around an *expectations* gap rather than a peer gap.
- The comp track's coaching RCT check revealed that one author co-authored **both** the earlier
  positive study and the null result — self-correction, a much stronger story than two camps
  disagreeing.

Rules: **one anchor statistic per module**, everything else supporting or cut. If a figure comes
from a small sample, say so in the lesson — a module teaching learners to ask "what's the sample?"
must answer it about its own evidence. Mark every statistic, statute, vendor claim and product
detail as volatile layer `[V]`; these tracks run ~80% volatile against 101's ~20%, and
`scripts/maintenance-agent.mjs` re-checks volatile blocks against the web.

**A `[V]` figure carries its sample and date at the point of claim, not only in the sources block.**
Learned from an audit of the comp track, which declares *"the numbers, with their samples attached —
because a module about reading evidence has to model it"* and then states three figures bare in the
body with attribution only in its sources section. A reader who never scrolls to the sources block
has read an unattributed number, and the sources block is not where the claim does its work.

**When you resolve a blocking item, edit the blocking line — do not append the resolution below it.**
Same audit, second finding: the comp outline still lists items as "outstanding and still blocking"
130 lines above the record that resolves them, and still states a figure its own verification section
refutes. Appending is how a document ends up contradicting itself, and the next thread to read it
cannot tell which half is current.

**Any module with legal content carries a counsel-review gate stated in the content itself** — and
gets a row in `content/301-issue-register.md`, because nothing else tracks whether the review
actually happened.

**Facts shared across tracks belong in `content/evidence/`.** Horizontal duplication is sanctioned
(§3a), so the cost is drift rather than redundancy. Reuse the canonical wording from the library and
note in your sources block that you did; author role-specific evidence yourself.

---

## 5. What actually recurs across tracks (use as a check, not a template)

Six designs in, four things recur, and only one carries teachable method:

1. **A committed opening position** — 6/6, but **the mechanism changed.** The first three tracks
   opened each module on a numeric calibration prediction. That has been replaced course-wide by a
   **claim the learner must contest** — a factual assertion about their own organization, committed
   to before any content and then checked against evidence from their own systems. The critique that
   forced it: a confidence rating is self-report, and self-report is not evidence. "Score the delta"
   survives unchanged in purpose; the delta is now measured against artifacts. **The three shipped
   tracks still carry the old mechanism and need retrofitting** — `blocks.json` calibration prompts
   and `rubric.json` prediction fields across HRBP (7), recruiter (7), and comp (6), plus the
   thread in 101 and 201. Scope it as its own change.
2. **Decompose your own job** — 6/6, the one genuinely shared *frame*, and every track's axes are
   different: HRBP presence × contested judgment; recruiter throughput / insight / redesign; comp
   five work types; People Ops a decision register on reach × detection latency; People Analytics a
   verb ladder; LER an evidentiary ladder (observation → corroboration → inference → finding →
   determination). **Two of the last three are ladders rather than quadrants**, which is not a
   coincidence — a ladder is the right shape when the role's work has ordered rungs and AI's
   permission changes at each one. Adapt, don't copy.
3. **The floor** (legal/ethical limits) — 6/6 as a *position in the arc*, near-zero shared content:
   employment statutes vs. hiring statutes vs. ERISA and pay transparency vs. deployer obligations
   vs. the NLRA. Two tracks now need **two** counsel gates rather than one.
4. **A closing bet with a baseline** — 6/6 in position and shape. The newer tracks add a fourth
   term to the bet — *what you would turn off* — which works wherever the learner controls something
   already running.

Everything in between is role-specific and is where the value is.

**Also now 3/3 in the newer tracks:** the diagnosis and the decomposition **merge into one opening
module.** People Ops, People Analytics, and LER all arrived at it independently, because you cannot
build the decomposition artifact without the diagnosis that motivates it. Treat merging as the
default and a standalone diagnosis module as the thing that needs justifying.

**Arc convention:** open on a contested claim → decompose the job (merged with the diagnosis) →
**two to five role-discovered depth modules** → the floor → close on a bet with a baseline and the
delta reckoning.

---

## 6. The roles still to do

Listed with the analysis already done.

**Done since this brief was written — do not re-outline these.** The original "People Analytics / HR
Technology" entry has been split in two, because the model-builder and the systems-owner turned out
to be different jobs with opposite characteristics: `ai301-analytics` covers regression, validity,
and inference; `ai301-peopleops` covers the HCM, integrations, service delivery, and the enablement
decision. That split also absorbed the "People Ops / HR shared services" entry below, and it
rescued that role from being a 201 re-run — the systems-ownership spine is what the entry's
"weakest test of the role-depth thesis" warning was missing. **Labor & Employee Relations** is also
outlined; see the next paragraph for what it settled.

**What LER settled, and what it left open.** The unresolved note below asked whether it was a track
given that ER documentation lives in HRBP M6. It is a track, and the shipped module turned out to be
an asset rather than an obstacle: HRBP M6's knowledge check flags "comparing witness accounts" as
approaching credibility and stops there, and drawing the line it declines — *a model may locate
conflicts; only a human may resolve them* — is the track's signature module. Two things from it
generalize: **a role property can dictate product mechanics** (case facts may never be submitted, so
the spine sits at process level and rubrics need a rejection condition, not a caution), and **an
authority stack can be the lesson** (statute, Board doctrine, and General Counsel priorities move at
three different speeds, so advice built on the wrong layer expires). Still open: whether labor
relations eventually wants its own track in heavily unionized industries.

**~~Talent Development / L&D~~ — DONE.** Authored as `ai301-talent-dev`, six modules. The
hypothesis held: content production is the most AI-saturated work in the function, and the diagnosis
module inverted the way the comp track's did.

**~~Employee Experience / Internal Communications~~ — DONE.** Outlined as `ai301-excomms` ·
"After the Draft." The overlap hypothesis was right and the resolution is recorded as B-06 in the
alignment register: HRBP M3 owns the volume trap as a cost in *decisions*; this track re-aims it at
*attention* and states the delta rather than re-teaching it.

**~~CHRO / CPO~~ — DONE, and the 401 flag was checked rather than ignored.** Authored as
`ai301-cpo`, six modules. The concern raised here was real — a CHRO's job is cross-functional
leadership, change and governance, which is how 401 · The Translator is defined — so anyone revising
that track should read its outline's own account of where it drew the line against 401 before moving
anything.

**~~DEI~~ — RESOLVED, as a track, under a different name.** The overlap hypothesis was tested and
initially came back "no track" (`course-301-dei-assessment.md`, kept and marked superseded). That
was wrong — see the subtraction-on-designs lesson in §3. The track is `ai301-defensible` ·
"Defensible by Design," reframed away from program ownership toward the technical compliance
function for algorithmic people decisions. **Named for the capability, not the identity**, for
three reasons worth carrying to any future renaming question: "Culture and Belonging" mis-routes at
intake toward ERG and engagement work, which is the EX/comms track; it contradicts a module in its
own course that says relabeling isn't cover; and "DEI" in a course title is a deployment blocker for
a federal contractor certifying under EO 14173.

Also raised and still unresolved: **Talent Management** — performance, succession, calibration. Is
it inside Talent Development, or homeless? A `ai301-talent-dev` track now exists, which sharpens the
question rather than settling it: someone has to say whether calibration and succession are inside
it or still nowhere.

**And ask that question the way §3a says to.** "Heavy overlap with an existing track" is not an
argument against a track, because no learner ever sees two of them. The real test is whether there
is a *job* here — with a week and a year you can describe — and that is the test that produced every
good module so far. **DEI was the case that proved it.** It was listed here as probably-lessons on
overlap grounds, that reasoning was wrong, and it is now `ai301-defensible` — five authored modules,
reframed from programme ownership to the technical compliance function for algorithmic people
decisions, and **named for the capability rather than the identity** (see the naming argument
above). **Labor & Employee Relations** was resolved the same way and is now in progress at
`ai301-ler`; note it takes ER documentation, which currently lives in HRBP M6 — a change to live
content that has to be sequenced deliberately.

---

## 7. Mechanics, when it's time to draft (not needed for outlining)

Draft at `content/ai301-<role>-mN-<slug>.md` → `node scripts/convert-draft.mjs <draft> <moduleId>
<date>` → hand-tune the package under `content/modules/<moduleId>/`:
`blocks.json`, `micro.json`, `knowledge-check.json`, `rubric.json`, `sorting.json` **or**
`choice.json`, `activity.json`. Then add course + module rows to `content/modules.json`, register
the track in `src/shared/roles.ts`, run `node scripts/generate-seed.mjs`, and verify.

**Add module rows only when a track is complete** — locked rows render as an unclickable "yours
whenever" dead-end, which is the bug this whole body of work started from.

---

## 8. Read these

| File | Why |
|---|---|
| `content/301-cross-track-alignment.md` | **Read first, with this brief.** Boundaries, outstanding corrections, unsettled lines. |
| `content/course-301-hrbp-outline.md` | The reference outline. Shipped. |
| `content/course-301-ex-comms-outline.md` | Best example of a track whose diagnosis *inverts*, and of splitting the legal floor across two modules. |
| `content/course-301-defensible-outline.md` | Best example of naming a track for its capability, and of verification changing four claims in a source brief. |
| `content/course-301-recruiter-outline.md` | Best example of integrating a human outline; see its Decisions section. |
| `content/course-301-comp-benefits-outline.md` | Contains the **spine test** — the honest analysis of what recurs. Read §"The spine test, revised". |
| `content/course-301-hrbp-exploration.md` | What a role exploration looks like, including the subtraction table. |
| `content/ai301-hrbp-m3-the-honest-arithmetic.md` | **Read one authored module for voice.** This one, or m4. |
| `content/course-201-outline.md` | What 301 must not re-teach. **This subtraction is the absolute one** — §3a. |
| `src/shared/roles.ts` | Track registration and the role→track resolver. **Read `trackForRole` — it is why §3a exists.** |
| `content/course-301-ler-outline.md` | Two things worth copying: a role property dictating product mechanics (case facts may never be submitted, so the spine sits at process level), and an authority stack taught as the lesson. Its Decision 2 records the §3a reversal. |
| `content/course-301-peopleops-outline.md` | Best current example of integrating a human brief where **the layers split** — their unit of analysis won, the exploration's module discovery won. Read Decisions 1–4. |

**One method worth adding to §2.** The best module in the LER track came from reading a *shipped
sibling* for the line it declines to draw, not from exploring the role or from subtracting content.
HRBP M6 flags comparing witness accounts as "approaching credibility" and stops — correct for a
generalist, insufficient for a specialist, and resolving it became the track's signature. Where a
sibling track hedges on something central to your role, that hedge is a module.


**A counsel-review gate must be its own `## ` section, before the calibration prompt.**
`scripts/convert-draft.mjs` drops everything ahead of the first `## ` heading, so a gate written
into the draft's metadata header reaches no learner, no tutor and no podcast. Six shipped modules
lost their gate exactly that way (S-13) and nobody noticed until a later track's build note
predicted it. The converter now refuses to convert such a draft, but write it as a section in the
first place: `## ⚖️ Counsel review required`, stating what specifically moves in *this* module
rather than a generic disclaimer.

