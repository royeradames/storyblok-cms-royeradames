#!/usr/bin/env bun
/**
 * Push Storyblok Seed Components via Management API
 *
 * This script reads the generated storyblok-seed.json and pushes each component
 * to Storyblok using the Management API.
 *
 * Usage:
 *   bun scripts/push-storyblok-seed.ts
 *
 * Environment:
 *   STORYBLOK_PERSONAL_ACCESS_TOKEN - Your personal access token
 *   STORYBLOK_SPACE_ID - Your space ID (defaults to 290156609668258)
 */

import * as fs from "fs";
import * as path from "path";

// Configuration
const SPACE_ID = process.env.STORYBLOK_SPACE_ID || "290156609668258";
const TOKEN = process.env.STORYBLOK_PERSONAL_ACCESS_TOKEN;
const API_BASE = "https://mapi.storyblok.com/v1";
const SEED_FILE = path.join(process.cwd(), "storyblok-seed.json");

// Rate limiting - Storyblok allows ~3 requests per second
const DELAY_MS = 350;

interface StoryblokComponent {
  name: string;
  display_name: string;
  schema: Record<string, unknown>;
  is_root?: boolean;
  is_nestable?: boolean;
  preview_field?: string;
  icon?: string;
  color?: string;
}

interface ExistingComponent {
  id: number;
  name: string;
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchExistingComponents(): Promise<
  Map<string, ExistingComponent>
> {
  const response = await fetch(`${API_BASE}/spaces/${SPACE_ID}/components`, {
    headers: {
      Authorization: TOKEN!,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch existing components: ${response.status} ${response.statusText}`,
    );
  }

  const data = await response.json();
  const componentsMap = new Map<string, ExistingComponent>();

  for (const comp of data.components || []) {
    componentsMap.set(comp.name, { id: comp.id, name: comp.name });
  }

  return componentsMap;
}

async function createComponent(component: StoryblokComponent): Promise<void> {
  const response = await fetch(`${API_BASE}/spaces/${SPACE_ID}/components`, {
    method: "POST",
    headers: {
      Authorization: TOKEN!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ component }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(
      `Failed to create ${component.name}: ${response.status} - ${error}`,
    );
  }
}

async function updateComponent(
  id: number,
  component: StoryblokComponent,
): Promise<void> {
  const response = await fetch(
    `${API_BASE}/spaces/${SPACE_ID}/components/${id}`,
    {
      method: "PUT",
      headers: {
        Authorization: TOKEN!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ component }),
    },
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(
      `Failed to update ${component.name}: ${response.status} - ${error}`,
    );
  }
}

async function main() {
  console.log("🚀 Pushing Storyblok components via Management API\n");

  // Check for token
  if (!TOKEN) {
    console.error("❌ Error: STORYBLOK_PERSONAL_ACCESS_TOKEN is not set");
    console.error("\nSet it in your .env file or export it:");
    console.error("  export STORYBLOK_PERSONAL_ACCESS_TOKEN=your-token");
    process.exit(1);
  }

  // Check for seed file
  if (!fs.existsSync(SEED_FILE)) {
    console.error(`❌ Error: Seed file not found: ${SEED_FILE}`);
    console.error("\nGenerate it first with:");
    console.error("  bun run storyblok:seed:generate");
    process.exit(1);
  }

  // Read seed file
  const seedData = JSON.parse(fs.readFileSync(SEED_FILE, "utf-8"));
  const components: StoryblokComponent[] = seedData.components;

  console.log(`📄 Loaded ${components.length} components from seed file`);
  console.log(`🎯 Target space: ${SPACE_ID}\n`);

  // Fetch existing components
  console.log("📥 Fetching existing components...");
  const existingComponents = await fetchExistingComponents();
  console.log(`   Found ${existingComponents.size} existing components\n`);

  // Process each component
  let created = 0;
  let updated = 0;
  let errors = 0;

  console.log("📤 Pushing components...\n");

  for (let i = 0; i < components.length; i++) {
    const component = components[i];
    const existing = existingComponents.get(component.name);
    const progress = `[${i + 1}/${components.length}]`;

    try {
      if (existing) {
        process.stdout.write(
          `${progress} Updating: ${component.display_name}...`,
        );
        await updateComponent(existing.id, component);
        console.log(" ✅");
        updated++;
      } else {
        process.stdout.write(
          `${progress} Creating: ${component.display_name}...`,
        );
        await createComponent(component);
        console.log(" ✅");
        created++;
      }
    } catch (error) {
      console.log(" ❌");
      console.error(
        `   Error: ${error instanceof Error ? error.message : error}`,
      );
      errors++;
    }

    // Rate limiting
    if (i < components.length - 1) {
      await sleep(DELAY_MS);
    }
  }

  // Summary
  console.log("\n" + "─".repeat(50));
  console.log("\n📊 Summary:");
  console.log(`   Created: ${created} components`);
  console.log(`   Updated: ${updated} components`);
  if (errors > 0) {
    console.log(`   Errors:  ${errors} components`);
  }
  console.log(`   Total:   ${components.length} components\n`);

  if (errors === 0) {
    console.log("✅ All components pushed successfully!\n");
  } else {
    console.log(`⚠️  Completed with ${errors} error(s)\n`);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("\n❌ Fatal error:", error.message);
  process.exit(1);
});
