"use server";

import { db } from "@/db/db";
import splitStringToWords from "@/lib/splitStringToWords";

const getPostsByUserId = async (
  userId: string,
  skip: number = 0,
  search: string = ""
) => {
  return await db.post.findMany({
    where: {
      OR: [
        {
          author: {
            OR: [
              {
                relationA: {
                  some: {
                    userBId: userId,
                    type: search ? { not: "BLOCKED" } : "FRIEND",
                  },
                },
              },
              {
                relationB: {
                  some: {
                    userAId: userId,
                    type: search ? { not: "BLOCKED" } : "FRIEND",
                  },
                },
              },
            ],
          },
        },
        {
          authorId: userId,
        },
      ],
      description: {
        contains: search,
        mode: "insensitive",
      },
    },

    skip,
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { id: true, name: true, image: true } },
      comments: true,
    },
  });
};

export default getPostsByUserId;
