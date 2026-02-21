import { applyPrecompiledHydrationPlan } from "../../applyPrecompiledHydrationPlan";
import type {
  BuilderPrecompiledHydrationPlan,
  BuilderTemplateHydrator,
} from "../../types";

const hydrationPlan = {
  "rootSectionName": "article_embedded_component",
  "skeleton": {
    "size": "base",
    "align": "left",
    "color": "default",
    "weight": "normal",
    "content": "Embedded component text",
    "element": "p",
    "sr_only": false,
    "component": "shared_shadcn_text",
    "font_style": "normal",
    "line_height": "normal",
    "letter_spacing": "normal"
  },
  "setters": [
    {
      "sectionName": "article_embedded_component",
      "premadeField": "content",
      "targetPath": "$.content"
    }
  ],
  "repeaters": []
} satisfies BuilderPrecompiledHydrationPlan;

export const hydrate_article_embedded_component: BuilderTemplateHydrator = (blok) =>
  applyPrecompiledHydrationPlan(hydrationPlan, blok);
