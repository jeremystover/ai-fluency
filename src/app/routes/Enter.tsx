import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen, Button, ErrorNote } from '../components/ui';
import { api, ApiError } from '../api';
import { useApp } from '../brand';

// The door. Which door depends on the deployment: 'passcode' is the demo
// (shared codes, no accounts); 'accounts' is the product — census-gated
// email + password sign-in. The server enforces the mode; this screen
// just renders the right form.

function PasscodeDoor() {
  const navigate = useNavigate();
  const { refreshMe } = useApp();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!code.trim() || busy) return;
    setBusy(true);
    setError(null);
    try {
      await api.post('/api/enter', { code: code.trim() });
      await refreshMe();
      navigate('/welcome');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went sideways. Try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="pt-20 sm:pt-28 max-w-md">
      <p className="label-utility">Access</p>
      <h1 className="font-display font-bold text-ink-strong text-3xl mt-3">Enter your passcode</h1>
      <p className="text-muted mt-3">It came with the link that brought you here. No account, no signup — the code is the whole door.</p>
      <form onSubmit={submit} className="mt-8 flex flex-col gap-4">
        <label className="flex flex-col gap-2">
          <span className="label-utility">Passcode</span>
          <input
            type="password"
            autoComplete="off"
            autoFocus
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="border border-line-strong bg-surface rounded-brand px-4 py-3 font-utility text-lg tracking-widest text-ink-strong focus:border-accent"
            aria-label="Passcode"
          />
        </label>
        {error && <ErrorNote message={error} />}
        <Button type="submit" disabled={busy || !code.trim()}>
          {busy ? 'Checking…' : 'Enter'}
        </Button>
      </form>
    </div>
  );
}

const field =
  'border border-line-strong bg-surface rounded-brand px-4 py-3 text-ink-strong focus:border-accent placeholder:text-muted/60';

function AccountDoor() {
  const navigate = useNavigate();
  const { me, refreshMe } = useApp();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  // Signed-in panel state
  const [changing, setChanging] = useState(false);
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [note, setNote] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      if (mode === 'signup') await api.post('/api/auth/signup', { name, email, password });
      else await api.post('/api/auth/signin', { email, password });
      await refreshMe();
      navigate('/welcome');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went sideways. Try again.');
    } finally {
      setBusy(false);
    }
  };

  if (me?.authenticated && me.account) {
    return (
      <div className="pt-20 sm:pt-28 max-w-md">
        <p className="label-utility">Account</p>
        <h1 className="font-display font-bold text-ink-strong text-3xl mt-3">You’re signed in</h1>
        <p className="text-muted mt-3">
          {me.account.name} · <span className="font-utility text-sm">{me.account.email}</span>
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <Button onClick={() => navigate('/welcome')}>Continue where you left off</Button>
          <button
            onClick={async () => {
              await api.post('/api/auth/signout');
              await refreshMe();
            }}
            className="text-muted text-sm hover:text-ink-strong text-left"
          >
            Sign out
          </button>
          <button onClick={() => setChanging((v) => !v)} className="text-muted text-sm hover:text-ink-strong text-left">
            {changing ? 'Never mind' : 'Change password'}
          </button>
          {changing && (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setNote(null);
                try {
                  await api.post('/api/auth/password', { current, next });
                  setNote('Password changed.');
                  setCurrent('');
                  setNext('');
                  setChanging(false);
                } catch (err) {
                  setNote(err instanceof ApiError ? err.message : 'Failed to change password.');
                }
              }}
              className="flex flex-col gap-3 border border-line rounded-brand bg-surface p-4"
            >
              <input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} placeholder="Current password" autoComplete="current-password" className={field} aria-label="Current password" />
              <input type="password" value={next} onChange={(e) => setNext(e.target.value)} placeholder="New password (10+ characters)" autoComplete="new-password" className={field} aria-label="New password" />
              <Button type="submit" disabled={!current || next.length < 10}>Change password</Button>
            </form>
          )}
          {note && <p className="text-xs text-muted">{note}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 sm:pt-28 max-w-md">
      <p className="label-utility">Sign in</p>
      <h1 className="font-display font-bold text-ink-strong text-3xl mt-3">
        {mode === 'signin' ? 'Welcome back' : 'Create your account'}
      </h1>
      <p className="text-muted mt-3">
        {mode === 'signin'
          ? 'Your progress lives with your account — sign in from any device and pick up where you left off.'
          : 'Use your work email — accounts are for employees on your company’s roster.'}
      </p>
      <form onSubmit={submit} className="mt-8 flex flex-col gap-4">
        {mode === 'signup' && (
          <label className="flex flex-col gap-2">
            <span className="label-utility">Your name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className={field} aria-label="Your name" />
          </label>
        )}
        <label className="flex flex-col gap-2">
          <span className="label-utility">Work email</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" autoFocus className={field} aria-label="Work email" />
        </label>
        <label className="flex flex-col gap-2">
          <span className="label-utility">Password{mode === 'signup' ? ' (10+ characters)' : ''}</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            className={field}
            aria-label="Password"
          />
        </label>
        {error && <ErrorNote message={error} />}
        <Button type="submit" disabled={busy || !email.trim() || !password || (mode === 'signup' && !name.trim())}>
          {busy ? 'One moment…' : mode === 'signin' ? 'Sign in' : 'Create account'}
        </Button>
      </form>
      <p className="text-sm text-muted mt-6">
        {mode === 'signin' ? (
          <>
            First time here?{' '}
            <button onClick={() => { setMode('signup'); setError(null); }} className="text-accent font-semibold hover:underline">
              Create your account
            </button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button onClick={() => { setMode('signin'); setError(null); }} className="text-accent font-semibold hover:underline">
              Sign in
            </button>
          </>
        )}
      </p>
      {mode === 'signin' && (
        <p className="text-xs text-muted mt-2">Forgot your password? Ask your admin to reset it — they can issue you a temporary one.</p>
      )}
    </div>
  );
}

export default function Enter() {
  const { brand } = useApp();
  return <Screen>{brand?.authMode === 'accounts' ? <AccountDoor /> : <PasscodeDoor />}</Screen>;
}
