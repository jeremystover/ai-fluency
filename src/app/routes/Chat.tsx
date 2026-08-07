import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { marked } from 'marked';
import type { ChatHistoryResponse, ChatMessage, ChatStreamLine } from '../../shared/types';
import { extractPaths } from '../../shared/chat';
import { Screen, ErrorNote } from '../components/ui';
import { api, ApiError } from '../api';

const MODULE_ID = 'ai101-m1';

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

export default function Chat() {
  const [title, setTitle] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streaming, setStreaming] = useState<string | null>(null); // assistant text in flight
  const [busy, setBusy] = useState(false);
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [fatal, setFatal] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const kickedOff = useRef(false);

  const scrollDown = () => bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  useEffect(scrollDown, [messages, streaming, busy]);

  async function send(text: string | null) {
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
        body: JSON.stringify(text ? { message: text } : {}),
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
      <div className="pt-6 flex flex-col min-h-[calc(100vh-12rem)]">
        <div className="flex items-end justify-between gap-3 border-b border-line pb-3">
          <div>
            <p className="label-utility">Module 1 · Tutor chat</p>
            <h1 className="font-display font-bold text-ink-strong text-xl mt-1">{title ?? 'The tutor'}</h1>
          </div>
          <div className="flex items-center gap-4 pb-0.5">
            <button onClick={reset} disabled={busy} className="text-xs text-muted hover:text-ink underline disabled:opacity-40">
              Start over
            </button>
            <Link to="/module/1" className="text-accent font-semibold text-sm no-underline hover:underline whitespace-nowrap">
              Back to the read →
            </Link>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-3 py-5" aria-live="polite">
          {messages.map((m) => (
            <Bubble key={m.id} role={m.role}>
              {m.role === 'assistant' ? <ChatMarkdown source={extractPaths(m.content).body} /> : <p className="text-[0.95rem] whitespace-pre-wrap">{m.content}</p>}
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
            {chips.map((option) => (
              <button
                key={option}
                onClick={() => void send(option)}
                className="px-3.5 py-1.5 text-sm font-display font-semibold rounded-full border border-accent text-accent hover:bg-accent/[0.06] transition-colors"
              >
                {option}
              </button>
            ))}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const text = input.trim();
            if (text) void send(text);
          }}
          className="sticky bottom-0 bg-bg pb-5 pt-1"
        >
          <div className="flex gap-2 items-end border border-line-strong rounded-brand bg-surface p-2 focus-within:border-accent transition-colors">
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
              placeholder="Ask, answer, or steer — the tutor follows your lead"
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
