# AI 301 · People Ops & HR Technology · Module 6 — What the assistant can reach

**Course:** AI 301 · The Specialist — People Ops & HR Technology track · Module 6 of 8
**Estimated time:** 30 min content · 10 min exercise · 30 min applied activity
**Prerequisite:** Modules 1–3 · extends 201 M6 (people data in production) by reversing its direction
**Position in the track:** the sleeper — the topic nobody outside this role would think to raise

> `Concepts reviewed: [DATE] · Examples current as of: [DATE]`
> Lessons 1 and 4 are **volatile layer** — platform mechanics and vendor guidance move quarterly.
> The provenance-laundering argument and the least-privileged test are stable.

---

## Calibration prompt — the claim to contest

*Commit before you read anything. Thirty seconds.*

**The claim:** *"Someone in your company can already read something you would never have given them."*

Not through misconduct. By asking a reasonable question.

**Is that true of your organization?** *True of us* or *not true of us*, and the one sentence you would
defend it with.

**And the number you will check:** the activity asks you to run **ten questions from a
least-privileged test account** — an account with the permissions of an ordinary individual
contributor, not yours. **How many of the ten will return something that account should not have
reached?**

Out of ten. Commit before you try it, because trying it is the module.

---

## Module brief

201 M6 asked the question every practitioner needs: *what may I put into this tool?* It gave you
data tiers, a boundary sheet, and the test of whether a run could be shown to the person it concerns.
That question is outbound, it is per-workflow, and you answer it deliberately each time.

This module runs the opposite direction, and nobody is pasting anything.

**What may a system retrieve, on somebody else's behalf, across your entire corpus, forever?** You do
not answer that question per use. You answered it years ago, accidentally, through a thousand sharing
decisions made by people who are no longer here — and an assistant has just made every one of those
decisions consequential at the same moment.

This is the module that only someone in your role would raise, and it is the one where the risk is
least visible, because **nothing breaks.** There is no error, no incident, no complaint. A person asks
a question and gets a good answer, and the answer contains something they were never meant to see.
Neither party notices.

## Learning objectives

By the end of this module you should be able to:

1. State the retrieval mechanism accurately `[V]` — including why "the assistant only sees what the
   user can see" is both true and the entire problem.
2. Explain why HR's corpus is a worse case than any other function's, and why generic rollout
   guidance under-serves you invisibly.
3. Describe how summarization launders provenance, and the three practical consequences.
4. Apply the least-privileged persona test, and say why testing as yourself is the discipline's most
   common error `[V]`.
5. Produce an exclusion list — the artifact only this role can author — and argue for it without
   owning the tenant.

## Lesson 1 · The mechanism **[V]**

Take this from the platform documentation rather than from anybody selling a remediation product.

An enterprise assistant grounds its answers in a **semantic index** built across your organization's
content. When a user prompts it, it retrieves the material most relevant to the question **from what
that user is permitted to see.** If a user cannot open a file, the assistant cannot open it on their
behalf. The index does not create new access.

That sentence is the vendor's reassurance and it is entirely true. It is also the whole problem, and
you have to hold both at once:

> **The assistant does not create new access. It inherits your existing access model — including
> every mistake in it.**

And the mistakes are not exotic. They are the ordinary residue of a decade of normal work:

- An "anyone with the link" share created for one meeting in 2021.
- A site whose permissions were widened during a migration and never narrowed.
- A folder inherited by a team that has since tripled in size.
- A document attached to a channel that everyone was added to.
- A departed employee's files, reassigned to a manager with broad delegation.

Each of those was a small, defensible decision. Together they are your actual permission model, and
nobody has ever read it end to end.

The precise formulation worth memorizing:

> **Every over-share you already had is now one prompt away.**

The exposure existed yesterday. What changed is the **effort** required to reach it — and effort was
doing all the load-bearing work. Access controls were never your only protection. They were the
second line. The first was that a person had to know a document existed, know roughly where to look,
and go and get it, and each of those steps required intent and left a trace.

Which sets up how you argue about this internally, because there is a true sentence that is also
completely useless:

> *"This is a permissions problem, not an AI problem."*

Correct, and it settles nothing. The permissions problem was survivable at the old discovery cost and
is not survivable at the new one. **"AI didn't cause this" is true and is not a defence** — it removed
the friction that made a latent problem tolerable, which is a change in kind even though nothing in
the access model moved.

