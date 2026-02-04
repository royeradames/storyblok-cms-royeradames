"use client";

import { StoryblokComponent, storyblokEditable } from "@storyblok/react";
import type { CaseStudies2Blok } from "./case-studies-2.types";
import { generateElements } from "./structure";

export function CaseStudies2Section({ blok }: { blok: CaseStudies2Blok }) {
  const fullBlok = generateElements(blok);
  return (
    <div {...storyblokEditable(blok)}>
      <StoryblokComponent blok={fullBlok} />
    </div>
  );
}
