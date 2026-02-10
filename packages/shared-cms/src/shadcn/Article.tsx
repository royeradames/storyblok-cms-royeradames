"use client";

import { storyblokEditable } from "@storyblok/react";
import { cn, ScrollArea } from "@repo/ui";
import type { ISbRichtext, SbBlokData } from "@storyblok/react";
import {
  buildStyleClasses,
  buildInlineStyles,
  type StylesBreakpointOptionsBlok,
} from "../styles";
import { extractRichTextHeadings, ShadcnRichTextContent } from "./RichText";

export interface ShadcnArticleBlok extends SbBlokData {
  body: ISbRichtext;
  toc_title?: string;
  styles?: StylesBreakpointOptionsBlok[];
}

export function ShadcnArticle({ blok }: { blok: ShadcnArticleBlok }) {
  const headings = extractRichTextHeadings(blok.body);

  return (
    <article
      {...storyblokEditable(blok)}
      className={cn(
        "grid gap-8 xl:grid-cols-[minmax(0,1fr)_18rem] xl:gap-10",
        ...buildStyleClasses(blok.styles),
      )}
      style={buildInlineStyles(blok.styles)}
    >
      <aside className="xl:order-2">
        <div className="rounded-lg border border-border/70 bg-card/70 p-4 backdrop-blur xl:sticky xl:top-24">
          <p className="mb-3 text-sm font-medium text-primary">
            {blok.toc_title || "On this page"}
          </p>
          <ScrollArea className="max-h-[calc(100vh-10rem)] pr-3">
            <nav aria-label="Table of contents">
              <ul className="space-y-1">
                {headings.length > 0 ? (
                  headings.map((heading) => (
                    <li key={heading.id}>
                      <a
                        href={`#${heading.id}`}
                        className={cn(
                          "block rounded px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-primary",
                          heading.level >= 3 ? "ml-3" : "",
                          heading.level >= 4 ? "ml-6" : "",
                        )}
                      >
                        {heading.text}
                      </a>
                    </li>
                  ))
                ) : (
                  <li className="px-2 py-1 text-sm text-muted-foreground">
                    No headings yet
                  </li>
                )}
              </ul>
            </nav>
          </ScrollArea>
        </div>
      </aside>
      <div className="min-w-0 xl:order-1">
        <div
        className={cn(
          "prose prose-base max-w-none",
          "prose-headings:text-primary prose-headings:font-semibold",
          "prose-p:text-muted-foreground prose-li:text-muted-foreground",
          "prose-strong:text-foreground prose-a:text-primary prose-a:underline",
          "[&>*]:!my-0",
          "[&>*+*]:pt-4",
          "[&>*+h1]:pt-8 [&>*+h2]:pt-8 [&>*+h3]:pt-8 [&>*+h4]:pt-8 [&>*+h5]:pt-8 [&>*+h6]:pt-8",
          "[&_.sb-richtext-blok]:pt-4 [&_.sb-richtext-blok:first-child]:pt-0",
        )}
        >
          <ShadcnRichTextContent
            content={blok.body}
            variant="article"
            headingIds={headings.map((heading) => heading.id)}
          />
        </div>
      </div>
    </article>
  );
}
