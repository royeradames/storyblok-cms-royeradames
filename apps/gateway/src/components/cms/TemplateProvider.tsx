import { db } from "@/db/client";
import { sectionTemplates } from "@/db/schema";
import { TemplateContextProvider } from "./TemplateContext";
import { unstable_cache } from "next/cache";

/**
 * Server component that fetches all section builder templates from PostgreSQL
 * (via Vercel data cache) and provides them to client components via context.
 *
 * Wrap this around your layout so PremadeSectionWrapper can read templates
 * without importing server-only modules.
 */

const getCachedTemplateMap = unstable_cache(
  async (): Promise<Record<string, any>> => {
    const rows = await db.select().from(sectionTemplates);
    return Object.fromEntries(rows.map((r) => [r.component, r.template]));
  },
  ["section-templates"],
  { tags: ["section-templates"] },
);

export async function TemplateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const templates = await getCachedTemplateMap();
  return (
    <TemplateContextProvider templates={templates}>
      {children}
    </TemplateContextProvider>
  );
}
