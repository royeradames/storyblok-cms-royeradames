import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "@repo/db/schema";

/**
 * Saved items / bookmarks – user references to CMS content (e.g. Storyblok stories).
 */
export const savedItems = pgTable("saved_items", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  storyId: text("story_id").notNull(), // Storyblok story uuid
  slug: text("slug"), // full_slug for display / URL
  title: text("title"), // cached title
  type: text("type").default("story"), // story | page | etc.
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type SavedItem = typeof savedItems.$inferSelect;
export type NewSavedItem = typeof savedItems.$inferInsert;
