import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { CourseCard, PathModule, PathResponse, PathResume } from '../../shared/types';
import { Screen, ErrorNote } from '../components/ui';
import { api, ApiError } from '../api';
import { useApp } from '../brand';
import { preferredSurface, surfaceRoute, surfaceStartLabel } from '../modality';
import { depthOf } from '../../shared/depth';
import { goalLabel } from '../../shared/goals';

// The path as a ledger: a progress instrument that owns "how far am I,"
// one unambiguous next action that owns "what do I do now," and the library
// compressed to state-weighted rows — done things shrink, the next thing
// grows. Nothing locks; every number is a read of the funnel, never an
// invention.
//
// The page offers exactly one primary move. An unfinished module outranks a
// recommendation (closing an open loop beats starting a new one), and the
// alternate surfaces live behind a disclosure rather than competing with it —
// every extra door on this screen is a chance to leave through none of them.

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

const fmtMinutes = (min: number) => {
  if (min < 60) return `~${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `~${h}h${m ? ` ${m.toString().padStart(2, '0')}m` : ''}`;
};

const daysSince = (iso: string) => Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);

// "AI 101 · Foundations" → "AI 101"
const shortTitle = (course: CourseCard) => course.title.split('·')[0].trim();

// Where a half-finished module resumes — the surface the last touch came from,
// so "pick up where you left off" lands on the thing they were actually doing.
const resumeRoute = (r: PathResume): string => {
  const base = `/module/${r.moduleId}`;
  switch (r.via) {
    case 'chat':
      return `${base}/chat`;
    case 'podcast':
      return `${base}/podcast`;
    case 'check':
      return `${base}/check`;
    case 'activity':
      return `${base}/activity`;
    default:
      return base;
  }
};

const resumeLabel = (r: PathResume): string => {
  switch (r.via) {
    case 'chat':
      return 'Back to the tutor →';
    case 'podcast':
      return 'Back to the episode →';
    case 'check':
      return 'Back to the check →';
    case 'activity':
      return 'Back to the activity →';
    case 'exercise':
      return 'Back to the exercise →';
    default:
      return 'Keep reading →';
  }
};

type RowState = 'done' | 'tested' | 'next' | 'todo';

function StateDot({ state }: { state: RowState | 'lock' }) {
  const base = 'w-[22px] h-[22px] rounded-full flex-none flex items-center justify-center text-[0.7rem]';
  if (state === 'done') return <span className={`${base} bg-accent text-on-accent`} aria-hidden="true">✓</span>;
  if (state === 'tested') return <span className={`${base} bg-accent/15 text-accent`} aria-hidden="true">✓</span>;
  if (state === 'next') return <span className={`${base} bg-signal text-on-signal font-bold`} aria-hidden="true">→</span>;
  if (state === 'lock') return <span className={`${base} border-2 border-dashed border-line-strong text-muted`} aria-hidden="true">·</span>;
  return <span className={`${base} border-2 border-line-strong`} aria-hidden="true" />;
}

// Seven days, oldest to newest, filled where the funnel recorded activity.
// Day keys are UTC to match the server's substr() of the event timestamp, and
// the labels are derived from the same keys so the strip never disagrees with
// itself. A quiet read of consistency — no streak, nothing to break.
function WeekStrip({ activeDays }: { activeDays: string[] }) {
  const active = new Set(activeDays);
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - (6 - i) * 86_400_000);
    return d.toISOString().slice(0, 10);
  });
  const count = days.filter((d) => active.has(d)).length;
  return (
    <span className="flex items-center gap-2">
      <span className="flex gap-1" role="img" aria-label={`Active ${count} of the last 7 days`}>
        {days.map((d) => (
          <span
            key={d}
            title={new Date(`${d}T00:00:00Z`).toLocaleDateString(undefined, { weekday: 'long', timeZone: 'UTC' })}
            className={`w-1.5 h-1.5 rounded-full ${active.has(d) ? 'bg-accent' : 'bg-line'}`}
          />
        ))}
      </span>
      <span aria-hidden="true">active {count} of 7 days</span>
    </span>
  );
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

  const { summary, upNext, diagnosticNote, resume } = data;
  const startFor = (m: PathModule) =>
    essentialsReader
      ? { route: `/module/${m.id}/micro`, label: 'Start micro →' }
      : { route: surfaceRoute(surface, m.id), label: surfaceStartLabel(surface) };

  const name = me?.displayName ?? null;
  const goals = (me?.prefs?.goals ?? []).map(goalLabel);

  const nextId = upNext[0]?.moduleId ?? null;
  const nextModule = nextId ? data.modules.find((m) => m.id === nextId) : undefined;
  const thenRecs = upNext.slice(1, 3).map((r) => ({ rec: r, m: data.modules.find((mod) => mod.id === r.moduleId) }));
  const openModules = data.modules.filter((m) => m.access === 'open');
  const stateOf = (m: PathModule): RowState =>
    m.completed ? 'done' : m.testedOut ? 'tested' : m.id === nextId ? 'next' : 'todo';

  const allDone = summary.openTotal > 0 && summary.doneCount === summary.openTotal;
  const gapDays = summary.lastActiveAt ? daysSince(summary.lastActiveAt) : 0;
  // A return after a week away is greeted as a return, not scolded as a lapse:
  // the temporal landmark is the hook, and there is no streak here to have lost.
  const returning = !allDone && summary.doneCount > 0 && gapDays >= 7;

  // The one module the page is pointing at, and how it's framed. An unfinished
  // module wins over a recommendation — resuming is cheaper than starting.
  const resumeModule = resume ? data.modules.find((m) => m.id === resume.moduleId) : undefined;
  const heroModule = resumeModule ?? nextModule;
  const heroIsResume = !!resumeModule && !!resume;
  const heroStart = heroModule
    ? heroIsResume
      ? { route: resumeRoute(resume), label: resumeLabel(resume) }
      : startFor(heroModule)
    : null;

  const greeting = allDone
    ? `That's the course${name ? `, ${name}` : ''}.`
    : returning
      ? `Welcome back${name ? `, ${name}` : ''}.`
      : summary.doneCount > 0
        ? `Keep going${name ? `, ${name}` : ''}.`
        : `Choose your first move${name ? `, ${name}` : ''}.`;

  const stats: string[] = [];
  if (summary.minutesInvested > 0) stats.push(`${summary.minutesInvested} min invested`);
  if (summary.checks) stats.push(`${summary.checks.passed} check${summary.checks.passed === 1 ? '' : 's'} passed · ${summary.checks.correct}/${summary.checks.total}`);

  // Courses with open modules render as row sections; the rest are horizon rows.
  const openCourses = data.courses.filter((course) => data.modules.some((m) => m.courseId === course.id));
  const horizonCourses = data.courses.filter((course) => !data.modules.some((m) => m.courseId === course.id));
  const heroCourse = heroModule ? openCourses.find((c) => c.id === heroModule.courseId) : undefined;

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
            {/* What's left, not what fraction is done — a number you can act on. */}
            <span className="font-display font-semibold text-ink-strong text-lg">
              {allDone ? 'Nothing left' : `${fmtMinutes(summary.minutesRemaining)} to finish`}
            </span>
          </div>
          {summary.testedOutCount > 0 && (
            <p className="text-[0.8rem] text-accent font-semibold mt-1.5">
              Head start: {summary.testedOutCount} of those you tested out of on the diagnostic — you never had to sit through them.
            </p>
          )}
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
          {(stats.length > 0 || summary.activeDays.length > 0) && (
            <div className="flex gap-x-5 gap-y-1.5 flex-wrap items-center mt-3.5 pt-3.5 border-t border-line font-utility text-[0.66rem] uppercase tracking-wider text-muted">
              {stats.map((s) => <span key={s}>{s}</span>)}
              {summary.activeDays.length > 0 && <WeekStrip activeDays={summary.activeDays} />}
              <Link to="/record" className="text-accent font-semibold no-underline hover:underline ml-auto">Your record →</Link>
            </div>
          )}
        </div>

        {/* Misses come back. Retrieving something you got wrong is where the
            learning happens, so the queue is raised here rather than waiting
            to be discovered on the record page. */}
        {summary.reviewDue > 0 && (
          <Link
            to="/record"
            className="mt-3 flex items-baseline gap-2 flex-wrap border border-accent rounded-brand bg-accent/[0.06] px-4 py-3 no-underline hover:brightness-105"
          >
            <span className="font-display font-semibold text-[0.92rem] text-ink-strong">
              {summary.reviewDue} question{summary.reviewDue === 1 ? '' : 's'} worth a second look
            </span>
            <span className="text-[0.85rem] text-muted">
              You missed {summary.reviewDue === 1 ? 'it' : 'them'} earlier — retakes are free.
            </span>
            <span className="text-accent font-semibold text-[0.85rem] ml-auto">Review →</span>
          </Link>
        )}

        {/* Testing out is the strongest anti-drudgery move on offer, and it was
            buried in a row subtitle. Anyone who hasn't taken the diagnostic is
            told plainly that it can shorten the course. */}
        {!allDone && !me?.progress.diagnosticDone && (
          <p className="mt-3 text-[0.9rem] text-ink">
            <span className="font-semibold text-ink-strong">Already know some of this?</span>{' '}
            The 5-minute diagnostic can test you out of modules you don't need — cleared without sitting through them.{' '}
            <Link to="/diagnostic" className="text-accent font-semibold no-underline hover:underline">Take the diagnostic →</Link>
          </p>
        )}

        {/* The course, finished. Said plainly and once — the moment is the reward. */}
        {allDone && (
          <div className="mt-8 border border-accent rounded-brand bg-accent/[0.06] p-6">
            <p className="label-utility text-accent">Course complete</p>
            <h2 className="font-display font-bold text-ink-strong text-2xl mt-2 tracking-tight">
              You cleared every open module.
            </h2>
            <p className="text-[0.95rem] text-ink mt-2 max-w-2xl">
              {summary.doneCount} of {summary.openTotal} modules
              {summary.minutesInvested > 0 ? `, ${summary.minutesInvested} minutes of real work` : ''}
              {summary.checks ? `, ${summary.checks.correct}/${summary.checks.total} on the knowledge checks` : ''}. Everything
              stays open — revisit any module any time, and the tutor keeps your history.
            </p>
          </div>
        )}

        {/* One move. The alternates exist, but they don't compete for the click. */}
        {!allDone && heroModule && heroStart && (
          <div className="mt-8">
            <p className="label-utility">{heroIsResume ? 'Pick up where you left off' : 'Up next for you'}</p>
            <div className="mt-3 grid gap-3 lg:grid-cols-[1.7fr_1fr]">
              <div className="border border-accent rounded-brand bg-accent/[0.04] p-6 flex flex-col">
                <span className="font-utility text-[0.66rem] uppercase tracking-wider text-accent">
                  {heroCourse ? `${shortTitle(heroCourse)} · ` : ''}Module {heroModule.ordinal} · ~{heroModule.estMinutes} min
                  {heroIsResume && resume ? ` · last open ${fmtDate(resume.at)}` : ''}
                </span>
                <h2 className="font-display font-bold text-ink-strong text-2xl mt-2 tracking-tight">{heroModule.title}</h2>
                <p className="text-[0.92rem] text-ink mt-2 flex-1">{heroModule.blurb}</p>
                {!heroIsResume && upNext[0]?.reasons.length > 0 && (
                  <div className="flex gap-1.5 flex-wrap mt-3">
                    {upNext[0].reasons.slice(0, 3).map((r) => (
                      <span key={r} className="font-utility text-[0.62rem] border border-accent text-accent rounded-full px-2.5 py-0.5 bg-surface">{r}</span>
                    ))}
                  </div>
                )}
                <div className="mt-4">
                  <Link
                    to={heroStart.route}
                    className="inline-flex items-center px-5 py-2.5 font-display font-semibold text-[0.95rem] rounded-brand bg-accent text-on-accent hover:brightness-110 no-underline"
                  >
                    {heroStart.label}
                    <span className="font-utility text-[0.7rem] font-normal opacity-80 ml-2">
                      {heroIsResume ? `~${heroModule.estMinutes} min left` : `~${heroModule.estMinutes} min`}
                    </span>
                  </Link>
                </div>
                <details className="mt-3 group">
                  <summary className="text-muted text-[0.8rem] font-semibold cursor-pointer list-none hover:text-ink-strong">
                    Other ways in <span className="group-open:hidden">▸</span><span className="hidden group-open:inline">▾</span>
                  </summary>
                  <div className="flex items-center gap-4 flex-wrap mt-2.5">
                    <Link to={`/module/${heroModule.id}`} className="text-accent font-semibold text-sm no-underline hover:underline">
                      Read it · ~{heroModule.estMinutes} min
                    </Link>
                    <Link to={`/module/${heroModule.id}/micro`} className="text-accent font-semibold text-sm no-underline hover:underline">
                      Micro dose · {heroModule.microMinutes} min
                    </Link>
                    <Link to={`/module/${heroModule.id}/chat`} className="text-accent font-semibold text-sm no-underline hover:underline">
                      Talk it through
                    </Link>
                    <Link to={`/module/${heroModule.id}/podcast`} className="text-accent font-semibold text-sm no-underline hover:underline">
                      Listen
                    </Link>
                  </div>
                </details>
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
