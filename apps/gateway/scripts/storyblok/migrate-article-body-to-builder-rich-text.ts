#!/usr/bin/env bun
/**
 * Migrate legacy article/builder rich text blocks to shared_rich_text.
 *
 * Transforms:
 * - shared_shadcn_article -> shared_rich_text
 * - shared_builder_rich_text -> shared_rich_text
 * - injects default node_mappings when missing
 *
 * Usage (from apps/gateway):
 *   bun run storyblok:migrate-article-body-to-builder-rich-text            # dry-run
 *   bun run storyblok:migrate-article-body-to-builder-rich-text -- --apply # apply
 */

import { config } from "dotenv";
import * as path from "path";

config({ path: path.join(process.cwd(), ".env") });

const SPACE_ID = process.env.STORYBLOK_SPACE_ID;
const TOKEN = process.env.STORYBLOK_PERSONAL_ACCESS_TOKEN;
const API_BASE = "https://mapi.storyblok.com/v1";
const DELAY_MS = 350;
const dryRun = !process.argv.includes("--apply");

if (!SPACE_ID || !TOKEN) {
  console.error(
    "Missing STORYBLOK_SPACE_ID or STORYBLOK_PERSONAL_ACCESS_TOKEN in .env",
  );
  process.exit(1);
}

interface StoryStub {
  id: number;
  slug: string;
  full_slug: string;
}

interface Story {
  id: number;
  content?: unknown;
}