**One note on sourcing, since this module is about not being sold to.** The mechanism above is
documented by the platform vendor. The dramatic incident reports that circulate alongside it —
salary data returned in response to a benign question, AI summaries of disciplinary discussions
reaching people who were not in them — come largely from **security vendors who sell remediation**,
and their counts are not independently verified. Reason from the mechanism. Do not build your
internal business case on somebody else's marketing number, because the first competent person who
checks it will discredit the rest of your argument.

## Lesson 2 · Why HR is the worst-case corpus

Every function has over-shares. Yours are different in kind, and the difference is a ratio.

Consider what sits in your corpus: compensation files and offer letters. Disciplinary records and
investigation notes. Accommodation documentation, which is medical information. Exit interviews with
candid commentary. Restructure planning documents naming people who have not been told. Legal-hold
material. Calibration notes containing what managers actually said about their reports.

Nowhere else in the organization is the proportion of **restricted** to **routine** content this
high. Finance holds sensitive aggregates. Legal holds sensitive matters. **HR holds sensitive
individuals** — and this is the part that makes it structurally worse:

> **The subjects of your documents are employees of the company, and they have assistant licences.**

Elsewhere, the sensitive document is about a customer, a deal, or a number. Here it is about the
person typing the prompt, or their manager, or the colleague they are in a dispute with, or the
person whose role is about to be eliminated. **The people with the strongest motive to go looking are
inside your tenant, and they are asking in good faith about their own situation.**

Which produces a specific and easily-missed consequence. **Generic enterprise rollout guidance
under-serves you, and it under-serves you invisibly.** Your IT function's deployment playbook is
calibrated to a corpus that is mostly routine with pockets of sensitivity — that is the normal shape
of an enterprise tenant, and the recommended controls are sized for it. Your corpus inverts that
ratio. The controls are not wrong; they are the right size for the wrong distribution, and nothing in
the rollout process will surface the mismatch, because nobody involved is reading your documents.

## Lesson 3 · Summarization launders provenance

Now the genuinely new failure mode, which is not about permissions at all.

Every permission model ever designed rests on an assumption nobody wrote down: **that finding
something is work.** Three steps stood between a curious person and a document — knowing it existed,
knowing roughly where it was, and going to get it. Each step required intent. **The last one left an
audit record.**

Retrieval removes the first two. Summarization removes the third, and that is the part with no
precedent.

Here is the shape of it. A user asks a general question — *what's the thinking on the Commercial
reorg?* The assistant answers well, drawing on several sources. The answer contains the substance of
a planning document that user would never have located and would not have opened. And:

- **No filename.** They cannot cite what they learned, and neither can you.
- **No permission prompt.** Nothing asked them to confirm they should be looking at this.
- **No download or open event.** There is no access record, because there was no access.
- **No entry in any audit log saying they read it.** They did not read it. They read an answer.

Three practical consequences, in ascending order of how much trouble they cause:

**Your leak investigation will fail.** Something confidential circulates and you go looking for file
access. There is none, for anybody. The trail you have spent a career learning to follow does not
exist for this class of disclosure.

**The user is not culpable in any ordinary sense.** They asked a reasonable question and received a
helpful answer. There is no misconduct to address — which also means **there is no deterrent**, and
no conversation you can have that changes anything. Every control here has to be preventive, because
after-the-fact enforcement has nothing to attach to.

**Aggregation produces facts no document contained.** This is the worst one. Three partially-reachable
sources — a calendar, a draft org chart, a budget note — can yield a conclusion that exists in none
of them: who is being managed out, which team is being restructured, who has been interviewing.
Nobody over-shared *that*. The assistant assembled it, and the assembly is not in anyone's index of
sensitive documents because it did not exist until it was asked for.

**And the version specific to this role: your reporting surface.** An assistant that can write queries
against your HCM can aggregate its way back to an individual. *Average salary for the Design team* is
a reasonable question, and it is a disclosure of one person's pay when the Design team is three
people. You are the function that runs reports for everybody, and now the reporting interface accepts
natural language from people who do not know what a suppression threshold is.

**A boundary worth naming**, because a sibling track owns the adjacent discipline: disclosure control
and small-N suppression as a *statistical* practice belong to People Analytics. What belongs to you is
narrower and more concrete — **whether the retrieval surface can be asked the question at all**, and
what minimum group size it refuses below. That is a configuration, not a statistic.

> ### Try this — 3 minutes
> Ask your assistant a question about your own organization that you would expect to require
> restricted knowledge — something about a reorg, a pay range, or a departure. Do not use a
> privileged account if you can avoid it. Then ask yourself the harder question: **if it had answered
> fully, where would the record of that be?**

## Lesson 4 · What this role does about it **[V]**

Five moves. The third one finds everything and almost nobody does it.

