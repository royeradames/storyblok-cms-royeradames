#!/usr/bin/env bun
/**
 * Generate repo-managed builder template artifacts from Storyblok.
 *
 * Fetches all builder stories, normalizes their templates, and writes:
 * - src/builder-templates/generated/builder-templates/*.json (one file per template component)
 * - src/builder-templates/generated/builder-template-registry.ts (typed registry for runtime lookup)
 *
 * Usage (from packages/shared-cms):
 *   bun run storyblok:seed:templates
 *
 * Requires: STORYBLOK_SPACE_ID, STORYBLOK_PERSONAL_ACCESS_TOKEN
 */

import * as path from "node:path";
import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import { config } from "dotenv";
import {
  normalizeBuilderTemplate,
  resolveTemplateComponentName,
  slugToBuilderPrefix,
} from "../../src/builder-templates/builder-template";
import { toInjectableTemplate } from "../../src/builder-templates/injectable-template";
import type {
  BuilderInjectableTemplateRecord,
  BuilderInjectableTemplateRegistry,
  BuilderTemplateRecord,
  BuilderTemplateRegistry,
} from "../../src/builder-templates/types";

config({ path: path.join(process.cwd(), ".env") });
config({ path: path.join(process.cwd(), "..", "..", "apps", "gateway", ".env") });

const SPACE_ID = process.env.STORYBLOK_SPACE_ID;
const TOKEN = process.env.STORYBLOK_PERSONAL_ACCESS_TOKEN;
const API_BASE = "https://mapi.storyblok.com/v1";

const GENERATED_DIR = path.join(
  process.cwd(),
  "src",
  "builder-templates",
  "generated",
);
const GENERATED_TEMPLATES_DIR = path.join(GENERATED_DIR, "builder-templates");
const GENERATED_INJECTABLE_TEMPLATES_DIR = path.join(
  GENERATED_DIR,
  "builder-templates-injectable",
);
const REGISTRY_FILE_PATH = path.join(
  GENERATED_DIR,
  "builder-template-registry.ts",
);
const INJECTABLE_REGISTRY_FILE_PATH = path.join(
  GENERATED_DIR,
  "builder-template-injectable-registry.ts",
);

const DELAY_MS = 350;
const BUILDER_ROOT_COMPONENTS = new Set([
  "page",
  "element_builder_page",
  "form_builder_page",
]);

type StoryblokStory = {
  id: number;
  full_slug: string;
  published_at?: string;
  updated_at?: string;
  content?: Record<string, unknown>;
};

if (!SPACE_ID || !TOKEN) {
  console.error(
    "Missing STORYBLOK_SPACE_ID or STORYBLOK_PERSONAL_ACCESS_TOKEN in environment",
  );
  process.exit(1);
}

function toFileName(componentName: string): string {
  return `${componentName.replace(/[^a-zA-Z0-9_-]/g, "_")}.json`;
}

async function fetchBuilderStories(): Promise<StoryblokStory[]> {
  const prefixes = ["section-builder/", "element-builder/", "form-builder/"];
  const storyList: StoryblokStory[] = [];

  for (const prefix of prefixes) {
    const listUrl = `${API_BASE}/spaces/${SPACE_ID}/stories?starts_with=${prefix}&per_page=100`;
    const listRes = await fetch(listUrl, {
      headers: { Authorization: TOKEN! },
    });

    if (!listRes.ok) {
      throw new Error(
        `Failed to list stories for ${prefix}: ${listRes.status} ${listRes.statusText}`,
      );
    }

    const listData = await listRes.json();
    storyList.push(...(listData.stories ?? []));
  }

  const fullStories: StoryblokStory[] = [];
  for (const stub of storyList) {
    await new Promise((resolveDelay) => setTimeout(resolveDelay, DELAY_MS));
    const storyUrl = `${API_BASE}/spaces/${SPACE_ID}/stories/${stub.id}`;
    const storyRes = await fetch(storyUrl, {
      headers: { Authorization: TOKEN! },
    });

    if (!storyRes.ok) {
      console.warn(
        `  Failed to fetch story ${stub.id} (${stub.full_slug}): ${storyRes.status}`,
      );
      continue;
    }

    const storyData = await storyRes.json();
    fullStories.push(storyData.story);
  }

  return fullStories;
}

