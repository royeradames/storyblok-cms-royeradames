"use client";

import { storyblokEditable, StoryblokComponent } from "@storyblok/react";
import { cn } from "@repo/ui";
import type { SbBlokData } from "@storyblok/react";
import {
  buildStyleClasses,
  type StylesBreakpointOptionsBlok,
} from "../../styles";

export type { StylesBreakpointOptionsBlok } from "../../styles";

export type ContainerElement = "div" | "section" | "article";

export interface ShadcnContainerBlok extends SbBlokData {
  name?: string;
  container_as?: ContainerElement;
  items?: SbBlokData[];
  styles?: StylesBreakpointOptionsBlok[];
}

const ELEMENT_MAP: Record<ContainerElement, ContainerElement> = {
  div: "div",
  section: "section",
  article: "article",
};

export function ShadcnContainer({ blok }: { blok: ShadcnContainerBlok }) {
  const styleClasses = buildStyleClasses(blok.styles);
  const hasStyles = styleClasses.length > 0;
  const fallbackClasses = !hasStyles
    ? ["flex-row", "justify-start", "items-stretch"]
    : [];

  const as =
    blok.container_as && ELEMENT_MAP[blok.container_as]
      ? blok.container_as
      : "div";
  const Component = as;

  return (
    <Component
      {...storyblokEditable(blok)}
      {...(blok.name && { "data-name": blok.name })}
      className={cn(
        "flex",
        ...fallbackClasses,
        ...styleClasses,
        (blok as SbBlokData & { class_name?: string }).class_name
      )}
    >
      {blok.items?.map((nestedBlok) => (
        <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </Component>
  );
}
