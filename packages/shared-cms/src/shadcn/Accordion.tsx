"use client";

import { storyblokEditable } from "@storyblok/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ui";
import type { SbBlokData } from "@storyblok/react";

export interface ShadcnAccordionItemBlok extends SbBlokData {
  title: string;
  content: string;
  value?: string;
}

export interface ShadcnAccordionBlok extends SbBlokData {
  items: ShadcnAccordionItemBlok[];
  type?: "single" | "multiple";
  collapsible?: boolean;
  default_value?: string;
}

export function ShadcnAccordion({ blok }: { blok: ShadcnAccordionBlok }) {
  const type = blok.type || "single";

  if (type === "multiple") {
    return (
      <Accordion
        {...storyblokEditable(blok)}
        type="multiple"
        defaultValue={blok.default_value ? [blok.default_value] : undefined}
      >
        {blok.items?.map((item, index) => (
          <AccordionItem
            key={item._uid}
            value={item.value || `item-${index}`}
            {...storyblokEditable(item)}
          >
            <AccordionTrigger>{item.title}</AccordionTrigger>
            <AccordionContent>{item.content}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    );
  }

  return (
    <Accordion
      {...storyblokEditable(blok)}
      type="single"
      collapsible={blok.collapsible ?? true}
      defaultValue={blok.default_value}
    >
      {blok.items?.map((item, index) => (
        <AccordionItem
          key={item._uid}
          value={item.value || `item-${index}`}
          {...storyblokEditable(item)}
        >
          <AccordionTrigger>{item.title}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
