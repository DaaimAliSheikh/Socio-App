import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Progress } from "@/components/ui/progress";
import { type CarouselApi } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

import { useEffect, useState } from "react";

const viewDurationSeconds = 6;

const autoplay = Autoplay({
  delay: viewDurationSeconds * 1000,
  stopOnInteraction: false,
});

export function StoryView() {
  const [api, setApi] = useState<CarouselApi>();
  const [progressValue, setProgressValue] = useState(0);
  const [toggle, setToggle] = useState(false);

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
        <CarouselItem>
          <div className="p-1">
            <Card>
              <CardContent className="flex aspect-square items-center justify-center p-6">
                bruh
              </CardContent>
            </Card>
          </div>
        </CarouselItem>
        <CarouselItem>
          <div className="p-1">
            <Card>
              <CardContent className="flex aspect-square items-center justify-center p-6">
                meh
              </CardContent>
            </Card>
          </div>
        </CarouselItem>
        <CarouselItem>
          <div className="p-1">
            <Card>
              <CardContent className="flex aspect-square items-center justify-center p-6">
                guh
              </CardContent>
            </Card>
          </div>
        </CarouselItem>
      </CarouselContent>
      <Progress value={progressValue} />

      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
