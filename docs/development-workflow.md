# Development workflow

Start each task with expected behavior and acceptance criteria. Implement a
focused change on a branch, run the checks, and open a PR with validation evidence.
A human reviews the resulting diff before merging. Deployment follows the
repository's hosting configuration.

## Local checks

Use Node 22 and install locked dependencies:

```sh
npm ci
npm --prefix backend ci
npm --prefix frontend ci
npm run check
```

The backend tests are offline and use mocked GitHub responses. They cover scoring
boundaries, inactive periods, cache expiry, shared concurrent requests, failed
request cleanup, repository pagination, upstream errors, partial event data,
and HTTP response contracts. The frontend check is a production build; it does
not substitute for browser testing of interactions or visual changes.

Audit all three lockfiles before dependency changes are merged:

The backend overrides Express 4's older `qs` range to a patched 6.x release.
Remove the override once Express itself requests a patched version; validate
query parsing and API tests when updating it.

```sh
npm audit --audit-level=high
npm --prefix backend audit --audit-level=high
npm --prefix frontend audit --audit-level=high
```

With Gitleaks installed, scan history:

```sh
gitleaks git . --redact --log-opts="--all"
```

To check uncommitted file contents, use `gitleaks dir . --redact` in a clean
checkout without real `.env` files or
dependency/build directories. Do not print secrets when investigating findings.
If a real secret was committed, rotate it; removing the file alone is insufficient.

## GitHub setup after pushing

The `CI` workflow runs for PRs and pushes to main/master. It runs offline tests,
the production build, audits all lockfiles (blocking high/critical advisories),
and uses the standalone Gitleaks CLI image to scan full Git history with redacted
output. CI has read-only repository permissions and receives no production secrets.
Dependabot proposes weekly npm and Actions updates for review.

These files do not change GitHub repository settings. In a branch ruleset for
the default branch, require a PR, at least one approving human review, and the
`Tests and frontend build`, `Dependency audit`, and `Secret scan` status checks.
Enable dependency graph, secret scanning, and push protection where the repository
plan supports them. Review bypass permissions so the rules have practical effect.

Check Vercel and Render settings separately: deployments must follow the intended
merge policy. Existing deployment configuration is not modified by this workflow.

## Agent access and progress

Configure access in the agent host: checkout-scoped writes, restricted network
access, mocked tests, and development-only credentials when a task truly needs them.
`AGENTS.md` documents behavior but cannot enforce a sandbox. Keep production
credentials outside the agent environment.

For each task, record the PR, check results, elapsed time, retries, and corrections
needed during review. Use that evidence to decide whether parallel agents or a
different model actually improve accepted changes per unit of time/cost. Introduce
parallel work only on request, using independent tasks and separate worktrees.
