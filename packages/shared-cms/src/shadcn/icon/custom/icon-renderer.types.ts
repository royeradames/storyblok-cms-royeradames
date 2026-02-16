import type { CSSProperties, ReactElement, SVGProps } from "react";

export type CustomIconSvgProps = SVGProps<SVGSVGElement> & {
  size: number;
  strokeWidth?: number;
};

export type StoryblokSvgAttrs = {
  "data-blok-c"?: string;
  "data-blok-uid"?: string;
};

export type CustomIconRenderer = (props: CustomIconSvgProps) => ReactElement;

export const BASE_SVG_PROPS = {
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
} as const;

export const ICON_SIZE_STYLE: CSSProperties = {
  flexShrink: 0,
};
