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
} from "../../styles";
import {
  extractRichTextHeadings,
  extractRichTextHeadingsFromBloks,
  getNodeText,
} from "./heading-utils";
import {
  ARTICLE_RICH_TEXT_RENDER_CONFIG,
  DEFAULT_RICH_TEXT_RENDER_CONFIG,
  resolveRichTextRenderConfig,
} from "./render-config";
import {
  buildHeadingSectionTree,
  renderHeadingSectionTree,
} from "./section-tree";
import type {
  BuilderRichTextInputsBlok,
  RenderedHeadingMeta,
  RichTextHeading,
  RichTextHeadingLevel,
  RichTextNodeMappingsBlok,
  RichTextNode,
  RichTextNodeOverrideConfig,
  RichTextNodeOverrides,
  RichTextRenderConfig,
  RichTextRenderConfigInput,
} from "./types";

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

export interface ShadcnRichTextBlok extends Omit<SbBlokData, "content"> {
  content: ISbRichtext;
  prose_size?: "sm" | "base" | "lg";
  render_inputs?: BuilderRichTextInputsBlok[];
  styles?: StylesBreakpointOptionsBlok[];
  component: string;
  _uid: string;
}

const proseSizeMap = {
  sm: "prose-sm",
  base: "prose",
  lg: "prose-lg",
};

const HEADING_OVERRIDE_KEY_BY_LEVEL = {
  1: "headingOne",
  2: "headingTwo",
  3: "headingThree",
  4: "headingFour",
  5: "headingFive",
  6: "headingSix",
} as const satisfies Record<RichTextHeadingLevel, keyof RichTextNodeOverrides>;

type ResolverNode = RichTextNode & { children?: React.ReactNode };

const DEFAULT_RICH_TEXT_NODE_COMPONENTS = {
  heading_1_component: "shared_article_heading_1",
  heading_2_component: "shared_article_heading_2",
  heading_3_component: "shared_article_heading_3",
  heading_4_component: "shared_article_heading_4",
  heading_5_component: "shared_article_heading_5",
  heading_6_component: "shared_article_heading_6",
  paragraph_component: "shared_article_paragraph",
  quote_component: "shared_article_quote",
  unordered_list_component: "shared_article_unordered_list",
  ordered_list_component: "shared_article_ordered_list",
  list_item_component: "shared_article_list_item",
  table_component: "shared_article_table",
  table_row_component: "shared_article_table_row",
  table_header_component: "shared_article_table_header",
  table_cell_component: "shared_article_table_cell",
  embedded_component_component: "shared_article_embedded_component",
} as const;

const DEFAULT_RICH_TEXT_NODE_TEXT_FIELDS = {
  heading_1_text_field: "title",
  heading_2_text_field: "title",
  heading_3_text_field: "title",
  heading_4_text_field: "title",
  heading_5_text_field: "title",
  heading_6_text_field: "title",
  paragraph_text_field: "content",
  quote_text_field: "quote",
  unordered_list_text_field: "content",
  ordered_list_text_field: "content",
  list_item_text_field: "content",
  table_text_field: "content",
  table_row_text_field: "content",
  table_header_text_field: "content",
  table_cell_text_field: "content",
  embedded_component_text_field: "content",
} as const;

function createComponentBlok(componentName: string): SbBlokData {
  return {
    _uid: `default-${componentName}`,
    component: componentName,
  } as SbBlokData;
}

function getComponentBlok(
  mappingBloks: SbBlokData[] | undefined,
): SbBlokData | undefined {
  if (!Array.isArray(mappingBloks) || mappingBloks.length === 0) return undefined;
  const firstBlok = mappingBloks[0];
  if (!firstBlok || typeof firstBlok !== "object") return undefined;
  if (typeof firstBlok.component !== "string" || firstBlok.component.length === 0) {
    return undefined;
  }
  return firstBlok;
}

function getComponentNameFromBlok(blok?: SbBlokData): string | undefined {
  if (!blok) return undefined;
  return typeof blok.component === "string" && blok.component.trim().length > 0
    ? blok.component.trim()
    : undefined;
}

function getStaticFieldsFromBlok(blok?: SbBlokData): Record<string, unknown> | undefined {
  if (!blok) return undefined;
  const staticFields = { ...(blok as Record<string, unknown>) };
  delete staticFields._uid;
  delete staticFields.component;
  return Object.keys(staticFields).length > 0 ? staticFields : undefined;
}

function normalizeTextFieldName(
  configuredTextField: string | undefined,
  fallbackTextField: string,
): string {
  if (typeof configuredTextField !== "string") return fallbackTextField;
  const normalized = configuredTextField.trim();
  return normalized.length > 0 ? normalized : fallbackTextField;
}

