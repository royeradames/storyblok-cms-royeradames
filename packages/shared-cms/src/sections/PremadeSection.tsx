"use client";

import { StoryblokComponent } from "@storyblok/react";
import { buildStructureFromTemplate } from "../structure-generator";

/**
 * Generic renderer for any premade section.
 *
 * Takes a raw builder template (fetched from DB by the server wrapper) and the
 * CMS blok data, generates the full component structure, and renders it via
 * StoryblokComponent.
 *
 * This component is "use client" because StoryblokComponent needs the bridge
 * for Visual Editor support. The template fetch happens server-side in
 * PremadeSectionWrapper.
 */
export function PremadeSection({
  blok,
  template,
}: {
  blok: any;
  template: any;
}) {
  const fullBlok = buildStructureFromTemplate(template, blok);
  return <StoryblokComponent blok={fullBlok} />;
}
