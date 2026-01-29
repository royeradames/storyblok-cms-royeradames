"use client";

import { storyblokEditable } from "@storyblok/react";
import type { SbBlokData } from "@storyblok/react";

/**
 * Teaser Component
 *
 * Storyblok's default teaser component.
 * Displays a simple headline.
 */
export interface TeaserBlok extends SbBlokData {
  headline?: string;
}

export function Teaser({ blok }: { blok: TeaserBlok }) {
  return (
    <div
      {...storyblokEditable(blok)}
      className="py-16 px-4 text-center bg-gradient-to-r from-primary/10 to-secondary/10"
    >
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
        {blok.headline || "Welcome"}
      </h1>
    </div>
  );
}
