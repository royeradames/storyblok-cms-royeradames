/**
 * Derives premade blok component definitions from a section builder template.
 *
 * The section builder template is the single source of truth for:
 * - Which premade blok components exist (from `data_section_name` values)
 * - What fields each blok has (from `data_mapping` entries)
 * - Field types (inferred from host component + `builder_field`)
 * - Parent-child relationships (from section nesting)
 *
 * Also provides diffing and story data migration utilities.
 */

const SHARED_PREFIX = "shared_";
const MAPI_BASE = "https://mapi.storyblok.com/v1";
const DELAY_MS = 350;

// ── Types ─────────────────────────────────────────────────────────────

export interface DerivedField {
  name: string;
  type: string;
  pos: number;
  description?: string;
  filetypes?: string[];
  restrict_components?: boolean;
  component_whitelist?: string[];
  allow_target_blank?: boolean;
}

export interface DerivedComponent {
  name: string;
  display_name: string;
  is_root: boolean;
  is_nestable: boolean;
  schema: Record<string, DerivedField>;
}

export interface SchemaDiff {
  fieldRenames: { component: string; oldField: string; newField: string }[];
  fieldDeletions: { component: string; field: string }[];
  removedComponents: string[];
  changedComponents: DerivedComponent[];
  newComponents: DerivedComponent[];
}

// ── Field type inference ──────────────────────────────────────────────

/**
 * Map of (host component, builder_field) → Storyblok field type.
 * The host component is the shared component that contains the data_mapping.
 */
const FIELD_TYPE_MAP: Record<string, { type: string; filetypes?: string[] }> = {
  // Text component
  "shared_shadcn_text:content": { type: "text" },
  // Image component
  "shared_shadcn_image:image": { type: "asset", filetypes: ["images"] },
  // Badge component
  "shared_shadcn_badge:text": { type: "text" },
  // Button component
  "shared_shadcn_button:link": { type: "multilink" },
};

function inferFieldType(
  hostComponent: string,
  builderField: string,
): { type: string; filetypes?: string[] } {
  const key = `${hostComponent}:${builderField}`;
  return FIELD_TYPE_MAP[key] ?? { type: "text" };
}

// ── Pluralize (for array field names only) ────────────────────────────

function pluralizeSuffix(word: string): string {
  // Already plural (ends in s but not ss/us)
  if (word.endsWith("s") && !word.endsWith("ss") && !word.endsWith("us")) {
    return word;
  }
  if (word.endsWith("y")) return word.slice(0, -1) + "ies";
  if (
    word.endsWith("ss") ||
    word.endsWith("x") ||
    word.endsWith("ch") ||
    word.endsWith("sh")
  )
    return word + "es";
  return word + "s";
}

/**
 * Given a child section component name and a prefix, derive the array field name.
 * "case_studies_2_study" with prefix "case_studies_2" → "studies"
 */
function deriveArrayFieldName(
  childComponent: string,
  prefix: string,
): string {
  const suffix = childComponent.startsWith(prefix + "_")
    ? childComponent.slice(prefix.length + 1)
    : childComponent;
  return pluralizeSuffix(suffix);
}

/**
 * Converts a component name to a display name.
 * "case_studies_2_study" → "Case Studies 2 Study"
 */
