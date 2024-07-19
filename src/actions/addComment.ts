"use server";

import { db } from "@/db/db";

const addComment = async (
  content: string,
  userId: string,
  otherUserId: string,
  postId: string
) => {
  const comment = await db.comment.create({
    data: {
      content,
      author: { connect: { id: userId } },
      post: { connect: { id: postId } },
    },
    include: {
      author: { select: { id: true, name: true, image: true } },
      post: {
        select: { author: { select: { id: true } } },
      },
    },
  });

  if (userId === otherUserId) return comment;
  await db.notification.deleteMany({
    where: {
      owner: { id: otherUserId },
      type: "COMMENTED_ON_POST",
      post: { id: postId },
      associate: { id: userId },
    },
  });
  await db.notification.create({
    data: {
      owner: { connect: { id: otherUserId } },
      type: "COMMENTED_ON_POST",
      post: { connect: { id: postId } },
      associate: { connect: { id: userId } },
    },
  });

  return comment;
};

export default addComment;
