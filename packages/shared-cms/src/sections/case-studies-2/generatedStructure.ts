import type { CaseStudies2Blok, DataFieldsEntry } from "./case-studies-2.types";
import { caseStudies2SectionBuilderRaw } from "./sectionBuilderRaw";
import { generateElements } from "./structure";

function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a == null || b == null || typeof a !== "object" || typeof b !== "object")
    return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const keysA = Object.keys(a as object);
  const keysB = Object.keys(b as object);
  if (keysA.length !== keysB.length) return false;
  return keysA.every(
    (key) =>
      keysB.includes(key) &&
      deepEqual(
        (a as Record<string, unknown>)[key],
        (b as Record<string, unknown>)[key],
      ),
  );
}
/**
 * Need to do this programmatically
 * 1. build the sections
 * 2. pass the sectionBlok
 * 3. update _uid to section uid with -[number dep] pattern
 * 4. attach field to content
 */
const raw = caseStudies2SectionBuilderRaw();
export function generateStructure(blok: CaseStudies2Blok) {
  const formatedRaw = formatRaw(raw, blok);
  return formatedRaw;
}

function formatRaw(baseStructure: typeof raw, cmsData: CaseStudies2Blok) {
  console.log("formatRaw");
  const dataFieldsNames = cmsData.data_fields;
  const intialStructure = structuredClone(baseStructure);
  console.log("intial structure", intialStructure);
  for (const [
    index,
    [structureKeyLevel1, structureValueLevel1],
  ] of Object.entries(baseStructure).entries()) {
    takeActionOnStructure(
      structureKeyLevel1,
      structureValueLevel1,
      cmsData,
      baseStructure,
      dataFieldsNames,
      `-${index}`,
    );
    runNestedObject(
      structureValueLevel1,
      cmsData,
      dataFieldsNames,
      `-${index}`,
    );
    runNestedArray(structureValueLevel1, cmsData, dataFieldsNames, `-${index}`);
  }

  // raw needs to be formated has the generateElements function does
  //   console.error("raw not formated", baseStructure);
  //   const formatedRaw = generateElements(cmsData);
  //   return formatedRaw;
  console.log("final structure", baseStructure);
  console.log(
    "is the same structure?",
    deepEqual(baseStructure, intialStructure),
  );
  return baseStructure;
}

function runNestedObject(
  structureObject: unknown,
  cmsData: CaseStudies2Blok,
  dataFieldsNames: DataFieldsEntry[],
  devLevel: string,
) {
  if (!isObject(structureObject)) {
    return;
  }

  for (const [
    nestedIndex,
    [nestedStructureKey, nestedStructureValue],
  ] of Object.entries(structureObject).entries()) {
    takeActionOnStructure(
      nestedStructureKey,
      nestedStructureValue,
      cmsData,
      structureObject,
      dataFieldsNames,
      `${devLevel}-${nestedIndex}`,
    );
    if (isObject(nestedStructureValue)) {
      runNestedObject(
        nestedStructureValue,
        cmsData,
        dataFieldsNames,
        `${devLevel}-${nestedIndex}`,
      );
    }
    if (Array.isArray(nestedStructureValue)) {
      runNestedArray(
        nestedStructureValue,
        cmsData,
        dataFieldsNames,
        `${devLevel}-${nestedIndex}`,
      );
    }
  }
}

function runNestedArray(
  structureValue: unknown,
  cmsData: CaseStudies2Blok,
  dataFieldsNames: DataFieldsEntry[],
  devLevel: string,
) {
  if (!Array.isArray(structureValue)) {
    return;
  }
  structureValue.forEach((nestedStructureObject: unknown) => {
    runNestedObject(nestedStructureObject, cmsData, dataFieldsNames, devLevel);
  });
}

function takeActionOnStructure(
  structureKey: string,
  structureValue: unknown,
  cmsData: CaseStudies2Blok,
  baseStructure: Record<string, any>,
  dataFieldsNames: DataFieldsEntry[],
  devLevel: string,
) {
  addSectionBlok(structureKey, cmsData, baseStructure);
  updateUid(structureKey, devLevel, cmsData, baseStructure);
  deleteEditableField(structureKey, baseStructure);
  connnectDataFieldToCmsField(
    structureKey,
    structureValue,
    dataFieldsNames,
    cmsData,
    baseStructure,
  );
}

const SECTION_BLOK_KEY = "sectionBlok";
const DATA_SECTION_NAME_KEY = "data_section_name";
function addSectionBlok(
  structureKey: string,
  cmsData: CaseStudies2Blok,
  stuctureObject: Record<string, any>,
): void {
  if (structureKey !== DATA_SECTION_NAME_KEY) {
    return;
  }
  stuctureObject[SECTION_BLOK_KEY] = cmsData;
}

function isObject(value: unknown): value is Record<string, any> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function updateUid(
  structureKey: string,
  devLevel: string,
  cmsData: CaseStudies2Blok,
  stuctureObject: Record<string, any>,
): void {
  if ("_uid" !== structureKey) {
    return;
  }
  if (!devLevel) {
    console.error("devLevel is required");
    return;
  }
  if (devLevel[0] === "0") {
    stuctureObject._uid = cmsData._uid;
    return;
  }
  stuctureObject._uid = `${cmsData._uid}-${devLevel}`;
  return;
}

function deleteEditableField(
  structureKey: string,
  structureValue: Record<string, any>,
): void {
  if ("_editable" !== structureKey) {
    return;
  }
  delete structureValue["_editable"];
}

const CMS_DATA_FIELD_NAME = "data_field_name";

function connnectDataFieldToCmsField(
  structureKey: string,
  structureValue: unknown,
  dataFieldsNames: DataFieldsEntry[],
  cmsData: CaseStudies2Blok,
  structureObject: Record<string, any>,
): void {
  if (structureKey !== CMS_DATA_FIELD_NAME) {
    return;
  }
  const dataField = dataFieldsNames.find(
    (dataField) => dataField.data_field_name === structureValue,
  );
  if (!dataField) {
    return;
  }
  structureObject[dataField.data_field_name] =
    cmsData[dataField.cms_field_key as unknown as keyof CaseStudies2Blok];
}
