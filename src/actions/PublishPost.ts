"use server";
import { db } from "@/db/db";
import imagekit from "@/lib/imagekit";

const PublishPost = async (data: FormData, userId: string) => {
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

    const result = await Promise.all(uploadPromises);
    await db.post.create({
      data: {
        description: data.get("description") as string,
        imagePaths: result.map((item) => item.filePath),
        author: {
          connect: {
            id: userId,
          },
        },
      },
    });
    return { success: "Post successfully uploaded" };
  } catch (e) {
    console.log(e);
    return { error: "Error while uploading post. Please try again." };
  }
};

export default PublishPost;
