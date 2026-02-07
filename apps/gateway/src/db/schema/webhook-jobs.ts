import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

/**
 * Tracks webhook processing progress so the client-side BuildStatusBanner
 * can show real-time build status in the Storyblok Visual Editor preview.
 *
 * Written by the /api/storyblok-webhook route.
 * Read by the /api/build-status route (polled by BuildStatusBanner).
 */
export const webhookJobs = pgTable("webhook_jobs", {
  id: serial("id").primaryKey(),
  /** Storyblok story slug, e.g. "section-builder/case-studies-2" */
  slug: text("slug").notNull(),
  /** "building" | "done" | "error" */
  status: text("status").notNull(),
  /** Human-readable progress message */
  message: text("message"),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
