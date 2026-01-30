"use client";

import { storyblokEditable } from "@storyblok/react";
import { Button } from "@repo/ui";
import type { SbBlokData } from "@storyblok/react";

export interface PresetHeroDefaultBlok extends SbBlokData {
  // Minimal configuration - mostly preset
  primary_cta_text?: string;
  primary_cta_link?: string;
}

/**
 * Preset Hero with default values
 * Requires minimal CMS configuration
 */
export function PresetHeroDefault({ blok }: { blok: PresetHeroDefaultBlok }) {
  return (
    <section
      {...storyblokEditable(blok)}
      className="min-h-[50vh] flex flex-col justify-center items-center text-center py-20 px-4 bg-linear-to-b from-background to-muted"
    >
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
        Welcome to Our Platform
      </h1>
      <p className="text-xl text-muted-foreground max-w-2xl mb-8">
        Build something amazing with our powerful tools and intuitive interface.
      </p>
      <div className="flex gap-4">
        <Button size="lg" asChild>
          <a href={blok.primary_cta_link || "/get-started"}>
            {blok.primary_cta_text || "Get Started"}
          </a>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <a href="/learn-more">Learn More</a>
        </Button>
      </div>
    </section>
  );
}
