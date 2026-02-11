/**
 * Tailwind class maps for layout/styles (display, flex, gap, padding, margin, sizing).
 * Shared by styles builder and Flex. Reference: tailwindcss.com docs.
 */

/** Tailwind default spacing: 1 unit = 0.25rem = 4px. For option labels (e.g. "gap-2 (8px)"). */
export const spacingTokenToPx: Record<string, string> = {
  "0": "0px",
  px: "1px",
  "0.5": "2px",
  "1": "4px",
  "1.5": "6px",
  "2": "8px",
  "2.5": "10px",
  "3": "12px",
  "3.5": "14px",
  "4": "16px",
  "5": "20px",
  "6": "24px",
  "7": "28px",
  "8": "32px",
  "9": "36px",
  "10": "40px",
  "11": "44px",
  "12": "48px",
  "14": "56px",
  "16": "64px",
  "20": "80px",
  "24": "96px",
  "28": "112px",
  "32": "128px",
  "36": "144px",
  "40": "160px",
  "44": "176px",
  "48": "192px",
  "52": "208px",
  "56": "224px",
  "60": "240px",
  "64": "256px",
  "72": "288px",
  "80": "320px",
  "96": "384px",
};

/**
 * Named size → px for option labels (e.g. "max-w-lg (512px)").
 * Covers max-w-xs…7xl, screen breakpoints, and prose.
 * Keyed by the suffix AFTER the property prefix (e.g. "lg", "screen-sm").
 */
export const namedSizeToPx: Record<string, string> = {
  xs: "320px", // 20rem
  sm: "384px", // 24rem
  md: "448px", // 28rem
  lg: "512px", // 32rem
  xl: "576px", // 36rem
  "2xl": "672px", // 42rem
  "3xl": "768px", // 48rem
  "4xl": "896px", // 56rem
  "5xl": "1024px", // 64rem
  "6xl": "1152px", // 72rem
  "7xl": "1280px", // 80rem
  prose: "65ch",
  "screen-sm": "640px",
  "screen-md": "768px",
  "screen-lg": "1024px",
  "screen-xl": "1280px",
  "screen-2xl": "1536px",
};

/** Text size font-size in px for option labels (e.g. "XS (12px)"). Tailwind default text-* scale. */
export const textSizeToPx: Record<string, string> = {
  xs: "12px",
  sm: "14px",
  base: "16px",
  lg: "18px",
  xl: "20px",
  "2xl": "24px",
  "3xl": "30px",
  "4xl": "36px",
  "5xl": "48px",
  "6xl": "60px",
  "7xl": "72px",
  "8xl": "96px",
  "9xl": "128px",
};

/** Text size → Tailwind class (e.g. xs → text-xs). For StylesBreakpointOptionsBlok. */
export const textSizeMap = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
  "5xl": "text-5xl",
  "6xl": "text-6xl",
  "7xl": "text-7xl",
  "8xl": "text-8xl",
  "9xl": "text-9xl",
} as const;

/** Display (opt-in; no default. Container always uses flex in code.) */
export const displayMap = {
  block: "block",
  "inline-block": "inline-block",
  inline: "inline",
  flex: "flex",
  "inline-flex": "inline-flex",
  grid: "grid",
  "inline-grid": "inline-grid",
  table: "table",
  "table-cell": "table-cell",
  hidden: "hidden",
} as const;

/** Flex Direction */
export const directionMap = {
  "flex-row": "flex-row",
  "flex-row-reverse": "flex-row-reverse",
  "flex-col": "flex-col",
  "flex-col-reverse": "flex-col-reverse",
} as const;

/** Justify Content */
export const justifyMap = {
  "justify-normal": "justify-normal",
  "justify-start": "justify-start",
  "justify-end": "justify-end",
  "justify-center": "justify-center",
  "justify-between": "justify-between",
  "justify-around": "justify-around",
  "justify-evenly": "justify-evenly",
  "justify-stretch": "justify-stretch",
} as const;

/** Align Items */
export const alignMap = {
  "items-start": "items-start",
  "items-end": "items-end",
  "items-center": "items-center",
  "items-baseline": "items-baseline",
  "items-stretch": "items-stretch",
} as const;

