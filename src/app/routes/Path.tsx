import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CourseCard, ModuleCard } from '../../shared/types';
import { Screen, ErrorNote } from '../components/ui';
import { api, ApiError } from '../api';
import { useApp } from '../brand';

function Lock() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" className="inline-block">
      <rect x="2" y="5" width="8" height="6" rx="1" fill="currentColor" />
      <path d="M4 5V3.5a2 2 0 1 1 4 0V5" stroke="currentColor" strokeWidth="1.4" fill="none" />
    </svg>
  );
}

export default function Path() {
  const navigate = useNavigate();
  const { me } = useApp();
  const [data, setData] = useState<{ modules: ModuleCard[]; courses: CourseCard[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<{ modules: ModuleCard[]; courses: CourseCard[] }>('/api/path')
      .then(setData)
      .catch((e) => setError(e instanceof ApiError ? e.message : 'Could not load the path. Reload to try again.'));
  }, []);

  if (error) return <Screen><div className="pt-20"><ErrorNote message={error} /></div></Screen>;
  if (!data) return <Screen><div className="pt-24 text-center"><p className="label-utility">Loading the path…</p></div></Screen>;

  return (
    <Screen wide>
      <div className="pt-10 sm:pt-14">
        <p className="label-utility">Your path</p>
        <h1 className="font-display font-bold text-ink-strong text-3xl sm:text-4xl mt-3">AI 101 · Foundations</h1>
        <p className="text-muted mt-2 max-w-xl">
          Eight modules, L1 The Risk → L2 The Novice. Module 1 is open{me?.progress.diagnosticDone ? ' — your diagnostic is done, so it will read faster' : ''}.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {data.modules.map((m) => {
            const open = m.status === 'open';
            return (
              <button
                key={m.id}
                onClick={() => open && navigate('/module/1')}
                disabled={!open}
                className={`text-left border rounded-brand p-5 bg-surface transition-colors
                  ${open ? 'border-accent hover:bg-accent/[0.03] cursor-pointer' : 'border-line opacity-75'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="label-utility">Module {m.ordinal} · {m.estMinutes} min</span>
                  {open ? (
                    <span className="font-utility text-[0.65rem] uppercase tracking-wider px-2 py-0.5 rounded-full bg-signal text-on-signal">Open</span>
                  ) : (
                    <span className="label-utility flex items-center gap-1"><Lock /> Locked</span>
                  )}
                </div>
                <h2 className="font-display font-semibold text-ink-strong text-lg mt-2">{m.title}</h2>
                <p className="text-sm text-ink mt-1.5 leading-relaxed">{m.blurb}</p>
              </button>
            );
          })}
        </div>

        <h2 className="label-utility mt-14">After 101</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {data.courses.filter((c) => c.id !== 'ai101').map((c) => (
            <div key={c.id} className="border border-line rounded-brand p-5 bg-surface opacity-75">
              <div className="flex items-center justify-between">
                <span className="label-utility">{c.level}</span>
                <span className="label-utility flex items-center gap-1"><Lock /> Locked</span>
              </div>
              <h3 className="font-display font-semibold text-ink-strong mt-2">{c.title}</h3>
              <p className="text-sm text-ink mt-1.5 leading-relaxed">{c.blurb}</p>
            </div>
          ))}
        </div>
      </div>
    </Screen>
  );
}
