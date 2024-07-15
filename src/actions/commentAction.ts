"use server";

import { db } from "@/db/db";

const commentAction = async (
  content: string,
  userId: string,
  postId: string
) => {
  await db.comment.create({
    data: {
      content,
      author: { connect: { id: userId } },
      post: { connect: { id: postId } },
    },
  });
};

export default commentAction;
