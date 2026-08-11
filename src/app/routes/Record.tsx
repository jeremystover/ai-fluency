import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Badge, MasteryStage, ModuleMastery, RecordResponse, ReviewItem } from '../../shared/types';
import { Screen, ErrorNote } from '../components/ui';
import { api, ApiError } from '../api';

// What the learner has actually demonstrated — the counterweight to the path
// screen's "what's left". Nothing here is a point total or a level: every row
// names a specific recorded act, and the evidence line is the real score or
// the grader's own words. A record, not a scoreboard.

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

const STAGES: { id: MasteryStage; label: string; earns: string }[] = [
  { id: 'read', label: 'Read', earns: 'opened the module' },
  { id: 'checked', label: 'Checked', earns: 'passed the knowledge check' },
  { id: 'applied', label: 'Applied', earns: 'graded work on a real task' },
  { id: 'taught', label: 'Taught', earns: 'explained it back in your own words' },
];

const stageIndex = (s: MasteryStage) => STAGES.findIndex((x) => x.id === s);

// Four segments, filled to the highest stage earned. The ladder is the point:
// reading is not knowing, and knowing is not applying.
function MasteryMeter({ stage }: { stage: MasteryStage }) {
  const reached = stageIndex(stage);
  return (
    <span className="flex gap-1" role="img" aria-label={stage === 'untouched' ? 'Not started' : `Reached: ${STAGES[reached].label}`}>
      {STAGES.map((s, i) => (
        <span key={s.id} title={`${s.label} — ${s.earns}`} className={`w-6 h-1.5 rounded ${i <= reached ? 'bg-accent' : 'bg-line'}`} />
      ))}
    </span>
  );
}

function MasteryRow({ m }: { m: ModuleMastery }) {
  const reached = stageIndex(m.stage);
  const evidence: string[] = [];
  if (m.bestCheck) evidence.push(`check ${m.bestCheck.correct}/${m.bestCheck.total}`);
  if (m.activityScore !== null) evidence.push(`activity ${m.activityScore}`);
  if (m.teachBackScore !== null) evidence.push(`teach-back ${m.teachBackScore}/15`);
  if (m.completedAt) evidence.push(`completed ${fmtDate(m.completedAt)}`);
  return (
    <div className="flex items-center gap-4 px-4 sm:px-5 py-3 border-b border-line last:border-b-0">
      <div className="flex-1 min-w-0">
        <Link to={`/module/${m.moduleId}`} className="block font-display font-semibold text-[0.92rem] text-ink-strong no-underline hover:text-accent">
          {m.title}
        </Link>
        <span className="block text-[0.74rem] text-muted">
          {m.stage === 'untouched' ? 'Not started' : `${STAGES[reached].label} — ${STAGES[reached].earns}`}
          {evidence.length > 0 && ` · ${evidence.join(' · ')}`}
        </span>
      </div>
      <MasteryMeter stage={m.stage} />
    </div>
  );
}

function ReviewRow({ item }: { item: ReviewItem }) {
  return (
    <div className={`px-4 sm:px-5 py-3 border-b border-line last:border-b-0 ${item.due ? 'bg-signal/10' : ''}`}>
      <div className="flex items-baseline justify-between gap-3 flex-wrap">
        <span className="font-utility text-[0.62rem] uppercase tracking-wider text-muted">
          {item.moduleTitle}
          {item.misses > 1 && <span className="text-accent font-semibold"> · missed {item.misses}×</span>}
        </span>
        <span className="font-utility text-[0.62rem] uppercase tracking-wider text-muted">
          {item.due ? <span className="text-accent font-semibold">Due now</span> : `Back on ${fmtDate(item.dueAt)}`}
        </span>
      </div>
      <p className="text-[0.9rem] text-ink-strong mt-1">{item.prompt}</p>
      <Link to={`/module/${item.moduleId}/check`} className="inline-block mt-1.5 text-accent font-semibold text-[0.8rem] no-underline hover:underline">
        Retake the check →
      </Link>
    </div>
  );
}

