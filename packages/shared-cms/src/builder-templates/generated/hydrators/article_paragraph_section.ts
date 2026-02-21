import { applyPrecompiledHydrationPlan } from "../../../structure-generator/applyPrecompiledHydrationPlan";
import type {
  BuilderPrecompiledHydrationPlan,
  BuilderTemplateHydrator,
} from "../../types";

const hydrationPlan = {
  "rootSectionName": "",
  "skeleton": {
    "name": "",
    "items": [
      {
        "size": "base",
        "align": "left",
        "color": "default",
        "styles": [],
        "weight": "normal",
        "content": "The king thought long and hard, and finally came up with a brilliant plan: he would tax the jokes in the kingdom.",
        "element": "p",
        "sr_only": false,
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
    "styles": [],
    "component": "shared_shadcn_container",
    "container_as": "div",
    "rich_text_test": {
      "type": "doc",
      "content": [
        {
          "type": "paragraph"
        }
      ]
    }
  },
  "setters": [],
  "repeaters": []
} satisfies BuilderPrecompiledHydrationPlan;

export const hydrate_article_paragraph_section: BuilderTemplateHydrator = (blok) =>
  applyPrecompiledHydrationPlan(hydrationPlan, blok);
