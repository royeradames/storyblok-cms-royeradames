"use client";

import { storyblokEditable, StoryblokComponent } from "@storyblok/react";
import { cn } from "@repo/ui";
import type { SbBlokData } from "@storyblok/react";
import { buildStyleClasses, type FlexBreakpointOptionsBlok } from "../styles";

export interface ShadcnHeroBlok extends SbBlokData {
  headline: string;
  subheadline?: string;
  background_image?: {
    filename: string;
    alt?: string;
  };
  cta?: SbBlokData[];
  alignment?: "left" | "center" | "right";
  styles?: FlexBreakpointOptionsBlok[];
}

export function ShadcnHero({ blok }: { blok: ShadcnHeroBlok }) {
  const alignment = blok.alignment || "center";

  const alignmentClasses = {
    left: "items-start text-left",
    center: "items-center text-center",
    right: "items-end text-right",
  };

  return (
    <section
      {...storyblokEditable(blok)}
      className={cn(
        "relative min-h-[60vh] flex flex-col justify-center py-20 px-4",
        ...buildStyleClasses(blok.styles),
      )}
      style={
        blok.background_image?.filename
          ? {
              backgroundImage: `url(${blok.background_image.filename})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      {blok.background_image?.filename && (
        <div className="absolute inset-0 bg-black/50" />
      )}
      <div
        className={`relative z-10 max-w-4xl mx-auto flex flex-col gap-6 ${alignmentClasses[alignment]}`}
      >
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          {blok.headline}
        </h1>
        {blok.subheadline && (
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl">
            {blok.subheadline}
          </p>
        )}
        {blok.cta && blok.cta.length > 0 && (
          <div className="flex gap-4 flex-wrap">
            {blok.cta.map((nestedBlok) => (
              <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
