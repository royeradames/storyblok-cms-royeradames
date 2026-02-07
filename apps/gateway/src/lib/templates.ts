import { unstable_cache } from "next/cache";
import { db } from "@/db/client";
import { sectionTemplates } from "@/db/schema";

/**
 * Fetches all section templates from PostgreSQL and caches them in Vercel's
 * data cache. The cache is invalidated via revalidateTag("section-templates")
 * when a section-builder story is published in Storyblok.
 *
 * Returns a Map keyed by component name (e.g. "case_studies_2_section").
 */
const getCachedTemplates = unstable_cache(
  async (): Promise<Map<string, any>> => {
    const rows = await db.select().from(sectionTemplates);
    return new Map(rows.map((r) => [r.component, r.template]));
  },
  ["section-templates"],
  { tags: ["section-templates"] },
);

/**
 * Retrieves a single template by component name.
 *
 * - On cache hit: 0ms (served from Vercel data cache)
 * - On cache miss: single query fetches ALL templates, O(1) lookup
 *
 * @param componentName - e.g. "case_studies_2_section"
 */
export async function getTemplate(
  componentName: string,
): Promise<any | null> {
  const templates = await getCachedTemplates();
  return templates.get(componentName) ?? null;
}
