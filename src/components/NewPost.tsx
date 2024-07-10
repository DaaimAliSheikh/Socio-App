import React from "react";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import NewPostForm from "./NewPostForm";
import { Camera } from "lucide-react";
const NewPost = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="flex shadow-sm hover:cursor-pointer items-center my-2 w-full group p-2 hover:bg-secondary ">
          <Avatar className="mr-4 group-hover:border-2 group-hover:border-foreground">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex-grow flex justify-between border text-sm group-hover:bg-card group-hover:border-foreground text-start p-2 rounded-md">
            <p>Create a Post...</p>
            <Camera />
          </div>
        </Card>
      </DialogTrigger>
      <DialogContent>
          <DialogTitle className="text-lg font-bold my-2">New Post</DialogTitle>
          <NewPostForm />
      </DialogContent>
    </Dialog>
  );
};

export default NewPost;
