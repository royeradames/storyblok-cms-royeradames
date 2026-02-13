#!/usr/bin/env bun

import { componentDefinitions } from "../src/storyblok-seed/definitions";
import { coLocatedComponentDefinitions } from "../src/storyblok-seed/definitions/co-located";

const definitionNames = new Set(componentDefinitions.map((component) => component.name));
const missing = coLocatedComponentDefinitions
  .map((component) => component.name)
  .filter((name) => !definitionNames.has(name));

if (missing.length > 0) {
  console.error(
    `Missing co-located definitions in componentDefinitions: ${missing.join(", ")}`,
  );
  process.exit(1);
}

console.log(
  `Definition aggregation check passed (${coLocatedComponentDefinitions.length} co-located definitions).`,
);