/** Gap */
export const gapMap = {
  "gap-0": "gap-0",
  "gap-x-0": "gap-x-0",
  "gap-y-0": "gap-y-0",
  "gap-px": "gap-px",
  "gap-x-px": "gap-x-px",
  "gap-y-px": "gap-y-px",
  "gap-0.5": "gap-0.5",
  "gap-x-0.5": "gap-x-0.5",
  "gap-y-0.5": "gap-y-0.5",
  "gap-1": "gap-1",
  "gap-x-1": "gap-x-1",
  "gap-y-1": "gap-y-1",
  "gap-1.5": "gap-1.5",
  "gap-x-1.5": "gap-x-1.5",
  "gap-y-1.5": "gap-y-1.5",
  "gap-2": "gap-2",
  "gap-x-2": "gap-x-2",
  "gap-y-2": "gap-y-2",
  "gap-2.5": "gap-2.5",
  "gap-x-2.5": "gap-x-2.5",
  "gap-y-2.5": "gap-y-2.5",
  "gap-3": "gap-3",
  "gap-x-3": "gap-x-3",
  "gap-y-3": "gap-y-3",
  "gap-3.5": "gap-3.5",
  "gap-x-3.5": "gap-x-3.5",
  "gap-y-3.5": "gap-y-3.5",
  "gap-4": "gap-4",
  "gap-x-4": "gap-x-4",
  "gap-y-4": "gap-y-4",
  "gap-5": "gap-5",
  "gap-x-5": "gap-x-5",
  "gap-y-5": "gap-y-5",
  "gap-6": "gap-6",
  "gap-x-6": "gap-x-6",
  "gap-y-6": "gap-y-6",
  "gap-7": "gap-7",
  "gap-x-7": "gap-x-7",
  "gap-y-7": "gap-y-7",
  "gap-8": "gap-8",
  "gap-x-8": "gap-x-8",
  "gap-y-8": "gap-y-8",
  "gap-9": "gap-9",
  "gap-x-9": "gap-x-9",
  "gap-y-9": "gap-y-9",
  "gap-10": "gap-10",
  "gap-x-10": "gap-x-10",
  "gap-y-10": "gap-y-10",
  "gap-11": "gap-11",
  "gap-x-11": "gap-x-11",
  "gap-y-11": "gap-y-11",
  "gap-12": "gap-12",
  "gap-x-12": "gap-x-12",
  "gap-y-12": "gap-y-12",
  "gap-14": "gap-14",
  "gap-x-14": "gap-x-14",
  "gap-y-14": "gap-y-14",
  "gap-16": "gap-16",
  "gap-x-16": "gap-x-16",
  "gap-y-16": "gap-y-16",
  "gap-20": "gap-20",
  "gap-x-20": "gap-x-20",
  "gap-y-20": "gap-y-20",
  "gap-24": "gap-24",
  "gap-x-24": "gap-x-24",
  "gap-y-24": "gap-y-24",
  "gap-28": "gap-28",
  "gap-x-28": "gap-x-28",
  "gap-y-28": "gap-y-28",
  "gap-32": "gap-32",
  "gap-x-32": "gap-x-32",
  "gap-y-32": "gap-y-32",
  "gap-36": "gap-36",
  "gap-x-36": "gap-x-36",
  "gap-y-36": "gap-y-36",
  "gap-40": "gap-40",
  "gap-x-40": "gap-x-40",
  "gap-y-40": "gap-y-40",
  "gap-44": "gap-44",
  "gap-x-44": "gap-x-44",
  "gap-y-44": "gap-y-44",
  "gap-48": "gap-48",
  "gap-x-48": "gap-x-48",
  "gap-y-48": "gap-y-48",
  "gap-52": "gap-52",
  "gap-x-52": "gap-x-52",
  "gap-y-52": "gap-y-52",
  "gap-56": "gap-56",
  "gap-x-56": "gap-x-56",
  "gap-y-56": "gap-y-56",
  "gap-60": "gap-60",
  "gap-x-60": "gap-x-60",
  "gap-y-60": "gap-y-60",
  "gap-64": "gap-64",
  "gap-x-64": "gap-x-64",
  "gap-y-64": "gap-y-64",
  "gap-72": "gap-72",
  "gap-x-72": "gap-x-72",
  "gap-y-72": "gap-y-72",
  "gap-80": "gap-80",
  "gap-x-80": "gap-x-80",
  "gap-y-80": "gap-y-80",
  "gap-96": "gap-96",
  "gap-x-96": "gap-x-96",
  "gap-y-96": "gap-y-96",
} as const;

const spacingScale = [
  "0",
  "px",
  "0.5",
  "1",
  "1.5",
  "2",
  "2.5",
  "3",
  "3.5",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "14",
  "16",
  "20",
  "24",
  "28",
  "32",
  "36",
  "40",
  "44",
  "48",
  "52",
  "56",
  "60",
  "64",
  "72",
  "80",
  "96",
] as const;

