// Worker-side voice pipeline: speech-to-text for every open text input, and
// text-to-speech so any tutor reply can be listened to instead of read. Both
// run on Workers AI and degrade gracefully — a deployment without the binding
// loses voice, not the app. (The podcast is a separate engine entirely: its
// two hosts are voiced by Gemini multi-speaker TTS. See podcast.ts.)

// Structural type for the AI binding so we don't depend on workers-types
// carrying every partner model name.
export type AiBinding = { run(model: string, inputs: Record<string, unknown>): Promise<unknown> };

// The tutor reads in one voice; Aura-2 serves it well and the binding is
// already here for Whisper. Athena is distinct from the podcast hosts, so the
// tutor sounds like a third person rather than Maya or Leo moonlighting.
export const TTS_MODEL = '@cf/deepgram/aura-2-en';
export const TUTOR_VOICE = 'athena';
export const STT_MODEL = '@cf/openai/whisper-large-v3-turbo';
export const STT_FALLBACK_MODEL = '@cf/openai/whisper';

// btoa chokes on large buffers if called in one go — chunk it.
function toBase64(bytes: Uint8Array): string {
  let binary = '';
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  return btoa(binary);
}

type SttResult = { text?: unknown };

// Whisper large-v3-turbo takes base64; the older whisper takes a byte array.
// Try the better model first, fall back if the account doesn't serve it.
export async function transcribe(ai: AiBinding, bytes: Uint8Array): Promise<string | null> {
  try {
    const result = (await ai.run(STT_MODEL, { audio: toBase64(bytes) })) as SttResult;
    if (typeof result?.text === 'string' && result.text.trim()) return result.text.trim();
  } catch {
    // fall through to the fallback model
  }
  try {
    const result = (await ai.run(STT_FALLBACK_MODEL, { audio: [...bytes] })) as SttResult;
    if (typeof result?.text === 'string' && result.text.trim()) return result.text.trim();
  } catch {
    // both models failed — the caller answers with a clean error
  }
  return null;
}

// Tutor replies are markdown written for the eye; strip it down to something
// a voice can say. The <paths> trailer is removed by the caller.
export function speakable(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/^\s*>\s?/gm, '')
    .replace(/(\*\*|__|\*|_)/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 3000);
}

// Split on sentence boundaries into TTS-sized chunks; Aura pacing is better
// with a few medium segments than one long wall.
function chunkForSpeech(text: string, max = 1100): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+["')\]]*\s*|.+$/g) ?? [text];
  const chunks: string[] = [];
  let current = '';
  for (const sentence of sentences) {
    if (current && current.length + sentence.length > max) {
      chunks.push(current.trim());
      current = '';
    }
    current += sentence;
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

async function toBytes(result: unknown): Promise<Uint8Array | null> {
  if (result instanceof ReadableStream) return new Uint8Array(await new Response(result).arrayBuffer());
  if (result instanceof Response) return new Uint8Array(await result.arrayBuffer());
  if (result instanceof ArrayBuffer) return new Uint8Array(result);
  if (result instanceof Uint8Array) return result;
  return null;
}

async function speakLine(ai: AiBinding, text: string, speaker: string): Promise<Uint8Array | null> {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const result = await ai.run(TTS_MODEL, { text, speaker, encoding: 'mp3' });
      const bytes = await toBytes(result);
      if (bytes && bytes.length > 0) return bytes;
    } catch {
      // fall through to retry
    }
  }
  return null;
}

// Same encoder and settings per segment, so the concatenated MP3 plays as one
// file.
export async function renderSpeech(ai: AiBinding, text: string): Promise<Uint8Array | null> {
  const segments: Uint8Array[] = [];
  let total = 0;
  for (const chunk of chunkForSpeech(text)) {
    const bytes = await speakLine(ai, chunk, TUTOR_VOICE);
    if (!bytes) return null;
    segments.push(bytes);
    total += bytes.length;
  }
  if (total === 0) return null;
  const audio = new Uint8Array(total);
  let offset = 0;
  for (const seg of segments) {
    audio.set(seg, offset);
    offset += seg.length;
  }
  return audio;
}
