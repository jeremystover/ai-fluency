# CHRO / CPO — role exploration and the 301 placement check

**Status:** working exploration, not an outline. Fifth role explored, and the first where the
authoring brief asks a question before it asks for a track:

> **CHRO / CPO — flag before starting.** A specialist track goes deep in one role's craft. A
> CHRO's job is cross-functional leadership, change management, and governance, which is exactly
> how 401 · The Translator is defined. **Check whether this audience belongs at 401 rather than as
> a 301 track** before outlining it as one.

**This document runs that check.** It explores the role from the job first, as the other four
explorations did, then subtracts — not only against 101, 201, and the three 301 tracks, but
against **401's already-published definition**, which turns out to be the decisive subtraction.

**The answer, up front:** the CHRO/CPO does not get a 301 track. They are **401's primary
audience**, and the product has already said so in three places nobody has connected. What follows
is the evidence, the strongest case against that conclusion, and what to build instead — including
one interim fix that matters today, because the current routing sends a CHRO somewhere actively
wrong.

---

## 1. What a CHRO / CPO actually does

Not the job description — the calendar. Across a year:

- **The board and the comp committee.** The people section of the board deck, CEO succession,
  executive compensation, say-on-pay, and increasingly human-capital disclosure.
- **The executive team.** The people voice in business strategy — often the only person in the room
  whose job is the second-order effect on humans, and the CEO's closest counsel on it.
- **Owning the function.** HR's own structure, budget, operating model, technology stack, and
  talent. The CHRO is the only person in People whose direct product is *the function itself*.
- **Workforce strategy.** Headcount against the business plan, build/buy/borrow, location and cost
  strategy, and the multi-year shape of the workforce.
- **The big purchases.** The HRIS, the ATS, the talent platform. Seven-figure, multi-year, and
  increasingly sold on AI claims that the other tracks teach people to tear down — but the CHRO is
  who signs.
- **Crisis.** Reductions in force, executive misconduct, activist pressure, litigation, union
  campaigns, the thing that happens on a Friday.
- **Culture and change.** Major transitions — M&A integration, restructures, return-to-office —
  where the announcement is the easy part.
- **Governance and regulatory exposure.** Human-capital reporting, pay transparency regimes, and
  now AI governance, which is either theirs or happening without them.
- **External.** Peer networks, employer brand, and periodically being the public face of a decision
  nobody wants to own.

## 2. What's distinctive about it

Four properties, and every one of them is a *leadership* property rather than a craft property.
That is the finding, and it arrived before the subtraction rather than after.

**Their product is the function, not the work.** Every other role on the ladder produces artifacts —
a requisition, a merit cycle, an investigation summary, a curriculum. The CHRO produces an
*organization that produces those things.* A course that goes deep on their craft would be going
deep on org design, budget allocation, and executive influence, none of which is AI-specific and
all of which is 401's territory by definition.

**They are the most skeptical person in an optimistic room** `[V]`. This is the most interesting
thing verification turned up, and it inverts what the authoring brief assumed. Roughly 80% of
executives expect AI to improve bottom-line performance within three years — while **just 5% of
CHROs expect even half of HR's own work to be AI-enabled in that window**, and people leaders are
measurably the most cautious C-suite function on AI workforce readiness. The CHRO is not behind
their peers on enthusiasm. They are the designated skeptic at a table that has already decided,
which is a specific and lonely position with no analogue in the other four roles.

**They are structurally excluded from the decision they are accountable for** `[V]`. In 52% of
organizations, HR has no direct involvement in overall AI strategy; just 28% report HR is regarded
as a true strategic leader with a seat at the table, and a further 19% say HR is seen as a
strategic partner *and still excluded from core decision forums*. **The function most exposed to
AI's workforce consequences is not in the room where AI gets decided** — and fixing that is a
translation and influence problem, not a craft problem.

**Their AI decisions are all about other people's work.** A comp lead decides what AI may touch in
comp. A recruiter decides what it may touch in hiring. The CHRO decides what it may touch *across
every People function at once*, then has to make that decision stick in functions whose craft they
no longer practise daily. That is the definition of the Translator rung.

## 3. The subtraction — and the one that decides it

The usual subtraction runs first, and it is unusually brutal.

| Covered by | What it already gives a CHRO |
|---|---|
| 101 M2, M3 | Telling the shapes of AI apart; reading a vendor quote |
| 101 M7 | Assist vs. decide; the regulatory shape; saying no so it sticks |
| 101 M8 | Accountability, the agreement layer, disclosure, the policy skeleton |
| 201 M6, M7, M8 | People data in production; measurement without theatre; proving a result |
| HRBP M3 | The vendor-claim teardown, and where credible proof clusters |
| HRBP M5 | Arriving with a model rather than a story — the Finance conversation |
| HRBP M7 | Manager capability as product; the AI-coaching evidence |
| Recruiter R6 | The agent doctrine; bias audits; procurement questions before signature |
| Comp M4 | The written operating policy — red lines, approved uses, escalation |
| Talent Dev M5, M6 | Skills inference as a decision system; the case with a measure that can fail |

