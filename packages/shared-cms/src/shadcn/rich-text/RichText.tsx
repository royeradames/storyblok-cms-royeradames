"use client";

import {
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
} from "../../styles";
import { createRichTextResolvers, type ResolverNode } from "./resolvers";
import {
  buildHeadingSectionTree,
  renderHeadingSectionTree,
} from "./section-tree";
import {
  ARTICLE_RICH_TEXT_RENDER_CONFIG,
  DEFAULT_RICH_TEXT_RENDER_CONFIG,
  resolveRichTextRenderConfig,
} from "./render-config";
import type {
  BuilderRichTextInputsBlok,
  RenderedHeadingMeta,
  RichTextNode,
  RichTextRenderConfig,
  RichTextRenderConfigInput,
  RichTextNodeOverrides,
} from "./types";
import { PROSE_SIZE_MAP } from "./node-defaults";
import { resolveRichTextNodeOverrides } from "./node-overrides";

export type {
  BuilderRichTextInputsBlok,
  RichTextHeading,
  RichTextHeadingLevel,
  RichTextHeadingOverrideConfig,
  RichTextNodeMappingsBlok,
  RichTextNodeOverrideConfig,
  RichTextNodeOverrides,
  RichTextRenderBehavior,
  RichTextRenderConfig,
  RichTextRenderConfigInput,
  RichTextRenderElementClassNames,
} from "./types";
export { extractRichTextHeadings, extractRichTextHeadingsFromBloks } from "./heading-utils";
export {
  ARTICLE_RICH_TEXT_RENDER_CONFIG,
  DEFAULT_RICH_TEXT_RENDER_CONFIG,
  resolveRichTextRenderConfig,
} from "./render-config";
export { createDefaultRichTextNodeMappingsBlok } from "./node-defaults";
export { resolveRichTextNodeOverrides } from "./node-overrides";

export interface ShadcnRichTextBlok extends Omit<SbBlokData, "content"> {
  content: ISbRichtext;
  prose_size?: "sm" | "base" | "lg";
  render_inputs?: BuilderRichTextInputsBlok[];
  styles?: StylesBreakpointOptionsBlok[];
  component: string;
  _uid: string;
}

function normalizeListItemChildren(children: React.ReactNode): React.ReactNode {
  const items = React.Children.toArray(children);
  if (items.length !== 1) return children;
  const onlyChild = items[0];
  if (
    React.isValidElement(onlyChild) &&
    typeof onlyChild.type === "string" &&
    onlyChild.type === "p"
  ) {
    return (onlyChild as ReactElement<{ children?: React.ReactNode }>).props.children;
  }
  return children;
}

type ListItemParentType = "unordered" | "ordered";

function extractListItemParentTypes(content: ISbRichtext): ListItemParentType[] {
  const listItemParentTypes: ListItemParentType[] = [];

  const visitNode = (
    node: unknown,
    parentListType: ListItemParentType | undefined,
  ) => {
    if (!node || typeof node !== "object") return;
    const typedNode = node as { type?: string; content?: unknown[] };
    const nodeType = typeof typedNode.type === "string" ? typedNode.type : undefined;
    const nextParentListType =
      nodeType === "bullet_list"
        ? "unordered"
        : nodeType === "ordered_list"
          ? "ordered"
          : parentListType;

    if (nodeType === "list_item" && nextParentListType) {
      listItemParentTypes.push(nextParentListType);
    }

    if (!Array.isArray(typedNode.content)) return;
    for (const child of typedNode.content) {
      visitNode(child, nextParentListType);
    }
  };

  visitNode(content, undefined);
  return listItemParentTypes;
}

export function ShadcnRichTextContent({
  content,
  headingIds,
  overrides,
  renderConfig,
}: {
  content: ISbRichtext;
  headingIds?: string[];
  overrides?: RichTextNodeOverrides;
  renderConfig?: RichTextRenderConfig;
}) {
  let headingIndex = 0;
  const resolvedRenderConfig = renderConfig ?? DEFAULT_RICH_TEXT_RENDER_CONFIG;
  let resolverKeyCounter = 0;
  const renderedHeadingMeta: RenderedHeadingMeta[] = [];
  const listItemParentTypes = extractListItemParentTypes(content);
  let listItemParentTypeIndex = 0;

  const getNodeKey = (node: ResolverNode | RichTextNode, prefix: string) =>
    node.attrs?.key ?? `${prefix}-${resolverKeyCounter++}`;

  const resolvers = createRichTextResolvers({
    overrides,
    renderConfig: resolvedRenderConfig,
    headingIds,
    getNodeKey,
    registerRenderedHeading: (meta) => renderedHeadingMeta.push(meta),
    getNextHeadingId: () => headingIds?.[headingIndex++],
    getNextListItemParentType: () => listItemParentTypes[listItemParentTypeIndex++],
    normalizeListItemChildren,
  });

  const { render } = useStoryblokRichText({
    keyedResolvers: true,
    textFn: (text: string, attrs?: Record<string, unknown>) =>
      React.createElement(
        React.Fragment,
        { key: (attrs?.key as string) ?? `txt-${resolverKeyCounter++}` },
        text,
      ),
    resolvers: resolvers as Parameters<typeof useStoryblokRichText>[0]["resolvers"],
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Storyblok ISbRichtext vs internal node type
  const richTextNode = render(content as any);
  const convertedNode = convertAttributesInElement(
    richTextNode as ReactElement,
  );

  if (!resolvedRenderConfig.behavior.wrapHeadingSections) {
    return <>{convertedNode}</>;
  }

  const sectionTree = buildHeadingSectionTree(convertedNode, renderedHeadingMeta);
  return (
    <>
      {renderHeadingSectionTree(sectionTree, {
        section: resolvedRenderConfig.classes.headingSection,
        spacing: resolvedRenderConfig.classes.headingSectionSpacing,
      })}
    </>
  );
}

export function ShadcnRichText({
  blok,
  headingIds,
  overrides,
  renderConfigInput,
  renderConfigBase = DEFAULT_RICH_TEXT_RENDER_CONFIG,
}: {
  blok: ShadcnRichTextBlok;
  headingIds?: string[];
  overrides?: RichTextNodeOverrides;
  renderConfigInput?: RichTextRenderConfigInput;
  renderConfigBase?: RichTextRenderConfig;
}) {
  const resolvedRenderConfig = resolveRichTextRenderConfig({
    base: renderConfigBase,
    blokInputs: blok.render_inputs?.[0],
    propInputs: renderConfigInput,
  });

  return (
    <div
      {...storyblokEditable(blok as unknown as SbBlokData)}
      className={cn(
        PROSE_SIZE_MAP[blok.prose_size ?? "base"],
        resolvedRenderConfig.classes.prose,
        "max-w-none",
        ...buildStyleClasses(blok.styles),
      )}
      style={buildInlineStyles(blok.styles)}
    >
      <ShadcnRichTextContent
        content={blok.content}
        headingIds={headingIds}
        overrides={overrides}
        renderConfig={resolvedRenderConfig}
      />
    </div>
  );
}
