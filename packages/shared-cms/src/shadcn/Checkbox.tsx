"use client";

import { storyblokEditable } from "@storyblok/react";
import { Checkbox, Label, cn } from "@repo/ui";
import type { SbBlokData } from "@storyblok/react";
import { buildStyleClasses, buildInlineStyles, type StylesBreakpointOptionsBlok } from "../styles";

export interface ShadcnCheckboxBlok extends SbBlokData {
  name: string;
  label: string;
  description?: string;
  default_checked?: boolean;
  disabled?: boolean;
  styles?: StylesBreakpointOptionsBlok[];
}

export function ShadcnCheckbox({ blok }: { blok: ShadcnCheckboxBlok }) {
  return (
    <div
      {...storyblokEditable(blok)}
      className={cn("flex items-start space-x-3", ...buildStyleClasses(blok.styles))}
      style={buildInlineStyles(blok.styles)}
    >
      <Checkbox
        id={blok.name}
        name={blok.name}
        defaultChecked={blok.default_checked}
        disabled={blok.disabled}
      />
      <div className="grid gap-1.5 leading-none">
        <Label
          htmlFor={blok.name}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {blok.label}
        </Label>
        {blok.description && (
          <p className="text-sm text-muted-foreground">{blok.description}</p>
        )}
      </div>
    </div>
  );
}
