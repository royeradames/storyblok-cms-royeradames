"use client";

import { StoryblokComponent, storyblokEditable } from "@storyblok/react";
import { cn } from "@repo/ui";
import type { ISbRichtext, SbBlokData } from "@storyblok/react";
import {
  buildStyleClasses,
  buildInlineStyles,
  type StylesBreakpointOptionsBlok,
} from "../styles";
import {
  extractRichTextHeadings,
  ShadcnRichTextContent,
  type RichTextNodeOverrides,
} from "./rich-text/RichText";
import type { ShadcnArticleAsideBlok } from "./ArticleAside";

export interface ShadcnArticleBlok extends SbBlokData {
  body: ISbRichtext;
  table_of_contents?: ShadcnArticleAsideBlok[];
  styles?: StylesBreakpointOptionsBlok[];
}

const ARTICLE_RICHTEXT_OVERRIDES = {
  headingOne: {
    component: "shared_article_heading_1",
    textField: "title",
    mirrorTextFields: ["content"],
    wrapperClassName: "sb-article-heading-1",
  },
  headingTwo: {
    component: "shared_article_heading_2",
    textField: "title",
    wrapperClassName: "sb-article-heading-2",
  },
  quote: {
    component: "shared_article_quote",
    textField: "quote",
    wrapperClassName: "sb-article-quote",
  },
} satisfies RichTextNodeOverrides;

export function ShadcnArticle({ blok }: { blok: ShadcnArticleBlok }) {
  const headings = extractRichTextHeadings(blok.body);
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
        <div
          className={cn(
            "prose prose-base max-w-none flex flex-col gap-4",
            "prose-headings:text-primary prose-headings:font-semibold",
            "prose-p:text-muted-foreground prose-li:text-muted-foreground",
            "prose-strong:text-foreground prose-a:text-primary prose-a:underline",
            "[&>*]:!my-0",
            "[&_.sb-heading-section]:my-0",
            "[&_.sb-heading-section>h1]:mt-0 [&_.sb-heading-section>h2]:mt-0 [&_.sb-heading-section>h3]:mt-0 [&_.sb-heading-section>h4]:mt-0 [&_.sb-heading-section>h5]:mt-0 [&_.sb-heading-section>h6]:mt-0",
            "[&_.sb-richtext-blok]:grid [&_.sb-richtext-blok]:gap-4",
          )}
        >
          <ShadcnRichTextContent
            content={blok.body}
            variant="article"
            headingIds={headings.map((heading) => heading.id)}
            overrides={ARTICLE_RICHTEXT_OVERRIDES}
          />
        </div>
      </div>
    </div>
  );
}
