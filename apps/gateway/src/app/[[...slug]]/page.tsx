import { getStoryblokApi, StoryblokStory } from "@storyblok/react/rsc";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

async function fetchStory(slug: string) {
  const storyblokApi = getStoryblokApi();

  try {
    const { data } = await storyblokApi.get(`cdn/stories/${slug}`, {
      version: "published",
      cv: Date.now(), // Cache validation
    });
    return data.story;
  } catch {
    return null;
  }
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const slugPath = slug ? slug.join("/") : "home";

  const story = await fetchStory(slugPath);

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
