# Design Foundation Specification

## Overview
- **Target files:** `apps/web/app/layout.tsx`, `apps/web/app/globals.css`
- **Screenshots:** `docs/design-references/core-composition/home-1440x900.png`, `home-390x844.png`
- **Interaction model:** global static foundation with subtle CSS animation

## Tokens
- background: `#0d1b2a`
- surface: `#0a1521`
- mint: `#2dd4a8`
- glow: `#73ffb8`
- fog: `#e6fff5`
- mint border: `rgba(115, 255, 184, 0.12)`
- forest active surface: derived `#143528`

## Typography
- Display: `Space Grotesk`, weights 600-700.
- Body: `DM Sans`, weights 400-700.
- Technical UI: `JetBrains Mono`, weights 400-700.
- Hero H1 desktop target: about `150px`, tight line-height, uppercase.
- Mobile H1 target: about `40px`, tight line-height.

## Global Patterns
- Blueprint grid background using two linear gradients at low opacity.
- Rectangular controls with 0-2px radius.
- Hard borders and shadow offsets instead of soft SaaS cards.
- Technical labels use `//`, numeric prefixes, underscores, terminal prompt copy.
- Reduced motion disables translate/pulse effects.

## Accessibility
- Preserve focus rings in glow mint.
- Body copy must keep contrast against navy surfaces.
- Do not encode state with color alone.
