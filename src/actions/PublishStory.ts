"use server";
import { db } from "@/db/db";
import imagekit from "@/lib/imagekit";

const PublishStory = async (data: FormData, id: string) => {
  try {
    const value = data.get("media");
    if (value instanceof File) {
      const { filePath } = await imagekit.upload({
        file: Buffer.from(await value.arrayBuffer()),
        fileName: value.name + Date.now() + Math.random() * 100,
        folder: `/socio/`,
      });
      await db.story.create({
        data: {
          imagePath: filePath,
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
          user: {
            connect: {
              id,
            },
          },
        },
      });
    }
    return { success: "Story successfully uploaded" };
  } catch (e) {
    console.log(e);
    return { error: "Error while uploading story. Please try again." };
  }
};

export default PublishStory;
