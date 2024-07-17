"use server";

import { db } from "@/db/db";

const updateComment = async (id: string, content: string) => {
  await db.comment.update({
    where: { id: id },
    data: { content, edited: true },
  });
};

export default updateComment;
