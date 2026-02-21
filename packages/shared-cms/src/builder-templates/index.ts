export {
  normalizeBuilderTemplate,
  resolveTemplateComponentName,
  slugToBuilderPrefix,
  derivePrefixFromComponentName,
} from "./builder-template";
export { buildTemplateLookup, buildTemplateSnapshotBySlug } from "./helpers";
export type {
  BuilderTemplateJson,
  BuilderTemplateRecord,
  BuilderTemplateRegistry,
} from "./types";
export { builderTemplateRegistry } from "./generated/builder-template-registry";
