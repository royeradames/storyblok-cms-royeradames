import { createStylesBlokField } from "../styles/styles_options";
import type { StoryblokComponent } from "../storyblok-seed/types";

export const shadcnSectionDefinition = {
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
    styles: createStylesBlokField(5, "Layout and sizing per breakpoint (base, sm, md, lg, xl, 2xl)"),
  },
} satisfies StoryblokComponent;
