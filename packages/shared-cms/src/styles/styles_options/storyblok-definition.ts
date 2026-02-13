import {
  alignMap,
  borderClassLabels,
  borderClassMap,
  borderColorMap,
  borderStyleMap,
  boxShadowMap,
  directionMap,
  displayMap,
  flexShrinkMap,
  gapMap,
  gridColumnsMap,
  heightMap,
  justifyMap,
  marginMap,
  maxHeightMap,
  maxWidthMap,
  minHeightMap,
  minWidthMap,
  namedSizeToPx,
  paddingMap,
  positionMap,
  roundedMap,
  spacingTokenToPx,
  textColorMap,
  textSizeToPx,
  topMap,
  variantMap,
  widthMap,
} from "../maps";
import type {
  StoryblokComponent,
  StoryblokField,
  StoryblokOption,
} from "../../storyblok-seed/types";

const STYLES_BLOCK_FIELD_DESCRIPTION =
  "Layout and sizing per breakpoint (base, sm, md, lg, xl, 2xl). Gap, padding, margin, and sizing options show pixel values.";

export const STYLES_OPTIONS_WHITELIST_COMPONENT = "styles_breakpoint_options";

export function createStylesBlokField(
  pos: number,
  description = STYLES_BLOCK_FIELD_DESCRIPTION,
): StoryblokField {
  return {
    type: "bloks",
    pos,
    description,
    restrict_components: true,
    component_whitelist: [STYLES_OPTIONS_WHITELIST_COMPONENT],
  };
}

function optionNameWithSpacingPx(key: string): string {
  const token = String(key).split("-").pop() ?? "";
  const px = spacingTokenToPx[token];
  if (px) return `${key} (${px})`;

  const suffixMatch = key.match(/^(?:max-w|min-w|max-h|min-h|w|h)-(.+)$/);
  if (suffixMatch) {
    const namedPx = namedSizeToPx[suffixMatch[1]!];
    if (namedPx) return `${key} (${namedPx})`;
  }

  return key;
}

const flexDisplayOptions: StoryblokOption[] = (
  Object.keys(displayMap) as (keyof typeof displayMap)[]
).map((key) => ({ value: key, name: key }));

const flexPositionOptions: StoryblokOption[] = (
  Object.keys(positionMap) as (keyof typeof positionMap)[]
).map((key) => ({ value: key, name: key }));

const flexTopOptions: StoryblokOption[] = (
  Object.keys(topMap) as (keyof typeof topMap)[]
).map((key) => ({ value: key, name: optionNameWithSpacingPx(key) }));