export const widthMap = {
  ...Object.fromEntries(spacingScale.map((s) => [`w-${s}`, `w-${s}`])),
  "w-auto": "w-auto",
  "w-1/2": "w-1/2",
  "w-1/3": "w-1/3",
  "w-2/3": "w-2/3",
  "w-1/4": "w-1/4",
  "w-2/4": "w-2/4",
  "w-3/4": "w-3/4",
  "w-1/5": "w-1/5",
  "w-2/5": "w-2/5",
  "w-3/5": "w-3/5",
  "w-4/5": "w-4/5",
  "w-1/6": "w-1/6",
  "w-2/6": "w-2/6",
  "w-3/6": "w-3/6",
  "w-4/6": "w-4/6",
  "w-5/6": "w-5/6",
  "w-1/12": "w-1/12",
  "w-2/12": "w-2/12",
  "w-3/12": "w-3/12",
  "w-4/12": "w-4/12",
  "w-5/12": "w-5/12",
  "w-6/12": "w-6/12",
  "w-7/12": "w-7/12",
  "w-8/12": "w-8/12",
  "w-9/12": "w-9/12",
  "w-10/12": "w-10/12",
  "w-11/12": "w-11/12",
  "w-full": "w-full",
  "w-screen": "w-screen",
  "w-svw": "w-svw",
  "w-lvw": "w-lvw",
  "w-dvw": "w-dvw",
  "w-min": "w-min",
  "w-max": "w-max",
  "w-fit": "w-fit",
} as const;

export const heightMap = {
  ...Object.fromEntries(spacingScale.map((s) => [`h-${s}`, `h-${s}`])),
  "h-auto": "h-auto",
  "h-1/2": "h-1/2",
  "h-1/3": "h-1/3",
  "h-2/3": "h-2/3",
  "h-1/4": "h-1/4",
  "h-2/4": "h-2/4",
  "h-3/4": "h-3/4",
  "h-1/5": "h-1/5",
  "h-2/5": "h-2/5",
  "h-3/5": "h-3/5",
  "h-4/5": "h-4/5",
  "h-1/6": "h-1/6",
  "h-2/6": "h-2/6",
  "h-3/6": "h-3/6",
  "h-4/6": "h-4/6",
  "h-5/6": "h-5/6",
  "h-full": "h-full",
  "h-screen": "h-screen",
  "h-svh": "h-svh",
  "h-lvh": "h-lvh",
  "h-dvh": "h-dvh",
  "h-min": "h-min",
  "h-max": "h-max",
  "h-fit": "h-fit",
} as const;

export const minWidthMap = {
  ...Object.fromEntries(spacingScale.map((s) => [`min-w-${s}`, `min-w-${s}`])),
  "min-w-full": "min-w-full",
  "min-w-min": "min-w-min",
  "min-w-max": "min-w-max",
  "min-w-fit": "min-w-fit",
} as const;

export const maxWidthMap = {
  ...Object.fromEntries(spacingScale.map((s) => [`max-w-${s}`, `max-w-${s}`])),
  "max-w-none": "max-w-none",
  "max-w-xs": "max-w-xs",
  "max-w-sm": "max-w-sm",
  "max-w-md": "max-w-md",
  "max-w-lg": "max-w-lg",
  "max-w-xl": "max-w-xl",
  "max-w-2xl": "max-w-2xl",
  "max-w-3xl": "max-w-3xl",
  "max-w-4xl": "max-w-4xl",
  "max-w-5xl": "max-w-5xl",
  "max-w-6xl": "max-w-6xl",
  "max-w-7xl": "max-w-7xl",
  "max-w-full": "max-w-full",
  "max-w-min": "max-w-min",
  "max-w-max": "max-w-max",
  "max-w-fit": "max-w-fit",
  "max-w-prose": "max-w-prose",
  "max-w-screen-sm": "max-w-screen-sm",
  "max-w-screen-md": "max-w-screen-md",
  "max-w-screen-lg": "max-w-screen-lg",
  "max-w-screen-xl": "max-w-screen-xl",
  "max-w-screen-2xl": "max-w-screen-2xl",
} as const;

export const minHeightMap = {
  ...Object.fromEntries(spacingScale.map((s) => [`min-h-${s}`, `min-h-${s}`])),
  "min-h-full": "min-h-full",
  "min-h-screen": "min-h-screen",
  "min-h-svh": "min-h-svh",
  "min-h-lvh": "min-h-lvh",
  "min-h-dvh": "min-h-dvh",
  "min-h-min": "min-h-min",
  "min-h-max": "min-h-max",
  "min-h-fit": "min-h-fit",
} as const;

