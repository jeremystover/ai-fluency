import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { ActivityConfig, GradeResult } from '../../shared/types';
import { Screen, Markdown, Button, ErrorNote } from '../components/ui';
import MicButton from '../components/MicButton';
import { api, ApiError } from '../api';
import { useApp } from '../brand';

const GRADING_STAGES = [
  'Reading your submission…',
  'Scoring against the rubric…',
  'Writing per-dimension feedback…',
];

export default function Activity() {
  const moduleId = useParams().moduleId ?? 'ai101-m1';
  const { refreshMe } = useApp();
  const [data, setData] = useState<ActivityConfig | null>(null);
  const [body, setBody] = useState('');
  const [calibration, setCalibration] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [grading, setGrading] = useState(false);
  const [stage, setStage] = useState(0);
  const [result, setResult] = useState<GradeResult | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api
      .get<ActivityConfig>(`/api/module/${moduleId}/activity`)
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
  }, [moduleId]);

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
      const calibrationValues: Record<string, number> = {};
      for (const [key, value] of Object.entries(calibration)) {
        if (value.trim() !== '') calibrationValues[key] = Number(value);
      }
      const res = await api.post<GradeResult>(`/api/module/${moduleId}/activity`, { body, calibration: calibrationValues });
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
        <Link to={`/module/${moduleId}`} className="label-utility no-underline hover:text-ink-strong">← Back to the module</Link>
        <div className="mt-4">
          {data.blocks.map((b) => (
            <Markdown key={b.id} source={b.body} className={b.kind === 'table' ? 'mt-6' : ''} />
          ))}
        </div>

        <div className="mt-10 border-t-2 border-ink-strong pt-6">
          <h2 className="font-display font-semibold text-ink-strong text-xl">Your submission</h2>
          <p className="text-sm text-muted mt-1.5">
            {data.intro ?? 'Resubmission is free and unlimited — the score is a mirror, not a gate.'}
          </p>

          {data.calibration.map((field) => (
            <label key={field.key} className="flex flex-col gap-2 mt-6 max-w-md">
              <span className="label-utility">{field.label}</span>
              <input
                type="number"
                min={field.min}
                max={field.max}
                value={calibration[field.key] ?? ''}
                onChange={(e) => setCalibration((prev) => ({ ...prev, [field.key]: e.target.value }))}
                placeholder={field.placeholder}
                className="border border-line-strong bg-surface rounded-brand px-4 py-2.5 font-utility text-ink-strong w-28 focus:border-accent placeholder:text-muted/60"
              />
              {field.hint && <span className="text-xs text-muted">{field.hint}</span>}
            </label>
          ))}

          <label className="flex flex-col gap-2 mt-6">
            <span className="label-utility">{data.submitLabel ?? 'Your submission'}</span>
            <div className="relative">
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={14}
                className="w-full border border-line-strong bg-surface rounded-brand px-4 py-3 pr-14 text-ink leading-relaxed focus:border-accent resize-y"
              />
              <MicButton
                className="absolute right-2.5 bottom-3"
                onError={setError}
                onText={(text) => setBody((prev) => (prev ? `${prev.trimEnd()}\n\n${text}` : text))}
              />
            </div>
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

        {data.reviews.length > 0 && (
          <section className="mt-10 border border-accent/40 rounded-brand bg-accent/[0.04] p-5 sm:p-6" aria-label="Reviews from the course operator">
            <p className="label-utility">From the review desk · a human read this</p>
            <div className="mt-3 flex flex-col gap-4">
              {data.reviews.map((r) => (
                <div key={r.id} className="border-l-2 border-accent pl-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-display font-semibold text-ink-strong text-sm">
                      {r.reviewer === 'operator' ? 'Course operator' : r.reviewer}
                    </span>
                    {r.score !== null && (
                      <span className="font-utility text-xs px-1.5 py-0.5 rounded-full bg-signal text-on-signal">{r.score}/5</span>
                    )}
                    <span className="font-utility text-[0.65rem] text-muted">{r.createdAt.slice(0, 10)}</span>
                    {!r.onLatest && (
                      <span className="font-utility text-[0.65rem] text-muted">· on an earlier draft</span>
                    )}
                  </div>
                  <p className="text-sm text-ink mt-1.5 whitespace-pre-line">{r.body}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {result && (
          <div ref={resultRef} className="mt-10 scroll-mt-24">
            {result.status === 'graded' ? (
              <section className="border border-ink-strong rounded-brand bg-surface p-5 sm:p-7 anim-rise">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <p className="label-utility">Graded</p>
                  <span className="font-utility font-medium text-2xl px-2.5 py-1 rounded-brand bg-signal text-on-signal">
                    {result.total} / {(result.dimensions?.length ?? 4) * 5}
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
                <div className="mt-6 flex items-center gap-4 flex-wrap">
                  {moduleId === 'ai101-m1' ? (
                    <Link
                      to={`/module/${moduleId}/complete`}
                      className="inline-flex px-5 py-2.5 font-display font-semibold text-[0.95rem] rounded-brand bg-accent text-on-accent hover:brightness-110 no-underline"
                    >
                      Finish Module 1
                    </Link>
                  ) : (
                    <Link
                      to={`/module/${moduleId}/check`}
                      className="inline-flex px-5 py-2.5 font-display font-semibold text-[0.95rem] rounded-brand bg-accent text-on-accent hover:brightness-110 no-underline"
                    >
                      On to the knowledge check
                    </Link>
                  )}
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
