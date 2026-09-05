# GitHub Ruleset

- `main` requiere Pull Request.
- Requerir status checks: `quality`, `codeql`, `secret-scan`, `dependency-review` en PR.
- Bloquear force push.
- Bloquear deletion.
- Requerir conversaciones resueltas.
- Aplicar a administradores si el plan lo permite.
- CODEOWNERS obligatorio para `.github/`, `infra/`, auth, DB y seguridad.
- No usar `pull_request_target` con secrets.
- Produccion usa environment con aprobacion manual.
