# ADR-008: Store File References, Not Blobs, in the Database

**Status**: Accepted
**Date**: 2026-07-24

## Context
Uploaded resumes (PDF/DOCX/TXT) need to be persisted for re-parsing, audit, and potential re-download. The database could store either the raw file bytes or a reference to a file stored elsewhere.

## Decision
The `resumes` table stores a `storage_path` reference plus metadata (filename, mime type, size). Actual file bytes are written to the `infrastructure/storage/` layer (local disk in development; S3-compatible object storage planned for later). Extracted text and structured data are stored separately in `parsed_documents`, so the scoring pipeline never needs to re-touch the raw file after initial parsing.

## Alternatives Considered
- **Store file bytes as a BLOB column** — rejected: bloats the database, degrades backup/restore performance, and free-tier hosted Postgres plans (Neon, Supabase) are far stingier on DB storage than on object storage.

## Consequences
Requires the storage abstraction layer (already scaffolded in T002) to be implemented before file upload (T005) is fully functional. In exchange, the database stays lean and swapping storage backends later (local disk → S3-compatible) doesn't touch the DB schema.