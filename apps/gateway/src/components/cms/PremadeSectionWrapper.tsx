"use client";

import { PremadeSection } from "@repo/shared-cms";
import { useTemplates } from "./TemplateContext";

type TemplateProviderStatus = "ok" | "db_unavailable" | "query_failed";

const TEMPLATE_META_STATUS_KEY = "__template_meta_status__";
const TEMPLATE_META_DETAIL_KEY = "__template_meta_detail__";

function getTemplateProviderStatus(
  templates: Record<string, unknown>,
): TemplateProviderStatus {
  const status = templates[TEMPLATE_META_STATUS_KEY];
  if (
    status === "ok" ||
    status === "db_unavailable" ||
    status === "query_failed"
  ) {
    return status;
  }
  return "ok";
}

function getTemplateProviderDetail(templates: Record<string, unknown>): string {
  const detail = templates[TEMPLATE_META_DETAIL_KEY];
  return typeof detail === "string" ? detail : "";
}

function resolveTemplate(
  templates: Record<string, unknown>,
  rawComponentName: string,
): unknown {
  const normalizedComponentName = rawComponentName.replace(/^shared_/, "");
  return (
    templates[rawComponentName] ??
    templates[normalizedComponentName] ??
    templates[`${normalizedComponentName}_section`]
  );
}

function renderTemplateFailureCard(
  status: TemplateProviderStatus,
  componentName: string,
  detail: string,
) {
  const messageByStatus = {
    db_unavailable: detail || "Template database is unavailable.",
    query_failed: detail || "Template query failed.",
    ok: `Template missing for component: ${componentName}.`,
  } as const satisfies Record<TemplateProviderStatus, string>;

  const guidanceByStatus = {
    db_unavailable: "Start Postgres, verify DATABASE_URL, then refresh preview.",
    query_failed:
      "Check DB connectivity/migrations, then retry fetching templates.",
    ok: `Run "bun run storyblok:seed:templates", then republish "element-builder/${componentName}" (or "section-builder/${componentName}") in Storyblok.`,
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
 * Reads the template from TemplateContext (provided by the server-side
 * TemplateProvider), then delegates to PremadeSection for structure
 * generation and rendering.
 *
 * This is a client component so it can live in the Storyblok component map
 * without pulling Node.js-only modules (postgres) into the client bundle.
 */
export function PremadeSectionWrapper({ blok }: { blok: any }) {
  const templates = useTemplates();

  const rawComponentName = String(blok.component ?? "");
  const componentName = rawComponentName.replace(/^shared_/, "");
  const template = resolveTemplate(templates, rawComponentName);
  const providerStatus = getTemplateProviderStatus(templates);
  const providerDetail = getTemplateProviderDetail(templates);

  if (!template) {
    const contextLabel =
      providerStatus === "ok"
        ? "missing template"
        : `provider status: ${providerStatus}`;
    console.error(
      `[PremadeSectionWrapper] No template found for: ${componentName} (${contextLabel})`,
    );
    return renderTemplateFailureCard(providerStatus, componentName, providerDetail);
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
  const rawComponentName = String(blok.component ?? "");
  const componentName = rawComponentName.replace(/^shared_/, "");
  const template = resolveTemplate(templates, rawComponentName);
  const providerStatus = getTemplateProviderStatus(templates);
  const providerDetail = getTemplateProviderDetail(templates);

  if (!template) {
    const contextLabel =
      providerStatus === "ok"
        ? "missing template"
        : `provider status: ${providerStatus}`;
    console.warn(
      `[SharedTemplateResolver] No template found for shared component: ${componentName} (${contextLabel}).`,
    );
    return renderTemplateFailureCard(providerStatus, componentName, providerDetail);
  }

  return <PremadeSection blok={blok} template={template} />;
}
