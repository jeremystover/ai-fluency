import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen, Button, ErrorNote } from '../components/ui';
import { api, ApiError, track } from '../api';
import { useApp } from '../brand';
import type { IntakePrefs } from '../../shared/types';

// The orientation: before anything launches at the learner, ask how they
// want this to go. Same visual grammar as the diagnostic — one question
// per screen — so it reads as the instrument, not a settings form.

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
    detail: 'A chat that works out your level by talking with you, no quiz.',
    tag: 'Full course',
    disabled: true,
  },
];

type TimeChoice = { minutes: number; label: string; detail: string };
const TIME_CHOICES: TimeChoice[] = [
  { minutes: 10, label: 'About ten minutes', detail: 'Enough for the diagnostic. The rest keeps.' },
  { minutes: 30, label: 'About half an hour', detail: 'Diagnostic plus the best parts of Module 1.' },
  { minutes: 60, label: 'An hour or more', detail: 'The full loop, through the AI-graded activity.' },
  { minutes: 0, label: "No clock — I'll explore", detail: 'One step at a time, no pacing.' },
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
  const { me, refreshMe } = useApp();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [start, setStart] = useState<IntakePrefs['start']>();
  const [time, setTime] = useState<number>();
  const [styles, setStyles] = useState<string[]>([]);
  const [objective, setObjective] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const tracked = useRef(false);

  useEffect(() => {
    if (!tracked.current) {
      tracked.current = true;
      track('intake_started');
    }
  }, []);

  // Already been through this? Straight to the plan.
  useEffect(() => {
    if (me?.progress.intakeDone) navigate('/plan', { replace: true });
  }, [me, navigate]);

  const next = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));

  const finish = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await api.post('/api/intake', {
        displayName: name,
        roleLabel: role,
        prefs: { start, time, styles, objective: objective.trim() || undefined } satisfies IntakePrefs,
      });
      await refreshMe();
      navigate('/plan');
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'That didn’t save. Your answers are still here — try again.');
      setBusy(false);
    }
  };

  const stepLabel = (
    <div className="flex items-center justify-between">
      <span className="label-utility">How you want this to go · {step + 1} of {TOTAL_STEPS}</span>
      <div className="flex gap-1" aria-hidden="true">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => (
          <span key={i} className={`h-1 w-5 rounded-full ${i < step ? 'bg-accent' : i === step ? 'bg-ink-strong' : 'bg-line'}`} />
        ))}
      </div>
    </div>
  );

  const card = (opts: {
    key: string;
    label: string;
    detail: string;
    tag?: string;
    selected: boolean;
    disabled?: boolean;
    onClick: () => void;
  }) => (
    <button
      key={opts.key}
      onClick={opts.onClick}
      disabled={opts.disabled}
      aria-pressed={opts.selected}
      className={`text-left border rounded-brand px-4 py-3.5 bg-surface transition-colors w-full
        ${opts.selected ? 'border-accent ring-2 ring-accent/25' : 'border-line hover:border-line-strong'}
        ${opts.disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span className="flex items-center justify-between gap-3">
        <span className="font-display font-semibold text-ink-strong">{opts.label}</span>
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
      <span className="block text-sm text-ink mt-1">{opts.detail}</span>
    </button>
  );

  return (
    <Screen>
      <div className="pt-10 sm:pt-16 max-w-xl">
        {stepLabel}
        <div key={step} className="anim-rise mt-8">
          {step === 0 && (
            <>
              <h1 className="font-display font-bold text-ink-strong text-3xl leading-tight">
                Here's what we're up to.
              </h1>
              <p className="text-ink mt-4">
                This is an AI fluency course that practices what it teaches: it measures your judgment before it feeds you
                content, and it bends to how you want to learn. Nothing launches at you until you've told it how to go.
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
              <h1 className="font-display font-semibold text-ink-strong text-2xl leading-snug">How much time do you have right now?</h1>
              <p className="text-muted text-sm mt-2">The plan gets cut to fit. Nothing expires.</p>
              <div className="mt-6 flex flex-col gap-2.5">
                {TIME_CHOICES.map((choice) =>
                  card({
                    key: String(choice.minutes),
                    label: choice.label,
                    detail: choice.detail,
                    selected: time === choice.minutes,
                    onClick: () => setTime(choice.minutes),
                  }),
                )}
              </div>
              <div className="mt-7"><Button onClick={next} disabled={time === undefined}>Continue</Button></div>
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
              <h1 className="font-display font-semibold text-ink-strong text-2xl leading-snug">
                Anything specific you want out of this?
              </h1>
              <p className="text-muted text-sm mt-2">One sentence, your words. It shapes what gets emphasized. Skippable.</p>
              <textarea
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                rows={3}
                maxLength={280}
                autoFocus
                placeholder='e.g. "Stop second-guessing what I can safely hand to AI in comp and ER work."'
                className="mt-5 w-full border border-line-strong bg-surface rounded-brand px-4 py-3 text-ink leading-relaxed focus:border-accent placeholder:text-muted/60 resize-y"
              />
              {error && <div className="mt-4"><ErrorNote message={error} /></div>}
              <div className="mt-6 flex items-center gap-4">
                <Button onClick={finish} disabled={busy}>{busy ? 'Building your plan…' : 'Build my plan'}</Button>
                <button
                  onClick={() => {
                    setObjective('');
                    finish();
                  }}
                  className="text-muted text-sm underline underline-offset-4 hover:text-ink-strong"
                  disabled={busy}
                >
                  Skip this
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </Screen>
  );
}
