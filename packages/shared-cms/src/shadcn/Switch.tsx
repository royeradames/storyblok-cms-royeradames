"use client";

import { storyblokEditable } from "@storyblok/react";
import { Switch, Label, cn } from "@repo/ui";
import type { SbBlokData } from "@storyblok/react";
import { buildStyleClasses, buildInlineStyles, type StylesBreakpointOptionsBlok } from "../styles";

export interface ShadcnSwitchBlok extends SbBlokData {
  name: string;
  label: string;
  description?: string;
  default_checked?: boolean;
  disabled?: boolean;
  styles?: StylesBreakpointOptionsBlok[];
}

export function ShadcnSwitch({ blok }: { blok: ShadcnSwitchBlok }) {
  return (
    <div
      {...storyblokEditable(blok)}
      className={cn(
        "flex items-center justify-between",
        ...buildStyleClasses(blok.styles),
      )}
      style={buildInlineStyles(blok.styles)}
    >
      <div className="space-y-0.5">
        <Label htmlFor={blok.name}>{blok.label}</Label>
        {blok.description && (
          <p className="text-sm text-muted-foreground">{blok.description}</p>
        )}
      </div>
      <Switch
        id={blok.name}
        name={blok.name}
        defaultChecked={blok.default_checked}
        disabled={blok.disabled}
      />
    </div>
  );
}