**1. Inventory what each assistant indexes — as a separate question from what your HCM permits.**
These are now two different systems of record for access, and the answer to one tells you nothing
about the other. Per assistant, ask: which repositories, which sites, which mailboxes, which chat
history, and **is there an exclusion mechanism?** Write the answers down; this is a Module 1 register
row.

**2. Exclusion before labelling.** Platforms and their governance tooling let you exclude entire
sites and repositories from the index. That is cheaper and more reliable than classifying individual
documents correctly, and it is available now. Sensitivity labelling at the source is the better
long-term control and the wrong first move, because **labelling only protects you to the extent it is
right**, and yours is not yet. The principle is one the Comp & Benefits track states in a different
context and it transfers exactly:

> **The most reliable protection for a document is not being in the index.**

**3. Test as a least-privileged persona, never as yourself.** This is the highest-yield action
available to you and the discipline's most common error, for a reason that is almost funny: **you are
an administrator. You can see everything. You are therefore the worst possible tester**, and every
test you run as yourself returns a reassuring result that means nothing.

The platform vendor's own validation guidance says the same thing — check exposure by searching as
each persona, standard users as well as privileged roles. Concretely: obtain a test account carrying
the permissions of a mid-level individual contributor with no HR role, and ask it the ten questions
you would least like answered. That is the activity.

**4. Constrain the reporting surface, not only the document surface.** If an assistant can query your
HCM, decide the minimum group size below which it must refuse to return a figure — and then **check
that it refuses**, because a documented threshold and an enforced threshold are different things.

**5. And the move most of you actually need, because you do not own the tenant.** In many
organizations the assistant belongs to IT and you have no administrative rights over it at all. What
you do have is the only accurate map in the building of **which content is restricted and why** —
which makes you the one person who can author the exclusion list. Nobody in IT knows that the
site called *Project Northstar* holds redundancy selections.

So: **bring the list, not the concern.** A concern gets acknowledged and filed. A list of eleven named
sites, each with one sentence about what it contains and why it must not be indexed, gets acted on —
because it converts your problem into their ten-minute configuration task.

This is the one place this track touches the HR business partner's territory: influence without
authority. If the HRBP track's adversarial-rehearsal module is available to you, its adversary set
applies directly here. If not, the short version: commit your position before you go in, name the
specific artifact you want rather than the outcome you want, and bring the version of the request
that costs the other person the least.

## Key takeaways

- **The assistant does not create new access. It inherits your access model, including every mistake
  in it** `[V]`. Retrieval runs against a semantic index scoped to what the asking user may see — true,
  reassuring, and the entire problem.
- **Every over-share you already had is now one prompt away.** The exposure existed; the effort that
  hid it did not survive. So **"AI didn't cause this" is true and is not a defence** — the permissions
  problem was survivable at the old discovery cost and is not at the new one.
- **Reason from the mechanism, not from security-vendor incident counts.** The mechanism is
  documented; the dramatic numbers come from people selling remediation and are not independently
  verified.
- **HR is the worst-case corpus by ratio** — restricted to routine — and worse, **the subjects of your
  documents are employees with assistant licences.** Generic rollout guidance is sized for the
  opposite distribution and the mismatch never surfaces.
- **Summarization launders provenance.** No filename, no permission prompt, no access event, no audit
  entry — because they read an answer rather than a document. Consequences: your leak investigation
  fails, **the user is not culpable so there is no deterrent**, and every control has to be preventive.
- **Aggregation produces facts no document contained.** Three partially-reachable sources can yield
  who is being managed out. Nobody over-shared that; the assistant assembled it.
- **The reporting surface is your specific exposure** — natural-language queries against your HCM can
  aggregate back to an individual, and "average salary for the Design team" is a pay disclosure when
  the team is three people.
- **Five moves:** inventory what is indexed separately from what the HCM permits; **exclusion before
  labelling**, because the most reliable protection for a document is not being in the index; **test as
  a least-privileged persona, never as yourself**; enforce a minimum group size on the reporting
  surface and verify it refuses; and where you do not own the tenant, **bring the exclusion list, not
  the concern.**

## Take a position

**The claim:** *"Your permission model assumed people had to find the document. It now faces a system
that will summarize it for them on request."*

The strongest counter-argument is not that the claim is wrong. It is that **the problem is real and it
is not yours, and treating it as yours makes it worse.**

