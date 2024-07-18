"use server";

import { db } from "@/db/db";

const getUserRelation = async (
  userId: string,
  otherUserId: string
) => {
  return (
    await db.relation.findFirst({
      where: {
        OR: [
          { userAId: userId, userBId: otherUserId },
          { userAId: otherUserId, userBId: userId },
        ],
      },
      select: { type: true },
    })
  )?.type;
};

export default getUserRelation;
