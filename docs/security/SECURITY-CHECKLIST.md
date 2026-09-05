# Security Checklist

- Sin registro publico.
- Sin demo login.
- Argon2id `m=19456`, `t=2`, `p=1` como piso.
- Sesion opaca de 256 bits, hash HMAC en DB.
- Cookie `__Host-session`, `Secure`, `HttpOnly`, `SameSite=Strict`, `Path=/`.
- CSRF por doble-submit en mutaciones admin.
- Origin/Host check en mutaciones.
- Rate limit persistido para login/contacto.
- Turnstile validado server-side.
- Markdown sin HTML crudo.
- Uploads solo JPEG/PNG/WebP/AVIF, re-encode WebP, EXIF eliminado, fuera de webroot.
- PII y secretos redactados en logs.
- Admin y APIs admin con `noindex` y `Cache-Control: no-store`.
- Cloudflare Access requerido delante de `/admin/*` y `/api/admin/*` en produccion.
- `.env`, `.env.*`, `secrets/`, storage local, backups, reportes y caches ignorados por Git.
- Escaneo Gitleaks requerido antes de pushes de publicacion.
- No pasar contrasenas por argumentos; usar `ADMIN_PASSWORD_FILE`.
- Repositorio publico sin tokens, dumps, logs con PII, capturas sensibles ni configuracion privada.
