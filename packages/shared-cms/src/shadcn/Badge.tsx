"use client";

import { storyblokEditable } from "@storyblok/react";
import { Badge } from "@repo/ui";
import type { SbBlokData } from "@storyblok/react";

export interface ShadcnBadgeBlok extends SbBlokData {
  text: string;
  variant?: "default" | "secondary" | "destructive" | "outline";
}

export function ShadcnBadge({ blok }: { blok: ShadcnBadgeBlok }) {
  return (
    <Badge {...storyblokEditable(blok)} variant={blok.variant || "default"}>
      {blok.text}
    </Badge>
  );
}
