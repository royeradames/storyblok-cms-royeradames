"use client";

import { storyblokEditable } from "@storyblok/react";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui";
import type { SbBlokData } from "@storyblok/react";

export interface ShadcnAvatarBlok extends SbBlokData {
  image?: {
    filename: string;
    alt?: string;
  };
  fallback?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeMap = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
  xl: "h-16 w-16",
};

export function ShadcnAvatar({ blok }: { blok: ShadcnAvatarBlok }) {
  const size = sizeMap[blok.size || "md"];

  // Generate fallback from initials if not provided
  const fallback =
    blok.fallback || blok.image?.alt?.charAt(0)?.toUpperCase() || "?";

  return (
    <Avatar {...storyblokEditable(blok)} className={size}>
      {blok.image?.filename && (
        <AvatarImage src={blok.image.filename} alt={blok.image.alt || ""} />
      )}
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
}
