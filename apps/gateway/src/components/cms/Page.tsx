"use client";

import { storyblokEditable, StoryblokComponent } from "@storyblok/react";
import { cn } from "@repo/ui";
import type { SbBlokData } from "@storyblok/react";
import { buildStyleClasses, type FlexBreakpointOptionsBlok } from "@repo/shared-cms/styles";

/**
 * Gateway-specific Page component
 *
 * Used for the home page and all pages in the gateway app.
 * Overrides the shared @repo/shared-cms Page so gateway owns page rendering.
 */
export interface PageBlok extends SbBlokData {
  body?: SbBlokData[];
  styles?: FlexBreakpointOptionsBlok[];
}

export function Page({ blok }: { blok: PageBlok }) {
  return (
    <main
      {...storyblokEditable(blok)}
      className={cn("container mx-auto", ...buildStyleClasses(blok.styles))}
    >
      {blok.body?.map((nestedBlok) => (
        <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </main>
  );
}
