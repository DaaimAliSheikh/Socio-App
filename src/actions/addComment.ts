"use server";

import { db } from "@/db/db";

const addComment = async (content: string, userId: string, postId: string) => {
  return await db.comment.create({
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
};

export default addComment;
