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
  gridColumnsMap,
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
  roundedMap,
  textSizeMap,
  variantMap,
  GROUP_CLASS,
} from "@repo/shared-cms/flex-maps";

const BREAKPOINTS = ["sm", "md", "lg", "xl", "2xl"] as const;
const OUT_PATH = path.join(process.cwd(), "src/app/styles-safelist.txt");
const BORDER_CUSTOM_LIGHT_VAR_PREFIX = "--sb-border-color-light-";
const BORDER_CUSTOM_DARK_VAR_PREFIX = "--sb-border-color-dark-";

const VARIANTS = (
  Object.keys(variantMap) as (keyof typeof variantMap)[]
).filter((k) => k !== "none");

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

function collectVariantPrefixedClasses(map: Record<string, string>): string[] {
  const classes: string[] = [];
  const values = Object.values(map) as string[];
  for (const variant of VARIANTS) {
    const prefix = variantMap[variant];
    if (!prefix) continue;
    for (const v of values) {
      classes.push(prefix + v);
    }
  }
  return classes;
}

function collectBreakpointVariantPrefixedClasses(
  map: Record<string, string>
): string[] {
  const classes: string[] = [];
  const values = Object.values(map) as string[];
  for (const bp of BREAKPOINTS) {
    for (const variant of VARIANTS) {
      const prefix = variantMap[variant];
      if (!prefix) continue;
      for (const v of values) {
        classes.push(`${bp}:${prefix}${v}`);
      }
    }
  }
  return classes;
}

function collectBaseClasses(map: Record<string, string>): string[] {
  return Object.values(map) as string[];
}

function styleThemeKey(
  breakpoint: "base" | (typeof BREAKPOINTS)[number],
  variant: keyof typeof variantMap,
): string {
  return `${breakpoint}-${variant}`.replace(/[^a-zA-Z0-9_-]/g, "-");
}

function main() {
  const all: string[] = [];

  const maps = [
    displayMap,
    gridColumnsMap,
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
    roundedMap,
    textSizeMap,
  ] as Record<string, string>[];

  // Base (unprefixed) so breakpoint "base" works
  for (const map of maps) {
    all.push(...collectBaseClasses(map));
  }

  // Prefixed (sm:, md:, ...) for all maps
  for (const map of maps) {
    all.push(...collectPrefixedClasses(map));
  }

  // Variant-prefixed (last:, hover:, etc.) for all maps
  for (const map of maps) {
    all.push(...collectVariantPrefixedClasses(map));
  }

  // Breakpoint + variant (sm:last:, etc.) for all maps
  for (const map of maps) {
    all.push(...collectBreakpointVariantPrefixedClasses(map));
  }

  // flex-wrap: base, prefixed, variant-prefixed, breakpoint+variant
  all.push("flex-wrap");
  for (const bp of BREAKPOINTS) {
    all.push(`${bp}:flex-wrap`);
  }
  for (const variant of VARIANTS) {
    const prefix = variantMap[variant];
    if (prefix) all.push(prefix + "flex-wrap");
  }
  for (const bp of BREAKPOINTS) {
    for (const variant of VARIANTS) {
      const prefix = variantMap[variant];
      if (prefix) all.push(`${bp}:${prefix}flex-wrap`);
    }
  }

  // group: base and breakpoint-prefixed
  all.push(GROUP_CLASS);
  for (const bp of BREAKPOINTS) {
    all.push(`${bp}:${GROUP_CLASS}`);
  }

  // Custom border color arbitrary classes:
  // border-[var(--sb-border-color-...)] and dark variants across base/breakpoint + variant prefixes
  const allBreakpoints: ("base" | (typeof BREAKPOINTS)[number])[] = [
    "base",
    ...BREAKPOINTS,
  ];
  const allVariants = Object.keys(variantMap) as (keyof typeof variantMap)[];
  for (const bp of allBreakpoints) {
    for (const variant of allVariants) {
      const variantPrefix = variantMap[variant] ?? "";
      const bpPrefix = bp === "base" ? "" : `${bp}:`;
      const key = styleThemeKey(bp, variant);

      all.push(
        `${bpPrefix}${variantPrefix}border-[var(${BORDER_CUSTOM_LIGHT_VAR_PREFIX}${key})]`,
      );
      all.push(
        `${bpPrefix}dark:${variantPrefix}border-[var(${BORDER_CUSTOM_DARK_VAR_PREFIX}${key})]`,
      );
    }
  }

  const unique = [...new Set(all)];
  const content = unique.sort().join("\n") + "\n";

  fs.writeFileSync(OUT_PATH, content, "utf-8");
  console.log(`Wrote ${unique.length} Styles safelist classes to ${OUT_PATH}`);
}

main();
