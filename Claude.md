# CLAUDE.md
Behavioral guidelines for Claude Code sessions working in this repo.

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
- Merging to `main` triggers `.github/workflows/deploy.yml`, which builds the
  SPA, applies pending D1 migrations to the remote `fluency-demo` database,
  deploys the Worker, and smoke-tests `/api/brand`.
- Do **not** report "it's deployed" until that run is green. The workflow's
  final step records the outcome in the shared `agentbuilder-core` D1
  `deployments` table (agent_id `fluency-demo`), so a session with Cloudflare
  credentials can confirm with:
  `npx wrangler d1 execute agentbuilder-core --remote --command "SELECT status, smoke_status, deployed_at FROM deployments WHERE agent_id='fluency-demo' ORDER BY deployed_at DESC LIMIT 1"`
  — wait for `status='success'` and `smoke_status='ok'`. Without credentials,
  watch the Actions run itself.

One-off remote DB tasks (e.g. resetting generated podcast episodes) go through
`.github/workflows/db-maintenance.yml` — a fixed task menu, dispatched manually
or by merging a PR that sets the task name in `.github/maintenance-request`.

---

## 6. Content Maintenance (autonomous)

This repo has no fleet error-capture pipeline — `fleet_errors`, `bug_tickets`,
and `/fleet-doctor` live in the AgentBuilder fleet repo, not here. The one
shared piece of fleet infrastructure is the `deployments` table §5 describes.

What this repo does run autonomously is the **volatile-content maintenance
agent** (`npm run maintain`, `scripts/maintenance-agent.mjs`): it walks ONLY
`layer: 'volatile'` content blocks, checks each against the current state of
the world, and proposes patches that preserve the block's voice, length, and
pedagogy. The stable layer is untouched by construction. `--write` applies
patches and bumps `reviewedAt`; the operator reviews `git diff content/`, then
`npm run seed:generate` and deploys.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

**Origin:** distilled from Andrej Karpathy's January 2026 observations on LLM coding pitfalls, via the [`andrej-karpathy-skills`](https://github.com/forrestchang/andrej-karpathy-skills) CLAUDE.md.
