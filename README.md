# GidroEdu LMS

GidroEdu LMS is a multilingual professional-development platform for hydrometeorology specialists. It supports role-aware dashboards, courses and lessons, secure assessments, a digital library, certificate issuance and public verification, notifications, and operational reports.

The repository is a Next.js 16 App Router application using React 19, TypeScript, Tailwind CSS, Prisma, SQLite for isolated local development, and PostgreSQL as the authoritative production database.

## Security model

- Browser sessions use a signed, opaque token in an `HttpOnly`, `SameSite=Lax`, `Secure` production cookie. Legacy bearer sessions are accepted only for compatibility.
- Session tokens are HMAC-hashed before storage and can be revoked.
- Passwords use versioned PBKDF2-SHA-256 with 600,000 iterations. Legacy hashes are upgraded after a successful login.
- Login errors are generic and attempts are rate-limited. For multi-instance production, connect the limiter to a shared edge/Redis store.
- Server-side permissions and ownership checks protect users, courses, assessments, reports, library resources, and certificates.
- Certificate scores and eligibility are derived from course, enrollment, and quiz-attempt records; client scores are ignored.
- Cross-site cookie mutations are rejected using Origin and Fetch Metadata checks.

## Roles

The canonical roles are `super_admin`, `administrator`, `instructor`, `department_manager`, and `learner`. The legacy values `admin`, `tutor`, and `student` remain supported during migration. See [docs/roles-and-permissions.md](docs/roles-and-permissions.md).

## Local setup

Requirements: Node.js 22+, npm, and Git.

```bash
copy .env.example .env
npm install
npm run db:generate
npm run db:push:dev
$env:ALLOW_DEMO_SEED="true" # PowerShell
npm run db:seed:demo
npm run dev
```

Generate a random 32+ character `SESSION_SECRET`. Local SQLite is configured with `DATABASE_URL="file:../db/custom.db"`; local database files are ignored by Git.

### Development demo accounts

The idempotent demo seed creates five fictional accounts. They all use the development-only password `MeteoDemo!2026`.

| Role | Email |
|---|---|
| Super administrator | `super.admin@demo.gidroedu.uz` |
| Administrator | `administrator@demo.gidroedu.uz` |
| Instructor | `instructor@demo.gidroedu.uz` |
| Department manager | `manager@demo.gidroedu.uz` |
| Learner | `learner@demo.gidroedu.uz` |

Never run the demo seed in production. It exits immediately when `NODE_ENV=production` and also requires `ALLOW_DEMO_SEED=true`.

## Database workflow

PostgreSQL is authoritative in production. The local SQLite schema and PostgreSQL schema contain identical models; `npm run db:schema:check` detects drift.

```bash
npm run db:generate                 # local SQLite client
npm run db:generate:postgres        # production PostgreSQL client
npm run db:migrate                  # create/review a local migration
npm run db:migrate:deploy           # apply committed migrations in production
```

Do not use `prisma migrate reset`, `db push --force-reset`, or the demo seed against production. Existing production databases created with `db push` must be baselined before the first `migrate deploy`; follow [docs/deployment.md](docs/deployment.md).

The production-safe initial administrator command creates an account only when it does not already exist and never changes existing credentials:

```bash
$env:INITIAL_ADMIN_EMAIL="admin@example.uz"
$env:INITIAL_ADMIN_PASSWORD="a-unique-strong-password"
npm run db:seed:admin
```

## Quality checks

```bash
npm run db:schema:check
npm run db:generate
npm run typecheck
npm run lint
npm test
npm run security:audit
npm run build
```

## Production and deployment

The Vercel build command is `npm run build:vercel`. It validates PostgreSQL configuration, verifies schema parity, generates Prisma Client, and builds the application. It deliberately does not mutate the database during the immutable build.

Apply reviewed migrations as a separate release step:

```bash
npm ci
npm run db:generate:postgres
npm run db:migrate:deploy
npm run build
```

For standalone VPS hosting, copy `.next/static` and `public` into the standalone bundle (the build script does this), then start with `npm start`. Reverse proxies must preserve `Host`, `X-Forwarded-For`, and `X-Forwarded-Proto`.

Health/readiness is available at `GET /api/health`. It reports database and required-configuration readiness without returning URLs or secret values.

## Documentation

- [Architecture](docs/architecture.md)
- [Roles and permissions](docs/roles-and-permissions.md)
- [Deployment and migrations](docs/deployment.md)
- [Backup and restore](docs/backup-and-restore.md)
- [User guides](docs/user-guides.md)
- [Production readiness and known limitations](docs/production-readiness.md)

## Troubleshooting

- `SERVER_CONFIG_ERROR`: configure a 32+ character `SESSION_SECRET`.
- `DATABASE_URL_NOT_PRODUCTION_READY`: production requires a PostgreSQL URL.
- `DATABASE_SCHEMA_ERROR`: apply reviewed migrations and re-run the health check.
- Login loops after an upgrade: clear the legacy `gidroedu_token` local-storage entry and sign in again; new sessions use cookies.