export const maxHeightMap = {
  ...Object.fromEntries(spacingScale.map((s) => [`max-h-${s}`, `max-h-${s}`])),
  "max-h-none": "max-h-none",
  "max-h-xs": "max-h-[20rem]",
  "max-h-sm": "max-h-[24rem]",
  "max-h-md": "max-h-[28rem]",
  "max-h-lg": "max-h-[32rem]",
  "max-h-xl": "max-h-[36rem]",
  "max-h-2xl": "max-h-[42rem]",
  "max-h-3xl": "max-h-[48rem]",
  "max-h-4xl": "max-h-[56rem]",
  "max-h-5xl": "max-h-[64rem]",
  "max-h-6xl": "max-h-[72rem]",
  "max-h-7xl": "max-h-[80rem]",
  "max-h-full": "max-h-full",
  "max-h-prose": "max-h-[65ch]",
  "max-h-screen-sm": "max-h-[640px]",
  "max-h-screen-md": "max-h-[768px]",
  "max-h-screen-lg": "max-h-[1024px]",
  "max-h-screen-xl": "max-h-[1280px]",
  "max-h-screen-2xl": "max-h-[1536px]",
  "max-h-screen": "max-h-screen",
  "max-h-svh": "max-h-svh",
  "max-h-lvh": "max-h-lvh",
  "max-h-dvh": "max-h-dvh",
  "max-h-min": "max-h-min",
  "max-h-max": "max-h-max",
  "max-h-fit": "max-h-fit",
} as const;

export const paddingMap = {
  ...Object.fromEntries(spacingScale.map((s) => [`p-${s}`, `p-${s}`])),
  ...Object.fromEntries(spacingScale.map((s) => [`px-${s}`, `px-${s}`])),
  ...Object.fromEntries(spacingScale.map((s) => [`py-${s}`, `py-${s}`])),
  ...Object.fromEntries(spacingScale.map((s) => [`pt-${s}`, `pt-${s}`])),
  ...Object.fromEntries(spacingScale.map((s) => [`pr-${s}`, `pr-${s}`])),
  ...Object.fromEntries(spacingScale.map((s) => [`pb-${s}`, `pb-${s}`])),
  ...Object.fromEntries(spacingScale.map((s) => [`pl-${s}`, `pl-${s}`])),
} as const;

export const marginMap = {
  ...Object.fromEntries(spacingScale.map((s) => [`m-${s}`, `m-${s}`])),
  ...Object.fromEntries(spacingScale.map((s) => [`mx-${s}`, `mx-${s}`])),
  ...Object.fromEntries(spacingScale.map((s) => [`my-${s}`, `my-${s}`])),
  ...Object.fromEntries(spacingScale.map((s) => [`mt-${s}`, `mt-${s}`])),
  ...Object.fromEntries(spacingScale.map((s) => [`mr-${s}`, `mr-${s}`])),
  ...Object.fromEntries(spacingScale.map((s) => [`mb-${s}`, `mb-${s}`])),
  ...Object.fromEntries(spacingScale.map((s) => [`ml-${s}`, `ml-${s}`])),
  "m-auto": "m-auto",
  "mx-auto": "mx-auto",
  "my-auto": "my-auto",
} as const;

/** Border sides (multi-select). Tailwind: border = all, border-t/r/b/l = per side. */
export const borderDirectionMap = {
  border: "border",
  "border-t": "border-t",
  "border-r": "border-r",
  "border-b": "border-b",
  "border-l": "border-l",
} as const;

/** Border width. Labels show px (Tailwind: border = 1px, border-2 = 2px, etc.). */
export const borderWidthMap = {
  "border-0": "border-0",
  border: "border",
  "border-2": "border-2",
  "border-4": "border-4",
  "border-8": "border-8",
} as const;

/** Border width in px for option labels. */
export const borderWidthToPx: Record<keyof typeof borderWidthMap, string> = {
  "border-0": "0px",
  border: "1px",
  "border-2": "2px",
  "border-4": "4px",
  "border-8": "8px",
};

/** Width key → suffix for side-specific class (e.g. border-8 → "-8", border → "" for 1px). */
const borderWidthSuffix: Record<keyof typeof borderWidthMap, string> = {
  "border-0": "-0",
  border: "",
  "border-2": "-2",
  "border-4": "-4",
  "border-8": "-8",
};

/**
 * (Direction × width) → Tailwind class. Use this so width applies only to selected sides.
 * Invalid width defaults to 1px so we never output "border-b-undefined".
 * @deprecated Prefer borderClassMap for single multi-select of all border width classes.
 */
