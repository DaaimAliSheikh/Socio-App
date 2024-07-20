"use server";

import { db } from "@/db/db";
import imagekit from "@/lib/imagekit";

const getStories = async (userId: string) => {
  const ownStory = await db.story.findUnique({
    where: {
      userId,
    },

    include: {
      user: { select: { id: true, name: true, image: true } },
    },
  });

  const othersStories = await db.story.findMany({
    where: {
      user: {
        OR: [
          {
            relationA: {
              some: { userBId: userId, type: "FRIEND" },
            },
          },
          {
            relationB: {
              some: { userAId: userId, type: "FRIEND" },
            },
          },
        ],
      },
    },
    include: {
      user: { select: { id: true, name: true, image: true } },
    },
  });

  const allstories = ownStory ? [ownStory, ...othersStories] : othersStories;
  const files = await imagekit.listFiles({ path: "/socio/" });
  for (const story of allstories) {
    if (story.expires < new Date()) {
      const s = await db.story.delete({ where: { id: story.id } });

      const fileId = files.find((f) => {
        return f.filePath === s.imagePath;
      })?.fileId as string;
      await imagekit.deleteFile(fileId);
      allstories.splice(allstories.indexOf(story), 1);
    }
  }
  return allstories;
};

export default getStories;
