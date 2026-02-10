/**
 * Gateway app-specific component map
 *
 * Shared components are registered with "shared_" prefix (e.g. shared_shadcn_container).
 * App-specific components have no prefix (e.g. page).
 *
 * Premade section root bloks (e.g. shared_case_studies_2_section, shared_blog7_section)
 * are auto-mapped to PremadeSectionWrapper via a Proxy. No manual registration needed --
 * any component matching `shared_*_section` that isn't already a shared UI component
 * is automatically handled by PremadeSectionWrapper.
 */
import { components as sharedComponents } from "@repo/shared-cms";
import { Page } from "./Page";
import { PremadeSectionWrapper } from "./PremadeSectionWrapper";

const sharedWithPrefix = Object.fromEntries(
  Object.entries(sharedComponents).map(([k, v]) => [`shared_${k}`, v]),
);

const baseComponents: Record<string, any> = {
  ...sharedWithPrefix,
  page: Page,
  element_builder_page: Page,
  form_builder_page: Page,
};

/**
 * Proxy that auto-maps unknown `shared_*` components to PremadeSectionWrapper.
 * This keeps dynamically derived premade components renderable, even when
 * naming does not follow the *_section suffix convention.
 */
export const components = new Proxy(baseComponents, {
  get(target, prop) {
    if (typeof prop === "string" && prop in target) {
      return target[prop];
    }
    // Auto-map unknown shared derived bloks
    if (typeof prop === "string" && prop.startsWith("shared_")) {
      return PremadeSectionWrapper;
    }
    return undefined;
  },
});
