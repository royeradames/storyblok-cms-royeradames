#!/usr/bin/env bun
/**
 * Generate Flex composite class safelist for Tailwind v4.
 * Ensures all Flex classes are included at build time so CMS-driven options
 * work without purging:
 * - Breakpoint-prefixed (sm:, md:, lg:, xl:, 2xl:)
 * - Base (unprefixed) so breakpoint "base" works (e.g. py-32, p-3)
 *
 * Usage (from apps/gateway): bun run scripts/generate-flex-safelist.ts
 * Output: src/app/flex-safelist.txt (one class per line)
 */

import * as fs from "fs";
import * as path from "path";
import {
  directionMap,
  justifyMap,
  alignMap,
  gapMap,
  widthMap,
  heightMap,
  minWidthMap,
  maxWidthMap,
  minHeightMap,
  maxHeightMap,
  paddingMap,
  marginMap,
} from "@repo/shared-cms/flex-maps";

const BREAKPOINTS = ["sm", "md", "lg", "xl", "2xl"] as const;
const OUT_PATH = path.join(process.cwd(), "src/app/flex-safelist.txt");

function collectPrefixedClasses(
  map: Record<string, string>,
  breakpoints: readonly string[] = BREAKPOINTS
): string[] {
  const classes: string[] = [];
  const values = Object.values(map) as string[];
  for (const bp of breakpoints) {
    for (const v of values) {
      classes.push(`${bp}:${v}`);
    }
  }
  return classes;
}

function collectBaseClasses(map: Record<string, string>): string[] {
  return Object.values(map) as string[];
}

function main() {
  const all: string[] = [];

  const maps = [
    directionMap,
    justifyMap,
    alignMap,
    gapMap,
    widthMap,
    heightMap,
    minWidthMap,
    maxWidthMap,
    minHeightMap,
    maxHeightMap,
    paddingMap,
    marginMap,
  ] as Record<string, string>[];

  // Prefixed (sm:, md:, ...) for all maps
  for (const map of maps) {
    all.push(...collectPrefixedClasses(map));
  }

  // Base (unprefixed) so breakpoint "base" works
  for (const map of maps) {
    all.push(...collectBaseClasses(map));
  }

  // flex-wrap: prefixed and base
  for (const bp of BREAKPOINTS) {
    all.push(`${bp}:flex-wrap`);
  }
  all.push("flex-wrap");

  const unique = [...new Set(all)];
  const content = unique.sort().join("\n") + "\n";

  fs.writeFileSync(OUT_PATH, content, "utf-8");
  console.log(`Wrote ${unique.length} Flex safelist classes to ${OUT_PATH}`);
}

main();
