"use server";

import { db } from "@/db/db";

const getUsersBySearchTerm = async (
  userId: string,
  skip: number = 0,
  search: string = "",
  onlyBlocked?: boolean,
  onlyFriends?: boolean
) => {
  return await db.user.findMany({
    where: {
      name: {
        contains: search,
        mode: "insensitive",
      },

      OR: [
        {
          relationA: {
            some: {
              userBId: userId,
              type: onlyBlocked
                ? "BLOCKED"
                : onlyFriends
                ? "FRIEND"
                : { not: "BLOCKED" },
            },
          },
        },
        {
          relationB: {
            some: {
              userAId: userId,
              type: onlyBlocked
                ? "BLOCKED"
                : onlyFriends
                ? "FRIEND"
                : { not: "BLOCKED" },
            },
          },
        },
        onlyBlocked || onlyFriends
          ? {}
          : {
              relationA: { none: {} },
              relationB: { none: {} },
            },
      ],
      id: { not: userId },
    },
    skip,
    take: 5,

    orderBy: { name: "asc" },
  });
};

export default getUsersBySearchTerm;
