"use server";

import { db } from "@/db/db";

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
  for (const story of allstories) {
    if (story.expires < new Date()) {
      await db.story.delete({ where: { id: story.id } });
      allstories.splice(allstories.indexOf(story), 1);
    }
  }
  return allstories;
};

export default getStories;
