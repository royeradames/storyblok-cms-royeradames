"use client";

import { storyblokEditable } from "@storyblok/react";
import { Badge, cn } from "@repo/ui";
import type { SbBlokData } from "@storyblok/react";
import { buildStyleClasses, type FlexBreakpointOptionsBlok } from "../styles";

export interface ShadcnBadgeBlok extends SbBlokData {
  text: string;
  variant?: "default" | "secondary" | "destructive" | "outline";
  styles?: FlexBreakpointOptionsBlok[];
}

export function ShadcnBadge({ blok }: { blok: ShadcnBadgeBlok }) {
  return (
    <Badge
    {...storyblokEditable(blok)}
    variant={blok.variant || "default"}
    className={cn(...buildStyleClasses(blok.styles))}
  >
      {blok.text}
    </Badge>
  );
}
