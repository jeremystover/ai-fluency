import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { ManagerResponse, ModuleCard, TeamMember } from '../../shared/types';
import { Screen, ErrorNote, Button } from '../components/ui';
import { api, ApiError } from '../api';

// The manager view. It exists because the census already says who reports to
// whom — there is no invite, no second credential, and no way to see anyone the
// roster doesn't put under you.
//
// What it deliberately does not show: diagnostic self-ratings, calibration,
// tutor transcripts, and which questions anyone got wrong. This course asks
// people to say out loud what they don't understand, and that bargain does not
// survive their manager reading the answer. Progress and finished work only —
// and the work only when the learner switched it on themselves.

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

const STATUS_LABEL: Record<TeamMember['status'], string> = {
  not_started: 'Not started',
  started: 'Started',
  in_progress: 'In progress',
  complete: 'Finished',
};

function MemberCard({
  m,
  modules,
  onAct,
  busy,
}: {
  m: TeamMember;
  modules: ModuleCard[];
  onAct: (employeeId: string, kind: 'kudos' | 'endorse' | 'deadline', body: string, extra: { moduleId?: string; dueDate?: string }) => Promise<void>;
  busy: boolean;
}) {
  const [open, setOpen] = useState<null | 'kudos' | 'endorse' | 'deadline'>(null);
  const [text, setText] = useState('');
  const [moduleId, setModuleId] = useState(modules[0]?.id ?? '');
  const [dueDate, setDueDate] = useState('');

  const submit = async () => {
    if (!open || !text.trim()) return;
    await onAct(m.employeeId, open, text.trim(), { moduleId, dueDate });
    setText('');
    setOpen(null);
  };

  return (
    <div className="border border-line rounded-brand bg-surface p-5">
      <div className="flex items-baseline justify-between gap-3 flex-wrap">
        <span>
          <span className="font-display font-bold text-ink-strong text-[1.05rem]">{m.name}</span>
          {m.roleTitle && <span className="text-[0.8rem] text-muted ml-2">{m.roleTitle}</span>}
        </span>
        <span className="font-utility text-[0.62rem] uppercase tracking-wider text-muted">
          {STATUS_LABEL[m.status]} · {m.modulesCleared}/{m.modulesTotal}
          {m.lastSeenAt && ` · last active ${fmtDate(m.lastSeenAt)}`}
        </span>
      </div>

      <span className="flex gap-1 mt-3" aria-hidden="true">
        {Array.from({ length: m.modulesTotal }, (_, i) => (
          <span key={i} className={`flex-1 h-1.5 rounded ${i < m.modulesCleared ? 'bg-accent' : 'bg-line'}`} />
        ))}
      </span>

      {m.commitment && (
        <p className="text-[0.85rem] text-ink mt-3">
          <span className="font-semibold text-ink-strong">Aiming to finish by {fmtDate(m.commitment.targetDate)}.</span>
          {m.commitment.note && <span className="text-muted"> "{m.commitment.note}"</span>}
          {!m.commitment.acknowledgedAt && <span className="text-accent font-semibold"> — not yet acknowledged.</span>}
        </p>
      )}

      {m.askAbout && (
        <div className="mt-3 border-l-2 border-accent pl-3.5 py-1">
          <span className="label-utility">For your next 1:1 · after {m.askAbout.moduleTitle}</span>
          <p className="text-[0.88rem] text-ink-strong mt-1">{m.askAbout.question}</p>
        </div>
      )}

      {m.work && m.work.length > 0 && (
        <div className="mt-3">
          <span className="label-utility">Their graded work · shared by them</span>
          {m.work.map((w) => (
            <p key={w.submissionId} className="text-[0.84rem] text-ink mt-1">
              <span className="font-semibold text-ink-strong">{w.moduleTitle}</span>
              {w.score !== null && <span className="text-muted"> · {w.score}</span>}
              {w.summary && <span className="text-muted"> — {w.summary}</span>}
            </p>
          ))}
        </div>
      )}
      {!m.sharesWork && m.status !== 'not_started' && (
        <p className="text-[0.76rem] text-muted mt-3">
          Their graded work stays private unless they choose to share it. Progress above is always visible to you.
        </p>
      )}

      <div className="flex gap-2 flex-wrap mt-4">
        {(['kudos', 'endorse', 'deadline'] as const).map((k) => (
          <button
            key={k}
            onClick={() => setOpen(open === k ? null : k)}
            className={`font-display font-semibold text-[0.78rem] px-3 py-1.5 rounded-brand border ${open === k ? 'border-accent text-accent bg-accent/[0.06]' : 'border-line-strong text-ink-strong hover:border-ink-strong'}`}
          >
            {k === 'kudos' ? 'Send recognition' : k === 'endorse' ? 'Flag a module' : 'Set a date'}
          </button>
        ))}
      </div>

      {open && (
        <div className="mt-3 flex flex-col gap-2">
          {open === 'endorse' && (
            <select
              value={moduleId}
              onChange={(e) => setModuleId(e.target.value)}
              className="border border-line-strong rounded-brand px-3 py-2 text-[0.88rem] bg-surface text-ink-strong"
            >
              {modules.map((mod) => <option key={mod.id} value={mod.id}>{mod.title}</option>)}
            </select>
          )}
          {open === 'deadline' && (
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="border border-line-strong rounded-brand px-3 py-2 text-[0.88rem] bg-surface text-ink-strong"
            />
          )}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            placeholder={
              open === 'kudos'
                ? 'What they did, specifically. Vague praise reads as automated.'
                : open === 'endorse'
                  ? 'Why this module, for them, now.'
                  : 'The real reason for the date — a launch, a planning cycle, a customer.'
            }
            className="border border-line-strong rounded-brand px-3 py-2 text-[0.88rem] bg-surface text-ink-strong"
          />
          <div>
            <Button onClick={submit} disabled={busy || !text.trim() || (open === 'deadline' && !dueDate)}>
              {busy ? 'Sending…' : 'Send'}
            </Button>
          </div>
        </div>
      )}

      {m.recentActions.length > 0 && (
        <p className="text-[0.74rem] text-muted mt-3">
          You sent: {m.recentActions.map((a) => `${a.kind} ${fmtDate(a.createdAt)}`).join(' · ')}
        </p>
      )}
    </div>
  );
}

