import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const pathname = searchParams.get("pathname") || "/";

  // Disable draft mode
  const draft = await draftMode();
  draft.disable();

  // Remove /preview prefix from pathname
  const redirectPath = pathname.replace(/^\/preview/, "") || "/";

  redirect(redirectPath);
}
