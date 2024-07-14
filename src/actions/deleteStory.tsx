"use server";

import { db } from "@/db/db";
import imagekit from "@/lib/imagekit";

const deleteStory = async (id: string) => {
  try {
    const { imagePath } = await db.story.delete({
      where: { id },
      select: { imagePath: true },
    });
    const files = await imagekit.listFiles({ path: "/socio/" });
    const fileId = files.find((f) => {
      return f.filePath === imagePath;
    })?.fileId as string;
    await imagekit.deleteFile(fileId);
  } catch (e) {
    console.log("could not remove story");
  }
};

export default deleteStory;
