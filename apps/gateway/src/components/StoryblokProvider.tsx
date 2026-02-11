"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { storyblokInit, apiPlugin } from "@storyblok/react";
import { components } from "@/components/cms";

type PreviewSyncMode = "live" | "perf";

function resolvePreviewSyncMode(): PreviewSyncMode {
  const configured = process.env.NEXT_PUBLIC_PREVIEW_SYNC_MODE;
  if (configured === "live" || configured === "perf") return configured;
  return process.env.NODE_ENV === "development" ? "live" : "perf";
}

const PREVIEW_SYNC_MODE = resolvePreviewSyncMode();

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

// In dev default to live mode; in prod default to perf mode.
ensureStoryblokClientInit(PREVIEW_SYNC_MODE === "live");

export function StoryblokProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const hasStoryblokParam = searchParams.has("_storyblok");
    const inIframe = window.self !== window.top;
    const shouldEnableBridge =
      PREVIEW_SYNC_MODE === "live" ? true : hasStoryblokParam && inIframe;
    ensureStoryblokClientInit(shouldEnableBridge);
  }, [searchParams]);

  return <>{children}</>;
}
