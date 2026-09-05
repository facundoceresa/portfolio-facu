# Public Shell Specification

## Overview
- **Target file:** `apps/web/components/public-shell.tsx`
- **Screenshot:** `docs/design-references/core-composition/home-1440x900.png`
- **Interaction model:** sticky navigation, mobile menu click-driven

## DOM Structure
- Sticky header with logo mark, name, nav links, locale toggle and contact CTA.
- Main content receives children.
- Footer with copyright, location, system status, language/legal links and external links.

## Computed Styles
- Header height: `69px` desktop.
- Header background: navy with `0.85` opacity.
- Header backdrop: `blur(24px)`.
- Header border: `1px solid rgba(115,255,184,0.1)`.
- Nav desktop hidden below `768px`.
- Mobile header keeps logo and CTA/menu in first row.

## Required Corrections
- Location must be `Montevideo · Uruguay`.
- External links must render only when configured; no `href="#"`.
- Admin link is protected and can be hidden from production footer.
- Locale switch must navigate between equivalent routes.

## Responsive Behavior
- Desktop: centered nav, logo left, controls right.
- Tablet/mobile: compact nav; menu opens as dark technical panel with focus management.
