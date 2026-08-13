# AI 301 · HRBP · Module 6 — The line

**Course:** AI 301 · The Specialist — HRBP track · Module 6 of 7
**Estimated time:** 45 min content · 10 min exercise · 25–30 min applied activity
**Prerequisite:** builds directly on 101 M7 (assist vs. decide) and 101 M4 (the tiers)
**Position in the track:** the heaviest module — and the one gated on counsel review before ship

> `Concepts reviewed: [DATE] · Examples current as of: [DATE]`
> **Lessons 1 and 2 are volatile-layer and move faster than anything else in this curriculum.**
> Statutes, effective dates, and litigation posture change between review cycles. This module
> teaches you what to ask counsel — it is not legal advice and does not replace them.

---

## ⚖️ Counsel review required

**Lessons 1 and 2 move faster than anything else in this curriculum.** Statutes, effective dates and
litigation posture all change between review cycles, and several did while this module was being
written.

**Counsel review is required before this module ships in any deployment**, by counsel qualified in
that deployment's jurisdictions.

Nothing here is legal advice, and it does not replace your legal team. It teaches you **what to ask
them** — which is a real skill, and the one thing in this module that will not go stale.

## Calibration prompt — before you start

*One prediction, thirty seconds.*

**What share of HR professionals working in states that regulate AI in employment do you think
are unaware their state has such a law?** Whole percent.

The number is high enough that it is worth knowing where you sit in it before you find out.

---

## Module brief

Two halves, and they belong together even though most treatments separate them.

The first half is the law about **systems** — the tools screening, scoring, and ranking people
across your organization, most of which you did not choose and some of which you may not know
about. That surface is moving fast: a growing patchwork of state statutes, a landmark case
redrawing who is liable, and a European regime with one prohibition already absolute.

The second half is the law about **documents** — the investigation summary, the PIP language, the
termination rationale sitting on your desk right now. This is the writing an HRBP does that is
most likely to be read years later by someone hostile, and it is where AI assistance creates a
question nobody was asking two years ago: *how was this produced, and can you say?*

Most legal treatments of AI in HR cover the first half and skip the second, because the first is
where the vendors and the statutes are. But the second is where **you** personally are exposed,
most weeks, in the ordinary course of your job.

One framing before we start, because it determines how to read everything here. **You are not
being asked to become a lawyer.** You are being asked to become the person who knows which
questions have legal answers and brings them a specific list instead of a general worry. That is
a genuinely different and achievable skill, and counsel will thank you for it.

## Learning objectives

By the end of this module you should be able to:

1. Describe the shape of the regulatory surface for AI in employment `[V]` well enough to
   identify which questions apply to your organization.
2. Explain the agent theory and why it changes procurement rather than just compliance.
3. Apply AI to ER documentation safely — including the use almost nobody thinks of — and name
   precisely where it must stop.
4. Say what uncertain provenance does to a document that later enters discovery.
5. Take counsel a specific, answerable list rather than "are we compliant?"

## Lesson 1 · The regulatory surface **[V]**

*Direction of travel, not legal advice. Verify every specific with counsel before relying on it.*

**A patchwork, not a framework.** A substantial number of US states now have laws touching AI in
employment, with more each session — and the practical problem is not severity but *awareness*: a
majority of HR professionals working in regulated states do not know their state has such a law.
That statistic is the most actionable thing in this lesson, because it means the first question
is not "are we compliant" but "which regimes even apply to us?"

**The recurring obligations.** Across the patchwork, the same duties keep appearing in different
combinations: notice to candidates and employees that an AI tool is being used; bias auditing,
sometimes with publication; the right to request human review; and record-keeping about how the
tool was used and what it produced. If you build for those four, you are broadly positioned for
regimes you haven't read yet.

**The European regime, and why deferral is not runway.** The EU AI Act classifies employment uses
— recruitment, selection, promotion, termination, task allocation, and performance monitoring — as
high-risk. Those obligations moved to **2 December 2027** under the Digital Omnibus on AI,
**Regulation (EU) 2026/1744**, which entered into force on 27 July 2026 — six days before the
original deadline. Read only that headline and you would conclude you have until 2027. You do not:
**three sets of duties bind you now.**

