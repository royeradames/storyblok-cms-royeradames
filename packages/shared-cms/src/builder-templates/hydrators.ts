import { builderTemplateHydratorRegistry } from "./generated/template-hydrator-registry";
import type {
  BuilderTemplateHydrator,
  BuilderTemplateHydratorRegistry,
} from "./types";

function buildHydratorLookupByComponentName(
  hydratorsByCanonicalComponent: BuilderTemplateHydratorRegistry,
): BuilderTemplateHydratorRegistry {
  return Object.entries(hydratorsByCanonicalComponent).reduce<
    BuilderTemplateHydratorRegistry
  >((lookupByComponent, [rawComponentName, hydrator]) => {
    const normalizedComponentName = rawComponentName.replace(/^shared_/, "");
    const sharedComponentName = rawComponentName.startsWith("shared_")
      ? rawComponentName
      : `shared_${normalizedComponentName}`;

    lookupByComponent[rawComponentName] = hydrator;
    lookupByComponent[normalizedComponentName] = hydrator;
    lookupByComponent[sharedComponentName] = hydrator;

    if (!normalizedComponentName.endsWith("_section")) {
      lookupByComponent[`${normalizedComponentName}_section`] = hydrator;
    }

    return lookupByComponent;
  }, {});
}

const builderTemplateHydratorLookup = buildHydratorLookupByComponentName(
  builderTemplateHydratorRegistry,
);

export function getBuilderTemplateHydrator(
  componentName: string,
): BuilderTemplateHydrator | undefined {
  return builderTemplateHydratorLookup[componentName];
}

export function getBuilderTemplateHydratorCount(): number {
  return Object.keys(builderTemplateHydratorRegistry).length;
}

