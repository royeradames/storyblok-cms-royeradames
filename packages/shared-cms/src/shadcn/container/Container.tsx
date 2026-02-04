"use client";

import { storyblokEditable, StoryblokComponent } from "@storyblok/react";
import { cn } from "@repo/ui";
import type { SbBlokData } from "@storyblok/react";
import {
  buildStyleClasses,
  type StylesBreakpointOptionsBlok,
} from "../../styles";

export type { StylesBreakpointOptionsBlok } from "../../styles";

export type ContainerElement =
  | "div"
  | "section"
  | "article"
  | "header"
  | "hgroup"
  | "ul"
  | "ol"
  | "li";

export interface ShadcnContainerBlok extends SbBlokData {
  name?: string;
  container_as?: ContainerElement;
  items?: SbBlokData[];
  styles?: StylesBreakpointOptionsBlok[];
  sectionBlok?: SbBlokData;
}

const ELEMENT_MAP: Record<ContainerElement, ContainerElement> = {
  div: "div",
  section: "section",
  article: "article",
  header: "header",
  hgroup: "hgroup",
  ul: "ul",
  ol: "ol",
  li: "li",
};

function renderItems(items: SbBlokData[] | undefined) {
  // console.log("items", items);
  if (!items || typeof items.map !== "function") {
    return;
  }
  return items?.map((nestedBlok) => (
    <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
  ));
}

export function ShadcnContainer({ blok }: { blok: ShadcnContainerBlok }) {
  const styleClasses = buildStyleClasses(blok.styles);
  const hasStyles = styleClasses.length > 0;
  const as =
    blok.container_as && ELEMENT_MAP[blok.container_as]
      ? blok.container_as
      : "div";
  const Component = as;
  return (
    <Component
      {...storyblokEditable(blok.sectionBlok ? blok.sectionBlok : blok)}
      {...(blok.name && { "data-name": blok.name })}
      className={cn(
        as === "ul" || as === "ol" ? undefined : "flex",
        as !== "ul" &&
          as !== "ol" &&
          !hasStyles &&
          "flex-row justify-start items-stretch",
        ...styleClasses,
        (blok as SbBlokData & { class_name?: string }).class_name,
      )}
    >
      {renderItems(blok.items)}
    </Component>
  );
}
