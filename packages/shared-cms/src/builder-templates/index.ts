export {
  normalizeBuilderTemplate,
  resolveTemplateComponentName,
  slugToBuilderPrefix,
  derivePrefixFromComponentName,
} from "./builder-template";
export {
  buildTemplateLookup,
  buildInjectableTemplateLookup,
  buildTemplateSnapshotBySlug,
} from "./helpers";
export { toInjectableTemplate } from "./injectable-template";
export type {
  BuilderInjectableTemplateJson,
  BuilderInjectableTemplateRecord,
  BuilderInjectableTemplateRegistry,
  BuilderTemplateJson,
  BuilderTemplateRecord,
  BuilderTemplateRegistry,
} from "./types";
export { builderTemplateRegistry } from "./generated/builder-template-registry";
export { builderTemplateInjectableRegistry } from "./generated/builder-template-injectable-registry";
