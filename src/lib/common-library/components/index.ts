/**
 * Common Library Components
 *
 * Reusable UI components organized by category.
 *
 * Categories:
 * - `layout/` - Section, SectionHeader
 * - `feedback/` - StatusMessage, ErrorBoundaryMessage
 * - `media/` - FilePreview, FileDropZone, MediaGallery, CropperJsWrapper
 * - `animation/` - LineAnimated
 * - `filters/` - FilterCombobox, ToggleFilters
 * - `icons/` - LightDarkIcon
 * - `branding/` - DeloitteLogo
 * - `dev/` - TailwindViewportHelper
 * - `samples/` - CarouselSample
 *
 * @example
 * ```typescript
 * import { Section, SectionHeader } from "$lib/common-library/components/layout";
 * import { StatusMessage } from "$lib/common-library/components/feedback";
 * import { FilePreview, MediaGallery } from "$lib/common-library/components/media";
 * import { ToggleFilters, type Filter } from "$lib/common-library/components/filters";
 * ```
 */

// Re-export all categories
export * from "./layout";
export * from "./feedback";
export * from "./animation";
export * from "./dev";
export * from "./icons";
export * from "./branding";
export * from "./samples";

// Note: media and filters have their own index files with more complex exports
// Import from their specific paths for full functionality:
// import { ... } from "$lib/common-library/components/media";
// import { ... } from "$lib/common-library/components/filters";
