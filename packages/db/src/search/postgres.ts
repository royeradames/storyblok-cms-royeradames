import { db } from "../client";
import { sql } from "drizzle-orm";
import type { SearchOptions, SearchResult } from "./types";

/**
 * Postgres full-text search implementation
 * Uses ts_vector and ts_query for efficient text search
 */
export async function postgresSearch<T>(
  table: string,
  searchColumns: string[],
  query: string,
  options: SearchOptions = {},
): Promise<SearchResult<T>> {
  const { limit = 20, offset = 0 } = options;
  const startTime = performance.now();

  // Build the ts_vector expression from multiple columns
  const vectorExpression = searchColumns
    .map((col) => `coalesce(${col}, '')`)
    .join(" || ' ' || ");

  const results = await db.execute(sql`
    SELECT *,
      ts_rank(
        to_tsvector('english', ${sql.raw(vectorExpression)}),
        plainto_tsquery('english', ${query})
      ) as search_rank
    FROM ${sql.raw(table)}
    WHERE to_tsvector('english', ${sql.raw(vectorExpression)}) 
      @@ plainto_tsquery('english', ${query})
    ORDER BY search_rank DESC
    LIMIT ${limit}
    OFFSET ${offset}
  `);

  const countResult = await db.execute(sql`
    SELECT COUNT(*) as count
    FROM ${sql.raw(table)}
    WHERE to_tsvector('english', ${sql.raw(vectorExpression)}) 
      @@ plainto_tsquery('english', ${query})
  `);

  const endTime = performance.now();

  return {
    hits: results as unknown as T[],
    totalHits: Number(
      (countResult as unknown as Array<{ count: number }>)[0]?.count ?? 0,
    ),
    processingTimeMs: Math.round(endTime - startTime),
  };
}

/**
 * Simple search helper for a single table with common columns
 */
export async function searchUsers(query: string, options?: SearchOptions) {
  return postgresSearch("users", ["name", "email"], query, options);
}
