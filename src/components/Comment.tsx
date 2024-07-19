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
import { Textarea } from "./ui/textarea";
import { CommentItem } from "@/lib/types";
import generateInitials from "@/lib/generateInitials";
import getTimeAgo from "@/lib/getTimeAgo";
import { User } from "@prisma/client";
import deleteComment from "@/actions/deleteComment";
import { useToast } from "./ui/use-toast";
import changeCommentLikes from "@/actions/changeCommentLikes";
import checkCommentLiked from "@/actions/checkCommentLiked";
import { useForm } from "react-hook-form";
import updateComment from "@/actions/updateComment";

const Comment = ({
  comment,
  user,
  setComments,
}: {
  comment: CommentItem;
  user: User;
  setComments: React.Dispatch<React.SetStateAction<CommentItem[]>>;
}) => {
  const [isOverflow, setIsOverflow] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [open, setOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<{ content: string }>({
    defaultValues: { content: comment.content },
  });

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
    (async () => setLiked(await checkCommentLiked(comment.id, user.id)))();
    return () => window.removeEventListener("resize", handleResize);
  }, [comment.id, user.id]);

  return (
    <div className="flex my-6 w-full gap-2  justify-between items-center">
      <div
        className={`flex border-primary border-l-4 pl-2 overflow-hidden w-full`}
      >
        <Avatar className=" mx-2  self-start h-8 w-8 border-1">
          <AvatarImage
            src={
              (comment.author?.image?.startsWith("/socio")
                ? "https://ik.imagekit.io/vmkz9ivsg4"
                : "") + comment.author?.image
            }
          />
          <AvatarFallback>
            {generateInitials(comment.author.name)}
          </AvatarFallback>
        </Avatar>
        <div
          className={
            " ml-1 flex flex-col w-full  justify-center  overflow-hidden  leading-6"
          }
        >
          <div
            onClick={() =>
              (window.location.href = `/profile/${comment.author.id}`)
            }
            className="flex w-fit hover:cursor-pointer justify-between items-center gap-2"
          >
            <h2
              className={
                "justify-center text-sm font-bold overflow-hidden  text-ellipsis"
              }
            >
              {comment.author.name}
            </h2>
            {comment.edited && (
              <>
                <p className="h-[14px] w-[2px] bg-secondary"></p>
                <p className="text-xs text-muted-foreground">edited</p>
              </>
            )}
          </div>

          <main
            ref={textContainerRef}
            className={`${
              isExpanded ? "" : "overflow-hidden h-[3.8rem]"
            } flex relative hover:cursor-pointer  my-2 w-full`}
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
            <p
              onClick={async () => {
                liked ? comment.likes-- : comment.likes++;
                setLiked((prev) => !prev);

                try {
                  liked
                    ? await changeCommentLikes(
                        comment.id,
                        comment.postId,
                        user.id,
                        comment.author.id,
                        false
                      )
                    : await changeCommentLikes(
                        comment.id,
                        comment.postId,
                        user.id,
                        comment.author.id,
                        true
                      );
                } catch {
                  liked ? comment.likes-- : comment.likes++;
                  setLiked((prev) => !prev);
                }
              }}
              className=" flex gap-1 items-center  hover:text-muted-foreground hover:cursor-pointer"
            >
              <Heart
                size={16}
                className={
                  liked
                    ? "text-primary mr-1 fill-primary transition-all"
                    : "transition-all"
                }
              />
              {comment.likes > 0 ? comment.likes : null}
            </p>
            <p className="h-full w-[2px] bg-secondary"></p>
            <p>{getTimeAgo(comment.createdAt)}</p>
          </div>
        </div>
      </div>
      {comment.author.id === user.id || comment.post.author.id === user.id ? (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={"ghost"}
                size={"icon"}
                className="mr-4 px-2 py-1 flex gap-2 "
              >
                <Pencil size={16} />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-14">
              {comment.author.id === user.id && (
                <>
                  <DropdownMenuItem onClick={() => setOpen(true)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}

              <DropdownMenuItem
                onClick={async () => {
                  try {
                    await deleteComment(comment.id);
                    setComments((prev) =>
                      prev.filter((c) => c.id !== comment.id)
                    );
                    toast({
                      description: `${comment.author.name}'s comment has been deleted.`,
                    });
                  } catch {
                    toast({
                      title: "Error",
                      variant: "destructive",
                      description: `Action failed to complete.`,
                    });
                  }
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit your comment</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={handleSubmit(async (data) => {
                  await updateComment(comment.id, data.content);
                  setComments((prev) => {
                    return prev.map((c) => {
                      if (c.id === comment.id) {
                        return {
                          ...c,
                          content: data.content,
                          edited: true,
                        };
                      }
                      return c;
                    });
                  });
                  setOpen(false);
                  toast({
                    duration: 3000,
                    description: "Comment updated successfully",
                  });
                })}
                className="w-full flex flex-col"
              >
                <div className="flex  gap-x-3 items-center">
                  <Avatar className="h-8 w-8 self-start mt-1">
                    <AvatarImage
                      src={
                        (user?.image?.startsWith("/socio")
                          ? "https://ik.imagekit.io/vmkz9ivsg4"
                          : "") + user?.image
                      }
                    />
                    <AvatarFallback>
                      {generateInitials(user?.name)}
                    </AvatarFallback>
                  </Avatar>

                  <Textarea
                    {...register("content", {
                      required: "comment cannot be empty",
                    })}
                    className="h-[2rem] resize-none"
                    placeholder="Add a comment..."
                  ></Textarea>
                </div>
                <Button className="mt-4 mx-auto" size={"sm"} type="submit">
                  Save Changes
                </Button>
                <p className="text-red-500 text-sm mx-auto p-2">
                  {errors.content?.message}
                </p>
              </form>
            </DialogContent>
          </Dialog>
        </>
      ) : null}
    </div>
  );
};

export default Comment;
