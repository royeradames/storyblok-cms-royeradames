import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// Load .env from current directory
config();

export default defineConfig({
  schema: "../../packages/db/src/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
