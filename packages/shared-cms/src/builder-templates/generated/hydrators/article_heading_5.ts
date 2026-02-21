import { applyPrecompiledHydrationPlan } from "../../applyPrecompiledHydrationPlan";
import type {
  BuilderPrecompiledHydrationPlan,
  BuilderTemplateHydrator,
} from "../../types";

const hydrationPlan = {
  "rootSectionName": "article_heading_5",
  "skeleton": {
    "size": "base",
    "align": "left",
    "color": "default",
    "weight": "semibold",
    "content": "Subheading level 5",
    "element": "h5",
    "sr_only": false,
    "component": "shared_shadcn_text",
    "font_style": "normal",
    "line_height": "normal",
    "letter_spacing": "normal"
  },
  "setters": [
    {
      "sectionName": "article_heading_5",
      "premadeField": "title",
      "targetPath": "$.content"
    }
  ],
  "repeaters": []
} satisfies BuilderPrecompiledHydrationPlan;

export const hydrate_article_heading_5: BuilderTemplateHydrator = (blok) =>
  applyPrecompiledHydrationPlan(hydrationPlan, blok);
