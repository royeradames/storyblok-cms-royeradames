"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Floating banner that shows real-time section-builder webhook progress
 * in the Storyblok Visual Editor preview.
 *
 * How it works (localhost bypass):
 * 1. Listens for Storyblok editor postMessage events (the raw transport
 *    behind the bridge) -- works on localhost without a tunnel
 * 2. When a section-builder page is published, POSTs to the local
 *    /api/storyblok-webhook endpoint to trigger processing
 * 3. Polls GET /api/build-status every 2s to show progress
 * 4. Auto-reloads when the build is done
 *
 * In production the external webhook also fires (from Storyblok servers),
 * but the change-detection in the webhook makes duplicate processing a no-op.
 */

interface BuildStatus {
  active: boolean;
  status: "building" | "done" | "error";
  message: string | null;
  slug: string;
  startedAt: string;
  updatedAt: string;
}

interface BuildStatusResponse extends Partial<BuildStatus> {
  active: boolean;
}

const ACTIVE_POLL_INTERVAL = 2000;
const IDLE_POLL_INTERVALS = [4000, 8000, 12000] as const;
const METRICS_LOG_INTERVAL_MS = 60_000;
const RELOAD_DELAY = 1500;
const AUTO_RELOAD_ON_DONE =
  process.env.NODE_ENV !== "development" ||
  process.env.NEXT_PUBLIC_PREVIEW_AUTO_RELOAD === "1";
const BUILDER_SLUG_REGEX = /\/preview\/((section-builder|element-builder|form-builder)\/[^/]+)/;

