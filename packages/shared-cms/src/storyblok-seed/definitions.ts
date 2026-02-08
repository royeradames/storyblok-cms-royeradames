/**
 * Storyblok Component Definitions
 *
 * This file defines the schema for all CMS components to seed Storyblok.
 * These definitions match the TypeScript interfaces in the wrapper components.
 *
 * Run `bun run storyblok:seed` to push these to your Storyblok space.
 */

import {
  displayMap,
  directionMap,
  justifyMap,
  alignMap,
  gapMap,
  widthMap,
  heightMap,
  minWidthMap,
  maxWidthMap,
  minHeightMap,
  maxHeightMap,
  paddingMap,
  marginMap,
  borderClassMap,
  borderClassLabels,
  borderColorMap,
  borderStyleMap,
  boxShadowMap,
  spacingTokenToPx,
  namedSizeToPx,
  textSizeToPx,
  variantMap,
} from "../shadcn/flex/maps";
import { icons as lucideIcons } from "lucide-react";

/**
 * Option name with px suffix for Storyblok dropdown labels.
 * Resolves spacing tokens first (e.g. "gap-2" → "gap-2 (8px)"),
 * then named sizes (e.g. "max-w-lg" → "max-w-lg (512px)").
 */
function optionNameWithSpacingPx(key: string): string {
  // 1. Try spacing token (last segment after -)
  const token = String(key).split("-").pop() ?? "";
  const px = spacingTokenToPx[token];
  if (px) return `${key} (${px})`;

  // 2. Try named size suffix (everything after property prefix)
  // Handles: max-w-lg → lg, max-w-screen-sm → screen-sm, etc.
  const suffixMatch = key.match(/^(?:max-w|min-w|max-h|min-h|w|h)-(.+)$/);
  if (suffixMatch) {
    const namedPx = namedSizeToPx[suffixMatch[1]!];
    if (namedPx) return `${key} (${namedPx})`;
  }

  return key;
}

// Helper types for Storyblok field definitions
type StoryblokFieldType =
  | "text"
  | "textarea"
  | "richtext"
  | "number"
  | "boolean"
  | "option"
  | "options"
  | "asset"
  | "multiasset"
  | "multilink"
  | "bloks"
  | "table"
  | "custom";

interface StoryblokOption {
  value: string;
  name: string;
}

interface StoryblokField {
  type: StoryblokFieldType;
  pos?: number;
  required?: boolean;
  default_value?: string | number | boolean;
  options?: StoryblokOption[];
  // For options (multi-select) field type
  max_choices?: number;
  // For bloks field type
  restrict_type?: string;
  restrict_components?: boolean;
  component_whitelist?: string[];
  // For multilink
  allow_target_blank?: boolean;
  // For asset
  filetypes?: string[];
  // For number
  min_value?: number;
  max_value?: number;
  // For custom/plugin field type (e.g. color picker)
  field_type?: string;
  // Description for editors
  description?: string;
}

interface StoryblokComponentSchema {
  [fieldName: string]: StoryblokField;
}

interface StoryblokComponent {
  name: string;
  display_name: string;
  is_root?: boolean;
  is_nestable?: boolean;
  schema: StoryblokComponentSchema;
  preview_field?: string;
  preview_tmpl?: string;
  color?: string;
  icon?: string;
}

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

const iconSizeOptions: StoryblokOption[] = [
  { value: "xs", name: "XS" },
  { value: "sm", name: "SM" },
  { value: "default", name: "Default" },
  { value: "lg", name: "LG" },
  { value: "xl", name: "XL" },
  { value: "2xl", name: "2XL" },
  { value: "3xl", name: "3XL" },
  { value: "4xl", name: "4XL" },
];

