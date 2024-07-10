"use client";
import React from "react";
import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import { LoaderCircle, Power } from "lucide-react";

const LogoutButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button
      disabled={pending}
      variant={"ghost"}
      className="w-full flex justify-start my-3 border"
      type="submit"
    >
      <Power className="text-primary mr-4" />
      <p>Logout</p>
      {pending ? <LoaderCircle className="animate-spin ml-2" /> : null}
    </Button>
  );
};

export default LogoutButton;
