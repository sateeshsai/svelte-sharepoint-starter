<!--
  @component Section
  Flexible container component for page sections with consistent spacing and width constraints.
  Supports full-bleed backgrounds with constrained inner content.

  @example Basic usage
  ```svelte
  <Section maxWidth="standard" padding="standard">
    <h1>Page content</h1>
  </Section>
  ```

  @example With prose variant for markdown content
  ```svelte
  <Section prose="standard">
    {@html markdownContent}
  </Section>
  ```

  @example Prose with links variant
  ```svelte
  <Section prose="withLinks" padding="compact">
    {@html blogPost}
  </Section>
  ```
-->
<script lang="ts">
  import { cn } from "$lib/utils";
  import { SECTION_CLASSES, PROSE_CLASSES, type MaxWidthVariant, type PaddingVariant, type ProseVariant } from "$lib/common-library/utils";
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  type Props = HTMLAttributes<HTMLElement> & {
    /** Max-width constraint. Defaults to "standard" (7xl) */
    maxWidth?: MaxWidthVariant;
    /** Padding preset. Defaults to "standard" */
    padding?: PaddingVariant;
    /** Prose variant for markdown/rich text content. When set, applies Tailwind Typography classes. */
    prose?: ProseVariant;
    /** HTML element to render. Defaults to "section" */
    as?: "section" | "div" | "article" | "main" | "aside";
    /** Additional classes merged with defaults */
    class?: string;
    /** Bindable reference to the outer element (wrapper if fullBleedBg, otherwise section) */
    node?: HTMLElement;
    children?: Snippet;
  };

  let { maxWidth = "standard", padding = "standard", prose, as: Element = "section", class: className = "", node = $bindable(), children, ...restProps }: Props = $props();

  const innerClasses = $derived(cn(prose && PROSE_CLASSES[prose], SECTION_CLASSES.maxWidth[maxWidth], SECTION_CLASSES.padding[padding], className));
</script>

<svelte:element this={Element} bind:this={node} class={innerClasses} {...restProps}>
  {#if children}
    {@render children()}
  {/if}
</svelte:element>
