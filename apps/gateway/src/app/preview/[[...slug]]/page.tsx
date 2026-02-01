import { getStoryblokApi, StoryblokStory } from "@storyblok/react/rsc";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { SeoMetatagsValue } from "@/types/seo";
import { metadataFromStory } from "@/lib/metadata";

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

async function fetchDraftStory(slug: string) {
  const storyblokApi = getStoryblokApi();

  try {
    const { data } = await storyblokApi.get(`cdn/stories/${slug}`, {
      version: "draft", // Fetch draft content in preview
      cv: Date.now(),
    });
    return data.story;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const slugPath = slug ? slug.join("/") : "home";
  const story = await fetchDraftStory(slugPath);
  const meta = story?.content?.metadata as SeoMetatagsValue | undefined;
  return metadataFromStory(meta);
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
