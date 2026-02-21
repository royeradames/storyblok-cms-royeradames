import { applyPrecompiledHydrationPlan } from "../../../structure-generator/applyPrecompiledHydrationPlan";
import type {
  BuilderPrecompiledHydrationPlan,
  BuilderTemplateHydrator,
} from "../../types";

const hydrationPlan = {
  "rootSectionName": "article_heading_1",
  "skeleton": {
    "size": "4xl",
    "align": "left",
    "color": "default",
    "styles": [
      {
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
        "variant": "none",
        "component": "shared_styles_options",
        "direction": "",
        "max_width": "",
        "min_width": "",
        "text_size": "",
        "breakpoint": "base",
        "max_height": "",
        "min_height": "",
        "border_style": "",
        "custom_max_width": "",
        "border_color_dark": "",
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
    "weight": "bold",
    "content": "The King",
    "element": "h1",
    "sr_only": false,
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
  "setters": [
    {
      "sectionName": "article_heading_1",
      "premadeField": "title",
      "targetPath": "$.content"
    }
  ],
  "repeaters": []
} satisfies BuilderPrecompiledHydrationPlan;

export const hydrate_article_heading_1: BuilderTemplateHydrator = (blok) =>
  applyPrecompiledHydrationPlan(hydrationPlan, blok);
