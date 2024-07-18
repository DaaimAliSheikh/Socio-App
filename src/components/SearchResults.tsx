"use client";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { PostItem } from "@/lib/types";
import PostList from "./PostList";
import { User } from "@prisma/client";
import getPostsByUserId from "@/actions/getPostsByUserId";

import UsersList from "./UsersList";
import getUsersBySearchTerm from "@/actions/getUsersBySearchTerm";



const SearchResults = ({ user }: { user: User }) => {
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState<PostItem[]>([]);

  useEffect(() => {
    (async () => {
      const initialPosts: PostItem[] = await getPostsByUserId(
        user.id,
        0,
        searchParams.get("key") || ""
      );
      setPosts(initialPosts);
   
    })();
  }, [searchParams]);

  return (
    <main className="flex p-4 border-none shadow-none items-start flex-col border w-[90%] mx-auto  max-w-[50rem]">
      <h1 className="text-1xl text-muted-foreground font-bold my-2">
        Search results for: "{searchParams.get("key")}"
      </h1>
      <Tabs defaultValue="posts" className="w-full  ">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="people">People</TabsTrigger>
          <TabsTrigger value="posts">Posts</TabsTrigger>
        </TabsList>
        <TabsContent
          className="w-full mx-auto mt-4 max-w-[40rem] space-y-4"
          value="people"
        >
          <UsersList  user={user} />
        </TabsContent>
        <TabsContent className="mt-4" value="posts">
          <PostList
            search={searchParams.get("key") || undefined}
            user={user}
            initialPosts={posts}
          />
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default SearchResults;
