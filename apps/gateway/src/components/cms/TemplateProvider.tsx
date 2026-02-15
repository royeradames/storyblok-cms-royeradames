import { db } from "@/db/client";
import { sectionTemplates } from "@/db/schema";
import { TemplateContextProvider } from "./TemplateContext";
import { unstable_noStore } from "next/cache";

type TemplateProviderStatus = "ok" | "db_unavailable" | "query_failed";

const TEMPLATE_META_STATUS_KEY = "__template_meta_status__";
const TEMPLATE_META_COUNT_KEY = "__template_meta_count__";
const TEMPLATE_META_DETAIL_KEY = "__template_meta_detail__";

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
  let templates: Record<string, unknown> = {
    [TEMPLATE_META_STATUS_KEY]: "ok" satisfies TemplateProviderStatus,
    [TEMPLATE_META_COUNT_KEY]: 0,
    [TEMPLATE_META_DETAIL_KEY]: "",
  };
  try {
    const rows = await db.select().from(sectionTemplates);
    const nextTemplates = rows.reduce<Record<string, unknown>>((acc, row) => {
      const rawComponentName = String(row.component ?? "").trim();
      if (rawComponentName.length === 0) return acc;

      const normalizedComponentName = rawComponentName.replace(/^shared_/, "");
      const sharedComponentName = rawComponentName.startsWith("shared_")
        ? rawComponentName
        : `shared_${normalizedComponentName}`;

      acc[rawComponentName] = row.template;
      acc[normalizedComponentName] = row.template;
      acc[sharedComponentName] = row.template;

      if (!normalizedComponentName.endsWith("_section")) {
        acc[`${normalizedComponentName}_section`] = row.template;
      }

      return acc;
    }, {});
    templates = {
      ...nextTemplates,
      [TEMPLATE_META_STATUS_KEY]: "ok",
      [TEMPLATE_META_COUNT_KEY]: rows.length,
      [TEMPLATE_META_DETAIL_KEY]: `Loaded ${rows.length} template row${rows.length === 1 ? "" : "s"} from DB.`,
    };
  } catch (err) {
    const errorText = err instanceof Error ? err.message : String(err);
    const isConnectionError = /ECONNREFUSED|connect|connection/i.test(errorText);
    const providerStatus: TemplateProviderStatus = isConnectionError
      ? "db_unavailable"
      : "query_failed";
    templates = {
      [TEMPLATE_META_STATUS_KEY]: providerStatus,
      [TEMPLATE_META_COUNT_KEY]: 0,
      [TEMPLATE_META_DETAIL_KEY]: isConnectionError
        ? "Template database is unavailable. Start Postgres and refresh."
        : "Template query failed. Check database connectivity and migrations.",
    };
    console.error("[TemplateProvider] section_templates query failed:", err);
  }
  return (
    <TemplateContextProvider templates={templates}>
      {children}
    </TemplateContextProvider>
  );
}
