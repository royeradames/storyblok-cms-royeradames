#!/usr/bin/env bun
/**
 * Migrate section-builder stories from flat fields to data_mapping bloks.
 *
 * This script:
 * 1. Fetches all section-builder stories from Storyblok
 * 2. Converts flat builder metadata fields to nested data_mapping bloks
 * 3. Updates data_section_name and builder_section to use premade blok component names
 * 4. Derives premade blok schemas from the migrated template
 * 5. Pushes changed blok definitions to Storyblok (create/update/delete)
 * 6. PUTs updated story content back to Storyblok
 * 7. Re-seeds DB templates
 *
 * Usage (from apps/gateway):
 *   bun run storyblok:migrate:data-mapping              # dry-run (default)
 *   bun run storyblok:migrate:data-mapping -- --apply    # actually save changes
 *
 * Requires: DATABASE_URL, STORYBLOK_SPACE_ID, STORYBLOK_PERSONAL_ACCESS_TOKEN
 */

import { config } from "dotenv";
import * as path from "path";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { sectionTemplates } from "../../src/db/schema/section-templates";
import {
  derivePremadeBlokSchemas,
  diffSchemas,
  pushDerivedComponents,
  migrateStoryData,
  slugToPrefix,
  type DerivedComponent,
} from "../../src/lib/derive-premade-schemas";

config({ path: path.join(process.cwd(), ".env") });

const DATABASE_URL = process.env.DATABASE_URL;
const SPACE_ID = process.env.STORYBLOK_SPACE_ID;
const TOKEN = process.env.STORYBLOK_PERSONAL_ACCESS_TOKEN;
const API_BASE = "https://mapi.storyblok.com/v1";
const DELAY_MS = 350;

if (!DATABASE_URL) {
  console.error("Missing DATABASE_URL in .env");
  process.exit(1);
}
if (!SPACE_ID || !TOKEN) {
  console.error(
    "Missing STORYBLOK_SPACE_ID or STORYBLOK_PERSONAL_ACCESS_TOKEN in .env",
  );
  process.exit(1);
}

const dryRun = !process.argv.includes("--apply");
if (dryRun) {
  console.log("=== DRY RUN (pass --apply to save changes) ===\n");
}

const client = postgres(DATABASE_URL, { prepare: false });
const db = drizzle(client);

// ── Helpers ───────────────────────────────────────────────────────────

function isObject(value: unknown): value is Record<string, any> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchSectionBuilderStories(): Promise<any[]> {
  const listUrl = `${API_BASE}/spaces/${SPACE_ID}/stories?starts_with=section-builder/&per_page=100`;
  const listRes = await fetch(listUrl, {
    headers: { Authorization: TOKEN! },
  });
  if (!listRes.ok) {
    throw new Error(`Failed to list stories: ${listRes.status} ${listRes.statusText}`);
  }
  const listData = await listRes.json();
  const storyList: any[] = listData.stories ?? [];

  const fullStories: any[] = [];
  for (const stub of storyList) {
    await sleep(DELAY_MS);
    const storyUrl = `${API_BASE}/spaces/${SPACE_ID}/stories/${stub.id}`;
    const storyRes = await fetch(storyUrl, {
      headers: { Authorization: TOKEN! },
    });
    if (!storyRes.ok) {
      console.warn(`  Failed to fetch story ${stub.id} (${stub.full_slug}): ${storyRes.status}`);
      continue;
    }
    const storyData = await storyRes.json();
    fullStories.push(storyData.story);
  }
  return fullStories;
}

// ── Template migration ────────────────────────────────────────────────

/**
 * Fix double-prefixed names that may have been introduced by a previous run.
 * "case_studies_2_case_studies_2_study" → "case_studies_2_study"
 */
function fixDoublePrefix(name: string, prefix: string): string {
  const double = `${prefix}_${prefix}_`;
  if (name.startsWith(double)) {
    return name.replace(double, `${prefix}_`);
  }
  return name;
}

/**
 * First pass: collect all data_section_name values and build an old→new name map.
 * The root section gets renamed to {prefix}_section.
 * Other sections get prefixed: "study" → "{prefix}_study".
 * Already-prefixed names (from a previous migration run) are left as-is.
 * Double-prefixed names (from buggy runs) are corrected.
 */