function toDisplayName(name: string): string {
  return name
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// ── Template walking ──────────────────────────────────────────────────

interface FieldInfo {
  premadeField: string;
  type: string;
  filetypes?: string[];
}

interface SectionInfo {
  name: string;
  fields: Map<string, FieldInfo>; // keyed by premadeField
  children: string[]; // child section component names
  parentSection: string | null;
  isRoot: boolean;
}

function isObject(value: unknown): value is Record<string, any> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Walks the template tree and collects all section info.
 */
function collectSections(
  node: any,
  currentSection: string | null,
  sections: Map<string, SectionInfo>,
  parentSection: string | null,
  isRoot: boolean,
): void {
  if (!isObject(node)) return;

  // Check if this node defines a new section (skip empty strings)
  const sectionName: string | undefined = node.data_section_name;
  if (sectionName && sectionName.length > 0) {
    if (!sections.has(sectionName)) {
      sections.set(sectionName, {
        name: sectionName,
        fields: new Map(),
        children: [],
        parentSection,
        isRoot,
      });
    }
    // Register as child of parent section
    if (parentSection && parentSection !== sectionName) {
      const parent = sections.get(parentSection);
      if (parent && !parent.children.includes(sectionName)) {
        parent.children.push(sectionName);
      }
    }
    currentSection = sectionName;
  }

  // Check for data_mapping entries (supports multiple entries per node)
  const mappings = node.data_mapping;
  if (Array.isArray(mappings) && mappings.length > 0 && currentSection) {
    const hostComponent: string = node.component ?? "";

    for (const mapping of mappings) {
      const builderSection: string = mapping.builder_section ?? currentSection;
      const premadeField: string = mapping.premade_field;
      const builderField: string = mapping.builder_field;

      if (premadeField && builderField) {
        const section = sections.get(builderSection);
        if (section && !section.fields.has(premadeField)) {
          const fieldType = inferFieldType(hostComponent, builderField);
          section.fields.set(premadeField, {
            premadeField,
            ...fieldType,
          });
        }
      }
    }
  }

  // Keys to skip during recursion (non-blok structural data)
  const skipKeys = new Set([
    "_editable",
    "data_mapping",
    "color_dark",
    "color_light",
    "link",
  ]);

  // Recurse into child bloks
  for (const [key, value] of Object.entries(node)) {
    if (skipKeys.has(key)) continue;
    if (Array.isArray(value)) {
      for (const item of value) {
        if (isObject(item) && typeof item.component === "string") {
          collectSections(item, currentSection, sections, currentSection, false);
        }
      }
    }
    // Don't recurse into plain objects — only blok entries in arrays matter
  }
}

// ── Schema derivation ─────────────────────────────────────────────────

/**
 * Derives premade blok component definitions from a section builder template.
 *
 * @param template - The raw section builder template (body[0] from the Storyblok story)
 * @param slugPrefix - The prefix derived from the slug (e.g. "case_studies_2")
 * @returns Array of component definitions ready to push to Storyblok
 */
export function derivePremadeBlokSchemas(
  template: any,
  slugPrefix: string,
): DerivedComponent[] {
  const sections = new Map<string, SectionInfo>();

  // Walk the template tree
  collectSections(template, null, sections, null, true);

  const components: DerivedComponent[] = [];

  for (const section of sections.values()) {
    const schema: Record<string, DerivedField> = {};
    let pos = 0;

    // Add data fields
    for (const field of section.fields.values()) {
      const fieldDef: DerivedField = {
        name: field.premadeField,
        type: field.type,
        pos: pos++,
      };
      if (field.filetypes) fieldDef.filetypes = field.filetypes;
      schema[field.premadeField] = fieldDef;
    }

    // Add bloks array fields for child sections
    for (const childName of section.children) {
      const arrayFieldName = deriveArrayFieldName(childName, slugPrefix);
      schema[arrayFieldName] = {
        name: arrayFieldName,
        type: "bloks",
        pos: pos++,
        description: `${toDisplayName(childName)} entries`,
        restrict_components: true,
        component_whitelist: [childName],
      };
    }

    const isRootSection = section.name === `${slugPrefix}_section`;

    components.push({
      name: section.name,
      display_name: toDisplayName(section.name),
      is_root: false,
      is_nestable: isRootSection,
      schema,
    });
  }

  return components;
}

// ── Schema diffing ────────────────────────────────────────────────────

/**
 * Compares old and new derived schemas to detect field renames, additions,
 * deletions, and removed sections.
 *
 * Renames are detected by matching on (builder_section, builder_field) key.
 * We use the template's data_mapping entries for this, keyed by position.
 */
export function diffSchemas(
  oldSchemas: DerivedComponent[],
  newSchemas: DerivedComponent[],
): SchemaDiff {
  const oldMap = new Map(oldSchemas.map((c) => [c.name, c]));
  const newMap = new Map(newSchemas.map((c) => [c.name, c]));

  const fieldRenames: SchemaDiff["fieldRenames"] = [];
  const fieldDeletions: SchemaDiff["fieldDeletions"] = [];
  const removedComponents: string[] = [];
  const changedComponents: DerivedComponent[] = [];
  const newComponents: DerivedComponent[] = [];

  // Find removed components
  for (const name of oldMap.keys()) {
    if (!newMap.has(name)) {
      removedComponents.push(name);
    }
  }

  // Find new and changed components
  for (const [name, newComp] of newMap) {
    const oldComp = oldMap.get(name);
    if (!oldComp) {
      newComponents.push(newComp);
      continue;
    }

    // Compare schemas field by field
    const oldFields = new Set(Object.keys(oldComp.schema));
    const newFields = new Set(Object.keys(newComp.schema));

    let changed = false;

    // Fields in old but not in new → check if renamed or deleted
    for (const oldField of oldFields) {
      if (!newFields.has(oldField)) {
        const oldDef = oldComp.schema[oldField]!;

        // Check if this is a rename: look for a new field with same type
        // that doesn't exist in old
        let renamed = false;
        for (const newField of newFields) {
          if (!oldFields.has(newField)) {
            const newDef = newComp.schema[newField]!;
            if (oldDef.type === newDef.type) {
              fieldRenames.push({
                component: name,
                oldField,
                newField,
              });
              renamed = true;
              break;
            }
          }
        }

        if (!renamed) {
          // Skip bloks fields from deletions (they're structural, not data)
          if (oldDef.type !== "bloks") {
            fieldDeletions.push({ component: name, field: oldField });
          }
        }
        changed = true;
      }
    }

    // Fields in new but not in old → new fields (check if already handled as rename)
    for (const newField of newFields) {
      if (!oldFields.has(newField)) {
        const alreadyRenamed = fieldRenames.some(
          (r) => r.component === name && r.newField === newField,
        );
        if (!alreadyRenamed) {
          changed = true;
        }
      }
    }

    // Check for type changes on existing fields
    for (const field of oldFields) {
      if (newFields.has(field)) {
        const oldDef = oldComp.schema[field]!;
        const newDef = newComp.schema[field]!;
        if (oldDef.type !== newDef.type) {
          changed = true;
        }
      }
    }

    if (changed) {
      changedComponents.push(newComp);
    }
  }

  return {
    fieldRenames,
    fieldDeletions,
    removedComponents,
    changedComponents,
    newComponents,
  };
}

// ── Storyblok Management API helpers ──────────────────────────────────

async function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchExistingComponents(
  spaceId: string,
  token: string,
): Promise<Map<string, { id: number; name: string; schema: any }>> {
  const res = await fetch(`${MAPI_BASE}/spaces/${spaceId}/components`, {
    headers: { Authorization: token, "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(`Failed to fetch components: ${res.status}`);
  const data = await res.json();
  const map = new Map<string, { id: number; name: string; schema: any }>();
  for (const comp of data.components ?? []) {
    map.set(comp.name, { id: comp.id, name: comp.name, schema: comp.schema });
  }
  return map;
}

function derivedToStoryblokSchema(
  comp: DerivedComponent,
): Record<string, any> {
  const schema: Record<string, any> = {};
  for (const [fieldName, fieldDef] of Object.entries(comp.schema)) {
    const field: Record<string, any> = {
      type: fieldDef.type,
      pos: fieldDef.pos,
    };
    if (fieldDef.description) field.description = fieldDef.description;
    if (fieldDef.filetypes) field.filetypes = fieldDef.filetypes;
    if (fieldDef.type === "bloks" && fieldDef.restrict_components) {
      field.restrict_type = "";
      field.restrict_components = true;
      if (fieldDef.component_whitelist) {
        field.component_whitelist = fieldDef.component_whitelist.map((n) =>
          n.startsWith(SHARED_PREFIX) ? n : `${SHARED_PREFIX}${n}`,
        );
      }
    }
    if (fieldDef.type === "multilink") {
      field.allow_target_blank = true;
    }
    schema[fieldName] = field;
  }
  return schema;
}

/**
 * Pushes derived component definitions to Storyblok.
 * Creates new components and updates changed ones. Deletes removed ones.
 * All component names get the shared_ prefix.
 */
export async function pushDerivedComponents(
  diff: SchemaDiff,
  spaceId: string,
  token: string,
  dryRun = false,
): Promise<{ created: number; updated: number; deleted: number }> {
  const existing = await fetchExistingComponents(spaceId, token);
  let created = 0;
  let updated = 0;
  let deleted = 0;

  // Create or update new components (check if they already exist in Storyblok)
  for (const comp of diff.newComponents) {
    const prefixedName = `${SHARED_PREFIX}${comp.name}`;
    const existingComp = existing.get(prefixedName);
    const storyblokComp = {
      name: prefixedName,
      display_name: comp.display_name,
      is_root: comp.is_root,
      is_nestable: comp.is_nestable,
      schema: derivedToStoryblokSchema(comp),
    };

    if (existingComp) {
      // Already exists in Storyblok → update instead of create
      if (dryRun) {
        console.log(`  [dry-run] Would update (exists): ${prefixedName}`);
      } else {
        await sleep(DELAY_MS);
        const res = await fetch(
          `${MAPI_BASE}/spaces/${spaceId}/components/${existingComp.id}`,
          {
            method: "PUT",
            headers: { Authorization: token, "Content-Type": "application/json" },
            body: JSON.stringify({ component: storyblokComp }),
          },
        );
        if (!res.ok) {
          const err = await res.text();
          console.error(`  Failed to update ${prefixedName}: ${res.status} ${err}`);
        } else {
          console.log(`  Updated (exists): ${prefixedName}`);
          updated++;
        }
      }
    } else {
      if (dryRun) {
        console.log(`  [dry-run] Would create: ${prefixedName}`);
      } else {
        await sleep(DELAY_MS);
        const res = await fetch(`${MAPI_BASE}/spaces/${spaceId}/components`, {
          method: "POST",
          headers: { Authorization: token, "Content-Type": "application/json" },
          body: JSON.stringify({ component: storyblokComp }),
        });
        if (!res.ok) {
          const err = await res.text();
          console.error(`  Failed to create ${prefixedName}: ${res.status} ${err}`);
        } else {
          console.log(`  Created: ${prefixedName}`);
          created++;
        }
      }
    }
  }

  // Update changed components
  for (const comp of diff.changedComponents) {
    const prefixedName = `${SHARED_PREFIX}${comp.name}`;
    const existingComp = existing.get(prefixedName);
    if (!existingComp) {
      // Doesn't exist yet → create instead
      const storyblokComp = {
        name: prefixedName,
        display_name: comp.display_name,
        is_root: comp.is_root,
        is_nestable: comp.is_nestable,
        schema: derivedToStoryblokSchema(comp),
      };
      if (dryRun) {
        console.log(`  [dry-run] Would create (changed): ${prefixedName}`);
      } else {
        await sleep(DELAY_MS);
        const res = await fetch(`${MAPI_BASE}/spaces/${spaceId}/components`, {
          method: "POST",
          headers: { Authorization: token, "Content-Type": "application/json" },
          body: JSON.stringify({ component: storyblokComp }),
        });
        if (!res.ok) {
          const err = await res.text();
          console.error(`  Failed to create ${prefixedName}: ${res.status} ${err}`);
        } else {
          console.log(`  Created: ${prefixedName}`);
          created++;
        }
      }
      continue;
    }

    const storyblokComp = {
      name: prefixedName,
      display_name: comp.display_name,
      is_root: comp.is_root,
      is_nestable: comp.is_nestable,
      schema: derivedToStoryblokSchema(comp),
    };

    if (dryRun) {
      console.log(`  [dry-run] Would update: ${prefixedName}`);
    } else {
      await sleep(DELAY_MS);
      const res = await fetch(
        `${MAPI_BASE}/spaces/${spaceId}/components/${existingComp.id}`,
        {
          method: "PUT",
          headers: { Authorization: token, "Content-Type": "application/json" },
          body: JSON.stringify({ component: storyblokComp }),
        },
      );
      if (!res.ok) {
        const err = await res.text();
        console.error(`  Failed to update ${prefixedName}: ${res.status} ${err}`);
      } else {
        console.log(`  Updated: ${prefixedName}`);
        updated++;
      }
    }
  }

  // Delete removed components
  for (const name of diff.removedComponents) {
    const prefixedName = `${SHARED_PREFIX}${name}`;
    const existingComp = existing.get(prefixedName);
    if (!existingComp) continue;

    if (dryRun) {
      console.log(`  [dry-run] Would delete: ${prefixedName}`);
    } else {
      await sleep(DELAY_MS);
      const res = await fetch(
        `${MAPI_BASE}/spaces/${spaceId}/components/${existingComp.id}`,
        { method: "DELETE", headers: { Authorization: token } },
      );
      if (!res.ok) {
        const err = await res.text();
        console.error(`  Failed to delete ${prefixedName}: ${res.status} ${err}`);
      } else {
        console.log(`  Deleted: ${prefixedName}`);
        deleted++;
      }
    }
  }

  return { created, updated, deleted };
}

// ── Story data migration ──────────────────────────────────────────────

/**
 * Migrates existing story data when premade blok schemas change.
 * Handles field renames and deletions on stories that use the affected components.
 */
export async function migrateStoryData(
  diff: SchemaDiff,
  spaceId: string,
  token: string,
  dryRun = false,
): Promise<number> {
  // Collect which components need data migration
  const componentsToMigrate = new Set<string>();
  for (const r of diff.fieldRenames) componentsToMigrate.add(r.component);
  for (const d of diff.fieldDeletions) componentsToMigrate.add(d.component);
  // Also include stories with removed components (to clean up references)
  for (const c of diff.removedComponents) componentsToMigrate.add(c);

  if (componentsToMigrate.size === 0) return 0;

  // Build rename and deletion maps per component
  const renameMap = new Map<string, Map<string, string>>(); // component → oldField → newField
  const deleteMap = new Map<string, Set<string>>(); // component → fields to delete

  for (const r of diff.fieldRenames) {
    if (!renameMap.has(r.component)) renameMap.set(r.component, new Map());
    renameMap.get(r.component)!.set(r.oldField, r.newField);
  }
  for (const d of diff.fieldDeletions) {
    if (!deleteMap.has(d.component)) deleteMap.set(d.component, new Set());
    deleteMap.get(d.component)!.add(d.field);
  }

  // Fetch all stories (we need to search for ones containing these components)
  // Storyblok doesn't have a "search by component" API, so we fetch all stories
  // and filter client-side. For small spaces this is fine.
  const stories = await fetchAllStories(spaceId, token);
  let migratedCount = 0;

  for (const story of stories) {
    const content = story.content;
    if (!content) continue;

    let modified = false;

    // Walk the content tree
    walkAndMigrate(content, (node: any) => {
      if (!isObject(node)) return;
      const comp: string = node.component ?? "";
      // Strip shared_ prefix for matching
      const unprefixed = comp.replace(/^shared_/, "");

      // Handle renames
      const renames = renameMap.get(unprefixed);
      if (renames) {
        for (const [oldField, newField] of renames) {
          if (oldField in node && !(newField in node)) {
            node[newField] = node[oldField];
            delete node[oldField];
            modified = true;
          }
        }
      }

      // Handle deletions
      const deletions = deleteMap.get(unprefixed);
      if (deletions) {
        for (const field of deletions) {
          if (field in node) {
            delete node[field];
            modified = true;
          }
        }
      }
    });

    if (modified) {
      if (dryRun) {
        console.log(`  [dry-run] Would migrate story: ${story.full_slug} (id: ${story.id})`);
      } else {
        await sleep(DELAY_MS);
        const res = await fetch(
          `${MAPI_BASE}/spaces/${spaceId}/stories/${story.id}`,
          {
            method: "PUT",
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              story: { content: story.content },
              publish: 1,
            }),
          },
        );
        if (!res.ok) {
          const err = await res.text();
          console.error(
            `  Failed to migrate story ${story.full_slug}: ${res.status} ${err}`,
          );
        } else {
          console.log(`  Migrated story: ${story.full_slug}`);
          migratedCount++;
        }
      }
    }
  }

  return migratedCount;
}

function walkAndMigrate(
  node: unknown,
  visitor: (node: Record<string, any>) => void,
): void {
  if (Array.isArray(node)) {
    for (const item of node) {
      walkAndMigrate(item, visitor);
    }
  } else if (isObject(node)) {
    visitor(node);
    for (const value of Object.values(node)) {
      walkAndMigrate(value, visitor);
    }
  }
}

async function fetchAllStories(
  spaceId: string,
  token: string,
): Promise<any[]> {
  const stories: any[] = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    await sleep(DELAY_MS);
    const res = await fetch(
      `${MAPI_BASE}/spaces/${spaceId}/stories?per_page=${perPage}&page=${page}`,
      { headers: { Authorization: token } },
    );
    if (!res.ok) {
      throw new Error(`Failed to fetch stories: ${res.status}`);
    }
    const data = await res.json();
    const batch: any[] = data.stories ?? [];
    if (batch.length === 0) break;

    // The list endpoint doesn't include full content, fetch each individually
    for (const stub of batch) {
      await sleep(DELAY_MS);
      const storyRes = await fetch(
        `${MAPI_BASE}/spaces/${spaceId}/stories/${stub.id}`,
        { headers: { Authorization: token } },
      );
      if (storyRes.ok) {
        const storyData = await storyRes.json();
        stories.push(storyData.story);
      }
    }

    if (batch.length < perPage) break;
    page++;
  }

  return stories;
}

// ── Slug prefix helper ────────────────────────────────────────────────

/**
 * Derives the slug prefix from a section-builder slug.
 * "section-builder/case-studies-2" → "case_studies_2"
 */
export function slugToPrefix(fullSlug: string): string {
  return fullSlug.replace("section-builder/", "").replace(/-/g, "_");
}
