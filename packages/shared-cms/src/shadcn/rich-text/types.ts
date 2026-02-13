import type { SbBlokData } from "@storyblok/react";

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

export interface RichTextNodeMappingsBlok extends SbBlokData {
  heading_1_component?: string;
  heading_2_component?: string;
  heading_3_component?: string;
  heading_4_component?: string;
  heading_5_component?: string;
  heading_6_component?: string;
  paragraph_component?: string;
  quote_component?: string;
  unordered_list_component?: string;
  ordered_list_component?: string;
  list_item_component?: string;
  table_component?: string;
  table_row_component?: string;
  table_header_component?: string;
  table_cell_component?: string;
  embedded_component_component?: string;
}

export interface RichTextHeading {
  id: string;
  text: string;
  level: number;
}

export interface RichTextRenderElementClassNames {
  prose: string;
  heading: string;
  headingWrapper: string;
  paragraph: string;
  quote: string;
  unorderedList: string;
  orderedList: string;
  listItem: string;
  table: string;
  tableWrapper: string;
  tableRow: string;
  tableHeader: string;
  tableHeaderLegacy: string;
  tableCell: string;
  embeddedComponent: string;
  headingSection: string;
  headingSectionSpacing: string;
}

export interface RichTextRenderBehavior {
  wrapHeadingSections: boolean;
}

export interface RichTextRenderConfig {
  classes: RichTextRenderElementClassNames;
  behavior: RichTextRenderBehavior;
}

export interface RichTextRenderElementClassNameInputs {
  prose_class_name?: string;
  heading_class_name?: string;
  heading_wrapper_class_name?: string;
  paragraph_class_name?: string;
  quote_class_name?: string;
  unordered_list_class_name?: string;
  ordered_list_class_name?: string;
  list_item_class_name?: string;
  table_class_name?: string;
  table_wrapper_class_name?: string;
  table_row_class_name?: string;
  table_header_class_name?: string;
  table_header_legacy_class_name?: string;
  table_cell_class_name?: string;
  embedded_component_class_name?: string;
  heading_section_class_name?: string;
  heading_section_spacing_class_name?: string;
}

export interface RichTextRenderBehaviorInputs {
  wrap_heading_sections?: boolean;
}

export type RichTextRenderConfigInput = Partial<RichTextRenderElementClassNameInputs> &
  RichTextRenderBehaviorInputs;

export interface BuilderRichTextInputsBlok
  extends SbBlokData,
    RichTextRenderConfigInput {}

export interface RichTextNode {
  type?: string;
  text?: string;
  attrs?: {
    key?: string;
    level?: number;
    body?: (SbBlokData & { component?: string })[];
  };
  content?: RichTextNode[];
}

export interface RenderedHeadingMeta {
  level: RichTextHeadingLevel;
  id?: string;
  text?: string;
}
