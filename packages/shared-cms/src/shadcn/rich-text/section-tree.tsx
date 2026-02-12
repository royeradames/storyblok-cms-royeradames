"use client";

import { cn } from "@repo/ui";
import React from "react";
import type { RenderedHeadingMeta, RichTextHeadingLevel } from "./types";

interface SectionTreeNode {
  kind: "section";
  heading: RenderedHeadingMeta;
  children: SectionTreeChild[];
}

type SectionTreeChild = React.ReactNode | SectionTreeNode;

function normalizeHeadingText(text?: string): string | undefined {
  if (!text) return undefined;
  const normalized = text.replace(/\s+/g, " ").trim();
  return normalized.length > 0 ? normalized : undefined;
}

function getHeadingLevelFromClassName(className?: string): number | null {
  if (!className) return null;
  const match = className.match(/(?:^|\s)sb-article-heading-([1-6])(?:\s|$)/);
  if (!match) return null;
  return Number(match[1]);
}

function getRenderedHeadingLevel(node: React.ReactNode): number | null {
  if (!React.isValidElement<{ className?: string }>(node)) return null;
  const elementType = node.type;
  if (typeof elementType === "string") {
    const headingMatch = elementType.match(/^h([1-6])$/i);
    if (headingMatch) return Number(headingMatch[1]);
    const className =
      typeof node.props.className === "string" ? node.props.className : "";
    return getHeadingLevelFromClassName(className);
  }
  return null;
}

function getRenderedHeadingId(node: React.ReactNode): string | undefined {
  if (!React.isValidElement<{ id?: string }>(node)) return undefined;
  return typeof node.props.id === "string" ? node.props.id : undefined;
}

function isSectionTreeNode(child: SectionTreeChild): child is SectionTreeNode {
  return (
    typeof child === "object" &&
    child !== null &&
    "kind" in child &&
    (child as SectionTreeNode).kind === "section"
  );
}

export function buildHeadingSectionTree(
  renderedNode: React.ReactNode,
  headingMeta: RenderedHeadingMeta[],
): SectionTreeChild[] {
  const blocks = React.Children.toArray(renderedNode);
  const rootChildren: SectionTreeChild[] = [];
  const sectionStack: SectionTreeNode[] = [];
  let headingMetaIndex = 0;

  for (const block of blocks) {
    const renderedLevel = getRenderedHeadingLevel(block);
    if (!renderedLevel) {
      const parentChildren =
        sectionStack.length > 0
          ? sectionStack[sectionStack.length - 1]!.children
          : rootChildren;
      parentChildren.push(block);
      continue;
    }

    const nextMeta = headingMeta[headingMetaIndex++];
    const level = Math.min(
      Math.max(Number(nextMeta?.level ?? renderedLevel), 1),
      6,
    ) as RichTextHeadingLevel;
    const sectionNode: SectionTreeNode = {
      kind: "section",
      heading: {
        level,
        id: nextMeta?.id ?? getRenderedHeadingId(block),
        text: normalizeHeadingText(nextMeta?.text),
      },
      children: [block],
    };

    while (
      sectionStack.length > 0 &&
      sectionStack[sectionStack.length - 1]!.heading.level >= level
    ) {
      sectionStack.pop();
    }

    const parentChildren =
      sectionStack.length > 0
        ? sectionStack[sectionStack.length - 1]!.children
        : rootChildren;
    parentChildren.push(sectionNode);
    sectionStack.push(sectionNode);
  }

  return rootChildren;
}

export function renderHeadingSectionTree(
  children: SectionTreeChild[],
  classNames: { section: string; spacing: string },
  keyPrefix = "sb-section",
): React.ReactNode[] {
  return children.map((child, index) => {
    if (!isSectionTreeNode(child)) return child;
    const sectionKey = child.heading.id
      ? `${keyPrefix}-${child.heading.id}`
      : `${keyPrefix}-${index}`;

    return (
      <section
        key={sectionKey}
        className={cn(classNames.section, index > 0 ? classNames.spacing : "")}
        data-sb-heading-level={child.heading.level}
        data-sb-heading-id={child.heading.id}
        data-sb-heading-text={child.heading.text}
      >
        {renderHeadingSectionTree(child.children, classNames, sectionKey)}
      </section>
    );
  });
}
