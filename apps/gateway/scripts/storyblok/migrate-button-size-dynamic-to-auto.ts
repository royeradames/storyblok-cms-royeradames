#!/usr/bin/env bun
/**
 * Migrate Storyblok content:
 *   shadcn_button.size: "dynamic" -> "auto"
 *   shared_shadcn_button.size: "dynamic" -> "auto"
 *
 * Loads STORYBLOK_SPACE_ID and STORYBLOK_PERSONAL_ACCESS_TOKEN from apps/gateway/.env
 *
 * Usage (from apps/gateway):
 *   bun run storyblok:migrate-button-size-dynamic-to-auto
 */

import { config } from "dotenv";
import * as path from "path";

config({ path: path.join(process.cwd(), ".env") });

const SPACE_ID = process.env.STORYBLOK_SPACE_ID;
const TOKEN = process.env.STORYBLOK_PERSONAL_ACCESS_TOKEN;
const API_BASE = "https://mapi.storyblok.com/v1";
const DELAY_MS = 400;
const TARGET_COMPONENTS = new Set(["shadcn_button", "shared_shadcn_button"]);

interface Story {
  id: number;
  name: string;
  slug: string;
  content?: Record<string, unknown>;
  [key: string]: unknown;
}

function migrateInPlace(obj: unknown): { changed: boolean; replacements: number } {
  if (obj === null || typeof obj !== "object") {
    return { changed: false, replacements: 0 };
  }

  let changed = false;
  let replacements = 0;

  if (Array.isArray(obj)) {
    for (const item of obj) {
      const result = migrateInPlace(item);
      changed = result.changed || changed;
      replacements += result.replacements;
    }
    return { changed, replacements };
  }

  const node = obj as Record<string, unknown>;
  if (
    TARGET_COMPONENTS.has(String(node.component)) &&
    typeof node.size === "string" &&
    node.size === "dynamic"
  ) {
    node.size = "auto";
    changed = true;
    replacements += 1;
  }

  for (const value of Object.values(node)) {
    const result = migrateInPlace(value);
    changed = result.changed || changed;
    replacements += result.replacements;
  }

  return { changed, replacements };
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
    const response = await fetch(url, {
      headers: { Authorization: TOKEN!, "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`List stories failed: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as { stories?: Story[] };
    const list = data.stories ?? [];
    for (const story of list) {
      stories.push({ id: story.id, name: story.name, slug: story.slug });
    }

    hasMore = list.length === 100;
    page += 1;
    if (hasMore) await sleep(DELAY_MS);
  }

  return stories;
}

async function fetchStory(id: number): Promise<Story> {
  const response = await fetch(`${API_BASE}/spaces/${SPACE_ID}/stories/${id}`, {
    headers: { Authorization: TOKEN!, "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Fetch story ${id} failed: ${response.status}`);
  }

  return (await response.json()).story as Story;
}

async function updateStory(id: number, story: Story): Promise<void> {
  const response = await fetch(`${API_BASE}/spaces/${SPACE_ID}/stories/${id}`, {
    method: "PUT",
    headers: { Authorization: TOKEN!, "Content-Type": "application/json" },
    body: JSON.stringify({ story }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Update story ${id} failed: ${response.status} - ${message}`);
  }
}

async function main() {
  console.log("🚀 Migrate Button size: dynamic -> auto\n");

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

  let updatedStories = 0;
  let replacementCount = 0;
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

      const result = migrateInPlace(content);
      if (result.changed) {
        await updateStory(id, story);
        updatedStories += 1;
        replacementCount += result.replacements;
        console.log(
          `[${i + 1}/${storyIds.length}] Updated: ${name} (/${slug}) replacements=${result.replacements}`,
        );
      }
    } catch (error) {
      errors += 1;
      console.error(
        `[${i + 1}/${storyIds.length}] Error ${name} (id ${id}):`,
        (error as Error).message,
      );
    }

    await sleep(DELAY_MS);
  }

  console.log("\n" + "─".repeat(50));
  console.log(
    `   Updated stories: ${updatedStories}  Replacements: ${replacementCount}  Errors: ${errors}  Total: ${storyIds.length}\n`,
  );

  if (errors > 0) process.exit(1);
}

main().catch((error) => {
  console.error("\n❌ Fatal:", (error as Error).message);
  process.exit(1);
});
