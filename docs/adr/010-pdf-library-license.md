# ADR-010: pdfplumber over PyMuPDF for PDF Text Extraction

**Status**: Accepted
**Date**: 2026-07-24

## Context
PyMuPDF was listed in the original tech stack for PDF parsing. Research at implementation time revealed PyMuPDF is AGPL-3.0 licensed — a strong copyleft license that can obligate downstream users/forks to also open-source under AGPL or purchase a commercial license. This conflicts with the project's stated preference for MIT/Apache/BSD-licensed dependencies.

## Decision
Use pdfplumber (MIT license) for PDF text extraction instead of PyMuPDF.

## Alternatives Considered
- **PyMuPDF** — fastest option (8-12x faster per third-party benchmarks), but AGPL-3.0 licensing is a poor fit for a permissively-licensed open-source project meant to be freely forkable/embeddable.
- **pypdf** — pure Python, BSD-licensed, simpler dependency, but weaker extraction accuracy on complex layouts per third-party comparisons.
- **pdfmux** — claims MIT license and strong benchmark results, but is a new, single-vendor library with no independent track record verified at time of decision. Worth revisiting later, not adopted now for a foundational dependency.

## Consequences
Slower text extraction (still fast enough in absolute terms for single-resume, on-demand parsing — not a bulk pipeline). In exchange, the project's core parsing dependency stays fully MIT-licensed, consistent with the project's licensing goals.