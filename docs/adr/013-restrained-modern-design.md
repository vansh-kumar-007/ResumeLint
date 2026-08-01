# ADR-013: Restrained Modern Design (Supersedes ADR-012 Neubrutalism)

**Status**: Accepted (supersedes ADR-012)
**Date**: 2026-07-27

## Context
ADR-012's neubrutalist implementation had real execution defects (dark background despite a light-theme requirement, contrast failures, a non-functional stray UI element) that undermined evaluation of the direction itself. On reflection, neither neubrutalism nor a typical AI-product dashboard (indigo/cyan duotone, glassmorphism) matched the goal: "modern and premium, but not visually identifiable as an AI-generated product."

## Decision
Adopt a restrained, light, single-accent design system (one blue accent, off-white background, 1px borders, no gradients, no glassmorphism, no heavy shadows) modeled on Linear/Stripe Dashboard/Postman rather than either neubrutalism or typical AI-SaaS dashboards. Deliberately avoid the indigo+cyan two-tone accent pairing specifically because it's the current visual signature of AI-generated products.

## Alternatives Considered
- **Neubrutalism (ADR-012)** — superseded: distinctive but landed further from expectations than intended, and implementation had real defects that made fair evaluation difficult.
- **Polished AI-SaaS dashboard (indigo/cyan, glassmorphism)** — rejected: this is precisely the visual pattern being avoided; achievable quickly but not distinctive.

## Consequences
Full visual rebuild of all report/upload components (third rebuild after T010/T011 baseline and T026 neubrutalism) — expensive in iteration count, but each rebuild reused the same underlying data/types/API layer, so the cost was concentrated in CSS/JSX, not application logic.