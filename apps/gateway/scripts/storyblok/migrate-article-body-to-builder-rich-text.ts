#!/usr/bin/env bun
/**
 * Migrate legacy article body richtext to article_content builder blocks.
 *
 * Transforms:
 * - shared_shadcn_article.body (richtext)
 * Into:
 * - shared_shadcn_article.article_content = [{ component: "shared_builder_rich_text", content: body }]
 *
 * Also moves shared_shadcn_article.rich_text_inputs -> builder_rich_text.render_inputs.
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

function getBuilderRichTextComponentName(
  articleComponentName: string,
): "builder_rich_text" | "shared_builder_rich_text" {
  return articleComponentName.startsWith("shared_")
    ? "shared_builder_rich_text"
    : "builder_rich_text";
}

function getBuilderRichTextInputsComponentName(
  articleComponentName: string,
): "builder_rich_text_inputs" | "shared_builder_rich_text_inputs" {
  return articleComponentName.startsWith("shared_")
    ? "shared_builder_rich_text_inputs"
    : "builder_rich_text_inputs";
}

function createDefaultBuilderRichTextInputsBlok(
  articleComponentName: string,
): Record<string, unknown> {
  return {
    _uid: makeUid(),
    component: getBuilderRichTextInputsComponentName(articleComponentName),
    wrap_heading_sections: true,
    prose_class_name:
      "prose-a:text-primary prose-a:underline prose-headings:font-semibold prose-headings:text-primary prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground prose-code:text-foreground",
    heading_class_name: "text-primary font-semibold scroll-mt-24",
    heading_wrapper_class_name: "scroll-mt-24",
    paragraph_class_name: "whitespace-pre-line text-primary",
    quote_class_name: "border-l-2 border-border pl-4 italic text-muted-foreground",
    unordered_list_class_name:
      "text-muted-foreground list-disc dark:marker:text-[#364152] list-outside pl-6",
    ordered_list_class_name:
      "text-muted-foreground list-decimal list-outside pl-6 marker:text-muted-foreground",
    list_item_class_name: "whitespace-pre-line text-primary",
    table_class_name: "w-full caption-bottom text-sm",
    table_wrapper_class_name:
      "overflow-x-auto rounded-md border-b dark:border-b-[#364152] even:bg-muted border-border/70",
    table_row_class_name: "border-b dark:border-b-[#364152] even:bg-muted border-border/60",
    table_header_class_name: "text-left h-10 px-3 align-middle font-medium text-primary",
    table_header_legacy_class_name:
      "text-left h-10 px-3 align-middle font-medium text-primary bg-muted/30",
    table_cell_class_name: "p-3 align-middle text-muted-foreground",
    embedded_component_class_name: "sb-richtext-blok",
    heading_section_class_name: "sb-heading-section grid gap-4",
    heading_section_spacing_class_name: "pt-4",
  };
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
  const isArticleComponent = componentName.endsWith("shadcn_article");

  if (isArticleComponent && isRichTextDocument(node.body)) {
    const builderRichTextBlok: Record<string, unknown> = {
      _uid: makeUid(),
      component: getBuilderRichTextComponentName(componentName),
      content: node.body,
    };

    if (Array.isArray(node.rich_text_inputs) && node.rich_text_inputs.length > 0) {
      builderRichTextBlok.render_inputs = node.rich_text_inputs;
    } else {
      builderRichTextBlok.render_inputs = [
        createDefaultBuilderRichTextInputsBlok(componentName),
      ];
    }

    if (!Array.isArray(node.article_content) || node.article_content.length === 0) {
      node.article_content = [builderRichTextBlok];
    }

    delete node.body;
    delete node.rich_text_inputs;
    changedCount++;
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
