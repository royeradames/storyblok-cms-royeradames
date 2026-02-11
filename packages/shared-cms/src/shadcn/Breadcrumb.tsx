"use client";

import React from "react";
import { storyblokEditable } from "@storyblok/react";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  cn,
} from "@repo/ui";
import type { SbBlokData } from "@storyblok/react";
import { buildStyleClasses, buildInlineStyles, type StylesBreakpointOptionsBlok } from "../styles";

export interface ShadcnBreadcrumbItemBlok extends SbBlokData {
  label: string;
  href?: string;
  is_current?: boolean;
  styles?: StylesBreakpointOptionsBlok[];
}

export interface ShadcnBreadcrumbBlok extends SbBlokData {
  items?: ShadcnBreadcrumbItemBlok[];
  styles?: StylesBreakpointOptionsBlok[];
}

function formatSegmentLabel(segment: string): string {
  const decodedSegment = (() => {
    try {
      return decodeURIComponent(segment);
    } catch {
      return segment;
    }
  })();

  return decodedSegment
    .replace(/[-_]+/g, " ")
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function ShadcnBreadcrumb({ blok }: { blok: ShadcnBreadcrumbBlok }) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = [
    { href: "/", label: "Home", isCurrent: segments.length === 0 },
    ...segments.map((segment, index) => ({
      href: `/${segments.slice(0, index + 1).join("/")}`,
      label: formatSegmentLabel(segment),
      isCurrent: index === segments.length - 1,
    })),
  ];

  return (
    <Breadcrumb
      {...storyblokEditable(blok)}
      className={cn(...buildStyleClasses(blok.styles))}
      style={buildInlineStyles(blok.styles)}
    >
      <BreadcrumbList>
        {breadcrumbs.map((item, index) => (
          <React.Fragment key={item.href}>
            <BreadcrumbItem>
              {item.isCurrent ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
