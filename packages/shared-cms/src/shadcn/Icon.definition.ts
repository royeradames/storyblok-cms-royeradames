import { icons as lucideIcons } from "lucide-react";
import { createStylesBlokField } from "../styles/styles_options";
import type { StoryblokComponent, StoryblokOption } from "../storyblok-seed/types";

function toKebabCase(name: string): string {
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

const lucideIconNameOptions: StoryblokOption[] = Object.keys(lucideIcons)
  .map(toKebabCase)
  .sort()
  .map((name) => ({ value: name, name }));

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

export const shadcnIconDefinition = {
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
      description: "Icon size (xs -> 4xl)",
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
    styles: createStylesBlokField(6, "Layout and sizing per breakpoint (base, sm, md, lg, xl, 2xl)"),
  },
} satisfies StoryblokComponent;
