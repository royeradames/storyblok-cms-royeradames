"use client";

import { useEffect, useState, useCallback, useRef } from "react";

/**
 * Floating banner that shows real-time section-builder webhook progress
 * in the Storyblok Visual Editor preview.
 *
 * Polls GET /api/build-status every 2 seconds. Shows:
 * - Building: amber bar with spinner + step message
 * - Done: green bar + auto-reloads after 1.5s
 * - Error: red bar with message + dismiss button
 * - Idle: renders nothing
 */

interface BuildStatus {
  active: boolean;
  status: "building" | "done" | "error";
  message: string | null;
  slug: string;
  startedAt: string;
  updatedAt: string;
}

const POLL_INTERVAL = 2000;
const RELOAD_DELAY = 1500;

export function BuildStatusBanner() {
  const [status, setStatus] = useState<BuildStatus | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const reloadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousStatusRef = useRef<string | null>(null);

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

  // Poll on an interval
  useEffect(() => {
    // Only poll if we're inside Storyblok's Visual Editor (bridge is active)
    const isInEditor =
      typeof window !== "undefined" &&
      (window.location !== window.parent?.location || // inside iframe
        window.location.search.includes("_storyblok"));

    if (!isInEditor) return;

    fetchStatus();
    const interval = setInterval(fetchStatus, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  // Auto-reload when build completes
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

  // Nothing to show
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
          {/* Status icon */}
          {status.status === "building" && <Spinner />}
          {status.status === "done" && (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M13.5 4.5L6 12L2.5 8.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          {status.status === "error" && (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 5v3.5M8 10.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          )}

          {/* Message */}
          <span>
            <strong style={{ fontWeight: 600 }}>
              {sectionName}
            </strong>
            {": "}
            {status.message}
            {status.status === "done" && " Reloading..."}
          </span>
        </div>

        {/* Dismiss button (only for error or done) */}
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

/** Small CSS spinner for the building state. */
function Spinner() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      style={{ animation: "spin 1s linear infinite", flexShrink: 0 }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      <circle
        cx="8"
        cy="8"
        r="6"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="28"
        strokeDashoffset="8"
        strokeLinecap="round"
      />
    </svg>
  );
}
