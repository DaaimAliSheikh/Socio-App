"use server";

import { db } from "@/db/db";

const getPostByPostId = async (postId: string) => {
  return await db.post.findUnique({
    where: { id: postId },
    include: {
      author: { select: { id: true, name: true, image: true } },
      comments: true,
    },
  });
};

export default getPostByPostId;
