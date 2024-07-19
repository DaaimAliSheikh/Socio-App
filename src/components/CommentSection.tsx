import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Comment from "./Comment";
import { Separator } from "./ui/separator";
import { User } from "@prisma/client";
import { CommentItem, PostItem } from "@/lib/types";
import getComments from "@/actions/getComments";
import generateInitials from "@/lib/generateInitials";
import addComment from "@/actions/addComment";

import { LoaderCircle, MessagesSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";

const CommentSection = ({ user, post }: { user: User; post: PostItem }) => {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<{ content: string }>();

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      const newComments = await getComments(post.id, user.id);
      setComments(newComments);
      setLoading(false);
    };
    fetchComments();
  }, [post.id, user.id]);
  return (
    <main>
      <Separator className="my-2" />
      <h3 className="text-xl m-2">Comments</h3>
      {!loading ? (
        comments.length > 0 ? (
          <div>
            {comments.map((comment: CommentItem, index: number) => (
              <Comment
                key={index}
                comment={comment}
                user={user}
                setComments={setComments}
              />
            ))}
          </div>
        ) : (
          <div className="my-8 w-full ">
            <MessagesSquare strokeWidth={1} className="mx-auto w-16 h-16" />
            <p className="text-center">No comments</p>
          </div>
        )
      ) : (
        <LoaderCircle className="animate-spin m-2 mx-auto" />
      )}

      <div className="flex gap-x-2 items-center">
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={
              (user?.image?.startsWith("/socio")
                ? "https://ik.imagekit.io/vmkz9ivsg4"
                : "") + user?.image
            }
          />
          <AvatarFallback>{generateInitials(user.name)}</AvatarFallback>
        </Avatar>
        <form
          onSubmit={handleSubmit(async (data, e) => {
            e?.target.reset();
            setComments([
              ...comments,
              await addComment(data.content, user.id, post.author.id, post.id),
            ]);
          })}
          className="w-full flex items-center gap-2"
        >
          <Input
            {...register("content", { required: "Please add a comment" })}
            className="h-[2rem]"
            placeholder="Add a comment..."
          ></Input>
          <Button disabled={isSubmitting} size={"sm"} type="submit">
            <p>Post</p>
            {isSubmitting ? (
              <LoaderCircle className="animate-spin ml-2" />
            ) : null}
          </Button>
        </form>
      </div>
    </main>
  );
};

export default CommentSection;
