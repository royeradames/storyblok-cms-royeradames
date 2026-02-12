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
  ARTICLE_RICH_TEXT_RENDER_CONFIG,
  ShadcnRichTextContent,
  type BuilderRichTextInputsBlok,
  extractRichTextHeadings,
  resolveRichTextRenderConfig,
} from "./rich-text/RichText";
import type { ShadcnArticleAsideBlok } from "./ArticleAside";

export interface BuilderRichTextBlok extends Omit<SbBlokData, "content"> {
  content: ISbRichtext;
  prose_size?: "sm" | "base" | "lg";
  aside_left?: SbBlokData[];
  aside_right?: SbBlokData[];
  render_inputs?: BuilderRichTextInputsBlok[];
  styles?: StylesBreakpointOptionsBlok[];
}

const PROSE_SIZE_CLASS_BY_OPTION = {
  sm: "prose-sm",
  base: "prose",
  lg: "prose-lg",
} as const;

export function BuilderRichText({ blok }: { blok: BuilderRichTextBlok }) {
  const headings = extractRichTextHeadings(blok.content);
  const headingIds = headings.map((heading) => heading.id);
  const renderConfig = resolveRichTextRenderConfig({
    base: ARTICLE_RICH_TEXT_RENDER_CONFIG,
    blokInputs: blok.render_inputs?.[0],
  });
  const asideLeftBlok = blok.aside_left?.[0];
  const asideRightBlok = blok.aside_right?.[0];
  const hasAsideLeft = Boolean(asideLeftBlok);
  const hasAsideRight = Boolean(asideRightBlok);
  const hasAnyAside = hasAsideLeft || hasAsideRight;
  const withHeadingData = (asideBlok: SbBlokData): SbBlokData => {
    const componentName =
      typeof asideBlok.component === "string" ? asideBlok.component : "";
    if (!componentName.endsWith("article_aside")) return asideBlok;

    return {
      ...asideBlok,
      headings,
    } satisfies ShadcnArticleAsideBlok;
  };

  return (
    <div
      {...storyblokEditable(blok)}
      className={cn(
        hasAnyAside
          ? "grid gap-8 lg:grid-cols-[16rem_minmax(0,1fr)_18rem] lg:gap-10"
          : "",
        ...buildStyleClasses(blok.styles),
      )}
      style={buildInlineStyles(blok.styles)}
    >
      {asideLeftBlok ? (
        <div className="lg:order-1">
          <StoryblokComponent
            blok={withHeadingData(asideLeftBlok)}
            key={asideLeftBlok._uid || "aside-left"}
          />
        </div>
      ) : null}
      <div
        className={cn(
          "min-w-0",
          PROSE_SIZE_CLASS_BY_OPTION[blok.prose_size || "base"],
          renderConfig.classes.prose,
          "max-w-none",
          hasAsideLeft ? "lg:order-2" : "",
          hasAsideRight ? "lg:order-2" : "",
        )}
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
        headingIds={headingIds}
        renderConfig={renderConfig}
      />
      </div>
      {asideRightBlok ? (
        <div className="lg:order-3">
          <StoryblokComponent
            blok={withHeadingData(asideRightBlok)}
            key={asideRightBlok._uid || "aside-right"}
          />
        </div>
      ) : null}
    </div>
  );
}
