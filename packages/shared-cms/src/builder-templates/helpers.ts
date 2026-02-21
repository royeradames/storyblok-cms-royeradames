import type { BuilderTemplateJson, BuilderTemplateRecord } from "./types";

type TemplateLookup = Record<string, BuilderTemplateJson>;

export function buildTemplateLookup(
  templateRecords: BuilderTemplateRecord[],
): TemplateLookup {
  return templateRecords.reduce<TemplateLookup>((lookupByComponent, record) => {
    const rawComponentName = record.component.trim();
    if (rawComponentName.length === 0) return lookupByComponent;

    const normalizedComponentName = rawComponentName.replace(/^shared_/, "");
    const sharedComponentName = rawComponentName.startsWith("shared_")
      ? rawComponentName
      : `shared_${normalizedComponentName}`;

    lookupByComponent[rawComponentName] = record.template;
    lookupByComponent[normalizedComponentName] = record.template;
    lookupByComponent[sharedComponentName] = record.template;

    if (!normalizedComponentName.endsWith("_section")) {
      lookupByComponent[`${normalizedComponentName}_section`] = record.template;
    }

    return lookupByComponent;
  }, {});
}

export function buildTemplateSnapshotBySlug(
  templateRecords: BuilderTemplateRecord[],
): Record<string, BuilderTemplateRecord> {
  return templateRecords.reduce<Record<string, BuilderTemplateRecord>>(
    (lookupBySlug, record) => {
      lookupBySlug[record.slug] = record;
      return lookupBySlug;
    },
    {},
  );
}
