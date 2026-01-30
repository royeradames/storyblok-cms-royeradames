#!/usr/bin/env bun
/**
 * Push Storyblok seed components to the space.
 *
 * Loads STORYBLOK_SPACE_ID and STORYBLOK_PERSONAL_ACCESS_TOKEN from the app .env
 * (apps/gateway/.env). No fallback – both must be set.
 *
 * Usage (from apps/gateway): bun run storyblok:seed:push
 * Reads: apps/gateway/.storyblok-seed.json
 */

import { config } from "dotenv";
import * as fs from "fs";
import * as path from "path";

// Load app .env (apps/gateway/.env)
config({ path: path.join(process.cwd(), ".env") });

const SPACE_ID = process.env.STORYBLOK_SPACE_ID;
const TOKEN = process.env.STORYBLOK_PERSONAL_ACCESS_TOKEN;
const API_BASE = "https://mapi.storyblok.com/v1";
const SEED_FILE = path.join(process.cwd(), ".storyblok-seed.json");

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
  const map = new Map<string, ExistingComponent>();
  for (const comp of data.components || []) {
    map.set(comp.name, { id: comp.id, name: comp.name });
  }
  return map;
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
  console.log("🚀 Pushing Storyblok components (app .env)\n");

  if (!SPACE_ID) {
    console.error("❌ STORYBLOK_SPACE_ID is not set");
    console.error("   Set it in apps/gateway/.env");
    process.exit(1);
  }

  if (!TOKEN) {
    console.error("❌ STORYBLOK_PERSONAL_ACCESS_TOKEN is not set");
    console.error("   Set it in apps/gateway/.env");
    process.exit(1);
  }

  if (!fs.existsSync(SEED_FILE)) {
    console.error(`❌ Seed file not found: ${SEED_FILE}`);
    console.error("   Run: bun run storyblok:seed:generate");
    process.exit(1);
  }

  const seedData = JSON.parse(fs.readFileSync(SEED_FILE, "utf-8")) as {
    components: StoryblokComponent[];
  };
  const components = seedData.components;

  console.log(`📄 Loaded ${components.length} components`);
  console.log(`🎯 Space: ${SPACE_ID}\n`);

  const existingComponents = await fetchExistingComponents();
  let created = 0;
  let updated = 0;
  let errors = 0;

  for (let i = 0; i < components.length; i++) {
    const component = components[i];
    if (!component) continue;
    const existing = existingComponents.get(component.name);
    const progress = `[${i + 1}/${components.length}]`;

    try {
      if (existing) {
        process.stdout.write(`${progress} Updating: ${component.display_name}...`);
        await updateComponent(existing.id, component);
        console.log(" ✅");
        updated++;
      } else {
        process.stdout.write(`${progress} Creating: ${component.display_name}...`);
        await createComponent(component);
        console.log(" ✅");
        created++;
      }
    } catch (error) {
      console.log(" ❌");
      console.error(`   ${error instanceof Error ? error.message : error}`);
      errors++;
    }

    if (i < components.length - 1) await sleep(DELAY_MS);
  }

  console.log("\n" + "─".repeat(50));
  console.log(`   Created: ${created}  Updated: ${updated}  Errors: ${errors}`);
  console.log(`   Total:   ${components.length}\n`);

  if (errors > 0) process.exit(1);
}

main().catch((err) => {
  console.error("\n❌ Fatal error:", err.message);
  process.exit(1);
});
