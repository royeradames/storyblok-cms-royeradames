"use client";

import { storyblokEditable, StoryblokComponent } from "@storyblok/react";
import { cn } from "@repo/ui";
import type { SbBlokData } from "@storyblok/react";
import {
  buildStyleClasses,
  type FlexBreakpointOptionsBlok,
} from "../../styles";

export type { FlexBreakpointOptionsBlok } from "../../styles";

export interface ShadcnFlexBlok extends SbBlokData {
  items?: SbBlokData[];
  styles?: FlexBreakpointOptionsBlok[];
}

export function ShadcnFlex({ blok }: { blok: ShadcnFlexBlok }) {
  const styleClasses = buildStyleClasses(blok.styles);
  const hasStyles = styleClasses.length > 0;
  const fallbackClasses = !hasStyles
    ? ["flex-row", "justify-start", "items-stretch"]
    : [];

  return (
    <div
      {...storyblokEditable(blok)}
      className={cn(
        "flex",
        ...fallbackClasses,
        ...styleClasses,
        (blok as SbBlokData & { class_name?: string }).class_name
      )}
    >
      {blok.items?.map((nestedBlok) => (
        <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </div>
  );
}
