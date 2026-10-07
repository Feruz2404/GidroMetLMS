# Production readiness and known limitations

## In place

- HttpOnly, SameSite=Lax, Secure (production) session cookies; tokens stored only as HMAC; sessions revoked on deactivation and on password change (other devices).
- PBKDF2-SHA-256 (600 000 iterations, async) with automatic upgrade of legacy hashes; strong password policy; administrator-issued passwords must be changed at first sign-in.
- Generic sign-in errors, per IP+email rate limiting, same-origin enforcement for cookie-authenticated mutations, strict security headers and CSP (no third-party scripts; QR codes generated locally).
- Server-side authorization for every endpoint, including instructor ownership, department scope for managers and learner self-scope.
- Validated input everywhere (shared zod schemas); malformed JSON returns 400; uniform error envelope with stable codes and localized client messages.
- Server-graded assessments with no answer leakage, autosave/resume, deadline enforcement and duplicate-submission protection.
- One certificate eligibility rule, automatic issuance, revocation, public verification.
- Audit log of security-relevant and authoring actions; `/api/health` readiness probe.
- Real learning catalogue (18 courses, 162 lessons, 180 questions, 25 official documents) with an idempotent, non-destructive initializer.
- Unit tests for domain rules plus Playwright API and browser tests; CI runs type checks, lint, tests, content validation, migrations, seed, build and e2e.

## Known limitations

- File uploads are not stored by the platform: lessons and library records link to vetted `https` URLs (official documents, videos). Hosting private files needs an approved object store with malware scanning.
- Login rate limiting is in-process. Horizontally scaled deployments need a shared store (e.g. Redis) behind `server/auth/rate-limit.ts`.
- Video watch time is measured as active viewing time on the lesson page; YouTube player events are not used.
- Assignments with manual grading, learning paths, attendance and OneID sign-in are not implemented. The OneID environment variables are placeholders only.
- Notification e-mail and password-reset e-mail are not sent; administrators reset passwords in the user directory.
- Existing Production databases created with `db push` still need the documented baseline step before the first `migrate deploy` (see `docs/deployment.md`).
