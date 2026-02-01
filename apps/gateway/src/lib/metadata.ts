import type { Metadata } from "next";
import type { SeoMetatagsValue } from "@/types/seo";

/** Build Next.js Metadata from Storyblok seo_metatags plugin value. */
export function metadataFromStory(
  meta: SeoMetatagsValue | undefined
): Metadata {
  if (!meta) return {};
  const title = meta.title?.trim() || undefined;
  const description = meta.description?.trim() || undefined;
  const ogTitle = meta.og_title?.trim() || undefined;
  const ogDescription = meta.og_description?.trim() || undefined;
  const ogImage = meta.og_image?.trim() || undefined;
  const twitterTitle = meta.twitter_title?.trim() || undefined;
  const twitterDescription = meta.twitter_description?.trim() || undefined;
  const twitterImage = meta.twitter_image?.trim() || undefined;
  const twitterImageUrl = twitterImage || ogImage;

  return {
    title: title || undefined,
    description: description || undefined,
    openGraph: {
      title: ogTitle || title,
      description: ogDescription || description,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      title: twitterTitle || ogTitle || title,
      description: twitterDescription || ogDescription || description,
      images: twitterImageUrl ? [{ url: twitterImageUrl }] : undefined,
    },
  };
}
