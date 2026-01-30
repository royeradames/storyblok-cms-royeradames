#!/usr/bin/env bun
/**
 * Generate Storyblok seed JSON for gateway app.
 *
 * Merges:
 * - Shared components from @repo/shared-cms (with "shared_" prefix)
 * - App-specific components from gateway storyblok-seed (no prefix)
 *
 * Usage (from apps/gateway): bun run storyblok:seed:generate
 * Output: apps/gateway/.storyblok-seed.json
 */

import { config } from "dotenv";
import * as fs from "fs";
import * as path from "path";
import {
  componentDefinitions as sharedDefinitions,
  componentCount as sharedCount,
} from "@repo/shared-cms/storyblok-seed";
import {
  gatewayComponentDefinitions,
  SHARED_WHITELIST_PLACEHOLDER,
} from "../../storyblok-seed/definitions";

// Load app .env (apps/gateway/.env)
config({ path: path.join(process.cwd(), ".env") });

const OUTPUT_FILE = path.join(process.cwd(), ".storyblok-seed.json");

const SHARED_PREFIX = "shared_";

type SchemaField = {
  type: string;
  pos?: number;
  required?: boolean;
  default_value?: string | number | boolean;
  description?: string;
  options?: { value: string; name: string }[];
  restrict_components?: boolean;
  component_whitelist?: string[];
  allow_target_blank?: boolean;
  filetypes?: string[];
  min_value?: number;
  max_value?: number;
};

type ComponentDef = {
  name: string;
  display_name: string;
  is_root?: boolean;
  is_nestable?: boolean;
  schema: Record<string, SchemaField>;
  preview_field?: string;
  preview_tmpl?: string;
  color?: string;
  icon?: string;
};

function transformToStoryblokFormat(
  definitions: ComponentDef[],
  namePrefix = "",
  whitelistPrefix = "",
): { components: Record<string, unknown>[]; prefixedNames: string[] } {
  const prefixedNames: string[] = [];

  const components = definitions.map((component) => {
    const prefixedName = namePrefix ? `${namePrefix}${component.name}` : component.name;
    prefixedNames.push(prefixedName);

    const schema: Record<string, unknown> = {};

    for (const [fieldName, fieldDef] of Object.entries(component.schema)) {
      const field: Record<string, unknown> = {
        type: fieldDef.type,
        pos: fieldDef.pos ?? 0,
      };

      if (fieldDef.required) field.required = true;
      if (fieldDef.default_value !== undefined) {
        field.default_value = String(fieldDef.default_value);
      }
      if (fieldDef.description) field.description = fieldDef.description;
      if (fieldDef.options?.length) field.options = fieldDef.options;

      if (fieldDef.type === "bloks" && fieldDef.restrict_components) {
        field.restrict_type = "";
        field.restrict_components = true;
        if (fieldDef.component_whitelist?.length) {
          field.component_whitelist = fieldDef.component_whitelist.map(
            (name) => `${whitelistPrefix}${name}`,
          );
        }
      }

      if (fieldDef.type === "multilink" && fieldDef.allow_target_blank) {
        field.allow_target_blank = true;
      }
      if (fieldDef.type === "asset" && fieldDef.filetypes) {
        field.filetypes = fieldDef.filetypes;
      }
      if (fieldDef.type === "number") {
        if (fieldDef.min_value !== undefined) field.min_value = fieldDef.min_value;
        if (fieldDef.max_value !== undefined) field.max_value = fieldDef.max_value;
      }

      schema[fieldName] = field;
    }

    return {
      name: prefixedName,
      display_name: component.display_name,
      is_root: component.is_root ?? false,
      is_nestable: component.is_nestable ?? true,
      schema,
      ...(component.preview_field && { preview_field: component.preview_field }),
      ...(component.preview_tmpl && { preview_tmpl: component.preview_tmpl }),
      ...(component.color && { color: component.color }),
      ...(component.icon && { icon: component.icon }),
    };
  });

  return { components, prefixedNames };
}

function main() {
  console.log("🚀 Generating Storyblok seed (shared_ + app-specific)...\n");

  // 1. Transform shared definitions with "shared_" prefix
  const sharedDefs = sharedDefinitions as unknown as ComponentDef[];
  const { components: sharedComponents, prefixedNames: sharedPrefixedNames } =
    transformToStoryblokFormat(sharedDefs, SHARED_PREFIX, SHARED_PREFIX);

  // 2. Gateway definitions: replace placeholder with shared_* whitelist
  const gatewayDefsWithWhitelist = gatewayComponentDefinitions.map((comp) => {
    const schema = { ...comp.schema };
    for (const key of Object.keys(schema)) {
      const field = schema[key];
      if (
        field.type === "bloks" &&
        field.component_whitelist?.includes(SHARED_WHITELIST_PLACEHOLDER)
      ) {
        schema[key] = {
          ...field,
          component_whitelist: [...sharedPrefixedNames],
        };
      }
    }
    return { ...comp, schema };
  });

  const { components: appComponents } = transformToStoryblokFormat(
    gatewayDefsWithWhitelist as unknown as ComponentDef[],
    "",
    "",
  );

  const merged = [...sharedComponents, ...appComponents];
  const output = { components: merged };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));

  console.log(`✅ Shared: ${sharedCount} components (with "shared_" prefix)`);
  console.log(`✅ App-specific: ${appComponents.length} components`);
  console.log(`📄 Output: ${OUTPUT_FILE}`);
  console.log(`\nNext: bun run storyblok:seed:push\n`);
}

main();
