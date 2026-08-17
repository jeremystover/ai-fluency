import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import type { PlanResponse, PlanStep } from '../../shared/types';
import { Screen, Button, ErrorNote } from '../components/ui';
import { api, ApiError } from '../api';
import { goalLabel } from '../../shared/goals';

// The sitting-sized cut of the course. State words stay ("this sitting" /
// "another sitting"); the markers speak the path page's progress grammar.
const STATE_LABEL: Record<string, string> = { done: 'Done', now: 'This sitting', later: 'Another sitting' };

// Everything a module in a short course offers, dropped in under the step.
// On a short course this page is the only view of the whole course — there is
// no path screen and no library behind it — so "See your path" expands here
// instead of navigating away.
function Activities({ step }: { step: PlanStep }) {
  if (!step.activities?.length) return null;
  return (
    <ul className="mt-2.5 pt-2 border-t border-line flex flex-col">
      {step.activities.map((a) => (
        <li key={a.id}>
          <Link to={a.route} className="flex items-baseline gap-2 py-1 no-underline group">
            <span className="font-display font-semibold text-[0.85rem] text-ink-strong group-hover:text-accent transition-colors whitespace-nowrap">
              {a.label}
            </span>
            <span className="text-[0.75rem] text-muted leading-snug">{a.detail}</span>
            {a.minutes !== null && (
              <span className="ml-auto font-utility text-[0.65rem] text-muted whitespace-nowrap">~{a.minutes} min</span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function Plan() {
  const navigate = useNavigate();
  const [plan, setPlan] = useState<PlanResponse | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<PlanResponse>('/api/plan')
      .then(setPlan)
      .catch((e) => setError(e instanceof ApiError ? e.message : 'Could not build the plan. Reload to try again.'));
  }, []);

  if (error) return <Screen><div className="pt-20"><ErrorNote message={error} /></div></Screen>;
  if (!plan) return <Screen><div className="pt-24 text-center"><p className="label-utility">Crafting your course…</p></div></Screen>;

  const shortCourse = plan.shortCourse ?? null;

  return (
    <Screen>
      <div className="pt-12 sm:pt-16 max-w-xl">
        <p className="label-utility anim-fade">{shortCourse ? shortCourse.label : 'Your course'}</p>
        <h1 className="font-display font-bold text-ink-strong text-3xl sm:text-4xl mt-3 leading-tight anim-rise">{plan.greeting}</h1>
        {plan.goals.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5 anim-rise" style={{ animationDelay: '60ms' }}>
            {plan.goals.map((g) => (
              <span key={g} className="font-utility text-[0.65rem] uppercase tracking-wider px-2.5 py-1 rounded-full border border-line-strong text-ink-strong">
                {goalLabel(g)}
              </span>
            ))}
          </div>
        )}
        {plan.objective && (
          <p className="mt-4 border-l-4 border-signal pl-4 text-ink italic anim-rise" style={{ animationDelay: '80ms' }}>
            "{plan.objective}"
          </p>
        )}

        <ol className="mt-8 flex flex-col">
          {plan.steps.map((step, i) => {
            // A sitting can hold several steps, but only one thing is next:
            // the first undone step gets the glow and the Go; the rest of the
            // sitting waits with a signal dot.
            const isNext = step.state === 'now' && plan.steps.findIndex((s) => s.state === 'now') === i;
            return (
            <li
              key={step.id}
              className={`border-l-2 pl-5 pb-6 relative anim-rise ${
                step.state === 'done' ? 'border-accent' : step.state === 'now' ? 'border-signal' : 'border-line'
              }`}
              style={{ animationDelay: `${140 + i * 90}ms` }}
            >
              {/* The path page's state grammar: done = accent check, now = the
                  signal glow, later = an open circle waiting its turn. */}
              <span
                className={`absolute -left-[11px] top-1 w-[22px] h-[22px] rounded-full flex items-center justify-center text-[0.7rem] ${
                  step.state === 'done'
                    ? 'bg-accent text-on-accent'
                    : step.state === 'now'
                      ? 'bg-signal text-on-signal font-bold'
                      : 'bg-surface border-2 border-line-strong'
                }`}
                aria-hidden="true"
              >
                {step.state === 'done' ? '✓' : step.state === 'now' ? '→' : ''}
              </span>
              <div className={isNext ? 'bg-signal/10 rounded-brand -ml-1 px-3 py-2.5' : ''}>
                <div className="flex items-baseline justify-between gap-3 flex-wrap">
                  {/* Clicking ahead is allowed: a module title is a door to
                      that module, whatever order the plan puts it in. */}
                  {step.moduleId ? (
                    <Link
                      to={step.route}
                      className={`font-display font-semibold no-underline hover:text-accent transition-colors ${
                        step.state === 'done' ? 'text-muted' : 'text-ink-strong'
                      }`}
                    >
                      {step.title}
                    </Link>
                  ) : (
                    <span className={`font-display font-semibold ${step.state === 'done' ? 'text-muted' : 'text-ink-strong'}`}>
                      {step.title}
                    </span>
                  )}
                  <span className={`font-utility text-[0.65rem] uppercase tracking-wider shrink-0 ${step.state === 'done' ? 'text-accent' : 'text-muted'}`}>
                    {step.state === 'done' ? '✓ Done' : `${STATE_LABEL[step.state]} · ${step.minutes} min`}
                  </span>
                </div>
                <p className={`text-sm mt-1 ${step.state === 'done' ? 'text-muted' : 'text-ink'}`}>{step.detail}</p>
                {expanded && <Activities step={step} />}
                {isNext && (
                  <Link to={step.route} className="inline-block mt-2 text-accent font-semibold text-sm no-underline hover:underline">
                    Go →
                  </Link>
                )}
              </div>
            </li>
            );
          })}
        </ol>

        {plan.notes.length > 0 && (
          <ul className="mt-2 flex flex-col gap-1.5">
            {plan.notes.map((note) => (
              <li key={note} className="text-xs text-muted flex gap-2">
                <span className="text-signal" aria-hidden="true">●</span>
                {note}
              </li>
            ))}
          </ul>
        )}

        {/* Same link, different move: a short course has no path screen to
            send anyone to, so "See your path" opens the whole course here —
            every module and every way into it. And no "Customize your path":
            the questions were answered once and that's the deal. */}
        <div className="mt-8 flex items-center gap-5 flex-wrap">
          <Button onClick={() => navigate(plan.nextRoute)}>Start</Button>
          {shortCourse ? (
            <button
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              className="text-muted text-sm hover:text-ink-strong"
            >
              {expanded ? 'Hide what’s in it' : 'See your path'}
            </button>
          ) : (
            <>
              <Link to="/path" className="text-muted text-sm hover:text-ink-strong">
                See your path
              </Link>
              <Link to="/welcome?edit=1" className="text-muted text-sm hover:text-ink-strong">
                Customize your path
              </Link>
            </>
          )}
        </div>
      </div>
    </Screen>
  );
}
