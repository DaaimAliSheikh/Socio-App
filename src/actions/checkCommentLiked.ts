"use server";

import { db } from "@/db/db";

const checkCommentLiked = async (commentId: string, userId: string) => {
  return !!(await db.commentLikes.findUnique({
    where: { commentId_userId: { commentId, userId } },
  }));
};

export default checkCommentLiked;
