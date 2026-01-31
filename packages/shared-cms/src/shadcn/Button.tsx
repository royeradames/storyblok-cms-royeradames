"use client";

import Link from "next/link";
import { storyblokEditable, StoryblokComponent } from "@storyblok/react";
import { Button, cn } from "@repo/ui";
import type { SbBlokData } from "@storyblok/react";
import { buildStyleClasses, type FlexBreakpointOptionsBlok } from "../styles";

export interface ShadcnButtonBlok extends SbBlokData {
  label?: SbBlokData[];
  variant?:
    | "default"
    | "destructive"
    | "outline-solid"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon" | "dynamic";
  link?: {
    url: string;
    target?: string;
  };
  styles?: FlexBreakpointOptionsBlok[];
}

function ButtonLabel({ blok }: { blok: ShadcnButtonBlok }) {
  const labelBloks = blok.label ?? [];
  if (labelBloks.length > 0 && typeof labelBloks.map === "function") {
    return (
      <>
        {labelBloks.map((b) => (
          <StoryblokComponent blok={b} key={b._uid} />
        ))}
      </>
    );
  }
  return <>Button</>;
}

export function ShadcnButton({ blok }: { blok: ShadcnButtonBlok }) {
  const variant = blok.variant || "default";
  const size = blok.size || "default";
  const labelContent = <ButtonLabel blok={blok} />;

  if (blok.link?.url) {
    const href = blok.link.url;
    const isInternal = href.startsWith("/");
    const target = blok.link.target ?? (isInternal ? "_self" : "_blank");
    const rel = target === "_blank" ? "noopener noreferrer" : undefined;

    if (isInternal) {
      return (
        <Button
          {...storyblokEditable(blok)}
          variant={variant}
          size={size}
          asChild
        >
          <Link href={href}>{labelContent}</Link>
        </Button>
      );
    }

    return (
      <Button
        {...storyblokEditable(blok)}
        variant={variant}
        size={size}
        asChild
      >
        <a href={href} target={target} rel={rel}>
          {labelContent}
        </a>
      </Button>
    );
  }

  return (
    <Button
      {...storyblokEditable(blok)}
      variant={variant}
      size={size}
      className={cn(...buildStyleClasses(blok.styles))}
    >
      {labelContent}
    </Button>
  );
}
