# Architecture

## Runtime flow

The App Router root renders the public access experience and the authenticated application shell. Interactive views use the shared API client; all protected API handlers independently resolve and validate the server session. Hiding navigation is a convenience, never an authorization boundary.

```text
Browser view
  -> /api route handler
     -> session + CSRF validation
     -> permission / ownership check
     -> Prisma query or transaction
     -> normalized JSON response
```

Key boundaries:

- `src/app`: pages and route handlers.
- `src/components/app`: responsive, role-aware shell.
- `src/components/views`: current feature views. Large views are candidates for incremental extraction into `src/features`.
- `src/server/auth/permissions.ts`: canonical roles, permissions, and ownership rules.
- `src/validators`: shared Zod input validation.
- `src/lib/auth.ts`: password, session, cookie, API response, and audit helpers.
- `src/lib/db.ts`: the only Prisma client factory.
- `prisma`: the authoritative PostgreSQL schema, committed migrations, guarded Preview seed, and production-safe initializer.

## Data rules

- PostgreSQL is authoritative in Development, Preview, and Production through `prisma/schema.prisma`.
- `DATABASE_URL` is the pooled runtime connection and `DIRECT_URL` is the direct migration connection.
- Enrollments and lesson progress have compound uniqueness constraints.
- Sessions store only an HMAC of the opaque browser token.
- Quiz correct answers are stripped before learner submission; scoring runs on the server.
- Certificate issuance re-checks enrollment completion, passed attempts, course ownership, and duplicates inside the server workflow.

## Incremental refactor direction

The application deliberately preserves current routes and business behavior. New work should extract domain queries and mutations from oversized view files into `src/features/<domain>` and server-only modules without changing public API paths unnecessarily.
