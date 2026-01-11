/**
 * Reusable layout utility classes for consistent spacing and width patterns.
 * Used by Section and SectionHeader components, but can also be used directly with `cn()`.
 *
 * @example
 * ```svelte
 * <main class={cn("grid", SECTION_CLASSES.padding.standard, SECTION_CLASSES.maxWidth.standard)}>
 * ```
 */
export const SECTION_CLASSES = {
  /** Max-width constraints with centering. Use with grid/flex containers. */
  maxWidth: {
    /** 56rem (896px) - Ideal for reading content, forms */
    narrow: "max-w-4xl sm:max-w-4xl justify-self-center w-full",
    /** 80rem (1280px) - Default page content width */
    standard: "max-w-7xl sm:max-w-7xl justify-self-center w-full",
    /** 100% of screen-xl (1280px) - For wider layouts */
    wide: "max-w-screen-xl sm:max-w-screen-xl justify-self-center w-full",
    /** Full viewport width - No constraint */
    full: "w-full sm:max-w-none",
  },
  /** App shell max-width (outermost container). Uses screen-4xl (150rem). */
  appShell: "max-w-screen-4xl mx-auto",
  /** Padding presets with responsive scaling */
  padding: {
    /** Reduced padding for denser layouts */
    compact: "px-4 py-8 md:px-6 lg:py-10",
    /** Default page-level padding */
    standard: "px-6 py-14 lg:py-16 md:px-8",
    /** Horizontal only - for sections within a padded parent */
    horizontal: "px-6 md:px-8",
  },
  /** Common gap patterns for grid/flex layouts */
  gap: {
    sm: "gap-4",
    md: "gap-6 lg:gap-8",
    lg: "gap-8 lg:gap-12",
  },
} as const;

/**
 * Prose/typography presets for markdown and rich text content.
 * Used by the Prose component, but can also be applied directly with `cn()`.
 *
 * @example
 * ```svelte
 * <article class={PROSE_CLASSES.standard}>
 *   {@html markdownContent}
 * </article>
 * ```
 */
export const PROSE_CLASSES = {
  /** Standard prose with dark mode support */
  standard: "prose-sm sm:prose mx-auto dark:prose-invert prose-h1:mt-4",
  /** Prose with styled links (underline, muted decoration) */
  withLinks: "prose-sm sm:prose mx-auto dark:prose-invert prose-a:underline prose-a:decoration-muted-foreground prose-a:decoration-1 prose-a:underline-offset-3",
} as const;

/** Type for prose variants */
export type ProseVariant = keyof typeof PROSE_CLASSES;

/**
 * Heading style presets for consistent typography hierarchy.
 * Used by SectionHeader component, but can also be applied directly.
 *
 * @example
 * ```svelte
 * <h1 class={HEADING_CLASSES.page}>Page Title</h1>
 * ```
 */
export const HEADING_CLASSES = {
  /** Large hero titles - typically h1 on landing pages */
  hero: "text-5xl xl:text-6xl font-thin tracking-tight",
  /** Standard page titles - h1 on list/index pages */
  page: "text-3xl font-light",
  /** Section headings within a page - typically h2 */
  section: "text-xl font-semibold",
  /** Smaller sub-section headings - typically h3 */
  subsection: "font-medium text-sm",
} as const;

/** Variant to default heading level mapping */
export const HEADING_LEVEL_MAP = {
  hero: "h1",
  page: "h1",
  section: "h2",
  subsection: "h3",
} as const;

/** Type for heading variants */
export type HeadingVariant = keyof typeof HEADING_CLASSES;

/** Type for heading HTML elements (h1-h6) */
export type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

/** Type for max-width variants */
export type MaxWidthVariant = keyof typeof SECTION_CLASSES.maxWidth;

/** Type for padding variants */
export type PaddingVariant = keyof typeof SECTION_CLASSES.padding;

/**
 * @deprecated Use SECTION_CLASSES instead. Kept for backward compatibility.
 */
