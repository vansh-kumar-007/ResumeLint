# ADR-005: Deferred Auth and `packages/types` (YAGNI Decisions)

**Status**: Accepted
**Date**: 2026-07-24

## Context
It's tempting to scaffold every anticipated piece of infrastructure upfront. Two candidates were considered and deliberately deferred: authentication, and a shared `packages/types` package for cross-language type sync.

## Decision
- **Auth**: not implemented in MVP. API routes will be designed with an injectable "current user" dependency so auth can be added later without route rewrites, but no auth code ships until a milestone actually requires it.
- **`packages/types`**: not scaffolded until there's a real cross-package type-sharing need (expected around T009, when the score-report API contract is defined). Python and TypeScript don't share a type system natively, so this will itself need a follow-up ADR on strategy (OpenAPI-generated types vs. manual sync).

## Alternatives Considered
- **Scaffold everything now** — rejected: empty placeholder packages/routes confuse contributors and create maintenance surface for code that may end up designed differently once real requirements exist.

## Consequences
Slightly more setup work later (small, well-understood tasks) in exchange for avoiding premature abstraction and unused scaffolding sitting in the repo.