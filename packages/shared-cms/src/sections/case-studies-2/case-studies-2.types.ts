import type { StylesBreakpointOptionsBlok } from "../../styles";

/** Storyblok asset shape for image/logo fields (image block). */
export type StoryblokImageAsset = {
  id: string;
  name: string;
  title: string;
  source: string;
  copyright: string;
  fieldtype: string;
  meta_data: Record<string, any>;
  is_external_url: boolean;
  filename: string;
  alt?: string;
  focus?: string;
};

/** Component name for this section blok. Single source of truth so renames propagate. */
export const CASE_STUDIES_2_ROOT = "case_studies_2_section" as const;

/** Gateway (and other apps) register with shared_ prefix. */
export const CASE_STUDIES_2_SECTION_COMPONENT_GATEWAY =
  "shared_case_studies_2_section" as const;

export type StatisticInput = {
  headline_number: string;
  what_it_measures: string;
  source_or_context: string;
  _uid: string;
};

export type StudyInput = {
  image: StoryblokImageAsset;
  quote: string;
  name: string;
  position: string;
  company_logo: StoryblokImageAsset;
  statistics: StatisticInput[];
  _uid: string;
};

export type CaseStudies2SectionInput = {
  description: string;
  name: string;
  studies: StudyInput[];
};
export type DataFieldsEntry = {
  premade_field: string;
  premade_section: string;
  builder_field: string;
};

export type CaseStudies2Blok = CaseStudies2SectionInput & {
  data_sections: string[];
  data_fields: DataFieldsEntry[];
  _uid: string;
  /** Unprefixed (shared-cms) or prefixed (e.g. gateway: shared_case_studies_2_section). */
  component:
    | typeof CASE_STUDIES_2_ROOT
    | typeof CASE_STUDIES_2_SECTION_COMPONENT_GATEWAY;
};
