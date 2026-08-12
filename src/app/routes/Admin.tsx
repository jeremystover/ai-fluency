import { useEffect, useState, type FormEvent } from 'react';
import { Screen, Button, ErrorNote } from '../components/ui';
import { api, ApiError } from '../api';
import { goalLabel } from '../../shared/goals';

// Operator console: the LMS completion log (learners), content management,
// review queue (the async backup for the M8 peer exchange), funnel reporting,
// access-code management, and the completion audit trail. Deliberately
// utilitarian — this is a tool for one company admin, not a learner surface.

type Tab = 'learners' | 'content' | 'brand' | 'census' | 'reminders' | 'queue' | 'report' | 'codes' | 'audit';

const TAB_LABELS: Record<Tab, string> = {
  learners: 'Learners',
  content: 'Content',
  brand: 'Brand',
  census: 'Census',
  reminders: 'Reminders',
  queue: 'Review queue',
  report: 'Reporting',
  codes: 'Access codes',
  audit: 'Content audit',
};

type SubmissionRow = {
  id: string;
  module_id: string;
  created_at: string;
  graded_at: string | null;
  total_score: number | null;
  chars: number;
  display_name: string | null;
  reviews: number;
};

type SubmissionDetail = {
  submission: {
    id: string;
    moduleId: string;
    body: string;
    createdAt: string;
    gradedAt: string | null;
    totalScore: number | null;
    rubric: { dimensions?: { name: string; score: number; comment: string }[]; summary?: string } | null;
    displayName: string | null;
    roleLabel: string | null;
  };
  reviews: { id: string; reviewer: string; body: string; score: number | null; createdAt: string }[];
};

type Report = {
  totals: Record<string, number>;
  funnel: { type: string; events: number; sessions: number }[];
  demand: { goals: { v: string; n: number }[]; styles: { v: string; n: number }[] };
  calibration: { mean_delta: number | null; mean_abs_delta: number | null; n: number };
  devices: { platform: string | null; browser: string | null; pointer: string | null; sessions: number }[];
};

type CodeRow = { id: string; brandSlug: string; label: string; uses: number; maxUses: number | null; active: boolean };

type AuditRow = {
  id: string;
  session_id: string;
  module_id: string;
  activity: string;
  ref_id: string | null;
  content_hash: string;
  created_at: string;
  snapshot_kind: string | null;
  display_name: string | null;
};

type LearnerRow = {
  session_id: string;
  created_at: string;
  last_seen_at: string;
  display_name: string | null;
  role_label: string | null;
  code_label: string | null;
  active_min: number;
  modules_completed: number;
  last_completed_at: string | null;
  quiz_avg_pct: number | null;
  quiz_attempts: number;
  best_activity_score: number | null;
  submissions: number;
  podcast_listens: number;
};

type LearnerDetail = {
  session: { id: string; createdAt: string; lastSeenAt: string };
  participant: { displayName: string | null; roleLabel: string | null; orgLabel: string | null } | null;
  preferences: Record<string, unknown>;
  activeMinutes: number;
  timeline: { type: string; payload_json: string | null; created_at: string }[];
  submissions: { id: string; module_id: string; created_at: string; graded_at: string | null; total_score: number | null; chars: number }[];
  audits: { id: string; module_id: string; activity: string; ref_id: string | null; content_hash: string; created_at: string; snapshot_kind: string | null }[];
};

type ContentModuleRow = {
  id: string;
  course_id: string;
  ordinal: number;
  title: string;
  status: string;
  est_minutes: number;
  blocks: number;
  micro_blocks: number;
  activity_blocks: number;
  exercise_kinds: string | null;
  oldest_reviewed_at: string | null;
  versions_witnessed: number;
};

type ContentBlockRow = {
  id: string;
  moduleId: string;
  ordinal: number;
  kind: string;
  layer: string;
  body: string;
  variant: string | null;
  reviewedAt: string;
};

type BrandConfig = {
  slug: string;
  name: string;
  tokens: Record<string, unknown>;
  voice: Record<string, unknown>;
  profile: { aiTools?: string[] } & Record<string, unknown>;
};

type GuidanceData = {
  guidance: { scope: string; body: string; updatedAt: string }[];
  scopes: { courses: string[]; modules: { id: string; title: string; status: string }[] };
};

type SnapshotDetail = {
  hash: string;
  kind: string;
  moduleId: string;
  firstWitnessedAt: string;
  witnesses: number;
  content: unknown;
};

const fmtDate = (iso: string | null) => (iso ? iso.slice(0, 16).replace('T', ' ') : '—');

function Login({ onDone }: { onDone: () => void }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api.post('/api/admin/login', { code });
      onDone();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Login failed.');
      setBusy(false);
    }
  };
  return (
    <Screen>
      <div className="pt-24 max-w-sm">
        <p className="label-utility">Operator console</p>
        <h1 className="font-display font-bold text-ink-strong text-2xl mt-2">Admin login</h1>
        <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
          <input
            type="password"
            value={code}
            autoFocus
            onChange={(e) => setCode(e.target.value)}
            className="border border-line-strong bg-surface rounded-brand px-4 py-3 font-utility tracking-widest text-ink-strong focus:border-accent"
            aria-label="Admin passcode"
          />
          {error && <ErrorNote message={error} />}
          <Button type="submit" disabled={busy || !code}>{busy ? 'Checking…' : 'Enter'}</Button>
        </form>
      </div>
    </Screen>
  );
}

