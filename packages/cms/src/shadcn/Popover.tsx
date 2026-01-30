"use client";

import { storyblokEditable, StoryblokComponent } from "@storyblok/react";
import { Popover, PopoverContent, PopoverTrigger, Button } from "@repo/ui";
import type { SbBlokData } from "@storyblok/react";

export interface ShadcnPopoverBlok extends SbBlokData {
  trigger_text: string;
  trigger_variant?:
    | "default"
    | "destructive"
    | "outline-solid"
    | "secondary"
    | "ghost"
    | "link";
  content?: SbBlokData[];
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
}

export function ShadcnPopover({ blok }: { blok: ShadcnPopoverBlok }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          {...storyblokEditable(blok)}
          variant={blok.trigger_variant || "outline-solid"}
        >
          {blok.trigger_text}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side={blok.side || "bottom"}
        align={blok.align || "center"}
        className="w-80"
      >
        {blok.content?.map((nestedBlok) => (
          <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
        ))}
      </PopoverContent>
    </Popover>
  );
}
