# ADR-002: FastAPI for Backend

**Status**: Accepted
**Date**: 2026-07-24

## Context
The backend needs to parse resumes (PDF/DOCX/TXT), run a deterministic scoring engine, and call external AI providers. Python has the strongest ecosystem for document parsing and NLP-adjacent tooling.

## Decision
Use FastAPI with Pydantic for the backend API layer.

## Alternatives Considered
- **Node.js/Express or Nest.js** — would keep the stack single-language (TS everywhere), but Python's resume-parsing and NLP libraries (PyMuPDF, pdfplumber, python-docx, spaCy) are more mature and better maintained than JS equivalents.
- **Django** — heavier, batteries-included framework not suited to an API-first, async-heavy service.
- **Flask** — lighter than FastAPI but lacks built-in async support and automatic OpenAPI schema generation, both of which we'll rely on.

## Consequences
Two-language stack (TS frontend, Python backend) — accepted tradeoff for parsing-library quality. FastAPI's automatic OpenAPI schema generation also sets up future cross-language type-sync options (see T015).