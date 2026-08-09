import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { PodcastEpisode, PodcastLength, PodcastListResponse, PodcastOutlinePoint, PodcastSummary, PodcastVisual } from '../../shared/types';
import { PODCAST_HOSTS, PODCAST_SHOW } from '../../shared/types';
import { Screen, Button, ErrorNote } from '../components/ui';
import MicButton from '../components/MicButton';
import { api, ApiError, track } from '../api';
import { useApp } from '../brand';
import { chunkPlan, type AudioChunk } from '../../shared/audioChunks';

const LENGTH_OPTIONS: { id: PodcastLength; label: string; detail: string }[] = [
  { id: 'quick', label: 'Quick take', detail: '~3 min' },
  { id: 'standard', label: 'Standard', detail: '~6 min' },
  { id: 'deep', label: 'Deep dive', detail: '~10 min' },
];

const PLAYBACK_RATES = [1, 1.25, 1.5, 2];
const RATE_STORAGE_KEY = 'fd-podcast-rate';

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function fmtTime(sec: number) {
  const s = Math.max(0, Math.round(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

// The listener's map: the episode's main beats, lit up as playback passes them.
// Clicking a beat jumps the audio there (by the same character-proportion
// estimate the transcript highlight uses).
function OutlineRail({
  outline,
  activeLine,
  canSeek,
  onSeek,
}: {
  outline: PodcastOutlinePoint[];
  activeLine: number | null;
  canSeek: boolean;
  onSeek: (startLine: number) => void;
}) {
  const activePoint =
    activeLine === null ? -1 : outline.reduce((acc, pt, i) => (pt.startLine <= activeLine ? i : acc), -1);
  return (
    <aside className="mb-6 lg:mb-0 lg:sticky lg:top-24 lg:self-start" aria-label="Episode outline">
      <p className="label-utility mb-3">Follow along</p>
      <ol className="flex flex-col">
        {outline.map((pt, i) => {
          const state = i === activePoint ? 'active' : i < activePoint ? 'past' : 'next';
          return (
            <li
              key={i}
              className={`relative border-l-2 pl-4 pb-4 last:pb-0 ${
                state === 'active' ? 'border-accent' : state === 'past' ? 'border-success' : 'border-line'
              }`}
            >
              <span
                className={`absolute -left-[5px] top-1.5 w-2 h-2 rounded-full ${
                  state === 'active' ? 'bg-signal border border-ink-strong' : state === 'past' ? 'bg-success' : 'bg-surface border border-line-strong'
                }`}
                aria-hidden="true"
              />
              <button
                onClick={() => canSeek && onSeek(pt.startLine)}
                disabled={!canSeek}
                className={`text-left text-[0.8rem] leading-snug transition-colors ${
                  state === 'active' ? 'text-ink-strong font-semibold' : 'text-muted'
                } ${canSeek ? 'hover:text-ink cursor-pointer' : 'cursor-default'}`}
                aria-current={state === 'active' ? 'true' : undefined}
              >
                {pt.point}
              </button>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}

// Compact single-column transcript — the outline carries the structure now,
// so the text just needs to be followable, not the main event.
function Transcript({ episode, activeLine }: { episode: PodcastEpisode; activeLine: number | null }) {
  return (
    <ol className="mt-5 flex flex-col">
      {episode.lines.map((line, i) => {
        const isA = line.speaker === 'a';
        return (
          <li
            key={i}
            className={`flex gap-3 px-3 py-1.5 rounded-brand transition-colors ${activeLine === i ? 'bg-accent/[0.07]' : ''}`}
          >
            <span className={`label-utility w-9 shrink-0 pt-0.5 ${isA ? 'text-accent' : ''}`}>{PODCAST_HOSTS[line.speaker].name}</span>
            <p className={`text-sm leading-relaxed ${activeLine === i ? 'text-ink-strong' : 'text-ink'}`}>{line.text}</p>
          </li>
        );
      })}
    </ol>
  );
}

function KeyTakeaways({ items }: { items: string[] }) {
  return (
    <div className="border border-line rounded-brand bg-surface p-5 mt-5">
      <p className="label-utility">Key takeaways</p>
      <ul className="mt-3 flex flex-col gap-2">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2.5 text-sm text-ink leading-relaxed">
            <span className="text-signal mt-0.5 shrink-0" aria-hidden="true">●</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Split a short label into at most two SVG text lines.
function splitLabel(label: string, max = 15): string[] {
  if (label.length <= max) return [label];
  const words = label.split(' ');
  let first = '';
  let i = 0;
  while (i < words.length && (first ? `${first} ${words[i]}` : words[i]).length <= max) {
    first = first ? `${first} ${words[i]}` : words[i];
    i++;
  }
  if (!first) return [label.slice(0, max), label.slice(max)];
  return [first, words.slice(i).join(' ')].filter(Boolean);
}

// The episode's core idea as hub-and-spokes, laid out deterministically on an
// ellipse — brand colors via CSS custom properties, no graph library. Edge
// labels get a surface-colored halo (paint-order) so they stay legible where
// they cross lines.
function ConceptMap({ visual }: { visual: PodcastVisual }) {
  const W = 660;
  const H = 430;
  const cx = W / 2;
  const cy = H / 2;
  const n = visual.spokes.length;
  const pos = visual.spokes.map((_, i) => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    return { x: cx + Math.cos(angle) * 245, y: cy + Math.sin(angle) * 155 };
  });
  const mid = (a: { x: number; y: number }, b: { x: number; y: number }) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
  const hubLines = splitLabel(visual.hub, 14);

  return (
    <div className="border border-line rounded-brand bg-surface p-5 mt-5">
      <p className="label-utility">The map{visual.title ? ` · ${visual.title}` : ''}</p>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto mt-2" role="img" aria-label={`Concept map: ${visual.hub}`}>
        {/* cross-links first, dashed, under everything */}
        {visual.links.map((link, i) => {
          const a = pos[link.from];
          const b = pos[link.to];
          const m = mid(a, b);
          return (
            <g key={`l${i}`}>
              <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="var(--c-line-strong)" strokeWidth={1} strokeDasharray="4 4" />
              {link.label && (
                <text
                  x={m.x}
                  y={m.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={11}
                  fontStyle="italic"
                  fill="var(--c-muted)"
                  stroke="var(--c-surface)"
                  strokeWidth={4}
                  paintOrder="stroke"
                >
                  {link.label}
                </text>
              )}
            </g>
          );
        })}
        {/* hub→spoke edges with relation labels */}
        {pos.map((p, i) => {
          const m = mid({ x: cx, y: cy }, p);
          return (
            <g key={`e${i}`}>
              <line x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="var(--c-line-strong)" strokeWidth={1.5} />
              {visual.spokes[i].relation && (
                <text
                  x={m.x}
                  y={m.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={11}
                  fill="var(--c-muted)"
                  stroke="var(--c-surface)"
                  strokeWidth={4}
                  paintOrder="stroke"
                >
                  {visual.spokes[i].relation}
                </text>
              )}
            </g>
          );
        })}
        {/* spoke nodes */}
        {pos.map((p, i) => {
          const lines = splitLabel(visual.spokes[i].label);
          const h = lines.length > 1 ? 46 : 32;
          return (
            <g key={`n${i}`}>
              <rect x={p.x - 66} y={p.y - h / 2} width={132} height={h} rx={8} fill="var(--c-bg)" stroke="var(--c-line-strong)" />
              {lines.map((ln, j) => (
                <text
                  key={j}
                  x={p.x}
                  y={p.y + (lines.length > 1 ? (j === 0 ? -7 : 8) : 0)}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={12.5}
                  fontWeight={600}
                  fill="var(--c-ink-strong)"
                >
                  {ln}
                </text>
              ))}
            </g>
          );
        })}
        {/* hub on top */}
        <ellipse cx={cx} cy={cy} rx={82} ry={hubLines.length > 1 ? 42 : 34} fill="var(--c-accent)" />
        {hubLines.map((ln, j) => (
          <text
            key={j}
            x={cx}
            y={cy + (hubLines.length > 1 ? (j === 0 ? -8 : 9) : 0)}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={14}
            fontWeight={700}
            fill="var(--c-on-accent)"
          >
            {ln}
          </text>
        ))}
      </svg>
      {visual.insight && (
        <p className="text-sm text-ink mt-2 border-l-4 border-signal pl-3">
          <span className="font-display font-semibold text-ink-strong">What to see: </span>
          {visual.insight}
        </p>
      )}
    </div>
  );
}

function Player({
  episode,
  audioEnabled,
  onFirstPlay,
}: {
  episode: PodcastEpisode;
  audioEnabled: boolean;
  onFirstPlay?: () => void;
}) {
  // Audio arrives in chunks cut at speaker-turn boundaries: chunk 0 is small so
  // playback starts in seconds, and the player always fetches one chunk ahead
  // while the current one plays. Legacy single-file episodes are a one-chunk plan.
  const plan = useMemo<AudioChunk[]>(
    () => (episode.audioMode === 'single' ? [{ start: 0, end: episode.lines.length }] : chunkPlan(episode.lines)),
    [episode],
  );
  const chunkChars = useMemo(
    () => plan.map((ch) => episode.lines.slice(ch.start, ch.end).reduce((s, l) => s + l.text.length, 0)),
    [plan, episode],
  );
  const charsBeforeChunk = useMemo(() => {
    const out: number[] = [];
    let acc = 0;
    for (const n of chunkChars) {
      out.push(acc);
      acc += n;
    }
    return out;
  }, [chunkChars]);
  const totalChars = chunkChars.reduce((a, b) => a + b, 0);

  const audioRef = useRef<HTMLAudioElement>(null);
  const urls = useRef<(string | undefined)[]>([]);
  const durations = useRef<(number | undefined)[]>([]);
  const inFlight = useRef<Set<number>>(new Set());
  const played = useRef(false);
  const episodeKey = useRef<string | null>(null);

  const [chunkIdx, setChunkIdx] = useState(0);
  const [status, setStatus] = useState<'loading' | 'buffering' | 'ready' | 'failed'>('loading');
  const [failMessage, setFailMessage] = useState('');
  const [playing, setPlaying] = useState(false);
  const [rate, setRate] = useState(() => {
    const stored = Number(localStorage.getItem(RATE_STORAGE_KEY));
    return PLAYBACK_RATES.includes(stored) ? stored : 1;
  });
  const [activeLine, setActiveLine] = useState<number | null>(null);
  const [, setTick] = useState(0); // re-render on timeupdate so the bar moves

  const chunkUrl = (i: number) =>
    episode.audioMode === 'single' ? `/api/podcast/${episode.id}/audio` : `/api/podcast/${episode.id}/audio/${i}`;

  const ensureChunk = async (i: number): Promise<string> => {
    if (i < 0 || i >= plan.length) throw new Error('out of range');
    const existing = urls.current[i];
    if (existing) return existing;
    if (inFlight.current.has(i)) {
      while (inFlight.current.has(i)) await new Promise((r) => setTimeout(r, 250));
      const settled = urls.current[i];
      if (settled) return settled;
      throw new Error('The audio did not come back. Try again in a minute.');
    }
    inFlight.current.add(i);
    try {
      const res = await fetch(chunkUrl(i));
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? 'The audio did not come back. Try again in a minute.');
      }
      const url = URL.createObjectURL(await res.blob());
      urls.current[i] = url;
      return url;
    } finally {
      inFlight.current.delete(i);
    }
  };

  // Load chunk i into the element, optionally seek within it, then play.
  const startChunk = async (i: number, withinFraction = 0, autoplay = true) => {
    const el = audioRef.current;
    if (!el) return;
    setStatus(urls.current[i] ? 'ready' : i === 0 ? 'loading' : 'buffering');
    try {
      const url = await ensureChunk(i);
      setChunkIdx(i);
      if (el.src !== url) {
        el.src = url;
        await new Promise<void>((resolve, reject) => {
          const ok = () => {
            cleanup();
            resolve();
          };
          const bad = () => {
            cleanup();
            reject(new Error('The audio would not load. Try again.'));
          };
          const cleanup = () => {
            el.removeEventListener('loadedmetadata', ok);
            el.removeEventListener('error', bad);
          };
          el.addEventListener('loadedmetadata', ok);
          el.addEventListener('error', bad);
        });
      }
      durations.current[i] = el.duration;
      el.currentTime = withinFraction > 0 ? withinFraction * el.duration : 0;
      el.playbackRate = rate;
      setStatus('ready');
      if (autoplay) await el.play().catch(() => {}); // autoplay may need a tap — the button is right there
      void ensureChunk(i + 1).catch(() => {}); // stay one chunk ahead
    } catch (e) {
      setFailMessage(e instanceof Error && e.message !== 'out of range' ? e.message : 'The audio did not come back. Try again in a minute.');
      setStatus('failed');
    }
  };

  // Fresh episode: reset the engine and start on chunk 0.
  useEffect(() => {
    if (!audioEnabled || episodeKey.current === episode.id) return;
    episodeKey.current = episode.id;
    for (const url of urls.current) if (url) URL.revokeObjectURL(url);
    urls.current = [];
    durations.current = [];
    inFlight.current.clear();
    played.current = false;
    setActiveLine(null);
    setPlaying(false);
    void startChunk(0, 0, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [episode.id, audioEnabled]);

  // Position in the whole episode, in transcript characters — the shared
  // currency between audio time, the highlight, the outline, and the bar.
  const globalChar = () => {
    const el = audioRef.current;
    if (!el || !el.duration) return charsBeforeChunk[chunkIdx] ?? 0;
    return (charsBeforeChunk[chunkIdx] ?? 0) + (el.currentTime / el.duration) * (chunkChars[chunkIdx] ?? 0);
  };

  const onTimeUpdate = () => {
    setTick((n) => n + 1);
    const target = globalChar();
    let acc = 0;
    for (let i = 0; i < episode.lines.length; i++) {
      acc += episode.lines[i].text.length;
      if (acc >= target) {
        setActiveLine(i);
        return;
      }
    }
    setActiveLine(episode.lines.length - 1);
  };

  const onEnded = () => {
    if (chunkIdx + 1 < plan.length) void startChunk(chunkIdx + 1, 0, true);
    else {
      setPlaying(false);
      setActiveLine(null);
    }
  };

  const seekToLine = (lineIdx: number) => {
    const c = plan.findIndex((ch) => lineIdx >= ch.start && lineIdx < ch.end);
    if (c === -1) return;
    const within =
      chunkChars[c] > 0
        ? episode.lines.slice(plan[c].start, lineIdx).reduce((s, l) => s + l.text.length, 0) / chunkChars[c]
        : 0;
    const el = audioRef.current;
    if (c === chunkIdx && el && el.duration) {
      el.currentTime = within * el.duration;
      void el.play().catch(() => {});
    } else {
      void startChunk(c, within, true);
    }
  };

  const seekToFraction = (f: number) => {
    const target = Math.max(0, Math.min(1, f)) * totalChars;
    let acc = 0;
    for (let i = 0; i < episode.lines.length; i++) {
      acc += episode.lines[i].text.length;
      if (acc >= target) {
        seekToLine(i);
        return;
      }
    }
  };

  // Elapsed/total from real durations where chunks have loaded, estimated
  // (~14 chars/sec — the server's own estimate) where they haven't.
  const chunkSeconds = (i: number) => durations.current[i] ?? chunkChars[i] / 14;
  const elapsedSec =
    plan.reduce((sum, _ch, i) => (i < chunkIdx ? sum + chunkSeconds(i) : sum), 0) + (audioRef.current?.currentTime ?? 0);
  const totalSec = plan.reduce((sum, _ch, i) => sum + chunkSeconds(i), 0);
  const progress = totalChars > 0 ? Math.min(1, globalChar() / totalChars) : 0;
  const allLoaded = plan.every((_, i) => durations.current[i] !== undefined);

  const togglePlay = () => {
    const el = audioRef.current;
    if (!el || status === 'failed' || status === 'loading') return;
    if (el.paused) void el.play().catch(() => {});
    else el.pause();
  };

  const cycleRate = () => {
    const next = PLAYBACK_RATES[(PLAYBACK_RATES.indexOf(rate) + 1) % PLAYBACK_RATES.length];
    setRate(next);
    localStorage.setItem(RATE_STORAGE_KEY, String(next));
    const el = audioRef.current;
    if (el) el.playbackRate = next;
  };

  const body = (
    <div>
      <div className="border border-ink-strong rounded-brand bg-surface p-5">
        <p className="label-utility">
          {PODCAST_SHOW.name} · {episode.kind === 'qa' ? 'Listener questions' : 'Your episode'} · {LENGTH_OPTIONS.find((o) => o.id === episode.lengthPref)?.label} · ~
          {episode.estMinutes} min · {PODCAST_HOSTS.a.name} &amp; {PODCAST_HOSTS.b.name}
        </p>
        <h2 className="font-display font-bold text-ink-strong text-2xl mt-2">{episode.title}</h2>
        {episode.description && <p className="text-sm text-ink mt-1">{episode.description}</p>}
        {episode.promptText && (
          <p className="text-xs text-muted mt-2 italic">
            {episode.kind === 'qa' ? 'You asked' : 'Your angle'}: "{episode.promptText}"
          </p>
        )}

        <div className="mt-4">
          {!audioEnabled && (
            <p className="text-sm text-muted">Audio rendering isn't configured in this deployment — the transcript below is the episode.</p>
          )}
          {audioEnabled && status === 'failed' && (
            <div className="flex flex-col gap-2">
              <ErrorNote message={failMessage} />
              <div>
                <Button variant="quiet" onClick={() => void startChunk(chunkIdx)}>Try the audio again</Button>
              </div>
            </div>
          )}
          {audioEnabled && status !== 'failed' && (
            <>
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  disabled={status === 'loading'}
                  aria-label={playing ? 'Pause' : 'Play'}
                  className="w-11 h-11 shrink-0 rounded-full bg-accent text-on-accent flex items-center justify-center hover:brightness-110 active:brightness-95 disabled:opacity-40 transition-all"
                >
                  {playing ? (
                    <span className="flex gap-1" aria-hidden="true"><span className="w-1 h-3.5 bg-current rounded-sm" /><span className="w-1 h-3.5 bg-current rounded-sm" /></span>
                  ) : (
                    <span className="ml-0.5 border-l-[12px] border-l-current border-y-[7px] border-y-transparent" aria-hidden="true" />
                  )}
                </button>
                <div
                  className="flex-1 h-2 rounded-full bg-line cursor-pointer"
                  role="slider"
                  aria-label="Seek"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(progress * 100)}
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    seekToFraction((e.clientX - rect.left) / rect.width);
                  }}
                >
                  <div className="h-full rounded-full bg-accent transition-[width] duration-150" style={{ width: `${progress * 100}%` }} />
                </div>
                <span className="font-utility text-[0.7rem] text-muted tabular-nums shrink-0">
                  {fmtTime(elapsedSec)} / {allLoaded ? '' : '~'}{fmtTime(totalSec)}
                </span>
                <button
                  onClick={cycleRate}
                  aria-label={`Playback speed ${rate}x — click to change`}
                  className="shrink-0 border border-line-strong rounded-brand px-2 py-1 font-utility text-xs text-ink-strong hover:border-ink-strong"
                >
                  {rate}×
                </button>
              </div>
              {(status === 'loading' || status === 'buffering') && (
                <p className="text-sm text-ink mt-3" aria-live="polite">
                  <span className="text-signal" aria-hidden="true">●</span>{' '}
                  {status === 'loading'
                    ? 'The hosts are recording the opening — playback starts in a few seconds.'
                    : 'Recording the next part — it picks right back up.'}
                </p>
              )}
            </>
          )}
          <audio
            ref={audioRef}
            className="hidden"
            onTimeUpdate={onTimeUpdate}
            onEnded={onEnded}
            onPlay={() => {
              setPlaying(true);
              if (!played.current) {
                played.current = true;
                track('podcast_played', { podcastId: episode.id });
                onFirstPlay?.();
              }
            }}
            onPause={() => setPlaying(false)}
          />
        </div>
      </div>

      {episode.takeaways && <KeyTakeaways items={episode.takeaways} />}
      {episode.visual && <ConceptMap visual={episode.visual} />}

      <Transcript episode={episode} activeLine={activeLine} />
    </div>
  );

  if (!episode.outline) return <div className="mt-6">{body}</div>;
  return (
    <div className="mt-6 lg:grid lg:grid-cols-[210px_minmax(0,1fr)] lg:gap-10">
      <OutlineRail
        outline={episode.outline}
        activeLine={activeLine}
        canSeek={audioEnabled && status !== 'failed'}
        onSeek={seekToLine}
      />
      {body}
    </div>
  );
}

const PREGEN_POLLS = 8; // × 4s — how long we wait for a pregenerated episode to land

export default function Podcast() {
  const moduleId = useParams().moduleId ?? 'ai101-m1';
  const { me } = useApp();
  const [list, setList] = useState<PodcastListResponse | null>(null);
  const [episode, setEpisode] = useState<PodcastEpisode | null>(null);
  const [question, setQuestion] = useState('');
  const [writing, setWriting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localPlayed, setLocalPlayed] = useState<string[]>([]);
  const pollsLeft = useRef(PREGEN_POLLS);
  const autoCreated = useRef(false);

  const podcastPicked = Boolean(me?.prefs?.styles?.includes('podcast'));
  const defaultEp = list?.episodes.find((e) => e.moduleId === moduleId && e.kind === 'default') ?? null;
  const defaultPlayed = Boolean(
    defaultEp && (list?.playedEpisodeIds.includes(defaultEp.id) || localPlayed.includes(defaultEp.id)),
  );
  // Pregeneration may still be writing when a learner who picked podcasts arrives.
  const awaitingPregen = Boolean(list?.scriptEnabled && !defaultEp && podcastPicked && pollsLeft.current > 0);

  useEffect(() => {
    api
      .get<PodcastListResponse>('/api/podcast')
      .then(setList)
      .catch((e) => setError(e instanceof ApiError ? e.message : 'The studio did not load. Reload to try again.'));
  }, []);

  // Poll briefly while a pregenerated episode is (probably) being written.
  useEffect(() => {
    if (!awaitingPregen) return;
    const timer = setTimeout(() => {
      pollsLeft.current -= 1;
      api.get<PodcastListResponse>('/api/podcast').then(setList).catch(() => {});
    }, 4000);
    return () => clearTimeout(timer);
  }, [awaitingPregen, list]);

  const create = async (kind: 'default' | 'qa', q?: string) => {
    setWriting(true);
    setError(null);
    try {
      const ep = await api.post<PodcastEpisode>('/api/podcast', { moduleId, kind, question: q });
      setEpisode(ep);
      const { lines: _lines, outline: _outline, takeaways: _takeaways, visual: _visual, ...summary } = ep;
      setList((prev) => (prev ? { ...prev, episodes: [summary, ...prev.episodes.filter((e) => e.id !== ep.id)] } : prev));
      setQuestion('');
      window.scrollTo({ top: 0 });
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'The episode did not come back. Try again in a minute.');
    } finally {
      setWriting(false);
    }
  };

  // One flow: arriving at this page IS asking for the episode. If none exists
  // (and pregen isn't about to deliver one), generation starts unprompted.
  useEffect(() => {
    if (!list?.scriptEnabled || defaultEp || episode || writing || error || awaitingPregen) return;
    if (autoCreated.current) return;
    autoCreated.current = true;
    void create('default');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list, defaultEp, episode, writing, error, awaitingPregen]);

  // The module's episode is the front door — open it as soon as it exists.
  useEffect(() => {
    if (episode || !defaultEp) return;
    api.get<PodcastEpisode>(`/api/podcast/${defaultEp.id}`).then(setEpisode).catch(() => {});
  }, [defaultEp, episode]);

  // Takeaways and the concept model generate in the background after the
  // script; poll briefly on young episodes and slot the cards in as they land.
  const studyPolls = useRef(0);
  useEffect(() => {
    if (!episode || episode.takeaways) {
      studyPolls.current = 0;
      return;
    }
    const ageMs = Date.now() - new Date(episode.createdAt).getTime();
    if (ageMs > 5 * 60 * 1000 || studyPolls.current >= 15) return;
    const timer = setTimeout(() => {
      studyPolls.current += 1;
      api
        .get<PodcastEpisode>(`/api/podcast/${episode.id}`)
        .then((fresh) => {
          if (fresh.takeaways || fresh.visual) {
            setEpisode((prev) => (prev && prev.id === fresh.id ? { ...prev, takeaways: fresh.takeaways, visual: fresh.visual } : prev));
          }
        })
        .catch(() => {});
    }, 4000);
    return () => clearTimeout(timer);
  }, [episode]);

  const open = async (summary: PodcastSummary) => {
    setError(null);
    try {
      setEpisode(await api.get<PodcastEpisode>(`/api/podcast/${summary.id}`));
      window.scrollTo({ top: 0 });
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'That episode did not load. Try again.');
    }
  };

  if (!list && !error) {
    return <Screen wide><div className="pt-24 text-center"><p className="label-utility">Opening your episode…</p></div></Screen>;
  }

  const others = (list?.episodes ?? []).filter((e) => e.id !== episode?.id && e.id !== defaultEp?.id);

  return (
    <Screen wide>
      <div className="pt-12 sm:pt-16">
        <p className="label-utility anim-fade">Module 1 · Your podcast</p>
        <h1 className="font-display font-bold text-ink-strong text-3xl sm:text-4xl mt-3 leading-tight anim-rise">
          {defaultEp || episode ? 'This episode was made for you.' : 'Your episode is being made.'}
        </h1>
        <p className="text-ink mt-3 max-w-xl anim-rise" style={{ animationDelay: '80ms' }}>
          Two hosts — {PODCAST_HOSTS.a.name}, who {PODCAST_HOSTS.a.tagline}, and {PODCAST_HOSTS.b.name}, who {PODCAST_HOSTS.b.tagline} —
          talk through Module 1 for one listener: you. Your name, your role, your goals shape the episode.
        </p>

        {list && !list.scriptEnabled && (
          <div className="mt-6"><ErrorNote message="The scriptwriter is not configured in this deployment, so episodes cannot be generated yet." /></div>
        )}

        {list?.scriptEnabled && !defaultEp && !episode && !error && (
          <div className="border border-line rounded-brand bg-surface p-5 mt-8 anim-rise" style={{ animationDelay: '140ms' }}>
            <p className="text-sm text-ink" aria-live="polite">
              <span className="text-signal" aria-hidden="true">●</span>{' '}
              {awaitingPregen && !writing
                ? "The hosts are recording your episode — it's being written from your goals and role right now. Usually under a minute."
                : 'Maya and Leo are reading the module with your goals in mind — the script lands in about twenty seconds, then the voices follow.'}
            </p>
          </div>
        )}

        {error && (
          <div className="mt-4 flex flex-col gap-3">
            <ErrorNote message={error} />
            <div>
              <Button onClick={() => void create('default')} disabled={writing}>
                {writing ? 'Writing your episode…' : 'Try again'}
              </Button>
            </div>
          </div>
        )}

        {episode && list && (
          <Player
            episode={episode}
            audioEnabled={list.audioEnabled}
            onFirstPlay={() => setLocalPlayed((prev) => [...prev, episode.id])}
          />
        )}

        {defaultEp && list?.scriptEnabled && (
          <div className="border border-line rounded-brand bg-surface p-5 mt-8 max-w-2xl">
            <p className="font-display font-semibold text-ink-strong">Questions after listening?</p>
            {defaultPlayed ? (
              <>
                <p className="text-sm text-muted mt-1">
                  Ask, and {PODCAST_HOSTS.a.name} and {PODCAST_HOSTS.b.name} will answer in a follow-up segment — grounded in the module,
                  addressed to you.
                </p>
                <div className="relative mt-3">
                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    maxLength={500}
                    rows={2}
                    placeholder='e.g. "You said scoring models fail differently than language models — what does that mean for our ATS?"'
                    className="w-full rounded-brand border border-line bg-bg px-3 py-2 pr-14 text-[0.95rem] text-ink focus:outline-none focus:border-accent resize-y"
                  />
                  <MicButton
                    className="absolute right-2.5 bottom-3"
                    onError={setError}
                    onText={(text) => setQuestion((prev) => `${prev ? `${prev.trimEnd()} ` : ''}${text}`.slice(0, 500))}
                  />
                </div>
                <div className="mt-3 flex items-center gap-3 flex-wrap">
                  <Button onClick={() => void create('qa', question.trim())} disabled={writing || question.trim().length < 5}>
                    {writing ? 'The hosts are on it…' : 'Ask the hosts'}
                  </Button>
                  {writing && (
                    <span className="text-xs text-muted" aria-live="polite">
                      Writing and recording your follow-up — it plays as soon as it's ready.
                    </span>
                  )}
                </div>
              </>
            ) : (
              <p className="text-sm text-muted mt-1">
                Listen to your episode first — then the hosts take your questions in a follow-up segment.
              </p>
            )}
          </div>
        )}

        {others.length > 0 && (
          <div className="mt-10 max-w-2xl">
            <p className="label-utility">Your other segments</p>
            <ul className="mt-3 flex flex-col gap-2">
              {others.map((ep) => (
                <li key={ep.id}>
                  <button
                    onClick={() => open(ep)}
                    className="w-full text-left border border-line rounded-brand bg-surface px-4 py-3 hover:border-ink-strong transition-colors"
                  >
                    <span className="flex items-baseline justify-between gap-3 flex-wrap">
                      <span className="font-display font-semibold text-ink-strong">{ep.title}</span>
                      <span className="font-utility text-[0.65rem] uppercase tracking-wider text-muted shrink-0">
                        {ep.kind === 'qa' ? 'Q&A · ' : ''}{fmtDate(ep.createdAt)} · ~{ep.estMinutes} min{ep.audioCached ? ' · voiced' : ''}
                      </span>
                    </span>
                    {ep.description && <span className="block text-sm text-muted mt-1">{ep.description}</span>}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="mt-10 text-sm">
          <Link to={`/module/${moduleId}`} className="text-accent font-semibold no-underline hover:underline">← Back to the module</Link>
        </p>
      </div>
    </Screen>
  );
}
