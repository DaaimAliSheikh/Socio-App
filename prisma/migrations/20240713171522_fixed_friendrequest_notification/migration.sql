/*
  Warnings:

  - The primary key for the `FriendRequest` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Notification` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Relation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[senderId,receiverId]` on the table `FriendRequest` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userAId,userBId]` on the table `Relation` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `FriendRequest` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `Notification` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `Relation` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "FriendRequest" DROP CONSTRAINT "FriendRequest_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "FriendRequest_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Notification_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Relation" DROP CONSTRAINT "Relation_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Relation_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "FriendRequest_senderId_receiverId_key" ON "FriendRequest"("senderId", "receiverId");

-- CreateIndex
CREATE UNIQUE INDEX "Relation_userAId_userBId_key" ON "Relation"("userAId", "userBId");
