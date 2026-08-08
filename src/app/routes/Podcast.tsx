import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { PodcastEpisode, PodcastLength, PodcastListResponse, PodcastSummary } from '../../shared/types';
import { PODCAST_HOSTS } from '../../shared/types';
import { Screen, Button, ErrorNote } from '../components/ui';
import MicButton from '../components/MicButton';
import { api, ApiError, track } from '../api';
import { useApp } from '../brand';
import { preferredSurface } from '../../shared/modality';

const MODULE_ID = 'ai101-m1';

const LENGTH_OPTIONS: { id: PodcastLength; label: string; detail: string }[] = [
  { id: 'quick', label: 'Quick take', detail: '~3 min' },
  { id: 'standard', label: 'Standard', detail: '~6 min' },
  { id: 'deep', label: 'Deep dive', detail: '~10 min' },
];

type AudioState =
  | { phase: 'idle' }
  | { phase: 'rendering' }
  | { phase: 'ready'; url: string }
  | { phase: 'failed'; message: string };

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

// Speaker turns as a conversation. During playback the active turn is estimated
// by character proportion — close enough to follow along; no fake precision.
function Transcript({ episode, activeLine }: { episode: PodcastEpisode; activeLine: number | null }) {
  return (
    <ol className="mt-6 flex flex-col gap-3">
      {episode.lines.map((line, i) => {
        const host = PODCAST_HOSTS[line.speaker];
        const isA = line.speaker === 'a';
        return (
          <li
            key={i}
            className={`max-w-[92%] sm:max-w-[85%] rounded-brand border px-4 py-3 transition-colors ${isA ? 'self-start' : 'self-end'} ${
              activeLine === i ? 'border-accent bg-accent/[0.06]' : 'border-line bg-surface'
            }`}
          >
            <span className={`label-utility ${isA ? 'text-accent' : ''}`}>{host.name}</span>
            <p className="text-[0.95rem] text-ink mt-1">{line.text}</p>
          </li>
        );
      })}
    </ol>
  );
}

