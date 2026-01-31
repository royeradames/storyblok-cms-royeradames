"use client";

import { storyblokEditable, StoryblokComponent } from "@storyblok/react";
import { cn } from "@repo/ui";
import type { SbBlokData } from "@storyblok/react";
import {
  directionMap,
  justifyMap,
  alignMap,
  gapMap,
  widthMap,
  heightMap,
  minWidthMap,
  maxWidthMap,
  minHeightMap,
  maxHeightMap,
} from "./maps";

const BREAKPOINT_ORDER = ["base", "sm", "md", "lg", "xl", "2xl"] as const;
type BreakpointKey = (typeof BREAKPOINT_ORDER)[number];

export interface FlexBreakpointOptionsBlok extends SbBlokData {
  breakpoint?: BreakpointKey;
  direction?: keyof typeof directionMap;
  justify?: keyof typeof justifyMap;
  align?: keyof typeof alignMap;
  gap?: keyof typeof gapMap;
  wrap?: boolean;
  width?: keyof typeof widthMap;
  height?: keyof typeof heightMap;
  min_width?: keyof typeof minWidthMap;
  max_width?: keyof typeof maxWidthMap;
  min_height?: keyof typeof minHeightMap;
  max_height?: keyof typeof maxHeightMap;
}

export interface ShadcnFlexBlok extends SbBlokData {
  items?: SbBlokData[];
  options?: FlexBreakpointOptionsBlok[];
}

function getBreakpointPrefix(breakpoint: BreakpointKey): string {
  return breakpoint === "base" ? "" : `${breakpoint}:`;
}

function buildClassesFromOptions(
  options: FlexBreakpointOptionsBlok[]
): string[] {
  const sorted = [...options].sort(
    (a, b) =>
      BREAKPOINT_ORDER.indexOf((a.breakpoint ?? "base") as BreakpointKey) -
      BREAKPOINT_ORDER.indexOf((b.breakpoint ?? "base") as BreakpointKey)
  );

  const classes: string[] = [];

  for (const opt of sorted) {
    const prefix = getBreakpointPrefix(
      (opt.breakpoint ?? "base") as BreakpointKey
    );

    if (opt.direction && directionMap[opt.direction])
      classes.push(prefix + directionMap[opt.direction]);
    if (opt.justify && justifyMap[opt.justify])
      classes.push(prefix + justifyMap[opt.justify]);
    if (opt.align && alignMap[opt.align])
      classes.push(prefix + alignMap[opt.align]);
    if (opt.gap && gapMap[opt.gap]) classes.push(prefix + gapMap[opt.gap]);
    if (opt.wrap) classes.push(prefix + "flex-wrap");
    if (opt.width && widthMap[opt.width])
      classes.push(prefix + widthMap[opt.width]);
    if (opt.height && heightMap[opt.height])
      classes.push(prefix + heightMap[opt.height]);
    if (opt.min_width && minWidthMap[opt.min_width])
      classes.push(prefix + minWidthMap[opt.min_width]);
    if (opt.max_width && maxWidthMap[opt.max_width])
      classes.push(prefix + maxWidthMap[opt.max_width]);
    if (opt.min_height && minHeightMap[opt.min_height])
      classes.push(prefix + minHeightMap[opt.min_height]);
    if (opt.max_height && maxHeightMap[opt.max_height])
      classes.push(prefix + maxHeightMap[opt.max_height]);
  }

  return classes;
}

export function ShadcnFlex({ blok }: { blok: ShadcnFlexBlok }) {
  const hasOptions = blok.options && blok.options.length > 0;

  const optionClasses = hasOptions
    ? buildClassesFromOptions(blok.options as FlexBreakpointOptionsBlok[])
    : [];

  const fallbackClasses = !hasOptions
    ? ["flex-row", "justify-start", "items-stretch"]
    : [];

  return (
    <div
      {...storyblokEditable(blok)}
      className={cn(
        "flex",
        ...fallbackClasses,
        ...optionClasses,
        (blok as SbBlokData & { class_name?: string }).class_name
      )}
    >
      {blok.items?.map((nestedBlok) => (
        <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </div>
  );
}
