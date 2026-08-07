import { useEffect, useRef, useState } from 'react';
import type { TranscribeResponse, VoiceStatus } from '../../shared/types';

// One availability probe per page load, shared by every mic on screen.
let statusPromise: Promise<VoiceStatus> | null = null;
function voiceStatus(): Promise<VoiceStatus> {
  statusPromise ??= fetch('/api/voice/status')
    .then((r) => (r.ok ? (r.json() as Promise<VoiceStatus>) : { transcribe: false, speech: false }))
    .catch(() => ({ transcribe: false, speech: false }));
  return statusPromise;
}

const MAX_RECORD_MS = 120_000;

function pickMimeType(): string | undefined {
  if (typeof MediaRecorder === 'undefined') return undefined;
  for (const type of ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus']) {
    if (MediaRecorder.isTypeSupported(type)) return type;
  }
  return undefined;
}

type MicState = 'idle' | 'recording' | 'busy';

/**
 * Record → transcribe → hand the text back. Drops itself from the DOM when the
 * deployment can't transcribe or the browser has no mic API, so callers can
 * render it unconditionally next to any text input.
 */
export default function MicButton({
  onText,
  onError,
  disabled = false,
  className = '',
}: {
  onText: (text: string) => void;
  onError?: (message: string) => void;
  disabled?: boolean;
  className?: string;
}) {
  const [available, setAvailable] = useState(false);
  const [state, setState] = useState<MicState>('idle');
  const recorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') return;
    let mounted = true;
    voiceStatus().then((s) => mounted && setAvailable(s.transcribe));
    return () => {
      mounted = false;
      if (timerRef.current) clearTimeout(timerRef.current);
      const rec = recorderRef.current;
      if (rec && rec.state !== 'inactive') {
        rec.ondataavailable = null;
        rec.onstop = null;
        rec.stop();
        rec.stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const fail = (message: string) => {
    setState('idle');
    onError?.(message);
  };

  async function start() {
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      fail('Microphone access was blocked. Allow it in your browser and try again — or just type.');
      return;
    }
    const mimeType = pickMimeType();
    const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => e.data.size > 0 && chunks.push(e.data);
    recorder.onstop = async () => {
      stream.getTracks().forEach((t) => t.stop());
      setState('busy');
      const blob = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' });
      try {
        const res = await fetch('/api/voice/transcribe', {
          method: 'POST',
          headers: { 'content-type': blob.type },
          body: blob,
        });
        const data = (await res.json().catch(() => null)) as (TranscribeResponse & { error?: string }) | null;
        if (!res.ok || !data?.text) {
          fail(data?.error ?? 'Transcription failed. Try again, or type it.');
          return;
        }
        setState('idle');
        onText(data.text);
      } catch {
        fail('The network dropped while transcribing. Try again.');
      }
    };
    recorderRef.current = recorder;
    recorder.start();
    setState('recording');
    timerRef.current = setTimeout(() => stop(), MAX_RECORD_MS);
  }

  function stop() {
    if (timerRef.current) clearTimeout(timerRef.current);
    const rec = recorderRef.current;
    if (rec && rec.state !== 'inactive') rec.stop();
  }

  if (!available) return null;

  const label = state === 'recording' ? 'Stop recording' : state === 'busy' ? 'Transcribing…' : 'Record instead of typing';
  return (
    <button
      type="button"
      onClick={() => (state === 'recording' ? stop() : state === 'idle' && void start())}
      disabled={disabled || state === 'busy'}
      title={label}
      aria-label={label}
      aria-pressed={state === 'recording'}
      className={`relative inline-flex items-center justify-center w-9 h-9 rounded-full border transition-colors shrink-0
        ${state === 'recording' ? 'border-danger bg-danger/10 text-danger' : 'border-line-strong text-muted hover:text-accent hover:border-accent'}
        disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
    >
      {state === 'recording' && <span className="absolute inset-0 rounded-full border border-danger animate-ping" aria-hidden="true" />}
      {state === 'busy' ? (
        <span className="w-3.5 h-3.5 border-2 border-muted border-t-transparent rounded-full animate-spin" aria-hidden="true" />
      ) : state === 'recording' ? (
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
          <rect x="1" y="1" width="10" height="10" rx="2" fill="currentColor" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
          <path d="M7 1a2 2 0 0 1 2 2v4a2 2 0 1 1-4 0V3a2 2 0 0 1 2-2z" />
          <path d="M3.5 7a3.5 3.5 0 0 0 7 0H12a5 5 0 0 1-4.25 4.94V14h-1.5v-2.06A5 5 0 0 1 2 7h1.5z" />
        </svg>
      )}
    </button>
  );
}
