# Content Routes Specification

## Overview
- **Target files:** public stack/cases/contact/legal routes in `apps/web/app`
- **Screenshots:** route captures in `docs/design-references/core-composition`
- **Interaction model:** static server-rendered pages plus contact form submit states

## Stack Page
- Keep hero title "Máquinas que construyen máquinas" equivalent, but source copy from DB.
- Four layer rows/cards: interface, application, data, infrastructure.
- Tool groups and principles are editable structured content.

## Cases
- Index uses editorial rows with number, category, date/period, read time and result area.
- Detail route must load by locale slug.
- Missing slug returns real 404.
- Draft preview requires auth or short preview token.

## Contact
- Form fields: name, email, optional company/role, scope, budget, message, consent, honeypot, timestamp, Turnstile token.
- Persist before SMTP.
- Accessible translated states: sending, sent, validation, rate limit, recoverable error.
- No attachments in MVP.

## Legal
- Privacy and terms are bilingual, effective date visible, and match actual Cloudflare/Turnstile/SMTP/log retention behavior.
