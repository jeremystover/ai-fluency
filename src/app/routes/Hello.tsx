import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen, Button } from '../components/ui';
import { api } from '../api';
import { useApp } from '../brand';

export default function Hello() {
  const navigate = useNavigate();
  const { refreshMe } = useApp();
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [busy, setBusy] = useState(false);

  const go = async (withDetails: boolean, e?: FormEvent) => {
    e?.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      if (withDetails && (name.trim() || role.trim())) {
        await api.post('/api/hello', { displayName: name, roleLabel: role });
        await refreshMe();
      }
    } catch {
      // Optional data — never block the flow on it.
    }
    navigate('/diagnostic');
  };

  return (
    <Screen>
      <div className="pt-20 sm:pt-28 max-w-md">
        <p className="label-utility">Before you start</p>
        <h1 className="font-display font-bold text-ink-strong text-3xl mt-3">What should we call you?</h1>
        <p className="text-muted mt-3">Both optional. The name shows up in what you see; the role helps us read the results.</p>
        <form onSubmit={(e) => go(true, e)} className="mt-8 flex flex-col gap-5">
          <label className="flex flex-col gap-2">
            <span className="label-utility">First name</span>
            <input
              value={name}
              autoFocus
              onChange={(e) => setName(e.target.value)}
              className="border border-line-strong bg-surface rounded-brand px-4 py-3 text-ink-strong focus:border-accent"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="label-utility">Role</span>
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. VP People, HRBP, Head of TA"
              className="border border-line-strong bg-surface rounded-brand px-4 py-3 text-ink-strong focus:border-accent placeholder:text-muted/60"
            />
          </label>
          <div className="flex items-center gap-4">
            <Button type="submit" disabled={busy}>Continue</Button>
            <button type="button" onClick={() => go(false)} className="text-muted text-sm underline underline-offset-4 hover:text-ink-strong">
              Skip this
            </button>
          </div>
        </form>
      </div>
    </Screen>
  );
}
