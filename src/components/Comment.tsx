import React, { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Heart, Pencil } from "lucide-react";

const Comment = ({
  comment,
}: {
  comment: {
    author: string;
    image: string;
    date: string;
    content: string;
    parent: string;
    likes: number;
    edited: boolean;
  };
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const textContainerRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (textContainerRef.current)
      setIsExpanded(
        !(
          textContainerRef.current.scrollHeight >
          textContainerRef.current.clientHeight
        )
      );
  }, []);

  return (
    <div className="flex my-6 w-full  justify-between items-center">
      <div className={`flex border-primary border-l-4 pl-2`}>
        <Avatar className=" mx-2 mt-1 self-start h-8 w-8 border-1">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div
          className={
            " ml-1 flex flex-col w-[70%] md:w-[80%]  justify-center  leading-6"
          }
        >
          <h2
            className={
              "justify-center text-sm font-bold overflow-hidden  text-ellipsis"
            }
          >
            {comment.author}
          </h2>

          <main
            ref={textContainerRef}
            className={`${
              isExpanded ? "" : "overflow-hidden h-[3.8rem]"
            } flex mx-2 relative hover:cursor-pointer my-2 w-full`}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {!isExpanded ? (
              <div className=" flex  text-sm text-blue-600 absolute bottom-0 right-0">
                <p className="w-[4rem] bg-gradient-to-r from-transparent  to-card"></p>
                <p className="bg-card">
                  <span className="mx-4">...read more</span>
                </p>
              </div>
            ) : null}

            <p className="text-sm text-muted-foreground"> {comment.content}</p>
          </main>

          <div className="text-xs text-foreground  flex gap-4 my-2 ">
            <p className=" flex gap-1 items-center  hover:text-muted-foreground hover:cursor-pointer">
              <Heart size={16} className="" /> {comment.likes}
            </p>
            <p className="h-full w-[2px] bg-secondary"></p>
            <p>{comment?.date}</p>
          </div>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={"ghost"}
            size={"icon"}
            className="mr-4 px-2 py-1 flex gap-2"
          >
            <Pencil size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-14">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Comment;
