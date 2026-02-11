"use client";

import { storyblokEditable } from "@storyblok/react";
import { AspectRatio, Skeleton, cn } from "@repo/ui";
import type { SbBlokData } from "@storyblok/react";
import { useTheme } from "next-themes";
import { buildStyleClasses, buildInlineStyles, type StylesBreakpointOptionsBlok } from "../styles";
import { useMounted } from "../storyblok/plugins";

interface ImageAsset {
  filename: string;
  alt?: string;
  focus?: string;
}

export interface ShadcnImageBlok extends SbBlokData {
  /** Light theme image (also used as fallback) */
  image_light: ImageAsset;
  /** Dark theme image (optional) */
  image_dark?: ImageAsset;
  /** Apply CSS invert filter while in light mode */
  invert_in_light?: boolean;
  /** Apply CSS invert filter while in dark mode */
  invert_in_dark?: boolean;
  /** @deprecated Use image_light instead. Kept for backward compat during migration. */
  image?: ImageAsset;
  aspect_ratio?: "auto" | "square" | "video" | "portrait" | "wide";
  object_fit?: "cover" | "contain" | "fill" | "none";
  rounded?: "none" | "sm" | "md" | "lg" | "full";
  caption?: string;
  styles?: StylesBreakpointOptionsBlok[];
}

const ratioMap = {
  auto: null,
  square: 1,
  video: 16 / 9,
  portrait: 3 / 4,
  wide: 21 / 9,
};

const objectFitMap = {
  cover: "object-cover",
  contain: "object-contain",
  fill: "object-fill",
  none: "object-none",
};

const roundedMap = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
};

export function ShadcnImage({ blok }: { blok: ShadcnImageBlok }) {
  const { resolvedTheme } = useTheme();
  const mounted = useMounted();
  const isDark = mounted && resolvedTheme === "dark";

  // Resolve the active image: prefer theme-specific, fall back to light, then legacy `image`
  const lightImage = blok.image_light ?? blok.image;
  const darkImage = blok.image_dark?.filename ? blok.image_dark : undefined;
  const activeImage = isDark && darkImage ? darkImage : lightImage;

  const ratio = ratioMap[blok.aspect_ratio || "auto"];
  const objectFit = objectFitMap[blok.object_fit || "cover"];
  const rounded = roundedMap[blok.rounded || "md"];
  const shouldInvert = isDark ? Boolean(blok.invert_in_dark) : Boolean(blok.invert_in_light);

  if (!activeImage?.filename) {
    return null;
  }
  const imageElement = (
    <img
      src={activeImage.filename}
      alt={activeImage.alt || ""}
      className={cn("w-full h-full", objectFit, rounded, shouldInvert && "invert")}
    />
  );

  const content = ratio ? (
    <AspectRatio ratio={ratio}>{imageElement}</AspectRatio>
  ) : (
    imageElement
  );

  return (
    <figure
      {...storyblokEditable(blok)}
      className={cn(...buildStyleClasses(blok.styles))}
      style={buildInlineStyles(blok.styles)}
    >
      {content}
      {blok.caption && (
        <figcaption className="mt-2 text-sm text-muted-foreground text-center">
          {blok.caption}
        </figcaption>
      )}
    </figure>
  );
}
