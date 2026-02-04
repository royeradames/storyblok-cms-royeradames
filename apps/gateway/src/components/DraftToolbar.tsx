"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Button, Badge } from "@repo/ui";
import { DynamicIcon } from "@repo/shared-cms";

export function DraftToolbar() {
  const pathname = usePathname();
  const { setTheme, resolvedTheme } = useTheme();
  const [isLogging, setIsLogging] = useState(false);

  const isDark = resolvedTheme === "dark";

  function toggleTheme() {
    setTheme(isDark ? "light" : "dark");
  }

  async function logPageBlok() {
    const pathSlug = pathname?.replace(/^\/preview\/?/, "").replace(/\/$/, "") ?? "";
    const slug = pathSlug === "" ? "home" : pathSlug;

    setIsLogging(true);
    try {
      const res = await fetch(
        `/api/preview-story?slug=${encodeURIComponent(slug)}`,
      );
      if (!res.ok) throw new Error("Fetch failed");
      const story = await res.json();
      console.log("Page blok (story.content):", story?.content);
    } catch (e) {
      console.error("Could not load preview story:", e);
    } finally {
      setIsLogging(false);
    }
  }

  return (
    <div className="mb-4 bg-yellow-100 border-b-2 border-yellow-400 px-4 py-2 dark:bg-yellow-950 dark:border-yellow-800">
      <div className="max-w-7xl mx-auto flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-200">
            🔧 Draft Mode
          </Badge>
          <span className="text-sm text-yellow-800 dark:text-yellow-200">
            You are viewing unpublished content
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={logPageBlok}
            disabled={isLogging}
            title="Log current page blok to console"
          >
            {isLogging ? "…" : "Log page blok"}
          </Button>
          <Button size="sm" variant="outline" asChild>
            <a href="/preview/dev">Scenario Manager</a>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <a
              href={`/api/exit-preview?pathname=${encodeURIComponent(
                pathname,
              )}`}
            >
              Exit Preview
            </a>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={toggleTheme}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            <DynamicIcon
              name={isDark ? "sun" : "moon"}
              size={16}
              className="size-4"
            />
          </Button>
        </div>
      </div>
    </div>
  );
}
