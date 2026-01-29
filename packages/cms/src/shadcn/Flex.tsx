"use client";

import { storyblokEditable, StoryblokComponent } from "@storyblok/react";
import { cn } from "@repo/ui";
import type { SbBlokData } from "@storyblok/react";

export interface ShadcnFlexBlok extends SbBlokData {
  items?: SbBlokData[];
  direction?: "row" | "column" | "row-reverse" | "column-reverse";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  gap?: "none" | "sm" | "md" | "lg";
  wrap?: boolean;
}

const directionMap = {
  row: "flex-row",
  column: "flex-col",
  "row-reverse": "flex-row-reverse",
  "column-reverse": "flex-col-reverse",
};

const justifyMap = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
};

const alignMap = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline",
};

const gapMap = {
  none: "gap-0",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-8",
};

export function ShadcnFlex({ blok }: { blok: ShadcnFlexBlok }) {
  return (
    <div
      {...storyblokEditable(blok)}
      className={cn(
        "flex",
        directionMap[blok.direction || "row"],
        justifyMap[blok.justify || "start"],
        alignMap[blok.align || "stretch"],
        gapMap[blok.gap || "md"],
        blok.wrap && "flex-wrap",
      )}
    >
      {blok.items?.map((nestedBlok) => (
        <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </div>
  );
}
