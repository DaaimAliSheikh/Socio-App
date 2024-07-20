"use server";

import { db } from "@/db/db";

const deletePost = async (postId: string) => {
  console.log(postId)
  return await db.post.delete({ where: { id: postId } });
};

export default deletePost;
