"use server";

import { db } from "@/db/db";

const getPostsByUserId = async (userId: string) => {
  return await db.post.findMany({
    where: {
      OR: [
        {
          author: {
            OR: [
              {
                relationA: {
                  some: { userBId: userId, type: "FRIEND" },
                },
              },
              {
                relationB: {
                  some: { userAId: userId, type: "FRIEND" },
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
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { id: true, name: true, image: true } },
      comments: true,
    },
  });
};

export default getPostsByUserId;
