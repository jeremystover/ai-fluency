import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Screen, Button, ErrorNote } from '../components/ui';
import MicButton from '../components/MicButton';
import { api, ApiError, track } from '../api';
import { useApp } from '../brand';
import { GOAL_CHOICES, type GoalChoice } from '../../shared/goals';
import { DEPTH_CHOICES } from '../../shared/depth';
import { SELF_LEVEL_CHOICES } from '../../shared/levels';
import type { IntakePrefs } from '../../shared/types';

// Course Crafting: before anything launches at the learner, ask how they
// want this to go. Same visual grammar as the diagnostic — one question
// per screen. Reachable again later via "Customize your path" (?edit=1).

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
    id: 'podcast',
    label: 'Learning by listening',
    detail: 'Your course as a podcast — on the commute, walking the dog, at the gym, or any time your ears are free and your hands aren\'t.',
  },
  {
    id: 'assistant_mcp',
    label: 'Inside Claude or ChatGPT',
    detail: "We'll show you how to embed this course right in your AI tools.",
  },
  { id: 'voice', label: 'Talking instead of typing', detail: 'Voice in, voice out.' },
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
// these so the opening screen's answer visibly shapes what comes next.
const LEVEL_GOALS: Record<string, string[]> = {
  l1: ['fluency', 'confidence'],
  l2: ['fluency', 'apply'],
  l3: ['apply', 'workflows'],
  l4: ['coach', 'strategy'],
  l5: ['strategy', 'safety'],
};

const TOTAL_STEPS = 5;

