"use client";

import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import { Trash2, LoaderCircle } from "lucide-react";

const NotificationDeleteButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button disabled={pending} size={"icon"} variant={"outline"} type="submit">
      {pending ? <LoaderCircle className="animate-spin" /> : <Trash2 />}
    </Button>
  );
};

export default NotificationDeleteButton;
