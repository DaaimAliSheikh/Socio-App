import { db } from "@/db/db";

const getUserByEmail = async (email: string) => {
  return await db.user.findUnique({ where: { email } });
};

export default getUserByEmail;
