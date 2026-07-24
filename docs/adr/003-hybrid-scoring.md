# ADR-003: Rule-Based + AI Hybrid Scoring (Not AI-Only)

**Status**: Accepted
**Date**: 2026-07-24

## Context
An ATS score generated purely by an LLM prompt is unexplainable, non-reproducible, and fully dependent on third-party AI availability.

## Decision
Build a deterministic rule engine as the primary scoring mechanism. AI is used only for enrichment: suggestions, rewrites, and conversational explanation — never as the sole source of a score.

## Alternatives Considered
- **Pure LLM scoring** — rejected: non-reproducible, unexplainable, and creates a hard dependency on paid/rate-limited external services for a core feature.
- **Pure rule-based, no AI at all** — rejected: loses the natural-language suggestion/rewrite quality that materially helps users improve their resumes.

## Consequences
Core scoring works even with AI providers down or rate-limited. Adds engineering cost (we must build and maintain the rule engine ourselves rather than delegating to a prompt), but this is also our biggest differentiation from generic "paste resume into ChatGPT" tools.