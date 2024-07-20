"use client";
import React, { useEffect, useRef, useState } from "react";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Forward,
  Heart,
  Loader2,
  MessageCircle,
  Pencil,
  Settings,
} from "lucide-react";
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
import generateInitials from "@/lib/generateInitials";
import { PostItem } from "@/lib/types";
import getTimeAgo from "@/lib/getTimeAgo";
import { User } from "@prisma/client";
import { useToast } from "./ui/use-toast";
import changePostLikes from "@/actions/changePostLikes";
import checkPostLiked from "@/actions/checkPostLiked";
import deletePost from "@/actions/deletePost";
import splitStringToWords from "@/lib/splitStringToWords";

const Post = ({
  post,
  user,
  setPosts,
  search,
}: {
  post: PostItem;
  user: User;
  setPosts: React.Dispatch<React.SetStateAction<PostItem[]>>;
  search?: string;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflow, setIsOverflow] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [editopen, setEditopen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imagesopen, setImagesopen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const textContainerRef = useRef<HTMLElement>(null);
  const [liked, setLiked] = useState(false);
  const { toast } = useToast();

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

    const handleResize = () => {
      if (textContainerRef.current) {
        if (
          textContainerRef.current.clientHeight >=
          textContainerRef.current.scrollHeight
        ) {
          setIsOverflow(false);
          setIsExpanded(true);
        }
      }
    };
    window.addEventListener("resize", handleResize);

    (async () => setLiked(await checkPostLiked(post.id, user.id)))();

    return () => window.removeEventListener("resize", handleResize);
  }, [post.id, user.id]);
  return (
    <Card className={`p-2 mb-4`}>
      <div className="flex justify-between   items-center">
        <div
          className="flex  flex-grow overflow-hidden hover:cursor-pointer"
          onClick={() =>
            (window.location.href = `${window.location.origin}/profile/${post.author.id}`)
          }
        >
          <Avatar className=" m-2 h-10 w-10 border-1">
            <AvatarImage
              src={
                (post.author?.image?.startsWith("/socio")
                  ? "https://ik.imagekit.io/vmkz9ivsg4"
                  : "") + post.author?.image
              }
            />
            <AvatarFallback>
              {generateInitials(post.author.name)}
            </AvatarFallback>
          </Avatar>
          <div
            className={
              " ml-2 flex flex-col flex-grow  justify-center  overflow-hidden leading-6"
            }
          >
            <div className="flex w-full  ">
              <h2
                className={
                  "justify-center text-md font-bold overflow-hidden whitespace-nowrap  text-ellipsis"
                }
              >
                {post.author.name}
              </h2>
              {post.edited ? (
                <div className="text-muted-foreground flex items-center ml-2">
                  <p className="h-[14px] w-[2px] bg-secondary"></p>
                  <p className="text-xs ml-2">edited</p>
                </div>
              ) : null}
            </div>

            <p className="text-xs text-muted-foreground overflow-hidden  text-ellipsis">
              {getTimeAgo(post.createdAt)}
            </p>
          </div>
        </div>
        {user.id == post.authorId ? (
          <>
            <DropdownMenu>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant={"ghost"}
                        size={"icon"}
                        className="mr-4 px-2 py-1 flex gap-2"
                        disabled={isDeleting}
                      >
                        {isDeleting ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          <Pencil size={18} className="text-muted-foreground" />
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit Post</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <DropdownMenuContent className="w-14">
                <DropdownMenuItem onClick={() => setEditopen(true)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={async () => {
                    setIsDeleting(true);
                    try {
                      await deletePost(post.id);
                      toast({
                        description: "Post deleted successfully",
                      });
                      setPosts((prev) => prev.filter((p) => p.id != post.id));
                    } catch {
                      toast({
                        title: "Error",
                        description:
                          "Something went wrong, could not delete post",
                        variant: "destructive",
                      });
                    }

                    setIsDeleting(false);
                  }}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={editopen} onOpenChange={setEditopen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Post</DialogTitle>
                </DialogHeader>
                <NewPostForm
                  post={post}
                  userId={user.id}
                  setPosts={setPosts}
                  setOpen={setEditopen}
                />
              </DialogContent>
            </Dialog>
          </>
        ) : null}
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

        <p className="text-sm  ">
          {splitStringToWords(post.description || "", search || "").map(
            (w, index) => (
              <span className={index == 1 ? "bg-primary" : ""} key={index}>
                {w}
              </span>
            )
          )}
        </p>
      </main>
      <main className="p-2">
        <div
          className={`grid  gap-1 w-full ${
            post.imagePaths.length >= 3
              ? "grid-cols-2 "
              : post.imagePaths.length == 2
              ? "grid-cols-2 grid-rows-1"
              : ""
          }`}
        >
          {post.imagePaths.map((path, index: number) => {
            return index <= 3 ? (
              <div
                key={index}
                className={`relative border  ${
                  index === 2 && post.imagePaths.length === 3
                    ? "col-span-2"
                    : ""
                }`}
                onClick={() => {
                  setCurrentIndex(index);
                  setImagesopen(true);
                }}
              >
                <Image
                  alt="post image"
                  src={path}
                  height={200}
                  width={200}
                  sizes="100vw"
                  className={`object-cover w-full rounded-md  hover:cursor-pointer
                  
                    ${index === 3 ? "opacity-50" : ""}`}
                />
                <p
                  className={` ${
                    index !== 3 ? "hidden" : ""
                  } absolute bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2 text-2xl font-bold`}
                >
                  +{post.imagePaths.length - 3}
                </p>
              </div>
            ) : null;
          })}
        </div>
        <Dialog open={imagesopen} onOpenChange={setImagesopen}>
          <DialogContent className="w-[90%] max-w-[40rem]  h-[96vh] ">
            <DialogHeader>
              <DialogTitle>
                <div className="flex text-start overflow-hidden">
                  <Avatar className=" m-2 h-10 w-10 border-1">
                    <AvatarImage
                      src={
                        (post.author?.image?.startsWith("/socio")
                          ? "https://ik.imagekit.io/vmkz9ivsg4"
                          : "") + post.author?.image
                      }
                    />
                    <AvatarFallback>
                      {generateInitials(post.author.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={
                      " ml-2 flex flex-col w-[70%] md:w-[80%] justify-center  leading-6"
                    }
                  >
                    <h2
                      className={
                        "justify-center text-sm font-bold overflow-hidden whitespace-nowrap  text-ellipsis"
                      }
                    >
                      {post.author.name}
                    </h2>

                    <p className="text-xs text-muted-foreground overflow-hidden  text-ellipsis">
                      {getTimeAgo(post.createdAt)}
                    </p>
                  </div>
                </div>
              </DialogTitle>
            </DialogHeader>

            <ImageView
              imagePaths={post.imagePaths}
              currentIndex={currentIndex}
            />
          </DialogContent>
        </Dialog>
      </main>
      <div className="flex justify-between items-center mx-8 ">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={async () => {
                  liked ? post.likes-- : post.likes++;
                  setLiked((prev) => !prev);

                  try {
                    liked
                      ? await changePostLikes(
                          post.id,
                          user.id,
                          post.author.id,
                          false
                        )
                      : await changePostLikes(
                          post.id,
                          user.id,
                          post.author.id,
                          true
                        );
                  } catch {
                    liked ? post.likes-- : post.likes++;
                    setLiked((prev) => !prev);
                  }
                }}
                variant={"ghost"}
              >
                <Heart
                  size={20}
                  className={
                    liked
                      ? "text-primary mr-1 fill-primary transition-all"
                      : "transition-all"
                  }
                />

                {post.likes > 0 ? post.likes : null}
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
              <Button
                onClick={async () => {
                  await navigator.clipboard.writeText(
                    `${window.location.origin}/post/${post.id}`
                  );
                  toast({
                    duration: 3000,
                    description: "copied link to clipboard",
                  });
                }}
                variant={"ghost"}
                size={"icon"}
              >
                <Forward />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Share link</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      {showComments && <CommentSection user={user} post={post} />}
    </Card>
  );
};

export default Post;
