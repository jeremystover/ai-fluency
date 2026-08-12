# AI 301 · Comp & Benefits · Module 4 — The exclusion zone

**Course:** AI 301 · The Specialist — Comp & Benefits track · Module 4 of 6
**Estimated time:** 50 min content · 10 min exercise · 30 min applied activity
**Prerequisite:** Modules 1–3 · builds on 101 M7 (the lines that don't move)
**Position in the track:** the floor, before Module 5 puts you in front of a counterparty

> `Concepts reviewed: [DATE] · Examples current as of: [DATE]`
> **Counsel review required before your organization ships anything built from this module.**
> Lessons 3 and 4 are heavily **[V]** volatile — the legal surface here moves faster than in
> either other 301 track, and two of the decisions cited are months old and unsettled.
> **This is not legal advice.** It is a map of where you need some.

---

## ⚖️ Counsel review required

**The legal surface in this module moves faster than in any other track on this ladder**, and two of
the decisions it cites are months old and unsettled.

**Before your organization ships anything built from this module**, it needs a read by counsel
qualified in your jurisdictions. Lessons 3 and 4 are volatile layer throughout.

Nothing here is legal advice. **It is a map of where you need some** — which, for a function that
commissions pay analyses, is a question about sequencing as much as content: whether an analysis is
run for counsel is decided when you ask for it, not after you read it.

## Calibration prompt — before you start

*Two predictions, one minute.*

**What share of employers do you think now have a formal written AI policy?** Whole percent.

**And of those that have one, what share do you think believe their own policy is clear and
future-proof?**

The first number is probably higher than you expect. The second is the module.

---

## Module brief

101 M7 gave you the lines that don't move — the general ones, for everyone in HR. This module is
about the specific ones for your function, and there are three reasons this track needs its own
version rather than a reference back.

**First, you hold fiduciary duties nobody else in HR holds.** If you touch retirement plan
administration or health plan claims, you are operating under a statute that is unusually
interested in *how* you reached a decision, not merely what you decided.

**Second, your analysis becomes a legal document more often than you think.** A pay equity study is
either privileged or it is a plaintiff's exhibit, and which one it becomes is decided by how it was
commissioned and conducted — not by what it found.

**Third, and this is the one specific to AI: your data is the thing you're auditing.** A model
trained or fitted on your historical pay learns what you have paid. If you then use it to recommend
what to pay, it will reproduce the pattern you built the audit to detect, and it will do so
fluently, with a rationale attached.

The governing claim of the module, which you'll be asked to take a position on:

> **"The tool recommended it" is not a defense anywhere in HR. Where you hold a fiduciary duty,
> it's an admission.**

## Learning objectives

By the end of this module you should be able to:

1. Apply the speed/accountability line to decide which side of it a task sits on.
2. Name the four zones in comp and benefits where the answer changes, and say why for each.
3. Explain why a model fitted on historical pay is structurally unsuited to recommending pay.
4. Read a regression's control set critically enough to see what it smuggles in `[V]`.
5. State the current statutory and case-law floor well enough to know when to call counsel `[V]`.
6. Draft an operating policy that names red lines specific to comp work.

## Lesson 1 · The governing principle

One line, and everything else in this module follows from deciding which side of it a task sits on.

> **AI for speed. Human-built tooling for accountability.**

The distinction is not about difficulty or sensitivity. It is about **what you will be asked to
produce if someone challenges the outcome.**

If the challenge would be answered by showing the result — *here's the summary, here's the draft,
here's the comparison* — the work is a speed problem and AI belongs in it. If the challenge would
be answered by showing **the method**, and specifically by showing that a competent person applied
a defensible method and can explain each choice in it, then the work is an accountability problem.
Accountability work runs on tooling you built, whose logic you can state, whose inputs you can
produce, and whose decisions were made by a person who can be asked why.

The test that operationalizes it: **imagine the deposition.** Not because you expect one, but
because it's the cleanest way to surface what the artifact has to survive. "Why is this employee's
adjustment 4% and that one's 2%?" has an answer or it doesn't. **"The model suggested it" is not
an answer** — it's a description of how you avoided having one.

And note that this line does not put AI outside the accountability work. It puts AI *underneath* a
human decision inside it. Drafting the memo that explains a pay equity finding is a speed problem
even though the finding is accountability work. **Separating the two inside a single piece of work
is most of the skill.**

## Lesson 2 · The four zones

Where the answer changes for this function specifically.

**Zone 1 — Pay equity analysis under privilege.** The sophisticated posture in US practice is to
conduct pay equity analysis **at the direction of counsel**, so that the analysis and its
intermediate findings are protected as privileged attorney-client communication or work product.
The reason is blunt: an unprivileged study that identifies an unexplained gap and sits unremediated
in a shared drive is a plaintiff's exhibit with your name on it.

What AI changes is that every step of the analysis now potentially involves a third party. Which
brings us to the part of this module that is genuinely unsettled — see Lesson 4. **Before you put
pay equity data into any tool, the question "is counsel directing this work, and in writing?" comes
first.** Not because a tool is unsafe, but because privilege is a fragile status that depends on
facts about how the work was commissioned.

**Zone 2 — Fiduciary duty on benefit plans `[V]`.** If you administer retirement or health plans,
ERISA's duties of prudence and loyalty apply to your process, and there is no AI carve-out. There
is also, at present, no AI-specific ERISA rule — the ordinary duties do all the work, which is
worth understanding as a feature rather than a gap. Prudence, loyalty, monitoring, documentation,
and the exclusive benefit rule already reach this.

The practitioner consensus is consistent and narrow: **AI sits in a decision-support role with
final authority in human hands, and adverse benefit determinations require human involvement.**
Delegating claim denials to an opaque model is the paradigm case of what the duty forbids. And
because courts examine *how* fiduciaries reached decisions rather than only what they decided,
**your process record is the asset** — which is exactly Module 3's craft layer, arriving here with
a statute behind it.

**Zone 3 — Comp committee and proxy inputs.** Material that goes into executive compensation
disclosure is subject to a level of scrutiny nothing else in your work faces. The audience includes
your compensation committee, your external counsel, your compensation consultant, institutional
investors, proxy advisors, and eventually anyone who reads the filing. Drafting assistance is
fine. **Analysis that determines a number in the filing needs to be reconstructible by a human
who can testify to it**, which is Module 3's rule with a securities law consequence attached.

**Zone 4 — The circular one, and the sharpest.** Disparate impact exposure when a model trained on
historical pay recommends adjustments.

Take it slowly, because the failure is elegant. Your historical pay data encodes every decision
your organization has made — including the ones a pay equity audit exists to find. A model fitted
on that data learns the pattern. Ask it to recommend an adjustment and it will produce one
consistent with the pattern, because consistency with the training data is what fitting means.
**The model reproduces the disparity and calls it a recommendation.**

Two things make this worse than an ordinary bias problem. It is **fluent** — the recommendation
arrives with a rationale, and the rationale is coherent because it was generated to be. And it is
**scaled** — a biased human manager affects their own team, while a biased model applied across the
population affects everyone at once, in the same direction, which is precisely the fact pattern
disparate impact doctrine is built for.

The general-purpose version of this is worth knowing too: a controlled audit of general models used
for salary advice found statistically significant differences by gender, and substantial gaps by
university and major that were inconsistent across model versions. Module 5 covers that from the
counterparty's side. **From your side the implication is simpler: a comp team using the same
general tool to set pay would be introducing exactly the disparity this zone is about.**

The rule: **a model may describe your pay patterns. It may not recommend your pay decisions.**
Description is analysis and analysis is what you want. Recommendation is the circularity.

## Lesson 3 · Method literacy **[V]**

The zones tell you where to be careful. This lesson is about the thing you are most likely to be
handed and least likely to challenge: a regression.

You will be asked to interpret one — from a vendor's pay equity product, from an external
consultant, or from your own analysis. **Reading it critically is the job, and the critical
questions are not statistical.**

**What does it control for, and what does that choice smuggle in?** A pay equity regression
typically controls for job level, function, location, tenure, and performance rating. Each of those
is defensible and each is also a potential channel for the disparity you're measuring. If women are
systematically leveled lower at hire, then controlling for job level **absorbs the effect into a
control variable** and the residual gap shrinks toward zero. The model is not wrong. It is
answering a narrower question than the one people will think it answered: *within level, is pay
equitable* — not *is our pay equitable*.

That is the single most consequential thing in this lesson. **"Explained" variance is a modeling
decision with fairness consequences, not a statistical fact.** When a result says 94% of the pay
gap is explained by legitimate factors, the operative word is "legitimate," and it was defined by
whoever chose the control set — often before anyone looked at the data.

**What is performance rating doing in there?** It is the most common control and the most
contestable, because it's a human judgment produced by the same organization whose pay decisions
you're auditing. Controlling for it treats it as exogenous and legitimate. If ratings themselves
carry disparity, you have controlled away part of what you were looking for.

**What's the unit and how thin is it?** Regressions on small populations produce unstable
coefficients. A −1.8% gender effect on 180 employees with 14 job families is a number that will
move if you re-cut it, and Module 3's plausible-coefficient problem applies at full force.

**And what does the vendor's product actually compute?** Ask for the specification. Which variables,
which functional form, how missing data is handled, what population is included and excluded. A
vendor who won't tell you has told you something. This is Module 2's teardown, applied to the
technical artifact you're most likely to accept on authority.

> ### Try this — 4 minutes
> Take your most recent pay equity analysis — yours or a vendor's. Write down its control
> variables. For each, ask: could the disparity we're looking for travel through this variable?
> Then ask who chose the list, and when.

## Lesson 4 · The floor **[V]**

Two moving surfaces. Both change while you're reading this, which is why the module teaches you
where to look rather than a memorized state of the law.

### The privilege question is genuinely unsettled

In February 2026, two US federal courts reached **opposite results in the same week** on whether
using a generative AI tool waives privilege or work product protection. This is worth knowing in
detail, because the reconciliation is what tells you how to behave.

In ***United States v. Heppner*** (S.D.N.Y., written opinion February 17, 2026), a criminal
defendant who had retained counsel put information he'd learned from his lawyers into a public
conversational AI platform — **acting independently, not at counsel's direction.** The court held
that neither attorney-client privilege nor work product protection applied, on three independent
grounds: the platform is not a lawyer, so there was no attorney-client communication; the
platform's terms defeated any reasonable expectation of confidentiality; and the purpose was not
to obtain legal advice from something that disclaims giving it. It was a question of first
impression nationwide.

A week earlier, in ***Warner v. Gilbarco, Inc.***, a court reached the other result on work
product: a pro se plaintiff's use of generative AI in litigation **did not** waive protection,
because AI programs are "tools, not persons," disclosure to a tool is not disclosure to an
adversary, and holding otherwise "would nullify work-product protection in nearly every modern
drafting environment."

**These are reconcilable, and the reconciliation is the practical rule.** Heppner turns on consumer
terms of service *plus* the absence of counsel's direction. Gilbarco turns on a tool used as a
drafting instrument in the ordinary course. What follows for you: **enterprise deployment with
confidentiality terms, plus documented direction of counsel.** That is the posture with the best
current argument.

And the honest part, which a module about evidence has to say: **no court has yet ruled on the case
where counsel expressly directs a client to use an AI tool as part of the representation** — which
is exactly the pay equity posture this track teaches. The floor here is being built, and anyone
who tells you it's settled is selling something.

### Pay transparency, on two continents `[V]`

**In the US**, 18 states plus Washington DC have pay transparency laws, with penalties running from
$100 to $250,000 per violation depending on jurisdiction. The regimes are not uniform: some require
a range in every posting, others only on request or after an interview. Most require a **good-faith
estimate** of what you actually expect to pay — which is a substantive standard, not a formatting
one. And remote postings are generally subject to the law of any state where the work could be
performed, so a multi-state employer is effectively complying with the strictest applicable rule.

Where AI touches this: **generating ranges for postings.** A model that produces a plausible range
from market data has produced a number that must be a good-faith estimate of what you'd actually
pay. Those are different standards, and only one of them is legally operative.

**In the EU**, the Pay Transparency Directive's transposition deadline of 7 June 2026 has passed,
and only four of twenty-seven member states had complete national legislation in force — Italy,
Slovakia, Lithuania, and Malta — while Germany, France, Spain, the Netherlands, Sweden and Denmark
missed it. **Late transposition does not mean no obligation**; it means you are tracking twenty-odd
national implementations arriving on different schedules with different details.

The substance: employers above the size threshold report the median gender pay gap, the gap in
variable components, and the proportion of each gender in each quartile pay band. Where a gap of
**5% or more** exists in a category of workers, cannot be justified on objective gender-neutral
criteria, and is not remedied within six months, **Article 10 requires a joint pay assessment
conducted in cooperation with worker representatives.**

**And here is the collision, which is the most role-specific thing in this module.** The joint pay
assessment **cannot be conducted confidentially** — it is produced with worker representatives and
made available to workers, equality bodies, and labour inspectorates. That is the exact opposite of
the US privilege posture in Zone 1, where the sophisticated move is to run the analysis under
counsel precisely to keep it out of discovery.

If your organization operates on both sides, **you have to hold two opposite postures at once**:
privileged and protected in the US, mandatory and published in the EU. Not sequentially — at the
same time, on the same underlying pay data. That is a governance design problem, not a compliance
checkbox, and it is worth raising with counsel before it arrives as a surprise.

## Key takeaways

- **AI for speed. Human-built tooling for accountability.** The test is what you'd have to produce
  if challenged: the result, or the method. Imagine the deposition.
- **"The tool recommended it" is not an answer** — it's a description of how you avoided having
  one.
- **Four zones:** pay equity under privilege; ERISA fiduciary duty on benefit plans; comp committee
  and proxy inputs; and the circular one.
- **ERISA has no AI carve-out and needs none** `[V]` — prudence, loyalty, monitoring and the
  exclusive benefit rule already reach it. AI in decision support, final authority human, adverse
  determinations involving a person. Courts examine *how* you decided, so the process record is the
  asset.
- **A model fitted on historical pay learns what you paid, which is the thing you're auditing.** It
  reproduces the disparity fluently and at scale. **A model may describe your pay patterns; it may
  not recommend your pay decisions.**
- **"Explained" variance is a modeling decision with fairness consequences, not a statistical
  fact.** Controlling for job level answers *within level, is pay equitable* — a narrower question
  than the one people hear. Performance rating is the most common control and the most contestable.
- **Privilege and AI is unsettled** `[V]`. Two federal courts split in one week; the reconcilable
  rule is enterprise deployment plus documented direction of counsel — and no court has yet reached
  the case where counsel directs the AI use.
- **18 states plus DC on pay transparency** `[V]`, mostly on a good-faith-estimate standard, with
  remote postings pulling you to the strictest applicable rule.
- **The EU deadline passed with 4 of 27 in force** `[V]`, and its joint pay assessment **cannot be
  confidential** — which collides head-on with the US privilege posture. Both at once, on the same
  data.

## Take a position

**The claim:** *"'The tool recommended it' is not a defense anywhere in HR. Where you hold a
fiduciary duty, it's an admission."*

The strongest counter-argument is that **this proves too much, and taken seriously it would freeze
the function.** Every professional relies on instruments they cannot fully reconstruct — actuarial
tables, survey methodologies, the statistical packages behind every regression you've ever
presented. Nobody calls it an admission when a comp analyst can't derive a survey provider's aging
methodology from first principles; they call it reasonable reliance on a recognized instrument.
On that view the distinction isn't human-versus-AI at all, it's whether the instrument is
**professionally recognized and appropriately validated** — and AI tools will cross that threshold
in some uses, at which point relying on them will be prudent rather than negligent, and refusing to
may be the harder position to defend. Your position has to say where that threshold sits and how
you'd know it had been crossed.

## Applied activity — "The operating policy"

**Time:** 30 minutes · **Submit:** the policy plus a 300–400 word write-up · **Graded against the
rubric below.** Score doesn't matter. Doing the work is where the learning lands.

**A word about what this is worth, because Module 2 requires the honesty.** You may have been told
that written AI policies are rare and that you'll be ahead of the field by having one. That isn't
true: roughly **68% of employers now have a formal AI policy** `[V]`, about double the share a year
earlier. So the policy itself is not the differentiator.

**Here is the real gap.** Of the organizations that have a policy, only about a quarter believe it
is clear and future-proof, and **44% of US workers say their employer has no clear AI policy or
they don't know whether one exists** `[V]`. Policies exist and they are generic — written by
Legal or IT for the whole organization, at a level of abstraction that answers no question a comp
analyst actually has at 4pm during merit cycle. Your organization's policy almost certainly does
not mention pay equity, fiduciary decisions, or proxy inputs.

**So you are not writing a policy. You are writing the comp and benefits appendix to one, and it
has to be specific enough to be usable under time pressure.**

**Step 0 — Find the existing policy (3 min).** Read it. Note what it already covers and what it
says nothing about. If there isn't one, say so — that's a finding, and you write the section
anyway.

**Step 1 — Red lines (8 min).** Things your function will not do, stated so specifically that
someone could tell whether they'd crossed one. Not "we won't use AI for sensitive decisions" —
**"individual pay adjustment amounts are not generated or recommended by a model"** is a red line.
Cover at minimum: the four zones, individual pay data movement, and anything touching a benefit
plan determination.

**Step 2 — Approved uses (7 min).** What your function *may* do, named as specifically as the red
lines. This half matters more than people expect: a policy that only forbids gets ignored, because
the work still has to get done and everyone knows the tools help. **Give people somewhere to go.**

**Step 3 — Review checkpoints (7 min).** For uses that sit between the two — which is most real
work — what has to happen before the output leaves your hands. Which of Module 3's checks are
mandatory. Who reviews. What gets recorded, and where.

**Step 4 — Escalation (3 min).** Who gets called, for what, and how fast. Name roles, not
departments. **"Consult Legal" is not an escalation path** — it's what people write when they don't
know who to call.

**Step 5 — Score the predictions (2 min).** Your two numbers against the figures above. Most people
underestimate how many organizations have a policy and overestimate how good those policies are.

Then the write-up: what your existing policy already covered, the single most important red line
and why it's the one you'd defend, your position on the claim above with its counter-argument
addressed, and — the honest one — **which red line your function has probably already crossed.**
The policy that admits one is more useful than the one that reads like nobody has ever been
tempted.

**Before this goes anywhere near adoption: counsel review.** You are drafting the practitioner's
version. The lawyer's version comes after.

## Knowledge check — 8 questions

*Unlocks after the applied activity is submitted. Retakes are free and unlimited.*

**Q1.** What determines which side of the speed/accountability line a task sits on?

- A. How sensitive the underlying data is
- B. What you would have to produce if the outcome were challenged — the result, or the method with each choice explained ✓
- C. Whether the task is legally regulated
- D. How much time the task currently takes

> **B.** Sensitivity and regulation both correlate with it and neither is the test. The deposition
> question surfaces it fastest: does "why is this person's adjustment 4%?" have an answer.

**Q2.** Why is a model fitted on historical pay structurally unsuited to recommending pay?

- A. Because historical pay data is usually incomplete
- B. Because it learns the pattern in what you have paid — including the disparities a pay equity audit exists to find — and reproduces them fluently and at scale, with a rationale attached ✓
- C. Because pay decisions require contextual judgment models can't access
- D. Because compensation data changes too quickly for a fitted model to stay accurate

> **B.** Consistency with the training data is what fitting means. C is true and much weaker; the
> circularity is the specific problem. **A model may describe your pay patterns; it may not
> recommend your pay decisions.**

**Q3.** A pay equity regression controls for job level, and the residual gap is near zero. What does this establish? `[V]`

- A. That pay is equitable across the organization
- B. That, within level, pay is equitable — which is a narrower question, and if women are systematically leveled lower at hire the control has absorbed the effect you were looking for ✓
- C. That job level is the primary driver of pay in the organization
- D. That the analysis was correctly specified

> **B.** The model isn't wrong; it's answering something narrower than people will hear.
> **"Explained" variance is a modeling decision with fairness consequences, not a statistical
> fact** — and "legitimate" was defined by whoever chose the control set.

**Q4.** What does ERISA require of AI use in benefit plan administration? `[V]`

- A. A specific AI disclosure filed with the Department of Labor
- B. Nothing yet — no AI-specific rule has been issued
- C. Nothing AI-specific, because the ordinary duties already reach it: AI in decision support, final authority with a human, and human involvement in adverse benefit determinations ✓
- D. That any AI vendor be a named plan fiduciary

> **C.** B is half-right and misleads — the absence of an AI-specific rule is not an absence of
> obligation. Prudence, loyalty, monitoring and the exclusive benefit rule do the work, and courts
> examine *how* you decided, which makes the process record the asset.

**Q5.** What's the practical rule that reconciles *Heppner* and *Warner v. Gilbarco*? `[V]`

- A. That AI use always waives privilege in criminal matters but not civil ones
- B. That work product survives AI use but attorney-client privilege never does
- C. Enterprise deployment with confidentiality terms plus documented direction of counsel — Heppner turned on consumer terms and the absence of counsel's direction, Gilbarco on a tool used as an ordinary drafting instrument ✓
- D. That pro se litigants receive greater protection than represented parties

> **C.** And the honest coda: **no court has yet ruled on counsel expressly directing the AI use**,
> which is exactly the pay equity posture. The floor is being built.

**Q6.** What's the operative standard for a salary range in a posting under most US pay transparency laws? `[V]`

- A. The range must match the approved band in the compensation structure
- B. A good-faith estimate of what the employer actually expects to pay — which is a substantive standard, not a formatting one ✓
- C. The range must be within 20% of market median for the role
- D. The range must reflect the actual pay of current incumbents

> **B.** Which is why a model producing a plausible-looking range from market data hasn't
> necessarily produced a compliant one. Plausible and good-faith are different standards, and only
> one is legally operative.

**Q7.** Why does the EU joint pay assessment collide with US pay equity practice? `[V]`

- A. Because the EU uses a different definition of the gender pay gap
- B. Because it cannot be conducted confidentially — it's produced with worker representatives and available to workers and labour inspectorates — while the US posture runs the analysis under counsel precisely to protect it from discovery ✓
- C. Because the EU threshold of 5% is stricter than any US requirement
- D. Because EU member states transposed the directive on different schedules

> **B.** Two opposite postures, at the same time, on the same underlying pay data. C and D are both
> true and neither is the collision.

**Q8.** What's the strongest counter-argument to "the tool recommended it is an admission"?

- A. That AI recommendations are often more consistent than human ones
- B. That professionals routinely rely on instruments they can't reconstruct — actuarial tables, survey aging methodologies, statistical packages — and we call that reasonable reliance, so the real distinction is whether the instrument is professionally recognized and validated ✓
- C. That fiduciary standards were written before AI existed and don't contemplate it
- D. That vendors indemnify customers against errors in their models

> **B.** It's strongest because it points at a threshold AI tools will cross for some uses, after
> which relying on them is prudent rather than negligent. The position you owe is where that
> threshold sits and how you'd know it had been crossed.

## Sources and attribution

- **Privilege `[V]`:** *United States v. Heppner* (S.D.N.Y., ordered Feb 10, 2026; written opinion
  Feb 17, 2026) — no privilege or work product over AI documents; three independent grounds; matter
  of first impression. *Warner v. Gilbarco, Inc.* (Feb 10, 2026) — work product **not** waived; AI
  programs are "tools, not persons." The reconciliation offered here is this course's reading, not
  a holding.
- **ERISA `[V]`:** practitioner consensus on prudence, loyalty, monitoring, documentation and the
  exclusive benefit rule as applied to AI; no AI-specific rule in force. *Note:* DOL EBSA Technical
  Release 2026-01 (April 1, 2026) concerns **proxy advisory services, not AI** — it is relevant to
  Module 5, and should not be cited as AI guidance.
- **US pay transparency `[V]`:** 18 states plus DC; penalties $100–$250,000 per violation by
  jurisdiction; good-faith-estimate standard predominant; remote postings generally subject to any
  state where work could be performed.
- **EU Pay Transparency Directive (EU) 2023/970 `[V]`:** 7 June 2026 transposition deadline passed
  with four member states in force (Italy, Slovakia, Lithuania, Malta); Article 10 joint pay
  assessment triggered at a 5% unjustified gap unremedied within six months, conducted with worker
  representatives and not confidential.
- **AI policy prevalence `[V]`:** 68% of employers with a formal AI policy, roughly double the
  prior year (Littler, May 2026 Annual Employer Survey); about a quarter of policy-holders believe
  their policy is clear and future-proof; 44% of US workers report no clear policy or don't know.
- The four zones, the speed/accountability line, the description-not-recommendation rule, and the
  control-set critique are original to this course.
- Builds on 101 M7 (the lines that don't move) and Module 3 (the process record as the asset).
- **This module is not legal advice, and its legal surface is volatile.** Counsel review is
  required before your organization adopts anything built from it.
