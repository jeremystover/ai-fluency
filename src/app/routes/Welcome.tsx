import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '@fontsource/caveat/700.css';
import { Screen, Button, ErrorNote } from '../components/ui';
import MicButton from '../components/MicButton';
import { api, ApiError, track } from '../api';
import { useApp } from '../brand';
import { GOAL_CHOICES, type GoalChoice } from '../../shared/goals';
import { DEPTH_CHOICES } from '../../shared/depth';
import { SELF_LEVEL_CHOICES } from '../../shared/levels';
import type { IntakePrefs } from '../../shared/types';

// Course Crafting as an interview: one true question per screen, seven named
// steps, and every screen after the first opens by echoing what the learner
// just said — the listening made visible. Back exists everywhere, optional
// steps carry an honest Skip, and "Customize your path" (?edit=1) turns the
// step map into jump navigation with save-from-anywhere.

const HAND_FONT = "'Caveat', 'Comic Sans MS', cursive";

type StartChoice = { id: 'diagnostic' | 'module' | 'chat'; label: string; detail: string; tag?: string; disabled?: boolean };
const START_CHOICES: StartChoice[] = [
  {
    id: 'diagnostic',
    label: 'Quiz me first',
    detail: 'Put your skills to the test. 9 questions, 8 minutes. Fastest path to discover what you know and what you need to know, crafting the course to meet you where you are today.',
    tag: 'Recommended',
  },
  {
    id: 'chat',
    label: 'Size me up in conversation',
    detail: "Let's chat! The GPT tutor is in and ready for a conversation designed to assess and expand on what you know and are doing with AI today.",
    tag: 'New',
  },
  {
    id: 'module',
    label: 'Skip diagnosis',
    detail: "Dive right in. Let's skip the diagnosis; you know your gaps. We'll take you to the menu and you can choose your own adventure.",
  },
];

type StyleChoice = { id: string; label: string; detail: string; tag?: string };
const STYLE_CHOICES: StyleChoice[] = [
  { id: 'reading', label: 'Reading, at my own pace', detail: 'A proper reading view with honest time estimates.' },
  { id: 'interactive', label: 'Interactive, hands-on', detail: 'Sorting exercises, live feedback, graded practice.' },
  {
    id: 'quiz_first',
    label: 'Test me first',
    detail: "Lead with the quiz. Take each module's knowledge check up front — pass and move on; miss and we point you at exactly what to study.",
  },
  {
    id: 'podcast',
    label: 'Learning by listening',
    detail: 'Your course as a podcast — on the commute, walking the dog, at the gym, or any time your ears are free and your hands aren\'t.',
  },
  {
    id: 'assistant_mcp',
    label: 'Inside Claude or ChatGPT',
    detail: "We'll show you how to embed this course right in your AI tools.",
  },
];

// What the learner uses today — asked at intake unless the company profile
// already declares the provisioned tools (brand.aiTools).
const TOOL_CHOICES: { id: string; label: string }[] = [
  { id: 'claude', label: 'Claude' },
  { id: 'chatgpt', label: 'ChatGPT' },
  { id: 'gemini', label: 'Gemini' },
  { id: 'other', label: 'Something else' },
];

// Which goals fit each self-assessed level best — the goals screen marks
// these so the level answer visibly shapes what comes next.
const LEVEL_GOALS: Record<string, string[]> = {
  l1: ['fluency', 'confidence'],
  l2: ['fluency', 'apply'],
  l3: ['apply', 'workflows'],
  l4: ['coach', 'strategy'],
  l5: ['strategy', 'safety'],
};

// The seven steps, named — the map renders from this, and so does the
// "N of 7" label.
const STEPS = [
  { key: 'you', label: 'You' },
  { key: 'ai', label: 'AI today' },
  { key: 'level', label: 'Level' },
  { key: 'goals', label: 'Goals' },
  { key: 'depth', label: 'Depth' },
  { key: 'style', label: 'Style' },
  { key: 'start', label: 'Start' },
] as const;
const TOTAL_STEPS = STEPS.length;

// Style choice → the echo the start screen opens with.
const STYLE_ECHOES: Record<string, string> = {
  reading: 'A reader — the modules are built for that.',
  interactive: 'Hands-on, then — the exercises are live.',
  quiz_first: 'Test-first — every module leads with its check.',
  podcast: 'Ears free — every module becomes an episode.',
  assistant_mcp: "Inside your AI tool — we'll wire that up.",
};

