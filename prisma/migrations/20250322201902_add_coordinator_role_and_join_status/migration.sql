/*
  Warnings:

  - You are about to drop the column `coordinator` on the `Club` table. All the data in the column will be lost.
  - Added the required column `coordinatorId` to the `Club` table without a default value. This is not possible if the table is not empty.

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
    "coordinatorId" TEXT NOT NULL,
    CONSTRAINT "Club_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Club_coordinatorId_fkey" FOREIGN KEY ("coordinatorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Club" ("clubId", "createdAt", "creatorId", "description", "id", "name", "status", "updatedAt") SELECT "clubId", "createdAt", "creatorId", "description", "id", "name", "status", "updatedAt" FROM "Club";
DROP TABLE "Club";
ALTER TABLE "new_Club" RENAME TO "Club";
CREATE UNIQUE INDEX "Club_clubId_key" ON "Club"("clubId");
CREATE TABLE "new_ClubMember" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "clubId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ClubMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ClubMember_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ClubMember" ("clubId", "id", "joinedAt", "userId") SELECT "clubId", "id", "joinedAt", "userId" FROM "ClubMember";
DROP TABLE "ClubMember";
ALTER TABLE "new_ClubMember" RENAME TO "ClubMember";
CREATE UNIQUE INDEX "ClubMember_userId_clubId_key" ON "ClubMember"("userId", "clubId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
