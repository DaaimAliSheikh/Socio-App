import { auth } from "@/auth";
import AuthForm from "@/components/AuthForm";
import getUserById from "@/lib/getUserById";
import React from "react";

// export const dynamic = "force-dynamic";

const Signin = async () => {
  const session = await auth();
  const user = await getUserById(session?.user?.id);
  return (
    <>
      <AuthForm />
    </>
  );
};

export default Signin;
