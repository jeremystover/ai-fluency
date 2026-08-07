# fluency-demo

A shareable AI-fluency demo: landing → passcode → intake ("how do you want this to go?") → personalized plan → diagnostic → calibration result → course path → Module 1 → applied activity with AI grading. Built as a credibility artifact for a single reviewer, not a product.

**Stack:** Cloudflare Workers (Hono) · Vite + React + TypeScript SPA served via Workers assets · D1 + Drizzle · Tailwind with all brand values as CSS custom properties · Anthropic API for grading (worker-side only).

## Run it locally

```bash
npm install
npm run seed:generate        # prints the demo passcodes it hashed
npm run db:migrate:local
npm run db:seed:local
npm run build                # SPA → dist/client
npm start                    # wrangler dev on :8787
```

Demo passcodes (default seed): `OMNISSA-101` (omnissa brand) and `VERDANT-DEMO` (verdant brand). Override with `DEMO_CODES='brand:CODE:Label,…' npm run seed:generate`. Only PBKDF2 hashes (100k iterations, per-code salt) reach the database.

For SPA hot reload during UI work: `npm run dev` (Vite on :5173, proxying `/api` to wrangler on :8787 — run both).

Grading needs a key: create `.dev.vars` with `ANTHROPIC_API_KEY=…` and `SESSION_SECRET=…`. Without a key everything else works; submissions save with a graceful "grading unavailable" state.

## Deploy

```bash
wrangler d1 create fluency-demo        # paste the id into wrangler.jsonc
npm run db:migrate:remote
npm run seed:generate && npm run db:seed:remote
wrangler secret put SESSION_SECRET
wrangler secret put ANTHROPIC_API_KEY
npm run deploy
```

## Architecture notes

- **Content is data.** Module 1 lives as `fd_content_block` rows seeded from `content/module-1-blocks.json`, preserving the stable/volatile split from the source draft (`[V]` passages are separate `layer: 'volatile'` blocks with `dependsOn` watch topics). The module footer's `Concepts reviewed · Examples current as of` stamps are computed from `reviewedAt` minimums per layer — never hardcoded. The future maintenance agent patches volatile blocks only.
- **Brand is data.** One brand active per deployment (`BRAND_SLUG` var). A brand is one JSON file (`content/brands/*.json`) → `fd_brand` row → CSS custom properties applied at `:root`. Components only read `var(--c-*)` / `var(--font-*)` / `var(--radius)`. The throwaway `verdant` brand exists purely to prove the swap: set `BRAND_SLUG=verdant`, redeploy, zero component changes. Omnissa palette and type (Outfit, `#001E60` / `#4A12F0` / `#C9FF27`) were derived from omnissa.com, not guessed.
- **Access.** Shared passcode per brand, PBKDF2-hashed with per-code salt, constant-time comparison, verified server-side only. Success sets an `HttpOnly; Secure; SameSite=Lax` cookie holding an HMAC-SHA256-signed session id (30 days). Failed attempts are rate limited: 10 per IP hash per 15 minutes. IPs are stored only as salted SHA-256 hashes.
- **The funnel** is append-only in `fd_event`. One statement answers it end to end:

  ```sql
  SELECT type, COUNT(*) AS events, COUNT(DISTINCT session_id) AS sessions
  FROM fd_event GROUP BY type ORDER BY MIN(created_at);
  ```

- **Personalization is the front door.** After the passcode, a five-step intake (name/role, how to start, time available, learning styles, free-text objective) writes to `fd_preference` and composes a deterministic plan (`GET /api/plan`) cut to the learner's time budget, echoing their objective and picking their starting point. Roadmap modalities (chat self-assessment, voice, podcast, course-as-MCP-server inside Claude/ChatGPT) appear as honestly tagged options — selecting one records demand in the funnel rather than faking a feature.
- **Calibration** (`fd_calibration`) carries the diagnostic baseline (`diagnostic:tN`), the full sorting exercise (`sort:tN`), and the Conversation-2 prediction (`m1:conversation2`). The result screen's signature visual renders from it.
- **Grading** calls the Anthropic API from the worker (key in `wrangler secret`), rubric dimensions verbatim in the system prompt, strict-JSON response parsed defensively with one retry, then a graceful "saved, grading unavailable" fallback — submissions are persisted *before* grading is attempted, so nothing is ever lost. 5 grading calls per session per hour. `model_used` and `prompt_version` persist on `fd_submission`. Calibration is explicitly graded on honesty and specificity, not accuracy.

## Scope (v1, deliberate)

No accounts. Modules 2–8 and courses 201/301/401 are locked cards with real titles and blurbs. No gamification, no admin UI, no multi-tenancy, no LMS/SCORM. See the ticket's non-goals.
