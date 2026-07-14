# Deployment and migrations

## Required variables

- `DATABASE_URL`: pooled PostgreSQL URL where supported.
- `DIRECT_URL`: direct PostgreSQL URL for migration tooling where required by the provider.
- `SESSION_SECRET`: random value of at least 32 characters.
- `NEXT_PUBLIC_APP_URL`: canonical HTTPS origin.
- Optional OneID variables remain placeholders; no integration is claimed without valid configuration.

## Vercel

Use `npm run build:vercel`. It validates non-secret configuration, generates the PostgreSQL client, runs `prisma migrate deploy`, optionally performs the explicitly enabled environment initializer, and then builds Next.js.

Preview uses a dedicated PostgreSQL resource connected only to the Vercel Preview target. Configure `RUN_PREVIEW_SEED=true` to run the repeatable fictional dataset after migrations. Production never receives that dataset. `RUN_PRODUCTION_INIT=true` enables only the idempotent essential-record initializer.

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

## VPS / standalone

```bash
npm ci
npm run db:generate
npm run db:migrate:deploy
npm run build
npm start
```

Use the process manager and service name already configured on the server. Do not invent or replace production process names. Configure HTTPS at the reverse proxy and forward the original host/protocol headers.

## Rollback

Application rollback uses the previous immutable build. Database rollback is forward-only: create a corrective migration. Do not manually remove production columns or tables while a deployed version may still use them.
