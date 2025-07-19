/*
  Warnings:

  - Added the required column `clubId` to the `Club` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

-- CreateTable for temporary table
CREATE TABLE "_ClubTemp" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clubId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "creatorId" TEXT NOT NULL,
    CONSTRAINT "Club_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Copy existing data with generated clubIds
INSERT INTO "_ClubTemp" ("id", "clubId", "name", "description", "createdAt", "updatedAt", "status", "creatorId")
SELECT 
    "id",
    UPPER(SUBSTR(HEX(RANDOMBLOB(3)), 1, 2)) || SUBSTR(CAST((ABS(RANDOM()) % 10000) AS TEXT), -4, 4),
    "name",
    "description",
    "createdAt",
    "updatedAt",
    "status",
    "creatorId"
FROM "Club";

-- Drop the old table
DROP TABLE "Club";

-- Rename the temporary table to Club
ALTER TABLE "_ClubTemp" RENAME TO "Club";

-- Create unique index for clubId
CREATE UNIQUE INDEX "Club_clubId_key" ON "Club"("clubId");

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
