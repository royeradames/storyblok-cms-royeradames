import { NextResponse } from "next/server";
import { getLatestBuildStatus } from "@/lib/webhook-status";

/**
 * Returns the latest section-builder webhook build status.
 *
 * Polled by BuildStatusBanner every 2 seconds in the Storyblok Visual Editor
 * preview to show real-time progress when a section-builder page is published.
 *
 * Response shape:
 *   { active: boolean, status, message, slug, startedAt, updatedAt }
 *   or { active: false } when idle.
 */
export async function GET() {
  try {
    const status = await getLatestBuildStatus();

    if (!status) {
      return NextResponse.json({ active: false }, {
        headers: { "Cache-Control": "no-store" },
      });
    }

    return NextResponse.json(status, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("[build-status] Error:", error);
    return NextResponse.json({ active: false }, {
      status: 500,
      headers: { "Cache-Control": "no-store" },
    });
  }
}
