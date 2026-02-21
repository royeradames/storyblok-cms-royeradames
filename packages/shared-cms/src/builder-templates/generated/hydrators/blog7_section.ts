import { applyPrecompiledHydrationPlan } from "../../applyPrecompiledHydrationPlan";
import type {
  BuilderPrecompiledHydrationPlan,
  BuilderTemplateHydrator,
} from "../../types";

const hydrationPlan = {
  "rootSectionName": "blog7_section",
  "skeleton": {
    "name": "blog",
    "items": [
      {
        "name": "hero",
        "items": [
          {
            "name": "content-wrapper",
            "items": [
              {
                "text": "Latest Updates",
                "styles": [],
                "variant": "secondary",
                "component": "shared_shadcn_badge"
              },
              {
                "size": "4xl",
                "align": "center",
                "color": "primary",
                "styles": [
                  {
                    "wrap": false,
                    "align": "",
                    "width": "",
                    "height": "",
                    "margin": "",
                    "display": "",
                    "justify": "",
                    "padding": "",
                    "component": "shared_styles_options",
                    "direction": "",
                    "max_width": "",
                    "min_width": "",
                    "breakpoint": "base",
                    "max_height": "",
                    "min_height": ""
                  }
                ],
                "weight": "semibold",
                "content": "Blog Posts",
                "element": "h2",
                "component": "shared_shadcn_text",
                "color_dark": {
                  "color": "#f40000",
                  "plugin": "native-color-picker"
                },
                "color_light": {
                  "color": "#f40000",
                  "plugin": "native-color-picker"
                },
                "line_height": "",
                "letter_spacing": ""
              },
              {
                "size": "lg",
                "align": "center",
                "color": "primary",
                "styles": [],
                "weight": "normal",
                "content": "Discover the latest trends, tips, and best practices in modern web development. From UI components to design systems, stay updated with our expert insights.",
                "element": "p",
                "component": "shared_shadcn_text",
                "color_dark": {
                  "color": "#f40000",
                  "plugin": "native-color-picker"
                },
                "color_light": {
                  "color": "#404040",
                  "plugin": "native-color-picker"
                },
                "line_height": "normal",
                "letter_spacing": "wide"
              },
              {
                "link": {
                  "id": "",
                  "url": "",
                  "linktype": "story",
                  "fieldtype": "multilink",
                  "cached_url": ""
                },
                "size": "default",
                "label": [
                  {
                    "size": "base",
                    "align": "left",
                    "color": "default",
                    "styles": [],
                    "weight": "normal",
                    "content": "View all articles",
                    "element": "p",
                    "component": "shared_shadcn_text",
                    "color_dark": {
                      "color": "#f40000",
                      "plugin": "native-color-picker"
                    },
                    "color_light": {
                      "color": "#f40000",
                      "plugin": "native-color-picker"
                    },
                    "line_height": "",
                    "letter_spacing": ""
                  },
                  {
                    "name": "arrow-right",
                    "size": "24",
                    "color": "#000",
                    "styles": [],
                    "component": "shared_shadcn_icon",
                    "class_name": "",
                    "stroke_width": "2"
                  }
                ],
                "styles": [],
                "variant": "link",
                "component": "shared_shadcn_button"
              }
            ],
            "styles": [
              {
                "gap": [
                  "gap-4"
                ],
                "wrap": false,
                "align": "items-center",
                "width": "",
                "height": "",
                "margin": "",
                "display": "",
                "justify": "justify-start",
                "padding": [],
                "component": "shared_styles_options",
                "direction": "flex-col",
                "max_width": "max-w-2xl",
                "min_width": "",
                "breakpoint": "base",
                "max_height": "",
                "min_height": ""
              }
            ],
            "component": "shared_shadcn_container",
            "container_as": "section"
          }
        ],
        "styles": [
          {
            "wrap": false,
            "align": "items-center",
            "width": "w-full",
            "height": "",
            "justify": "justify-center",
            "component": "shared_styles_options",
            "direction": "flex-row",
            "max_width": "",
            "min_width": "",
            "breakpoint": "base",
            "max_height": "",
            "min_height": ""
          }
        ],
        "component": "shared_shadcn_container",
        "container_as": "header"
      },
      {
        "name": "card-wrapper",
        "items": [
          {
            "name": "",
            "items": [
              {
                "image": [
                  {
                    "styles": [
                      {
                        "wrap": false,
                        "align": "",
                        "width": "",
                        "height": "",
                        "margin": "",
                        "shadow": "",
                        "display": "",
                        "justify": "",
                        "padding": "",
                        "component": "shared_styles_options",
                        "direction": "",
                        "max_width": "",
                        "min_width": "",
                        "text_size": "",
                        "breakpoint": "base",
                        "max_height": "",
                        "min_height": ""
                      }
                    ],
                    "caption": "",
                    "rounded": "none",
                    "component": "shared_shadcn_image",
                    "object_fit": "cover",
                    "image_light": {
                      "id": 139832891234640,
                      "alt": "",
                      "name": "",
                      "focus": "",
                      "title": "",
                      "source": "",
                      "filename": "https://a.storyblok.com/f/290156609668258/1200x1200/32e178fd4f/placeholder-dark-1.svg",
                      "copyright": "",
                      "fieldtype": "asset",
                      "meta_data": {},
                      "is_external_url": false
                    },
                    "aspect_ratio": "video"
                  }
                ],
                "title": [
                  {
                    "link": {
                      "id": "",
                      "url": "https://app.storyblok.com/#/me/spaces/290156609668258/stories/0/0/139645479539719/blok/8276f68f-7c13-45f6-8801-15d23e3983b5#dbfecb4f-5b9e-4c40-be9d-34c5eb4ae88f",
                      "linktype": "url",
                      "fieldtype": "multilink",
                      "cached_url": "https://app.storyblok.com/#/me/spaces/290156609668258/stories/0/0/139645479539719/blok/8276f68f-7c13-45f6-8801-15d23e3983b5#dbfecb4f-5b9e-4c40-be9d-34c5eb4ae88f"
                    },
                    "size": "auto",
                    "label": [
                      {
                        "size": "xl",
                        "align": "left",
                        "color": "default",
                        "styles": [
                          {
                            "wrap": false,
                            "align": "",
                            "width": "w-full",
                            "height": "h-full",
                            "margin": "",
                            "display": "",
                            "justify": "",
                            "padding": "",
                            "component": "shared_styles_options",
                            "direction": "",
                            "max_width": "",
                            "min_width": "",
                            "breakpoint": "base",
                            "max_height": "",
                            "min_height": ""
                          }
                        ],
                        "weight": "semibold",
                        "content": "Getting Started with shadcn/ui Components",
                        "element": "h3",
                        "component": "shared_shadcn_text",
                        "color_dark": {
                          "color": "#f40000",
                          "plugin": "native-color-picker"
                        },
                        "color_light": {
                          "color": "#f40000",
                          "plugin": "native-color-picker"
                        },
                        "line_height": "",
                        "letter_spacing": ""
                      }
                    ],
                    "styles": [],
                    "variant": "link",
                    "component": "shared_shadcn_button"
                  }
                ],
                "footer": [
                  {
                    "link": {
                      "id": "",
                      "url": "",
                      "linktype": "story",
                      "fieldtype": "multilink",
                      "cached_url": ""
                    },
                    "size": "default",
                    "label": [
                      {
                        "size": "base",
                        "align": "left",
                        "color": "default",
                        "styles": [],
                        "weight": "normal",
                        "content": "Read more",
                        "element": "p",
                        "component": "shared_shadcn_text",
                        "color_dark": {
                          "color": "#f40000",
                          "plugin": "native-color-picker"
                        },
                        "color_light": {
                          "color": "#f40000",
                          "plugin": "native-color-picker"
                        },
                        "line_height": "",
                        "letter_spacing": ""
                      },
                      {
                        "name": "arrow-right",
                        "size": "",
                        "color": "#000",
                        "styles": [],
                        "component": "shared_shadcn_icon",
                        "class_name": "",
                        "color_dark": {
                          "color": "#ffffff",
                          "plugin": "native-color-picker"
                        },
                        "color_light": {
                          "color": "#000000",
                          "plugin": "native-color-picker"
                        },
                        "stroke_width": "2"
                      }
                    ],
                    "styles": [],
                    "variant": "link",
                    "component": "shared_shadcn_button"
                  }
                ],
                "header": [
                  {
                    "size": "xl",
                    "align": "left",
                    "color": "default",
                    "weight": "bold",
                    "content": "Getting Started with shadcn/ui Components",
                    "element": "h2",
                    "component": "shared_shadcn_text"
                  }
                ],
                "styles": [
                  {
                    "gap": [
                      "gap-4"
                    ],
                    "wrap": false,
                    "align": "items-stretch",
                    "width": "",
                    "height": "",
                    "margin": "",
                    "justify": "justify-start",
                    "component": "shared_styles_options",
                    "direction": "flex-row",
                    "max_width": "max-w-sm",
                    "min_width": "",
                    "breakpoint": "base",
                    "max_height": "",
                    "min_height": ""
                  }
                ],
                "content": [
                  {
                    "size": "base",
                    "align": "left",
                    "color": "default",
                    "weight": "normal",
                    "content": "Learn how to quickly integrate and customize shadcn/ui components in your Next.js projects. We'll cover installation, theming, and best practices for building modern interfaces.",
                    "element": "p",
                    "component": "shared_shadcn_text",
                    "color_dark": {
                      "color": "#f40000",
                      "plugin": "native-color-picker"
                    },
                    "color_light": {
                      "color": "#f40000",
                      "plugin": "native-color-picker"
                    },
                    "line_height": "",
                    "letter_spacing": ""
                  }
                ],
                "component": "shared_shadcn_card",
                "description": ""
              }
            ],
            "styles": [],
            "component": "shared_shadcn_container",
            "container_as": "li"
          }
        ],
        "styles": [
          {
            "gap": [
              "gap-6"
            ],
            "wrap": true,
            "align": "items-start",
            "width": "",
            "height": "",
            "margin": "",
            "display": "flex",
            "justify": "justify-center",
            "component": "shared_styles_options",
            "direction": "flex-row",
            "max_width": "",
            "min_width": "",
            "text_size": "",
            "breakpoint": "base",
            "max_height": "",
            "min_height": ""
          },
          {
            "gap": [
              "gap-8"
            ],
            "wrap": false,
            "align": "",
            "width": "",
            "height": "",
            "margin": "",
            "justify": "",
            "component": "shared_styles_options",
            "direction": "",
            "max_width": "",
            "min_width": "",
            "breakpoint": "md",
            "max_height": "",
            "min_height": ""
          }
        ],
        "component": "shared_shadcn_container",
        "container_as": "ul"
      }
    ],
    "styles": [
      {
        "gap": [
          "gap-12"
        ],
        "wrap": false,
        "align": "items-stretch",
        "width": "",
        "height": "",
        "margin": "",
        "display": "flex",
        "justify": "justify-start",
        "padding": [
          "px-4",
          "py-32"
        ],
        "component": "shared_styles_options",
        "direction": "flex-col",
        "max_width": "",
        "min_width": "",
        "breakpoint": "base",
        "max_height": "",
        "min_height": ""
      }
    ],
    "component": "shared_shadcn_container",
    "container_as": "section"
  },
  "setters": [
    {
      "sectionName": "blog7_section",
      "premadeField": "badge_text",
      "targetPath": "$.items.0.items.0.items.0.text"
    },
    {
      "sectionName": "blog7_section",
      "premadeField": "title",
      "targetPath": "$.items.0.items.0.items.1.content"
    },
    {
      "sectionName": "blog7_section",
      "premadeField": "description",
      "targetPath": "$.items.0.items.0.items.2.content"
    },
    {
      "sectionName": "blog7_section",
      "premadeField": "action_text",
      "targetPath": "$.items.0.items.0.items.3.label.0.content"
    },
    {
      "sectionName": "blog7_section_articles",
      "premadeField": "content",
      "targetPath": "$.items.1.items.0.items.0.content.0.content"
    },
    {
      "sectionName": "blog7_section_articles",
      "premadeField": "action_label",
      "targetPath": "$.items.1.items.0.items.0.footer.0.label.0.content"
    },
    {
      "sectionName": "blog7_section_articles",
      "premadeField": "link",
      "targetPath": "$.items.1.items.0.items.0.footer.0.link"
    },
    {
      "sectionName": "blog7_section_articles",
      "premadeField": "image",
      "targetPath": "$.items.1.items.0.items.0.image.0.image_light"
    },
    {
      "sectionName": "blog7_section_articles",
      "premadeField": "title",
      "targetPath": "$.items.1.items.0.items.0.title.0.label.0.content"
    }
  ],
  "repeaters": [
    {
      "nodePath": "$.items.1",
      "sectionName": "blog7_section_articles",
      "mode": "self_clone"
    }
  ]
} satisfies BuilderPrecompiledHydrationPlan;

export const hydrate_blog7_section: BuilderTemplateHydrator = (blok) =>
  applyPrecompiledHydrationPlan(hydrationPlan, blok);
