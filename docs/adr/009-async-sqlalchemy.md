# ADR-009: Async SQLAlchemy 2.0 over Sync ORM

**Status**: Accepted
**Date**: 2026-07-24

## Context
FastAPI is built on Python's asyncio event loop. Using a synchronous ORM inside async route handlers blocks the event loop during DB I/O, undermining FastAPI's concurrency model.

## Decision
Use SQLAlchemy 2.0's native async engine/session (`create_async_engine`, `AsyncSession`), with `aiosqlite` for SQLite in development and a plan to use `asyncpg` when migrating to PostgreSQL. Alembic is configured with its async template to match.

## Alternatives Considered
- **Sync SQLAlchemy** — simpler mental model, more tutorials use it, but blocks the event loop under concurrent load — a real problem once multiple users upload/analyze resumes simultaneously.
- **SQLModel** (FastAPI author's own ORM, built on SQLAlchemy) — interesting for reduced boilerplate, but adds a dependency layer on top of SQLAlchemy for a benefit (less duplication between Pydantic schemas and DB models) we can evaluate later without it blocking this decision now.

## Consequences
Slightly more setup complexity (async session management, async Alembic template) in exchange for correct behavior under concurrent load — worth paying now rather than migrating later under production traffic.