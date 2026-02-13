import type { SbBlokData } from "@storyblok/react";
import type { RichTextHeadingLevel, RichTextNodeMappingsBlok } from "./types";

export const PROSE_SIZE_MAP = {
  sm: "prose-sm",
  base: "prose",
  lg: "prose-lg",
} as const;

export const HEADING_OVERRIDE_KEY_BY_LEVEL = {
  1: "headingOne",
  2: "headingTwo",
  3: "headingThree",
  4: "headingFour",
  5: "headingFive",
  6: "headingSix",
} as const satisfies Record<RichTextHeadingLevel, string>;

export const DEFAULT_RICH_TEXT_NODE_COMPONENTS = {
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
  link_component: "shared_article_link",
} as const;

export const DEFAULT_RICH_TEXT_NODE_TEXT_FIELDS = {
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
  link_text_field: "content",
  link_url_field: "link",
} as const;

function createComponentBlok(componentName: string): SbBlokData {
  return {
    _uid: `default-${componentName}`,
    component: componentName,
  } as SbBlokData;
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
    link_component: [createComponentBlok(DEFAULT_RICH_TEXT_NODE_COMPONENTS.link_component)],
    link_text_field: DEFAULT_RICH_TEXT_NODE_TEXT_FIELDS.link_text_field,
    link_url_field: DEFAULT_RICH_TEXT_NODE_TEXT_FIELDS.link_url_field,
  };
}
