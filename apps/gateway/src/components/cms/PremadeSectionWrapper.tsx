import { getTemplate } from "@/lib/templates";
import { PremadeSection } from "@repo/shared-cms";

/**
 * Server-side wrapper that fetches the template from DB (via Vercel data cache)
 * and passes it to the client-side PremadeSection renderer.
 *
 * Registered in the components map for each premade section type.
 * The component name is derived by stripping the "shared_" prefix.
 */
export async function PremadeSectionWrapper({ blok }: { blok: any }) {
  // Strip "shared_" prefix added by the gateway component map
  const componentName = blok.component.replace(/^shared_/, "");
  const template = await getTemplate(componentName);

  if (!template) {
    console.error(
      `[PremadeSectionWrapper] No template found for: ${componentName}`,
    );
    return null;
  }

  return <PremadeSection blok={blok} template={template} />;
}
