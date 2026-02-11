import type React from "react";
import {
  BREAKPOINT_ORDER,
  type BreakpointKey,
  type StylesBreakpointOptionsBlok,
} from "./types";
import { getColorValue } from "../storyblok/plugins";
import {
  displayMap,
  positionMap,
  gridColumnsMap,
  directionMap,
  justifyMap,
  alignMap,
  flexShrinkMap,
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
} from "./maps";

function sortStyles(
  styles: StylesBreakpointOptionsBlok[] | null | undefined
): StylesBreakpointOptionsBlok[] {
  const list = styles ?? [];
  if (!Array.isArray(list) || list.length === 0) return [];
  return [...list].sort(
    (a, b) =>
      BREAKPOINT_ORDER.indexOf((a.breakpoint ?? "base") as BreakpointKey) -
      BREAKPOINT_ORDER.indexOf((b.breakpoint ?? "base") as BreakpointKey)
  );
}

function toThemeKey(opt: StylesBreakpointOptionsBlok): string {
  const bp = opt.breakpoint ?? "base";
  const variant = opt.variant ?? "none";
  return `${bp}-${variant}`.replace(/[^a-zA-Z0-9_-]/g, "-");
}

function getBreakpointPrefix(breakpoint: BreakpointKey): string {
  return breakpoint === "base" ? "" : `${breakpoint}:`;
}

function getVariantPrefix(
  variant: StylesBreakpointOptionsBlok["variant"]
): string {
  if (!variant || variant === "none") return "";
  return variantMap[variant] ?? "";
}

/**
 * Build Tailwind class strings from breakpoint style options.
 * Handles undefined/null/empty: returns [] so callers can pass blok.styles directly.
 */
