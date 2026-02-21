import { applyPrecompiledHydrationPlan } from "../../applyPrecompiledHydrationPlan";
import type {
  BuilderPrecompiledHydrationPlan,
  BuilderTemplateHydrator,
} from "../../types";

const hydrationPlan = {
  "rootSectionName": "article_unordered_list",
  "skeleton": {
    "size": "base",
    "align": "left",
    "color": "default",
    "weight": "normal",
    "content": "List content",
    "element": "p",
    "sr_only": false,
    "component": "shared_shadcn_text",
    "font_style": "normal",
    "line_height": "normal",
    "letter_spacing": "normal"
  },
  "setters": [
    {
      "sectionName": "article_unordered_list",
      "premadeField": "content",
      "targetPath": "$.content"
    }
  ],
  "repeaters": []
} satisfies BuilderPrecompiledHydrationPlan;

export const hydrate_article_unordered_list: BuilderTemplateHydrator = (blok) =>
  applyPrecompiledHydrationPlan(hydrationPlan, blok);
