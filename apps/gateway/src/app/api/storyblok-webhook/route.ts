import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { db } from "@/db/client";
import { sectionTemplates } from "@/db/schema";
import { eq } from "drizzle-orm";
import { fetchStory } from "@/lib/storyblok";
import {
  derivePremadeBlokSchemas,
  diffSchemas,
  pushDerivedComponents,
  migrateStoryData,
  slugToPrefix,
} from "@/lib/derive-premade-schemas";

/**
 * Storyblok webhook handler.
 *
 * Receives `story.published` events for section-builder stories and:
 * 1. Extracts the template and compares with DB — skips if unchanged
 * 2. Derives premade blok schemas from the new template
 * 3. Diffs against previous schemas to detect field renames/deletions/additions
 * 4. Pushes changed component definitions to Storyblok (create/update/delete)
 * 5. Migrates existing story data for renames/deletions
 * 6. Upserts the template into the section_templates table
 * 7. Invalidates the Vercel data cache
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

    const prefix = slugToPrefix(slug);
    const componentName = `${prefix}_section`;

    // Extract the actual section template from the page wrapper (body[0])
    const template = story.content?.body?.[0] ?? story.content;

    // Load existing template from DB for comparison
    const existing = await db
      .select()
      .from(sectionTemplates)
      .where(eq(sectionTemplates.slug, slug))
      .limit(1);

    const existingTemplate = existing[0]?.template;

    // Skip if template unchanged
    if (
      existingTemplate &&
      JSON.stringify(existingTemplate) === JSON.stringify(template)
    ) {
      console.log(`[webhook] No changes for ${slug}, skipping`);
      return NextResponse.json({ ok: true, unchanged: true });
    }

    // ── Derive and diff premade blok schemas ──

    const spaceId = process.env.STORYBLOK_SPACE_ID;
    const token = process.env.STORYBLOK_PERSONAL_ACCESS_TOKEN;

    if (spaceId && token) {
      const newSchemas = derivePremadeBlokSchemas(template, prefix);

      let oldSchemas: typeof newSchemas = [];
      if (existingTemplate) {
        try {
          oldSchemas = derivePremadeBlokSchemas(existingTemplate as any, prefix);
        } catch {
          // Could not derive old schemas — treat as fresh
        }
      }

      const diff = diffSchemas(oldSchemas, newSchemas);

      // Push changed component definitions
      const hasChanges =
        diff.changedComponents.length > 0 ||
        diff.newComponents.length > 0 ||
        diff.removedComponents.length > 0;

      if (hasChanges) {
        console.log(
          `[webhook] Pushing blok definitions for ${slug}: ` +
            `${diff.newComponents.length} new, ` +
            `${diff.changedComponents.length} changed, ` +
            `${diff.removedComponents.length} removed`,
        );
        await pushDerivedComponents(diff, spaceId, token);
      }

      // Migrate story data if field renames or deletions detected
      if (diff.fieldRenames.length > 0 || diff.fieldDeletions.length > 0) {
        console.log(
          `[webhook] Migrating story data: ` +
            `${diff.fieldRenames.length} renames, ` +
            `${diff.fieldDeletions.length} deletions`,
        );
        await migrateStoryData(diff, spaceId, token);
      }
    } else {
      console.warn(
        "[webhook] STORYBLOK_SPACE_ID or STORYBLOK_PERSONAL_ACCESS_TOKEN not set, " +
          "skipping blok schema derivation",
      );
    }

    // ── Upsert template into DB ──

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
