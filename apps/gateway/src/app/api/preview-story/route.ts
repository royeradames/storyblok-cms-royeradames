import { fetchStory } from "@/lib/storyblok";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug") ?? "home";

  try {
    const story = await fetchStory(slug, true);
    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }
    return NextResponse.json(story);
  } catch (e) {
    console.error("Preview story fetch failed:", e);
    return NextResponse.json(
      { error: "Failed to fetch story" },
      { status: 500 },
    );
  }
}
