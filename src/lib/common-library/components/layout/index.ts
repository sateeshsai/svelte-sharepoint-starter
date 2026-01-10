/**
 * Layout Components
 *
 * Reusable layout primitives for consistent page structure.
 *
 * @example
 * ```svelte
 * <script>
 *   import { Section, SectionHeader } from "$lib/common-library/components/layout";
 * </script>
 *
 * <Section maxWidth="standard" padding="standard">
 *   <SectionHeader variant="page">Page Title</SectionHeader>
 *   <p>Content...</p>
 * </Section>
 * ```
 */

export { default as Section } from "./Section.svelte";
export { default as SectionHeader } from "./SectionHeader.svelte";
