import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { ModuleCapabilities, ModuleCard, PathModule } from '../../shared/types';
import { PODCAST_SHOW } from '../../shared/types';
import { api } from '../api';
import { useApp } from '../brand';

// The modality-aware top of every module page. One module, many ways in —
// arranged around the learner's first-choice style: podcast-first learners
// get an episode-oriented home with the rest of the course as a playlist,
// hands-on learners get a tile grid, in-your-AI-tool learners get setup +
// starter prompts, and readers get a quiet row above the read. The knowledge
// check is on every variant: it is how a module is finished — or tested out.

type Tile = {
  key: string;
  title: string;
  detail: string;
  tag?: string;
  to?: string;
  onClick?: () => void;
  emphasis?: boolean;
};

function TileCard({ tile, big }: { tile: Tile; big?: boolean }) {
  const className = `text-left border rounded-brand bg-surface transition-colors w-full h-full no-underline block ${
    big ? 'px-5 py-4' : 'px-4 py-3'
  } ${tile.emphasis ? 'border-accent bg-accent/[0.04] hover:border-ink-strong' : 'border-line hover:border-ink-strong'}`;
  const body = (
    <>
      <span className="flex items-center justify-between gap-3">
        <span className={`font-display font-semibold text-ink-strong ${big ? '' : 'text-[0.95rem]'}`}>{tile.title}</span>
        {tile.tag && (
          <span className="font-utility text-[0.6rem] uppercase tracking-wider px-2 py-0.5 rounded-full bg-signal text-on-signal shrink-0">
            {tile.tag}
          </span>
        )}
      </span>
      <span className={`block text-ink mt-1 ${big ? 'text-sm' : 'text-[0.8rem]'}`}>{tile.detail}</span>
    </>
  );
  return tile.to ? (
    <Link to={tile.to} className={className}>{body}</Link>
  ) : (
    <button onClick={tile.onClick} className={className}>{body}</button>
  );
}

