"use server";

import { db } from "@/db/db";
import { RelationType } from "@prisma/client";

const changeUserRelation = async (
  userId: string,
  otherUserId: string,
  type?: RelationType
) => {
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
      return await db.relation.create({
        data: {
          userAId: userId,
          userBId: otherUserId,
          type: "FRIEND",
        },
      });
    case "BLOCKED":
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
