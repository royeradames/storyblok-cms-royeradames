"use client";

import { storyblokEditable, StoryblokComponent } from "@storyblok/react";
import type { SbBlokData } from "@storyblok/react";

/**
 * Grid Component
 *
 * Storyblok's default grid component.
 * Renders columns in a grid layout.
 */
export interface GridBlok extends SbBlokData {
  columns?: SbBlokData[];
}

export function Grid({ blok }: { blok: GridBlok }) {
  return (
    <div
      {...storyblokEditable(blok)}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4"
    >
      {blok.columns?.map((column) => (
        <StoryblokComponent blok={column} key={column._uid} />
      ))}
    </div>
  );
}
