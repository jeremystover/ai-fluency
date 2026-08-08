# CLAUDE.md
Behavioral guidelines for Claude Code sessions working in this repo. Fleet conventions (rules about agents, packages, scaffolding) live in `AGENTS.md` — read both.

**Tradeoff:** these guidelines bias toward caution over speed. For trivial tasks, use judgment. Exception: §5 deploys are intentionally no-gate and override "if uncertain, ask" for merge approval.

--- 

## 1. Think Before Coding
**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

---

## 2. Simplicity First
**Minimum code that solves the problem. Nothing speculative.**

- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.

---

## 3. Surgical Changes
**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- If you notice unrelated dead code, mention it — don't delete it.

The test: every changed line should trace directly to the user's request.

---

## 4. Goal-Driven Execution
**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

## 5. Deploy Workflow
**Fix → fresh PR → merge → confirm. No human gate.**

**Merging and deploying is the default action, not a decision point.** Do
**not** stop to ask "should I merge?" / "should I deploy?" / "want me to open
a PR?" — just do it. This is a deliberate exception to §1's "if uncertain,
ask" and the general bias toward caution: for shipping a normal code change,
pausing for merge or deploy approval is the wrong move, and having to be told
"go ahead" every time is exactly the friction this section exists to prevent.

- Every code change ships through its **own** PR. Create it, and merge it
  (squash) yourself **without being asked and without pausing for approval**.
  **Never ask the user to open, approve, or merge a PR.** If a PR has merge
  conflicts, resolve them yourself and continue — don't ask. Never add commits
  to an already-merged PR — start a new branch.
- **Stop only for** a failing check you can't fix, a genuinely ambiguous
  change, or a destructive migration. Absent one of those, keep going.
- Merging to `main` triggers `_deploy-agent.yml`, which applies pending
  D1/Neon migrations and deploys the Worker.
- Do **not** report "it's deployed" until the `deployments` row in
  agentbuilder-core D1 shows `status='success'` and `smoke_status='ok'`.

The step-by-step mechanics — web-session MCP steps, migration rules, reading logs/`fleet_errors`, the debug loop, auth checks, and Makefile targets — live in the **`deploy` skill** (`.claude/skills/deploy/SKILL.md`). Invoke it whenever shipping or debugging.

---

## 6. Bug Monitoring (autonomous)

Errors from every agent are captured into the shared `agentbuilder-core` D1:

- `fleet_errors` — one row per occurrence (request / cron / queue / frontend).
- `bug_tickets` — deduped by fingerprint, with triage + fix state.
- `bug_fixes` — append-only audit of what got fixed or flagged.

Capture is wired through `@agentbuilder/observability`: `withObservability`
wraps each `fetch` handler, `runCron` covers crons, and `handleClientError`
(mounted at `POST /api/v1/client-error`) takes browser errors. See `AGENTS.md`
rules 11–12.

The **`/fleet-doctor`** slash command (`.claude/commands/fleet-doctor.md`) is
the autonomous triage loop: it reads open `bug_tickets`, fixes what it's
confident about (PR → merge → confirm via `deployments`), and opens a
`needs-human` GitHub issue for the rest. It is **anti-spin**: at most 2 fix
attempts per fingerprint, then it flags and stops.

Run it on a recurring **scheduled trigger** (Claude Code on the web →
environment settings; recommend hourly). To review what it has done, query
`bug_tickets` / `bug_fixes`.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

**Origin:** distilled from Andrej Karpathy's January 2026 observations on LLM coding pitfalls, via the [`andrej-karpathy-skills`](https://github.com/forrestchang/andrej-karpathy-skills) CLAUDE.md.

---

## Runtime agents
The four bolded one-liners above (§1–§4) are also exported from `@agentbuilder/llm` as `CORE_BEHAVIORAL_PREAMBLE`. Runtime agents (the AgentBuilder personas and any agent under `apps/*`) should prepend that constant to their system prompt. See `AGENTS.md` rule 10.
