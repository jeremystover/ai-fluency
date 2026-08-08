import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Screen, Button, ErrorNote } from '../components/ui';
import MicButton from '../components/MicButton';
import { api, ApiError, track } from '../api';
import { useApp } from '../brand';
import { GOAL_CHOICES } from '../../shared/goals';
import { DEPTH_CHOICES } from '../../shared/depth';
import type { IntakePrefs } from '../../shared/types';

// The orientation: before anything launches at the learner, ask how they
// want this to go. Same visual grammar as the diagnostic — one question
// per screen. Reachable again later via "Customize your path" (?edit=1).

type StartChoice = { id: 'diagnostic' | 'module' | 'chat'; label: string; detail: string; tag?: string; disabled?: boolean };
const START_CHOICES: StartChoice[] = [
  {
    id: 'diagnostic',
    label: 'Quiz me first',
    detail: 'Nine questions, ~8 minutes. You get a direction of error, not a score — and permission to skip what you already know.',
    tag: 'Recommended',
  },
  {
    id: 'module',
    label: 'Skip diagnosis — take me into the course',
    detail: "You know your gaps. Module 1 opens directly; the diagnostic will still be there when you want your read tested.",
  },
  {
    id: 'chat',
    label: 'Size me up in a conversation',
    detail: 'The module tutor works out your level by talking with you — a few applied questions, an honest read, no quiz.',
    tag: 'New',
  },
];


type StyleChoice = { id: string; label: string; detail: string; tag?: string };
const STYLE_CHOICES: StyleChoice[] = [
  { id: 'reading', label: 'Reading, at my own pace', detail: 'A proper reading view with honest time estimates.' },
  { id: 'interactive', label: 'Interactive, hands-on', detail: 'Sorting exercises, live feedback, graded practice.' },
  { id: 'podcast', label: 'Podcast-style audio', detail: 'Listen on a commute.', tag: 'Full course · noted' },
  { id: 'assistant_mcp', label: 'Inside Claude or ChatGPT', detail: 'The course as an MCP server your assistant can teach from.', tag: 'Full course · noted' },
  { id: 'voice', label: 'Talking instead of typing', detail: 'Voice in, voice out.', tag: 'Full course · noted' },
];

const TOTAL_STEPS = 5;

export default function Welcome() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const editing = params.get('edit') === '1';
  const { me, refreshMe } = useApp();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [start, setStart] = useState<IntakePrefs['start']>();
  const [depth, setDepth] = useState<IntakePrefs['depth']>();
  const [styles, setStyles] = useState<string[]>([]);
  const [goals, setGoals] = useState<string[]>([]);
  const [objective, setObjective] = useState('');
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
  }, [editing, me]);

  const next = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));

  const finish = async (objectiveOverride?: string) => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await api.post('/api/intake', {
        displayName: name,
        roleLabel: role,
        prefs: { start, depth, styles, goals, objective: objectiveOverride ?? objective } satisfies IntakePrefs,
      });
      await refreshMe();
      navigate('/plan');
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
          <span className="label-utility">{editing ? 'Customize your path' : 'How you want this to go'} · {step + 1} of {TOTAL_STEPS}</span>
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
                  : 'This is an AI fluency course that practices what it teaches: it measures your judgment before it feeds you content, and it bends to how you want to learn. Nothing launches at you until you\'ve told it how to go.'}
              </p>
              <p className="text-muted text-sm mt-3">First — both optional, both skippable:</p>
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
              </div>
              <div className="mt-7"><Button onClick={next}>Continue</Button></div>
            </>
          )}

          {step === 1 && (
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
              <div className="mt-7"><Button onClick={next} disabled={!start}>Continue</Button></div>
            </>
          )}

          {step === 2 && (
            <>
              <h1 className="font-display font-semibold text-ink-strong text-2xl leading-snug">How deep do you want to go?</h1>
              <p className="text-muted text-sm mt-2">
                This shapes everything — how long the reads run, how deep the tutor goes, how long the podcasts play. Change it anytime.
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
              <p className="text-muted text-sm mt-2">
                Pick any that appeal. Reading and interactive run in this demo today; the rest tells us what to build next —
                picking one logs real interest, not a fake button.
              </p>
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
              <h1 className="font-display font-semibold text-ink-strong text-2xl leading-snug">What do you want out of this?</h1>
              <p className="text-muted text-sm mt-2">Pick everything that's true. The plan leans toward what you choose.</p>
              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                {GOAL_CHOICES.map((choice) =>
                  card({
                    key: choice.id,
                    label: choice.label,
                    detail: choice.detail,
                    compact: true,
                    selected: goals.includes(choice.id),
                    onClick: () => setGoals((g) => (g.includes(choice.id) ? g.filter((x) => x !== choice.id) : [...g, choice.id])),
                  }),
                )}
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
              <div className="mt-6 flex items-center gap-4">
                <Button onClick={() => finish()} disabled={busy}>
                  {busy ? 'Building your plan…' : editing ? 'Rebuild my plan' : 'Build my plan'}
                </Button>
                {!editing && (
                  <button
                    onClick={() => finish('')}
                    className="text-muted text-sm underline underline-offset-4 hover:text-ink-strong"
                    disabled={busy}
                  >
                    Skip this
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </Screen>
  );
}
