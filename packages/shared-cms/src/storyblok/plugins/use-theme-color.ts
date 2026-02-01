"use client";

import { useTheme } from "next-themes";
import {
  type NativeColorPickerValue,
  getColorValue,
} from "./native-color-picker";

/** Resolves light/dark plugin colors to the current theme color. */
export function useThemeColor(
  colorLight: NativeColorPickerValue | null | undefined,
  colorDark: NativeColorPickerValue | null | undefined
): string | undefined {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  return getColorValue(isDark ? colorDark : colorLight);
}
