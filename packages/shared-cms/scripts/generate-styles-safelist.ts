#!/usr/bin/env bun

import { writeStylesSafelistArtifact, type SafelistProfile } from "../src/styles/styles_options";

const profileEnv = process.env.STYLES_SAFELIST_PROFILE;
const profile: SafelistProfile = profileEnv === "full" ? "full" : "dev";

const { outputPath, classCount } = writeStylesSafelistArtifact(profile, process.cwd());
console.log(
  `Wrote ${classCount} style safelist classes to ${outputPath} (profile=${profile})`,
);
