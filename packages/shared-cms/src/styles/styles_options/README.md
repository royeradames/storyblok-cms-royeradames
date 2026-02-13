# styles_options Domain

This folder is the single discovery point for `styles_options` behavior:

- Storyblok schema definition builders (`storyblok-definition.ts`)
- Runtime style maps/types/class builders (`maps.ts`, `types.ts`, `build-style-classes.ts`)
- Tailwind safelist generation and artifact APIs (`safelist.ts`)

Legacy imports in `src/styles/*` are kept for compatibility and should gradually
be replaced with imports from this folder.