That removes procurement, policy drafting, vendor teardown, the business case, and the legal
floor — five of the six topics a CHRO track would obviously reach for.

**And then the subtraction that settles it.** 401 is not an empty placeholder. It is already
defined, already promised to learners in shipped content, and already wired into intake. Three
places, none of which were written with this question in mind, which is what makes them evidence:

**`content/modules.json` — the course row, already present:**

> *AI 401 · The Translator — Leading the multiplayer game: coaching other functions, evaluating
> vendors, running pilots that produce evidence instead of anecdotes — and owning the policy for
> what AI may touch.*

**`content/ai201-m8-ship-it-and-prove-it.md` — shipped, learner-facing:**

> *AI 401 · The Translator is the multiplayer game: helping other functions adopt AI with judgment,
> evaluating vendors without being sold to, running pilots that produce evidence instead of
> anecdotes, and owning the policy for what AI may touch.*

**`src/shared/goals.ts` — the two goals that route to `ai401`:**

> *Make the big calls — Understand enough to set direction: where your People org should use AI,
> where it must not, and how to decide.*
> *Bring everyone with me — Lead HR's adoption story: coach your team and the leaders you support
> instead of watching it happen to you.*

Read those three as a single specification and they do not describe a rung a specialist eventually
reaches. **They describe a CHRO's AI mandate, near-verbatim.** The product has been routing this
audience to 401 since intake was built; nobody had noticed because no CHRO role choice exists to
route.

### What survives both subtractions

Running the candidate list against everything above leaves exactly two topics that are
CHRO-specific and not already owned:

1. **Workforce planning under genuine uncertainty.** The headcount consequence of AI, decided
   before the evidence exists. HRBP M2 mentions the ratio pressure and recruiter R7 handles the
   headcount conversation honestly, but neither owns the decision itself.
2. **Redesigning the HR function itself.** The operating model question no other role can ask.
   Genuinely unowned, genuinely CHRO-only.

**Two topics is not a track.** It is two modules — and both are change-management and
organizational-design work, which is to say both are 401's subject matter arriving early.

## 4. The strongest case for a 301 track anyway

The discipline this curriculum applies to its module claims applies to its own recommendations, so
here is the best version of the argument against the conclusion above.

**The ladder is a sequence, and that is a real problem for this audience.** 401 sits above 301. A
CHRO who follows the path takes 101, then 201, then a 301 track — and the only 301 track that
would currently receive them is the HRBP track, which teaches the craft they stopped practising
fifteen years ago. Making the function's leader complete a specialist rung in someone else's
specialty before reaching their own material is a genuinely bad learner experience, and "they can
skip it" is not an answer the product currently supports.

**Every other People role gets a track; excluding the leader reads as an omission**, whatever the
architectural logic says.

**And the CHRO does have artifacts nobody else produces** — the board's people section, the
workforce plan, the CEO succession conversation. Artifact specificity is what the other four
tracks are built on.

**Why it loses anyway.** The first objection is real and is a *sequencing* problem, not a
*placement* problem — the fix is letting this audience enter at 401 directly, not manufacturing a
301 to occupy them on the way. The second is presentation, not architecture. The third is the
strongest, and it survives: those artifacts should be in 401, and 401 should be built to carry
them, which is a reason to build 401 well rather than a reason to build a 301.

## 5. Recommendation

**Do not build `ai301-chro`. Build 401, with the CHRO/CPO as its primary audience** — the first
course on the ladder whose audience is a named role rather than a proficiency level, which is
exactly what its own definition already implies.

Three consequences worth stating:

1. **This exploration is not wasted work; it is the start of 401.** Sections 1 and 2 are a role
   exploration for the course that should exist. The two surviving topics from §3 are its first
   two confirmed modules.
2. **401's audience is wider than the CHRO, and the CHRO anchors it.** A People-analytics lead
   owning model governance and an HRBP who has grown into leading change both belong there. Writing
   it for the CHRO makes the material concrete, in the same way the 301 tracks got sharper by
   naming one role. The other roles arrive as themselves rather than as junior CHROs.
3. **The skeptic finding should be 401's opening.** The CHRO is not behind and not an enthusiast —
   they are the most cautious executive in a room that has already committed, while being excluded
   from the decision in half of organizations. That is a stronger and more honest opening than the
   FOMO-reduction move the HRBP track opens with, because for this audience the anxiety is not
   *"am I behind?"* but *"am I about to be held accountable for a decision I wasn't in the room
   for?"*

### The interim fix, which matters today

A CHRO arriving right now picks **"Something else in People"** at intake and is routed to the HRBP
track, because `DEFAULT_TRACK` catches every unrecognized role. For most of the unbuilt roles that
fallback is reasonable. For this one it is actively wrong — it hands the function's leader a course
about advising managers on employee relations.

**And the naive fix is worse.** Adding a `chro` role that points at `ai401` would strand them on a
locked course with no modules — literally the "yours whenever" dead-end the brief names as the bug
this whole body of work started from. `trackForRole` guards against exactly this by falling back
when the wanted course isn't available, so the strand would not happen; the CHRO would silently
land on the HRBP track again, with the added cost of a role choice that promises something the
product cannot deliver.

