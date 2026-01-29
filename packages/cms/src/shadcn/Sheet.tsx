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
} from "@repo/ui";
import type { SbBlokData } from "@storyblok/react";

export interface ShadcnSheetBlok extends SbBlokData {
  trigger_text: string;
  trigger_variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  title: string;
  description?: string;
  content?: SbBlokData[];
  footer?: SbBlokData[];
  side?: "top" | "right" | "bottom" | "left";
}

export function ShadcnSheet({ blok }: { blok: ShadcnSheetBlok }) {
  const [open, setOpen] = useState(false);

  return (
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
  );
}
