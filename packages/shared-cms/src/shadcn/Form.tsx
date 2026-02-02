"use client";

import { storyblokEditable, StoryblokComponent } from "@storyblok/react";
import { Button, cn } from "@repo/ui";
import type { SbBlokData } from "@storyblok/react";
import { buildStyleClasses, type StylesBreakpointOptionsBlok } from "../styles";

export interface ShadcnFormBlok extends SbBlokData {
  action?: string;
  method?: "get" | "post";
  fields?: SbBlokData[];
  submit_text?: string;
  submit_variant?:
    | "default"
    | "destructive"
    | "outline-solid"
    | "secondary"
    | "ghost";
  layout?: "vertical" | "horizontal" | "inline";
  styles?: StylesBreakpointOptionsBlok[];
}

const layoutMap = {
  vertical: "flex flex-col gap-4",
  horizontal: "grid grid-cols-2 gap-4",
  inline: "flex flex-wrap items-end gap-4",
};

export function ShadcnForm({ blok }: { blok: ShadcnFormBlok }) {
  return (
    <form
      {...storyblokEditable(blok)}
      action={blok.action}
      method={blok.method || "post"}
      className={cn("space-y-6", ...buildStyleClasses(blok.styles))}
    >
      <div className={cn(layoutMap[blok.layout || "vertical"])}>
        {blok.fields?.map((field) => (
          <StoryblokComponent blok={field} key={field._uid} />
        ))}
      </div>
      <Button type="submit" variant={blok.submit_variant || "default"}>
        {blok.submit_text || "Submit"}
      </Button>
    </form>
  );
}
