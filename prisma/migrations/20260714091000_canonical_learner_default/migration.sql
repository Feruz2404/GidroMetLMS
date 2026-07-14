-- New accounts use the canonical role name. Existing legacy role values remain
-- supported by the application and are not rewritten by this migration.
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'learner';