export function createDefaultRichTextNodeMappingsBlok(): RichTextNodeMappingsBlok {
  return {
    _uid: "default-rich-text-node-mappings",
    component: "rich_text_node_mappings",
    heading_1_component: [createComponentBlok(DEFAULT_RICH_TEXT_NODE_COMPONENTS.heading_1_component)],
    heading_1_text_field: DEFAULT_RICH_TEXT_NODE_TEXT_FIELDS.heading_1_text_field,
    heading_2_component: [createComponentBlok(DEFAULT_RICH_TEXT_NODE_COMPONENTS.heading_2_component)],
    heading_2_text_field: DEFAULT_RICH_TEXT_NODE_TEXT_FIELDS.heading_2_text_field,
    heading_3_component: [createComponentBlok(DEFAULT_RICH_TEXT_NODE_COMPONENTS.heading_3_component)],
    heading_3_text_field: DEFAULT_RICH_TEXT_NODE_TEXT_FIELDS.heading_3_text_field,
    heading_4_component: [createComponentBlok(DEFAULT_RICH_TEXT_NODE_COMPONENTS.heading_4_component)],
    heading_4_text_field: DEFAULT_RICH_TEXT_NODE_TEXT_FIELDS.heading_4_text_field,
    heading_5_component: [createComponentBlok(DEFAULT_RICH_TEXT_NODE_COMPONENTS.heading_5_component)],
    heading_5_text_field: DEFAULT_RICH_TEXT_NODE_TEXT_FIELDS.heading_5_text_field,
    heading_6_component: [createComponentBlok(DEFAULT_RICH_TEXT_NODE_COMPONENTS.heading_6_component)],
    heading_6_text_field: DEFAULT_RICH_TEXT_NODE_TEXT_FIELDS.heading_6_text_field,
    paragraph_component: [createComponentBlok(DEFAULT_RICH_TEXT_NODE_COMPONENTS.paragraph_component)],
    paragraph_text_field: DEFAULT_RICH_TEXT_NODE_TEXT_FIELDS.paragraph_text_field,
    quote_component: [createComponentBlok(DEFAULT_RICH_TEXT_NODE_COMPONENTS.quote_component)],
    quote_text_field: DEFAULT_RICH_TEXT_NODE_TEXT_FIELDS.quote_text_field,
    unordered_list_component: [createComponentBlok(DEFAULT_RICH_TEXT_NODE_COMPONENTS.unordered_list_component)],
    unordered_list_text_field:
      DEFAULT_RICH_TEXT_NODE_TEXT_FIELDS.unordered_list_text_field,
    ordered_list_component: [createComponentBlok(DEFAULT_RICH_TEXT_NODE_COMPONENTS.ordered_list_component)],
    ordered_list_text_field: DEFAULT_RICH_TEXT_NODE_TEXT_FIELDS.ordered_list_text_field,
    list_item_component: [createComponentBlok(DEFAULT_RICH_TEXT_NODE_COMPONENTS.list_item_component)],
    list_item_text_field: DEFAULT_RICH_TEXT_NODE_TEXT_FIELDS.list_item_text_field,
    table_component: [createComponentBlok(DEFAULT_RICH_TEXT_NODE_COMPONENTS.table_component)],
    table_text_field: DEFAULT_RICH_TEXT_NODE_TEXT_FIELDS.table_text_field,
    table_row_component: [createComponentBlok(DEFAULT_RICH_TEXT_NODE_COMPONENTS.table_row_component)],
    table_row_text_field: DEFAULT_RICH_TEXT_NODE_TEXT_FIELDS.table_row_text_field,
    table_header_component: [createComponentBlok(DEFAULT_RICH_TEXT_NODE_COMPONENTS.table_header_component)],
    table_header_text_field: DEFAULT_RICH_TEXT_NODE_TEXT_FIELDS.table_header_text_field,
    table_cell_component: [createComponentBlok(DEFAULT_RICH_TEXT_NODE_COMPONENTS.table_cell_component)],
    table_cell_text_field: DEFAULT_RICH_TEXT_NODE_TEXT_FIELDS.table_cell_text_field,
    embedded_component_component: [
      createComponentBlok(DEFAULT_RICH_TEXT_NODE_COMPONENTS.embedded_component_component),
    ],
    embedded_component_text_field:
      DEFAULT_RICH_TEXT_NODE_TEXT_FIELDS.embedded_component_text_field,
  };
}

function createTextOverride(
  componentBlok: SbBlokData | undefined,
  textField: string,
): RichTextNodeOverrideConfig | undefined {
  const normalizedComponentName = getComponentNameFromBlok(componentBlok);
  if (!normalizedComponentName) return undefined;

  return {
    component: normalizedComponentName,
    textField,
    staticFields: getStaticFieldsFromBlok(componentBlok),
  };
}