function buildSectionNameMap(
  node: any,
  prefix: string,
  isRoot: boolean,
  nameMap: Map<string, string>,
): void {
  if (!isObject(node)) return;

  if (typeof node.data_section_name === "string" && node.data_section_name) {
    let oldName = node.data_section_name;

    // Fix double prefix from previous buggy runs
    const fixed = fixDoublePrefix(oldName, prefix);
    if (fixed !== oldName) {
      nameMap.set(oldName, fixed);
      oldName = fixed;
    }

    if (!nameMap.has(oldName)) {
      // Already correctly prefixed → identity mapping (leave as-is)
      if (oldName.startsWith(prefix + "_")) {
        nameMap.set(oldName, oldName);
      } else if (isRoot) {
        nameMap.set(oldName, `${prefix}_section`);
      } else {
        nameMap.set(oldName, `${prefix}_${oldName}`);
      }
    }
  }

  // Recurse
  for (const [key, value] of Object.entries(node)) {
    if (key === "_editable" || key === "data_mapping") continue;
    if (Array.isArray(value)) {
      for (const item of value) {
        if (isObject(item) && typeof item.component === "string") {
          buildSectionNameMap(item, prefix, false, nameMap);
        }
      }
    }
  }
}

/**
 * Remap a section name using the name map.
 * Falls back to prefixing if not already prefixed.
 * Also fixes double-prefixed names.
 */
function remapSectionName(
  oldName: string,
  prefix: string,
  nameMap: Map<string, string>,
): string {
  // Fix double prefix first
  const fixed = fixDoublePrefix(oldName, prefix);
  if (fixed !== oldName && nameMap.has(fixed)) return nameMap.get(fixed)!;
  if (fixed !== oldName) return fixed;

  if (nameMap.has(oldName)) return nameMap.get(oldName)!;
  if (oldName.startsWith(prefix + "_")) return oldName; // already prefixed
  return `${prefix}_${oldName}`;
}

/**
 * Second pass: walks the template tree and:
 * 1. Converts flat fields to data_mapping bloks
 * 2. Updates section names using the name map
 */
function migrateTemplate(
  node: any,
  prefix: string,
  nameMap: Map<string, string>,
): void {
  if (!isObject(node)) return;

  // Update data_section_name (skip empty strings)
  if (typeof node.data_section_name === "string" && node.data_section_name) {
    const oldName = node.data_section_name;
    const newName = remapSectionName(oldName, prefix, nameMap);
    if (oldName !== newName) {
      node.data_section_name = newName;
      console.log(`    data_section_name: "${oldName}" → "${newName}"`);
    }
  }

  // Convert flat fields to data_mapping
  const builderSection = node.builder_section ?? node.premade_section;
  const premadeField = node.premade_field;
  const builderField = node.builder_field;

  if (builderSection && premadeField && builderField) {
    const newBuilderSection = remapSectionName(builderSection, prefix, nameMap);

    node.data_mapping = [
      {
        _uid: crypto.randomUUID(),
        component: "shared_builder_data_mapping",
        builder_section: newBuilderSection,
        premade_field: premadeField,
        builder_field: builderField,
      },
    ];

    console.log(
      `    Converted: builder_section="${builderSection}" → "${newBuilderSection}", ` +
        `premade_field="${premadeField}", builder_field="${builderField}" → data_mapping blok`,
    );

    // Delete old flat fields
    delete node.builder_section;
    delete node.premade_section;
    delete node.premade_field;
    delete node.builder_field;
    delete node.data_entry_field;
  } else {
    // Clean up any partial flat fields
    if (node.builder_section) delete node.builder_section;
    if (node.premade_section) delete node.premade_section;
    if (node.premade_field) delete node.premade_field;
    if (node.builder_field) delete node.builder_field;
    if (node.data_entry_field) delete node.data_entry_field;
  }

  // Also update builder_section inside existing data_mapping entries
  if (Array.isArray(node.data_mapping)) {
    for (const mapping of node.data_mapping) {
      if (isObject(mapping) && typeof mapping.builder_section === "string") {
        const oldVal = mapping.builder_section;
        const newVal = remapSectionName(oldVal, prefix, nameMap);
        if (oldVal !== newVal) {
          mapping.builder_section = newVal;
          console.log(
            `    data_mapping.builder_section: "${oldVal}" → "${newVal}"`,
          );
        }
      }
    }
  }

  // Keys that should not be recursed into (non-blok structural data)
  const skipKeys = new Set([
    "_editable",
    "data_mapping",
    "color_dark",
    "color_light",
    "link",
  ]);

  // Recurse into child bloks and containers
  for (const [key, value] of Object.entries(node)) {
    if (skipKeys.has(key)) continue;

    if (Array.isArray(value)) {
      for (const item of value) {
        if (isObject(item) && typeof item.component === "string") {
          migrateTemplate(item, prefix, nameMap);
        }
      }
    }
  }
}

// ── Main ──────────────────────────────────────────────────────────────

