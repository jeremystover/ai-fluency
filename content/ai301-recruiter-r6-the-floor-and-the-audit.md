# AI 301 · Recruiter · Module 6 — The floor and the audit

**Course:** AI 301 · The Specialist — Recruiting / TA track · Module 6 of 7
**Estimated time:** 25 min content · 10 min exercise · 25 min applied activity
**Prerequisite:** builds on 101 M7 (assist vs. decide) · Module 1 (detection as a screening decision)
**Position in the track:** the heaviest module — and gated on counsel review before ship

> `Concepts reviewed: [DATE] · Examples current as of: [DATE]`
> **This module's legal content is volatile-layer and moves faster than anything else in the
> curriculum.** Statutes, effective dates, and litigation posture change between review cycles.
> It teaches you what to ask counsel; it is not legal advice and does not replace them.

---

## ⚖️ Counsel review required

**This module's legal content moves faster than anything else in the curriculum.** Statutes,
effective dates and litigation posture change between review cycles.

**Counsel review is required before this module ships in any deployment**, by counsel qualified in
that deployment's jurisdictions.

Nothing here is legal advice. It teaches you **what to ask counsel** — and, for a function that buys
screening tools, what to ask a vendor before signature, when you still have leverage.

## Calibration prompt — before you start

*One prediction, thirty seconds.*

**How many AI systems currently touch your requisitions in a way that screens, scores, ranks, or
filters a candidate?** Count anything — your ATS's ranking feature, a sourcing tool's match
score, an assessment vendor, a scheduling bot that prioritizes. A number.

Then predict how many of those you could name the *deployer* for, if a regulator asked.

---

## Module brief

Every other role in People deals with AI regulation at the edges. **You are the target.**

Look at where the law has actually landed. New York City's bias-audit regime is a hiring rule.
Illinois's new provision is a hiring rule. The EU AI Act's high-risk employment classification
names recruitment and selection explicitly. And the landmark US litigation on AI vendor liability
is a hiring case. Employment decisions attracted the regulators first because that is where
automated systems most visibly decide things about people — and within employment, hiring is
where the volume is.

Which produces an uncomfortable alignment. **The vendor market that sells hardest into your
function sells precisely the capability the law is most focused on** — automated screening,
ranking, and scoring of candidates. 101 M7 told you not to let AI decide about people. This
module tells you what happens when you do it anyway, and what the regulators now require of you
when a vendor does it on your behalf.

Two halves: the statutory floor, and the audit skill that makes the floor meaningful — because a
bias audit you cannot read is a document you file rather than a control you operate.

## Learning objectives

By the end of this module you should be able to:

1. Describe the regulatory shape well enough to identify which regimes apply to your reqs.
2. Explain the agent theory and how it changes procurement rather than just compliance.
3. Compute a selection rate and apply the four-fifths rule.
4. Read a vendor's bias audit critically instead of filing it.
5. Inventory every system touching your population and name its deployer.

## Lesson 1 · The statutory floor **[V]**

*Direction of travel, not legal advice. Verify every specific with counsel.*

**New York City, Local Law 144.** The template most other regimes rhyme with. Any **automated
employment decision tool** — résumé screeners, assessment chatbots, video interview analytics —
requires an **annual bias audit** by an independent auditor, **public disclosure** of the results,
and **ten business days' advance notice** to candidates before the tool is used. The audit
measures **selection rate by group** across race, ethnicity and sex. Penalties run from $500 per
violation and escalate substantially for continuing ones.

Note what "assist" means here: the definition reaches tools that *substantially assist* a
decision, not only those that make it. A ranking that determines review order is in scope even
though a human technically decides.

**Illinois, HB 3773 — effective January 1, 2026.** Amends the Illinois Human Rights Act to
prohibit employers from using AI in ways that produce a discriminatory effect, and requires
**notice** to employees and candidates when AI is used in employment decisions. Note the shape:
this is not a separate AI statute bolted on — it puts AI use inside existing civil-rights
machinery, which is where the direction of travel points generally.

**The EU AI Act, and why the deferral is not runway.** Recruitment and selection are named
high-risk uses. Those obligations moved to **2 December 2027** under the Digital Omnibus on AI,
**Regulation (EU) 2026/1744**, in force 27 July 2026 — six days before the original deadline. Read
the headline alone and you would conclude you have until 2027. **Two sets of duties bind you now.**