const DEPTH_ECHOES: Record<string, string> = {
  essentials: 'Short and sweet it is.',
  balanced: 'The full course, tightly run — good choice.',
  deep: "Mastery mode. You're building expertise.",
};

export default function Welcome() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const editing = params.get('edit') === '1';
  const { me, brand, refreshMe } = useApp();
  const [step, setStep] = useState(0);
  // The furthest step reached — earlier steps are always tappable in the map.
  const [maxStep, setMaxStep] = useState(0);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [start, setStart] = useState<IntakePrefs['start']>();
  const [depth, setDepth] = useState<IntakePrefs['depth']>();
  const [styles, setStyles] = useState<string[]>([]);
  const [goals, setGoals] = useState<string[]>([]);
  const [objective, setObjective] = useState('');
  const [aiUsage, setAiUsage] = useState('');
  const [aiTools, setAiTools] = useState<string[]>([]);
  const [aiToolOther, setAiToolOther] = useState('');
  const [selfLevel, setSelfLevel] = useState<string>();
  // The company profile can already say which tools the org provisions — no
  // point asking what we know.
  const askTools = !brand?.aiTools?.length;
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const tracked = useRef(false);
  const prefilled = useRef(false);
  // Set once finish() starts: refreshMe marks intake done, and without this
  // the already-done redirect below races the finish navigation to /plan.
  const finishing = useRef(false);

  useEffect(() => {
    if (!tracked.current) {
      tracked.current = true;
      track('intake_started', { editing });
    }
  }, [editing]);

  // Already been through this? Straight to the plan — unless they came to
  // edit, or the intake was completed by this very visit (finish routes it).
  useEffect(() => {
    if (me?.progress.intakeDone && !editing && !finishing.current) navigate('/plan', { replace: true });
  }, [me, editing, navigate]);

  // Editing starts from the current answers, not a blank slate — and every
  // step is already visited, so the map is full jump navigation.
  useEffect(() => {
    if (!editing || !me?.authenticated || prefilled.current) return;
    prefilled.current = true;
    setName(me.displayName ?? '');
    setRole(me.roleLabel ?? '');
    setStart(me.prefs?.start);
    setDepth(me.prefs?.depth);
    setStyles(me.prefs?.styles ?? []);
    setGoals(me.prefs?.goals ?? []);
    setObjective(me.prefs?.objective ?? '');
    setAiUsage(me.prefs?.aiUsage ?? '');
    setAiTools(me.prefs?.aiTools ?? []);
    setAiToolOther(me.prefs?.aiToolOther ?? '');
    setSelfLevel(me.prefs?.selfLevel);
    setMaxStep(TOTAL_STEPS - 1);
  }, [editing, me]);

  const goTo = (s: number) => {
    const clamped = Math.max(0, Math.min(s, TOTAL_STEPS - 1));
    setStep(clamped);
    setMaxStep((m) => Math.max(m, clamped));
  };
  const next = () => goTo(step + 1);
  const back = () => goTo(step - 1);

  // The goals screen reuses what earlier screens taught us: their role
  // personalizes the apply goal, their tools personalize the tools goal, and
  // their self-assessed level marks the goals that fit it best. Display-only —
  // the stored goal ids stay the shared ones.
  const toolNames = aiTools
    .filter((id) => id !== 'other')
    .map((id) => TOOL_CHOICES.find((t) => t.id === id)?.label ?? id);
  if (aiTools.includes('other') && aiToolOther.trim()) toolNames.push(aiToolOther.trim().slice(0, 40));
  const toolList =
    toolNames.length > 1 ? `${toolNames.slice(0, -1).join(', ')} and ${toolNames[toolNames.length - 1]}` : toolNames[0];

  const adaptGoal = (choice: GoalChoice): { label: string; detail: string; tag?: string; adapted: boolean } => {
    let { label, detail } = choice;
    const roleTrim = role.trim();
    if (choice.id === 'apply' && roleTrim && roleTrim.length <= 40) {
      label = `Put AI to work in my ${roleTrim} role`;
      detail = 'Real tasks from your week — job descriptions, ER write-ups, policy drafts, survey summaries — done in minutes, checked by you.';
    }
    if (choice.id === 'tools' && toolList) {
      detail = `Go deeper with ${toolList} — and the AI already embedded in your HR stack: which is which, and what each is actually for.`;
    }
    const tag = selfLevel && LEVEL_GOALS[selfLevel]?.includes(choice.id) ? 'For your level' : undefined;
    return { label, detail, tag, adapted: label !== choice.label || detail !== choice.detail };
  };

  // The echo: each screen opens with a short handwritten response to what the
  // learner already said. Every line has a fallback for skipped answers, so
  // "optional" stays honest.
  const levelShort = selfLevel ? SELF_LEVEL_CHOICES.find((l) => l.id === selfLevel)?.label.split('·')[0].trim() : undefined;
  const nameTrim = name.trim();
  const roleTrim = role.trim();
  const echoFor = (key: (typeof STEPS)[number]['key']): string | null => {
    switch (key) {
      case 'you':
        return null; // the first screen has nothing to echo yet
      case 'ai':
        if (nameTrim && roleTrim) return `Nice to meet you, ${nameTrim} — ${roleTrim}, noted.`;
        if (nameTrim) return `Nice to meet you, ${nameTrim}.`;
        if (roleTrim) return `${roleTrim} — noted.`;
        return 'Keeping it anonymous — that works fine.';
      case 'level':
        if (toolList && aiUsage.trim()) return `${toolList} in the mix, and real use already — good to know.`;
        if (toolList) return `${toolList} in the mix — good to know.`;
        if (aiUsage.trim()) return "That's a real starting point.";
        return 'However you use it today, we start from there.';
      case 'goals': {
        const who = [roleTrim || null, levelShort ? `at ${levelShort}` : null].filter(Boolean).join(' ');
        if (who && toolList) return `${who}, ${toolList} in hand — these fit that.`;
        if (who) return `${who} — these fit that.`;
        if (toolList) return `Already using ${toolList} — these build on that.`;
        return "Your call — there are no wrong answers here.";
      }
      case 'depth': {
        if (objective.trim()) return 'A specific goal in your own words — the best kind.';
        if (goals.length > 1) return `${goals.length} goals locked in.`;
        if (goals.length === 1) return 'One clear goal — the plan leans that way.';
        return 'No goals needed — browsing is a strategy too.';
      }
      case 'style':
        return depth ? DEPTH_ECHOES[depth] ?? null : null;
      case 'start':
        return styles[0] ? STYLE_ECHOES[styles[0]] ?? null : 'Every way in stays a click away.';
    }
  };

  // Optional steps show Skip while empty — the affordance, not a paragraph's
  // claim. Depth and Start stay choices you make.
  const skipFor = (key: (typeof STEPS)[number]['key']): string | null => {
    switch (key) {
      case 'you':
        return !nameTrim && !roleTrim ? 'Skip — stay anonymous' : null;
      case 'ai':
        return !aiUsage.trim() && !aiTools.length ? 'Skip this one' : null;
      case 'level':
        return !selfLevel ? 'Skip — the diagnostic can place you' : null;
      case 'goals':
        return !goals.length && !objective.trim() ? 'Skip — goals are optional' : null;
      case 'style':
        return !styles.length ? 'Skip — every way in stays a click away' : null;
      default:
        return null;
    }
  };

  const finish = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    finishing.current = true;
    try {
      await api.post('/api/intake', {
        displayName: name,
        roleLabel: role,
        prefs: { start, depth, styles, goals, objective, aiUsage, aiTools, aiToolOther, selfLevel } satisfies IntakePrefs,
      });
      await refreshMe();
      // Assessment-first: the course is crafted from what the assessment
      // finds, so the diagnostic or size-up chat runs before the path
      // reveal. Skippers go straight to the module library — the menu.
      if (editing) navigate('/plan');
      else if (start === 'diagnostic') navigate('/diagnostic');
      else if (start === 'chat') navigate('/module/ai101-m1/chat');
      else navigate('/path');
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'That didn’t save. Your answers are still here — try again.');
      setBusy(false);
      finishing.current = false;
    }
  };

  const card = (opts: {
    key: string;
    label: string;
    detail: string;
    tag?: string;
    adaptedTag?: string;
    selected: boolean;
    disabled?: boolean;
    compact?: boolean;
    onClick: () => void;
  }) => (
    <button
      key={opts.key}
      onClick={opts.onClick}
      disabled={opts.disabled}
      aria-pressed={opts.selected}
      className={`text-left border rounded-brand px-4 bg-surface transition-colors w-full ${opts.compact ? 'py-2.5' : 'py-3.5'}
        ${opts.selected ? 'border-accent ring-2 ring-accent/25' : 'border-line hover:border-line-strong'}
        ${opts.disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span className="flex items-center justify-between gap-3">
        <span className={`font-display font-semibold text-ink-strong ${opts.compact ? 'text-[0.95rem]' : ''}`}>{opts.label}</span>
        {opts.tag ? (
          <span
            className={`font-utility text-[0.6rem] uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${
              opts.disabled ? 'bg-line text-muted' : 'bg-signal text-on-signal'
            }`}
          >
            {opts.tag}
          </span>
        ) : opts.adaptedTag ? (
          <span className="font-utility text-[0.55rem] uppercase tracking-wider px-2 py-0.5 rounded-full border border-accent/40 text-accent shrink-0">
            {opts.adaptedTag}
          </span>
        ) : null}
      </span>
      <span className={`block text-ink mt-1 ${opts.compact ? 'text-[0.8rem]' : 'text-sm'}`}>{opts.detail}</span>
    </button>
  );

  const stepKey = STEPS[step].key;
  const echo = echoFor(stepKey);
  const skip = skipFor(stepKey);

  // The nav row every step shares: Back (after step 1), the primary action,
  // and the honest Skip while an optional step is empty. Edit mode adds
  // save-from-anywhere so changing one answer doesn't mean re-walking six.
  const nav = (primary: React.ReactNode) => (
    <div className="mt-7 flex items-center gap-4 flex-wrap">
      {step > 0 && (
        <button onClick={back} className="text-muted text-sm hover:text-ink-strong">
          ← Back
        </button>
      )}
      {primary}
      {skip && stepKey !== 'start' && (
        <button onClick={next} className="text-muted text-sm hover:text-ink-strong ml-auto">
          {skip}
        </button>
      )}
      {editing && stepKey !== 'start' && (
        <button onClick={() => void finish()} disabled={busy} className="text-accent text-sm font-semibold hover:underline disabled:opacity-50">
          {busy ? 'Saving…' : 'Save changes'}
        </button>
      )}
    </div>
  );

  return (
    <Screen>
      <div className="pt-10 sm:pt-16 max-w-xl">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <span className="label-utility">{editing ? 'Customize your path' : 'Course Crafting'} · {step + 1} of {TOTAL_STEPS}</span>
        </div>
        <nav className="mt-3 flex gap-0.5 flex-wrap" aria-label="Steps">
          {STEPS.map((s, i) => {
            const state = i === step ? 'now' : i <= maxStep ? 'done' : 'todo';
            const reachable = i <= maxStep && i !== step;
            return (
              <button
                key={s.key}
                onClick={reachable ? () => goTo(i) : undefined}
                disabled={!reachable}
                aria-current={i === step ? 'step' : undefined}
                className={`font-utility text-[0.6rem] uppercase tracking-wider px-2.5 py-1 rounded-full whitespace-nowrap transition-colors ${
                  state === 'now'
                    ? 'bg-ink-strong text-surface'
                    : state === 'done'
                      ? 'text-accent hover:bg-accent/10 cursor-pointer'
                      : 'text-muted cursor-default'
                }`}
              >
                {state === 'done' ? '✓ ' : ''}{s.label}
              </button>
            );
          })}
        </nav>

        <div key={step} className="anim-rise">
          {echo && (
            <p className="mt-8 text-accent text-2xl leading-snug" style={{ fontFamily: HAND_FONT }}>
              {echo}
            </p>
          )}

          {stepKey === 'you' && (
            <>
              <h1 className="font-display font-bold text-ink-strong text-3xl leading-tight mt-8">
                {editing ? 'Change anything.' : "Here's what we're up to."}
              </h1>
              <p className="text-ink mt-4">
                {editing
                  ? 'Your plan rebuilds from whatever you change. Jump to any step in the map above — your current answers are already filled in.'
                  : 'This is an AI fluency course that adapts to you — a few quick questions, one per screen, and the course starts fitting itself to your answers. All of it optional, all of it changeable later.'}
              </p>
              <div className="mt-6 flex flex-col gap-4">
                <label className="flex flex-col gap-1.5">
                  <span className="label-utility">First name</span>
                  <input
                    value={name}
                    autoFocus
                    onChange={(e) => setName(e.target.value)}
                    className="border border-line-strong bg-surface rounded-brand px-4 py-2.5 text-ink-strong focus:border-accent"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="label-utility">Role</span>
                  <input
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. VP People, HRBP, Head of TA"
                    className="border border-line-strong bg-surface rounded-brand px-4 py-2.5 text-ink-strong focus:border-accent placeholder:text-muted/60"
                  />
                </label>
              </div>
              {error && <div className="mt-4"><ErrorNote message={error} /></div>}
              {nav(<Button onClick={next}>Continue</Button>)}
            </>
          )}

          {stepKey === 'ai' && (
            <>
              <h1 className="font-display font-semibold text-ink-strong text-2xl leading-snug mt-2">How do you use AI in your job today?</h1>
              <p className="text-muted text-sm mt-2">Honest answers make a better-fitting course — "not at all yet" included.</p>
              <div className="mt-5 flex flex-col gap-4">
                <div className="relative">
                  <textarea
                    value={aiUsage}
                    onChange={(e) => setAiUsage(e.target.value)}
                    rows={3}
                    maxLength={280}
                    autoFocus
                    placeholder='e.g. "Drafting job descriptions in ChatGPT, summarizing survey comments — nothing that runs on its own yet."'
                    className="w-full border border-line-strong bg-surface rounded-brand px-4 py-3 pr-14 text-ink leading-relaxed focus:border-accent placeholder:text-muted/60 resize-y"
                  />
                  <MicButton
                    className="absolute right-2.5 bottom-3"
                    onError={setError}
                    onText={(text) => setAiUsage((prev) => `${prev ? `${prev.trimEnd()} ` : ''}${text}`.slice(0, 280))}
                  />
                </div>
                {askTools && (
                  <div className="flex flex-col gap-1.5">
                    <span className="label-utility">Which AI tools are you using? Pick all that apply</span>
                    <div className="flex flex-wrap gap-2">
                      {TOOL_CHOICES.map((tool) => {
                        const selected = aiTools.includes(tool.id);
                        return (
                          <button
                            key={tool.id}
                            onClick={() => setAiTools((cur) => (cur.includes(tool.id) ? cur.filter((x) => x !== tool.id) : [...cur, tool.id]))}
                            aria-pressed={selected}
                            className={`border rounded-brand px-3.5 py-2 bg-surface font-display font-semibold text-sm text-ink-strong transition-colors cursor-pointer
                              ${selected ? 'border-accent ring-2 ring-accent/25' : 'border-line hover:border-line-strong'}`}
                          >
                            {tool.label}
                          </button>
                        );
                      })}
                    </div>
                    {aiTools.includes('other') && (
                      <input
                        value={aiToolOther}
                        onChange={(e) => setAiToolOther(e.target.value)}
                        maxLength={120}
                        placeholder="Which one(s)?"
                        className="border border-line-strong bg-surface rounded-brand px-4 py-2.5 text-ink-strong focus:border-accent placeholder:text-muted/60"
                      />
                    )}
                  </div>
                )}
              </div>
              {error && <div className="mt-4"><ErrorNote message={error} /></div>}
              {nav(<Button onClick={next}>Continue</Button>)}
            </>
          )}

          {stepKey === 'level' && (
            <>
              <h1 className="font-display font-semibold text-ink-strong text-2xl leading-snug mt-2">Where would you place yourself today?</h1>
              <p className="text-muted text-sm mt-2">Your honest read — the diagnostic can check it against reality later.</p>
              <div className="mt-5 flex flex-col gap-2">
                {SELF_LEVEL_CHOICES.map((choice) =>
                  card({
                    key: choice.id,
                    label: choice.label,
                    detail: choice.detail,
                    compact: true,
                    selected: selfLevel === choice.id,
                    onClick: () => setSelfLevel((cur) => (cur === choice.id ? undefined : choice.id)),
                  }),
                )}
              </div>
              {nav(<Button onClick={next}>Continue</Button>)}
            </>
          )}

          {stepKey === 'goals' && (
            <>
              <h1 className="font-display font-semibold text-ink-strong text-2xl leading-snug mt-2">How do you want to level up?</h1>
              <p className="text-muted text-sm mt-2">Pick everything that's true. The plan leans toward what you choose.</p>
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {GOAL_CHOICES.map((choice) => {
                  const adapted = adaptGoal(choice);
                  return card({
                    key: choice.id,
                    label: adapted.label,
                    detail: adapted.detail,
                    tag: adapted.tag,
                    adaptedTag: adapted.adapted ? 'From your answers' : undefined,
                    compact: true,
                    selected: goals.includes(choice.id),
                    onClick: () => setGoals((g) => (g.includes(choice.id) ? g.filter((x) => x !== choice.id) : [...g, choice.id])),
                  });
                })}
              </div>
              <label className="flex flex-col gap-1.5 mt-5">
                <span className="label-utility">Anything else? Something specific, or a goal not covered above — type or talk. Optional</span>
                <div className="relative">
                  <textarea
                    value={objective}
                    onChange={(e) => setObjective(e.target.value)}
                    rows={2}
                    maxLength={280}
                    placeholder='e.g. "Specifically: stop second-guessing what I can hand to AI in ER work."'
                    className="w-full border border-line-strong bg-surface rounded-brand px-4 py-3 pr-14 text-ink leading-relaxed focus:border-accent placeholder:text-muted/60 resize-y"
                  />
                  <MicButton
                    className="absolute right-2.5 bottom-3"
                    onError={setError}
                    onText={(text) => setObjective((prev) => `${prev ? `${prev.trimEnd()} ` : ''}${text}`.slice(0, 280))}
                  />
                </div>
              </label>
              {error && <div className="mt-4"><ErrorNote message={error} /></div>}
              {nav(<Button onClick={next}>Continue</Button>)}
            </>
          )}

          {stepKey === 'depth' && (
            <>
              <h1 className="font-display font-semibold text-ink-strong text-2xl leading-snug mt-2">How deep do you want to go?</h1>
              <p className="text-muted text-sm mt-2">
                How much do you want to invest? You can always change it later, but let us know how much time you're ready to
                spend with us and we'll craft a course that fits.
              </p>
              <div className="mt-5 flex flex-col gap-2.5">
                {DEPTH_CHOICES.map((choice) =>
                  card({
                    key: choice.id,
                    label: choice.label,
                    detail: choice.detail,
                    tag: choice.tag,
                    selected: depth === choice.id,
                    onClick: () => setDepth(choice.id),
                  }),
                )}
              </div>
              {nav(<Button onClick={next} disabled={depth === undefined}>Continue</Button>)}
            </>
          )}

          {stepKey === 'style' && (
            <>
              <h1 className="font-display font-semibold text-ink-strong text-2xl leading-snug mt-2">How do you like to learn?</h1>
              <p className="text-muted text-sm mt-2">Pick the one that fits best — every module keeps the others a click away.</p>
              <div className="mt-5 flex flex-col gap-2.5">
                {STYLE_CHOICES.map((choice) =>
                  card({
                    key: choice.id,
                    label: choice.label,
                    detail: choice.detail,
                    tag: choice.tag,
                    selected: styles[0] === choice.id,
                    onClick: () => setStyles((s) => (s[0] === choice.id ? [] : [choice.id])),
                  }),
                )}
              </div>
              {nav(<Button onClick={next}>Continue</Button>)}
            </>
          )}

          {stepKey === 'start' && (
            <>
              <h1 className="font-display font-semibold text-ink-strong text-2xl leading-snug mt-2">How do you want to start?</h1>
              <div className="mt-5 flex flex-col gap-2.5">
                {START_CHOICES.map((choice) =>
                  card({
                    key: choice.id,
                    label: choice.label,
                    detail: choice.detail,
                    tag: choice.tag,
                    disabled: choice.disabled,
                    selected: start === choice.id,
                    onClick: () => setStart(choice.id as IntakePrefs['start']),
                  }),
                )}
              </div>
              {error && <div className="mt-4"><ErrorNote message={error} /></div>}
              {nav(
                <Button onClick={finish} disabled={busy || !start}>
                  {busy ? 'Crafting your course…' : editing ? 'Recraft my course' : 'Craft my course'}
                </Button>,
              )}
            </>
          )}
        </div>
      </div>
    </Screen>
  );
}
