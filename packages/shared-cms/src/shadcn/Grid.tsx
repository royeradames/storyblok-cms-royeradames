"use client";

import { storyblokEditable, StoryblokComponent } from "@storyblok/react";
import { cn } from "@repo/ui";
import type { SbBlokData } from "@storyblok/react";
import { buildStyleClasses, type StylesBreakpointOptionsBlok } from "../styles";

export interface ShadcnGridBlok extends SbBlokData {
  items?: SbBlokData[];
  columns?: "1" | "2" | "3" | "4" | "5" | "6";
  columns_mobile?: "1" | "2";
  gap?: "none" | "sm" | "md" | "lg";
  styles?: StylesBreakpointOptionsBlok[];
}

const columnsMap = {
  "1": "md:grid-cols-1",
  "2": "md:grid-cols-2",
  "3": "md:grid-cols-3",
  "4": "md:grid-cols-4",
  "5": "md:grid-cols-5",
  "6": "md:grid-cols-6",
};

const columnsMobileMap = {
  "1": "grid-cols-1",
  "2": "grid-cols-2",
};

const gapMap = {
  none: "gap-0",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-8",
};

export function ShadcnGrid({ blok }: { blok: ShadcnGridBlok }) {
  const columns = columnsMap[blok.columns || "3"];
  const columnsMobile = columnsMobileMap[blok.columns_mobile || "1"];
  const gap = gapMap[blok.gap || "md"];

  return (
    <div
      {...storyblokEditable(blok)}
      className={cn("grid", columnsMobile, columns, gap, ...buildStyleClasses(blok.styles))}
    >
      {blok.items?.map((nestedBlok) => (
        <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </div>
  );
}
