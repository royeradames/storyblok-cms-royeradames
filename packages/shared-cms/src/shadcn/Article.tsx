"use client";

import { StoryblokComponent, storyblokEditable } from "@storyblok/react";
import { cn } from "@repo/ui";
import type { SbBlokData } from "@storyblok/react";
import {
  buildStyleClasses,
  buildInlineStyles,
  type StylesBreakpointOptionsBlok,
} from "../styles";
import {
  extractRichTextHeadingsFromBloks,
} from "./rich-text/RichText";
import type { BuilderRichTextBlok } from "./BuilderRichText";
import type { ShadcnArticleAsideBlok } from "./ArticleAside";

export interface ShadcnArticleBlok extends SbBlokData {
  article_content?: SbBlokData[];
  table_of_contents?: ShadcnArticleAsideBlok[];
  styles?: StylesBreakpointOptionsBlok[];
}

function isBuilderRichTextBlok(blok: SbBlokData): blok is BuilderRichTextBlok {
  const componentName = typeof blok.component === "string" ? blok.component : "";
  return componentName.endsWith("builder_rich_text");
}

export function ShadcnArticle({ blok }: { blok: ShadcnArticleBlok }) {
  const articleContentBloks = blok.article_content ?? [];
  const { headings, headingIdsByBlokUid } =
    extractRichTextHeadingsFromBloks(articleContentBloks);
  const articleContentWithComputedData: SbBlokData[] = articleContentBloks.map(
    (contentBlok) => {
      const blokUid = typeof contentBlok._uid === "string" ? contentBlok._uid : "";
      if (!isBuilderRichTextBlok(contentBlok) || !blokUid) return contentBlok;

      const headingIds = headingIdsByBlokUid[blokUid];
      if (!headingIds) return contentBlok;

      const contentBlokWithHeadingIds: BuilderRichTextBlok = {
        ...contentBlok,
        heading_ids: headingIds,
      };
      return contentBlokWithHeadingIds;
    },
  );
  const tableOfContentsBlok = blok.table_of_contents?.[0];
  const asideBlokWithArticleData = tableOfContentsBlok
    ? ({
        ...tableOfContentsBlok,
        headings,
      } satisfies ShadcnArticleAsideBlok)
    : null;
  const hasTableOfContents = Boolean(asideBlokWithArticleData);

  return (
    <div
      {...storyblokEditable(blok)}
      className={cn(
        hasTableOfContents
          ? "grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-10"
          : "",
        ...buildStyleClasses(blok.styles),
      )}
      style={buildInlineStyles(blok.styles)}
    >
      {asideBlokWithArticleData && (
        <StoryblokComponent
          blok={asideBlokWithArticleData}
          key={asideBlokWithArticleData._uid}
        />
      )}
      <div className={cn("min-w-0", hasTableOfContents ? "lg:order-1" : "")}>
        {articleContentWithComputedData.map((contentBlok, index) => {
          const contentBlokUid =
            typeof contentBlok._uid === "string" ? contentBlok._uid : "";
          const contentBlokComponent =
            typeof contentBlok.component === "string"
              ? contentBlok.component
              : "article-content";

          return (
            <StoryblokComponent
              blok={contentBlok}
              key={contentBlokUid || `${contentBlokComponent}-${index}`}
            />
          );
        })}
      </div>
    </div>
  );
}
