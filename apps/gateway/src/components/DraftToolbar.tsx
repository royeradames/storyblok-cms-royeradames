"use client";

import { usePathname } from "next/navigation";
import { Button, Badge } from "@repo/ui";

export function DraftToolbar() {
  const pathname = usePathname();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-100 border-b-2 border-yellow-400 px-4 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-yellow-200">
            🔧 Draft Mode
          </Badge>
          <span className="text-sm text-yellow-800">
            You are viewing unpublished content
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" asChild>
            <a href="/preview/dev">Scenario Manager</a>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <a
              href={`/api/exit-preview?pathname=${encodeURIComponent(pathname)}`}
            >
              Exit Preview
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
