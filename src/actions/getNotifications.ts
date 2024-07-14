"use server";

import { db } from "@/db/db";

const getNotifications = async (userId: string) => {
  const notfication = await db.notification.findMany({
    where: {
      ownerId: userId,
    },
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
  return notfication;
};

export default getNotifications;
