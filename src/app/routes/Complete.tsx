import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { RubricDimension } from '../../shared/types';
import { Screen, ErrorNote } from '../components/ui';
import { api, ApiError, track } from '../api';
import { useApp } from '../brand';

type CompleteData = {
  name: string | null;
  graded: { total: number; dimensions: RubricDimension[]; summary: string; gradedAt: string; model: string } | null;
  diagnosticMeanDelta: number | null;
};

export default function Complete() {
  const { me } = useApp();
  // Short courses have no path screen; their plan is the way back.
  const shortCourse = me?.shortCourse ?? null;
  const [data, setData] = useState<CompleteData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const tracked = useRef(false);

  useEffect(() => {
    api
      .get<CompleteData>('/api/module/ai101-m1/complete')
      .then((d) => {
        setData(d);
        if (d.graded && !tracked.current) {
          tracked.current = true;
          track('module_completed', { moduleId: 'ai101-m1' });
        }
      })
      .catch((e) => setError(e instanceof ApiError ? e.message : 'Could not load your completion. Reload to try again.'));
  }, []);

  if (error) return <Screen><div className="pt-20"><ErrorNote message={error} /></div></Screen>;
  if (!data) return <Screen><div className="pt-24 text-center"><p className="label-utility">Loading…</p></div></Screen>;

  if (!data.graded) {
    return (
      <Screen>
        <div className="pt-20 max-w-md">
          <p className="label-utility">Not yet</p>
          <h1 className="font-display font-bold text-ink-strong text-3xl mt-3">One step left</h1>
          <p className="text-ink mt-3">Module 1 completes when the applied activity has been graded. Your reading progress is safe.</p>
          <Link to="/module/1/activity" className="inline-block mt-6 text-accent font-semibold no-underline hover:underline">
            Go to the applied activity →
          </Link>
        </div>
      </Screen>
    );
  }

  const name = data.name ?? 'This learner';
  const calLine =
    data.diagnosticMeanDelta === null
      ? null
      : data.diagnosticMeanDelta >= 12
        ? 'tended to over-estimate what AI could do'
        : data.diagnosticMeanDelta <= -12
          ? 'tended to under-estimate what AI could do'
          : 'was close to calibrated on what AI could do';

  return (
    <Screen>
      <div className="pt-14 sm:pt-20">
        <p className="label-utility anim-fade">Module 1 · complete</p>
        <h1 className="font-display font-bold text-ink-strong text-3xl sm:text-4xl mt-3 anim-rise">
          {data.name ? `${data.name}, that's` : "That's"} the first step out of the Risk stage.
        </h1>
        <p className="text-ink mt-4 max-w-xl anim-rise" style={{ animationDelay: '100ms' }}>
          Scored {data.graded.total}/20 on the applied activity. {data.graded.summary}
        </p>

        <section className="mt-10 anim-rise" style={{ animationDelay: '200ms' }}>
          <p className="label-utility mb-2">Manager one-pager · generated on completion</p>
          <div className="border border-line rounded-brand bg-surface p-6 sm:p-8 shadow-sm">
            <p className="font-display font-bold text-ink-strong text-lg">
              {name} just completed AI 101 · Module 1: What is AI?
            </p>
            <h3 className="label-utility mt-5">What they covered</h3>
            <p className="text-sm text-ink mt-1.5 leading-relaxed">
              A working mental model of what large language models actually do; the distinction between language models and the
              scoring models already embedded in HR tooling; why the model has no knowledge of your organization unless someone
              supplies it; and a delegation heuristic for deciding what to hand over.
            </p>
            <h3 className="label-utility mt-5">Three questions for your next 1:1</h3>
            <ol className="text-sm text-ink mt-1.5 leading-relaxed list-decimal pl-5 flex flex-col gap-1.5">
              <li>Which task on your plate this month is a good fit for AI, and which one looked like a fit but isn't?</li>
              <li>
                In the calibration exercise, did you tend to over- or under-estimate what AI could do?
                {calLine && <span className="text-muted"> (Their diagnostic: {calLine}.)</span>} What does that suggest about
                where to be careful?
              </li>
              <li>Is there anything you've been pasting into an AI tool that you'd want to check with security or legal first?</li>
            </ol>
            <h3 className="label-utility mt-5">Where you can help</h3>
            <p className="text-sm text-ink mt-1.5 leading-relaxed">
              The habit this module is trying to build is asking <em>"what does the model not know that I'd have to give
              it?"</em> before starting. If you ask that question out loud in your own work, they'll pick it up faster than any
              module can teach it.
            </p>
          </div>
          <p className="text-xs text-muted mt-2">Preview — in the full product this is sent to the learner's manager.</p>
        </section>

        <div className="mt-10 flex items-center gap-5 anim-rise" style={{ animationDelay: '300ms' }}>
          <Link
            to={shortCourse ? '/plan' : '/path'}
            className="inline-flex px-5 py-2.5 font-display font-semibold text-[0.95rem] rounded-brand bg-accent text-on-accent hover:brightness-110 no-underline"
          >
            {shortCourse ? 'Back to your plan' : 'Back to the path'}
          </Link>
          {!shortCourse && <span className="text-sm text-muted">Module 2 unlocks in the full course.</span>}
        </div>
      </div>
    </Screen>
  );
}
