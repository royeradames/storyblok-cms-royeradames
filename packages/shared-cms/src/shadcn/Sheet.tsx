"use client";

import { useState } from "react";
import { storyblokEditable, StoryblokComponent } from "@storyblok/react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Button,
  cn,
} from "@repo/ui";
import type { SbBlokData } from "@storyblok/react";
import { buildStyleClasses, type FlexBreakpointOptionsBlok } from "../styles";

export interface ShadcnSheetBlok extends SbBlokData {
  trigger_text: string;
  trigger_variant?:
    | "default"
    | "destructive"
    | "outline-solid"
    | "secondary"
    | "ghost"
    | "link";
  title: string;
  description?: string;
  content?: SbBlokData[];
  footer?: SbBlokData[];
  side?: "top" | "right" | "bottom" | "left";
  styles?: FlexBreakpointOptionsBlok[];
}

export function ShadcnSheet({ blok }: { blok: ShadcnSheetBlok }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      {...storyblokEditable(blok)}
      className={cn(...buildStyleClasses(blok.styles))}
    >
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          {...storyblokEditable(blok)}
          variant={blok.trigger_variant || "default"}
        >
          {blok.trigger_text}
        </Button>
      </SheetTrigger>
      <SheetContent side={blok.side || "right"}>
        <SheetHeader>
          <SheetTitle>{blok.title}</SheetTitle>
          {blok.description && (
            <SheetDescription>{blok.description}</SheetDescription>
          )}
        </SheetHeader>
        <div className="py-4">
          {blok.content?.map((nestedBlok) => (
            <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
          ))}
        </div>
        {blok.footer && blok.footer.length > 0 && (
          <SheetFooter>
            {blok.footer.map((nestedBlok) => (
              <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
            ))}
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
    </div>
  );
}
