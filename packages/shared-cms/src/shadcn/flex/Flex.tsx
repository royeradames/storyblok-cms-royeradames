"use client";

import { storyblokEditable, StoryblokComponent } from "@storyblok/react";
import { cn } from "@repo/ui";
import type { SbBlokData } from "@storyblok/react";
import {
  directionMap,
  justifyMap,
  alignMap,
  gapMap,
} from "./maps";

export interface ShadcnFlexBlok extends SbBlokData {
  items?: SbBlokData[];
  direction?: keyof typeof directionMap;
  justify?: keyof typeof justifyMap;
  align?: keyof typeof alignMap;
  gap?: keyof typeof gapMap;
  wrap?: boolean;
}

export function ShadcnFlex({ blok }: { blok: ShadcnFlexBlok }) {
  return (
    <div
      {...storyblokEditable(blok)}
      className={cn(
        "flex",
        blok.direction ? directionMap[blok.direction] : "flex-row",
        blok.justify ? justifyMap[blok.justify] : "justify-start",
        blok.align ? alignMap[blok.align] : "items-stretch",
        blok.gap ? gapMap[blok.gap] : undefined,
        blok.wrap && "flex-wrap",
        blok.class_name,
      )}
    >
      {blok.items?.map((nestedBlok) => (
        <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </div>
  );
}
