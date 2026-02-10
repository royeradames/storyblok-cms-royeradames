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
export type RichTextHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface RichTextNodeOverrideConfig {
  component: string;
  textField: string;
  mirrorTextFields?: string[];
  idField?: string;
  levelField?: string;
  bodyField?: string;
  wrapperClassName?: string;
  staticFields?: Record<string, unknown>;
}
export type RichTextHeadingOverrideConfig = RichTextNodeOverrideConfig;

export interface RichTextNodeOverrides {
  headingOne?: RichTextNodeOverrideConfig;
  headingTwo?: RichTextNodeOverrideConfig;
  headingThree?: RichTextNodeOverrideConfig;
  headingFour?: RichTextNodeOverrideConfig;
  headingFive?: RichTextNodeOverrideConfig;
  headingSix?: RichTextNodeOverrideConfig;
  quote?: RichTextNodeOverrideConfig;
  paragraph?: RichTextNodeOverrideConfig;
  unorderedList?: RichTextNodeOverrideConfig;
  orderedList?: RichTextNodeOverrideConfig;
  listItem?: RichTextNodeOverrideConfig;
  table?: RichTextNodeOverrideConfig;
  tableRow?: RichTextNodeOverrideConfig;
  tableHeader?: RichTextNodeOverrideConfig;
  tableCell?: RichTextNodeOverrideConfig;
  embeddedComponent?: RichTextNodeOverrideConfig;
}

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
  overrides,
}: {
  content: ISbRichtext;
  variant?: RichTextVariant;
  headingIds?: string[];
  overrides?: RichTextNodeOverrides;
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

  const renderDefaultHeading = (
    level: RichTextHeadingLevel,
    key: string,
    id: string | undefined,
    className: string | undefined,
    children: React.ReactNode,
  ) => {
    if (level === 1)
      return (
        <h1 key={key} id={id} className={className}>
          {children}
        </h1>
      );
    if (level === 2)
      return (
        <h2 key={key} id={id} className={className}>
          {children}
        </h2>
      );
    if (level === 3)
      return (
        <h3 key={key} id={id} className={className}>
          {children}
        </h3>
      );
    if (level === 4)
      return (
        <h4 key={key} id={id} className={className}>
          {children}
        </h4>
      );
    if (level === 5)
      return (
        <h5 key={key} id={id} className={className}>
          {children}
        </h5>
      );
    return (
      <h6 key={key} id={id} className={className}>
        {children}
      </h6>
    );
  };

  const warnedOverrides = new Set<string>();

  const warnOverrideFallback = (
    overrideName: string,
    message: string,
    meta?: unknown,
  ) => {
    if (warnedOverrides.has(overrideName)) return;
    warnedOverrides.add(overrideName);
    console.warn(
      `[ShadcnRichTextContent] Invalid "${overrideName}" override; falling back to semantic node. ${message}`,
      meta,
    );
  };

  const renderOverrideOrFallback = (
    overrideName: string,
    override: RichTextNodeOverrideConfig | undefined,
    key: string,
    id: string | undefined,
    level: RichTextHeadingLevel | undefined,
    text: string,
    body: (SbBlokData & { component?: string })[] | undefined,
    defaultWrapperClassName: string | undefined,
    fallback: () => React.ReactElement,
  ) => {
    if (!override) {
      return fallback();
    }

    const componentName =
      typeof override.component === "string" ? override.component.trim() : "";
    if (!componentName) {
      warnOverrideFallback(overrideName, "Missing component name.", override);
      return fallback();
    }

    const textField =
      typeof override.textField === "string" ? override.textField.trim() : "";
    if (!textField) {
      warnOverrideFallback(
        overrideName,
        "Missing textField for text-based richtext node.",
        override,
      );
      return fallback();
    }

    const overrideBlok: Record<string, any> = {
      _uid: `${key}-${componentName}-${level}`,
      component: componentName,
      [textField]: text,
      ...(override.staticFields ?? {}),
    };
    const idField =
      typeof override.idField === "string" ? override.idField.trim() : "";
    if (idField && id) overrideBlok[idField] = id;
    const levelField =
      typeof override.levelField === "string" ? override.levelField.trim() : "";
    if (levelField && typeof level === "number")
      overrideBlok[levelField] = level;
    const bodyField =
      typeof override.bodyField === "string" ? override.bodyField.trim() : "";
    if (bodyField && body) overrideBlok[bodyField] = body;
    for (const mirrorField of override.mirrorTextFields ?? []) {
      const fieldName = mirrorField?.trim();
      if (fieldName && !(fieldName in overrideBlok)) {
        overrideBlok[fieldName] = text;
      }
    }

    return (
      <div
        key={key}
        id={id}
        className={cn(defaultWrapperClassName, override.wrapperClassName)}
      >
        <StoryblokComponent blok={overrideBlok as SbBlokData} />
      </div>
    );
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
      <div>
        <div className={wrapperClassName}>{table}</div>
      </div>
    ) : (
      table
    );
  }

  const resolvers = {
    [BlockTypes.HEADING]: (node: ResolverNode) => {
      const level = Math.min(
        Math.max(Number(node.attrs?.level || 2), 1),
        6,
      ) as RichTextHeadingLevel;
      const id = headingIds?.[headingIndex++];
      const className = isArticle
        ? "text-primary font-semibold scroll-mt-24"
        : undefined;
      const key = getNodeKey(node, `h${level}`);
      const headingText = getNodeText(node).trim();
      const headingOverride =
        level === 1
          ? overrides?.headingOne
          : level === 2
            ? overrides?.headingTwo
            : level === 3
              ? overrides?.headingThree
              : level === 4
                ? overrides?.headingFour
                : level === 5
                  ? overrides?.headingFive
                  : overrides?.headingSix;

      return renderOverrideOrFallback(
        `heading${level}`,
        headingOverride,
        key,
        id,
        level,
        headingText,
        undefined,
        "scroll-mt-24",
        () => renderDefaultHeading(level, key, id, className, node.children),
      );
    },
    [BlockTypes.PARAGRAPH]: (node: ResolverNode) => {
      const key = getNodeKey(node, "p");
      return renderOverrideOrFallback(
        "paragraph",
        overrides?.paragraph,
        key,
        undefined,
        undefined,
        getNodeText(node).trim(),
        undefined,
        undefined,
        () => (
          <p
            key={key}
            className={cn(
              "whitespace-pre-line",
              isArticle ? "text-primary" : undefined,
            )}
          >
            {node.children}
          </p>
        ),
      );
    },
    [BlockTypes.QUOTE]: (node: ResolverNode) => {
      const key = getNodeKey(node, "quote");
      return renderOverrideOrFallback(
        "quote",
        overrides?.quote,
        key,
        undefined,
        undefined,
        getNodeText(node).trim(),
        undefined,
        undefined,
        () => (
          <blockquote
            key={key}
            className={cn(
              isArticle &&
                "border-l-2 border-border pl-4 italic text-muted-foreground",
            )}
          >
            {node.children}
          </blockquote>
        ),
      );
    },
    [BlockTypes.UL_LIST]: (node: ResolverNode) => {
      const key = getNodeKey(node, "ul");
      return renderOverrideOrFallback(
        "unorderedList",
        overrides?.unorderedList,
        key,
        undefined,
        undefined,
        getNodeText(node).trim(),
        undefined,
        undefined,
        () => (
          <ul
            key={key}
            className={
              isArticle
                ? "text-muted-foreground list-disc dark:marker:text-[#364152] list-outside pl-6 "
                : undefined
            }
          >
            {node.children}
          </ul>
        ),
      );
    },
    [BlockTypes.OL_LIST]: (node: ResolverNode) => {
      const key = getNodeKey(node, "ol");
      return renderOverrideOrFallback(
        "orderedList",
        overrides?.orderedList,
        key,
        undefined,
        undefined,
        getNodeText(node).trim(),
        undefined,
        undefined,
        () => (
          <ol
            key={key}
            className={
              isArticle
                ? "text-muted-foreground list-decimal list-outside pl-6 marker:text-muted-foreground"
                : undefined
            }
          >
            {node.children}
          </ol>
        ),
      );
    },
    [BlockTypes.LIST_ITEM]: (node: ResolverNode) => {
      const key = getNodeKey(node, "li");
      return renderOverrideOrFallback(
        "listItem",
        overrides?.listItem,
        key,
        undefined,
        undefined,
        getNodeText(node).trim(),
        undefined,
        undefined,
        () => (
          <li
            key={key}
            className={cn(
              "whitespace-pre-line",
              isArticle ? "text-primary" : undefined,
            )}
          >
            {normalizeListItemChildren(node.children)}
          </li>
        ),
      );
    },
    [BlockTypes.TABLE]: (node: ResolverNode) =>
      isArticle
        ? renderTable(
            node,
            "w-full caption-bottom text-sm",
            "overflow-x-auto rounded-md border-b dark:border-b-[#364152] even:bg-muted border-border/70",
          )
        : renderTable(node),
    [BlockTypes.TABLE_ROW]: (node: ResolverNode) => {
      const key = getNodeKey(node, "tr");
      return renderOverrideOrFallback(
        "tableRow",
        overrides?.tableRow,
        key,
        undefined,
        undefined,
        getNodeText(node).trim(),
        undefined,
        undefined,
        () => (
          <tr
            key={key}
            className={
              isArticle
                ? "border-b dark:border-b-[#364152] even:bg-muted border-border/60"
                : undefined
            }
          >
            {node.children}
          </tr>
        ),
      );
    },
    [BlockTypes.TABLE_HEADER]: (node: ResolverNode) => {
      const key = getNodeKey(node, "th");
      return renderOverrideOrFallback(
        "tableHeader",
        overrides?.tableHeader,
        key,
        undefined,
        undefined,
        getNodeText(node).trim(),
        undefined,
        undefined,
        () => (
          <th
            key={key}
            className={cn(
              "text-left",
              isArticle && "h-10 px-3 align-middle font-medium text-primary ",
            )}
          >
            {node.children}
          </th>
        ),
      );
    },
    [BlockTypes.TABLE_CELL]: (node: ResolverNode) => {
      const key = getNodeKey(node, "td");
      return renderOverrideOrFallback(
        "tableCell",
        overrides?.tableCell,
        key,
        undefined,
        undefined,
        getNodeText(node).trim(),
        undefined,
        undefined,
        () => (
          <td
            key={key}
            className={
              isArticle ? "p-3 align-middle text-muted-foreground" : undefined
            }
          >
            {node.children}
          </td>
        ),
      );
    },
    table_row: (node: ResolverNode) => (
      <tr
        key={getNodeKey(node, "tr")}
        className={
          isArticle
            ? "border-b dark:border-b-[#364152] even:bg-muted border-border/60"
            : undefined
        }
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
    [BlockTypes.COMPONENT]: (node: RichTextNode) => {
      const key = getNodeKey(node, "blok");
      const body = node.attrs?.body || [];
      return renderOverrideOrFallback(
        "embeddedComponent",
        overrides?.embeddedComponent,
        key,
        undefined,
        undefined,
        getNodeText(node).trim(),
        body,
        undefined,
        () => (
          <div key={key} className="sb-richtext-blok">
            {body.map((nestedBlok, index) => (
              <StoryblokComponent
                blok={nestedBlok}
                key={
                  nestedBlok._uid ||
                  `${nestedBlok.component || "blok"}-${index}`
                }
              />
            ))}
          </div>
        ),
      );
    },
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
  overrides,
}: {
  blok: ShadcnRichTextBlok;
  variant?: RichTextVariant;
  headingIds?: string[];
  overrides?: RichTextNodeOverrides;
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
        overrides={overrides}
      />
    </div>
  );
}
