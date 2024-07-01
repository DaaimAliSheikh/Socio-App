import { db } from "@/db/db";
import { v4 as uuid } from "uuid";
import SendMail from "./SendMail";

const sendVerifyToken = async (email: string) => {
  const verifyToken = await db.verifyToken.findFirst({ where: { email } });
  if (verifyToken)
    await db.verifyToken.delete({ where: { token: verifyToken.token } });

  const token = uuid();
  await db.verifyToken.create({ data: { token, email } });
  SendMail(email, token);
};

export default sendVerifyToken;
