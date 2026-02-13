export type StoryblokFieldType =
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

export interface StoryblokOption {
  value: string;
  name: string;
}

export interface StoryblokField {
  type: StoryblokFieldType;
  pos?: number;
  required?: boolean;
  default_value?: string | number | boolean;
  options?: StoryblokOption[];
  max_choices?: number;
  restrict_type?: string;
  restrict_components?: boolean;
  component_whitelist?: string[];
  allow_target_blank?: boolean;
  filetypes?: string[];
  min_value?: number;
  max_value?: number;
  field_type?: string;
  description?: string;
}

export interface StoryblokComponentSchema {
  [fieldName: string]: StoryblokField;
}

export interface StoryblokComponent {
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
