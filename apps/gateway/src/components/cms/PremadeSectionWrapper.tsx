"use client";

import { PremadeSection } from "@repo/shared-cms";
import { useTemplates } from "./TemplateContext";

/**
 * Client-side wrapper for premade sections.
 *
 * Reads the template from TemplateContext (provided by the server-side
 * TemplateProvider), then delegates to PremadeSection for structure
 * generation and rendering.
 *
 * This is a client component so it can live in the Storyblok component map
 * without pulling Node.js-only modules (postgres) into the client bundle.
 */
export function PremadeSectionWrapper({ blok }: { blok: any }) {
  const templates = useTemplates();

  // Strip "shared_" prefix added by the gateway component map
  const componentName = blok.component.replace(/^shared_/, "");
  const template = templates[componentName];

  if (!template) {
    console.error(
      `[PremadeSectionWrapper] No template found for: ${componentName}`,
    );
    return null;
  }

  return <PremadeSection blok={blok} template={template} />;
}

/**
 * Resolver for unknown shared_* components.
 *
 * If a matching template exists, treat it as a derived premade section.
 * Otherwise, warn and render nothing to avoid crashing richtext overrides.
 */
export function SharedTemplateResolver({ blok }: { blok: any }) {
  const templates = useTemplates();
  const componentName = blok.component.replace(/^shared_/, "");
  const template = templates[componentName];

  if (!template) {
    console.warn(
      `[SharedTemplateResolver] No template found for shared component: ${componentName}. ` +
        `If this is builder-derived, publish its builder story first.`,
    );
    return null;
  }

  return <PremadeSection blok={blok} template={template} />;
}
