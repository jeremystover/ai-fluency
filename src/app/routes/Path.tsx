import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { CourseCard, PathModule } from '../../shared/types';
import { Screen, ErrorNote } from '../components/ui';
import { api, ApiError } from '../api';
import { useApp } from '../brand';
import { preferredSurface, surfaceRoute, surfaceStartLabel } from '../modality';
import { depthOf } from '../../shared/depth';

function Lock() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" className="inline-block">
      <rect x="2" y="5" width="8" height="6" rx="1" fill="currentColor" />
      <path d="M4 5V3.5a2 2 0 1 1 4 0V5" stroke="currentColor" strokeWidth="1.4" fill="none" />
    </svg>
  );
}

function ModuleCard({ m, startRoute, startLabel }: { m: PathModule; startRoute: string; startLabel: string }) {
  const open = m.access === 'open';
  const badge = m.completed
    ? { text: '✓ Completed', cls: 'bg-success/10 text-success border border-success/40' }
    : m.testedOut
      ? { text: '✓ Tested out', cls: 'bg-signal text-on-signal' }
      : open
        ? { text: 'Open', cls: 'bg-signal text-on-signal' }
        : { text: 'Your choice · full course', cls: 'border border-line-strong text-muted' };
  return (
    <div className={`border rounded-brand p-5 bg-surface flex flex-col ${open ? 'border-accent' : 'border-line'}`}>
      <div className="flex items-center justify-between">
        <span className="label-utility">Module {m.ordinal}</span>
        <span className={`font-utility text-[0.65rem] uppercase tracking-wider px-2 py-0.5 rounded-full ${badge.cls}`}>{badge.text}</span>
      </div>
      <h2 className="font-display font-semibold text-ink-strong text-lg mt-2">{m.title}</h2>
      <p className="text-sm text-ink mt-1.5 leading-relaxed flex-1">{m.blurb}</p>

      <div className="mt-3 pt-3 border-t border-line flex items-center justify-between gap-2 flex-wrap">
        <span className="font-utility text-[0.65rem] text-muted">
          Full ~{m.estMinutes} min · Micro {m.microMinutes} min
        </span>
        {open && (
          <span className="flex items-center gap-3">
            <Link to={`/module/${m.id}/micro`} className="text-accent text-sm font-semibold no-underline hover:underline">
              Micro
            </Link>
            <Link to={m.completed ? `/module/${m.id}` : startRoute} className="text-accent text-sm font-semibold no-underline hover:underline">
              {m.completed ? 'Revisit →' : startLabel}
            </Link>
          </span>
        )}
      </div>
      {m.recommendedFor.length > 0 && !m.completed && (
        <p className="text-xs text-accent mt-2 font-semibold">
          <span aria-hidden="true">★ </span>Recommended for you — {m.recommendedFor.join(' · ')}
        </p>
      )}
      {m.unlockHint && !m.completed && (
        <p className={`text-xs mt-2 ${m.unlockHint === 'Prerequisite cleared.' ? 'text-success' : 'text-muted'}`}>
          {m.unlockHint === 'Prerequisite cleared.' ? '✓ ' : ''}{m.unlockHint}
        </p>
      )}
    </div>
  );
}

export default function Path() {
  const { me } = useApp();
  const surface = preferredSurface(me?.prefs?.styles);
  // Readers who asked for short-and-sweet start at the micro dose.
  const essentialsReader = surface === 'read' && depthOf(me?.prefs?.depth) === 'essentials';
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

  const startFor = (m: PathModule) =>
    essentialsReader
      ? { route: `/module/${m.id}/micro`, label: 'Start micro →' }
      : { route: surfaceRoute(surface, m.id), label: surfaceStartLabel(surface) };

  return (
    <Screen wide>
      <div className="pt-10 sm:pt-14">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p className="label-utility">Your path</p>
            <h1 className="font-display font-bold text-ink-strong text-3xl sm:text-4xl mt-3">The course ladder</h1>
            <p className="text-muted mt-2 max-w-xl">
              Take modules in the order that serves you — each comes as a full module or a two-minute micro dose. Nothing locks:
              a few build on others, and those carry a recommendation, not a gate
              {me?.progress.diagnosticDone ? '' : ' — and the diagnostic can test you out of Module 1'}.
            </p>
          </div>
          <Link to="/welcome?edit=1" className="text-accent text-sm font-semibold no-underline hover:underline shrink-0">
            Customize your path
          </Link>
        </div>

        {data.courses
          .filter((course) => data.modules.some((m) => m.courseId === course.id))
          .map((course) => (
            <section key={course.id} className="mt-10">
              <div className="flex items-baseline gap-3 flex-wrap">
                <h2 className="font-display font-bold text-ink-strong text-xl">{course.title}</h2>
                <span className="label-utility">{course.level}</span>
              </div>
              <p className="text-sm text-muted mt-1 max-w-xl">{course.blurb}</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {data.modules
                  .filter((m) => m.courseId === course.id)
                  .map((m) => {
                    const start = startFor(m);
                    return <ModuleCard key={m.id} m={m} startRoute={start.route} startLabel={start.label} />;
                  })}
              </div>
            </section>
          ))}

        <h2 className="label-utility mt-14">Further up the ladder</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {data.courses
            .filter((c) => !data.modules.some((m) => m.courseId === c.id))
            .map((c) => {
              const recommended = c.recommendedFor ?? [];
              return (
                <div key={c.id} className={`border rounded-brand p-5 bg-surface ${recommended.length ? 'border-accent/50' : 'border-line opacity-75'}`}>
                  <div className="flex items-center justify-between">
                    <span className="label-utility">{c.level}</span>
                    <span className="label-utility flex items-center gap-1"><Lock /> Full course</span>
                  </div>
                  <h3 className="font-display font-semibold text-ink-strong mt-2">{c.title}</h3>
                  <p className="text-sm text-ink mt-1.5 leading-relaxed">{c.blurb}</p>
                  {recommended.length > 0 && (
                    <p className="text-xs text-accent mt-2 font-semibold">
                      <span aria-hidden="true">★ </span>Recommended for you — {recommended.join(' · ')}
                    </p>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </Screen>
  );
}