export function getBorderClass(
  direction: keyof typeof borderDirectionMap,
  width: keyof typeof borderWidthMap
): string {
  const safeWidth =
    width && width in borderWidthMap
      ? (width as keyof typeof borderWidthMap)
      : "border";
  if (direction === "border") return borderWidthMap[safeWidth];
  const suffix = borderWidthSuffix[safeWidth];
  return direction + suffix;
}

/**
 * All Tailwind border-width classes (all sides, x, y, s, e, t, r, b, l × 0, 1, 2, 4, 8px).
 * Single Border multi-select: each option value is one of these keys; output is the same class.
 */
export const borderClassMap = {
  "border-0": "border-0",
  border: "border",
  "border-2": "border-2",
  "border-4": "border-4",
  "border-8": "border-8",
  "border-x-0": "border-x-0",
  "border-x": "border-x",
  "border-x-2": "border-x-2",
  "border-x-4": "border-x-4",
  "border-x-8": "border-x-8",
  "border-y-0": "border-y-0",
  "border-y": "border-y",
  "border-y-2": "border-y-2",
  "border-y-4": "border-y-4",
  "border-y-8": "border-y-8",
  "border-s-0": "border-s-0",
  "border-s": "border-s",
  "border-s-2": "border-s-2",
  "border-s-4": "border-s-4",
  "border-s-8": "border-s-8",
  "border-e-0": "border-e-0",
  "border-e": "border-e",
  "border-e-2": "border-e-2",
  "border-e-4": "border-e-4",
  "border-e-8": "border-e-8",
  "border-t-0": "border-t-0",
  "border-t": "border-t",
  "border-t-2": "border-t-2",
  "border-t-4": "border-t-4",
  "border-t-8": "border-t-8",
  "border-r-0": "border-r-0",
  "border-r": "border-r",
  "border-r-2": "border-r-2",
  "border-r-4": "border-r-4",
  "border-r-8": "border-r-8",
  "border-b-0": "border-b-0",
  "border-b": "border-b",
  "border-b-2": "border-b-2",
  "border-b-4": "border-b-4",
  "border-b-8": "border-b-8",
  "border-l-0": "border-l-0",
  "border-l": "border-l",
  "border-l-2": "border-l-2",
  "border-l-4": "border-l-4",
  "border-l-8": "border-l-8",
} as const;

/** px value for a border class key (Tailwind: 0, 1, 2, 4, 8px). */
function borderClassPx(key: keyof typeof borderClassMap): string {
  if (key === "border-0" || key.endsWith("-0")) return "0px";
  if (key.endsWith("-2")) return "2px";
  if (key.endsWith("-4")) return "4px";
  if (key.endsWith("-8")) return "8px";
  return "1px";
}

/** Display labels for Border multi-select: [Tailwind class] ([px]), same pattern as other style options. */
export const borderClassLabels: Record<keyof typeof borderClassMap, string> =
  Object.fromEntries(
    (Object.keys(borderClassMap) as (keyof typeof borderClassMap)[]).map(
      (k) => [k, `${k} (${borderClassPx(k)})`]
    )
  ) as Record<keyof typeof borderClassMap, string>;

/** Border color (semantic). */
export const borderColorMap = {
  "border-border": "border-border",
  "border-input": "border-input",
  "border-primary": "border-primary",
  "border-muted": "border-muted",
  "border-destructive": "border-destructive",
  "border-foreground": "border-foreground",
} as const;

/** Border style (solid, dashed, dotted, etc.). */
export const borderStyleMap = {
  "border-solid": "border-solid",
  "border-dashed": "border-dashed",
  "border-dotted": "border-dotted",
  "border-double": "border-double",
  "border-none": "border-none",
} as const;

/** Box shadow (Tailwind default scale). */
export const boxShadowMap = {
  "shadow-none": "shadow-none",
  "shadow-sm": "shadow-sm",
  shadow: "shadow",
  "shadow-md": "shadow-md",
  "shadow-lg": "shadow-lg",
  "shadow-xl": "shadow-xl",
  "shadow-2xl": "shadow-2xl",
  "shadow-inner": "shadow-inner",
} as const;

/**
 * Tailwind variants (modifiers). When set, all utilities in the style block get this prefix.
 * Order in output: breakpoint + variant + utility (e.g. sm:last:border-b).
 */
export const variantMap = {
  none: "",
  last: "last:",
  first: "first:",
  only: "only:",
  odd: "odd:",
  even: "even:",
  hover: "hover:",
  focus: "focus:",
  focus_visible: "focus-visible:",
  group_hover: "group-hover:",
  group_focus: "group-focus:",
} as const;

export type VariantKey = keyof typeof variantMap;

/** Utility class for parent: marks element as group for group-hover/group-focus on children. */
export const GROUP_CLASS = "group";
