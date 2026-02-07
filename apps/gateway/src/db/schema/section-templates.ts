import { pgTable, serial, text, jsonb, timestamp } from "drizzle-orm/pg-core";

/**
 * Stores raw builder templates fetched from Storyblok section-builder stories.
 *
 * Written by the /api/storyblok-webhook route on publish.
 * Read by getTemplate() in lib/templates.ts (cached by Vercel data cache).
 */
export const sectionTemplates = pgTable("section_templates", {
  id: serial("id").primaryKey(),
  /** Storyblok story slug, e.g. "section-builders/case-studies-2" */
  slug: text("slug").notNull().unique(),
  /** Component name used for lookup, e.g. "case_studies_2_section" */
  component: text("component").notNull().unique(),
  /** The raw builder template JSON object */
  template: jsonb("template").notNull(),
  /** Last time the template was updated from Storyblok */
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
