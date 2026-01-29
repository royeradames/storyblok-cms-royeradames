/**
 * Seed Preview User Script
 *
 * Creates a preview user for testing authenticated components in preview mode.
 *
 * Usage: bun scripts/seed-preview-user.ts
 */

import { db } from "@repo/db/client";
import { users } from "@repo/db/schema";

const PREVIEW_USER_ID = process.env.PREVIEW_USER_ID || "preview-user-001";

async function seedPreviewUser() {
  console.log("🌱 Seeding preview user...");

  try {
    // Check if user already exists
    const existing = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, PREVIEW_USER_ID),
    });

    if (existing) {
      console.log("✅ Preview user already exists:", existing.email);
      return;
    }

    // Create preview user
    await db.insert(users).values({
      id: PREVIEW_USER_ID,
      name: "Preview User",
      email: "preview@example.com",
      emailVerified: true,
      image: null,
    });

    console.log("✅ Preview user created successfully!");
    console.log("   ID:", PREVIEW_USER_ID);
    console.log("   Email: preview@example.com");
  } catch (error) {
    console.error("❌ Error seeding preview user:", error);
    process.exit(1);
  }
}

seedPreviewUser();