The **AI literacy obligation** and the **prohibition on emotion recognition in the workplace**,
both in force since February 2025. And since **2 August 2026**, the Act's **transparency
obligations**, which apply to covered systems *regardless of high-risk classification*. The one
that reaches most People functions: a system interacting directly with a person must disclose that
it is AI, at or before the start of the interaction. **A recruiting chatbot, an HR service bot, or
an onboarding assistant operating in Europe sits squarely inside that** — and the ceiling is
€15 million or 3% of worldwide turnover.

The emotion-recognition ban is
not a risk to manage — it is a prohibition on inferring emotional states of employees or
candidates from facial expression, voice, or similar signals. If a vendor is selling you
sentiment-from-video in an interview context and you have European operations, that is not a
procurement question.

**And the doctrine that predates all of it.** Disparate impact requires no intent. A neutral
practice that disproportionately excludes a protected group needs job-related justification,
whoever built it and whatever it was marketed as. Every AI statute above sits on top of that; none
replaces it.

## Lesson 2 · The agent theory **[V]**

The most consequential development for how you buy, rather than how you comply.

In **Mobley v. Workday**, a court allowed claims to proceed on the theory that an AI screening
vendor can act as an **agent of the employer** — holding it plausibly alleged that customers had
delegated their traditional function of rejecting candidates or advancing them to interview. The
employment-agency theory was dismissed; the agent theory survived and went to discovery. The
litigation has continued to expand rather than contract, with claims proceeding across race, sex,
age, and disability through rulings on **6 March and 22 June 2026** — and an **ADEA collective
conditionally certified, with roughly 14,000 opt-ins**. That number is the part worth carrying: a
theory that survives a motion is a legal development, and a collective that size is a commercial
one.

Three implications, in descending order of how much they should change your Monday.

**Neither party gets to point at the other.** The employer's "that's the vendor's problem" and the
vendor's "we only make the software" both weaken under this theory. If a tool performs a function
you would otherwise perform, it may carry your obligations with it.

**Discovery reaches the model.** The most instructive part of the case is the ongoing fight over
access to algorithmic code and testing data. Whatever the outcome, the direction is clear: **"we
don't know how it works, the vendor won't tell us" is a position you may have to defend rather
than a shield you can hide behind.** Which converts a vague fairness principle into a concrete
procurement requirement — ask for the validation evidence *before* signature, in writing, because
afterwards you have no leverage and possibly an obligation.

**And the privilege nuance sophisticated employers are already using.** Bias-testing conducted
*under counsel*, where the lawyer curates the analysis and uses the results in providing legal
advice, may be protected from discovery in a way that the same testing run by HR as an operational
exercise is not. This is not a reason to avoid testing. It is a reason to involve counsel in
designing it — a conversation worth having before you commission an audit, not after.

## Lesson 3 · ER documentation that survives scrutiny

Now the half that is actually on your desk.

**Where AI genuinely helps.** Three uses, all safe, and one of them is underused to the point of
being a competitive advantage:

*Structure and consistency.* Turning your own notes into a coherently organized summary, with
your findings intact and your headings consistent with how your team writes them.

*The completeness pass — the one almost nobody runs.* Give it your interview plan or your draft
summary and ask: **"What did I fail to ask? What would a thorough investigator have covered that
isn't here?"** This is assist-side, entirely safe, and it catches the omission that becomes the
problem eighteen months later. It does not evaluate anyone; it audits your coverage.

*Language discipline.* Flagging conclusory language, loaded adjectives, and characterizations that
have crept in where observations belong. A model is unusually good at spotting "was hostile" where
"raised his voice twice, per two witnesses" belongs.

**Where it stops, and this is not a caution — it is a stop.** Credibility determinations. Any
conclusion about what happened. Any characterization of a person's character, motive, or
truthfulness. The moment a model contributes to *whether you believe someone*, you have crossed
101 M7's line in the highest-stakes place it exists — and unlike a hiring screen, there is a named
individual with a specific consequence attached to the answer.

**And the provenance problem.** ER documents can be read years later, under oath, by people whose
job is to undermine them. The questions that get asked are: who wrote this, when, based on what,
and did it change? **A document whose production you cannot describe is weaker than one you can**
— which produces a discipline worth adopting now, before anyone requires it:

