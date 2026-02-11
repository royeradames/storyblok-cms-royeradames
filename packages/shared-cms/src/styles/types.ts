import type { SbBlokData } from "@storyblok/react";
import type { NativeColorPickerValue } from "../storyblok/plugins";
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
  type VariantKey,
} from "./maps";

export const BREAKPOINT_ORDER = [
  "base",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
] as const;
export type BreakpointKey = (typeof BREAKPOINT_ORDER)[number];

/**
 * Breakpoint style options (layout, spacing, border, sizing).
 * Used by Container and other components with a "styles" field.
 * Padding and margin: multi-options (0–4 directions, box model) or legacy single key.
 * Variant: Tailwind variant prefix (e.g. last:, hover:) applied to all utilities in this block.
 * Group: add "group" utility on container (for group-hover/group-focus on children).
 */
export interface StylesBreakpointOptionsBlok extends SbBlokData {
  breakpoint?: BreakpointKey;
  /** Tailwind variant (last:, first:, hover:, etc.). Applied to all utilities in this block. */
  variant?: VariantKey;
  /** Add "group" class on container so children can use group-hover:, group-focus:. */
  group?: boolean;
  display?: keyof typeof displayMap;
  grid_columns?: keyof typeof gridColumnsMap;
  direction?: keyof typeof directionMap;
  justify?: keyof typeof justifyMap;
  align?: keyof typeof alignMap;
  /** 0–4 gap utilities (multi-options) or legacy single key */
  gap?: (keyof typeof gapMap)[] | keyof typeof gapMap;
  wrap?: boolean;
  width?: keyof typeof widthMap;
  height?: keyof typeof heightMap;
  min_width?: keyof typeof minWidthMap;
  max_width?: keyof typeof maxWidthMap;
  /** Arbitrary max-width (e.g. "524px", "33rem"). Base breakpoint only. Overrides max_width dropdown. */
  custom_max_width?: string;
  min_height?: keyof typeof minHeightMap;
  max_height?: keyof typeof maxHeightMap;
  /** Arbitrary max-height (e.g. "524px", "33rem"). Base breakpoint only. Overrides max_height dropdown. */
  custom_max_height?: string;
  /** 0–4 padding directions (multi-options) or legacy single key */
  padding?: (keyof typeof paddingMap)[] | keyof typeof paddingMap;
  /** 0–4 margin directions (multi-options) or legacy single key */
  margin?: (keyof typeof marginMap)[] | keyof typeof marginMap;
  /** Border width classes (multi-select): all Tailwind border-* width utilities (e.g. border-b, border-l-4). */
  border?: (keyof typeof borderClassMap)[];
  /** Border color in light theme (semantic). */
  border_color_light?: keyof typeof borderColorMap;
  /** Border color in dark theme (semantic). */
  border_color_dark?: keyof typeof borderColorMap;
  /** Border color in light theme (custom). Overrides semantic color when set. */
  border_color_light_custom?: NativeColorPickerValue;
  /** Border color in dark theme (custom). Overrides semantic color when set. */
  border_color_dark_custom?: NativeColorPickerValue;
  /** Border color (semantic, legacy single value). */
  border_color?: keyof typeof borderColorMap;
  /** Border style (solid, dashed, dotted, etc.) */
  border_style?: keyof typeof borderStyleMap;
  /** Box shadow */
  shadow?: keyof typeof boxShadowMap;
  /** Border radius */
  rounded?: keyof typeof roundedMap;
  /** Text size (font-size) per breakpoint */
  text_size?: keyof typeof textSizeMap;
}
