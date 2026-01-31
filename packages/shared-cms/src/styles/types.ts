import type { SbBlokData } from "@storyblok/react";
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
} from "./maps";

export const BREAKPOINT_ORDER = ["base", "sm", "md", "lg", "xl", "2xl"] as const;
export type BreakpointKey = (typeof BREAKPOINT_ORDER)[number];

/**
 * Breakpoint style options (flex layout + padding/margin/sizing).
 * Used by Flex Container and can be reused by other components with a "styles" field.
 */
export interface FlexBreakpointOptionsBlok extends SbBlokData {
  breakpoint?: BreakpointKey;
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
  padding?: keyof typeof paddingMap;
  margin?: keyof typeof marginMap;
}