- Record that AI assisted, in what role, on what date — one line in your file notes.
- Keep the human-authored source material the summary was built from.
- Never let a model's phrasing become a finding you didn't independently reach.
- If a sentence in the final document is one you couldn't defend the origin of, rewrite it.

That last rule is the whole discipline in one line, and it is not really about AI at all.

**And the line to hold when accounts conflict.** You will be tempted to hand a model two
statements and ask which is more credible. **A model may locate conflicts; only a human may resolve
them.** Asking it to surface where two accounts diverge, what each asserts, and what is
corroborated elsewhere is legitimate and genuinely useful — it is faster and more thorough than you
are. Asking it *who is telling the truth* is a credibility determination, and a credibility
determination made by a system on evidence it cannot weigh is the finding a plaintiff's counsel
most wants to discover. The output is not the problem; **the delegation is**, and it does not become
acceptable because you agreed with the answer.

> ### Try this — 3 minutes
> Take a recent ER summary you wrote — mentally, no files needed. Could you say, for each
> conclusion in it, what evidence produced it and when you reached it? If yes, AI assistance adds
> speed to a defensible process. If no, the process was already the problem and AI would only
> make it faster.


## Lesson 4 · What you can do this quarter

Without waiting for anyone.

**Inventory.** 101 M2's stack audit, re-read for a different purpose: which systems touching your
population *screen, score, rank, or filter people*? Name the deployer for each. Most HRBPs find at
least one they'd never classified that way.

**Ask three questions of each vendor, in writing.** Has this tool been bias-audited, by whom, and
may we see it? What does it do when it has insufficient data about a candidate? And: which of our
jurisdictions have you assessed this tool against? The answers — or the silences — are the finding.

**Bring them in before you test, not after.** The order matters more than the invitation. If you
commission an analysis — a pay-gap look, an adverse-impact check on a screening tool, a review of
why one team's ratings skew — and *then* take counsel the result, you have created a document that
exists whatever it says. If counsel commissions it, or is asked in advance what work should be done
under privilege, the same analysis may sit somewhere different. **That is a decision made at the
moment you ask the question, and it cannot be made retroactively.** You are not the person who
decides what is privileged; you are the person whose sequencing determines whether the question can
be asked at all. So the practical version is one sentence, said early: *"Before I ask anyone to run
this, should it be run for you?"*

**Write the documentation standard.** One page for your own team, covering the ER discipline
above. It costs an afternoon and it is the artifact your organization will wish it had.

**Then bring counsel a list, not a worry.** Not "are we compliant with AI law?" — which gets you a
shrug — but: *"These four systems touch hiring and performance. Here is what each one decides.
Which of our jurisdictions regulate these today, what do they require of us this year, and what's
coming that we should build for now?"* That question has answers. The general one does not.

## Key takeaways

- **It's a patchwork, and awareness is the first problem** `[V]` — most HR professionals in
  regulated states don't know their state regulates this. Start with which regimes apply, not
  whether you comply.
- **Four obligations recur** across regimes: notice, bias auditing, human review, record-keeping.
  Build for those and you're positioned for statutes you haven't read.
- **Deferral is not runway** `[V]`. High-risk employment duties moved to 2 December 2027, but three
  sets bind you today: AI literacy and the absolute workplace emotion-recognition ban (February
  2025), and the transparency obligations since 2 August 2026 — under which a candidate-facing
  chatbot must disclose it is AI, whatever its risk class.
- **Agent theory means neither party can point at the other** `[V]`, and discovery reaches the
  model — "we don't know how it works" is a position to defend, not a shield. Get validation
  evidence before signature; afterwards you have no leverage.
- **AI in ER documentation: structure, the completeness pass — *what did I fail to ask?* — and
  language discipline.** It stops absolutely at credibility, conclusions, and characterizing a
  person.
- **If you can't defend a sentence's origin, rewrite it.** Record that AI assisted, keep the
  source material, and never let a model's phrasing become a finding you didn't reach.
- **Bring counsel a specific list.** "Are we compliant?" gets a shrug; four named systems and
  what each decides gets an answer.
