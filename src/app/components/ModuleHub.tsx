import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { MeResponse, ModuleCapabilities, ModuleCard, ModuleMcpActivity } from '../../shared/types';
import { PODCAST_SHOW } from '../../shared/types';
import PodcastPanel from './PodcastPanel';

// The module page's style-aware pieces. One chassis, one variable: the
// learner's first-choice style fills the lead slot at the top of the read
// and orders the spine's ways-in. Everything else — the read, the command
// bar, the finish card — is style-independent and lives in ModuleView.

export type ModuleStyle = 'reading' | 'podcast' | 'interactive' | 'quiz_first' | 'assistant_mcp';

export function styleOf(me: MeResponse | null): ModuleStyle {
  const first = me?.prefs?.styles?.[0];
  if (first === 'podcast' || first === 'quiz_first' || first === 'assistant_mcp' || first === 'interactive') return first;
  if (first === 'voice') return 'interactive'; // legacy sessions — voice rides the hands-on variant
  return 'reading';
}

export const STYLE_LABELS: Record<ModuleStyle, string> = {
  reading: 'reading',
  podcast: 'podcast',
  interactive: 'hands-on',
  quiz_first: 'test me first',
  assistant_mcp: 'in your AI tool',
};

// Voice-legacy sessions keep their spoken tutor entrance; nobody can select
// voice at intake anymore, but the link should still honor old prefs.
export function tutorHref(me: MeResponse | null, moduleId: string): string {
  return me?.prefs?.styles?.[0] === 'voice' ? `/module/${moduleId}/chat?voice=1` : `/module/${moduleId}/chat`;
}

function WayIcon({ name }: { name: string }) {
  const paths: Record<string, string> = {
    listen: 'M2 5v4M5 3v8M8 1v12M11 4v6',
    tutor: 'M1.5 2.5h11v7h-6l-3 3v-3h-2z',
    micro: 'M7 4v3l2 2M12.5 7a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z',
    activity: 'M2 7l3.5 3.5L12 4',
    sorting: 'M2 3h4v4H2zM8 7h4v4H8zM8 3h4M2 9h4',
    mcp: 'M7 1v4M4.5 5h5l-1 4h-3zM7 9v4',
  };
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="shrink-0 text-muted">
      <path d={paths[name] ?? paths.activity} />
    </svg>
  );
}

type Way = {
  key: string;
  icon: string;
  label: string;
  meta: string;
  tag?: string;
  to?: string;
  onClick?: () => void;
};

function waysFor(opts: {
  style: ModuleStyle;
  me: MeResponse | null;
  moduleId: string;
  capabilities: ModuleCapabilities;
  listenOpen: boolean;
  onToggleListen: () => void;
  onJumpToLead: () => void;
  sortingAnchorId?: string;
}): Way[] {
  const { style, me, moduleId, capabilities, listenOpen, onToggleListen, onJumpToLead, sortingAnchorId } = opts;
  const listen: Way | null = capabilities.podcast
    ? style === 'podcast'
      ? { key: 'listen', icon: 'listen', label: 'Episode', meta: 'above', tag: 'Your style', onClick: onJumpToLead }
      : { key: 'listen', icon: 'listen', label: listenOpen ? 'Listening — player above' : 'Listen', meta: '~18 min', onClick: onToggleListen }
    : null;
  const tutor: Way | null = capabilities.chat
    ? {
        key: 'tutor',
        icon: 'tutor',
        label: 'Tutor',
        meta: 'chat · voice',
        to: tutorHref(me, moduleId),
        tag: style === 'interactive' ? 'Your style' : undefined,
      }
    : null;
  const sorting: Way | null =
    capabilities.sorting && sortingAnchorId
      ? {
          key: 'sorting',
          icon: 'sorting',
          label: 'Sorting exercise',
          meta: 'in the read',
          onClick: () => document.getElementById(sortingAnchorId)?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
        }
      : null;
  const micro: Way | null = capabilities.micro
    ? { key: 'micro', icon: 'micro', label: 'Two-minute version', meta: '2 min', to: `/module/${moduleId}/micro` }
    : null;
  const activity: Way | null = capabilities.activity
    ? { key: 'activity', icon: 'activity', label: 'Applied activity', meta: 'graded', to: `/module/${moduleId}/activity` }
    : null;
  const mcp: Way | null =
    style === 'assistant_mcp' ? { key: 'mcp', icon: 'mcp', label: 'In your AI tool', meta: 'above', tag: 'Your style', onClick: onJumpToLead } : null;

  const order: (Way | null)[] =
    style === 'podcast' ? [listen, tutor, micro, activity]
    : style === 'interactive' ? [tutor, sorting, listen, micro, activity]
    : style === 'quiz_first' ? [tutor, listen, micro, activity]
    : style === 'assistant_mcp' ? [mcp, listen, tutor, micro, activity]
    : [listen, tutor, micro, activity];
  return order.filter(Boolean) as Way[];
}

