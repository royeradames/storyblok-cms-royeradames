import { builderTemplateRegistry } from "@/generated/builder-template-registry";
import { buildTemplateLookup } from "@/lib/template-artifacts";
import { TemplateContextProvider } from "./TemplateContext";
import { unstable_noStore } from "next/cache";

type TemplateProviderStatus = "ok" | "artifact_missing";

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
  const generatedTemplateCount = builderTemplateRegistry.templates.length;
  let templates: Record<string, unknown> = {
    [TEMPLATE_META_STATUS_KEY]: "ok" satisfies TemplateProviderStatus,
    [TEMPLATE_META_COUNT_KEY]: generatedTemplateCount,
    [TEMPLATE_META_DETAIL_KEY]: "",
  };
  if (generatedTemplateCount > 0) {
    templates = {
      ...buildTemplateLookup(builderTemplateRegistry.templates),
      [TEMPLATE_META_STATUS_KEY]: "ok",
      [TEMPLATE_META_COUNT_KEY]: generatedTemplateCount,
      [TEMPLATE_META_DETAIL_KEY]: `Loaded ${generatedTemplateCount} template artifact${generatedTemplateCount === 1 ? "" : "s"} from generated registry.`,
    };
  } else {
    templates = {
      [TEMPLATE_META_STATUS_KEY]: "artifact_missing",
      [TEMPLATE_META_COUNT_KEY]: 0,
      [TEMPLATE_META_DETAIL_KEY]:
        "No generated template artifacts found. Run bun run storyblok:seed:templates and commit generated files.",
    };
  }
  return (
    <TemplateContextProvider templates={templates}>
      {children}
    </TemplateContextProvider>
  );
}
