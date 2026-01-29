"use client";

import { storyblokEditable } from "@storyblok/react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui";
import type { SbBlokData } from "@storyblok/react";

export interface ShadcnTableCellBlok extends SbBlokData {
  content: string;
  is_header?: boolean;
  align?: "left" | "center" | "right";
}

export interface ShadcnTableRowBlok extends SbBlokData {
  cells: ShadcnTableCellBlok[];
}

export interface ShadcnTableBlok extends SbBlokData {
  caption?: string;
  headers?: ShadcnTableCellBlok[];
  rows?: ShadcnTableRowBlok[];
  striped?: boolean;
}

export function ShadcnTable({ blok }: { blok: ShadcnTableBlok }) {
  return (
    <Table {...storyblokEditable(blok)}>
      {blok.caption && <TableCaption>{blok.caption}</TableCaption>}
      {blok.headers && blok.headers.length > 0 && (
        <TableHeader>
          <TableRow>
            {blok.headers.map((header) => (
              <TableHead
                key={header._uid}
                className={`text-${header.align || "left"}`}
                {...storyblokEditable(header)}
              >
                {header.content}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
      )}
      <TableBody>
        {blok.rows?.map((row, rowIndex) => (
          <TableRow
            key={row._uid}
            className={blok.striped && rowIndex % 2 === 1 ? "bg-muted/50" : ""}
            {...storyblokEditable(row)}
          >
            {row.cells?.map((cell) => (
              <TableCell
                key={cell._uid}
                className={`text-${cell.align || "left"}`}
                {...storyblokEditable(cell)}
              >
                {cell.content}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
