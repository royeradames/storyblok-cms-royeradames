"use client";

import {
  BlockTypes,
  StoryblokComponent,
  convertAttributesInElement,
  storyblokEditable,
  type ISbRichtext,
  useStoryblokRichText,
} from "@storyblok/react";
import { cn } from "@repo/ui";
import React, { type ReactElement } from "react";
import type { SbBlokData } from "@storyblok/react";
import {
  buildStyleClasses,
  buildInlineStyles,
  type StylesBreakpointOptionsBlok,
} from "../styles";

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

type RichTextVariant = "default" | "article";
type ResolverNode = RichTextNode & { children?: React.ReactNode };

interface RichTextNode {
  type?: string;
  text?: string;
  attrs?: {
    key?: string;
    level?: number;
    body?: (SbBlokData & { component?: string })[];
  };
  content?: RichTextNode[];
}

export interface RichTextHeading {
  id: string;
  text: string;
  level: number;
}

function slugifyHeading(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function getNodeText(node: RichTextNode): string {
  if (node.type === "text") return node.text || "";
  return (node.content || []).map(getNodeText).join("");
}

function collectHeadings(
  node: RichTextNode,
  ids: Map<string, number>,
  out: RichTextHeading[],
): void {
  if (node.type === "heading") {
    const level = Math.min(Math.max(Number(node.attrs?.level || 2), 1), 6);
    const text = getNodeText(node).trim();
    if (text.length > 0) {
      const base = slugifyHeading(text) || "section";
      const count = ids.get(base) ?? 0;
      ids.set(base, count + 1);
      out.push({
        id: count === 0 ? base : `${base}-${count + 1}`,
        text,
        level,
      });
    }
  }

  for (const child of node.content || []) {
    collectHeadings(child, ids, out);
  }
}

export function extractRichTextHeadings(
  content: ISbRichtext,
): RichTextHeading[] {
  const root = content as unknown as RichTextNode;
  const ids = new Map<string, number>();
  const headings: RichTextHeading[] = [];
  collectHeadings(root, ids, headings);
  return headings;
}

export function ShadcnRichTextContent({
  content,
  variant = "default",
  headingIds,
}: {
  content: ISbRichtext;
  variant?: RichTextVariant;
  headingIds?: string[];
}) {
  let headingIndex = 0;
  const isArticle = variant === "article";
  let resolverKeyCounter = 0;

  const getNodeKey = (node: ResolverNode | RichTextNode, prefix: string) =>
    node.attrs?.key ?? `${prefix}-${resolverKeyCounter++}`;

  const normalizeListItemChildren = (children: React.ReactNode) => {
    const items = React.Children.toArray(children);
    if (items.length !== 1) return children;
    const onlyChild = items[0];
    if (
      React.isValidElement(onlyChild) &&
      typeof onlyChild.type === "string" &&
      onlyChild.type === "p"
    ) {
      return (onlyChild as ReactElement<any>).props.children;
    }
    return children;
  };

  function renderTable(
    node: ResolverNode,
    className?: string,
    wrapperClassName?: string,
  ) {
    const childrenArray = React.Children.toArray(node.children);
    const allRows = childrenArray.every(
      (child) => React.isValidElement(child) && child.type === "tr",
    );
    const tableChildren = allRows ? (
      <tbody>{childrenArray}</tbody>
    ) : (
      node.children
    );

    const table = (
      <table key={getNodeKey(node, "table")} className={className}>
        {tableChildren}
      </table>
    );

    return wrapperClassName ? (
      <div className={wrapperClassName}>{table}</div>
    ) : (
      table
    );
  }

  const resolvers = {
    [BlockTypes.HEADING]: (node: ResolverNode) => {
      const level = Math.min(Math.max(Number(node.attrs?.level || 2), 1), 6);
      const id = headingIds?.[headingIndex++];
      const className = isArticle
        ? "text-primary font-semibold scroll-mt-24"
        : undefined;
      const key = getNodeKey(node, `h${level}`);

      if (level === 1)
        return (
          <h1 key={key} id={id} className={className}>
            {node.children}
          </h1>
        );
      if (level === 2)
        return (
          <h2 key={key} id={id} className={className}>
            {node.children}
          </h2>
        );
      if (level === 3)
        return (
          <h3 key={key} id={id} className={className}>
            {node.children}
          </h3>
        );
      if (level === 4)
        return (
          <h4 key={key} id={id} className={className}>
            {node.children}
          </h4>
        );
      if (level === 5)
        return (
          <h5 key={key} id={id} className={className}>
            {node.children}
          </h5>
        );
      return (
        <h6 key={key} id={id} className={className}>
          {node.children}
        </h6>
      );
    },
    [BlockTypes.PARAGRAPH]: (node: ResolverNode) => (
      <p
        key={getNodeKey(node, "p")}
        className={cn(
          "whitespace-pre-line",
          isArticle ? "text-muted-foreground" : undefined,
        )}
      >
        {node.children}
      </p>
    ),
    [BlockTypes.QUOTE]: (node: ResolverNode) => (
      <blockquote
        key={getNodeKey(node, "quote")}
        className={cn(
          isArticle &&
            "border-l-2 border-border pl-4 italic text-muted-foreground",
        )}
      >
        {node.children}
      </blockquote>
    ),
    [BlockTypes.UL_LIST]: (node: ResolverNode) => (
      <ul
        key={getNodeKey(node, "ul")}
        className={
          isArticle
            ? "text-muted-foreground list-disc list-outside pl-6 marker:text-muted-foreground"
            : undefined
        }
      >
        {node.children}
      </ul>
    ),
    [BlockTypes.OL_LIST]: (node: ResolverNode) => (
      <ol
        key={getNodeKey(node, "ol")}
        className={
          isArticle
            ? "text-muted-foreground list-decimal list-outside pl-6 marker:text-muted-foreground"
            : undefined
        }
      >
        {node.children}
      </ol>
    ),
    [BlockTypes.LIST_ITEM]: (node: ResolverNode) => (
      <li
        key={getNodeKey(node, "li")}
        className={cn(
          "whitespace-pre-line",
          isArticle ? "text-muted-foreground" : undefined,
        )}
      >
        {normalizeListItemChildren(node.children)}
      </li>
    ),
    [BlockTypes.TABLE]: (node: ResolverNode) =>
      isArticle
        ? renderTable(
            node,
            "w-full caption-bottom text-sm",
            "overflow-x-auto rounded-md border border-border/70",
          )
        : renderTable(node),
    [BlockTypes.TABLE_ROW]: (node: ResolverNode) => (
      <tr
        key={getNodeKey(node, "tr")}
        className={isArticle ? "border-b border-border/60" : undefined}
      >
        {node.children}
      </tr>
    ),
    [BlockTypes.TABLE_HEADER]: (node: ResolverNode) => (
      <th
        key={getNodeKey(node, "th")}
        className={cn(
          "text-left",
          isArticle &&
            "h-10 px-3 align-middle font-medium text-primary bg-muted/30",
        )}
      >
        {node.children}
      </th>
    ),
    [BlockTypes.TABLE_CELL]: (node: ResolverNode) => (
      <td
        key={getNodeKey(node, "td")}
        className={
          isArticle ? "p-3 align-middle text-muted-foreground" : undefined
        }
      >
        {node.children}
      </td>
    ),
    table_row: (node: ResolverNode) => (
      <tr
        key={getNodeKey(node, "tr")}
        className={isArticle ? "border-b border-border/60" : undefined}
      >
        {node.children}
      </tr>
    ),
    table_header: (node: ResolverNode) => (
      <th
        key={getNodeKey(node, "th")}
        className={cn(
          "text-left",
          isArticle &&
            "h-10 px-3 align-middle font-medium text-primary bg-muted/30",
        )}
      >
        {node.children}
      </th>
    ),
    table_cell: (node: ResolverNode) => (
      <td
        key={getNodeKey(node, "td")}
        className={
          isArticle ? "p-3 align-middle text-muted-foreground" : undefined
        }
      >
        {node.children}
      </td>
    ),
    [BlockTypes.COMPONENT]: (node: RichTextNode) => (
      <div key={getNodeKey(node, "blok")} className="sb-richtext-blok">
        {(node.attrs?.body || []).map((nestedBlok, index) => (
          <StoryblokComponent
            blok={nestedBlok}
            key={
              nestedBlok._uid || `${nestedBlok.component || "blok"}-${index}`
            }
          />
        ))}
      </div>
    ),
  } as const;

  const { render } = useStoryblokRichText({
    keyedResolvers: true,
    // Preserve resolver-provided keys to avoid duplicate-key warnings.
    textFn: (text: string, attrs?: Record<string, any>) =>
      React.createElement(
        React.Fragment,
        { key: attrs?.key ?? `txt-${resolverKeyCounter++}` },
        text,
      ),
    resolvers: resolvers as any,
  });
  const richTextNode = render(content as any);
  return <>{convertAttributesInElement(richTextNode as ReactElement)}</>;
}

export function ShadcnRichText({
  blok,
  variant = "default",
  headingIds,
}: {
  blok: ShadcnRichTextBlok;
  variant?: RichTextVariant;
  headingIds?: string[];
}) {
  const isArticle = variant === "article";

  return (
    <div
      {...storyblokEditable(blok as unknown as SbBlokData)}
      className={cn(
        proseSizeMap[blok.prose_size || "base"],
        "prose-a:text-primary prose-a:underline",
        isArticle &&
          "prose-headings:font-semibold prose-headings:text-primary prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground prose-code:text-foreground",
        "max-w-none",
        ...buildStyleClasses(blok.styles),
      )}
      style={buildInlineStyles(blok.styles)}
    >
      <ShadcnRichTextContent
        content={blok.content}
        variant={variant}
        headingIds={headingIds}
      />
    </div>
  );
}
