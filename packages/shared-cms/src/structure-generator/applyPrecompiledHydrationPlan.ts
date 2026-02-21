import type {
  BuilderCompiledRepeater,
  BuilderPrecompiledHydrationPlan,
} from "../builder-templates/types";

type PathSegment = string | number;
type HydrationRecord = Record<string, unknown>;
type SectionContext = Record<string, HydrationRecord>;

type Scope = {
  templatePrefix: PathSegment[];
  outputPrefix: PathSegment[];
  context: SectionContext;
  repeaterIndex: number | null;
};

type RuntimeRepeater = BuilderCompiledRepeater & {
  index: number;
  pathSegments: PathSegment[];
  parentIndex: number | null;
};

type RuntimeSetter = BuilderPrecompiledHydrationPlan["setters"][number] & {
  pathSegments: PathSegment[];
  nearestRepeaterIndex: number | null;
};

export function applyPrecompiledHydrationPlan(
  plan: BuilderPrecompiledHydrationPlan,
  blok: Record<string, unknown>,
): Record<string, unknown> {
  const hydratedRoot = structuredClone(plan.skeleton) as HydrationRecord;
  const rootContext: SectionContext = {};
  if (plan.rootSectionName.length > 0) {
    rootContext[plan.rootSectionName] = blok;
  }

  const runtimeRepeaters = buildRuntimeRepeaters(plan.repeaters);
  const runtimeSetters = buildRuntimeSetters(plan, runtimeRepeaters);
  const applyScope = createScopeApplier(
    hydratedRoot,
    runtimeRepeaters,
    runtimeSetters,
  );

  applyScope({
    templatePrefix: [],
    outputPrefix: [],
    context: rootContext,
    repeaterIndex: null,
  });

  hydratedRoot.sectionBlok = blok;
  hydratedRoot._uid = blok._uid;
  return hydratedRoot;
}

function createScopeApplier(
  hydratedRoot: HydrationRecord,
  runtimeRepeaters: RuntimeRepeater[],
  runtimeSetters: RuntimeSetter[],
): (scope: Scope) => void {
  const applyScope = (scope: Scope): void => {
    applySettersForScope(hydratedRoot, runtimeSetters, scope);

    runtimeRepeaters.forEach((repeater) => {
      if (repeater.parentIndex !== scope.repeaterIndex) return;
      if (!startsWithPath(repeater.pathSegments, scope.templatePrefix)) return;

      applyRepeaterForScope(
        hydratedRoot,
        repeater,
        scope,
        applyScope,
      );
    });
  };

  return applyScope;
}

function applyRepeaterForScope(
  hydratedRoot: HydrationRecord,
  repeater: RuntimeRepeater,
  scope: Scope,
  applyScope: (scope: Scope) => void,
): void {
  const repeaterOutputPath = remapPathPrefix(
    repeater.pathSegments,
    scope.templatePrefix,
    scope.outputPrefix,
  );
  const repeaterNode = getAtPath(hydratedRoot, repeaterOutputPath);
  if (!isRecord(repeaterNode)) return;

  const dataArray = findDataArray(repeater.sectionName, scope.context);
  if (dataArray.length === 0) {
    applyScope({
      templatePrefix: repeater.pathSegments,
      outputPrefix: repeaterOutputPath,
      context: scope.context,
      repeaterIndex: repeater.index,
    });
    return;
  }

  if (repeater.mode === "wrapper_children") {
    const itemsPath = [...repeaterOutputPath, "items"];
    const templateChildren = getAtPath(hydratedRoot, itemsPath);
    if (!Array.isArray(templateChildren)) return;

    const originalChildren = templateChildren.map((child) => structuredClone(child));
    const expandedChildren: unknown[] = [];

    dataArray.forEach((dataEntry) => {
      const entryContext = {
        ...scope.context,
        [repeater.sectionName]: dataEntry,
      };

      originalChildren.forEach((templateChild, childIndex) => {
        const childClone = structuredClone(templateChild);
        if (isRecord(childClone)) {
          childClone.sectionBlok = dataEntry;
          childClone._uid = dataEntry._uid ?? childClone._uid;
        }

        const insertedIndex = expandedChildren.push(childClone) - 1;
        applyScope({
          templatePrefix: [...repeater.pathSegments, "items", childIndex],
          outputPrefix: [...itemsPath, insertedIndex],
          context: entryContext,
          repeaterIndex: repeater.index,
        });
      });
    });

    setAtPath(hydratedRoot, itemsPath, expandedChildren);
    return;
  }

  const parentPath = repeaterOutputPath.slice(0, -1);
  const templateIndex = repeaterOutputPath[repeaterOutputPath.length - 1];
  if (typeof templateIndex !== "number") return;

  const parentItems = getAtPath(hydratedRoot, parentPath);
  if (!Array.isArray(parentItems)) return;

  const clones = dataArray.map(() => structuredClone(repeaterNode));
  parentItems.splice(templateIndex, 1, ...clones);

  clones.forEach((clone, cloneOffset) => {
    const dataEntry = dataArray[cloneOffset];
    if (!dataEntry) return;
    const entryContext = {
      ...scope.context,
      [repeater.sectionName]: dataEntry,
    };

    if (isRecord(clone)) {
      clone.sectionBlok = dataEntry;
      clone._uid = dataEntry._uid ?? clone._uid;
    }

    applyScope({
      templatePrefix: repeater.pathSegments,
      outputPrefix: [...parentPath, templateIndex + cloneOffset],
      context: entryContext,
      repeaterIndex: repeater.index,
    });
  });
}

