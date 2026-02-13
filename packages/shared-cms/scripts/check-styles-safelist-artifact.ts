#!/usr/bin/env bun

import * as fs from "fs";
import { buildStylesSafelist, resolveStylesSafelistArtifactPath, type SafelistProfile } from "../src/styles/styles_options";

const profileEnv = process.env.STYLES_SAFELIST_PROFILE;
const profile: SafelistProfile = profileEnv === "full" ? "full" : "dev";
const artifactPath = resolveStylesSafelistArtifactPath(process.cwd());
const expected = buildStylesSafelist(profile);

if (!fs.existsSync(artifactPath)) {
  console.error(`Missing safelist artifact at ${artifactPath}`);
  process.exit(1);
}

const actual = fs.readFileSync(artifactPath, "utf-8");
if (actual !== expected) {
  console.error(
    "Safelist artifact is stale. Run `bun run styles:safelist:generate` in packages/shared-cms.",
  );
  process.exit(1);
}

console.log(`Safelist artifact is up to date (${artifactPath}, profile=${profile}).`);
