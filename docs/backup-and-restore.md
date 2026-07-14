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

Production restore is an operator-controlled incident action and requires an approved maintenance window. Never restore a demo/local SQLite database into production.
