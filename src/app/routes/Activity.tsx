import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { ActivityConfig, CalibrationTrail, GradeResult, PriorStage } from '../../shared/types';
import { Screen, Markdown, Button, ErrorNote } from '../components/ui';
import MicButton from '../components/MicButton';
import { api, ApiError } from '../api';
import { useApp } from '../brand';

const GRADING_STAGES = [
  'Reading your submission…',
  'Scoring against the rubric…',
  'Writing per-dimension feedback…',
];

const stageTag = (moduleId: string) => `M${moduleId.split('-m')[1] ?? '?'}`;

// One prior capstone stage, collapsed to a title bar until opened.
function PriorStageCard({ stage }: { stage: PriorStage }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-line rounded-brand overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-3 px-4 py-2.5 bg-bg hover:bg-line/30 transition-colors text-left"
      >
        <span className="text-sm">
          <span className="font-utility text-[0.65rem] uppercase tracking-wider text-muted mr-2">Stage {stage.ordinal}</span>
          <span className="font-display font-semibold text-ink-strong">{stage.title}</span>
        </span>
        <span className="flex items-center gap-2 shrink-0">
          {stage.total !== null && (
            <span className="font-utility text-[0.65rem] px-1.5 py-0.5 rounded-full bg-signal text-on-signal">graded {stage.total}</span>
          )}
          <span className="font-utility text-xs text-muted" aria-hidden="true">{open ? '−' : '+'}</span>
        </span>
      </button>
      {open && (
        <div className="px-4 pb-3 pt-1 anim-fade">
          <p className="text-sm text-ink whitespace-pre-line max-h-72 overflow-y-auto">{stage.body}</p>
        </div>
      )}
    </div>
  );
}

// The reckoning: every numeric prediction against what it turned out to be,
// sorting scores per module, and the words the learner wrote at each opening.
function TrailCard({ trail }: { trail: CalibrationTrail }) {
  const closed = trail.points.filter((p) => p.actual !== null);
  const open = trail.points.filter((p) => p.actual === null);
  return (
    <section className="mt-10 border border-ink-strong rounded-brand bg-surface p-5 sm:p-6" aria-label="Your calibration trail">
      <p className="label-utility">The reckoning · your calibration trail, seven modules of it</p>
      {closed.length > 0 && (
        <div className="mt-4 flex flex-col gap-3">
          {closed.map((p) => {
            const max = Math.max(p.predicted, p.actual ?? 0) * 1.25 || 1;
            const pos = (v: number) => `${Math.min(97, (v / max) * 100)}%`;
            const missed = (p.delta ?? 0) !== 0;
            return (
              <div key={`${p.moduleId}-${p.label}`}>
                <div className="flex items-baseline justify-between gap-2 flex-wrap">
                  <span className="text-sm text-ink-strong">
                    <span className="font-utility text-[0.65rem] uppercase tracking-wider text-muted mr-1.5">{stageTag(p.moduleId)}</span>
                    {p.label}
                  </span>
                  <span className="font-utility text-xs text-muted">
                    predicted {p.predicted} · actual {p.actual}
                    {missed && <span className="text-ink-strong"> · {(p.delta ?? 0) > 0 ? '+' : ''}{p.delta}</span>}
                  </span>
                </div>
                <div className="relative h-3 mt-1.5" aria-hidden="true">
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 bg-line rounded-full" />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 h-0.5 bg-accent/50"
                    style={{ left: pos(Math.min(p.predicted, p.actual ?? 0)), width: `calc(${pos(Math.max(p.predicted, p.actual ?? 0))} - ${pos(Math.min(p.predicted, p.actual ?? 0))})` }}
                  />
                  <span className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border-2 border-accent bg-surface -ml-1" style={{ left: pos(p.predicted) }} />
                  <span className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-signal border border-ink-strong/40 -ml-1" style={{ left: pos(p.actual ?? 0) }} />
                </div>
              </div>
            );
          })}
          <p className="font-utility text-[0.65rem] text-muted">
            <span className="inline-block w-2 h-2 rounded-full border-2 border-accent bg-surface align-middle mr-1" /> predicted ·{' '}
            <span className="inline-block w-2 h-2 rounded-full bg-signal border border-ink-strong/40 align-middle mr-1" /> what happened
          </p>
        </div>
      )}
      {open.length > 0 && (
        <p className="text-xs text-muted mt-3">
          Still open: {open.map((p) => `${stageTag(p.moduleId)} ${p.label.toLowerCase()} (${p.predicted})`).join(' · ')} — measured when its stage lands.
        </p>
      )}
      {trail.sorts.length > 0 && (
        <div className="mt-4 border-t border-line pt-3">
          <p className="label-utility mb-1.5">Against the field — the sorting exercises</p>
          <p className="text-sm text-ink">
            {trail.sorts.map((s) => `${stageTag(s.moduleId)}: ${s.correct}/${s.total}`).join(' · ')}
          </p>
        </div>
      )}
      {trail.predictions.length > 0 && (
        <div className="mt-4 border-t border-line pt-3">
          <p className="label-utility mb-1.5">In your own words, at each module's door</p>
          <ul className="flex flex-col gap-1.5">
            {trail.predictions.map((p) => (
              <li key={p.moduleId} className="text-sm text-ink">
                <span className="font-utility text-[0.65rem] uppercase tracking-wider text-muted mr-1.5">{stageTag(p.moduleId)}</span>
                “{p.text}”
              </li>
            ))}
          </ul>
        </div>
      )}
      <p className="text-sm text-muted mt-4 border-t border-line pt-3">
        The question this trail answers isn't whether you missed — everyone misses. It's <em>which way</em> you miss about your own
        work. That direction is what the submission below should name.
      </p>
    </section>
  );
}

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

        {data.priorStages.length > 0 && (
          <section className="mt-10" aria-label="Your build so far">
            <p className="label-utility mb-2">Your build so far — this stage advances it</p>
            <div className="flex flex-col gap-2">
              {data.priorStages.map((s) => (
                <PriorStageCard key={s.moduleId} stage={s} />
              ))}
            </div>
          </section>
        )}

        {data.trail && <TrailCard trail={data.trail} />}

        <div className="mt-10 border-t-2 border-ink-strong pt-6">
          <h2 className="font-display font-semibold text-ink-strong text-xl">Your submission</h2>
          <p className="text-sm text-muted mt-1.5">
            {data.intro ?? 'Resubmission is free and unlimited — the score is a mirror, not a gate.'}
          </p>

          {data.openingPrediction && (
            <div className="mt-4 border-l-4 border-signal bg-signal/10 rounded-r-brand px-4 py-3">
              <p className="label-utility">Your prediction, from the top of the module</p>
              <p className="text-sm text-ink-strong mt-1">“{data.openingPrediction}”</p>
              <p className="text-xs text-muted mt-1">Score it in your submission: what happened, and which way you were off.</p>
            </div>
          )}

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
