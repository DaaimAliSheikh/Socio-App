"use server";

import { db } from "@/db/db";

const getComments = async (postId: string, userId: string) => {
  return await db.comment.findMany({
    where: {
      postId,
      OR: [
        {
          author: {
            OR: [
              {
                relationA: {
                  some: { userBId: userId, type: { not: "BLOCKED" } },
                },
              },
              {
                relationB: {
                  some: { userAId: userId, type: { not: "BLOCKED" } },
                },
              },
            ],
          },
        },
        {
          authorId: userId,
        },
      ],
    },

    include: {
      author: { select: { id: true, name: true, image: true } },
    },
  });
};

export default getComments;
