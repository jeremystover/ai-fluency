import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { DiagnosticFeedback, DiagnosticItemPublic } from '../../shared/types';
import { Screen, Button, ErrorNote } from '../components/ui';
import { api, ApiError, track } from '../api';

type Phase = 'intro' | 'items' | 'finishing';

export default function Diagnostic() {
  const navigate = useNavigate();
  const [items, setItems] = useState<DiagnosticItemPublic[] | null>(null);
  const [phase, setPhase] = useState<Phase>('intro');
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<DiagnosticFeedback | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const startedAt = useRef(Date.now());
  const continueRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    api
      .get<{ items: DiagnosticItemPublic[] }>('/api/diagnostic')
      .then((d) => setItems(d.items))
      .catch((e) => setError(e instanceof ApiError ? e.message : 'Could not load the diagnostic. Reload to try again.'));
  }, []);

  const item = items?.[idx] ?? null;

  const begin = () => {
    track('diagnostic_started');
    startedAt.current = Date.now();
    setPhase('items');
  };

  const submit = useCallback(async () => {
    if (!item || selected === null || busy || feedback) return;
    setBusy(true);
    setError(null);
    const payload =
      item.kind === 'knowledge'
        ? { itemId: item.id, answerIndex: selected, msElapsed: Date.now() - startedAt.current }
        : { itemId: item.id, predictedPct: item.scale[selected].pct, msElapsed: Date.now() - startedAt.current };
    try {
      const res = await api.post<{ feedback: DiagnosticFeedback }>('/api/diagnostic/answer', payload);
      setFeedback(res.feedback);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'That answer didn’t save. Try again.');
    } finally {
      setBusy(false);
    }
  }, [item, selected, busy, feedback]);

  const next = useCallback(async () => {
    if (!items) return;
    if (idx + 1 < items.length) {
      setIdx(idx + 1);
      setSelected(null);
      setFeedback(null);
      startedAt.current = Date.now();
    } else {
      setPhase('finishing');
      try {
        await api.post('/api/diagnostic/complete');
      } catch {
        // The result screen recomputes from stored responses either way.
      }
      navigate('/diagnostic/result');
    }
  }, [items, idx, navigate]);

  // Number keys select; Enter advances. Arrow keys ride the native radio group.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (phase !== 'items' || !item) return;
      const count = item.kind === 'knowledge' ? item.options.length : item.scale.length;
      if (!feedback && e.key >= '1' && e.key <= String(count)) {
        setSelected(Number(e.key) - 1);
      } else if (e.key === 'Enter' && !(e.target instanceof HTMLButtonElement)) {
        e.preventDefault();
        if (feedback) next();
        else submit();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, item, feedback, submit, next]);

  useEffect(() => {
    if (feedback) continueRef.current?.focus();
  }, [feedback]);

  if (phase === 'intro') {
    return (
      <Screen>
        <div className="pt-16 sm:pt-24 max-w-xl">
          <p className="label-utility">Diagnostic</p>
          <h1 className="font-display font-bold text-ink-strong text-3xl sm:text-4xl mt-3 anim-rise">
            Nine questions. Two kinds of measurement.
          </h1>
          <div className="mt-6 flex flex-col gap-4 text-ink anim-rise" style={{ animationDelay: '100ms' }}>
            <p>
              Some check what you know — and give you permission to move fast where you're already fluent.
            </p>
            <p>
              The rest ask you to <strong className="text-ink-strong">predict how well AI will do a real task</strong>. Those are
              scored against field data, and they measure something a knowledge quiz can't: whether your instincts about these
              tools point in the right direction.
            </p>
            <p className="text-muted text-sm">
              One question per screen. You'll see how each answer landed immediately; the full picture waits until the end.
              Keyboard works throughout — arrows or number keys, Enter to continue. About eight minutes.
            </p>
          </div>
          <div className="mt-8">
            <Button onClick={begin} disabled={!items}>
              {items ? 'Begin' : 'Loading…'}
            </Button>
            {error && <div className="mt-4"><ErrorNote message={error} /></div>}
          </div>
        </div>
      </Screen>
    );
  }

  if (!items || !item || phase === 'finishing') {
    return (
      <Screen>
        <div className="pt-24 text-center">
          <p className="label-utility" aria-live="polite">Scoring your responses…</p>
        </div>
      </Screen>
    );
  }

  const options = item.kind === 'knowledge' ? item.options : item.scale.map((s) => s.label);

  return (
    <Screen>
      <div className="pt-10 sm:pt-16">
        <div className="flex items-center justify-between">
          <span className="label-utility">
            {item.kind === 'knowledge' ? 'Knowledge' : 'Calibration'} · {idx + 1} of {items.length}
          </span>
          <div className="flex gap-1" aria-hidden="true">
            {items.map((_, i) => (
              <span key={i} className={`h-1 w-5 rounded-full ${i < idx ? 'bg-accent' : i === idx ? 'bg-ink-strong' : 'bg-line'}`} />
            ))}
          </div>
        </div>

        <div key={item.id} className="anim-rise mt-8">
          {item.kind === 'calibration' && (
            <p className="label-utility mb-2">How likely is the first output to be usable with only light edits?</p>
          )}
          <h2 className="font-display font-semibold text-ink-strong text-2xl leading-snug">{item.prompt}</h2>

          <fieldset className="mt-7 flex flex-col gap-2.5" aria-label="Answer options">
            {options.map((label, i) => {
              const isSelected = selected === i;
              const revealCorrect = feedback?.kind === 'knowledge' && feedback.correctIndex === i;
              const revealWrong = feedback?.kind === 'knowledge' && isSelected && !feedback.correct;
              return (
                <label
                  key={i}
                  className={`flex items-start gap-3 border rounded-brand px-4 py-3 cursor-pointer transition-colors bg-surface
                    ${isSelected ? 'border-accent' : 'border-line hover:border-line-strong'}
                    ${revealCorrect ? 'border-success bg-success/5' : ''}
                    ${revealWrong ? 'border-danger bg-danger/5' : ''}`}
                >
                  <input
                    type="radio"
                    name="answer"
                    className="mt-1 accent-(--c-accent)"
                    checked={isSelected}
                    disabled={!!feedback}
                    onChange={() => setSelected(i)}
                  />
                  <span className="flex-1 text-ink">
                    <span className="font-utility text-xs text-muted mr-2">{i + 1}</span>
                    {label}
                  </span>
                </label>
              );
            })}
          </fieldset>

          {error && <div className="mt-4"><ErrorNote message={error} /></div>}

          {!feedback ? (
            <div className="mt-7">
              <Button onClick={submit} disabled={selected === null || busy}>
                {busy ? 'Saving…' : 'Lock it in'}
              </Button>
            </div>
          ) : (
            <div className="mt-7 border-t-2 border-ink-strong pt-5 anim-fade" aria-live="polite">
              {feedback.kind === 'knowledge' ? (
                <>
                  <p className={`font-display font-semibold ${feedback.correct ? 'text-success' : 'text-danger'}`}>
                    {feedback.correct ? 'Right.' : 'Not this one.'}
                  </p>
                  <p className="text-ink mt-2 text-[0.95rem]">{feedback.explanation}</p>
                </>
              ) : (
                <>
                  <p className="font-display font-semibold text-ink-strong">
                    You said {feedback.predictedPct}%. Field data puts it near {feedback.keyPct}%.
                  </p>
                  <p className="text-ink mt-2 text-[0.95rem]">{feedback.reasoning}</p>
                  <p className="label-utility mt-3">The pattern behind this lands at the end.</p>
                </>
              )}
              <div className="mt-5">
                <Button ref={continueRef} onClick={next}>
                  {idx + 1 < items.length ? 'Next' : 'See your result'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Screen>
  );
}