**Proposed sequence, in order:**

1. **Now:** add a CHRO/CPO role choice whose `detail` is honest about the routing — that the
   leadership track is being built, and that the business partner track is the interim home. It
   resolves to `DEFAULT_TRACK` today via the existing fallback, so nothing breaks.
2. **When 401 ships:** point the role at `ai401` and let the resolver do the rest. One-line change.
3. **Not yet:** any `ai401` module rows. Same rule as the 301 tracks — rows only when the course is
   complete.

Whether to do step 1 now or wait is a product call, not a content one, and it is the question this
document most wants an answer to.

## 6. What 401 looks like, sketched

Not an outline — a shape, offered so the recommendation is actionable rather than abstract. It
deliberately does not follow the 301 arc convention, because 401 is a different course with a
different job and inheriting the convention would be exactly the error the brief warns about.

- **The skeptic's position.** Where this audience actually stands: most cautious executive in a
  committed room, excluded from AI strategy in half of organizations `[V]`. Opens with the
  prediction gate, per the convention that has held 4/4.
- **Getting into the room.** The translation problem stated as the course's central craft — what
  the other functions need from you that they cannot articulate, and why "HR should own AI
  governance" loses as an argument while specific competence wins.
- **Evaluating what you are being sold.** The teardown, aimed at seven-figure multi-year platform
  decisions rather than a single tool. The 301 tracks teach reading a claim; this teaches signing
  or refusing.
- **Pilots that produce evidence.** Already named in the published blurb. The discipline of a pilot
  with a falsifiable result, and what to do when the pilot's sponsor does not want one.
- **The policy that holds across functions.** Owning the assist/decide line for a whole function —
  and making it survive contact with people who will route around it.
- **Workforce planning under uncertainty.** One of the two surviving CHRO-only topics. Deciding
  headcount shape before the evidence exists, and saying so honestly to both the board and the
  affected.
- **Redesigning the function.** The other survivor. The HR operating model, when the function's own
  work is being compressed.
- **The close.** A governance position the learner commits to, with the delta reckoning.

## 7. Verification log

Run before writing, per the brief's rule. One check contradicted an assumption carried in the
brief itself.

| Claim | Status | Effect |
|---|---|---|
| HR has no direct involvement in AI strategy in 52% of organizations | **Confirmed with sample** — SHRM *State of AI in HR 2026*, n=1,908 HR professionals, fielded December 2025. The HRBP outline carries this figure without the sample; it should gain it | Anchors §2's exclusion finding |
| Only 28% report HR is regarded as a true strategic leader with a seat at the table; 19% strategic partner but excluded from core decision forums | **Confirmed** — same survey | Supporting, and sharper than the 52% alone |
| "≈90% of CHROs expect more adoption while over half have implemented none" | **Not confirmed, and current data points the other way.** The authoring brief cites this as a prior verification win reframing the HRBP module around an expectations gap. Current figures show CHROs as the *most cautious* C-suite function: just 5% expect half of HR work to be AI-enabled within three years, against ~80% of executives overall expecting bottom-line impact | **Changed the recommendation's framing.** 401 should not open on an expectations gap. The honest opening is that this audience is the designated skeptic in a committed room |
| ~80% of executives expect AI to improve bottom-line performance within three years | **Confirmed directionally** — Protiviti / Robert Half. Exact wording and sample need pinning before it anchors a module | The contrast that makes the skeptic finding land |
| 401's definition already describes the CHRO's mandate | **Confirmed in-repo** — `modules.json` course row, shipped `ai201-m8` prose, and the two `goals.ts` goals routing to `ai401` | The decisive subtraction |

**Unverified and blocking before 401 drafting:** the Protiviti figures' exact wording, sample, and
date; whether the 5% statistic is about HR work specifically or AI-enablement more broadly; current
human-capital disclosure requirements; and board-level AI governance expectations of the CHRO,
which were not researched here because they belong to 401's own verification pass.

## 8. Open questions

- **Do we add the CHRO/CPO role choice now, with honest interim routing, or wait for 401?** The
  only question in this document that blocks anything.
- **Is 401 one course or, like 301, a set of tracks?** The recommendation assumes one course
  anchored on the CHRO. A People-analytics governance lead and a CHRO have genuinely different
  weeks, and the 301 experience says role depth beats generic material 4/4 — but 401's audience is
  much smaller, and splitting it may not survive the arithmetic.
- **Does 401 inherit the 301 conventions?** The prediction gate has held 4/4 and should. The floor
  as a position is less obvious when the whole course is governance. The arc convention should not
  be inherited by default.
- **Does the ladder need a direct entry at 401?** Today it is strictly sequential. A sitting CHRO
  who tests out of 101 should probably not be required to complete a 301 track in someone else's
  specialty first. That is a product decision with real implications for the path UI.
- **Talent Management, Labor & Employee Relations, DEI** — still unresolved from the brief, and
  untouched here.
