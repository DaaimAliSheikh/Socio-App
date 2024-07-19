"use server";

import { db } from "@/db/db";

const getNotifications = async (userId: string) => {
  return await db.notification.findMany({
    where: {
      ownerId: userId,
      associate: {
        is: {
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
            {
              relationA: { none: {} },
              relationB: { none: {} },
            },
          ],
        },
      },
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      associateId: true,
      type: true,
      createdAt: true,
      associate: {
        select: {
          name: true,
          image: true,
        },
      },
      post: {
        select: {
          id: true,
        },
      },
    },
  });
};

export default getNotifications;
