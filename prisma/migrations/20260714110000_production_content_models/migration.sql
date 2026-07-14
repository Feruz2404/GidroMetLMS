-- Additive structures for production-safe organizational and learning content.
-- Existing application records are not rewritten or removed.

ALTER TABLE "Category"
  ADD COLUMN "nameRu" TEXT,
  ADD COLUMN "descriptionRu" TEXT,
  ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE "User" ADD COLUMN "mustChangePassword" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "Course"
  ADD COLUMN "titleRu" TEXT,
  ADD COLUMN "shortSummary" TEXT,
  ADD COLUMN "targetAudience" TEXT,
  ADD COLUMN "learningOutcomes" TEXT,
  ADD COLUMN "prerequisites" TEXT,
  ADD COLUMN "language" TEXT NOT NULL DEFAULT 'uz',
  ADD COLUMN "certificateEnabled" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "generalTrainingNotice" TEXT;

ALTER TABLE "LibraryResource" ADD COLUMN "slug" TEXT;
ALTER TABLE "Notification" ADD COLUMN "eventKey" TEXT;

CREATE TABLE "Department" (
  "id" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "nameUz" TEXT NOT NULL,
  "nameRu" TEXT,
  "description" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "RegionalDivision" (
  "id" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "nameUz" TEXT NOT NULL,
  "nameRu" TEXT,
  "description" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "RegionalDivision_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "RoleDefinition" (
  "id" TEXT NOT NULL,
  "key" TEXT NOT NULL,
  "nameUz" TEXT NOT NULL,
  "description" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  CONSTRAINT "RoleDefinition_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "RolePermission" (
  "id" TEXT NOT NULL,
  "roleId" TEXT NOT NULL,
  "permission" TEXT NOT NULL,
  CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Announcement" (
  "id" TEXT NOT NULL,
  "eventKey" TEXT NOT NULL,
  "titleUz" TEXT NOT NULL,
  "titleRu" TEXT,
  "messageUz" TEXT NOT NULL,
  "messageRu" TEXT,
  "type" TEXT NOT NULL DEFAULT 'info',
  "link" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Department_code_key" ON "Department"("code");
CREATE INDEX "Department_isActive_idx" ON "Department"("isActive");
CREATE UNIQUE INDEX "RegionalDivision_code_key" ON "RegionalDivision"("code");
CREATE INDEX "RegionalDivision_isActive_idx" ON "RegionalDivision"("isActive");
CREATE UNIQUE INDEX "RoleDefinition_key_key" ON "RoleDefinition"("key");
CREATE UNIQUE INDEX "RolePermission_roleId_permission_key" ON "RolePermission"("roleId", "permission");
CREATE INDEX "RolePermission_permission_idx" ON "RolePermission"("permission");
CREATE UNIQUE INDEX "LibraryResource_slug_key" ON "LibraryResource"("slug");
CREATE UNIQUE INDEX "Notification_userId_eventKey_key" ON "Notification"("userId", "eventKey");
CREATE UNIQUE INDEX "Announcement_eventKey_key" ON "Announcement"("eventKey");
CREATE INDEX "Announcement_isActive_publishedAt_idx" ON "Announcement"("isActive", "publishedAt");

ALTER TABLE "RolePermission"
  ADD CONSTRAINT "RolePermission_roleId_fkey"
  FOREIGN KEY ("roleId") REFERENCES "RoleDefinition"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
