"use client";

import { BlockTypes, MarkTypes, StoryblokComponent } from "@storyblok/react";
import { cn } from "@repo/ui";
import React, { type ReactElement } from "react";
import type { SbBlokData } from "@storyblok/react";
import { getNodeText } from "./heading-utils";
import { HEADING_OVERRIDE_KEY_BY_LEVEL } from "./node-defaults";
import type {
  RichTextNode,
  RichTextNodeOverrideConfig,
  RichTextNodeOverrides,
  RichTextRenderConfig,
  RichTextHeadingLevel,
  RenderedHeadingMeta,
} from "./types";

export type ResolverNode = RichTextNode & { children?: React.ReactNode };

export interface RichTextResolversOptions {
  overrides?: RichTextNodeOverrides;
  renderConfig: RichTextRenderConfig;
  headingIds?: string[];
  getNodeKey: (node: ResolverNode | RichTextNode, prefix: string) => string;
  registerRenderedHeading: (meta: RenderedHeadingMeta) => void;
  getNextHeadingId: () => string | undefined;
  normalizeListItemChildren: (children: React.ReactNode) => React.ReactNode;
}

function normalizeHeadingText(text?: string): string | undefined {
  if (!text) return undefined;
  const normalized = text.replace(/\s+/g, " ").trim();
  return normalized.length > 0 ? normalized : undefined;
}

function renderDefaultHeading(
  level: RichTextHeadingLevel,
  key: string,
  id: string | undefined,
  className: string | undefined,
  children: React.ReactNode,
): React.ReactElement {
  const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  return (
    <Tag key={key} id={id} className={className}>
      {children}
    </Tag>
  );
}

function createWarnOverrideFallback(warnedOverrides: Set<string>) {
  return (
    overrideName: string,
    message: string,
    meta?: unknown,
  ) => {
    if (warnedOverrides.has(overrideName)) return;
    warnedOverrides.add(overrideName);
    console.warn(
      `[ShadcnRichTextContent] Invalid "${overrideName}" override; rendering missing-blok error. ${message}`,
      meta,
    );
  };
}

function renderMissingBlokError(
  key: string,
  overrideName: string,
  reason: string,
): React.ReactElement {
  return (
    <div
      key={key}
      className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
      data-richtext-missing-blok={overrideName}
    >
      Blok not define: {overrideName} ({reason})
    </div>
  );
}

