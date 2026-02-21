import { applyPrecompiledHydrationPlan } from "../../../structure-generator/applyPrecompiledHydrationPlan";
import type {
  BuilderPrecompiledHydrationPlan,
  BuilderTemplateHydrator,
} from "../../types";

const hydrationPlan = {
  "rootSectionName": "social_link",
  "skeleton": {
    "link": {
      "id": "",
      "url": "https://www.linkedin.com/feed/",
      "target": "_blank",
      "linktype": "url",
      "fieldtype": "multilink",
      "cached_url": "https://www.linkedin.com/feed/"
    },
    "size": "auto",
    "label": [
      {
        "size": "base",
        "align": "left",
        "color": "default",
        "styles": [],
        "weight": "normal",
        "content": "LinedIn",
        "element": "p",
        "sr_only": true,
        "component": "shared_shadcn_text",
        "color_dark": {
          "color": "#f40000",
          "plugin": "native-color-picker"
        },
        "font_style": "",
        "color_light": {
          "color": "#f40000",
          "plugin": "native-color-picker"
        },
        "line_height": "normal",
        "letter_spacing": "normal"
      },
      {
        "name": "x-com",
        "size": "default",
        "styles": [
          {
            "gap": [],
            "top": "",
            "wrap": false,
            "align": "",
            "group": false,
            "width": "",
            "border": [],
            "height": "",
            "margin": [],
            "shadow": "",
            "display": "",
            "justify": "",
            "padding": [],
            "rounded": "",
            "variant": "group_hover",
            "position": "",
            "component": "shared_styles_options",
            "direction": "",
            "max_width": "",
            "min_width": "",
            "text_size": "",
            "breakpoint": "base",
            "max_height": "",
            "min_height": "",
            "flex_shrink": "",
            "border_style": "",
            "grid_columns": "",
            "text_color_dark": "",
            "custom_max_width": "",
            "text_color_light": "text-primary",
            "border_color_dark": "",
            "custom_max_height": "",
            "border_color_light": "",
            "text_color_dark_custom": {
              "color": "#f40000",
              "plugin": "native-color-picker"
            },
            "text_color_light_custom": {
              "color": "",
              "plugin": "native-color-picker"
            },
            "border_color_dark_custom": {
              "color": "#f40000",
              "plugin": "native-color-picker"
            },
            "border_color_light_custom": {
              "color": "#f40000",
              "plugin": "native-color-picker"
            }
          },
          {
            "gap": [],
            "top": "",
            "wrap": false,
            "align": "",
            "group": false,
            "width": "",
            "border": [],
            "height": "",
            "margin": [],
            "shadow": "",
            "display": "",
            "justify": "",
            "padding": [],
            "rounded": "",
            "variant": "none",
            "position": "",
            "component": "shared_styles_options",
            "direction": "",
            "max_width": "",
            "min_width": "",
            "text_size": "",
            "breakpoint": "base",
            "max_height": "",
            "min_height": "",
            "flex_shrink": "",
            "border_style": "",
            "grid_columns": "",
            "text_color_dark": "",
            "custom_max_width": "",
            "text_color_light": "text-muted-foreground",
            "border_color_dark": "",
            "custom_max_height": "",
            "border_color_light": "",
            "text_color_dark_custom": {
              "color": "#f40000",
              "plugin": "native-color-picker"
            },
            "text_color_light_custom": {
              "color": "#f40000",
              "plugin": "native-color-picker"
            },
            "border_color_dark_custom": {
              "color": "#f40000",
              "plugin": "native-color-picker"
            },
            "border_color_light_custom": {
              "color": "#f40000",
              "plugin": "native-color-picker"
            }
          }
        ],
        "component": "shared_shadcn_icon",
        "class_name": "",
        "color_dark": {
          "color": "#f40000",
          "plugin": "native-color-picker"
        },
        "color_light": {
          "color": "#f40000",
          "plugin": "native-color-picker"
        },
        "stroke_width": ""
      }
    ],
    "styles": [
      {
        "gap": [],
        "top": "",
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
        "rounded": "",
        "variant": "none",
        "position": "",
        "component": "shared_styles_options",
        "direction": "",
        "max_width": "",
        "min_width": "",
        "text_size": "",
        "breakpoint": "base",
        "max_height": "",
        "min_height": "",
        "flex_shrink": "",
        "border_style": "",
        "grid_columns": "",
        "text_color_dark": "",
        "custom_max_width": "",
        "text_color_light": "",
        "border_color_dark": "",
        "custom_max_height": "",
        "border_color_light": "",
        "text_color_dark_custom": {
          "color": "#f40000",
          "plugin": "native-color-picker"
        },
        "text_color_light_custom": {
          "color": "#f40000",
          "plugin": "native-color-picker"
        },
        "border_color_dark_custom": {
          "color": "#f40000",
          "plugin": "native-color-picker"
        },
        "border_color_light_custom": {
          "color": "#f40000",
          "plugin": "native-color-picker"
        }
      }
    ],
    "variant": "link",
    "component": "shared_shadcn_button"
  },
  "setters": [
    {
      "sectionName": "social_link",
      "premadeField": "link",
      "targetPath": "$.link"
    },
    {
      "sectionName": "social_link",
      "premadeField": "icon_title",
      "targetPath": "$.label.0.content"
    },
    {
      "sectionName": "social_link",
      "premadeField": "icon_name",
      "targetPath": "$.label.1.name"
    }
  ],
  "repeaters": []
} satisfies BuilderPrecompiledHydrationPlan;

export const hydrate_social_link: BuilderTemplateHydrator = (blok) =>
  applyPrecompiledHydrationPlan(hydrationPlan, blok);
