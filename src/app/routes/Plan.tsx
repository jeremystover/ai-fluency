import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import type { PlanResponse } from '../../shared/types';
import { Screen, Button, ErrorNote } from '../components/ui';
import { api, ApiError } from '../api';
import { goalLabel } from '../../shared/goals';

const STATE_LABEL: Record<string, string> = { done: 'Done', now: 'This sitting', later: 'Another sitting' };

export default function Plan() {
  const navigate = useNavigate();
  const [plan, setPlan] = useState<PlanResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<PlanResponse>('/api/plan')
      .then(setPlan)
      .catch((e) => setError(e instanceof ApiError ? e.message : 'Could not build the plan. Reload to try again.'));
  }, []);

  if (error) return <Screen><div className="pt-20"><ErrorNote message={error} /></div></Screen>;
  if (!plan) return <Screen><div className="pt-24 text-center"><p className="label-utility">Crafting your course…</p></div></Screen>;

  return (
    <Screen>
      <div className="pt-12 sm:pt-16 max-w-xl">
        <p className="label-utility anim-fade">Your course</p>
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
          {plan.steps.map((step, i) => (
            <li
              key={step.id}
              className={`border-l-2 pl-5 pb-7 relative anim-rise ${
                step.state === 'now' ? 'border-accent' : step.state === 'done' ? 'border-success' : 'border-line'
              }`}
              style={{ animationDelay: `${140 + i * 90}ms` }}
            >
              <span
                className={`absolute -left-[7px] top-1 w-3 h-3 rounded-full border-2 ${
                  step.state === 'done'
                    ? 'bg-success border-success'
                    : step.state === 'now'
                      ? 'bg-signal border-ink-strong'
                      : 'bg-surface border-line-strong'
                }`}
                aria-hidden="true"
              />
              <div className="flex items-baseline justify-between gap-3 flex-wrap">
                <span className={`font-display font-semibold ${step.state === 'later' ? 'text-muted' : 'text-ink-strong'}`}>
                  {step.title}
                </span>
                <span className="font-utility text-[0.65rem] uppercase tracking-wider text-muted shrink-0">
                  {STATE_LABEL[step.state]} · {step.minutes} min
                </span>
              </div>
              <p className={`text-sm mt-1 ${step.state === 'later' ? 'text-muted' : 'text-ink'}`}>{step.detail}</p>
            </li>
          ))}
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

        <div className="mt-8 flex items-center gap-5 flex-wrap">
          <Button onClick={() => navigate(plan.nextRoute)}>Start</Button>
          <Link to="/path" className="text-muted text-sm hover:text-ink-strong">
            Explore the module library
          </Link>
          <Link to="/welcome?edit=1" className="text-muted text-sm hover:text-ink-strong">
            Customize your path
          </Link>
        </div>
      </div>
    </Screen>
  );
}
