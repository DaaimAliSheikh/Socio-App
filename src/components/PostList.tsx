"use client";
import Post from "./Post";
import { User } from "@prisma/client";
import { useInView } from "react-intersection-observer";
import { Loader2 } from "lucide-react";
import { PostItem } from "@/lib/types";
import { useEffect, useState } from "react";
import getPostsByUserId from "@/actions/getPostsByUserId";
import noPostSvg from "../../public/no-posts.svg";
import Image from "next/image";

const PostList = ({
  user,
  initialPosts,
  search,
}: {
  user: User;
  initialPosts: PostItem[];
  search?: string;
}) => {
  const { ref, inView, entry } = useInView();
  const [page, setPage] = useState(0);
  const [posts, setPosts] = useState<PostItem[]>(initialPosts);
  const [ended, setEnded] = useState(false);

  useEffect(() => setPosts(initialPosts), [initialPosts]);

  useEffect(() => {
    (async () => {
      if (ended) return;
      if (initialPosts?.length < 5) {
        setEnded(true);
        return;
      }
      if (inView) {
        const newPosts = await getPostsByUserId(
          user.id,
          (page + 1) * 5,
          search
        );

        if (newPosts.length < 5) setEnded(true);

        setPosts((prev) => [...prev, ...newPosts]);
        setPage((prev) => ++prev);
      }
    })();
  }, [inView]);
  return (
    <div className="w-full mx-auto max-w-[40rem] space-y-4">
      {posts.length>0?posts?.map((post) => {
        return (
          <Post
            key={post.id}
            setPosts={setPosts}
            post={post}
            user={user}
            search={search}
          />
        );
      }):
      <>
      
      <Image alt="no posts" width={300} height={300} className="mx-auto mt-10" src={noPostSvg}/>
      <p className="text-center text-muted-foreground text-lg">No posts found</p>
      </>
       }
      <div ref={ref}>
        <Loader2
          ref={ref}
          className={`${ended ? "hidden" : ""} animate-spin mx-auto m-6`}
        />
      </div>
    </div>
  );
};

export default PostList;
