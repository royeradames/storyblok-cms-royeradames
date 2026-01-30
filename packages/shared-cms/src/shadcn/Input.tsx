"use client";

import { storyblokEditable } from "@storyblok/react";
import { Input, Label, cn } from "@repo/ui";
import type { SbBlokData } from "@storyblok/react";

export interface ShadcnInputBlok extends SbBlokData {
  name: string;
  label?: string;
  placeholder?: string;
  type?: "text" | "email" | "password" | "number" | "tel" | "url";
  required?: boolean;
  disabled?: boolean;
  helper_text?: string;
}

export function ShadcnInput({ blok }: { blok: ShadcnInputBlok }) {
  return (
    <div {...storyblokEditable(blok)} className="space-y-2">
      {blok.label && (
        <Label htmlFor={blok.name}>
          {blok.label}
          {blok.required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <Input
        id={blok.name}
        name={blok.name}
        type={blok.type || "text"}
        placeholder={blok.placeholder}
        required={blok.required}
        disabled={blok.disabled}
      />
      {blok.helper_text && (
        <p className="text-sm text-muted-foreground">{blok.helper_text}</p>
      )}
    </div>
  );
}
