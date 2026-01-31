#!/usr/bin/env bun
/**
 * Generate Flex composite class safelist for Tailwind v4.
 * Ensures all breakpoint-prefixed Flex classes (sm:, md:, lg:, xl:, 2xl:) are
 * included at build time so CMS-driven Flex options work without purging.
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

function main() {
  const all: string[] = [];

  // Direction, justify, align, gap, width, height, min/max width/height
  all.push(...collectPrefixedClasses(directionMap as Record<string, string>));
  all.push(...collectPrefixedClasses(justifyMap as Record<string, string>));
  all.push(...collectPrefixedClasses(alignMap as Record<string, string>));
  all.push(...collectPrefixedClasses(gapMap as Record<string, string>));

  // flex-wrap (no map, single class)
  for (const bp of BREAKPOINTS) {
    all.push(`${bp}:flex-wrap`);
  }

  all.push(...collectPrefixedClasses(widthMap as Record<string, string>));
  all.push(...collectPrefixedClasses(heightMap as Record<string, string>));
  all.push(...collectPrefixedClasses(minWidthMap as Record<string, string>));
  all.push(...collectPrefixedClasses(maxWidthMap as Record<string, string>));
  all.push(...collectPrefixedClasses(minHeightMap as Record<string, string>));
  all.push(...collectPrefixedClasses(maxHeightMap as Record<string, string>));
  all.push(...collectPrefixedClasses(paddingMap as Record<string, string>));
  all.push(...collectPrefixedClasses(marginMap as Record<string, string>));

  const unique = [...new Set(all)];
  const content = unique.sort().join("\n") + "\n";

  fs.writeFileSync(OUT_PATH, content, "utf-8");
  console.log(`Wrote ${unique.length} Flex safelist classes to ${OUT_PATH}`);
}

main();
