"use server";

import { db } from "@/db/db";

const changeFriendRequest = async (
  userId: string,
  otherUserId: string,
  remove?: boolean
) => {
  await db.friendRequest.deleteMany({
    where: {
      OR: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId },
      ],
    },
  });
  if (remove) return;

  return await db.friendRequest.create({
    data: {
      senderId: userId,
      receiverId: otherUserId,
    },
  });
};

export default changeFriendRequest;
