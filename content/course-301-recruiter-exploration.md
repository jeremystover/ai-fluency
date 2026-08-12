# AI 301 · The Specialist — Recruiter / TA track, exploration (pre-outline)

**Status:** working exploration. Second role, and the one that tests the thesis — if HRBP and
Recruiter produce genuinely different courses, role tracks are the right unit. If they mostly
overlap, the unit is a shared spine with role-specific content, and we should know that before
drafting either.

**Method:** same as HRBP. Start from the job, subtract what 101/201 already teach, then — new
here — compare the survivors against the HRBP spine.

---

## 1. What a recruiter actually does

Intake with hiring managers. Sourcing and outreach. Screening. Interview loop design and
scorecards. Candidate communication, including the rejections. Offers and closing. Pipeline
reporting and forecasting. Employer brand and postings. Agency management. And compliance
record-keeping that most of the function treats as someone else's job until it isn't.

## 2. What's distinctive — and it's a lot

Five properties that make this role's relationship with AI different in kind from the HRBP's:

**AI is already here, and mostly not by choice.** SHRM's map puts recruiting at 27% — the most
AI-penetrated practice area in HR, against employee relations and org design at the bottom `[V]`.
The HRBP's problem is "where might this help?" The recruiter's problem is **"I am already
surrounded by AI I didn't evaluate, in a stack I didn't choose."** That inverts the opening
module rather than reusing it.

**This is where the legal line actually bites.** Mobley is a hiring case. NYC Local Law 144's
bias-audit regime is a hiring rule. The Illinois AI Video Interview Act is a hiring rule. The EU
AI Act's Annex III employment obligations are aimed squarely at recruitment and selection. And
101 M7's assist/decide line — *never score, rank, or filter people* — collides head-on with what
this role's entire vendor market sells. A recruiter's version of "The Line" is not one module
among seven; it may be the spine.

**Adverse-impact math is a job skill here, not background.** Four-fifths rule, pass-through rates
by group, the audit a bias-audit regime actually requires. HRBPs reason about disparate impact;
recruiters have to be able to compute it and read a vendor's audit critically.

**The counterparty is a hiring manager, not Finance.** Recruiters argue about requirements,
timelines, and "we'll know it when we see it," not about business cases. Same rhetorical
problem, entirely different content.

**And the one nobody has content for: candidates use AI too.** AI-written résumés and cover
letters at volume. AI-assisted answers in async video and take-homes. Proxy and deepfake
candidates in remote loops. Then the second-order problem, which is the real teaching: **every
"AI-detection" response to this is itself a screening decision about people**, with all of 101
M7's problems and worse false-positive costs. This has no HRBP equivalent, no coverage anywhere
in our curriculum, and it is the live operational problem for this role right now.

## 3. The subtraction

Same discipline as the HRBP track. Already owned and not re-taught: 101 M4 (tiers), 101 M6
(verification), 101 M7 (assist vs. decide — though this track stress-tests it hardest), 101 M8
(accountability, disclosure), 201 M2–M7 (packs, pipelines, verification budget, people data,
operating rhythm).

Specifically not a module, despite temptation: **"AI for sourcing and outreach at scale."** It's
201 M3 pipelines plus 201 M5 autonomy with recruiting nouns, and the interesting part — whether
volume outreach is a good idea at all — belongs in the honest-arithmetic module.

## 4. Candidate spine, and the comparison

Ranked, with each module's HRBP counterpart named:

