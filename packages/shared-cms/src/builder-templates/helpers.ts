import type {
  BuilderInjectableTemplateJson,
  BuilderInjectableTemplateRecord,
  BuilderTemplateJson,
  BuilderTemplateRecord,
} from "./types";

type TemplateLookup = Record<string, BuilderTemplateJson>;
type InjectableTemplateLookup = Record<string, BuilderInjectableTemplateJson>;

type TemplateRecordLookupItem<TTemplate> = {
  component: string;
  template: TTemplate;
};

function buildLookupByComponentName<TTemplate>(
  templateRecords: TemplateRecordLookupItem<TTemplate>[],
): Record<string, TTemplate> {
  return templateRecords.reduce<Record<string, TTemplate>>(
    (lookupByComponent, record) => {
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
    },
    {},
  );
}

export function buildTemplateLookup(
  templateRecords: BuilderTemplateRecord[],
): TemplateLookup {
  return buildLookupByComponentName(templateRecords);
}

export function buildInjectableTemplateLookup(
  templateRecords: BuilderInjectableTemplateRecord[],
): InjectableTemplateLookup {
  return buildLookupByComponentName(templateRecords);
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
