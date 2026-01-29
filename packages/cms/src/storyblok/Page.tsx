"use client";

import { storyblokEditable, StoryblokComponent } from "@storyblok/react";
import type { SbBlokData } from "@storyblok/react";

/**
 * Page Component
 *
 * This is the default content type for Storyblok pages.
 * It renders the body blocks of the page.
 */
export interface PageBlok extends SbBlokData {
  body?: SbBlokData[];
}

export function Page({ blok }: { blok: PageBlok }) {
  return (
    <main {...storyblokEditable(blok)}>
      {blok.body?.map((nestedBlok) => (
        <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </main>
  );
}
