"use client";

import { storyblokEditable } from "@storyblok/react";
import type { SbBlokData } from "@storyblok/react";

/**
 * Feature Component
 *
 * Storyblok's default feature component.
 * Used inside grid columns.
 */
export interface FeatureBlok extends SbBlokData {
  name?: string;
}

export function Feature({ blok }: { blok: FeatureBlok }) {
  return (
    <div
      {...storyblokEditable(blok)}
      className="p-6 rounded-lg border bg-card text-card-foreground shadow-xs"
    >
      <h3 className="text-lg font-semibold">{blok.name || "Feature"}</h3>
    </div>
  );
}
