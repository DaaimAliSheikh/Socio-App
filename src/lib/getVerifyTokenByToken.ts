import { db } from "@/db/db";
import React from "react";

const getVerifyTokenByToken = async (token: string) =>
  await db.verifyToken.findUnique({ where: { token } });

export default getVerifyTokenByToken;
