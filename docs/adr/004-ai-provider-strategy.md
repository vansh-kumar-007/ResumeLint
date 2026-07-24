# ADR-004: Groq + OpenRouter Behind a Provider-Agnostic AI Layer

**Status**: Accepted
**Date**: 2026-07-24

## Context
Free-tier LLM API availability changes frequently — models are added, removed, or re-priced with little notice. Locking to a single provider risks the AI enrichment layer breaking without warning.

## Decision
Build one internal `AIProvider` interface with adapters. Ship with Groq as primary (fastest inference, generous rate limits) and OpenRouter as fallback/secondary (wider model pool). A future Ollama-local adapter is planned for contributors who want a zero-external-dependency option.

## Alternatives Considered
- **NVIDIA Nemotron only** (original idea) — rejected as sole provider: single point of failure, vendor lock-in risk explicitly flagged as a project constraint.
- **OpenRouter only** — viable but rate limits are tighter and provider availability behind `:free` routes rotates most frequently of the options evaluated.
- **Paid API (OpenAI/Anthropic direct)** — rejected: violates the "completely free, no hidden costs" project constraint.

## Consequences
Slightly more upfront engineering (interface + multiple adapters vs one SDK call), but the project is resilient to any single provider's free-tier changes — which live research confirmed happen frequently. Also gives future contributors an easy, well-scoped "add a provider" first issue.