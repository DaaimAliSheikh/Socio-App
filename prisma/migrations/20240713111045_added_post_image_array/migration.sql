/*
  Warnings:

  - You are about to drop the column `imagePath` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "imagePath",
ADD COLUMN     "imagePaths" TEXT[];
