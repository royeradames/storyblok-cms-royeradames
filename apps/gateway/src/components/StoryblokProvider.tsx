"use client";

import { storyblokInit, apiPlugin } from "@storyblok/react";
import { components } from "@/components/cms";

// Run at module load so the map exists before any StoryblokComponent renders
storyblokInit({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_PREVIEW_TOKEN,
  use: [apiPlugin],
  components,
  bridge: true,
});

export function StoryblokProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
