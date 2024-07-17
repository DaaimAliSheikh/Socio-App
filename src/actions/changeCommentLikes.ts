"use server";

import { db } from "@/db/db";

const changeCommentLikes = async (
  commentId: string,
  userId: string,
  increment: boolean
) => {
  await db.$transaction([
    db.comment.update({
      where: { id: commentId },
      data: { likes: { increment: increment ? 1 : -1 } },
    }),
    increment
      ? db.commentLikes.create({ data: { commentId, userId } })
      : db.commentLikes.delete({
          where: {
            commentId_userId: {
              commentId,
              userId,
            },
          },
        }),
  ]);
};

export default changeCommentLikes;