export function buildStyleClasses(
  styles: StylesBreakpointOptionsBlok[] | null | undefined
): string[] {
  const sorted = sortStyles(styles);
  if (sorted.length === 0) return [];

  const classes: string[] = [];

  for (const opt of sorted) {
    const breakpointPrefix = getBreakpointPrefix(
      (opt.breakpoint ?? "base") as BreakpointKey
    );
    const variantPrefix = getVariantPrefix(opt.variant);
    const prefix = breakpointPrefix + variantPrefix;

    if (opt.group) classes.push(breakpointPrefix + GROUP_CLASS);
    if (opt.display && displayMap[opt.display])
      classes.push(prefix + displayMap[opt.display]);
    if (opt.position && positionMap[opt.position])
      classes.push(prefix + positionMap[opt.position]);
    if (opt.top && topMap[opt.top]) classes.push(prefix + topMap[opt.top]);
    if (opt.grid_columns && gridColumnsMap[opt.grid_columns])
      classes.push(prefix + gridColumnsMap[opt.grid_columns]);
    if (opt.direction && directionMap[opt.direction])
      classes.push(prefix + directionMap[opt.direction]);
    if (opt.justify && justifyMap[opt.justify])
      classes.push(prefix + justifyMap[opt.justify]);
    if (opt.align && alignMap[opt.align])
      classes.push(prefix + alignMap[opt.align]);
    if (opt.flex_shrink && flexShrinkMap[opt.flex_shrink])
      classes.push(prefix + flexShrinkMap[opt.flex_shrink]);
    // Gap: multi-options array or legacy single key
    const gapKeys = Array.isArray(opt.gap)
      ? (opt.gap as (keyof typeof gapMap)[]).filter((v) => v && v in gapMap)
      : opt.gap && opt.gap in gapMap
        ? [opt.gap as keyof typeof gapMap]
        : [];
    gapKeys.forEach((key) => {
      if (gapMap[key]) classes.push(prefix + gapMap[key]);
    });
    if (opt.wrap) classes.push(prefix + "flex-wrap");
    if (opt.width && widthMap[opt.width])
      classes.push(prefix + widthMap[opt.width]);
    if (opt.height && heightMap[opt.height])
      classes.push(prefix + heightMap[opt.height]);
    if (opt.min_width && minWidthMap[opt.min_width])
      classes.push(prefix + minWidthMap[opt.min_width]);
    if (opt.max_width && maxWidthMap[opt.max_width])
      classes.push(prefix + maxWidthMap[opt.max_width]);
    if (opt.min_height && minHeightMap[opt.min_height])
      classes.push(prefix + minHeightMap[opt.min_height]);
    if (opt.max_height && maxHeightMap[opt.max_height])
      classes.push(prefix + maxHeightMap[opt.max_height]);
    // Padding: 0–4 directions (multi-options array) or legacy single key
    const paddingKeys = Array.isArray(opt.padding)
      ? (opt.padding as (keyof typeof paddingMap)[]).filter(
          (v) => v && v in paddingMap
        )
      : opt.padding && opt.padding in paddingMap
      ? [opt.padding as keyof typeof paddingMap]
      : [];
    paddingKeys.forEach((key) => {
      if (paddingMap[key]) classes.push(prefix + paddingMap[key]);
    });

    // Margin: 0–4 directions (multi-options array) or legacy single key
    const marginKeys = Array.isArray(opt.margin)
      ? (opt.margin as (keyof typeof marginMap)[]).filter(
          (v) => v && v in marginMap
        )
      : opt.margin && opt.margin in marginMap
      ? [opt.margin as keyof typeof marginMap]
      : [];
    marginKeys.forEach((key) => {
      if (marginMap[key]) classes.push(prefix + marginMap[key]);
    });

    // Border: multi-select of Tailwind border-width classes (e.g. border-b, border-l-4).
    const borderKeys = Array.isArray(opt.border)
      ? (opt.border as (keyof typeof borderClassMap)[]).filter(
          (v) => v && v in borderClassMap
        )
      : [];
    borderKeys.forEach((key) => {
      const cls = borderClassMap[key];
      if (cls) classes.push(prefix + cls);
    });
    const themeKey = toThemeKey(opt);
    const lightCustomColor = getColorValue(opt.border_color_light_custom);
    const darkCustomColor = getColorValue(opt.border_color_dark_custom);
    const lightColorVar = `--sb-border-color-light-${themeKey}`;
    const darkColorVar = `--sb-border-color-dark-${themeKey}`;

    if (lightCustomColor) {
      classes.push(prefix + `border-[var(${lightColorVar})]`);
    } else {
      const lightBorderColor = opt.border_color_light ?? opt.border_color;
      if (lightBorderColor && borderColorMap[lightBorderColor]) {
        classes.push(prefix + borderColorMap[lightBorderColor]);
      }
    }

    if (darkCustomColor) {
      classes.push(
        breakpointPrefix +
          "dark:" +
          variantPrefix +
          `border-[var(${darkColorVar})]`
      );
    } else if (opt.border_color_dark && borderColorMap[opt.border_color_dark]) {
      classes.push(
        breakpointPrefix +
          "dark:" +
          variantPrefix +
          borderColorMap[opt.border_color_dark]
      );
    }
    if (opt.border_style && opt.border_style in borderStyleMap)
      classes.push(
        prefix + borderStyleMap[opt.border_style as keyof typeof borderStyleMap]
      );
    if (opt.shadow && opt.shadow in boxShadowMap)
      classes.push(
        prefix + boxShadowMap[opt.shadow as keyof typeof boxShadowMap]
      );
    if (opt.rounded && opt.rounded in roundedMap)
      classes.push(prefix + roundedMap[opt.rounded as keyof typeof roundedMap]);
    if (opt.text_size && opt.text_size in textSizeMap)
      classes.push(
        prefix + textSizeMap[opt.text_size as keyof typeof textSizeMap]
      );
  }

  return classes;
}

/**
 * Extract inline styles from breakpoint style options.
 * Theme color CSS variables are emitted for any breakpoint/variant combination.
 * Non-variable custom values (e.g. custom_max_width/custom_max_height) remain base-only.
 * Returns a CSSProperties object to spread onto the element's `style` prop.
 */
export function buildInlineStyles(
  styles: StylesBreakpointOptionsBlok[] | null | undefined,
): React.CSSProperties {
  const sorted = sortStyles(styles);
  if (sorted.length === 0) return {};

  const inlineStyles: React.CSSProperties = {};
  const cssVars = inlineStyles as Record<string, string>;

  for (const opt of sorted) {
    const themeKey = toThemeKey(opt);
    const lightCustomColor = getColorValue(opt.border_color_light_custom);
    const darkCustomColor = getColorValue(opt.border_color_dark_custom);

    if (lightCustomColor) {
      cssVars[`--sb-border-color-light-${themeKey}`] = lightCustomColor;
    }
    if (darkCustomColor) {
      cssVars[`--sb-border-color-dark-${themeKey}`] = darkCustomColor;
    }

    // Only base breakpoint supports non-variable inline custom values.
    if (opt.breakpoint === "base" || !opt.breakpoint) {
      if (opt.custom_max_width) {
        inlineStyles.maxWidth = opt.custom_max_width;
      }
      if (opt.custom_max_height) {
        inlineStyles.maxHeight = opt.custom_max_height;
      }
    }
  }

  return inlineStyles;
}