function BadgeChip({ b }: { b: Badge }) {
  const earned = !!b.earnedAt;
  return (
    <div
      title={b.detail}
      className={`border rounded-brand px-4 py-3 ${earned ? 'border-accent bg-accent/[0.05]' : 'border-dashed border-line-strong'}`}
    >
      <span className={`block font-display font-semibold text-[0.9rem] ${earned ? 'text-ink-strong' : 'text-muted'}`}>{b.label}</span>
      <span className="block text-[0.74rem] text-muted mt-0.5">{earned ? fmtDate(b.earnedAt!) : b.detail}</span>
    </div>
  );
}

export default function Record() {
  const [data, setData] = useState<RecordResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<RecordResponse>('/api/record')
      .then(setData)
      .catch((e) => setError(e instanceof ApiError ? e.message : 'Could not load your record. Reload to try again.'));
  }, []);

  if (error) return <Screen><div className="pt-20"><ErrorNote message={error} /></div></Screen>;
  if (!data) return <Screen><div className="pt-24 text-center"><p className="label-utility">Opening your record…</p></div></Screen>;

  const { mastery, review, calibration, badges, credentials, skills } = data;
  const due = review.filter((r) => r.due);
  const upcoming = review.filter((r) => !r.due);
  const started = mastery.filter((m) => m.stage !== 'untouched');
  const earnedBadges = badges.filter((b) => b.earnedAt);

  const trendLine =
    calibration.trend === 'sharpening'
      ? 'Your predictions are getting closer to what actually happened.'
      : calibration.trend === 'drifting'
        ? 'Your predictions have been drifting further from the outcomes lately.'
        : calibration.trend === 'steady'
          ? 'Your predictions have held about the same distance from the outcomes.'
          : null;

  return (
    <Screen wide>
      <div className="pt-10 sm:pt-14">
        <p className="label-utility">Your record</p>
        <h1 className="font-display font-bold text-ink-strong text-3xl sm:text-4xl mt-3 tracking-tight">
          {data.name ? `What ${data.name} has demonstrated` : 'What you have demonstrated'}
        </h1>
        <p className="text-muted mt-2 max-w-2xl text-[0.95rem]">
          Every line here is earned by something you actually did — a graded submission, a passed check, an explanation in your
          own words. Nothing on this page can be reached by clicking through.{' '}
          <Link to="/path" className="text-accent font-semibold no-underline hover:underline">Back to your path →</Link>
        </p>

        {/* Due first: the queue is the only part of this page that asks for anything. */}
        {due.length > 0 && (
          <section className="mt-8">
            <p className="label-utility">Worth a second look · {due.length} due</p>
            <p className="text-[0.9rem] text-ink mt-1.5 max-w-2xl">
              Questions you missed, brought back after a gap. Retrieving something you got wrong is where the learning actually
              happens — retakes are free and always have been.
            </p>
            <div className="mt-3 border border-accent rounded-brand bg-surface overflow-hidden">
              {due.map((r) => <ReviewRow key={`${r.moduleId}:${r.questionId}`} item={r} />)}
            </div>
          </section>
        )}

        {/* The credential */}
        {credentials.length > 0 && (
          <section className="mt-9">
            <p className="label-utility">Credential</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {credentials.map((cr) => (
                <div
                  key={cr.courseId}
                  className={`border rounded-brand p-5 ${cr.earned ? 'border-ink-strong bg-surface' : 'border-dashed border-line-strong'}`}
                >
                  <span className="font-display font-bold text-ink-strong text-[1.05rem]">{cr.courseTitle}</span>
                  {cr.earned ? (
                    <>
                      <p className="text-[0.85rem] text-ink mt-1.5">
                        Completed {cr.issuedAt ? fmtDate(cr.issuedAt) : ''} · all {cr.total} modules cleared.
                      </p>
                      {cr.contentHashes.length > 0 && (
                        <p className="text-[0.72rem] text-muted mt-2 leading-relaxed">
                          Attested against {cr.contentHashes.length} content version
                          {cr.contentHashes.length === 1 ? '' : 's'} —{' '}
                          <span className="font-utility">{cr.contentHashes.map((h) => h.slice(0, 8)).join(' · ')}</span>. The course
                          changes over time; this names exactly what you completed.
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-[0.85rem] text-muted mt-1.5">
                      {cr.cleared} of {cr.total} modules cleared — the credential issues when the course is complete.
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* The mastery ladder */}
        <section className="mt-9">
          <div className="flex items-baseline justify-between gap-3 flex-wrap">
            <p className="label-utility">Module by module</p>
            <span className="font-utility text-[0.62rem] uppercase tracking-wider text-muted">
              {STAGES.map((s) => s.label).join(' → ')}
            </span>
          </div>
          {started.length === 0 ? (
            <p className="text-[0.9rem] text-muted mt-3">
              Nothing recorded yet.{' '}
              <Link to="/path" className="text-accent font-semibold no-underline hover:underline">Start a module →</Link>
            </p>
          ) : (
            <div className="mt-3 border border-line rounded-brand bg-surface overflow-hidden">
              {mastery.map((m) => <MasteryRow key={m.moduleId} m={m} />)}
            </div>
          )}
        </section>

        {/* What the graded work says */}
        {skills.length > 0 && (
          <section className="mt-9">
            <p className="label-utility">Backed by graded work</p>
            <div className="mt-3 flex flex-col gap-2.5">
              {skills.map((s) => (
                <div key={s.claim} className="border-l-2 border-accent pl-4 py-1">
                  <span className="block font-display font-semibold text-[0.92rem] text-ink-strong">{s.claim}</span>
                  <span className="block text-[0.82rem] text-muted mt-0.5">{s.evidence}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Calibration — the thread no leaderboard can copy */}
        {(calibration.diagnostic || calibration.points.length > 0 || calibration.sorts.length > 0) && (
          <section className="mt-9">
            <p className="label-utility">Your calibration</p>
            <div className="mt-3 border border-line rounded-brand bg-surface p-5">
              {calibration.diagnostic && (
                <p className="text-[0.92rem] text-ink">
                  Your diagnostic put you an average of{' '}
                  <span className="font-semibold text-ink-strong">{calibration.diagnostic.meanAbsDelta} points</span> away from
                  what these tools can actually do
                  {calibration.diagnostic.direction === 'over'
                    ? ', usually expecting too much'
                    : calibration.diagnostic.direction === 'under'
                      ? ', usually expecting too little'
                      : calibration.diagnostic.direction === 'mixed'
                        ? ', swinging both ways'
                        : ' — well calibrated'}
                  .
                </p>
              )}
              {trendLine && <p className="text-[0.92rem] text-ink-strong font-semibold mt-2">{trendLine}</p>}
              {calibration.points.length > 0 && (
                <div className="mt-4 flex flex-col gap-1.5">
                  {calibration.points.map((p) => (
                    <div key={`${p.moduleId}:${p.label}`} className="flex items-baseline justify-between gap-3 text-[0.82rem] border-t border-line pt-1.5 first-of-type:border-t-0 first-of-type:pt-0">
                      <span className="text-ink">{p.label}</span>
                      <span className="font-utility text-muted whitespace-nowrap">
                        predicted {p.predicted}
                        {p.actual === null ? ' · still open' : ` · actual ${p.actual} · off by ${Math.abs(p.delta ?? 0)}`}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-[0.74rem] text-muted mt-3">
                Calibration is graded on honesty and specificity, never on being right.
              </p>
            </div>
          </section>
        )}

        {/* Badges last — they're the least of it */}
        <section className="mt-9">
          <p className="label-utility">Milestones · {earnedBadges.length} of {badges.length}</p>
          <div className="mt-3 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {badges.map((b) => <BadgeChip key={b.id} b={b} />)}
          </div>
        </section>

        {upcoming.length > 0 && (
          <section className="mt-9">
            <p className="label-utility">Coming back later · {upcoming.length}</p>
            <div className="mt-3 border border-line rounded-brand bg-surface overflow-hidden opacity-80">
              {upcoming.map((r) => <ReviewRow key={`${r.moduleId}:${r.questionId}`} item={r} />)}
            </div>
          </section>
        )}
      </div>
    </Screen>
  );
}
