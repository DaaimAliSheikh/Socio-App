"use server";

import { db } from "@/db/db";
import { StoryItem } from "@/lib/types";

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

  return [...othersStories, ownStory].filter(async (story) => {
    if (!story) return false;
    else if (story.expires > new Date()) return true;
    else {
      await db.story.delete({ where: { id: story.id } });
      return false;
    }
  }) as StoryItem[];
};

export default getStories;
