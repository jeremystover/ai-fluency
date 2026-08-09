import { useEffect, useState, type FormEvent } from 'react';
import { Screen, Button, ErrorNote } from '../components/ui';
import { api, ApiError } from '../api';
import { goalLabel } from '../../shared/goals';

// Operator console: review queue (the async backup for the M8 peer exchange),
// funnel reporting, and access-code management. Deliberately utilitarian —
// this is a tool for one operator, not a learner surface.

type Tab = 'queue' | 'report' | 'codes';

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

export default function Admin() {
  const [state, setState] = useState<'loading' | 'login' | 'in'>('loading');
  const [tab, setTab] = useState<Tab>('queue');

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
            {(['queue', 'report', 'codes'] as Tab[]).map((tabId) => (
              <button
                key={tabId}
                onClick={() => setTab(tabId)}
                aria-pressed={tab === tabId}
                className={`px-3 py-1.5 rounded-brand font-utility text-xs uppercase tracking-wider ${
                  tab === tabId ? 'bg-ink-strong text-surface' : 'text-muted hover:text-ink-strong'
                }`}
              >
                {tabId === 'queue' ? 'Review queue' : tabId === 'report' ? 'Reporting' : 'Access codes'}
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
        {tab === 'queue' && <Queue />}
        {tab === 'report' && <Reporting />}
        {tab === 'codes' && <Codes />}
      </div>
    </Screen>
  );
}
