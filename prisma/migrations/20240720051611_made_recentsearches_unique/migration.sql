/*
  Warnings:

  - A unique constraint covering the columns `[userId,search]` on the table `RecentSearches` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "RecentSearches_search_key";

-- CreateIndex
CREATE UNIQUE INDEX "RecentSearches_userId_search_key" ON "RecentSearches"("userId", "search");
