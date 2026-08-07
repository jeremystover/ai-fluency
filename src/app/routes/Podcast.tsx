import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { PodcastEpisode, PodcastLength, PodcastListResponse, PodcastSummary } from '../../shared/types';
import { PODCAST_HOSTS } from '../../shared/types';
import { Screen, Button, ErrorNote } from '../components/ui';
import { api, ApiError, track } from '../api';

const LENGTH_OPTIONS: { id: PodcastLength; label: string; detail: string }[] = [
  { id: 'quick', label: 'Quick take', detail: '~3 min' },
  { id: 'standard', label: 'Standard', detail: '~6 min' },
  { id: 'deep', label: 'Deep dive', detail: '~10 min' },
];

const FOCUS_PLACEHOLDER =
  'Optional — give the hosts an angle. e.g. "Relate everything to running performance reviews" or "Spend most of the time on where these tools fabricate."';

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

function Player({ episode, audioEnabled }: { episode: PodcastEpisode; audioEnabled: boolean }) {
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
          Episode · {LENGTH_OPTIONS.find((o) => o.id === episode.lengthPref)?.label} · ~{episode.estMinutes} min ·{' '}
          {PODCAST_HOSTS.a.name} &amp; {PODCAST_HOSTS.b.name}
        </p>
        <h2 className="font-display font-bold text-ink-strong text-2xl mt-2">{episode.title}</h2>
        {episode.description && <p className="text-sm text-ink mt-1">{episode.description}</p>}
        {episode.promptText && <p className="text-xs text-muted mt-2 italic">Your angle: "{episode.promptText}"</p>}

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

export default function Podcast() {
  const [list, setList] = useState<PodcastListResponse | null>(null);
  const [episode, setEpisode] = useState<PodcastEpisode | null>(null);
  const [focus, setFocus] = useState('');
  const [length, setLength] = useState<PodcastLength>('standard');
  const [writing, setWriting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<PodcastListResponse>('/api/podcast')
      .then(setList)
      .catch((e) => setError(e instanceof ApiError ? e.message : 'The studio did not load. Reload to try again.'));
  }, []);

  const create = async () => {
    setWriting(true);
    setError(null);
    try {
      const ep = await api.post<PodcastEpisode>('/api/podcast', { moduleId: 'ai101-m1', prompt: focus.trim() || undefined, length });
      setEpisode(ep);
      const { lines: _lines, ...summary } = ep;
      setList((prev) => (prev ? { ...prev, episodes: [summary, ...prev.episodes] } : prev));
      setFocus('');
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
    return <Screen><div className="pt-24 text-center"><p className="label-utility">Opening the studio…</p></div></Screen>;
  }

  const previous = (list?.episodes ?? []).filter((e) => e.id !== episode?.id);

  return (
    <Screen>
      <div className="pt-12 sm:pt-16">
        <p className="label-utility anim-fade">Module 1 · Podcast studio</p>
        <h1 className="font-display font-bold text-ink-strong text-3xl sm:text-4xl mt-3 leading-tight anim-rise">
          Turn this module into a conversation.
        </h1>
        <p className="text-ink mt-3 max-w-xl anim-rise" style={{ animationDelay: '80ms' }}>
          Two hosts — {PODCAST_HOSTS.a.name}, who {PODCAST_HOSTS.a.tagline}, and {PODCAST_HOSTS.b.name}, who {PODCAST_HOSTS.b.tagline} —
          talk through Module 1. Give them an angle and it becomes your episode, not a generic one.
        </p>

        {list && !list.scriptEnabled && (
          <div className="mt-6"><ErrorNote message="The scriptwriter is not configured in this deployment, so new episodes cannot be generated yet." /></div>
        )}

        {list?.scriptEnabled && (
          <div className="border border-line rounded-brand bg-surface p-5 mt-8 anim-rise" style={{ animationDelay: '140ms' }}>
            <label htmlFor="podcast-focus" className="font-display font-semibold text-ink-strong">
              What should the hosts focus on?
            </label>
            <textarea
              id="podcast-focus"
              value={focus}
              onChange={(e) => setFocus(e.target.value)}
              maxLength={400}
              rows={3}
              placeholder={FOCUS_PLACEHOLDER}
              className="mt-2 w-full rounded-brand border border-line bg-bg px-3 py-2 text-[0.95rem] text-ink focus:outline-none focus:border-accent resize-y"
            />
            <div className="mt-3 flex items-center gap-2 flex-wrap" role="radiogroup" aria-label="Episode length">
              {LENGTH_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  role="radio"
                  aria-checked={length === opt.id}
                  onClick={() => setLength(opt.id)}
                  className={`px-3.5 py-1.5 rounded-brand border text-sm font-display transition-colors ${
                    length === opt.id ? 'border-ink-strong bg-accent/[0.08] text-ink-strong font-semibold' : 'border-line text-muted hover:text-ink'
                  }`}
                >
                  {opt.label} <span className="font-utility text-[0.65rem] uppercase tracking-wider">{opt.detail}</span>
                </button>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-3 flex-wrap">
              <Button onClick={create} disabled={writing}>
                {writing ? 'Writing the script…' : 'Make my episode'}
              </Button>
              {writing && <span className="text-xs text-muted" aria-live="polite">The hosts are reading the module with your angle in mind — ~20 seconds.</span>}
            </div>
          </div>
        )}

        {error && <div className="mt-4"><ErrorNote message={error} /></div>}

        {episode && list && <Player episode={episode} audioEnabled={list.audioEnabled} />}

        {previous.length > 0 && (
          <div className="mt-10">
            <p className="label-utility">Your earlier episodes</p>
            <ul className="mt-3 flex flex-col gap-2">
              {previous.map((ep) => (
                <li key={ep.id}>
                  <button
                    onClick={() => open(ep)}
                    className="w-full text-left border border-line rounded-brand bg-surface px-4 py-3 hover:border-ink-strong transition-colors"
                  >
                    <span className="flex items-baseline justify-between gap-3 flex-wrap">
                      <span className="font-display font-semibold text-ink-strong">{ep.title}</span>
                      <span className="font-utility text-[0.65rem] uppercase tracking-wider text-muted shrink-0">
                        {fmtDate(ep.createdAt)} · ~{ep.estMinutes} min{ep.audioCached ? ' · voiced' : ''}
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
