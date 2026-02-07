"use client";

import { useEffect, useState, useCallback, useRef } from "react";

/**
 * Floating banner that shows real-time section-builder webhook progress
 * in the Storyblok Visual Editor preview.
 *
 * How it works:
 * 1. Listens for the Storyblok bridge `published` event
 * 2. When a section-builder page is published, POSTs to the local
 *    /api/storyblok-webhook endpoint (so it works in dev without a tunnel)
 * 3. Polls GET /api/build-status every 2s to show progress
 * 4. Auto-reloads when the build is done
 */

interface BuildStatus {
  active: boolean;
  status: "building" | "done" | "error";
  message: string | null;
  slug: string;
  startedAt: string;
  updatedAt: string;
}

// StoryblokBridge is already declared by @storyblok/react; we just use it.

const POLL_INTERVAL = 2000;
const RELOAD_DELAY = 1500;

export function BuildStatusBanner() {
  const [status, setStatus] = useState<BuildStatus | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const reloadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousStatusRef = useRef<string | null>(null);
  const pollingRef = useRef(false);

  // ── Fetch build status ──

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/build-status", { cache: "no-store" });
      if (!res.ok) return;
      const data: BuildStatus = await res.json();

      // Reset dismissed state when a new build starts
      if (data.active && previousStatusRef.current !== "building") {
        setDismissed(false);
      }
      previousStatusRef.current = data.status ?? null;

      if (data.active || data.status === "done" || data.status === "error") {
        setStatus(data);
      } else {
        setStatus(null);
      }
    } catch {
      // Silently ignore fetch errors
    }
  }, []);

  // ── Start/stop polling ──

  const startPolling = useCallback(() => {
    if (pollingRef.current) return;
    pollingRef.current = true;
    fetchStatus();
  }, [fetchStatus]);

  useEffect(() => {
    if (!pollingRef.current) return;

    const interval = setInterval(fetchStatus, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchStatus, status]); // re-subscribe when status changes

  // Always poll (the banner is only in the preview layout)
  useEffect(() => {
    pollingRef.current = true;
    fetchStatus();
    const interval = setInterval(fetchStatus, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  // ── Listen for Storyblok bridge publish events ──

  useEffect(() => {
    // Extract the section-builder slug from the current preview URL
    const getSectionBuilderSlug = (): string | null => {
      // URL pattern: /preview/section-builder/case-studies-2
      const match = window.location.pathname.match(
        /\/preview\/(section-builder\/[^/]+)/,
      );
      return match?.[1] ?? null;
    };

    const triggerLocalWebhook = async (slug: string) => {
      try {
        // POST to our own webhook endpoint to trigger local processing
        await fetch("/api/storyblok-webhook", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-bridge-trigger": "1",
          },
          body: JSON.stringify({
            action: "published",
            full_slug: slug,
          }),
        });
      } catch (e) {
        console.error("[BuildStatusBanner] Failed to trigger local webhook:", e);
      }
    };

    const handlePublished = () => {
      const slug = getSectionBuilderSlug();
      if (slug) {
        console.log(`[BuildStatusBanner] Published detected for: ${slug}`);
        setDismissed(false);
        startPolling();
        triggerLocalWebhook(slug);
      }
    };

    // Try to listen via the global storyblok bridge
    const tryListen = () => {
      const win = window as any;
      if (win.storyblok?.on) {
        win.storyblok.on("published", handlePublished);
        return true;
      }
      // Try StoryblokBridge constructor
      if (win.StoryblokBridge) {
        const bridge = new win.StoryblokBridge();
        bridge.on("published", handlePublished);
        return true;
      }
      return false;
    };

    // The bridge might not be loaded yet, retry a few times
    if (!tryListen()) {
      const retryInterval = setInterval(() => {
        if (tryListen()) clearInterval(retryInterval);
      }, 1000);

      // Stop retrying after 10s
      const timeout = setTimeout(() => clearInterval(retryInterval), 10_000);

      return () => {
        clearInterval(retryInterval);
        clearTimeout(timeout);
      };
    }
  }, [startPolling]);

  // ── Auto-reload when build completes ──

  useEffect(() => {
    if (status?.status === "done" && !dismissed) {
      reloadTimerRef.current = setTimeout(() => {
        window.location.reload();
      }, RELOAD_DELAY);
    }

    return () => {
      if (reloadTimerRef.current) {
        clearTimeout(reloadTimerRef.current);
        reloadTimerRef.current = null;
      }
    };
  }, [status?.status, dismissed]);

  // ── Render ──

  if (!status || dismissed) return null;

  const sectionName = status.slug?.replace("section-builder/", "") ?? "";

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 99999,
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          padding: "10px 16px",
          fontSize: "13px",
          lineHeight: "1.4",
          ...(status.status === "building"
            ? { background: "#fef3c7", color: "#92400e", borderBottom: "2px solid #f59e0b" }
            : status.status === "done"
              ? { background: "#d1fae5", color: "#065f46", borderBottom: "2px solid #10b981" }
              : { background: "#fee2e2", color: "#991b1b", borderBottom: "2px solid #ef4444" }),
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {status.status === "building" && <Spinner />}
          {status.status === "done" && (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          {status.status === "error" && (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 5v3.5M8 10.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          )}

          <span>
            <strong style={{ fontWeight: 600 }}>{sectionName}</strong>
            {": "}
            {status.message}
            {status.status === "done" && " Reloading..."}
          </span>
        </div>

        {(status.status === "error" || status.status === "done") && (
          <button
            onClick={() => {
              setDismissed(true);
              if (reloadTimerRef.current) {
                clearTimeout(reloadTimerRef.current);
                reloadTimerRef.current = null;
              }
            }}
            style={{
              background: "none",
              border: "1px solid currentColor",
              borderRadius: "4px",
              padding: "2px 8px",
              cursor: "pointer",
              color: "inherit",
              fontSize: "12px",
              opacity: 0.8,
              flexShrink: 0,
            }}
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ animation: "spin 1s linear infinite", flexShrink: 0 }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeDasharray="28" strokeDashoffset="8" strokeLinecap="round" />
    </svg>
  );
}
