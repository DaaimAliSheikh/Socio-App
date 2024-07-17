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

import { useEffect, useState } from "react";
import { StoryItem } from "@/lib/types";
import getTimeAgo from "@/lib/getTimeAgo";
import generateInitials from "@/lib/generateInitials";
import { Button } from "./ui/button";
import { LoaderCircle, Trash2 } from "lucide-react";
import deleteStory from "@/actions/deleteStory";
import { User } from "@prisma/client";
import Image from "next/image";
import { redirect, useRouter } from "next/navigation";
import { Card } from "./ui/card";
import { useToast } from "./ui/use-toast";

const viewDurationSeconds = 6;

const autoplay = Autoplay({
  delay: viewDurationSeconds * 1000,
  stopOnInteraction: false,
});

export function StoryView({
  stories,
  user,
}: {
  stories: StoryItem[];
  user: User;
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [progressValue, setProgressValue] = useState(0);
  const [toggle, setToggle] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const timer = setInterval(() => {
      setProgressValue((prev) => {
        console.log(prev);

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

    api.on("select", () => {
      setProgressValue(0);
      setToggle((prev) => !prev);
      autoplay.reset();
    });
  }, [api]);
  return (
    <Carousel
      setApi={setApi}
      className="w-full  max-w-[30rem] active:cursor-grabbing hover:cursor-grab"
      plugins={[autoplay]}
    >
      <CarouselContent>
        {stories.map((story, index) => (
          <CarouselItem key={index} className="flex flex-col max-h-[85vh]">
            <Card>
              <div className="flex w-full p-2 items-center justify-between">
                <div
                  className="flex items-center"
                  onClick={() => router.push(`/profile/${story.user.id}`)}
                >
                  <Avatar className=" w-10 h-10 mr-2 border-2">
                    <AvatarImage src={story.user.image || ""} />
                    <AvatarFallback>
                      {generateInitials(story.user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p>{story.user.name}</p>
                    <p className="text-xs font-thin text-muted-foreground text-start">
                      {getTimeAgo(story.createdAt)}
                    </p>
                  </div>
                </div>
                {story.user.id === user.id && (
                  <Button
                    size={"icon"}
                    className="w-8 h-8"
                    disabled={isDeleting}
                    variant={"outline"}
                    onClick={async () => {
                      setIsDeleting(true);
                      await deleteStory(story.id);
                      router.refresh();
                      setIsDeleting(false);
                      toast({
                        duration: 3000,
                        description: "Story deleted successfully",
                      });
                    }}
                  >
                    {isDeleting ? (
                      <LoaderCircle className="animate-spin" size={20} />
                    ) : (
                      <Trash2 size={20} />
                    )}
                  </Button>
                )}
              </div>
              <Image
                className=" w-full object-cover px-4 "
                height={300}
                width={200}
                alt="story image"
                sizes="100vw"
                src={story.imagePath}
              ></Image>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <Progress className="w-[98%] mt-1 mx-auto" value={progressValue} />

      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
