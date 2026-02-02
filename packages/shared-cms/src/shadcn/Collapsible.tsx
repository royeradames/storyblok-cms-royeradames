"use client";

import { useState } from "react";
import { storyblokEditable, StoryblokComponent } from "@storyblok/react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Button,
  cn,
} from "@repo/ui";
import { ChevronsUpDown } from "lucide-react";
import type { SbBlokData } from "@storyblok/react";
import { buildStyleClasses, type StylesBreakpointOptionsBlok } from "../styles";

export interface ShadcnCollapsibleBlok extends SbBlokData {
  trigger_text: string;
  content?: SbBlokData[];
  default_open?: boolean;
  styles?: StylesBreakpointOptionsBlok[];
}

export function ShadcnCollapsible({ blok }: { blok: ShadcnCollapsibleBlok }) {
  const [isOpen, setIsOpen] = useState(blok.default_open ?? false);

  return (
    <Collapsible
      {...storyblokEditable(blok)}
      open={isOpen}
      onOpenChange={setIsOpen}
      className={cn("w-full space-y-2", ...buildStyleClasses(blok.styles))}
    >
      <div className="flex items-center justify-between space-x-4">
        <h4 className="text-sm font-semibold">{blok.trigger_text}</h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            <ChevronsUpDown className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-2">
        {blok.content?.map((nestedBlok) => (
          <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
