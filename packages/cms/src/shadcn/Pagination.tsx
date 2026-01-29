"use client";

import { storyblokEditable } from "@storyblok/react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@repo/ui";
import type { SbBlokData } from "@storyblok/react";

export interface ShadcnPaginationBlok extends SbBlokData {
  total_pages: number;
  current_page: number;
  base_url: string;
  show_ellipsis?: boolean;
  visible_pages?: number;
}

export function ShadcnPagination({ blok }: { blok: ShadcnPaginationBlok }) {
  const { total_pages, current_page, base_url, visible_pages = 5 } = blok;

  // Calculate visible page range
  const half = Math.floor(visible_pages / 2);
  let start = Math.max(1, current_page - half);
  const end = Math.min(total_pages, start + visible_pages - 1);
  start = Math.max(1, end - visible_pages + 1);

  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const getPageUrl = (page: number) => `${base_url}?page=${page}`;

  return (
    <Pagination {...storyblokEditable(blok)}>
      <PaginationContent>
        {current_page > 1 && (
          <PaginationItem>
            <PaginationPrevious href={getPageUrl(current_page - 1)} />
          </PaginationItem>
        )}

        {blok.show_ellipsis && start > 1 && (
          <>
            <PaginationItem>
              <PaginationLink href={getPageUrl(1)}>1</PaginationLink>
            </PaginationItem>
            {start > 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
          </>
        )}

        {pages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href={getPageUrl(page)}
              isActive={page === current_page}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {blok.show_ellipsis && end < total_pages && (
          <>
            {end < total_pages - 1 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink href={getPageUrl(total_pages)}>
                {total_pages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        {current_page < total_pages && (
          <PaginationItem>
            <PaginationNext href={getPageUrl(current_page + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
