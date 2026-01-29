#!/usr/bin/env bun
/**
 * Generate Storyblok Seed JSON
 *
 * This script converts the TypeScript component definitions into a JSON file
 * that can be pushed to Storyblok using the CLI.
 *
 * Usage:
 *   bun run storyblok:seed:generate
 *
 * Output:
 *   ./storyblok-seed.json
 */

import {
  componentDefinitions,
  componentCount,
} from "../packages/cms/src/storyblok-seed/definitions";
import * as fs from "fs";
import * as path from "path";

// Output path
const OUTPUT_FILE = path.join(process.cwd(), "storyblok-seed.json");

// Transform definitions to Storyblok's expected format
function transformToStoryblokFormat(definitions: typeof componentDefinitions) {
  return definitions.map((component) => {
    // Build the schema object with correct Storyblok field structure
    const schema: Record<string, unknown> = {};

    for (const [fieldName, fieldDef] of Object.entries(component.schema)) {
      const field: Record<string, unknown> = {
        type: fieldDef.type,
        pos: fieldDef.pos ?? 0,
      };

      // Add optional properties if they exist
      if (fieldDef.required) {
        field.required = true;
      }

      if (fieldDef.default_value !== undefined) {
        field.default_value = String(fieldDef.default_value);
      }

      if (fieldDef.description) {
        field.description = fieldDef.description;
      }

      // Handle options for option/options type
      if (fieldDef.options && fieldDef.options.length > 0) {
        field.options = fieldDef.options;
      }

      // Handle bloks restrictions
      if (fieldDef.type === "bloks") {
        if (fieldDef.restrict_components) {
          field.restrict_type = "";
          field.restrict_components = true;
          if (fieldDef.component_whitelist) {
            field.component_whitelist = fieldDef.component_whitelist;
          }
        }
      }

      // Handle multilink options
      if (fieldDef.type === "multilink" && fieldDef.allow_target_blank) {
        field.allow_target_blank = true;
      }

      // Handle asset options
      if (fieldDef.type === "asset" && fieldDef.filetypes) {
        field.filetypes = fieldDef.filetypes;
      }

      // Handle number constraints
      if (fieldDef.type === "number") {
        if (fieldDef.min_value !== undefined) {
          field.min_value = fieldDef.min_value;
        }
        if (fieldDef.max_value !== undefined) {
          field.max_value = fieldDef.max_value;
        }
      }

      schema[fieldName] = field;
    }

    return {
      name: component.name,
      display_name: component.display_name,
      is_root: component.is_root ?? false,
      is_nestable: component.is_nestable ?? true,
      schema,
      ...(component.preview_field && {
        preview_field: component.preview_field,
      }),
      ...(component.preview_tmpl && { preview_tmpl: component.preview_tmpl }),
      ...(component.color && { color: component.color }),
      ...(component.icon && { icon: component.icon }),
    };
  });
}

// Main execution
function main() {
  console.log("🚀 Generating Storyblok seed file...\n");

  const components = transformToStoryblokFormat(componentDefinitions);

  const output = {
    components,
  };

  // Write to file
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));

  console.log(`✅ Generated ${componentCount} component definitions`);
  console.log(`📄 Output: ${OUTPUT_FILE}\n`);

  // Print component summary
  console.log("Components included:");
  console.log("─".repeat(50));

  const categories = {
    Layout: ["shadcn_section", "shadcn_grid", "shadcn_flex"],
    "Typography & Content": [
      "shadcn_text",
      "shadcn_rich_text",
      "shadcn_alert",
      "shadcn_badge",
      "shadcn_separator",
    ],
    Navigation: [
      "shadcn_accordion",
      "shadcn_accordion_item",
      "shadcn_tabs",
      "shadcn_tab_item",
      "shadcn_breadcrumb",
      "shadcn_breadcrumb_item",
      "shadcn_pagination",
    ],
    Media: [
      "shadcn_avatar",
      "shadcn_image",
      "shadcn_carousel",
      "shadcn_aspect_ratio",
      "shadcn_skeleton",
    ],
    "Interactive / Overlays": [
      "shadcn_button",
      "shadcn_card",
      "shadcn_hero",
      "shadcn_dialog",
      "shadcn_sheet",
      "shadcn_drawer",
      "shadcn_tooltip",
      "shadcn_hover_card",
      "shadcn_popover",
      "shadcn_collapsible",
      "shadcn_progress",
    ],
    "Form Elements": [
      "shadcn_form",
      "shadcn_input",
      "shadcn_textarea",
      "shadcn_checkbox",
      "shadcn_switch",
      "shadcn_radio_group",
      "shadcn_radio_option",
      "shadcn_select",
      "shadcn_select_option",
      "shadcn_slider",
      "shadcn_table",
      "shadcn_table_row",
      "shadcn_table_cell",
    ],
  };

  for (const [category, componentNames] of Object.entries(categories)) {
    console.log(`\n📁 ${category}:`);
    for (const name of componentNames) {
      const component = components.find((c) => c.name === name);
      if (component) {
        const fieldCount = Object.keys(component.schema).length;
        console.log(`   • ${component.display_name} (${fieldCount} fields)`);
      }
    }
  }

  console.log("\n─".repeat(50));
  console.log(`\n📊 Total: ${componentCount} components\n`);
  console.log("Next steps:");
  console.log("  1. Review the generated file: storyblok-seed.json");
  console.log("  2. Push to Storyblok: bun run storyblok:seed:push");
  console.log("  Or run both: bun run storyblok:seed\n");
}

main();
