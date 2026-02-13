#!/usr/bin/env bun
import { config } from "dotenv";
import * as path from "path";

config({ path: path.join(process.cwd(), ".env") });

const SPACE_ID = process.env.STORYBLOK_SPACE_ID;
const TOKEN = process.env.STORYBLOK_PERSONAL_ACCESS_TOKEN;
const API_BASE = "https://mapi.storyblok.com/v1";
const PER_PAGE = 100;
const DELAY_MS = 350;

if (!SPACE_ID || !TOKEN) {
  console.error(
    "Missing STORYBLOK_SPACE_ID or STORYBLOK_PERSONAL_ACCESS_TOKEN in .env",
  );
  process.exit(1);
}

interface StoryStub {
  id: number;
  full_slug: string;
}

interface StoryPayload {
  story?: {
    id: number;
    content?: unknown;
  };
}

interface LegacyUsageCounts {
  snakeCaseTableRowNodes: number;
  snakeCaseTableHeaderNodes: number;
  snakeCaseTableCellNodes: number;
  shadcnRichTextBloks: number;
  renderInputsUsage: number;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function fetchStoryStubs(): Promise<StoryStub[]> {
  const stories: StoryStub[] = [];
  let page = 1;

  while (true) {
    const response = await fetch(
      `${API_BASE}/spaces/${SPACE_ID}/stories?per_page=${PER_PAGE}&page=${page}`,
      {
        headers: { Authorization: TOKEN! },
      },
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch stories page ${page}: ${response.status}`);
    }

    const data = (await response.json()) as { stories?: StoryStub[] };
    const pageStories = data.stories ?? [];
    stories.push(...pageStories);
    if (pageStories.length < PER_PAGE) break;

    page += 1;
    await sleep(DELAY_MS);
  }

  return stories;
}

function walkContent(node: unknown, counts: LegacyUsageCounts): void {
  if (Array.isArray(node)) {
    for (const item of node) {
      walkContent(item, counts);
    }
    return;
  }

  if (!isObject(node)) return;

  const nodeType = typeof node.type === "string" ? node.type : "";
  if (nodeType === "table_row") counts.snakeCaseTableRowNodes += 1;
  if (nodeType === "table_header") counts.snakeCaseTableHeaderNodes += 1;
  if (nodeType === "table_cell") counts.snakeCaseTableCellNodes += 1;

  const componentName = typeof node.component === "string" ? node.component : "";
  if (componentName === "shadcn_rich_text" || componentName === "shared_shadcn_rich_text") {
    counts.shadcnRichTextBloks += 1;
  }

  if (Array.isArray(node.render_inputs) && node.render_inputs.length > 0) {
    counts.renderInputsUsage += 1;
  }

  for (const value of Object.values(node)) {
    walkContent(value, counts);
  }
}

async function fetchAndAuditStoryContent(
  storyStub: StoryStub,
  counts: LegacyUsageCounts,
): Promise<void> {
  const response = await fetch(
    `${API_BASE}/spaces/${SPACE_ID}/stories/${storyStub.id}`,
    {
      headers: { Authorization: TOKEN! },
    },
  );
  if (!response.ok) {
    throw new Error(
      `Failed to fetch story ${storyStub.id} (${storyStub.full_slug}): ${response.status}`,
    );
  }

  const payload = (await response.json()) as StoryPayload;
  walkContent(payload.story?.content, counts);
}

async function main() {
  console.log("🔎 Auditing Storyblok rich text legacy usage...\n");
  const storyStubs = await fetchStoryStubs();
  const counts: LegacyUsageCounts = {
    snakeCaseTableRowNodes: 0,
    snakeCaseTableHeaderNodes: 0,
    snakeCaseTableCellNodes: 0,
    shadcnRichTextBloks: 0,
    renderInputsUsage: 0,
  };

  for (let index = 0; index < storyStubs.length; index += 1) {
    const story = storyStubs[index];
    if (!story) continue;
    await fetchAndAuditStoryContent(story, counts);
    if (index < storyStubs.length - 1) {
      await sleep(DELAY_MS);
    }
  }

  console.log(`Stories audited: ${storyStubs.length}`);
  console.log(JSON.stringify(counts, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