The **prohibition on emotion recognition in the workplace** has been in force since February 2025
and did not move. If anyone offers you sentiment or emotion inference from interview video and you
have European operations, that is not a procurement conversation.

And since **2 August 2026**, the Act's **transparency obligations**, which apply *regardless of
high-risk classification* — so they reach an organisation with no high-risk AI at all. The one that
lands on this function: **a system interacting directly with a person must disclose that it is AI,
at or before the start of the interaction.** A screening chatbot, a scheduling assistant, an
outreach agent answering candidate questions — all squarely inside it, and the ceiling is
**€15 million or 3% of worldwide turnover**. It is the obligation most likely to catch a TA function
this year, and the one least likely to be on your legal team's radar, because it does not depend on
anything being classified high-risk.

**And the doctrine underneath all of it.** Disparate impact requires no intent. A neutral practice
that disproportionately excludes a protected group needs job-related justification, whoever built
it. Every statute above sits on top of that; none replaces it.

## Lesson 2 · The agent theory **[V]**

The development that changes how you buy.

In **Mobley v. Workday** — now with an **ADEA collective conditionally certified at roughly
14,000 opt-ins** and claims kept alive by rulings on **6 March and 22 June 2026** — a court allowed
claims to proceed on the theory that an AI screening
vendor can act as an **agent of the employer** — finding it plausibly alleged that customers had
delegated their traditional function of rejecting candidates or advancing them to interview. The
"employment agency" theory was dismissed; the agent theory survived to discovery, and claims have
continued across race, sex, age and disability.

Three consequences, most-actionable first.

**Neither party gets to point at the other.** "That's the vendor's problem" and "we only make the
software" both weaken. A tool performing a function you would otherwise perform may carry your
obligations with it.

**Discovery reaches the model.** The case has featured sustained disputes over access to
algorithmic code and testing data. Whatever the outcome, the direction is set: **"we don't know
how it works and the vendor won't tell us" is a position you may have to defend, not a shield.**
Which converts a fairness principle into a procurement requirement — **get validation evidence
before signature**, because afterwards you have no leverage and possibly an obligation.

**And the privilege nuance.** Bias testing conducted *under counsel*, where the lawyer curates the
analysis and uses the results in providing legal advice, may be protected from discovery in a way
that identical testing run as an operational exercise is not. Not a reason to avoid testing — a
reason to involve counsel in designing it, before you commission an audit rather than after.

## Lesson 3 · Adverse impact you can compute

"Don't run a tool you can't show is fair" needs a method, or it is a slogan.

**The selection rate** is the number who passed a stage divided by the number who entered it, for
each group. That's it. If 200 men applied and 60 advanced, the rate is 30%. If 150 women applied
and 27 advanced, the rate is 18%.

**The four-fifths rule** compares each group's rate to the highest group's. 18 ÷ 30 = 0.60 — below
the 0.80 threshold, which is the long-standing rule-of-thumb trigger for scrutiny under US
enforcement practice. It is not proof of discrimination and does not settle anything legally; it
is the flag that says this stage requires job-related justification and probably a conversation
with counsel.

Three things practitioners get wrong, and they matter:

**Compute it per stage, not just at offer.** A funnel can look balanced at the end while a single
early stage does all the excluding — and that's usually the automated one.

**Small numbers break it.** With eleven candidates in a group, one person changes the ratio
dramatically. State the n, always. Module 5's capture layer is what eventually gives you samples
large enough to mean something.

**Passing four-fifths is not a clean bill of health**, and this is the most common misreading. It
is a screening heuristic with a low bar, not a validation. A tool can clear it comfortably and
still be selecting on something indefensible.

Why you specifically need this: **it is what lets you read a vendor's audit rather than file
it.** When an audit reports impact ratios, you can now ask whether they were computed per stage
or only at the end, what the group sizes were, and which stages were excluded from the analysis.
Those three questions separate a real audit from a compliance artifact.

> ### Try this — 3 minutes
> Take your highest-volume req from the last year. For the résumé-screen stage, can you get the
> number who entered and the number who advanced, split by any demographic group you hold? If
> the data doesn't exist, that's your finding — a stage you cannot audit is a stage you cannot
> defend.

## Lesson 4 · What to do this quarter

Without waiting for anyone.

**Inventory, and name the deployer.** Every system that screens, scores, ranks or filters. Include
features switched on inside tools you already had — the ATS ranking, the sourcing match score,
the "recommended candidates" panel. Most recruiters find at least one they'd never classified as
a decision tool.

