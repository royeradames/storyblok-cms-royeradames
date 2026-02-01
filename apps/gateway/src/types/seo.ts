/** Value shape from Storyblok seo_metatags plugin. */
export interface SeoMetatagsValue {
  _uid?: string;
  plugin?: "seo_metatags";
  title?: string;
  description?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: string;
}
