"use client";

import { storyblokEditable, StoryblokComponent } from "@storyblok/react";
import { AspectRatio, cn } from "@repo/ui";
import type { SbBlokData } from "@storyblok/react";
import { buildStyleClasses, type FlexBreakpointOptionsBlok } from "../styles";

export interface ShadcnAspectRatioBlok extends SbBlokData {
  ratio?: "square" | "video" | "portrait" | "wide" | "custom";
  custom_ratio?: number;
  content?: SbBlokData[];
  styles?: FlexBreakpointOptionsBlok[];
}

const ratioMap = {
  square: 1,
  video: 16 / 9,
  portrait: 3 / 4,
  wide: 21 / 9,
  custom: 1,
};

export function ShadcnAspectRatio({ blok }: { blok: ShadcnAspectRatioBlok }) {
  const ratio =
    blok.ratio === "custom" && blok.custom_ratio
      ? blok.custom_ratio
      : ratioMap[blok.ratio || "video"];

  return (
    <AspectRatio
      {...storyblokEditable(blok)}
      ratio={ratio}
      className={cn(...buildStyleClasses(blok.styles))}
    >
      {blok.content?.map((nestedBlok) => (
        <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </AspectRatio>
  );
}