const flexGridColumnsOptions: StoryblokOption[] = (
  Object.keys(gridColumnsMap) as (keyof typeof gridColumnsMap)[]
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

const flexShrinkOptions: StoryblokOption[] = (
  Object.keys(flexShrinkMap) as (keyof typeof flexShrinkMap)[]
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

const textColorLabels: Record<keyof typeof textColorMap, string> = {
  "text-foreground": "Foreground",
  "text-muted-foreground": "Muted Foreground",
  "text-primary": "Primary",
  "text-primary-foreground": "Primary Foreground",
  "text-secondary": "Secondary",
  "text-secondary-foreground": "Secondary Foreground",
  "text-accent": "Accent",
  "text-accent-foreground": "Accent Foreground",
  "text-destructive": "Destructive",
  "text-destructive-foreground": "Destructive Foreground",
  "text-card-foreground": "Card Foreground",
  "text-popover-foreground": "Popover Foreground",
  "text-black": "Black",
  "text-white": "White",
};

const flexTextColorOptions: StoryblokOption[] = (
  Object.keys(textColorMap) as (keyof typeof textColorMap)[]
).map((key) => ({
  value: key,
  name: textColorLabels[key],
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

const roundedLabels: Record<keyof typeof roundedMap, string> = {
  "rounded-none": "None",
  "rounded-sm": "SM",
  rounded: "Default",
  "rounded-md": "MD",
  "rounded-lg": "LG",
  "rounded-xl": "XL",
  "rounded-2xl": "2XL",
  "rounded-3xl": "3XL",
  "rounded-full": "Full",
};

const flexRoundedOptions: StoryblokOption[] = (
  Object.keys(roundedMap) as (keyof typeof roundedMap)[]
).map((key) => ({
  value: key,
  name: roundedLabels[key],
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
  active: "Active",
  disabled: "Disabled",
  visited: "Visited",
  focus: "Focus",
  focus_visible: "Focus visible",
  group_hover: "Group hover",
  group_focus: "Group focus",
  group_active: "Group active",
  group_disabled: "Group disabled",
  group_visited: "Group visited",
};

const flexVariantOptions: StoryblokOption[] = (
  Object.keys(variantMap) as (keyof typeof variantMap)[]
).map((key) => ({ value: key, name: variantOptionLabels[key] }));

export const textSizeOptionsWithPx: StoryblokOption[] = (
  Object.keys(textSizeToPx) as (keyof typeof textSizeToPx)[]
).map((key) => {
  const px = textSizeToPx[key];
  const label =
    key === "base"
      ? "Base"
      : key
          .replace(/(\d*)xl$/i, "$1XL")
          .replace(/^[a-z]+$/, (value) => value.toUpperCase());
  return { value: key, name: `${label} (${px})` };
});

export const stylesOptionsStoryblokDefinition: StoryblokComponent = {
  name: "styles_options",
  display_name: "Styles Options",
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
        "Add 'group' class on container so children can use group-* variants (group-hover, group-focus, etc.).",
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
    position: {
      type: "option",
      pos: 1.2,
      options: flexPositionOptions,
      description:
        "Position utility (e.g. sticky). Combine with Top for sticky offsets.",
    },
    top: {
      type: "option",
      pos: 1.3,
      options: flexTopOptions,
      description:
        "Top inset utility (e.g. top-10). Useful with position: sticky/fixed/absolute.",
    },
    grid_columns: {
      type: "option",
      pos: 1.5,
      options: flexGridColumnsOptions,
      description:
        "Grid template columns (e.g. grid-cols-2). Use with display = grid or components that already render as grid.",
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
    flex_shrink: {
      type: "option",
      pos: 4.5,
      options: flexShrinkOptions,
      description:
        "Flex shrink behavior (shrink to allow shrinking, shrink-0 to prevent shrinking).",
    },
    gap: {
      type: "options",
      pos: 5,
      options: flexGapOptions,
      max_choices: 4,
      description:
        "Spacing between items: pick 0–4 gap utilities (e.g. gap-4, gap-x-6, gap-y-2). Options show pixel values.",
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
    custom_max_height: {
      type: "text",
      pos: 13.5,
      description:
        "Arbitrary max-height (e.g. 524px, 33rem). Overrides the Max Height dropdown. Only applies at the base breakpoint — responsive breakpoints are ignored for this field.",
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
    border_color_light: {
      type: "option",
      pos: 16,
      options: flexBorderColorOptions,
      description: "Border color in light theme (semantic).",
    },
    border_color_dark: {
      type: "option",
      pos: 16.5,
      options: flexBorderColorOptions,
      description: "Border color in dark theme (semantic).",
    },
    border_color_light_custom: {
      type: "custom",
      pos: 16.75,
      default_value: "",
      description:
        "Border color in light theme (custom). Overrides semantic light border color when set.",
      field_type: "native-color-picker",
    },
    border_color_dark_custom: {
      type: "custom",
      pos: 17,
      default_value: "",
      description:
        "Border color in dark theme (custom). Overrides semantic dark border color when set.",
      field_type: "native-color-picker",
    },
    border_style: {
      type: "option",
      pos: 18,
      options: flexBorderStyleOptions,
      description: "Border style (solid, dashed, dotted, etc.).",
    },
    shadow: {
      type: "option",
      pos: 19,
      options: flexShadowOptions,
      description: "Box shadow (Tailwind scale).",
    },
    rounded: {
      type: "option",
      pos: 19.5,
      options: flexRoundedOptions,
      description: "Border radius (Tailwind rounded scale).",
    },
    text_size: {
      type: "option",
      pos: 20,
      options: textSizeOptionsWithPx,
      description:
        "Text size (font-size) per breakpoint. Options show px (e.g. Base (16px)).",
    },
    text_color_light: {
      type: "option",
      pos: 20.2,
      options: flexTextColorOptions,
      description: "Text color in light theme (semantic).",
    },
    text_color_dark: {
      type: "option",
      pos: 20.3,
      options: flexTextColorOptions,
      description: "Text color in dark theme (semantic).",
    },
    text_color_light_custom: {
      type: "custom",
      pos: 20.4,
      default_value: "",
      description:
        "Text color in light theme (custom). Overrides semantic light text color when set.",
      field_type: "native-color-picker",
    },
    text_color_dark_custom: {
      type: "custom",
      pos: 20.5,
      default_value: "",
      description:
        "Text color in dark theme (custom). Overrides semantic dark text color when set.",
      field_type: "native-color-picker",
    },
  },
};
