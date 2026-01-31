"use client";

import { storyblokEditable, StoryblokComponent } from "@storyblok/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  cn,
} from "@repo/ui";
import type { SbBlokData } from "@storyblok/react";
import { buildStyleClasses, type FlexBreakpointOptionsBlok } from "../styles";

export interface ShadcnCardBlok extends SbBlokData {
  title?: string;
  description?: string;
  content?: SbBlokData[];
  footer?: SbBlokData[];
  styles?: FlexBreakpointOptionsBlok[];
}

export function ShadcnCard({ blok }: { blok: ShadcnCardBlok }) {
  return (
    <Card
      {...storyblokEditable(blok)}
      className={cn(...buildStyleClasses(blok.styles))}
    >
      {(blok.title || blok.description) && (
        <CardHeader>
          {blok.title && <CardTitle>{blok.title}</CardTitle>}
          {blok.description && (
            <CardDescription>{blok.description}</CardDescription>
          )}
        </CardHeader>
      )}
      {blok.content && blok.content.length > 0 && (
        <CardContent>
          {blok.content.map((nestedBlok) => (
            <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
          ))}
        </CardContent>
      )}
      {blok.footer && blok.footer.length > 0 && (
        <CardFooter>
          {blok.footer.map((nestedBlok) => (
            <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
          ))}
        </CardFooter>
      )}
    </Card>
  );
}