function createRenderOverrideOrFallback(
  options: RichTextResolversOptions,
  warnOverrideFallback: (name: string, msg: string, meta?: unknown) => void,
) {
  const { renderConfig } = options;
  return (
    overrideName: string,
    override: RichTextNodeOverrideConfig | undefined,
    key: string,
    id: string | undefined,
    level: RichTextHeadingLevel | undefined,
    text: string,
    body: (SbBlokData & { component?: string })[] | undefined,
    defaultWrapperClassName: string | undefined,
    linkHref: string | undefined,
    fallback: () => React.ReactElement,
    required = true,
  ): React.ReactElement => {
    if (!override) {
      return required
        ? renderMissingBlokError(key, overrideName, "missing override config")
        : fallback();
    }

    const componentName =
      typeof override.component === "string" ? override.component.trim() : "";
    if (!componentName) {
      warnOverrideFallback(overrideName, "Missing component name.", override);
      return required
        ? renderMissingBlokError(key, overrideName, "missing component")
        : fallback();
    }

    const textField =
      typeof override.textField === "string" ? override.textField.trim() : "";
    if (!textField) {
      warnOverrideFallback(
        overrideName,
        "Missing textField for text-based richtext node.",
        override,
      );
      return required
        ? renderMissingBlokError(key, overrideName, "missing text field")
        : fallback();
    }

    const overrideBlok: Record<string, unknown> = {
      _uid: `${key}-${componentName}-${level}`,
      component: componentName,
      ...(override.staticFields ?? {}),
      [textField]: text,
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
    const linkField =
      typeof override.linkField === "string" ? override.linkField.trim() : "";
    if (linkField && typeof linkHref === "string" && linkHref.trim().length > 0) {
      overrideBlok[linkField] = linkHref.trim();
    }
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
}

export function createRichTextResolvers(
  options: RichTextResolversOptions,
): Record<string, (...resolverArgs: any[]) => React.ReactNode> {
  const {
    overrides,
    renderConfig: resolvedRenderConfig,
    getNodeKey,
    registerRenderedHeading,
    getNextHeadingId,
    normalizeListItemChildren,
  } = options;

  const warnedOverrides = new Set<string>();
  const warnOverrideFallback = createWarnOverrideFallback(warnedOverrides);
  const renderOverrideOrFallback = createRenderOverrideOrFallback(
    options,
    warnOverrideFallback,
  );

  const renderTable = (
    node: ResolverNode,
    className?: string,
    wrapperClassName?: string,
  ) => {
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
  };

  return {
    [BlockTypes.HEADING]: (node: ResolverNode) => {
      const level = Math.min(
        Math.max(Number(node.attrs?.level || 2), 1),
        6,
      ) as RichTextHeadingLevel;
      const id = getNextHeadingId();
      const key = getNodeKey(node, `h${level}`);
      const headingText = getNodeText(node).trim();
      registerRenderedHeading({
        level,
        id,
        text: normalizeHeadingText(headingText),
      });

      return renderOverrideOrFallback(
        `heading${level}`,
        overrides?.[HEADING_OVERRIDE_KEY_BY_LEVEL[level] as keyof RichTextNodeOverrides],
        key,
        id,
        level,
        headingText,
        undefined,
        resolvedRenderConfig.classes.headingWrapper,
        undefined,
        () =>
          renderDefaultHeading(
            level,
            key,
            id,
            cn(resolvedRenderConfig.classes.heading),
            node.children,
          ),
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
        undefined,
        () => (
          <p
            key={key}
            className={cn(resolvedRenderConfig.classes.paragraph)}
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
        undefined,
        () => (
          <blockquote
            key={key}
            className={cn(resolvedRenderConfig.classes.quote)}
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
        undefined,
        () => (
          <ul
            key={key}
            className={cn(resolvedRenderConfig.classes.unorderedList)}
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
        undefined,
        () => (
          <ol
            key={key}
            className={cn(resolvedRenderConfig.classes.orderedList)}
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
        undefined,
        key,
        undefined,
        undefined,
        getNodeText(node).trim(),
        undefined,
        undefined,
        undefined,
        () => (
          <li
            key={key}
            className={cn(resolvedRenderConfig.classes.listItem)}
          >
            {normalizeListItemChildren(node.children)}
          </li>
        ),
        false,
      );
    },
    [BlockTypes.TABLE]: (node: ResolverNode) => {
      const key = getNodeKey(node, "table");
      return renderOverrideOrFallback(
        "table",
        overrides?.table,
        key,
        undefined,
        undefined,
        getNodeText(node).trim(),
        undefined,
        undefined,
        undefined,
        () =>
          renderTable(
            node,
            resolvedRenderConfig.classes.table,
            resolvedRenderConfig.classes.tableWrapper,
          ),
      );
    },
    [BlockTypes.TABLE_ROW]: (node: ResolverNode) => {
      const key = getNodeKey(node, "tr");
      return renderOverrideOrFallback(
        "tableRow",
        undefined,
        key,
        undefined,
        undefined,
        getNodeText(node).trim(),
        undefined,
        undefined,
        undefined,
        () => (
          <tr
            key={key}
            className={cn(resolvedRenderConfig.classes.tableRow)}
          >
            {node.children}
          </tr>
        ),
        false,
      );
    },
    [BlockTypes.TABLE_HEADER]: (node: ResolverNode) => {
      const key = getNodeKey(node, "th");
      return renderOverrideOrFallback(
        "tableHeader",
        undefined,
        key,
        undefined,
        undefined,
        getNodeText(node).trim(),
        undefined,
        undefined,
        undefined,
        () => (
          <th
            key={key}
            className={cn(resolvedRenderConfig.classes.tableHeader)}
          >
            {node.children}
          </th>
        ),
        false,
      );
    },
    [BlockTypes.TABLE_CELL]: (node: ResolverNode) => {
      const key = getNodeKey(node, "td");
      return renderOverrideOrFallback(
        "tableCell",
        undefined,
        key,
        undefined,
        undefined,
        getNodeText(node).trim(),
        undefined,
        undefined,
        undefined,
        () => (
          <td
            key={key}
            className={cn(resolvedRenderConfig.classes.tableCell)}
          >
            {node.children}
          </td>
        ),
        false,
      );
    },
    table_row: (node: ResolverNode) => (
      <tr
        key={getNodeKey(node, "tr")}
        className={cn(resolvedRenderConfig.classes.tableRow)}
      >
        {node.children}
      </tr>
    ),
    table_header: (node: ResolverNode) => (
      <th
        key={getNodeKey(node, "th")}
        className={cn(resolvedRenderConfig.classes.tableHeaderLegacy)}
      >
        {node.children}
      </th>
    ),
    table_cell: (node: ResolverNode) => (
      <td
        key={getNodeKey(node, "td")}
        className={cn(resolvedRenderConfig.classes.tableCell)}
      >
        {node.children}
      </td>
    ),
    [MarkTypes.LINK]: (node: ResolverNode, children: React.ReactNode) => {
      const key = getNodeKey(node, "link");
      const href = typeof node.attrs?.href === "string" ? node.attrs.href.trim() : "";
      return renderOverrideOrFallback(
        "link",
        overrides?.link,
        key,
        undefined,
        undefined,
        getNodeText(node).trim(),
        undefined,
        undefined,
        href.length > 0 ? href : undefined,
        () => (
          <a key={key} href={href.length > 0 ? href : undefined}>
            {children}
          </a>
        ),
      );
    },
    [BlockTypes.COMPONENT]: (node: RichTextNode) => {
      const key = getNodeKey(node as ResolverNode, "blok");
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
        undefined,
        () => (
          <div
            key={key}
            className={cn(resolvedRenderConfig.classes.embeddedComponent)}
          >
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
  };
}
