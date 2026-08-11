// OAuth 2.1 for the MCP connector.
//
// Claude's "add a custom connector" flow doesn't accept a pre-authenticated
// URL: it probes the MCP endpoint, expects a 401 pointing at protected-resource
// metadata, discovers an authorization server, registers itself as a client,
// sends the learner through an approval screen, and trades a PKCE code for a
// bearer token. This module is that whole handshake — the course app is both
// the resource server and its own authorization server.
//
// The design rule that makes it simple: the learner is ALREADY authenticated
// here (passcode or account session cookie). So /authorize doesn't collect
// credentials — it shows a branded consent screen and, on approval, mints a
// token bound to their existing fd_session. One progress record, whichever
// door the assistant came through.
//
// Specs: RFC 9728 (protected resource metadata), RFC 8414 (AS metadata),
// RFC 7591 (dynamic client registration), RFC 7636 (PKCE), RFC 8707 (resource
// indicators), and the MCP authorization spec that composes them.
import { Hono, type Context } from 'hono';
import { getCookie } from 'hono/cookie';
import { drizzle, type DrizzleD1Database } from 'drizzle-orm/d1';
import { and, eq, lt, sql } from 'drizzle-orm';
import * as t from '../db/schema';
import { randomToken, tokenHash, pkceChallengeFor, verifySessionCookie, constantTimeEqual } from './crypto';
import type { Env } from './index';

type OauthCtx = { Bindings: Env };

const COOKIE_NAME = 'fd_session';
const now = () => new Date().toISOString();
const secret = (env: Env) => env.SESSION_SECRET ?? 'dev-only-secret-set-SESSION_SECRET-in-production';

// The MCP endpoint these tokens are audience-bound to.
export const MCP_PATH = '/api/mcp';
const SCOPE = 'course';
const CODE_TTL_MS = 5 * 60 * 1000; // authorization codes are short-lived by design
const ACCESS_TTL_MS = 8 * 60 * 60 * 1000;
const REFRESH_TTL_MS = 30 * 24 * 60 * 60 * 1000;

const enc = new TextEncoder();

// ---------- CORS ----------
// claude.ai's connector runs in a browser, so every endpoint it touches needs
// permissive CORS — and the 401 challenge is useless unless WWW-Authenticate
// is in the exposed-headers list.
export const CORS_HEADERS: Record<string, string> = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, OPTIONS',
  'access-control-allow-headers': 'Content-Type, Authorization, MCP-Protocol-Version, Mcp-Session-Id, Last-Event-ID',
  'access-control-expose-headers': 'WWW-Authenticate, Mcp-Session-Id',
  'access-control-max-age': '86400',
};

const withCors = <T>(c: Context<OauthCtx>, body: T, status = 200) => {
  for (const [k, v] of Object.entries(CORS_HEADERS)) c.header(k, v);
  return c.json(body as object, status as 200);
};

// The 401 an unauthenticated MCP request must answer with: without the
// resource_metadata pointer, a client has no way to discover the auth server.
export const wwwAuthenticate = (origin: string, error?: string, description?: string) =>
  [
    `Bearer realm="AI Fluency course"`,
    `resource_metadata="${origin}/.well-known/oauth-protected-resource${MCP_PATH}"`,
    // The scope the client should ask for; without it a client requests
    // everything in scopes_supported.
    `scope="${SCOPE}"`,
    ...(error ? [`error="${error}"`] : []),
    ...(description ? [`error_description="${description}"`] : []),
  ].join(', ');

// ---------- token verification (used by the MCP endpoint) ----------

export type TokenCheck = { ok: true; sessionId: string } | { ok: false; error: string; description: string };

export async function verifyAccessToken(db: DrizzleD1Database, token: string): Promise<TokenCheck> {
  const hash = await tokenHash(token);
  const rows = await db
    .select()
    .from(t.fdOauthToken)
    .where(and(eq(t.fdOauthToken.tokenHash, hash), eq(t.fdOauthToken.kind, 'access')))
    .limit(1);
  const row = rows[0];
  if (!row) return { ok: false, error: 'invalid_token', description: 'Unknown access token.' };
  if (row.revokedAt) return { ok: false, error: 'invalid_token', description: 'This token was revoked.' };
  if (row.expiresAt <= now()) return { ok: false, error: 'invalid_token', description: 'This token expired; refresh it.' };
  return { ok: true, sessionId: row.sessionId };
}

