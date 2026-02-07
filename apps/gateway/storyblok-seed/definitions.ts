/**
 * Gateway app-specific Storyblok component definitions.
 * These are pushed without a prefix (e.g. "page").
 * Shared components from @repo/shared-cms are pushed with "shared_" prefix.
 */

export interface StoryblokField {
  type: string;
  pos?: number;
  required?: boolean;
  default_value?: string | number | boolean;
  description?: string;
  options?: { value: string; name: string }[];
  restrict_components?: boolean;
  component_whitelist?: string[];
  /** Plugin field type (e.g. "seo_metatags", "native-color-picker"). */
  field_type?: string;
}

export interface StoryblokComponentSchema {
  [fieldName: string]: StoryblokField;
}

export interface StoryblokComponentDef {
  name: string;
  display_name: string;
  is_root?: boolean;
  is_nestable?: boolean;
  schema: StoryblokComponentSchema;
  icon?: string;
}

/**
 * Initial whitelist for the page body field.
 * Only `shared_shadcn_container` is included by default.
 * Premade section root bloks (e.g. `shared_case_studies_2_section`) are
 * added dynamically by the webhook when a section builder page is published.
 */
export const PAGE_BODY_INITIAL_WHITELIST = ["shared_shadcn_container"];

export const gatewayComponentDefinitions: StoryblokComponentDef[] = [
  {
    name: "page",
    display_name: "Page",
    is_root: true,
    is_nestable: false,
    icon: "block-file",
    schema: {
      body: {
        type: "bloks",
        pos: 0,
        description:
          "Page content blocks (containers + premade section roots)",
        restrict_components: true,
        component_whitelist: PAGE_BODY_INITIAL_WHITELIST,
      },
      styles: {
        type: "bloks",
        pos: 1,
        description:
          "Layout and sizing per breakpoint (base, sm, md, lg, xl, 2xl)",
        restrict_components: true,
        component_whitelist: ["shared_styles_breakpoint_options"],
      },
      metadata: {
        type: "custom",
        pos: 2,
        description: "SEO and social meta tags",
        field_type: "seo-metatags",
      },
    },
  },
];