export function BuildStatusBanner() {
  const pathname = usePathname();
  const isBuilderPreviewPath = BUILDER_SLUG_REGEX.test(pathname ?? "");
  const [status, setStatus] = useState<BuildStatus | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const reloadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousStatusRef = useRef<string | null>(null);
  const idlePollLevelRef = useRef(0);
  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const metricsRef = useRef({
    requestCount: 0,
    totalDurationMs: 0,
    windowStartedAt: Date.now(),
  });

  // ── Fetch build status ──

  const fetchStatus = useCallback(async () => {
    const startedAt = performance.now();

    try {
      const res = await fetch("/api/build-status", { cache: "no-store" });
      if (!res.ok) return;
      const data: BuildStatusResponse = await res.json();

      // Reset dismissed state when a new build starts
      if (data.active && previousStatusRef.current !== "building") {
        setDismissed(false);
      }
      previousStatusRef.current = data.status ?? null;

      if (data.active || data.status === "done" || data.status === "error") {
        idlePollLevelRef.current = 0;
      } else {
        idlePollLevelRef.current = Math.min(
          idlePollLevelRef.current + 1,
          IDLE_POLL_INTERVALS.length - 1,
        );
      }

      if (data.active || data.status === "done" || data.status === "error") {
        setStatus(data as BuildStatus);
      } else {
        setStatus(null);
      }
    } catch {
      // Silently ignore fetch errors
    } finally {
      const durationMs = performance.now() - startedAt;
      if (process.env.NODE_ENV === "development") {
        metricsRef.current.requestCount += 1;
        metricsRef.current.totalDurationMs += durationMs;

        const elapsed = Date.now() - metricsRef.current.windowStartedAt;
        if (elapsed >= METRICS_LOG_INTERVAL_MS) {
          const avgDuration =
            metricsRef.current.requestCount > 0
              ? metricsRef.current.totalDurationMs / metricsRef.current.requestCount
              : 0;
          const requestsPerMinute =
            (metricsRef.current.requestCount / elapsed) * METRICS_LOG_INTERVAL_MS;

          console.log(
            `[BuildStatusBanner] polling metrics avg=${Math.round(avgDuration)}ms rpm=${requestsPerMinute.toFixed(1)} route=${pathname ?? "unknown"}`,
          );

          metricsRef.current.requestCount = 0;
          metricsRef.current.totalDurationMs = 0;
          metricsRef.current.windowStartedAt = Date.now();
        }
      }
    }
  }, [pathname]);

  // ── Poll build status ──

  useEffect(() => {
    if (!isBuilderPreviewPath) {
      setStatus(null);
      idlePollLevelRef.current = 0;
      if (pollTimerRef.current) {
        clearTimeout(pollTimerRef.current);
        pollTimerRef.current = null;
      }
      return;
    }

    let cancelled = false;

    const scheduleNextPoll = () => {
      if (cancelled) return;
      const hasActiveBuild =
        previousStatusRef.current === "building" || status?.status === "building";
      const nextInterval = hasActiveBuild
        ? ACTIVE_POLL_INTERVAL
        : IDLE_POLL_INTERVALS[idlePollLevelRef.current] ?? ACTIVE_POLL_INTERVAL;

      pollTimerRef.current = setTimeout(async () => {
        await fetchStatus();
        scheduleNextPoll();
      }, nextInterval);
    };

    void fetchStatus().then(() => {
      scheduleNextPoll();
    });

    return () => {
      cancelled = true;
      if (pollTimerRef.current) {
        clearTimeout(pollTimerRef.current);
        pollTimerRef.current = null;
      }
    };
  }, [fetchStatus, isBuilderPreviewPath, status?.status]);

  // ── Listen for Storyblok publish via postMessage ──

  useEffect(() => {
    /**
     * Extract the builder slug from the current preview URL.
     * Works when the preview iframe is showing a builder page.
     */
    const getSlugFromUrl = (): string | null => {
      const match = window.location.pathname.match(BUILDER_SLUG_REGEX);
      return match?.[1] ?? null;
    };

    /**
     * Try to extract a builder slug from the postMessage payload.
     * Storyblok sends various formats; we check common fields.
     */
    const getSlugFromEvent = (data: any): string | null => {
      const slug: string | undefined =
        data.full_slug ??
        data.slug ??
        data.story?.full_slug ??
        data.story?.slug ??
        data.storySlug;

      if (
        slug &&
        (slug.startsWith("section-builder/") ||
          slug.startsWith("element-builder/") ||
          slug.startsWith("form-builder/"))
      ) {
        return slug;
      }

      // If the event has a slugId or storyId, we can't derive the slug
      // Fall back to the current URL
      return null;
    };

    const triggerLocalWebhook = async (slug: string) => {
      console.log(`[BuildStatusBanner] Triggering local webhook for: ${slug}`);
      setStatus({
        active: true,
        status: "building",
        message: "Starting build...",
        slug,
        startedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      try {
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
        // Sync with persisted status as soon as trigger request returns.
        void fetchStatus();
      } catch (e) {
        console.error("[BuildStatusBanner] Failed to trigger local webhook:", e);
        void fetchStatus();
      }
    };

    const handleMessage = (event: MessageEvent) => {
      // Only process messages from the Storyblok editor
      const data = event.data;
      if (!data) return;

      // Storyblok sends events as objects or JSON strings
      let parsed: any = data;
      if (typeof data === "string") {
        try {
          parsed = JSON.parse(data);
        } catch {
          return;
        }
      }
      if (typeof parsed !== "object" || parsed === null) return;

      // Check for published event
      // The bridge uses `action` or `event` depending on the version
      const action: string | undefined =
        parsed.action ?? parsed.event ?? parsed.type;
      if (action !== "published") return;

      console.log("[BuildStatusBanner] Published event received:", parsed);

      // Try to get slug from the event payload, fall back to current URL
      const slug = getSlugFromEvent(parsed) ?? getSlugFromUrl();

      if (slug) {
        setDismissed(false);
        setStatus({
          active: true,
          status: "building",
          message: "Publish detected. Initializing build...",
          slug,
          startedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        triggerLocalWebhook(slug);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // ── Auto-reload when build completes ──

  useEffect(() => {
    if (status?.status === "done" && !dismissed && AUTO_RELOAD_ON_DONE) {
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

  const sectionName =
    status.slug
      ?.replace("section-builder/", "")
      .replace("element-builder/", "")
      .replace("form-builder/", "") ?? "";

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
            {status.status === "done" &&
              (AUTO_RELOAD_ON_DONE ? " Reloading..." : " Ready to reload.")}
          </span>
        </div>

        {(status.status === "error" || status.status === "done") && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {status.status === "done" && !AUTO_RELOAD_ON_DONE && (
              <button
                onClick={() => {
                  window.location.reload();
                }}
                style={{
                  background: "none",
                  border: "1px solid currentColor",
                  borderRadius: "4px",
                  padding: "2px 8px",
                  cursor: "pointer",
                  color: "inherit",
                  fontSize: "12px",
                  opacity: 0.9,
                  flexShrink: 0,
                }}
              >
                Reload now
              </button>
            )}
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
          </div>
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
