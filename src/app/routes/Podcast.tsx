import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { PodcastEpisode, PodcastLength, PodcastListResponse, PodcastOutlinePoint, PodcastSummary } from '../../shared/types';
import { PODCAST_HOSTS } from '../../shared/types';
import { Screen, Button, ErrorNote } from '../components/ui';
import MicButton from '../components/MicButton';
import { api, ApiError, track } from '../api';
import { useApp } from '../brand';

const MODULE_ID = 'ai101-m1';

const LENGTH_OPTIONS: { id: PodcastLength; label: string; detail: string }[] = [
  { id: 'quick', label: 'Quick take', detail: '~3 min' },
  { id: 'standard', label: 'Standard', detail: '~6 min' },
  { id: 'deep', label: 'Deep dive', detail: '~10 min' },
];

// Voices render server-side right after the script; the client just waits for
// audioCached to flip, then plays from the R2 cache. 3s × 40 ≈ 2 minutes of
// patience before falling back to a live render.
const AUDIO_POLL_MS = 3000;
const AUDIO_POLLS = 40;

type AudioState =
  | { phase: 'waiting' } // voices rendering in the background
  | { phase: 'fetching' } // downloading (or live-rendering, on the fallback path)
  | { phase: 'ready'; url: string }
  | { phase: 'failed'; message: string };

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

const charsBefore = (episode: PodcastEpisode, lineIdx: number) =>
  episode.lines.slice(0, lineIdx).reduce((sum, l) => sum + l.text.length, 0);

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

