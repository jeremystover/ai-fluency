# fluency-demo

A shareable AI-fluency demo: landing → passcode → intake ("how do you want this to go?") → personalized plan → diagnostic → calibration result → course path → Module 1 (read it, discuss it with a live tutor chat, or hear it as a custom two-host podcast) → applied activity with AI grading. Built as a credibility artifact for a single reviewer, not a product.

**Stack:** Cloudflare Workers (Hono) · Vite + React + TypeScript SPA served via Workers assets · D1 + Drizzle · Tailwind with all brand values as CSS custom properties · Anthropic API for grading, the module tutor, and podcast scripts (worker-side only) · Workers AI text-to-speech + R2 for podcast audio.

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

Grading, the tutor chat, and podcast scripts need a key: create `.dev.vars` with `ANTHROPIC_API_KEY=…` and `SESSION_SECRET=…`. Without a key everything else works; submissions save with a graceful "grading unavailable" state, the tutor reports itself offline, and the podcast studio says so instead of generating.

Podcast audio uses the Workers AI binding (`@cf/deepgram/aura-1`), which proxies to your Cloudflare account even under `wrangler dev` — so with the `ai` binding in `wrangler.jsonc`, local dev needs `wrangler login` (or `CLOUDFLARE_API_TOKEN`) to start at all. Working fully offline? Temporarily remove the `ai` block from `wrangler.jsonc`: everything runs, and the podcast studio honestly degrades to transcript-only episodes. R2 is simulated locally; no bucket setup needed for dev.

## Deploy

```bash
wrangler d1 create fluency-demo        # paste the id into wrangler.jsonc
wrangler r2 bucket create fluency-demo-audio   # podcast audio cache
npm run db:migrate:remote
npm run seed:generate && npm run db:seed:remote
wrangler secret put SESSION_SECRET
wrangler secret put ANTHROPIC_API_KEY
wrangler secret put ADMIN_PASSCODE     # gates the operator console at /admin
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
- **The tutor chat** (`/module/1/chat`) turns a module's content into an interactive lesson. It is content-driven end to end: the worker loads whatever `fd_content_block` rows exist for the module and builds the tutor's system prompt from them, so seeding a new module's content file gives that module a working tutor with zero code changes (`GET|POST /api/module/:id/chat` refuses modules that aren't open or have no blocks). The persona teaches in lecturettes, asks one applied question at a time, runs quiz mode, and follows the learner's steer; a `<paths>a|b|c</paths>` trailer on every reply becomes clickable next-move chips in the UI (the worker holds streamed text back a few characters so the tag never flashes on screen). Learner context — name, role, stated objective, time budget, diagnostic calibration direction, sorting-exercise result — rides in a second system block, so the tutor opens personalized. Replies stream token-by-token over NDJSON from the worker (`CHAT_MODEL`, key never leaves the worker); the module content block carries a prompt-cache breakpoint shared across sessions, and the conversation tail carries a second one. The transcript persists per session per module in `fd_chat_message` (raw model output, including the trailer), user turns are saved before the model is called and partial replies are saved on mid-stream failure, so nothing is ever lost. Limits: 30 tutor replies per session per hour, 2,000 chars per message, last 40 turns sent to the model. Funnel events: `chat_started`, `chat_message` (with a `via: text|voice` marker), `chat_reset`.
- **Voice is an input mode, not a page.** Every open text box in the app — the tutor composer, the intake objective, the applied-activity submission, the podcast focus prompt — carries a mic button (`MicButton`): record, Workers AI Whisper transcribes worker-side (`POST /api/voice/transcribe`, 60 clips/hour/session, 8 MB cap), and the text lands in the box for editing. The tutor chat goes further with a **voice mode** toggle: the mic sends what you said straight to the tutor, and every reply is read aloud in the tutor's own voice (Aura `athena` — deliberately a third voice, distinct from the podcast hosts). Any assistant reply also has a Listen button; audio renders on first request (`GET /api/module/:id/chat/audio/:messageId` — markdown stripped to speakable text, chunked at sentence boundaries, stitched MP3) and caches in R2 under `chat-tts/`. The mic hides itself entirely on deployments without the AI binding or browsers without a mic API — typing is never degraded. Funnel events: `voice_transcribed`, `chat_audio_rendered`.
- **The podcast** (`/module/1/podcast`) is one made-for-you episode per module, not a studio the learner has to operate. The scriptwriter gets the module's content blocks (exercises excluded — you can't read JSON aloud) plus everything known about the listener — name, role, selected goals, investment depth, diagnostic direction — and is told to make the episode unmistakably theirs: greeted by name, examples fit to their role, goals addressed mid-episode, length set by their depth (quick/standard/deep). Maya asks, Leo explains (`podcast-v3` prompt, `PODCAST_MODEL` + prompt version persisted on `fd_podcast`). **Cost logic:** podcast-first learners (styles rank podcast first) get their episode **pregenerated in the background** — at intake, and again on each `module_completed` so the next module's episode is waiting when they arrive; nothing is generated further ahead than that, since most learners won't finish everything. Everyone else gets a one-click "Make my episode" button — no auto-spend on a modality they didn't pick. After listening (gated server-side on `podcast_played`), the learner can **ask the hosts questions**: a `kind: 'qa'` follow-up segment (quick length, mailbag format, grounded in the module, questions inside `<listener_questions>` tags as steering data, not instructions). The Q&A hosts also remember what this listener actually heard: the module episode's script and the last three follow-ups ride along in `<heard_episode>` blocks, so answers can point back to the exact episode ("like we said about…") and build on earlier answers instead of repeating them. One default episode per module; free-form regeneration is gone. Audio is unchanged: lazily voiced on first listen by Workers AI `@cf/deepgram/aura-1` (asteria/orion), stitched, cached in R2; no key → honest offline message; no AI binding → transcript-only. 4 scripts/hour/session covers manual, Q&A, and pregeneration alike. Funnel: `podcast_requested` (with `kind` + `trigger: manual|pregen`) `→ podcast_script_ready → podcast_audio_rendered → podcast_played`.
- **The operator console** (`/admin`, unlinked) is gated by the `ADMIN_PASSCODE` secret and a separate HMAC-signed cookie; login attempts are rate limited like passcodes. Three tabs: a **review queue** (read any submission, add operator reviews with an optional /20 score — the async backup path for AI 201's peer exchange, per `fd_review`), **reporting** (totals, the full funnel, goal/style demand signals from intake, diagnostic calibration aggregates), and **access codes** (list/create/disable; new codes are PBKDF2-hashed server-side and usable immediately, plaintext never stored). With the secret unset, admin login returns 503 and the rest of the app is unaffected.
- **Grading** calls the Anthropic API from the worker (key in `wrangler secret`), rubric dimensions verbatim in the system prompt, strict-JSON response parsed defensively with one retry, then a graceful "saved, grading unavailable" fallback — submissions are persisted *before* grading is attempted, so nothing is ever lost. 5 grading calls per session per hour. `model_used` and `prompt_version` persist on `fd_submission`. Calibration is explicitly graded on honesty and specificity, not accuracy.

## Scope (v1, deliberate)

No accounts. Modules 2–8 and courses 201/301/401 are locked cards with real titles and blurbs (full 201 module drafts live in `content/ai201-*.md`). No gamification, no multi-tenancy, no LMS/SCORM. The admin console is deliberately minimal — one operator, three tabs.