function Section({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <div className="mt-6">
      {label && <p className="label-utility mb-2">{label}</p>}
      {children}
    </div>
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

// The rest of the course, framed as a playlist — the podcast-first learner's
// module page is their episode hub, and other modules are other episodes.
// Rows link straight into each module's episode page.
function EpisodePlaylist({ currentId }: { currentId: string }) {
  const [modules, setModules] = useState<PathModule[] | null>(null);
  useEffect(() => {
    api.get<{ modules: PathModule[] }>('/api/path').then((d) => setModules(d.modules)).catch(() => {});
  }, []);
  if (!modules) return null;
  return (
    <Section label="More episodes · the rest of the course">
      <ul className="flex flex-col gap-1.5">
        {modules.map((m) => {
          const current = m.id === currentId;
          const row = (
            <span className="flex items-baseline justify-between gap-3">
              <span className={`font-display font-semibold text-[0.95rem] ${current ? 'text-accent' : 'text-ink-strong'}`}>
                {m.ordinal}. {m.title}
                {current && <span className="font-utility text-[0.6rem] uppercase tracking-wider ml-2">● This module</span>}
              </span>
              <span className="font-utility text-[0.65rem] uppercase tracking-wider text-muted shrink-0">
                {m.completed ? 'Done · ' : ''}{m.access === 'open' ? `~${m.estMinutes} min` : 'Full course'}
              </span>
            </span>
          );
          return (
            <li key={m.id}>
              {m.access === 'open' && !current ? (
                <Link to={`/module/${m.id}/podcast`} className="block border border-line rounded-brand bg-surface px-4 py-2.5 no-underline hover:border-ink-strong transition-colors">
                  {row}
                </Link>
              ) : (
                <div className={`border rounded-brand px-4 py-2.5 ${current ? 'border-accent bg-accent/[0.04]' : 'border-line bg-surface opacity-60'}`}>
                  {row}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

export default function ModuleHub({
  module,
  capabilities,
  sortingAnchorId,
}: {
  module: ModuleCard;
  capabilities: ModuleCapabilities;
  sortingAnchorId?: string;
}) {
  const { me } = useApp();
  const primary = me?.prefs?.styles?.[0] ?? 'reading';
  const moduleId = module.id;

  const listenTile: Tile | null = capabilities.podcast
    ? {
        key: 'listen',
        title: 'Listen to this module',
        detail: `${PODCAST_SHOW.name}: two hosts talk it through as an episode made for you — outline, takeaways, and all.`,
        to: `/module/${moduleId}/podcast`,
        tag: primary === 'podcast' ? 'Your style' : undefined,
      }
    : null;
  const tutorTile: Tile | null = capabilities.chat
    ? {
        key: 'tutor',
        title: primary === 'voice' ? 'Talk it through with the tutor' : 'Discuss with the tutor',
        detail: 'The same material in conversation — lecturettes, questions, your pace. Type or speak.',
        to: primary === 'voice' ? `/module/${moduleId}/chat?voice=1` : `/module/${moduleId}/chat`,
        tag: primary === 'interactive' || primary === 'voice' ? 'Your style' : undefined,
      }
    : null;
  const sortingTile: Tile | null =
    capabilities.sorting && sortingAnchorId
      ? {
          key: 'sorting',
          title: 'The sorting exercise',
          detail: 'Live and graded: real tasks, your calls, an honest pattern read at the end.',
          onClick: () => document.getElementById(sortingAnchorId)?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
        }
      : null;
  const activityTile: Tile | null = capabilities.activity
    ? {
        key: 'activity',
        title: 'Applied activity',
        detail: 'Real work from your week, AI-graded against a rubric. Unlimited resubmission.',
        to: `/module/${moduleId}/activity`,
      }
    : null;
  const microTile: Tile | null = capabilities.micro
    ? {
        key: 'micro',
        title: 'The two-minute version',
        detail: 'The key concepts, cut for a short sitting. The full module keeps.',
        to: `/module/${moduleId}/micro`,
      }
    : null;
  // The quiz is on every variant: it is how the module is finished, and how
  // it is tested out of — 60%+ clears anything this module unlocks.
  const checkTile: Tile | null = capabilities.knowledgeCheck
    ? {
        key: 'check',
        title: 'Knowledge check',
        detail: 'Finish the module here — or test out of it. 60%+ clears anything this module unlocks. Retakes are free.',
        to: `/module/${moduleId}/check`,
        tag: 'Finish · test out',
        emphasis: true,
      }
    : null;

  const compactTiles = (tiles: (Tile | null)[]) => {
    const list = tiles.filter(Boolean) as Tile[];
    return (
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((tile) => <TileCard key={tile.key} tile={tile} />)}
      </div>
    );
  };

  if (primary === 'podcast' && capabilities.podcast) {
    return (
      <div className="mt-6">
        <div className="border border-accent rounded-brand bg-accent/[0.04] p-5">
          <p className="label-utility">Your style · learning by listening</p>
          <h2 className="font-display font-semibold text-ink-strong text-xl mt-2">This module is an episode of {PODCAST_SHOW.name}.</h2>
          <p className="text-sm text-ink mt-2">
            Made for one listener — you. Playback starts in seconds, the outline follows along, and the hosts take your
            questions after you listen.
          </p>
          <Link
            to={`/module/${moduleId}/podcast`}
            className="inline-flex mt-4 items-center px-5 py-2.5 font-display font-semibold text-[0.95rem] rounded-brand bg-accent text-on-accent hover:brightness-110 no-underline"
          >
            Play this module →
          </Link>
        </div>
        <EpisodePlaylist currentId={moduleId} />
        <Section label="Other ways into this module">
          {compactTiles([checkTile, tutorTile, microTile, activityTile])}
        </Section>
        <p className="text-sm text-muted mt-4">Prefer to read after all? The full module is right below.</p>
      </div>
    );
  }

  if (primary === 'quiz_first' && capabilities.knowledgeCheck) {
    return (
      <div className="mt-6">
        <div className="border border-accent rounded-brand bg-accent/[0.04] p-5">
          <p className="label-utility">Your style · test me first</p>
          <h2 className="font-display font-semibold text-ink-strong text-xl mt-2">Start with the quiz.</h2>
          <p className="text-sm text-ink mt-2">
            Score 60%+ and this module is finished — anything it unlocks, unlocked. Miss questions and the results point you at
            exactly which lesson to study. Retakes are free and unlimited.
          </p>
          <Link
            to={`/module/${moduleId}/check`}
            className="inline-flex mt-4 items-center px-5 py-2.5 font-display font-semibold text-[0.95rem] rounded-brand bg-accent text-on-accent hover:brightness-110 no-underline"
          >
            Take the knowledge check →
          </Link>
        </div>
        <Section label="When you want the material itself">
          {compactTiles([tutorTile, listenTile, microTile, activityTile])}
        </Section>
        <p className="text-sm text-muted mt-4">The full read is below — your study links from the quiz land there.</p>
      </div>
    );
  }

  if (primary === 'assistant_mcp') {
    return (
      <div className="mt-6">
        <div className="border border-accent rounded-brand bg-accent/[0.04] p-5">
          <p className="label-utility">Your style · inside Claude or ChatGPT</p>
          <h2 className="font-display font-semibold text-ink-strong text-xl mt-2">Learn this module in your own AI tool.</h2>
          <p className="text-sm text-ink mt-2">
            Connect the course to your assistant once —{' '}
            <Link to="/mcp" className="text-accent font-semibold no-underline hover:underline">setup instructions here</Link> — then
            start the conversation. These prompts get a real discussion going, with or without the connection:
          </p>
          <StarterPrompts module={module} />
        </div>
        <Section label="Also here whenever you want them">
          {compactTiles([checkTile, listenTile, tutorTile, microTile])}
        </Section>
        <p className="text-sm text-muted mt-4">The full module read is below — the source your assistant should agree with.</p>
      </div>
    );
  }

  if (primary === 'interactive') {
    const list = [tutorTile, sortingTile, activityTile, checkTile, listenTile, microTile].filter(Boolean) as Tile[];
    return (
      <div className="mt-6">
        <p className="label-utility">You said you learn hands-on · pick a way in</p>
        <div className="grid gap-2.5 sm:grid-cols-2 mt-3">
          {list.map((tile) => <TileCard key={tile.key} tile={tile} big />)}
        </div>
        <p className="text-sm text-muted mt-4">The full read backs all of it, right below.</p>
      </div>
    );
  }

  // Readers (and everyone who didn't state a style): the read leads, the
  // other ways in sit quietly above it — including the quiz that finishes it.
  return (
    <div className="mt-6">
      {compactTiles([listenTile, tutorTile, checkTile])}
    </div>
  );
}
