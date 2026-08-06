import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen, Button, ErrorNote } from '../components/ui';
import { api, ApiError } from '../api';
import { useApp } from '../brand';

export default function Enter() {
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
      navigate('/hello');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went sideways. Try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen>
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
    </Screen>
  );
}
