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
  // console.log("formatRaw");
  const dataFieldsNames = cmsData.data_fields;
  const intialStructure = structuredClone(baseStructure);
  // console.log("cmsData", cmsData);
  const sectionData = organizeSectionsData(cmsData);
  // console.log("sectionData", sectionData);
  runNestedObject(baseStructure, sectionData, dataFieldsNames);

  // raw needs to be formated has the generateElements function does
  //   console.error("raw not formated", baseStructure);
  //   const formatedRaw = generateElements(cmsData);
  //   return formatedRaw;

  console.log("intial structure", intialStructure);
  console.log("final structure", baseStructure);
  console.log(
    "is the same structure?",
    deepEqual(baseStructure, intialStructure),
  );
  // throw new Error("test");
  return baseStructure;
}

const SECTION_DATA_KEY = "data_entry_section";
const DATA_FIELDS_KEY = "data_fields";
function organizeSectionsData(cmsData: CaseStudies2Blok): Record<string, any> {
  const dataSectionsNames = cmsData.data_sections;
  const sectionsData: Record<string, any> = {};
  dataSectionsNames.forEach((sectionName) => {
    sectionsData[sectionName] = [];
  });
  populateSectionsData(cmsData, sectionsData);
  return sectionsData;
}

function populateSectionsData(
  cmsData: Record<string, any>,
  sectionsData: Record<string, any>,
) {
  for (const [key, value] of Object.entries(cmsData)) {
    if (SECTION_DATA_KEY === key) {
      if (value in sectionsData) {
        sectionsData[value].push(cmsData);
      }
    }

    if (Array.isArray(value)) {
      if (key === DATA_FIELDS_KEY) {
        continue;
      }
      value.forEach((item) => {
        if (isObject(item)) {
          populateSectionsData(item, sectionsData);
        }
      });
    }
  }
}
function runNestedObject(
  structureObject: unknown,
  sectionData: Record<string, any>,
  dataFieldsNames: DataFieldsEntry[],
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
      sectionData,
      structureObject,
      dataFieldsNames,
    );
    runNestedObject(nestedStructureValue, sectionData, dataFieldsNames);
    runNestedArray(nestedStructureValue, sectionData, dataFieldsNames);
  }
}

function runNestedArray(
  structureValue: unknown,
  sectionData: Record<string, any>,
  dataFieldsNames: DataFieldsEntry[],
) {
  if (!Array.isArray(structureValue)) {
    return;
  }
  structureValue.forEach((nestedStructureObject: unknown) => {
    runNestedObject(nestedStructureObject, sectionData, dataFieldsNames);
  });
}

function takeActionOnStructure(
  builderLoopKey: string,
  structureValue: unknown,
  premadeData: Record<string, any>,
  builderObject: Record<string, any>,
  dataFieldsNames: DataFieldsEntry[],
) {
  if (Array.isArray(structureValue)) {
    return;
  }
  if (isObject(structureValue)) {
    connnectDataFieldToCmsField(builderLoopKey, premadeData, builderObject);
    return;
  }

  addSectionBlok(builderLoopKey, premadeData, builderObject);
  updateUid(builderLoopKey, builderObject);
  deleteEditableField(builderLoopKey, builderObject);
  connnectDataFieldToCmsField(builderLoopKey, premadeData, builderObject);
}

const SECTION_BLOK_KEY = "sectionBlok";
const DATA_SECTION_NAME_KEY = "data_section_name";
function addSectionBlok(
  structureKey: string,
  sectionData: Record<string, any>,
  stuctureObject: Record<string, any>,
): void {
  if (structureKey !== DATA_SECTION_NAME_KEY) {
    return;
  }
  const sectionDataName = stuctureObject[structureKey];
  if (!(sectionDataName in sectionData)) {
    return;
  }
  const sectionDataList = sectionData[sectionDataName];
  if (!sectionDataList) {
    debugger;
    return;
  }
  const selectedSectionData = sectionDataList[0];
  if (!selectedSectionData) {
    debugger;
    return;
  }
  stuctureObject._uid = selectedSectionData._uid;
  stuctureObject[SECTION_BLOK_KEY] = selectedSectionData;
}

function isObject(value: unknown): value is Record<string, any> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function updateUid(
  structureKey: string,
  stuctureObject: Record<string, any>,
): void {
  if ("_uid" !== structureKey && !stuctureObject[DATA_SECTION_NAME_KEY]) {
    return;
  }
  stuctureObject._uid = crypto.randomUUID();
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

const PREMADE_FIELD: keyof Pick<DataFieldsEntry, "premade_field"> =
  "premade_field";
const PREMADE_SECTION: keyof Pick<DataFieldsEntry, "premade_section"> =
  "premade_section";
const BUILDER_FIELD: keyof Pick<DataFieldsEntry, "builder_field"> =
  "builder_field";
function connnectDataFieldToCmsField(
  builderLoopKey: string,
  premadeData: Record<string, any>,
  builderObject: Record<string, any>,
): void {
  if (builderLoopKey !== PREMADE_FIELD) {
    return;
  }
  const builderKey = builderObject[BUILDER_FIELD];
  if (!builderKey) {
    return;
  }
  const dataEntryFieldName = builderObject[PREMADE_FIELD];
  if (!dataEntryFieldName) {
    return;
  }
  const dataEntrySectionName = builderObject[PREMADE_SECTION];
  if (!dataEntrySectionName) {
    return;
  }
  const sectionDataList = premadeData[dataEntrySectionName];
  if (!sectionDataList) {
    debugger;
    return;
  }
  const sectionDataItem = sectionDataList[0];
  if (!sectionDataItem) {
    debugger;
    return;
  }
  const dataValue = sectionDataItem[dataEntryFieldName];
  builderObject[builderKey] = dataValue;
}
