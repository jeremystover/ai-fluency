# AI 301 · The Specialist — CPO / CHRO track, exploration and the placement check

**Status:** role exploration, plus the record of a placement check that returned the wrong answer.
The outline is at `course-301-cpo-outline.md`.

**Why this document keeps its wrong answer.** The authoring brief asks for a check before any CHRO
track gets outlined — does this audience belong at 401 rather than 301? The check ran and concluded
**401**. That was overturned by a market teardown and an actual design. The reasoning is preserved
rather than deleted because **the failure mode is one the brief already warns about**, it will
recur on the roles still to do, and a curriculum that teaches evidence hygiene should keep its own
corrections visible.

**The verdict, corrected:** the CPO / CHRO gets a 301 track, `ai301-cpo`. **401 remains the L4 rung
for everyone**, not a CHRO course.

---

## 1. What a CPO / CHRO actually does

Not the job description — the calendar. Across a year:

- **The board and the comp committee.** The people section of the board deck, CEO succession,
  executive compensation, say-on-pay, human-capital disclosure.
- **The executive team.** The people voice in business strategy — often the only person in the room
  whose job is the second-order effect on humans, and the CEO's closest counsel on it.
- **Owning the function.** HR's own structure, budget, operating model, technology stack, and
  talent. The CPO is the only person in People whose direct product is *the function itself*.
- **Workforce strategy.** Headcount against the business plan, build/buy/borrow, location and cost
  strategy, the multi-year shape of the workforce — and now whether agents belong on that plan.
- **The big purchases.** Seven-figure, multi-year, increasingly sold on AI claims, and signed here.
- **Crisis.** Reductions in force, executive misconduct, activist pressure, litigation, union
  campaigns, the thing that happens on a Friday.
- **Culture and change.** M&A integration, restructures, return-to-office — where the announcement
  is the easy part.
- **Governance and regulatory exposure.** Human-capital reporting, pay transparency, and now AI
  governance, which is either theirs or happening without them.
- **External.** Peer networks, employer brand, and periodically being the public face of a decision
  nobody wants to own.

## 2. What's distinctive about it

**Their product is the function, not the work.** Every other role on the ladder produces artifacts —
a requisition, a merit cycle, an investigation summary, a curriculum. The CPO produces an
*organization that produces those things*. This is the property that makes their track look
unlike the other four, and it is why the outline's M4 (restructuring your own function) has no
analogue anywhere else in the curriculum.

**They are the most skeptical person in an optimistic room** `[V]`. Roughly 80% of executives
expect AI to improve bottom-line performance within three years, while just 5% of CHROs expect even
half of HR's own work to be AI-enabled in that window; people leaders are measurably the most
cautious C-suite function on workforce readiness. **The CPO is not behind their peers on
enthusiasm. They are the designated skeptic at a table that has already decided** — a specific and
lonely position with no analogue in the other four roles, and the correct design premise for the
track.

**They are structurally excluded from the decision they are accountable for** `[V]`. In 52% of
organizations HR has no direct involvement in AI strategy; 28% report HR is regarded as a true
strategic leader with a seat at the table, and a further 19% say HR is seen as a strategic partner
*and still excluded from core decision forums*.

**Their AI decisions are all about other people's work.** A comp lead decides what AI may touch in
comp. The CPO decides what it may touch across every People function at once, then has to make it
stick in functions whose craft they no longer practise daily.

**And the market has not served them.** Reading "best for" lines across the field: AIHR targets HR
professionals and generalists, Bersin mid-level to senior leaders, Wharton's CHRO Program
*aspiring* CHROs. The closest fit is a three-hour briefing. **The sitting CPO with P&L exposure, a
board relationship, and a peer C-suite fight to win is effectively unserved.**

## 3. The placement check, and why it returned the wrong answer

The check subtracted candidate CHRO topics against 101, 201, the four 301 tracks, and 401's
published definition, and concluded that only two survived — workforce planning under uncertainty,
and redesigning the HR function. Two topics is not a track, so the recommendation was 401.

**Two errors produced that.**

**Error 1 — subtracting topics instead of decisions.** Asked *"is vendor evaluation covered?"* the
answer is yes, in three places, so a scope-fight module looked redundant. It isn't: the module is
not about evaluating a vendor, it is about **whether digital labor is workforce and who owns the
registry.** Asked *"is policy covered?"* the answer is yes, comp M4, so governance looked
redundant. It isn't: the module is not about drafting a policy, it is about **owning a trust
deficit you do not control.**

The brief predicts this exactly:

> *Explorations compare topics; outlines compare designs — and topics look far more alike than
> designs do.*

That warning was written about concluding tracks are *similar*. It cuts the other way too: **a
topic-level subtraction against a role you have explored but not designed for produces false
negatives.** Four modules that nothing in the curriculum touches were invisible until a design
existed.

**Error 2 — reading 401's blurb as an audience spec rather than a rung spec.** The published
definition — coaching other functions, evaluating vendors, running pilots, owning policy — describes
what an L4 Translator does *regardless of role*. An HRBP who grows into leading change does all of
it. Treating it as a CHRO job description would have narrowed 401 wrongly and left every other role
without a destination.

**What the check got right, and should be kept:** the role's distinctive properties are leadership
properties (§2), and that finding now *supports* the track instead of arguing against it. It is why
this track's modules are about scope, cutting, trust, and defensible numbers rather than craft.

## 4. The 401 boundary, restated

401 is the rung where a specialist learns to lead beyond their own function — **for everyone**.

