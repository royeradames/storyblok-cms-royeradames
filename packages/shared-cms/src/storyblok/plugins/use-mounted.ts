"use client";

import { useEffect, useState } from "react";

/** True after the component has mounted. Use to avoid hydration mismatch for theme-dependent output. */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
