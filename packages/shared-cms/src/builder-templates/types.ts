export type BuilderTemplateJson = Record<string, unknown>;
export type BuilderCompiledTemplateJson = Record<string, unknown>;

export type BuilderTemplateNodePath = string;

export type BuilderCompiledInjectionOperation = {
  nodePath: BuilderTemplateNodePath;
  sectionName: string;
  premadeField: string;
  builderField: string;
};

export type BuilderCompiledRepeaterMode = "self_clone" | "wrapper_children";

export type BuilderCompiledRepeater = {
  nodePath: BuilderTemplateNodePath;
  sectionName: string;
  mode: BuilderCompiledRepeaterMode;
};

export type BuilderCompiledTemplate = {
  rootSectionName: string;
  skeleton: BuilderCompiledTemplateJson;
  injections: BuilderCompiledInjectionOperation[];
  repeaters: BuilderCompiledRepeater[];
};

export type BuilderCompiledInjectionLookup = Record<
  BuilderTemplateNodePath,
  BuilderCompiledInjectionOperation[]
>;

export type BuilderCompiledRepeaterLookup = Record<
  BuilderTemplateNodePath,
  BuilderCompiledRepeater
>;

export type BuilderHydrationSetterOperation = {
  sectionName: string;
  premadeField: string;
  targetPath: BuilderTemplateNodePath;
};

/**
 * Canonical runtime plan contract:
 * - `skeleton` has metadata (`data_mapping`, `data_section_name`, `_editable`) removed
 * - `setters` is deterministic and uses absolute node paths rooted at "$"
 * - `repeaters` points to item-node paths in the same "$"-rooted namespace
 */
export type BuilderPrecompiledHydrationPlan = {
  rootSectionName: string;
  skeleton: BuilderCompiledTemplateJson;
  setters: BuilderHydrationSetterOperation[];
  repeaters: BuilderCompiledRepeater[];
};

export type BuilderTemplateRecord = {
  slug: string;
  component: string;
  template: BuilderTemplateJson;
  updatedAt?: string;
};

export type BuilderCompiledTemplateRecord = {
  slug: string;
  component: string;
  compiled: BuilderCompiledTemplate;
  updatedAt?: string;
};

export type BuilderCompiledTemplateRegistry = {
  source: "storyblok";
  generatedAt: string;
  templates: BuilderCompiledTemplateRecord[];
};

export type BuilderTemplateHydratorBlok = Record<string, unknown>;
export type BuilderTemplateHydratorResult = Record<string, unknown>;

export type BuilderTemplateHydrator = (
  blok: BuilderTemplateHydratorBlok,
) => BuilderTemplateHydratorResult;

export type BuilderTemplateHydratorRegistry = Record<
  string,
  BuilderTemplateHydrator
>;
