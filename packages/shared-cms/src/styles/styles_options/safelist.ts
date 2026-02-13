import * as fs from "fs";
import * as path from "path";
import {
  GROUP_CLASS,
  alignMap,
  borderClassMap,
  borderColorMap,
  borderStyleMap,
  boxShadowMap,
  directionMap,
  displayMap,
  flexShrinkMap,
  gapMap,
  gridColumnsMap,
  heightMap,
  justifyMap,
  marginMap,
  maxHeightMap,
  maxWidthMap,
  minHeightMap,
  minWidthMap,
  paddingMap,
  positionMap,
  roundedMap,
  textColorMap,
  textSizeMap,
  topMap,
  variantMap,
  widthMap,
} from "../maps";

export type SafelistProfile = "dev" | "full";

export const STYLES_SAFELIST_ARTIFACT_FILENAME = "styles-safelist.txt";
export const STYLES_SAFELIST_ARTIFACT_RELATIVE_PATH = path.join(
  "src",
  "styles",
  "styles_options",
  STYLES_SAFELIST_ARTIFACT_FILENAME,
);

const BORDER_CUSTOM_LIGHT_VAR_PREFIX = "--sb-border-color-light-";
const BORDER_CUSTOM_DARK_VAR_PREFIX = "--sb-border-color-dark-";
const TEXT_CUSTOM_LIGHT_VAR_PREFIX = "--sb-text-color-light-";
const TEXT_CUSTOM_DARK_VAR_PREFIX = "--sb-text-color-dark-";

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

function getBreakpoints(profile: SafelistProfile): readonly string[] {
  return profile === "full" ? ["sm", "md", "lg", "xl", "2xl"] : ["sm", "md", "lg"];
}

function getVariants(profile: SafelistProfile): (keyof typeof variantMap)[] {
  if (profile === "full") {
    return (Object.keys(variantMap) as (keyof typeof variantMap)[]).filter(
      (key) => key !== "none",
    );
  }

  return [
    "hover",
    "focus",
    "active",
    "disabled",
    "visited",
    "group_hover",
    "group_focus",
    "group_active",
    "group_disabled",
    "group_visited",
  ];
}

function trimSpacingUtilitiesForDev(
  map: Record<string, string>,
  profile: SafelistProfile,
): Record<string, string> {
  if (profile === "full") return map;

  const entries = Object.entries(map).filter(([key]) => {
    const token = key.split("-").pop() ?? "";
    return DEV_SPACING_TOKENS.has(token);
  });

  return Object.fromEntries(entries);
}

function collectPrefixedClasses(
  map: Record<string, string>,
  breakpoints: readonly string[],
): string[] {
  const classes: string[] = [];
  const values = Object.values(map) as string[];
  for (const bp of breakpoints) {
    for (const value of values) {
      classes.push(`${bp}:${value}`);
    }
  }
  return classes;
}

function collectVariantPrefixedClasses(
  map: Record<string, string>,
  variants: (keyof typeof variantMap)[],
): string[] {
  const classes: string[] = [];
  const values = Object.values(map) as string[];
  for (const variant of variants) {
    const prefix = variantMap[variant];
    if (!prefix) continue;
    for (const value of values) {
      classes.push(prefix + value);
    }
  }
  return classes;
}

function collectBreakpointVariantPrefixedClasses(
  map: Record<string, string>,
  breakpoints: readonly string[],
  variants: (keyof typeof variantMap)[],
): string[] {
  const classes: string[] = [];
  const values = Object.values(map) as string[];
  for (const bp of breakpoints) {
    for (const variant of variants) {
      const prefix = variantMap[variant];
      if (!prefix) continue;
      for (const value of values) {
        classes.push(`${bp}:${prefix}${value}`);
      }
    }
  }
  return classes;
}

function styleThemeKey(
  breakpoint: "base" | string,
  variant: keyof typeof variantMap,
): string {
  return `${breakpoint}-${variant}`.replace(/[^a-zA-Z0-9_-]/g, "-");
}

export function buildStylesSafelist(profile: SafelistProfile): string {
  const breakpoints = getBreakpoints(profile);
  const variants = getVariants(profile);
  const all: string[] = [];

  const safeGapMap = trimSpacingUtilitiesForDev(gapMap, profile);
  const safePaddingMap = trimSpacingUtilitiesForDev(paddingMap, profile);
  const safeMarginMap = trimSpacingUtilitiesForDev(marginMap, profile);

  const maps = [
    displayMap,
    positionMap,
    topMap,
    gridColumnsMap,
    directionMap,
    justifyMap,
    alignMap,
    flexShrinkMap,
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
    textColorMap,
    borderStyleMap,
    boxShadowMap,
    roundedMap,
    textSizeMap,
  ] as Record<string, string>[];

  for (const map of maps) {
    all.push(...Object.values(map));
  }

  for (const map of maps) {
    all.push(...collectPrefixedClasses(map, breakpoints));
  }

  for (const map of maps) {
    all.push(...collectVariantPrefixedClasses(map, variants));
  }

  for (const map of maps) {
    all.push(...collectBreakpointVariantPrefixedClasses(map, breakpoints, variants));
  }

  all.push("flex-wrap");
  for (const bp of breakpoints) {
    all.push(`${bp}:flex-wrap`);
  }
  for (const variant of variants) {
    const prefix = variantMap[variant];
    if (prefix) all.push(prefix + "flex-wrap");
  }
  for (const bp of breakpoints) {
    for (const variant of variants) {
      const prefix = variantMap[variant];
      if (prefix) all.push(`${bp}:${prefix}flex-wrap`);
    }
  }

  all.push(GROUP_CLASS);
  for (const bp of breakpoints) {
    all.push(`${bp}:${GROUP_CLASS}`);
  }

  const allBreakpoints: ("base" | string)[] = ["base", ...breakpoints];
  const allVariants =
    profile === "full"
      ? (Object.keys(variantMap) as (keyof typeof variantMap)[])
      : (["none", ...variants] as (keyof typeof variantMap)[]);

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
      all.push(
        `${bpPrefix}${variantPrefix}text-[var(${TEXT_CUSTOM_LIGHT_VAR_PREFIX}${key})]`,
      );
      all.push(
        `${bpPrefix}dark:${variantPrefix}text-[var(${TEXT_CUSTOM_DARK_VAR_PREFIX}${key})]`,
      );
    }
  }

  return [...new Set(all)].sort().join("\n") + "\n";
}

export function resolveStylesSafelistArtifactPath(
  sharedCmsPackageRoot: string,
): string {
  return path.join(sharedCmsPackageRoot, STYLES_SAFELIST_ARTIFACT_RELATIVE_PATH);
}

export function writeStylesSafelistArtifact(
  profile: SafelistProfile,
  sharedCmsPackageRoot: string,
): { outputPath: string; classCount: number } {
  const outputPath = resolveStylesSafelistArtifactPath(sharedCmsPackageRoot);
  const content = buildStylesSafelist(profile);
  const classCount = content.trim().split("\n").length;

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, content, "utf-8");

  return { outputPath, classCount };
}
