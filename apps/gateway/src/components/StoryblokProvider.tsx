"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { storyblokInit, apiPlugin } from "@storyblok/react";
import { components } from "@/components/cms";

let storyblokInitialized = false;
let bridgeEnabled = false;

function ensureStoryblokClientInit(enableBridge: boolean) {
  // No-op if already initialized with equal or stronger bridge mode.
  if (storyblokInitialized && (!enableBridge || bridgeEnabled)) {
    return;
  }

  storyblokInit({
    accessToken: process.env.NEXT_PUBLIC_STORYBLOK_PREVIEW_TOKEN,
    use: [apiPlugin],
    components,
    bridge: enableBridge,
  });

  storyblokInitialized = true;
  bridgeEnabled = bridgeEnabled || enableBridge;
}

// Initialize without bridge by default to avoid unnecessary bridge-driven reloads
// outside the Storyblok editor context.
ensureStoryblokClientInit(false);

export function StoryblokProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const hasStoryblokParam = searchParams.has("_storyblok");
    const inIframe = window.self !== window.top;
    ensureStoryblokClientInit(hasStoryblokParam && inIframe);
  }, [searchParams]);

  return <>{children}</>;
}
