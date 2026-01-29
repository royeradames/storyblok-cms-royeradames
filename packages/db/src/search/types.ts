export type SearchProvider = "postgres" | "algolia";

export interface SearchOptions {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

export interface SearchResult<T> {
  hits: T[];
  totalHits: number;
  processingTimeMs: number;
}
