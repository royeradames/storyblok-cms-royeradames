"use client";

import { storyblokEditable, StoryblokComponent } from "@storyblok/react";
import { HoverCard, HoverCardContent, HoverCardTrigger, cn } from "@repo/ui";
import type { SbBlokData } from "@storyblok/react";
import { buildStyleClasses, type FlexBreakpointOptionsBlok } from "../styles";

export interface ShadcnHoverCardBlok extends SbBlokData {
  trigger?: SbBlokData[];
  content?: SbBlokData[];
  side?: "top" | "right" | "bottom" | "left";
  open_delay?: number;
  close_delay?: number;
  styles?: FlexBreakpointOptionsBlok[];
}

export function ShadcnHoverCard({ blok }: { blok: ShadcnHoverCardBlok }) {
  return (
    <div
      {...storyblokEditable(blok)}
      className={cn(...buildStyleClasses(blok.styles))}
    >
    <HoverCard
      openDelay={blok.open_delay ?? 200}
      closeDelay={blok.close_delay ?? 100}
    >
      <HoverCardTrigger asChild>
        <span {...storyblokEditable(blok)}>
          {blok.trigger?.map((nestedBlok) => (
            <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
          ))}
        </span>
      </HoverCardTrigger>
      <HoverCardContent side={blok.side || "bottom"} className="w-80">
        {blok.content?.map((nestedBlok) => (
          <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
        ))}
      </HoverCardContent>
    </HoverCard>
    </div>
  );
}
