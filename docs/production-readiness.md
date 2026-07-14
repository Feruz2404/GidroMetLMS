# Production readiness and known limitations

## Completed hardening

- HttpOnly cookie sessions with legacy bearer compatibility.
- Stronger versioned password hashing and automatic legacy rehash.
- Generic login failures, rate limiting, session revocation, and audit records.
- Central role/permission matrix with instructor ownership and department scope.
- Server-derived certificate eligibility and quiz scoring.
- Server time-limit enforcement and duplicate quiz-submission protection.
- Non-destructive, gated, repeatable demo seed with fictional data.
- Schema-drift check, dependency audit, security headers, health endpoint, and CI checks.
- Responsive public access experience without fabricated statistics.

## Known limitations

- Assignment submissions, grading, certificate PDF generation/reissue history, password-reset email delivery, OneID, organization tables, attendance, competency, learning groups, and training plans are not yet implemented as complete production workflows.
- The current page architecture remains a compatibility-preserving single client entry point; gradual extraction to route-based Server Components is recommended.
- Login rate limiting is process-local. A shared provider is required for horizontally scaled abuse protection.
- The reviewed Prisma baseline is committed, but an existing production database created with `db push` still requires a verified backup, schema comparison, and `migrate resolve` before its first `migrate deploy`.
- Uploaded-file storage and malware scanning require an approved object-storage provider; no production upload credentials are included.
- WCAG and responsive checks need ongoing manual verification with representative authenticated data and assistive technology.
