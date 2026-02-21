import type { BuilderPrecompiledHydrationPlan } from "./types";
import { applyPrecompiledHydrationPlan } from "./applyPrecompiledHydrationPlan";

export function buildStructureFromTemplate(
  template: unknown,
  blok: Record<string, unknown>,
): Record<string, unknown> {
  return hydrateCompiledTemplate(template, blok);
}

export function hydrateCompiledTemplate(
  template: unknown,
  blok: Record<string, unknown>,
): Record<string, unknown> {
  if (!isPrecompiledHydrationPlan(template)) {
    throw new Error(
      "Expected precompiled hydration plan artifact. Regenerate templates with bun run storyblok:seed:templates.",
    );
  }
  return applyPrecompiledHydrationPlan(template, blok);
}

function isPrecompiledHydrationPlan(
  value: unknown,
): value is BuilderPrecompiledHydrationPlan {
  if (!isObject(value)) return false;

  return (
    typeof value.rootSectionName === "string" &&
    isObject(value.skeleton) &&
    Array.isArray(value.setters) &&
    Array.isArray(value.repeaters)
  );
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
