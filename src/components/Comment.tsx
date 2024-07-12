import React, { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Heart, Pencil } from "lucide-react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

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
  const [isOverflow, setIsOverflow] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [open, setOpen] = useState(false);
  const textContainerRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (textContainerRef.current) {
      setIsOverflow(
        textContainerRef.current.scrollHeight >
          textContainerRef.current.clientHeight
      );
      setIsExpanded(
        !(
          textContainerRef.current.scrollHeight >
          textContainerRef.current.clientHeight
        )
      );
    }
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
            onClick={() => isOverflow && setIsExpanded(!isExpanded)}
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
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  className="mr-4 px-2 py-1 flex gap-2"
                >
                  <Pencil size={16} />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit Comment</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DropdownMenuContent className="w-14">
          <DropdownMenuItem onClick={() => setOpen(true)}>
            Edit
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit your comment</DialogTitle>
          </DialogHeader>
          <div className="flex gap-x-3 items-center">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Textarea
              className="h-[2rem] resize-none"
              placeholder="Add a comment..."
            ></Textarea>
          </div>
          <Button className="w-fit mx-auto" size={"sm"} type="submit">
            Save Changes
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Comment;
