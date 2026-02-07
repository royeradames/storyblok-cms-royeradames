import { db } from "@/db/client";
import { webhookJobs } from "@/db/schema";
import { eq, desc, or, gt } from "drizzle-orm";

/**
 * Webhook build status tracker.
 *
 * Used by the /api/storyblok-webhook route to report progress,
 * and by the /api/build-status endpoint to serve it to the
 * BuildStatusBanner client component.
 */

/** Start a new build job. Returns the job ID for subsequent updates. */
export async function startBuild(slug: string, message = "Starting..."): Promise<number> {
  const [row] = await db
    .insert(webhookJobs)
    .values({
      slug,
      status: "building",
      message,
      startedAt: new Date(),
      updatedAt: new Date(),
    })
    .returning({ id: webhookJobs.id });

  return row!.id;
}

/** Update the progress message on an active build. */
export async function updateBuild(jobId: number, message: string): Promise<void> {
  await db
    .update(webhookJobs)
    .set({ message, updatedAt: new Date() })
    .where(eq(webhookJobs.id, jobId));
}

/** Mark a build as successfully completed. */
export async function completeBuild(jobId: number, message = "Done"): Promise<void> {
  await db
    .update(webhookJobs)
    .set({ status: "done", message, updatedAt: new Date() })
    .where(eq(webhookJobs.id, jobId));
}

/** Mark a build as failed. */
export async function failBuild(jobId: number, error: string): Promise<void> {
  await db
    .update(webhookJobs)
    .set({ status: "error", message: error, updatedAt: new Date() })
    .where(eq(webhookJobs.id, jobId));
}

/**
 * Get the latest active or recently-completed build status.
 *
 * Returns the most recent job that is either:
 * - Currently "building", OR
 * - Completed ("done" or "error") within the last 10 seconds
 *   (so the banner has time to display the final state before disappearing)
 *
 * Returns null if there's nothing to show.
 */
export async function getLatestBuildStatus() {
  const tenSecondsAgo = new Date(Date.now() - 10_000);

  const [row] = await db
    .select()
    .from(webhookJobs)
    .where(
      or(
        eq(webhookJobs.status, "building"),
        gt(webhookJobs.updatedAt, tenSecondsAgo),
      ),
    )
    .orderBy(desc(webhookJobs.id))
    .limit(1);

  if (!row) return null;

  return {
    active: row.status === "building",
    status: row.status as "building" | "done" | "error",
    message: row.message,
    slug: row.slug,
    startedAt: row.startedAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}
