import { applyPrecompiledHydrationPlan } from "../../applyPrecompiledHydrationPlan";
import type {
  BuilderPrecompiledHydrationPlan,
  BuilderTemplateHydrator,
} from "../../types";

const hydrationPlan = {
  "rootSectionName": "case_studies_2_section",
  "skeleton": {
    "name": "case-studies-2",
    "items": [
      {
        "name": "header",
        "items": [
          {
            "name": "hero-wrapper",
            "items": [
              {
                "size": "base",
                "align": "center",
                "color": "primary",
                "styles": [],
                "weight": "semibold",
                "content": "4500+ Satisfied Customers",
                "element": "p",
                "component": "shared_shadcn_text",
                "color_dark": {
                  "color": "#f40000",
                  "plugin": "native-color-picker"
                },
                "color_light": {
                  "color": "",
                  "plugin": "native-color-picker"
                },
                "line_height": "normal",
                "letter_spacing": "wide"
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
                    "border": [],
                    "height": "",
                    "margin": [],
                    "shadow": "",
                    "display": "",
                    "justify": "",
                    "padding": [],
                    "component": "shared_styles_options",
                    "direction": "",
                    "max_width": "",
                    "min_width": "",
                    "text_size": "5xl",
                    "breakpoint": "md",
                    "max_height": "",
                    "min_height": "",
                    "border_style": "",
                    "border_width": ""
                  }
                ],
                "weight": "semibold",
                "content": "Real results from real users",
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
              }
            ],
            "styles": [
              {
                "gap": [
                  "gap-6"
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
                "text_size": "",
                "breakpoint": "base",
                "max_height": "",
                "min_height": ""
              }
            ],
            "component": "shared_shadcn_container",
            "container_as": "hgroup"
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
        "name": "case-studies",
        "items": [
          {
            "name": "case-study",
            "items": [
              {
                "styles": [
                  {
                    "wrap": false,
                    "align": "",
                    "width": "",
                    "height": "",
                    "margin": [],
                    "display": "",
                    "justify": "",
                    "padding": [],
                    "component": "shared_styles_options",
                    "direction": "",
                    "max_width": "max-w-64",
                    "min_width": "",
                    "breakpoint": "base",
                    "max_height": "",
                    "min_height": ""
                  }
                ],
                "caption": "",
                "rounded": "lg",
                "component": "shared_shadcn_image",
                "object_fit": "cover",
                "image_light": {
                  "id": 140495677412865,
                  "alt": "",
                  "name": "",
                  "focus": "",
                  "title": "",
                  "source": "",
                  "filename": "https://a.storyblok.com/f/290156609668258/1200x1200/827039a479/placeholder-1.svg",
                  "copyright": "",
                  "fieldtype": "asset",
                  "meta_data": {},
                  "is_external_url": false
                },
                "aspect_ratio": "auto"
              },
              {
                "name": "case-study-content",
                "items": [
                  {
                    "size": "base",
                    "align": "left",
                    "color": "default",
                    "styles": [
                      {
                        "wrap": false,
                        "align": "",
                        "width": "",
                        "border": [],
                        "height": "",
                        "margin": [],
                        "shadow": "",
                        "display": "",
                        "justify": "",
                        "padding": [],
                        "variant": "",
                        "component": "shared_styles_options",
                        "direction": "",
                        "max_width": "",
                        "min_width": "",
                        "text_size": "xl",
                        "breakpoint": "sm",
                        "max_height": "",
                        "min_height": "",
                        "border_style": ""
                      }
                    ],
                    "weight": "normal",
                    "content": "This productivity tool transformed how we collaborate. Our team's workflow improved dramatically, and we've cut meeting time by half while increasing output.",
                    "element": "q",
                    "component": "shared_shadcn_text",
                    "color_dark": {
                      "color": "#f40000",
                      "plugin": "native-color-picker"
                    },
                    "color_light": {
                      "color": "#f40000",
                      "plugin": "native-color-picker"
                    },
                    "line_height": "normal",
                    "letter_spacing": "normal"
                  },
                  {
                    "name": "",
                    "items": [
                      {
                        "name": "person",
                        "items": [
                          {
                            "size": "base",
                            "align": "left",
                            "color": "default",
                            "styles": [],
                            "weight": "bold",
                            "content": "Michael Rivera",
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
                            "line_height": "normal",
                            "letter_spacing": "normal"
                          },
                          {
                            "name": "position-and-logo",
                            "items": [
                              {
                                "size": "base",
                                "align": "left",
                                "color": "muted",
                                "styles": [],
                                "weight": "normal",
                                "content": "Product Director",
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
                                "line_height": "normal",
                                "letter_spacing": "normal"
                              },
                              {
                                "styles": [],
                                "caption": "",
                                "rounded": "md",
                                "component": "shared_shadcn_image",
                                "object_fit": "cover",
                                "image_light": {
                                  "id": 140492482516471,
                                  "alt": "",
                                  "name": "",
                                  "focus": "",
                                  "title": "",
                                  "source": "",
                                  "filename": "https://a.storyblok.com/f/290156609668258/112x27/b884400bc0/fictional-company-logo-2.svg",
                                  "copyright": "",
                                  "fieldtype": "asset",
                                  "meta_data": {},
                                  "is_external_url": false
                                },
                                "aspect_ratio": "auto"
                              }
                            ],
                            "styles": [
                              {
                                "gap": [
                                  "gap-4"
                                ],
                                "wrap": false,
                                "align": "",
                                "width": "",
                                "height": "",
                                "margin": [],
                                "display": "",
                                "justify": "",
                                "padding": [],
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
                            "container_as": "div"
                          }
                        ],
                        "styles": [
                          {
                            "gap": [
                              "gap-1"
                            ],
                            "wrap": false,
                            "align": "",
                            "width": "",
                            "height": "",
                            "margin": [],
                            "display": "",
                            "justify": "",
                            "padding": [],
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
                        "container_as": "div"
                      },
                      {
                        "name": "",
                        "items": [
                          {
                            "name": "statistic",
                            "items": [
                              {
                                "size": "4xl",
                                "align": "left",
                                "color": "default",
                                "styles": [
                                  {
                                    "wrap": false,
                                    "align": "",
                                    "width": "",
                                    "height": "",
                                    "margin": [],
                                    "display": "",
                                    "justify": "",
                                    "padding": [],
                                    "component": "shared_styles_options",
                                    "direction": "",
                                    "max_width": "",
                                    "min_width": "",
                                    "text_size": "5xl",
                                    "breakpoint": "sm",
                                    "max_height": "",
                                    "min_height": ""
                                  }
                                ],
                                "weight": "medium",
                                "content": "98%",
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
                                "line_height": "none",
                                "letter_spacing": "normal"
                              },
                              {
                                "size": "lg",
                                "align": "left",
                                "color": "default",
                                "styles": [],
                                "weight": "semibold",
                                "content": "Customer Satisfaction",
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
                                "line_height": "normal",
                                "letter_spacing": "normal"
                              },
                              {
                                "size": "base",
                                "align": "left",
                                "color": "muted",
                                "styles": [],
                                "weight": "semibold",
                                "content": "From verified reviews",
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
                                "line_height": "normal",
                                "letter_spacing": "normal"
                              }
                            ],
                            "styles": [
                              {
                                "gap": [
                                  "gap-2"
                                ],
                                "wrap": false,
                                "align": "",
                                "width": "",
                                "height": "",
                                "margin": [],
                                "display": "",
                                "justify": "",
                                "padding": [],
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
                            "container_as": "div"
                          }
                        ],
                        "styles": [
                          {
                            "gap": [
                              "gap-6"
                            ],
                            "wrap": false,
                            "align": "",
                            "width": "",
                            "height": "",
                            "margin": [],
                            "display": "",
                            "justify": "",
                            "padding": [],
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
                        "container_as": "div"
                      }
                    ],
                    "styles": [
                      {
                        "gap": [
                          "gap-10"
                        ],
                        "wrap": false,
                        "align": "",
                        "width": "",
                        "border": [],
                        "height": "",
                        "margin": [],
                        "shadow": "",
                        "display": "",
                        "justify": "justify-between",
                        "padding": [],
                        "component": "shared_styles_options",
                        "direction": "flex-col",
                        "max_width": "",
                        "min_width": "",
                        "text_size": "",
                        "breakpoint": "base",
                        "max_height": "",
                        "min_height": "",
                        "border_style": ""
                      }
                    ],
                    "component": "shared_shadcn_container",
                    "container_as": "div"
                  }
                ],
                "styles": [
                  {
                    "gap": [
                      "gap-10"
                    ],
                    "wrap": false,
                    "align": "",
                    "width": "",
                    "border": [],
                    "height": "",
                    "margin": [],
                    "shadow": "",
                    "display": "",
                    "justify": "justify-between",
                    "padding": [],
                    "component": "shared_styles_options",
                    "direction": "flex-col",
                    "max_width": "",
                    "min_width": "",
                    "text_size": "",
                    "breakpoint": "base",
                    "max_height": "",
                    "min_height": "",
                    "border_style": ""
                  }
                ],
                "component": "shared_shadcn_container",
                "container_as": "div"
              }
            ],
            "styles": [
              {
                "wrap": false,
                "align": "",
                "group": false,
                "width": "",
                "border": [
                  "border-0"
                ],
                "height": "",
                "margin": [],
                "shadow": "",
                "display": "",
                "justify": "",
                "padding": [],
                "variant": "last",
                "component": "shared_styles_options",
                "direction": "",
                "max_width": "",
                "min_width": "",
                "text_size": "",
                "breakpoint": "base",
                "max_height": "",
                "min_height": "",
                "border_style": ""
              },
              {
                "gap": [
                  "gap-10"
                ],
                "wrap": false,
                "align": "",
                "width": "",
                "border": [
                  "border-b"
                ],
                "height": "",
                "margin": [],
                "shadow": "",
                "display": "flex",
                "justify": "",
                "padding": [
                  "py-20"
                ],
                "component": "shared_styles_options",
                "direction": "flex-col",
                "max_width": "",
                "min_width": "",
                "text_size": "",
                "breakpoint": "base",
                "max_height": "",
                "min_height": "",
                "border_style": "",
                "border_width": "",
                "border_color_light": "border-muted"
              },
              {
                "wrap": false,
                "align": "",
                "width": "",
                "border": [],
                "height": "",
                "margin": [],
                "shadow": "",
                "display": "",
                "justify": "",
                "padding": [],
                "component": "shared_styles_options",
                "direction": "flex-row",
                "max_width": "",
                "min_width": "",
                "text_size": "",
                "breakpoint": "sm",
                "max_height": "",
                "min_height": "",
                "border_style": ""
              },
              {
                "wrap": false,
                "align": "",
                "width": "",
                "border": [
                  "border-r"
                ],
                "height": "",
                "margin": [],
                "shadow": "",
                "display": "",
                "justify": "",
                "padding": [
                  "pr-16"
                ],
                "component": "shared_styles_options",
                "direction": "",
                "max_width": "",
                "min_width": "",
                "text_size": "",
                "breakpoint": "lg",
                "max_height": "",
                "min_height": "",
                "border_style": ""
              },
              {
                "wrap": false,
                "align": "",
                "width": "",
                "border": [],
                "height": "",
                "margin": [],
                "shadow": "",
                "display": "",
                "justify": "",
                "padding": [
                  "pr-24"
                ],
                "component": "shared_styles_options",
                "direction": "",
                "max_width": "",
                "min_width": "",
                "text_size": "",
                "breakpoint": "xl",
                "max_height": "",
                "min_height": "",
                "border_style": ""
              }
            ],
            "component": "shared_shadcn_container",
            "container_as": "li"
          }
        ],
        "styles": [
          {
            "wrap": false,
            "align": "",
            "group": true,
            "width": "",
            "border": [],
            "height": "",
            "margin": [],
            "shadow": "",
            "display": "",
            "justify": "",
            "padding": [],
            "variant": "",
            "component": "shared_styles_options",
            "direction": "",
            "max_width": "",
            "min_width": "",
            "text_size": "",
            "breakpoint": "base",
            "max_height": "",
            "min_height": "",
            "border_style": ""
          }
        ],
        "component": "shared_shadcn_container",
        "container_as": "ul"
      }
    ],
    "styles": [
      {
        "wrap": false,
        "align": "",
        "width": "",
        "height": "",
        "margin": [],
        "shadow": "",
        "display": "flex",
        "justify": "",
        "padding": [
          "px-4",
          "py-32"
        ],
        "variant": "",
        "component": "shared_styles_options",
        "direction": "flex-col",
        "max_width": "",
        "min_width": "",
        "text_size": "",
        "breakpoint": "base",
        "max_height": "",
        "min_height": "",
        "border_style": ""
      }
    ],
    "component": "shared_shadcn_container",
    "container_as": "section"
  },
  "setters": [
    {
      "sectionName": "case_studies_2_section",
      "premadeField": "description",
      "targetPath": "$.items.0.items.0.items.0.content"
    },
    {
      "sectionName": "case_studies_2_section",
      "premadeField": "name",
      "targetPath": "$.items.0.items.0.items.1.content"
    },
    {
      "sectionName": "case_studies_2_study",
      "premadeField": "image",
      "targetPath": "$.items.1.items.0.items.0.image_light"
    },
    {
      "sectionName": "case_studies_2_study",
      "premadeField": "quote",
      "targetPath": "$.items.1.items.0.items.1.items.0.content"
    },
    {
      "sectionName": "case_studies_2_study",
      "premadeField": "name",
      "targetPath": "$.items.1.items.0.items.1.items.1.items.0.items.0.content"
    },
    {
      "sectionName": "case_studies_2_study",
      "premadeField": "position",
      "targetPath": "$.items.1.items.0.items.1.items.1.items.0.items.1.items.0.content"
    },
    {
      "sectionName": "case_studies_2_study",
      "premadeField": "company_logo",
      "targetPath": "$.items.1.items.0.items.1.items.1.items.0.items.1.items.1.image_light"
    },
    {
      "sectionName": "case_studies_2_statistic",
      "premadeField": "headline_number",
      "targetPath": "$.items.1.items.0.items.1.items.1.items.1.items.0.items.0.content"
    },
    {
      "sectionName": "case_studies_2_statistic",
      "premadeField": "what_it_measures",
      "targetPath": "$.items.1.items.0.items.1.items.1.items.1.items.0.items.1.content"
    },
    {
      "sectionName": "case_studies_2_statistic",
      "premadeField": "source_or_context",
      "targetPath": "$.items.1.items.0.items.1.items.1.items.1.items.0.items.2.content"
    }
  ],
  "repeaters": [
    {
      "nodePath": "$.items.1.items.0",
      "sectionName": "case_studies_2_study",
      "mode": "self_clone"
    },
    {
      "nodePath": "$.items.1.items.0.items.1.items.1.items.1",
      "sectionName": "case_studies_2_statistic",
      "mode": "wrapper_children"
    }
  ]
} satisfies BuilderPrecompiledHydrationPlan;

export const hydrate_case_studies_2_section: BuilderTemplateHydrator = (blok) =>
  applyPrecompiledHydrationPlan(hydrationPlan, blok);
