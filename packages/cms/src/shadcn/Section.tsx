"use client";

import { storyblokEditable, StoryblokComponent } from "@storyblok/react";
import { cn } from "@repo/ui";
import type { SbBlokData } from "@storyblok/react";

export interface ShadcnSectionBlok extends SbBlokData {
  content?: SbBlokData[];
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  background?: "default" | "muted" | "primary" | "secondary";
  max_width?: "sm" | "md" | "lg" | "xl" | "full";
  id?: string;
}

const paddingMap = {
  none: "",
  sm: "py-4",
  md: "py-8",
  lg: "py-16",
  xl: "py-24",
};

const backgroundMap = {
  default: "bg-background",
  muted: "bg-muted",
  primary: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
};

const maxWidthMap = {
  sm: "max-w-(--breakpoint-sm)",
  md: "max-w-(--breakpoint-md)",
  lg: "max-w-(--breakpoint-lg)",
  xl: "max-w-(--breakpoint-xl)",
  full: "max-w-full",
};

export function ShadcnSection({ blok }: { blok: ShadcnSectionBlok }) {
  const padding = paddingMap[blok.padding || "md"];
  const background = backgroundMap[blok.background || "default"];
  const maxWidth = maxWidthMap[blok.max_width || "xl"];

  return (
    <section
      {...storyblokEditable(blok)}
      id={blok.id}
      className={cn(padding, background, "w-full")}
    >
      <div className={cn(maxWidth, "mx-auto px-4")}>
        {blok.content?.map((nestedBlok) => (
          <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
        ))}
      </div>
    </section>
  );
}
