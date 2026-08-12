import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { LibraryCourse, LibraryModule, LibraryResponse, PathResume } from '../../shared/types';
import { resumeLabel, resumeRoute } from '../resume';
import { Screen, ErrorNote } from '../components/ui';
import { api, ApiError } from '../api';
import { useApp } from '../brand';
import { preferredSurface, surfaceRoute } from '../modality';
import { depthOf } from '../../shared/depth';

// The library: the wall of everything. Maximal on purpose — every module a
// full card carrying its real syllabus, locked shelves at equal richness —
// because the path, one click away, owns calm and direction. This page owns
// the territory.

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

const fmtHours = (min: number) => {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h}h ${m.toString().padStart(2, '0')}m` : `${h}h`;
};

function Glyph({ name }: { name: string }) {
  const paths: Record<string, string> = {
    read: 'M2 2h10v10H2zM4.5 5h5M4.5 7.5h5',
    listen: 'M2 5v4M5 3v8M8 1v12M11 4v6',
    tutor: 'M1.5 2.5h11v7h-6l-3 3v-3h-2z',
    exercise: 'M2 3h4v4H2zM8 7h4v4H8zM8 3h4M2 9h4',
    lab: 'M7 1l1.8 3.9L13 5.4l-3 3 .7 4.2L7 10.5l-3.7 2 .7-4.2-3-3 4.2-.5z',
    graded: 'M2 7l3.5 3.5L12 4',
  };
  return (
    <svg width="11" height="11" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d={paths[name] ?? paths.read} />
    </svg>
  );
}

function ModuleAtlasCard({
  m,
  isNext,
  startRoute,
  resume,
}: {
  m: LibraryModule;
  isNext: boolean;
  startRoute: string;
  resume: PathResume | null;
}) {
  const open = m.status === 'open';
  const done = m.completed || m.testedOut;
  // The open loop outranks the recommendation, same as the path's hero:
  // picking a half-finished module back up beats starting the suggested one.
  const isResume = !!resume && resume.moduleId === m.id;
  const glyphs = [
    m.ways.read && 'read',
    m.ways.listen && 'listen',
    m.ways.tutor && 'tutor',
    m.ways.exercise && 'exercise',
    m.ways.lab && 'lab',
    m.ways.graded && 'graded',
  ].filter(Boolean) as string[];
  return (
    <div
      className={`relative overflow-hidden flex flex-col border rounded-brand bg-surface px-[18px] pt-4 pb-3.5 ${
        isResume || isNext ? 'border-accent shadow-[0_0_0_2px_rgba(74,18,240,0.15)]' : done ? 'border-accent/40' : open ? 'border-line' : 'border-dashed border-line-strong'
      }`}
    >
      <span
        aria-hidden="true"
        className="absolute right-1.5 -top-3.5 font-display font-extrabold text-[4.6rem] leading-none text-transparent pointer-events-none select-none"
        style={{ WebkitTextStroke: '1px var(--c-line)' }}
      >
        {m.ordinal.toString().padStart(2, '0')}
      </span>
      <div className="flex items-center justify-between gap-2 relative">
        <span className="label-utility">Module {m.ordinal}</span>
        {done ? (
          <span className="font-utility text-[0.62rem] text-success">
            ✓ {m.completedAt ? fmtDate(m.completedAt) : ''}{m.testedOut ? ' · tested out' : m.bestCheck ? ` · check ${m.bestCheck.correct}/${m.bestCheck.total}` : ''}
          </span>
        ) : isResume && resume ? (
          <span className="font-utility text-[0.58rem] uppercase tracking-wider border border-accent text-accent rounded-full px-2 py-0.5">◐ In progress · {fmtDate(resume.at)}</span>
        ) : isNext ? (
          <span className="tag font-utility text-[0.58rem] uppercase tracking-wider bg-signal text-on-signal rounded-full px-2 py-0.5">★ Up next for you</span>
        ) : !open ? (
          <span className="label-utility">full course</span>
        ) : null}
      </div>
      <h3 className={`font-display font-bold text-[1.05rem] mt-1.5 tracking-tight relative ${open ? 'text-ink-strong' : 'text-ink'}`}>{m.title}</h3>
      <p className={`text-[0.8rem] mt-1 leading-relaxed relative ${open ? 'text-ink' : 'text-muted'}`}>{m.blurb}</p>
      <ul className="mt-2.5 mb-0 pl-3.5 border-l-2 border-line flex-1 relative">
        {open ? (
          <>
            {m.lessons.map((lesson) => (
              <li key={lesson.blockId} className="py-[1.5px]">
                <Link
                  to={`/module/${m.id}#${lesson.blockId}`}
                  className={`text-[0.76rem] leading-snug no-underline hover:underline ${lesson.lab ? 'text-accent' : 'text-ink'}`}
                >
                  {lesson.title}
                  {lesson.lab && <span className="font-utility text-[0.52rem] uppercase tracking-wider"> · lab</span>}
                </Link>
              </li>
            ))}
            {(m.ways.exercise || m.ways.graded || m.ways.check) && (
              <li className="py-[1.5px] text-[0.76rem] font-semibold text-ink-strong">
                <span aria-hidden="true" className="text-signal" style={{ WebkitTextStroke: '0.5px var(--c-ink-strong)' }}>◆ </span>
                {[m.ways.exercise && 'Live exercise', m.ways.graded && 'graded activity', m.ways.check && 'knowledge check'].filter(Boolean).join(' · ')}
              </li>
            )}
          </>
        ) : (
          <li className="py-[1.5px] text-[0.76rem] italic text-muted">Lessons publish with the full course</li>
        )}
      </ul>
      <div className="flex items-center gap-2.5 flex-wrap mt-2.5 pt-2 border-t border-line">
        {glyphs.map((g) => (
          <span key={g} className={`inline-flex items-center gap-1 font-utility text-[0.56rem] uppercase tracking-wide ${open ? 'text-muted [&_svg]:text-accent' : 'text-muted [&_svg]:text-line-strong'}`}>
            <Glyph name={g} />{g === 'graded' ? 'graded' : g}
          </span>
        ))}
      </div>
      <div className="flex items-baseline justify-between gap-2 mt-2">
        <span className="font-utility text-[0.6rem] text-muted">~{m.estMinutes} min{open ? ` · micro ${m.microMinutes} min` : ''}</span>
        {open ? (
          isResume && resume ? (
            <Link to={resumeRoute(resume)} className="text-accent font-bold text-[0.8rem] no-underline hover:underline">{resumeLabel(resume)}</Link>
          ) : isNext ? (
            <Link to={startRoute} className="text-accent font-bold text-[0.8rem] no-underline hover:underline">Start →</Link>
          ) : done ? (
            <span className="flex items-center gap-3">
              {m.reviewDue > 0 && (
                <Link to="/record" className="text-accent font-bold text-[0.8rem] no-underline hover:underline">
                  ↻ Review {m.reviewDue} due
                </Link>
              )}
              <Link to={`/module/${m.id}`} className="text-accent font-semibold text-[0.8rem] no-underline hover:underline">Revisit</Link>
            </span>
          ) : (
            <Link to={startRoute} className="text-accent font-semibold text-[0.8rem] no-underline hover:underline">Start</Link>
          )
        ) : (
          <span className="label-utility">yours whenever</span>
        )}
      </div>
    </div>
  );
}