The exposure is a tenant-wide permissions failure accumulated over a decade by thousands of sharing
decisions across every function. It will be fixed, if at all, by IT and security — who have the
tooling, the budget, the administrative rights, and the mandate. A People Operations function that
appoints itself auditor of the organization's sharing model will spend a quarter producing findings,
discover it has no authority to act on any of them, and in the process **absorb accountability for a
problem it cannot solve.** That is strictly worse than leaving it where it belongs, because now there
is a document with your name on it establishing that you knew.

On that view the correct move is a one-page escalation that names the HR-specific ratio, hands it to
the function that can act, and gets back to work that is actually yours — the enablement decisions,
the corpus governance, the register.

Your position has to say **what specifically remains with you after that escalation, and where the
authority for it comes from.** Note that the counter-argument is a close relative of the objection the
HRBP track's legal module faces — *this is not your job, you are absorbing work belonging to functions
with better information* — and it is strong in both places. If your answer is that everything stays
with you, say where the mandate comes from. If your answer is that nothing does, explain who else can
possibly write down that *Project Northstar* holds redundancy selections.

## Applied activity — "Ask as someone else"

**Time:** 30 minutes · **Submit:** the ten queries and results, the index inventory, the exclusion
list, and a 300–400 word write-up · **Graded against the rubric below.** Score doesn't matter. Doing
the work is where the learning lands.

**Two rules before you start, and the first one is not optional.** **Get permission and use a
designated test account.** Do not probe production systems with a colleague's credentials, do not use
a real employee's account, and if your organization requires security sign-off for this kind of
testing, get it first — the finding is worth nothing if the method was unauthorized. And **report
results at the level of category, never content**: write *"returned a compensation figure for a named
individual"*, not the figure and not the name. Any submission containing retrieved confidential
content will be returned.

**Step 1 — Get a least-privileged persona (5 min).** A test account with the permissions of a
mid-level individual contributor with no HR role. If you cannot obtain one, say so — name who could
provide it and by when you will have asked. That blocker is itself a finding worth reporting.

**Step 2 — Ten questions (12 min).** Ask the ten things you would least like answered. Suggested
shapes, adapted to your organization: pay for a specific role or person; anything about a
restructure or a departure; disciplinary or performance content about a named individual;
accommodation or medical topics; something about a small team's aggregate pay; and one deliberately
general question — *what's the current thinking on the Commercial reorg* — because the general
question is where aggregation shows up. Record for each: what came back, and **whether that account
should have been able to reach it.**

**Step 3 — Index inventory (5 min).** For each assistant in your environment: which repositories,
sites, mailboxes and chat history are indexed, and whether an exclusion mechanism exists. Note where
you could not find out.

**Step 4 — The exclusion list (5 min).** Name the sites or repositories that should not be indexed —
each with one sentence on what it holds and why. **This is the artifact only you can write.** Aim for
specific and short over comprehensive.

**Step 5 — Score the prediction.** Your predicted count of ten against how many actually returned
something that account should not have reached.

Then the write-up: your position on the claim above, answering the counter-argument's specific
question — what stays with you after the escalation and where the authority comes from; whether the
opening claim turned out to be true of your organization; and the concrete next step — **who you are
taking the exclusion list to, and what you are asking them to do with it.**

## Knowledge check — 8 questions

*Unlocks after the applied activity is submitted. Retakes are free and unlimited.*

**Q1.** "The assistant only retrieves what the asking user can already see." How should you read that? `[V]`

- A. As a vendor claim that should be independently verified before deployment
- B. As true and reassuring — it means the assistant introduces no new exposure
- C. As true and as the entire problem, because it means the assistant inherits your existing access model including every mistake in it ✓
- D. As false — assistants index content beyond individual user permissions

> **C.** Both halves have to be held at once. No new access is created; every over-share you already
> had becomes one prompt away, because the effort that was hiding it does not survive.

**Q2.** Why is "this is a permissions problem, not an AI problem" an inadequate response?

- A. Because it is factually incorrect
- B. Because it is true and settles nothing — the permissions problem was survivable at the old discovery cost and is not survivable at the new one ✓
- C. Because permissions and AI risk cannot be separated technically
- D. Because it shifts responsibility to IT, who will refuse it

> **B.** "AI didn't cause this" is true and is not a defence. Removing the friction that made a latent
> problem tolerable is a change in kind, even though nothing in the access model moved.

**Q3.** What makes HR's corpus a worse case than other functions'?

- A. HR documents are more numerous than other functions' documents
- B. The ratio of restricted to routine content is higher than anywhere else — and the subjects of the documents are employees who hold assistant licences ✓
- C. HR documents are less likely to be correctly labelled
- D. HR systems have weaker access controls than finance systems

