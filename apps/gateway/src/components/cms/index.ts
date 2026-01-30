/**
 * Gateway app-specific component map
 *
 * Shared components are registered with "shared_" prefix (e.g. shared_shadcn_flex).
 * App-specific components have no prefix (e.g. page).
 */
import { components as sharedComponents } from "@repo/shared-cms";
import { Page } from "./Page";

const sharedWithPrefix = Object.fromEntries(
  Object.entries(sharedComponents).map(([k, v]) => [`shared_${k}`, v]),
);

export const components = {
  ...sharedWithPrefix,
  page: Page,
};