/** Convert PascalCase icon name to kebab-case (e.g. "AlarmClock" → "alarm-clock"). */
function toKebabCase(name: string): string {
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

/** All Lucide icon names as kebab-case Storyblok options (auto-generated). */
const lucideIconNameOptions: StoryblokOption[] = Object.keys(lucideIcons)
  .map(toKebabCase)
  .sort()
  .map((name) => ({ value: name, name }));

const gapOptions: StoryblokOption[] = [
  { value: "none", name: "None" },
  { value: "sm", name: "Small" },
  { value: "md", name: "Medium" },
  { value: "lg", name: "Large" },
];

// Flex: Tailwind class options (value = name = class)
const flexDisplayOptions: StoryblokOption[] = (
  Object.keys(displayMap) as (keyof typeof displayMap)[]
).map((key) => ({ value: key, name: key }));

const flexDirectionOptions: StoryblokOption[] = (
  Object.keys(directionMap) as (keyof typeof directionMap)[]
).map((key) => ({ value: key, name: key }));

const flexJustifyOptions: StoryblokOption[] = (
  Object.keys(justifyMap) as (keyof typeof justifyMap)[]
).map((key) => ({ value: key, name: key }));

const flexAlignOptions: StoryblokOption[] = (
  Object.keys(alignMap) as (keyof typeof alignMap)[]
).map((key) => ({ value: key, name: key }));

const flexGapOptions: StoryblokOption[] = (
  Object.keys(gapMap) as (keyof typeof gapMap)[]
).map((key) => ({ value: key, name: optionNameWithSpacingPx(key) }));

const flexWidthOptions: StoryblokOption[] = (
  Object.keys(widthMap) as (keyof typeof widthMap)[]
).map((key) => ({ value: key, name: optionNameWithSpacingPx(key) }));

const flexHeightOptions: StoryblokOption[] = (
  Object.keys(heightMap) as (keyof typeof heightMap)[]
).map((key) => ({ value: key, name: optionNameWithSpacingPx(key) }));

const flexMinWidthOptions: StoryblokOption[] = (
  Object.keys(minWidthMap) as (keyof typeof minWidthMap)[]
).map((key) => ({ value: key, name: optionNameWithSpacingPx(key) }));

const flexMaxWidthOptions: StoryblokOption[] = (
  Object.keys(maxWidthMap) as (keyof typeof maxWidthMap)[]
).map((key) => ({ value: key, name: optionNameWithSpacingPx(key) }));

const flexMinHeightOptions: StoryblokOption[] = (
  Object.keys(minHeightMap) as (keyof typeof minHeightMap)[]
).map((key) => ({ value: key, name: optionNameWithSpacingPx(key) }));

const flexMaxHeightOptions: StoryblokOption[] = (
  Object.keys(maxHeightMap) as (keyof typeof maxHeightMap)[]
).map((key) => ({ value: key, name: optionNameWithSpacingPx(key) }));

const flexPaddingOptions: StoryblokOption[] = (
  Object.keys(paddingMap) as (keyof typeof paddingMap)[]
).map((key) => ({
  value: String(key),
  name: optionNameWithSpacingPx(String(key)),
}));

const flexMarginOptions: StoryblokOption[] = (
  Object.keys(marginMap) as (keyof typeof marginMap)[]
).map((key) => ({
  value: String(key),
  name: optionNameWithSpacingPx(String(key)),
}));

const flexBorderOptions: StoryblokOption[] = (
  Object.keys(borderClassMap) as (keyof typeof borderClassMap)[]
).map((key) => ({
  value: key,
  name: borderClassLabels[key],
}));

const borderColorLabels: Record<keyof typeof borderColorMap, string> = {
  "border-border": "Default",
  "border-input": "Input",
  "border-primary": "Primary",
  "border-muted": "Muted",
  "border-destructive": "Destructive",
  "border-foreground": "Foreground",
};

const flexBorderColorOptions: StoryblokOption[] = (
  Object.keys(borderColorMap) as (keyof typeof borderColorMap)[]
).map((key) => ({
  value: key,
  name: borderColorLabels[key],
}));

const borderStyleLabels: Record<keyof typeof borderStyleMap, string> = {
  "border-solid": "Solid",
  "border-dashed": "Dashed",
  "border-dotted": "Dotted",
  "border-double": "Double",
  "border-none": "None",
};

const flexBorderStyleOptions: StoryblokOption[] = (
  Object.keys(borderStyleMap) as (keyof typeof borderStyleMap)[]
).map((key) => ({
  value: key,
  name: borderStyleLabels[key],
}));

const boxShadowLabels: Record<keyof typeof boxShadowMap, string> = {
  "shadow-none": "None",
  "shadow-sm": "SM",
  shadow: "Default",
  "shadow-md": "MD",
  "shadow-lg": "LG",
  "shadow-xl": "XL",
  "shadow-2xl": "2XL",
  "shadow-inner": "Inner",
};

const flexShadowOptions: StoryblokOption[] = (
  Object.keys(boxShadowMap) as (keyof typeof boxShadowMap)[]
).map((key) => ({
  value: key,
  name: boxShadowLabels[key],
}));

const flexBreakpointOptions: StoryblokOption[] = [
  { value: "base", name: "Base" },
  { value: "sm", name: "SM (640px)" },
  { value: "md", name: "MD (768px)" },
  { value: "lg", name: "LG (1024px)" },
  { value: "xl", name: "XL (1280px)" },
  { value: "2xl", name: "2XL (1536px)" },
];

const variantOptionLabels: Record<keyof typeof variantMap, string> = {
  none: "None",
  last: "Last",
  first: "First",
  only: "Only",
  odd: "Odd",
  even: "Even",
  hover: "Hover",
  focus: "Focus",
  focus_visible: "Focus visible",
  group_hover: "Group hover",
  group_focus: "Group focus",
};
const flexVariantOptions: StoryblokOption[] = (
  Object.keys(variantMap) as (keyof typeof variantMap)[]
).map((key) => ({ value: key, name: variantOptionLabels[key] }));

/** Text size options with px in label (e.g. "XS (12px)", "Base (16px)", "2XL (24px)"). */
const textSizeOptionsWithPx: StoryblokOption[] = (
  Object.keys(textSizeToPx) as (keyof typeof textSizeToPx)[]
).map((key) => {
  const px = textSizeToPx[key];
  const label =
    key === "base"
      ? "Base"
      : key
          .replace(/(\d*)xl$/i, "$1XL")
          .replace(/^[a-z]+$/, (m) => m.toUpperCase());
  return { value: key, name: `${label} (${px})` };
});

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
  {
    name: "shadcn_section",
    display_name: "Section",
    is_root: false,
    is_nestable: true,
    icon: "block-wallet",
    schema: {
      content: {
        type: "bloks",
        pos: 0,
        description: "Content blocks inside this section",
      },
      padding: {
        type: "option",
        pos: 1,
        default_value: "md",
        options: [
          { value: "none", name: "None" },
          { value: "sm", name: "Small" },
          { value: "md", name: "Medium" },
          { value: "lg", name: "Large" },
          { value: "xl", name: "Extra Large" },
        ],
      },
      background: {
        type: "option",
        pos: 2,
        default_value: "default",
        options: [
          { value: "default", name: "Default" },
          { value: "muted", name: "Muted" },
          { value: "primary", name: "Primary" },
          { value: "secondary", name: "Secondary" },
        ],
      },
      max_width: {
        type: "option",
        pos: 3,
        default_value: "xl",
        options: [
          { value: "sm", name: "Small" },
          { value: "md", name: "Medium" },
          { value: "lg", name: "Large" },
          { value: "xl", name: "Extra Large" },
          { value: "full", name: "Full Width" },
        ],
      },
      id: {
        type: "text",
        pos: 4,
        description: "HTML ID for anchor links",
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
    name: "shadcn_grid",
    display_name: "Grid",
    is_root: false,
    is_nestable: true,
    icon: "block-table",
    schema: {
      items: {
        type: "bloks",
        pos: 0,
        description: "Items to display in the grid",
      },
      columns: {
        type: "option",
        pos: 1,
        default_value: "3",
        options: [
          { value: "1", name: "1 Column" },
          { value: "2", name: "2 Columns" },
          { value: "3", name: "3 Columns" },
          { value: "4", name: "4 Columns" },
          { value: "5", name: "5 Columns" },
          { value: "6", name: "6 Columns" },
        ],
      },
      columns_mobile: {
        type: "option",
        pos: 2,
        default_value: "1",
        options: [
          { value: "1", name: "1 Column" },
          { value: "2", name: "2 Columns" },
        ],
      },
      gap: {
        type: "option",
        pos: 3,
        default_value: "md",
        options: gapOptions,
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
    name: "styles_breakpoint_options",
    display_name: "Styles Breakpoint Options",
    is_root: false,
    is_nestable: false,
    schema: {
      breakpoint: {
        type: "option",
        pos: 0,
        default_value: "base",
        options: flexBreakpointOptions,
        description: "Tailwind breakpoint (base = no prefix)",
      },
      variant: {
        type: "option",
        pos: 0.5,
        default_value: "none",
        options: flexVariantOptions,
        description:
          "Tailwind variant: prefix for all utilities in this block (e.g. last:, hover:)",
      },
      group: {
        type: "boolean",
        pos: 0.6,
        default_value: false,
        description:
          "Add 'group' class on container so children can use group-hover:, group-focus:",
      },
      padding: {
        type: "options",
        pos: 13,
        options: flexPaddingOptions,
        max_choices: 4,
        description:
          "Box model: pick 0–4 padding directions. Options show pixel values (e.g. p-4 (16px), pb-6 (24px)).",
      },
      display: {
        type: "option",
        pos: 1,
        options: flexDisplayOptions,
        description:
          "Display (opt-in, no default). Only applied when set. Container always uses flex in code.",
      },
      direction: {
        type: "option",
        pos: 2,
        options: flexDirectionOptions,
        description:
          "Only applied when set (opt-in). Container uses its own defaults when empty.",
      },
      justify: {
        type: "option",
        pos: 3,
        options: flexJustifyOptions,
        description:
          "Only applied when set (opt-in). Container uses its own defaults when empty.",
      },
      align: {
        type: "option",
        pos: 4,
        options: flexAlignOptions,
        description:
          "Only applied when set (opt-in). Container uses its own defaults when empty.",
      },
      gap: {
        type: "option",
        pos: 5,
        options: flexGapOptions,
        description:
          "Gap between items. Options show pixel values (e.g. gap-2 (8px)).",
      },
      wrap: {
        type: "boolean",
        pos: 6,
        default_value: false,
        description: "Allow items to wrap to next line",
      },
      width: {
        type: "option",
        pos: 7,
        options: flexWidthOptions,
      },
      height: {
        type: "option",
        pos: 8,
        options: flexHeightOptions,
      },
      min_width: {
        type: "option",
        pos: 9,
        options: flexMinWidthOptions,
      },
      max_width: {
        type: "option",
        pos: 10,
        options: flexMaxWidthOptions,
      },
      custom_max_width: {
        type: "text",
        pos: 11,
        description:
          "Arbitrary max-width (e.g. 524px, 33rem). Overrides the Max Width dropdown. Only applies at the base breakpoint — responsive breakpoints are ignored for this field.",
      },
      min_height: {
        type: "option",
        pos: 12,
        options: flexMinHeightOptions,
      },
      max_height: {
        type: "option",
        pos: 13,
        options: flexMaxHeightOptions,
      },
      margin: {
        type: "options",
        pos: 14,
        options: flexMarginOptions,
        max_choices: 4,
        description:
          "Box model: pick 0–4 margin directions. Options show pixel values (e.g. mt-4 (16px)); mx-auto has no px.",
      },
      border: {
        type: "options",
        pos: 15,
        options: flexBorderOptions,
        max_choices: 20,
        description:
          "Border width (multi-select). All Tailwind border-* utilities: sides (All, Top, Right, Bottom, Left, X, Y, Start, End) × 0/1/2/4/8px. Use search to filter.",
      },
      border_color: {
        type: "option",
        pos: 16,
        options: flexBorderColorOptions,
        description: "Border color (semantic).",
      },
      border_style: {
        type: "option",
        pos: 17,
        options: flexBorderStyleOptions,
        description: "Border style (solid, dashed, dotted, etc.).",
      },
      shadow: {
        type: "option",
        pos: 18,
        options: flexShadowOptions,
        description: "Box shadow (Tailwind scale).",
      },
      text_size: {
        type: "option",
        pos: 19,
        options: textSizeOptionsWithPx,
        description:
          "Text size (font-size) per breakpoint. Options show px (e.g. Base (16px)).",
      },
    },
  },

  {
    name: "shadcn_container",
    display_name: "Container",
    is_root: false,
    is_nestable: true,
    icon: "block-arrow-pointer",
    schema: {
      name: {
        type: "text",
        pos: 0,
        description:
          "Sets data-name attribute on the container (e.g. for testing or hooks)",
      },
      container_as: {
        type: "option",
        pos: 1,
        default_value: "div",
        options: [
          { value: "div", name: "Div" },
          { value: "section", name: "Section" },
          { value: "article", name: "Article" },
          { value: "aside", name: "Aside" },
          { value: "nav", name: "Nav" },
          { value: "header", name: "Header" },
          { value: "hgroup", name: "Heading group" },
          { value: "ul", name: "Unordered list" },
          { value: "ol", name: "Ordered list" },
          { value: "li", name: "List item" },
        ],
        description: "HTML wrapper element",
      },
      items: {
        type: "bloks",
        pos: 2,
        description: "Items in the container",
      },
      styles: {
        type: "bloks",
        pos: 3,
        description:
          "Layout and sizing per breakpoint (base, sm, md, lg, xl, 2xl). Gap, padding, margin, and sizing options show pixel values.",
        restrict_components: true,
        component_whitelist: ["styles_breakpoint_options"],
      },
      data_section_name: {
        type: "text",
        pos: 0,
        description:
          "Section builder: marks this container as a section boundary for cloning repeatable items (e.g. 'case_studies_2_study')",
      },
    },
  },

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
      line_height: {
        type: "option",
        pos: 8,
        default_value: "normal",
        options: lineHeightOptions,
        description: "Line height",
      },
      letter_spacing: {
        type: "option",
        pos: 9,
        default_value: "normal",
        options: letterSpacingOptions,
        description: "Letter spacing",
      },
      sr_only: {
        type: "boolean",
        pos: 9.5,
        default_value: false,
        description:
          "Screen-reader only. Visually hides the text but keeps it accessible (e.g. descriptive link text for icon-only buttons).",
      },
      styles: {
        type: "bloks",
        pos: 10,
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

  {
    name: "shadcn_icon",
    display_name: "Icon",
    is_root: false,
    is_nestable: true,
    icon: "block-image",
    preview_field: "name",
    schema: {
      name: {
        type: "option",
        pos: 0,
        required: true,
        options: lucideIconNameOptions,
        description: "Lucide icon name. Use search to filter.",
      },
      size: {
        type: "option",
        pos: 1,
        options: iconSizeOptions,
        default_value: "default",
        description: "Icon size (xs → 4xl)",
      },
      color_light: {
        type: "custom",
        pos: 2,
        default_value: "",
        description: "Icon color in light theme. Overrides default when set.",
        field_type: "native-color-picker",
      },
      color_dark: {
        type: "custom",
        pos: 3,
        default_value: "",
        description: "Icon color in dark theme. Overrides default when set.",
        field_type: "native-color-picker",
      },
      stroke_width: {
        type: "number",
        pos: 4,
        description: "Stroke width",
      },
      class_name: {
        type: "text",
        pos: 5,
        description: "Optional CSS class (e.g. Tailwind)",
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
      items: {
        type: "bloks",
        pos: 0,
        restrict_components: true,
        component_whitelist: ["shadcn_breadcrumb_item"],
        description: "Breadcrumb items",
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
    name: "shadcn_breadcrumb_item",
    display_name: "Breadcrumb Item",
    is_root: false,
    is_nestable: true,
    icon: "block-buildin",
    preview_field: "label",
    schema: {
      label: {
        type: "text",
        pos: 0,
        required: true,
        description: "Item label",
      },
      href: {
        type: "text",
        pos: 1,
        description: "Link URL (empty for current page)",
      },
      is_current: {
        type: "boolean",
        pos: 2,
        default_value: false,
        description: "Is this the current page?",
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
          "shadcn_richtext",
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
          "shadcn_richtext",
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
          "shadcn_richtext",
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

// Export component names for easy reference
export const componentNames = componentDefinitions.map((c) => c.name);

// Export count for verification
export const componentCount = componentDefinitions.length;
