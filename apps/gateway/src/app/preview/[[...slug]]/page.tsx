import { getStoryblokApi, StoryblokStory } from "@storyblok/react/rsc";
import { notFound } from "next/navigation";

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
