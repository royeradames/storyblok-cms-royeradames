import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { db } from "@/db/client";
import { sectionTemplates } from "@/db/schema";
import { eq } from "drizzle-orm";
import { fetchStory } from "@/lib/storyblok";

/**
 * Storyblok webhook handler.
 *
 * Receives `story.published` events for section-builder stories,
 * fetches the full story content, upserts it into the section_templates
 * table, and invalidates the Vercel data cache.
 *
 * Configure in Storyblok: Settings → Webhooks → Story published
 * URL: https://<your-domain>/api/storyblok-webhook
 * Secret: STORYBLOK_WEBHOOK_SECRET env var
 */
export async function POST(request: NextRequest) {
  try {
    // Validate webhook secret
    const webhookSecret = process.env.STORYBLOK_WEBHOOK_SECRET;
    if (webhookSecret) {
      const signature = request.headers.get("webhook-signature");
      if (signature !== webhookSecret) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const body = await request.json();

    // Only process story published events
    const action: string | undefined = body.action;
    if (action !== "published") {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const slug: string | undefined = body.full_slug ?? body.story?.full_slug;
    if (!slug || !slug.startsWith("section-builder/")) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    // Fetch the full story content from Storyblok
    const story = await fetchStory(slug, false);
    if (!story?.content) {
      return NextResponse.json(
        { error: `Story not found: ${slug}` },
        { status: 404 },
      );
    }

    // Derive component name from slug:
    // "section-builder/case-studies-2" → "case_studies_2_section"
    const sectionSlug = slug.replace("section-builder/", "");
    const componentName =
      sectionSlug.replace(/-/g, "_") + "_section";

    // Extract the actual section template from the page wrapper (body[0])
    const template = story.content?.body?.[0] ?? story.content;

    // Upsert into section_templates
    const existing = await db
      .select()
      .from(sectionTemplates)
      .where(eq(sectionTemplates.slug, slug))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(sectionTemplates)
        .set({
          component: componentName,
          template,
          updatedAt: new Date(),
        })
        .where(eq(sectionTemplates.slug, slug));
    } else {
      await db.insert(sectionTemplates).values({
        slug,
        component: componentName,
        template,
      });
    }

    // Invalidate cached templates so next read fetches fresh data
    revalidateTag("section-templates");

    console.log(
      `[webhook] Upserted template: ${slug} → ${componentName}`,
    );

    return NextResponse.json({
      ok: true,
      slug,
      component: componentName,
    });
  } catch (error) {
    console.error("[webhook] Error processing Storyblok webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
