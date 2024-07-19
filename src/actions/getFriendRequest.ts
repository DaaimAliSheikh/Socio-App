"use server";

import { db } from "@/db/db";

const getFriendRequest = async (
  userId: string,
  otherUserId: string,
  sent?: boolean
) => {
  return await db.friendRequest.findFirst({
    where: {
      senderId: sent ? userId : otherUserId,
      receiverId: sent ? otherUserId : userId,
    },
  });
};

export default getFriendRequest;
