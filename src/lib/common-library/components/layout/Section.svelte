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

  @example Full-bleed background
  ```svelte
  <Section fullBleed background="bg-muted/80 dark:bg-muted/30" maxWidth="standard">
    <h2>Content with full-width background</h2>
  </Section>
  ```

  @example Prose content
  ```svelte
  <Section prose="standard">
    {@html markdownContent}
  </Section>
  ```
-->
<script lang="ts">
  import { cn } from "$lib/utils";
  import { SECTION_CLASSES, type MaxWidthVariant, type PaddingVariant } from "$lib/common-library/utils";
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  type Props = HTMLAttributes<HTMLElement> & {
    /** Max-width constraint. Defaults to "standard" (7xl) */
    maxWidth?: MaxWidthVariant;
    /** Padding preset. Defaults to "standard" */
    padding?: PaddingVariant;
    /** When true, background spans full viewport width with constrained inner content */
    fullBleed?: boolean;
    /** Background classes for the full-bleed wrapper (only used when fullBleed=true) */
    background?: string;
    /** Apply prose/typography classes to content */
    prose?: "standard" | "withLinks" | false;
    /** HTML element to render. Defaults to "section" */
    as?: "section" | "div" | "article" | "main" | "aside";
    /** Additional classes merged with defaults */
    class?: string;
    /** Bindable reference to the outer element (wrapper if fullBleed, otherwise section) */
    node?: HTMLElement;
    children?: Snippet;
  };

  let {
    maxWidth = "standard",
    padding = "standard",
    fullBleed = false,
    background = "",
    prose = false,
    as: Element = "section",
    class: className = "",
    node = $bindable(),
    children,
    ...restProps
  }: Props = $props();

  const innerClasses = $derived(cn(SECTION_CLASSES.maxWidth[maxWidth], SECTION_CLASSES.padding[padding], prose && SECTION_CLASSES.prose[prose], className));
</script>

{#if fullBleed}
  <div bind:this={node} class={cn("w-full", background)}>
    <svelte:element this={Element} class={innerClasses} {...restProps}>
      {#if children}
        {@render children()}
      {/if}
    </svelte:element>
  </div>
{:else}
  <svelte:element this={Element} bind:this={node} class={innerClasses} {...restProps}>
    {#if children}
      {@render children()}
    {/if}
  </svelte:element>
{/if}
