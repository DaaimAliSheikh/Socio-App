"use client";
import React from "react";

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
import Image from "next/image";
import { Plus } from "lucide-react";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NewStoryForm from "./NewStoryForm";
import { StoryView } from "./StoryView";

const StoryItems: string[] = ["hel", "awda", "vsdv", "awdawd"];

const Stories = () => {
  return (
    <>
      <Card className=" w-full my-4 shadow-sm py-2 border rounded-lg">
        <Carousel className="w-[82%]  mx-auto">
          <CarouselContent>
            {/* add story */}

            <Dialog>
              <DialogTrigger asChild>
                <CarouselItem className=" pr-1 basis-1/3  md:basis-1/5 h-[10rem]  active:cursor-grabbing hover:cursor-grab">
                  <div className="h-full relative overflow-hidden rounded-lg hover:border-foreground border-2 ">
                    <div className=" h-[70%] ">
                      <img
                        alt={"story profile image"}
                        src={"https://github.com/shadcn.png"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="bg-secondary h-[30%] flex items-start justify-center font-bold text-sm text-foreground">
                      <p className="pt-4 text-xs">Add a story</p>
                    </div>
                    <div className="bg-primary h-10 w-10 border-4 flex items-center justify-center mt-6 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ">
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
                <NewStoryForm />
              </DialogContent>
            </Dialog>

            {/* user's own story */}

            {/* friend's stories */}
            {StoryItems.map((story, index) => {
              return (
                <Dialog key={index}>
                  <DialogTrigger asChild>
                    <CarouselItem
                      key={story}
                      className=" pr-1 basis-1/3 relative md:basis-1/5 h-[10rem]  active:cursor-grabbing hover:cursor-grab"
                    >
                      <div className="h-full hover:border-foreground border-2 bg-secondary relative  rounded-lg"></div>
                      <Avatar className="absolute top-0 w-10 h-10 ml-2 mt-2 border-2">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    </CarouselItem>
                  </DialogTrigger>
                  <DialogContent className="flex w-[90%] max-w-[50rem] border-none flex-col items-center justify-center  bg-transparent ">
                    <DialogHeader>
                      <DialogTitle className="flex w-full -ml-8 items-center ">
                        <Avatar className=" w-10 h-10 mr-2 border-2">
                          <AvatarImage src="https://github.com/shadcn.png" />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div>
                          <p>{"name"}</p>
                          <p className="text-xs font-thin text-muted-foreground text-start">
                            {"time"}
                          </p>
                        </div>
                      </DialogTitle>
                    </DialogHeader>
                    <StoryView />
                  </DialogContent>
                </Dialog>
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
