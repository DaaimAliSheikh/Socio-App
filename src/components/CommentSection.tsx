import React, { useCallback, useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Comment from "./Comment";
import { Separator } from "./ui/separator";
import { User } from "@prisma/client";
import { CommentItem, PostItem } from "@/lib/types";
import getComments from "@/actions/getComments";
import generateInitials from "@/lib/generateInitials";
import commentAction from "@/actions/commentAction";
import { LoaderCircle, Router } from "lucide-react";
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

  const fetchComments = useCallback(async () => {
    setLoading(true);
    const newComments = await getComments(post.id, user.id);
    setComments(newComments);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchComments();
  }, []);
  return (
    <main>
      <Separator className="my-2" />
      <h3 className="text-xl m-2">Comments</h3>
      {!loading ? (
        <div>
          {comments.map((comment: CommentItem) => (
            <Comment comment={comment} user={user} />
          ))}
        </div>
      ) : (
        <LoaderCircle className="animate-spin m-2 mx-auto" />
      )}

      <div className="flex gap-x-2 items-center">
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.image || ""} />
          <AvatarFallback>{generateInitials(user.name)}</AvatarFallback>
        </Avatar>
        <form
          onSubmit={handleSubmit(async (data) => {
            await commentAction(data.content, user.id, post.id);
            await fetchComments();
          })}
          className="w-full flex items-center gap-2"
        >
          <Input
            {...register("content")}
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
