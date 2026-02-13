/**
 * Storyblok Component Definitions
 *
 * This file defines the schema for all CMS components to seed Storyblok.
 * These definitions match the TypeScript interfaces in the wrapper components.
 *
 * Run `bun run storyblok:seed` to push these to your Storyblok space.
 */

import { textSizeOptionsWithPx } from "../styles/styles_options";
import {
  coLocatedComponentDefinitions,
  shadcnContainerDefinition,
  shadcnGridDefinition,
  shadcnIconDefinition,
  shadcnSectionDefinition,
  stylesOptionsStoryblokDefinition,
} from "./definitions/co-located";
import type { StoryblokComponent, StoryblokOption } from "./types";

// Reusable option sets
const buttonVariantOptions: StoryblokOption[] = [
  { value: "default", name: "Default" },
  { value: "destructive", name: "Destructive" },
  { value: "outline-solid", name: "Outline" },
  { value: "secondary", name: "Secondary" },
  { value: "ghost", name: "Ghost" },
  { value: "link", name: "Link" },
];

const buttonSizeOptions: StoryblokOption[] = [
  { value: "default", name: "Default" },
  { value: "xs", name: "Extra Small" },
  { value: "sm", name: "Small" },
  { value: "lg", name: "Large" },
  { value: "icon", name: "Icon" },
  { value: "icon-xs", name: "Icon XS" },
  { value: "icon-sm", name: "Icon SM" },
  { value: "icon-lg", name: "Icon LG" },
  { value: "dynamic", name: "Dynamic" },
];

const sideOptions: StoryblokOption[] = [
  { value: "top", name: "Top" },
  { value: "right", name: "Right" },
  { value: "bottom", name: "Bottom" },
  { value: "left", name: "Left" },
];

const alignOptions: StoryblokOption[] = [
  { value: "left", name: "Left" },
  { value: "center", name: "Center" },
  { value: "right", name: "Right" },
];

const lineHeightOptions: StoryblokOption[] = [
  { value: "none", name: "None" },
  { value: "tight", name: "Tight" },
  { value: "snug", name: "Snug" },
  { value: "normal", name: "Normal" },
  { value: "relaxed", name: "Relaxed" },
  { value: "loose", name: "Loose" },
];

const letterSpacingOptions: StoryblokOption[] = [
  { value: "tighter", name: "Tighter" },
  { value: "tight", name: "Tight" },
  { value: "normal", name: "Normal" },
  { value: "wide", name: "Wide" },
  { value: "wider", name: "Wider" },
  { value: "widest", name: "Widest" },
];

const orientationOptions: StoryblokOption[] = [
  { value: "horizontal", name: "Horizontal" },
  { value: "vertical", name: "Vertical" },
];

/**
 * Component Definitions
 * Organized by category matching the wrapper exports
 */
