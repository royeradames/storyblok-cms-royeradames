function isObject(value: unknown): value is Record<string, any> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasSectionMarker(node: unknown): boolean {
  if (!isObject(node)) return false;

  if (
    typeof node.data_section_name === "string" &&
    node.data_section_name.trim().length > 0
  ) {
    return true;
  }

  for (const value of Object.values(node)) {
    if (!Array.isArray(value)) continue;
    for (const item of value) {
      if (hasSectionMarker(item)) return true;
    }
  }

  return false;
}

/**
 * Extracts the effective builder template from story content.
 *
 * - Default behavior: use body[0], falling back to story content.
 * - element_builder_page behavior: if no node in the template tree defines
 *   data_section_name, apply page-level data_section_name to the template root.
 */
export function normalizeBuilderTemplate(storyContent: any): any {
  const template = storyContent?.body?.[0] ?? storyContent;
  if (!isObject(template)) return template;

  const rootComponent =
    typeof storyContent?.component === "string" ? storyContent.component : "";
  const pageSectionName =
    typeof storyContent?.data_section_name === "string"
      ? storyContent.data_section_name.trim()
      : "";

  if (
    rootComponent === "element_builder_page" &&
    pageSectionName.length > 0 &&
    !hasSectionMarker(template)
  ) {
    return {
      ...template,
      data_section_name: pageSectionName,
    };
  }

  return template;
}

/**
 * Builds the slug prefix used for derived premade names.
 * "section-builder/case-studies-2" -> "case_studies_2"
 */
export function slugToBuilderPrefix(fullSlug: string): string {
  return fullSlug
    .replace(/^(section-builder|element-builder|form-builder)\//, "")
    .replace(/-/g, "_");
}

/**
 * Resolves canonical DB key for a normalized builder template.
 * Uses root data_section_name when present; otherwise falls back to {slugPrefix}_section.
 */
export function resolveTemplateComponentName(
  template: any,
  slugPrefix: string,
): string {
  if (
    isObject(template) &&
    typeof template.data_section_name === "string" &&
    template.data_section_name.trim().length > 0
  ) {
    return template.data_section_name.trim();
  }
  return `${slugPrefix}_section`;
}

/**
 * Converts a canonical component name to the derivation prefix.
 * "article_heading_1_section" -> "article_heading_1"
 * "article_heading_1" -> "article_heading_1"
 */
export function derivePrefixFromComponentName(componentName: string): string {
  return componentName.replace(/_section$/, "");
}
