"use client";

import { storyblokEditable, StoryblokComponent } from "@storyblok/react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@repo/ui";
import type { SbBlokData } from "@storyblok/react";

export interface ShadcnHoverCardBlok extends SbBlokData {
  trigger?: SbBlokData[];
  content?: SbBlokData[];
  side?: "top" | "right" | "bottom" | "left";
  open_delay?: number;
  close_delay?: number;
}

export function ShadcnHoverCard({ blok }: { blok: ShadcnHoverCardBlok }) {
  return (
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
  );
}
