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

export type BuilderHydratorCodegenPlan = {
  rootSectionName: string;
  skeleton: BuilderCompiledTemplateJson;
  injectionsByPath: BuilderHydratorInjectionLookup;
  repeatersByPath: BuilderCompiledRepeaterLookup;
};

export type BuilderHydratorInjectionOperation = {
  sectionName: string;
  premadeField: string;
  builderField: string;
};

export type BuilderHydratorInjectionLookup = Record<
  BuilderTemplateNodePath,
  BuilderHydratorInjectionOperation[]
>;

export type BuilderHydrationSetterOperation = {
  sectionName: string;
  premadeField: string;
  targetPath: BuilderTemplateNodePath;
};

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

export type BuilderTemplateRegistry = {
  source: "storyblok";
  generatedAt: string;
  templates: BuilderTemplateRecord[];
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
