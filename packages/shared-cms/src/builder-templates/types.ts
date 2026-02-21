export type BuilderTemplateJson = Record<string, unknown>;
export type BuilderInjectableTemplateJson = Record<string, unknown>;

export type BuilderTemplateRecord = {
  slug: string;
  component: string;
  template: BuilderTemplateJson;
  updatedAt?: string;
};

export type BuilderInjectableTemplateRecord = {
  slug: string;
  component: string;
  template: BuilderInjectableTemplateJson;
  updatedAt?: string;
};

export type BuilderTemplateRegistry = {
  source: "storyblok";
  generatedAt: string;
  templates: BuilderTemplateRecord[];
};

export type BuilderInjectableTemplateRegistry = {
  source: "storyblok";
  generatedAt: string;
  templates: BuilderInjectableTemplateRecord[];
};
