"use server";

import { db } from "@/db/db";

const changeCommentLikes = async (
  commentId: string,
  postId: string,
  userId: string,
  otherUserId: string,
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

  if (userId === otherUserId || !increment) return;
  await db.notification.deleteMany({
    where: {
      owner: { id: otherUserId },
      type: "LIKED_COMMENT",
      post: { id: postId },
      associate: { id: userId },
    },
  });
  await db.notification.create({
    data: {
      owner: { connect: { id: otherUserId } },
      type: "LIKED_COMMENT",
      post: { connect: { id: postId } },
      associate: { connect: { id: userId } },
    },
  });
};

export default changeCommentLikes;
