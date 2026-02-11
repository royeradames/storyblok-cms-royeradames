import { getStoryblokApi, StoryblokStory } from "@storyblok/react/rsc";
import { notFound } from "next/navigation";
import { ensureStoryblokServerInit } from "@/lib/storyblok/server-init";

ensureStoryblokServerInit();

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

const DEV_PREVIEW_CACHE_TTL_MS = 1500;
const draftStoryCache = new Map<string, { expiresAt: number; story: unknown }>();

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

async function fetchDraftStory(slug: string) {
  const cached = getCachedDraftStory(slug);
  if (cached) return cached;

  const storyblokApi = getStoryblokApi();

  try {
    const { data } = await storyblokApi.get(`cdn/stories/${slug}`, {
      version: "draft", // Fetch draft content in preview
      cv: Date.now(),
    });
    setCachedDraftStory(slug, data.story);
    return data.story;
  } catch {
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
