<!--
  @component Prose
  Typography container for markdown and rich text content with consistent styling.
  Wraps content with Tailwind Typography (prose) classes and dark mode support.

  @example Basic usage
  ```svelte
  <Prose>
    {@html markdownContent}
  </Prose>
  ```

  @example With links variant
  ```svelte
  <Prose variant="withLinks">
    <p>Check out <a href="/docs">the docs</a> for more info.</p>
  </Prose>
  ```

  @example As article element with custom classes
  ```svelte
  <Prose as="article" class="max-w-3xl mt-8">
    {@html blogPost}
  </Prose>
  ```
-->
<script lang="ts">
  import { cn } from "$lib/utils";
  import { PROSE_CLASSES, type ProseVariant } from "$lib/common-library/utils";
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  type Props = HTMLAttributes<HTMLElement> & {
    /** Prose variant. Defaults to "standard" */
    variant?: ProseVariant;
    /** HTML element to render. Defaults to "div" */
    as?: "div" | "article" | "section" | "main" | "aside";
    /** Additional classes merged with defaults */
    class?: string;
    children?: Snippet;
  };

  let {
    variant = "standard",
    as: Element = "div",
    class: className = "",
    children,
    ...restProps
  }: Props = $props();

  const proseClasses = $derived(cn(PROSE_CLASSES[variant], className));
</script>

<svelte:element this={Element} class={proseClasses} {...restProps}>
  {#if children}
    {@render children()}
  {/if}
</svelte:element>
