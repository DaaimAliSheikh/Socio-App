"use server";

import { db } from "@/db/db";

const changePostLikes = async (
  postId: string,
  userId: string,
  otherUserId: string,
  increment: boolean
) => {
  await db.$transaction([
    db.post.update({
      where: { id: postId },
      data: { likes: { increment: increment ? 1 : -1 } },
    }),
    increment
      ? db.postLikes.create({ data: { postId, userId } })
      : db.postLikes.delete({
          where: {
            postId_userId: {
              postId,
              userId,
            },
          },
        }),
  ]);

  if (userId === otherUserId || !increment) return;

  await db.notification.deleteMany({
    where: {
      owner: { id: otherUserId },
      type: "LIKED_POST",
      post: { id: postId },
      associate: { id: userId },
    },
  });
  await db.notification.create({
    data: {
      owner: { connect: { id: otherUserId } },
      type: "LIKED_POST",
      post: { connect: { id: postId } },
      associate: { connect: { id: userId } },
    },
  });
};

export default changePostLikes;