function Queue() {
  const [rows, setRows] = useState<SubmissionRow[] | null>(null);
  const [detail, setDetail] = useState<SubmissionDetail | null>(null);
  const [review, setReview] = useState('');
  const [score, setScore] = useState('');
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  const load = () => api.get<{ submissions: SubmissionRow[] }>('/api/admin/submissions').then((d) => setRows(d.submissions));
  useEffect(() => {
    load();
  }, []);

  const open = async (id: string) => {
    setNote(null);
    setDetail(await api.get<SubmissionDetail>(`/api/admin/submissions/${id}`));
    setReview('');
    setScore('');
  };

  const send = async () => {
    if (!detail || !review.trim() || busy) return;
    setBusy(true);
    try {
      await api.post(`/api/admin/submissions/${detail.submission.id}/review`, {
        body: review,
        score: score.trim() === '' ? undefined : Number(score),
      });
      setNote('Review sent.');
      await open(detail.submission.id);
      await load();
    } catch (e) {
      setNote(e instanceof ApiError ? e.message : 'Failed to send.');
    } finally {
      setBusy(false);
    }
  };

  if (!rows) return <p className="label-utility mt-8">Loading queue…</p>;
  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left">
              {['When', 'Who', 'Module', 'AI', 'Reviews'].map((h) => (
                <th key={h} className="label-utility font-normal pb-2 pr-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.id}
                onClick={() => open(r.id)}
                className={`border-t border-line cursor-pointer hover:bg-accent/5 ${detail?.submission.id === r.id ? 'bg-accent/10' : ''}`}
              >
                <td className="py-2 pr-3 font-utility text-xs text-muted whitespace-nowrap">{fmtDate(r.created_at)}</td>
                <td className="py-2 pr-3">{r.display_name ?? '—'}</td>
                <td className="py-2 pr-3 font-utility text-xs">{r.module_id}</td>
                <td className="py-2 pr-3 font-utility text-xs">{r.graded_at ? `${r.total_score}/20` : 'ungraded'}</td>
                <td className="py-2 pr-3 font-utility text-xs">{r.reviews > 0 ? `✓ ${r.reviews}` : '—'}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={5} className="py-6 text-muted text-sm">No submissions yet. The queue fills as learners submit activity work.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div>
        {detail ? (
          <div className="border border-line rounded-brand bg-surface p-5">
            <div className="flex items-baseline justify-between gap-3 flex-wrap">
              <h2 className="font-display font-semibold text-ink-strong">
                {detail.submission.displayName ?? 'Anonymous'}{detail.submission.roleLabel ? ` · ${detail.submission.roleLabel}` : ''}
              </h2>
              <span className="font-utility text-xs text-muted">{fmtDate(detail.submission.createdAt)}</span>
            </div>
            <pre className="mt-3 whitespace-pre-wrap text-sm text-ink font-body max-h-72 overflow-y-auto border border-line rounded-brand p-3 bg-bg/50">
              {detail.submission.body}
            </pre>
            {detail.submission.rubric?.dimensions && (
              <div className="mt-3 text-xs text-muted">
                AI grade: {detail.submission.totalScore}/20 · {detail.submission.rubric.dimensions.map((d) => `${d.name.split(' ')[0]} ${d.score}`).join(' · ')}
              </div>
            )}
            {detail.reviews.length > 0 && (
              <div className="mt-4 flex flex-col gap-2">
                <span className="label-utility">Operator reviews</span>
                {detail.reviews.map((r) => (
                  <div key={r.id} className="border-l-2 border-accent pl-3 text-sm text-ink">
                    <p className="whitespace-pre-wrap">{r.body}</p>
                    <p className="font-utility text-[0.65rem] text-muted mt-1">{r.score !== null ? `${r.score}/20 · ` : ''}{fmtDate(r.createdAt)}</p>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4 border-t border-line pt-4">
              <span className="label-utility">Add operator review</span>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows={5}
                placeholder="Could I start? Where did I stall? What did the doc assume I knew?"
                className="mt-2 w-full border border-line-strong bg-surface rounded-brand px-3 py-2 text-sm text-ink focus:border-accent placeholder:text-muted/60"
              />
              <div className="mt-2 flex items-center gap-3">
                <input
                  type="number"
                  min={0}
                  max={20}
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  placeholder="/20"
                  className="border border-line-strong bg-surface rounded-brand px-3 py-2 w-20 font-utility text-sm focus:border-accent placeholder:text-muted/60"
                  aria-label="Score out of 20 (optional)"
                />
                <Button onClick={send} disabled={busy || !review.trim()}>{busy ? 'Sending…' : 'Send review'}</Button>
                {note && <span className="text-xs text-muted">{note}</span>}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-muted text-sm mt-2">Select a submission to read it and add an operator review.</p>
        )}
      </div>
    </div>
  );
}

function Reporting() {
  const [report, setReport] = useState<Report | null>(null);
  useEffect(() => {
    api.get<Report>('/api/admin/report').then(setReport);
  }, []);
  if (!report) return <p className="label-utility mt-8">Loading report…</p>;
  const t = report.totals;
  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-2">
      <div>
        <span className="label-utility">Totals</span>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {Object.entries(t).map(([k, v]) => (
            <div key={k} className="border border-line rounded-brand bg-surface p-3">
              <p className="font-utility text-2xl text-ink-strong">{v}</p>
              <p className="label-utility mt-1">{k}</p>
            </div>
          ))}
        </div>
        <span className="label-utility block mt-6">Calibration (diagnostic)</span>
        <p className="text-sm text-ink mt-1">
          {report.calibration.n} predictions · mean delta {report.calibration.mean_delta ?? '—'} · mean |delta| {report.calibration.mean_abs_delta ?? '—'}
        </p>
        <span className="label-utility block mt-6">Demand signals</span>
        <div className="mt-2 text-sm text-ink flex flex-col gap-1">
          {report.demand.goals.map((g) => (
            <div key={g.v} className="flex justify-between border-b border-line py-1">
              <span>{goalLabel(g.v)}</span>
              <span className="font-utility text-xs">{g.n}</span>
            </div>
          ))}
          {report.demand.styles.map((s) => (
            <div key={s.v} className="flex justify-between border-b border-line py-1">
              <span className="text-muted">style · {s.v}</span>
              <span className="font-utility text-xs">{s.n}</span>
            </div>
          ))}
        </div>
        {report.devices.length > 0 && (
          <>
            <span className="label-utility block mt-6">Devices</span>
            <div className="mt-2 text-sm text-ink flex flex-col gap-1">
              {report.devices.map((d, i) => (
                <div key={i} className="flex justify-between border-b border-line py-1">
                  <span>
                    {d.platform ?? '?'} · {d.browser ?? '?'} · {d.pointer === 'coarse' ? 'touch' : 'mouse'}
                  </span>
                  <span className="font-utility text-xs">{d.sessions}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <div>
        <span className="label-utility">Funnel</span>
        <table className="w-full text-sm mt-2">
          <thead>
            <tr className="text-left">
              <th className="label-utility font-normal pb-2">Event</th>
              <th className="label-utility font-normal pb-2 text-right">Events</th>
              <th className="label-utility font-normal pb-2 text-right">Sessions</th>
            </tr>
          </thead>
          <tbody>
            {report.funnel.map((f) => (
              <tr key={f.type} className="border-t border-line">
                <td className="py-1.5 font-utility text-xs">{f.type}</td>
                <td className="py-1.5 text-right font-utility text-xs">{f.events}</td>
                <td className="py-1.5 text-right font-utility text-xs">{f.sessions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Codes() {
  const [codes, setCodes] = useState<CodeRow[] | null>(null);
  const [brand, setBrand] = useState('omnissa');
  const [label, setLabel] = useState('');
  const [code, setCode] = useState('');
  const [note, setNote] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = () => api.get<{ codes: CodeRow[] }>('/api/admin/codes').then((d) => setCodes(d.codes));
  useEffect(() => {
    load();
  }, []);

  const create = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setNote(null);
    try {
      await api.post('/api/admin/codes', { brandSlug: brand, label, code });
      setNote(`Code created for ${brand} · "${label}". Share it now — only its hash is stored.`);
      setLabel('');
      setCode('');
      await load();
    } catch (err) {
      setNote(err instanceof ApiError ? err.message : 'Failed to create code.');
    } finally {
      setBusy(false);
    }
  };

  const toggle = async (id: string) => {
    await api.post(`/api/admin/codes/${id}/toggle`);
    await load();
  };

  if (!codes) return <p className="label-utility mt-8">Loading codes…</p>;
  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-2">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left">
              {['Brand', 'Label', 'Uses', 'Status', ''].map((h, i) => (
                <th key={i} className="label-utility font-normal pb-2 pr-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {codes.map((c) => (
              <tr key={c.id} className="border-t border-line">
                <td className="py-2 pr-3 font-utility text-xs">{c.brandSlug}</td>
                <td className="py-2 pr-3">{c.label}</td>
                <td className="py-2 pr-3 font-utility text-xs">{c.uses}{c.maxUses ? `/${c.maxUses}` : ''}</td>
                <td className="py-2 pr-3">
                  <span className={`font-utility text-[0.65rem] uppercase tracking-wider px-2 py-0.5 rounded-full ${c.active ? 'bg-signal text-on-signal' : 'bg-line text-muted'}`}>
                    {c.active ? 'Active' : 'Disabled'}
                  </span>
                </td>
                <td className="py-2">
                  <button onClick={() => toggle(c.id)} className="text-accent text-xs font-semibold hover:underline">
                    {c.active ? 'Disable' : 'Enable'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <form onSubmit={create} className="border border-line rounded-brand bg-surface p-5 h-fit">
        <span className="label-utility">New access code</span>
        <div className="mt-3 flex flex-col gap-3">
          <label className="flex flex-col gap-1">
            <span className="label-utility">Brand slug</span>
            <input value={brand} onChange={(e) => setBrand(e.target.value)} className="border border-line-strong rounded-brand px-3 py-2 text-sm font-utility focus:border-accent" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="label-utility">Label (who it's for)</span>
            <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Reviewer 2 · Omnissa" className="border border-line-strong rounded-brand px-3 py-2 text-sm focus:border-accent placeholder:text-muted/60" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="label-utility">Code (min 8 chars — stored as hash only)</span>
            <input value={code} onChange={(e) => setCode(e.target.value)} className="border border-line-strong rounded-brand px-3 py-2 text-sm font-utility tracking-wider focus:border-accent" />
          </label>
          <Button type="submit" disabled={busy || !label.trim() || code.trim().length < 8}>{busy ? 'Creating…' : 'Create code'}</Button>
          {note && <p className="text-xs text-muted">{note}</p>}
        </div>
      </form>
    </div>
  );
}

const fmtMin = (m: number) => (m >= 60 ? `${Math.floor(m / 60)}h ${Math.round(m % 60)}m` : `${Math.round(m)}m`);

// One-line human description of a timeline event from its payload.
function describeEvent(type: string, payloadJson: string | null): string {
  const p = payloadJson ? (JSON.parse(payloadJson) as Record<string, unknown>) : {};
  const mod = typeof p.moduleId === 'string' ? p.moduleId : '';
  switch (type) {
    case 'code_entered': return `entered with code "${p.codeLabel ?? '?'}"`;
    case 'intake_completed': return 'completed intake';
    case 'diagnostic_completed': return `finished the diagnostic${typeof p.correct === 'number' ? ` · ${p.correct}/${p.total}` : ''}`;
    case 'module_opened': return `opened ${mod}`;
    case 'module_completed': return `completed ${mod}`;
    case 'knowledge_check_submitted': return `knowledge check ${mod} · ${p.correct}/${p.total}`;
    case 'sort_submitted': return `sorting exercise ${mod} · ${p.correct}/${p.total}`;
    case 'choice_submitted': return `choice exercise ${mod} · ${p.correct ? 'correct' : 'incorrect'}`;
    case 'activity_submitted': return `submitted activity ${mod} (${p.chars} chars)`;
    case 'activity_graded': return `activity graded ${mod} · ${p.total}/20`;
    case 'chat_started': return `started tutor chat${mod ? ` ${mod}` : ''}`;
    case 'podcast_played': return 'listened to a podcast episode';
    default: return type.replaceAll('_', ' ');
  }
}

function Learners() {
  const [rows, setRows] = useState<LearnerRow[] | null>(null);
  const [filter, setFilter] = useState('');
  const [detail, setDetail] = useState<LearnerDetail | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    api.get<{ learners: LearnerRow[] }>('/api/admin/learners').then((d) => setRows(d.learners));
  }, []);

  const open = async (id: string) => {
    setSelectedId(id);
    setDetail(null);
    setDetail(await api.get<LearnerDetail>(`/api/admin/learners/${id}`));
  };

  if (!rows) return <p className="label-utility mt-8">Loading learners…</p>;
  const q = filter.trim().toLowerCase();
  const shown = q
    ? rows.filter((r) => [r.display_name ?? '', r.role_label ?? '', r.code_label ?? '', r.session_id].some((v) => v.toLowerCase().includes(q)))
    : rows;
  const prefs = detail?.preferences as { objective?: unknown } | undefined;
  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
      <div>
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter by name, role, or access code…"
          className="w-full border border-line-strong bg-surface rounded-brand px-3 py-2 text-sm focus:border-accent placeholder:text-muted/60"
          aria-label="Filter learners"
        />
        <div className="overflow-x-auto mt-3">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left">
                {['Who', 'First seen', 'Last seen', 'Time', 'Modules', 'Quiz', 'Activity', 'Pods'].map((h) => (
                  <th key={h} className="label-utility font-normal pb-2 pr-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shown.map((r) => (
                <tr
                  key={r.session_id}
                  onClick={() => open(r.session_id)}
                  className={`border-t border-line cursor-pointer hover:bg-accent/5 ${selectedId === r.session_id ? 'bg-accent/10' : ''}`}
                >
                  <td className="py-2 pr-3">
                    {r.display_name ?? 'Anonymous'}
                    {r.role_label && <span className="text-muted text-xs"> · {r.role_label}</span>}
                  </td>
                  <td className="py-2 pr-3 font-utility text-xs text-muted whitespace-nowrap">{fmtDate(r.created_at)}</td>
                  <td className="py-2 pr-3 font-utility text-xs text-muted whitespace-nowrap">{fmtDate(r.last_seen_at)}</td>
                  <td className="py-2 pr-3 font-utility text-xs">{fmtMin(r.active_min)}</td>
                  <td className="py-2 pr-3 font-utility text-xs">{r.modules_completed}</td>
                  <td className="py-2 pr-3 font-utility text-xs">{r.quiz_avg_pct !== null ? `${r.quiz_avg_pct}%` : '—'}</td>
                  <td className="py-2 pr-3 font-utility text-xs">{r.best_activity_score !== null ? `${r.best_activity_score}/20` : r.submissions > 0 ? 'ungraded' : '—'}</td>
                  <td className="py-2 pr-3 font-utility text-xs">{r.podcast_listens || '—'}</td>
                </tr>
              ))}
              {shown.length === 0 && (
                <tr><td colSpan={8} className="py-6 text-muted text-sm">No learner sessions{q ? ' matching the filter' : ' yet'}.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted mt-2">
          Time is estimated active time: gaps between recorded interactions, counting only gaps under 10 minutes. Quiz is the average of each module's latest knowledge-check attempt.
        </p>
      </div>
      <div>
        {selectedId ? (
          detail ? (
            <div className="border border-line rounded-brand bg-surface p-5">
              <h2 className="font-display font-semibold text-ink-strong">
                {detail.participant?.displayName ?? 'Anonymous'}
                {detail.participant?.roleLabel ? ` · ${detail.participant.roleLabel}` : ''}
              </h2>
              <p className="text-xs text-muted mt-1">
                {fmtDate(detail.session.createdAt)} → {fmtDate(detail.session.lastSeenAt)} · ~{fmtMin(detail.activeMinutes)} active
              </p>
              {typeof prefs?.objective === 'string' && (
                <p className="text-xs text-ink mt-2 border-l-2 border-accent pl-2">Objective: “{prefs.objective}”</p>
              )}
              <span className="label-utility block mt-4">Timeline</span>
              <div className="mt-1 max-h-56 overflow-y-auto flex flex-col gap-0.5">
                {detail.timeline.map((e, i) => (
                  <p key={i} className="text-xs text-ink">
                    <span className="font-utility text-muted">{fmtDate(e.created_at)}</span> · {describeEvent(e.type, e.payload_json)}
                  </p>
                ))}
                {detail.timeline.length === 0 && <p className="text-xs text-muted">No recorded activity.</p>}
              </div>
              {detail.submissions.length > 0 && (
                <>
                  <span className="label-utility block mt-4">Submissions</span>
                  {detail.submissions.map((s) => (
                    <p key={s.id} className="text-xs text-ink mt-1">
                      <span className="font-utility text-muted">{fmtDate(s.created_at)}</span> · {s.module_id} · {s.chars} chars ·{' '}
                      {s.graded_at ? `${s.total_score}/20` : 'ungraded'}
                    </p>
                  ))}
                </>
              )}
              <span className="label-utility block mt-4">Content versions witnessed</span>
              <div className="mt-1 max-h-40 overflow-y-auto flex flex-col gap-0.5">
                {detail.audits.map((a) => (
                  <p key={a.id} className="text-xs text-ink">
                    <span className="font-utility text-muted">{fmtDate(a.created_at)}</span> · {a.activity.replaceAll('_', ' ')} · {a.module_id} ·{' '}
                    <span className="font-utility" title={a.content_hash}>{a.content_hash.slice(0, 10)}</span>
                  </p>
                ))}
                {detail.audits.length === 0 && <p className="text-xs text-muted">Nothing witnessed yet.</p>}
              </div>
              <p className="text-[0.65rem] text-muted mt-2">Open any version hash in the Content audit tab to read the exact content as this learner saw it.</p>
            </div>
          ) : (
            <p className="label-utility mt-4">Loading learner…</p>
          )
        ) : (
          <p className="text-muted text-sm mt-2">Select a learner to see their full history: timeline, quiz results, submissions, and the content versions they witnessed.</p>
        )}
      </div>
    </div>
  );
}

function Content() {
  const [modules, setModules] = useState<ContentModuleRow[] | null>(null);
  const [moduleId, setModuleId] = useState<string | null>(null);
  const [segment, setSegment] = useState<'read' | 'micro' | 'activity'>('read');
  const [blocks, setBlocks] = useState<ContentBlockRow[] | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    api.get<{ modules: ContentModuleRow[] }>('/api/admin/content/modules').then((d) => setModules(d.modules));
  }, []);

  const contentId = moduleId ? (segment === 'read' ? moduleId : `${moduleId}-${segment}`) : null;
  useEffect(() => {
    if (!contentId) return;
    setBlocks(null);
    setEditing(null);
    api.get<{ blocks: ContentBlockRow[] }>(`/api/admin/content/blocks?module=${encodeURIComponent(contentId)}`).then((d) => setBlocks(d.blocks));
  }, [contentId]);

  const save = async (blockId: string) => {
    if (busy) return;
    setBusy(true);
    setNote(null);
    try {
      const r = await api.put<{ ok: boolean; reviewedAt: string }>(`/api/admin/content/blocks/${blockId}`, { body: draft });
      setBlocks((prev) => prev?.map((b) => (b.id === blockId ? { ...b, body: draft, reviewedAt: r.reviewedAt } : b)) ?? null);
      setEditing(null);
      setNote('Saved. The change is live for new views; earlier learners keep their audited version.');
    } catch (e) {
      setNote(e instanceof ApiError ? e.message : 'Failed to save.');
    } finally {
      setBusy(false);
    }
  };

  if (!modules) return <p className="label-utility mt-8">Loading content…</p>;
  const selected = modules.find((m) => m.id === moduleId) ?? null;
  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left">
              {['Module', 'Status', 'Blocks', 'Versions'].map((h) => (
                <th key={h} className="label-utility font-normal pb-2 pr-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {modules.map((m) => (
              <tr
                key={m.id}
                onClick={() => { setModuleId(m.id); setSegment('read'); }}
                className={`border-t border-line cursor-pointer hover:bg-accent/5 ${moduleId === m.id ? 'bg-accent/10' : ''}`}
              >
                <td className="py-2 pr-3">
                  <span className="font-utility text-xs">{m.id}</span>
                  <span className="block text-xs text-muted">{m.title}</span>
                </td>
                <td className="py-2 pr-3 font-utility text-xs">{m.status}</td>
                <td className="py-2 pr-3 font-utility text-xs">{m.blocks}{m.micro_blocks ? ` +${m.micro_blocks}µ` : ''}{m.activity_blocks ? ` +${m.activity_blocks}a` : ''}</td>
                <td className="py-2 pr-3 font-utility text-xs">{m.versions_witnessed || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        {selected && contentId ? (
          <div>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="font-display font-semibold text-ink-strong">{selected.title}</h2>
              <div className="flex gap-1">
                {(['read', 'micro', 'activity'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSegment(s)}
                    aria-pressed={segment === s}
                    className={`px-2 py-1 rounded-brand font-utility text-[0.65rem] uppercase tracking-wider ${segment === s ? 'bg-ink-strong text-surface' : 'text-muted hover:text-ink-strong'}`}
                  >
                    {s === 'read' ? `Reading (${selected.blocks})` : s === 'micro' ? `Micro (${selected.micro_blocks})` : `Activity (${selected.activity_blocks})`}
                  </button>
                ))}
              </div>
            </div>
            {selected.exercise_kinds && (
              <p className="text-xs text-muted mt-1">Exercises: {selected.exercise_kinds.replaceAll(',', ' · ')} (edit via seed packages — answer keys never render here)</p>
            )}
            {note && <p className="text-xs text-accent mt-2">{note}</p>}
            {!blocks ? (
              <p className="label-utility mt-4">Loading blocks…</p>
            ) : blocks.length === 0 ? (
              <p className="text-muted text-sm mt-4">No blocks in this segment.</p>
            ) : (
              <div className="mt-3 flex flex-col gap-3">
                {blocks.map((b) => (
                  <div key={b.id} className="border border-line rounded-brand bg-surface p-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="font-utility text-[0.65rem] uppercase tracking-wider text-muted">
                        #{b.ordinal} · {b.kind} · {b.layer}{b.variant ? ` · ${b.variant}` : ''} · reviewed {b.reviewedAt}
                      </span>
                      {editing === b.id ? (
                        <span className="flex gap-2">
                          <Button onClick={() => save(b.id)} disabled={busy || !draft.trim()}>{busy ? 'Saving…' : 'Save'}</Button>
                          <button onClick={() => setEditing(null)} className="text-muted text-xs hover:text-ink-strong">Cancel</button>
                        </span>
                      ) : (
                        <button onClick={() => { setEditing(b.id); setDraft(b.body); }} className="text-accent text-xs font-semibold hover:underline">Edit</button>
                      )}
                    </div>
                    {editing === b.id ? (
                      <textarea
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        rows={Math.min(24, Math.max(6, draft.split('\n').length + 2))}
                        className="mt-2 w-full border border-line-strong bg-surface rounded-brand px-3 py-2 text-sm font-utility text-ink focus:border-accent"
                      />
                    ) : (
                      <pre className="mt-2 whitespace-pre-wrap text-xs text-ink font-body max-h-48 overflow-y-auto">{b.body}</pre>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <p className="text-muted text-sm mt-2">
            Select a module to read and edit its content. Edits go live immediately for new views — learners who already saw the old version keep their audited snapshot, and the next view mints a new version in the audit trail.
          </p>
        )}
      </div>
    </div>
  );
}

// One guidance editor: a textarea bound to a scope, saved on demand.
function GuidanceEditor({ scope, label, hint, initial, onSaved }: { scope: string; label: string; hint?: string; initial: string; onSaved: () => void }) {
  const [text, setText] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const dirty = text.trim() !== initial.trim();
  const save = async () => {
    if (busy) return;
    setBusy(true);
    setNote(null);
    try {
      await api.put('/api/admin/guidance', { scope, body: text });
      setNote(text.trim() ? 'Saved — future tutor and podcast sessions carry it.' : 'Cleared.');
      onSaved();
    } catch (e) {
      setNote(e instanceof ApiError ? e.message : 'Failed to save.');
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="border border-line rounded-brand bg-surface p-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="label-utility">{label}</span>
        <span className="flex items-center gap-2">
          {note && <span className="text-xs text-muted">{note}</span>}
          <Button onClick={save} disabled={busy || !dirty}>{busy ? 'Saving…' : 'Save'}</Button>
        </span>
      </div>
      {hint && <p className="text-xs text-muted mt-1">{hint}</p>}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        placeholder="Key takeaways, points to reinforce, company-specific framing… Leave empty for none."
        className="mt-2 w-full border border-line-strong bg-surface rounded-brand px-3 py-2 text-sm text-ink focus:border-accent placeholder:text-muted/60"
      />
    </div>
  );
}

function BrandTab() {
  const [brand, setBrand] = useState<BrandConfig | null>(null);
  const [guidance, setGuidance] = useState<GuidanceData | null>(null);
  const [name, setName] = useState('');
  const [aiTools, setAiTools] = useState('');
  const [tokensDraft, setTokensDraft] = useState('');
  const [voiceDraft, setVoiceDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  const load = async () => {
    const b = await api.get<BrandConfig>('/api/admin/brand');
    setBrand(b);
    setName(b.name);
    setAiTools((b.profile.aiTools ?? []).join(', '));
    setTokensDraft(JSON.stringify(b.tokens, null, 2));
    setVoiceDraft(JSON.stringify(b.voice, null, 2));
    setGuidance(await api.get<GuidanceData>('/api/admin/guidance'));
  };
  useEffect(() => {
    load();
  }, []);

  const saveIdentity = async () => {
    if (busy || !brand) return;
    setBusy(true);
    setNote(null);
    try {
      let tokens: unknown;
      let voice: unknown;
      try {
        tokens = JSON.parse(tokensDraft);
        voice = JSON.parse(voiceDraft);
      } catch {
        setNote('Design tokens and voice must be valid JSON.');
        setBusy(false);
        return;
      }
      const tools = aiTools.split(',').map((s) => s.trim()).filter(Boolean);
      await api.put('/api/admin/brand', {
        name,
        tokens,
        voice,
        profile: { ...brand.profile, aiTools: tools },
      });
      setNote('Saved. Learners see the new identity on their next page load.');
    } catch (e) {
      setNote(e instanceof ApiError ? e.message : 'Failed to save.');
    } finally {
      setBusy(false);
    }
  };

  if (!brand || !guidance) return <p className="label-utility mt-8">Loading brand…</p>;
  const bodyFor = (scope: string) => guidance.guidance.find((g) => g.scope === scope)?.body ?? '';
  const openModules = guidance.scopes.modules.filter((m) => m.status === 'open');
  const refresh = () => api.get<GuidanceData>('/api/admin/guidance').then(setGuidance);
  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-2">
      <div>
        <span className="label-utility">Content guidance</span>
        <p className="text-xs text-muted mt-1 mb-3">
          What you write here is passed to the AI whenever it personalizes content — the module tutor and the podcast hosts weave it in. Use it for key takeaways you want reinforced, company framing, or additions the base content doesn't carry. Changes apply to new sessions and re-bake stock episodes automatically.
        </p>
        <div className="flex flex-col gap-3">
          <GuidanceEditor scope="global" label="Overall — every course and module" initial={bodyFor('global')} onSaved={refresh} />
          {guidance.scopes.courses.map((courseId) => (
            <GuidanceEditor key={courseId} scope={`course:${courseId}`} label={`Course · ${courseId}`} initial={bodyFor(`course:${courseId}`)} onSaved={refresh} />
          ))}
          {openModules.map((m) => (
            <GuidanceEditor key={m.id} scope={`module:${m.id}`} label={`Module · ${m.id}`} hint={m.title} initial={bodyFor(`module:${m.id}`)} onSaved={refresh} />
          ))}
        </div>
      </div>
      <div>
        <span className="label-utility">Brand identity · {brand.slug}</span>
        <div className="mt-3 border border-line rounded-brand bg-surface p-4 flex flex-col gap-3">
          <label className="flex flex-col gap-1">
            <span className="label-utility">Company name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} className="border border-line-strong rounded-brand px-3 py-2 text-sm focus:border-accent" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="label-utility">Provisioned AI tools (comma-separated)</span>
            <input value={aiTools} onChange={(e) => setAiTools(e.target.value)} placeholder="Claude, Claude Code" className="border border-line-strong rounded-brand px-3 py-2 text-sm focus:border-accent placeholder:text-muted/60" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="label-utility">Design tokens (colors, fonts, radius — JSON)</span>
            <textarea value={tokensDraft} onChange={(e) => setTokensDraft(e.target.value)} rows={10} spellCheck={false} className="border border-line-strong rounded-brand px-3 py-2 text-xs font-utility focus:border-accent" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="label-utility">Voice (copy register — JSON)</span>
            <textarea value={voiceDraft} onChange={(e) => setVoiceDraft(e.target.value)} rows={5} spellCheck={false} className="border border-line-strong rounded-brand px-3 py-2 text-xs font-utility focus:border-accent" />
          </label>
          <div className="flex items-center gap-3">
            <Button onClick={saveIdentity} disabled={busy}>{busy ? 'Saving…' : 'Save identity'}</Button>
            {note && <span className="text-xs text-muted">{note}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

type EmployeeRow = {
  id: string;
  name: string;
  email: string | null;
  roleTitle: string | null;
  managerName: string | null;
  managerEmail: string | null;
  level: string | null;
  location: string | null;
  startDate: string | null;
  source: string;
  matchedSessionId: string | null;
  lastSeenAt: string | null;
  modulesCompleted: number;
  hasAccount: boolean;
  accountLastLoginAt: string | null;
};

function Census() {
  const [employees, setEmployees] = useState<EmployeeRow[] | null>(null);
  const [csv, setCsv] = useState('');
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  const load = () => api.get<{ employees: EmployeeRow[] }>('/api/admin/census').then((d) => setEmployees(d.employees));
  useEffect(() => {
    load();
  }, []);

  const runImport = async () => {
    if (busy || !csv.trim()) return;
    setBusy(true);
    setNote(null);
    try {
      const r = await api.post<{ imported: number; updated: number; skipped: number }>('/api/admin/census/import', { csv });
      setNote(`Imported ${r.imported}, updated ${r.updated}${r.skipped ? `, skipped ${r.skipped} rows without a name` : ''}.`);
      setCsv('');
      await load();
    } catch (e) {
      setNote(e instanceof ApiError ? e.message : 'Import failed.');
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    await api.del(`/api/admin/census/${id}`);
    await load();
  };

  const resetPassword = async (e: EmployeeRow) => {
    setNote(null);
    try {
      const r = await api.post<{ tempPassword: string }>(`/api/admin/census/${e.id}/reset-password`);
      setNote(`Temporary password for ${e.name}: ${r.tempPassword} — shown once, share it securely. They should change it after signing in.`);
    } catch (err) {
      setNote(err instanceof ApiError ? err.message : 'Reset failed.');
    }
  };

  if (!employees) return <p className="label-utility mt-8">Loading census…</p>;
  const matched = employees.filter((e) => e.matchedSessionId).length;
  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,8fr)_minmax(0,4fr)]">
      <div>
        <p className="text-xs text-muted mb-2">
          {employees.length} employees on file · {matched} matched to a learner session. Matching is by intake name (case-insensitive) until SSO provides real identity — unmatched rows may simply have entered a different name.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left">
                {['Name', 'Role', 'Manager', 'Level', 'Location', 'Started', 'Course status', 'Account', ''].map((h, i) => (
                  <th key={i} className="label-utility font-normal pb-2 pr-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {employees.map((e) => (
                <tr key={e.id} className="border-t border-line">
                  <td className="py-2 pr-3">
                    {e.name}
                    {e.email && <span className="block font-utility text-[0.65rem] text-muted">{e.email}</span>}
                  </td>
                  <td className="py-2 pr-3 text-xs">{e.roleTitle ?? '—'}</td>
                  <td className="py-2 pr-3 text-xs">{e.managerName ?? '—'}</td>
                  <td className="py-2 pr-3 font-utility text-xs">{e.level ?? '—'}</td>
                  <td className="py-2 pr-3 text-xs">{e.location ?? '—'}</td>
                  <td className="py-2 pr-3 font-utility text-xs">{e.startDate ?? '—'}</td>
                  <td className="py-2 pr-3 text-xs">
                    {e.matchedSessionId ? (
                      <span>
                        {e.modulesCompleted > 0 ? `${e.modulesCompleted} module${e.modulesCompleted === 1 ? '' : 's'} done` : 'started'}
                        <span className="block font-utility text-[0.65rem] text-muted">seen {fmtDate(e.lastSeenAt)}</span>
                      </span>
                    ) : (
                      <span className="text-muted">not started</span>
                    )}
                  </td>
                  <td className="py-2 pr-3 text-xs">
                    {e.hasAccount ? (
                      <span>
                        ✓<span className="block font-utility text-[0.65rem] text-muted">login {fmtDate(e.accountLastLoginAt)}</span>
                        <button onClick={() => resetPassword(e)} className="text-accent text-[0.65rem] font-semibold hover:underline">Reset password</button>
                      </span>
                    ) : (
                      <span className="text-muted">none</span>
                    )}
                  </td>
                  <td className="py-2">
                    <button onClick={() => remove(e.id)} className="text-muted text-xs hover:text-ink-strong">Remove</button>
                  </td>
                </tr>
              ))}
              {employees.length === 0 && (
                <tr><td colSpan={9} className="py-6 text-muted text-sm">No employees yet — import a CSV to start the census.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="border border-line rounded-brand bg-surface p-4">
          <span className="label-utility">CSV import</span>
          <p className="text-xs text-muted mt-1">
            Header row + one employee per row. Recognized columns: name (required), email, role/title, manager, manager_email, level, location, start_date. Re-importing updates existing rows by email, then name.
          </p>
          <textarea
            value={csv}
            onChange={(e) => setCsv(e.target.value)}
            rows={7}
            spellCheck={false}
            placeholder={'name,email,role,manager,manager_email,level,location,start_date\nJane Doe,jane@acme.com,HRBP,Sam Lee,sam@acme.com,L4,Austin,2024-03-01'}
            className="mt-2 w-full border border-line-strong bg-surface rounded-brand px-3 py-2 text-xs font-utility focus:border-accent placeholder:text-muted/60"
          />
          <div className="mt-2 flex items-center gap-3">
            <Button onClick={runImport} disabled={busy || !csv.trim()}>{busy ? 'Importing…' : 'Import'}</Button>
            {note && <span className="text-xs text-muted">{note}</span>}
          </div>
        </div>
        <div className="border border-line rounded-brand bg-surface p-4">
          <span className="label-utility">Workday · Okta</span>
          <p className="text-xs text-muted mt-1">
            Directory sync lands on these same rows (names, roles, managers, level, location, start date), with the source column marking where each record came from. Not yet connected — CSV import is the path today.
          </p>
        </div>
      </div>
    </div>
  );
}

type ReminderRule = {
  id: string;
  audience: string;
  trigger: string;
  days: number;
  template: string;
  active: boolean;
};

type ReminderPreview = {
  ruleId: string;
  audience: string;
  trigger: string;
  days: number;
  recipients: { employee: string; to: string; message: string; deliverable: boolean }[];
};

type EmailSend = {
  id: string;
  kind: string;
  toEmail: string;
  subject: string;
  status: string;
  error: string | null;
  createdAt: string;
};

const TRIGGER_LABELS: Record<string, string> = {
  not_started: 'has not started',
  inactive: 'inactive for',
  incomplete: 'started but no module completed for',
};

function Reminders() {
  const [rules, setRules] = useState<ReminderRule[] | null>(null);
  const [previews, setPreviews] = useState<ReminderPreview[] | null>(null);
  const [audience, setAudience] = useState('employee');
  const [trigger, setTrigger] = useState('not_started');
  const [days, setDays] = useState('7');
  const [template, setTemplate] = useState('');
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [configured, setConfigured] = useState(false);
  const [sends, setSends] = useState<EmailSend[]>([]);

  const load = async () => {
    const r = await api.get<{ rules: ReminderRule[] }>('/api/admin/reminders');
    setRules(r.rules);
    const p = await api.get<{ previews: ReminderPreview[]; delivery: { configured: boolean } }>('/api/admin/reminders/preview');
    setPreviews(p.previews);
    setConfigured(p.delivery.configured);
    setSends((await api.get<{ sends: EmailSend[] }>('/api/admin/reminders/log')).sends);
  };
  useEffect(() => {
    load();
  }, []);

  // Sending by hand runs exactly the pass the cron runs, dedupe included — so
  // pressing it twice does not nudge anyone twice.
  const sendNow = async () => {
    if (busy) return;
    setBusy(true);
    setNote(null);
    try {
      const r = await api.post<{ sent: number; skipped: number; failed: number; suppressed: number }>('/api/admin/reminders/send');
      setNote(
        `${r.sent} sent · ${r.suppressed} already nudged inside their window · ${r.skipped} undeliverable · ${r.failed} failed.`,
      );
      await load();
    } catch (err) {
      setNote(err instanceof ApiError ? err.message : 'The send failed.');
    } finally {
      setBusy(false);
    }
  };

  const create = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setNote(null);
    try {
      await api.post('/api/admin/reminders', { audience, trigger, days: Number(days), template });
      setTemplate('');
      await load();
    } catch (err) {
      setNote(err instanceof ApiError ? err.message : 'Failed to create rule.');
    } finally {
      setBusy(false);
    }
  };

  if (!rules) return <p className="label-utility mt-8">Loading reminders…</p>;
  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-2">
      <div>
        <p className="text-xs text-muted mb-3">
          Rules are evaluated against the census and the funnel. The preview shows exactly who each active rule would notify
          today, with the rendered message — the send runs that same evaluation, so what you see here is what goes out. A rule
          nudges one person at most once inside its own day window, which makes the pass safe to run repeatedly.
        </p>
        <div className="flex items-center gap-3 flex-wrap mb-4">
          <button
            onClick={sendNow}
            disabled={busy}
            className="inline-flex px-4 py-2 font-display font-semibold text-[0.85rem] rounded-brand bg-accent text-on-accent hover:brightness-110 disabled:opacity-40"
          >
            {busy ? 'Running…' : 'Run the pass now'}
          </button>
          <span className="text-xs text-muted">
            {configured
              ? 'Provider connected — this sends real mail. The cron runs the same pass automatically.'
              : 'No provider configured (RESEND_API_KEY + EMAIL_FROM). The pass still evaluates and logs every intended send as skipped.'}
          </span>
        </div>
        {note && <p className="text-xs text-ink-strong font-semibold mb-3">{note}</p>}
        {sends.length > 0 && (
          <details className="mb-4">
            <summary className="text-xs text-accent font-semibold cursor-pointer">Delivery log · {sends.length}</summary>
            <div className="mt-2 border border-line rounded-brand bg-surface overflow-hidden">
              {sends.slice(0, 25).map((s) => (
                <div key={s.id} className="px-3 py-2 border-b border-line last:border-b-0 text-xs">
                  <span className="font-utility uppercase tracking-wider text-muted">
                    {s.createdAt.slice(0, 16).replace('T', ' ')} · {s.kind} · {s.status}
                  </span>
                  <br />
                  <span className="text-ink-strong">{s.toEmail}</span>
                  <span className="text-muted"> — {s.subject}</span>
                  {s.error && <span className="text-muted"> ({s.error})</span>}
                </div>
              ))}
            </div>
          </details>
        )}
        {rules.map((r) => {
          const preview = previews?.find((p) => p.ruleId === r.id);
          return (
            <div key={r.id} className={`border border-line rounded-brand bg-surface p-4 mb-3 ${r.active ? '' : 'opacity-60'}`}>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-sm text-ink-strong">
                  To the <strong>{r.audience}</strong> when the employee {TRIGGER_LABELS[r.trigger] ?? r.trigger} <strong>{r.days} days</strong>
                </span>
                <span className="flex gap-3">
                  <button onClick={async () => { await api.post(`/api/admin/reminders/${r.id}/toggle`); await load(); }} className="text-accent text-xs font-semibold hover:underline">
                    {r.active ? 'Pause' : 'Resume'}
                  </button>
                  <button onClick={async () => { await api.del(`/api/admin/reminders/${r.id}`); await load(); }} className="text-muted text-xs hover:text-ink-strong">
                    Delete
                  </button>
                </span>
              </div>
              <p className="text-xs text-ink mt-2 whitespace-pre-wrap border-l-2 border-line pl-2">{r.template}</p>
              {r.active && preview && (
                <div className="mt-3 border-t border-line pt-2">
                  <span className="label-utility">Would notify today · {preview.recipients.length}</span>
                  <div className="mt-1 max-h-36 overflow-y-auto flex flex-col gap-1">
                    {preview.recipients.map((rec, i) => (
                      <details key={i} className="text-xs text-ink">
                        <summary className="cursor-pointer">
                          {rec.employee} → <span className={rec.deliverable ? 'font-utility' : 'text-muted'}>{rec.to}</span>
                        </summary>
                        <p className="whitespace-pre-wrap border-l-2 border-accent pl-2 mt-1 text-muted">{rec.message}</p>
                      </details>
                    ))}
                    {preview.recipients.length === 0 && <p className="text-xs text-muted">Nobody matches right now.</p>}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {rules.length === 0 && <p className="text-muted text-sm">No reminder rules yet — create the first one.</p>}
      </div>
      <form onSubmit={create} className="border border-line rounded-brand bg-surface p-5 h-fit">
        <span className="label-utility">New reminder rule</span>
        <div className="mt-3 flex flex-col gap-3">
          <label className="flex flex-col gap-1">
            <span className="label-utility">Send to</span>
            <select value={audience} onChange={(e) => setAudience(e.target.value)} className="border border-line-strong bg-surface rounded-brand px-3 py-2 text-sm focus:border-accent">
              <option value="employee">The employee</option>
              <option value="manager">Their manager</option>
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="label-utility">When the employee</span>
            <select value={trigger} onChange={(e) => setTrigger(e.target.value)} className="border border-line-strong bg-surface rounded-brand px-3 py-2 text-sm focus:border-accent">
              <option value="not_started">Has not started the course</option>
              <option value="inactive">Has gone inactive</option>
              <option value="incomplete">Started but completed no module</option>
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="label-utility">After this many days</span>
            <input type="number" min={1} max={365} value={days} onChange={(e) => setDays(e.target.value)} className="border border-line-strong rounded-brand px-3 py-2 w-24 font-utility text-sm focus:border-accent" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="label-utility">Message — placeholders: {'{name} {first_name} {manager_name} {days}'}</span>
            <textarea
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              rows={5}
              placeholder={'Hi {first_name} — your AI fluency course is waiting. It takes about an hour to get through Module 1, and {days} days have gone by. Jump back in when you have a moment.'}
              className="border border-line-strong bg-surface rounded-brand px-3 py-2 text-sm focus:border-accent placeholder:text-muted/60"
            />
          </label>
          <div className="flex items-center gap-3">
            <Button type="submit" disabled={busy || !template.trim()}>{busy ? 'Creating…' : 'Create rule'}</Button>
            {note && <span className="text-xs text-muted">{note}</span>}
          </div>
        </div>
      </form>
    </div>
  );
}

function Audit() {
  const [rows, setRows] = useState<AuditRow[] | null>(null);
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState<AuditRow | null>(null);
  const [snapshot, setSnapshot] = useState<SnapshotDetail | null>(null);

  useEffect(() => {
    api.get<{ audits: AuditRow[] }>('/api/admin/audit').then((d) => setRows(d.audits));
  }, []);

  const open = async (row: AuditRow) => {
    setSelected(row);
    setSnapshot(null);
    setSnapshot(await api.get<SnapshotDetail>(`/api/admin/audit/snapshot/${row.content_hash}`));
  };

  if (!rows) return <p className="label-utility mt-8">Loading audit trail…</p>;
  const q = filter.trim().toLowerCase();
  const shown = q
    ? rows.filter((r) => [r.display_name ?? '', r.module_id, r.activity, r.session_id].some((v) => v.toLowerCase().includes(q)))
    : rows;
  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)]">
      <div>
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter by learner, module, or activity…"
          className="w-full border border-line-strong bg-surface rounded-brand px-3 py-2 text-sm focus:border-accent placeholder:text-muted/60"
          aria-label="Filter audit rows"
        />
        <div className="overflow-x-auto mt-3">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left">
                {['When', 'Who', 'Module', 'Activity', 'Version'].map((h) => (
                  <th key={h} className="label-utility font-normal pb-2 pr-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shown.map((r) => (
                <tr
                  key={r.id}
                  onClick={() => open(r)}
                  className={`border-t border-line cursor-pointer hover:bg-accent/5 ${selected?.id === r.id ? 'bg-accent/10' : ''}`}
                >
                  <td className="py-2 pr-3 font-utility text-xs text-muted whitespace-nowrap">{fmtDate(r.created_at)}</td>
                  <td className="py-2 pr-3">{r.display_name ?? '—'}</td>
                  <td className="py-2 pr-3 font-utility text-xs">{r.module_id}</td>
                  <td className="py-2 pr-3 font-utility text-xs">{r.activity.replaceAll('_', ' ')}</td>
                  <td className="py-2 pr-3 font-utility text-xs" title={r.content_hash}>{r.content_hash.slice(0, 10)}</td>
                </tr>
              ))}
              {shown.length === 0 && (
                <tr><td colSpan={5} className="py-6 text-muted text-sm">No completions witnessed yet{q ? ' matching the filter' : ''}. Rows appear as learners view and complete content.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div>
        {selected ? (
          <div className="border border-line rounded-brand bg-surface p-5">
            <div className="flex items-baseline justify-between gap-3 flex-wrap">
              <h2 className="font-display font-semibold text-ink-strong">
                {selected.display_name ?? 'Anonymous'} · {selected.activity.replaceAll('_', ' ')}
              </h2>
              <span className="font-utility text-xs text-muted">{fmtDate(selected.created_at)}</span>
            </div>
            {snapshot ? (
              <>
                <p className="mt-2 text-xs text-muted">
                  {snapshot.kind} · {snapshot.moduleId} · version <span className="font-utility" title={snapshot.hash}>{snapshot.hash.slice(0, 16)}</span>
                  <br />
                  first witnessed {fmtDate(snapshot.firstWitnessedAt)} · {snapshot.witnesses} completion{snapshot.witnesses === 1 ? '' : 's'} saw this exact version
                </p>
                <pre className="mt-3 whitespace-pre-wrap text-xs text-ink font-utility max-h-[32rem] overflow-y-auto border border-line rounded-brand p-3 bg-bg/50">
                  {JSON.stringify(snapshot.content, null, 2)}
                </pre>
              </>
            ) : (
              <p className="label-utility mt-4">Loading snapshot…</p>
            )}
          </div>
        ) : (
          <p className="text-muted text-sm mt-2">
            Select a row to open the exact content that learner saw at that moment — as it stood then, regardless of what it says now.
          </p>
        )}
      </div>
    </div>
  );
}

export default function Admin() {
  const [state, setState] = useState<'loading' | 'login' | 'in'>('loading');
  const [tab, setTab] = useState<Tab>('learners');

  const check = () =>
    api
      .get<{ authenticated: boolean }>('/api/admin/me')
      .then((d) => setState(d.authenticated ? 'in' : 'login'))
      .catch(() => setState('login'));
  useEffect(() => {
    check();
  }, []);

  if (state === 'loading') return <Screen><p className="label-utility pt-24 text-center">…</p></Screen>;
  if (state === 'login') return <Login onDone={() => setState('in')} />;

  return (
    <Screen wide>
      <div className="pt-10">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="label-utility">Operator console</p>
            <h1 className="font-display font-bold text-ink-strong text-2xl mt-1">Admin</h1>
          </div>
          <div className="flex items-center gap-1">
            {(Object.keys(TAB_LABELS) as Tab[]).map((tabId) => (
              <button
                key={tabId}
                onClick={() => setTab(tabId)}
                aria-pressed={tab === tabId}
                className={`px-3 py-1.5 rounded-brand font-utility text-xs uppercase tracking-wider ${
                  tab === tabId ? 'bg-ink-strong text-surface' : 'text-muted hover:text-ink-strong'
                }`}
              >
                {TAB_LABELS[tabId]}
              </button>
            ))}
            <button
              onClick={async () => {
                await api.post('/api/admin/logout');
                setState('login');
              }}
              className="ml-3 text-muted text-xs hover:text-ink-strong"
            >
              Log out
            </button>
          </div>
        </div>
        {tab === 'learners' && <Learners />}
        {tab === 'content' && <Content />}
        {tab === 'brand' && <BrandTab />}
        {tab === 'census' && <Census />}
        {tab === 'reminders' && <Reminders />}
        {tab === 'queue' && <Queue />}
        {tab === 'report' && <Reporting />}
        {tab === 'codes' && <Codes />}
        {tab === 'audit' && <Audit />}
      </div>
    </Screen>
  );
}
