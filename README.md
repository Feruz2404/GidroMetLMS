# GidroEdu LMS

A professional-development platform for hydrometeorology specialists: role-aware
dashboards, a course catalogue with lessons and progress tracking, graded final
assessments, a digital library of official reference documents, verifiable
certificates with QR codes, notifications and announcements, and scoped
reports — in Uzbek, Russian and English, light and dark themes.

Built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4,
shadcn/Radix UI, TanStack Query, Prisma and PostgreSQL.

## What is inside

| Area | Highlights |
|---|---|
| Learning | 18 real courses (162 lessons written for the hydromet service: observations, synoptic analysis, forecasting, hazards, hydrology, discharge measurement, climate statistics, adaptation, satellite & radar, air quality, instruments, data QC, safety), free preview lessons, progress, deadlines, assignments by department. |
| Assessment | Final test per course (single/multiple choice, true/false, fill-in), server-side grading, shuffled questions, timer, autosave and resume, attempt history, answer review with explanations, quiz builder for instructors. |
| Certificates | Issued automatically on completion + pass, printable A4 certificate with locally generated QR code, public verification page (`/verify/<code>`), revocation, registry for staff. |
| Library | 25 official documents (WMO guides and manuals, IPCC AR6, WHO air-quality guidelines, FAO-56, Sendai Framework, Uzbek laws on lex.uz) with filters, bookmarks and download tracking. |
| Management | Course editor with curriculum builder, quiz builder, user administration, announcements, dashboards and reports (learners, courses, assessments, certificates, library, audit) with CSV export. |

Roles: super administrator, administrator, instructor, department manager,
learner — see [docs/roles-and-permissions.md](docs/roles-and-permissions.md).

## Quick start (local development)

Requirements: Node.js 22, npm 10+, PostgreSQL 15+ (a local server or Docker).

```bash
npm install
cp .env.example .env            # then edit the values (see below)
npm run db:migrate:deploy        # apply migrations
npm run db:seed:demo             # real catalogue + fictional demo organisation
npm run dev                      # http://localhost:3000
```

Minimal `.env` for local work:

```dotenv
DATABASE_URL="postgresql://postgres@localhost:5433/gidroedu?schema=public"
DIRECT_URL="postgresql://postgres@localhost:5433/gidroedu?schema=public"
SESSION_SECRET="<random string, 32+ characters>"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
ALLOW_PUBLIC_REGISTRATION="true"
ALLOW_DEMO_SEED="true"
DEMO_SEED_PASSWORD="<strong password used for every demo account>"
```

No PostgreSQL service handy? If the PostgreSQL binaries are installed (or
`PG_BIN` points at them), `npm run db:local -- init` creates a throw-away,
project-local cluster in `.local/pgdata` on port 5433 (`start`, `stop`,
`status` are also available).

### Demo accounts

The demo seed creates 48 fictional staff with realistic history. All share the
`DEMO_SEED_PASSWORD` from your `.env`.

| Role | Email |
|---|---|
| Super administrator | `super.admin@demo.gidroedu.uz` |
| Administrator | `administrator@demo.gidroedu.uz` |
| Instructor | `instructor@demo.gidroedu.uz` (also `b.tursunov@…`, `g.rahimova@…`) |
| Department manager | `manager@demo.gidroedu.uz` (Meteorologiya boshqarmasi) |
| Learner | `learner@demo.gidroedu.uz` (two certificates, courses in progress, deadlines) |

Re-running `npm run db:seed:demo` rebuilds the demo users' activity; it is
blocked in Production.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` / `build` / `start` | Develop, build (standalone output), run the build. |
| `npm run typecheck` / `lint` | TypeScript and ESLint. |
| `npm test` | Unit tests (grading, progress, policies, schemas, i18n completeness, content quality, security helpers). |
| `npm run test:e2e` | Playwright API and browser tests against a seeded database (reuses a running server). |
| `npm run content:check` | Validates the authored courses in `prisma/content/courses`. |
| `npm run screenshot -- <dir> <email> <path…>` | Captures signed-in screenshots (development aid). |
| `npm run db:*` | Migrations, seeds and guarded operator scripts (see below). |

Quality gate used in CI: `db:schema:check`, `typecheck`, `lint`, `test`,
`content:check`, migrate + seed, `build`, `test:e2e`.

## Production

- Database: PostgreSQL only; the pooled `DATABASE_URL` and direct `DIRECT_URL` (Vercel Production uses the managed `PRODUCTION_NEON_DATABASE_URL*` variables).
- `SESSION_SECRET` (32+ chars) and `NEXT_PUBLIC_APP_URL` are required; `/api/health` reports readiness without exposing values.
- Public self-registration is off in production unless `ALLOW_PUBLIC_REGISTRATION=true`.
- First administrator: `INITIAL_ADMIN_EMAIL=… INITIAL_ADMIN_PASSWORD=… npm run db:seed:admin`.
- Learning content: the guarded, idempotent `npm run db:init:production-content` installs the real catalogue without touching user data — follow [docs/deployment.md](docs/deployment.md).

## Documentation

- [Architecture](docs/architecture.md) · [Frontend guide](docs/frontend-guide.md)
- [Roles and permissions](docs/roles-and-permissions.md)
- [Deployment and migrations](docs/deployment.md) · [Backup and restore](docs/backup-and-restore.md)
- [User guides](docs/user-guides.md) · [Production readiness](docs/production-readiness.md)
