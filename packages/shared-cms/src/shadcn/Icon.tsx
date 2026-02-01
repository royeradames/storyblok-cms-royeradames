"use client";

import { useTheme } from "next-themes";
import { storyblokEditable } from "@storyblok/react";
import { cn } from "@repo/ui";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import type { SbBlokData } from "@storyblok/react";
import { buildStyleClasses, type FlexBreakpointOptionsBlok } from "../styles";

/** Plugin default when no color is set (cannot be configured in Storyblok). Treat as "no override". */
const NATIVE_COLOR_PICKER_DEFAULT = "#f40000";

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

/** Plugin fields (e.g. native-color-picker) may store value as string or as object with _blok_color/color/value */
function getColorValue(v: unknown): string | undefined {
  if (v == null) return undefined;
  let s: string | undefined;
  if (typeof v === "string") s = v.trim() || undefined;
  else if (typeof v === "object" && v !== null) {
    const o = v as Record<string, unknown>;
    const c = o._blok_color ?? o.color ?? o.value;
    s = typeof c === "string" ? c.trim() || undefined : undefined;
  } else {
    s = undefined;
  }
  if (!s) return undefined;
  if (s.toLowerCase() === NATIVE_COLOR_PICKER_DEFAULT) return undefined;
  return s;
}

export interface ShadcnIconBlok extends SbBlokData {
  name: string;
  size?: "xs" | "sm" | "default" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  /** Light theme color (plugin may send string or object e.g. { _blok_color }) */
  color_light?: string;
  /** Dark theme color (plugin may send string or object e.g. { _blok_color }) */
  color_dark?: string;
  stroke_width?: number;
  class_name?: string;
  styles?: FlexBreakpointOptionsBlok[];
}

export function ShadcnIcon({ blok }: { blok: ShadcnIconBlok }) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const raw = isDark ? blok.color_dark : blok.color_light;
  const color = getColorValue(raw as unknown);
  const sizeNum = blok.size ? ICON_SIZE_PX[blok.size] ?? 24 : 24;

  return (
    <DynamicIcon
      {...storyblokEditable(blok)}
      name={blok.name as IconName}
      size={sizeNum}
      color={color}
      strokeWidth={blok.stroke_width}
      className={cn(blok.class_name, ...buildStyleClasses(blok.styles))}
    />
  );
}
