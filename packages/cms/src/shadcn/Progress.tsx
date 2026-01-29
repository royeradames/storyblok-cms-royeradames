"use client";

import { storyblokEditable } from "@storyblok/react";
import { Progress, cn } from "@repo/ui";
import type { SbBlokData } from "@storyblok/react";

export interface ShadcnProgressBlok extends SbBlokData {
  value: number;
  max?: number;
  show_label?: boolean;
  label_position?: "top" | "inside" | "bottom";
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "h-2",
  md: "h-4",
  lg: "h-6",
};

export function ShadcnProgress({ blok }: { blok: ShadcnProgressBlok }) {
  const max = blok.max || 100;
  const percentage = Math.min(Math.max((blok.value / max) * 100, 0), 100);
  const size = sizeMap[blok.size || "md"];

  return (
    <div {...storyblokEditable(blok)} className="w-full">
      {blok.show_label && blok.label_position === "top" && (
        <div className="flex justify-between mb-1 text-sm">
          <span>Progress</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <Progress value={percentage} className={size} />
      {blok.show_label && blok.label_position === "bottom" && (
        <div className="flex justify-end mt-1 text-sm text-muted-foreground">
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
    </div>
  );
}