function Shelf({
  course,
  nextModuleId,
  resume,
  startFor,
}: {
  course: LibraryCourse;
  nextModuleId: string | null;
  resume: PathResume | null;
  startFor: (m: LibraryModule) => string;
}) {
  const open = course.modules.filter((m) => m.status === 'open');
  const cleared = open.filter((m) => m.completed || m.testedOut).length;
  return (
    <section className="mt-10">
      <div className="sticky top-14 z-10 bg-bg pt-2 pb-2 border-b-2 border-ink-strong">
        <div className="flex items-baseline gap-3 flex-wrap">
          <h2 className="font-display font-bold text-ink-strong text-xl m-0">{course.title}</h2>
          <span className="font-utility text-[0.64rem] tracking-wide text-accent border border-accent/35 rounded-full px-2.5">{course.level}</span>
          <span className="ml-auto font-utility text-[0.64rem] text-muted">
            {open.length > 0 ? `${cleared} of ${open.length} cleared` : 'full course'}
            {(course.recommendedFor ?? []).length > 0 && <span className="text-accent font-semibold"> · ★ {(course.recommendedFor ?? []).join(' · ')}</span>}
          </span>
        </div>
        <p className="text-[0.85rem] text-muted mt-0.5 max-w-2xl">{course.blurb}</p>
      </div>
      {course.modules.length > 0 && (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {course.modules.map((m) => (
            <ModuleAtlasCard key={m.id} m={m} isNext={m.id === nextModuleId} resume={resume} startRoute={startFor(m)} />
          ))}
        </div>
      )}
    </section>
  );
}

