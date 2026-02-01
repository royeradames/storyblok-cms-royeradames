import { getStoryblokApi, StoryblokStory } from "@storyblok/react/rsc";
import { draftMode } from "next/headers";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { SeoMetatagsValue } from "@/types/seo";
import { metadataFromStory } from "@/lib/metadata";

interface PageProps {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

type StoryblokVersion = "draft" | "published";

async function fetchStory(slug: string, version: StoryblokVersion) {
  const storyblokApi = getStoryblokApi();

  try {
    const { data } = await storyblokApi.get(`cdn/stories/${slug}`, {
      version,
      cv: Date.now(), // Cache validation - ensures fresh content
    });
    return data.story;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const slugPath = slug ? slug.join("/") : "home";
  const { isEnabled: isDraftMode } = await draftMode();
  const isVisualEditor = resolvedSearchParams._storyblok !== undefined;
  const version: StoryblokVersion =
    isDraftMode || isVisualEditor ? "draft" : "published";

  const story = await fetchStory(slugPath, version);
  const meta = story?.content?.metadata as SeoMetatagsValue | undefined;
  return metadataFromStory(meta);
}

export default async function Page({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const slugPath = slug ? slug.join("/") : "home";

  // Detect if we're in the Visual Editor or Draft Mode
  const { isEnabled: isDraftMode } = await draftMode();
  const isVisualEditor = resolvedSearchParams._storyblok !== undefined;

  // Use draft version for Visual Editor or Draft Mode, otherwise published
  const version: StoryblokVersion =
    isDraftMode || isVisualEditor ? "draft" : "published";

  const story = await fetchStory(slugPath, version);

  if (!story) {
    notFound();
  }

  return <StoryblokStory story={story} />;
}

export async function generateStaticParams() {
  const storyblokApi = getStoryblokApi();

  try {
    const { data } = await storyblokApi.get("cdn/stories", {
      version: "published",
      excluding_fields: "body",
    });

    return data.stories.map((story: { full_slug: string }) => ({
      slug: story.full_slug === "home" ? [] : story.full_slug.split("/"),
    }));
  } catch {
    return [];
  }
}

export const dynamicParams = true;
export const revalidate = 3600; // Revalidate every hour
