/*
  Warnings:

  - Added the required column `coordinator` to the `Club` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Club" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clubId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "creatorId" TEXT NOT NULL,
    "coordinator" TEXT NOT NULL,
    CONSTRAINT "Club_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Club" ("clubId", "createdAt", "creatorId", "description", "id", "name", "status", "updatedAt") SELECT "clubId", "createdAt", "creatorId", "description", "id", "name", "status", "updatedAt" FROM "Club";
DROP TABLE "Club";
ALTER TABLE "new_Club" RENAME TO "Club";
CREATE UNIQUE INDEX "Club_clubId_key" ON "Club"("clubId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