// ---------- signed authorization requests ----------
// The consent screen posts back the request it was rendered for. Signing that
// blob means the POST handler can trust it without re-parsing query params,
// and an attacker can't forge a consent POST for parameters we never showed.

type AuthRequest = {
  clientId: string;
  redirectUri: string;
  state: string | null;
  codeChallenge: string;
  codeChallengeMethod: string;
  scope: string;
  resource: string | null;
  exp: number;
};

async function hmacB64(message: string, key: string): Promise<string> {
  const k = await crypto.subtle.importKey('raw', enc.encode(key), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', k, enc.encode(message));
  return btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

const b64urlEncode = (s: string) => btoa(unescape(encodeURIComponent(s))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const b64urlDecode = (s: string) => decodeURIComponent(escape(atob(s.replace(/-/g, '+').replace(/_/g, '/'))));

async function signRequest(req: AuthRequest, key: string): Promise<string> {
  const payload = b64urlEncode(JSON.stringify(req));
  return `${payload}.${await hmacB64(payload, key)}`;
}

async function verifyRequest(blob: string | undefined, key: string): Promise<AuthRequest | null> {
  if (!blob) return null;
  const dot = blob.lastIndexOf('.');
  if (dot <= 0) return null;
  const payload = blob.slice(0, dot);
  const expected = await hmacB64(payload, key);
  if (!constantTimeEqual(enc.encode(blob.slice(dot + 1)), enc.encode(expected))) return null;
  try {
    const req = JSON.parse(b64urlDecode(payload)) as AuthRequest;
    return req.exp > Date.now() ? req : null;
  } catch {
    return null;
  }
}

// ---------- redirect-uri matching ----------
// Exact string match (OAuth 2.1): no prefix or wildcard matching, ever.
// http is allowed only for loopback, which is how local MCP clients
// (Claude Code, Inspector) receive their callback.
function redirectAllowed(uri: string): boolean {
  let u: URL;
  try {
    u = new URL(uri);
  } catch {
    return false;
  }
  if (u.protocol === 'https:') return true;
  // Cleartext is allowed ONLY for loopback, which is how local MCP clients
  // receive their callback. Any other http: URI would put the code on the wire.
  if (u.protocol === 'http:') {
    return u.hostname === 'localhost' || u.hostname === '127.0.0.1' || u.hostname === '[::1]' || u.hostname === '::1';
  }
  // Native clients may register a private-use scheme (e.g. myapp://callback).
  // Schemes that can execute in a browser context are never redirect targets.
  const banned = new Set(['javascript:', 'data:', 'vbscript:', 'file:', 'blob:', 'about:', 'ws:', 'wss:']);
  return /^[a-z][a-z0-9+.-]*:$/.test(u.protocol) && !banned.has(u.protocol);
}

// A registered loopback URI may come back on a different port (RFC 8252 §7.3),
// so ports are ignored for loopback comparisons only.
function redirectMatches(registered: string[], candidate: string): boolean {
  if (registered.includes(candidate)) return true;
  let cand: URL;
  try {
    cand = new URL(candidate);
  } catch {
    return false;
  }
  const isLoopback = cand.protocol === 'http:' && (cand.hostname === 'localhost' || cand.hostname === '127.0.0.1' || cand.hostname === '[::1]');
  if (!isLoopback) return false;
  return registered.some((r) => {
    try {
      const reg = new URL(r);
      return reg.protocol === cand.protocol && reg.hostname === cand.hostname && reg.pathname === cand.pathname;
    } catch {
      return false;
    }
  });
}

// ---------- the consent screen ----------

const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]!);

type BrandLook = { name: string; colors: Record<string, string>; fontDisplay: string; fontBody: string; radius: string };

async function brandLook(db: DrizzleD1Database, env: Env): Promise<BrandLook> {
  const fallback: BrandLook = {
    name: 'AI Fluency',
    colors: { bg: '#f5f5f7', surface: '#ffffff', ink: '#28334a', 'ink-strong': '#001e60', muted: '#616899', accent: '#4a12f0', 'on-accent': '#ffffff', line: '#d9d9e4' },
    fontDisplay: 'system-ui, sans-serif',
    fontBody: 'system-ui, sans-serif',
    radius: '10px',
  };
  try {
    const rows = await db.select().from(t.fdBrand).where(eq(t.fdBrand.slug, env.BRAND_SLUG)).limit(1);
    const row = rows[0];
    if (!row) return fallback;
    const tokens = JSON.parse(row.tokensJson) as { color?: Record<string, string>; fontDisplay?: string; fontBody?: string; radius?: string };
    return {
      name: row.name,
      colors: { ...fallback.colors, ...(tokens.color ?? {}) },
      // The app loads its webfonts from a bundle this standalone page can't
      // reach, so brand fonts degrade to the system stack by name.
      fontDisplay: `${tokens.fontDisplay ?? ''}, system-ui, sans-serif`.replace(/^, /, ''),
      fontBody: `${tokens.fontBody ?? ''}, system-ui, sans-serif`.replace(/^, /, ''),
      radius: tokens.radius ?? fallback.radius,
    };
  } catch {
    return fallback;
  }
}

function page(look: BrandLook, inner: string): string {
  const vars = Object.entries(look.colors)
    .map(([k, v]) => `--c-${k}: ${v};`)
    .join('');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Connect · ${escapeHtml(look.name)} AI Fluency</title>
<style>
:root{${vars}--radius:${look.radius}}
*{box-sizing:border-box}
body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;
background:var(--c-bg);color:var(--c-ink);font-family:${look.fontBody};line-height:1.5}
.card{background:var(--c-surface);border:1px solid var(--c-line);border-radius:var(--radius);padding:32px;max-width:460px;width:100%}
h1{font-family:${look.fontDisplay};color:var(--c-ink-strong);font-size:24px;line-height:1.25;margin:0 0 12px}
p{margin:0 0 16px}
.label{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--c-muted);margin:0 0 16px}
.client{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:13px;color:var(--c-ink-strong);
background:var(--c-bg);border:1px solid var(--c-line);border-radius:calc(var(--radius) / 1.5);padding:10px 12px;margin:0 0 20px;word-break:break-all}
ul{margin:0 0 24px;padding-left:20px;color:var(--c-ink)}
li{margin-bottom:6px}
.muted{color:var(--c-muted);font-size:13px}
button{font-family:${look.fontDisplay};font-weight:600;font-size:15px;border:0;border-radius:var(--radius);
padding:12px 20px;cursor:pointer;background:var(--c-accent);color:var(--c-on-accent);width:100%}
button:hover{opacity:.9}
.row{display:flex;gap:12px;align-items:center;margin-top:12px}
a.cancel{color:var(--c-muted);font-size:14px;text-decoration:none}
a.cancel:hover{color:var(--c-ink-strong)}
a.btn{display:block;text-align:center;text-decoration:none;font-family:${look.fontDisplay};font-weight:600;
border-radius:var(--radius);padding:12px 20px;background:var(--c-accent);color:var(--c-on-accent)}
</style></head><body><div class="card">${inner}</div></body></html>`;
}

function consentPage(look: BrandLook, clientName: string, blob: string, learner: string | null): string {
  return page(
    look,
    `<p class="label">${escapeHtml(look.name)} · AI Fluency</p>
