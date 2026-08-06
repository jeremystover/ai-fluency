import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { ContentBlock, GradeResult, RubricDimension } from '../../shared/types';
import { Screen, Markdown, Button, ErrorNote } from '../components/ui';
import { api, ApiError } from '../api';
import { useApp } from '../brand';

type ActivityData = {
  blocks: ContentBlock[];
  minChars: number;
  lastSubmission: { id: string; body: string; gradedAt: string | null; total: number | null; dimensions: RubricDimension[] | null; summary: string | null } | null;
};

const GRADING_STAGES = [
  'Reading your three conversations…',
  'Scoring against the rubric…',
  'Writing per-dimension feedback…',
];

export default function Activity() {
  const { refreshMe } = useApp();
  const [data, setData] = useState<ActivityData | null>(null);
  const [body, setBody] = useState('');
  const [predicted, setPredicted] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [grading, setGrading] = useState(false);
  const [stage, setStage] = useState(0);
  const [result, setResult] = useState<GradeResult | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api
      .get<ActivityData>('/api/module/ai101-m1/activity')
      .then((d) => {
        setData(d);
        if (d.lastSubmission && !d.lastSubmission.gradedAt) setBody(d.lastSubmission.body);
        if (d.lastSubmission?.gradedAt) {
          setResult({
            status: 'graded',
            submissionId: d.lastSubmission.id,
            total: d.lastSubmission.total ?? undefined,
            dimensions: d.lastSubmission.dimensions ?? undefined,
            summary: d.lastSubmission.summary ?? undefined,
          });
        }
      })
      .catch((e) => setError(e instanceof ApiError ? e.message : 'The activity did not load. Reload to try again.'));
  }, []);

  useEffect(() => {
    if (!grading) return;
    setStage(0);
    const t = setInterval(() => setStage((s) => Math.min(s + 1, GRADING_STAGES.length - 1)), 2600);
    return () => clearInterval(t);
  }, [grading]);

  const submit = async () => {
    if (!data || grading) return;
    setGrading(true);
    setError(null);
    setResult(null);
    try {
      const res = await api.post<GradeResult>('/api/module/ai101-m1/activity', {
        body,
        predictedPct: predicted.trim() === '' ? undefined : Number(predicted),
      });
      setResult(res);
      refreshMe();
      requestAnimationFrame(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'The submission didn’t go through. Your text is still here — try again.');
    } finally {
      setGrading(false);
    }
  };

  if (error && !data) return <Screen><div className="pt-20"><ErrorNote message={error} /></div></Screen>;
  if (!data) return <Screen><div className="pt-24 text-center"><p className="label-utility">Loading the activity…</p></div></Screen>;

  const chars = body.trim().length;
  const ready = chars >= data.minChars;

  return (
    <Screen>
      <div className="pt-10 sm:pt-14">
        <Link to="/module/1" className="label-utility no-underline hover:text-ink-strong">← Module 1</Link>
        <div className="mt-4">
          {data.blocks.map((b) => (
            <Markdown key={b.id} source={b.body} className={b.kind === 'table' ? 'mt-6' : ''} />
          ))}
        </div>

        <div className="mt-10 border-t-2 border-ink-strong pt-6">
          <h2 className="font-display font-semibold text-ink-strong text-xl">Your submission</h2>
          <p className="text-sm text-muted mt-1.5">
            Paste your three conversation accounts and the reflection below. Resubmission is free and unlimited — the score is
            a mirror, not a gate.
          </p>

          <label className="flex flex-col gap-2 mt-6 max-w-xs">
            <span className="label-utility">Conversation 2 prediction — % chance it invented something</span>
            <input
              type="number"
              min={0}
              max={100}
              value={predicted}
              onChange={(e) => setPredicted(e.target.value)}
              placeholder="e.g. 60"
              className="border border-line-strong bg-surface rounded-brand px-4 py-2.5 font-utility text-ink-strong w-28 focus:border-accent placeholder:text-muted/60"
            />
            <span className="text-xs text-muted">Recorded before you check — honesty is what's scored, not accuracy.</span>
          </label>

          <label className="flex flex-col gap-2 mt-6">
            <span className="label-utility">Three conversations + reflection</span>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={14}
              className="border border-line-strong bg-surface rounded-brand px-4 py-3 text-ink leading-relaxed focus:border-accent resize-y"
            />
          </label>
          <div className="flex items-center justify-between mt-2">
            <span className={`font-utility text-xs ${ready ? 'text-success' : 'text-muted'}`} aria-live="polite">
              {chars.toLocaleString()} / {data.minChars.toLocaleString()} characters minimum {ready && '· ready'}
            </span>
          </div>

          {error && <div className="mt-4"><ErrorNote message={error} /></div>}

          <div className="mt-5">
            <Button onClick={submit} disabled={!ready || grading}>
              {grading ? 'Grading…' : result?.status === 'graded' ? 'Resubmit for grading' : 'Submit for grading'}
            </Button>
            {grading && (
              <p className="label-utility mt-3" aria-live="polite">{GRADING_STAGES[stage]}</p>
            )}
          </div>
        </div>

        {result && (
          <div ref={resultRef} className="mt-10 scroll-mt-24">
            {result.status === 'graded' ? (
              <section className="border border-ink-strong rounded-brand bg-surface p-5 sm:p-7 anim-rise">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <p className="label-utility">Graded</p>
                  <span className="font-utility font-medium text-2xl px-2.5 py-1 rounded-brand bg-signal text-on-signal">
                    {result.total} / 20
                  </span>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {result.dimensions?.map((d) => (
                    <div key={d.name} className="border border-line rounded-brand p-4">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-display font-semibold text-ink-strong text-sm leading-tight">{d.name}</span>
                        <span className="font-utility text-sm text-ink-strong shrink-0">{d.score}/5</span>
                      </div>
                      <div className="flex gap-1 mt-2" aria-hidden="true">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <span key={i} className={`h-1 flex-1 rounded-full ${i <= d.score ? 'bg-accent' : 'bg-line'}`} />
                        ))}
                      </div>
                      <p className="text-sm text-ink mt-2.5">{d.comment}</p>
                    </div>
                  ))}
                </div>
                {result.summary && <p className="text-ink mt-5 border-t border-line pt-4">{result.summary}</p>}
                <div className="mt-6">
                  <Link
                    to="/module/1/complete"
                    className="inline-flex px-5 py-2.5 font-display font-semibold text-[0.95rem] rounded-brand bg-accent text-on-accent hover:brightness-110 no-underline"
                  >
                    Finish Module 1
                  </Link>
                </div>
              </section>
            ) : (
              <section className="border border-line-strong rounded-brand bg-surface p-5 anim-fade" role="status">
                <p className="font-display font-semibold text-ink-strong">Saved.</p>
                <p className="text-sm text-ink mt-1.5">{result.message}</p>
              </section>
            )}
          </div>
        )}
      </div>
    </Screen>
  );
}