function buildTemplateRecords(stories: StoryblokStory[]): BuilderTemplateRecord[] {
  const records: BuilderTemplateRecord[] = [];

  for (const story of stories) {
    const slug = story.full_slug;
    const rootComponent = story.content?.component;

    if (
      typeof rootComponent === "string" &&
      !BUILDER_ROOT_COMPONENTS.has(rootComponent)
    ) {
      console.log(
        `  Skipping ${slug}: unsupported root component "${rootComponent}"`,
      );
      continue;
    }

    const template = normalizeBuilderTemplate(story.content);
    const slugPrefix = slugToBuilderPrefix(slug);
    const componentName = resolveTemplateComponentName(template, slugPrefix);

    if (!template) {
      console.warn(`  Skipping ${slug}: no content`);
      continue;
    }

    records.push({
      slug,
      component: componentName,
      template,
      updatedAt: story.published_at ?? story.updated_at,
    });
    console.log(`  Prepared: ${slug} -> ${componentName}`);
  }

  return records.sort((a, b) => {
    if (a.component === b.component) return a.slug.localeCompare(b.slug);
    return a.component.localeCompare(b.component);
  });
}

async function cleanPreviousTemplateFiles(): Promise<void> {
  await mkdir(GENERATED_TEMPLATES_DIR, { recursive: true });
  await mkdir(GENERATED_INJECTABLE_TEMPLATES_DIR, { recursive: true });
  const entries = await readdir(GENERATED_TEMPLATES_DIR, { withFileTypes: true });
  const injectableEntries = await readdir(GENERATED_INJECTABLE_TEMPLATES_DIR, {
    withFileTypes: true,
  });
  const jsonFiles = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => path.join(GENERATED_TEMPLATES_DIR, entry.name));
  const injectableJsonFiles = injectableEntries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => path.join(GENERATED_INJECTABLE_TEMPLATES_DIR, entry.name));

  await Promise.all(
    [...jsonFiles, ...injectableJsonFiles].map((filePath) =>
      rm(filePath, { force: true }),
    ),
  );
}

async function writeTemplateArtifacts(records: BuilderTemplateRecord[]) {
  await mkdir(GENERATED_DIR, { recursive: true });
  await cleanPreviousTemplateFiles();

  const injectableRecords: BuilderInjectableTemplateRecord[] = records.map(
    (record) => ({
      ...record,
      template: toInjectableTemplate(record.template) as Record<string, unknown>,
    }),
  );

  for (const record of records) {
    const templateFilePath = path.join(
      GENERATED_TEMPLATES_DIR,
      toFileName(record.component),
    );
    await writeFile(templateFilePath, `${JSON.stringify(record, null, 2)}\n`, "utf8");
  }
  for (const record of injectableRecords) {
    const templateFilePath = path.join(
      GENERATED_INJECTABLE_TEMPLATES_DIR,
      toFileName(record.component),
    );
    await writeFile(templateFilePath, `${JSON.stringify(record, null, 2)}\n`, "utf8");
  }

  const registry: BuilderTemplateRegistry = {
    source: "storyblok",
    generatedAt: new Date().toISOString(),
    templates: records,
  };
  const injectableRegistry: BuilderInjectableTemplateRegistry = {
    source: "storyblok",
    generatedAt: new Date().toISOString(),
    templates: injectableRecords,
  };

  const registryFileContents = `import type { BuilderTemplateRegistry } from "../types";

/**
 * Auto-generated by scripts/storyblok/seed-templates.ts
 * Do not edit manually.
 */
export const builderTemplateRegistry = ${JSON.stringify(registry, null, 2)} satisfies BuilderTemplateRegistry;
`;
  const injectableRegistryFileContents = `import type { BuilderInjectableTemplateRegistry } from "../types";

/**
 * Auto-generated by scripts/storyblok/seed-templates.ts
 * Do not edit manually.
 */
export const builderTemplateInjectableRegistry = ${JSON.stringify(injectableRegistry, null, 2)} satisfies BuilderInjectableTemplateRegistry;
`;

  await writeFile(REGISTRY_FILE_PATH, registryFileContents, "utf8");
  await writeFile(
    INJECTABLE_REGISTRY_FILE_PATH,
    injectableRegistryFileContents,
    "utf8",
  );
}

async function main() {
  console.log("Fetching builder stories from Storyblok...");
  const stories = await fetchBuilderStories();

  if (stories.length === 0) {
    console.log("No builder stories found.");
    await writeTemplateArtifacts([]);
    return;
  }

  console.log(`Found ${stories.length} builder stories.`);
  const records = buildTemplateRecords(stories);
  await writeTemplateArtifacts(records);
  console.log(
    `Done generating template artifacts. Wrote ${records.length} template record${records.length === 1 ? "" : "s"}.`,
  );
}

main().catch((err) => {
  console.error("Template artifact generation failed:", err);
  process.exit(1);
});
