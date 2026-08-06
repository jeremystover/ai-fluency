// PBKDF2 passcode verification, HMAC cookie signing, IP hashing.
// All comparisons on secret material are constant-time.

const enc = new TextEncoder();

const b64 = (buf: ArrayBuffer | Uint8Array): string => {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let s = '';
  for (const byte of bytes) s += String.fromCharCode(byte);
  return btoa(s);
};

const unb64 = (s: string): Uint8Array => {
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
};

const b64url = (buf: ArrayBuffer): string => b64(buf).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

export function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

// Stored format: pbkdf2$<iterations>$<salt_b64>$<hash_b64>
export async function verifyCode(code: string, stored: string): Promise<boolean> {
  const parts = stored.split('$');
  if (parts.length !== 4 || parts[0] !== 'pbkdf2') return false;
  const iterations = parseInt(parts[1], 10);
  if (!Number.isFinite(iterations) || iterations < 100_000) return false;
  const salt = unb64(parts[2]);
  const expected = unb64(parts[3]);
  const key = await crypto.subtle.importKey('raw', enc.encode(code.normalize('NFKC')), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: salt as unknown as ArrayBuffer, iterations }, key, expected.length * 8);
  return constantTimeEqual(new Uint8Array(bits), expected);
}

async function hmac(secret: string, message: string): Promise<ArrayBuffer> {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return crypto.subtle.sign('HMAC', key, enc.encode(message));
}

export async function signSessionId(sessionId: string, secret: string): Promise<string> {
  const sig = await hmac(secret, sessionId);
  return `${sessionId}.${b64url(sig)}`;
}

export async function verifySessionCookie(value: string | undefined, secret: string): Promise<string | null> {
  if (!value) return null;
  const dot = value.lastIndexOf('.');
  if (dot <= 0) return null;
  const sessionId = value.slice(0, dot);
  const expected = await signSessionId(sessionId, secret);
  if (!constantTimeEqual(enc.encode(value), enc.encode(expected))) return null;
  return sessionId;
}

export async function hashIp(ip: string, salt: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', enc.encode(`${salt}:${ip}`));
  return b64url(digest);
}
