#!/usr/bin/env bun

import * as path from "node:path";
import { readFile } from "node:fs/promises";
import { buildStructureFromTemplate } from "../src/structure-generator/buildStructureFromTemplate";

type DataMapping = {
  builder_section: string;
  premade_field: string;
  builder_field: string;
};

type TemplateArtifact = {
  slug: string;
  component: string;
  template: Record<string, unknown>;
  updatedAt?: string;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function collectDataMappings(node: unknown, result: DataMapping[]): void {
  if (Array.isArray(node)) {
    for (const item of node) collectDataMappings(item, result);
    return;
  }

  if (!isObject(node)) return;

  const mappings = node.data_mapping;
  if (Array.isArray(mappings)) {
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
      result.push({
        builder_section: builderSection,
        premade_field: premadeField,
        builder_field: builderField,
      });
    }
  }

  for (const child of Object.values(node)) {
    collectDataMappings(child, result);
  }
}

function parseJsonArg(input: string): Record<string, unknown> {
  const parsed = JSON.parse(input);
  if (!isObject(parsed)) {
    throw new Error("Provided --data JSON must be an object.");
  }
  return parsed;
}

function parseArgs(argv: string[]) {
  let component = "";
  let dataOverride: Record<string, unknown> = {};

  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index];
    if (!arg) continue;

    if (arg === "--component") {
      component = argv[index + 1] ?? "";
      index++;
      continue;
    }

    if (arg === "--data") {
      const rawData = argv[index + 1] ?? "";
      dataOverride = parseJsonArg(rawData);
      index++;
      continue;
    }

    if (!arg.startsWith("--") && component.length === 0) {
      component = arg;
    }
  }

  if (component.length === 0) {
    throw new Error(
      'Missing component name. Usage: bun run template:debug-injection -- article_heading_1 --data \'{"title":"Hello"}\'',
    );
  }

  return { component, dataOverride };
}

function createSampleValue(fieldName: string): string {
  return `sample_${fieldName}`;
}

function buildSampleBlok(
  template: Record<string, unknown>,
  componentName: string,
): Record<string, unknown> {
  const rootSectionName =
    typeof template.data_section_name === "string" ? template.data_section_name : "";
  const mappings: DataMapping[] = [];
  collectDataMappings(template, mappings);

  const fieldsBySection = new Map<string, Set<string>>();
  for (const mapping of mappings) {
    if (!fieldsBySection.has(mapping.builder_section)) {
      fieldsBySection.set(mapping.builder_section, new Set());
    }
    fieldsBySection.get(mapping.builder_section)!.add(mapping.premade_field);
  }

  const blok: Record<string, unknown> = {
    _uid: "debug-root",
    component: rootSectionName
      ? `shared_${rootSectionName}`
      : `shared_${componentName}`,
  };

  if (rootSectionName && fieldsBySection.has(rootSectionName)) {
    for (const fieldName of fieldsBySection.get(rootSectionName) ?? []) {
      blok[fieldName] = createSampleValue(fieldName);
    }
  }

  for (const [sectionName, fieldSet] of fieldsBySection.entries()) {
    if (sectionName === rootSectionName) continue;
    const entry: Record<string, unknown> = {
      _uid: `debug-${sectionName}-1`,
      component: sectionName,
    };
    for (const fieldName of fieldSet) {
      entry[fieldName] = createSampleValue(fieldName);
    }
    blok[`${sectionName}_items`] = [entry];
  }

  return blok;
}

async function main() {
  const { component, dataOverride } = parseArgs(process.argv.slice(2));
  const artifactPath = path.join(
    process.cwd(),
    "src",
    "builder-templates",
    "generated",
    "builder-templates-injectable",
    `${component}.json`,
  );

  const artifactRaw = await readFile(artifactPath, "utf8");
  const artifact = JSON.parse(artifactRaw) as TemplateArtifact;
  const sampleBlok = buildSampleBlok(artifact.template, artifact.component);
  const debugBlok = {
    ...sampleBlok,
    ...dataOverride,
  };

  const populatedStructure = buildStructureFromTemplate(artifact.template, debugBlok);

  console.log(`Template component: ${artifact.component}`);
  console.log(`Template slug: ${artifact.slug}`);
  console.log("Input blok:");
  console.log(JSON.stringify(debugBlok, null, 2));
  console.log("");
  console.log("Populated structure:");
  console.log(JSON.stringify(populatedStructure, null, 2));
}

main().catch((error) => {
  console.error("Template debug failed:");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
