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
  const rows = await db.select().from(sectionTemplates);
  const templates = Object.fromEntries(rows.map((r) => [r.component, r.template]));
  return (
    <TemplateContextProvider templates={templates}>
      {children}
    </TemplateContextProvider>
  );
}