export function resolveRichTextNodeOverrides(
  nodeMappings?: RichTextNodeMappingsBlok,
): RichTextNodeOverrides {
  const mappings = nodeMappings ?? createDefaultRichTextNodeMappingsBlok();

  const headingOneBlok = getComponentBlok(mappings.heading_1_component);
  const headingTwoBlok = getComponentBlok(mappings.heading_2_component);
  const headingThreeBlok = getComponentBlok(mappings.heading_3_component);
  const headingFourBlok = getComponentBlok(mappings.heading_4_component);
  const headingFiveBlok = getComponentBlok(mappings.heading_5_component);
  const headingSixBlok = getComponentBlok(mappings.heading_6_component);

  const headingOneComponentName = getComponentNameFromBlok(headingOneBlok);
  const headingTwoComponentName = getComponentNameFromBlok(headingTwoBlok);
  const headingThreeComponentName = getComponentNameFromBlok(headingThreeBlok);
  const headingFourComponentName = getComponentNameFromBlok(headingFourBlok);
  const headingFiveComponentName = getComponentNameFromBlok(headingFiveBlok);
  const headingSixComponentName = getComponentNameFromBlok(headingSixBlok);
  const headingOneTextField = normalizeTextFieldName(
    mappings.heading_1_text_field,
    DEFAULT_RICH_TEXT_NODE_TEXT_FIELDS.heading_1_text_field,
  );
  const headingTwoTextField = normalizeTextFieldName(
    mappings.heading_2_text_field,
    DEFAULT_RICH_TEXT_NODE_TEXT_FIELDS.heading_2_text_field,
  );
  const headingThreeTextField = normalizeTextFieldName(
    mappings.heading_3_text_field,
    DEFAULT_RICH_TEXT_NODE_TEXT_FIELDS.heading_3_text_field,
  );
  const headingFourTextField = normalizeTextFieldName(
    mappings.heading_4_text_field,
    DEFAULT_RICH_TEXT_NODE_TEXT_FIELDS.heading_4_text_field,
  );
  const headingFiveTextField = normalizeTextFieldName(
    mappings.heading_5_text_field,
    DEFAULT_RICH_TEXT_NODE_TEXT_FIELDS.heading_5_text_field,
  );
  const headingSixTextField = normalizeTextFieldName(
    mappings.heading_6_text_field,
    DEFAULT_RICH_TEXT_NODE_TEXT_FIELDS.heading_6_text_field,
  );
  const paragraphTextField = normalizeTextFieldName(
    mappings.paragraph_text_field,
    DEFAULT_RICH_TEXT_NODE_TEXT_FIELDS.paragraph_text_field,
  );
  const quoteTextField = normalizeTextFieldName(
    mappings.quote_text_field,
    DEFAULT_RICH_TEXT_NODE_TEXT_FIELDS.quote_text_field,
  );
  const unorderedListTextField = normalizeTextFieldName(
    mappings.unordered_list_text_field,
    DEFAULT_RICH_TEXT_NODE_TEXT_FIELDS.unordered_list_text_field,
  );
  const orderedListTextField = normalizeTextFieldName(
    mappings.ordered_list_text_field,
    DEFAULT_RICH_TEXT_NODE_TEXT_FIELDS.ordered_list_text_field,
  );
  const listItemTextField = normalizeTextFieldName(
    mappings.list_item_text_field,
    DEFAULT_RICH_TEXT_NODE_TEXT_FIELDS.list_item_text_field,
  );
  const tableTextField = normalizeTextFieldName(
    mappings.table_text_field,
    DEFAULT_RICH_TEXT_NODE_TEXT_FIELDS.table_text_field,
  );
  const tableRowTextField = normalizeTextFieldName(
    mappings.table_row_text_field,
    DEFAULT_RICH_TEXT_NODE_TEXT_FIELDS.table_row_text_field,
  );
  const tableHeaderTextField = normalizeTextFieldName(
    mappings.table_header_text_field,
    DEFAULT_RICH_TEXT_NODE_TEXT_FIELDS.table_header_text_field,
  );
  const tableCellTextField = normalizeTextFieldName(
    mappings.table_cell_text_field,
    DEFAULT_RICH_TEXT_NODE_TEXT_FIELDS.table_cell_text_field,
  );
  const embeddedComponentTextField = normalizeTextFieldName(
    mappings.embedded_component_text_field,
    DEFAULT_RICH_TEXT_NODE_TEXT_FIELDS.embedded_component_text_field,
  );

  return {
    headingOne: headingOneComponentName
      ? {
          component: headingOneComponentName,
          textField: headingOneTextField,
          mirrorTextFields: ["content"],
          wrapperClassName: "sb-article-heading-1",
          staticFields: getStaticFieldsFromBlok(headingOneBlok),
        }
      : undefined,
    headingTwo: headingTwoComponentName
      ? {
          component: headingTwoComponentName,
          textField: headingTwoTextField,
          wrapperClassName: "sb-article-heading-2",
          staticFields: getStaticFieldsFromBlok(headingTwoBlok),
        }
      : undefined,
    headingThree: headingThreeComponentName
      ? {
          component: headingThreeComponentName,
          textField: headingThreeTextField,
          wrapperClassName: "sb-article-heading-3",
          staticFields: getStaticFieldsFromBlok(headingThreeBlok),
        }
      : undefined,
    headingFour: headingFourComponentName
      ? {
          component: headingFourComponentName,
          textField: headingFourTextField,
          wrapperClassName: "sb-article-heading-4",
          staticFields: getStaticFieldsFromBlok(headingFourBlok),
        }
      : undefined,
    headingFive: headingFiveComponentName
      ? {
          component: headingFiveComponentName,
          textField: headingFiveTextField,
          wrapperClassName: "sb-article-heading-5",
          staticFields: getStaticFieldsFromBlok(headingFiveBlok),
        }
      : undefined,
    headingSix: headingSixComponentName
      ? {
          component: headingSixComponentName,
          textField: headingSixTextField,
          wrapperClassName: "sb-article-heading-6",
          staticFields: getStaticFieldsFromBlok(headingSixBlok),
        }
      : undefined,
    paragraph: createTextOverride(
      getComponentBlok(mappings.paragraph_component),
      paragraphTextField,
    ),
    quote: getComponentNameFromBlok(getComponentBlok(mappings.quote_component))
      ? {
          component: getComponentNameFromBlok(getComponentBlok(mappings.quote_component))!,
          textField: quoteTextField,
          staticFields: getStaticFieldsFromBlok(getComponentBlok(mappings.quote_component)),
        }
      : undefined,
    unorderedList: createTextOverride(
      getComponentBlok(mappings.unordered_list_component),
      unorderedListTextField,
    ),
    orderedList: createTextOverride(
      getComponentBlok(mappings.ordered_list_component),
      orderedListTextField,
    ),
    listItem: createTextOverride(
      getComponentBlok(mappings.list_item_component),
      listItemTextField,
    ),
    table: createTextOverride(
      getComponentBlok(mappings.table_component),
      tableTextField,
    ),
    tableRow: createTextOverride(
      getComponentBlok(mappings.table_row_component),
      tableRowTextField,
    ),
    tableHeader: createTextOverride(
      getComponentBlok(mappings.table_header_component),
      tableHeaderTextField,
    ),
    tableCell: createTextOverride(
      getComponentBlok(mappings.table_cell_component),
      tableCellTextField,
    ),
    embeddedComponent: getComponentNameFromBlok(
      getComponentBlok(mappings.embedded_component_component),
    )
      ? {
          component: getComponentNameFromBlok(
            getComponentBlok(mappings.embedded_component_component),
          )!,
          textField: embeddedComponentTextField,
          bodyField: "body",
          staticFields: getStaticFieldsFromBlok(
            getComponentBlok(mappings.embedded_component_component),
          ),
        }
      : undefined,
  };
}

