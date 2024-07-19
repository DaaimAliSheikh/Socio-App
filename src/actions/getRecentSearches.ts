"use server";

import { db } from "@/db/db";

const getRecentSearches = async (userId: string) => {
    if (!userId) return [];
  return await db.recentSearches.findMany({ where: { userId } });
};

export default getRecentSearches;
