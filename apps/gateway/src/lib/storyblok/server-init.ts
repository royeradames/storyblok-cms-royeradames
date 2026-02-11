import { storyblokInit, apiPlugin } from "@storyblok/react/rsc";
import { components } from "@/components/cms";

let initialized = false;

/**
 * Initializes Storyblok RSC integration lazily for CMS routes.
 * Keeping this out of root layout reduces global invalidation fan-out in dev.
 */
export function ensureStoryblokServerInit() {
  if (initialized) return;

  storyblokInit({
    accessToken: process.env.NEXT_PUBLIC_STORYBLOK_PREVIEW_TOKEN,
    use: [apiPlugin],
    components,
  });

  initialized = true;
}
