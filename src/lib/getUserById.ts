import { cache } from "react";
import { db } from "../db/db";

const getUserById = cache(async (id: string | undefined) => {
  if (id) return await db.user.findUnique({ where: { id } });
});

export default getUserById;
