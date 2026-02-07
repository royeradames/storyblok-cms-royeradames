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
  updatePageBodyWhitelist,
  slugToPrefix,
} from "@/lib/derive-premade-schemas";
import {
  startBuild,
  updateBuild,
  completeBuild,
  failBuild,
} from "@/lib/webhook-status";

/**
 * Storyblok webhook handler.
 *
 * Receives `story.published` events for section-builder stories and:
 * 1. Extracts the template and compares with DB -- skips if unchanged
 * 2. Derives premade blok schemas from the new template
 * 3. Diffs against previous schemas to detect field renames/deletions/additions
 * 4. Pushes changed component definitions to Storyblok (create/update/delete)
 * 5. Migrates existing story data for renames/deletions
 * 6. Upserts the template into the section_templates table
 * 7. Invalidates the Vercel data cache
 *
 * Progress is tracked in the webhook_jobs table and displayed by BuildStatusBanner.
 */
export async function POST(request: NextRequest) {
  let jobId: number | undefined;

  try {
    // Validate webhook secret (skip for bridge-triggered local calls)
    const isBridgeTrigger = request.headers.get("x-bridge-trigger") === "1";
    const webhookSecret = process.env.STORYBLOK_WEBHOOK_SECRET;
    if (webhookSecret && !isBridgeTrigger) {
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

    // ── Start tracking build progress ──
    jobId = await startBuild(slug, "Fetching story content...");

    // Fetch the full story content from Storyblok
    const story = await fetchStory(slug, false);
    if (!story?.content) {
      await failBuild(jobId, `Story not found: ${slug}`);
      return NextResponse.json(
        { error: `Story not found: ${slug}` },
        { status: 404 },
      );
    }

    const prefix = slugToPrefix(slug);
    const componentName = `${prefix}_section`;

    // Extract the actual section template from the page wrapper (body[0])
    const template = story.content?.body?.[0] ?? story.content;

    await updateBuild(jobId, "Comparing with existing template...");

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
      await completeBuild(jobId, "No changes detected");
      return NextResponse.json({ ok: true, unchanged: true });
    }

    // ── Derive and diff premade blok schemas ──

    const spaceId = process.env.STORYBLOK_SPACE_ID;
    const token = process.env.STORYBLOK_PERSONAL_ACCESS_TOKEN;

    if (spaceId && token) {
      await updateBuild(jobId, "Deriving blok schemas...");

      const newSchemas = derivePremadeBlokSchemas(template, prefix);

      let oldSchemas: typeof newSchemas = [];
      if (existingTemplate) {
        try {
          oldSchemas = derivePremadeBlokSchemas(existingTemplate as any, prefix);
        } catch {
          // Could not derive old schemas -- treat as fresh
        }
      }

      const diff = diffSchemas(oldSchemas, newSchemas);

      // Push changed component definitions
      const hasChanges =
        diff.changedComponents.length > 0 ||
        diff.newComponents.length > 0 ||
        diff.removedComponents.length > 0;

      if (hasChanges) {
        const total =
          diff.newComponents.length +
          diff.changedComponents.length +
          diff.removedComponents.length;
        await updateBuild(
          jobId,
          `Pushing ${total} component definition${total !== 1 ? "s" : ""}...`,
        );

        console.log(
          `[webhook] Pushing blok definitions for ${slug}: ` +
            `${diff.newComponents.length} new, ` +
            `${diff.changedComponents.length} changed, ` +
            `${diff.removedComponents.length} removed`,
        );
        await pushDerivedComponents(diff, spaceId, token);
      }

      // Ensure root section blok is in page body whitelist
      const rootBlokName = `${prefix}_section`;
      if (newSchemas.some((c) => c.name === rootBlokName)) {
        await updateBuild(jobId, "Updating page body whitelist...");
        await updatePageBodyWhitelist(rootBlokName, "add", spaceId, token);
      }

      // Remove deleted root bloks from page body whitelist
      for (const removedName of diff.removedComponents) {
        if (removedName.endsWith("_section")) {
          await updatePageBodyWhitelist(removedName, "remove", spaceId, token);
        }
      }

      // Migrate story data if field renames or deletions detected
      if (diff.fieldRenames.length > 0 || diff.fieldDeletions.length > 0) {
        const changes = diff.fieldRenames.length + diff.fieldDeletions.length;
        await updateBuild(
          jobId,
          `Migrating story data (${changes} field change${changes !== 1 ? "s" : ""})...`,
        );

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

    await updateBuild(jobId, "Saving template...");

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

    await completeBuild(jobId, "Section builder updated");

    return NextResponse.json({
      ok: true,
      slug,
      component: componentName,
    });
  } catch (error) {
    console.error("[webhook] Error processing Storyblok webhook:", error);
    if (jobId) {
      await failBuild(
        jobId,
        error instanceof Error ? error.message : "Internal server error",
      ).catch(() => {}); // Don't let status update failure mask the original error
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
