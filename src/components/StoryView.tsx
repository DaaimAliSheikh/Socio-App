import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Progress } from "@/components/ui/progress";
import { type CarouselApi } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

import { useEffect, useMemo, useState } from "react";
import { StoryItem } from "@/lib/types";
import getTimeAgo from "@/lib/getTimeAgo";
import generateInitials from "@/lib/generateInitials";
import { LoaderCircle, Trash2 } from "lucide-react";
import deleteStory from "@/actions/deleteStory";
import { User } from "@prisma/client";
import Image from "next/image";

const viewDurationSeconds = 6;

const autoplay = Autoplay({
  delay: viewDurationSeconds * 1000,
  stopOnInteraction: false,
  // stopOnLastSnap: true,
});

export function StoryView({
  stories,
  user,
  currentIndex = 0,
}: {
  stories: StoryItem[];
  user: User;
  currentIndex: number;
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [progressValue, setProgressValue] = useState(0);
  const [toggle, setToggle] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgressValue((prev) => {
        if (prev >= 100) {
          clearInterval(timer);

          return 100;
        }
        return prev + 100 / (viewDurationSeconds * 10);
      });
    }, 100);
    return () => {
      clearInterval(timer);
    };
  }, [toggle]);

  useEffect(() => {
    if (!api) {
      return;
    }
    api.on("init", () => {
      api.scrollTo(currentIndex, true);
    });

    api.on("select", () => {
      setProgressValue(0);
      setToggle((prev) => !prev);
      autoplay.reset();
    });
  }, [api,currentIndex]);

  const storyCards = useMemo(() => {
    return stories.map((story) => (
      <CarouselItem key={story.id}>
        <div className="flex w-full overflow-hidden  h-[10vh]  p-4 items-center justify-between">
          <div
            className="flex hover:cursor-pointer  items-center overflow-hidden text-ellipsis  w-[95%]"
            onClick={() => (window.location.href = `/profile/${story.user.id}`)}
          >
            <Avatar className=" w-10 h-10 mr-2 border-2">
              <AvatarImage
                src={
                  (story.user.image?.startsWith("/socio")
                    ? "https://ik.imagekit.io/vmkz9ivsg4"
                    : "") + story.user?.image
                }
              />
              <AvatarFallback>
                {generateInitials(story.user.name)}
              </AvatarFallback>
            </Avatar>
            <div className=" w-full overflow-hidden text-ellipsis ">
              <p className="text-sm font-bold w-full  overflow-hidden whitespace-nowrap text-ellipsis">
                {story.user.name}
              </p>
              <p className="text-xs font-thin text-muted-foreground text-start">
                {getTimeAgo(story.createdAt)}
              </p>
            </div>
          </div>
          {story.user.id === user.id && (
            <div
              // size={"icon"}
              className=" border p-2 rounded-md hover:bg-secondary hover:cursor-pointer"
              // disabled={isDeleting}
              // variant={"outline"}
              onClick={async () => {
                setIsDeleting(true);
                await deleteStory(story.id);
                setIsDeleting(false);
                window.location.reload();
              }}
            >
              {isDeleting ? (
                <LoaderCircle className="animate-spin" size={20} />
              ) : (
                <Trash2 size={20} />
              )}
            </div>
          )}
        </div>
        <Image
          className=" w-full h-[70vh] flex-grow  object-contain px-4 "
          height={300}
          width={200}
          alt="story image"
          sizes="100vw"
          src={story.imagePath}
        ></Image>
      </CarouselItem>
    ));
  }, [stories, isDeleting,user.id]);

  return (
    <Carousel
      setApi={setApi}
      className="w-full  max-w-[30rem]  active:cursor-grabbing hover:cursor-grab"
      plugins={[autoplay]}
    >
      <CarouselContent>{storyCards}</CarouselContent>
      <Progress className="w-[98%] mt-1 mx-auto" value={progressValue} />

      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
