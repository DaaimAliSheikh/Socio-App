import { Card } from "@/components/ui/card";
import Image from "next/image";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import NewPost from "@/components/NewPost";
import PostList from "@/components/PostList";

const ProfilePage = () => {
  return (
    <div className="flex-grow flex flex-col  max-w-[40rem] mx-auto w-[90%] mt-2 ">
      <Card className="w-full flex flex-col ">
        <div className="relative">
          <Image
            className="w-full border object-cover"
            width={100}
            height={50}
            sizes="100vw"
            src="https://github.com/shadcn.png"
            alt={"cover image"}
          ></Image>
          <Avatar
            className={`absolute top-2/3 left-1/2 -translate-y-[60%] -translate-x-1/2  h-28 w-28 border-4 ${"md:-translate-y-[40%]"}`}
          >
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center  pt-10">
            <div className="flex ">
              <h3 className="text-3xl ml-8">Daaim</h3>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={"ghost"}
                    size={"icon"}
                    className="mr-4 px-2 py-1 flex gap-2 ml-2"
                  >
                    <Pencil className="text-muted-foreground " size={18} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-14">
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        <p className="p-6 text-muted-foreground ">
          biography lorem ipsum dolor sdvdsvsvsdvsvsdvdsv vsvsdvda wd aw d awd
          awd awd awd awd awda wdaw dawd aw d awd as dawd sa dw dwa daw dsa
          wdwad awd saw d      biography lorem ipsum dolor sdvdsvsvsdvsvsdvdsv vsvsdvda wd aw d awd
          awd awd awd awd awda wdaw dawd aw d awd as dawd sa dw dwa daw dsa
          wdwad awd saw d      biography lorem ipsum dolor sdvdsvsvsdvsvsdvdsv vsvsdvda wd aw d awd
          awd awd awd awd awda wdaw dawd aw d awd as dawd sa dw dwa daw dsa
          wdwad awd saw d 
        </p>
      </Card>
      <h2 className="text-2xl text-start text-muted-foreground font-bold mt-4 mb-2">
        Your posts
      </h2>
      <NewPost />
      <PostList />
    </div>
  );
};

export default ProfilePage;
