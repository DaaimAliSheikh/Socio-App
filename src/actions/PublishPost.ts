"use server";
import { db } from "@/db/db";
import imagekit from "@/lib/imagekit";

const PublishPost = async (data: FormData, id: string) => {
  const uploadPromises = Array.from(data.keys()).map(async (key) => {
    const value = data.get(key);
    if (value instanceof File) {
      return imagekit.upload({
        file: Buffer.from(await value.arrayBuffer()),
        fileName: value.name,
        folder: `/socio/`,
      });
    }
  });
  const result = (await Promise.all(uploadPromises)).filter((item) => !!item);
  await db.post.create({
    data: {
      title: data.get("title") as string,
      description: data.get("description") as string,
      imagePaths: result.map((item) => item.filePath),
      author: {
        connect: { id },
      },
    },
  });
};

export default PublishPost;
