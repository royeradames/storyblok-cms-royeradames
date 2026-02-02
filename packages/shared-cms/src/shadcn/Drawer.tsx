"use client";

import { useState } from "react";
import { storyblokEditable, StoryblokComponent } from "@storyblok/react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  Button,
  cn,
} from "@repo/ui";
import type { SbBlokData } from "@storyblok/react";
import { buildStyleClasses, type StylesBreakpointOptionsBlok } from "../styles";

export interface ShadcnDrawerBlok extends SbBlokData {
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
  styles?: StylesBreakpointOptionsBlok[];
}

export function ShadcnDrawer({ blok }: { blok: ShadcnDrawerBlok }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      {...storyblokEditable(blok)}
      className={cn(...buildStyleClasses(blok.styles))}
    >
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          {...storyblokEditable(blok)}
          variant={blok.trigger_variant || "default"}
        >
          {blok.trigger_text}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>{blok.title}</DrawerTitle>
            {blok.description && (
              <DrawerDescription>{blok.description}</DrawerDescription>
            )}
          </DrawerHeader>
          <div className="p-4">
            {blok.content?.map((nestedBlok) => (
              <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
            ))}
          </div>
          {blok.footer && blok.footer.length > 0 && (
            <DrawerFooter>
              {blok.footer.map((nestedBlok) => (
                <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
              ))}
            </DrawerFooter>
          )}
        </div>
      </DrawerContent>
    </Drawer>
    </div>
  );
}
