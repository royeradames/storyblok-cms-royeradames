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
