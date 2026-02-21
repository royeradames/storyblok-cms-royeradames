import { applyPrecompiledHydrationPlan } from "../../../structure-generator/applyPrecompiledHydrationPlan";
import type {
  BuilderPrecompiledHydrationPlan,
  BuilderTemplateHydrator,
} from "../../types";

const hydrationPlan = {
  "rootSectionName": "article_link",
  "skeleton": {
    "size": "default",
    "text": "Read more",
    "variant": "link",
    "component": "shared_shadcn_button"
  },
  "setters": [
    {
      "sectionName": "article_link",
      "premadeField": "link",
      "targetPath": "$.link"
    },
    {
      "sectionName": "article_link",
      "premadeField": "content",
      "targetPath": "$.text"
    }
  ],
  "repeaters": []
} satisfies BuilderPrecompiledHydrationPlan;

export const hydrate_article_link: BuilderTemplateHydrator = (blok) =>
  applyPrecompiledHydrationPlan(hydrationPlan, blok);
