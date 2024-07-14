"use client";
import Post from "./Post";
import { User } from "@prisma/client";
import { useInView } from "react-intersection-observer";
import { Loader2 } from "lucide-react";
import { PostItem } from "@/lib/types";

const posts = [{ user: "dad", caption: "like", date: "today", img: "adadw" }];

const PostList = ({ user, posts }: { user: User; posts: PostItem[] }) => {
  const { ref, inView, entry } = useInView();
  return (
    <div className="w-full max-w-[40rem] space-y-4">
      {posts.map((post) => {
        return (
          <>
            <Post post={post} />
            <div>
              <Loader2 ref={ref} className="animate-spin mx-auto m-6" />
            </div>
          </>
        );
      })}
    </div>
  );
};

export default PostList;