async function main() {
  console.log("Fetching section-builder stories from Storyblok...\n");
  const stories = await fetchSectionBuilderStories();

  if (stories.length === 0) {
    console.log("No section-builder stories found.");
    await client.end();
    return;
  }

  console.log(`Found ${stories.length} section-builder stories.\n`);

  for (const story of stories) {
    const slug = story.full_slug as string;
    const prefix = slugToPrefix(slug);
    const componentName = `${prefix}_section`;

    console.log(`── ${slug} (prefix: ${prefix}) ──`);

    // Extract template from page wrapper
    const template = story.content?.body?.[0] ?? story.content;
    if (!template) {
      console.warn(`  Skipping: no content\n`);
      continue;
    }

    // Step 1: Build section name map, then migrate
    console.log("  Building section name map...");
    const nameMap = new Map<string, string>();
    buildSectionNameMap(template, prefix, true, nameMap);
    for (const [oldName, newName] of nameMap) {
      console.log(`    "${oldName}" → "${newName}"`);
    }

    console.log("  Migrating template...");
    migrateTemplate(template, prefix, nameMap);

    // Step 2: Derive premade blok schemas from the migrated template
    console.log("\n  Deriving premade blok schemas...");
    const newSchemas = derivePremadeBlokSchemas(template, prefix);
    for (const comp of newSchemas) {
      const fields = Object.keys(comp.schema).join(", ");
      console.log(`    ${comp.name}: ${fields}`);
    }

    // Step 3: Try to derive old schemas from DB template for diffing
    let oldSchemas: DerivedComponent[] = [];
    const existing = await db
      .select()
      .from(sectionTemplates)
      .where(eq(sectionTemplates.slug, slug))
      .limit(1);

    if (existing.length > 0 && existing[0]!.template) {
      try {
        oldSchemas = derivePremadeBlokSchemas(existing[0]!.template as any, prefix);
      } catch {
        console.log("    (could not derive old schemas, treating as new)");
      }
    }

    // Step 4: Diff and push component changes
    console.log("\n  Diffing schemas...");
    const diff = diffSchemas(oldSchemas, newSchemas);

    if (diff.fieldRenames.length > 0) {
      console.log("    Renames:");
      for (const r of diff.fieldRenames) {
        console.log(`      ${r.component}.${r.oldField} → ${r.newField}`);
      }
    }
    if (diff.fieldDeletions.length > 0) {
      console.log("    Deletions:");
      for (const d of diff.fieldDeletions) {
        console.log(`      ${d.component}.${d.field}`);
      }
    }
    if (diff.removedComponents.length > 0) {
      console.log("    Removed components:", diff.removedComponents.join(", "));
    }
    if (
      diff.changedComponents.length === 0 &&
      diff.newComponents.length === 0 &&
      diff.removedComponents.length === 0
    ) {
      console.log("    No schema changes detected.");
    }

    console.log("\n  Pushing component definitions...");
    const pushResult = await pushDerivedComponents(diff, SPACE_ID!, TOKEN!, dryRun);
    console.log(
      `    Created: ${pushResult.created}, Updated: ${pushResult.updated}, Deleted: ${pushResult.deleted}`,
    );

    // Step 5: Migrate story data if needed
    if (diff.fieldRenames.length > 0 || diff.fieldDeletions.length > 0) {
      console.log("\n  Migrating story data...");
      const migrated = await migrateStoryData(diff, SPACE_ID!, TOKEN!, dryRun);
      console.log(`    Stories migrated: ${migrated}`);
    }

    // Step 6: PUT updated template back to Storyblok
    if (dryRun) {
      console.log(`\n  [dry-run] Would PUT updated story content for ${slug}`);
    } else {
      console.log(`\n  Saving updated story content...`);
      // Update the body[0] in the original story content
      if (story.content.body?.[0]) {
        story.content.body[0] = template;
      }
      await sleep(DELAY_MS);
      const putRes = await fetch(
        `${API_BASE}/spaces/${SPACE_ID}/stories/${story.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: TOKEN!,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ story: { content: story.content }, publish: 1 }),
        },
      );
      if (!putRes.ok) {
        const err = await putRes.text();
        console.error(`  Failed to save story: ${putRes.status} ${err}`);
      } else {
        console.log(`  Saved: ${slug}`);
      }
    }

    // Step 7: Update DB template
    if (dryRun) {
      console.log(`  [dry-run] Would update DB template for ${slug}`);
    } else {
      console.log("  Updating DB template...");
      if (existing.length > 0) {
        await db
          .update(sectionTemplates)
          .set({ component: componentName, template, updatedAt: new Date() })
          .where(eq(sectionTemplates.slug, slug));
      } else {
        await db
          .insert(sectionTemplates)
          .values({ slug, component: componentName, template });
      }
      console.log(`  DB updated: ${slug} → ${componentName}`);
    }

    console.log();
  }

  console.log("Done!");
  await client.end();
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
