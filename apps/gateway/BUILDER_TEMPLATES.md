# Builder Template Artifacts

Builder templates are stored as repo-managed generated artifacts.

## Source of truth

- Runtime hydrator registry uses `packages/shared-cms/src/builder-templates/generated/template-hydrator-registry.ts`.
- Per-template JSON snapshots are stored in `packages/shared-cms/src/builder-templates/generated/builder-templates/`.
- Per-template generated hydrator functions are stored in `packages/shared-cms/src/builder-templates/generated/hydrators/`.
- Postgres `section_templates` is deprecated for template runtime storage.

## Workflow

1. Edit builder stories in Storyblok (`section-builder/*`, `element-builder/*`, `form-builder/*`).
2. Generate template artifacts:
   - `cd packages/shared-cms && bun run storyblok:seed:templates`
3. Review generated diffs under `packages/shared-cms/src/builder-templates/generated/`.
4. Commit, open PR, and deploy.

## Runtime behavior

- `TemplateProvider` surfaces generated hydrator metadata for UI status.
- `PremadeSection` dispatches to generated per-template hydrator functions.
- Generated hydrators are self-contained TS logic (no shared compiled-template interpreter import).
- If artifacts are missing/outdated, the UI shows guidance to regenerate and commit templates.

## Webhook behavior

`/api/storyblok-webhook` still handles schema derivation and Storyblok component updates, but no longer writes templates to DB.

When a published story changes template content, webhook responses indicate:

- template sync is required
- next step is to run `storyblok:seed:templates` in `packages/shared-cms`, commit artifacts, and deploy
