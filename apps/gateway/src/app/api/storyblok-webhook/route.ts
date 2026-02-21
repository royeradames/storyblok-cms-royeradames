import { NextRequest, NextResponse } from "next/server";
import { fetchStory } from "@/lib/storyblok";
import {
  normalizeBuilderTemplate,
  resolveTemplateComponentName,
  derivePrefixFromComponentName,
  slugToBuilderPrefix,
} from "@repo/shared-cms/builder-templates";
import {
  derivePremadeBlokSchemas,
  diffSchemas,
  pushDerivedComponents,
  ensureDerivedComponents,
  migrateStoryData,
  updatePageBodyWhitelist,
} from "@/lib/derive-premade-schemas";
import {
  startBuild,
  updateBuild,
  completeBuild,
  failBuild,
} from "@/lib/webhook-status";

const BUILDER_ROOT_COMPONENTS = new Set([
  "page",
  "element_builder_page",
  "form_builder_page",
]);
const BUILDER_SLUG_PREFIXES = [
  "section-builder/",
  "element-builder/",
  "form-builder/",
];

/**
 * Storyblok webhook handler.
 *
 * Receives `story.published` events for section-builder stories and:
 * 1. Extracts template content from the published builder story
 * 2. Derives premade blok schemas from the template
 * 3. Pushes derived component definitions and safety-syncs Storyblok components
 * 4. Reports that template artifact regeneration is required for repo sync
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
    if (
      !slug ||
      !BUILDER_SLUG_PREFIXES.some((prefix) => slug.startsWith(prefix))
    ) {
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
    const storyRootComponent = story.content?.component;
    if (
      typeof storyRootComponent === "string" &&
      !BUILDER_ROOT_COMPONENTS.has(storyRootComponent)
    ) {
      await completeBuild(
        jobId,
        `Skipped (unsupported root component: ${storyRootComponent})`,
      );
      return NextResponse.json({ ok: true, skipped: true });
    }

    // Extract and normalize template (element-builder page-level fallback supported)
    const template = normalizeBuilderTemplate(story.content);
    const slugPrefix = slugToBuilderPrefix(slug);
    const componentName = resolveTemplateComponentName(template, slugPrefix);
    const derivationPrefix = derivePrefixFromComponentName(componentName);

    // ── Derive and diff premade blok schemas ──

    const spaceId = process.env.STORYBLOK_SPACE_ID;
    const token = process.env.STORYBLOK_PERSONAL_ACCESS_TOKEN;

    if (spaceId && token) {
      await updateBuild(jobId, "Deriving blok schemas...");

      const newSchemas = derivePremadeBlokSchemas(template, derivationPrefix);

      const oldSchemas: typeof newSchemas = [];
      const oldRootComponentName: string | null = null;

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

      // Ensure all derived schemas are in sync with Storyblok (safety net)
      const synced = await ensureDerivedComponents(newSchemas, spaceId, token);
      if (synced > 0) {
        console.log(`[webhook] Ensured ${synced} stale component(s) synced`);
      }

      // Ensure root section blok is in page body whitelist
      const rootBlokName = componentName;
      if (newSchemas.some((c) => c.name === rootBlokName)) {
        await updateBuild(jobId, "Updating page body whitelist...");
        await updatePageBodyWhitelist(rootBlokName, "add", spaceId, token);
      }

      // Remove deleted root bloks from page body whitelist
      for (const removedName of diff.removedComponents) {
        if (
          removedName.endsWith("_section") ||
          removedName === oldRootComponentName
        ) {
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

    await updateBuild(
      jobId,
      "Builder publish received. Run storyblok:seed:templates in packages/shared-cms and commit generated artifacts.",
    );

    console.log(`[webhook] Builder publish processed: ${slug} → ${componentName}`);

    await completeBuild(
      jobId,
      "Template sync required (run storyblok:seed:templates in packages/shared-cms)",
    );

    return NextResponse.json({
      ok: true,
      slug,
      component: componentName,
      templateSyncRequired: true,
      nextStep:
        "Run bun run storyblok:seed:templates in packages/shared-cms, commit generated template artifacts, and deploy.",
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
