#!/usr/bin/env bun
/**
 * Migrate legacy border color field to theme-aware fields.
 *
 * - Moves `border_color` -> `border_color_light` when light is empty
 * - Removes legacy `border_color`
 * - Publishes updated stories
 *
 * Usage (from apps/gateway):
 *   bun run storyblok:migrate:border-color-theme                # dry-run (default)
 *   bun run storyblok:migrate:border-color-theme -- --apply     # apply changes
 */

import { config } from "dotenv";
import * as path from "path";

config({ path: path.join(process.cwd(), ".env") });

const SPACE_ID = process.env.STORYBLOK_SPACE_ID;
const TOKEN = process.env.STORYBLOK_PERSONAL_ACCESS_TOKEN;
const API_BASE = "https://mapi.storyblok.com/v1";
const DELAY_MS = 300;

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

function isObject(value: unknown): value is Record<string, any> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchAllStories(): Promise<any[]> {
  const stories: any[] = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    await sleep(DELAY_MS);
    const res = await fetch(
      `${API_BASE}/spaces/${SPACE_ID}/stories?per_page=${perPage}&page=${page}`,
      { headers: { Authorization: TOKEN! } },
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch stories page ${page}: ${res.status}`);
    }

    const data = await res.json();
    const pageStories: any[] = data.stories ?? [];
    stories.push(...pageStories);

    if (pageStories.length < perPage) break;
    page++;
  }

  return stories;
}

async function fetchStory(storyId: number): Promise<any | null> {
  await sleep(DELAY_MS);
  const res = await fetch(`${API_BASE}/spaces/${SPACE_ID}/stories/${storyId}`, {
    headers: { Authorization: TOKEN! },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.story ?? null;
}

function hasMeaningfulValue(value: unknown): boolean {
  return !(value === undefined || value === null || value === "");
}

function migrateNode(node: unknown): number {
  if (Array.isArray(node)) {
    let changed = 0;
    for (const item of node) changed += migrateNode(item);
    return changed;
  }

  if (!isObject(node)) return 0;

  let changed = 0;

  const hasLegacyBorderColor = "border_color" in node;

  // Migrate any object carrying the legacy field to avoid missing nested content.
  if (hasLegacyBorderColor) {
    const legacyValue = node.border_color;
    const lightValue = node.border_color_light;

    if (hasMeaningfulValue(legacyValue) && !hasMeaningfulValue(lightValue)) {
      node.border_color_light = legacyValue;
      changed++;
    }

    delete node.border_color;
    changed++;
  }

  for (const value of Object.values(node)) {
    changed += migrateNode(value);
  }

  return changed;
}

async function main() {
  console.log("Fetching stories...");
  const storyStubs = await fetchAllStories();
  console.log(`Found ${storyStubs.length} stories.\n`);

  let scanned = 0;
  let changedStories = 0;
  let changedNodes = 0;

  for (const stub of storyStubs) {
    scanned++;
    const slug = String(stub.full_slug || stub.slug || stub.id);
    const story = await fetchStory(stub.id);
    if (!story?.content) {
      console.log(`[${scanned}/${storyStubs.length}] Skipping ${slug}: no content`);
      continue;
    }

    const migratedCount = migrateNode(story.content);
    if (migratedCount === 0) {
      continue;
    }

    changedStories++;
    changedNodes += migratedCount;

    if (dryRun) {
      console.log(
        `[${scanned}/${storyStubs.length}] [dry-run] Would migrate ${slug} (${migratedCount} updates)`,
      );
      continue;
    }

    await sleep(DELAY_MS);
    const putRes = await fetch(`${API_BASE}/spaces/${SPACE_ID}/stories/${story.id}`, {
      method: "PUT",
      headers: {
        Authorization: TOKEN!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        story: { content: story.content },
        publish: 1,
      }),
    });

    if (!putRes.ok) {
      const errorText = await putRes.text();
      console.error(
        `[${scanned}/${storyStubs.length}] Failed ${slug}: ${putRes.status} ${errorText}`,
      );
      continue;
    }

    console.log(
      `[${scanned}/${storyStubs.length}] Migrated ${slug} (${migratedCount} updates)`,
    );
  }

  console.log("\nDone.");
  console.log(`Stories scanned: ${scanned}`);
  console.log(`Stories changed: ${changedStories}`);
  console.log(`Field updates: ${changedNodes}`);
}

main().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
