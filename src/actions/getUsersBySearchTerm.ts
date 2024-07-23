"use server";

import { db } from "@/db/db";

const getUsersBySearchTerm = async (
  userId: string,
  skip: number = 0,
  search: string = "",
  onlyBlocked?: boolean,
  onlyFriends?: boolean,
  onlyRequests?: boolean
) => {
  if (onlyRequests) {
    const requests = await db.friendRequest.findMany({
      where: {
        receiverId: userId,
      },
      select: { sender: true },
      skip,
      take: 5,

      orderBy: { sender: { name: "asc" } },
    });
    return requests.map((req) => req.sender);
  }

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
                : { not: "BLOCKED" }, ///for simple search
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