**Ask three questions in writing, of every vendor.** Has this tool been bias-audited, by whom, and
may we see the report? What does it do when it has insufficient data about a candidate? Which of
our jurisdictions have you assessed it against? **The answers, or the silences, are the finding**
— and asking before signature is the only moment you have leverage.

**Check the notice obligations that already bind you.** If you operate in a regime requiring
candidate notice, that is an operational task with a deadline, not a policy debate.

**Then bring counsel a list, not a worry.** Not "are we compliant with AI hiring law?" — which
gets a shrug — but: *"These five systems touch our reqs. Here's what each one decides and where we
hire. Which regimes apply today, what do they require of us this year, and what's coming?"* That
question has answers.

## Key takeaways

- **You are the target, not a bystander.** LL144, Illinois HB 3773, the EU's high-risk
  classification, and the landmark vendor-liability case are all hiring rules `[V]` — and the
  vendor market sells hardest into exactly the capability regulators focus on.
- **"Substantially assists" is in scope.** A ranking that determines review order counts, even
  though a human technically decides.
- **Agent theory: neither party can point at the other** `[V]`, and discovery reaches the model.
  Get validation evidence *before* signature; afterwards you have no leverage and possibly an
  obligation.
- **The EU emotion-recognition prohibition is already in force** and did not move with the rest.
- **Selection rate is passed ÷ entered, per group. Four-fifths compares each group to the
  highest.** Compute per stage, state the n, and remember that passing is a low bar rather than a
  clean bill of health.
- **This is what lets you read an audit instead of filing it:** was it computed per stage, what
  were the group sizes, which stages were excluded.
- **Bring counsel five named systems and what each decides.** "Are we compliant?" gets a shrug.

## Take a position

**The claim:** *"A vendor's bias audit is a marketing document until you can read it — and if you
can't compute a pass-through rate, you can't read it."*

The strongest counter-argument is **division of labour.** Bias auditing is a specialist
statistical discipline; an independent auditor and your own counsel are better equipped than a
recruiter with a calculator, and a little statistical knowledge deployed confidently is its own
hazard — a recruiter who misreads an impact ratio in a vendor meeting has damaged their
credibility and possibly the analysis. On that view the skill to build is knowing *who to ask*,
not how to compute. Your position has to engage that.

## Applied activity — "Tool audit"

**Time:** 25 minutes · **Submit:** the inventory, the vendor questions, and a 250–350 word
write-up · **Graded against the rubric below.**

**Step 1 — Inventory (10 min).** Every AI system touching your requisitions that screens, scores,
ranks, filters, or characterizes a candidate. For each: what it decides, who the deployer is,
whether it's been bias-audited as far as you know, and which of your hiring locations it operates
in. **"Don't know" is a valid and informative entry** — an inventory full of honest unknowns is
the point, and it's the artifact you take to counsel.

**Step 2 — Compute one rate (7 min).** Pick the stage with the most data on your live req or a
recent one. Compute the selection rate per group for any demographic split you hold, and the
four-fifths ratio. **If you can't get the data, document exactly why** — that finding is worth as
much as the number, because a stage you cannot audit is a stage you cannot defend.

**Step 3 — Three vendor questions (5 min).** For your highest-risk system, written so a vendor
could answer them and the answer would change something you do.

**Step 4 — Score the prediction (3 min).** Systems you predicted against systems found, and how
many you could name the deployer for.

Then the write-up: what the inventory surfaced that you hadn't classified as a decision tool, what
the rate computation showed or why it couldn't be done, your position on the claim above with its
counter-argument addressed, and the single question you're taking to counsel first.

## Knowledge check — 6 questions

*Unlocks after the applied activity is submitted. Retakes are free and unlimited.*

**Q1.** Under a bias-audit regime like NYC's LL144, which tools are in scope? `[V]`

- A. Only tools that make a final hire/no-hire decision without human involvement
- B. Tools that make *or substantially assist* an employment decision — including a ranking that determines review order, even though a human technically decides ✓
- C. Only tools purchased after the regulation's effective date
- D. Only tools that process demographic data directly

> **B.** "Substantially assists" is the phrase doing the work, and it's why a recruiter's
> instinct that "a human still decides" doesn't take a tool out of scope. D is the field-removal
> fallacy from 101 M7 in regulatory clothing.

**Q2.** What did the agent theory in Mobley v. Workday allow to proceed? `[V]`

