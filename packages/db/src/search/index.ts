import { postgresSearch } from "./postgres";
import { algoliaSearch, algoliaIndex, algoliaDelete } from "./algolia";
import type { SearchProvider, SearchOptions, SearchResult } from "./types";

export type { SearchProvider, SearchOptions, SearchResult };

const provider = (process.env.SEARCH_PROVIDER || "postgres") as SearchProvider;

/**
 * Universal search function that routes to the configured provider
 *
 * @param indexOrTable - Algolia index name or Postgres table name
 * @param query - Search query string
 * @param options - Search options (limit, offset, filters)
 * @param searchColumns - Postgres only: columns to search in
 */
export async function search<T>(
  indexOrTable: string,
  query: string,
  options?: SearchOptions,
  searchColumns?: string[],
): Promise<SearchResult<T>> {
  switch (provider) {
    case "algolia":
      return algoliaSearch<T>(indexOrTable, query, options);
    case "postgres":
    default:
      if (!searchColumns) {
        throw new Error(
          "searchColumns is required for Postgres search provider",
        );
      }
      return postgresSearch<T>(indexOrTable, searchColumns, query, options);
  }
}

/**
 * Index a record (only works with Algolia provider)
 */
export async function indexRecord(
  indexName: string,
  record: Record<string, unknown> & { id: string },
): Promise<void> {
  if (provider === "algolia") {
    await algoliaIndex(indexName, record);
  }
  // Postgres doesn't need explicit indexing - uses ts_vector at query time
}

/**
 * Delete a record from search index (only works with Algolia provider)
 */
export async function deleteFromIndex(
  indexName: string,
  objectID: string,
): Promise<void> {
  if (provider === "algolia") {
    await algoliaDelete(indexName, objectID);
  }
  // Postgres handles this automatically when record is deleted
}

/**
 * Get the current search provider
 */
export function getSearchProvider(): SearchProvider {
  return provider;
}