function Player({ episode, audioEnabled, onFirstPlay }: { episode: PodcastEpisode; audioEnabled: boolean; onFirstPlay?: () => void }) {
  const [audio, setAudio] = useState<AudioState>({ phase: 'idle' });
  const [activeLine, setActiveLine] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const played = useRef(false);

  // A new episode gets a fresh player; revoke the old blob rather than leak it.
  useEffect(() => {
    setAudio({ phase: 'idle' });
    setActiveLine(null);
    played.current = false;
    return () => {
      setAudio((prev) => {
        if (prev.phase === 'ready') URL.revokeObjectURL(prev.url);
        return prev;
      });
    };
  }, [episode.id]);

  const render = async () => {
    setAudio({ phase: 'rendering' });
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
      setAudio({ phase: 'failed', message: 'The network dropped while rendering. The script is safe — try again.' });
    }
  };

  const onTimeUpdate = () => {
    const el = audioRef.current;
    if (!el || !el.duration) return;
    const totalChars = episode.lines.reduce((sum, l) => sum + l.text.length, 0);
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

  return (
    <div>
      <div className="border border-ink-strong rounded-brand bg-surface p-5 mt-6">
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
          {audioEnabled && audio.phase === 'idle' && (
            <div className="flex items-center gap-3 flex-wrap">
              <Button onClick={render}>{episode.audioCached ? 'Play the episode' : 'Give it voices'}</Button>
              {!episode.audioCached && <span className="text-xs text-muted">First render takes about a minute.</span>}
            </div>
          )}
          {audio.phase === 'rendering' && (
            <p className="text-sm text-ink" aria-live="polite">
              <span className="text-signal" aria-hidden="true">●</span> {episode.audioCached ? 'Fetching the audio…' : `Recording ${episode.lines.length} turns in the booth — about a minute…`}
            </p>
          )}
          {audio.phase === 'failed' && (
            <div className="flex flex-col gap-2">
              <ErrorNote message={audio.message} />
              <Button variant="quiet" onClick={render}>Try the audio again</Button>
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

  const podcastFirst = preferredSurface(me?.prefs?.styles) === 'podcast';
  const defaultEp = list?.episodes.find((e) => e.moduleId === MODULE_ID && e.kind === 'default') ?? null;
  const defaultPlayed = Boolean(
    defaultEp && (list?.playedEpisodeIds.includes(defaultEp.id) || localPlayed.includes(defaultEp.id)),
  );
  // Pregeneration may still be writing when a podcast-first learner arrives.
  const awaitingPregen = Boolean(list?.scriptEnabled && !defaultEp && podcastFirst && pollsLeft.current > 0);

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

  // The module's episode is the front door — open it as soon as it exists.
  useEffect(() => {
    if (episode || !defaultEp) return;
    api.get<PodcastEpisode>(`/api/podcast/${defaultEp.id}`).then(setEpisode).catch(() => {});
  }, [defaultEp, episode]);

  const create = async (kind: 'default' | 'qa', q?: string) => {
    setWriting(true);
    setError(null);
    try {
      const ep = await api.post<PodcastEpisode>('/api/podcast', { moduleId: MODULE_ID, kind, question: q });
      setEpisode(ep);
      const { lines: _lines, ...summary } = ep;
      setList((prev) => (prev ? { ...prev, episodes: [summary, ...prev.episodes.filter((e) => e.id !== ep.id)] } : prev));
      setQuestion('');
      window.scrollTo({ top: 0 });
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'The episode did not come back. Try again in a minute.');
    } finally {
      setWriting(false);
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
    return <Screen><div className="pt-24 text-center"><p className="label-utility">Opening your episode…</p></div></Screen>;
  }

  const others = (list?.episodes ?? []).filter((e) => e.id !== episode?.id && e.id !== defaultEp?.id);

  return (
    <Screen>
      <div className="pt-12 sm:pt-16">
        <p className="label-utility anim-fade">Module 1 · Your podcast</p>
        <h1 className="font-display font-bold text-ink-strong text-3xl sm:text-4xl mt-3 leading-tight anim-rise">
          {defaultEp ? 'This episode was made for you.' : 'Hear this module as a conversation.'}
        </h1>
        <p className="text-ink mt-3 max-w-xl anim-rise" style={{ animationDelay: '80ms' }}>
          Two hosts — {PODCAST_HOSTS.a.name}, who {PODCAST_HOSTS.a.tagline}, and {PODCAST_HOSTS.b.name}, who {PODCAST_HOSTS.b.tagline} —
          talk through Module 1 for one listener: you. Your name, your role, your goals shape the episode.
        </p>

        {list && !list.scriptEnabled && (
          <div className="mt-6"><ErrorNote message="The scriptwriter is not configured in this deployment, so episodes cannot be generated yet." /></div>
        )}

        {list?.scriptEnabled && !defaultEp && (
          <div className="border border-line rounded-brand bg-surface p-5 mt-8 anim-rise" style={{ animationDelay: '140ms' }}>
            {awaitingPregen && !writing ? (
              <p className="text-sm text-ink" aria-live="polite">
                <span className="text-signal" aria-hidden="true">●</span> The hosts are recording your episode — it's being written from your
                goals and role right now. Usually under a minute.
              </p>
            ) : (
              <div className="flex items-center gap-3 flex-wrap">
                <Button onClick={() => void create('default')} disabled={writing}>
                  {writing ? 'Writing your episode…' : 'Make my episode'}
                </Button>
                <span className="text-xs text-muted" aria-live="polite">
                  {writing
                    ? 'The hosts are reading the module with your goals in mind — ~20 seconds.'
                    : 'One per module, written for you. Questions unlock after you listen.'}
                </span>
              </div>
            )}
          </div>
        )}

        {error && <div className="mt-4"><ErrorNote message={error} /></div>}

        {episode && list && (
          <Player
            episode={episode}
            audioEnabled={list.audioEnabled}
            onFirstPlay={() => setLocalPlayed((prev) => [...prev, episode.id])}
          />
        )}

        {defaultEp && list?.scriptEnabled && (
          <div className="border border-line rounded-brand bg-surface p-5 mt-8">
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
                  {writing && <span className="text-xs text-muted" aria-live="polite">Writing your follow-up segment — ~20 seconds.</span>}
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
          <div className="mt-10">
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
