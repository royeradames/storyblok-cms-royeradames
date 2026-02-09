// Lucide dynamic icon (same as ShadcnIcon uses; for app-level icon by name)
export { DynamicIcon, type IconName } from "lucide-react/dynamic";

// Storyblok default components
export * from "./storyblok";

// Shadcn wrappers
export * from "./shadcn";

// Presets
export * from "./presets";

// Sections (predetermined section components)
export * from "./sections";

// Structure generator (generic template → component tree processor)
export * from "./structure-generator";

// Dev scenario system
export * from "./dev";

// Types
export * from "./types";

// Storyblok default component imports
import { Page } from "./storyblok/Page";
import { Teaser } from "./storyblok/Teaser";
import { Grid } from "./storyblok/Grid";
import { Feature } from "./storyblok/Feature";

// Component imports for the map
import { ShadcnSection } from "./shadcn/Section";
import { ShadcnGrid } from "./shadcn/Grid";
import { ShadcnContainer } from "./shadcn/container/Container";
import { ShadcnText } from "./shadcn/Text";
import { ShadcnRichText } from "./shadcn/RichText";
import { ShadcnArticle } from "./shadcn/Article";
import { ShadcnAlert } from "./shadcn/Alert";
import { ShadcnBadge } from "./shadcn/Badge";
import { ShadcnIcon } from "./shadcn/Icon";
import { ShadcnSeparator } from "./shadcn/Separator";
import { ShadcnAccordion } from "./shadcn/Accordion";
import { ShadcnTabs } from "./shadcn/Tabs";
import { ShadcnBreadcrumb } from "./shadcn/Breadcrumb";
import { ShadcnPagination } from "./shadcn/Pagination";
import { ShadcnAvatar } from "./shadcn/Avatar";
import { ShadcnCarousel } from "./shadcn/Carousel";
import { ShadcnAspectRatio } from "./shadcn/AspectRatio";
import { ShadcnImage } from "./shadcn/Image";
import { ShadcnSkeleton } from "./shadcn/Skeleton";
import { ShadcnButton } from "./shadcn/Button";
import { ShadcnCard } from "./shadcn/Card";
import { ShadcnHero } from "./shadcn/Hero";
import { ShadcnDialog } from "./shadcn/Dialog";
import { ShadcnSheet } from "./shadcn/Sheet";
import { ShadcnDrawer } from "./shadcn/Drawer";
import { ShadcnTooltip } from "./shadcn/Tooltip";
import { ShadcnHoverCard } from "./shadcn/HoverCard";
import { ShadcnPopover } from "./shadcn/Popover";
import { ShadcnCollapsible } from "./shadcn/Collapsible";
import { ShadcnProgress } from "./shadcn/Progress";
import { ShadcnForm } from "./shadcn/Form";
import { ShadcnInput } from "./shadcn/Input";
import { ShadcnTextarea } from "./shadcn/Textarea";
import { ShadcnCheckbox } from "./shadcn/Checkbox";
import { ShadcnSwitch } from "./shadcn/Switch";
import { ShadcnRadioGroup } from "./shadcn/RadioGroup";
import { ShadcnSelect } from "./shadcn/Select";
import { ShadcnSlider } from "./shadcn/Slider";
import { ShadcnTable } from "./shadcn/Table";
import { PresetHeroDefault } from "./presets/HeroDefault";
// CaseStudies2Section removed – now handled by generic PremadeSectionWrapper in gateway
import { DevScenarioPicker } from "./dev/ScenarioPicker";

/**
 * Components map for Storyblok initialization
 *
 * Usage:
 * ```ts
 * import { components } from "@repo/shared-cms";
 *
 * storyblokInit({
 *   accessToken: "...",
 *   components,
 * });
 * ```
 *
 * Storyblok Block Naming Convention:
 * - All shadcn components use prefix: shadcn_
 * - All preset components use prefix: preset_
 * - All dev components use prefix: dev_
 */
export const components = {
  // === Storyblok Defaults ===
  page: Page,
  teaser: Teaser,
  grid: Grid,
  feature: Feature,

  // === Layout ===
  shadcn_section: ShadcnSection,
  shadcn_grid: ShadcnGrid,
  shadcn_container: ShadcnContainer,

  // === Typography & Content ===
  shadcn_text: ShadcnText,
  shadcn_rich_text: ShadcnRichText,
  shadcn_article: ShadcnArticle,
  shadcn_alert: ShadcnAlert,
  shadcn_badge: ShadcnBadge,
  shadcn_icon: ShadcnIcon,
  shadcn_separator: ShadcnSeparator,

  // === Navigation ===
  shadcn_accordion: ShadcnAccordion,
  shadcn_tabs: ShadcnTabs,
  shadcn_breadcrumb: ShadcnBreadcrumb,
  shadcn_pagination: ShadcnPagination,

  // === Media ===
  shadcn_avatar: ShadcnAvatar,
  shadcn_carousel: ShadcnCarousel,
  shadcn_aspect_ratio: ShadcnAspectRatio,
  shadcn_image: ShadcnImage,
  shadcn_skeleton: ShadcnSkeleton,

  // === Interactive / Overlays ===
  shadcn_button: ShadcnButton,
  shadcn_card: ShadcnCard,
  shadcn_hero: ShadcnHero,
  shadcn_dialog: ShadcnDialog,
  shadcn_sheet: ShadcnSheet,
  shadcn_drawer: ShadcnDrawer,
  shadcn_tooltip: ShadcnTooltip,
  shadcn_hover_card: ShadcnHoverCard,
  shadcn_popover: ShadcnPopover,
  shadcn_collapsible: ShadcnCollapsible,
  shadcn_progress: ShadcnProgress,

  // === Form Elements ===
  shadcn_form: ShadcnForm,
  shadcn_input: ShadcnInput,
  shadcn_textarea: ShadcnTextarea,
  shadcn_checkbox: ShadcnCheckbox,
  shadcn_switch: ShadcnSwitch,
  shadcn_radio_group: ShadcnRadioGroup,
  shadcn_select: ShadcnSelect,
  shadcn_slider: ShadcnSlider,
  shadcn_table: ShadcnTable,

  // === Presets ===
  preset_hero_default: PresetHeroDefault,

  // === Dev Components ===
  dev_scenario_picker: DevScenarioPicker,
};

export type ComponentKeys = keyof typeof components;
