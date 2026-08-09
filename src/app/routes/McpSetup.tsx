import { Link } from 'react-router-dom';
import { Screen } from '../components/ui';

// Setup instructions for learners who want the course inside Claude or
// ChatGPT. The MCP server itself is rolling out; the steps below are the
// honest shape of the connection, and the starter prompts on every module
// page work today with no setup at all.

const STEPS: { tool: string; steps: string[] }[] = [
  {
    tool: 'Claude',
    steps: [
      'Open Settings → Connectors.',
      'Choose "Add custom connector" and paste your organization\'s course server URL (your program admin has it).',
      'Approve the connection. The course appears as a tool Claude can call.',
      'Start a chat: "Teach me Module 1 of the AI fluency course." Claude pulls the real module content and teaches from it.',
    ],
  },
  {
    tool: 'ChatGPT',
    steps: [
      'Open Settings → Connectors and enable Developer Mode if your workspace requires it for custom connectors.',
      'Add a new connector with your organization\'s course server URL.',
      'Approve the connection for your chats.',
      'Ask: "Quiz me on Module 1 of the AI fluency course." ChatGPT pulls the module and runs the session.',
    ],
  },
];

export default function McpSetup() {
  return (
    <Screen>
      <div className="pt-12 sm:pt-16 max-w-xl">
        <p className="label-utility anim-fade">Learn inside your AI tools</p>
        <h1 className="font-display font-bold text-ink-strong text-3xl sm:text-4xl mt-3 leading-tight anim-rise">
          The course, right in Claude or ChatGPT.
        </h1>
        <p className="text-ink mt-4 anim-rise" style={{ animationDelay: '60ms' }}>
          The course ships as an MCP server — a connection your assistant can teach from. That means a two-minute concept exactly
          when a real task needs it, inside the tool where the task lives, instead of a training portal you have to remember to visit.
        </p>

        <div className="mt-5 border border-signal rounded-brand bg-signal/10 px-4 py-3 anim-rise" style={{ animationDelay: '90ms' }}>
          <p className="text-sm text-ink">
            <span className="font-display font-semibold">Rolling out.</span> The connection is being enabled per organization — your
            program admin will share your course server URL. Until yours is live, the starter prompts on every module page work in
            any assistant today, no setup needed.
          </p>
        </div>

        {STEPS.map((s, i) => (
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

        <p className="text-sm text-muted mt-8">
          Connector menus move around as these products evolve — the shape of the steps holds: add a custom connector, paste the
          course URL, approve it, ask for a module.
        </p>

        <p className="mt-8 text-sm">
          <Link to="/path" className="text-accent font-semibold no-underline hover:underline">← Back to the module library</Link>
        </p>
      </div>
    </Screen>
  );
}
