import { getStoryblokApi, StoryblokStory } from "@storyblok/react/rsc";
import { notFound } from "next/navigation";
import { ensureStoryblokServerInit } from "@/lib/storyblok/server-init";

ensureStoryblokServerInit();

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

const DEV_PREVIEW_CACHE_TTL_MS = 1500;
const DEV_METRICS_LOG_INTERVAL_MS = 60_000;
const draftStoryCache = new Map<string, { expiresAt: number; story: unknown }>();
const previewMetrics = {
  requestCount: 0,
  cacheHits: 0,
  cacheMisses: 0,
  totalDurationMs: 0,
  windowStartedAt: Date.now(),
};

function getCachedDraftStory(slug: string): unknown | null {
  if (process.env.NODE_ENV !== "development") return null;
  const cached = draftStoryCache.get(slug);
  if (!cached) return null;
  if (cached.expiresAt < Date.now()) {
    draftStoryCache.delete(slug);
    return null;
  }
  return cached.story;
}

function setCachedDraftStory(slug: string, story: unknown): void {
  if (process.env.NODE_ENV !== "development") return;
  draftStoryCache.set(slug, {
    story,
    expiresAt: Date.now() + DEV_PREVIEW_CACHE_TTL_MS,
  });
}

function recordPreviewMetric(durationMs: number, cacheHit: boolean): void {
  if (process.env.NODE_ENV !== "development") return;

  previewMetrics.requestCount += 1;
  previewMetrics.totalDurationMs += durationMs;
  if (cacheHit) {
    previewMetrics.cacheHits += 1;
  } else {
    previewMetrics.cacheMisses += 1;
  }

  const elapsed = Date.now() - previewMetrics.windowStartedAt;
  if (elapsed < DEV_METRICS_LOG_INTERVAL_MS) return;

  const avgDuration =
    previewMetrics.requestCount > 0
      ? previewMetrics.totalDurationMs / previewMetrics.requestCount
      : 0;
  const cacheHitRate =
    previewMetrics.requestCount > 0
      ? (previewMetrics.cacheHits / previewMetrics.requestCount) * 100
      : 0;

  console.log(
    `[PreviewPage] metrics avg=${Math.round(avgDuration)}ms req=${previewMetrics.requestCount} hitRate=${cacheHitRate.toFixed(1)}%`,
  );

  previewMetrics.requestCount = 0;
  previewMetrics.cacheHits = 0;
  previewMetrics.cacheMisses = 0;
  previewMetrics.totalDurationMs = 0;
  previewMetrics.windowStartedAt = Date.now();
}

async function fetchDraftStory(slug: string) {
  const startedAt = performance.now();
  const cached = getCachedDraftStory(slug);
  if (cached) {
    recordPreviewMetric(performance.now() - startedAt, true);
    return cached;
  }

  const storyblokApi = getStoryblokApi();

  try {
    const { data } = await storyblokApi.get(`cdn/stories/${slug}`, {
      version: "draft", // Fetch draft content in preview
      cv: Date.now(),
    });
    setCachedDraftStory(slug, data.story);
    recordPreviewMetric(performance.now() - startedAt, false);
    return data.story;
  } catch {
    recordPreviewMetric(performance.now() - startedAt, false);
    return null;
  }
}

export default async function PreviewPage({ params }: PageProps) {
  const { slug } = await params;
  const slugPath = slug ? slug.join("/") : "home";

  const story = await fetchDraftStory(slugPath);

  if (!story) {
    notFound();
  }

  return <StoryblokStory story={story} />;
}

// No static generation for preview - always dynamic
export const dynamic = "force-dynamic";
