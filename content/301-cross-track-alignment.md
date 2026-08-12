# AI 301 · Cross-track alignment register

**What this is.** The single place where track boundaries and cross-track corrections are recorded,
so that six specialist tracks written months apart by different sessions don't quietly overlap,
contradict each other, or ship six drifting copies of the same statistic.

**Read this alongside `301-track-authoring-brief.md` before outlining or drafting any track.** The
brief says how to build a track. This says what the track next to yours already owns.

**Rule of use:** if you are about to write a lesson and this register assigns its subject to another
track, either cite that track and teach the delta explicitly, or don't write it. "Cite and teach the
delta" is a real option and has produced good content — see B-06 — but it has to be deliberate and
stated in the module, not assumed.

---

## 1. Current state

| Track | Course id | State | Live? |
|---|---|---|---|
| AI 101 · Foundations | `ai101` | 8 modules authored | **Yes — open** |
| AI 201 · The Practitioner | `ai201` | 8 modules authored | **Yes — open** |
| HR Business Partner | `ai301-hrbp` | 7 modules authored | **Yes — open** |
| Recruiting / TA | `ai301-recruiter` | Outlined · R1–R3 drafted with packages | No — unregistered |
| Compensation & Benefits | `ai301-comp` | Outlined | No |
| Employee Experience / Internal Comms | `ai301-excomms` | Outlined (v2, integrated) | No |
| Defensible by Design | `ai301-defensible` | Outlined (v1, integrated) | No |
| People Analytics / HR Technology | — | Not started — **brief's top recommendation** | No |
| Talent Development / L&D | — | Not started | No |
| People Ops / shared services | — | Not started | No |
| CHRO / CPO | — | Not started — **check 401 first** | No |

Live surface is 23 modules. Corrections to live content are the highest-priority items in §3.

---

## 2. Boundary register

Each row: what collides, who owns it, and what the other side keeps. **Status** is `SETTLED` where
both sides are written down, `PENDING` where one side doesn't exist yet.

### B-01 · Producing vs. reading a bias audit — `SETTLED`

**Defensible M3 owns producing the analysis.** Testing protocol design, four-fifths *and* standard
deviation analysis, proxy detection, intersectional cuts, privilege sequencing.
**Recruiter R6 keeps reading one.** A recruiter receives a vendor's audit and needs to know whether
it's a document or a marketing artifact — pass-through rates by group, what was measured, what
wasn't.
**The line:** consumer vs. producer. R6 loses nothing; it should gain a pointer to Defensible for a
learner who needs to run it rather than read it.
*This boundary is the one the DEI assessment got wrong by treating the shared topic as shared
design. It is the register's founding case.*

### B-02 · The evidence-generation problem — `SETTLED`

**Defensible M3 Lesson 4 owns it.** AI collapsed the cost of producing analysis adverse to your own
employer; friction was the old control; the governing question is who may run it, under what
protection.
**Comp M4 keeps pay-equity regression under privilege** — the specific instance, in its own domain,
with the disparate-impact-from-historical-pay problem.
**The line:** comp owns the pay-equity case; Defensible owns the general problem and the privilege
sequencing method.

### B-03 · The AI systems inventory — `SETTLED`

**Defensible M2 owns the shadow stack** — AI features enabled inside tools already owned, with no
procurement event — **and the reviewer test** (does the reviewer have the information, time,
authority, and incentive to overrule it?).
**HRBP M6 keeps the deployer inventory** for systems touching an HRBP's population, at the depth an
advisor needs.
**Recruiter R6 keeps the tool audit** scoped to one live requisition.
**The line:** HRBP and recruiter inventory what's declared, at the depth their role needs.
Defensible finds what wasn't declared and tests whether the review layer is real.
⚠️ **HRBP M6 is live.** Any change here is a change to shipped content — see C-02.

### B-04 · The agent doctrine — `SETTLED`

Appears in HRBP M6 L2, recruiter R6 L2, and Defensible M4 L4. **All three keep it** — it is one
paragraph, it is load-bearing in each, and duplicating a doctrine statement three times is cheaper
than cross-referencing it. **But it must say the same thing in all three**, so it belongs in the
shared evidence library (§4) as canonical text rather than three independently drafted versions.

### B-05 · Disparate impact / adverse impact as doctrine — `SETTLED`

