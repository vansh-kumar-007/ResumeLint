# ADR-011: Weighted Scoring with Critical-Issue Caps

**Status**: Accepted
**Date**: 2026-07-26

## Context
A resume's overall score needs to reflect genuinely critical gaps (e.g. no way to contact the candidate) even when other sections score well. A pure weighted average can hide such gaps behind strong performance elsewhere.

## Decision
Score = weighted average of contact (15%), section presence (20%), length (10%), bullet quality (35%), skills presence (20%). Two hard caps apply after the average: no email AND no phone caps the score at 50; zero scoreable experience/project bullets caps it at 60. Bullet quality is weighted highest since it's both the most differentiated part of the product and the strongest signal of resume quality per general resume-writing guidance (action verbs + quantified impact).

## Alternatives Considered
- **Pure weighted average, no caps** — rejected: can produce misleadingly high scores that don't reflect a genuinely disqualifying gap.
- **Binary pass/fail gates** (e.g. missing contact = score of 0) — rejected as too harsh/demoralizing for a tool aimed at students; a low-but-nonzero capped score still communicates the problem clearly via `cap_reasons` without being punitive.

## Consequences
Weights are a first-pass, hand-tuned estimate, not derived from real recruiter/ATS data (no such dataset exists for this project yet). They should be treated as adjustable — revisit once we have real user feedback or any labeled examples of "resumes that got interviews" vs. not.