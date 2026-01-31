"use client";

import { storyblokEditable, StoryblokComponent } from "@storyblok/react";
import { Tabs, TabsContent, TabsList, TabsTrigger, cn } from "@repo/ui";
import type { SbBlokData } from "@storyblok/react";
import { buildStyleClasses, type FlexBreakpointOptionsBlok } from "../styles";

export interface ShadcnTabItemBlok extends SbBlokData {
  label: string;
  value: string;
  content?: SbBlokData[];
  styles?: FlexBreakpointOptionsBlok[];
}

export interface ShadcnTabsBlok extends SbBlokData {
  tabs: ShadcnTabItemBlok[];
  default_value?: string;
  orientation?: "horizontal" | "vertical";
  styles?: FlexBreakpointOptionsBlok[];
}

export function ShadcnTabs({ blok }: { blok: ShadcnTabsBlok }) {
  const defaultValue = blok.default_value || blok.tabs?.[0]?.value;

  return (
    <Tabs
      {...storyblokEditable(blok)}
      defaultValue={defaultValue}
      orientation={blok.orientation || "horizontal"}
      className={cn(
        blok.orientation === "vertical" ? "flex gap-4" : "",
        ...buildStyleClasses(blok.styles),
      )}
    >
      <TabsList
        className={blok.orientation === "vertical" ? "flex-col h-auto" : ""}
      >
        {blok.tabs?.map((tab) => (
          <TabsTrigger
            key={tab._uid}
            value={tab.value}
            {...storyblokEditable(tab)}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {blok.tabs?.map((tab) => (
        <TabsContent
          key={tab._uid}
          value={tab.value}
          className={cn(...buildStyleClasses(tab.styles))}
        >
          {tab.content?.map((nestedBlok) => (
            <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
          ))}
        </TabsContent>
      ))}
    </Tabs>
  );
}