function Player({
  episode,
  audioEnabled,
  audioPrerenders,
  onRefresh,
  onFirstPlay,
}: {
  episode: PodcastEpisode;
  audioEnabled: boolean;
  audioPrerenders: boolean;
  onRefresh: (ep: PodcastEpisode) => void;
  onFirstPlay?: () => void;
}) {
  const [audio, setAudio] = useState<AudioState>({ phase: 'waiting' });
  const [activeLine, setActiveLine] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const played = useRef(false);
  const pollsLeft = useRef(AUDIO_POLLS);
  const started = useRef<string | null>(null);

  const totalChars = episode.lines.reduce((sum, l) => sum + l.text.length, 0);

  const fetchAudio = async () => {
    setAudio({ phase: 'fetching' });
    try {
      const res = await fetch(`/api/podcast/${episode.id}/audio`);
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setAudio({ phase: 'failed', message: data?.error ?? 'The audio did not come back. Try again in a minute.' });
        return;
      }
      const blob = await res.blob();
      setAudio({ phase: 'ready', url: URL.createObjectURL(blob) });
    } catch {
      setAudio({ phase: 'failed', message: 'The network dropped while fetching the audio. The episode is safe — try again.' });
    }
  };

  // One flow, no buttons: cached → fetch now; rendering in background → wait
  // for audioCached to flip; no background rendering on this deployment → go
  // straight to the live-render fetch.
  useEffect(() => {
    if (!audioEnabled || started.current === episode.id) return;
    started.current = episode.id;
    setActiveLine(null);
    played.current = false;
    pollsLeft.current = AUDIO_POLLS;
    if (episode.audioCached || !audioPrerenders) void fetchAudio();
    else setAudio({ phase: 'waiting' });
    return () => {
      setAudio((prev) => {
        if (prev.phase === 'ready') URL.revokeObjectURL(prev.url);
        return prev;
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [episode.id, audioEnabled]);

  // Waiting phase: poll the episode until the background render lands.
  useEffect(() => {
    if (audio.phase !== 'waiting') return;
    if (episode.audioCached) {
      void fetchAudio();
      return;
    }
    if (pollsLeft.current <= 0) {
      void fetchAudio(); // fallback: live render on the audio route
      return;
    }
    const timer = setTimeout(() => {
      pollsLeft.current -= 1;
      api.get<PodcastEpisode>(`/api/podcast/${episode.id}`).then(onRefresh).catch(() => {});
    }, AUDIO_POLL_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audio.phase, episode]);

  const onTimeUpdate = () => {
    const el = audioRef.current;
    if (!el || !el.duration) return;
    const targetChars = (el.currentTime / el.duration) * totalChars;
    let acc = 0;
    for (let i = 0; i < episode.lines.length; i++) {
      acc += episode.lines[i].text.length;
      if (acc >= targetChars) {
        setActiveLine(i);
        return;
      }
    }
    setActiveLine(episode.lines.length - 1);
  };

  const seekToLine = (lineIdx: number) => {
    const el = audioRef.current;
    if (!el || !el.duration || totalChars === 0) return;
    el.currentTime = (charsBefore(episode, lineIdx) / totalChars) * el.duration;
    void el.play().catch(() => {});
  };

  const body = (
    <div>
      <div className="border border-ink-strong rounded-brand bg-surface p-5">
        <p className="label-utility">
          {episode.kind === 'qa' ? 'Listener questions' : 'Your episode'} · {LENGTH_OPTIONS.find((o) => o.id === episode.lengthPref)?.label} · ~
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
          {audioEnabled && (audio.phase === 'waiting' || audio.phase === 'fetching') && (
            <p className="text-sm text-ink" aria-live="polite">
              <span className="text-signal" aria-hidden="true">●</span>{' '}
              {audio.phase === 'waiting'
                ? 'Script done — the hosts are in the booth recording your audio. Read along below; it starts on its own.'
                : episode.audioCached
                  ? 'Fetching your audio…'
                  : `Recording ${episode.lines.length} turns in the booth — about a minute…`}
            </p>
          )}
          {audio.phase === 'failed' && (
            <div className="flex flex-col gap-2">
              <ErrorNote message={audio.message} />
              <Button variant="quiet" onClick={() => void fetchAudio()}>Try the audio again</Button>
            </div>
          )}
          {audio.phase === 'ready' && (
            <audio
              ref={audioRef}
              src={audio.url}
              controls
              autoPlay
              className="w-full"
              onTimeUpdate={onTimeUpdate}
              onEnded={() => setActiveLine(null)}
              onPlay={() => {
                if (!played.current) {
                  played.current = true;
                  track('podcast_played', { podcastId: episode.id });
                  onFirstPlay?.();
                }
              }}
            />
          )}
        </div>
      </div>

      <Transcript episode={episode} activeLine={activeLine} />
    </div>
  );

  if (!episode.outline) return <div className="mt-6">{body}</div>;
  return (
    <div className="mt-6 lg:grid lg:grid-cols-[210px_minmax(0,1fr)] lg:gap-10">
      <OutlineRail
        outline={episode.outline}
        activeLine={activeLine}
        canSeek={audio.phase === 'ready'}
        onSeek={seekToLine}
      />
      {body}
    </div>
  );
}

const PREGEN_POLLS = 8; // × 4s — how long we wait for a pregenerated episode to land

export default function Podcast() {
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
  const defaultEp = list?.episodes.find((e) => e.moduleId === MODULE_ID && e.kind === 'default') ?? null;
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
      const ep = await api.post<PodcastEpisode>('/api/podcast', { moduleId: MODULE_ID, kind, question: q });
      setEpisode(ep);
      const { lines: _lines, outline: _outline, ...summary } = ep;
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

  const onRefresh = (ep: PodcastEpisode) => {
    setEpisode((prev) => (prev && prev.id === ep.id ? ep : prev));
    if (ep.audioCached) {
      setList((prev) =>
        prev ? { ...prev, episodes: prev.episodes.map((e) => (e.id === ep.id ? { ...e, audioCached: true } : e)) } : prev,
      );
    }
  };

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
            audioPrerenders={list.audioPrerenders}
            onRefresh={onRefresh}
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
          <Link to="/module/1" className="text-accent font-semibold no-underline hover:underline">← Back to Module 1</Link>
        </p>
      </div>
    </Screen>
  );
}
