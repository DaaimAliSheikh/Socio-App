"use server";

import { db } from "@/db/db";
import { revalidatePath } from "next/cache";

const deleteNotification = async (id: string) => {
  try {
    await db.notification.delete({ where: { id } });
  } catch (e) {
    //do nothing if the notification doesnt exist
  }

  revalidatePath("/notifications");
};

export default deleteNotification;
