"use client";

import { storyblokEditable } from "@storyblok/react";
import { Button, cn } from "@repo/ui";
import type { SbBlokData } from "@storyblok/react";
import { buildStyleClasses, type FlexBreakpointOptionsBlok } from "../styles";

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
  styles?: FlexBreakpointOptionsBlok[];
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
    <Button
      {...storyblokEditable(blok)}
      variant={variant}
      size={size}
      className={cn(...buildStyleClasses(blok.styles))}
    >
      {blok.label}
    </Button>
  );
}
