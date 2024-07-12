import React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

const ImageView = ({ images }: { images: string[] }) => {
  return (
    <Carousel className=" w-[85%] mx-auto">
      <CarouselContent>
        {images.map((img: string) => {
          return (
            <CarouselItem className="w-full">
              <Image
                alt="post image"
                src={"https://github.com/shadcn.png"}
                height={200}
                width={200}
                sizes="100vw"
                className="object-cover w-full rounded-md  hover:cursor-pointer"
              ></Image>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      {images.length > 1 ? (
        <>
          <CarouselPrevious />
          <CarouselNext />
        </>
      ) : null}
    </Carousel>
  );
};

export default ImageView;
