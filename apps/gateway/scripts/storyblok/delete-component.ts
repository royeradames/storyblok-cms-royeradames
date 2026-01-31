#!/usr/bin/env bun
/**
 * Delete a Storyblok component by name.
 *
 * Loads STORYBLOK_SPACE_ID and STORYBLOK_PERSONAL_ACCESS_TOKEN from apps/gateway/.env
 *
 * Usage (from apps/gateway):
 *   bun run storyblok:delete-component -- shared_shadcn_flex
 *   COMPONENT_NAME=shared_shadcn_flex bun run storyblok:delete-component
 *
 * Use after migrating content to a new component (e.g. flex → container).
 */

import { config } from "dotenv";
import * as path from "path";

config({ path: path.join(process.cwd(), ".env") });

const SPACE_ID = process.env.STORYBLOK_SPACE_ID;
const TOKEN = process.env.STORYBLOK_PERSONAL_ACCESS_TOKEN;
const API_BASE = "https://mapi.storyblok.com/v1";

const componentName =
  process.env.COMPONENT_NAME ?? process.argv[2] ?? null;

async function main() {
  if (!SPACE_ID) {
    console.error("❌ STORYBLOK_SPACE_ID not set in .env");
    process.exit(1);
  }
  if (!TOKEN) {
    console.error("❌ STORYBLOK_PERSONAL_ACCESS_TOKEN not set in .env");
    process.exit(1);
  }
  if (!componentName) {
    console.error("❌ Component name required");
    console.error("   Usage: bun run storyblok:delete-component -- <component_name>");
    console.error("   Example: bun run storyblok:delete-component -- shared_shadcn_flex");
    process.exit(1);
  }

  const listRes = await fetch(`${API_BASE}/spaces/${SPACE_ID}/components`, {
    headers: { Authorization: TOKEN!, "Content-Type": "application/json" },
  });
  if (!listRes.ok) {
    throw new Error(`List components failed: ${listRes.status} ${listRes.statusText}`);
  }
  const listData = (await listRes.json()) as { components?: { id: number; name: string }[] };
  const comp = listData.components?.find((c) => c.name === componentName);
  if (!comp) {
    console.log(`⚠️  Component "${componentName}" not found in space. Nothing to delete.`);
    process.exit(0);
  }

  const deleteRes = await fetch(
    `${API_BASE}/spaces/${SPACE_ID}/components/${comp.id}`,
    {
      method: "DELETE",
      headers: { Authorization: TOKEN! },
    }
  );
  if (!deleteRes.ok) {
    const text = await deleteRes.text();
    throw new Error(`Delete component failed: ${deleteRes.status} - ${text}`);
  }
  console.log(`✅ Deleted component: ${componentName} (id ${comp.id})`);
}

main().catch((err) => {
  console.error("\n❌ Fatal:", err instanceof Error ? err.message : err);
  process.exit(1);
});
