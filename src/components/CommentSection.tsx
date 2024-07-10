import React from "react";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import Comment from "./Comment";
import { Separator } from "./ui/separator";

const comments = [
  {
    author: "parent",
    date: "fs",
    image: "wda",
    content:
      "awdawdddddddddddddddddddddddddad awdsadwad wd wa da dn sadh ad a lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil, voluptatum.",
    parent: "",
    likes: 2,
    edited: false,
  },
  {
    author: "child",
    date: "date",
    image: "wda",
    content:
      "awdawdddddddddddddddddddddddddad awdsadwad wd wa da dn sadh ad a lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil, voluptatum.",
    parent: "parent",
    likes: 2,
    edited: false,
  },
];

const CommentSection = () => {
  return (
    <main>
      <Separator className="my-2" />
      <h3 className="text-xl m-2">Comments</h3>
      <div>
        {comments.map((comment) => (
          <Comment comment={comment} />
        ))}
      </div>
      <div className="flex gap-x-2 items-center">
        <Avatar className="h-8 w-8">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Input className="h-[2rem]" placeholder="Add a comment..."></Input>
        <Button size={"sm"} type="submit">
          Post
        </Button>
      </div>
    </main>
  );
};

export default CommentSection;
