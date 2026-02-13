import { cn } from "@repo/ui";
import type {
  BuilderRichTextInputsBlok,
  RichTextRenderConfig,
  RichTextRenderConfigInput,
} from "./types";

export const DEFAULT_RICH_TEXT_RENDER_CONFIG: RichTextRenderConfig = {
  classes: {
    prose: "prose-a:text-primary prose-a:underline",
    heading: "",
    headingWrapper: "",
    paragraph: "whitespace-pre-line",
    quote: "",
    unorderedList: "",
    orderedList: "",
    listItem: "whitespace-pre-line",
    table: "",
    tableWrapper: "",
    tableRow: "",
    tableHeader: "text-left",
    tableCell: "",
    embeddedComponent: "sb-richtext-blok",
    headingSection: "sb-heading-section grid gap-4",
    headingSectionSpacing: "pt-4",
  },
  behavior: {
    wrapHeadingSections: false,
  },
};

export const ARTICLE_RICH_TEXT_RENDER_CONFIG: RichTextRenderConfig = {
  classes: {
    ...DEFAULT_RICH_TEXT_RENDER_CONFIG.classes,
    prose:
      "prose-a:text-primary prose-a:underline prose-headings:font-semibold prose-headings:text-primary prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground prose-code:text-foreground",
    heading: "text-primary font-semibold scroll-mt-24",
    headingWrapper: "scroll-mt-24",
    paragraph: "whitespace-pre-line text-primary",
    quote: "border-l-2 border-border pl-4 italic text-muted-foreground",
    unorderedList:
      "text-muted-foreground list-disc dark:marker:text-[#364152] list-outside pl-6",
    orderedList:
      "text-muted-foreground list-decimal list-outside pl-6 marker:text-muted-foreground",
    listItem: "whitespace-pre-line text-primary",
    table: "w-full caption-bottom text-sm",
    tableWrapper:
      "overflow-x-auto rounded-md border-b dark:border-b-[#364152] even:bg-muted border-border/70",
    tableRow: "border-b dark:border-b-[#364152] even:bg-muted border-border/60",
    tableHeader: "text-left h-10 px-3 align-middle font-medium text-primary",
    tableCell: "p-3 align-middle text-muted-foreground",
  },
  behavior: {
    wrapHeadingSections: true,
  },
};

function toConfigInput(
  inputs?: BuilderRichTextInputsBlok | RichTextRenderConfigInput,
): RichTextRenderConfigInput {
  if (!inputs) return {};
  return {
    prose_class_name: inputs.prose_class_name,
    heading_class_name: inputs.heading_class_name,
    heading_wrapper_class_name: inputs.heading_wrapper_class_name,
    paragraph_class_name: inputs.paragraph_class_name,
    quote_class_name: inputs.quote_class_name,
    unordered_list_class_name: inputs.unordered_list_class_name,
    ordered_list_class_name: inputs.ordered_list_class_name,
    list_item_class_name: inputs.list_item_class_name,
    table_class_name: inputs.table_class_name,
    table_wrapper_class_name: inputs.table_wrapper_class_name,
    table_row_class_name: inputs.table_row_class_name,
    table_header_class_name: inputs.table_header_class_name,
    table_cell_class_name: inputs.table_cell_class_name,
    embedded_component_class_name: inputs.embedded_component_class_name,
    heading_section_class_name: inputs.heading_section_class_name,
    heading_section_spacing_class_name: inputs.heading_section_spacing_class_name,
    wrap_heading_sections: inputs.wrap_heading_sections,
  };
}

function pickClassName(
  overrideClassName: string | undefined,
  baseClassName: string,
): string {
  if (typeof overrideClassName !== "string") return baseClassName;
  return cn(baseClassName, overrideClassName).trim();
}

export function resolveRichTextRenderConfig({
  base = DEFAULT_RICH_TEXT_RENDER_CONFIG,
  blokInputs,
  propInputs,
}: {
  base?: RichTextRenderConfig;
  blokInputs?: BuilderRichTextInputsBlok;
  propInputs?: RichTextRenderConfigInput;
}): RichTextRenderConfig {
  const mergedInputs = { ...toConfigInput(blokInputs), ...toConfigInput(propInputs) };

  return {
    classes: {
      prose: pickClassName(mergedInputs.prose_class_name, base.classes.prose),
      heading: pickClassName(mergedInputs.heading_class_name, base.classes.heading),
      headingWrapper: pickClassName(
        mergedInputs.heading_wrapper_class_name,
        base.classes.headingWrapper,
      ),
      paragraph: pickClassName(
        mergedInputs.paragraph_class_name,
        base.classes.paragraph,
      ),
      quote: pickClassName(mergedInputs.quote_class_name, base.classes.quote),
      unorderedList: pickClassName(
        mergedInputs.unordered_list_class_name,
        base.classes.unorderedList,
      ),
      orderedList: pickClassName(
        mergedInputs.ordered_list_class_name,
        base.classes.orderedList,
      ),
      listItem: pickClassName(
        mergedInputs.list_item_class_name,
        base.classes.listItem,
      ),
      table: pickClassName(mergedInputs.table_class_name, base.classes.table),
      tableWrapper: pickClassName(
        mergedInputs.table_wrapper_class_name,
        base.classes.tableWrapper,
      ),
      tableRow: pickClassName(
        mergedInputs.table_row_class_name,
        base.classes.tableRow,
      ),
      tableHeader: pickClassName(
        mergedInputs.table_header_class_name,
        base.classes.tableHeader,
      ),
      tableCell: pickClassName(
        mergedInputs.table_cell_class_name,
        base.classes.tableCell,
      ),
      embeddedComponent: pickClassName(
        mergedInputs.embedded_component_class_name,
        base.classes.embeddedComponent,
      ),
      headingSection: pickClassName(
        mergedInputs.heading_section_class_name,
        base.classes.headingSection,
      ),
      headingSectionSpacing: pickClassName(
        mergedInputs.heading_section_spacing_class_name,
        base.classes.headingSectionSpacing,
      ),
    },
    behavior: {
      wrapHeadingSections:
        typeof mergedInputs.wrap_heading_sections === "boolean"
          ? mergedInputs.wrap_heading_sections
          : base.behavior.wrapHeadingSections,
    },
  };
}
