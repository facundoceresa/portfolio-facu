# Home Page Specification

## Overview
- **Target files:** `apps/web/app/(public)/page.tsx`, `apps/web/components/home/*`
- **Screenshots:** `docs/design-references/core-composition/home-1440x900.png`, `home-390x844.png`
- **Interaction model:** static content with entrance, hover and marquee animations

## Sections
- Hero: huge `FACUNDO CERESA` display, availability pill, manifesto side panel, terminal card and layer status rows.
- Marquee: technical keywords moving horizontally.
- Selected work: asymmetric editorial project cards, large green blueprint panel, floating mint content plaque.
- Stack ecosystem: four compact columns by layer.
- Method: four technical process cards.
- AI stance: two-column editorial block with small proof cards.
- CTA: centered contact callout.

## Visual Requirements
- Keep dark navy background and large empty vertical rhythm.
- Project cards alternate left/right plaque placement.
- Use low-opacity blueprint visuals; no stock images required.
- Cards are rectangular with hard lines and glow on hover.
- Hero manifesto must include the reference-like console prompt: `~/ceresa`, `$ whoami`, descriptive response text and a blinking cursor.
- Hero layer status rows must read as a terminal matrix below the hero intro/CTAs, with staggered horizontal offsets and hover translation.
- Section motion must appear across hero, work, stack, method, AI and CTA using transform/opacity, staggered reveals, pulse dots, scanlines and line drawing.

## Content Corrections
- Do not publish fictitious metrics/projects.
- Seed candidate projects only as `draft`.
- Public home may show empty-state editorial copy until records are published.
- Availability text comes from settings, not hardcoded Q1/Q2 2026.

## Responsive Behavior
- Desktop: asymmetrical overlapping project cards.
- Mobile: hero stacks, side manifesto sits below heading, project plaque becomes full-width attached under blueprint.

## Motion Correction Pass 2026-09-01

- **Reference behavior:** core manifesto card uses hard stacked shadows, hover translation and an embedded terminal prompt with a `blink` cursor.
- **Reference behavior:** stack rows near the hero are horizontally offset by row and transition border/background/transform on hover.
- **Local gap:** the previous implementation had an empty scanline rectangle and a plain right-side stack list, which removed the most distinctive console moment.
- **Implementation requirement:** restore terminal details without fake metrics, preserve Montevideo/Uruguay/settings-driven availability, and respect `prefers-reduced-motion`.
