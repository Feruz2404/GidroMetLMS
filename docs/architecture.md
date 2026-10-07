# Architecture

GidroEdu LMS is a single Next.js 16 (App Router) application with a
PostgreSQL database accessed through Prisma. The code is organised in layers
with dependencies pointing inwards: UI → API contract → application services →
persistence.

```text
Browser (React client components, TanStack Query)
  │  fetch /api/* (same-origin, HttpOnly session cookie)
  ▼
app/api/**/route.ts            thin controllers: parse + validate input, call one service, shape the response
  │
  ▼
server/modules/<domain>/*      use cases and business rules (authorization policies, grading, eligibility)
  │
  ▼
server/db.ts (Prisma client)   PostgreSQL
```

Server components are used only at the edges: `(app)/layout.tsx` resolves the
session on the server (so signed-out visitors are redirected before anything
renders), the sign-in layout reads public catalogue counts, and role-restricted
pages call `requirePagePermission(...)`.

## Source layout

| Path | Responsibility |
|---|---|
| `src/shared/` | Framework-free code shared by client and server: DTO contracts (`dto.ts`), zod input schemas (`schemas.ts`), the role/permission matrix (`roles.ts`), error codes, URL safety helpers. |
| `src/server/http/` | Route-handler wrappers (`publicRoute`, `authedRoute`), `AppError` and helpers (`notFound`, `forbidden`, …), JSON/CSV responses, request parsing and pagination. Every error becomes `{ status: 'error', code, message, details? }`. |
| `src/server/auth/` | Password hashing (PBKDF2-SHA-256, 600 000 iterations, async), opaque sessions stored as HMAC, cookie handling, same-origin protection, rate limiting, authorization policies, server-component session helpers. |
| `src/server/modules/` | Domain services: `auth`, `users`, `courses` (catalogue, curriculum, progress), `quizzes` (authoring, attempts, pure grading), `certificates`, `library`, `notifications`, `analytics` (dashboard, reports), `search`. |
| `src/server/audit.ts`, `log.ts`, `db.ts`, `config/` | Audit trail (never breaks the user action), structured logs with secret redaction, the lazily created Prisma client, environment resolution. |
| `src/app/api/` | REST endpoints. Legacy URLs are kept so older clients and links keep working. |
| `src/app/(auth)`, `src/app/(app)`, `src/app/verify` | Pages. Page files are thin and render a feature component. |
| `src/features/<domain>/` | Client features: React Query hooks (`api.ts`), page components and feature-only components. |
| `src/components/` | `ui` (shadcn/Radix primitives), `shared` (page header, stat card, table, empty/error states, markdown…), `layout` (app shell). |
| `src/i18n/` | Typed uz/ru/en catalogues per feature, provider with Intl formatting; the locale is stored in a cookie so server and client render the same language. |
| `prisma/` | Schema, migrations, authored content (`content/`), seeds (`seed/`) and operator scripts. |

See `docs/frontend-guide.md` for client conventions.

## Key rules

- **Authorization is server-side.** Every service receives the actor and checks permissions and ownership (instructors: own courses/quizzes/resources; department managers: their department; learners: their own records). The client only hides UI.
- **Input is validated once, with shared schemas.** Update schemas never apply defaults to omitted fields.
- **Assessments are graded on the server.** Correct answers never reach the learner before submission; questions are shuffled deterministically per attempt; answers autosave; late submissions fall back to the autosaved answers; a finished attempt cannot be submitted twice. Questions of a quiz cannot change once results exist.
- **One certificate rule** (`certificates/service.ts › evaluateEligibility`): certificates enabled for the course, all lessons completed, a passed published final assessment (if the course has one), no active certificate yet. It runs automatically when a learner finishes the last lesson or passes the final test; administrators can also run it for everyone. Verification codes are random 40-hex strings; QR codes are generated locally.
- **Progress is derived.** Course progress = completed lessons / lessons; changing a curriculum recalculates enrolments. Video lessons require 80 % of their duration in watch time.
- **Nothing is hard-deleted** where history matters: courses, quizzes and resources are archived; users are deactivated (and signed out everywhere).
- **Audit log** records sign-ins, authoring, enrolment, grading, certificate and user-management actions.

## Data

- PostgreSQL in every environment via `prisma/schema.prisma`; migrations are committed and applied with `prisma migrate deploy`.
- `prisma/content/` holds the real learning catalogue (18 courses × 9 lessons, a 10-question final assessment each, 25 official reference documents). `prisma/seed/catalog.ts` installs it idempotently with stable ids; `prisma/seed/demo.ts` adds a fictional organisation with realistic activity for development and Preview only.

## Testing

| Layer | Tooling | Location |
|---|---|---|
| Pure domain rules (grading, progress, policies, schemas, i18n completeness, content quality, security helpers) | `node:test` via `tsx` | `tests/*.test.ts` (`npm test`) |
| HTTP API across roles | Playwright `request` | `e2e/api.spec.ts` |
| User journeys in the browser | Playwright | `e2e/*.spec.ts` (`npm run test:e2e`) |
