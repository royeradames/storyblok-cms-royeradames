"use client";

import { storyblokEditable } from "@storyblok/react";
import { cn } from "@repo/ui";
import type { SbBlokData } from "@storyblok/react";
import { buildStyleClasses, buildInlineStyles, type StylesBreakpointOptionsBlok } from "../styles";
import {
  type NativeColorPickerValue,
  useThemeColor,
  useMounted,
} from "../storyblok/plugins";

export interface ShadcnTextBlok extends SbBlokData {
  content: string;
  element?:
    | "p"
    | "span"
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "q"
    | "blockquote";
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  weight?: "normal" | "medium" | "semibold" | "bold";
  color?: "default" | "muted" | "primary" | "destructive";
  /** Light theme color (native-color-picker). Overrides semantic color when set. */
  color_light?: NativeColorPickerValue;
  /** Dark theme color (native-color-picker). Overrides semantic color when set. */
  color_dark?: NativeColorPickerValue;
  align?: "left" | "center" | "right";
  line_height?: "none" | "tight" | "snug" | "normal" | "relaxed" | "loose";
  letter_spacing?: "tighter" | "tight" | "normal" | "wide" | "wider" | "widest";
  styles?: StylesBreakpointOptionsBlok[];
}

const sizeMap = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
  "5xl": "text-5xl",
  "6xl": "text-6xl",
  "7xl": "text-7xl",
  "8xl": "text-8xl",
  "9xl": "text-9xl",
};

const weightMap = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
};

const colorMap = {
  default: "text-foreground",
  muted: "text-muted-foreground",
  primary: "text-primary",
  destructive: "text-destructive",
};

const alignMap = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const lineHeightMap = {
  none: "leading-none",
  tight: "leading-tight",
  snug: "leading-snug",
  normal: "leading-normal",
  relaxed: "leading-relaxed",
  loose: "leading-loose",
};

const letterSpacingMap = {
  tighter: "tracking-tighter",
  tight: "tracking-tight",
  normal: "tracking-normal",
  wide: "tracking-wide",
  wider: "tracking-wider",
  widest: "tracking-widest",
};

export function ShadcnText({ blok }: { blok: ShadcnTextBlok }) {
  const Element = blok.element || "p";
  const themeColor = useThemeColor(blok.color_light, blok.color_dark);
  const mounted = useMounted();
  // Apply theme color only after mount to avoid hydration mismatch (server has no theme).
  const useThemeColorStyle = mounted && themeColor;

  return (
    <Element
      {...storyblokEditable(blok)}
      className={cn(
        "text-wrap",
        sizeMap[blok.size || "base"],
        weightMap[blok.weight || "normal"],
        useThemeColorStyle ? undefined : colorMap[blok.color || "default"],
        alignMap[blok.align || "left"],
        lineHeightMap[blok.line_height ?? "normal"],
        letterSpacingMap[blok.letter_spacing ?? "normal"],
        ...buildStyleClasses(blok.styles)
      )}
      style={{ ...buildInlineStyles(blok.styles), ...(useThemeColorStyle ? { color: themeColor } : undefined) }}
    >
      {blok.content}
    </Element>
  );
}
