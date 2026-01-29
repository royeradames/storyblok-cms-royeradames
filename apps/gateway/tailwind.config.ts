import type { Config } from "tailwindcss";
import sharedConfig from "@repo/config/tailwind";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
    "../../packages/cms/src/**/*.{js,ts,jsx,tsx}",
  ],
  presets: [sharedConfig as Config],
};

export default config;
