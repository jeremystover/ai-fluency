import { useEffect, useState } from 'react';
import type { ChoicePublic, ChoiceResult } from '../../shared/types';
import { api, ApiError } from '../api';
import { Button, ErrorNote, Markdown } from './ui';

// Single-answer exercise over stimulus artifacts: read the evidence, commit to
// one option, then the reveal argues back. Built for M3's find-the-lossy-step;
// works for any module that seeds a choice exercise.

export default function ChoiceExercise({ moduleId }: { moduleId: string }) {
  const [data, setData] = useState<ChoicePublic | null>(null);
  const [chosen, setChosen] = useState<string | null>(null);
  const [result, setResult] = useState<ChoiceResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api
      .get<ChoicePublic>(`/api/module/${moduleId}/choice`)
      .then(setData)
      .catch((e) => setError(e instanceof ApiError ? e.message : 'The exercise did not load. Reload the page to try again.'));
  }, [moduleId]);

  const submit = async () => {
    if (!chosen || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await api.post<ChoiceResult>(`/api/module/${moduleId}/choice`, { chosen });
      setResult(res);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'The reveal didn’t load. Your answer is still selected — try again.');
    } finally {
      setBusy(false);
    }
  };

  if (error && !data) return <div className="my-6"><ErrorNote message={error} /></div>;
  if (!data) return <div className="my-6 border border-line rounded-brand p-5"><p className="label-utility">Loading the exercise…</p></div>;

  return (
    <div className="border border-ink-strong rounded-brand bg-surface p-5 sm:p-7 my-6">
      <p className="label-utility">Exercise · interactive</p>
      <h3 className="font-display font-semibold text-ink-strong text-xl mt-2">{data.title}</h3>
      <Markdown source={data.intro} className="text-[0.95rem] mt-3" />

      <div className="mt-5 flex flex-col gap-3">
        {data.artifacts.map((a) => (
          <div key={a.label} className="border border-line rounded-brand bg-bg/60 p-4">
            <p className="font-utility text-[0.65rem] uppercase tracking-wider text-ink-strong">{a.label}</p>
            <Markdown source={a.body} className="text-sm mt-1.5" />
          </div>
        ))}
      </div>

      <div className="mt-6">
        <p className="label-utility mb-2">{result ? 'Your call' : 'Commit to an answer'}</p>
        <div className="grid gap-2 sm:grid-cols-3" role="radiogroup" aria-label="Your answer">
          {data.options.map((o) => {
            const isChosen = chosen === o.id;
            const revealState = result ? (o.id === result.key ? 'key' : isChosen ? 'miss' : 'idle') : null;
            return (
              <button
                key={o.id}
                role="radio"
                aria-checked={isChosen}
                disabled={!!result}
                onClick={() => setChosen(o.id)}
                className={`text-left text-sm leading-snug border rounded-brand px-3 py-2.5 transition-colors
                  ${revealState === 'key' ? 'border-success bg-success/10' : ''}
                  ${revealState === 'miss' ? 'border-danger bg-danger/10' : ''}
                  ${revealState === 'idle' ? 'border-line opacity-60' : ''}
                  ${!result && isChosen ? 'border-accent ring-2 ring-accent/30 bg-accent/[0.06]' : ''}
                  ${!result && !isChosen ? 'border-line hover:border-line-strong' : ''}`}
              >
                <span className="font-display font-semibold text-ink-strong">{o.label}</span>
                {result && o.id === result.key && (
                  <span className="block font-utility text-[0.65rem] uppercase tracking-wider text-success mt-1">The key</span>
                )}
                {result && revealState === 'miss' && (
                  <span className="block font-utility text-[0.65rem] uppercase tracking-wider text-danger mt-1">Your answer</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {error && data && <div className="mt-4"><ErrorNote message={error} /></div>}

      {!result && (
        <div className="mt-5">
          <Button onClick={submit} disabled={!chosen || busy}>
            {busy ? 'Checking…' : chosen ? 'Commit and reveal' : 'Pick one to reveal'}
          </Button>
        </div>
      )}

      {result && (
        <div className="mt-6 anim-fade">
          <div className="border-l-4 border-signal bg-signal/10 rounded-r-brand p-4 sm:p-5">
            <p className="label-utility">{result.correct ? 'You found it' : 'The reveal'}</p>
            <Markdown source={result.reasoning} className="text-[0.95rem] mt-2" />
          </div>
          <Markdown source={result.closing} className="text-sm mt-4 text-muted" />
        </div>
      )}
    </div>
  );
}