function isObject(value: unknown): value is Record<string, any> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isRichTextDocument(value: unknown): boolean {
  return isObject(value) && value.type === "doc";
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithTimeout(
  input: string,
  init: RequestInit,
  timeoutMs = 20000,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}

function makeUid(): string {
  return crypto.randomUUID().replace(/-/g, "");
}

function buildRichTextComponentName(
  sourceComponentName: string,
): "rich_text" | "shared_rich_text" {
  return sourceComponentName.startsWith("shared_")
    ? "shared_rich_text"
    : "rich_text";
}

function buildRichTextNodeMappingsComponentName(
  sourceComponentName: string,
): "rich_text_node_mappings" | "shared_rich_text_node_mappings" {
  return sourceComponentName.startsWith("shared_")
    ? "shared_rich_text_node_mappings"
    : "rich_text_node_mappings";
}

function createDefaultNodeMappingsBlok(
  sourceComponentName: string,
): Record<string, unknown> {
  const createComponentMapping = (componentName: string) => [
    {
      _uid: makeUid(),
      component: componentName,
    },
  ];

  return {
    _uid: makeUid(),
    component: buildRichTextNodeMappingsComponentName(sourceComponentName),
    heading_1_component: createComponentMapping("shared_article_heading_1"),
    heading_2_component: createComponentMapping("shared_article_heading_2"),
    heading_3_component: createComponentMapping("shared_article_heading_3"),
    heading_4_component: createComponentMapping("shared_article_heading_4"),
    heading_5_component: createComponentMapping("shared_article_heading_5"),
    heading_6_component: createComponentMapping("shared_article_heading_6"),
    paragraph_component: createComponentMapping("shared_article_paragraph"),
    quote_component: createComponentMapping("shared_article_quote"),
    unordered_list_component: createComponentMapping(
      "shared_article_unordered_list",
    ),
    ordered_list_component: createComponentMapping("shared_article_ordered_list"),
    list_item_component: createComponentMapping("shared_article_list_item"),
    table_component: createComponentMapping("shared_article_table"),
    table_row_component: createComponentMapping("shared_article_table_row"),
    table_header_component: createComponentMapping("shared_article_table_header"),
    table_cell_component: createComponentMapping("shared_article_table_cell"),
    embedded_component_component: createComponentMapping(
      "shared_article_embedded_component",
    ),
  };
}

function normalizeNodeMappingsBlokFields(mappingBlok: Record<string, any>): boolean {
  const mappingFieldNames = [
    "heading_1_component",
    "heading_2_component",
    "heading_3_component",
    "heading_4_component",
    "heading_5_component",
    "heading_6_component",
    "paragraph_component",
    "quote_component",
    "unordered_list_component",
    "ordered_list_component",
    "list_item_component",
    "table_component",
    "table_row_component",
    "table_header_component",
    "table_cell_component",
    "embedded_component_component",
  ] as const;

  let changed = false;

  for (const fieldName of mappingFieldNames) {
    const fieldValue = mappingBlok[fieldName];
    if (Array.isArray(fieldValue)) continue;
    if (typeof fieldValue !== "string" || fieldValue.trim().length === 0) continue;

    mappingBlok[fieldName] = [
      {
        _uid: makeUid(),
        component: fieldValue.trim(),
      },
    ];
    changed = true;
  }

  return changed;
}

function asBlokArray(value: unknown): Record<string, any>[] {
  return Array.isArray(value) ? value.filter((item) => isObject(item)) : [];
}

function pickRichTextContentNode(articleNode: Record<string, any>) {
  if (isRichTextDocument(articleNode.content)) {
    return {
      content: articleNode.content,
      nodeMappings: asBlokArray(articleNode.node_mappings),
      asideLeft: asBlokArray(articleNode.aside_left),
      asideRight: asBlokArray(articleNode.aside_right),
      styles: asBlokArray(articleNode.styles),
    };
  }

  if (isRichTextDocument(articleNode.body)) {
    return {
      content: articleNode.body,
      nodeMappings: asBlokArray(articleNode.node_mappings),
      asideLeft: [] as Record<string, any>[],
      asideRight: asBlokArray(articleNode.table_of_contents),
      styles: asBlokArray(articleNode.styles),
    };
  }

  const articleContent = asBlokArray(articleNode.article_content);
  for (const nested of articleContent) {
    const nestedComponent =
      typeof nested.component === "string" ? nested.component : "";
    if (!nestedComponent.endsWith("rich_text")) continue;
    if (!isRichTextDocument(nested.content)) continue;

    return {
      content: nested.content,
      nodeMappings: asBlokArray(nested.node_mappings),
      asideLeft: asBlokArray(nested.aside_left),
      asideRight: asBlokArray(nested.aside_right).length
        ? asBlokArray(nested.aside_right)
        : asBlokArray(articleNode.table_of_contents),
      styles: asBlokArray(nested.styles).length
        ? asBlokArray(nested.styles)
        : asBlokArray(articleNode.styles),
    };
  }

  return null;
}

function replaceNodeContent(
  target: Record<string, any>,
  next: Record<string, unknown>,
) {
  for (const key of Object.keys(target)) {
    delete target[key];
  }
  Object.assign(target, next);
}

function migrateInPlace(node: unknown): number {
  if (Array.isArray(node)) {
    let changedCount = 0;
    for (const item of node) {
      changedCount += migrateInPlace(item);
    }
    return changedCount;
  }

  if (!isObject(node)) return 0;

  let changedCount = 0;
  const componentName = typeof node.component === "string" ? node.component : "";
  const isLegacyArticle = componentName.endsWith("shadcn_article");
  const isLegacyBuilderRichText = componentName.endsWith("builder_rich_text");
  const isCurrentSharedRichText = componentName.endsWith("rich_text");

  if (isLegacyArticle || isLegacyBuilderRichText || isCurrentSharedRichText) {
    const nextData = pickRichTextContentNode(node);

    if (nextData && isRichTextDocument(nextData.content)) {
      const nodeMappings =
        nextData.nodeMappings.length > 0
          ? nextData.nodeMappings
          : [createDefaultNodeMappingsBlok(componentName)];

      for (const mapping of nodeMappings) {
        if (!isObject(mapping)) continue;
        if (normalizeNodeMappingsBlokFields(mapping)) {
          changedCount++;
        }
      }

      const nextNode: Record<string, unknown> = {
        _uid: typeof node._uid === "string" ? node._uid : makeUid(),
        component: buildRichTextComponentName(componentName),
        content: nextData.content,
        node_mappings: nodeMappings,
      };
      if (nextData.styles.length > 0) {
        nextNode.styles = nextData.styles;
      }
      if (nextData.asideLeft.length > 0) {
        nextNode.aside_left = nextData.asideLeft;
      }
      if (nextData.asideRight.length > 0) {
        nextNode.aside_right = nextData.asideRight;
      }

      replaceNodeContent(node, nextNode);
      changedCount++;
    }
  }

  for (const value of Object.values(node)) {
    changedCount += migrateInPlace(value);
  }

  return changedCount;
}

async function fetchAllStories(): Promise<StoryStub[]> {
  const stories: StoryStub[] = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    await sleep(DELAY_MS);
    const response = await fetch(
      `${API_BASE}/spaces/${SPACE_ID}/stories?per_page=${perPage}&page=${page}`,
      { headers: { Authorization: TOKEN! } },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch stories page ${page}: ${response.status}`);
    }

    const data = (await response.json()) as { stories?: StoryStub[] };
    const pageStories = data.stories ?? [];
    stories.push(...pageStories);

    if (pageStories.length < perPage) break;
    page++;
  }

  return stories;
}

async function fetchStory(storyId: number): Promise<Story | null> {
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    await sleep(DELAY_MS);
    try {
      const response = await fetchWithTimeout(
        `${API_BASE}/spaces/${SPACE_ID}/stories/${storyId}`,
        {
          headers: { Authorization: TOKEN! },
        },
      );

      if (!response.ok) return null;
      const data = (await response.json()) as { story?: Story };
      return data.story ?? null;
    } catch (error) {
      if (attempt === maxAttempts) throw error;
      await sleep(DELAY_MS * attempt);
    }
  }

  return null;
}

async function updateStory(storyId: number, content: unknown): Promise<void> {
  await sleep(DELAY_MS);
  const response = await fetchWithTimeout(
    `${API_BASE}/spaces/${SPACE_ID}/stories/${storyId}`,
    {
      method: "PUT",
      headers: {
        Authorization: TOKEN!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        story: { content },
      }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to update story ${storyId}: ${response.status} ${errorText}`,
    );
  }
}

