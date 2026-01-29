// Database client
export { db, type Database } from "./client";

// Schema
export * from "./schema";

// Search
export {
  search,
  indexRecord,
  deleteFromIndex,
  getSearchProvider,
  type SearchProvider,
  type SearchOptions,
  type SearchResult,
} from "./search";
