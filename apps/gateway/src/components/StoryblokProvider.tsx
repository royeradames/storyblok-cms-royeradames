"use client";

import { useEffect } from "react";
import { storyblokInit, apiPlugin } from "@storyblok/react";
import { components } from "@repo/cms";

// Check if we're in the Visual Editor iframe
const isVisualEditor = () => {
  if (typeof window === "undefined") return false;
  return (
    window.self !== window.top && window.location.search.includes("_storyblok")
  );
};

export function StoryblokProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize client-side Storyblok for Visual Editor
    if (isVisualEditor()) {
      storyblokInit({
        accessToken: process.env.NEXT_PUBLIC_STORYBLOK_PREVIEW_TOKEN,
        use: [apiPlugin],
        components,
        bridge: true,
      });
    }
  }, []);

  return <>{children}</>;
}
