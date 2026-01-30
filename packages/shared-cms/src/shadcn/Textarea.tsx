"use client";

import { storyblokEditable } from "@storyblok/react";
import { Textarea, Label } from "@repo/ui";
import type { SbBlokData } from "@storyblok/react";

export interface ShadcnTextareaBlok extends SbBlokData {
  name: string;
  label?: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  disabled?: boolean;
  helper_text?: string;
}

export function ShadcnTextarea({ blok }: { blok: ShadcnTextareaBlok }) {
  return (
    <div {...storyblokEditable(blok)} className="space-y-2">
      {blok.label && (
        <Label htmlFor={blok.name}>
          {blok.label}
          {blok.required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <Textarea
        id={blok.name}
        name={blok.name}
        placeholder={blok.placeholder}
        rows={blok.rows || 4}
        required={blok.required}
        disabled={blok.disabled}
      />
      {blok.helper_text && (
        <p className="text-sm text-muted-foreground">{blok.helper_text}</p>
      )}
    </div>
  );
}
