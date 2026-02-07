import type { CaseStudies2Blok, DataFieldsEntry } from "./case-studies-2.types";
import { deepEqual } from "./deepEqual";
import { caseStudies2SectionBuilderRaw } from "./sectionBuilderRaw";
import { generateElements } from "./structure";

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
  const intialStructure = structuredClone(baseStructure);
  // console.log("cmsData", cmsData);
  const sectionData = organizeSectionsData(cmsData);
  // console.log("sectionData", sectionData);
  runNestedObject(baseStructure, sectionData);

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
function organizeSectionsData(
  premadeData: CaseStudies2Blok,
): Record<string, any> {
  const dataSectionsNames = premadeData.data_sections;
  const structurePremadeData: Record<string, any> = {};
  dataSectionsNames.forEach((sectionName) => {
    structurePremadeData[sectionName] = [];
  });
  populateSectionsData(premadeData, structurePremadeData);
  return structurePremadeData;
}

function populateSectionsData(
  premadeData: Record<string, any>,
  structurePremadeData: Record<string, any>,
) {
  for (const [key, value] of Object.entries(premadeData)) {
    if (SECTION_DATA_KEY === key) {
      if (value in structurePremadeData) {
        structurePremadeData[value].push(premadeData);
      }
    }

    if (Array.isArray(value)) {
      if (key === DATA_FIELDS_KEY) {
        continue;
      }
      value.forEach((item) => {
        if (isObject(item)) {
          populateSectionsData(item, structurePremadeData);
        }
      });
    }
  }
}
function runNestedObject(
  builderObject: unknown,
  premadeData: Record<string, any>,
) {
  if (!isObject(builderObject)) {
    return;
  }

  for (const [
    nestedIndex,
    [nestedBuilderKey, nestedBuilderValue],
  ] of Object.entries(builderObject).entries()) {
    takeActionOnStructure(
      nestedBuilderKey,
      nestedBuilderValue,
      premadeData,
      builderObject,
    );
    runNestedObject(nestedBuilderValue, premadeData);
    runNestedArray(nestedBuilderValue, premadeData);
  }
}

function runNestedArray(
  builderValue: unknown,
  premadeData: Record<string, any>,
) {
  if (!Array.isArray(builderValue)) {
    return;
  }
  builderValue.forEach((nestedStructureObject: unknown) => {
    runNestedObject(nestedStructureObject, premadeData);
  });
}

function takeActionOnStructure(
  builderLoopKey: string,
  builderValue: unknown,
  premadeData: Record<string, any>,
  builderObject: Record<string, any>,
) {
  if (Array.isArray(builderValue)) {
    return;
  }
  if (isObject(builderValue)) {
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
  const builderSection = stuctureObject[structureKey];
  if (!(builderSection in sectionData)) {
    return;
  }
  const builderSectionList = sectionData[builderSection];
  if (!builderSectionList) {
    debugger;
    return;
  }
  const currentBuilderSectionObject = builderSectionList[0];
  if (!currentBuilderSectionObject) {
    debugger;
    return;
  }
  stuctureObject._uid = currentBuilderSectionObject._uid;
  stuctureObject[SECTION_BLOK_KEY] = currentBuilderSectionObject;
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
