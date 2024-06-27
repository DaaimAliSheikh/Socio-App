"use server";
import { signIn, signOut } from "@/auth";
import { db } from "@/db/prisma_client";
import { isRedirectError } from "next/dist/client/components/redirect";

export const registerAction = async (data: FormData) => {
  await db.user.create({
    data: {
      name: data.get("name") as string,
      password: data.get("password") as string,
    },
  });
};

export const loginAction = async (data: any) => {
  const { name, password } = data;

  try {
    return await signIn("credentials", { name, password, redirect: false });
  } catch (e) {
    return { err: "something wrong" };
  }
};



export const logoutAction = async () => {
  await signOut({ redirect: false });
};
