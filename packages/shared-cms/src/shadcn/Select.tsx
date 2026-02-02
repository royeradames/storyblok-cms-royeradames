"use client";

import { storyblokEditable } from "@storyblok/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Label,
  cn,
} from "@repo/ui";
import type { SbBlokData } from "@storyblok/react";
import { buildStyleClasses, type StylesBreakpointOptionsBlok } from "../styles";

export interface ShadcnSelectOptionBlok extends SbBlokData {
  value: string;
  label: string;
  disabled?: boolean;
  styles?: StylesBreakpointOptionsBlok[];
}

export interface ShadcnSelectBlok extends SbBlokData {
  name: string;
  label?: string;
  placeholder?: string;
  options: ShadcnSelectOptionBlok[];
  default_value?: string;
  disabled?: boolean;
  helper_text?: string;
  styles?: StylesBreakpointOptionsBlok[];
}

export function ShadcnSelect({ blok }: { blok: ShadcnSelectBlok }) {
  return (
    <div
      {...storyblokEditable(blok)}
      className={cn("space-y-2", ...buildStyleClasses(blok.styles))}
    >
      {blok.label && <Label htmlFor={blok.name}>{blok.label}</Label>}
      <Select
        name={blok.name}
        defaultValue={blok.default_value}
        disabled={blok.disabled}
      >
        <SelectTrigger id={blok.name}>
          <SelectValue placeholder={blok.placeholder || "Select..."} />
        </SelectTrigger>
        <SelectContent>
          {blok.options?.map((option) => (
            <SelectItem
              key={option._uid}
              value={option.value}
              disabled={option.disabled}
              {...storyblokEditable(option)}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {blok.helper_text && (
        <p className="text-sm text-muted-foreground">{blok.helper_text}</p>
      )}
    </div>
  );
}
