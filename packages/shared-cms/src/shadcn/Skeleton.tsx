"use client";

import { storyblokEditable } from "@storyblok/react";
import { Skeleton, cn } from "@repo/ui";
import type { SbBlokData } from "@storyblok/react";
import { buildStyleClasses, type StylesBreakpointOptionsBlok } from "../styles";

export interface ShadcnSkeletonBlok extends SbBlokData {
  variant?: "text" | "circular" | "rectangular" | "card";
  width?: string;
  height?: string;
  lines?: number;
  styles?: StylesBreakpointOptionsBlok[];
}

export function ShadcnSkeleton({ blok }: { blok: ShadcnSkeletonBlok }) {
  const { variant = "rectangular", width, height, lines = 1 } = blok;

  if (variant === "text") {
    return (
      <div
        {...storyblokEditable(blok)}
        className={cn("space-y-2", ...buildStyleClasses(blok.styles))}
      >
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton
            key={i}
            className={cn("h-4", i === lines - 1 ? "w-3/4" : "w-full")}
            style={{ width: i === lines - 1 ? undefined : width }}
          />
        ))}
      </div>
    );
  }

  if (variant === "circular") {
    return (
      <Skeleton
        {...storyblokEditable(blok)}
        className={cn("rounded-full", ...buildStyleClasses(blok.styles))}
        style={{ width: width || "40px", height: height || "40px" }}
      />
    );
  }

  if (variant === "card") {
    return (
      <div
        {...storyblokEditable(blok)}
        className={cn("space-y-4", ...buildStyleClasses(blok.styles))}
      >
        <Skeleton className="h-48 w-full rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    );
  }

  return (
    <Skeleton
      {...storyblokEditable(blok)}
      className={cn(...buildStyleClasses(blok.styles))}
      style={{ width: width || "100%", height: height || "20px" }}
    />
  );
}
