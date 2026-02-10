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
  ensureDerivedComponents,
  migrateStoryData,
  updatePageBodyWhitelist,
  slugToPrefix,
  type DerivedComponent,
} from "../../src/lib/derive-premade-schemas";
import { normalizeBuilderTemplate } from "../../src/lib/builder-template";

config({ path: path.join(process.cwd(), ".env") });

const DATABASE_URL = process.env.DATABASE_URL;
const SPACE_ID = process.env.STORYBLOK_SPACE_ID;
const TOKEN = process.env.STORYBLOK_PERSONAL_ACCESS_TOKEN;
const API_BASE = "https://mapi.storyblok.com/v1";
const DELAY_MS = 350;
const BUILDER_ROOT_COMPONENTS = new Set([
  "page",
  "element_builder_page",
  "form_builder_page",
]);

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
  const prefixes = ["section-builder/", "element-builder/", "form-builder/"];
  const storyList: any[] = [];
  for (const prefix of prefixes) {
    const listUrl = `${API_BASE}/spaces/${SPACE_ID}/stories?starts_with=${prefix}&per_page=100`;
    const listRes = await fetch(listUrl, {
      headers: { Authorization: TOKEN! },
    });
    if (!listRes.ok) {
      throw new Error(
        `Failed to list stories for ${prefix}: ${listRes.status} ${listRes.statusText}`,
      );
    }
    const listData = await listRes.json();
    storyList.push(...(listData.stories ?? []));
  }

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

interface StorySummary {
  slug: string;
  schemas: number;
  created: number;
  updated: number;
  deleted: number;
  migrated: number;
  published: boolean;
}

