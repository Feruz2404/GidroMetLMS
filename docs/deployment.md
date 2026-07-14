# Deployment and migrations

## Required variables

- `DATABASE_URL`: pooled PostgreSQL URL where supported.
- `DIRECT_URL`: direct PostgreSQL URL for migration tooling where required by the provider.
- `SESSION_SECRET`: random value of at least 32 characters.
- `NEXT_PUBLIC_APP_URL`: canonical HTTPS origin.
- Optional OneID variables remain placeholders; no integration is claimed without valid configuration.

## Vercel

Use `npm run build:vercel`. The build is read-only with respect to the database. Run migrations in an authenticated CI release job or an explicit operator step before promoting the deployment:

```bash
npm ci
npm run db:generate:postgres
npm run db:migrate:deploy
```

Do not place `prisma db push --accept-data-loss` in a production build.

## Baselining an existing database

The current production database was historically managed with `db push`. Before the first Prisma migration deployment, an operator must:

1. Take and verify a PostgreSQL backup.
2. Generate/review the baseline SQL against a disposable copy.
3. Confirm the live schema matches the baseline.
4. Mark the baseline migration as applied with `prisma migrate resolve --applied <baseline-name> --schema=prisma/schema.postgresql.prisma`.
5. Run `npm run db:migrate:deploy` and verify `/api/health`.

Never run `migrate reset`, a force reset, or the demo seed.

## VPS / standalone

```bash
npm ci
npm run db:generate:postgres
npm run db:migrate:deploy
npm run build
npm start
```

Use the process manager and service name already configured on the server. Do not invent or replace production process names. Configure HTTPS at the reverse proxy and forward the original host/protocol headers.

## Rollback

Application rollback uses the previous immutable build. Database rollback is forward-only: create a corrective migration. Do not manually remove production columns or tables while a deployed version may still use them.
