#!/usr/bin/env bun
/**
 * Seed section builder templates into PostgreSQL.
 *
 * Fetches all stories under "section-builders/" from Storyblok and upserts
 * their content into the section_templates table.
 *
 * Usage (from apps/gateway):
 *   bun run storyblok:seed:templates
 *
 * Requires: DATABASE_URL, STORYBLOK_SPACE_ID, STORYBLOK_PERSONAL_ACCESS_TOKEN
 * (all loaded from apps/gateway/.env)
 */

import { config } from "dotenv";
import * as path from "path";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { sectionTemplates } from "../../src/db/schema/section-templates";

// Load app .env
config({ path: path.join(process.cwd(), ".env") });

const DATABASE_URL = process.env.DATABASE_URL;
const SPACE_ID = process.env.STORYBLOK_SPACE_ID;
const TOKEN = process.env.STORYBLOK_PERSONAL_ACCESS_TOKEN;
const API_BASE = "https://mapi.storyblok.com/v1";

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

const client = postgres(DATABASE_URL, { prepare: false });
const db = drizzle(client);

/** Rate-limit delay between API calls (ms) */
const DELAY_MS = 350;

/**
 * Fetches all stories under section-builder/ from Storyblok Management API.
 * The list endpoint doesn't include `content`, so we fetch each story
 * individually to get the full content.
 */
async function fetchSectionBuilderStories(): Promise<any[]> {
  // Step 1: List stories to get IDs and slugs
  const listUrl = `${API_BASE}/spaces/${SPACE_ID}/stories?starts_with=section-builder/&per_page=100`;
  const listRes = await fetch(listUrl, {
    headers: { Authorization: TOKEN! },
  });

  if (!listRes.ok) {
    throw new Error(
      `Failed to list stories: ${listRes.status} ${listRes.statusText}`,
    );
  }

  const listData = await listRes.json();
  const storyList: any[] = listData.stories ?? [];

  // Step 2: Fetch each story individually for full content
  const fullStories: any[] = [];
  for (const stub of storyList) {
    await new Promise((r) => setTimeout(r, DELAY_MS));
    const storyUrl = `${API_BASE}/spaces/${SPACE_ID}/stories/${stub.id}`;
    const storyRes = await fetch(storyUrl, {
      headers: { Authorization: TOKEN! },
    });

    if (!storyRes.ok) {
      console.warn(
        `  Failed to fetch story ${stub.id} (${stub.full_slug}): ${storyRes.status}`,
      );
      continue;
    }

    const storyData = await storyRes.json();
    fullStories.push(storyData.story);
  }

  return fullStories;
}

/**
 * Derives the component name from a slug:
 * "section-builders/case-studies-2" → "case_studies_2_section"
 */
function slugToComponent(fullSlug: string): string {
  const sectionSlug = fullSlug.replace("section-builder/", "");
  return sectionSlug.replace(/-/g, "_") + "_section";
}

async function main() {
  console.log("Fetching section-builder stories from Storyblok...");
  const stories = await fetchSectionBuilderStories();

  if (stories.length === 0) {
    console.log("No section-builder stories found.");
    await client.end();
    return;
  }

  console.log(`Found ${stories.length} section-builder stories.`);

  for (const story of stories) {
    const slug = story.full_slug as string;
    const componentName = slugToComponent(slug);
    // Extract the actual section template from the page wrapper (body[0])
    const template = story.content?.body?.[0] ?? story.content;

    if (!template) {
      console.warn(`  Skipping ${slug}: no content`);
      continue;
    }

    // Upsert
    const existing = await db
      .select()
      .from(sectionTemplates)
      .where(eq(sectionTemplates.slug, slug))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(sectionTemplates)
        .set({
          component: componentName,
          template,
          updatedAt: new Date(),
        })
        .where(eq(sectionTemplates.slug, slug));
      console.log(`  Updated: ${slug} → ${componentName}`);
    } else {
      await db.insert(sectionTemplates).values({
        slug,
        component: componentName,
        template,
      });
      console.log(`  Inserted: ${slug} → ${componentName}`);
    }
  }

  console.log("Done seeding templates.");
  await client.end();
}

main().catch((err) => {
  console.error("Seed templates failed:", err);
  process.exit(1);
});
