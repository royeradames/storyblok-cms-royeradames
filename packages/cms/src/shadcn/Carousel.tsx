"use client";

import { storyblokEditable, StoryblokComponent } from "@storyblok/react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@repo/ui";
import type { SbBlokData } from "@storyblok/react";

export interface ShadcnCarouselBlok extends SbBlokData {
  items?: SbBlokData[];
  show_arrows?: boolean;
  loop?: boolean;
  autoplay?: boolean;
  autoplay_delay?: number;
  orientation?: "horizontal" | "vertical";
  items_per_view?: "1" | "2" | "3" | "4";
}

const itemsPerViewMap = {
  "1": "basis-full",
  "2": "basis-1/2",
  "3": "basis-1/3",
  "4": "basis-1/4",
};

export function ShadcnCarousel({ blok }: { blok: ShadcnCarouselBlok }) {
  const itemBasis = itemsPerViewMap[blok.items_per_view || "1"];

  return (
    <Carousel
      {...storyblokEditable(blok)}
      opts={{
        loop: blok.loop ?? false,
        align: "start",
      }}
      orientation={blok.orientation || "horizontal"}
      className="w-full"
    >
      <CarouselContent>
        {blok.items?.map((item) => (
          <CarouselItem key={item._uid} className={itemBasis}>
            <StoryblokComponent blok={item} />
          </CarouselItem>
        ))}
      </CarouselContent>
      {blok.show_arrows !== false && (
        <>
          <CarouselPrevious />
          <CarouselNext />
        </>
      )}
    </Carousel>
  );
}
