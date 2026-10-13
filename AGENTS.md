# Working on DevTrack

## Project boundaries

DevTrack is a React/Vite dashboard backed by an Express API. Analytics are
deterministic: keep scoring, GitHub ingestion, builders, insights, and caching
in `backend/services`; keep presentation and interaction in `frontend/src`.
Preserve the response contract documented in README.md unless the task explicitly
changes it. The MVP has no persistent database.

## Commands

Use Node 22. Install locked dependencies with `npm ci` at the root and
`npm --prefix backend ci` / `npm --prefix frontend ci`.

- `npm test`: offline backend tests using Node's built-in runner.
- `npm run build`: production frontend build.
- `npm run check`: tests followed by the frontend build.
- `npm --prefix backend run dev`: API development server.
- `npm --prefix frontend run dev`: frontend development server.

On Windows PowerShell, use `npm.cmd` if execution policy blocks `npm.ps1`.

## Agent workflow

1. Inspect the relevant code and current Git changes before editing. Preserve
   unrelated user work. Define the task's expected behavior and acceptance criteria.
2. Make focused changes. Add meaningful behavior tests for scoring, caching, API
   contracts, and upstream failure handling when those behaviors change. Mock
   GitHub requests; tests must not depend on live accounts or credentials.
3. Run `npm run check` before handing off code changes. Report failures and
   unavailable checks honestly; do not weaken checks to obtain a passing result.
4. Report the resulting behavior, validation, and any remaining limitations.
   PRs should include evidence of checks and require human review before merging.

## Access boundaries

Use the coding tool's actual sandbox controls to limit writes to this checkout
and restrict network access to what the task needs. This file is guidance, not
an enforcement mechanism. Do not read or print real `.env` files, production
credentials, or deployment secrets. Use `.env.example` and mocked data.
Do not embed tokens in source, logs, prompts, or test fixtures.

Production deployments, credential changes, and automatic merges require explicit
user authorization. Keep CI read-only and free of production credentials; use
`pull_request`, never `pull_request_target` to execute contributed code.

## Parallel work

Use multiple agents only when the user explicitly requests them. Assign each
independent task a separate branch and worktree, define ownership, and agree on
any shared API contract before implementation. Worktrees isolate changes, not
credentials or processes. Validate the combined result before merging.