async function main() {
  console.log("[1/7] Fetching builder stories from Storyblok...");
  const stories = await fetchSectionBuilderStories();

  if (stories.length === 0) {
    console.log("  No builder stories found.");
    await client.end();
    return;
  }

  console.log(`  Found ${stories.length} builder stories.\n`);

  const summaries: StorySummary[] = [];

  for (let si = 0; si < stories.length; si++) {
    const story = stories[si]!;
    const slug = story.full_slug as string;
    const rootComponent = story.content?.component as string | undefined;
    if (rootComponent && !BUILDER_ROOT_COMPONENTS.has(rootComponent)) {
      const skipLabel = slug
        .replace("section-builder/", "")
        .replace("element-builder/", "")
        .replace("form-builder/", "");
      console.log(`── ${skipLabel} (${si + 1}/${stories.length}) ──`);
      console.log(
        `Skipping: unsupported root component "${rootComponent}"\n`,
      );
      continue;
    }
    const prefix = slugToPrefix(slug);
    const componentName = `${prefix}_section`;
    const label = slug
      .replace("section-builder/", "")
      .replace("element-builder/", "")
      .replace("form-builder/", "");

    console.log(`── ${label} (${si + 1}/${stories.length}) ──`);

    const summary: StorySummary = {
      slug: label,
      schemas: 0,
      created: 0,
      updated: 0,
      deleted: 0,
      migrated: 0,
      published: false,
    };

    // Extract template from page wrapper
    const template = normalizeBuilderTemplate(story.content);
    if (!template) {
      console.warn("  Skipping: no content\n");
      summaries.push(summary);
      continue;
    }

    // Step 2: Build section name map
    console.log("[2/7] Building section name map...");
    const nameMap = new Map<string, string>();
    buildSectionNameMap(template, prefix, true, nameMap);
    let mappingCount = 0;
    for (const [oldName, newName] of nameMap) {
      if (oldName !== newName) {
        console.log(`    "${oldName}" -> "${newName}"`);
        mappingCount++;
      }
    }
    if (mappingCount === 0) console.log("    All names already correct.");

    // Step 3: Migrate template
    console.log("[3/7] Migrating template...");
    migrateTemplate(template, prefix, nameMap);

    // Step 4: Derive premade blok schemas
    console.log("[4/7] Deriving premade blok schemas...");
    const newSchemas = derivePremadeBlokSchemas(template, prefix);
    summary.schemas = newSchemas.length;
    for (const comp of newSchemas) {
      const fields = Object.keys(comp.schema).join(", ");
      console.log(`    ${comp.name}: ${fields}`);
    }
    console.log(`  ${newSchemas.length} component(s) derived.`);

    // Derive old schemas from DB template for diffing
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

    // Step 5: Diff and push component changes
    console.log("[5/7] Pushing component definitions...");
    const diff = diffSchemas(oldSchemas, newSchemas);

    if (diff.fieldRenames.length > 0) {
      for (const r of diff.fieldRenames) {
        console.log(`    Rename: ${r.component}.${r.oldField} -> ${r.newField}`);
      }
    }
    if (diff.fieldDeletions.length > 0) {
      for (const d of diff.fieldDeletions) {
        console.log(`    Delete: ${d.component}.${d.field}`);
      }
    }
    if (diff.removedComponents.length > 0) {
      console.log("    Remove:", diff.removedComponents.join(", "));
    }

    const pushResult = await pushDerivedComponents(diff, SPACE_ID!, TOKEN!, dryRun);
    summary.created = pushResult.created;
    summary.updated = pushResult.updated;
    summary.deleted = pushResult.deleted;
    console.log(
      `  ${pushResult.created} new, ${pushResult.updated} updated, ${pushResult.deleted} deleted`,
    );

    // Ensure all derived schemas are in sync with Storyblok (safety net)
    if (!dryRun) {
      const synced = await ensureDerivedComponents(newSchemas, SPACE_ID!, TOKEN!);
      if (synced > 0) {
        console.log(`  [ensureSync] Synced ${synced} stale component(s)`);
      }
    }

    // Update page body whitelist
    const rootBlokName = `${prefix}_section`;
    if (newSchemas.some((c) => c.name === rootBlokName)) {
      console.log(`  Ensuring page body whitelist includes ${rootBlokName}...`);
      if (!dryRun) {
        await updatePageBodyWhitelist(rootBlokName, "add", SPACE_ID!, TOKEN!);
      } else {
        console.log(`  [dry-run] Would add shared_${rootBlokName} to page body whitelist`);
      }
    }

    // Remove deleted root bloks from page body whitelist
    for (const removedName of diff.removedComponents) {
      if (removedName.endsWith("_section")) {
        console.log(`  Removing ${removedName} from page body whitelist...`);
        if (!dryRun) {
          await updatePageBodyWhitelist(removedName, "remove", SPACE_ID!, TOKEN!);
        }
      }
    }

    // Migrate story data if needed
    if (diff.fieldRenames.length > 0 || diff.fieldDeletions.length > 0) {
      console.log("  Migrating story data...");
      const migrated = await migrateStoryData(diff, SPACE_ID!, TOKEN!, dryRun);
      summary.migrated = migrated;
      console.log(`  ${migrated} stories migrated.`);
    }

    // Step 6: Save to Storyblok
    console.log("[6/7] Saving story to Storyblok...");
    if (dryRun) {
      console.log("  [dry-run] Would PUT + publish");
    } else {
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
        console.error(`  Failed: ${putRes.status} ${err}`);
      } else {
        summary.published = true;
        console.log("  Published.");
      }
    }

    // Step 7: Update DB template
    console.log("[7/7] Updating DB template...");
    if (dryRun) {
      console.log("  [dry-run] Would update");
    } else {
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
      console.log(`  Saved: ${componentName}`);
    }

    summaries.push(summary);
    console.log();
  }

  // ── Summary ──
  console.log("=".repeat(60));
  console.log("Summary:");
  console.log("-".repeat(60));
  const nameCol = Math.max(...summaries.map((s) => s.slug.length), 10);
  console.log(
    "  " +
      "Section".padEnd(nameCol + 2) +
      "Schemas  New  Upd  Del  Migrated  Published",
  );
  for (const s of summaries) {
    console.log(
      "  " +
        s.slug.padEnd(nameCol + 2) +
        String(s.schemas).padStart(7) +
        String(s.created).padStart(5) +
        String(s.updated).padStart(5) +
        String(s.deleted).padStart(5) +
        String(s.migrated).padStart(10) +
        (s.published ? "        yes" : dryRun ? "    dry-run" : "         no"),
    );
  }
  console.log("=".repeat(60));
  console.log("Done!");
  await client.end();
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
