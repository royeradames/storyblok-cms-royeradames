"use client";

import { storyblokEditable } from "@storyblok/react";
import { cn } from "@repo/ui";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import type { SbBlokData } from "@storyblok/react";
import { buildStyleClasses, type FlexBreakpointOptionsBlok } from "../styles";

export interface ShadcnIconBlok extends SbBlokData {
  name: string;
  size?: number;
  color?: string;
  stroke_width?: number;
  class_name?: string;
  styles?: FlexBreakpointOptionsBlok[];
}

export function ShadcnIcon({ blok }: { blok: ShadcnIconBlok }) {
  return (
    <DynamicIcon
      {...storyblokEditable(blok)}
      name={blok.name as IconName}
      size={blok.size ?? 24}
      color={blok.color}
      strokeWidth={blok.stroke_width}
      className={cn(blok.class_name, ...buildStyleClasses(blok.styles))}
    />
  );
}
