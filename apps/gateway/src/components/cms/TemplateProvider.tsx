import { db } from "@/db/client";
import { sectionTemplates } from "@/db/schema";
import { TemplateContextProvider } from "./TemplateContext";
import { unstable_noStore } from "next/cache";

/**
 * Server component that fetches all section builder templates from PostgreSQL
 * (via Vercel data cache) and provides them to client components via context.
 *
 * Wrap this around your layout so PremadeSectionWrapper can read templates
 * without importing server-only modules.
 */

export async function TemplateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  unstable_noStore();
  let templates: Record<string, unknown> = {};
  try {
    const rows = await db.select().from(sectionTemplates);
    templates = Object.fromEntries(rows.map((r) => [r.component, r.template]));
  } catch (err) {
    // Table may not exist yet (migrations not run) or DB unavailable; allow preview to load with no templates
    console.warn("[TemplateProvider] section_templates query failed:", err);
  }
  return (
    <TemplateContextProvider templates={templates}>
      {children}
    </TemplateContextProvider>
  );
}
