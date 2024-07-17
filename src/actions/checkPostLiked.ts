"use server";

import { db } from "@/db/db";

const checkPostLiked = async (postId: string, userId: string) => {
  return !!(await db.postLikes.findUnique({
    where: { postId_userId: { postId, userId } },
  }));
};

export default checkPostLiked;
