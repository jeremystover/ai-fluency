import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { marked } from 'marked';
import type { ChatHistoryResponse, ChatMessage, ChatStreamLine, VoiceStatus } from '../../shared/types';
import { extractPaths } from '../../shared/chat';
import { Screen, ErrorNote } from '../components/ui';
import MicButton from '../components/MicButton';
import { api, ApiError } from '../api';
import { useDevice } from '../brand';

const VOICE_MODE_KEY = 'fd_chat_voice_mode';

// Unlike seeded module content, chat text comes from the model mid-conversation
// with a learner — escape raw HTML before markdown parsing so nothing the model
// (or a quoted learner message) emits can reach the DOM as markup.
function ChatMarkdown({ source }: { source: string }) {
  const escaped = source.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const html = marked.parse(escaped, { async: false });
  return <div className="md text-[0.95rem] [&>*:first-child]:mt-0 [&>*:last-child]:mb-0" dangerouslySetInnerHTML={{ __html: html }} />;
}

function Bubble({ role, children }: { role: 'user' | 'assistant'; children: React.ReactNode }) {
  return (
    <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-brand px-4 py-3 ${
          role === 'user' ? 'bg-accent text-on-accent' : 'bg-surface border border-line text-ink'
        }`}
      >
        {children}
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <span className="inline-flex gap-1 items-center py-1" aria-label="The tutor is writing">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </span>
  );
}

function ListenButton({
  state,
  onClick,
}: {
  state: 'idle' | 'loading' | 'playing';
  onClick: () => void;
}) {
  const label = state === 'playing' ? 'Stop' : state === 'loading' ? 'Loading audio…' : 'Listen';
  return (
    <button
      onClick={onClick}
      disabled={state === 'loading'}
      aria-label={label}
      className="mt-2 inline-flex items-center gap-1.5 font-utility text-[0.7rem] uppercase tracking-wider text-muted hover:text-accent transition-colors disabled:opacity-50"
    >
      {state === 'loading' ? (
        <span className="w-3 h-3 border-2 border-muted border-t-transparent rounded-full animate-spin" aria-hidden="true" />
      ) : state === 'playing' ? (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
          <rect x="1" y="1" width="8" height="8" rx="1.5" />
        </svg>
      ) : (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
          <path d="M2 1.2v7.6a.5.5 0 0 0 .76.43l6.1-3.8a.5.5 0 0 0 0-.86l-6.1-3.8A.5.5 0 0 0 2 1.2z" />
        </svg>
      )}
      {label}
    </button>
  );
}

export default function Chat() {
  const MODULE_ID = useParams().moduleId ?? 'ai101-m1';
  const device = useDevice();
  const navigate = useNavigate();
  const [title, setTitle] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streaming, setStreaming] = useState<string | null>(null); // assistant text in flight
  const [busy, setBusy] = useState(false);
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [fatal, setFatal] = useState<string | null>(null);
  const [voice, setVoice] = useState<VoiceStatus>({ transcribe: false, speech: false });
  const [voiceMode, setVoiceMode] = useState(() => localStorage.getItem(VOICE_MODE_KEY) === '1');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [loadingAudioId, setLoadingAudioId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const kickedOff = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const urlCache = useRef<Map<string, string>>(new Map());
  const voiceModeRef = useRef(voiceMode);
  voiceModeRef.current = voiceMode;
  const [searchParams] = useSearchParams();

  // ?voice=1 — the learner said they learn by talking, so arrive with voice
  // mode already on (the toggle still turns it off).
  useEffect(() => {
    if (searchParams.get('voice') === '1') {
      setVoiceMode(true);
      localStorage.setItem(VOICE_MODE_KEY, '1');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollDown = () => bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  useEffect(scrollDown, [messages, streaming, busy]);

  useEffect(() => {
    const cache = urlCache.current;
    return () => {
      audioRef.current?.pause();
      for (const url of cache.values()) URL.revokeObjectURL(url);
    };
  }, []);

  function toggleVoiceMode() {
    const next = !voiceMode;
    setVoiceMode(next);
    localStorage.setItem(VOICE_MODE_KEY, next ? '1' : '0');
    if (!next) {
      audioRef.current?.pause();
      setPlayingId(null);
    }
  }

  // Fetch-once-then-cache playback of an assistant message's spoken rendering.
  // Calling it for the currently playing message stops it.
  async function playMessage(id: string) {
    if (playingId === id) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }
    audioRef.current?.pause();
    setPlayingId(null);
    let url = urlCache.current.get(id);
    if (!url) {
      setLoadingAudioId(id);
      try {
        const res = await fetch(`/api/module/${MODULE_ID}/chat/audio/${id}`);
        if (!res.ok) {
          const data = (await res.json().catch(() => null)) as { error?: string } | null;
          setError(data?.error ?? 'Playback is unavailable right now — the text is all there.');
          return;
        }
        url = URL.createObjectURL(await res.blob());
        urlCache.current.set(id, url);
      } catch {
        setError('The audio did not load. The text is all there.');
        return;
      } finally {
        setLoadingAudioId(null);
      }
    }
    const audio = (audioRef.current ??= new Audio());
    audio.src = url;
    audio.onended = () => setPlayingId(null);
    setPlayingId(id);
    // Autoplay can be blocked before the first user gesture — fail silently,
    // the Listen button is right there.
    audio.play().catch(() => setPlayingId(null));
  }

  async function send(text: string | null, via: 'text' | 'voice' = 'text') {
    if (busy) return;
    setBusy(true);
    setError(null);
    setStreaming(null);
    if (text) {
      setMessages((m) => [...m, { id: `local-${Date.now()}`, role: 'user', content: text, createdAt: new Date().toISOString() }]);
      setInput('');
    }
    let full = '';
    try {
      const res = await fetch(`/api/module/${MODULE_ID}/chat`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(text ? { message: text, via } : {}),
      });
      if (!res.ok || !res.body) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new ApiError(res.status, data?.error ?? `The tutor returned ${res.status}. Try again.`);
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';
        for (const raw of lines) {
          if (!raw.trim()) continue;
          let line: ChatStreamLine;
          try {
            line = JSON.parse(raw);
          } catch {
            continue;
          }
          if (line.type === 'delta') {
            full += line.text;
            setStreaming(full);
          } else if (line.type === 'done') {
            setMessages((m) => [...m, { id: line.messageId, role: 'assistant', content: full, createdAt: new Date().toISOString() }]);
            setStreaming(null);
            // In voice mode the reply is read aloud as soon as it lands.
            if (voiceModeRef.current) void playMessage(line.messageId);
          } else if (line.type === 'error') {
            if (full.trim()) {
              setMessages((m) => [...m, { id: `local-${Date.now()}`, role: 'assistant', content: full, createdAt: new Date().toISOString() }]);
              setStreaming(null);
            }
            setError(line.message);
          }
        }
      }
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'The connection dropped mid-reply. Send that again.');
      setStreaming(null);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    api
      .get<ChatHistoryResponse>(`/api/module/${MODULE_ID}/chat`)
      .then((d) => {
        setTitle(d.moduleTitle);
        setMessages(d.messages);
        setVoice(d.voice);
        if (d.messages.length === 0 && !kickedOff.current) {
          kickedOff.current = true;
          void send(null);
        }
      })
      .catch((e) => setFatal(e instanceof ApiError ? e.message : 'The tutor did not load. Reload to try again.'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function reset() {
    if (busy) return;
    audioRef.current?.pause();
    setPlayingId(null);
    await api.post(`/api/module/${MODULE_ID}/chat/reset`).catch(() => {});
    setMessages([]);
    setError(null);
    kickedOff.current = true;
    void send(null);
  }

  if (fatal) return <Screen><div className="pt-20"><ErrorNote message={fatal} /></div></Screen>;

  // Chips come from the last assistant message's <paths> trailer, shown only
  // when it is the latest thing said and the tutor isn't mid-reply.
  const lastMsg = messages[messages.length - 1];
  const chips = !busy && lastMsg?.role === 'assistant' ? extractPaths(lastMsg.content).options : [];

  return (
    <Screen>
      <div className="pt-6 flex flex-col min-h-[calc(100dvh-12rem)]">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 sm:gap-3 border-b border-line pb-3">
          <div>
            <p className="label-utility">Module 1 · Tutor chat</p>
            <h1 className="font-display font-bold text-ink-strong text-xl mt-1">{title ?? 'The tutor'}</h1>
          </div>
          <div className="flex items-center gap-4 pb-0.5">
            {voice.speech && (
              <button
                onClick={toggleVoiceMode}
                aria-pressed={voiceMode}
                title="Voice mode: replies are read aloud, and the mic sends what you say straight to the tutor"
                className={`font-utility text-[0.7rem] uppercase tracking-wider px-2.5 py-1 rounded-full border transition-colors ${
                  voiceMode ? 'border-accent bg-accent/[0.08] text-accent' : 'border-line text-muted hover:text-ink'
                }`}
              >
                {voiceMode ? '● Voice on' : '○ Voice'}
              </button>
            )}
            <button onClick={reset} disabled={busy} className="text-xs text-muted hover:text-ink underline disabled:opacity-40">
              Start over
            </button>
            <Link to={`/module/${MODULE_ID}`} className="text-accent font-semibold text-sm no-underline hover:underline whitespace-nowrap">
              Back to the read →
            </Link>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-3 py-5" aria-live="polite">
          {messages.map((m) => (
            <Bubble key={m.id} role={m.role}>
              {m.role === 'assistant' ? (
                <>
                  <ChatMarkdown source={extractPaths(m.content).body} />
                  {voice.speech && !m.id.startsWith('local-') && (
                    <ListenButton
                      state={playingId === m.id ? 'playing' : loadingAudioId === m.id ? 'loading' : 'idle'}
                      onClick={() => void playMessage(m.id)}
                    />
                  )}
                </>
              ) : (
                <p className="text-[0.95rem] whitespace-pre-wrap">{m.content}</p>
              )}
            </Bubble>
          ))}
          {streaming !== null && (
            <Bubble role="assistant">
              <ChatMarkdown source={streaming} />
            </Bubble>
          )}
          {busy && !streaming && (
            <Bubble role="assistant">
              <TypingDots />
            </Bubble>
          )}
          {error && <ErrorNote message={error} />}
          <div ref={bottomRef} />
        </div>

        {chips.length > 0 && (
          <div className="flex flex-wrap gap-2 pb-3 anim-fade">
            {chips.map((option) =>
              // "go:" options navigate out of the chat instead of sending —
              // the tutor uses them when a recommendation needs a next screen.
              option.startsWith('go:') ? (
                <button
                  key={option}
                  onClick={() => navigate('/plan')}
                  className="px-4 py-1.5 text-sm font-display font-semibold rounded-full bg-accent text-on-accent hover:brightness-110 transition-all"
                >
                  {option.slice(3)} →
                </button>
              ) : (
                <button
                  key={option}
                  onClick={() => void send(option)}
                  className="px-3.5 py-1.5 text-sm font-display font-semibold rounded-full border border-accent text-accent hover:bg-accent/[0.06] transition-colors"
                >
                  {option}
                </button>
              ),
            )}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const text = input.trim();
            if (text) void send(text);
          }}
          className="sticky bottom-0 bg-bg pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-1"
        >
          <div className="flex gap-2 items-end border border-line-strong rounded-brand bg-surface p-2 focus-within:border-accent transition-colors">
            <MicButton
              disabled={busy}
              onError={setError}
              onText={(text) => {
                // Voice mode is a conversation: what you said goes straight to
                // the tutor. Otherwise the transcript lands in the box to edit.
                if (voiceModeRef.current) void send(text, 'voice');
                else setInput((prev) => (prev ? `${prev.trimEnd()} ${text}` : text));
              }}
            />
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  const text = input.trim();
                  if (text && !busy) void send(text);
                }
              }}
              rows={Math.min(4, Math.max(1, input.split('\n').length))}
              maxLength={2000}
              placeholder={
                voiceMode
                  ? device.small ? 'Tap the mic and talk' : 'Tap the mic and talk — or type, both work'
                  : device.small ? 'Ask or answer — your lead' : 'Ask, answer, or steer — the tutor follows your lead'
              }
              aria-label="Message the tutor"
              className="flex-1 resize-none bg-transparent px-2 py-1.5 text-[0.95rem] outline-none placeholder:text-muted"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              className="px-4 py-2 font-display font-semibold text-sm rounded-brand bg-accent text-on-accent hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
          <p className="font-utility text-[0.65rem] text-muted mt-1.5 px-1">
            The tutor teaches from this module's content and can be wrong — which, fittingly, is the point of the course.
          </p>
        </form>
      </div>
    </Screen>
  );
}
