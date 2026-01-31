"use client";

import { storyblokEditable } from "@storyblok/react";
import { Separator, cn } from "@repo/ui";
import type { SbBlokData } from "@storyblok/react";
import { buildStyleClasses, type FlexBreakpointOptionsBlok } from "../styles";

export interface ShadcnSeparatorBlok extends SbBlokData {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
  styles?: FlexBreakpointOptionsBlok[];
}

export function ShadcnSeparator({ blok }: { blok: ShadcnSeparatorBlok }) {
  return (
    <Separator
      {...storyblokEditable(blok)}
      orientation={blok.orientation || "horizontal"}
      decorative={blok.decorative ?? true}
      className={cn(
        blok.orientation === "vertical" ? "h-full" : "my-4",
        ...buildStyleClasses(blok.styles),
      )}
    />
  );
}
