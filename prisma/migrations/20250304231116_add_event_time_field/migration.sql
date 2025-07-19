/*
  Warnings:

  - Added the required column `location` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "time" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "maxParticipants" INTEGER,
    "clubId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Event_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Event" ("clubId", "createdAt", "date", "description", "id", "name", "time", "updatedAt") SELECT "clubId", "createdAt", "date", "description", "id", "name", "time", "updatedAt" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
CREATE INDEX "Event_clubId_idx" ON "Event"("clubId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
