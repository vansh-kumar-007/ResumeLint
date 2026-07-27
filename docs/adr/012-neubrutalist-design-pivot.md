# ADR-012: Pivot to Neubrutalist Visual Design

**Status**: Accepted (supersedes the "Linear/Vercel dashboard" direction implemented in T021)
**Date**: 2026-07-27

## Context
T021 implemented a dark, muted "engineering dashboard" aesthetic (charcoal/graphite, subtle borders). On review, this read as safe but generic, and risked blending into the broader category of dark-mode SaaS dashboards rather than standing out. A reference site using neubrutalism (thick black borders, hard offset shadows, bold flat color, zero gradients/glassmorphism) was identified as a stronger fit for "unique, not AI-generic."

## Decision
Adopt a light-background neubrutalist design system: cream background with a dot-grid pattern, white panels with thick black borders and hard (non-blurred) offset shadows, bold black typography, hot pink + yellow as primary accents, monospace type for data/labels. Interactive elements (buttons) use a "press into the page" shadow-collapse animation on hover/click, implemented in native CSS rather than an external animation library, to avoid gradient-adjacent effects (e.g. glossy "specular" sheens) that would undercut the flat, raw aesthetic.

## Alternatives Considered
- **Keep T021's dark dashboard direction** — rejected: reads as generic/safe rather than distinctive, closer to the "cliché" the person explicitly wanted to avoid.
- **reactbits.dev component library for animations** — deferred: some effects (e.g. "specular button") risk introducing gradient/glow visuals inconsistent with the flat neubrutalist aesthetic; native CSS interactions were sufficient for the core hover/press pattern without adding a dependency.

## Consequences
This is a full visual rebuild of every existing component (T010, T011, T021 all touched visually), though the underlying data flow, types, and API integration are unchanged — this was a skin-deep pivot at the architecture level, expensive at the CSS/component layer but cheap at the application layer, which is exactly why doing it now (before more UI work compounds) is the right call rather than later.