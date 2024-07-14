"use server";
import { db } from "@/db/db";
import imagekit from "@/lib/imagekit";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const PublishStory = async (data: FormData, id: string) => {
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

};

export default PublishStory;