**101 M7 owns the concept** — bias as a property of data, adverse impact as the mechanism, assist
vs. decide, and the traveling test. Taught to every learner in the product.
**Defensible M1 owns the current posture** — enforcement retreat vs. statutory duty, the private-bar
channel, and the state patchwork.
**The line:** 101 teaches what it is; Defensible teaches where it stands this quarter and what to do
about it. 101 must not carry current-posture claims that will be stale in six months — which is
exactly the defect in C-01.

### B-06 · The volume trap — `SETTLED`, and the model for how to share

**HRBP M3 owns it** as a cost in **decisions**: cheaper production, no more calls.
**EX/comms M3 re-aims it** at **attention**, and the module states the delta explicitly rather than
re-teaching the trap — decisions are your own budget, attention is everyone else's, spent without
consent. Different remedy: a kill list, not a volume decision.
**This is the reference pattern for the rule at the top of this file.** Cite, state the delta,
teach only the delta.

### B-07 · Small populations — `SETTLED`

**HRBP M5 owns inference:** your unit is 90 people, the design team is six, and population math on a
small N produces confident garbage.
**EX/comms M7 owns identification:** re-identifying too few people against an anonymity promise you
made when you fielded the survey. Not a confidence interval — a reporting floor.
**Defensible M3 owns cell-size in testing:** whether a group is large enough to test at all.
**The line:** three different failures that share a word. Each module must name the other two so a
learner doesn't think they've already had this lesson.

### B-08 · Manager-facing work — `SETTLED`

**HRBP M7 owns coaching managers on their own AI use** — catching the AI-drafted review that says
nothing, correcting without driving it underground, and the allocation-as-equity argument.
**EX/comms M9 owns equipping managers to deliver a message** — the cascade, personalized enablement,
sharing engagement data *with* managers, and the consistency-vs-free-variation problem.
**The line:** HRBP fixes how the manager uses AI; EX/comms arms the manager with a message.

### B-09 · Disclosure — `SETTLED`

**101 M8 owns the principle:** disclosure tracks the reader's stake in how the work was made.
**EX/comms M6 owns the institutional-voice instance** plus EU AI Act Article 50 — synthetic
audio/video of a real person, and the human-review / editorial-responsibility carve-out.
**Defensible M2/M4 own statutory AEDT notice duties** — Illinois, Connecticut — which are a
different obligation entirely and should not be conflated with authorship disclosure.

### B-10 · Listening, sentiment, and monitoring — `SETTLED`

**EX/comms M7 owns all of it** — the unread-signal unlock, the interpretation trap, and the
monitoring floor (EU AI Act Article 5(1)(f) and its biometric limit, works councils, ECPA, state
notice regimes, NLRA §7 and the rescinded GC memo).
No other track teaches employee listening. HRBP M6's ER documentation is a different subject.

### B-11 · The normalization trap — `PENDING`

*A model trained on your historical reviews learns your historical bias, so a tool that flags
"unusual" language flags deviation from a biased norm — the inclusive-language checker enforcing the
thing it was bought to fix.*
**Proposed:** Defensible M3 owns the **mechanism** (it is proxy logic in prose form, and sits
naturally beside zip-code proxies); recruiter R4 owns the **application** to JD and scorecard
language, citing Defensible.
**Needs a decision before either is drafted.** Currently written into neither outline.

### B-12 · Defensible ↔ People Analytics — `PENDING` ⚠️ highest-risk open boundary

Defensible's stated audience explicitly includes people analytics practitioners, and People Analytics
is the authoring brief's top-ranked remaining track.
**Proposed line:** People Analytics owns **building and evaluating the models the function
consumes** — attrition prediction, workforce planning, survey analytics, the modeling stack, method
literacy in general. Defensible owns **the legal defensibility of people decisions** — testing,
privilege, AEDT governance, procurement fairness.
**Settle this before the People Analytics track is outlined, not after.** Both tracks want
regression literacy and both want the vendor-claim teardown; without a line they will each write a
version of the other's best module.

### B-13 · EX/comms ↔ People Ops — `PENDING`

**Proposed line:** EX/comms M8 owns the employee-facing assistant's **voice, refusal design, and
what the employee was told** (including reliance). People Ops owns **deflection, ticket routing, and
throughput**.
Settle before the People Ops track is outlined.

