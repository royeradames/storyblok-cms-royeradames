"use client";

import { storyblokEditable } from "@storyblok/react";
import { cn } from "@repo/ui";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import type { SbBlokData } from "@storyblok/react";
import { buildStyleClasses, buildInlineStyles, type StylesBreakpointOptionsBlok } from "../styles";
import {
  type NativeColorPickerValue,
  useThemeColor,
} from "../storyblok/plugins";

/** Icon size options (xs → 4xl) mapped to pixels. Matches predefined scale. */
const ICON_SIZE_PX: Record<string, number> = {
  xs: 16,
  sm: 20,
  default: 24,
  lg: 32,
  xl: 40,
  "2xl": 48,
  "3xl": 64,
  "4xl": 80,
};

export interface ShadcnIconBlok extends SbBlokData {
  name: string;
  size?: "xs" | "sm" | "default" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  /** Light theme color (native-color-picker plugin) */
  color_light?: NativeColorPickerValue;
  /** Dark theme color (native-color-picker plugin) */
  color_dark?: NativeColorPickerValue;
  stroke_width?: number;
  class_name?: string;
  styles?: StylesBreakpointOptionsBlok[];
}

export function ShadcnIcon({ blok }: { blok: ShadcnIconBlok }) {
  const color = useThemeColor(blok.color_light, blok.color_dark);
  const sizeNum = blok.size ? ICON_SIZE_PX[blok.size] ?? 24 : 24;

  return (
    <DynamicIcon
      {...storyblokEditable(blok)}
      name={blok.name as IconName}
      size={sizeNum}
      color={color}
      strokeWidth={blok.stroke_width}
      className={cn(blok.class_name, ...buildStyleClasses(blok.styles))}
      style={buildInlineStyles(blok.styles)}
    />
  );
}
