/**
 * Generic structure generator for premade sections.
 *
 * Takes a raw builder template (from Storyblok section-builder) and a CMS blok
 * (premade data), walks the template tree, clones repeatable sections, connects
 * CMS data fields to builder component fields, and cleans up builder-only metadata.
 *
 * Template marker fields:
 * - `data_section_name` on containers: marks section boundaries / cloning points.
 *    Uses premade blok component names (e.g. "case_studies_2_study").
 *    Array matching is done by `component` field on data items, not by field name.
 * - `data_mapping` (nested blok): array with one `builder_data_mapping` entry containing
 *    `builder_section`, `premade_field`, `builder_field`
 */

type SectionContext = Record<string, any>;
type WrapperInfo = { sectionName: string; dataArray: any[] };

/**
 * Main entry point. Processes the raw builder template with the given blok data.
 *
 * @param rawTemplate - The raw builder template JSON (from Storyblok section-builder story)
 * @param blok - The premade CMS blok data
 * @returns The fully populated component structure ready for rendering
 */
export function buildStructureFromTemplate(
  rawTemplate: any,
  blok: any,
): Record<string, any> {
  const rootSectionName = rawTemplate.data_section_name;

  // Initialise context: root section maps to the entire blok
  const context: SectionContext = {};
  if (rootSectionName) {
    context[rootSectionName] = blok;
  }

  const result = processNode(rawTemplate, context);

  // Root node gets sectionBlok and _uid from the blok
  result.sectionBlok = blok;
  result._uid = blok._uid;

  return result;
}

// ── Core tree processing ──────────────────────────────────────────────

function processNode(
  node: any,
  context: SectionContext,
  wrapperInfo?: WrapperInfo,
): Record<string, any> {
  const result: Record<string, any> = {};

  for (const [key, value] of Object.entries(node)) {
    // Skip builder-only editable markers
    if (key === "_editable") continue;

    // Generate fresh UIDs (section instances get overwritten later)
    if (key === "_uid") {
      result[key] = crypto.randomUUID();
      continue;
    }

    // Process the items array (the component tree children)
    if (key === "items" && Array.isArray(value)) {
      result[key] = wrapperInfo
        ? expandWrapperChildren(value, context, wrapperInfo)
        : processItems(value, context);
      continue;
    }

    // Recurse into nested objects (color_dark, color_light, image, etc.)
    if (isObject(value)) {
      result[key] = processNode(value, context);
      continue;
    }

    // Recurse into non-items arrays (styles, border, padding, etc.)
    if (Array.isArray(value)) {
      result[key] = value.map((item: any) =>
        isObject(item) ? processNode(item, context) : item,
      );
      continue;
    }

    // Copy primitive values as-is
    result[key] = value;
  }

  // Map CMS data values to builder fields
  connectDataFields(result, context);

  // Remove builder-only metadata from output
  cleanupMetadata(result);

  return result;
}

/**
 * Processes an items array, detecting section templates and cloning them
 * for each data entry. Two patterns:
 *
 * 1. **Self-clone** – the item IS the section instance (e.g. case-study `<li>`)
 *    → clone the item per data entry, attach sectionBlok to each clone.
 *
 * 2. **Wrapper** – the item WRAPS a single child template (e.g. statistics container)
 *    → keep the wrapper, clone its children per data entry.
 */
function processItems(items: any[], context: SectionContext): any[] {
  const result: any[] = [];

  for (const item of items) {
    if (!isObject(item)) {
      result.push(item);
      continue;
    }

    const sectionName: string | undefined = item.data_section_name;

    if (sectionName) {
      const dataArray = findDataArray(sectionName, context);

      if (dataArray && dataArray.length > 0) {
        if (isSectionWrapper(item)) {
          // Wrapper pattern: keep node, clone its children
          result.push(
            processNode(item, context, { sectionName, dataArray }),
          );
        } else {
          // Self-clone pattern: clone this node per data entry
          for (const dataEntry of dataArray) {
            const entryContext = { ...context, [sectionName]: dataEntry };
            const processed = processNode(item, entryContext);
            processed.sectionBlok = dataEntry;
            processed._uid = dataEntry._uid ?? processed._uid;
            result.push(processed);
          }
        }
        continue;
      }
    }

    // No section handling needed – process normally
    result.push(processNode(item, context));
  }

  return result;
}

// ── Wrapper handling ──────────────────────────────────────────────────

/**
 * A node is a "wrapper" if its `items` contains exactly one child
 * that does NOT have its own `data_section_name`. In that case the
 * wrapper stays put and its single child is the template to clone.
 */
function isSectionWrapper(node: any): boolean {
  if (!Array.isArray(node.items) || node.items.length !== 1) return false;
  const child = node.items[0];
  return isObject(child) && !child.data_section_name;
}

/**
 * Clones the wrapper's children (template items) once per data entry,
 * attaching sectionBlok and _uid to each clone.
 */
function expandWrapperChildren(
  templateItems: any[],
  context: SectionContext,
  { sectionName, dataArray }: WrapperInfo,
): any[] {
  const result: any[] = [];

  for (const dataEntry of dataArray) {
    const entryContext = { ...context, [sectionName]: dataEntry };
    for (const child of templateItems) {
      if (isObject(child)) {
        const processed = processNode(child, entryContext);
        processed.sectionBlok = dataEntry;
        processed._uid = dataEntry._uid ?? processed._uid;
        result.push(processed);
      } else {
        result.push(child);
      }
    }
  }

  return result;
}

// ── Data connection ───────────────────────────────────────────────────

/**
 * Reads the section/field mapping from the node's `data_mapping` blok and
 * connects CMS data to the appropriate builder field.
 *
 * The `data_mapping` blok contains a single entry with:
 * - `builder_section`: which section in context to look up (premade blok component name)
 * - `premade_field`: which field on the premade data to read
 * - `builder_field`: which field on this node to write the value to
 */
function connectDataFields(
  node: Record<string, any>,
  context: SectionContext,
): void {
  const mapping = node.data_mapping?.[0];
  if (!mapping) return;

  const sectionName: string | undefined = mapping.builder_section;
  const fieldName: string | undefined = mapping.premade_field;
  const targetField: string | undefined = mapping.builder_field;

  if (!sectionName || !fieldName || !targetField) return;

  const sectionData = context[sectionName];
  if (!sectionData) return;

  const value = sectionData[fieldName];
  if (value !== undefined) {
    node[targetField] = value;
  }
}

// ── Utilities ─────────────────────────────────────────────────────────

/**
 * Finds the data array for a section name by scanning all arrays in context
 * and matching on the `component` field of their items.
 *
 * Handles the shared_ prefix automatically:
 *   data_section_name: "case_studies_2_study"
 *   array item component: "case_studies_2_study" or "shared_case_studies_2_study"
 */
function findDataArray(
  sectionName: string,
  context: SectionContext,
): any[] | null {
  for (const contextValue of Object.values(context)) {
    if (!isObject(contextValue)) continue;
    for (const value of Object.values(contextValue)) {
      if (!Array.isArray(value) || value.length === 0) continue;
      const first = value[0];
      if (!isObject(first)) continue;
      const comp: string = first.component ?? "";
      if (
        comp === sectionName ||
        comp.replace(/^shared_/, "") === sectionName
      ) {
        return value;
      }
    }
  }
  return null;
}

/** Removes builder-only metadata keys from the output node. */
function cleanupMetadata(node: Record<string, any>): void {
  delete node.data_mapping;
  delete node.data_section_name;
}

function isObject(value: unknown): value is Record<string, any> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
