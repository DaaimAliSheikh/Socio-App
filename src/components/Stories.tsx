"use client";
import React, { useCallback, useEffect, useOptimistic } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NewStoryForm from "./NewStoryForm";
import { StoryView } from "./StoryView";
import { User } from "@prisma/client";
import generateInitials from "@/lib/generateInitials";
import { StoryItem } from "@/lib/types";
import Image from "next/image";

const Stories = ({ user, stories }: { user: User; stories: StoryItem[] }) => {
  return (
    <>
      <Card className=" w-full mb-4 shadow-sm py-2 border rounded-lg">
        <Carousel className="w-[82%]  mx-auto">
          <CarouselContent>
            {/* add story */}
            {stories[0]?.user.id === user.id || (
              <Dialog>
                <DialogTrigger asChild>
                  <CarouselItem className=" pr-1 basis-1/3  md:basis-1/5 h-[10rem]  active:cursor-grabbing hover:cursor-grab">
                    <div className="h-full relative overflow-hidden rounded-lg hover:border-foreground border-2 ">
                      <div className="h-1/2 ">
                        <Avatar className="absolute h-20 w-20 top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <AvatarImage src={ "https://ik.imagekit.io/vmkz9ivsg4" + user?.image} />
                          <AvatarFallback>
                            {generateInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                      </div>

                      <div className="bg-secondary relative h-[50%] flex items-start justify-center font-bold text-sm text-foreground">
                        <p className="pt-8 text-xs">Add a story</p>
                      </div>
                      <div className="bg-primary h-10 w-10 border-4 flex items-center justify-center rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ">
                        <Plus size={20} />
                      </div>
                    </div>
                  </CarouselItem>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>New Story</DialogTitle>
                    <DialogDescription>
                      Show your friends what you are up to!
                    </DialogDescription>
                  </DialogHeader>
                  <NewStoryForm userId={user.id} />
                </DialogContent>
              </Dialog>
            )}
            {/* return*/}

            {/* friend's stories */}
            {stories.map((story, index) => {
              return (
                story && (
                  <Dialog key={index}>
                    <DialogTrigger asChild>
                      <CarouselItem
                        key={index}
                        className=" pr-1 basis-1/3 relative md:basis-1/5 h-[10rem]  active:cursor-grabbing hover:cursor-grab"
                      >
                        <div className="h-full hover:border-foreground border-2 bg-secondary relative  rounded-lg">
                          <Image
                            className="object-cover rounded-md"
                            alt="story"
                            fill
                            src={story.imagePath || ""}
                          ></Image>
                          {index === 0 && stories[0]?.user.id === user.id ? (
                            <div className="bg-primary w-full rounded-b-sm absolute top-3/4 h-[25%] flex items-start justify-center font-bold text-sm text-foreground">
                              <p className="pt-3 text-xs">your story</p>
                            </div>
                          ) : null}
                        </div>

                        <Avatar className="absolute top-0 w-10 h-10 ml-2 mt-2 border-2">
                        <AvatarImage src={ "https://ik.imagekit.io/vmkz9ivsg4" + user?.image} />
                          <AvatarFallback>
                            {generateInitials(story.user.name)}
                          </AvatarFallback>
                        </Avatar>
                      </CarouselItem>
                    </DialogTrigger>
                    <DialogContent className="flex w-[90%] max-w-[40rem] border-none flex-col items-center justify-center  ">
                      <DialogHeader>
                        <DialogTitle className="flex w-full -ml-8 items-center ">
                          Stories
                        </DialogTitle>
                      </DialogHeader>
                      <StoryView user={user} stories={stories} />
                    </DialogContent>
                  </Dialog>
                )
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="md:flex hidden" />

          <CarouselNext className="md:flex hidden" />
        </Carousel>
      </Card>
    </>
  );
};

export default Stories;
