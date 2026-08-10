import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { Screen, ErrorNote } from '../components/ui';

// The course as an MCP server, live. Each learner gets a personal connector
// URL (their signed session key in the path) minted by /api/mcp/connection —
// progress made inside Claude or ChatGPT and progress made here are the same
// record, so the page's main job is handing over that URL plus honest steps.

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
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api
      .get<{ url: string }>('/api/mcp/connection')
      .then((r) => setUrl(r.url))
      .catch((e: Error) => setError(e.message));
  }, []);

  const copy = () => {
    if (!url) return;
    navigator.clipboard?.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const steps: { tool: string; steps: string[] }[] = [
    {
      tool: 'Claude (claude.ai or desktop)',
      steps: [
        'Open Settings → Connectors → "Add custom connector".',
        'Paste your personal course URL from above; no extra auth step — the key is in the URL.',
        'Approve the connection. The course appears as tools Claude can call, and /learn, /quiz, and /whats-next show up as prompts.',
        'Start a chat: "Teach me the next module of the AI fluency course." Claude pulls your real progress and teaches from the live content.',
      ],
    },
    {
      tool: 'Claude Code',
      steps: [
        'Run: claude mcp add --transport http ai-fluency <your personal URL>',
        'Then in any session: "Quiz me on module ai101-m1" — or use the /learn prompt.',
      ],
    },
    {
      tool: 'ChatGPT',
      steps: [
        'Open Settings → Connectors and enable Developer Mode if your workspace requires it for custom connectors.',
        'Add a new connector with your personal course URL.',
        'Approve it for your chats, then ask: "Quiz me on Module 1 of the AI fluency course."',
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
          <h2 className="font-display font-semibold text-ink-strong text-xl">Your personal course URL</h2>
          {error && <div className="mt-3"><ErrorNote message={error} /></div>}
          {!error && (
            <div className="mt-3 border border-line rounded-brand bg-surface px-4 py-3">
              <code className="font-utility text-xs text-ink break-all block">{url ?? 'Minting your key…'}</code>
              <button
                type="button"
                onClick={copy}
                disabled={!url}
                className="mt-3 text-sm font-display font-semibold text-accent hover:underline disabled:opacity-50"
              >
                {copied ? 'Copied ✓' : 'Copy URL'}
              </button>
            </div>
          )}
          <p className="text-sm text-muted mt-2">
            This link is yours: it carries a signed key to your course record, so anyone holding it learns as you. Treat it like a
            password; re-entering the course with your passcode mints a fresh one.
          </p>
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
