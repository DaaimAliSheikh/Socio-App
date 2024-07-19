/*
  Warnings:

  - The values [UNFRIEND] on the enum `RelationType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RelationType_new" AS ENUM ('FRIEND', 'BLOCKED');
ALTER TABLE "Relation" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Relation" ALTER COLUMN "type" TYPE "RelationType_new" USING ("type"::text::"RelationType_new");
ALTER TYPE "RelationType" RENAME TO "RelationType_old";
ALTER TYPE "RelationType_new" RENAME TO "RelationType";
DROP TYPE "RelationType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Relation" ALTER COLUMN "type" DROP DEFAULT;

-- CreateTable
CREATE TABLE "RecentSearches" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "search" TEXT NOT NULL,

    CONSTRAINT "RecentSearches_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RecentSearches_search_key" ON "RecentSearches"("search");

-- AddForeignKey
ALTER TABLE "RecentSearches" ADD CONSTRAINT "RecentSearches_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
