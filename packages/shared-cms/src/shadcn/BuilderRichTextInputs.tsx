"use client";

import { storyblokEditable } from "@storyblok/react";
import type { BuilderRichTextInputsBlok } from "./rich-text/RichText";

export function BuilderRichTextInputs({
  blok,
}: {
  blok: BuilderRichTextInputsBlok;
}) {
  return <div {...storyblokEditable(blok)} className="hidden" aria-hidden="true" />;
}
