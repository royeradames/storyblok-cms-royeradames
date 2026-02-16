type CustomIconOption = {
  value: string;
  name: string;
};

export const customIconOptions = [
  { value: "x-com", name: "x.com (custom)" },
  { value: "frontend-mentor", name: "Frontend Mentor (custom)" },
  { value: "medium", name: "Medium (custom)" },
  { value: "royeradames-com", name: "RoyerAdames.com (custom)" },
] as const satisfies readonly CustomIconOption[];

export type CustomIconName = (typeof customIconOptions)[number]["value"];

const CUSTOM_ICON_NAME_SET: ReadonlySet<string> = new Set(
  customIconOptions.map((icon) => icon.value),
);

export function isCustomIconName(name: string): name is CustomIconName {
  return CUSTOM_ICON_NAME_SET.has(name);
}
