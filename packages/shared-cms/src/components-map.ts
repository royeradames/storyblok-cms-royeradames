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
import { ShadcnRichText } from "./shadcn/rich-text/RichText";
import { BuilderRichTextInputs } from "./shadcn/BuilderRichTextInputs";
import { ShadcnArticle } from "./shadcn/Article";
import { ShadcnArticleAside } from "./shadcn/ArticleAside";
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
 * Components map for Storyblok initialization.
 *
 * Keep this in a dedicated module so consumers that only need the map
 * can avoid importing the full package barrel.
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
  builder_rich_text_inputs: BuilderRichTextInputs,
  shadcn_article: ShadcnArticle,
  shadcn_article_aside: ShadcnArticleAside,
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
