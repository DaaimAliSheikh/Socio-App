import { cache } from "react";
import { db } from "../db/db";

const getUserById = cache(async (id: string | undefined) => {
  console.log("get user called");
  if (id) return await db.user.findUnique({ where: { id } });
});

export default getUserById;
