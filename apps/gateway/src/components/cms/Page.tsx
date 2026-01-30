"use client";

import { storyblokEditable, StoryblokComponent } from "@storyblok/react";
import type { SbBlokData } from "@storyblok/react";

/**
 * Gateway-specific Page component
 *
 * Used for the home page and all pages in the gateway app.
 * Overrides the shared @repo/shared-cms Page so gateway owns page rendering.
 */
export interface PageBlok extends SbBlokData {
  body?: SbBlokData[];
}

export function Page({ blok }: { blok: PageBlok }) {
  return (
    <main {...storyblokEditable(blok)} className="container mx-auto">
      {blok.body?.map((nestedBlok) => (
        <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </main>
  );
}
