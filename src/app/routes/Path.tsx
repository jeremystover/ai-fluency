import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { CourseCard, PathModule } from '../../shared/types';
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

function ModuleCard({ m }: { m: PathModule }) {
  const open = m.access === 'open';
  return (
    <div
      className={`border rounded-brand p-5 bg-surface flex flex-col ${
        open ? 'border-accent' : m.access === 'locked' ? 'border-line opacity-80' : 'border-line'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="label-utility">Module {m.ordinal}</span>
        {open ? (
          <span className="font-utility text-[0.65rem] uppercase tracking-wider px-2 py-0.5 rounded-full bg-signal text-on-signal">Open</span>
        ) : m.access === 'locked' ? (
          <span className="label-utility flex items-center gap-1"><Lock /> Locked</span>
        ) : (
          <span className="font-utility text-[0.65rem] uppercase tracking-wider px-2 py-0.5 rounded-full border border-line-strong text-muted">
            Your choice · full course
          </span>
        )}
      </div>
      <h2 className="font-display font-semibold text-ink-strong text-lg mt-2">{m.title}</h2>
      <p className="text-sm text-ink mt-1.5 leading-relaxed flex-1">{m.blurb}</p>

      <div className="mt-3 pt-3 border-t border-line flex items-center justify-between gap-2 flex-wrap">
        <span className="font-utility text-[0.65rem] text-muted">
          Full ~{m.estMinutes} min · Micro {m.microMinutes} min
        </span>
        {open && (
          <span className="flex items-center gap-3">
            <Link to="/module/1/micro" className="text-accent text-sm font-semibold no-underline hover:underline">
              Micro
            </Link>
            <Link to="/module/1" className="text-accent text-sm font-semibold no-underline hover:underline">
              Start →
            </Link>
          </span>
        )}
      </div>
      {m.access === 'locked' && m.unlockHint && (
        <p className="text-xs text-ink-strong mt-2 flex gap-1.5">
          <span aria-hidden="true">🔑</span>
          {m.unlockHint}
        </p>
      )}
      {m.access === 'full_course' && m.unlockHint && (
        <p className="text-xs text-success mt-2">✓ {m.unlockHint}</p>
      )}
    </div>
  );
}

export default function Path() {
  const { me } = useApp();
  const [data, setData] = useState<{ modules: PathModule[]; courses: CourseCard[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<{ modules: PathModule[]; courses: CourseCard[] }>('/api/path')
      .then(setData)
      .catch((e) => setError(e instanceof ApiError ? e.message : 'Could not load the path. Reload to try again.'));
  }, []);

  if (error) return <Screen><div className="pt-20"><ErrorNote message={error} /></div></Screen>;
  if (!data) return <Screen><div className="pt-24 text-center"><p className="label-utility">Loading the path…</p></div></Screen>;

  return (
    <Screen wide>
      <div className="pt-10 sm:pt-14">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p className="label-utility">Your path</p>
            <h1 className="font-display font-bold text-ink-strong text-3xl sm:text-4xl mt-3">AI 101 · Foundations</h1>
            <p className="text-muted mt-2 max-w-xl">
              Take modules in the order that serves you — each comes as a full module or a two-minute micro dose. A few build
              on others; those stay locked until the prerequisite is met, and every lock says how to open it
              {me?.progress.diagnosticDone ? '' : ' — the diagnostic can test you out of Module 1'}.
            </p>
          </div>
          <Link to="/welcome?edit=1" className="text-accent text-sm font-semibold no-underline hover:underline shrink-0">
            Customize your path
          </Link>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {data.modules.map((m) => (
            <ModuleCard key={m.id} m={m} />
          ))}
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
