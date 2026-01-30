"use client";

import { storyblokEditable } from "@storyblok/react";
import { Button } from "@repo/ui";
import type { SbBlokData } from "@storyblok/react";

export interface ShadcnButtonBlok extends SbBlokData {
  label: string;
  variant?:
    | "default"
    | "destructive"
    | "outline-solid"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  link?: {
    url: string;
    target?: string;
  };
}

export function ShadcnButton({ blok }: { blok: ShadcnButtonBlok }) {
  const variant = blok.variant || "default";
  const size = blok.size || "default";

  if (blok.link?.url) {
    return (
      <Button
        {...storyblokEditable(blok)}
        variant={variant}
        size={size}
        asChild
      >
        <a href={blok.link.url} target={blok.link.target || "_self"}>
          {blok.label}
        </a>
      </Button>
    );
  }

  return (
    <Button {...storyblokEditable(blok)} variant={variant} size={size}>
      {blok.label}
    </Button>
  );
}
