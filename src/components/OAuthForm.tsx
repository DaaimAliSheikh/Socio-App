"use client";
import { signInRedirectUrl } from "@/routes";
import { signIn } from "next-auth/react";
import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { Button } from "./ui/button";
import { LoaderCircle } from "lucide-react";

const OAuthForm = () => {
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const onSubmit = useCallback(async () => {
    await signIn("google", { callbackUrl: signInRedirectUrl });
  }, []);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Button
        disabled={isSubmitting}
        className="w-full mt-2"
        variant={"secondary"}
        type="submit"
      >
        <FcGoogle className=" text-2xl mr-2 " />
        <p>Sign in with Google</p>
        {isSubmitting ? <LoaderCircle className="animate-spin ml-2" /> : null}
      </Button>
    </form>
  );
};

export default OAuthForm;
