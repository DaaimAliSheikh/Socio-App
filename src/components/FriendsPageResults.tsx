"use client";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { User } from "@prisma/client";

import UsersList from "./UsersList";

const FriendsPageResults = ({ user }: { user: User }) => {
  const [value, setValue] = useState<string>("friends");

  return (
    <main className="flex p-2 border-none shadow-none items-start flex-col border w-[90%] mx-auto  max-w-[50rem]">
      <h1 className="text-1xl text-muted-foreground font-bold my-2">
        {value === "friends"
          ? "Your friends"
          : value === "friendrequests"
          ? "Friend requests received"
          : "People you have blocked"}
      </h1>
      <Tabs
        value={value}
        onValueChange={setValue}
        defaultValue="friends"
        className="w-full  "
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="friends">Friends</TabsTrigger>
          <TabsTrigger value="friendrequests">Requests</TabsTrigger>
          <TabsTrigger value="blocked">Blocked</TabsTrigger>
        </TabsList>
        <TabsContent
          className="w-full mx-auto mt-4 max-w-[40rem] space-y-4"
          value="friends"
        >
          <UsersList user={user} onlyFriends={true} />
        </TabsContent>
        <TabsContent className="mt-4" value="friendrequests">
          <UsersList user={user} onlyRequests={true} />
        </TabsContent>
        <TabsContent className="mt-4" value="blocked">
          <UsersList user={user} onlyBlocked={true} />
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default FriendsPageResults;
