"use client";

import { storyblokEditable } from "@storyblok/react";
import { AspectRatio, Skeleton, cn } from "@repo/ui";
import type { SbBlokData } from "@storyblok/react";
import { buildStyleClasses, type FlexBreakpointOptionsBlok } from "../styles";

export interface ShadcnImageBlok extends SbBlokData {
  image: {
    filename: string;
    alt?: string;
    focus?: string;
  };
  aspect_ratio?: "auto" | "square" | "video" | "portrait" | "wide";
  object_fit?: "cover" | "contain" | "fill" | "none";
  rounded?: "none" | "sm" | "md" | "lg" | "full";
  caption?: string;
  styles?: FlexBreakpointOptionsBlok[];
}

const ratioMap = {
  auto: null,
  square: 1,
  video: 16 / 9,
  portrait: 3 / 4,
  wide: 21 / 9,
};

const objectFitMap = {
  cover: "object-cover",
  contain: "object-contain",
  fill: "object-fill",
  none: "object-none",
};

const roundedMap = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
};

export function ShadcnImage({ blok }: { blok: ShadcnImageBlok }) {
  const ratio = ratioMap[blok.aspect_ratio || "auto"];
  const objectFit = objectFitMap[blok.object_fit || "cover"];
  const rounded = roundedMap[blok.rounded || "md"];

  const imageElement = (
    <img
      src={blok.image.filename}
      alt={blok.image.alt || ""}
      className={cn("w-full h-full", objectFit, rounded)}
    />
  );

  const content = ratio ? (
    <AspectRatio ratio={ratio}>{imageElement}</AspectRatio>
  ) : (
    imageElement
  );

  return (
    <figure
      {...storyblokEditable(blok)}
      className={cn(...buildStyleClasses(blok.styles))}
    >
      {content}
      {blok.caption && (
        <figcaption className="mt-2 text-sm text-muted-foreground text-center">
          {blok.caption}
        </figcaption>
      )}
    </figure>
  );
}
