"use server";

import { db } from "@/db/db";

const getSuggestedUsers = async (userId: string) => {
  return await db.user.findMany({
    where: {
      relationA: { none: {} },
      relationB: { none: {} },

      id: { not: userId },
    },
    take: 5,
    orderBy: {
      id: "asc",
    },
  });
};

export default getSuggestedUsers;