### B-14 · Comp ↔ Defensible on pay equity — `SETTLED` (see B-02), with one caveat

Comp M4 L4's statutory floor names the EU Pay Transparency Directive. Defensible M1 L4 covers US
state AEDT law. **Neither should attempt the other's jurisdiction.** If a learner needs both, they
need two tracks — which is a real product finding worth surfacing rather than solving in content.

---

## 3. Correction register

Ordered by urgency. ⚠️ marks changes to content that is live to learners.

### C-01 ⚠️ · 101 M7 Lesson 3 — stale federal-enforcement claim · **LIVE**

**Current text:** *"U.S. federal enforcement agencies have signaled that existing employment law
fully applies to algorithmic decisions"* and *"that expectation is increasingly regulatory, not just
prudent."*
**Why it's stale:** EO 14281 directed agencies to eliminate disparate impact liability; the EEOC
dropped its pending disparate impact cases and defunded state agencies bringing them; its June 2026
National Enforcement Plan prioritizes disparate treatment.
**What's still correct and must not change:** *"Disparate impact doesn't need intent"* — statutory,
via the Civil Rights Act of 1991, and unchanged.
**The fix, which improves the lesson:** the doctrine is codified and an executive order cannot repeal
it; federal enforcement deprioritized it; the private plaintiffs' bar — which no executive order
binds, before courts that remain open — is picking it up. **Duty is not posture.** A learner who
holds that distinction can reason about a reversal in either direction, which is what a `[V]` lesson
should buy them.
**Scope:** ~3 sentences. Already `[V]`, already carries a counsel flag.
**Blocked on:** counsel review. **Owner:** maintenance agent + counsel.

### C-02 ⚠️ · HRBP M6 — state-law lesson and Mobley posture · **LIVE**

M6 L1 leads on "19 of the most populous states have AI laws touching employment." The patchwork has
moved materially since: Illinois HB 3773 in force 1 Jan 2026; California CRD regulations in force
1 Oct 2025; Colorado SB 24-205 postponed *and* enforcement paused by a federal court 27 Apr 2026;
Connecticut's AEDT framework effective 1 Oct 2026.
**Also:** the HRBP outline's Decision 7 lists *"Mobley's current posture"* as unverified and
blocking. **It is now verified** — ADEA collective certified May 2025, opt-in closed March 2026, and
on 22 June 2026 core claims allowed to proceed with FEHA and proxy-discrimination disability claims
surviving. That debt can be cleared.
**Blocked on:** counsel review. **Owner:** maintenance agent + counsel.

### C-03 · Recruiter R6 — regulatory framing reversed · outline + undrafted

The **method** stands entirely: four-fifths, pass-through rates, reading an audit. The **framing**
assumed a regulatory posture that has reversed. R6 should teach the private-litigation channel as
the live exposure, add Kistler's FCRA route, and point at Defensible for learners who need to
produce rather than read. Add B-01 to its Decisions section.
**Free to fix — R6 is not drafted.**

### C-04 · Recruiter R1 — disparate impact references · **drafted, not live**

R1 uses "disparate impact and no validation study" in prose, a knowledge-check answer, and its
explanation. All doctrinally correct and unaffected by C-01, but the package should be re-read
against C-01's corrected framing before the track is registered.

### C-05 · Comp M4 — EU Pay Transparency floor predates reality · outline + undrafted

M4 L4 names the Directive's reporting and joint-assessment duties. As of the 7 June 2026
transposition deadline, **only 4 of 27 member states met it** — Slovakia, Italy, Lithuania, Malta —
with Netherlands, Sweden, Czechia and Denmark confirmed to 1 Jan 2027 and the Commission signalling
no extension. Also: **CSRD's diversity reporting was narrowed by Omnibus I** — gender distribution at
top management only, age dropped, family-leave datapoint non-mandatory.
The teaching point improves: the duty is fragmented and your obligation depends on where your
employees sit. Add B-02 and B-14 to its Decisions section.

### C-06 · Comp M2 — total verification debt · outline + undrafted

Comp's own Decision 7 states nothing in that track is verified. Its adoption statistics (20%/72%,
39%/54%, 88%), the negotiation survey (85%/63%), the 98,800-prompt audit, and the ~1%
operating-policy figure are all still unchecked. **Blocking before drafting.**

