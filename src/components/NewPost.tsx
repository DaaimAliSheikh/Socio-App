"use client";
import React from "react";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import NewPostForm from "./NewPostForm";
import { Camera } from "lucide-react";
import { User } from "@prisma/client";
import generateInitials from "@/lib/generateInitials";

const NewPost = ({ user }: { user: User }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Card className="flex shadow-sm hover:cursor-pointer items-center mb-4 mt-2 w-full group p-2 hover:bg-secondary ">
          <Avatar className="mr-4 group-hover:border-2 group-hover:border-foreground">
            <AvatarImage
              src={
                (user?.image?.startsWith("/socio")
                  ? "https://ik.imagekit.io/vmkz9ivsg4"
                  : "") + user?.image
              }
            />
            <AvatarFallback>{generateInitials(user?.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-grow flex justify-between border text-sm group-hover:bg-card group-hover:border-foreground text-start p-2 rounded-md">
            <p>Create a Post...</p>
            <Camera />
          </div>
        </Card>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="text-lg font-bold my-2">New Post</DialogTitle>
        <NewPostForm userId={user?.id} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};

export default NewPost;