// The spine: lesson-grouped contents whose track fills as the learner reads,
// the other ways into the module, and the finish action — pinned, so the
// module's exit never scrolls away. Desktop only; the command bar carries
// progress + finish on small screens.
export function ModuleRail({
  module,
  capabilities,
  style,
  me,
  sections,
  activeSection,
  progress,
  estReadMinutes,
  courseLabel,
  moduleNumber,
  listenOpen,
  onToggleListen,
  onJumpToLead,
  sortingAnchorId,
}: {
  module: ModuleCard;
  capabilities: ModuleCapabilities;
  style: ModuleStyle;
  me: MeResponse | null;
  sections: { id: string; title: string }[];
  activeSection: string | null;
  progress: number;
  estReadMinutes: number;
  // On a short course both of these come from the short course rather than
  // the module's home course — its label, and its position in the order the
  // short course declares. The 101/201/301 tier is not a short course's
  // business.
  courseLabel: string;
  moduleNumber: number;
  listenOpen: boolean;
  onToggleListen: () => void;
  onJumpToLead: () => void;
  sortingAnchorId?: string;
}) {
  const ways = waysFor({ style, me, moduleId: module.id, capabilities, listenOpen, onToggleListen, onJumpToLead, sortingAnchorId });
  return (
    <nav className="hidden lg:block sticky top-24 self-start" aria-label="Contents">
      <p className="label-utility">{courseLabel} · Module {moduleNumber} · ~{estReadMinutes} min</p>
      <div className="relative mt-3 pl-4">
        <span aria-hidden="true" className="absolute left-0 top-1 bottom-1 w-0.5 rounded bg-line" />
        <span
          aria-hidden="true"
          className="absolute left-0 top-1 w-0.5 rounded bg-accent transition-[height] duration-150"
          style={{ height: `calc(${progress} * (100% - 0.5rem))` }}
        />
        <ul className="flex flex-col">
          {sections.map((s) => {
            const lesson = s.title.match(/^(Lesson \d+)\s*·\s*(.+)$/);
            const on = activeSection === s.id;
            return (
              <li key={s.id}>
                <a href={`#${s.id}`} className={`block py-1.5 text-[0.8rem] leading-snug no-underline ${on ? 'text-ink-strong font-semibold' : 'text-muted hover:text-ink'}`}>
                  {lesson && (
                    <span className={`block font-utility text-[0.6rem] uppercase tracking-wider ${on ? 'text-accent' : 'text-muted'}`}>{lesson[1]}</span>
                  )}
                  {lesson ? lesson[2] : s.title}
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      {ways.length > 0 && (
        <div className="mt-7 border-t border-line pt-4">
          <p className="font-utility text-[0.62rem] uppercase tracking-wider text-muted mb-1.5">
            {style === 'reading' ? 'Other ways in' : 'Your ways in'}
          </p>
          {ways.map((w) => {
            const body = (
              <>
                <WayIcon name={w.icon} />
                <span className="font-display font-semibold text-[0.85rem] text-ink-strong group-hover:text-accent transition-colors">{w.label}</span>
                {w.tag && (
                  <span className="font-utility text-[0.55rem] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-signal text-on-signal shrink-0">{w.tag}</span>
                )}
                <span className="font-utility text-[0.62rem] text-muted ml-auto whitespace-nowrap">{w.meta}</span>
              </>
            );
            const className = 'group flex items-center gap-2.5 py-1.5 w-full text-left no-underline';
            return w.to ? (
              <Link key={w.key} to={w.to} className={className}>{body}</Link>
            ) : (
              <button key={w.key} onClick={w.onClick} className={className}>{body}</button>
            );
          })}
          {style === 'podcast' && (
            <Link
              to={me?.shortCourse ? '/plan' : '/path'}
              className="block mt-1.5 text-[0.78rem] font-semibold text-accent no-underline hover:underline"
            >
              More episodes — the rest of the course →
            </Link>
          )}
        </div>
      )}

      {capabilities.knowledgeCheck && (
        <Link
          to={`/module/${module.id}/check`}
          className="block mt-4 text-center rounded-brand bg-accent text-on-accent no-underline px-3 py-2.5 hover:brightness-110"
        >
          <span className="font-display font-semibold text-[0.85rem]">{style === 'quiz_first' ? 'Take the check now' : 'Finish · Knowledge check'}</span>
          <span className="block font-display text-[0.68rem] opacity-80">
            {style === 'quiz_first' ? 'your style · 60%+ tests you out' : '60%+ tests you out · retakes free'}
          </span>
        </Link>
      )}
    </nav>
  );
}

// Copy-to-clipboard starter prompts for learners who do their learning
// inside Claude or ChatGPT. Templated from the module itself, so every
// module gets prompts with zero content changes.
function StarterPrompts({ module }: { module: ModuleCard }) {
  const [copied, setCopied] = useState<number | null>(null);
  const prompts = [
    `I'm working through an AI-fluency course for People leaders. This module is "${module.title}": ${module.blurb} Teach it to me in conversation — short pieces, one question at a time to check I've actually got it.`,
    `Quiz me on "${module.title}" with realistic HR scenarios, one at a time. After five questions, tell me my pattern: where I over-trust AI and where I under-trust it.`,
    `Here's a real task from my week: [describe it]. Using the ideas in "${module.title}" (${module.blurb}), walk me through how I should hand it to AI — and exactly what I must verify myself.`,
  ];
  const copy = async (text: string, i: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(i);
      setTimeout(() => setCopied((c) => (c === i ? null : c)), 2000);
    } catch {
      // Clipboard blocked — the text is visible to select by hand.
    }
  };
  return (
    <ul className="mt-3 flex flex-col gap-2">
      {prompts.map((p, i) => (
        <li key={i} className="border border-line rounded-brand bg-surface px-4 py-3 flex items-start justify-between gap-3">
          <p className="text-[0.85rem] text-ink leading-relaxed">{p}</p>
          <button
            onClick={() => void copy(p, i)}
            className="font-utility text-[0.65rem] uppercase tracking-wider text-accent hover:text-ink-strong shrink-0 pt-0.5"
          >
            {copied === i ? 'Copied ✓' : 'Copy'}
          </button>
        </li>
      ))}
    </ul>
  );
}

// Relative dates for the MCP touch record — legible, never precise-sounding.
function ago(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / (24 * 60 * 60 * 1000));
  if (days <= 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

const TOUCH_LABELS: Record<string, (detail: string | null) => string> = {
  taught: (d) => (d ? `Your assistant taught ${d}` : 'Your assistant taught this module'),
  quizzed: (d) => `Knowledge check from your assistant — ${d ?? 'attempted'}`,
  applied: (d) => (d ? `Applied to your work: “${d}”` : 'Applied to a task from your week'),
  teach_back: (d) => `Teach-back graded${d ? ` ${d}` : ''}`,
  predicted: () => 'Opening prediction recorded in conversation',
  completed: () => 'Completed from your assistant — same record as here',
};

// The MCP lead: setup + starter prompts when the connection is cold, and the
// honest record of assistant-side work on this module once it's warm — the
// page's proof that "progress there counts here" is real.
function McpLead({ module, mcp }: { module: ModuleCard; mcp: ModuleMcpActivity }) {
  return (
    <div className="mt-6 border border-accent rounded-brand bg-accent/[0.04] p-5">
      <p className="label-utility">Your style · inside Claude or ChatGPT</p>
      <h2 className="font-display font-semibold text-ink-strong text-xl mt-2">Learn this module in your own AI tool.</h2>
      {mcp.everUsed ? (
        <>
          <p className="text-sm text-ink mt-2 flex items-center gap-2">
            <span aria-hidden="true" className="w-2 h-2 rounded-full bg-success shrink-0" />
            Connection live — work you do there lands on the same record as this page.
          </p>
          {mcp.touches.length > 0 ? (
            <ul className="mt-3 flex flex-col gap-1.5">
              {mcp.touches.map((touch) => (
                <li key={touch.kind} className="flex items-baseline justify-between gap-3 border-b border-line/60 last:border-b-0 pb-1.5">
                  <span className="text-[0.85rem] text-ink">{(TOUCH_LABELS[touch.kind] ?? (() => touch.kind))(touch.detail)}</span>
                  <span className="font-utility text-[0.62rem] text-muted whitespace-nowrap">{ago(touch.at)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-ink mt-2">Your assistant hasn't opened this module yet. These prompts start it:</p>
          )}
        </>
      ) : (
        <p className="text-sm text-ink mt-2">
          Connect the course to your assistant once —{' '}
          <Link to="/mcp" className="text-accent font-semibold no-underline hover:underline">setup instructions here</Link> — then
          start the conversation. These prompts get a real discussion going, with or without the connection:
        </p>
      )}
      <StarterPrompts module={module} />
      {mcp.everUsed && (
        <p className="text-[0.78rem] text-muted mt-3">
          <Link to="/mcp" className="text-accent font-semibold no-underline hover:underline">Connection setup →</Link>
        </p>
      )}
    </div>
  );
}

// The lead slot: what the learner's stated style puts between the module
// header and the read. Readers get nothing — that absence is the design.
export function ModuleLead({
  module,
  capabilities,
  style,
  me,
  mcp,
  listenOpen,
  sortingAnchorId,
}: {
  module: ModuleCard;
  capabilities: ModuleCapabilities;
  style: ModuleStyle;
  me: MeResponse | null;
  mcp: ModuleMcpActivity;
  listenOpen: boolean;
  sortingAnchorId?: string;
}) {
  const moduleId = module.id;

  // Mounting the panel starts episode generation, so it stays unmounted until
  // asked for — except for podcast-first learners, whose arrival is the ask.
  const listenPanel =
    listenOpen && style !== 'podcast' && capabilities.podcast ? (
      <div className="mt-4 border border-line rounded-brand bg-bg p-5 anim-fade">
        <p className="label-utility">{PODCAST_SHOW.name} · this module as an episode</p>
        <PodcastPanel moduleId={moduleId} />
      </div>
    ) : null;

  if (style === 'podcast' && capabilities.podcast) {
    return (
      <div className="mt-6 border border-accent rounded-brand bg-accent/[0.04] p-5">
        <p className="label-utility">Your style · this module is an episode of {PODCAST_SHOW.name}</p>
        <PodcastPanel moduleId={moduleId} />
      </div>
    );
  }

  if (style === 'quiz_first' && capabilities.knowledgeCheck) {
    return (
      <>
        <div className="mt-6 border border-accent rounded-brand bg-accent/[0.04] p-5">
          <p className="label-utility">Your style · test me first</p>
          <h2 className="font-display font-semibold text-ink-strong text-xl mt-2">Start with the quiz.</h2>
          <p className="text-sm text-ink mt-2">
            Score 60%+ and this module is finished — anything it unlocks, unlocked. Miss questions and the results point you at
            exactly which lesson below to study. Retakes are free and unlimited.
          </p>
          <Link
            to={`/module/${moduleId}/check`}
            className="inline-flex mt-4 items-center px-5 py-2.5 font-display font-semibold text-[0.95rem] rounded-brand bg-accent text-on-accent hover:brightness-110 no-underline"
          >
            Take the knowledge check →
          </Link>
        </div>
        {listenPanel}
      </>
    );
  }

  if (style === 'assistant_mcp') {
    return (
      <>
        <McpLead module={module} mcp={mcp} />
        {listenPanel}
      </>
    );
  }

  if (style === 'interactive') {
    // Two doors, not six: the genuinely hands-on entrances lead; the spine
    // carries everything else.
    const doors: { key: string; title: string; detail: string; tag?: string; to?: string; onClick?: () => void; emphasis?: boolean }[] = [];
    if (capabilities.chat) {
      doors.push({
        key: 'tutor',
        title: 'Talk it through with the tutor',
        detail: 'The same material in conversation — lecturettes, questions, your pace. Type or speak.',
        tag: 'Your style',
        to: tutorHref(me, moduleId),
        emphasis: true,
      });
    }
    if (capabilities.sorting && sortingAnchorId) {
      doors.push({
        key: 'sorting',
        title: 'Jump to the sorting exercise',
        detail: 'Live and graded: real tasks, your calls, an honest pattern read at the end.',
        onClick: () => document.getElementById(sortingAnchorId)?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
      });
    } else if (capabilities.activity) {
      doors.push({
        key: 'activity',
        title: 'Applied activity',
        detail: 'Real work from your week, AI-graded against a rubric. Unlimited resubmission.',
        to: `/module/${moduleId}/activity`,
      });
    }
    if (!doors.length) return listenPanel;
    return (
      <>
        <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
          {doors.map((door) => {
            const className = `text-left border rounded-brand px-5 py-4 transition-colors w-full h-full no-underline block ${
              door.emphasis ? 'border-accent bg-accent/[0.04] hover:border-ink-strong' : 'border-line bg-surface hover:border-ink-strong'
            }`;
            const body = (
              <>
                <span className="flex items-center justify-between gap-3">
                  <span className="font-display font-semibold text-ink-strong">{door.title}</span>
                  {door.tag && (
                    <span className="font-utility text-[0.6rem] uppercase tracking-wider px-2 py-0.5 rounded-full bg-signal text-on-signal shrink-0">{door.tag}</span>
                  )}
                </span>
                <span className="block text-ink mt-1 text-sm">{door.detail}</span>
              </>
            );
            return door.to ? (
              <Link key={door.key} to={door.to} className={className}>{body}</Link>
            ) : (
              <button key={door.key} onClick={door.onClick} className={className}>{body}</button>
            );
          })}
        </div>
        {listenPanel}
      </>
    );
  }

  // Reading (and unstated): the lead slot is empty — straight into the read.
  return listenPanel;
}
