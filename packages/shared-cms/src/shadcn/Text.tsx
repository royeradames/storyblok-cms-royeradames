"use client";

import { storyblokEditable } from "@storyblok/react";
import { cn } from "@repo/ui";
import type { SbBlokData } from "@storyblok/react";
import { buildStyleClasses, type FlexBreakpointOptionsBlok } from "../styles";
import {
  type NativeColorPickerValue,
  useThemeColor,
} from "../storyblok/plugins";

export interface ShadcnTextBlok extends SbBlokData {
  content: string;
  element?: "p" | "span" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  weight?: "normal" | "medium" | "semibold" | "bold";
  color?: "default" | "muted" | "primary" | "destructive";
  /** Light theme color (native-color-picker). Overrides semantic color when set. */
  color_light?: NativeColorPickerValue;
  /** Dark theme color (native-color-picker). Overrides semantic color when set. */
  color_dark?: NativeColorPickerValue;
  align?: "left" | "center" | "right";
  styles?: FlexBreakpointOptionsBlok[];
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

export function ShadcnText({ blok }: { blok: ShadcnTextBlok }) {
  const Element = blok.element || "p";
  const themeColor = useThemeColor(blok.color_light, blok.color_dark);

  return (
    <Element
      {...storyblokEditable(blok)}
      className={cn(
        "text-wrap",
        sizeMap[blok.size || "base"],
        weightMap[blok.weight || "normal"],
        themeColor ? undefined : colorMap[blok.color || "default"],
        alignMap[blok.align || "left"],
        ...buildStyleClasses(blok.styles)
      )}
      style={themeColor ? { color: themeColor } : undefined}
    >
      {blok.content}
    </Element>
  );
}