<h1>Connect your course to ${escapeHtml(clientName)}?</h1>
${learner ? `<p>Signed in as <strong>${escapeHtml(learner)}</strong>.</p>` : ''}
<p>${escapeHtml(clientName)} will be able to:</p>
<ul>
<li>Read the course content and your progress</li>
<li>Quiz you and record what you score</li>
<li>Mark modules complete when you've earned it</li>
<li>Submit your graded activities and predictions</li>
</ul>
<p class="muted">Everything it records lands on the same course record you see in the app. You can disconnect at any time from the connector's settings.</p>
<form method="post" action="/oauth/authorize">
<input type="hidden" name="request" value="${escapeHtml(blob)}">
<button type="submit" name="approve" value="yes">Connect</button>
<div class="row"><a class="cancel" href="#" onclick="document.getElementById('deny').click();return false">Cancel</a></div>
<button id="deny" type="submit" name="approve" value="no" style="display:none"></button>
</form>`,
  );
}

// Door-agnostic on purpose: the course opens to an account sign-in or a demo
// passcode, and which one this person holds is theirs to know, not ours.
function signInPage(look: BrandLook, next: string): string {
  return page(
    look,
    `<p class="label">${escapeHtml(look.name)} · AI Fluency</p>
<h1>Sign in to connect your course</h1>
<p>Sign in to the course first — with your account or your demo passcode — and we'll bring you straight back here to finish connecting.</p>
<a class="btn" href="/enter?next=${encodeURIComponent(next)}">Go to sign in</a>`,
  );
}

function errorPage(look: BrandLook, title: string, detail: string): string {
  return page(look, `<p class="label">${escapeHtml(look.name)} · AI Fluency</p><h1>${escapeHtml(title)}</h1><p>${escapeHtml(detail)}</p>`);
}

// ---------- the app ----------

export function createOauthApp() {
  const oauth = new Hono<OauthCtx>();

  const dbOf = (c: Context<OauthCtx>) => drizzle(c.env.DB);
  const originOf = (c: Context<OauthCtx>) => new URL(c.req.url).origin;

  // Browser-based clients preflight everything.
  oauth.options('/.well-known/*', (c) => withCors(c, {}, 204));
  oauth.options('/oauth/*', (c) => withCors(c, {}, 204));

  // --- RFC 9728: what this resource is and who authorizes for it. Clients
  // find this from the 401's resource_metadata pointer; the path-inserted
  // form is canonical, the bare form is what some clients try first.
  // RFC 9728 §3.3 is strict: the `resource` we return must be byte-identical
  // to the URL the client asked about, or it MUST discard the document. The
  // well-known path carries that URL's path inserted after the host, so echo
  // it back rather than always answering with the canonical MCP path — a
  // learner who configured their personal key URL must still discover.
  const resourceMetadata = (c: Context<OauthCtx>) => {
    const origin = originOf(c);
    const suffix = new URL(c.req.url).pathname.replace(/^\/\.well-known\/oauth-protected-resource/, '').replace(/\/$/, '');
    const resourcePath = suffix.startsWith(MCP_PATH) ? suffix : MCP_PATH;
    return withCors(c, {
      resource: `${origin}${resourcePath}`,
      authorization_servers: [origin],
      scopes_supported: [SCOPE],
      bearer_methods_supported: ['header'],
      resource_name: 'AI Fluency course',
      resource_documentation: `${origin}/mcp`,
    });
  };
  oauth.get('/.well-known/oauth-protected-resource', resourceMetadata);
  oauth.get('/.well-known/oauth-protected-resource/*', resourceMetadata);

  // --- RFC 8414: this deployment is its own authorization server.
  const asMetadata = (c: Context<OauthCtx>) => {
    const origin = originOf(c);
    return withCors(c, {
      issuer: origin,
      authorization_endpoint: `${origin}/oauth/authorize`,
      token_endpoint: `${origin}/oauth/token`,
      registration_endpoint: `${origin}/oauth/register`,
      revocation_endpoint: `${origin}/oauth/revoke`,
      // offline_access advertised HERE (not in the resource metadata, which is
      // a resource concern) is how a client knows to ask for a refresh token.
      scopes_supported: [SCOPE, 'offline_access'],
      response_types_supported: ['code'],
      response_modes_supported: ['query'],
      grant_types_supported: ['authorization_code', 'refresh_token'],
      token_endpoint_auth_methods_supported: ['none', 'client_secret_post'],
      // PKCE is mandatory in OAuth 2.1 and the MCP spec; S256 only.
      code_challenge_methods_supported: ['S256'],
      // RFC 8707 — tokens are audience-bound to the MCP endpoint.
      authorization_response_iss_parameter_supported: true,
      service_documentation: `${origin}/mcp`,
    });
  };
  oauth.get('/.well-known/oauth-authorization-server', asMetadata);
  oauth.get('/.well-known/oauth-authorization-server/*', asMetadata);
  // Some clients probe the OIDC discovery document before the OAuth one.
  oauth.get('/.well-known/openid-configuration', asMetadata);
  oauth.get('/.well-known/openid-configuration/*', asMetadata);

  // --- RFC 7591: dynamic client registration. Claude registers itself the
  // first time a learner connects; there is no manual client provisioning.
  // Some client builds POST a hardcoded /register instead of the advertised
  // registration_endpoint, so the root path is an alias, not a redirect —
  // a redirect here would drop the request body.
  const register = async (c: Context<OauthCtx>) => {
    const db = dbOf(c);
    c.header('cache-control', 'no-store');
    const body = await c.req.json<Record<string, unknown>>().catch(() => null);
    if (!body) return withCors(c, { error: 'invalid_client_metadata', error_description: 'Body must be JSON.' }, 400);

    const uris = Array.isArray(body.redirect_uris) ? body.redirect_uris.filter((u): u is string => typeof u === 'string') : [];
    if (!uris.length) return withCors(c, { error: 'invalid_redirect_uri', error_description: 'At least one redirect_uri is required.' }, 400);
    if (uris.length > 10) return withCors(c, { error: 'invalid_redirect_uri', error_description: 'Too many redirect URIs.' }, 400);
    for (const uri of uris) {
      if (!redirectAllowed(uri)) {
        return withCors(c, { error: 'invalid_redirect_uri', error_description: `Redirect URI must be https (or loopback http): ${uri}` }, 400);
      }
    }
    // Unknown grants are dropped rather than rejected: a client asking for
    // something extra shouldn't fail registration over it.
    const asked = Array.isArray(body.grant_types) ? (body.grant_types as string[]) : ['authorization_code'];
    const grants = asked.filter((g) => g === 'authorization_code' || g === 'refresh_token');
    if (!grants.includes('authorization_code')) grants.unshift('authorization_code');

    // Public clients using PKCE are the norm for MCP; honor a request to be
    // confidential, but never require it.
    const requested = typeof body.token_endpoint_auth_method === 'string' ? body.token_endpoint_auth_method : 'none';
    const authMethod = requested === 'client_secret_post' || requested === 'client_secret_basic' ? requested : 'none';
    const clientId = `mcp_${randomToken()}`;
    const clientSecret = authMethod === 'none' ? null : randomToken();
    const name = typeof body.client_name === 'string' ? body.client_name.slice(0, 120) : null;

    await db.insert(t.fdOauthClient).values({
      id: clientId,
      name,
      redirectUris: JSON.stringify(uris),
      secretHash: clientSecret ? await tokenHash(clientSecret) : null,
      tokenEndpointAuthMethod: authMethod,
      metadataJson: JSON.stringify(body).slice(0, 8000),
      createdAt: now(),
    });

    return withCors(
      c,
      {
        client_id: clientId,
        ...(clientSecret ? { client_secret: clientSecret } : {}),
        client_id_issued_at: Math.floor(Date.now() / 1000),
        ...(clientSecret ? { client_secret_expires_at: 0 } : {}),
        redirect_uris: uris,
        grant_types: grants,
        response_types: ['code'],
        token_endpoint_auth_method: authMethod,
        ...(name ? { client_name: name } : {}),
        scope: `${SCOPE} offline_access`,
      },
      201,
    );
  };
  oauth.post('/oauth/register', register);
  oauth.post('/register', register);

  // --- The approval screen. The learner is already authenticated here, so
  // this asks consent, never credentials.
  oauth.get('/oauth/authorize', async (c) => {
    const db = dbOf(c);
    const look = await brandLook(db, c.env);
    const q = c.req.query();

    const clientId = q.client_id ?? '';
    const clientRows = clientId ? await db.select().from(t.fdOauthClient).where(eq(t.fdOauthClient.id, clientId)).limit(1) : [];
    const client = clientRows[0];
    // Errors about the client or redirect_uri itself must be shown here, never
    // redirected — sending them onward would be an open redirect.
    if (!client) return c.html(errorPage(look, 'Unknown application', 'This app is not registered with the course. Try removing and re-adding the connector.'), 400);
    const registered = JSON.parse(client.redirectUris) as string[];
    const redirectUri = q.redirect_uri ?? (registered.length === 1 ? registered[0] : '');
    if (!redirectUri || !redirectMatches(registered, redirectUri)) {
      return c.html(errorPage(look, 'Redirect mismatch', 'This app asked to be sent somewhere it never registered. Nothing was connected.'), 400);
    }

    const fail = (error: string, description: string) => {
      const url = new URL(redirectUri);
      url.searchParams.set('error', error);
      url.searchParams.set('error_description', description);
      if (q.state) url.searchParams.set('state', q.state);
      return c.redirect(url.toString(), 302);
    };

    if ((q.response_type ?? '') !== 'code') return fail('unsupported_response_type', 'Only the authorization code flow is supported.');
    if (!q.code_challenge) return fail('invalid_request', 'PKCE is required: send code_challenge with method S256.');
    if ((q.code_challenge_method ?? 'plain') !== 'S256') return fail('invalid_request', 'Only the S256 code challenge method is supported.');
    // RFC 8707: if an audience is named, it must be this deployment's MCP endpoint.
    if (q.resource) {
      try {
        if (new URL(q.resource).origin !== originOf(c)) return fail('invalid_target', 'That resource is not served by this course.');
      } catch {
        return fail('invalid_target', 'The resource parameter must be an absolute URI.');
      }
    }

    // Not signed in? Send them through the course's own door and come back.
    const sessionId = await verifySessionCookie(getCookie(c, COOKIE_NAME), secret(c.env));
    const session = sessionId ? (await db.select().from(t.fdSession).where(eq(t.fdSession.id, sessionId)).limit(1))[0] : undefined;
    if (!session) {
      const back = new URL(c.req.url);
      return c.html(signInPage(look, `${back.pathname}${back.search}`), 200);
    }

    const participant = (
      await db
        .select({ displayName: t.fdParticipant.displayName })
        .from(t.fdParticipant)
        .where(eq(t.fdParticipant.sessionId, session.id))
        .orderBy(sql`${t.fdParticipant.createdAt} DESC`)
        .limit(1)
    )[0];

    const blob = await signRequest(
      {
        clientId,
        redirectUri,
        state: q.state ?? null,
        codeChallenge: q.code_challenge,
        codeChallengeMethod: 'S256',
        scope: q.scope || SCOPE,
        resource: q.resource ?? null,
        exp: Date.now() + 10 * 60 * 1000,
      },
      secret(c.env),
    );
    return c.html(consentPage(look, client.name ?? 'This application', blob, participant?.displayName ?? null));
  });

  // --- Consent submitted: mint the one-time code and hand back control.
  oauth.post('/oauth/authorize', async (c) => {
    const db = dbOf(c);
    const look = await brandLook(db, c.env);
    const form = await c.req.parseBody().catch(() => null);
    const req = await verifyRequest(typeof form?.request === 'string' ? form.request : undefined, secret(c.env));
    if (!req) return c.html(errorPage(look, 'That approval expired', 'Nothing was connected. Start the connection again from your assistant.'), 400);

    const redirect = new URL(req.redirectUri);
    if (req.state) redirect.searchParams.set('state', req.state);
    // RFC 9207: name the issuer so the client can't be tricked by a mix-up.
    redirect.searchParams.set('iss', originOf(c));

    if (form?.approve !== 'yes') {
      redirect.searchParams.set('error', 'access_denied');
      redirect.searchParams.set('error_description', 'The learner declined the connection.');
      return c.redirect(redirect.toString(), 302);
    }

    const sessionId = await verifySessionCookie(getCookie(c, COOKIE_NAME), secret(c.env));
    const session = sessionId ? (await db.select().from(t.fdSession).where(eq(t.fdSession.id, sessionId)).limit(1))[0] : undefined;
    if (!session) return c.html(errorPage(look, 'Your session ended', 'Sign in to the course again, then reconnect from your assistant.'), 401);

    const code = randomToken();
    await db.insert(t.fdOauthCode).values({
      codeHash: await tokenHash(code),
      clientId: req.clientId,
      sessionId: session.id,
      redirectUri: req.redirectUri,
      codeChallenge: req.codeChallenge,
      codeChallengeMethod: req.codeChallengeMethod,
      scope: req.scope,
      resource: req.resource,
      expiresAt: new Date(Date.now() + CODE_TTL_MS).toISOString(),
      usedAt: null,
      createdAt: now(),
    });
    await db.insert(t.fdEvent).values({
      id: crypto.randomUUID(),
      sessionId: session.id,
      type: 'mcp_oauth_approved',
      payloadJson: JSON.stringify({ clientId: req.clientId }),
      createdAt: now(),
    });

    redirect.searchParams.set('code', code);
    return c.redirect(redirect.toString(), 302);
  });

  // --- Code and refresh exchange. Form-encoded in, JSON out (RFC 6749).
  const token = async (c: Context<OauthCtx>) => {
    const db = dbOf(c);
    // RFC 6749 §5.1: token responses must never be cached.
    c.header('cache-control', 'no-store');
    c.header('pragma', 'no-cache');
    const form = await c.req.parseBody().catch(() => null);
    const str = (k: string) => (typeof form?.[k] === 'string' ? (form[k] as string) : undefined);
    const bad = (error: string, description: string, status: 400 | 401 = 400) => withCors(c, { error, error_description: description }, status);
    if (!form) return bad('invalid_request', 'Body must be form-encoded.');

    // Client authentication: public clients present only client_id; a
    // confidential client's secret is checked in constant time.
    const authHeader = c.req.header('authorization');
    let clientId = str('client_id');
    let clientSecret = str('client_secret');
    if (authHeader?.toLowerCase().startsWith('basic ')) {
      try {
        const [id, sec] = atob(authHeader.slice(6)).split(':');
        clientId = clientId ?? decodeURIComponent(id);
        clientSecret = clientSecret ?? decodeURIComponent(sec ?? '');
      } catch {
        return bad('invalid_client', 'Malformed Basic credentials.', 401);
      }
    }
    if (!clientId) return bad('invalid_client', 'client_id is required.', 401);
    const client = (await db.select().from(t.fdOauthClient).where(eq(t.fdOauthClient.id, clientId)).limit(1))[0];
    if (!client) return bad('invalid_client', 'Unknown client.', 401);
    if (client.secretHash) {
      if (!clientSecret) return bad('invalid_client', 'This client must authenticate with its secret.', 401);
      const presented = await tokenHash(clientSecret);
      if (!constantTimeEqual(enc.encode(presented), enc.encode(client.secretHash))) return bad('invalid_client', 'Bad client secret.', 401);
    }

    const grantType = str('grant_type');

    if (grantType === 'authorization_code') {
      const code = str('code');
      const verifier = str('code_verifier');
      if (!code) return bad('invalid_request', 'code is required.');
      if (!verifier) return bad('invalid_request', 'code_verifier is required (PKCE).');

      const hash = await tokenHash(code);
      const row = (await db.select().from(t.fdOauthCode).where(eq(t.fdOauthCode.codeHash, hash)).limit(1))[0];
      if (!row) return bad('invalid_grant', 'That authorization code is not valid.');
      // Replay: the code was already spent. Burn every token it produced —
      // a second presentation means the code leaked.
      if (row.usedAt) {
        await db.update(t.fdOauthToken).set({ revokedAt: now() }).where(and(eq(t.fdOauthToken.sessionId, row.sessionId), eq(t.fdOauthToken.clientId, row.clientId)));
        return bad('invalid_grant', 'That authorization code was already used.');
      }
      if (row.expiresAt <= now()) return bad('invalid_grant', 'That authorization code expired. Start the connection again.');
      if (row.clientId !== clientId) return bad('invalid_grant', 'That code was issued to a different client.');
      const redirectUri = str('redirect_uri');
      if (redirectUri && redirectUri !== row.redirectUri) return bad('invalid_grant', 'redirect_uri does not match the authorization request.');
      const challenge = await pkceChallengeFor(verifier);
      if (!constantTimeEqual(enc.encode(challenge), enc.encode(row.codeChallenge))) return bad('invalid_grant', 'PKCE verification failed.');

      await db.update(t.fdOauthCode).set({ usedAt: now() }).where(eq(t.fdOauthCode.codeHash, hash));
      return withCors(c, await issueTokens(db, c, clientId, row.sessionId, row.scope ?? SCOPE, row.resource));
    }

    if (grantType === 'refresh_token') {
      const presented = str('refresh_token');
      if (!presented) return bad('invalid_request', 'refresh_token is required.');
      const hash = await tokenHash(presented);
      const row = (await db.select().from(t.fdOauthToken).where(and(eq(t.fdOauthToken.tokenHash, hash), eq(t.fdOauthToken.kind, 'refresh'))).limit(1))[0];
      if (!row) return bad('invalid_grant', 'That refresh token is not valid.');
      if (row.clientId !== clientId) return bad('invalid_grant', 'That refresh token was issued to a different client.');
      if (row.revokedAt) {
        // Rotation reuse: the whole family is suspect.
        await db.update(t.fdOauthToken).set({ revokedAt: now() }).where(and(eq(t.fdOauthToken.sessionId, row.sessionId), eq(t.fdOauthToken.clientId, row.clientId)));
        return bad('invalid_grant', 'That refresh token was already rotated. Reconnect the course.');
      }
      if (row.expiresAt <= now()) return bad('invalid_grant', 'That refresh token expired. Reconnect the course.');
      // Rotate: this token is spent the moment it is exchanged.
      await db.update(t.fdOauthToken).set({ revokedAt: now() }).where(eq(t.fdOauthToken.tokenHash, hash));
      return withCors(c, await issueTokens(db, c, clientId, row.sessionId, row.scope ?? SCOPE, row.resource));
    }

    return bad('unsupported_grant_type', 'Supported grants: authorization_code, refresh_token.');
  };
  oauth.post('/oauth/token', token);
  oauth.post('/token', token);

  // --- RFC 7009 revocation: how "disconnect" actually disconnects.
  oauth.post('/oauth/revoke', async (c) => {
    const db = dbOf(c);
    const form = await c.req.parseBody().catch(() => null);
    const token = typeof form?.token === 'string' ? form.token : undefined;
    if (token) {
      await db.update(t.fdOauthToken).set({ revokedAt: now() }).where(eq(t.fdOauthToken.tokenHash, await tokenHash(token)));
    }
    // Always 200: revocation must not leak whether a token existed.
    return withCors(c, {});
  });

  return oauth;
}

// Issue an access/refresh pair and opportunistically sweep expired rows —
// there is no cron for this table and it should not grow without bound.
async function issueTokens(
  db: DrizzleD1Database,
  c: Context<OauthCtx>,
  clientId: string,
  sessionId: string,
  scope: string,
  resource: string | null,
) {
  const access = randomToken();
  const refresh = randomToken();
  const at = now();
  await db.insert(t.fdOauthToken).values([
    {
      tokenHash: await tokenHash(access),
      kind: 'access',
      clientId,
      sessionId,
      scope,
      resource,
      expiresAt: new Date(Date.now() + ACCESS_TTL_MS).toISOString(),
      revokedAt: null,
      createdAt: at,
    },
    {
      tokenHash: await tokenHash(refresh),
      kind: 'refresh',
      clientId,
      sessionId,
      scope,
      resource,
      expiresAt: new Date(Date.now() + REFRESH_TTL_MS).toISOString(),
      revokedAt: null,
      createdAt: at,
    },
  ]);
  c.executionCtx.waitUntil(
    (async () => {
      const cutoff = new Date(Date.now() - REFRESH_TTL_MS).toISOString();
      await db.delete(t.fdOauthCode).where(lt(t.fdOauthCode.expiresAt, at));
      await db.delete(t.fdOauthToken).where(lt(t.fdOauthToken.expiresAt, cutoff));
    })().catch(() => {}),
  );
  return {
    access_token: access,
    token_type: 'Bearer',
    expires_in: Math.floor(ACCESS_TTL_MS / 1000),
    refresh_token: refresh,
    scope,
  };
}
