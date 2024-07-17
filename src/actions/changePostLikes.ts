"use server";

import { db } from "@/db/db";

const changePostLikes = async (
  postId: string,
  userId: string,
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
};

export default changePostLikes;
