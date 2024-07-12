"use client";
import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Forward, Heart, MessageCircle, Pencil, Settings } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import Image from "next/image";
import CommentSection from "./CommentSection";
import ImageView from "./ImageView";
import NewPostForm from "./NewPostForm";

const post = {
  user: "dad",
  title: "cojvosdv",
  description:
    "sdf Lorem ipsum dolor sit, amet consectetur adipisicing elit. Reprehenderit vel sed molestias qui ad, commodi velit doloribus quibusdam tenetur iusto voluptatibus sit minus est similique itaque necessitatibus soluta nisi error. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates dolore sit molestiae enim blanditiis ab facilis? Quas eligendi provident deleniti nihil alias expedita, fugit doloremque earum magni laborum aspernatur harum. ",
  date: "today",
  img: ["adw", "awdawd"],
};
const Post = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflow, setIsOverflow] = useState(false);
  const [showComments, setShowComments] = useState(false);
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
    <Card className={`p-2 `}>
      <div className="flex justify-between items-center">
        <div className="flex  overflow-hidden">
          <Avatar className=" m-2 h-10 w-10 border-1">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div
            className={
              " ml-2 flex flex-col w-[70%] md:w-[80%]  justify-center  leading-6"
            }
          >
            <h2
              className={
                "justify-center text-lg font-bold overflow-hidden  text-ellipsis"
              }
            >
              {post.user}
            </h2>

            <p className="text-xs text-muted-foreground overflow-hidden  text-ellipsis">
              {post?.date}
            </p>
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
                    <Pencil size={18} className="text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit Post</p>
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
              <DialogTitle>Edit Post</DialogTitle>
            </DialogHeader>
            <NewPostForm post={post} />
          </DialogContent>
        </Dialog>
      </div>
      <main
        ref={textContainerRef}
        className={`${
          isExpanded ? "" : "overflow-hidden h-[3.8rem]"
        } flex mx-2 relative hover:cursor-pointer my-2 `}
        onClick={() => (isOverflow ? setIsExpanded(!isExpanded) : null)}
      >
        {!isExpanded && isOverflow ? (
          <div className=" flex  text-sm text-blue-600 absolute bottom-0 right-0">
            <p className="w-[4rem] bg-gradient-to-r from-transparent  to-card"></p>
            <p className="bg-card">
              <span className="mx-4 text-xs">...read more</span>
            </p>
          </div>
        ) : null}

        <p className="text-sm  ">{post.title}</p>
      </main>
      <main className="p-2">
        <Dialog>
          <DialogTrigger asChild>
            <Image
              alt="post image"
              src={"/socio/COOL_OiXrrxaha.jpeg"}
              height={200}
              width={200}
              sizes="100vw"
              className="object-cover w-full rounded-md  hover:cursor-pointer"
            ></Image>
          </DialogTrigger>
          <DialogContent className="w-[90%] max-w-[40rem] ">
            <DialogHeader>
              <DialogTitle>
                <div className="flex text-start overflow-hidden">
                  <Avatar className=" m-2 h-10 w-10 border-1">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div
                    className={
                      " ml-2 flex flex-col w-[70%] md:w-[80%]  justify-center  leading-6"
                    }
                  >
                    <h2
                      className={
                        "justify-center text-lg font-bold overflow-hidden  text-ellipsis"
                      }
                    >
                      {post.user}
                    </h2>

                    <p className="text-xs text-muted-foreground overflow-hidden  text-ellipsis">
                      {post?.date}
                    </p>
                  </div>
                </div>
              </DialogTitle>
            </DialogHeader>

            <ImageView images={post.img} />
          </DialogContent>
        </Dialog>
      </main>
      <div className="flex justify-between items-center mx-8 ">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant={"ghost"}>
                <Heart size={20} />
                <p className="p-1">2</p>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Like</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={"ghost"}
                className="-ml-4"
                size={"icon"}
                onClick={() => setShowComments(!showComments)}
              >
                <MessageCircle />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Comment</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant={"ghost"} size={"icon"}>
                <Forward />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Share link</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      {showComments && <CommentSection />}
    </Card>
  );
};

export default Post;
