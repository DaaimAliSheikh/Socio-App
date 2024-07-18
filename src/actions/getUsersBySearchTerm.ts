"use server";

import { db } from "@/db/db";
import splitStringToWords from "@/lib/splitStringToWords";

const getUsersBySearchTerm = async (
  userId: string,
  skip: number = 0,
  search: string = ""
) => {
  return await db.user.findMany({
    where: {
      OR: splitStringToWords(search).map((word) => ({
        name: {
          contains: word,
          mode: "insensitive",
        },

        OR: [
          {
            relationA: {
              some: {
                userBId: userId,
                type: { not: "BLOCKED" },
              },
            },
          },
          {
            relationB: {
              some: {
                userAId: userId,
                type: { not: "BLOCKED" },
              },
            },
          },
          {
            relationA: { none: {} },
            relationB: { none: {} },
          },
        ],
      })),
    },
    skip,
    take: 5,

    orderBy: { name: "asc" },
  });
};

export default getUsersBySearchTerm;
