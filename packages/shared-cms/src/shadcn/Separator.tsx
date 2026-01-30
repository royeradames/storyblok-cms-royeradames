"use client";

import { storyblokEditable } from "@storyblok/react";
import { Separator } from "@repo/ui";
import type { SbBlokData } from "@storyblok/react";

export interface ShadcnSeparatorBlok extends SbBlokData {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
}

export function ShadcnSeparator({ blok }: { blok: ShadcnSeparatorBlok }) {
  return (
    <Separator
      {...storyblokEditable(blok)}
      orientation={blok.orientation || "horizontal"}
      decorative={blok.decorative ?? true}
      className={blok.orientation === "vertical" ? "h-full" : "my-4"}
    />
  );
}
