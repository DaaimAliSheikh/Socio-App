"use server";

import { db } from "@/db/db";

const deleteComment = async (commentId: string) => {
  await db.comment.delete({ where: { id: commentId } });
};

export default deleteComment;
