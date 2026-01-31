"use client";

import { storyblokEditable } from "@storyblok/react";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import type { SbBlokData } from "@storyblok/react";

export interface ShadcnIconBlok extends SbBlokData {
  name: string;
  size?: number;
  color?: string;
  stroke_width?: number;
  class_name?: string;
}

export function ShadcnIcon({ blok }: { blok: ShadcnIconBlok }) {
  return (
    <DynamicIcon
      {...storyblokEditable(blok)}
      name={blok.name as IconName}
      size={blok.size ?? 24}
      color={blok.color}
      strokeWidth={blok.stroke_width}
      className={blok.class_name}
    />
  );
}
