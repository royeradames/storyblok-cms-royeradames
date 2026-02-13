import { createStylesBlokField } from "../styles/styles_options";
import type { StoryblokComponent, StoryblokOption } from "../storyblok-seed/types";

const gapOptions: StoryblokOption[] = [
  { value: "none", name: "None" },
  { value: "sm", name: "Small" },
  { value: "md", name: "Medium" },
  { value: "lg", name: "Large" },
];

export const shadcnGridDefinition = {
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
    styles: createStylesBlokField(4, "Layout and sizing per breakpoint (base, sm, md, lg, xl, 2xl)"),
  },
} satisfies StoryblokComponent;
