"use client";

import { storyblokEditable } from "@storyblok/react";
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
import { buildStyleClasses, type FlexBreakpointOptionsBlok } from "../styles";

export interface ShadcnBreadcrumbItemBlok extends SbBlokData {
  label: string;
  href?: string;
  is_current?: boolean;
  styles?: FlexBreakpointOptionsBlok[];
}

export interface ShadcnBreadcrumbBlok extends SbBlokData {
  items: ShadcnBreadcrumbItemBlok[];
  styles?: FlexBreakpointOptionsBlok[];
}

export function ShadcnBreadcrumb({ blok }: { blok: ShadcnBreadcrumbBlok }) {
  return (
    <Breadcrumb
      {...storyblokEditable(blok)}
      className={cn(...buildStyleClasses(blok.styles))}
    >
      <BreadcrumbList>
        {blok.items?.map((item, index) => (
          <BreadcrumbItem
            key={item._uid}
            className={cn(...buildStyleClasses(item.styles))}
            {...storyblokEditable(item)}
          >
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
