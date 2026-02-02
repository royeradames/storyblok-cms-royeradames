#!/usr/bin/env bun
/**
 * Generate Styles composite class safelist for Tailwind v4.
 * Ensures all Styles Breakpoint Options classes are included at build time
 * so CMS-driven options work without purging:
 * - Breakpoint-prefixed (sm:, md:, lg:, xl:, 2xl:)
 * - Base (unprefixed) so breakpoint "base" works (e.g. py-32, text-lg)
 *
 * Usage (from apps/gateway): bun run scripts/generate-styles-safelist.ts
 * Output: src/app/styles-safelist.txt (one class per line)
 */

import * as fs from "fs";
import * as path from "path";
import {
  displayMap,
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
  borderClassMap,
  borderColorMap,
  borderStyleMap,
  boxShadowMap,
  textSizeMap,
} from "@repo/shared-cms/flex-maps";

const BREAKPOINTS = ["sm", "md", "lg", "xl", "2xl"] as const;
const OUT_PATH = path.join(process.cwd(), "src/app/styles-safelist.txt");

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
    displayMap,
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
    borderClassMap,
    borderColorMap,
    borderStyleMap,
    boxShadowMap,
    textSizeMap,
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
  console.log(`Wrote ${unique.length} Styles safelist classes to ${OUT_PATH}`);
}

main();
