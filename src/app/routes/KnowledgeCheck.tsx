import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { KnowledgeCheckPublic, KnowledgeCheckResult } from '../../shared/types';
import { Screen, Button, ErrorNote } from '../components/ui';
import { api, ApiError } from '../api';
import { useApp } from '../brand';

// The knowledge-check engine: one question per screen in the diagnostic's
// grammar, answers held locally, scored server-side in one submission (keys
// never reach the client). Retakes are free and unlimited.

export default function KnowledgeCheck() {
  const moduleId = useParams().moduleId ?? 'ai101-m1';
  const { refreshMe } = useApp();
  const [check, setCheck] = useState<KnowledgeCheckPublic | null>(null);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<KnowledgeCheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api
      .get<KnowledgeCheckPublic>(`/api/module/${moduleId}/knowledge-check`)
      .then(setCheck)
      .catch((e) => setError(e instanceof ApiError ? e.message : 'The knowledge check did not load. Reload to try again.'));
  }, [moduleId]);

  const submit = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await api.post<KnowledgeCheckResult>(`/api/module/${moduleId}/knowledge-check`, { answers });
      setResult(res);
      refreshMe();
      window.scrollTo(0, 0);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Submission failed. Your answers are still here — try again.');
    } finally {
      setBusy(false);
    }
  };

  const retake = () => {
    setResult(null);
    setAnswers({});
    setIdx(0);
  };

  if (error && !check) return <Screen><div className="pt-20"><ErrorNote message={error} /></div></Screen>;
  if (!check) return <Screen><div className="pt-24 text-center"><p className="label-utility">Loading…</p></div></Screen>;

  if (result) {
    const byId = new Map(result.results.map((r) => [r.id, r]));
    return (
      <Screen>
        <div className="pt-10 sm:pt-14">
          <p className="label-utility">Knowledge check · results</p>
          <div className="mt-4 flex items-center gap-5 anim-rise">
            <span className="font-utility font-medium text-4xl px-3 py-1.5 rounded-brand bg-signal text-on-signal">
              {result.score.correct}/{result.score.total}
            </span>
            <div>
              <h1 className="font-display font-bold text-ink-strong text-2xl">
                {result.score.correct === result.score.total
                  ? 'Clean sweep.'
                  : result.score.correct >= result.score.total * 0.7
                    ? 'Solid. Read the misses below.'
                    : 'The misses below are the module talking back.'}
              </h1>
              <p className="text-sm text-muted mt-1">Retakes are free and unlimited; previous answers are cleared.</p>
            </div>
          </div>

          <ol className="mt-8 flex flex-col gap-5">
            {check.questions.map((q, i) => {
              const r = byId.get(q.id);
              if (!r) return null;
              return (
                <li key={q.id} className={`border rounded-brand bg-surface p-5 ${r.correct ? 'border-line' : 'border-danger/40'}`}>
                  <p className="font-display font-semibold text-ink-strong">
                    <span className="font-utility text-xs text-muted mr-2">{i + 1}</span>
                    {q.prompt}
                  </p>
                  <div className="mt-3 flex flex-col gap-1.5">
                    {q.options.map((opt, oi) => (
                      <div
                        key={oi}
                        className={`text-sm px-3 py-2 rounded-brand border ${
                          oi === r.correctIndex
                            ? 'border-success bg-success/5 text-ink-strong'
                            : oi === r.chosenIndex
                              ? 'border-danger bg-danger/5 text-ink'
                              : 'border-transparent text-muted'
                        }`}
                      >
                        {opt}
                        {oi === r.chosenIndex && oi !== r.correctIndex && <span className="font-utility text-[0.65rem] ml-2">your answer</span>}
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-ink mt-3 border-t border-line pt-3">{r.explanation}</p>
                </li>
              );
            })}
          </ol>

          <div className="mt-8 flex items-center gap-4">
            <Button onClick={retake} variant="quiet">Retake</Button>
            <Link to="/path" className="text-accent font-semibold text-sm no-underline hover:underline">Back to the path →</Link>
          </div>
        </div>
      </Screen>
    );
  }

  const q = check.questions[idx];
  const chosen = answers[q.id];

  return (
    <Screen>
      <div className="pt-10 sm:pt-16">
        <div className="flex items-center justify-between">
          <span className="label-utility">{check.title} · {idx + 1} of {check.questions.length}</span>
          <div className="flex gap-1" aria-hidden="true">
            {check.questions.map((qq, i) => (
              <span
                key={qq.id}
                className={`h-1 w-4 rounded-full ${answers[qq.id] !== undefined ? 'bg-accent' : i === idx ? 'bg-ink-strong' : 'bg-line'}`}
              />
            ))}
          </div>
        </div>

        <div key={q.id} className="anim-rise mt-8">
          <h2 className="font-display font-semibold text-ink-strong text-2xl leading-snug">{q.prompt}</h2>
          <fieldset className="mt-7 flex flex-col gap-2.5" aria-label="Answer options">
            {q.options.map((label, i) => (
              <label
                key={i}
                className={`flex items-start gap-3 border rounded-brand px-4 py-3 cursor-pointer transition-colors bg-surface ${
                  chosen === i ? 'border-accent ring-2 ring-accent/25' : 'border-line hover:border-line-strong'
                }`}
              >
                <input
                  type="radio"
                  name="kc-answer"
                  className="mt-1 accent-(--c-accent)"
                  checked={chosen === i}
                  onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: i }))}
                />
                <span className="flex-1 text-ink">
                  <span className="font-utility text-xs text-muted mr-2">{i + 1}</span>
                  {label}
                </span>
              </label>
            ))}
          </fieldset>

          {error && <div className="mt-4"><ErrorNote message={error} /></div>}

          <div className="mt-7 flex items-center gap-4">
            {idx > 0 && (
              <button onClick={() => setIdx(idx - 1)} className="text-muted text-sm underline underline-offset-4 hover:text-ink-strong">
                Back
              </button>
            )}
            {idx + 1 < check.questions.length ? (
              <Button onClick={() => setIdx(idx + 1)} disabled={chosen === undefined}>Next</Button>
            ) : (
              <Button onClick={submit} disabled={chosen === undefined || Object.keys(answers).length < check.questions.length || busy}>
                {busy ? 'Scoring…' : 'Score it'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Screen>
  );
}
