import type { SearchOptions, SearchResult } from "./types";

// Algolia client - only initialized when credentials are provided
let algoliaClient: ReturnType<
  typeof import("algoliasearch").algoliasearch
> | null = null;

function getAlgoliaClient() {
  if (algoliaClient) return algoliaClient;

  const appId = process.env.ALGOLIA_APP_ID;
  const apiKey = process.env.ALGOLIA_API_KEY;

  if (!appId || !apiKey) {
    console.warn("Algolia credentials not configured");
    return null;
  }

  // Dynamic import to avoid loading when not needed
  const { algoliasearch } =
    require("algoliasearch") as typeof import("algoliasearch");
  algoliaClient = algoliasearch(appId, apiKey);
  return algoliaClient;
}

/**
 * Algolia search implementation
 * Ready but inactive until SEARCH_PROVIDER=algolia
 */
export async function algoliaSearch<T>(
  indexName: string,
  query: string,
  options: SearchOptions = {},
): Promise<SearchResult<T>> {
  const client = getAlgoliaClient();

  if (!client) {
    console.warn("Algolia not configured, returning empty results");
    return {
      hits: [],
      totalHits: 0,
      processingTimeMs: 0,
    };
  }

  const { limit = 20, offset = 0, filters } = options;

  const startTime = performance.now();

  const response = await client.searchSingleIndex<T>({
    indexName,
    searchParams: {
      query,
      hitsPerPage: limit,
      page: Math.floor(offset / limit),
      filters: filters ? buildAlgoliaFilters(filters) : undefined,
    },
  });

  const endTime = performance.now();

  return {
    hits: response.hits,
    totalHits: response.nbHits ?? 0,
    processingTimeMs: Math.round(endTime - startTime),
  };
}

/**
 * Index a record in Algolia (admin operation)
 */
export async function algoliaIndex(
  indexName: string,
  record: Record<string, unknown> & { id: string },
): Promise<void> {
  const adminKey = process.env.ALGOLIA_ADMIN_KEY;
  const appId = process.env.ALGOLIA_APP_ID;

  if (!adminKey || !appId) {
    console.warn("Algolia admin credentials not configured, skipping indexing");
    return;
  }

  const { algoliasearch } =
    require("algoliasearch") as typeof import("algoliasearch");
  const adminClient = algoliasearch(appId, adminKey);

  await adminClient.saveObject({
    indexName,
    body: {
      ...record,
      objectID: record.id,
    },
  });
}

/**
 * Delete a record from Algolia
 */
export async function algoliaDelete(
  indexName: string,
  objectID: string,
): Promise<void> {
  const adminKey = process.env.ALGOLIA_ADMIN_KEY;
  const appId = process.env.ALGOLIA_APP_ID;

  if (!adminKey || !appId) {
    console.warn("Algolia admin credentials not configured, skipping deletion");
    return;
  }

  const { algoliasearch } =
    require("algoliasearch") as typeof import("algoliasearch");
  const adminClient = algoliasearch(appId, adminKey);

  await adminClient.deleteObject({
    indexName,
    objectID,
  });
}

/**
 * Build Algolia filter string from object
 */
function buildAlgoliaFilters(filters: Record<string, unknown>): string {
  return Object.entries(filters)
    .map(([key, value]) => {
      if (typeof value === "string") {
        return `${key}:"${value}"`;
      }
      if (typeof value === "number" || typeof value === "boolean") {
        return `${key}:${value}`;
      }
      if (Array.isArray(value)) {
        return `(${value.map((v) => `${key}:"${v}"`).join(" OR ")})`;
      }
      return "";
    })
    .filter(Boolean)
    .join(" AND ");
}
