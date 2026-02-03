import {
  BREAKPOINT_ORDER,
  type BreakpointKey,
  type StylesBreakpointOptionsBlok,
} from "./types";
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
  variantMap,
  GROUP_CLASS,
} from "./maps";

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
  const list = styles ?? [];
  if (!Array.isArray(list) || list.length === 0) return [];

  const sorted = [...list].sort(
    (a, b) =>
      BREAKPOINT_ORDER.indexOf((a.breakpoint ?? "base") as BreakpointKey) -
      BREAKPOINT_ORDER.indexOf((b.breakpoint ?? "base") as BreakpointKey)
  );

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
    if (opt.direction && directionMap[opt.direction])
      classes.push(prefix + directionMap[opt.direction]);
    if (opt.justify && justifyMap[opt.justify])
      classes.push(prefix + justifyMap[opt.justify]);
    if (opt.align && alignMap[opt.align])
      classes.push(prefix + alignMap[opt.align]);
    if (opt.gap && gapMap[opt.gap]) classes.push(prefix + gapMap[opt.gap]);
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
    if (opt.border_color && borderColorMap[opt.border_color])
      classes.push(prefix + borderColorMap[opt.border_color]);
    if (opt.border_style && opt.border_style in borderStyleMap)
      classes.push(
        prefix + borderStyleMap[opt.border_style as keyof typeof borderStyleMap]
      );
    if (opt.shadow && opt.shadow in boxShadowMap)
      classes.push(
        prefix + boxShadowMap[opt.shadow as keyof typeof boxShadowMap]
      );
    if (opt.text_size && opt.text_size in textSizeMap)
      classes.push(
        prefix + textSizeMap[opt.text_size as keyof typeof textSizeMap]
      );
  }

  return classes;
}
