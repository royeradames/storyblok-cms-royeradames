#!/usr/bin/env bun
/**
 * Canonical premade component key migration.
 *
 * Aligns builder-derived component naming across:
 * - DB section_templates.component
 * - Storyblok component definitions (shared_* names)
 * - Storyblok story content references
 *
 * Usage:
 *   bun run storyblok:migrate:premade-component-keys           # dry-run
 *   bun run storyblok:migrate:premade-component-keys -- --apply
 */

import { config } from "dotenv";
import * as path from "path";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { sectionTemplates } from "../../src/db/schema";
import {
  normalizeBuilderTemplate,
  resolveTemplateComponentName,
  slugToBuilderPrefix,
  derivePrefixFromComponentName,
} from "../../src/lib/builder-template";
import {
  derivePremadeBlokSchemas,
  ensureDerivedComponents,
  updatePageBodyWhitelist,
} from "../../src/lib/derive-premade-schemas";

config({ path: path.join(process.cwd(), ".env") });

const DATABASE_URL = process.env.DATABASE_URL;
const SPACE_ID = process.env.STORYBLOK_SPACE_ID;
const TOKEN = process.env.STORYBLOK_PERSONAL_ACCESS_TOKEN;
const API_BASE = "https://mapi.storyblok.com/v1";
const SHARED_PREFIX = "shared_";
const DELAY_MS = 350;
const dryRun = !process.argv.includes("--apply");

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

const sqlClient = postgres(DATABASE_URL, { prepare: false });
const db = drizzle(sqlClient);

type StoryblokStory = {
  id: number;
  full_slug: string;
  content: any;
  published?: boolean;
};

type TemplateChange = {
  slug: string;
  oldComponent: string;
  newComponent: string;
};

type StoryblokComponent = {
  id: number;
  name: string;
  display_name?: string;
  is_root?: boolean;
  is_nestable?: boolean;
  schema?: Record<string, any>;
};

function isObject(value: unknown): value is Record<string, any> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchAllStories(spaceId: string, token: string): Promise<any[]> {
  const all: any[] = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const res = await fetch(
      `${API_BASE}/spaces/${spaceId}/stories?per_page=${perPage}&page=${page}`,
      { headers: { Authorization: token } },
    );
    if (!res.ok) {
      throw new Error(
        `Failed to fetch stories page ${page}: ${res.status} ${res.statusText}`,
      );
    }
    const data = await res.json();
    const stories: any[] = data.stories ?? [];
    all.push(...stories);
    if (stories.length < perPage) break;
    page++;
    await sleep(DELAY_MS);
  }

  return all;
}

