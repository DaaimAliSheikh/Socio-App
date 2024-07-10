"use client";
import { useSearchParams } from "next/navigation";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "./ui/badge";
import { UserRoundPlus, Users } from "lucide-react";

const arr = [
  {
    name: "ada",
    description: "adsdawdwadsawdwadwadwadwadwadadadawdrrbrtbrbrtbadsdddddddddddddddddddddddddddddddddddddddddddddddd",
  },
];

const SearchComponent = () => {
  const searchParams = useSearchParams();
  const isFriend = true;

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
        <TabsContent value="people">
          {arr.map((person: any) => {
            return (
              <Card className="flex justify-between w-full items-center hover:bg-secondary hover:cursor-pointer ">
                <div className="flex  overflow-hidden">
                  <Avatar className=" m-4 h-14 w-14 border-2">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div
                    className={
                      " ml-2 flex flex-col w-[70%] md:w-[80%]  justify-center "
                    }
                  >
                    <h2
                      className={
                        "justify-center text-2xl font-bold overflow-hidden  text-ellipsis"
                      }
                    >
                      {person.name}
                    </h2>

                    <p className="text-sm text-muted-foreground overflow-hidden  text-ellipsis">
                      {person?.description}
                    </p>
                  </div>
                </div>
                {!isFriend ? (
                  <Badge variant="secondary" className="mr-4">
                    <p className="text-xs flex items-center gap-2">
                      <Users />
                      Friends
                    </p>
                  </Badge>
                ) : (
                  <Badge className="mr-4">
                    <p className="text-xs flex items-center whitespace-nowrap gap-2">
                      <UserRoundPlus /> Add Friend
                    </p>
                  </Badge>
                )}
              </Card>
            );
          })}
        </TabsContent>
        <TabsContent value="posts">Change your password here.</TabsContent>
      </Tabs>
    </main>
  );
};

export default SearchComponent;
