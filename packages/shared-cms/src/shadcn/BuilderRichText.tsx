"use client";

import { StoryblokComponent, storyblokEditable, type ISbRichtext } from "@storyblok/react";
import { cn } from "@repo/ui";
import type { SbBlokData } from "@storyblok/react";
import {
  buildStyleClasses,
  buildInlineStyles,
  type StylesBreakpointOptionsBlok,
} from "../styles";
import {
  ShadcnRichTextContent,
  type BuilderRichTextInputsBlok,
  resolveRichTextRenderConfig,
} from "./rich-text/RichText";

export interface BuilderRichTextBlok extends Omit<SbBlokData, "content"> {
  content: ISbRichtext;
  prose_size?: "sm" | "base" | "lg";
  heading_ids?: string[];
  render_inputs?: BuilderRichTextInputsBlok[];
  styles?: StylesBreakpointOptionsBlok[];
}

const PROSE_SIZE_CLASS_BY_OPTION = {
  sm: "prose-sm",
  base: "prose",
  lg: "prose-lg",
} as const;

export function BuilderRichText({ blok }: { blok: BuilderRichTextBlok }) {
  const renderConfig = resolveRichTextRenderConfig({
    blokInputs: blok.render_inputs?.[0],
  });

  return (
    <div
      {...storyblokEditable(blok)}
      className={cn(
        PROSE_SIZE_CLASS_BY_OPTION[blok.prose_size || "base"],
        renderConfig.classes.prose,
        "max-w-none",
        ...buildStyleClasses(blok.styles),
      )}
      style={buildInlineStyles(blok.styles)}
    >
      {blok.render_inputs?.length ? (
        <div className="hidden" aria-hidden="true">
          {blok.render_inputs.map((inputBlok) => (
            <StoryblokComponent blok={inputBlok} key={inputBlok._uid} />
          ))}
        </div>
      ) : null}
      <ShadcnRichTextContent
        content={blok.content}
        headingIds={blok.heading_ids}
        renderConfig={renderConfig}
      />
    </div>
  );
}
