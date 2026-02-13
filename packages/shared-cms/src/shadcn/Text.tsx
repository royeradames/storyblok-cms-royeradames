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
  font_style?: "normal" | "italic";
  line_height?: "none" | "tight" | "snug" | "normal" | "relaxed" | "loose";
  letter_spacing?: "tighter" | "tight" | "normal" | "wide" | "wider" | "widest";
  sr_only?: boolean;
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

const fontStyleMap = {
  normal: "not-italic",
  italic: "italic",
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
  const isBlockquote = blok.element === "blockquote";
  // Apply theme color only after mount to avoid hydration mismatch (server has no theme).
  const useThemeColorStyle = mounted && themeColor;

  return (
    <Element
      {...storyblokEditable(blok)}
      className={cn(
        blok.sr_only ? "sr-only" : "text-wrap",
        !blok.sr_only && sizeMap[blok.size || "base"],
        !blok.sr_only && weightMap[blok.weight || "normal"],
        !blok.sr_only && (useThemeColorStyle ? undefined : colorMap[blok.color || "default"]),
        !blok.sr_only && alignMap[blok.align || "left"],
        !blok.sr_only && fontStyleMap[blok.font_style ?? "normal"],
        !blok.sr_only && lineHeightMap[blok.line_height ?? "normal"],
        !blok.sr_only && letterSpacingMap[blok.letter_spacing ?? "normal"],
        !blok.sr_only &&
          isBlockquote &&
          "before:mr-1 before:content-[open-quote] after:ml-1 after:content-[close-quote]",
        ...buildStyleClasses(blok.styles)
      )}
      style={{ ...buildInlineStyles(blok.styles), ...(useThemeColorStyle ? { color: themeColor } : undefined) }}
    >
      {blok.content}
    </Element>
  );
}
