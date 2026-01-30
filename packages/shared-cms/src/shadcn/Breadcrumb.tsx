"use client";

import { storyblokEditable } from "@storyblok/react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@repo/ui";
import type { SbBlokData } from "@storyblok/react";

export interface ShadcnBreadcrumbItemBlok extends SbBlokData {
  label: string;
  href?: string;
  is_current?: boolean;
}

export interface ShadcnBreadcrumbBlok extends SbBlokData {
  items: ShadcnBreadcrumbItemBlok[];
}

export function ShadcnBreadcrumb({ blok }: { blok: ShadcnBreadcrumbBlok }) {
  return (
    <Breadcrumb {...storyblokEditable(blok)}>
      <BreadcrumbList>
        {blok.items?.map((item, index) => (
          <BreadcrumbItem key={item._uid} {...storyblokEditable(item)}>
            {item.is_current || !item.href ? (
              <BreadcrumbPage>{item.label}</BreadcrumbPage>
            ) : (
              <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
            )}
            {index < (blok.items?.length || 0) - 1 && <BreadcrumbSeparator />}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
