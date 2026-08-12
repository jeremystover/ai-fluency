import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { track } from '../api';

// "How is this training different?" — the marketing story, told honestly:
// each differentiator is tagged with what's live in this demo vs roadmap.

const DIFFERENTIATORS: { title: string; body: string; tag: 'in this demo' | 'roadmap' }[] = [
  {
    title: 'Built for People teams',
    body: 'Not a general AI course with an HR example bolted on. The whole ladder is written for one function, and at 301 it splits by role — the role you pick at intake resolves to your own specialist track, and the others disappear from your path. Each track is discovered from the job rather than adapted from a template, so the recruiter\'s intake module and the comp lead\'s craft layer exist in no other track. Three tracks are live here; People Ops, People Analytics, and Labor & Employee Relations are outlined next.',
    tag: 'in this demo',
  },
  {
    title: 'Hyper-personalization',
    body: 'Nothing launches at you until you\'ve said how you want this to go: where to start, how much time you have, how you like to learn, what you\'re after. The course composes a plan around your answers — and recomposes it whenever you change them.',
    tag: 'in this demo',
  },
  {
    title: 'Self-freshening content',
    body: 'Every module separates stable concepts from volatile specifics — model names, prices, regulations. The volatile layer refreshes on its own cadence without touching the concepts, and every page shows honest version stamps computed from the content itself, so you always know what was checked and when.',
    tag: 'in this demo',
  },
  {
    title: 'Just-in-time, wherever you work',
    body: 'The course ships as an MCP server, so Claude or ChatGPT can teach it inside the tools you already use — a two-minute concept exactly when a real task needs it, not a training portal you have to remember to visit.',
    tag: 'roadmap',
  },
  {
    title: 'Interactive chat Q&A',
    body: 'Ask the course questions in plain language — about a lesson, your own situation, or the thing you\'re stuck on right now — and get answers grounded in the curriculum, not a generic chatbot.',
    tag: 'roadmap',
  },
  {
    title: 'LLM-driven knowledge checks and role plays',
    body: 'Applied work is graded by AI against a real rubric, with per-dimension feedback in seconds and unlimited resubmission. Next: role plays — practice the vendor question or the difficult conversation against a model that plays the other side.',
    tag: 'in this demo',
  },
];

export default function DifferenceModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    track('difference_opened');
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  // Portal to <body>: the header's backdrop-filter would otherwise become the
  // containing block for this fixed overlay and clip it.
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="difference-title"
    >
      <div className="absolute inset-0 bg-ink-strong/50 anim-fade" onClick={onClose} aria-hidden="true" />
      <div className="relative bg-surface border border-line-strong rounded-brand max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 anim-rise shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="label-utility">AI-centric learning</p>
            <h2 id="difference-title" className="font-display font-bold text-ink-strong text-2xl mt-2 leading-tight">
              This isn't e-learning with a chatbot bolted on.
            </h2>
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 w-8 h-8 flex items-center justify-center rounded-brand border border-line hover:border-ink-strong text-ink-strong font-utility"
          >
            ✕
          </button>
        </div>
        <p className="text-ink text-sm mt-3">
          It's a course built AI-first, for one function — the model is in the architecture, not the margins. Six things you
          won't find in an LMS:
        </p>
        <ol className="mt-5 flex flex-col gap-4">
          {DIFFERENTIATORS.map((d, i) => (
            <li key={d.title} className="border-t border-line pt-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display font-semibold text-ink-strong">
                  <span className="font-utility text-xs text-muted mr-2">{i + 1}</span>
                  {d.title}
                </h3>
                <span
                  className={`font-utility text-[0.6rem] uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${
                    d.tag === 'in this demo' ? 'bg-signal text-on-signal' : 'border border-line-strong text-muted'
                  }`}
                >
                  {d.tag}
                </span>
              </div>
              <p className="text-sm text-ink mt-1.5 leading-relaxed">{d.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>,
    document.body,
  );
}