async function fetchStoryById(
  spaceId: string,
  token: string,
  id: number,
): Promise<StoryblokStory | null> {
  const res = await fetch(`${API_BASE}/spaces/${spaceId}/stories/${id}`, {
    headers: { Authorization: token },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.story ?? null;
}

async function fetchStoryblokComponents(
  spaceId: string,
  token: string,
): Promise<Map<string, StoryblokComponent>> {
  const res = await fetch(`${API_BASE}/spaces/${spaceId}/components`, {
    headers: { Authorization: token, "Content-Type": "application/json" },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch components: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  const map = new Map<string, StoryblokComponent>();
  for (const component of data.components ?? []) {
    map.set(component.name, component);
  }
  return map;
}

function walkAndReplaceComponents(
  node: unknown,
  renameMap: Map<string, string>,
): boolean {
  let modified = false;

  const visit = (value: unknown): void => {
    if (Array.isArray(value)) {
      for (const item of value) visit(item);
      return;
    }

    if (!isObject(value)) return;

    if (typeof value.component === "string") {
      const replacement = renameMap.get(value.component);
      if (replacement && replacement !== value.component) {
        value.component = replacement;
        modified = true;
      }
    }

    for (const child of Object.values(value)) {
      visit(child);
    }
  };

  visit(node);
  return modified;
}

async function renameStoryblokComponent(
  spaceId: string,
  token: string,
  components: Map<string, StoryblokComponent>,
  oldName: string,
  newName: string,
): Promise<"renamed" | "skipped_missing" | "skipped_exists"> {
  const oldComp = components.get(oldName);
  if (!oldComp) return "skipped_missing";
  if (components.has(newName)) return "skipped_exists";

  if (dryRun) return "renamed";

  await sleep(DELAY_MS);
  const res = await fetch(`${API_BASE}/spaces/${spaceId}/components/${oldComp.id}`, {
    method: "PUT",
    headers: { Authorization: token, "Content-Type": "application/json" },
    body: JSON.stringify({
      component: {
        name: newName,
        display_name: oldComp.display_name ?? newName,
        is_root: oldComp.is_root ?? false,
        is_nestable: oldComp.is_nestable ?? true,
        schema: oldComp.schema ?? {},
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to rename ${oldName} -> ${newName}: ${res.status} ${err}`);
  }

  components.delete(oldName);
  components.set(newName, { ...oldComp, name: newName });
  return "renamed";
}

async function main() {
  console.log(
    dryRun
      ? "=== DRY RUN: premade component key migration ==="
      : "=== APPLY: premade component key migration ===",
  );

  const rows = await db.select().from(sectionTemplates);
  const changes: TemplateChange[] = [];

  for (const row of rows) {
    const slugPrefix = slugToBuilderPrefix(row.slug);
    const canonical = resolveTemplateComponentName(row.template, slugPrefix);
    if (canonical !== row.component) {
      changes.push({
        slug: row.slug,
        oldComponent: row.component,
        newComponent: canonical,
      });
    }
  }

  if (changes.length === 0) {
    console.log("No template component key changes required.");
    await sqlClient.end();
    return;
  }

  console.log(`Found ${changes.length} template key changes:`);
  for (const change of changes) {
    console.log(`  ${change.slug}: ${change.oldComponent} -> ${change.newComponent}`);
  }

  const duplicateTargets = new Map<string, string[]>();
  for (const change of changes) {
    const list = duplicateTargets.get(change.newComponent) ?? [];
    list.push(change.slug);
    duplicateTargets.set(change.newComponent, list);
  }
  const collisions = [...duplicateTargets.entries()].filter(
    ([, slugs]) => slugs.length > 1,
  );
  if (collisions.length > 0) {
    console.error("Aborting due to canonical key collisions:");
    for (const [component, slugs] of collisions) {
      console.error(`  ${component}: ${slugs.join(", ")}`);
    }
    await sqlClient.end();
    process.exit(1);
  }

  const componentRenameMap = new Map<string, string>();
  for (const change of changes) {
    componentRenameMap.set(
      `${SHARED_PREFIX}${change.oldComponent}`,
      `${SHARED_PREFIX}${change.newComponent}`,
    );
  }

  if (!dryRun) {
    console.log("\n[1/5] Updating section_templates DB keys...");
    for (const change of changes) {
      await db
        .update(sectionTemplates)
        .set({ component: change.newComponent, updatedAt: new Date() })
        .where(eq(sectionTemplates.slug, change.slug));
      console.log(`  Updated DB: ${change.slug} -> ${change.newComponent}`);
    }
  } else {
    console.log("\n[1/5] Would update section_templates DB keys");
  }

  console.log("\n[2/5] Renaming Storyblok component definitions...");
  const components = await fetchStoryblokComponents(SPACE_ID!, TOKEN!);
  for (const change of changes) {
    const oldName = `${SHARED_PREFIX}${change.oldComponent}`;
    const newName = `${SHARED_PREFIX}${change.newComponent}`;
    const status = await renameStoryblokComponent(
      SPACE_ID!,
      TOKEN!,
      components,
      oldName,
      newName,
    );
    if (status === "renamed") {
      console.log(
        dryRun
          ? `  [dry-run] Would rename: ${oldName} -> ${newName}`
          : `  Renamed: ${oldName} -> ${newName}`,
      );
    } else if (status === "skipped_exists") {
      console.log(`  Skipped (target exists): ${oldName} -> ${newName}`);
    } else {
      console.log(`  Skipped (source missing): ${oldName}`);
    }
  }

  console.log("\n[3/5] Migrating Storyblok story component references...");
  const stories = await fetchAllStories(SPACE_ID!, TOKEN!);
  let updatedStories = 0;
  for (const storyStub of stories) {
    const story = await fetchStoryById(SPACE_ID!, TOKEN!, storyStub.id);
    if (!story?.content) continue;

    const modified = walkAndReplaceComponents(story.content, componentRenameMap);
    if (!modified) continue;

    if (dryRun) {
      console.log(`  [dry-run] Would update story refs: ${story.full_slug}`);
      continue;
    }

    await sleep(DELAY_MS);
    const res = await fetch(`${API_BASE}/spaces/${SPACE_ID}/stories/${story.id}`, {
      method: "PUT",
      headers: { Authorization: TOKEN!, "Content-Type": "application/json" },
      body: JSON.stringify({
        story: { content: story.content },
        publish: 1,
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error(`  Failed story update ${story.full_slug}: ${res.status} ${err}`);
      continue;
    }
    updatedStories++;
    console.log(`  Updated story refs: ${story.full_slug}`);
  }

  console.log(
    dryRun
      ? "\n[4/5] Would re-sync derived schemas and whitelist"
      : "\n[4/5] Re-syncing derived schemas and whitelist...",
  );

  for (const change of changes) {
    const storyMatch = stories.find((s) => s.full_slug === change.slug);
    const story = storyMatch?.content
      ? (storyMatch as StoryblokStory)
      : storyMatch
        ? await fetchStoryById(SPACE_ID!, TOKEN!, storyMatch.id)
        : null;

    if (!story?.content) continue;

    const template = normalizeBuilderTemplate(story.content);
    const canonical = resolveTemplateComponentName(
      template,
      slugToBuilderPrefix(change.slug),
    );
    const derivationPrefix = derivePrefixFromComponentName(canonical);
    const schemas = derivePremadeBlokSchemas(template, derivationPrefix);

    if (dryRun) {
      console.log(`  [dry-run] Would ensure schemas: ${change.slug}`);
      continue;
    }

    await ensureDerivedComponents(schemas, SPACE_ID!, TOKEN!);

    if (schemas.some((schema) => schema.name === canonical)) {
      await updatePageBodyWhitelist(canonical, "add", SPACE_ID!, TOKEN!);
    }
    await updatePageBodyWhitelist(change.oldComponent, "remove", SPACE_ID!, TOKEN!);
  }

  console.log(
    dryRun
      ? "\n[5/5] Dry-run complete. Re-run with --apply to execute."
      : `\n[5/5] Migration complete. Updated stories: ${updatedStories}`,
  );

  await sqlClient.end();
}

main().catch(async (err) => {
  console.error("Premade component key migration failed:", err);
  await sqlClient.end();
  process.exit(1);
});
