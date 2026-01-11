/**
 * Layout Components
 *
 * Reusable layout primitives for consistent page structure.
 *
 * @example
 * ```svelte
 * <script>
 *   import { Section, SectionHeader, Prose } from "$lib/common-library/components/layout";
 * </script>
 *
 * <Section maxWidth="standard" padding="standard">
 *   <SectionHeader variant="page">Page Title</SectionHeader>
 *   <Prose>{@html markdownContent}</Prose>
 * </Section>
 * ```
 */

export { default as Section } from "./Section.svelte";
export { default as SectionHeader } from "./SectionHeader.svelte";
export { default as Prose } from "./Prose.svelte";
export { default as BreadCrumbs, type BreadcrumbItem } from "./BreadCrumbs.svelte";
