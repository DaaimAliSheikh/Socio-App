"use server";

import { db } from "@/db/db";
import imagekit from "@/lib/imagekit";

const updatePost = async (data: FormData, postId: string) => {
  try {
    const uploadPromises = Array.from(data.keys())
      .filter((key) => {
        if (data.get(key) instanceof File) return true;
        return false;
      })
      .map(async (key) => {
        const value = data.get(key) as File;
        return imagekit.upload({
          file: Buffer.from(await value.arrayBuffer()),
          fileName: value.name + Date.now() + Math.random() * 100,
          folder: `/socio/`,
        });
      });

    if (uploadPromises.length === 0)
      //update rest of the things except images
      await db.post.update({
        where: { id: postId },
        data: {
          description: data.get("description") as string,
        },
      });
    else {
      ///delete old images from imagekit
      const post = await db.post.findUnique({
        where: { id: postId },
        select: { imagePaths: true },
      });

      try {
        const deletePromises = post?.imagePaths.map(async (path) => {
          const files = await imagekit.listFiles({ path: "/socio/" });
          const fileId = files.find((f) => {
            return f.filePath === path;
          })?.fileId as string;
          return imagekit.deleteFile(fileId);
        });
        if (deletePromises) await Promise.all(deletePromises);
      } catch (e) {
        console.log(e);
      }

      //upload new images to imagekit
      const result = await Promise.all(uploadPromises);

      //update post in db
      await db.post.update({
        where: { id: postId },
        data: {
          description: data.get("description") as string,
          imagePaths: result.map((item) => item.filePath),
          edited: true,
        },
      });
    }

    return { success: "Post successfully updated" };
  } catch (e) {
    console.log(e);
    return { error: "Error while updating post. Please try again." };
  }
};

export default updatePost;
