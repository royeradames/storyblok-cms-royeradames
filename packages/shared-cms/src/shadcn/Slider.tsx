"use client";

import { useState } from "react";
import { storyblokEditable } from "@storyblok/react";
import { Slider, Label, cn } from "@repo/ui";
import type { SbBlokData } from "@storyblok/react";
import { buildStyleClasses, buildInlineStyles, type StylesBreakpointOptionsBlok } from "../styles";

export interface ShadcnSliderBlok extends SbBlokData {
  name: string;
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  default_value?: number;
  show_value?: boolean;
  disabled?: boolean;
  styles?: StylesBreakpointOptionsBlok[];
}

export function ShadcnSlider({ blok }: { blok: ShadcnSliderBlok }) {
  const [value, setValue] = useState([blok.default_value || 50]);

  return (
    <div
      {...storyblokEditable(blok)}
      className={cn("space-y-4", ...buildStyleClasses(blok.styles))}
      style={buildInlineStyles(blok.styles)}
    >
      {(blok.label || blok.show_value) && (
        <div className="flex justify-between">
          {blok.label && <Label htmlFor={blok.name}>{blok.label}</Label>}
          {blok.show_value && (
            <span className="text-sm text-muted-foreground">{value[0]}</span>
          )}
        </div>
      )}
      <Slider
        id={blok.name}
        name={blok.name}
        min={blok.min || 0}
        max={blok.max || 100}
        step={blok.step || 1}
        value={value}
        onValueChange={setValue}
        disabled={blok.disabled}
      />
    </div>
  );
}