export default function Team() {
  const [data, setData] = useState<ManagerResponse | null>(null);
  const [modules, setModules] = useState<ModuleCard[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [guidance, setGuidance] = useState('');
  const [guidanceSaved, setGuidanceSaved] = useState(false);

  const load = () =>
    api
      .get<ManagerResponse>('/api/manager')
      .then((d) => {
        setData(d);
        setGuidance(d.teamGuidance ?? '');
      })
      .catch((e) => setError(e instanceof ApiError ? e.message : 'Could not load your team. Reload to try again.'));

  useEffect(() => {
    load();
    api
      .get<{ modules: ModuleCard[] }>('/api/path')
      .then((d) => setModules((d.modules ?? []).filter((m) => m.status === 'open')))
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const act = async (
    employeeId: string,
    kind: 'kudos' | 'endorse' | 'deadline',
    body: string,
    extra: { moduleId?: string; dueDate?: string },
  ) => {
    setBusy(true);
    try {
      await api.post('/api/manager/action', { employeeId, kind, body, ...extra });
      await load();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'That did not send.');
    } finally {
      setBusy(false);
    }
  };

  const ack = async (id: string) => {
    setBusy(true);
    try {
      await api.post(`/api/manager/commitment/${id}/ack`, { note: "I'll protect the time." });
      await load();
    } finally {
      setBusy(false);
    }
  };

  const saveGuidance = async () => {
    setBusy(true);
    try {
      await api.post('/api/manager/guidance', { body: guidance });
      setGuidanceSaved(true);
    } finally {
      setBusy(false);
    }
  };

  if (error) return <Screen><div className="pt-20"><ErrorNote message={error} /></div></Screen>;
  if (!data) return <Screen><div className="pt-24 text-center"><p className="label-utility">Opening your team…</p></div></Screen>;

  if (!data.isManager) {
    return (
      <Screen>
        <div className="pt-20 max-w-lg">
          <p className="label-utility">Team</p>
          <h1 className="font-display font-bold text-ink-strong text-3xl mt-3">No reports on the roster</h1>
          <p className="text-ink mt-3">
            This view appears for anyone the company roster lists as a manager. If that should be you, the roster's manager
            email column is what decides it — your admin can correct it.
          </p>
          <Link to="/path" className="inline-block mt-6 text-accent font-semibold no-underline hover:underline">Back to your path →</Link>
        </div>
      </Screen>
    );
  }

  const unacked = data.team.filter((m) => m.commitment && !m.commitment.acknowledgedAt);

  return (
    <Screen wide>
      <div className="pt-10 sm:pt-14">
        <p className="label-utility">Your team</p>
        <h1 className="font-display font-bold text-ink-strong text-3xl sm:text-4xl mt-3 tracking-tight">
          {data.team.length} {data.team.length === 1 ? 'person' : 'people'} reporting to you
        </h1>
        <p className="text-muted mt-2 max-w-2xl text-[0.95rem]">
          Progress and finished work. You won't see anyone's diagnostic self-rating, their tutor conversations, or which
          questions they got wrong — this course only works if people can admit what they don't know.{' '}
          <Link to="/path" className="text-accent font-semibold no-underline hover:underline">Your own path →</Link>
        </p>

        {/* Leader-goes-first, stated rather than implied. */}
        {data.selfTotal > 0 && (
          <div className={`mt-6 border rounded-brand px-5 py-4 ${data.selfCleared === 0 ? 'border-accent bg-accent/[0.06]' : 'border-line bg-surface'}`}>
            <span className="font-display font-semibold text-[0.95rem] text-ink-strong">
              {data.selfCleared === 0
                ? "You haven't started the course yourself."
                : `You've cleared ${data.selfCleared} of ${data.selfTotal} modules.`}
            </span>
            <span className="text-[0.88rem] text-muted ml-2">
              {data.selfCleared === 0
                ? 'Teams follow managers who went first — it is the strongest single predictor of whether yours finishes.'
                : 'Your team can see that you have.'}
            </span>
          </div>
        )}

        {unacked.length > 0 && (
          <section className="mt-8">
            <p className="label-utility">Waiting on you · {unacked.length}</p>
            <div className="mt-3 flex flex-col gap-2">
              {unacked.map((m) => (
                <div key={m.employeeId} className="border border-accent rounded-brand bg-accent/[0.06] px-5 py-3.5 flex items-baseline justify-between gap-3 flex-wrap">
                  <span className="text-[0.92rem] text-ink-strong">
                    <span className="font-semibold">{m.name}</span> committed to finishing by {fmtDate(m.commitment!.targetDate)}.
                  </span>
                  <button
                    onClick={() => ack(m.commitment!.id)}
                    disabled={busy}
                    className="font-display font-semibold text-[0.8rem] px-3.5 py-1.5 rounded-brand bg-accent text-on-accent hover:brightness-110 disabled:opacity-40"
                  >
                    Acknowledge and protect the time
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.aggregate && (
          <section className="mt-8">
            <p className="label-utility">The team, in aggregate</p>
            <div className="mt-3 border border-ink-strong rounded-[10px] bg-surface px-5 sm:px-6 py-5">
              <span className="font-display font-bold text-ink-strong text-2xl tracking-tight">
                {data.aggregate.started} of {data.aggregate.size}
                <span className="font-semibold text-muted text-base ml-2 tracking-normal">have started</span>
              </span>
              <span className="font-utility text-[0.66rem] uppercase tracking-wider text-muted ml-4">
                company-wide: {data.aggregate.orgStarted} of {data.aggregate.orgSize}
              </span>
              {data.aggregate.weakSpots && data.aggregate.weakSpots.length > 0 && (
                <div className="mt-4 pt-4 border-t border-line">
                  <p className="label-utility">Worth ten minutes in a team meeting</p>
                  <p className="text-[0.8rem] text-muted mt-1">
                    Questions more than one person got wrong. Counts only — never who.
                  </p>
                  {data.aggregate.weakSpots.map((w) => (
                    <p key={w.prompt} className="text-[0.88rem] text-ink mt-2">
                      <span className="font-utility text-[0.62rem] uppercase tracking-wider text-muted">{w.moduleTitle} · missed by {w.missedBy}</span>
                      <br />
                      {w.prompt}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        <section className="mt-8">
          <p className="label-utility">Person by person</p>
          <div className="mt-3 grid gap-3 lg:grid-cols-2">
            {data.team.map((m) => (
              <MemberCard key={m.employeeId} m={m} modules={modules} onAct={act} busy={busy} />
            ))}
          </div>
        </section>

        {/* Team context steers the tutor for this team's learners specifically. */}
        <section className="mt-9">
          <p className="label-utility">What your team is actually trying to do</p>
          <p className="text-[0.9rem] text-ink mt-1.5 max-w-2xl">
            This rides into the tutor alongside the course content for everyone reporting to you — so their tutor knows what
            your team is working on, and can fit examples to it. It complements the material; it never replaces it.
          </p>
          <textarea
            value={guidance}
            onChange={(e) => {
              setGuidance(e.target.value);
              setGuidanceSaved(false);
            }}
            rows={4}
            placeholder="e.g. We're moving support triage onto AI this quarter. Bias examples toward customer conversations and anything touching PII."
            className="mt-3 w-full border border-line-strong rounded-brand px-3.5 py-2.5 text-[0.9rem] bg-surface text-ink-strong"
          />
          <div className="flex items-center gap-3 mt-2">
            <Button onClick={saveGuidance} disabled={busy} variant="quiet">Save</Button>
            {guidanceSaved && <span className="text-[0.82rem] text-accent font-semibold">Saved — live for your team's next session.</span>}
          </div>
        </section>
      </div>
    </Screen>
  );
}