async function main() {
  if (dryRun) {
    console.log("=== DRY RUN (pass --apply to save changes) ===\n");
  }

  const storyStubs = await fetchAllStories();
  console.log(`Found ${storyStubs.length} stories.\n`);

  let storiesChanged = 0;
  let nodesChanged = 0;
  let errors = 0;

  for (let index = 0; index < storyStubs.length; index++) {
    const stub = storyStubs[index]!;
    const slug = stub.full_slug || stub.slug || String(stub.id);

    try {
      const story = await fetchStory(stub.id);
      if (!story?.content) continue;

      const changedCount = migrateInPlace(story.content);
      if (changedCount === 0) continue;

      storiesChanged++;
      nodesChanged += changedCount;

      if (dryRun) {
        console.log(
          `[${index + 1}/${storyStubs.length}] [dry-run] Would migrate ${slug} (${changedCount} updates)`,
        );
        continue;
      }

      await updateStory(stub.id, story.content);
      console.log(
        `[${index + 1}/${storyStubs.length}] Migrated ${slug} (${changedCount} updates)`,
      );
    } catch (error) {
      errors++;
      console.error(
        `[${index + 1}/${storyStubs.length}] Failed ${slug}:`,
        error instanceof Error ? error.message : error,
      );
    }
  }

  console.log("\nDone.");
  console.log(`Stories scanned: ${storyStubs.length}`);
  console.log(`Stories changed: ${storiesChanged}`);
  console.log(`Node updates: ${nodesChanged}`);
  console.log(`Errors: ${errors}`);

  if (errors > 0) process.exit(1);
}

main().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
