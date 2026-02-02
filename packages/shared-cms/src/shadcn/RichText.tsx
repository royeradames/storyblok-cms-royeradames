"use client";

import {
  storyblokEditable,
  renderRichText,
  type ISbRichtext,
} from "@storyblok/react";
import { cn } from "@repo/ui";
import type { SbBlokData } from "@storyblok/react";
import { buildStyleClasses, type StylesBreakpointOptionsBlok } from "../styles";

export interface ShadcnRichTextBlok extends Omit<SbBlokData, "content"> {
  content: ISbRichtext;
  prose_size?: "sm" | "base" | "lg";
  styles?: StylesBreakpointOptionsBlok[];
  component: string;
  _uid: string;
}

const proseSizeMap = {
  sm: "prose-sm",
  base: "prose",
  lg: "prose-lg",
};

export function ShadcnRichText({ blok }: { blok: ShadcnRichTextBlok }) {
  const html = renderRichText(blok.content);

  return (
    <div
      {...storyblokEditable(blok as unknown as SbBlokData)}
      className={cn(
        proseSizeMap[blok.prose_size || "base"],
        "prose-headings:font-semibold",
        "prose-a:text-primary prose-a:underline",
        "max-w-none",
        ...buildStyleClasses(blok.styles),
      )}
      dangerouslySetInnerHTML={{ __html: html || "" }}
    />
  );
}