> **B.** Finance holds sensitive aggregates; HR holds sensitive individuals, and those individuals are
> inside your tenant asking in good faith about their own situation. Which is why generic rollout
> guidance, sized for a mostly-routine corpus, under-serves you invisibly.

**Q4.** What does it mean that summarization "launders provenance"?

- A. That the assistant removes metadata from documents it processes
- B. That the answer contains a document's substance with no filename, no permission prompt, no access event, and no audit entry — because the user read an answer rather than a document ✓
- C. That summaries are harder to classify than source documents
- D. That the assistant cannot cite its sources reliably

> **B.** Which breaks the assumption every permission model rests on: that finding something is work,
> and that the last step of finding it leaves a record.

**Q5.** Which consequence of provenance laundering does the module say causes the most trouble?

- A. That leak investigations will find no file access
- B. That the user is not culpable, so there is no deterrent
- C. That aggregation across partially-reachable sources produces facts no single document contained, which are therefore in nobody's index of sensitive material ✓
- D. That audit logs cannot be reconciled

> **C.** Three partially-reachable sources can yield who is being managed out. Nobody over-shared
> that; the assistant assembled it, and it did not exist until it was asked for. A and B are real and
> listed below it.

**Q6.** Why does the module recommend exclusion before sensitivity labelling?

- A. Because labelling requires licences that exclusion does not
- B. Because labelling only protects you to the extent it is correct, and yours is not yet — while the most reliable protection for a document is not being in the index ✓
- C. Because labels can be removed by document owners
- D. Because exclusion is required for regulatory compliance

> **B.** Labelling at the source is the better long-term control and the wrong first move. The
> principle mirrors the Comp & Benefits track's rule that the most reliable protection for a data
> element is its absence.

**Q7.** Why is testing the assistant as yourself the discipline's most common error? `[V]`

- A. Because administrators receive different model behaviour than standard users
- B. Because you are an administrator who can see everything, so every result you get is reassuring and means nothing — the vendor's own guidance is to validate exposure per persona ✓
- C. Because admin accounts are excluded from audit logging
- D. Because your queries are cached differently

> **B.** The fix is concrete: obtain a test account with the permissions of a mid-level individual
> contributor with no HR role, and ask it the ten questions you would least like answered.

**Q8.** For a practitioner who does not administer the assistant tenant, what does the module recommend?

- A. Escalating the risk in writing and treating it as another function's problem
- B. Requesting administrative access so the work can be done properly
- C. Authoring the exclusion list — the artifact only this role can write, since nobody in IT knows which site holds redundancy selections — and bringing the list rather than the concern ✓
- D. Delaying any assistant deployment until permissions are remediated

> **C.** A concern gets acknowledged and filed; a list of named sites with a sentence each converts
> your problem into their ten-minute configuration task. A is the position the module's
> counter-argument defends, and the write-up has to engage it.

## Sources and attribution

- **Platform documentation on retrieval and permissions** — that an enterprise assistant grounds
  answers in a semantic index over organizational content, retrieves only material the asking user is
  permitted to see, and **does not create new access** while making existing overshared content
  trivially discoverable. Also the vendor's own validation guidance: verify exposure by searching as
  each persona, standard users as well as privileged roles, and reduce exposure through site and
  repository exclusion and sensitivity labelling. **Platform mechanics change quarterly — re-verify
  against current vendor documentation. [V]**
- **Reported HR-specific incidents** — compensation figures returned to benign questions, AI summaries
  of disciplinary discussions reaching people not party to them. These circulate largely via **security
  vendors who sell remediation and are not independently verified.** Named here so learners know why
  the module reasons from the mechanism instead, and does not use the incident counts. **[V]**
- The corpus-ratio argument, the provenance-laundering analysis and its three consequences, the
  aggregation-produces-new-facts case, the reporting-surface constraint, the least-privileged persona
  test as framed here, and the bring-the-list-not-the-concern move are original to this course.
- Builds on 201 M6 (people data in production, whose outbound question this module reverses), and
  Modules 1–3 of this track. The exclusion principle mirrors `ai301-comp-m3`'s rule that the most
  reliable protection for a data element is its absence.
- **Horizontal note.** Small-N suppression and disclosure control as a *statistical* discipline belong
  to `ai301-analytics`. What this module owns is narrower and concrete: whether the retrieval surface
  can be asked the question at all, and what minimum group size it refuses below. Recorded so the two
  do not drift.
- **On method.** The activity involves probing live systems. It requires authorization and a
  designated test account, and results are reported at the level of category rather than content.
  Both constraints are stated in the activity itself.
