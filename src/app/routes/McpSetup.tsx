import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { Screen, ErrorNote } from '../components/ui';

// The course as an MCP server, live. Two ways to connect, and the page leads
// with the good one: the plain endpoint, which runs the OAuth handshake (the
// learner approves on a branded screen and the token binds to their existing
// session). The personal key URL stays as the fallback for clients that don't
// speak OAuth — it's a secret, and the page says so.

const ASK_EXAMPLES = [
  '"Teach me the next module of the AI fluency course."',
  '"Quiz me on ai101-m1 — one question at a time."',
  '"Run the scenario challenge — make me commit before the reveal."',
  '"I\'m drafting an ER summary right now — apply the course to it."',
  '"Grade my explanation: let me teach the module back to you."',
  '"Where am I in the course, and what should I do in 20 minutes?"',
];

export default function McpSetup() {
  const [url, setUrl] = useState<string | null>(null);
  const [keyUrl, setKeyUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<'url' | 'key' | null>(null);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    api
      .get<{ url: string; keyUrl: string }>('/api/mcp/connection')
      .then((r) => {
        setUrl(r.url);
        setKeyUrl(r.keyUrl);
      })
      .catch((e: Error) => setError(e.message));
  }, []);

  const copy = (which: 'url' | 'key') => {
    const value = which === 'url' ? url : keyUrl;
    if (!value) return;
    navigator.clipboard?.writeText(value).then(() => {
      setCopied(which);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const steps: { tool: string; steps: string[] }[] = [
    {
      tool: 'Claude (claude.ai or desktop)',
      steps: [
        'Open Settings → Connectors → "Add custom connector".',
        'Paste the course URL from above and save.',
        'Click "Connect". The course asks you to approve the connection — you\'ll see exactly what it can do, then you land back in Claude.',
        'Start a chat: "Teach me the next module of the AI fluency course." Claude pulls your real progress and teaches from the live content, and /learn, /quiz, /challenge, /apply, /whats-next appear as prompts.',
      ],
    },
    {
      tool: 'Claude Code',
      steps: [
        'Run: claude mcp add --transport http ai-fluency <the course URL>',
        'Run /mcp inside Claude Code and authenticate when it offers — same approval screen.',
        'Then in any session: "Quiz me on module ai101-m1" — or use the /learn prompt.',
      ],
    },
    {
      tool: 'ChatGPT',
      steps: [
        'Open Settings → Connectors and enable Developer Mode if your workspace requires it for custom connectors.',
        'Add a new connector with the course URL and approve the connection when prompted.',
        'Then ask: "Quiz me on Module 1 of the AI fluency course."',
      ],
    },
  ];

  return (
    <Screen>
      <div className="pt-12 sm:pt-16 max-w-xl">
        <p className="label-utility anim-fade">Learn inside your AI tools</p>
        <h1 className="font-display font-bold text-ink-strong text-3xl sm:text-4xl mt-3 leading-tight anim-rise">
          The course, right in Claude or ChatGPT.
        </h1>
        <p className="text-ink mt-4 anim-rise" style={{ animationDelay: '60ms' }}>
          The course ships as an MCP server — a connection that turns your assistant into this course's tutor. It pulls the real
          module content, quizzes you against the actual answer keys (held server-side), records completions to the same progress
          you see here, and recommends what's next. A two-minute concept exactly when a real task needs it, inside the tool where
          the task lives.
        </p>

        <div className="mt-6 anim-rise" style={{ animationDelay: '90ms' }}>
          <h2 className="font-display font-semibold text-ink-strong text-xl">The course URL</h2>
          {error && <div className="mt-3"><ErrorNote message={error} /></div>}
          {!error && (
            <div className="mt-3 border border-line rounded-brand bg-surface px-4 py-3">
              <code className="font-utility text-xs text-ink break-all block">{url ?? 'Loading…'}</code>
              <button
                type="button"
                onClick={() => copy('url')}
                disabled={!url}
                className="mt-3 text-sm font-display font-semibold text-accent hover:underline disabled:opacity-50"
              >
                {copied === 'url' ? 'Copied ✓' : 'Copy URL'}
              </button>
            </div>
          )}
          <p className="text-sm text-muted mt-2">
            Paste this into your assistant's connector settings and hit Connect. You'll be asked to approve the connection here
            first — that approval is what ties it to your course record. Nothing secret lives in this link, so it's safe to share
            with a colleague; they'll approve with their own account.
          </p>

          <details className="mt-4 border border-line rounded-brand bg-surface px-4 py-3" onToggle={(e) => setShowKey((e.target as HTMLDetailsElement).open)}>
            <summary className="text-sm font-display font-semibold text-ink-strong cursor-pointer">
              Using a client that can't sign in? Use your personal key URL
            </summary>
            <p className="text-sm text-muted mt-3">
              Some MCP clients (and quick command-line tests) don't run the approval flow. This link authenticates as you all by
              itself — <strong className="text-ink-strong">treat it like a password</strong>.
            </p>
            {showKey && (
              <div className="mt-3">
                <code className="font-utility text-xs text-ink break-all block">{keyUrl ?? 'Minting your key…'}</code>
                <button
                  type="button"
                  onClick={() => copy('key')}
                  disabled={!keyUrl}
                  className="mt-3 text-sm font-display font-semibold text-accent hover:underline disabled:opacity-50"
                >
                  {copied === 'key' ? 'Copied ✓' : 'Copy key URL'}
                </button>
              </div>
            )}
          </details>
        </div>

        {steps.map((s, i) => (
          <div key={s.tool} className="mt-7 anim-rise" style={{ animationDelay: `${140 + i * 60}ms` }}>
            <h2 className="font-display font-semibold text-ink-strong text-xl">In {s.tool}</h2>
            <ol className="mt-3 flex flex-col gap-2">
              {s.steps.map((step, j) => (
                <li key={j} className="flex gap-3 text-sm text-ink">
                  <span className="font-utility text-xs text-muted pt-0.5 shrink-0">{j + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        ))}

        <div className="mt-8">
          <h2 className="font-display font-semibold text-ink-strong text-xl">Things worth saying to it</h2>
          <ul className="mt-3 flex flex-col gap-2">
            {ASK_EXAMPLES.map((ex) => (
              <li key={ex} className="text-sm text-ink">{ex}</li>
            ))}
          </ul>
          <p className="text-sm text-muted mt-3">
            Everything you earn there counts here — knowledge checks, scenario rounds, graded activities, completions. The tutor
            can only mark a module complete after you pass its check, same bar as this app; your predictions, your capstone build,
            and notes from the human review desk all travel with you.
          </p>
        </div>

        <p className="text-sm text-muted mt-8">
          Connector menus move around as these products evolve — the shape of the steps holds: add a custom connector, paste your
          course URL, approve it, ask for a module.
        </p>

        <p className="mt-8 text-sm">
          <Link to="/path" className="text-accent font-semibold no-underline hover:underline">← Back to the module library</Link>
        </p>
      </div>
    </Screen>
  );
}
