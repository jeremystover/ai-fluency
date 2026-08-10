import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { CourseCard, PathModule, PathResponse } from '../../shared/types';
import { Screen, ErrorNote } from '../components/ui';
import { api, ApiError } from '../api';
import { useApp } from '../brand';
import { preferredSurface, surfaceRoute, surfaceStartLabel } from '../modality';
import { depthOf } from '../../shared/depth';
import { goalLabel } from '../../shared/goals';

// The path as a ledger: a progress instrument that owns "how far am I,"
// an up-next queue that owns "why this, for me," and the library compressed
// to state-weighted rows — done things shrink, the next thing grows. Nothing
// locks; every number is a read of the funnel, never an invention.

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

const fmtMinutes = (min: number) => {
  if (min < 60) return `~${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `~${h}h${m ? ` ${m.toString().padStart(2, '0')}m` : ''}`;
};

// "AI 101 · Foundations" → "AI 101"
const shortTitle = (course: CourseCard) => course.title.split('·')[0].trim();

type RowState = 'done' | 'tested' | 'next' | 'todo';

function StateDot({ state }: { state: RowState | 'lock' }) {
  const base = 'w-[22px] h-[22px] rounded-full flex-none flex items-center justify-center text-[0.7rem]';
  if (state === 'done') return <span className={`${base} bg-accent text-on-accent`} aria-hidden="true">✓</span>;
  if (state === 'tested') return <span className={`${base} bg-accent/15 text-accent`} aria-hidden="true">✓</span>;
  if (state === 'next') return <span className={`${base} bg-signal text-on-signal font-bold`} aria-hidden="true">→</span>;
  if (state === 'lock') return <span className={`${base} border-2 border-dashed border-line-strong text-muted`} aria-hidden="true">·</span>;
  return <span className={`${base} border-2 border-line-strong`} aria-hidden="true" />;
}

function ModuleRow({
  m,
  state,
  startRoute,
}: {
  m: PathModule;
  state: RowState;
  startRoute: string;
}) {
  const done = state === 'done' || state === 'tested';
  const sub = done
    ? m.completedAt
      ? `Completed ${fmtDate(m.completedAt)}${m.bestCheck ? ` · check ${m.bestCheck.correct}/${m.bestCheck.total}` : ''}`
      : m.testedOut
        ? 'Tested out via diagnostic · revisit any time'
        : m.bestCheck
          ? `Check passed ${m.bestCheck.correct}/${m.bestCheck.total} · revisit any time`
          : 'Cleared'
    : state === 'next'
      ? `★ Up next — ${m.recommendedFor[0] ?? 'next in course order'}`
      : m.recommendedFor.length > 0
        ? `★ ${m.recommendedFor.join(' · ')}`
        : m.unlockHint && m.unlockHint !== 'Prerequisite cleared.'
          ? m.unlockHint.split('. Go in any order')[0]
          : null;
  return (
    <div className={`flex items-center gap-3.5 px-4 sm:px-5 py-3 border-b border-line last:border-b-0 ${state === 'next' ? 'bg-signal/10' : ''}`}>
      <StateDot state={state} />
      <div className="flex-1 min-w-0">
        <span className={`block font-display text-[0.95rem] ${done ? 'text-muted font-medium' : 'font-semibold text-ink-strong'}`}>{m.title}</span>
        {sub && (
          <span className={`block text-[0.75rem] leading-snug ${state === 'next' || (!done && m.recommendedFor.length > 0) ? 'text-accent font-semibold' : 'text-muted'}`}>
            {sub}
          </span>
        )}
      </div>
      {!done && <span className="font-utility text-[0.64rem] text-muted whitespace-nowrap hidden sm:inline">~{m.estMinutes} min</span>}
      {state === 'next' ? (
        <Link
          to={startRoute}
          className="inline-flex items-center px-3.5 py-1.5 font-display font-semibold text-[0.8rem] rounded-brand bg-accent text-on-accent hover:brightness-110 no-underline whitespace-nowrap"
        >
          Start
        </Link>
      ) : (
        <Link
          to={done ? `/module/${m.id}` : startRoute}
          className="text-accent text-[0.8rem] font-semibold no-underline hover:underline whitespace-nowrap"
        >
          {done ? 'Revisit' : 'Start'}
        </Link>
      )}
    </div>
  );
}

export default function Path() {
  const { me } = useApp();
  const surface = preferredSurface(me?.prefs?.styles);
  // Readers who asked for short-and-sweet start at the micro dose.
  const essentialsReader = surface === 'read' && depthOf(me?.prefs?.depth) === 'essentials';
  const [data, setData] = useState<PathResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<PathResponse>('/api/path')
      .then(setData)
      .catch((e) => setError(e instanceof ApiError ? e.message : 'Could not load the path. Reload to try again.'));
  }, []);

  if (error) return <Screen><div className="pt-20"><ErrorNote message={error} /></div></Screen>;
  if (!data) return <Screen><div className="pt-24 text-center"><p className="label-utility">Opening your path…</p></div></Screen>;

  const { summary, upNext, diagnosticNote } = data;
  const startFor = (m: PathModule) =>
    essentialsReader
      ? { route: `/module/${m.id}/micro`, label: 'Start micro →' }
      : { route: surfaceRoute(surface, m.id), label: surfaceStartLabel(surface) };

  const name = me?.displayName ?? null;
  const greeting = summary.doneCount > 0 ? `Keep going${name ? `, ${name}` : ''}.` : `Choose your first move${name ? `, ${name}` : ''}.`;
  const goals = (me?.prefs?.goals ?? []).map(goalLabel);

  const nextId = upNext[0]?.moduleId ?? null;
  const nextModule = nextId ? data.modules.find((m) => m.id === nextId) : undefined;
  const thenRecs = upNext.slice(1, 3).map((r) => ({ rec: r, m: data.modules.find((mod) => mod.id === r.moduleId) }));
  const openModules = data.modules.filter((m) => m.access === 'open');
  const stateOf = (m: PathModule): RowState =>
    m.completed ? 'done' : m.testedOut ? 'tested' : m.id === nextId ? 'next' : 'todo';

  const stats: string[] = [];
  if (summary.minutesInvested > 0) stats.push(`${summary.minutesInvested} min invested`);
  if (summary.checks) stats.push(`${summary.checks.passed} check${summary.checks.passed === 1 ? '' : 's'} passed · ${summary.checks.correct}/${summary.checks.total}`);
  if (summary.activeDays7 > 0) stats.push(`active ${summary.activeDays7} of last 7 days`);

  // Courses with open modules render as row sections; the rest are horizon rows.
  const openCourses = data.courses.filter((course) => data.modules.some((m) => m.courseId === course.id));
  const horizonCourses = data.courses.filter((course) => !data.modules.some((m) => m.courseId === course.id));

  return (
    <Screen wide>
      <div className="pt-10 sm:pt-14">
        <p className="label-utility">Your path</p>
        <h1 className="font-display font-bold text-ink-strong text-3xl sm:text-4xl mt-3 tracking-tight">{greeting}</h1>
        {goals.length > 0 || diagnosticNote ? (
          <p className="text-muted mt-2 max-w-2xl text-[0.95rem]">
            Built from your answers:{' '}
            {goals.map((g, i) => (
              <span key={g}>
                <span className="text-ink-strong font-semibold">{g}</span>
                {i < goals.length - 1 ? ' · ' : ''}
              </span>
            ))}
            {goals.length > 0 && diagnosticNote ? ' · ' : ''}
            {diagnosticNote}{' '}
            <Link to="/welcome?edit=1" className="text-accent font-semibold no-underline hover:underline">Adjust →</Link>
          </p>
        ) : (
          <p className="text-muted mt-2 max-w-2xl text-[0.95rem]">
            Answer a few questions and this page starts choosing for you.{' '}
            <Link to="/welcome?edit=1" className="text-accent font-semibold no-underline hover:underline">Customize your path →</Link>
          </p>
        )}

        {/* The instrument */}
        <div className="mt-6 border border-ink-strong rounded-[10px] bg-surface px-5 sm:px-6 py-5">
          <div className="flex items-baseline justify-between gap-x-5 gap-y-2 flex-wrap">
            <span className="font-display font-bold text-ink-strong text-3xl tracking-tight">
              {summary.doneCount} of {summary.openTotal}
              <span className="font-semibold text-muted text-base ml-2 tracking-normal">open modules</span>
            </span>
            {stats.length > 0 && (
              <span className="flex gap-x-5 gap-y-1 flex-wrap font-utility text-[0.66rem] uppercase tracking-wider text-muted">
                {stats.map((s) => <span key={s}>{s}</span>)}
              </span>
            )}
          </div>
          <div className="flex gap-1 mt-3.5" aria-hidden="true">
            {openModules.map((m) => {
              const s = stateOf(m);
              const cls =
                s === 'done' ? 'bg-accent' : s === 'tested' ? 'bg-accent/55' : s === 'next' ? 'bg-signal' : 'bg-line';
              return <span key={m.id} title={m.title} className={`flex-1 h-2 rounded ${cls}`} />;
            })}
          </div>
          <div className="flex justify-between gap-3 flex-wrap mt-1.5 font-utility text-[0.6rem] uppercase tracking-wider text-muted">
            {openCourses.map((course) => {
              const mods = openModules.filter((m) => m.courseId === course.id);
              if (!mods.length) return null;
              const done = mods.filter((m) => m.completed || m.testedOut).length;
              return <span key={course.id}>{shortTitle(course)} · {done}/{mods.length} cleared</span>;
            })}
          </div>
        </div>

        {/* Up next for you */}
        {nextModule && (
          <div className="mt-8">
            <p className="label-utility">Up next for you</p>
            <div className="mt-3 grid gap-3 lg:grid-cols-[1.7fr_1fr]">
              <div className="border border-accent rounded-brand bg-accent/[0.04] p-6 flex flex-col">
                <span className="font-utility text-[0.66rem] uppercase tracking-wider text-accent">
                  {shortTitle(openCourses.find((c) => c.id === nextModule.courseId) ?? openCourses[0])} · Module {nextModule.ordinal} · ~{nextModule.estMinutes} min
                </span>
                <h2 className="font-display font-bold text-ink-strong text-2xl mt-2 tracking-tight">{nextModule.title}</h2>
                <p className="text-[0.92rem] text-ink mt-2 flex-1">{nextModule.blurb}</p>
                {upNext[0].reasons.length > 0 && (
                  <div className="flex gap-1.5 flex-wrap mt-3">
                    {upNext[0].reasons.slice(0, 3).map((r) => (
                      <span key={r} className="font-utility text-[0.62rem] border border-accent text-accent rounded-full px-2.5 py-0.5 bg-surface">{r}</span>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-4 flex-wrap mt-4">
                  <Link
                    to={startFor(nextModule).route}
                    className="inline-flex items-center px-5 py-2.5 font-display font-semibold text-[0.95rem] rounded-brand bg-accent text-on-accent hover:brightness-110 no-underline"
                  >
                    {startFor(nextModule).label}
                  </Link>
                  {(surface !== 'read' || essentialsReader) && (
                    <Link to={`/module/${nextModule.id}`} className="text-accent font-semibold text-sm no-underline hover:underline">
                      {essentialsReader ? 'Full read instead' : 'Read instead'}
                    </Link>
                  )}
                  {!essentialsReader && (
                    <Link to={`/module/${nextModule.id}/micro`} className="text-accent font-semibold text-sm no-underline hover:underline">
                      Micro · {nextModule.microMinutes} min
                    </Link>
                  )}
                </div>
              </div>
              {thenRecs.length > 0 && (
                <div className="border border-line rounded-brand bg-surface px-5 py-4">
                  <p className="label-utility mb-1">Then</p>
                  {thenRecs.map(({ rec, m }) =>
                    m ? (
                      <Link key={m.id} to={`/module/${m.id}`} className="block py-2 border-t border-line first-of-type:border-t-0 no-underline group">
                        <span className="block font-display font-semibold text-[0.9rem] text-ink-strong group-hover:text-accent transition-colors">{m.title}</span>
                        <span className="block text-[0.72rem] text-muted">~{m.estMinutes} min{rec.reasons[0] ? ` · ${rec.reasons[0]}` : ''}</span>
                      </Link>
                    ) : null,
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* The library, course by course */}
        {openCourses.map((course) => {
          const mods = data.modules.filter((m) => m.courseId === course.id);
          const open = mods.filter((m) => m.access === 'open');
          const done = open.filter((m) => m.completed || m.testedOut).length;
          // Consecutive full-course modules collapse into one quiet row.
          const rows: (PathModule | PathModule[])[] = [];
          for (const m of mods) {
            if (m.access === 'open') rows.push(m);
            else {
              const last = rows[rows.length - 1];
              if (Array.isArray(last)) last.push(m);
              else rows.push([m]);
            }
          }
          return (
            <section key={course.id} className="mt-10">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="font-display font-bold text-ink-strong text-lg">{course.title}</h2>
                <span className="label-utility">{course.level}</span>
                {open.length > 0 && (
                  <>
                    <span className="flex-1 min-w-[100px] h-1 rounded bg-line overflow-hidden" aria-hidden="true">
                      <span className="block h-full bg-accent" style={{ width: `${(done / open.length) * 100}%` }} />
                    </span>
                    <span className="font-utility text-[0.64rem] text-muted">{done}/{open.length}</span>
                  </>
                )}
              </div>
              <div className="mt-3 border border-line rounded-brand bg-surface overflow-hidden">
                {rows.map((row) =>
                  Array.isArray(row) ? (
                    <div key={row[0].id} className="flex items-center gap-3.5 px-4 sm:px-5 py-3 border-b border-line last:border-b-0">
                      <StateDot state="lock" />
                      <div className="flex-1 min-w-0">
                        <span className="block font-display font-medium text-[0.95rem] text-muted">
                          {row.length === 1 ? row[0].title : `Modules ${row[0].ordinal}–${row[row.length - 1].ordinal}`}
                        </span>
                        <span className="block text-[0.75rem] text-muted">Yours whenever — they ship in the full course</span>
                      </div>
                      <span className="font-utility text-[0.64rem] text-muted whitespace-nowrap">
                        {fmtMinutes(row.reduce((sum, m) => sum + m.estMinutes, 0))}
                      </span>
                    </div>
                  ) : (
                    <ModuleRow key={row.id} m={row} state={stateOf(row)} startRoute={startFor(row).route} />
                  ),
                )}
              </div>
            </section>
          );
        })}

        {/* Further up the ladder */}
        {horizonCourses.length > 0 && (
          <div className="mt-9 grid gap-2.5 sm:grid-cols-2">
            {horizonCourses.map((c) => (
              <div key={c.id} className={`border border-dashed rounded-brand px-4 sm:px-5 py-3.5 flex items-baseline justify-between gap-3 flex-wrap ${c.recommendedFor?.length ? 'border-accent/50' : 'border-line-strong'}`}>
                <span>
                  <span className="font-display font-semibold text-[0.95rem] text-ink-strong">{c.title}</span>
                  {(c.recommendedFor ?? []).length > 0 && (
                    <span className="text-[0.75rem] text-accent font-semibold ml-2">★ {(c.recommendedFor ?? []).join(' · ')}</span>
                  )}
                </span>
                <span className="font-utility text-[0.62rem] uppercase tracking-wider text-muted whitespace-nowrap">{c.level} · full course</span>
              </div>
            ))}
          </div>
        )}

        <p className="label-utility mt-8">Go in any order — prerequisites are recommendations, not gates.</p>
      </div>
    </Screen>
  );
}
