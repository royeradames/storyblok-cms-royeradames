"use client";

import { storyblokEditable } from "@storyblok/react";
import { cn } from "@repo/ui";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import type { SbBlokData } from "@storyblok/react";
import { renderCustomIcon } from "./custom/custom-icon-registry";
import {
  buildStyleClasses,
  buildInlineStyles,
  type StylesOptionsBlok,
} from "../../styles";
import {
  type NativeColorPickerValue,
  useThemeColor,
} from "../../storyblok/plugins";

/** Icon size options (xs -> 4xl) mapped to pixels. Matches predefined scale. */
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
  styles?: StylesOptionsBlok[];
}

export function ShadcnIcon({ blok }: { blok: ShadcnIconBlok }) {
  if (!blok.name) {
    return null;
  }

  const color = useThemeColor(blok.color_light, blok.color_dark);
  const sizeNum = blok.size ? (ICON_SIZE_PX[blok.size] ?? 24) : 24;
  const storyblokAttrs = storyblokEditable(blok);
  const className = cn(...buildStyleClasses(blok.styles));
  const style = buildInlineStyles(blok.styles);
  const customIcon = renderCustomIcon({
    name: blok.name,
    size: sizeNum,
    color,
    strokeWidth: blok.stroke_width,
    className,
    style,
    storyblokAttrs,
  });

  if (customIcon) {
    return customIcon;
  }

  return (
    <DynamicIcon
      {...storyblokAttrs}
      name={blok.name as IconName}
      size={sizeNum}
      color={color}
      strokeWidth={blok.stroke_width}
      className={className}
      style={style}
    />
  );
}
