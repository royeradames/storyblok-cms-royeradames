#!/usr/bin/env bun
/**
 * Migrate Flex Container content: copy `options` → `styles` and remove `options`.
 *
 * After renaming the Flex field from "options" to "styles" in the schema, existing
 * story content still has data under `options`. This script walks all stories,
 * finds any shared_shadcn_flex blocks with `options`, copies to `styles`, and
 * removes `options`, then saves the story.
 *
 * Loads STORYBLOK_SPACE_ID and STORYBLOK_PERSONAL_ACCESS_TOKEN from apps/gateway/.env
 *
 * Usage (from apps/gateway):
 *   bun run storyblok:migrate-flex-options-to-styles
 */

import { config } from "dotenv";
import * as path from "path";

config({ path: path.join(process.cwd(), ".env") });

const SPACE_ID = process.env.STORYBLOK_SPACE_ID;
const TOKEN = process.env.STORYBLOK_PERSONAL_ACCESS_TOKEN;
const API_BASE = "https://mapi.storyblok.com/v1";
const FLEX_COMPONENT = "shared_shadcn_flex";
const DELAY_MS = 400;

interface Story {
  id: number;
  name: string;
  slug: string;
  content?: Record<string, unknown>;
  [key: string]: unknown;
}

/**
 * Recursively walk content and mutate: for any object with component === FLEX_COMPONENT
 * and own property "options", set styles = options and delete options.
 * Returns true if any change was made.
 */
function migrateInPlace(obj: unknown): boolean {
  if (obj === null || typeof obj !== "object") return false;
  let changed = false;

  if (Array.isArray(obj)) {
    for (const item of obj) changed = migrateInPlace(item) || changed;
    return changed;
  }

  const o = obj as Record<string, unknown>;
  if (o.component === FLEX_COMPONENT && Object.prototype.hasOwnProperty.call(o, "options")) {
    o.styles = o.options;
    delete o.options;
    changed = true;
  }

  for (const value of Object.values(o)) {
    changed = migrateInPlace(value) || changed;
  }
  return changed;
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchAllStoryIds(): Promise<{ id: number; name: string; slug: string }[]> {
  const stories: { id: number; name: string; slug: string }[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const url = `${API_BASE}/spaces/${SPACE_ID}/stories?per_page=100&page=${page}`;
    const res = await fetch(url, {
      headers: { Authorization: TOKEN!, "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error(`List stories failed: ${res.status} ${res.statusText}`);
    const data = (await res.json()) as { stories?: Story[] };
    const list = data.stories ?? [];
    for (const s of list) stories.push({ id: s.id, name: s.name, slug: s.slug });
    hasMore = list.length === 100;
    page++;
    if (hasMore) await sleep(DELAY_MS);
  }
  return stories;
}

async function fetchStory(id: number): Promise<Story> {
  const res = await fetch(`${API_BASE}/spaces/${SPACE_ID}/stories/${id}`, {
    headers: { Authorization: TOKEN!, "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(`Fetch story ${id} failed: ${res.status}`);
  return (await res.json()).story as Story;
}

async function updateStory(id: number, story: Story): Promise<void> {
  const res = await fetch(`${API_BASE}/spaces/${SPACE_ID}/stories/${id}`, {
    method: "PUT",
    headers: { Authorization: TOKEN!, "Content-Type": "application/json" },
    body: JSON.stringify({ story }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Update story ${id} failed: ${res.status} - ${text}`);
  }
}

async function main() {
  console.log("🚀 Migrate Flex Container: options → styles\n");

  if (!SPACE_ID) {
    console.error("❌ STORYBLOK_SPACE_ID not set in .env");
    process.exit(1);
  }
  if (!TOKEN) {
    console.error("❌ STORYBLOK_PERSONAL_ACCESS_TOKEN not set in .env");
    process.exit(1);
  }

  const storyIds = await fetchAllStoryIds();
  console.log(`📄 Found ${storyIds.length} stories\n`);

  let updated = 0;
  let errors = 0;

  for (let i = 0; i < storyIds.length; i++) {
    const { id, name, slug } = storyIds[i]!;
    try {
      const story = await fetchStory(id);
      const content = story.content;
      if (!content) {
        await sleep(DELAY_MS);
        continue;
      }
      const changed = migrateInPlace(content);
      if (changed) {
        await updateStory(id, story);
        updated++;
        console.log(`[${i + 1}/${storyIds.length}] Updated: ${name} (/${slug})`);
      }
    } catch (err) {
      errors++;
      console.error(`[${i + 1}/${storyIds.length}] Error ${name} (id ${id}):`, (err as Error).message);
    }
    await sleep(DELAY_MS);
  }

  console.log("\n" + "─".repeat(50));
  console.log(`   Updated: ${updated}  Errors: ${errors}  Total: ${storyIds.length}\n`);
  if (errors > 0) process.exit(1);
}

main().catch((err) => {
  console.error("\n❌ Fatal:", (err as Error).message);
  process.exit(1);
});
