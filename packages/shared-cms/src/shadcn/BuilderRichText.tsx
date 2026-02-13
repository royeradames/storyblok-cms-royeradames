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
  type RichTextNodeMappingsBlok,
  createDefaultRichTextNodeMappingsBlok,
  extractRichTextHeadings,
  resolveRichTextNodeOverrides,
  resolveRichTextRenderConfig,
} from "./rich-text/RichText";
import type { ShadcnArticleAsideBlok } from "./ArticleAside";

export interface BuilderRichTextBlok extends Omit<SbBlokData, "content"> {
  content: ISbRichtext;
  node_mappings?: RichTextNodeMappingsBlok[];
  intro?: SbBlokData[];
  footer?: SbBlokData[];
  aside_left?: SbBlokData[];
  aside_right?: SbBlokData[];
  styles?: StylesBreakpointOptionsBlok[];
}

export function BuilderRichText({ blok }: { blok: BuilderRichTextBlok }) {
  const headings = extractRichTextHeadings(blok.content);
  const headingIds = headings.map((heading) => heading.id);
  const nodeMappingsBlok = blok.node_mappings?.[0] || createDefaultRichTextNodeMappingsBlok();
  const richTextOverrides = resolveRichTextNodeOverrides(nodeMappingsBlok);
  const renderConfig = resolveRichTextRenderConfig({
    base: ARTICLE_RICH_TEXT_RENDER_CONFIG,
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
        <div className="order-1 lg:order-1">
          <StoryblokComponent
            blok={withHeadingData(asideLeftBlok)}
            key={asideLeftBlok._uid || "aside-left"}
          />
        </div>
      ) : null}
      <div
        className={cn(
          "min-w-0",
          "prose",
          renderConfig.classes.prose,
          "max-w-none",
          hasAsideRight
            ? "order-3 lg:order-2"
            : hasAsideLeft
              ? "order-2 lg:order-2"
              : "",
        )}
      >
      {blok.intro?.map((introBlok, index) => (
        <StoryblokComponent
          blok={introBlok}
          key={introBlok._uid || `${introBlok.component || "intro"}-${index}`}
        />
      ))}
      {blok.node_mappings?.length ? (
        <div className="hidden" aria-hidden="true">
          {blok.node_mappings.map((mappingBlok) => (
            <StoryblokComponent blok={mappingBlok} key={mappingBlok._uid} />
          ))}
        </div>
      ) : null}
      <ShadcnRichTextContent
        content={blok.content}
        headingIds={headingIds}
        overrides={richTextOverrides}
        renderConfig={renderConfig}
      />
      {blok.footer?.map((footerBlok, index) => (
        <StoryblokComponent
          blok={footerBlok}
          key={footerBlok._uid || `${footerBlok.component || "footer"}-${index}`}
        />
      ))}
      </div>
      {asideRightBlok ? (
        <div className="order-2 lg:order-3">
          <StoryblokComponent
            blok={withHeadingData(asideRightBlok)}
            key={asideRightBlok._uid || "aside-right"}
          />
        </div>
      ) : null}
    </div>
  );
}