### C-07 · EX/comms M10 — unsourced credibility figures · outline + undrafted

The 33% erodes / 13% enhances / 43% transparency-dependent figures appear only in secondary
coverage; no primary source or sample identified. **Blocking for M10 Lesson 3.** Also blocking:
TouchPointGPT's 9,000-document case and the stock-vesting chatbot failure, both currently uncited.

### C-08 · Defensible — open verification items · outline + undrafted

The March 2026 executive order's operative text; litigation status of challenges to EO 14173; the
June 2026 Mobley ruling on **limits to AI bias testing and applicant data disclosure**, which is
directly on point for M3's privilege sequencing and has not been read; ISO/IEC 42001's exact scope;
and the JPMorgan posting, which is a single job ad and needs an archived link and date or should be
cut in favour of the learner finding their own.

---

## 4. The shared evidence library — build it now

The comp track's outline proposed this and this session proved the case twice over. The same
figures are now load-bearing in multiple tracks, and each additional track means another drifting
copy:

| Figure | Already used in |
|---|---|
| Workslop (41% / ~2 hrs / 42% trust decline) | Recruiter R7, EX/comms M3 |
| The 16% "should HR lead change management" | HRBP unsettled debate 1, EX/comms M10 |
| The 138-use-case adoption map | HRBP M2, referenced in EX/comms |
| Botsitting / the 11-hour / 13% / 88% cluster | HRBP M3 |
| The agent doctrine (canonical statement) | HRBP M6, recruiter R6, Defensible M4 — see B-04 |
| EU AI Act Art. 5(1)(f), Art. 50, Annex III timing | HRBP M6, recruiter R6, EX/comms M6+M7, Defensible |
| Disparate impact: codification, posture, private bar | 101 M7, recruiter R1+R6, comp M4, Defensible M1 |
| Mobley v. Workday posture | HRBP M6, recruiter R6, Defensible M1 |

**Six tracks × these figures = a maintenance surface that will drift.** Author once with the
citation, sample, and date; reference from any track. `scripts/maintenance-agent.mjs` then has one
target per fact instead of six.

**Recommend building this before the next track is drafted**, not after — the cost is lowest now
and rises with every module authored.

---

## 5. Convention upgrades pending retrofit

Three improvements surfaced by individual tracks that belong to the whole ladder. None have been
applied backwards yet.

1. **Score the delta, not the score** *(comp Decision 3)* — grade evidence of updating, never
   prediction accuracy. Should be retrofitted into the HRBP track's calibration reckoning, which
   currently measures accuracy. **Not yet done, and HRBP is live.**
2. **The prediction gate** *(EX/comms Decision 2, from the human outline)* — commit all predictions
   before any content, answers withheld until the module that earns them, rather than a prompt per
   module. Prevents the module's framing from anchoring its own prediction and makes the closing
   reckoning one computation. **Adopted by EX/comms and Defensible. Offer to HRBP, recruiter, comp.**
   Mechanics note: prediction fields are currently per-module `rubric.json` `activityContext`, so a
   gate module needs either a prediction-set activity or held `record_prediction` calls.
3. **Depth modules are discovered from the role, never derived from the convention** *(the standing
   rule)* — restated here because B-01 shows the failure mode is subtler than expected. It is
   possible to obey the rule when *outlining* and violate it when *subtracting*, by treating a
   shared topic as a shared design. **Subtract on designs, not topics.**

---

## 6. Boundaries still to settle

Before the next tracks are outlined:

- **B-12 Defensible ↔ People Analytics** — highest risk, and People Analytics is next in priority.
- **B-13 EX/comms ↔ People Ops.**
- **B-11 the normalization trap** — mechanism vs. application.
- **Talent Development ↔ EX/comms** — content production is the most AI-saturated work in the
  function and EX/comms now owns the volume-and-attention argument. L&D's version needs a delta
  before it is outlined, or it will be EX/comms with training nouns.
- **Talent Management** — the brief records it as possibly homeless. Performance and calibration
  currently sit across HRBP M2/M5 and comp; succession sits nowhere.
- **Labor & Employee Relations** — ER documentation lives in HRBP M6 today. A separate ER track
  would have to take it, which is a change to live content.
- **CHRO / CPO** — the brief says check 401 first. Still unchecked.
