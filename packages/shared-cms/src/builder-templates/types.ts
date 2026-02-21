export type BuilderTemplateJson = Record<string, unknown>;

export type BuilderTemplateRecord = {
  slug: string;
  component: string;
  template: BuilderTemplateJson;
  updatedAt?: string;
};

export type BuilderTemplateRegistry = {
  source: "storyblok";
  generatedAt: string;
  templates: BuilderTemplateRecord[];
};
