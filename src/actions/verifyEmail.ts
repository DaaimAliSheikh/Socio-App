"use server";

import { db } from "@/db/db";
import getVerifyTokenByToken from "@/lib/getVerifyTokenByToken";

const verifyEmail = async (token: string) => {
  try {
    const VerifyToken = await getVerifyTokenByToken(token);

    if (VerifyToken) {
      await db.user.update({
        where: { email: VerifyToken.email },
        data: { emailVerified: new Date() },
      });
      await db.verifyToken.delete({ where: { token } });
      return true;
    }
    return false;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export default verifyEmail;
