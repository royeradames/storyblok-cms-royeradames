type BuilderDataMappingEntry = {
  builder_section: string;
  premade_field: string;
  builder_field: string;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toInjectableMappingEntries(value: unknown): BuilderDataMappingEntry[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((mapping) => {
    if (!isObject(mapping)) return [];

    const builderSection = mapping.builder_section;
    const premadeField = mapping.premade_field;
    const builderField = mapping.builder_field;

    if (
      typeof builderSection !== "string" ||
      typeof premadeField !== "string" ||
      typeof builderField !== "string"
    ) {
      return [];
    }

    return [
      {
        builder_section: builderSection,
        premade_field: premadeField,
        builder_field: builderField,
      },
    ];
  });
}

export function toInjectableTemplate(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => toInjectableTemplate(item));
  }

  if (!isObject(value)) {
    return value;
  }

  const nextValue: Record<string, unknown> = {};

  for (const [key, childValue] of Object.entries(value)) {
    if (key === "_uid" || key === "_editable") continue;

    if (key === "data_mapping") {
      const normalizedDataMapping = toInjectableMappingEntries(childValue);
      if (normalizedDataMapping.length > 0) {
        nextValue[key] = normalizedDataMapping;
      }
      continue;
    }

    nextValue[key] = toInjectableTemplate(childValue);
  }

  return nextValue;
}
