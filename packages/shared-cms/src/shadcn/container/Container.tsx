"use client";

import { storyblokEditable, StoryblokComponent } from "@storyblok/react";
import { cn } from "@repo/ui";
import type { SbBlokData } from "@storyblok/react";
import {
  buildStyleClasses,
  buildInlineStyles,
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
  premade_field: string;
  premade_section: string;
  builder_key: string;
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
  if (!items || typeof items.map !== "function") {
    return;
  }
  return items?.map((nestedBlok) => (
    <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
  ));
}

export function ShadcnContainer({ blok }: { blok: ShadcnContainerBlok }) {
  const styleClasses = buildStyleClasses(blok.styles);
  const inlineStyles = buildInlineStyles(blok.styles);
  const hasStyles = styleClasses.length > 0;
  const as =
    blok.container_as && ELEMENT_MAP[blok.container_as]
      ? blok.container_as
      : "div";
  const Component = as;

  const isListElement = as === "ul" || as === "ol";
  const isFlexContainer = !isListElement;
  const hasNoCustomStyles = !hasStyles;
  const useDefaultFlexLayout = isFlexContainer && hasNoCustomStyles;
  if (blok.sectionBlok) {
    console.log("container blok.sectionBlok", blok.sectionBlok);
  }
  return (
    <Component
      {...storyblokEditable(blok.sectionBlok ? blok.sectionBlok : blok)}
      {...(blok.name && { "data-name": blok.name })}
      className={cn(
        {
          flex: isFlexContainer,
          "flex-row justify-start items-stretch": useDefaultFlexLayout,
        },
        ...styleClasses,
      )}
      style={Object.keys(inlineStyles).length > 0 ? inlineStyles : undefined}
    >
      {renderItems(blok.items)}
    </Component>
  );
}
