# Backup and restore

## PostgreSQL backup

Use credentials supplied through the operator environment, never command history or committed files.

```bash
pg_dump --format=custom --no-owner --no-acl --file=meteo-lms.dump "$DATABASE_URL"
pg_restore --list meteo-lms.dump
```

Encrypt backups at rest, restrict access, define retention, and periodically restore into an isolated database to verify recoverability.

## Restore drill

1. Create an empty isolated PostgreSQL database.
2. Restore with `pg_restore --clean --if-exists --no-owner` only against that isolated target.
3. Configure a non-production application instance to use it.
4. Verify login, course progress, quiz attempts, certificates, and `/api/health`.
5. Record duration, errors, and the recovery point.

Production restore is an operator-controlled incident action and requires an approved maintenance window. Preview and Production PostgreSQL backups are never interchangeable.

During the managed-Neon cutover, the previous immutable Vercel deployment and its unchanged legacy database are retained as the recovery point until the new Production deployment, copied records, initialized content, custom domain, and monitoring window are verified. Do not remove the old database as part of the cutover.
