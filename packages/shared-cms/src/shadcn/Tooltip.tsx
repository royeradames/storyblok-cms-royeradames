"use client";

import { storyblokEditable, StoryblokComponent } from "@storyblok/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  cn,
} from "@repo/ui";
import type { SbBlokData } from "@storyblok/react";
import { buildStyleClasses, type StylesBreakpointOptionsBlok } from "../styles";

export interface ShadcnTooltipBlok extends SbBlokData {
  content: string;
  trigger?: SbBlokData[];
  side?: "top" | "right" | "bottom" | "left";
  delay?: number;
  styles?: StylesBreakpointOptionsBlok[];
}

export function ShadcnTooltip({ blok }: { blok: ShadcnTooltipBlok }) {
  return (
    <div
      {...storyblokEditable(blok)}
      className={cn(...buildStyleClasses(blok.styles))}
    >
    <TooltipProvider delayDuration={blok.delay ?? 200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span {...storyblokEditable(blok)}>
            {blok.trigger?.map((nestedBlok) => (
              <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
            ))}
          </span>
        </TooltipTrigger>
        <TooltipContent side={blok.side || "top"}>
          <p>{blok.content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    </div>
  );
}
