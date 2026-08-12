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
| HR Business Partner | `ai301-hrbp` | **Authored and shipped** — 7 modules |
| Recruiting / TA | `ai301-recruiter` | Outlined, not drafted |
| Compensation & Benefits | `ai301-comp` | Outlined, not drafted |
| Everything else | — | **Not started. This brief is for these.** |

---

## 2. The working pattern

This is how the three existing tracks were produced, and it worked. Keep it.

**Step 1 — Claude explores the role from the job.** Not from a template. Describe what the role's
actual week and year contain, find where AI meets it, then **subtract everything 101, 201, and
the other 301 tracks already teach.** What survives is the course. Write it as an exploration doc.

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

**The subtraction discipline is the highest-value move.** It kills the temptations every time.
Two that recur: a "document pipelines" module (that's 201 M3, whose worked example is literally
survey verbatims → themes → exec summary) and an "AI in your annual calendar" module (that's
201 M7, the operating rhythm). Both feel role-specific and are not.

**Depth modules are discovered from the role, never derived from a convention.** This rule
produced the three best modules in the curriculum — the recruiter track's intake module and
closed loop, and the comp track's craft layer. A template would have prevented all three.

**Every track's best material is role-unique.** Three for three. If a proposed track reads like
the HRBP track with different nouns, it is wrong.

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

**Any module with legal content carries a counsel-review gate stated in the content itself.**

---

## 5. What actually recurs across tracks (use as a check, not a template)

Three designs in, only four things recur, and only one carries teachable method:

1. **An opening prediction** — 3/3, same mechanism.
2. **Decompose your own job** — 3/3, the one genuinely shared *frame*. HRBP and recruiter use
   presence/contested-judgment quadrants; comp uses five work types (data assembly, analysis,
   judgment, explanation, governance) and it's better for that role. Adapt, don't copy.
3. **The floor** (legal/ethical limits) — 3/3 as a *position in the arc*, near-zero shared content:
   employment statutes vs. hiring statutes vs. ERISA and pay transparency.
4. **A closing bet with a baseline** — 3/3 in position and shape.

Everything in between is role-specific and is where the value is.

**Arc convention:** open with a prediction → decompose the job → **two to four role-discovered
depth modules** → the floor → close on a bet with a baseline and the delta reckoning.

---

## 6. The roles still to do

Listed with the analysis already done. The first is a recommendation, not a request.

**People Analytics / HR Technology — the biggest gap, and it isn't close.** Second-highest AI
adoption area in HR (~21%). They build or evaluate the models every other function consumes, they
are who actually runs the pay-equity regression the comp track assumes exists, and they are the
internal counterparty for every vendor claim the other tracks teach people to tear down. This is
also where 101 M7's assist/decide line either gets operationalized or quietly ignored.

**Talent Development / L&D.** Probably the sharpest test of the frames after People Analytics —
content production is the most AI-saturated work in the entire function, which likely inverts the
diagnosis module the way the comp track's did.

**Employee Experience / Internal Communications.** Note the likely overlap with the volume trap
(201 and the HRBP track's M3): cheaper content production is this role's central risk, not its
opportunity.

**People Ops / HR shared services.** High-volume, process-heavy, closest to being a 201 re-run —
which makes it the weakest test of the role-depth thesis and the one most at risk of failing the
subtraction discipline. Worth doing carefully or late.

**CHRO / CPO — flag before starting.** A specialist track goes deep in one role's craft. A CHRO's
job is cross-functional leadership, change management, and governance, which is exactly how 401 ·
The Translator is defined. **Check whether this audience belongs at 401 rather than as a 301
track** before outlining it as one.

Also raised and unresolved: **Talent Management** (performance, succession, calibration — is it
inside Talent Development or homeless?), **Labor & Employee Relations** (distinct in unionized
environments; ER documentation currently lives in HRBP M6), and **DEI** (heavy overlap with pay
equity and adverse impact; may be lessons rather than a track).

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
| `content/course-301-hrbp-outline.md` | The reference outline. Shipped. |
| `content/course-301-recruiter-outline.md` | Best example of integrating a human outline; see its Decisions section. |
| `content/course-301-comp-benefits-outline.md` | Contains the **spine test** — the honest analysis of what recurs. Read §"The spine test, revised". |
| `content/course-301-hrbp-exploration.md` | What a role exploration looks like, including the subtraction table. |
| `content/ai301-hrbp-m3-the-honest-arithmetic.md` | **Read one authored module for voice.** This one, or m4. |
| `content/course-201-outline.md` | What 301 must not re-teach. |
| `src/shared/roles.ts` | Track registration and the role→track resolver. |