function buildRuntimeSetters(
  plan: BuilderPrecompiledHydrationPlan,
  runtimeRepeaters: RuntimeRepeater[],
): RuntimeSetter[] {
  return plan.setters.map((setter) => {
    const pathSegments = parseNodePath(setter.targetPath);
    const nearestRepeaterIndex = findNearestRepeaterIndex(
      pathSegments,
      runtimeRepeaters,
    );

    return {
      ...setter,
      pathSegments,
      nearestRepeaterIndex,
    };
  });
}

function buildRuntimeRepeaters(repeaters: BuilderCompiledRepeater[]): RuntimeRepeater[] {
  const runtimeRepeaters = repeaters.map((repeater, index) => ({
    ...repeater,
    index,
    pathSegments: parseNodePath(repeater.nodePath),
    parentIndex: null as number | null,
  }));

  runtimeRepeaters.forEach((repeater) => {
    let parentIndex: number | null = null;
    let deepestParentLength = -1;

    runtimeRepeaters.forEach((candidate) => {
      if (candidate.index === repeater.index) return;
      if (!startsWithPath(repeater.pathSegments, candidate.pathSegments)) return;
      const candidateLength = candidate.pathSegments.length;
      if (candidateLength > deepestParentLength) {
        parentIndex = candidate.index;
        deepestParentLength = candidateLength;
      }
    });

    repeater.parentIndex = parentIndex;
  });

  return runtimeRepeaters;
}

function applySettersForScope(
  hydratedRoot: HydrationRecord,
  runtimeSetters: RuntimeSetter[],
  scope: Scope,
): void {
  runtimeSetters.forEach((setter) => {
    if (setter.nearestRepeaterIndex !== scope.repeaterIndex) return;
    if (!startsWithPath(setter.pathSegments, scope.templatePrefix)) return;

    const sectionData = scope.context[setter.sectionName];
    if (!sectionData) return;

    const value = sectionData[setter.premadeField];
    if (value === undefined) return;

    const outputPath = remapPathPrefix(
      setter.pathSegments,
      scope.templatePrefix,
      scope.outputPrefix,
    );
    setAtPath(hydratedRoot, outputPath, value);
  });
}

function findNearestRepeaterIndex(
  pathSegments: PathSegment[],
  runtimeRepeaters: RuntimeRepeater[],
): number | null {
  let nearest: number | null = null;
  let nearestLength = -1;

  runtimeRepeaters.forEach((repeater) => {
    if (!startsWithPath(pathSegments, repeater.pathSegments)) return;
    const candidateLength = repeater.pathSegments.length;
    if (candidateLength > nearestLength) {
      nearest = repeater.index;
      nearestLength = candidateLength;
    }
  });

  return nearest;
}

function findDataArray(
  sectionName: string,
  context: SectionContext,
): HydrationRecord[] {
  for (const sectionData of Object.values(context)) {
    for (const value of Object.values(sectionData)) {
      if (!Array.isArray(value) || value.length === 0) continue;

      const firstEntry = value[0];
      if (!isRecord(firstEntry)) continue;

      const componentName =
        typeof firstEntry.component === "string" ? firstEntry.component : "";
      if (
        componentName === sectionName ||
        componentName.replace(/^shared_/, "") === sectionName
      ) {
        return value as HydrationRecord[];
      }
    }
  }

  return [];
}

function remapPathPrefix(
  pathSegments: PathSegment[],
  fromPrefix: PathSegment[],
  toPrefix: PathSegment[],
): PathSegment[] {
  const suffix = pathSegments.slice(fromPrefix.length);
  return [...toPrefix, ...suffix];
}

function startsWithPath(
  fullPath: PathSegment[],
  prefix: PathSegment[],
): boolean {
  if (prefix.length > fullPath.length) return false;
  for (let index = 0; index < prefix.length; index++) {
    if (fullPath[index] !== prefix[index]) return false;
  }
  return true;
}

function parseNodePath(nodePath: string): PathSegment[] {
  if (nodePath === "$") return [];

  return nodePath
    .split(".")
    .slice(1)
    .map((segment) => (/^\d+$/.test(segment) ? Number(segment) : segment));
}

function getAtPath(
  root: unknown,
  pathSegments: PathSegment[],
): unknown {
  let current = root;
  for (const segment of pathSegments) {
    if (!isRecord(current) && !Array.isArray(current)) return undefined;
    current = (current as any)[segment];
  }
  return current;
}

function setAtPath(
  root: unknown,
  pathSegments: PathSegment[],
  value: unknown,
): void {
  if (pathSegments.length === 0) return;

  const parentPath = pathSegments.slice(0, -1);
  const leafSegment = pathSegments[pathSegments.length - 1];
  if (leafSegment === undefined) return;
  const parent = getAtPath(root, parentPath);
  if (!isRecord(parent) && !Array.isArray(parent)) return;
  (parent as any)[leafSegment] = value;
}

function isRecord(value: unknown): value is HydrationRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
