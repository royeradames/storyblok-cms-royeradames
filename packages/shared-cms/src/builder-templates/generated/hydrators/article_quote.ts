import { applyPrecompiledHydrationPlan } from "../../applyPrecompiledHydrationPlan";
import type {
  BuilderPrecompiledHydrationPlan,
  BuilderTemplateHydrator,
} from "../../types";

const hydrationPlan = {
  "rootSectionName": "article_quote",
  "skeleton": {
    "size": "base",
    "align": "left",
    "color": "primary",
    "styles": [
      {
        "wrap": false,
        "align": "",
        "group": false,
        "width": "",
        "border": [
          "border-l-4"
        ],
        "height": "",
        "margin": [],
        "shadow": "",
        "display": "",
        "justify": "",
        "padding": [
          "pl-4"
        ],
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
        "border_color_light": "border-muted",
        "border_color_dark_custom": {
          "color": "#364152",
          "plugin": "native-color-picker"
        },
        "border_color_light_custom": {
          "color": "#f40000",
          "plugin": "native-color-picker"
        }
      }
    ],
    "weight": "medium",
    "content": "After all,” he said, “everyone enjoys a good joke, so it's only fair that they should pay for the privilege.",
    "element": "blockquote",
    "sr_only": false,
    "component": "shared_shadcn_text",
    "color_dark": {
      "color": "#f3f4f6",
      "plugin": "native-color-picker"
    },
    "font_style": "italic",
    "color_light": {
      "color": "",
      "plugin": "native-color-picker"
    },
    "line_height": "normal",
    "letter_spacing": "normal"
  },
  "setters": [
    {
      "sectionName": "article_quote",
      "premadeField": "quote",
      "targetPath": "$.content"
    }
  ],
  "repeaters": []
} satisfies BuilderPrecompiledHydrationPlan;

export const hydrate_article_quote: BuilderTemplateHydrator = (blok) =>
  applyPrecompiledHydrationPlan(hydrationPlan, blok);