- A. Claims that the vendor operated as an employment agency
- B. Claims that the vendor acted as an agent of employers, on the basis that customers had delegated the function of rejecting or advancing candidates ✓
- C. A class action against employers using the tool
- D. A regulatory enforcement action

> **B.** The employment-agency theory was dismissed; the agent theory survived to discovery.
> That's the distinction that matters, because agency is what makes "we only make the software"
> stop working.

**Q3.** Why does the discovery dispute over algorithmic code matter to a practitioner?

- A. It will force vendors to publish their models publicly
- B. Because "we don't know how it works and the vendor won't tell us" becomes a position to defend rather than a shield — making validation evidence a pre-signature ask ✓
- C. Because it establishes that employers own vendor training data
- D. Because it delays enforcement until the case resolves

> **B.** The practical translation is leverage: ask before you sign. Afterwards you have none, and
> possibly an obligation to have asked.

**Q4.** 200 candidates from Group A applied and 60 advanced; 150 from Group B applied and 27 advanced. What does the four-fifths rule say?

- A. 0.90 — well within the threshold
- B. 0.60 — below the 0.80 threshold, flagging the stage for job-related justification and a conversation with counsel ✓
- C. 0.45 — below the threshold, which constitutes proof of discrimination
- D. The rule can't be applied without knowing the roles involved

> **B.** Rates are 30% and 18%; 18 ÷ 30 = 0.60. C gets the arithmetic wrong *and* overstates what
> the rule establishes — it is a trigger for scrutiny, not a finding of discrimination.

**Q5.** Which misreading of the four-fifths rule does the module call out as most common?

- A. Applying it to stages other than the final offer
- B. Using it with small group sizes
- C. Treating a passing ratio as a clean bill of health, when it's a low-bar screening heuristic rather than a validation ✓
- D. Computing it before an independent audit is complete

> **C.** A tool can clear four-fifths comfortably and still select on something indefensible. A is
> backwards — per-stage computation is what the module *recommends*, because a funnel can look
> balanced at the end while one early stage does all the excluding.

**Q6.** Which three questions separate a real bias audit from a compliance artifact?

- A. Who paid for it, when it was conducted, and whether it was published
- B. Whether rates were computed per stage, what the group sizes were, and which stages were excluded ✓
- C. Which statistical software was used, the confidence intervals, and the auditor's credentials
- D. Whether the vendor agrees with the findings, and what remediation followed

> **B.** These are answerable, and each one can hide a problem: end-of-funnel-only computation
> masks an excluding stage, small groups make ratios meaningless, and an excluded stage is
> usually the automated one. C sounds more rigorous and is harder to act on.

## Sources and attribution

- **NYC Local Law 144** — annual independent bias audit, public disclosure, ten business days'
  candidate notice, selection-rate measurement by race, ethnicity and sex, and the
  make-or-substantially-assist scope. **[V]**
- **Illinois HB 3773**, effective 1 January 2026 — amends the Illinois Human Rights Act to
  prohibit discriminatory-effect AI use in employment decisions and requires notice. **[V]**
- **EU AI Act and the Digital Omnibus** `[V]` — recruitment and selection as named high-risk uses,
  deferred to **2 December 2027** by **Regulation (EU) 2026/1744**, published 24 July 2026 and in
  force 27 July 2026. The workplace emotion-recognition prohibition and the AI-literacy obligation
  have been in force since February 2025 and were unaffected. **Article 50 transparency obligations
  apply from 2 August 2026 independent of high-risk classification**, with a ceiling of €15 million
  or 3% of worldwide turnover. Canonical wording shared with HRBP M6, People Ops M7, Talent
  Development M5 and the CPO track — see `content/evidence/eu-ai-act-timeline.json`.
- **Mobley v. Workday** `[V]` — agent theory permitted to proceed while the employment-agency theory
  was dismissed; **ADEA collective conditionally certified with roughly 14,000 opt-ins**; claims
  kept alive across race, sex, age and disability by rulings on **6 March and 22 June 2026**; a
  **28 May 2026** ruling held AI bias-testing data may be shielded from discovery by
  attorney-client privilege. Active litigation — **the most staleness-prone citation in this
  module**, and posture changes between review cycles. See
  `content/evidence/mobley-v-workday.json`. Re-verified 12 August 2026.
- The four-fifths rule and selection-rate analysis are long-standing US enforcement practice and
  predate AI entirely. The three audit-reading questions are original to this course.
- **This module is not legal advice.** *Counsel review required before deployment-specific claims
  are added.* **[V]**