export default function Welcome() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const editing = params.get('edit') === '1';
  const { me, brand, refreshMe } = useApp();
  const [step, setStep] = useState(0);
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

  useEffect(() => {
    if (!tracked.current) {
      tracked.current = true;
      track('intake_started', { editing });
    }
  }, [editing]);

  // Already been through this? Straight to the plan — unless they came to edit.
  useEffect(() => {
    if (me?.progress.intakeDone && !editing) navigate('/plan', { replace: true });
  }, [me, editing, navigate]);

  // Editing starts from the current answers, not a blank slate.
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
  }, [editing, me]);

  const next = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));

  // The goals screen reuses what the opening screen just taught us: their
  // role personalizes the apply goal, their tools personalize the tools
  // goal, and their self-assessed level marks the goals that fit it best.
  // Display-only — the stored goal ids stay the shared ones.
  const toolNames = aiTools
    .filter((id) => id !== 'other')
    .map((id) => TOOL_CHOICES.find((t) => t.id === id)?.label ?? id);
  if (aiTools.includes('other') && aiToolOther.trim()) toolNames.push(aiToolOther.trim().slice(0, 40));
  const toolList =
    toolNames.length > 1 ? `${toolNames.slice(0, -1).join(', ')} and ${toolNames[toolNames.length - 1]}` : toolNames[0];

  const adaptGoal = (choice: GoalChoice): { label: string; detail: string; tag?: string } => {
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
    return { label, detail, tag };
  };

  const finish = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
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
    }
  };

  const card = (opts: {
    key: string;
    label: string;
    detail: string;
    tag?: string;
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
        {opts.tag && (
          <span
            className={`font-utility text-[0.6rem] uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${
              opts.disabled ? 'bg-line text-muted' : 'bg-signal text-on-signal'
            }`}
          >
            {opts.tag}
          </span>
        )}
      </span>
      <span className={`block text-ink mt-1 ${opts.compact ? 'text-[0.8rem]' : 'text-sm'}`}>{opts.detail}</span>
    </button>
  );

  return (
    <Screen>
      <div className="pt-10 sm:pt-16 max-w-xl">
        <div className="flex items-center justify-between">
          <span className="label-utility">{editing ? 'Customize your path' : 'Course Crafting'} · {step + 1} of {TOTAL_STEPS}</span>
          <div className="flex gap-1" aria-hidden="true">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => (
              <span key={i} className={`h-1 w-5 rounded-full ${i < step ? 'bg-accent' : i === step ? 'bg-ink-strong' : 'bg-line'}`} />
            ))}
          </div>
        </div>
        <div key={step} className="anim-rise mt-8">
          {step === 0 && (
            <>
              <h1 className="font-display font-bold text-ink-strong text-3xl leading-tight">
                {editing ? 'Change anything.' : "Here's what we're up to."}
              </h1>
              <p className="text-ink mt-4">
                {editing
                  ? 'Your plan rebuilds from whatever you change. Walk through the same five questions — your current answers are already filled in.'
                  : 'This is an AI fluency course that adapts to you, measuring your skill, judgement, and knowledge to tailor the content, personalized for you and your goals. To do that, we need to know a bit about you and how you use AI today.'}
              </p>
              <p className="text-muted text-sm mt-3">First — all of this is optional, all of it skippable:</p>
              <div className="mt-5 flex flex-col gap-4">
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
                <label className="flex flex-col gap-1.5">
                  <span className="label-utility">How do you use AI in your job today?</span>
                  <div className="relative">
                    <textarea
                      value={aiUsage}
                      onChange={(e) => setAiUsage(e.target.value)}
                      rows={2}
                      maxLength={280}
                      placeholder='e.g. "Drafting job descriptions in ChatGPT, summarizing survey comments — nothing that runs on its own yet."'
                      className="w-full border border-line-strong bg-surface rounded-brand px-4 py-3 pr-14 text-ink leading-relaxed focus:border-accent placeholder:text-muted/60 resize-y"
                    />
                    <MicButton
                      className="absolute right-2.5 bottom-3"
                      onError={setError}
                      onText={(text) => setAiUsage((prev) => `${prev ? `${prev.trimEnd()} ` : ''}${text}`.slice(0, 280))}
                    />
                  </div>
                </label>
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
                <div className="flex flex-col gap-1.5">
                  <span className="label-utility">Where would you place yourself today?</span>
                  <div className="flex flex-col gap-2">
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
                </div>
              </div>
              {error && <div className="mt-4"><ErrorNote message={error} /></div>}
              <div className="mt-7"><Button onClick={next}>Continue</Button></div>
            </>
          )}

          {step === 1 && (
            <>
              <h1 className="font-display font-semibold text-ink-strong text-2xl leading-snug">How do you want to level up?</h1>
              <p className="text-muted text-sm mt-2">Pick everything that's true. The plan leans toward what you choose.</p>
              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                {GOAL_CHOICES.map((choice) => {
                  const adapted = adaptGoal(choice);
                  return card({
                    key: choice.id,
                    label: adapted.label,
                    detail: adapted.detail,
                    tag: adapted.tag,
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
              <div className="mt-7"><Button onClick={next}>Continue</Button></div>
            </>
          )}

          {step === 2 && (
            <>
              <h1 className="font-display font-semibold text-ink-strong text-2xl leading-snug">How deep do you want to go?</h1>
              <p className="text-muted text-sm mt-2">
                How much do you want to invest in learning about AI Fluency? You can always change it later, but let us know how much
                time you're ready to spend with us and we'll craft a course that fits.
              </p>
              <div className="mt-6 flex flex-col gap-2.5">
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
              <div className="mt-7"><Button onClick={next} disabled={depth === undefined}>Continue</Button></div>
            </>
          )}

          {step === 3 && (
            <>
              <h1 className="font-display font-semibold text-ink-strong text-2xl leading-snug">How do you like to learn?</h1>
              <p className="text-muted text-sm mt-2">Pick all that appeal.</p>
              <div className="mt-6 flex flex-col gap-2.5">
                {STYLE_CHOICES.map((choice) =>
                  card({
                    key: choice.id,
                    label: choice.label,
                    detail: choice.detail,
                    tag: choice.tag,
                    selected: styles.includes(choice.id),
                    onClick: () => setStyles((s) => (s.includes(choice.id) ? s.filter((x) => x !== choice.id) : [...s, choice.id])),
                  }),
                )}
              </div>
              <div className="mt-7"><Button onClick={next}>Continue</Button></div>
            </>
          )}

          {step === 4 && (
            <>
              <h1 className="font-display font-semibold text-ink-strong text-2xl leading-snug">How do you want to start?</h1>
              <div className="mt-6 flex flex-col gap-2.5">
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
              <div className="mt-6">
                <Button onClick={finish} disabled={busy || !start}>
                  {busy ? 'Crafting your course…' : editing ? 'Recraft my course' : 'Craft my course'}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </Screen>
  );
}