export default function Library() {
  const { me } = useApp();
  const surface = preferredSurface(me?.prefs?.styles);
  const essentialsReader = surface === 'read' && depthOf(me?.prefs?.depth) === 'essentials';
  const [data, setData] = useState<LibraryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<LibraryResponse>('/api/library')
      .then(setData)
      .catch((e) => setError(e instanceof ApiError ? e.message : 'Could not load the library. Reload to try again.'));
  }, []);

  if (error) return <Screen><div className="pt-20"><ErrorNote message={error} /></div></Screen>;
  if (!data) return <Screen><div className="pt-24 text-center"><p className="label-utility">Opening the library…</p></div></Screen>;

  const startFor = (m: LibraryModule) =>
    essentialsReader ? `/module/${m.id}/micro` : surfaceRoute(surface, m.id);

  const totals: string[] = [
    `${data.totals.courses} courses · L1 → L4`,
    `${data.totals.modules} modules mapped`,
    `${data.totals.lessons} lessons in print`,
    `~${fmtHours(data.totals.minutes)} of material`,
    '5 ways into every module',
  ];
  if (data.clearedCount > 0) totals.push(`${data.clearedCount} cleared by you`);

  return (
    <Screen wide>
      <div className="pt-10 sm:pt-14">
        <p className="label-utility">The library</p>
        <h1 className="font-display font-extrabold text-ink-strong text-4xl sm:text-5xl mt-3 tracking-tight">Everything in here.</h1>
        <p className="text-muted mt-3 max-w-2xl text-[0.98rem]">
          The whole program, mapped — every module, every lesson, every way in, the locked shelves included. For what's next,{' '}
          <Link to="/path" className="text-accent font-semibold no-underline hover:underline">your path</Link> has the answer; this
          page is for seeing the territory.
        </p>
        <div className="flex gap-x-6 gap-y-1.5 flex-wrap mt-4 font-utility text-[0.66rem] uppercase tracking-wider text-muted">
          {totals.map((line) => {
            const [head, ...rest] = line.split(' ');
            return (
              <span key={line}>
                <span className="text-ink-strong">{head}</span> {rest.join(' ')}
              </span>
            );
          })}
          {data.reviewDue > 0 && (
            <Link to="/record" className="text-accent no-underline hover:underline">
              <span className="font-bold">↻ {data.reviewDue}</span> due for review
            </Link>
          )}
        </div>

        {data.courses.map((course) => (
          <Shelf key={course.id} course={course} nextModuleId={data.nextModuleId} resume={data.resume} startFor={startFor} />
        ))}

        <p className="label-utility mt-10">Go in any order — prerequisites are recommendations, not gates.</p>
      </div>
    </Screen>
  );
}
