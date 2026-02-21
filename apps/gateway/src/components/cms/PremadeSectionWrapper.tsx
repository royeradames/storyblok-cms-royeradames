"use client";

import { PremadeSection } from "@repo/shared-cms";
import { getBuilderTemplateHydrator } from "@repo/shared-cms/builder-templates";
import { useTemplates } from "./TemplateContext";

type TemplateProviderStatus = "ok" | "artifact_missing";

const TEMPLATE_META_STATUS_KEY = "__template_meta_status__";
const TEMPLATE_META_DETAIL_KEY = "__template_meta_detail__";
const NON_TEMPLATE_SHARED_COMPONENTS = new Set([
  "rich_text_node_mappings",
]);

function getTemplateProviderStatus(
  templates: Record<string, unknown>,
): TemplateProviderStatus {
  const status = templates[TEMPLATE_META_STATUS_KEY];
  if (
    status === "ok" ||
    status === "artifact_missing"
  ) {
    return status;
  }
  return "ok";
}

function getTemplateProviderDetail(templates: Record<string, unknown>): string {
  const detail = templates[TEMPLATE_META_DETAIL_KEY];
  return typeof detail === "string" ? detail : "";
}

function renderTemplateFailureCard(
  status: TemplateProviderStatus,
  componentName: string,
  detail: string,
) {
  const messageByStatus = {
    artifact_missing: detail || "Generated template artifacts are unavailable.",
    ok: `Template missing for component: ${componentName}.`,
  } as const satisfies Record<TemplateProviderStatus, string>;

  const guidanceByStatus = {
    artifact_missing:
      'Run "bun run storyblok:seed:templates" in packages/shared-cms, commit generated files, and redeploy.',
    ok: `Template not found in generated artifacts for "${componentName}". Run "bun run storyblok:seed:templates" in packages/shared-cms, commit generated files, and deploy.`,
  } as const satisfies Record<TemplateProviderStatus, string>;

  return (
    <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
      <div>{messageByStatus[status]}</div>
      <div className="mt-1 text-xs opacity-90">{guidanceByStatus[status]}</div>
    </div>
  );
}

/**
 * Client-side wrapper for premade sections.
 *
 * Resolves a generated hydrator by component name and delegates rendering
 * to PremadeSection.
 *
 * This is a client component so it can live in the Storyblok component map
 * without pulling server-only template sources into the client bundle.
 */
export function PremadeSectionWrapper({ blok }: { blok: any }) {
  const templates = useTemplates();

  const rawComponentName = String(blok.component ?? "");
  const componentName = rawComponentName.replace(/^shared_/, "");
  const hydrateTemplate = getBuilderTemplateHydrator(componentName);
  const providerStatus = getTemplateProviderStatus(templates);
  const providerDetail = getTemplateProviderDetail(templates);

  if (!hydrateTemplate) {
    const contextLabel =
      providerStatus === "ok"
        ? "missing template"
        : `provider status: ${providerStatus}`;
    console.error(
      `[PremadeSectionWrapper] No template found for: ${componentName} (${contextLabel})`,
    );
    return renderTemplateFailureCard(providerStatus, componentName, providerDetail);
  }

  return <PremadeSection blok={blok} />;
}

/**
 * Resolver for unknown shared_* components.
 *
 * If a matching template exists, treat it as a derived premade section.
 * Otherwise, warn and render nothing to avoid crashing richtext overrides.
 */
export function SharedTemplateResolver({ blok }: { blok: any }) {
  const templates = useTemplates();
  const rawComponentName = String(blok.component ?? "");
  const componentName = rawComponentName.replace(/^shared_/, "");
  if (NON_TEMPLATE_SHARED_COMPONENTS.has(componentName)) {
    return null;
  }
  const hydrateTemplate = getBuilderTemplateHydrator(componentName);
  const providerStatus = getTemplateProviderStatus(templates);
  const providerDetail = getTemplateProviderDetail(templates);

  if (!hydrateTemplate) {
    const contextLabel =
      providerStatus === "ok"
        ? "missing template"
        : `provider status: ${providerStatus}`;
    console.warn(
      `[SharedTemplateResolver] No template found for shared component: ${componentName} (${contextLabel}).`,
    );
    return renderTemplateFailureCard(providerStatus, componentName, providerDetail);
  }

  return <PremadeSection blok={blok} />;
}
