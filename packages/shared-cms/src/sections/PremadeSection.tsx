"use client";

import { StoryblokComponent } from "@storyblok/react";
import { getBuilderTemplateHydrator } from "../builder-templates/hydrators";

/**
 * Generic renderer for any premade section.
 *
 * Resolves a generated hydrator by component name, transforms the incoming
 * CMS blok data into a renderable component structure, and renders it via
 * StoryblokComponent.
 *
 * This component is "use client" because StoryblokComponent needs the bridge
 * for Visual Editor support. The template fetch happens server-side in
 * PremadeSectionWrapper.
 */
export function PremadeSection({
  blok,
}: {
  blok: any;
}) {
  const rawComponentName = String(blok?.component ?? "");
  const normalizedComponentName = rawComponentName.replace(/^shared_/, "");
  const hydrateTemplate = getBuilderTemplateHydrator(normalizedComponentName);

  if (!hydrateTemplate) {
    throw new Error(
      `Missing generated hydrator for component "${normalizedComponentName}". Regenerate templates.`,
    );
  }

  const fullBlok = hydrateTemplate(blok);
  return <StoryblokComponent blok={fullBlok} />;
}
