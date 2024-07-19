"use server";

import { db } from "@/db/db";
import { RelationType } from "@prisma/client";

const changeUserRelation = async (
  userId: string,
  otherUserId: string,
  type?: RelationType
) => {
  ///if no relationType provided then unfriend/unblock
  await db.relation.deleteMany({
    where: {
      OR: [
        { userAId: userId, userBId: otherUserId },
        { userAId: otherUserId, userBId: userId },
      ],
    },
  });
  switch (type) {
    case "FRIEND":
      //delete friend request
      await db.friendRequest.deleteMany({
        where: {
          OR: [
            { senderId: userId, receiverId: otherUserId },
            { senderId: otherUserId, receiverId: userId },
          ],
        },
      });
      //create friend relation
      return await db.relation.create({
        data: {
          userAId: userId,
          userBId: otherUserId,
          type: "FRIEND",
        },
      });
    case "BLOCKED":
      //delete friend request
      await db.friendRequest.deleteMany({
        where: {
          OR: [
            { senderId: userId, receiverId: otherUserId },
            { senderId: otherUserId, receiverId: userId },
          ],
        },
      });
      return await db.relation.create({
        data: {
          userAId: userId,
          userBId: otherUserId,
          type: "BLOCKED",
        },
      });
    default:
      break;
  }
};

export default changeUserRelation;
