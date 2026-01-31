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
  image?: SbBlokData[];
  title?: SbBlokData[];
  description?: SbBlokData[];
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
      {/* Image before header (shadcn: add image before the card header) */}
      {blok.image?.[0] != null && (
        <StoryblokComponent blok={blok.image[0]} key={blok.image[0]._uid} />
      )}

      {(blok.title?.[0] ?? blok.description?.[0]) != null && (
        <CardHeader>
          {blok.title?.[0] != null && (
            <CardTitle>
              <StoryblokComponent
                blok={blok.title[0]}
                key={blok.title[0]._uid}
              />
            </CardTitle>
          )}
          {blok.description?.[0] != null && (
            <CardDescription>
              <StoryblokComponent
                blok={blok.description[0]}
                key={blok.description[0]._uid}
              />
            </CardDescription>
          )}
        </CardHeader>
      )}

      {(blok.content?.length ?? 0) > 0 && (
        <CardContent>
          {(blok.content ?? []).map((nestedBlok) => (
            <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
          ))}
        </CardContent>
      )}

      {(blok.footer?.length ?? 0) > 0 && (
        <CardFooter>
          {(blok.footer ?? []).map((nestedBlok) => (
            <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
          ))}
        </CardFooter>
      )}
    </Card>
  );
}
