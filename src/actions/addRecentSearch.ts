"use server";

import { db } from "@/db/db";

const addRecentSearch = async (userId: string, search: string) => {
  try {
    await db.recentSearches.create({ data: { userId, search } });
  } catch {
    //do nothing if that search already exists and unique constraint error
  }
};

export default addRecentSearch;