export const componentDefinitions: StoryblokComponent[] = [
  // ============================================
  // LAYOUT COMPONENTS
  // ============================================
  shadcnSectionDefinition,

  shadcnGridDefinition,

  stylesOptionsStoryblokDefinition,

  shadcnContainerDefinition,

  // ============================================
  // TYPOGRAPHY & CONTENT
  // ============================================
  {
    name: "shadcn_text",
    display_name: "Text",
    is_root: false,
    is_nestable: true,
    icon: "block-text-c",
    preview_field: "content",
    schema: {
      content: {
        type: "textarea",
        pos: 0,
        required: true,
        description: "Text content",
      },
      element: {
        type: "option",
        pos: 1,
        default_value: "p",
        options: [
          { value: "p", name: "Paragraph" },
          { value: "span", name: "Span" },
          { value: "q", name: "Quote (inline)" },
          { value: "blockquote", name: "Block quote" },
          { value: "h1", name: "Heading 1" },
          { value: "h2", name: "Heading 2" },
          { value: "h3", name: "Heading 3" },
          { value: "h4", name: "Heading 4" },
          { value: "h5", name: "Heading 5" },
          { value: "h6", name: "Heading 6" },
        ],
      },
      size: {
        type: "option",
        pos: 2,
        default_value: "base",
        options: textSizeOptionsWithPx,
      },
      weight: {
        type: "option",
        pos: 3,
        default_value: "normal",
        options: [
          { value: "normal", name: "Normal (400)" },
          { value: "medium", name: "Medium (500)" },
          { value: "semibold", name: "Semibold (600)" },
          { value: "bold", name: "Bold (700)" },
        ],
      },
      color: {
        type: "option",
        pos: 4,
        default_value: "default",
        options: [
          { value: "default", name: "Default" },
          { value: "muted", name: "Muted" },
          { value: "primary", name: "Primary" },
          { value: "destructive", name: "Destructive" },
        ],
      },
      color_light: {
        type: "custom",
        pos: 5,
        default_value: "",
        description:
          "Text color in light theme. Overrides semantic color when set.",
        field_type: "native-color-picker",
      },
      color_dark: {
        type: "custom",
        pos: 6,
        default_value: "",
        description:
          "Text color in dark theme. Overrides semantic color when set.",
        field_type: "native-color-picker",
      },
      align: {
        type: "option",
        pos: 7,
        default_value: "left",
        options: alignOptions,
      },
      font_style: {
        type: "option",
        pos: 8,
        default_value: "normal",
        options: [
          { value: "normal", name: "Normal" },
          { value: "italic", name: "Italic" },
        ],
        description: "Font style",
      },
      line_height: {
        type: "option",
        pos: 9,
        default_value: "normal",
        options: lineHeightOptions,
        description: "Line height",
      },
      letter_spacing: {
        type: "option",
        pos: 10,
        default_value: "normal",
        options: letterSpacingOptions,
        description: "Letter spacing",
      },
      sr_only: {
        type: "boolean",
        pos: 10.5,
        default_value: false,
        description:
          "Screen-reader only. Visually hides the text but keeps it accessible (e.g. descriptive link text for icon-only buttons).",
      },
      styles: {
        type: "bloks",
        pos: 11,
        description:
          "Layout and sizing per breakpoint (base, sm, md, lg, xl, 2xl). Gap, padding, margin, and sizing options show pixel values.",
        restrict_components: true,
        component_whitelist: ["styles_breakpoint_options"],
      },
      data_mapping: {
        type: "bloks",
        pos: 0,
        restrict_components: true,
        component_whitelist: ["builder_data_mapping"],
        description:
          "Section builder: maps premade data fields to this component (e.g. image + dark_image)",
      },
    },
  },

  {
    name: "builder_rich_text_inputs",
    display_name: "Rich Text Inputs",
    is_root: false,
    is_nestable: true,
    icon: "block-settings",
    schema: {
      wrap_heading_sections: {
        type: "boolean",
        pos: 0,
        default_value: true,
        description:
          "Wrap content in heading-based section containers for section-builder metadata",
      },
      prose_class_name: {
        type: "textarea",
        pos: 1,
        default_value:
          "prose-a:text-primary prose-a:underline prose-headings:font-semibold prose-headings:text-primary prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground prose-code:text-foreground",
        description: "Additional prose-level class names",
      },
      heading_class_name: {
        type: "textarea",
        pos: 2,
        default_value: "text-primary font-semibold scroll-mt-24",
        description: "Heading element class names (h1-h6)",
      },
      heading_wrapper_class_name: {
        type: "textarea",
        pos: 3,
        default_value: "scroll-mt-24",
        description: "Wrapper class names used when heading overrides render custom bloks",
      },
      paragraph_class_name: {
        type: "textarea",
        pos: 4,
        default_value: "whitespace-pre-line text-primary",
        description: "Paragraph class names",
      },
      quote_class_name: {
        type: "textarea",
        pos: 5,
        default_value: "border-l-2 border-border pl-4 italic text-muted-foreground",
        description: "Blockquote class names",
      },
      unordered_list_class_name: {
        type: "textarea",
        pos: 6,
        default_value:
          "text-muted-foreground list-disc dark:marker:text-[#364152] list-outside pl-6",
        description: "Unordered list class names",
      },
      ordered_list_class_name: {
        type: "textarea",
        pos: 7,
        default_value:
          "text-muted-foreground list-decimal list-outside pl-6 marker:text-muted-foreground",
        description: "Ordered list class names",
      },
      list_item_class_name: {
        type: "textarea",
        pos: 8,
        default_value: "whitespace-pre-line text-primary",
        description: "List item class names",
      },
      table_class_name: {
        type: "textarea",
        pos: 9,
        default_value: "w-full caption-bottom text-sm",
        description: "Table class names",
      },
      table_wrapper_class_name: {
        type: "textarea",
        pos: 10,
        default_value:
          "overflow-x-auto rounded-md border-b dark:border-b-[#364152] even:bg-muted border-border/70",
        description: "Table wrapper class names",
      },
      table_row_class_name: {
        type: "textarea",
        pos: 11,
        default_value: "border-b dark:border-b-[#364152] even:bg-muted border-border/60",
        description: "Table row class names",
      },
      table_header_class_name: {
        type: "textarea",
        pos: 12,
        default_value: "text-left h-10 px-3 align-middle font-medium text-primary",
        description: "Table header class names",
      },
      table_cell_class_name: {
        type: "textarea",
        pos: 13,
        default_value: "p-3 align-middle text-muted-foreground",
        description: "Table cell class names",
      },
      embedded_component_class_name: {
        type: "textarea",
        pos: 14,
        default_value: "sb-richtext-blok",
        description: "Wrapper class names for embedded Storyblok components",
      },
      heading_section_class_name: {
        type: "textarea",
        pos: 15,
        default_value: "sb-heading-section grid gap-4",
        description: "Section class names when heading section wrapping is enabled",
      },
      heading_section_spacing_class_name: {
        type: "textarea",
        pos: 16,
        default_value: "pt-4",
        description:
          "Additional class names applied to heading sections after the first section",
      },
    },
  },

  {
    name: "rich_text_node_mappings",
    display_name: "Rich Text Node Mappings",
    is_root: false,
    is_nestable: true,
    icon: "block-settings",
    schema: {
      heading_1_component: {
        type: "bloks",
        pos: 0,
        description: "Blok used for heading level 1 nodes",
      },
      heading_1_text_field: {
        type: "text",
        pos: 16,
        default_value: "title",
        description: "Field on heading 1 blok to inject rich text content",
      },
      heading_2_component: {
        type: "bloks",
        pos: 1,
        description: "Blok used for heading level 2 nodes",
      },
      heading_2_text_field: {
        type: "text",
        pos: 17,
        default_value: "title",
        description: "Field on heading 2 blok to inject rich text content",
      },
      heading_3_component: {
        type: "bloks",
        pos: 2,
        description: "Blok used for heading level 3 nodes",
      },
      heading_3_text_field: {
        type: "text",
        pos: 18,
        default_value: "title",
        description: "Field on heading 3 blok to inject rich text content",
      },
      heading_4_component: {
        type: "bloks",
        pos: 3,
        description: "Blok used for heading level 4 nodes",
      },
      heading_4_text_field: {
        type: "text",
        pos: 19,
        default_value: "title",
        description: "Field on heading 4 blok to inject rich text content",
      },
      heading_5_component: {
        type: "bloks",
        pos: 4,
        description: "Blok used for heading level 5 nodes",
      },
      heading_5_text_field: {
        type: "text",
        pos: 20,
        default_value: "title",
        description: "Field on heading 5 blok to inject rich text content",
      },
      heading_6_component: {
        type: "bloks",
        pos: 5,
        description: "Blok used for heading level 6 nodes",
      },
      heading_6_text_field: {
        type: "text",
        pos: 21,
        default_value: "title",
        description: "Field on heading 6 blok to inject rich text content",
      },
      paragraph_component: {
        type: "bloks",
        pos: 6,
        description: "Blok used for paragraph nodes",
      },
      paragraph_text_field: {
        type: "text",
        pos: 22,
        default_value: "content",
        description: "Field on paragraph blok to inject rich text content",
      },
      quote_component: {
        type: "bloks",
        pos: 7,
        description: "Blok used for quote nodes",
      },
      quote_text_field: {
        type: "text",
        pos: 23,
        default_value: "quote",
        description: "Field on quote blok to inject rich text content",
      },
      unordered_list_component: {
        type: "bloks",
        pos: 8,
        description: "Blok used for unordered list nodes",
      },
      unordered_list_text_field: {
        type: "text",
        pos: 24,
        default_value: "content",
        description: "Field on unordered list blok to inject rich text content",
      },
      unordered_list_children_field: {
        type: "text",
        pos: 36,
        default_value: "",
        description: "Optional field on unordered list blok to inject rendered child nodes",
      },
      ordered_list_component: {
        type: "bloks",
        pos: 9,
        description: "Blok used for ordered list nodes",
      },
      ordered_list_text_field: {
        type: "text",
        pos: 25,
        default_value: "content",
        description: "Field on ordered list blok to inject rich text content",
      },
      ordered_list_children_field: {
        type: "text",
        pos: 37,
        default_value: "",
        description: "Optional field on ordered list blok to inject rendered child nodes",
      },
      list_item_component: {
        type: "bloks",
        pos: 10,
        description: "Blok used for list item nodes",
      },
      list_item_text_field: {
        type: "text",
        pos: 26,
        default_value: "content",
        description: "Field on list item blok to inject rich text content",
      },
      list_item_parent_list_type_field: {
        type: "text",
        pos: 35,
        default_value: "parent_list_type",
        description: "Field on list item blok to inject parent list type (unordered or ordered)",
      },
      table_component: {
        type: "bloks",
        pos: 11,
        description: "Blok used for table nodes",
      },
      table_text_field: {
        type: "text",
        pos: 27,
        default_value: "content",
        description: "Field on table blok to inject rich text content",
      },
      table_children_field: {
        type: "text",
        pos: 38,
        default_value: "",
        description: "Optional field on table blok to inject rendered child nodes",
      },
      table_row_component: {
        type: "bloks",
        pos: 12,
        description: "Blok used for table row nodes",
      },
      table_row_text_field: {
        type: "text",
        pos: 28,
        default_value: "content",
        description: "Field on table row blok to inject rich text content",
      },
      table_header_component: {
        type: "bloks",
        pos: 13,
        description: "Blok used for table header nodes",
      },
      table_header_text_field: {
        type: "text",
        pos: 29,
        default_value: "content",
        description: "Field on table header blok to inject rich text content",
      },
      table_cell_component: {
        type: "bloks",
        pos: 14,
        description: "Blok used for table cell nodes",
      },
      table_cell_text_field: {
        type: "text",
        pos: 30,
        default_value: "content",
        description: "Field on table cell blok to inject rich text content",
      },
      embedded_component_component: {
        type: "bloks",
        pos: 15,
        description: "Blok used for embedded component nodes",
      },
      embedded_component_text_field: {
        type: "text",
        pos: 31,
        default_value: "content",
        description: "Field on embedded component blok to inject rich text content",
      },
      link_component: {
        type: "bloks",
        pos: 32,
        description: "Blok used for link marks",
      },
      link_text_field: {
        type: "text",
        pos: 33,
        default_value: "content",
        description: "Field on link blok to inject rich text label",
      },
      link_url_field: {
        type: "text",
        pos: 34,
        default_value: "link",
        description: "Field on link blok to inject rich text URL",
      },
    },
  },

  {
    name: "rich_text",
    display_name: "Shared Rich Text",
    is_root: false,
    is_nestable: true,
    icon: "block-doc",
    preview_field: "content",
    schema: {
      content: {
        type: "richtext",
        pos: 0,
        required: true,
        description: "Rich text content with formatting",
      },
      node_mappings: {
        type: "bloks",
        pos: 1,
        description:
          "Node to component mappings used when rendering rich text nodes",
        restrict_components: true,
        component_whitelist: ["rich_text_node_mappings"],
      },
      intro: {
        type: "bloks",
        pos: 2,
        description: "Optional intro content rendered above rich text",
      },
      footer: {
        type: "bloks",
        pos: 3,
        description: "Optional footer content rendered below rich text",
      },
      aside_left: {
        type: "bloks",
        pos: 4,
        description: "Optional left aside content",
        restrict_components: true,
        component_whitelist: [
          "shadcn_article_aside",
          "shadcn_container",
          "shadcn_alert",
          "shadcn_card",
          "shadcn_text",
          "shadcn_rich_text",
          "rich_text",
        ],
      },
      aside_right: {
        type: "bloks",
        pos: 5,
        description: "Optional right aside content",
        restrict_components: true,
        component_whitelist: [
          "shadcn_article_aside",
          "shadcn_container",
          "shadcn_alert",
          "shadcn_card",
          "shadcn_text",
          "shadcn_rich_text",
          "rich_text",
        ],
      },
      styles: {
        type: "bloks",
        pos: 6,
        description:
          "Layout and sizing per breakpoint (base, sm, md, lg, xl, 2xl)",
        restrict_components: true,
        component_whitelist: ["styles_breakpoint_options"],
      },
    },
  },

  {
    name: "shadcn_rich_text",
    display_name: "Rich Text",
    is_root: false,
    is_nestable: true,
    icon: "block-doc",
    schema: {
      content: {
        type: "richtext",
        pos: 0,
        required: true,
        description: "Rich text content with formatting",
      },
      prose_size: {
        type: "option",
        pos: 1,
        default_value: "base",
        options: [
          { value: "sm", name: "Small" },
          { value: "base", name: "Base" },
          { value: "lg", name: "Large" },
        ],
      },
      render_inputs: {
        type: "bloks",
        pos: 2,
        description:
          "Optional rich-text render inputs from element builder (classes and behavior).",
        restrict_components: true,
        component_whitelist: ["builder_rich_text_inputs"],
      },
      styles: {
        type: "bloks",
        pos: 3,
        description:
          "Layout and sizing per breakpoint (base, sm, md, lg, xl, 2xl)",
        restrict_components: true,
        component_whitelist: ["styles_breakpoint_options"],
      },
    },
  },

  {
    name: "shadcn_article_aside",
    display_name: "Article Aside",
    is_root: false,
    is_nestable: true,
    icon: "block-menu",
    preview_field: "title",
    schema: {
      title: {
        type: "text",
        pos: 0,
        default_value: "On this page",
        description: "Table of contents title",
      },
      empty_message: {
        type: "text",
        pos: 1,
        default_value: "No headings yet",
        description: "Message shown when the article has no headings",
      },
      styles: {
        type: "bloks",
        pos: 2,
        description:
          "Layout and sizing per breakpoint (base, sm, md, lg, xl, 2xl)",
        restrict_components: true,
        component_whitelist: ["styles_breakpoint_options"],
      },
    },
  },

  {
    name: "shadcn_alert",
    display_name: "Alert",
    is_root: false,
    is_nestable: true,
    icon: "block-alert",
    preview_field: "title",
    schema: {
      title: {
        type: "text",
        pos: 0,
        description: "Alert title",
      },
      description: {
        type: "textarea",
        pos: 1,
        description: "Alert description",
      },
      variant: {
        type: "option",
        pos: 2,
        default_value: "default",
        options: [
          { value: "default", name: "Default" },
          { value: "destructive", name: "Destructive" },
        ],
      },
      icon: {
        type: "option",
        pos: 3,
        default_value: "info",
        options: [
          { value: "info", name: "Info" },
          { value: "warning", name: "Warning" },
          { value: "success", name: "Success" },
          { value: "error", name: "Error" },
          { value: "none", name: "None" },
        ],
      },
      styles: {
        type: "bloks",
        pos: 4,
        description:
          "Layout and sizing per breakpoint (base, sm, md, lg, xl, 2xl)",
        restrict_components: true,
        component_whitelist: ["styles_breakpoint_options"],
      },
    },
  },

  {
    name: "shadcn_badge",
    display_name: "Badge",
    is_root: false,
    is_nestable: true,
    icon: "block-tag",
    preview_field: "text",
    schema: {
      text: {
        type: "text",
        pos: 0,
        required: true,
        description: "Badge text",
      },
      variant: {
        type: "option",
        pos: 1,
        default_value: "default",
        options: [
          { value: "default", name: "Default" },
          { value: "secondary", name: "Secondary" },
          { value: "destructive", name: "Destructive" },
          { value: "outline-solid", name: "Outline" },
        ],
      },
      styles: {
        type: "bloks",
        pos: 2,
        description:
          "Layout and sizing per breakpoint (base, sm, md, lg, xl, 2xl)",
        restrict_components: true,
        component_whitelist: ["styles_breakpoint_options"],
      },
      data_mapping: {
        type: "bloks",
        pos: 0,
        restrict_components: true,
        component_whitelist: ["builder_data_mapping"],
        description:
          "Section builder: maps premade data fields to this component (e.g. image + dark_image)",
      },
    },
  },

  shadcnIconDefinition,

  {
    name: "shadcn_separator",
    display_name: "Separator",
    is_root: false,
    is_nestable: true,
    icon: "block-minus",
    schema: {
      orientation: {
        type: "option",
        pos: 0,
        default_value: "horizontal",
        options: orientationOptions,
      },
      decorative: {
        type: "boolean",
        pos: 1,
        default_value: true,
        description: "If true, separator is purely decorative",
      },
      styles: {
        type: "bloks",
        pos: 2,
        description:
          "Layout and sizing per breakpoint (base, sm, md, lg, xl, 2xl)",
        restrict_components: true,
        component_whitelist: ["styles_breakpoint_options"],
      },
    },
  },

  // ============================================
  // NAVIGATION
  // ============================================
  {
    name: "shadcn_accordion",
    display_name: "Accordion",
    is_root: false,
    is_nestable: true,
    icon: "block-accordion",
    schema: {
      items: {
        type: "bloks",
        pos: 0,
        restrict_components: true,
        component_whitelist: ["shadcn_accordion_item"],
        description: "Accordion items",
      },
      type: {
        type: "option",
        pos: 1,
        default_value: "single",
        options: [
          { value: "single", name: "Single (one open at a time)" },
          { value: "multiple", name: "Multiple (many open)" },
        ],
      },
      collapsible: {
        type: "boolean",
        pos: 2,
        default_value: true,
        description: "Allow closing all items (single mode only)",
      },
      default_value: {
        type: "text",
        pos: 3,
        description: "Value of initially open item",
      },
      styles: {
        type: "bloks",
        pos: 4,
        description:
          "Layout and sizing per breakpoint (base, sm, md, lg, xl, 2xl)",
        restrict_components: true,
        component_whitelist: ["styles_breakpoint_options"],
      },
    },
  },

  {
    name: "shadcn_accordion_item",
    display_name: "Accordion Item",
    is_root: false,
    is_nestable: true,
    icon: "block-buildin",
    preview_field: "title",
    schema: {
      title: {
        type: "text",
        pos: 0,
        required: true,
        description: "Item title (trigger)",
      },
      content: {
        type: "textarea",
        pos: 1,
        required: true,
        description: "Item content",
      },
      value: {
        type: "text",
        pos: 2,
        description: "Unique value for this item",
      },
      styles: {
        type: "bloks",
        pos: 3,
        description:
          "Layout and sizing per breakpoint (base, sm, md, lg, xl, 2xl)",
        restrict_components: true,
        component_whitelist: ["styles_breakpoint_options"],
      },
    },
  },

  {
    name: "shadcn_tabs",
    display_name: "Tabs",
    is_root: false,
    is_nestable: true,
    icon: "block-tab",
    schema: {
      tabs: {
        type: "bloks",
        pos: 0,
        restrict_components: true,
        component_whitelist: ["shadcn_tab_item"],
        description: "Tab items",
      },
      default_value: {
        type: "text",
        pos: 1,
        description: "Value of initially active tab",
      },
      orientation: {
        type: "option",
        pos: 2,
        default_value: "horizontal",
        options: orientationOptions,
      },
      styles: {
        type: "bloks",
        pos: 3,
        description:
          "Layout and sizing per breakpoint (base, sm, md, lg, xl, 2xl)",
        restrict_components: true,
        component_whitelist: ["styles_breakpoint_options"],
      },
    },
  },

  {
    name: "shadcn_tab_item",
    display_name: "Tab Item",
    is_root: false,
    is_nestable: true,
    icon: "block-buildin",
    preview_field: "label",
    schema: {
      label: {
        type: "text",
        pos: 0,
        required: true,
        description: "Tab label",
      },
      value: {
        type: "text",
        pos: 1,
        required: true,
        description: "Unique value for this tab",
      },
      content: {
        type: "bloks",
        pos: 2,
        description: "Tab content",
      },
      styles: {
        type: "bloks",
        pos: 3,
        description:
          "Layout and sizing per breakpoint (base, sm, md, lg, xl, 2xl)",
        restrict_components: true,
        component_whitelist: ["styles_breakpoint_options"],
      },
    },
  },

  {
    name: "shadcn_breadcrumb",
    display_name: "Breadcrumb",
    is_root: false,
    is_nestable: true,
    icon: "block-arrow-pointer",
    schema: {
      styles: {
        type: "bloks",
        pos: 0,
        description:
          "Layout and sizing per breakpoint (base, sm, md, lg, xl, 2xl)",
        restrict_components: true,
        component_whitelist: ["styles_breakpoint_options"],
      },
    },
  },

  {
    name: "shadcn_pagination",
    display_name: "Pagination",
    is_root: false,
    is_nestable: true,
    icon: "block-arrow-right",
    schema: {
      total_pages: {
        type: "number",
        pos: 0,
        required: true,
        min_value: 1,
        description: "Total number of pages",
      },
      current_page: {
        type: "number",
        pos: 1,
        required: true,
        min_value: 1,
        description: "Current page number",
      },
      base_url: {
        type: "text",
        pos: 2,
        required: true,
        description: "Base URL for pagination links",
      },
      show_ellipsis: {
        type: "boolean",
        pos: 3,
        default_value: true,
        description: "Show ellipsis for many pages",
      },
      visible_pages: {
        type: "number",
        pos: 4,
        default_value: 5,
        min_value: 3,
        max_value: 10,
        description: "Number of visible page links",
      },
      styles: {
        type: "bloks",
        pos: 5,
        description:
          "Layout and sizing per breakpoint (base, sm, md, lg, xl, 2xl)",
        restrict_components: true,
        component_whitelist: ["styles_breakpoint_options"],
      },
    },
  },

  // ============================================
  // MEDIA
  // ============================================
  {
    name: "shadcn_avatar",
    display_name: "Avatar",
    is_root: false,
    is_nestable: true,
    icon: "block-smiley",
    schema: {
      image: {
        type: "asset",
        pos: 0,
        filetypes: ["images"],
        description: "Avatar image",
      },
      fallback: {
        type: "text",
        pos: 1,
        description: "Fallback text (e.g., initials)",
      },
      size: {
        type: "option",
        pos: 2,
        default_value: "md",
        options: [
          { value: "sm", name: "Small" },
          { value: "md", name: "Medium" },
          { value: "lg", name: "Large" },
          { value: "xl", name: "Extra Large" },
        ],
      },
      styles: {
        type: "bloks",
        pos: 3,
        description:
          "Layout and sizing per breakpoint (base, sm, md, lg, xl, 2xl)",
        restrict_components: true,
        component_whitelist: ["styles_breakpoint_options"],
      },
    },
  },

  {
    name: "shadcn_image",
    display_name: "Image",
    is_root: false,
    is_nestable: true,
    icon: "block-image",
    schema: {
      image_light: {
        type: "asset",
        pos: 0,
        required: true,
        filetypes: ["images"],
        description: "Light theme image (also used as fallback when no dark image is set)",
      },
      image_dark: {
        type: "asset",
        pos: 0.5,
        filetypes: ["images"],
        description: "Dark theme image. Falls back to the light image when empty.",
      },
      aspect_ratio: {
        type: "option",
        pos: 1,
        default_value: "auto",
        options: [
          { value: "auto", name: "Auto" },
          { value: "square", name: "Square (1:1)" },
          { value: "video", name: "Video (16:9)" },
          { value: "portrait", name: "Portrait (3:4)" },
          { value: "wide", name: "Wide (21:9)" },
        ],
      },
      object_fit: {
        type: "option",
        pos: 2,
        default_value: "cover",
        options: [
          { value: "cover", name: "Cover" },
          { value: "contain", name: "Contain" },
          { value: "fill", name: "Fill" },
          { value: "none", name: "None" },
        ],
      },
      invert_in_light: {
        type: "boolean",
        pos: 2.5,
        default_value: false,
        description: "Apply invert filter in light mode",
      },
      invert_in_dark: {
        type: "boolean",
        pos: 2.6,
        default_value: false,
        description: "Apply invert filter in dark mode",
      },
      rounded: {
        type: "option",
        pos: 3,
        default_value: "md",
        options: [
          { value: "none", name: "None" },
          { value: "sm", name: "Small" },
          { value: "md", name: "Medium" },
          { value: "lg", name: "Large" },
          { value: "full", name: "Full (Circle)" },
        ],
      },
      caption: {
        type: "text",
        pos: 4,
        description: "Image caption",
      },
      styles: {
        type: "bloks",
        pos: 5,
        description:
          "Layout and sizing per breakpoint (base, sm, md, lg, xl, 2xl)",
        restrict_components: true,
        component_whitelist: ["styles_breakpoint_options"],
      },
      data_mapping: {
        type: "bloks",
        pos: 0,
        restrict_components: true,
        component_whitelist: ["builder_data_mapping"],
        description:
          "Section builder: maps premade data fields to this component (e.g. image + dark_image)",
      },
    },
  },

  {
    name: "shadcn_carousel",
    display_name: "Carousel",
    is_root: false,
    is_nestable: true,
    icon: "block-carousel",
    schema: {
      items: {
        type: "bloks",
        pos: 0,
        description: "Carousel items",
      },
      show_arrows: {
        type: "boolean",
        pos: 1,
        default_value: true,
        description: "Show navigation arrows",
      },
      loop: {
        type: "boolean",
        pos: 2,
        default_value: false,
        description: "Loop back to start",
      },
      autoplay: {
        type: "boolean",
        pos: 3,
        default_value: false,
        description: "Auto-advance slides",
      },
      autoplay_delay: {
        type: "number",
        pos: 4,
        default_value: 3000,
        min_value: 1000,
        description: "Autoplay delay in ms",
      },
      orientation: {
        type: "option",
        pos: 5,
        default_value: "horizontal",
        options: orientationOptions,
      },
      items_per_view: {
        type: "option",
        pos: 6,
        default_value: "1",
        options: [
          { value: "1", name: "1 Item" },
          { value: "2", name: "2 Items" },
          { value: "3", name: "3 Items" },
          { value: "4", name: "4 Items" },
        ],
      },
      styles: {
        type: "bloks",
        pos: 7,
        description:
          "Layout and sizing per breakpoint (base, sm, md, lg, xl, 2xl)",
        restrict_components: true,
        component_whitelist: ["styles_breakpoint_options"],
      },
    },
  },

  {
    name: "shadcn_aspect_ratio",
    display_name: "Aspect Ratio",
    is_root: false,
    is_nestable: true,
    icon: "block-resize",
    schema: {
      ratio: {
        type: "option",
        pos: 0,
        default_value: "video",
        options: [
          { value: "square", name: "Square (1:1)" },
          { value: "video", name: "Video (16:9)" },
          { value: "portrait", name: "Portrait (3:4)" },
          { value: "wide", name: "Wide (21:9)" },
          { value: "custom", name: "Custom" },
        ],
      },
      custom_ratio: {
        type: "number",
        pos: 1,
        description: "Custom ratio (e.g., 1.5 for 3:2)",
      },
      content: {
        type: "bloks",
        pos: 2,
        description: "Content inside the aspect ratio container",
      },
      styles: {
        type: "bloks",
        pos: 3,
        description:
          "Layout and sizing per breakpoint (base, sm, md, lg, xl, 2xl)",
        restrict_components: true,
        component_whitelist: ["styles_breakpoint_options"],
      },
    },
  },

  {
    name: "shadcn_skeleton",
    display_name: "Skeleton",
    is_root: false,
    is_nestable: true,
    icon: "block-empty",
    schema: {
      variant: {
        type: "option",
        pos: 0,
        default_value: "rectangular",
        options: [
          { value: "text", name: "Text Lines" },
          { value: "circular", name: "Circular" },
          { value: "rectangular", name: "Rectangular" },
          { value: "card", name: "Card" },
        ],
      },
      width: {
        type: "text",
        pos: 1,
        default_value: "100%",
        description: "Width (e.g., 100%, 200px)",
      },
      height: {
        type: "text",
        pos: 2,
        default_value: "20px",
        description: "Height (e.g., 20px, 100%)",
      },
      lines: {
        type: "number",
        pos: 3,
        default_value: 1,
        min_value: 1,
        max_value: 10,
        description: "Number of lines (text variant)",
      },
      styles: {
        type: "bloks",
        pos: 4,
        description:
          "Layout and sizing per breakpoint (base, sm, md, lg, xl, 2xl)",
        restrict_components: true,
        component_whitelist: ["styles_breakpoint_options"],
      },
    },
  },

  // ============================================
  // INTERACTIVE / OVERLAYS
  // ============================================
  {
    name: "shadcn_button",
    display_name: "Button",
    is_root: false,
    is_nestable: true,
    icon: "block-button",
    preview_field: "label",
    schema: {
      label: {
        type: "bloks",
        pos: 0,
        description:
          "Button content (text, icons, images, etc.). Order = left to right.",
        restrict_components: true,
        component_whitelist: [
          "shadcn_text",
          "shadcn_rich_text",
          "shadcn_icon",
          "shadcn_image",
          "shadcn_badge",
          "shadcn_avatar",
          "shadcn_separator",
          "shadcn_skeleton",
        ],
      },
      variant: {
        type: "option",
        pos: 1,
        default_value: "default",
        options: buttonVariantOptions,
      },
      size: {
        type: "option",
        pos: 2,
        default_value: "default",
        options: buttonSizeOptions,
      },
      link: {
        type: "multilink",
        pos: 3,
        allow_target_blank: true,
        description: "Button link",
      },
      styles: {
        type: "bloks",
        pos: 4,
        description:
          "Layout and sizing per breakpoint (base, sm, md, lg, xl, 2xl)",
        restrict_components: true,
        component_whitelist: ["styles_breakpoint_options"],
      },
      data_mapping: {
        type: "bloks",
        pos: 0,
        restrict_components: true,
        component_whitelist: ["builder_data_mapping"],
        description:
          "Section builder: maps premade data fields to this component (e.g. image + dark_image)",
      },
    },
  },

  {
    name: "shadcn_card",
    display_name: "Card",
    is_root: false,
    is_nestable: true,
    icon: "block-wallet",
    preview_field: "title",
    schema: {
      image: {
        type: "bloks",
        pos: 0,
        description:
          "Image before the card header (shadcn: add image before header)",
        restrict_components: true,
        component_whitelist: ["shadcn_image"],
      },
      title: {
        type: "bloks",
        pos: 1,
        description: "Card title (e.g. Text or Button component)",
        restrict_components: true,
        component_whitelist: [
          "shadcn_text",
          "shadcn_rich_text",
          "shadcn_button",
        ],
      },
      description: {
        type: "bloks",
        pos: 2,
        description: "Card description (e.g. Text or Button component)",
        restrict_components: true,
        component_whitelist: [
          "shadcn_text",
          "shadcn_rich_text",
          "shadcn_button",
        ],
      },
      content: {
        type: "bloks",
        pos: 3,
        description: "Card content",
      },
      footer: {
        type: "bloks",
        pos: 4,
        description: "Card footer (usually buttons)",
      },
      styles: {
        type: "bloks",
        pos: 5,
        description:
          "Layout and sizing per breakpoint (base, sm, md, lg, xl, 2xl)",
        restrict_components: true,
        component_whitelist: ["styles_breakpoint_options"],
      },
    },
  },

  {
    name: "shadcn_hero",
    display_name: "Hero",
    is_root: false,
    is_nestable: true,
    icon: "block-image",
    preview_field: "headline",
    schema: {
      headline: {
        type: "text",
        pos: 0,
        required: true,
        description: "Main headline",
      },
      subheadline: {
        type: "textarea",
        pos: 1,
        description: "Supporting text",
      },
      background_image: {
        type: "asset",
        pos: 2,
        filetypes: ["images"],
        description: "Background image",
      },
      cta: {
        type: "bloks",
        pos: 3,
        restrict_components: true,
        component_whitelist: ["shadcn_button"],
        description: "Call-to-action buttons",
      },
      alignment: {
        type: "option",
        pos: 4,
        default_value: "center",
        options: alignOptions,
      },
      styles: {
        type: "bloks",
        pos: 5,
        description:
          "Layout and sizing per breakpoint (base, sm, md, lg, xl, 2xl)",
        restrict_components: true,
        component_whitelist: ["styles_breakpoint_options"],
      },
    },
  },

  {
    name: "shadcn_dialog",
    display_name: "Dialog",
    is_root: false,
    is_nestable: true,
    icon: "block-chat",
    preview_field: "title",
    schema: {
      trigger_text: {
        type: "text",
        pos: 0,
        required: true,
        description: "Button text to open dialog",
      },
      trigger_variant: {
        type: "option",
        pos: 1,
        default_value: "default",
        options: buttonVariantOptions,
      },
      title: {
        type: "text",
        pos: 2,
        required: true,
        description: "Dialog title",
      },
      description: {
        type: "textarea",
        pos: 3,
        description: "Dialog description",
      },
      content: {
        type: "bloks",
        pos: 4,
        description: "Dialog content",
      },
      footer: {
        type: "bloks",
        pos: 5,
        description: "Dialog footer (usually buttons)",
      },
      size: {
        type: "option",
        pos: 6,
        default_value: "md",
        options: [
          { value: "sm", name: "Small" },
          { value: "md", name: "Medium" },
          { value: "lg", name: "Large" },
          { value: "xl", name: "Extra Large" },
          { value: "full", name: "Full Width" },
        ],
      },
      styles: {
        type: "bloks",
        pos: 7,
        description:
          "Layout and sizing per breakpoint (base, sm, md, lg, xl, 2xl)",
        restrict_components: true,
        component_whitelist: ["styles_breakpoint_options"],
      },
    },
  },

  {
    name: "shadcn_sheet",
    display_name: "Sheet",
    is_root: false,
    is_nestable: true,
    icon: "block-sidecar",
    preview_field: "title",
    schema: {
      trigger_text: {
        type: "text",
        pos: 0,
        required: true,
        description: "Button text to open sheet",
      },
      trigger_variant: {
        type: "option",
        pos: 1,
        default_value: "default",
        options: buttonVariantOptions,
      },
      title: {
        type: "text",
        pos: 2,
        required: true,
        description: "Sheet title",
      },
      description: {
        type: "textarea",
        pos: 3,
        description: "Sheet description",
      },
      content: {
        type: "bloks",
        pos: 4,
        description: "Sheet content",
      },
      footer: {
        type: "bloks",
        pos: 5,
        description: "Sheet footer",
      },
      side: {
        type: "option",
        pos: 6,
        default_value: "right",
        options: sideOptions,
      },
      styles: {
        type: "bloks",
        pos: 7,
        description:
          "Layout and sizing per breakpoint (base, sm, md, lg, xl, 2xl)",
        restrict_components: true,
        component_whitelist: ["styles_breakpoint_options"],
      },
    },
  },

  {
    name: "shadcn_drawer",
    display_name: "Drawer",
    is_root: false,
    is_nestable: true,
    icon: "block-sidecar",
    preview_field: "title",
    schema: {
      trigger_text: {
        type: "text",
        pos: 0,
        required: true,
        description: "Button text to open drawer",
      },
      trigger_variant: {
        type: "option",
        pos: 1,
        default_value: "default",
        options: buttonVariantOptions,
      },
      title: {
        type: "text",
        pos: 2,
        required: true,
        description: "Drawer title",
      },
      description: {
        type: "textarea",
        pos: 3,
        description: "Drawer description",
      },
      content: {
        type: "bloks",
        pos: 4,
        description: "Drawer content",
      },
      footer: {
        type: "bloks",
        pos: 5,
        description: "Drawer footer",
      },
      styles: {
        type: "bloks",
        pos: 6,
        description:
          "Layout and sizing per breakpoint (base, sm, md, lg, xl, 2xl)",
        restrict_components: true,
        component_whitelist: ["styles_breakpoint_options"],
      },
    },
  },

  {
    name: "shadcn_tooltip",
    display_name: "Tooltip",
    is_root: false,
    is_nestable: true,
    icon: "block-chat",
    preview_field: "content",
    schema: {
      content: {
        type: "text",
        pos: 0,
        required: true,
        description: "Tooltip text",
      },
      trigger: {
        type: "bloks",
        pos: 1,
        description: "Element that triggers tooltip",
      },
      side: {
        type: "option",
        pos: 2,
        default_value: "top",
        options: sideOptions,
      },
      delay: {
        type: "number",
        pos: 3,
        default_value: 200,
        min_value: 0,
        description: "Delay before showing (ms)",
      },
      styles: {
        type: "bloks",
        pos: 4,
        description:
          "Layout and sizing per breakpoint (base, sm, md, lg, xl, 2xl)",
        restrict_components: true,
        component_whitelist: ["styles_breakpoint_options"],
      },
    },
  },

  {
    name: "shadcn_hover_card",
    display_name: "Hover Card",
    is_root: false,
    is_nestable: true,
    icon: "block-wallet",
    schema: {
      trigger: {
        type: "bloks",
        pos: 0,
        description: "Element that triggers hover card",
      },
      content: {
        type: "bloks",
        pos: 1,
        description: "Hover card content",
      },
      side: {
        type: "option",
        pos: 2,
        default_value: "bottom",
        options: sideOptions,
      },
      open_delay: {
        type: "number",
        pos: 3,
        default_value: 200,
        min_value: 0,
        description: "Delay before showing (ms)",
      },
      close_delay: {
        type: "number",
        pos: 4,
        default_value: 100,
        min_value: 0,
        description: "Delay before hiding (ms)",
      },
      styles: {
        type: "bloks",
        pos: 5,
        description:
          "Layout and sizing per breakpoint (base, sm, md, lg, xl, 2xl)",
        restrict_components: true,
        component_whitelist: ["styles_breakpoint_options"],
      },
    },
  },

  {
    name: "shadcn_popover",
    display_name: "Popover",
    is_root: false,
    is_nestable: true,
    icon: "block-chat",
    schema: {
      trigger_text: {
        type: "text",
        pos: 0,
        required: true,
        description: "Button text to open popover",
      },
      trigger_variant: {
        type: "option",
        pos: 1,
        default_value: "outline-solid",
        options: buttonVariantOptions,
      },
      content: {
        type: "bloks",
        pos: 2,
        description: "Popover content",
      },
      side: {
        type: "option",
        pos: 3,
        default_value: "bottom",
        options: sideOptions,
      },
      align: {
        type: "option",
        pos: 4,
        default_value: "center",
        options: [
          { value: "start", name: "Start" },
          { value: "center", name: "Center" },
          { value: "end", name: "End" },
        ],
      },
      styles: {
        type: "bloks",
        pos: 5,
        description:
          "Layout and sizing per breakpoint (base, sm, md, lg, xl, 2xl)",
        restrict_components: true,
        component_whitelist: ["styles_breakpoint_options"],
      },
    },
  },

  {
    name: "shadcn_collapsible",
    display_name: "Collapsible",
    is_root: false,
    is_nestable: true,
    icon: "block-arrow-down",
    preview_field: "trigger_text",
    schema: {
      trigger_text: {
        type: "text",
        pos: 0,
        required: true,
        description: "Toggle button text",
      },
      content: {
        type: "bloks",
        pos: 1,
        description: "Collapsible content",
      },
      default_open: {
        type: "boolean",
        pos: 2,
        default_value: false,
        description: "Start expanded",
      },
      styles: {
        type: "bloks",
        pos: 3,
        description:
          "Layout and sizing per breakpoint (base, sm, md, lg, xl, 2xl)",
        restrict_components: true,
        component_whitelist: ["styles_breakpoint_options"],
      },
    },
  },

  {
    name: "shadcn_progress",
    display_name: "Progress",
    is_root: false,
    is_nestable: true,
    icon: "block-progress",
    schema: {
      value: {
        type: "number",
        pos: 0,
        required: true,
        min_value: 0,
        description: "Current progress value",
      },
      max: {
        type: "number",
        pos: 1,
        default_value: 100,
        min_value: 1,
        description: "Maximum value",
      },
      show_label: {
        type: "boolean",
        pos: 2,
        default_value: false,
        description: "Show percentage label",
      },
      label_position: {
        type: "option",
        pos: 3,
        default_value: "top",
        options: [
          { value: "top", name: "Top" },
          { value: "inside", name: "Inside" },
          { value: "bottom", name: "Bottom" },
        ],
      },
      size: {
        type: "option",
        pos: 4,
        default_value: "md",
        options: [
          { value: "sm", name: "Small" },
          { value: "md", name: "Medium" },
          { value: "lg", name: "Large" },
        ],
      },
      styles: {
        type: "bloks",
        pos: 5,
        description:
          "Layout and sizing per breakpoint (base, sm, md, lg, xl, 2xl)",
        restrict_components: true,
        component_whitelist: ["styles_breakpoint_options"],
      },
    },
  },

  // ============================================
  // FORM ELEMENTS
  // ============================================
  {
    name: "shadcn_form",
    display_name: "Form",
    is_root: false,
    is_nestable: true,
    icon: "block-embed",
    schema: {
      action: {
        type: "text",
        pos: 0,
        description: "Form action URL",
      },
      method: {
        type: "option",
        pos: 1,
        default_value: "post",
        options: [
          { value: "get", name: "GET" },
          { value: "post", name: "POST" },
        ],
      },
      fields: {
        type: "bloks",
        pos: 2,
        description: "Form fields",
      },
      submit_text: {
        type: "text",
        pos: 3,
        default_value: "Submit",
        description: "Submit button text",
      },
      submit_variant: {
        type: "option",
        pos: 4,
        default_value: "default",
        options: buttonVariantOptions.filter((o) => o.value !== "link"),
      },
      layout: {
        type: "option",
        pos: 5,
        default_value: "vertical",
        options: [
          { value: "vertical", name: "Vertical" },
          { value: "horizontal", name: "Horizontal (2 columns)" },
          { value: "inline", name: "Inline" },
        ],
      },
      styles: {
        type: "bloks",
        pos: 6,
        description:
          "Layout and sizing per breakpoint (base, sm, md, lg, xl, 2xl)",
        restrict_components: true,
        component_whitelist: ["styles_breakpoint_options"],
      },
    },
  },

  {
    name: "shadcn_input",
    display_name: "Input",
    is_root: false,
    is_nestable: true,
    icon: "block-text",
    preview_field: "label",
    schema: {
      name: {
        type: "text",
        pos: 0,
        required: true,
        description: "Field name (for form submission)",
      },
      label: {
        type: "text",
        pos: 1,
        description: "Label text",
      },
      placeholder: {
        type: "text",
        pos: 2,
        description: "Placeholder text",
      },
      type: {
        type: "option",
        pos: 3,
        default_value: "text",
        options: [
          { value: "text", name: "Text" },
          { value: "email", name: "Email" },
          { value: "password", name: "Password" },
          { value: "number", name: "Number" },
          { value: "tel", name: "Phone" },
          { value: "url", name: "URL" },
        ],
      },
      required: {
        type: "boolean",
        pos: 4,
        default_value: false,
        description: "Required field",
      },
      disabled: {
        type: "boolean",
        pos: 5,
        default_value: false,
        description: "Disabled field",
      },
      helper_text: {
        type: "text",
        pos: 6,
        description: "Helper text below input",
      },
      styles: {
        type: "bloks",
        pos: 7,
        description:
          "Layout and sizing per breakpoint (base, sm, md, lg, xl, 2xl)",
        restrict_components: true,
        component_whitelist: ["styles_breakpoint_options"],
      },
    },
  },

  {
    name: "shadcn_textarea",
    display_name: "Textarea",
    is_root: false,
    is_nestable: true,
    icon: "block-doc",
    preview_field: "label",
    schema: {
      name: {
        type: "text",
        pos: 0,
        required: true,
        description: "Field name",
      },
      label: {
        type: "text",
        pos: 1,
        description: "Label text",
      },
      placeholder: {
        type: "text",
        pos: 2,
        description: "Placeholder text",
      },
      rows: {
        type: "number",
        pos: 3,
        default_value: 4,
        min_value: 2,
        max_value: 20,
        description: "Number of rows",
      },
      required: {
        type: "boolean",
        pos: 4,
        default_value: false,
      },
      disabled: {
        type: "boolean",
        pos: 5,
        default_value: false,
      },
      helper_text: {
        type: "text",
        pos: 6,
        description: "Helper text",
      },
      styles: {
        type: "bloks",
        pos: 7,
        description:
          "Layout and sizing per breakpoint (base, sm, md, lg, xl, 2xl)",
        restrict_components: true,
        component_whitelist: ["styles_breakpoint_options"],
      },
    },
  },

  {
    name: "shadcn_checkbox",
    display_name: "Checkbox",
    is_root: false,
    is_nestable: true,
    icon: "block-check",
    preview_field: "label",
    schema: {
      name: {
        type: "text",
        pos: 0,
        required: true,
        description: "Field name",
      },
      label: {
        type: "text",
        pos: 1,
        required: true,
        description: "Checkbox label",
      },
      description: {
        type: "text",
        pos: 2,
        description: "Additional description",
      },
      default_checked: {
        type: "boolean",
        pos: 3,
        default_value: false,
        description: "Checked by default",
      },
      disabled: {
        type: "boolean",
        pos: 4,
        default_value: false,
      },
      styles: {
        type: "bloks",
        pos: 5,
        description:
          "Layout and sizing per breakpoint (base, sm, md, lg, xl, 2xl)",
        restrict_components: true,
        component_whitelist: ["styles_breakpoint_options"],
      },
    },
  },

  {
    name: "shadcn_switch",
    display_name: "Switch",
    is_root: false,
    is_nestable: true,
    icon: "block-toggle",
    preview_field: "label",
    schema: {
      name: {
        type: "text",
        pos: 0,
        required: true,
        description: "Field name",
      },
      label: {
        type: "text",
        pos: 1,
        required: true,
        description: "Switch label",
      },
      description: {
        type: "text",
        pos: 2,
        description: "Additional description",
      },
      default_checked: {
        type: "boolean",
        pos: 3,
        default_value: false,
      },
      disabled: {
        type: "boolean",
        pos: 4,
        default_value: false,
      },
      styles: {
        type: "bloks",
        pos: 5,
        description:
          "Layout and sizing per breakpoint (base, sm, md, lg, xl, 2xl)",
        restrict_components: true,
        component_whitelist: ["styles_breakpoint_options"],
      },
    },
  },

  {
    name: "shadcn_radio_group",
    display_name: "Radio Group",
    is_root: false,
    is_nestable: true,
    icon: "block-radio",
    preview_field: "label",
    schema: {
      name: {
        type: "text",
        pos: 0,
        required: true,
        description: "Field name",
      },
      label: {
        type: "text",
        pos: 1,
        description: "Group label",
      },
      options: {
        type: "bloks",
        pos: 2,
        restrict_components: true,
        component_whitelist: ["shadcn_radio_option"],
        description: "Radio options",
      },
      default_value: {
        type: "text",
        pos: 3,
        description: "Default selected value",
      },
      orientation: {
        type: "option",
        pos: 4,
        default_value: "vertical",
        options: orientationOptions,
      },
      styles: {
        type: "bloks",
        pos: 5,
        description:
          "Layout and sizing per breakpoint (base, sm, md, lg, xl, 2xl)",
        restrict_components: true,
        component_whitelist: ["styles_breakpoint_options"],
      },
    },
  },

  {
    name: "shadcn_radio_option",
    display_name: "Radio Option",
    is_root: false,
    is_nestable: true,
    icon: "block-buildin",
    preview_field: "label",
    schema: {
      value: {
        type: "text",
        pos: 0,
        required: true,
        description: "Option value",
      },
      label: {
        type: "text",
        pos: 1,
        required: true,
        description: "Option label",
      },
      description: {
        type: "text",
        pos: 2,
        description: "Option description",
      },
      disabled: {
        type: "boolean",
        pos: 3,
        default_value: false,
      },
      styles: {
        type: "bloks",
        pos: 4,
        description:
          "Layout and sizing per breakpoint (base, sm, md, lg, xl, 2xl)",
        restrict_components: true,
        component_whitelist: ["styles_breakpoint_options"],
      },
    },
  },

  {
    name: "shadcn_select",
    display_name: "Select",
    is_root: false,
    is_nestable: true,
    icon: "block-dropdown",
    preview_field: "label",
    schema: {
      name: {
        type: "text",
        pos: 0,
        required: true,
        description: "Field name",
      },
      label: {
        type: "text",
        pos: 1,
        description: "Label text",
      },
      placeholder: {
        type: "text",
        pos: 2,
        default_value: "Select...",
        description: "Placeholder text",
      },
      options: {
        type: "bloks",
        pos: 3,
        restrict_components: true,
        component_whitelist: ["shadcn_select_option"],
        description: "Select options",
      },
      default_value: {
        type: "text",
        pos: 4,
        description: "Default selected value",
      },
      disabled: {
        type: "boolean",
        pos: 5,
        default_value: false,
      },
      helper_text: {
        type: "text",
        pos: 6,
        description: "Helper text",
      },
      styles: {
        type: "bloks",
        pos: 7,
        description:
          "Layout and sizing per breakpoint (base, sm, md, lg, xl, 2xl)",
        restrict_components: true,
        component_whitelist: ["styles_breakpoint_options"],
      },
    },
  },

  {
    name: "shadcn_select_option",
    display_name: "Select Option",
    is_root: false,
    is_nestable: true,
    icon: "block-buildin",
    preview_field: "label",
    schema: {
      value: {
        type: "text",
        pos: 0,
        required: true,
        description: "Option value",
      },
      label: {
        type: "text",
        pos: 1,
        required: true,
        description: "Option label",
      },
      disabled: {
        type: "boolean",
        pos: 2,
        default_value: false,
      },
      styles: {
        type: "bloks",
        pos: 3,
        description:
          "Layout and sizing per breakpoint (base, sm, md, lg, xl, 2xl)",
        restrict_components: true,
        component_whitelist: ["styles_breakpoint_options"],
      },
    },
  },

  {
    name: "shadcn_slider",
    display_name: "Slider",
    is_root: false,
    is_nestable: true,
    icon: "block-progress",
    preview_field: "label",
    schema: {
      name: {
        type: "text",
        pos: 0,
        required: true,
        description: "Field name",
      },
      label: {
        type: "text",
        pos: 1,
        description: "Label text",
      },
      min: {
        type: "number",
        pos: 2,
        default_value: 0,
        description: "Minimum value",
      },
      max: {
        type: "number",
        pos: 3,
        default_value: 100,
        description: "Maximum value",
      },
      step: {
        type: "number",
        pos: 4,
        default_value: 1,
        min_value: 1,
        description: "Step increment",
      },
      default_value: {
        type: "number",
        pos: 5,
        default_value: 50,
        description: "Default value",
      },
      show_value: {
        type: "boolean",
        pos: 6,
        default_value: true,
        description: "Show current value",
      },
      disabled: {
        type: "boolean",
        pos: 7,
        default_value: false,
      },
      styles: {
        type: "bloks",
        pos: 8,
        description:
          "Layout and sizing per breakpoint (base, sm, md, lg, xl, 2xl)",
        restrict_components: true,
        component_whitelist: ["styles_breakpoint_options"],
      },
    },
  },

  {
    name: "shadcn_table",
    display_name: "Table",
    is_root: false,
    is_nestable: true,
    icon: "block-table",
    schema: {
      caption: {
        type: "text",
        pos: 0,
        description: "Table caption",
      },
      headers: {
        type: "bloks",
        pos: 1,
        restrict_components: true,
        component_whitelist: ["shadcn_table_cell"],
        description: "Header cells",
      },
      rows: {
        type: "bloks",
        pos: 2,
        restrict_components: true,
        component_whitelist: ["shadcn_table_row"],
        description: "Table rows",
      },
      striped: {
        type: "boolean",
        pos: 3,
        default_value: false,
        description: "Striped rows",
      },
      styles: {
        type: "bloks",
        pos: 4,
        description:
          "Layout and sizing per breakpoint (base, sm, md, lg, xl, 2xl)",
        restrict_components: true,
        component_whitelist: ["styles_breakpoint_options"],
      },
    },
  },

  {
    name: "shadcn_table_row",
    display_name: "Table Row",
    is_root: false,
    is_nestable: true,
    icon: "block-buildin",
    schema: {
      cells: {
        type: "bloks",
        pos: 0,
        restrict_components: true,
        component_whitelist: ["shadcn_table_cell"],
        description: "Row cells",
      },
      styles: {
        type: "bloks",
        pos: 1,
        description:
          "Layout and sizing per breakpoint (base, sm, md, lg, xl, 2xl)",
        restrict_components: true,
        component_whitelist: ["styles_breakpoint_options"],
      },
    },
  },

  {
    name: "shadcn_table_cell",
    display_name: "Table Cell",
    is_root: false,
    is_nestable: true,
    icon: "block-buildin",
    preview_field: "content",
    schema: {
      content: {
        type: "text",
        pos: 0,
        required: true,
        description: "Cell content",
      },
      is_header: {
        type: "boolean",
        pos: 1,
        default_value: false,
        description: "Is header cell",
      },
      align: {
        type: "option",
        pos: 2,
        default_value: "left",
        options: alignOptions,
      },
      styles: {
        type: "bloks",
        pos: 3,
        description:
          "Layout and sizing per breakpoint (base, sm, md, lg, xl, 2xl)",
        restrict_components: true,
        component_whitelist: ["styles_breakpoint_options"],
      },
    },
  },

  // ============================================
  // BUILDER METADATA
  // ============================================
  {
    name: "builder_data_mapping",
    display_name: "Builder Data Mapping",
    is_root: false,
    is_nestable: true,
    icon: "block-link",
    schema: {
      builder_section: {
        type: "text",
        pos: 0,
        required: true,
        description:
          "Section context to read from (e.g. 'study', 'statistic')",
      },
      premade_field: {
        type: "text",
        pos: 1,
        required: true,
        description:
          "Field from the premade data to read (e.g. 'quote', 'name')",
      },
      builder_field: {
        type: "text",
        pos: 2,
        required: true,
        description:
          "Component field to write the value to (e.g. 'content', 'image')",
      },
    },
  },

  // ============================================
  // SECTIONS
  // ============================================
  // Premade section blok definitions (case_studies_2_*, blog7_*, etc.)
  // are now auto-derived from the section builder templates on publish.
  // See: apps/gateway/src/lib/derive-premade-schemas.ts
  // They are managed via the webhook and storyblok:migrate:data-mapping script.
];

for (const definition of coLocatedComponentDefinitions) {
  if (!componentDefinitions.some((item) => item.name === definition.name)) {
    throw new Error(
      `Missing co-located component definition in aggregate list: ${definition.name}`,
    );
  }
}

// Export component names for easy reference
export const componentNames = componentDefinitions.map((c) => c.name);

// Export count for verification
export const componentCount = componentDefinitions.length;
