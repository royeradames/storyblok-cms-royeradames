"use client";

import { storyblokEditable, StoryblokComponent } from "@storyblok/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui";
import type { SbBlokData } from "@storyblok/react";

export interface ShadcnTooltipBlok extends SbBlokData {
  content: string;
  trigger?: SbBlokData[];
  side?: "top" | "right" | "bottom" | "left";
  delay?: number;
}

export function ShadcnTooltip({ blok }: { blok: ShadcnTooltipBlok }) {
  return (
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
  );
}
