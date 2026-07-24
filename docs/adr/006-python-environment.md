# ADR-006: Conda + Python 3.11 for Backend Environment

**Status**: Accepted
**Date**: 2026-07-24

## Context
The backend depends on C-extension-heavy libraries (PyMuPDF, pdfplumber, python-docx, and likely spaCy later). Newest Python releases often lag in wheel availability for such libraries, causing build-from-source failures for contributors. The developer's system Python was 3.14, released only months ago.

## Decision
Use a conda environment named `resumelint` pinned to Python 3.11 for backend development. Conda was chosen over plain venv due to existing developer familiarity and conda's strength at managing binary/C-extension dependencies across platforms.

## Alternatives Considered
- **System Python 3.14 + venv** — rejected: too new, real risk of wheel unavailability for some dependencies (confirmed PyMuPDF has caught up, but not guaranteed for all future dependencies like OCR/NLP libraries).
- **pyenv + venv** — viable, but less familiar to the primary maintainer; conda's binary package management is a genuine advantage for this dependency profile.
- **Poetry** — good dependency resolution, but adds tooling overhead not yet justified at this project stage; may be revisited in a future ADR if `requirements.txt` becomes unwieldy.

## Consequences
Contributors will need conda (or a compatible Python 3.11 environment) installed — this will be documented clearly in CONTRIBUTING.md once it's fleshed out. In exchange, we avoid an entire class of "newest Python broke my install" issues.