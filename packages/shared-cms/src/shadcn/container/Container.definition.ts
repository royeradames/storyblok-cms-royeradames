import { createStylesBlokField } from "../../styles/styles_options";
import type { StoryblokComponent } from "../../storyblok-seed/types";

export const shadcnContainerDefinition = {
  name: "shadcn_container",
  display_name: "Container",
  is_root: false,
  is_nestable: true,
  icon: "block-arrow-pointer",
  schema: {
    name: {
      type: "text",
      pos: 0,
      description: "Sets data-name attribute on the container (e.g. for testing or hooks)",
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
    styles: createStylesBlokField(
      3,
      "Layout and sizing per breakpoint (base, sm, md, lg, xl, 2xl). Gap, padding, margin, and sizing options show pixel values.",
    ),
    data_section_name: {
      type: "text",
      pos: 0,
      description:
        "Section builder: marks this container as a section boundary for cloning repeatable items (e.g. 'case_studies_2_study')",
    },
  },
} satisfies StoryblokComponent;
