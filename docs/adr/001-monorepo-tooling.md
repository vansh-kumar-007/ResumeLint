# ADR-001: Turborepo + pnpm Workspaces for Monorepo Tooling

**Status**: Accepted
**Date**: 2026-07-24

## Context
ResumeLint will have a Next.js frontend and a FastAPI backend, plus shared config/UI packages over time. We need dependency management and task orchestration across them.

## Decision
Use pnpm workspaces for dependency management and Turborepo for task orchestration (caching, parallel execution).

## Alternatives Considered
- **Nx** — more powerful (code generation, distributed CI, architectural boundary enforcement), but that power targets teams with 10+ packages or large teams. Overkill for our current scale; documented migration path exists if we outgrow Turborepo.
- **Standalone pnpm workspaces (no orchestrator)** — viable starting point, but we lose caching almost immediately once both apps and packages exist.
- **Separate polyrepos** — rejected: we want atomic commits across frontend/backend during early, fast-moving development, and shared config/lint rules are easier in one repo.

## Consequences
Low setup cost, fast CI once caching is wired up, easy onboarding for contributors already familiar with the Next.js ecosystem. We accept a documented, low-risk migration cost if we later need Nx's features.