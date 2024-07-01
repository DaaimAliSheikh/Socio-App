import { db } from "@/db/db";
import React from "react";

const getUserByEmail = async (email: string) => {
  return await db.user.findUnique({ where: { email } });
};

export default getUserByEmail;
