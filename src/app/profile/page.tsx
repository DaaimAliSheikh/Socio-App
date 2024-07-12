import { Card } from "@/components/ui/card";
import Image from "next/image";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import NewPost from "@/components/NewPost";
import PostList from "@/components/PostList";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ImageView from "@/components/ImageView";
import EditProfileForm from "@/components/EditProfileForm";

const ProfilePage = () => {
  return (
    <div className="flex-grow flex flex-col  max-w-[40rem] mx-auto w-[90%] mt-2 ">
      <Card className="w-full flex flex-col ">
        <div className="relative">
          <Dialog>
            <DialogTrigger asChild>
              <Image
                className="w-full object-cover rounded-md border hover:cursor-pointer"
                width={100}
                height={50}
                sizes="100vw"
                src="https://github.com/shadcn.png"
                alt={"cover image"}
              ></Image>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cover Image</DialogTitle>
              </DialogHeader>
              <ImageView images={["lol"]} />
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Avatar
                className={`absolute hover:cursor-pointer top-2/3 left-1/2 -translate-y-[60%] -translate-x-1/2  h-28 w-28 border-4 ${"md:-translate-y-[40%]"}`}
              >
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Profile Image</DialogTitle>
              </DialogHeader>
              <ImageView images={["lol"]} />
            </DialogContent>
          </Dialog>

          <div className="flex flex-col items-center leading-2 pt-10">
            <div className="flex ">
              <h3 className="text-3xl ml-8">Daaim</h3>

              <Dialog>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DialogTrigger asChild>
                        <Button
                          variant={"ghost"}
                          size={"icon"}
                          className="h-8 w-8 mr-4 px-2 py-1 flex gap-2 ml-2"
                        >
                          <Pencil
                            className="text-muted-foreground "
                            size={18}
                          />
                        </Button>
                      </DialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edit Profile</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                  </DialogHeader>
                  <EditProfileForm />
                </DialogContent>
              </Dialog>
            </div>
            <h5 className="text-sm bg-background py-1 px-2 rounded-lg hover:underline">
              email@email.com
            </h5>
          </div>
        </div>
        <p className="py-6 px-10 text-muted-foreground text-center">
          biography lorem ipsum dolor sdvdsvsvsdvsvsdvdsv vsvsdvda wd aw d awd
          awd
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
