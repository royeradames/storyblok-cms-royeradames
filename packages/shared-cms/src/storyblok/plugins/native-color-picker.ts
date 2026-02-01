/** Value shape from Storyblok native-color-picker plugin. */
export type NativeColorPickerValue = {
  _uid?: string;
  color?: string;
  plugin?: "native-color-picker";
};

/** Plugin default when no color is set. Treat as "no override" in app code. */
export const NATIVE_COLOR_PICKER_DEFAULT = "#f40000";

/** Resolves plugin value to hex string, or undefined if empty/default. */
export function getColorValue(
  value: NativeColorPickerValue | null | undefined
): string | undefined {
  if (value == null) return undefined;
  const s = value.color?.trim() || undefined;
  if (!s) return undefined;
  if (s.toLowerCase() === NATIVE_COLOR_PICKER_DEFAULT) return undefined;
  return s;
}
