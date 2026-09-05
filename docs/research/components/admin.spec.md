# Admin Specification

## Overview
- **Target files:** `apps/web/app/admin/**`, `apps/web/features/admin/**`
- **Screenshot:** `docs/design-references/core-composition/route-_admin-1440x900.png`
- **Interaction model:** authenticated app shell with CRUD forms and tables

## Corrections
- No public registration.
- No demo login or "any credential" bypass.
- Login uses Argon2id admin user from secure bootstrap.
- Session is opaque, hashed in DB, rotated on login and revoked on logout.

## Admin Routes
- `/admin`: dashboard with real counts and audit activity.
- `/admin/proyectos`: CRUD, publish workflow, soft delete.
- `/admin/casos`: CRUD with safe Markdown/block JSON.
- `/admin/medios`: image upload, re-encode, metadata and references.
- `/admin/mensajes`: inbox and status updates.
- `/admin/ajustes`: allowlisted settings plus audit list link.
- `/admin/auditoria`: audit log table.

## Visual Direction
- Same navy/mint technical shell.
- Dense operational layout, not marketing cards.
- Tables and forms use rectangular controls, mono labels and clear focus states.