- **Sequencing is the privilege decision.** Whether an analysis can be run for counsel is settled
  at the moment you ask for it, not after you read the result. *"Before I ask anyone to run this,
  should it be run for you?"*
- **A model may locate conflicts; only a human may resolve them.** Surfacing where two accounts
  diverge is useful work. Asking which one is true is a credibility determination, and the
  delegation is the problem even when you agree with the answer.

## Take a position

**The claim:** *"An HRBP who cannot name every system that screens, scores, or ranks their
population is not managing risk — they are hoping."*

The strongest counter-argument is that **this is not the HRBP's job.** Tool inventory and vendor
diligence sit with HR technology, procurement, and legal; an HRBP who takes it on is absorbing
work that belongs to functions with more authority and better information — and doing it badly,
part-time, without the mandate to act on what they find. Your position has to survive that,
because it's the argument you'll actually get from a colleague.

## Applied activity — "Inventory and standard"

**Time:** 25–30 minutes · **Submit:** the inventory, the one-page standard, and a 250–350 word
write-up · **Graded against the rubric below.**

**Step 1 — The inventory (10 min).** Every AI system touching your population that screens,
scores, ranks, filters, or characterizes a person. Include features switched on inside tools you
already had — the ATS ranking, the "insights" in the survey platform, anything in the HRIS. For
each: what it decides, who the deployer is, and whether it has been bias-audited as far as you
know. **"Don't know" is a valid and informative entry** — a completed inventory full of honest
unknowns is the point of the exercise.

**Step 2 — Three vendor questions (5 min).** For your highest-risk system, the three questions
you'd put in writing, phrased so a vendor could actually answer and the answer would change
something.

**Step 3 — The documentation standard (10 min).** One page for your own team: what AI may do in
ER documentation, what it may never do, what gets recorded about how a document was produced, and
who signs off. Write it so a colleague could follow it without you in the room.

**Step 4 — Score the prediction (2 min).** Your predicted share of HR professionals unaware of
their state's law, against the real figure — and one sentence on whether you were in it.

Then the write-up: what the inventory surfaced that you hadn't classified as a decision system,
your position on the claim above with its counter-argument addressed, and the single question you
are taking to counsel first.

## Knowledge check — 8 questions

*Unlocks after the applied activity is submitted. Retakes are free and unlimited.*

**Q1.** What does the module identify as the first practical problem with the state-law patchwork? `[V]`

- A. The penalties are severe enough to threaten mid-size employers
- B. Awareness — a majority of HR professionals in regulated states don't know their state has such a law, so the first question is which regimes apply rather than whether you comply ✓
- C. The statutes conflict with each other in ways that make compliance impossible
- D. Enforcement is inconsistent across jurisdictions

> **B.** You cannot comply with a regime you don't know covers you, which is why the module's
> homework starts with inventory and jurisdiction rather than with policy.

**Q2.** Which EU AI Act obligations bind an employer today, rather than being deferred to December 2027? `[V]`

- A. All high-risk employment obligations
- B. Bias auditing and candidate notice
- C. AI literacy, the workplace emotion-recognition prohibition, and the transparency duty that makes a candidate-facing chatbot disclose it is AI ✓
- D. None — the entire regime was postponed under the Digital Omnibus

> **C.** The high-risk employment duties moved to 2 December 2027 under Regulation (EU) 2026/1744;
> three sets did not. AI literacy and the emotion-recognition ban have applied since February 2025
> — and the ban is a prohibition, not a risk to manage. The transparency obligations took effect
> 2 August 2026 and apply regardless of risk class, which is why a recruiting or HR service chatbot
> is in scope now rather than in 2027. Deferral of one regime is not runway across the Act.

**Q3.** Under the agent theory in Mobley v. Workday `[V]`, what changed most for an employer?

- A. Employers became solely liable for vendor tool outputs
- B. Vendors became solely liable, insulating employers
- C. "That's the vendor's problem" and "we only make the software" both weaken — a tool performing a function you'd otherwise perform may carry your obligations ✓
- D. Nothing yet, since the case remains unresolved

> **C.** The court allowed the agent theory to proceed on the basis that customers had delegated
> the function of rejecting or advancing candidates. D is the tempting answer — the case is
> ongoing — but procurement behaviour should change on the theory surviving, not on final
> judgment.