| # | Recruiter module | HRBP counterpart | Relationship |
|---|---|---|---|
| R1 | **Where you actually are** — you're the most-penetrated function; almost none of it was chosen | M1 Where you actually are | Same *function*, **inverted data**. The HRBP is told they're further ahead than they feel; the recruiter is told they're more exposed than they realized. |
| R2 | **Sort your own job** — the funnel version | M2 Sort your own job | Same two-question frame; quadrants populate very differently. Large parts of recruiting (scheduling, formatting, logistics) are legitimately automatable in a way HRBP work isn't — and one part absolutely isn't. |
| R3 | **The honest arithmetic** | M3 The honest arithmetic | **Near-identical teaching.** Recruiters have real baseline data, so measurement is easier and vendor claims are louder — but the audit, the botsitting finding, and the teardown method are the same. |
| R4 | **Both sides of the table** — candidates use AI too, and every detection response is a screening decision | *(none)* | **Genuinely new.** The differentiator, and the module that proves role tracks aren't cosmetic. |
| R5 | **The line** — Mobley, LL144 audits, AIVI, Annex III, four-fifths math | M6 The line | Same module, **much heavier**, different statute emphasis, plus adverse-impact computation. HRBP's ER-documentation half is replaced by screening records and rejection rationale. |
| R6 | **Arguing with the hiring manager** | M5 Arguing with finance | Same rhetorical problem (story vs. evidence), different counterparty and different models — requirements calibration, pass-through data, time-to-fill against plan. |
| R7 | **Adversarial rehearsal** | M4 Adversarial rehearsal | **Same technique**, different scenarios: the intake conversation, the exec who wants a unicorn in three weeks, the offer that will be countered. |
| R8 | **Hiring manager capability** | M7 Manager capability as product | Same shape, different population — HMs writing JDs with AI, scoring candidates with AI, using AI mid-interview. The coaching-RCT evidence transfers intact. |

## 5. The finding

**Seven of eight map onto the HRBP spine. One is genuinely new.**

That is a much stronger structural signal than either exploration alone would have produced, and
it lands between the two hypotheses we've been arguing:

- It is **not** eight independent courses. Writing R3 from scratch after M3 would be writing the
  same module twice, with the same statistics, drifting apart under maintenance.
- It is **not** one spine with cosmetic role skins either. R4 has no counterpart, R5 changes
  weight class, and R2's quadrants invert. A learner in either track would notice a template.

What actually varies, module by module, is consistent enough to name:

| Layer | Varies by role? |
|---|---|
| The module's *question* (why this module exists) | **No** — shared across roles |
| The *frame* or method taught (the two-question test, the four-question audit, the adversary set, the teardown) | **No** — shared |
| The HR-wide *evidence* (botsitting, 87/75/50, the adoption map, the coaching RCT) | **No** — shared, and this is the volatile mass |
| Worked *examples*, quadrant contents, adversary sets, model types | **Yes** — fully role-specific |
| *Legal emphasis* and which statutes lead | **Yes** — and the weight differs sharply |
| Whether a module *exists at all* | **Sometimes** — R4 is recruiter-only |

The volatile mass — the statistics that will drift and that the maintenance agent will patch —
sits almost entirely in the **shared** rows. That is the architecturally important result: the
part most expensive to duplicate is the part that doesn't need to be.

## 6. What this implies for how we build

A proposal, for review rather than adoption:

**Shared frames, role-specific content, one authored source per role.** Each track is its own
course (`ai301-hrbp`, `ai301-recruiter`) so a learner sees only theirs — but the modules that
share a frame also share their *volatile evidence blocks*, authored once and referenced by both.
The `fd_content_block` schema already carries a `variant` column, and the maintenance agent walks
blocks rather than courses, so a shared volatile block gets patched once and both tracks stay
consistent by construction.

The alternative — full duplication — costs six copies of every HR-wide statistic by the time we
have six roles, each drifting independently. That is the failure mode worth designing against
now, while there are two tracks instead of six.

**This does not mean authoring a spine template and filling it in.** The order still matters: the
frames were *discovered* by exploring two roles independently and finding the overlap, which is
why R4 exists at all. Role three should be explored the same way, against the shared frames as a
hypothesis to break rather than a form to complete.

## 7. Open questions

- **Does R4 belong only to recruiters?** Candidate-side AI is sharpest in hiring, but AI-written
  ER complaints and AI-assisted performance self-reviews are the same problem arriving in the
  HRBP's inbox. Possibly a shared frame with very different weight — worth checking against role
  three before deciding.
- **Is R5 one module or two?** It was already the heaviest module in the HRBP track. For
  recruiters it gains statutes *and* adverse-impact computation. This is the likeliest place a
  role track legitimately needs a different module count.
- **Which role is three?** People Ops would test the frames against high-volume process work;
  L&D would test them against content production, which is the most AI-saturated work in the
  entire function. L&D is probably the sharper test.
- **Verification debt.** This track's legal module leans on Mobley's posture, NYC LL144's audit
  requirements, the Illinois AIVI Act, and Annex III timing — none yet verified, all blocking,
  and the same counsel gate as HRBP M6 applies with more weight.
