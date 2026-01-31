"use client";

import { useState } from "react";
import { storyblokEditable, StoryblokComponent } from "@storyblok/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Button,
  cn,
} from "@repo/ui";
import type { SbBlokData } from "@storyblok/react";
import { buildStyleClasses, type FlexBreakpointOptionsBlok } from "../styles";

export interface ShadcnDialogBlok extends SbBlokData {
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
  size?: "sm" | "md" | "lg" | "xl" | "full";
  styles?: FlexBreakpointOptionsBlok[];
}

const sizeMap = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-full",
};

export function ShadcnDialog({ blok }: { blok: ShadcnDialogBlok }) {
  const [open, setOpen] = useState(false);
  const size = sizeMap[blok.size || "md"];

  return (
    <div
      {...storyblokEditable(blok)}
      className={cn(...buildStyleClasses(blok.styles))}
    >
      <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          {...storyblokEditable(blok)}
          variant={blok.trigger_variant || "default"}
        >
          {blok.trigger_text}
        </Button>
      </DialogTrigger>
      <DialogContent className={size}>
        <DialogHeader>
          <DialogTitle>{blok.title}</DialogTitle>
          {blok.description && (
            <DialogDescription>{blok.description}</DialogDescription>
          )}
        </DialogHeader>
        {blok.content?.map((nestedBlok) => (
          <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
        ))}
        {blok.footer && blok.footer.length > 0 && (
          <DialogFooter>
            {blok.footer.map((nestedBlok) => (
              <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
            ))}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
    </div>
  );
}
