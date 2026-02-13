#!/usr/bin/env bun
/**
 * Sync Styles safelist artifact from shared-cms into gateway.
 * Shared-cms owns generation; gateway consumes a copied artifact for Tailwind @source.
 */

import * as fs from "fs";
import * as path from "path";
import {
  STYLES_SAFELIST_ARTIFACT_RELATIVE_PATH,
  type SafelistProfile,
  writeStylesSafelistArtifact,
} from "@repo/shared-cms/styles-safelist";

const SAFELIST_PROFILE: SafelistProfile =
  process.env.STYLES_SAFELIST_PROFILE === "full" ? "full" : "dev";

const SHARED_CMS_ROOT = path.resolve(process.cwd(), "../../packages/shared-cms");
const SHARED_ARTIFACT_PATH = path.join(
  SHARED_CMS_ROOT,
  STYLES_SAFELIST_ARTIFACT_RELATIVE_PATH,
);
const OUT_PATH = path.join(process.cwd(), "src/app/styles-safelist.txt");

function main() {
  const { outputPath: sharedOutputPath, classCount } = writeStylesSafelistArtifact(
    SAFELIST_PROFILE,
    SHARED_CMS_ROOT,
  );
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.copyFileSync(SHARED_ARTIFACT_PATH, OUT_PATH);
  console.log(`Generated shared artifact at ${sharedOutputPath}`);
  console.log(
    `Copied ${classCount} classes to ${OUT_PATH} (profile=${SAFELIST_PROFILE})`,
  );
}

main();
