import type { CaseStudies2Blok } from "./case-studies-2.types";
import { caseStudies2SectionBuilderRaw } from "./sectionBuilderRaw";
import { generateElements } from "./structure";

/**
 * Need to do this programmatically
 * 1. build the sections
 * 2. pass the sectionBlok
 * 3. update _uid to section uid with -[number dep] pattern
 * 4. attach field to content
 */
export function generateStructure(blok: CaseStudies2Blok) {
  const raw = caseStudies2SectionBuilderRaw();
  const formatedRaw = formatRaw(raw, blok);
  return formatedRaw;
}

function formatRaw(raw: Record<string, any>, blok: CaseStudies2Blok) {
  // raw needs to be formated has the generateElements function does
  console.error("raw not formated", raw);
  const formatedRaw = generateElements(blok);
  return formatedRaw;
}
