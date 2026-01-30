"use client";

import { storyblokEditable } from "@storyblok/react";
import { RadioGroup, RadioGroupItem, Label } from "@repo/ui";
import type { SbBlokData } from "@storyblok/react";

export interface ShadcnRadioOptionBlok extends SbBlokData {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface ShadcnRadioGroupBlok extends SbBlokData {
  name: string;
  label?: string;
  options: ShadcnRadioOptionBlok[];
  default_value?: string;
  orientation?: "horizontal" | "vertical";
}

export function ShadcnRadioGroup({ blok }: { blok: ShadcnRadioGroupBlok }) {
  return (
    <div {...storyblokEditable(blok)} className="space-y-3">
      {blok.label && <Label className="text-base">{blok.label}</Label>}
      <RadioGroup
        name={blok.name}
        defaultValue={blok.default_value || blok.options?.[0]?.value}
        className={
          blok.orientation === "horizontal"
            ? "flex flex-wrap gap-4"
            : "space-y-3"
        }
      >
        {blok.options?.map((option) => (
          <div
            key={option._uid}
            className="flex items-start space-x-3"
            {...storyblokEditable(option)}
          >
            <RadioGroupItem
              value={option.value}
              id={`${blok.name}-${option.value}`}
              disabled={option.disabled}
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor={`${blok.name}-${option.value}`}>
                {option.label}
              </Label>
              {option.description && (
                <p className="text-sm text-muted-foreground">
                  {option.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
