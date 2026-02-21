import type {
  BuilderCompiledInjectionOperation,
  BuilderCompiledRepeater,
  BuilderCompiledTemplate,
  BuilderTemplateNodePath,
} from "./types";

const ROOT_NODE_PATH = "$";

type PathSegment = string | number;

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toNodePath(pathSegments: PathSegment[]): BuilderTemplateNodePath {
  if (pathSegments.length === 0) return ROOT_NODE_PATH;
  return `${ROOT_NODE_PATH}.${pathSegments.join(".")}`;
}

function isBuilderItemsArrayEntry(pathSegments: PathSegment[]): boolean {
  const minimumSegments = 2;
  if (pathSegments.length < minimumSegments) return false;

  const parentKey = pathSegments[pathSegments.length - 2];
  const itemIndex = pathSegments[pathSegments.length - 1];
  return parentKey === "items" && typeof itemIndex === "number";
}

function isWrapperRepeater(node: Record<string, unknown>): boolean {
  const items = node.items;
  if (!Array.isArray(items) || items.length !== 1) return false;
  const child = items[0];
  return isObject(child) && typeof child.data_section_name !== "string";
}

function collectCompiledInstructions(
  node: unknown,
  pathSegments: PathSegment[],
  injections: BuilderCompiledInjectionOperation[],
  repeaters: BuilderCompiledRepeater[],
): void {
  if (Array.isArray(node)) {
    node.forEach((item, itemIndex) => {
      collectCompiledInstructions(
        item,
        [...pathSegments, itemIndex],
        injections,
        repeaters,
      );
    });
    return;
  }

  if (!isObject(node)) return;

  const nodePath = toNodePath(pathSegments);
  const sectionNameValue = node.data_section_name;
  if (
    typeof sectionNameValue === "string" &&
    sectionNameValue.length > 0 &&
    isBuilderItemsArrayEntry(pathSegments)
  ) {
    repeaters.push({
      nodePath,
      sectionName: sectionNameValue,
      mode: isWrapperRepeater(node) ? "wrapper_children" : "self_clone",
    });
  }

  const mappings = node.data_mapping;
  if (Array.isArray(mappings) && mappings.length > 0) {
    for (const mapping of mappings) {
      if (!isObject(mapping)) continue;

      const builderSection = mapping.builder_section;
      const premadeField = mapping.premade_field;
      const builderField = mapping.builder_field;

      if (
        typeof builderSection !== "string" ||
        typeof premadeField !== "string" ||
        typeof builderField !== "string"
      ) {
        continue;
      }

      injections.push({
        nodePath,
        sectionName: builderSection,
        premadeField,
        builderField,
      });
    }
  }

  for (const [key, value] of Object.entries(node)) {
    collectCompiledInstructions(value, [...pathSegments, key], injections, repeaters);
  }
}

function buildCompiledSkeleton(node: unknown): unknown {
  if (Array.isArray(node)) {
    return node.map((item) => buildCompiledSkeleton(item));
  }

  if (!isObject(node)) {
    return node;
  }

  const skeleton: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(node)) {
    if (
      key === "_uid" ||
      key === "_editable" ||
      key === "data_mapping" ||
      key === "data_section_name"
    ) {
      continue;
    }
    skeleton[key] = buildCompiledSkeleton(value);
  }
  return skeleton;
}

export function compileBuilderTemplate(template: unknown): BuilderCompiledTemplate {
  const injections: BuilderCompiledInjectionOperation[] = [];
  const repeaters: BuilderCompiledRepeater[] = [];

  collectCompiledInstructions(template, [], injections, repeaters);

  injections.sort((left, right) => {
    if (left.nodePath !== right.nodePath) {
      return left.nodePath.localeCompare(right.nodePath);
    }
    if (left.sectionName !== right.sectionName) {
      return left.sectionName.localeCompare(right.sectionName);
    }
    if (left.builderField !== right.builderField) {
      return left.builderField.localeCompare(right.builderField);
    }
    return left.premadeField.localeCompare(right.premadeField);
  });

  repeaters.sort((left, right) => left.nodePath.localeCompare(right.nodePath));

  const rootSectionName =
    isObject(template) && typeof template.data_section_name === "string"
      ? template.data_section_name
      : "";

  return {
    rootSectionName,
    skeleton: buildCompiledSkeleton(template) as Record<string, unknown>,
    injections,
    repeaters,
  };
}

