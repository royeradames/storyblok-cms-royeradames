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
  cn,
} from "@repo/ui";
import type { SbBlokData } from "@storyblok/react";
import { buildStyleClasses, buildInlineStyles, type StylesBreakpointOptionsBlok } from "../styles";

export interface ShadcnTableCellBlok extends SbBlokData {
  content: string;
  is_header?: boolean;
  align?: "left" | "center" | "right";
  styles?: StylesBreakpointOptionsBlok[];
}

export interface ShadcnTableRowBlok extends SbBlokData {
  cells: ShadcnTableCellBlok[];
  styles?: StylesBreakpointOptionsBlok[];
}

export interface ShadcnTableBlok extends SbBlokData {
  caption?: string;
  headers?: ShadcnTableCellBlok[];
  rows?: ShadcnTableRowBlok[];
  striped?: boolean;
  styles?: StylesBreakpointOptionsBlok[];
}

export function ShadcnTable({ blok }: { blok: ShadcnTableBlok }) {
  return (
    <Table
      {...storyblokEditable(blok)}
      className={cn(...buildStyleClasses(blok.styles))}
      style={buildInlineStyles(blok.styles)}
    >
      {blok.caption && <TableCaption>{blok.caption}</TableCaption>}
      {blok.headers && blok.headers.length > 0 && (
        <TableHeader>
          <TableRow>
            {blok.headers.map((header) => (
              <TableHead
                key={header._uid}
                className={cn(
                  `text-${header.align || "left"}`,
                  ...buildStyleClasses(header.styles),
                )}
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
            className={cn(
              blok.striped && rowIndex % 2 === 1 ? "bg-muted/50" : "",
              ...buildStyleClasses(row.styles),
            )}
            {...storyblokEditable(row)}
          >
            {row.cells?.map((cell) => (
              <TableCell
                key={cell._uid}
                className={cn(
                  `text-${cell.align || "left"}`,
                  ...buildStyleClasses(cell.styles),
                )}
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
