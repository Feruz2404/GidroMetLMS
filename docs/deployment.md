# Deployment and migrations

## Required variables

- Preview: pooled `DATABASE_URL` plus matching direct `DIRECT_URL` or marketplace `DATABASE_URL_UNPOOLED`.
- Production: pooled `PRODUCTION_NEON_DATABASE_URL` plus matching direct `PRODUCTION_NEON_DATABASE_URL_UNPOOLED` from its dedicated managed resource.
- `SESSION_SECRET`: random value of at least 32 characters.
- `NEXT_PUBLIC_APP_URL`: canonical HTTPS origin.
- Optional OneID variables remain placeholders; no integration is claimed without valid configuration.

## Vercel

Use `npm run build:vercel`. It validates non-secret configuration, generates the PostgreSQL client, runs `prisma migrate deploy`, optionally performs the explicitly enabled environment initializer, and then builds Next.js.

Preview uses a dedicated PostgreSQL resource connected only to the Vercel Preview target. Configure `RUN_PREVIEW_SEED=true` and a strong, secret `DEMO_SEED_PASSWORD` to run the repeatable fictional dataset after migrations. Production never receives that dataset. `RUN_PRODUCTION_INIT=true` enables only the idempotent essential-record initializer.

The full learning-content initializer runs only when the operator temporarily sets `ALLOW_PRODUCTION_CONTENT_INIT=true`. Remove the flag immediately after the verified idempotency deployment; normal builds do not initialize content.

The same release sequence can be run explicitly by an authenticated operator:

```bash
npm ci
npm run db:generate
npm run db:migrate:deploy
```

Do not place `prisma db push --accept-data-loss` in a production build.

## Baselining an existing database

The current production database was historically managed with `db push`. Before the first Prisma migration deployment, an operator must:

1. Take and verify a PostgreSQL backup.
2. Generate/review the baseline SQL against a disposable copy.
3. Confirm the live schema matches the baseline.
4. Mark the reviewed baseline as applied with `prisma migrate resolve --applied 20260714090000_baseline --schema=prisma/schema.prisma`.
5. Run `npm run db:migrate:deploy` and verify `/api/health`.

Never run `migrate reset`, a force reset, or the demo seed.

## Managed Neon cutover

When replacing an inaccessible legacy Production database, keep its deployment and database unchanged as the recovery source. Connect the new Production-only Neon resource with the `PRODUCTION_NEON_` prefix, migrate the empty target, then temporarily set `ALLOW_LEGACY_PRODUCTION_MIGRATION=true`. The guarded `prisma/migrate-legacy-production-data.ts` command reads the old `DATABASE_URL`, inserts only missing legacy rows into the new target with duplicate skipping, and verifies that every target model count is at least the source count. It never updates or deletes source or target rows. Remove the migration flag after two successful passes.

## Production content initialization

The learning catalogue lives in `prisma/content/` (18 authored courses with 9 lessons and a 10-question final assessment each, 25 official reference documents, organisation reference data). `prisma/seed/catalog.ts` installs it with stable identifiers (`production-course-NN`, `…-section-N-lesson-M`, `…-final-quiz`), so a re-run updates the same rows in place.

Run this sequence only from a trusted operator shell connected to the intended Production PostgreSQL database:

1. Confirm provider backup status and verify a fresh backup is restorable.
2. Set `ALLOW_PRODUCTION_CONTENT_INSPECT=true`, run `npm run db:inspect:production-content`, and keep the before-count report.
3. Run `npm run db:migrate:status`, review pending SQL, then `npm run db:migrate:deploy`.
4. Set `ALLOW_PRODUCTION_CONTENT_INIT=true` only in the current process. Optionally set `INIT_ADMIN_PASSWORD`, `INIT_INSTRUCTOR_PASSWORD`, `INIT_MANAGER_PASSWORD` and `INIT_LEARNER_PASSWORD` (strong, unique); without them no starter account is created.
5. Run `npm run db:init:production-content` twice. The second after-count report must match the first and the duplicate report must stay empty.
6. Re-run the inspection, save the after-count report, and unset every initializer flag and password.
7. Deploy and verify health, sign-in, the catalogue, a lesson, an assessment attempt, the library and certificate verification.

Guarantees: the initializer never deletes user data, never resets or pushes the schema and never changes existing credentials. Course text, lessons and library records are upserted; the questions of a final assessment are replaced only while nobody has attempted it, so recorded results always keep the questions they were graded against. Placeholder library records from the first content release (no file) are archived, not deleted. Existing enrolments and progress are preserved; every active learner is enrolled in the introductory and safety courses plus one department-relevant course.

## VPS / standalone

```bash
npm ci
npm run db:generate
npm run db:migrate:deploy
npm run build
npm start
```

Use the process manager and service name already configured on the server. Do not invent or replace production process names. Configure HTTPS at the reverse proxy and forward the original host/protocol headers.

### Current VPS: `https://gidromet-lms.vrcloud.uz`

The shared Ubuntu 22.04 host (1 vCPU, 1 GB RAM) runs several other projects, so the app is isolated and memory-capped, and it is **built on a workstation, not on the server**.

| Item | Value |
|---|---|
| Release layout | `/opt/gidromet-lms/releases/<timestamp>`, `current` → active release, `shared/app.env` (root:gidromet, 640) |
| Process | `gidromet-lms.service` (systemd, user `gidromet`, `127.0.0.1:3200`, `MemoryMax=400M`, heap 256 MB) |
| Database | PostgreSQL 14 on the host, database and role `gidromet_lms` (only that role has access) |
| Proxy / TLS | Caddy block `gidromet-lms.vrcloud.uz` in `/etc/caddy/Caddyfile` (automatic HTTPS; backups `Caddyfile.bak-gidromet-*`) |

Update procedure:

1. On the workstation: `NEXT_PUBLIC_APP_URL=https://gidromet-lms.vrcloud.uz npm run build`. The Prisma generator already includes the `debian-openssl-3.0.x` engine.
2. Archive `.next/standalone` **without** its `.env`, upload it, and extract it into a new `releases/<timestamp>` directory.
3. Turbopack links server externals as `.next/node_modules/@prisma/client-<hash>` pointing at the build machine's absolute path. Re-point each link inside the release: `ln -sfn ../../../node_modules/@prisma/client .next/node_modules/@prisma/client-<hash>`.
4. Apply migrations from the workstation through an SSH tunnel to `127.0.0.1:5432` (`prisma migrate deploy` with the `gidromet_lms` URL), then switch `current` and `sudo systemctl restart gidromet-lms`.
5. Check `curl -s http://127.0.0.1:3200/api/health` on the host and `https://gidromet-lms.vrcloud.uz/api/health`. Roll back by pointing `current` at the previous release and restarting.

Never run `next build` on this host: it needs more memory than the server has free and could push other services into the OOM killer.

## Rollback

Application rollback uses the previous immutable build. Database rollback is forward-only: create a corrective migration. Do not manually remove production columns or tables while a deployed version may still use them.
