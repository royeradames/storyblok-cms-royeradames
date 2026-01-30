import {
  storyblokInit,
  apiPlugin,
  getStoryblokApi,
} from "@storyblok/react/rsc";
import { components } from "@/components/cms";

/**
 * Initialize Storyblok for server-side rendering
 */
export function initStoryblok(preview = false) {
  const accessToken = preview
    ? process.env.NEXT_PUBLIC_STORYBLOK_PREVIEW_TOKEN
    : process.env.STORYBLOK_PUBLIC_TOKEN;

  return storyblokInit({
    accessToken,
    use: [apiPlugin],
    components,
  });
}

/**
 * Get Storyblok API instance
 */
export { getStoryblokApi };

/**
 * Fetch a story by slug
 */
export async function fetchStory(slug: string, preview = false) {
  initStoryblok(preview);
  const api = getStoryblokApi();

  try {
    const { data } = await api.get(`cdn/stories/${slug}`, {
      version: preview ? "draft" : "published",
      cv: Date.now(),
    });
    return data.story;
  } catch {
    return null;
  }
}

/**
 * Fetch all stories
 */
export async function fetchStories(options?: {
  preview?: boolean;
  startsWith?: string;
  perPage?: number;
}) {
  const { preview = false, startsWith, perPage = 100 } = options || {};

  initStoryblok(preview);
  const api = getStoryblokApi();

  try {
    const { data } = await api.get("cdn/stories", {
      version: preview ? "draft" : "published",
      starts_with: startsWith,
      per_page: perPage,
      cv: Date.now(),
    });
    return data.stories;
  } catch {
    return [];
  }
}
