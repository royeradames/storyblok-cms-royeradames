"use client";

import { StoryblokComponent } from "@storyblok/react";
import type { CaseStudies2Blok } from "./case-studies-2.types";
import { generateStructure } from "./generatedStructure";

export function CaseStudies2Section({ blok }: { blok: CaseStudies2Blok }) {
  const fullBlok = generateStructure(blok);
  return <StoryblokComponent blok={fullBlok} />;
}
