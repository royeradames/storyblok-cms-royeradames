import { shadcnGridDefinition } from "../../shadcn/Grid.definition";
import { shadcnIconDefinition } from "../../shadcn/Icon.definition";
import { shadcnSectionDefinition } from "../../shadcn/Section.definition";
import { shadcnContainerDefinition } from "../../shadcn/container/Container.definition";
import { stylesOptionsStoryblokDefinition } from "../../styles/styles_options";
import type { StoryblokComponent } from "../types";

export {
  shadcnGridDefinition,
  shadcnIconDefinition,
  shadcnSectionDefinition,
  shadcnContainerDefinition,
  stylesOptionsStoryblokDefinition,
};

export const coLocatedComponentDefinitions = [
  shadcnSectionDefinition,
  shadcnGridDefinition,
  stylesOptionsStoryblokDefinition,
  shadcnContainerDefinition,
  shadcnIconDefinition,
] as const satisfies readonly StoryblokComponent[];

export const coLocatedComponentDefinitionNames = new Set(
  coLocatedComponentDefinitions.map((definition) => definition.name),
);
