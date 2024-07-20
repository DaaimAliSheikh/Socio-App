"use server";

import { db } from "@/db/db";
import imagekit from "@/lib/imagekit";

const deletePost = async (postId: string) => {
  const post = await db.post.delete({ where: { id: postId } });

  const files = await imagekit.listFiles({ path: "/socio/" });

  const deletePromises = post?.imagePaths.map(async (path) => {
    const fileId = files.find((f) => {
      return f.filePath === path;
    })?.fileId as string;
    return imagekit.deleteFile(fileId);
  });
  if (deletePromises) await Promise.all(deletePromises);
};

export default deletePost;
