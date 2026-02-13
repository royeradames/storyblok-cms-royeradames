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
import { createRichTextResolvers } from "./resolvers";
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
  RichTextRenderConfig,
  RichTextRenderConfigInput,
  RichTextNodeOverrides,
} from "./types";
import { PROSE_SIZE_MAP } from "./node-defaults";
import { resolveRichTextNodeOverrides } from "./node-overrides";
import {
  createRichTextResolverState,
  unwrapListItemParagraphChildren,
} from "./render-state";

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

export interface ShadcnRichTextBlok extends SbBlokData {
  content: ISbRichtext;
  prose_size?: "sm" | "base" | "lg";
  render_inputs?: BuilderRichTextInputsBlok[];
  styles?: StylesBreakpointOptionsBlok[];
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
  const resolvedRenderConfig = renderConfig ?? DEFAULT_RICH_TEXT_RENDER_CONFIG;
  const resolverState = createRichTextResolverState(content, headingIds);

  const resolvers = createRichTextResolvers({
    overrides,
    renderConfig: resolvedRenderConfig,
    headingIds,
    getNodeKey: resolverState.getNodeKey,
    registerRenderedHeading: resolverState.registerRenderedHeading,
    getNextHeadingId: resolverState.getNextHeadingId,
    getNextListItemParentType: resolverState.getNextListItemParentType,
    unwrapListItemParagraphChildren,
  });

  const { render } = useStoryblokRichText({
    keyedResolvers: true,
    textFn: (text: string, attrs?: Record<string, unknown>) =>
      React.createElement(
        React.Fragment,
        { key: resolverState.getTextNodeKey(attrs) },
        text,
      ),
    resolvers,
  });

  const richTextNode = render(content as unknown as Parameters<typeof render>[0]);
  const convertedNode = convertAttributesInElement(
    richTextNode as ReactElement,
  );

  if (!resolvedRenderConfig.behavior.wrapHeadingSections) {
    return <>{convertedNode}</>;
  }

  const sectionTree = buildHeadingSectionTree(
    convertedNode,
    resolverState.renderedHeadingMeta,
  );
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
      {...storyblokEditable(blok)}
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
