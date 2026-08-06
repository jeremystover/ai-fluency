import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { DiagnosticResult as Result } from '../../shared/types';
import { Screen, Button, ErrorNote } from '../components/ui';
import { api, ApiError } from '../api';
import { usePrefersReducedMotion } from '../brand';

// The signature visual: predicted confidence vs field data, one row per task.
// Everything is HTML/CSS so it stays responsive and screenshots cleanly.

function CalibrationRow({ point, delay, visible }: { point: Result['calibration']['points'][number]; delay: number; visible: boolean }) {
  const lo = Math.min(point.predictedPct, point.keyPct);
  const hi = Math.max(point.predictedPct, point.keyPct);
  return (
    <div
      className="py-3 transition-opacity duration-500"
      style={{ opacity: visible ? 1 : 0, transitionDelay: `${delay}ms` }}
      aria-label={`${point.task}: you predicted ${point.predictedPct} percent, field data ${point.keyPct} percent`}
    >
      <p className="text-sm text-ink leading-snug pr-2">{point.task}</p>
      <div className="relative h-8 mt-1.5">
        <div className="absolute top-1/2 left-0 right-0 h-px bg-line" />
        {[0, 25, 50, 75, 100].map((g) => (
          <div key={g} className="absolute top-1/2 -translate-y-1 h-2 w-px bg-line" style={{ left: `${g}%` }} />
        ))}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-[3px] rounded-full bg-ink-strong/20"
          style={{ left: `${lo}%`, width: `${hi - lo}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full border-2 border-ink-strong bg-signal"
          style={{ left: `${point.keyPct}%` }}
          title={`Field data: ${point.keyPct}%`}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-accent"
          style={{ left: `${point.predictedPct}%` }}
          title={`Your prediction: ${point.predictedPct}%`}
        />
        <span
          className="absolute -top-1 font-utility text-[0.65rem] text-muted -translate-x-1/2"
          style={{ left: `${(lo + hi) / 2}%` }}
        >
          {point.delta > 0 ? `+${point.delta}` : point.delta}
        </span>
      </div>
    </div>
  );
}

export default function DiagnosticResult() {
  const navigate = useNavigate();
  const reduced = usePrefersReducedMotion();
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stage, setStage] = useState(0); // 0 chart rows → 1 delta → 2 headline
  const [rowsIn, setRowsIn] = useState(false);

  useEffect(() => {
    api
      .get<Result>('/api/diagnostic/result')
      .then(setResult)
      .catch((e) => setError(e instanceof ApiError ? e.message : 'Could not load your result. Reload to try again.'));
  }, []);

  const rowCount = result?.calibration.points.length ?? 0;
  useEffect(() => {
    if (!result) return;
    if (reduced) {
      setRowsIn(true);
      setStage(2);
      return;
    }
    const raf = requestAnimationFrame(() => setRowsIn(true));
    const t1 = setTimeout(() => setStage(1), 500 + rowCount * 260);
    const t2 = setTimeout(() => setStage(2), 500 + rowCount * 260 + 900);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [result, reduced, rowCount]);

  const deltaLabel = useMemo(() => {
    if (!result) return '';
    const d = Math.round(result.calibration.meanDelta);
    if (d > 0) return `+${d}`;
    return String(d);
  }, [result]);

  if (error) {
    return (
      <Screen>
        <div className="pt-20"><ErrorNote message={error} /></div>
      </Screen>
    );
  }
  if (!result) {
    return (
      <Screen>
        <div className="pt-24 text-center"><p className="label-utility" aria-live="polite">Assembling your result…</p></div>
      </Screen>
    );
  }

  const cal = result.calibration;
  const hasCal = cal.points.length > 0;

  return (
    <Screen wide>
      <div className="pt-10 sm:pt-14 max-w-3xl mx-auto">
        <p className="label-utility">Diagnostic result · calibration report</p>

        {hasCal && (
          <section className="mt-6 bg-surface border border-line rounded-brand p-5 sm:p-8">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="font-display font-semibold text-ink-strong text-lg">Where you put these tools — and where they actually are</h2>
              <div className="flex gap-4">
                <span className="label-utility flex items-center gap-1.5">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-accent" /> you
                </span>
                <span className="label-utility flex items-center gap-1.5">
                  <span className="inline-block w-2.5 h-2.5 rounded-full border-2 border-ink-strong bg-signal" /> field data
                </span>
              </div>
            </div>
            <div className="flex justify-between mt-5 font-utility text-[0.65rem] text-muted">
              <span>0% · never usable</span>
              <span className="hidden sm:inline">50%</span>
              <span>100% · always usable</span>
            </div>
            <div className="mt-1 divide-y divide-line">
              {cal.points.map((p, i) => (
                <CalibrationRow key={p.itemId} point={p} visible={rowsIn} delay={reduced ? 0 : 300 + i * 260} />
              ))}
            </div>

            <div
              className="mt-6 pt-6 border-t border-line-strong flex items-center gap-5 transition-opacity duration-700"
              style={{ opacity: stage >= 1 ? 1 : 0 }}
            >
              <span className="font-utility font-medium text-4xl sm:text-5xl px-3 py-1.5 rounded-brand bg-signal text-on-signal">
                {deltaLabel}
              </span>
              <div>
                <p className="font-display font-semibold text-ink-strong">
                  points {cal.meanDelta > 0 ? 'optimistic' : cal.meanDelta < 0 ? 'pessimistic' : 'off'} on average
                </p>
                <p className="text-sm text-muted mt-0.5">
                  across {cal.points.length} predictions · average miss {Math.round(cal.meanAbsDelta)} points
                </p>
              </div>
            </div>
          </section>
        )}

        <section
          className="mt-10 transition-opacity duration-700"
          style={{ opacity: stage >= 2 ? 1 : 0 }}
          aria-live="polite"
        >
          <h1 className="font-display font-bold text-ink-strong text-3xl sm:text-4xl leading-tight max-w-2xl">{cal.headline}</h1>
          <p className="text-ink text-lg mt-4 max-w-2xl">{cal.detail}</p>
          <p className="text-sm text-muted mt-5">
            Knowledge items: {result.knowledge.correct} of {result.knowledge.total}.{' '}
            {result.knowledge.correct === result.knowledge.total
              ? 'The mechanics are already in place — Module 1 will mostly be sharpening.'
              : 'Module 1 covers exactly the mechanics behind the ones you missed.'}
          </p>
          <div className="mt-8 flex items-center gap-4">
            <Button onClick={() => navigate('/path')}>See your path</Button>
            <button onClick={() => navigate('/diagnostic')} className="text-muted text-sm underline underline-offset-4 hover:text-ink-strong">
              Retake the diagnostic
            </button>
          </div>
        </section>
      </div>
    </Screen>
  );
}
