import { applyPrecompiledHydrationPlan } from "../../applyPrecompiledHydrationPlan";
import type {
  BuilderPrecompiledHydrationPlan,
  BuilderTemplateHydrator,
} from "../../types";

const hydrationPlan = {
  "rootSectionName": "article_paragraph",
  "skeleton": {
    "size": "base",
    "align": "left",
    "color": "default",
    "weight": "normal",
    "content": "Paragraph text",
    "element": "p",
    "sr_only": false,
    "component": "shared_shadcn_text",
    "font_style": "normal",
    "line_height": "normal",
    "letter_spacing": "normal"
  },
  "setters": [
    {
      "sectionName": "article_paragraph",
      "premadeField": "content",
      "targetPath": "$.content"
    }
  ],
  "repeaters": []
} satisfies BuilderPrecompiledHydrationPlan;

export const hydrate_article_paragraph: BuilderTemplateHydrator = (blok) =>
  applyPrecompiledHydrationPlan(hydrationPlan, blok);