function normalizeHeadingText(text?: string): string | undefined {
  if (!text) return undefined;
  const normalized = text.replace(/\s+/g, " ").trim();
  return normalized.length > 0 ? normalized : undefined;
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
      const key = getNodeKey(node, `h${level}`);
      const headingText = getNodeText(node).trim();
      renderedHeadingMeta.push({
        level,
        id,
        text: normalizeHeadingText(headingText),
      });

      return renderOverrideOrFallback(
        `heading${level}`,
        overrides?.[HEADING_OVERRIDE_KEY_BY_LEVEL[level]],
        key,
        id,
        level,
        headingText,
        undefined,
        resolvedRenderConfig.classes.headingWrapper,
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
            className={cn(resolvedRenderConfig.classes.listItem)}
          >
            {normalizeListItemChildren(node.children)}
          </li>
        ),
      );
    },
    [BlockTypes.TABLE]: (node: ResolverNode) =>
      renderTable(
        node,
        resolvedRenderConfig.classes.table,
        resolvedRenderConfig.classes.tableWrapper,
      ),
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
            className={cn(resolvedRenderConfig.classes.tableRow)}
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
            className={cn(resolvedRenderConfig.classes.tableHeader)}
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
            className={cn(resolvedRenderConfig.classes.tableCell)}
          >
            {node.children}
          </td>
        ),
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
        proseSizeMap[blok.prose_size || "base"],
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
