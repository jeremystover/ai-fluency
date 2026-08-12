# AI 301 · HRBP · Module 4 — Adversarial rehearsal

**Course:** AI 301 · The Specialist — HRBP track · Module 4 of 7
**Estimated time:** 45 min content · 10 min exercise · 25–30 min applied activity
**Prerequisite:** Module 2 (this is the room quadrant's preparation) · builds on 101 M6 (verification)
**Position in the track:** the signature module — and the one where the tutor, not the read, is the primary surface

> `Concepts reviewed: [DATE] · Examples current as of: [DATE]`
> Almost nothing here is volatile: this module is argued from craft rather than data, and the
> technique would have worked on the first chat models and will work on the next ones.

---

## Calibration prompt — before you start

*One prediction, thirty seconds.*

In the applied activity you'll run a real upcoming decision through five adversaries and count
the objections you hadn't already thought of.

**How many objections will you fail to anticipate?** Commit a number now.

Most people say one or two. The number is worth writing down because the gap between it and
what you find is the most honest measure of how well your own preparation was working before
this module.

---

## Module brief

Every other use of AI in this curriculum makes something. Drafts, summaries, structures,
analyses. This module is the exception: **here the model's job is to attack your work, and the
output is not a document — it's a better version of you walking into a room.**

That matters more for an HRBP than for anyone else in the People function, because Module 2
already established where your defensible value sits: the room. The conversation with the leader
who doesn't want to hear it. The recommendation the executive team will push back on. The change
that has to be explained to people it disadvantages. Those are the moments the job actually turns
on, and until now this curriculum has given you nothing for them.

Here's the awkward part. The property that makes AI useful for rehearsal is the same property
that makes it dangerous everywhere else: **it will argue any position, convincingly, without
believing it.** Everywhere else in this course that's a liability — it's why fluent output needs
verification, why confident wrongness is the central risk. Here it's the entire point. You need
a sparring partner with no stake, infinite patience, and no social reason to go easy on you.

And here's the trap, which the module spends as much time on as the technique: **models want to
agree with you.** Left to its defaults, a model asked to review your plan will find it thoughtful,
identify some considerations to keep in mind, and send you into the room more confident and no
better prepared. That failure feels exactly like success. Most of the craft below exists to
prevent it.

## Learning objectives

By the end of this module you should be able to:

1. Explain why a model's willingness to argue any position — a liability elsewhere — is what
   makes rehearsal work.
2. Run the five-adversary set against a real decision, and say what failure each adversary is
   built to surface.
3. Stop a model from flattering you: commit first, forbid hedging, demand the strongest version,
   and ask for what you don't want to hear.
4. Build a champion map from real material — who would help you, and what they'd need.
5. Interrogate the model's reasoning when it's wrong, and rewrite your framing once you can see
   how it got there.
6. Recognize when a rehearsal has produced preparation and when it has only produced confidence.

## Lesson 1 · Rehearsal, not production

Start with why this is a different activity from everything else you've learned.

When you use AI to draft, you supply material and judge output. The loop is: ask, read, correct.
When you use AI to *rehearse*, you supply a position and ask to have it dismantled. The loop is:
commit, get attacked, decide what survives. The second loop only works if the attack is real.

Which is where the difficulty lives, because **the default behaviour of these systems is
agreement.** Ask "what do you think of this plan?" and you'll get a response shaped like
thoughtful engagement: some praise, a few considerations, a balanced close. It reads as
critique. It functions as endorsement. And you will leave the exchange feeling reviewed.

That's not a defect you can prompt your way past with one clever instruction — it's a tendency
you have to work against structurally, which is what Lesson 3 is for. But name the mechanism
first, because it's just 101's mechanism again: the model is producing the most plausible
continuation, and the most plausible continuation of "here is my plan, what do you think" is a
constructive-colleague response. Nothing has gone wrong. You asked for the wrong thing.

The reframe that fixes it: **you are not asking for an opinion. You are assigning a role with an
interest, and asking it to be played to win.** A model asked to be "critical" produces criticism-
flavoured text. A model asked to *be a specific person with something at stake and a reason to
object* produces objections you can actually use — because now the plausible continuation is
what that person would say.

## Lesson 2 · The adversary set

Five adversaries. Each surfaces a different failure, and the set matters more than any one — most
plans survive two or three and break on the fourth.

**1. The high performer you can't afford to lose.** *"You're a strong performer on the team this
affects. Read this and tell me what it costs you, what it signals about how the organization
values people like you, and what you'd start thinking about."* Surfaces: retention risk, and the
specific way well-intended changes land on the people who have options.

**2. The frontline manager who has to deliver it.** *"You manage a team of nine and you have
operating targets. You have to explain this on Monday and defend it in your one-to-ones. What
questions can't you answer, and what does this cost you in time and credibility?"* Surfaces:
implementability — whether the plan survives contact with someone who didn't design it and can't
choose not to run it.

**3. The executive who wants the number.** *"You're on the leadership team. What evidence would
you demand before approving this, what would you ask that I probably can't answer, and what
would make you say 'come back with more'?"* Surfaces: the gap between what you believe and what
you can evidence — which Module 5 exists to close.

**4. The person with the least power affected by this.** *"You're the most junior person this
touches. You weren't consulted, you have the least ability to push back, and you'll feel it
first. What happens to you?"* Surfaces: what you normalized. This adversary is here because
representing that person is structurally an HRBP's job, and they are almost always absent from
the room where the plan gets built.

**5. The headline.** *"This landed badly and it's public. Write the story — the framing, the
quote from an affected employee, the sentence that makes the organization look worst."*
Surfaces: reputational and ethical exposure you've become acclimated to. Uniquely good at
catching things everyone internal has stopped seeing.

**And the constructive inverse — the champion map.** Adversaries tell you what breaks; this tells
you who helps. Feed in real material — Q&A from leadership calls, questions submitted at
all-hands, notes from your last skip-levels — and ask: *which individuals and teams are asking
the most forward-thinking questions here? Who would be a credible champion for this, and what
talking points would help them make the case in rooms I'm not in?* Every plan needs advocates
who aren't you, and the evidence for who they are is usually already sitting in material nobody
re-reads.

## Lesson 3 · Making it sting

Five moves that convert a flattering exchange into a useful one. Use all of them; they fail
individually.

**Commit first, in writing.** Before you ask for anything, state your position and your reasoning
as a decision you've made — not a draft you're exploring. A model responds to *"I'm going to do
X because Y — tear it apart"* very differently from *"I'm thinking about X, thoughts?"* The
second invites collaboration. The first invites attack.

**Forbid hedging explicitly.** *"Do not give me balanced feedback. Do not list strengths. Give me
the strongest case against this, as the person I've named, in their voice."* Without this you get
the balanced-close pattern, and the balance is what neutralizes the critique.

**Demand the strongest version, not a list.** *"What's the single most damaging objection, and
make it as strong as you honestly can — steelman it."* Ten mild objections are easier to dismiss
than one sharp one, and a list lets you feel thorough while engaging with nothing.

**Ask for what you don't want to hear.** *"What am I not asking you because I don't want to know
the answer?"* This is the highest-yield single prompt in the module. It works because it targets
the thing your own preparation is structurally blind to — you can't audit your own omissions from
inside them.

**Start fresh, and don't bring your framing.** If you built the plan in a conversation, that
conversation contains all your justifications — and 101 M1 tells you what happens next: the model
predicts from everything in view, and everything in view is your reasoning. Open a new
conversation. Give it the plan and the role, not the story of how you got there.

> ### Try this — 3 minutes
> Take a recommendation you're currently confident about. In a fresh conversation, one prompt:
> *"I've decided to do X because Y. You're the person this affects most and you have the least
> power to object. Don't give me balance — tell me what this does to me, in my voice, as
> strongly as you honestly can."* Then read it twice. The second read is the useful one.

## Lesson 4 · Reading its logic

Sometimes the attack is wrong — the objection rests on a fact about your organization the model
doesn't have, or a leap that doesn't hold. The amateur move is to dismiss it. The practitioner
move is to find out *how it got there*, because a wrong objection is still evidence about how
your plan reads to someone without your context.

Ask it directly: *"Walk me through how you got from the plan to that conclusion. What did you
assume that I didn't tell you?"* Two things come back, and both are useful.

**Sometimes the assumption is wrong**, and the fix is your framing — because if a model with the
written plan in front of it inferred something false, a human skimming it in a meeting will
infer the same thing faster. **That's not a model error you correct. It's a communication defect
you found for free.**

**And sometimes the assumption is right**, and you'd rather it weren't. That's the objection to
take seriously.

This is 101 M6's verification instinct pointed at an argument instead of a fact. There you traced
a claim to a source; here you trace a conclusion to its premise. Same discipline, and the same
rule applies: **you're checking against something outside the model — your own knowledge of the
organization — not asking the model to confirm itself.** "Are you sure?" is as useless here as it
was there.

## Lesson 5 · Calibration is a room you design

Everything so far has you using a model on your own argument. Calibration inverts that: you are not
the advocate, you are the person who built the room. And it is the highest-stakes room an HRBP
designs, because what comes out of it is a permanent record about people's careers.

**Most organisations treat calibration as a meeting. It is an instrument.** The evidence that counts
as admissible, who is allowed in, how a disagreement gets closed, what gets written down — those are
design decisions, and if nobody made them deliberately they got made by whoever talks most.

A model is genuinely useful on three of those and must be kept off the fourth.

**It can surface outliers.** Which managers rate consistently high, which teams' distributions moved
this cycle, where a rating and the written evidence for it point different ways. That is pattern
work over text and numbers, done faster and more evenly than a room can do it.

**It can prepare the record.** Draft the evidence summaries in one shape, so the room compares
comparable things instead of comparing writing quality — which is a real and under-noticed source of
rating noise.

**It can rehearse the hard case**, in exactly the way Lesson 2 describes: run the argument for a
rating against the strongest objection to it before the meeting rather than during.

**It may not resolve a disagreement between two managers about a person.** This is the same line the
ER work draws, applied to ratings instead of witness accounts: *a model may locate conflicts; only a
human may resolve them.* The tell is not the sophistication of the output — the output will be
reasonable. It is that a rating is a decision about someone with consequences they can contest, and
the answer to *who decided this* has to be a person who can be asked why.

**The practical version:** write down what the model was allowed to do before the cycle, not after
someone objects. A rule you can state in advance is a design. A rule you produce afterwards is a
defence.

## Key takeaways

- **The property that makes AI risky everywhere else makes it useful here**: it will argue any
  position convincingly without believing it. What you need is a sparring partner with no stake
  and no social reason to be gentle.
- **The default is agreement, and it feels like review.** "What do you think of this plan?"
  produces critique-flavoured endorsement. You didn't get a bad answer — you asked for the wrong
  thing.
- **Assign a role with an interest, not a critical stance.** "Be critical" produces
  criticism-flavoured text; "be this person, who loses something here" produces usable objections.
- **Five adversaries, five failures:** the high performer (retention), the frontline manager
  (implementability), the executive (evidence gap), the least-powerful person (what you
  normalized), the headline (what everyone internal stopped seeing).
- **Five moves make it sting:** commit first in writing, forbid hedging, demand the steelman
  rather than a list, ask what you're avoiding asking, and start fresh without your own framing.
- **A wrong objection is still data.** Trace how it got there: a false inference from your written
  plan is a communication defect you found for free.
- **Calibration is an instrument, not a meeting.** A model may surface outliers, standardise the
  evidence summaries and rehearse the hard case; it may not close a disagreement between two
  managers about a person. Write down which before the cycle — a rule stated in advance is a
  design, a rule produced afterwards is a defence.

## Take a position

**The claim:** *"Rehearsal makes you better prepared and it makes you more confident — and those
two move independently. Most people finish a rehearsal having gained only the second."*

This is the module's own technique turned on itself, and you should take it seriously: run the
adversary set, generate a counter for each objection, and you can emerge measurably more
confident with your plan entirely unchanged. That is rationalization wearing rehearsal's clothes.

The strongest counter-argument is that **confidence is not merely psychological here** — an HRBP
who feels prepared performs better in the room, holds the line under pressure, and doesn't fold
on a point they were right about. If the mechanism works partly through confidence, that's a
feature. Your position has to engage that rather than dismiss it.

## Applied activity — "Run the set"

**Time:** 25–30 minutes · **Submit:** the exchange plus a 250–350 word write-up · **Graded
against the rubric below.** Score doesn't matter. Doing the work is where the learning lands.

**Run this in the tutor.** It's the surface built for it — it will hold a role across turns and
push back when you go easy on yourself, which a static exercise can't.

**Step 1 — Pick something real and upcoming (3 min).** A recommendation you're about to make, a
change you're about to announce, a conversation you're dreading. It must be real and not yet
decided by anyone else. M4 rules from 101 apply: redact anything person-identifying before it
enters the tool.

**Step 2 — Commit in writing (4 min).** Your position, your reasoning, and what you expect the
main objection to be. Written *before* any adversary runs — this is the baseline the whole
activity measures against.

**Step 3 — Run all five (15 min).** Each adversary in role, using the five moves. Don't stop at
the first good objection from each; ask "what else, and what's worse?" at least once per
adversary.

**Step 4 — Harvest (5 min).** List **the three objections you had not anticipated.** For each:
is it right, is it survivable, and does it change the plan or only the framing? Then one
sentence on whether anything changed at all — because "nothing changed" is a legitimate and
occasionally honest outcome, and it's also what rationalization looks like from the inside.

**Step 5 — Score the prediction (2 min).** Predicted unanticipated objections against actual.

Then the write-up: what the set surfaced, which adversary was most useful and why, your position
on the claim above with its counter-argument addressed, and — the question the rubric weights
most — **what you changed.**

## Knowledge check — 8 questions

*Unlocks after the applied activity is submitted. Retakes are free and unlimited.*

**Q1.** Why is a model's willingness to argue any position without believing it an asset in this module and a liability elsewhere?

- A. Because rehearsal doesn't require factual accuracy, so hallucination is harmless here
- B. Because you need a sparring partner with no stake and no social reason to go easy — the same indifference that makes fluent output untrustworthy makes attack honest ✓
- C. Because models argue better than they explain
- D. It isn't an asset — the module works despite this property, not because of it

> **B.** Elsewhere, arguing convincingly without belief is exactly why output needs verification.
> Here it's the point: no colleague will attack your plan with that little social friction. A
> overstates it — accuracy still matters, which is why Lesson 4 traces wrong objections.

**Q2.** You ask a model "what do you think of this plan?" and get praise, three considerations, and a balanced close. What happened?

- A. The plan is genuinely strong and the model found little to object to
- B. The model's critical capabilities are weaker than its generative ones
- C. You asked for the wrong thing — the plausible continuation of that question is a constructive-colleague response, which reads as critique and functions as endorsement ✓
- D. The context window was too short to support a thorough critique

> **C.** Nothing malfunctioned. The mechanism is 101's: most plausible continuation. The failure
> is dangerous precisely because it feels like having been reviewed.

**Q3.** Which instruction is most likely to produce usable objections?

- A. "Be critical of this plan and don't hold back"
- B. "You manage a team of nine with operating targets and you have to defend this on Monday — what questions can't you answer?" ✓
- C. "List the pros and cons of this approach"
- D. "Rate this plan out of ten and explain the score"

> **B.** A role with an interest and something at stake. A produces criticism-flavoured text
> because "critical" is a style instruction, not a position. C invites the balanced close the
> module is trying to defeat.

**Q4.** What does the fourth adversary — the person with the least power affected — exist to surface?

- A. Legal exposure from the most vulnerable group
- B. What you normalized, from the perspective of someone structurally absent from the room where the plan was built ✓
- C. The strongest emotional reaction, for communications planning
- D. Whether the change is defensible under 101 M7's line

> **B.** They're in the set because representing that person is structurally an HRBP's job and
> they are almost never in the design conversation. A and D are things this adversary may
> incidentally surface; the purpose is the blind spot.

**Q5.** Which single prompt does the module identify as the highest-yield?

- A. "What's the strongest objection to this?"
- B. "What would the headline say if this went badly?"
- C. "What am I not asking you because I don't want to know the answer?" ✓
- D. "Are you sure about that objection?"

> **C.** It targets what your own preparation is structurally blind to — you can't audit your
> omissions from inside them. D is the module's named non-move: self-confirmation isn't
> verification here any more than it was in 101 M6.

**Q6.** Why should the rehearsal happen in a fresh conversation rather than the one where you built the plan?

- A. Long conversations exceed the context window and drop the plan
- B. The building conversation contains all your justifications, and the model predicts from everything in view — so it argues from inside your framing ✓
- C. Models perform better on the first exchange of any conversation
- D. Fresh conversations are cheaper in token terms

> **B.** 101 M1's mechanism. Give it the plan and the role, not the story of how you arrived at
> the plan — otherwise you've briefed your adversary with your own defence.

**Q7.** An adversary raises an objection that rests on a false assumption about your organization. The practitioner move is to:

- A. Dismiss it and move on — the objection is invalid
- B. Correct the model and re-run the adversary with better context
- C. Ask how it got there — because a false inference drawn from your written plan is a communication defect a human reader would make faster ✓
- D. Accept it anyway, since the perception matters more than the fact

> **C.** The wrong objection is still evidence about how the plan reads without your context. B
> isn't wrong as a follow-up, but it skips the free finding. D over-corrects into treating every
> misreading as valid.

**Q8.** What is the module's own claim against itself?

- A. That adversarial rehearsal is less effective than rehearsing with a human colleague
- B. That preparation and confidence move independently, and a rehearsal can deliver only the second — generating counters for every objection while the plan stays unchanged ✓
- C. That the technique only works for high-stakes conversations
- D. That models are too agreeable for the technique to work reliably

> **B.** Rationalization wearing rehearsal's clothes, and it feels identical from the inside —
> which is why the activity weights "what did you change?" most heavily. D is the problem
> Lesson 3 solves, not the residual risk the claim names.

## Sources and attribution

- The five-adversary set, the five sting moves, and the preparation-versus-confidence claim are
  original to this course, developed for the HRBP context.
- The rehearsal-space framing and the champion-mapping technique adapt practices published by
  practitioners working with AI in People functions; the specific adversaries and the discipline
  around them are ours.
- **The AI Fluency Framework** (Rick Dakan & Joseph Feller, in collaboration with Anthropic,
  CC BY-NC-SA 4.0) — the Description and Discernment competencies underpin both the role
  assignment craft and the reading-its-logic pass.
- Lesson 4 extends 101 M6's verification discipline from claims to arguments: trace the
  conclusion to its premise, and check against something outside the model.
