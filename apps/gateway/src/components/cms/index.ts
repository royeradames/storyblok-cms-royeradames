/**
 * Gateway app-specific component map
 *
 * Shared components are registered with "shared_" prefix (e.g. shared_shadcn_container).
 * App-specific components have no prefix (e.g. page).
 *
 * Premade sections are mapped to PremadeSectionWrapper, which fetches the
 * builder template from the DB and renders generically.
 */
import { components as sharedComponents } from "@repo/shared-cms";
import { Page } from "./Page";
import { PremadeSectionWrapper } from "./PremadeSectionWrapper";

const sharedWithPrefix = Object.fromEntries(
  Object.entries(sharedComponents).map(([k, v]) => [`shared_${k}`, v]),
);

export const components = {
  ...sharedWithPrefix,
  page: Page,

  // === Premade Sections (one line per section, all use generic wrapper) ===
  shared_case_studies_2_section: PremadeSectionWrapper,
  shared_blog7_section: PremadeSectionWrapper,
};
