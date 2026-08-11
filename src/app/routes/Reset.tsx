import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Screen, Button, ErrorNote } from '../components/ui';
import { api, ApiError } from '../api';
import { useApp } from '../brand';

// Two screens on one route, told apart by whether the URL carries a token.
//
// Without one, this is the request form: type your address, and we say the
// same thing back no matter what — the server refuses to reveal whether an
// account exists, and a page that hedged differently would give away what the
// API won't.
//
// With one, it's the new-password form. The token is checked *before* the
// form renders, so an expired link says so instead of accepting a password
// and then throwing it away.

function RequestForm() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy || !email.trim()) return;
    setBusy(true);
    setError(null);
    try {
      await api.post('/api/auth/reset/request', { email: email.trim() });
      setSent(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went sideways. Try again.');
    } finally {
      setBusy(false);
    }
  };

  if (sent) {
    return (
      <div className="pt-20 sm:pt-28 max-w-md">
        <p className="label-utility">Password</p>
        <h1 className="font-display font-bold text-ink-strong text-3xl mt-3">Check your email</h1>
        <p className="text-muted mt-3">
          If <span className="text-ink-strong">{email.trim()}</span> has an account here, a reset link is on its way. It's
          good for 45 minutes and works once.
        </p>
        <p className="text-muted text-sm mt-4">
          Nothing arrived? It may not be an account yet — accounts are created from your company's roster, and your admin
          can check. <a href="/enter" className="text-accent font-semibold hover:underline">Back to sign in</a>
        </p>
      </div>
    );
  }

  return (
    <div className="pt-20 sm:pt-28 max-w-md">
      <p className="label-utility">Password</p>
      <h1 className="font-display font-bold text-ink-strong text-3xl mt-3">Reset your password</h1>
      <p className="text-muted mt-3">Enter your work email and we'll send a link. Your progress isn't going anywhere.</p>
      <form onSubmit={submit} className="mt-8 flex flex-col gap-4">
        <label className="flex flex-col gap-2">
          <span className="label-utility">Work email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            autoFocus
            className="border border-line-strong bg-surface rounded-brand px-4 py-3 text-ink-strong focus:border-accent"
            aria-label="Work email"
          />
        </label>
        {error && <ErrorNote message={error} />}
        <Button type="submit" disabled={busy || !email.trim()}>
          {busy ? 'Sending…' : 'Send the link'}
        </Button>
      </form>
      <p className="text-sm text-muted mt-6">
        Remembered it?{' '}
        <a href="/enter" className="text-accent font-semibold hover:underline">
          Sign in
        </a>
      </p>
    </div>
  );
}

function NewPasswordForm({ token }: { token: string }) {
  const navigate = useNavigate();
  const { refreshMe } = useApp();
  const [state, setState] = useState<'checking' | 'valid' | 'dead'>('checking');
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let live = true;
    api
      .get<{ valid: boolean; email?: string }>(`/api/auth/reset/check?token=${encodeURIComponent(token)}`)
      .then((r) => {
        if (!live) return;
        setState(r.valid ? 'valid' : 'dead');
        setEmail(r.email ?? null);
      })
      .catch(() => live && setState('dead'));
    return () => {
      live = false;
    };
  }, [token]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy || password.length < 10 || password !== confirm) return;
    setBusy(true);
    setError(null);
    try {
      await api.post('/api/auth/reset/confirm', { token, password });
      await refreshMe();
      navigate('/welcome');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went sideways. Try again.');
    } finally {
      setBusy(false);
    }
  };

  if (state === 'checking') {
    return (
      <div className="pt-20 sm:pt-28 max-w-md">
        <p className="text-muted">Checking that link…</p>
      </div>
    );
  }

  if (state === 'dead') {
    return (
      <div className="pt-20 sm:pt-28 max-w-md">
        <p className="label-utility">Password</p>
        <h1 className="font-display font-bold text-ink-strong text-3xl mt-3">That link is done</h1>
        <p className="text-muted mt-3">
          Reset links last 45 minutes and work once — this one has expired, already been used, or was replaced by a newer
          request. Nothing has changed on your account.
        </p>
        <div className="mt-8">
          <Button onClick={() => navigate('/reset')}>Send a new one</Button>
        </div>
      </div>
    );
  }

  const tooShort = password.length > 0 && password.length < 10;
  const mismatch = confirm.length > 0 && password !== confirm;

  return (
    <div className="pt-20 sm:pt-28 max-w-md">
      <p className="label-utility">Password</p>
      <h1 className="font-display font-bold text-ink-strong text-3xl mt-3">Pick a new password</h1>
      {email && (
        <p className="text-muted mt-3">
          For <span className="font-utility text-sm text-ink-strong">{email}</span>. You'll be signed in right after.
        </p>
      )}
      <form onSubmit={submit} className="mt-8 flex flex-col gap-4">
        <label className="flex flex-col gap-2">
          <span className="label-utility">New password (10+ characters)</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            autoFocus
            className="border border-line-strong bg-surface rounded-brand px-4 py-3 text-ink-strong focus:border-accent"
            aria-label="New password"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="label-utility">Again, to be sure</span>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
            className="border border-line-strong bg-surface rounded-brand px-4 py-3 text-ink-strong focus:border-accent"
            aria-label="Confirm new password"
          />
        </label>
        {tooShort && <p className="text-sm text-muted">Ten characters minimum.</p>}
        {mismatch && <p className="text-sm text-muted">Those two don't match yet.</p>}
        {error && <ErrorNote message={error} />}
        <Button type="submit" disabled={busy || password.length < 10 || password !== confirm}>
          {busy ? 'Setting it…' : 'Set password and sign in'}
        </Button>
      </form>
    </div>
  );
}

export default function Reset() {
  const token = useSearchParams()[0].get('token');
  return <Screen>{token ? <NewPasswordForm token={token} /> : <RequestForm />}</Screen>;
}
