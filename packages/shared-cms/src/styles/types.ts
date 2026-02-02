import type { SbBlokData } from "@storyblok/react";
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
  borderDirectionMap,
  borderWidthMap,
  borderColorMap,
} from "./maps";

export const BREAKPOINT_ORDER = ["base", "sm", "md", "lg", "xl", "2xl"] as const;
export type BreakpointKey = (typeof BREAKPOINT_ORDER)[number];

/**
 * Breakpoint style options (layout, spacing, border, sizing).
 * Used by Container and other components with a "styles" field.
 * Padding and margin: multi-options (0–4 directions, box model) or legacy single key.
 */
export interface StylesBreakpointOptionsBlok extends SbBlokData {
  breakpoint?: BreakpointKey;
  display?: keyof typeof displayMap;
  direction?: keyof typeof directionMap;
  justify?: keyof typeof justifyMap;
  align?: keyof typeof alignMap;
  gap?: keyof typeof gapMap;
  wrap?: boolean;
  width?: keyof typeof widthMap;
  height?: keyof typeof heightMap;
  min_width?: keyof typeof minWidthMap;
  max_width?: keyof typeof maxWidthMap;
  min_height?: keyof typeof minHeightMap;
  max_height?: keyof typeof maxHeightMap;
  /** 0–4 padding directions (multi-options) or legacy single key */
  padding?: (keyof typeof paddingMap)[] | keyof typeof paddingMap;
  /** 0–4 margin directions (multi-options) or legacy single key */
  margin?: (keyof typeof marginMap)[] | keyof typeof marginMap;
  /** Border sides (multi-select): border, border-t, border-r, border-b, border-l */
  border?: (keyof typeof borderDirectionMap)[];
  /** Border width (applies to selected sides) */
  border_width?: keyof typeof borderWidthMap;
  /** Border color (semantic) */
  border_color?: keyof typeof borderColorMap;
}
