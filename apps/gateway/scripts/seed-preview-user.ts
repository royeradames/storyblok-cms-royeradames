/**
 * Seed Preview User (gateway app)
 *
 * Creates a preview user for testing authenticated components in preview mode.
 * Loads env from apps/gateway/.env when run from gateway directory.
 *
 * Usage: bun run db:seed (from apps/gateway)
 */

import { config } from "dotenv";
import * as path from "path";

config({ path: path.join(process.cwd(), ".env") });

const PREVIEW_USER_ID = process.env.PREVIEW_USER_ID || "preview-user-001";

async function seedPreviewUser() {
  const { db } = await import("@repo/db/client");
  const { users } = await import("@repo/db/schema");

  console.log("🌱 Seeding preview user...");

  try {
    const existing = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, PREVIEW_USER_ID),
    });

    if (existing) {
      console.log("✅ Preview user already exists:", existing.email);
      return;
    }

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
