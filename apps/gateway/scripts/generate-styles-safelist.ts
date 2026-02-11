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
  positionMap,
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
  topMap,
  borderClassMap,
  borderColorMap,
  borderStyleMap,
  boxShadowMap,
  roundedMap,
  textSizeMap,
  variantMap,
  GROUP_CLASS,
} from "@repo/shared-cms/flex-maps";

type SafelistProfile = "dev" | "full";
const SAFELIST_PROFILE: SafelistProfile =
  process.env.STYLES_SAFELIST_PROFILE === "full" ? "full" : "dev";
const BREAKPOINTS =
  SAFELIST_PROFILE === "full"
    ? ["sm", "md", "lg", "xl", "2xl"]
    : ["sm", "md", "lg"];
const OUT_PATH = path.join(process.cwd(), "src/app/styles-safelist.txt");
const BORDER_CUSTOM_LIGHT_VAR_PREFIX = "--sb-border-color-light-";
const BORDER_CUSTOM_DARK_VAR_PREFIX = "--sb-border-color-dark-";

const VARIANTS =
  SAFELIST_PROFILE === "full"
    ? (Object.keys(variantMap) as (keyof typeof variantMap)[]).filter(
        (k) => k !== "none",
      )
    : (["hover", "focus"] as (keyof typeof variantMap)[]);

const DEV_SPACING_TOKENS = new Set([
  "0",
  "px",
  "0.5",
  "1",
  "1.5",
  "2",
  "2.5",
  "3",
  "3.5",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
]);

function trimSpacingUtilitiesForDev(
  map: Record<string, string>,
): Record<string, string> {
  if (SAFELIST_PROFILE === "full") return map;
  const entries = Object.entries(map).filter(([key]) => {
    const token = key.split("-").pop() ?? "";
    return DEV_SPACING_TOKENS.has(token);
  });
  return Object.fromEntries(entries);
}

function collectPrefixedClasses(
  map: Record<string, string>,
  breakpoints: readonly string[] = BREAKPOINTS,
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
  map: Record<string, string>,
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
  breakpoint: "base" | string,
  variant: keyof typeof variantMap,
): string {
  return `${breakpoint}-${variant}`.replace(/[^a-zA-Z0-9_-]/g, "-");
}

function main() {
  const all: string[] = [];
  const safeGapMap = trimSpacingUtilitiesForDev(gapMap);
  const safePaddingMap = trimSpacingUtilitiesForDev(paddingMap);
  const safeMarginMap = trimSpacingUtilitiesForDev(marginMap);

  const maps = [
    displayMap,
    positionMap,
    topMap,
    gridColumnsMap,
    directionMap,
    justifyMap,
    alignMap,
    safeGapMap,
    widthMap,
    heightMap,
    minWidthMap,
    maxWidthMap,
    minHeightMap,
    maxHeightMap,
    safePaddingMap,
    safeMarginMap,
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
  const allBreakpoints: ("base" | string)[] = [
    "base",
    ...BREAKPOINTS,
  ];
  const allVariants =
    SAFELIST_PROFILE === "full"
      ? (Object.keys(variantMap) as (keyof typeof variantMap)[])
      : (["none", ...VARIANTS] as (keyof typeof variantMap)[]);
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
  console.log(
    `Wrote ${unique.length} Styles safelist classes to ${OUT_PATH} (profile=${SAFELIST_PROFILE})`,
  );
}

main();
