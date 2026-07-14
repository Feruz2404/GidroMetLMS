# GidroEdu LMS

GidroEdu LMS is a multilingual professional-development platform for hydrometeorology specialists. It supports role-aware dashboards, courses and lessons, secure assessments, a digital library, certificate issuance and public verification, notifications, and operational reports.

The repository is a Next.js 16 App Router application using React 19, TypeScript, Tailwind CSS, Prisma, and one authoritative PostgreSQL schema in every environment.

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

Requirements: Node.js 22.23.x, npm 10.9.x, PostgreSQL, and Git. The exact versions are pinned in `.nvmrc`, `.node-version`, and `package.json`.

```bash
copy .env.example .env
npm install
npm run db:generate
npm run db:migrate:deploy
$env:ALLOW_DEMO_SEED="true" # PowerShell
$env:DEMO_SEED_PASSWORD="<unique-strong-development-password>"
npm run db:seed:demo
npm run dev
```

Create a development-only PostgreSQL database, configure its pooled `DATABASE_URL` and direct `DIRECT_URL`, and generate a random 32+ character `SESSION_SECRET`. Never reuse Production credentials locally.

### Development demo accounts

The idempotent demo seed creates five fictional accounts. They use the strong, environment-specific `DEMO_SEED_PASSWORD`; no demo credential is stored in source control.

| Role | Email |
|---|---|
| Super administrator | `super.admin@demo.gidroedu.uz` |
| Administrator | `administrator@demo.gidroedu.uz` |
| Instructor | `instructor@demo.gidroedu.uz` |
| Department manager | `manager@demo.gidroedu.uz` |
| Learner | `learner@demo.gidroedu.uz` |

Never run the demo seed in production. It requires `ALLOW_DEMO_SEED=true` locally or `RUN_PREVIEW_SEED=true` on Vercel Preview, plus `DEMO_SEED_PASSWORD`; its environment guard rejects Production.

## Database workflow

`prisma/schema.prisma` is the only authoritative schema. It uses PostgreSQL, a pooled runtime URL, and a direct migration URL. `npm run db:schema:check` rejects provider drift and validates the schema.

```bash
npm run db:generate                 # generate the PostgreSQL client
npm run db:migrate                  # create/review a local migration
npm run db:migrate:deploy           # apply committed migrations
npm run db:migrate:status           # inspect migration state
```

Do not use `prisma migrate reset`, `db push`, or the demo seed against Production. Existing databases created with `db push` must be backed up, compared with the baseline, and marked with the documented baseline before the first `migrate deploy`; follow [docs/deployment.md](docs/deployment.md).

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

The Vercel build command is `npm run build:vercel`. It validates the environment without printing secrets, generates Prisma Client from the authoritative schema, applies committed migrations, optionally runs the guarded initializer for the matching environment, and builds the application.

For an explicit operator-controlled release check:

```bash
npm ci
npm run db:generate
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
