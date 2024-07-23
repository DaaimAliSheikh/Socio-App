import { Card } from "@/components/ui/card";
import Image from "next/image";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Camera, Pencil } from "lucide-react";
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
import getUserById from "@/lib/getUserById";
import { db } from "@/db/db";
import { PostItem } from "@/lib/types";
import generateInitials from "@/lib/generateInitials";
import { auth } from "@/auth";
import ProfileRelationButtons from "@/components/ProfileRelationButtons";
import getUserRelation from "@/actions/getUserRelation";
import getFriendRequest from "@/actions/getFriendRequest";
import { User } from "@prisma/client";
import noUserSvg from "./../../../../public/user-not-found.svg";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

interface UserWithRelation extends User {
  relation?: string;
  friendRequestSent?: boolean;
  friendRequestReceived?: boolean;
}

const ProfilePage = async ({
  params: { userId },
}: {
  params: { userId: string };
}) => {
  const session = await auth();
  const currentUser = await getUserById(session?.user?.id);
  const user = await getUserById(userId);

  if (!user || !currentUser) return null;

  ///redirect
  if ((await getUserRelation(user.id, currentUser.id)) === "BLOCKED" || !user)
    return (
      <>
        <Image
          className="mt-20 mx-auto"
          src={noUserSvg}
          alt="no user"
          width={200}
          height={200}
        />
        <p className="text-center text-muted-foreground text-md p-4">
          User not found
        </p>
      </>
    );

  const modifiedUser: UserWithRelation = user;

  modifiedUser.relation = await getUserRelation(
    modifiedUser.id,
    currentUser.id
  );
  modifiedUser.friendRequestSent = !!(await getFriendRequest(
    currentUser.id,
    modifiedUser.id,
    true
  ));
  modifiedUser.friendRequestReceived = !!(await getFriendRequest(
    currentUser.id,
    modifiedUser.id
  ));
  const posts: PostItem[] = await db.post.findMany({
    where: {
      authorId: userId,
    },
    include: {
      author: { select: { id: true, name: true, image: true } },
      comments: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="flex-grow flex flex-col  max-w-[40rem] mx-auto w-[95%] mt-2 ">
      <Card className="w-full flex flex-col ">
        <div className="relative">
          <Dialog>
            <DialogTrigger asChild>
              {user.coverImage ? (
                <Image
                  className="w-full aspect-video  object-cover rounded-md border hover:cursor-pointer"
                  width={100}
                  height={100}
                  sizes="100vw"
                  src={user.coverImage || ""}
                  alt={"cover image"}
                ></Image>
              ) : (
                <div className="w-full aspect-video border text-muted-foreground flex items-center flex-col justify-center rounded-md  hover:cursor-pointer">
                  <Camera size={50} />
                  <p>No cover image uploaded yet</p>
                </div>
              )}
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cover Image</DialogTitle>
              </DialogHeader>
              {user.coverImage ? (
                <ImageView imagePaths={[user.coverImage]} />
              ) : (
                <div className="w-full aspect-square  text-muted-foreground flex items-center flex-col justify-center rounded-md  hover:cursor-pointer">
                  <Camera size={50} />
                  <p>No cover image uploaded yet</p>
                </div>
              )}
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Avatar
                className={`absolute hover:cursor-pointer ${
                  user.id === currentUser.id
                    ? "top-[56%] md:top-[60%]"
                    : "top-[65%] "
                } left-1/2 -translate-y-[60%] -translate-x-1/2  md:h-28 md:w-28 h-20 w-20 border-4 ${"md:-translate-y-[40%]"}`}
              >
                <AvatarImage
                  src={
                    (user?.image?.startsWith("/socio")
                      ? "https://ik.imagekit.io/vmkz9ivsg4"
                      : "") + user?.image
                  }
                />
                <AvatarFallback className="md:text-4xl text-2xl">
                  {generateInitials(user.name)}
                </AvatarFallback>
              </Avatar>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Profile Image</DialogTitle>
              </DialogHeader>
              {user.image ? (
                <ImageView imagePaths={[user.image]} />
              ) : (
                <div className="w-full aspect-square  text-muted-foreground flex items-center flex-col justify-center rounded-md  hover:cursor-pointer">
                  <Camera size={50} />
                  <p>No profile image uploaded yet</p>
                </div>
              )}
            </DialogContent>
          </Dialog>

          <div className="flex   flex-col gap-2 items-center leading-2 pt-10">
            <h3
              className={` w-full md:text-4xl text-lg text-center text-ellipsis overflow-hidden whitespace-nowrap `}
            >
              {user.name}
            </h3>
            {user.id == currentUser.id && (
              <Dialog>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DialogTrigger asChild>
                        <Button
                          variant={"outline"}
                          size={"sm"}
                          className="flex gap-2 text-xs md:text-sm"
                        >
                          Edit Profile
                          <Pencil
                            className="text-muted-foreground "
                            size={16}
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
                  <EditProfileForm user={currentUser} />
                </DialogContent>
              </Dialog>
            )}
            <h5 className="text-xs md:text-sm bg-background py-1 px-2 rounded-lg hover:underline">
              {user.email}
            </h5>
          </div>
        </div>
        <p className="pb-6 pt-4  px-10 text-sm text-muted-foreground leading-5 text-center">
          {user.bio}
        </p>
        {currentUser.id === user.id || (
          <ProfileRelationButtons
            modifiedUser={modifiedUser}
            currentUser={currentUser}
          />
        )}
      </Card>
      <h2 className="text-lg text-start text-muted-foreground font-bold mt-4 mb-2">
        {user.id === currentUser.id ? "Your" : `${user.name}'s`} posts
      </h2>
      {currentUser.id === user.id && <NewPost user={user} />}
      <PostList user={currentUser} initialPosts={posts} />
    </div>
  );
};

export default ProfilePage;
