import type { CSSProperties, ReactElement } from "react";
import { isCustomIconName, type CustomIconName } from "./custom-icon-options";
import { FrontendMentorIcon } from "./FrontendMentorIcon";
import { MediumIcon } from "./MediumIcon";
import { RoyerAdamesComIcon } from "./RoyerAdamesComIcon";
import { XComIcon } from "./XComIcon";
import type { CustomIconRenderer, StoryblokSvgAttrs } from "./icon-renderer.types";

const CUSTOM_ICON_RENDERER_BY_NAME = {
  "x-com": XComIcon,
  "frontend-mentor": FrontendMentorIcon,
  medium: MediumIcon,
  "royeradames-com": RoyerAdamesComIcon,
} satisfies Record<CustomIconName, CustomIconRenderer>;

export type RenderCustomIconInput = {
  name: string;
  size: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
  style?: CSSProperties;
  storyblokAttrs?: StoryblokSvgAttrs;
};

export function renderCustomIcon(input: RenderCustomIconInput): ReactElement | null {
  if (!isCustomIconName(input.name)) {
    return null;
  }

  const IconRenderer = CUSTOM_ICON_RENDERER_BY_NAME[input.name];
  return (
    <IconRenderer
      size={input.size}
      color={input.color}
      className={input.className}
      style={input.style}
      strokeWidth={input.strokeWidth}
      {...input.storyblokAttrs}
    />
  );
}
