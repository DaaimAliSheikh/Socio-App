"use client";
import React, { useEffect } from "react";

import { type CarouselApi } from "@/components/ui/carousel";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

const ImageView = ({
  imagePaths,
  currentIndex = 0,
}: {
  imagePaths: string[];
  currentIndex?: number;
}) => {
  const [api, setApi] = React.useState<CarouselApi>();

  useEffect(() => {
    if (!api) {
      return;
    }

    api.on("init", () => {
      api.scrollTo(currentIndex, true);
    });
  }, [api]);
  return (
    <Carousel setApi={setApi} className=" w-[85%] mx-auto">
      <CarouselContent>
        {imagePaths.map((path: string) => {
          return (
            <CarouselItem className="w-full">
              <Image
                alt="post image"
                src={path}
                height={200}
                width={200}
                sizes="100vw"
                className="object-cover w-full rounded-md  hover:cursor-pointer"
              ></Image>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      {imagePaths.length > 1 ? (
        <>
          <CarouselPrevious />
          <CarouselNext />
        </>
      ) : null}
    </Carousel>
  );
};

export default ImageView;
