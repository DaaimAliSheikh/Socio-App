"use client";
import React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { Plus } from "lucide-react";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const StoryItems: string[] = ["hel", "awda", "vsdv", "awdawd"];

const Stories = () => {
  return (
    <>
      <Card className=" w-full my-4 shadow-sm py-2 border rounded-lg">
        <Carousel className="w-[82%]  mx-auto">
          <CarouselContent>
            {/* add story */}
            <CarouselItem className=" pr-1 basis-1/3  md:basis-1/5 h-[10rem]  active:cursor-grabbing hover:cursor-grab">
              <div className="h-full relative overflow-hidden rounded-lg">
                <div className=" h-[50%] "></div>
                <div className="bg-secondary h-[50%] text-center font-bold text-sm text-foreground">
                  <p className="pt-[2rem] text-xs">Add to your story</p>
                </div>
                <div className="bg-primary h-10 w-10 border-4 flex items-center justify-center rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ">
                  <Plus size={20} />
                </div>
              </div>
            </CarouselItem>

            {/* user's own story */}
            <CarouselItem className=" pr-1 basis-1/3 relative md:basis-1/5 h-[10rem]  active:cursor-grabbing hover:cursor-grab">
              <div className="h-full bg-secondary relative  rounded-lg"></div>
              <Avatar className="absolute top-0 w-10 h-10 ml-2 mt-2 border-2">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </CarouselItem>

            {/* friend's stories */}
            {StoryItems.map((story) => {
              return (
                <CarouselItem
                  key={story}
                  className=" pr-1 basis-1/3 relative md:basis-1/5 h-[10rem]  active:cursor-grabbing hover:cursor-grab"
                >
                  <div className="h-full bg-secondary relative  rounded-lg"></div>
                  <Avatar className="absolute top-0 w-10 h-10 ml-2 mt-2 border-2">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </CarouselItem>
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
