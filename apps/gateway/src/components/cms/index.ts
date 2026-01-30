/**
 * Gateway app-specific component map
 *
 * Extends shared @repo/cms components and overrides/adds gateway-specific ones.
 * The home page and all pages use the gateway Page component from this app.
 */
import { components as sharedComponents } from "@repo/cms";
import { Page } from "./Page";

export const components = {
  ...sharedComponents,
  page: Page,
};
