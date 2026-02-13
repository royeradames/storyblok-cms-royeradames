"use client";

import type { ISbRichtext } from "@storyblok/react";
import React, { type ReactElement } from "react";
import type { RenderedHeadingMeta, RichTextNode } from "./types";
import type { ResolverNode } from "./resolvers";

export type ListItemParentType = "unordered" | "ordered";

interface RichTextNodeWithChildren {
  type?: string;
  content?: unknown[];
}

function extractListItemParentTypes(content: ISbRichtext): ListItemParentType[] {
  const listItemParentTypes: ListItemParentType[] = [];

  const visitNode = (
    node: unknown,
    parentListType: ListItemParentType | undefined,
  ) => {
    if (!node || typeof node !== "object") return;
    const typedNode = node as RichTextNodeWithChildren;
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

export function unwrapListItemParagraphChildren(
  children: React.ReactNode,
): React.ReactNode {
  const childrenArray = React.Children.toArray(children);
  if (childrenArray.length !== 1) return children;
  const onlyChild = childrenArray[0];
  if (
    React.isValidElement(onlyChild) &&
    typeof onlyChild.type === "string" &&
    onlyChild.type === "p"
  ) {
    return (onlyChild as ReactElement<{ children?: React.ReactNode }>).props.children;
  }
  return children;
}

export function createRichTextResolverState(
  content: ISbRichtext,
  headingIds?: string[],
) {
  let headingIndex = 0;
  let resolverKeyCounter = 0;
  const renderedHeadingMeta: RenderedHeadingMeta[] = [];
  const listItemParentTypes = extractListItemParentTypes(content);
  let listItemParentTypeIndex = 0;

  return {
    renderedHeadingMeta,
    getNodeKey: (node: ResolverNode | RichTextNode, prefix: string) =>
      node.attrs?.key ?? `${prefix}-${resolverKeyCounter++}`,
    getTextNodeKey: (attrs?: Record<string, unknown>) =>
      (attrs?.key as string) ?? `txt-${resolverKeyCounter++}`,
    registerRenderedHeading: (meta: RenderedHeadingMeta) => {
      renderedHeadingMeta.push(meta);
    },
    getNextHeadingId: () => headingIds?.[headingIndex++],
    getNextListItemParentType: () =>
      listItemParentTypes[listItemParentTypeIndex++],
  };
}
