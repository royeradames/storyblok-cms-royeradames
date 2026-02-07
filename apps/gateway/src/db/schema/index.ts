/**
 * Gateway app-specific schema.
 *
 * Auth tables (users, sessions, accounts, verifications) live in @repo/db.
 * User-specific data (preferences, saved items) and other app tables live here.
 */

export * from "./user_preferences";
export * from "./saved_items";
export * from "./section-templates";
