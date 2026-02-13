import type { SbBlokData } from "@storyblok/react";
import {
  createDefaultRichTextNodeMappingsBlok,
  DEFAULT_RICH_TEXT_NODE_TEXT_FIELDS,
} from "./node-defaults";
import type {
  RichTextNodeMappingsBlok,
  RichTextNodeOverrideConfig,
  RichTextNodeOverrides,
} from "./types";

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

  const quoteBlok = getComponentBlok(mappings.quote_component);
  const embeddedBlok = getComponentBlok(mappings.embedded_component_component);

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
    quote: getComponentNameFromBlok(quoteBlok)
      ? {
          component: getComponentNameFromBlok(quoteBlok)!,
          textField: quoteTextField,
          staticFields: getStaticFieldsFromBlok(quoteBlok),
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
    embeddedComponent: getComponentNameFromBlok(embeddedBlok)
      ? {
          component: getComponentNameFromBlok(embeddedBlok)!,
          textField: embeddedComponentTextField,
          bodyField: "body",
          staticFields: getStaticFieldsFromBlok(embeddedBlok),
        }
      : undefined,
  };
}
