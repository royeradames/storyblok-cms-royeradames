"use client";

import { storyblokEditable } from "@storyblok/react";
import { cn, ScrollArea } from "@repo/ui";
import type { SbBlokData } from "@storyblok/react";
import {
  buildStyleClasses,
  buildInlineStyles,
  type StylesBreakpointOptionsBlok,
} from "../styles";
import type { RichTextHeading } from "./rich-text/RichText";

export interface ShadcnArticleAsideBlok extends SbBlokData {
  title?: string;
  empty_message?: string;
  headings?: RichTextHeading[];
  styles?: StylesBreakpointOptionsBlok[];
}

export function ShadcnArticleAside({ blok }: { blok: ShadcnArticleAsideBlok }) {
  const headings = blok.headings ?? [];

  return (
    <aside
      {...storyblokEditable(blok)}
      className={cn("lg:order-2", ...buildStyleClasses(blok.styles))}
      style={buildInlineStyles(blok.styles)}
    >
      <div className="rounded-lg border border-border/70 bg-card/70 p-4 backdrop-blur lg:sticky lg:top-10">
        <p className="mb-3 text-sm font-medium text-primary">
          {blok.title || "On this page"}
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
                  {blok.empty_message || "No headings yet"}
                </li>
              )}
            </ul>
          </nav>
        </ScrollArea>
      </div>
    </aside>
  );
}
