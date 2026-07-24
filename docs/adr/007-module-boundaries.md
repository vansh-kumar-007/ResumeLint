# ADR-007: Modular Domain Boundaries for Multi-Module Platform Growth

**Status**: Accepted
**Date**: 2026-07-24

## Context
ResumeLint's long-term vision is a platform with multiple modules (ATS Engine, Resume Optimizer, Job Match Engine, Mentor Chat, Mock Interview, etc.), not a single-purpose tool. The backend structure needs to support adding modules without rewrites.

## Decision
Structure `apps/api/src/domain/` and `apps/api/src/application/` as per-module subfolders (starting with `ats_engine/`), while `infrastructure/` (parsing, AI providers, DB, storage) stays shared and module-agnostic. Each future module gets its own domain + application subfolder and reuses shared infrastructure.

## Alternatives Considered
- **Flat structure, no module subfolders** — rejected: works fine for one module, becomes a tangled mess once 3-4 modules share one flat `domain/` folder with no clear ownership boundaries.
- **Fully separate services per module (microservices from day one)** — rejected as premature: massive operational overhead for a pre-MVP open-source project with no users yet. Can be revisited if/when a module needs independent scaling.

## Consequences
Adding a new module later is additive (new subfolder, new routes) rather than a rewrite. Slight upfront structure overhead for a project that currently only has one module — accepted as a low-cost investment given the stated long-term vision.