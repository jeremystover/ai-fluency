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

// Create a stored hash for a new access code (admin console's code creation).
export async function hashCode(code: string, iterations = 100_000): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey('raw', enc.encode(code.normalize('NFKC')), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: salt as unknown as ArrayBuffer, iterations }, key, 256);
  return `pbkdf2$${iterations}$${b64(salt)}$${b64(bits)}`;
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

// Personal MCP keys ride in the connector URL instead of a cookie. Same HMAC
// secret, distinct message domain — a leaked MCP key can never pass as a
// session cookie, and a stolen cookie value can never open the MCP endpoint.
export async function signMcpKey(sessionId: string, secret: string): Promise<string> {
  const sig = await hmac(secret, `mcp:${sessionId}`);
  return `${sessionId}.${b64url(sig)}`;
}

export async function verifyMcpKey(key: string | undefined, secret: string): Promise<string | null> {
  if (!key) return null;
  const dot = key.lastIndexOf('.');
  if (dot <= 0) return null;
  const sessionId = key.slice(0, dot);
  const expected = await signMcpKey(sessionId, secret);
  if (!constantTimeEqual(enc.encode(key), enc.encode(expected))) return null;
  return sessionId;
}

// ---------- OAuth primitives ----------

// 256 bits of entropy, URL-safe: authorization codes, access and refresh
// tokens, client ids.
export function randomToken(): string {
  return b64url(crypto.getRandomValues(new Uint8Array(32)).buffer as ArrayBuffer);
}

// Codes and tokens are stored hashed, so a database dump never yields a
// usable credential. Unsalted SHA-256 is right here (unlike passwords): the
// input is already 256 bits of randomness, and lookup must be by exact hash.
export async function tokenHash(token: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', enc.encode(token));
  return b64url(digest);
}

// PKCE S256 (RFC 7636): the challenge is BASE64URL(SHA-256(verifier)).
export async function pkceChallengeFor(verifier: string): Promise<string> {
  return tokenHash(verifier);
}

export async function hashIp(ip: string, salt: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', enc.encode(`${salt}:${ip}`));
  return b64url(digest);
}