**Q4.** Why does the discovery fight over algorithmic code matter to a practitioner?

- A. It will produce a public standard for algorithmic transparency
- B. Because "we don't know how it works and the vendor won't tell us" becomes a position to defend rather than a shield — which makes validation evidence a pre-signature requirement ✓
- C. Because employers can now compel vendors to disclose code on request
- D. Because it establishes that proprietary models are exempt from disclosure

> **B.** The practical translation is procurement leverage: ask before signature, in writing.
> Afterwards you have no leverage and possibly an obligation.

**Q5.** Which use of AI in ER documentation does the module single out as underused and entirely safe?

- A. Drafting the summary from raw interview notes
- B. Flagging inconsistencies between witness accounts
- C. The completeness pass — "what did I fail to ask that a thorough investigator would have covered?" ✓
- D. Suggesting appropriate disciplinary outcomes based on precedent

> **C.** It audits your coverage rather than evaluating anyone, and it catches the omission that
> becomes a problem much later. B edges toward comparing accounts, which approaches credibility;
> D is squarely over the line.

**Q6.** Where does AI assistance in ER documentation stop absolutely?

- A. At any use involving employee names
- B. At credibility determinations, conclusions about what happened, and characterizations of a person's motive or truthfulness ✓
- C. At documents that may become part of a legal proceeding
- D. At investigations involving protected characteristics

> **B.** 101 M7's line in its highest-stakes location — and unlike a hiring screen, there is a
> named individual with a specific consequence attached. A is over-broad (M4's redaction handles
> names); C would prohibit most ER documentation entirely.

**Q7.** What is the module's one-line provenance discipline?

- A. Never use AI on documents that might enter discovery
- B. Disclose AI use to the employee who is the subject of the document
- C. If you couldn't defend a sentence's origin, rewrite it ✓
- D. Retain all AI conversation logs for the statutory retention period

> **C.** And the module notes it isn't really about AI — a document whose production you can't
> describe was already weak. The supporting practices (record that AI assisted, keep the source
> material, don't let model phrasing become a finding) all serve it.

**Q8.** What makes "are we compliant with AI law?" the wrong question for counsel?

- A. It requires legal expertise the HRBP doesn't have
- B. It has no answer — the useful version names the specific systems, what each decides, and asks which jurisdictions regulate them this year ✓
- C. Counsel cannot advise on AI matters without specialist certification
- D. Compliance questions should go to the vendor first

> **B.** General questions get shrugs; specific lists get answers. Producing that list is exactly
> what the inventory and the three vendor questions are for.

## Sources and attribution

- **State AI employment statutes** — the patchwork of notice, bias-audit, human-review, and
  record-keeping obligations, and the awareness finding among HR professionals in regulated
  states. Fast-moving; verify current scope and effective dates with counsel. **[V]**
- **EU AI Act and the Digital Omnibus** — Annex III employment classification deferred to
  2 December 2027 by **Regulation (EU) 2026/1744**, published 24 July 2026 and in force 27 July
  2026; the AI literacy obligation and workplace emotion-recognition prohibition in force since
  February 2025; the Article 50 transparency obligations applicable from 2 August 2026,
  independent of high-risk classification. Re-verified 12 August 2026. **[V]**
- **Mobley v. Workday** `[V]` — the agent theory permitted to proceed while the employment-agency
  theory was dismissed; **ADEA collective conditionally certified with roughly 14,000 opt-ins**;
  claims kept alive across race, sex, age and disability by rulings on **6 March and 22 June 2026**;
  a **28 May 2026** ruling held AI bias-testing data may be shielded from discovery by
  attorney-client privilege — which is a reason to involve counsel *before* testing, not after.
  Active discovery including disputes over algorithmic code and testing data. **The most
  staleness-prone citation in this module**; posture changes between review cycles. See
  `content/evidence/mobley-v-workday.json`. Re-verified 12 August 2026.
- Disparate impact doctrine long predates AI and is not displaced by any of the above.
- The ER documentation discipline — the completeness pass, the stopping line, and the
  provenance rule — is original to this course.
- **This module is not legal advice.** It is a guide to which questions have legal answers.
  *Counsel review required before deployment-specific claims are added.* **[V]**