The CPO is the one role that arrives at 301 *already* leading beyond their function, which is why
their 301 resembles other people's 401. The honest consequence: **a CPO who completes `ai301-cpo`
may find 401 reinforcing rather than necessary.** That is a property of this role, not a defect in
the ladder, and the path should not pretend otherwise.

Nothing here changes what 401 should contain or who it is for.

## 5. The routing fix, which now has a clean answer

A CPO arriving today picks **"Something else in People"** at intake and is routed to the HRBP track
by `DEFAULT_TRACK` — a course about advising managers on employee relations. Wrong for this
audience, and worth fixing rather than tolerating.

The earlier version of this document proposed an awkward interim: add the role, point it at the
locked `ai401`, accept that `trackForRole`'s fallback would silently send them to HRBP anyway. That
is no longer necessary.

**Sequence:**

1. **Now:** nothing. Adding a `cpo` role choice before `ai301-cpo` exists just relabels the same
   fallback.
2. **When the track is authored:** add the role choice pointing at `ai301-cpo`, add course and
   module rows to `content/modules.json`, register in `roles.ts`, regenerate the seed. One change,
   in the order the brief specifies.
3. **Never:** module rows before the track is complete.

Note that `roles.ts`'s current `other` detail explicitly lists "leading the function" among the
roles routed to the business partner track. That line should change when this track ships.

## 6. Verification log

Two passes: one before the placement check, one on the human brief that overturned it. Three checks
changed content rather than confirming it.

| Claim | Status | Effect |
|---|---|---|
| HR has no direct involvement in AI strategy in 52% of organizations | **Confirmed with sample** — SHRM *State of AI in HR 2026*, n=1,908, fielded December 2025. The HRBP outline carries this without the sample and should gain it | Design premise |
| 28% regard HR as a true strategic leader; 19% partner-but-excluded | **Confirmed** — same survey | Supporting, sharper than the 52% alone |
| "≈90% of CHROs expect more adoption while over half have implemented none" | **Not confirmed; current data points the other way.** The authoring brief cites this as a prior verification win. Current figures show CHROs as the *most cautious* C-suite function — 5% expect half of HR work AI-enabled within three years, against ~80% of executives expecting bottom-line impact | **Changed the design premise.** The track opens on the skeptic-in-a-committed-room reading, not an expectations gap |
| EU AI Act "fully applicable as of 2 August 2026, HR algorithms high-risk" | **Wrong, and nine days stale.** Regulation (EU) 2026/1744 (Digital Omnibus on AI) published 24 July 2026, in force 27 July 2026. Employment high-risk obligations → **2 December 2027**; Annex I → August 2028. **Most Article 50 transparency obligations still applied from 2 August 2026** | **Replaced M5's statutory content, and the replacement teaches better.** Also affects HRBP M6 and recruiter R6, which carry the deferral as a proposal — now adopted law |
| IBM AskHR: eNPS fell +19 → −35, recovered to +74; 94% resolution; 40% budget cut | **Partly confirmed, one mislabel.** 94%, 40%, and −35 → +74 confirmed — but as an internal **customer-satisfaction score, not eNPS.** The +19 starting point did not verify | M4 keeps the case, drops the mislabel. For an audience that knows what eNPS is, shipping it would cost more than the number buys |
| IBM raised entry-level hiring while cutting the HR budget | **Confirmed directionally** | M4's credibility move |
| Moderna merged People and Digital Technology under Tracey Franklin | **Confirmed** — title and merger both | M3's existence proof |
| Moderna's "3,000+ custom GPTs" and "~5,800 people" | **Did not verify** — needs a targeted check | M3 works without them |
| MIT: 95% of enterprise genAI pilots no measurable P&L impact | **Confirmed with sample** — *The GenAI Divide*: 52 executive interviews, 153 survey respondents, 300 public deployments. Critics argue it describes organizations measuring the wrong things at the wrong time | M6's anchor, sample stated in-lesson |
| 401's definition describes a rung, not the CHRO | **Confirmed in-repo** — but read wrongly the first time. See §3 | Corrected the verdict |

**Chased and resolved:** the Culture Amp finding is Culture Amp's *2026 AI in HR Study*, released
22 July 2026 — 70% versus 25%, from **264 HR professionals in the vendor's own community survey**,
cross-sectional. Directionally right, but a small self-selected sample, an interested publisher,
and no causal direction. **Demoted from M1's anchor to supporting evidence, stated with its
limits** (outline Decision 7). M1 is argued from craft instead.

**Still unverified and blocking before drafting:** the
Bersin CHRO and Walmart senior-search anecdotes; Gartner's 28% and the 47%-of-CHROs measurement
figure; the ~26% candidate-fairness and ~13% CHRO-leading-AI-strategy pair; the
~49%-have-a-policy / quarter-think-it-durable pair; the 47% → 38% confidence decline; and the
agent-registry products named as the registry layer, which are product claims this track teaches
learners to tear down.

## 7. Open questions

- **Does the ladder need direct entry at 301 for this role?** A sitting CPO who tests out of 101
  still has 201 in front of them, and 201 is a hands-on build course with a capstone. Reasonable
  ask, or completion cliff?
- **Does this track want its own diagnostic?** 101's diagnostic asks a sitting CPO the wrong
  questions. Their five gate predictions may place them better than any quiz.
- **Recertification credits.** Real purchase driver for individual buyers, largely irrelevant for
  enterprise or peer-network sponsorship — and expensive to retrofit.
- **Talent Management, Labor & Employee Relations, DEI** — still unresolved from the brief.
  Untouched here.
